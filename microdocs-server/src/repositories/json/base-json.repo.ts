import { BaseModel } from "@maxxton/microdocs-core";
import * as fs from "fs";
import mkdirp = require("mkdirp");
import * as pathUtil from "path";
import { Observable } from "rxjs/Observable";
import * as winston from "winston";
import { storage } from "../../config/property-keys";
import { Settings } from "../../config/settings";
import { BaseRepository } from "../base.repo";

/**
 * Basic CRUD Json file based repository
 *
 * @author S. Hermans <s.hermans@maxxton.com
 */
export abstract class BaseJsonRepository<T extends BaseModel> implements BaseRepository<T> {

  private subPath: string;
  private storageFolder: string;

  /**
   * Create new CRUD Json repository
   * @param {string} subPath in the storage folder
   */
  constructor(subPath: string) {
    this.subPath = subPath;
    this.storageFolder = pathUtil.join(process.cwd(), Settings.get<string>(storage.json.folder, "database"), subPath);
  }

  /**
   * Check if document exists
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  public exists(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        let filePath = pathUtil.join(this.storageFolder, id.toLowerCase() + this.getExt());

        // Check if file exists
        fs.exists(filePath, exists => {
          resolve(exists);
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Find document by id
   * @param {string} id
   * @returns {Promise<T>}
   */
  public find(id: string): Promise<T> {
    return new Promise((resolve, reject) => {
      try {
        let filePath = pathUtil.join(this.storageFolder, id.toLowerCase() + this.getExt());
        winston.silly("[repo: " + this.subPath + "] load document: " + id);

        fs.exists(filePath, exists => {
          if (exists) {
            fs.readFile(filePath, (err, data) => {
              if (err) {
                reject(err);
              } else {
                let script = JSON.parse(data.toString());
                resolve(script);
              }
            });
          } else {
            resolve(null);
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Fin all document ids
   * @returns {Promise<string[]>}
   */
  public findAllIds(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      try {
        let folder = pathUtil.join(this.storageFolder);
        fs.exists(folder, exists => {
          if (exists) {
            fs.readdir(folder, (err, fileNames) => {
              if (err) {
                reject(err);
              } else {
                let scriptNames = fileNames
                  .filter(fileName => fileName.endsWith(this.getExt()))
                  .map(fileName => fileName.replace(this.getExt(), "").toLowerCase());
                resolve(scriptNames);
              }
            });
          } else {
            resolve([]);
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Find all documents
   * @returns {Promise<T[]>}
   */
  public async findAll(): Promise<T[]> {
    let ids = await this.findAllIds();
    let promises = ids.map(id => this.find(id));
    return Promise.all(promises);
  }

  /**
   * Find all documents as Observable stream
   * @returns {Observable<T>}
   */
  public findAllAsStream(): Observable<T> {
    return new Observable(observer => {
      this.findAllIds().then(ids => {

        let index = 0;
        let next = () => {
          index++;
          if (index >= ids.length) {
            observer.complete();
          } else {
            this.find(ids[index])
              .then(model => {
                observer.next(model);
                next();
              }).catch(error => observer.error(error));
          }
        };
        next();

      }).catch(error => observer.error(error));
    });
  }

  /**
   * Save document
   * @param {T} item
   * @returns {Promise<T>}
   */
  public save(item: T): Promise<T> {
    return new Promise((resolve, reject) => {
      try {
        let filePath = pathUtil.join(this.storageFolder, item.name + this.getExt());
        winston.silly("[repo: " + this.subPath + "] store document: " + item.name);

        let jsonDocument = this.serialize(item);
        this.makeParentDir(filePath).then(() => {
          fs.writeFile(filePath, jsonDocument, (err) => {
            if (err) {
              reject(err);
            } else {
              resolve(item);
            }
          });
        }).catch(reject);
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Delete document
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  public delete(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        let filePath = pathUtil.join(this.storageFolder, id + this.getExt());
        winston.silly("[repo: " + this.subPath + "] delete document: " + id);

        fs.exists(filePath, exists => {
          if (exists) {
            fs.unlink(filePath, err => {
              if (err) {
                reject(err);
              } else {
                resolve(true);
              }
            });
          } else {
            resolve(false);
          }
        });
      } catch (e) {
        reject(e);
      }
    }).then((deleted: boolean) => {
      this.deleteDir(this.storageFolder).then();
      return Promise.resolve(deleted);
    });
  }

  protected getExt(): string {
    return ".json";
  }

  /**
   * Serialize model
   * @param {T} model
   * @returns {string}
   */
  protected serialize(model: T): string {
    return JSON.stringify(model);
  }

  /**
   * Deserialize model
   * @param {string} data
   * @returns {T}
   */
  protected abstract deserialize(data: string): T;

  /**
   * Create parent folder of a path
   * @param {string} path
   * @returns {string}
   */
  private makeParentDir(path: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let dir = pathUtil.parse(path).dir;
      mkdirp(dir, err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * Remove directory if empty
   * @param {string} folder
   * @returns {Promise<void>}
   */
  private deleteDir(folder: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        fs.rmdir(folder, (err) => {
          resolve();
        });
      } catch (e) {
        winston.warn("Error while deleting folder '" + folder + "'", e);
        resolve();
      }
    });
  }

}
