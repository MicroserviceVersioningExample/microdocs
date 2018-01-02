import { Stream } from "stream";
import { BaseModel } from "../domain/common/base.model";
import { BaseOptions } from "../domain/common";

/**
 * Repository for basic CRUD operations
 *
 * @author S. Hermans <s.hermans@maxxton.com
 */
export interface BaseRepository<T extends BaseModel<BaseOptions>, P1 extends BaseModel<BaseOptions> = BaseModel<BaseOptions>,
  P2 extends BaseModel<BaseOptions> = BaseModel<BaseOptions>> {

  /**
   * Check if an item already exists with the same id
   * @param {string} id
   * @param p1 first parent
   * @param p2 second parent
   * @returns {Promise<boolean>}
   */
  exists(id: string, p1?: P1, p2?: P2): Promise<boolean>;

  /**
   * Find item by ID
   * @param {string} id
   * @param p1 first parent
   * @param p2 second parent
   * @returns {Promise<T>}
   */
  find(id: string, p1?: P1, p2?: P2): Promise<T>;

  /**
   * Find the ids of all items
   * @param p1 first parent
   * @param p2 second parent
   * @returns {Promise<string[]>}
   */
  findAllIds(p1?: P1, p2?: P2): Promise<string[]>;

  /**
   * Find all items
   * @param p1 first parent
   * @param p2 second parent
   * @returns {Promise<T>}
   */
  findAll(p1?: P1, p2?: P2): Promise<T[]>;

  /**
   * Find all items and return them as stream
   * @param p1 first parent
   * @param p2 second parent
   * @returns {Stream}
   */
  findAllAsStream(p1?: P1, p2?: P2): Stream;

  /**
   * Create or update item
   * @param {T} item
   * @param p1 first parent
   * @param p2 second parent
   * @returns {T}
   */
  save(item: T, p1?: P1, p2?: P2): Promise<T>;

  /**
   * Delete item
   * @param {string} id
   * @param p1 first parent
   * @param p2 second parent
   * @returns {boolean} true if exists, otherwise false
   */
  delete(id: string, p1?: P1, p2?: P2): Promise<boolean>;

}
