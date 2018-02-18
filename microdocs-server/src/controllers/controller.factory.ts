import * as Express from "express";
import * as winston from "winston";
import {getPath} from "../helpers/model.helper";
import {CollectionModel} from "../models/collection.model";
import {SearchOptions} from "../models/search-options.model";

const basePath = "/api/v2";

export function createController(express: Express.Application, collection: CollectionModel) {
  
  winston.info(`Endpoint ${collection.name} ${getPath(basePath, collection)}`);
  
  express.get(`${getPath(basePath, collection)}`,
    (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
      // Define search options
      let pageSize = parseInt(req.query.size || 50);
      let page = req.query.page || 1;
      let searchOptions: SearchOptions = {
        size: pageSize,
        page,
        selector: {}
      };
      if (req.params && Object.keys(req.params).length > 0) {
        searchOptions.selector = req.params;
      }
      
      if (req.query["watch"] !== undefined) {
        let sendHeaders = false;
        let sendError = false;
        collection.service.watch(searchOptions).subscribe(result => {
          if (!sendHeaders) {
            res
              .header("content-type", "application/json")
              .status(200);
            sendHeaders = true;
          }
          res.write(JSON.stringify(result));
          res.write("\n");
        }, error => {
          sendError = true;
          if (error.status === 404) {
            next();
          } else {
            next(error);
          }
        }, () => {
          if (!sendHeaders && !sendError) {
            res
              .header("content-type", "application/json")
              .status(200);
            sendHeaders = true;
          }
          res.end();
        });
      } else {
        let sendHeaders = false;
        let sendError = false;
        collection.service.getCount(searchOptions).then(count => {
          collection.service.getAll(searchOptions).subscribe(result => {
            if (!sendHeaders) {
              res
                .header("content-type", "application/json")
                .status(200);
              res.write("{");
              res.write("\"page\":" + page + ",");
              res.write("\"pageSize\":" + pageSize + ",");
              res.write("\"totalPages\":" + Math.ceil(count / pageSize) + ",");
              res.write("\"total\":" + count + ",");
              res.write("\"items\":[");
              sendHeaders = true;
            } else {
              res.write(",");
            }
            res.write(JSON.stringify(result));
          }, error => {
            sendError = true;
            if (error.status === 404) {
              next();
            } else {
              next(error);
            }
          }, () => {
            if (!sendHeaders && !sendError) {
              res
                .header("content-type", "application/json")
                .status(200);
              res.write("{");
              res.write("\"page\":" + page + ",");
              res.write("\"pageSize\":" + pageSize + ",");
              res.write("\"totalPages\":" + Math.ceil(count / pageSize) + ",");
              res.write("\"total\":" + count + ",");
              res.write("\"items\":[");
              sendHeaders = true;
            }
            res.write("]}");
            res.end();
          });
        }).catch(error => {
          next(error);
        });
      }
    });
  
  express.post(`${getPath(basePath, collection)}`,
    (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
      let body = {...req.body, ...req.params};
      
      collection.service.create(body).then(result => {
        res.json(result);
      }).catch(error => {
        next(error);
      });
    });
  
  express.get(`${getPath(basePath, collection)}/:_id`,
    (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
      
      let searchOptions = {
        selector: {_id: req.params}
      };
      
      collection.service.getOne(searchOptions).then(result => {
        if (result) {
          res.json(result);
        } else {
          next();
        }
      }).catch(error => {
        next(error);
      });
      
    });
  
  express.put(`${getPath(basePath, collection)}/:_id`,
    (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
      let body = {...req.body, ...req.params};
      
      collection.service.update(body).then(result => {
        res.json(result);
      }).catch(error => {
        next(error);
      });
      
    });
  
  express.delete(`${getPath(basePath, collection)}/:_id`,
    (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
      
      let searchOptions = {
        selector: {_id: req.params}
      };
      
      collection.service.delete(searchOptions).then(result => {
        if (result) {
          res.status(204);
        } else {
          next();
        }
      }).catch(error => {
        next(error);
      });
      
    });
  
  express.all(`${getPath(basePath, collection)}`,
    (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
      methodNotAllowed(["GET", "POST"], req, res, next);
    });
  
  express.all(`${getPath(basePath, collection)}/:_id`,
    (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
      methodNotAllowed(["GET", "PUT", "DELETE"], req, res, next);
    });
  
}

function methodNotAllowed(methods: string[], req: Express.Request, res: Express.Response, next: Express.NextFunction) {
  if (methods.indexOf(req.method.toUpperCase()) > -1) {
    next();
  } else {
    let error: any = new Error("Method not allowed");
    try {
      error.status = 405;
      error.allowedMethods = methods;
      throw error;
    } catch (e) {
      next(e);
    }
  }
}
