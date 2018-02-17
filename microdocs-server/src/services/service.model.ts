import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { getIndexFields } from "../helpers/model.helper";
import { CollectionModel } from "../models/collection.model";
import { SearchOptions } from "../models/search-options.model";

export class Service<T extends any> {

  constructor(private collection: CollectionModel) {
    collection.service = this;
  }

  /**
   * Count matching results
   * @param {SearchOptions} searchOptions
   * @returns {Observable<number>}
   */
  public getCount(searchOptions: SearchOptions): Observable<number> {
    let stream = new Subject<number>();
    try {
      this.collection.db.find(searchOptions.selector)
        .count()
        .then(count => {
          stream.next(count);
          stream.complete();
        }).catch(e => {
        stream.error(e);
      });
    } catch (e) {
      stream.error(e);
    }
    return stream;
  }

  /**
   * Get all items as stream
   * @param {SearchOptions} searchOptions
   * @returns {Observable<T>}
   */
  public getAll(searchOptions: SearchOptions): Observable<T> {
    let options: SearchOptions = {
      page: 0,
      size: 50,
      ...searchOptions
    };
    let stream = new Subject<T>();
    try {
      this.collection.db.find(options.selector)
        .skip(options.page * options.size)
        .limit(options.size)
        .forEach(item => {
          stream.next(item);
        }, (error?: any) => {
          if (error) {
            stream.error(error);
          } else {
            stream.complete();
          }
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
      let changeStream = this.collection.db.watch([], { fullDocument: "updateLookup" });
      changeStream.hasNext()
        .then(hasNext => {
          if (hasNext) {
            changeStream.next()
              .then((event) => {
                stream.next({
                  type: event.operationType,
                  fullDocument: event.fullDocument
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
  public getOne(searchOptions: SearchOptions): Observable<T> {
    let stream = new Subject<T>();
    try {
      this.collection.db.findOne(searchOptions.selector)
        .then(item => {
          stream.next(item);
        })
        .catch(e => {
          stream.error(e);
        });
    } catch (e) {
      stream.error(e);
    }
    return stream;
  }

  /**
   * Create model
   * @param {T} model
   * @returns {Observable<T>}
   */
  public create(model: T): Observable<T> {
    let stream = new Subject<T>();
    try {
      // Create query selector
      let indexFields = getIndexFields(this.collection);
      let selector: { [key: string]: any } = {};
      let composedId: { [key: string]: any } = {};
      indexFields.forEach(field => {
        let value = model[field];
        if (!value) {
          throw new Error("Field '" + value + "' is empty");
        }
        selector["_id." + field] = value;
        composedId[field] = value;
      });
      selector["_id.id"] = model._id;
      composedId._id = model._id;
      model._id = composedId;

      this.getOne({ selector }).subscribe(next => {
        if (next) {
          stream.next(null);
          stream.complete();
        } else {
          this.collection.db.insertOne(model)
            .then(result => {
              stream.next(model);
              stream.complete();
            }).catch(e => {
            stream.error(e);
          });
        }
      }, error => {
        stream.error(error);
      });
    } catch (e) {
      stream.error(e);
    }
    return stream;
  }

  /**
   * Insert or update existing model
   * @param {T} model
   * @returns {Observable<T extends any>}
   */
  public update(model: T): Observable<T> {
    let stream = new Subject<T>();
    try {
      // Create query selector
      let indexFields = getIndexFields(this.collection);
      let selector: { [key: string]: any } = {};
      let composedId: { [key: string]: any } = {};
      indexFields.forEach(field => {
        let value = model[field];
        if (!value) {
          throw new Error("Field '" + value + "' is empty");
        }
        selector["_id." + field] = value;
        composedId[field] = value;
      });
      selector["_id.id"] = model._id;
      composedId._id = model._id;
      model._id = composedId;

      this.collection.db.replaceOne(selector, model, { upsert: true })
        .then(result => {
          stream.next(model);
          stream.complete();
        }).catch(e => {
        stream.error(e);
      });
    } catch (e) {
      stream.error(e);
    }
    return stream;
  }

  /**
   * Delete model
   * @param {SearchOptions} searchOptions
   * @returns {Observable<boolean>}
   */
  public delete(searchOptions: SearchOptions): Observable<boolean> {
    let stream = new Subject<boolean>();
    try {
      this.collection.db.deleteOne(searchOptions)
        .then(result => {
          stream.next(result.deletedCount > 0);
          stream.complete();
        }).catch(e => {
        stream.error(e);
      });
    } catch (e) {
      stream.error(e);
    }
    return stream;
  }

}
