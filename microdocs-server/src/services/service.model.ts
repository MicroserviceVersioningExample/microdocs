import {validate} from "jsonschema";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import {getIndexFields} from "../helpers/model.helper";
import {CollectionModel} from "../models/collection.model";
import {SearchOptions} from "../models/search-options.model";

export class Service<T extends any> {
  
  constructor(private collection: CollectionModel) {
    collection.service = this;
  }
  
  /**
   * Count matching results
   * @param {SearchOptions} searchOptions
   * @returns {Promise<number>}
   */
  public getCount(searchOptions: SearchOptions): Promise<number> {
    return this.collection.db.find(searchOptions.selector)
      .count();
  }
  
  /**
   * Get all items as stream
   * @param {SearchOptions} searchOptions
   * @returns {Observable<T>}
   */
  public getAll(searchOptions: SearchOptions): Observable<T> {
    let options: SearchOptions = {
      page: 1,
      size: 50,
      ...searchOptions
    };
    let stream = new Subject<T>();
    try {
      this.checkParents(searchOptions).then(parent => {
        this.collection.db.find(options.selector)
          .skip((options.page - 1) * options.size)
          .limit(options.size)
          .forEach(item => {
            stream.next(this.mapModel(item));
          }, (error?: any) => {
            if (error) {
              stream.error(error);
            } else {
              stream.complete();
            }
          });
      }).catch(error => {
        stream.error(error);
      });
    } catch (e) {
      stream.error(e);
    }
    return stream;
  }
  
  /**
   * Watch all items for changes
   * @param {SearchOptions} searchOptions
   * @returns {Observable<T>}
   */
  public watch(searchOptions: SearchOptions): Observable<T> {
    let stream = new Subject<T>();
    try {
      this.checkParents(searchOptions).then(parent => {
        let selector = searchOptions.selector;
        let pipelines = [];
        if (selector && Object.keys(selector).length > 0) {
          pipelines.push({
            $match: {
              _id: selector
            }
          });
        }
        let changeStream = this.collection.db.watch(pipelines, {fullDocument: "updateLookup"});
        changeStream.hasNext()
          .then(hasNext => {
            if (hasNext) {
              changeStream.next()
                .then((event) => {
                  stream.next({
                    type: event.operationType,
                    fullDocument: this.mapModel(event.fullDocument)
                  } as any);
                }).catch(e => {
                stream.error(e);
              });
            } else {
              changeStream.close();
              stream.complete();
            }
          }).catch(e => {
          stream.error(e);
        });
      }).catch(error => {
        stream.error(error);
      });
      
    } catch (e) {
      stream.error(e);
    }
    
    return stream;
  }
  
  /**
   * Get single item
   * @param {SearchOptions} searchOptions
   * @returns {Observable<T>}
   */
  public async getOne(searchOptions: SearchOptions): Promise<T> {
    let item = await this.collection.db.findOne(searchOptions.selector);
    if (item) {
      return this.mapModel(item);
    } else {
      await this.checkParents({selector: searchOptions.selector._id});
      return null;
    }
  }
  
  /**
   * Create model
   * @param {T} model
   * @returns {Promise<T>}
   */
  public async create(model: T): Promise<T | null> {
    // Validate
    if (this.collection.schema) {
      let result = validate(model, this.collection.schema);
      if (!result.valid) {
        let name = this.collection.name.substring(0, this.collection.name.length - 1);
        let error: any = new Error(`${name} not valid`);
        error.errors = result.errors;
        error.status = 400;
        throw error;
      }
    }
    
    // Create query selector
    let indexFields = getIndexFields(this.collection);
    let composedId: { [key: string]: any } = {};
    indexFields.forEach(field => {
      let value = model[field];
      delete model[field];
      if (!value) {
        throw new Error("Field '" + value + "' is empty");
      }
      composedId[field] = value;
    });
    composedId._id = model._id;
    model._id = composedId;
    
    await this.checkParents({selector: composedId});
    let next = await this.getOne({selector: {_id: composedId}});
    if (next) {
      let name = this.collection.name.substring(0, this.collection.name.length - 1);
      let message = `${name} ${composedId._id} already exists`;
      let error: any = new Error(message);
      error.status = 400;
      error.errors = [{
        message,
        property: "_id"
      }];
      throw error;
    } else {
      await this.collection.db.insertOne(model);
      return this.mapModel(model);
    }
  }
  
  /**
   * Insert or update existing model
   * @param {T} model
   * @returns {Promise}
   */
  public async update(model: T): Promise<T> {
    // Validate
    if (this.collection.schema) {
      let result = validate(model, this.collection.schema);
      if (!result.valid) {
        let name = this.collection.name.substring(0, this.collection.name.length - 1);
        let error: any = new Error(`${name} not valid`);
        error.errors = result.errors;
        error.status = 400;
        throw error;
      }
    }
    
    // Create query selector
    let indexFields = getIndexFields(this.collection);
    let composedId: { [key: string]: any } = {};
    indexFields.forEach(field => {
      let value = model[field];
      delete model[field];
      if (!value) {
        throw new Error("Field '" + value + "' is empty");
      }
      composedId[field] = value;
    });
    composedId._id = model._id;
    model._id = composedId;
    
    await this.checkParents({selector: composedId});
    await this.collection.db.replaceOne({_id: composedId}, model, {upsert: true});
    return this.mapModel(model);
  }
  
  /**
   * Delete model
   * @param {SearchOptions} searchOptions
   * @returns {Promise<boolean>}
   */
  public async delete(searchOptions: SearchOptions): Promise<boolean> {
    // Create query selector
    let indexFields = getIndexFields(this.collection);
    let composedId: { [key: string]: any } = {};
    indexFields.forEach(field => {
      let value = searchOptions.selector[field];
      if (!value) {
        throw new Error("Field '" + value + "' is empty");
      }
      composedId[field] = value;
    });
    composedId._id = searchOptions.selector._id;
    
    let result = await this.collection.db.deleteOne(composedId);
    if (result.deletedCount > 0) {
      // Something is deleted, so ok
      return true;
    } else {
      // Check if parents existed
      await this.checkParents(searchOptions);
      return true;
    }
  }
  
  /**
   * Check if first parent exists
   * @param {SearchOptions} searchOptions
   * @param parent
   * @return {Promise<boolean>}
   */
  public checkParent(searchOptions: SearchOptions, parent?: CollectionModel): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      try {
        let p = parent || this.collection.parent;
        if (p) {
          let name = p.name;
          let options = {...searchOptions};
          let fields = getIndexFields(p);
          let parentOptions = {};
          fields.map(field => {
            if (field === name + "Id") {
              return "_id";
            }
            return field;
          }).forEach(field => {
            parentOptions[field] = options.selector[field];
          });
          p.service.getOne({selector: parentOptions}).then(result => {
            if (result) {
              resolve(true);
            } else {
              let error: any = new Error(
                `${name.substring(0, name.length - 1)} ${parentOptions["_id"]} doesn't exists`);
              error.status = 404;
              reject(error);
            }
          }).catch(error => {
            reject(error);
          });
        } else {
          resolve(false);
        }
      } catch (e) {
        reject(e);
      }
    });
  }
  
  /**
   * Check if all parents exists
   * @param {SearchOptions} searchOptions
   * @return {Promise<boolean>}
   */
  public checkParents(searchOptions: SearchOptions): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      try {
        this.checkParent(searchOptions).then(result => {
          if (this.collection.parent) {
            this.collection.parent.service.checkParents(searchOptions).then(result2 => {
              resolve(true);
            }).catch(e => {
              reject(e);
            });
          } else {
            resolve(false);
          }
        }).catch(e => {
          reject(e);
        });
      } catch (e) {
        reject(e);
      }
    });
  }
  
  private mapModel(model: T): T {
    if (model) {
      Object.keys(model._id).map(field => {
        return {key: field, value: model._id[field]};
      }).forEach(fieldSet => model[fieldSet.key] = fieldSet.value);
    }
    return model;
  }
  
}
