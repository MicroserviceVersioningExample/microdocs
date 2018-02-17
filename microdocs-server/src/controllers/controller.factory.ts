import * as Express from "express";
import * as winston from "winston";
import { getPath } from "../helpers/model.helper";
import { CollectionModel } from "../models/collection.model";
import { SearchOptions } from "../models/search-options.model";

const basePath = "/api/v2";

export function createController(express: Express.Application, collection: CollectionModel) {

  winston.info(`Endpoint ${collection.name} ${getPath(basePath, collection)}`);

  express.get(`${getPath(basePath, collection)}`,
    (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
      // Define search options
      let pageSize = req.query.page_size || 50;
      let page = req.query.page || 0;
      let searchOptions: SearchOptions = {
        size: pageSize,
        page,
        selector: {}
      };
      if (req.params && Object.keys(req.params).length > 0) {
        searchOptions.selector = req.params;
      }

      if (req.query.watch) {
        let sendHeaders = false;
        collection.service.watch(searchOptions).subscribe(result => {
          if (!sendHeaders) {
            res
              .header("content-type", "application/json")
              .status(200);
            sendHeaders = true;
          }
          res.write(JSON.stringify(result));
        }, error => {
          next(error);
        }, () => {
          res.end();
        });
      } else {
        let sendHeaders = false;
        collection.service.getCount(searchOptions).subscribe(count => {
          collection.service.getAll(searchOptions).subscribe(result => {
            if (!sendHeaders) {
              res
                .header("content-type", "application/json")
                .status(200);
              res.write("{");
              res.write("\"page\":" + page + ",");
              res.write("\"pageSize\":" + pageSize + ",");
              res.write("\"totalPages\":" + (count / pageSize) + ",");
              res.write("\"total\":" + count + ",");
              res.write("\"items\":[");
              sendHeaders = true;
            }
            res.write(JSON.stringify(result));
          }, error => {
            next(error);
          }, () => {
            res.write("]}");
            res.end();
          });
        }, error => {
          next(error);
        });
      }
    });

  express.post(`${getPath(basePath, collection)}`,
    (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
      let body = { ...req.body, ...req.params };

      collection.service.create(body).subscribe(result => {
        res.json(result);
      }, error => {
        next(error);
      });

    });

  express.get(`${getPath(basePath, collection)}/:_id`,
    (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {

      let searchOptions = {
        selector: req.params
      };

      collection.service.getOne(searchOptions).subscribe(result => {
        if (result) {
          res.json(result);
        } else {
          next();
        }
      }, error => {
        next(error);
      });

    });

  express.put(`${getPath(basePath, collection)}/:_id`,
    (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
      let body = { ...req.body, ...req.params };

      collection.service.update(body).subscribe(result => {
        res.json(result);
      }, error => {
        next(error);
      });

    });

}
