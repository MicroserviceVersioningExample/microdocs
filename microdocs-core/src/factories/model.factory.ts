import * as Validator from "jsonschema";
import * as PouchDB from "pouchdb";
import * as winston from "winston";
import { Sanitizer } from "../models/sanitizer";

export class ModelFactory {

  private readonly options: FactoryOptions;
  private readonly pouchDB: any;
  private readonly collections: { [name: string]: Collection<any> } = {};
  private readonly schemas: { [name: string]: Validator.Schema } = {};
  private readonly sanitizers: { [name: string]: Sanitizer<any> } = {};
  private readonly postUpdateHooks: { [name: string]: ((doc?: any) => Promise<void>) } = {};

  constructor(pouchDB?: any, options?: FactoryOptions) {
    this.options = options;
    this.registerPouchDBPlugins(pouchDB);
    if (options && options.remoteReplicaDatabase) {
      this.registerPouchDBPlugins(options.remoteReplicaDatabase);
    }
    this.pouchDB = pouchDB;
  }

  public createCollection<Model>(collectionName: string, options?: ModelFactoryOptions): PouchDB.Database<Model> {
    let name = collectionName.toLowerCase();
    let database;
    // tslint:disable-next-line
    if (this.options && this.options.remoteURL && !this.options.remoteReplicaDatabase) {
      database = new this.pouchDB(this.options.remoteURL + "/" + name);
    } else {
      database = new this.pouchDB(name);
    }
    let remoteDB: PouchDB.Database<Model>;
    if (this.options && this.options.remoteURL && this.options.remoteReplicaDatabase) {
      winston.info(`replica database: ${name} to ${this.options.remoteURL}/${name}`);
      remoteDB = this.options.remoteReplicaDatabase(this.options.remoteURL + "/" + name);
      database.sync(remoteDB, { live: true, retry: true })
        .on("change", info => {
          winston.warn(`Sync changed ${this.options.remoteURL}/${name}`);
        })
        .on("paused", info => {
          winston.warn(`Sync paused ${this.options.remoteURL}/${name}`);
        })
        .on("active", info => {
          winston.info(`Connected with ${this.options.remoteURL}/${name}`);
        })
        .on("error", err => {
          winston.error(`Error with sync ${this.options.remoteURL}/${name}: `, err.code || err);
        });
    }
    let parentCollection;
    if (options && options.parentModel) {
      parentCollection = this.getCollection(options.parentModel);
      if (!parentCollection) {
        throw new Error(`Parent collection ${options.parentModel} doesn't exists`);
      }
    }
    let collection: Collection<any> = {
      name,
      db: database,
      remoteDB,
      options,
      parent: parentCollection
    };
    this.collections[collectionName.toLowerCase()] = collection;

    // Create index
    let indexFields = this.getIndexFields(collection);
    collection.indexFields = indexFields;
    if (indexFields.length > 0) {
      database.createIndex({
        index: {
          fields: indexFields
        }
      });
    }

    if (options) {
      if (options.schema) {
        this.schemas[collectionName.toLowerCase()] = options.schema;
      }
      if (options.sanitizer) {
        this.sanitizers[collectionName.toLowerCase()] = options.sanitizer;
      }
      if (options.postUpdateHook) {
        this.postUpdateHooks[collectionName.toLowerCase()] = options.postUpdateHook;
      }
    }
    return database;
  }

  public getCollection<Model>(collectionName: string): Collection<Model> | null {
    return this.collections[collectionName.toLowerCase()] || null;
  }

  public getCollections(): Array<Collection<any>> {
    return Object.keys(this.collections).map(name => this.collections[name]);
  }

  public getSchema(collectionName: string): Validator.Schema | null {
    return this.schemas[collectionName.toLowerCase()] || null;
  }

  private registerPouchDBPlugins(pouchDB: any) {
    const pouchBulkDocs = pouchDB.prototype.bulkDocs;
    // tslint:disable-next-line
    let __this: any = this;
    pouchDB.plugin({
      bulkDocs(body, options, callback) {
        if (typeof options === "function") {
          callback = options;
          options = {};
        }
        let docs = Array.isArray(body) ? body : body.docs;

        let segments = this.name.split("/");
        let name = segments[segments.length - 1];
        let schema = __this.schemas[name];
        let sanitizer = __this.sanitizers[name];
        let postUpdateHook = __this.postUpdateHooks[name];

        if (sanitizer) {
          for (let doc of docs) {
            sanitizer.sanitize(doc);
          }
        }

        if (schema) {
          for (let doc of docs) {
            try {
              Validator.validate(doc, schema, {
                throwError: true
              });
            } catch (e) {
              return callback(e);
            }
          }
        }

        let promises = [];
        if (postUpdateHook) {
          promises = docs.map(doc => (doc) => postUpdateHook.call(this, doc));
        }

        Promise.all(promises)
          .then(() => {
            pouchBulkDocs.call(this, body, options, callback);
          })
          .catch(e => {
            return callback(e);
          });
      }
    } as any);
  }

  /**
   * Get index fields of a collection
   * @param {Collection<any>} collection
   * @returns {string[]}
   */
  private getIndexFields(collection: Collection<any>): string[] {
    if (collection.parent) {
      let fields = this.getIndexFields(collection.parent);
      let idName = collection.parent.name.substring(0, collection.parent.name.length - 1) + "Id";
      fields.push(idName);
      return fields;
    } else {
      return [];
    }
  }

}

export interface ModelFactoryOptions {

  schema?: Validator.Schema;
  parentModel?: string;
  sanitizer?: Sanitizer<any>;
  postUpdateHook?: ((doc?: any) => Promise<void>);

}

export interface FactoryOptions {

  remoteReplicaDatabase?: any;
  remoteURL?: any;
  parentModel?: string;

}

export interface Collection<Model> {

  name: string;
  db: PouchDB.Database<Model>;
  remoteDB: PouchDB.Database<Model>;
  options: ModelFactoryOptions;
  parent?: Collection<any>;
  indexFields?: string[];

}
