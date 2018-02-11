import { Collection, ModelFactory } from "@maxxton/microdocs-core";
import * as Express from "express";
import * as winston from "winston";

const basePath = "/api/v2";

export function generateApiRoutes(express: Express.Application, modelFactory: ModelFactory) {

  modelFactory.getCollections().forEach(collection => {

    winston.info(`Endpoint ${collection.name} ${getPath(collection)}`);

    express.get(`${getPath(collection)}`,
      (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
        let pageSize = req.query.page_size || 50;
        let page = req.query.page || 0;
        let searchOptions: any = {
          include_docs: true,
          limit: pageSize,
          skip: page * pageSize
        };

        if (req.params && Object.keys(req.params).length > 0) {
          searchOptions.selector = req.params;
        }

        collection.db.find(searchOptions).then((docs: any) => {
          res.json({
            page,
            pageSize,
            total: Math.ceil(docs.total_rows / pageSize),
            items: docs.rows.map(row => row.doc)
          });
        }).catch(next);
      });

    express.post(`${getPath(collection)}`,
      (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
        let body = { ...req.body, ...req.params };

        collection.db.post(body).then(postResponse => {
          collection.db.get(postResponse.id).then(getResponse => {
            res.json(getResponse);
          }).catch(e => {
            winston.error(e);
            next(e);
          });
        }).catch(e => {
          winston.error(e);
          next(e);
        });

      });

    express.get(`${getPath(collection)}/:_id`,
      (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {

        let searchOptions = {
          selector: req.params
        };

        collection.db.find(searchOptions).then(getResponse => {
          res.json(getResponse);
        }).catch(e => {
          winston.error(e);
          next(e);
        });

      });

    express.put(`${getPath(collection)}/:_id`,
      (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
        let body = { ...req.body, ...req.params };

        collection.db.put(body).then(postResponse => {
          collection.db.get(postResponse.id).then(getResponse => {
            res.json(getResponse);
          }).catch(e => {
            winston.error(e);
            next(e);
          });
        }).catch(e => {
          winston.error(e);
          next(e);
        });

      });

  });

}

function getPath(collection: Collection<any>): string {
  if (collection.parent) {
    let parentPath = getPath(collection.parent);
    let idName = collection.parent.name.substring(0, collection.parent.name.length - 1) + "Id";
    return `${parentPath}/:${idName}/${collection.name}`;
  } else {
    return `${basePath}/${collection.name}`;
  }
}
