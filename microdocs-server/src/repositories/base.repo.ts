
import { BaseModel } from "@maxxton/microdocs-core";
import { Observable } from "rxjs/Observable";

/**
 * Repository for basic CRUD operations
 *
 * @author S. Hermans <s.hermans@maxxton.com
 */
export interface BaseRepository<T extends BaseModel> {

  /**
   * Check if an item already exists with the same id
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  exists(id: string): Promise<boolean>;

  /**
   * Find item by ID
   * @param {string} id
   * @returns {Promise<T>}
   */
  find(id: string): Promise<T>;

  /**
   * Find the ids of all items
   * @returns {Promise<string[]>}
   */
  findAllIds(): Promise<string[]>;

  /**
   * Find all items
   * @returns {Promise<T>}
   */
  findAll(): Promise<T[]>;

  /**
   * Find all items and return them as stream
   * @returns {Observable<T>}
   */
  findAllAsStream(): Observable<T>;

  /**
   * Create or update item
   * @param {T} item
   * @returns {T}
   */
  save(item: T): Promise<T>;

  /**
   * Delete item
   * @param {string} id
   * @returns {boolean} true if exists, otherwise false
   */
  delete(id: string): Promise<boolean>;

}
