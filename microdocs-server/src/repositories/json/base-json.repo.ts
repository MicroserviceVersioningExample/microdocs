import * as fs from "fs";
import mkdirp = require("mkdirp");
import * as pathUtil from "path";
import { Readable, Stream } from "stream";
import * as winston from "winston";
import { storage } from "../../config/property-keys";
import { Settings } from "../../config/settings";
import { BaseModel } from "../../domain/common";
import { BaseRepository } from "../base.repo";
import { BaseOptions } from "../../domain/common";

/**
 * Basic CRUD Json file based repository
 *
 * @author S. Hermans <s.hermans@maxxton.com>
 */
export abstract class BaseJsonRepository<T extends BaseModel<BaseOptions>, P1 extends BaseModel<BaseOptions> = BaseModel<BaseOptions>,
  P2 extends BaseModel<BaseOptions> = BaseModel<BaseOptions>> implements BaseRepository<T, P1, P2> {

  private subPath: string;
  private storageFolder: string;

  /**
   * Create new CRUD Json repository
   * @param p1Type first parent
   * @param p2Type second parent
   * @param {string} subPath in the storage folder
   */
  constructor(subPath: string, private p1Type?: (new (o: any) => P1), private p2Type?: (new (o: any) => P2)) {
    this.subPath = subPath;
    this.storageFolder = pathUtil.join(process.cwd(), Settings.get<string>(storage.json.folder, "database"), subPath);
  }

  /**
   * Check if document exists
   * @param {string} id
   * @param p1 first parent
   * @param p2 second parent
   * @returns {Promise<boolean>}
   */
  public exists(id: string, p1?: P1, p2?: P2): Promise<boolean> {
    let filePath = this.getFilePath(p1, p2, id);
    return new Promise((resolve, reject) => {
      try {
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
   * @param p1 first parent
   * @param p2 second parent
   * @returns {Promise<T>}
   */
  public find(id: string, p1?: P1, p2?: P2): Promise<T> {
    let filePath = this.getFilePath(p1, p2, id);
    return new Promise((resolve, reject) => {
      try {
        winston.silly("[repo: " + this.subPath + "] load document: " + id);

        fs.exists(filePath, exists => {
          if (exists) {
            fs.readFile(filePath, (err, data) => {
              if (err) {
                reject(err);
              } else {
                let script = this.deserialize(data.toString());
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
   * Find all document ids
   * @param p1 first parent
   * @param p2 second parent
   * @returns {Promise<string[]>}
   */
  public findAllIds(p1?: P1, p2?: P2): Promise<string[]> {
    let folder = this.getFilePath(p1, p2);
    return new Promise((resolve, reject) => {
      try {
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
   * @param p1 first parent
   * @param p2 second parent
   * @returns {Promise<T[]>}
   */
  public async findAll(p1?: P1, p2?: P2): Promise<T[]> {
    let ids = await this.findAllIds(p1, p2);
    let promises = ids.map(id => this.find(id, p1, p2));
    return Promise.all(promises);
  }

  /**
   * Find all documents as stream
   * @param p1 first parent
   * @param p2 second parent
   * @returns {Stream}
   */
  public findAllAsStream(p1?: P1, p2?: P2): Stream {
    let stream = new Readable();
    let reading = false;
    stream._read = () => {
      if (!reading) {
        reading = true;
        this.findAllIds(p1, p2).then(ids => {
          stream.push("[\n");
          let index = 0;
          let next = () => {
            index++;
            if (index > ids.length) {
              stream.push("]");
              stream.push(null);
            } else {
              this.find(ids[index - 1], p1, p2)
                .then(model => {
                  if (index > 1) {
                    stream.push(",\n");
                  }
                  stream.push(JSON.stringify(model) + "\n");
                  next();
                }).catch(error => {
                stream.emit("error", error);
                stream.push(null);
              });
            }
          };
          next();
        }).catch(e => {
          stream.emit("error", e);
          stream.push(null);
        });
      }
    };
    return stream;
  }

  /**
   * Save document
   * @param {T} item
   * @param p1 first parent
   * @param p2 second parent
   * @returns {Promise<T>}
   */
  public save(item: T, p1?: P1, p2?: P2): Promise<T> {
    let filePath = this.getFilePath(p1, p2, item.id);
    return new Promise((resolve, reject) => {
      try {
        winston.silly("[repo: " + this.subPath + "] store document: " + item.id);

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
   * @param p1 first parent
   * @param p2 second parent
   * @returns {Promise<boolean>}
   */
  public delete(id: string, p1?: P1, p2?: P2): Promise<boolean> {
    let filePath = this.getFilePath(p1, p2, id);
    return new Promise((resolve, reject) => {
      try {
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

  /**
   * Get filePath of the entry
   * @param {string} id id of the entry
   * @param {P1} p1 first parent
   * @param {P2} p2 second parent
   * @returns {string}
   */
  private getFilePath(p1?: P1, p2?: P2, id?: string): string {
    let path = this.storageFolder;
    if (this.p1Type) {
      if (!p1) {
        throw new Error("First parent is undefined");
      }
      path = pathUtil.join(path, p1.id.toLowerCase());
    }
    if (this.p2Type) {
      if (!p2) {
        throw new Error("Second parent is undefined");
      }
      path = pathUtil.join(path, p2.id.toLowerCase());
    }
    if (id !== undefined) {
      path = pathUtil.join(path, id.toLowerCase() + this.getExt());
    }
    return path;
  }

}
