import { ValidationError } from "class-validator";
import { Stream } from "stream";
import { BaseModel, BaseOptions } from "../domain/common/base.model";
import { ValidationException } from "../domain/common/validation.error";
import { BaseRepository } from "../repositories/base.repo";
import * as winston from "winston";

/**
 * Basic CRUD Service
 *
 * @author S. Hermans <s.hermans@maxxton.com
 */
export class BaseService<T extends BaseModel, O extends BaseOptions, P1 extends BaseModel = BaseModel,
  P2 extends BaseModel = BaseModel> {

  /**
   * Create Base Service
   * @param modelClass
   * @param {BaseRepository} baseRepository
   */
  constructor(private modelClass: (new (o: O) => T), private baseRepository: BaseRepository<T>) {

  }

  /**
   * Edit or create a new model
   * @param {string} id
   * @param {O} options
   * @param p1 first parent
   * @param p2 second parent
   * @returns {Promise<T extends BaseModel>}
   */
  public async editOrCreate(id: string, options: O, p1?: P1, p2?: P2): Promise<T> {
    let model = await this.edit(id, options, p1, p2);
    if (!model) {
      model = await this.create(options, p1, p2);
    }
    return model;
  }

  /**
   * Create new model
   * @param {O} options
   * @param p1 first parent
   * @param p2 second parent
   * @returns {Promise<T extends BaseModel>}
   */
  public async create(options: O, p1?: P1, p2?: P2): Promise<T> {
    let model = new this.modelClass(options);

    // Validate model
    let errors = await model.validate();
    if (errors.length > 0) {
      throw new ValidationException("Project is invalid", errors);
    }

    // Check if id is unique
    if (await this.baseRepository.exists(model.id, p1, p2)) {
      let error = new ValidationError();
      error.target = model;
      error.property = "id";
      error.value = model.id;
      error.constraints = {
        IdNotUnique: "Id is not unique"
      };

      throw new ValidationException("Model is invalid", [error]);
    }

    // save and return model
    return this.baseRepository.save(model, p1, p2);
  }

  /**
   * Edit model
   * @param id
   * @param {O} options
   * @param p1 first parent
   * @param p2 second parent
   * @returns {Promise<T extends BaseModel>}
   */
  public async edit(id: string, options: O, p1?: P1, p2?: P2): Promise<T | null> {
    // Load model
    let model = await this.baseRepository.find(id.toLowerCase(), p1, p2);
    if (!model) {
      return null;
    }

    // Edit and validate model
    model.edit(options);
    let errors = await model.validate();
    if (errors.length > 0) {
      throw new ValidationException("Project is invalid", errors);
    }

    // Check if id is unique
    let idEdited = options.id && id.toLowerCase() !== model.id.toLowerCase();
    if (idEdited) {
      if (await this.baseRepository.exists(model.id, p1, p2)) {
        let error = new ValidationError();
        error.target = model;
        error.property = "id";
        error.value = model.id;
        error.constraints = {
          IdNotUnique: "Id is not unique"
        };

        throw new ValidationException("Model is invalid", [error]);
      }
    }

    // Store model
    let newModel = await this.baseRepository.find(model.id, p1, p2);
    if (idEdited) {
      await this.baseRepository.delete(id, p1, p2);
    }

    return newModel;
  }

  /**
   * Delete model
   * @param {string} id
   * @param p1 first parent
   * @param p2 second parent
   * @returns {Promise<boolean>}
   */
  public async delete(id: string, p1?: P1, p2?: P2): Promise<boolean> {
    if (await this.baseRepository.exists(id, p1, p2)) {
      await this.baseRepository.delete(id, p1, p2);
      return true;
    }
    return false;
  }

  /**
   * Get model by id
   * @param {string} id
   * @param p1 first parent
   * @param p2 second parent
   * @returns {Promise<T extends BaseModel>}
   */
  public getById(id: string, p1?: P1, p2?: P2): Promise<T> {
    return this.baseRepository.find(id, p1, p2);
  }

  /**
   * Get all models
   * @param p1 first parent
   * @param p2 second parent
   * @returns {Promise<T[]>}
   */
  public getAll(p1?: P1, p2?: P2): Promise<T[]> {
    return this.baseRepository.findAll(p1, p2);
  }

  /**
   * Get all models as serial stream
   * @param p1 first parent
   * @param p2 second parent
   * @returns {Stream}
   */
  public getAllAsStream(p1?: P1, p2?: P2): Stream {
    return this.baseRepository.findAllAsStream(p1, p2);
  }

  /**
   * Get all ids
   * @returns {Promise<st
   * @param p1 first parent
   * @param p2 second parentring[]>}
   */
  public getAllIds(p1?: P1, p2?: P2): Promise<string[]> {
    return this.baseRepository.findAllIds(p1, p2);
  }

}
