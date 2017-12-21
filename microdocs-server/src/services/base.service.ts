import { ValidationError } from "class-validator";
import { Observable } from "rxjs/Observable";
import { BaseModel, BaseOptions, ValidationException } from "@maxxton/microdocs-core";
import { BaseRepository } from "../repositories/base.repo";

/**
 * Basic CRUD Service
 *
 * @author S. Hermans <s.hermans@maxxton.com
 */
export class BaseService<T extends BaseModel, O extends BaseOptions> {

  /**
   * Create Base Service
   * @param modelClass
   * @param {BaseRepository} baseRepository
   */
  constructor(private modelClass: (new (o: O) => T), private baseRepository: BaseRepository<T>) {

  }

  /**
   * Edit or create a new model
   * @param {string} name
   * @param {O} options
   * @returns {Promise<T extends BaseModel>}
   */
  public async editOrCreate(name: string, options: O):Promise<T> {
    let model = await this.edit(name, options);
    if(!model){
      model = await this.create(options);
    }
    return model;
  }

  /**
   * Create new model
   * @param {O} options
   * @returns {Promise<T extends BaseModel>}
   */
  public async create(options: O): Promise<T> {
    let model = new this.modelClass(options);

    // Validate model
    let errors = await model.validate();
    if (errors.length > 0) {
      throw new ValidationException("Project is invalid", errors);
    }

    // Check if name is unique
    if (await this.baseRepository.exists(model.name)) {
      let error = new ValidationError();
      error.target = model;
      error.property = "name";
      error.value = model.name;
      error.constraints = {
        NameNotUnique: "Name is not unique"
      };

      throw new ValidationException("Model is invalid", [error]);
    }

    // save and return model
    return await this.baseRepository.save(model);
  }

  /**
   * Edit model
   * @param name
   * @param {O} options
   * @returns {Promise<T extends BaseModel>}
   */
  public async edit(name: string, options: O): Promise<T | null> {
    // Load model
    let model = await this.baseRepository.find(name.toLowerCase());
    if (!model) {
      return null;
    }

    // Edit and validate model
    model.edit(options);
    let errors = await model.validate();
    if (errors.length > 0) {
      throw new ValidationException("Project is invalid", errors);
    }

    // Check if name is unique
    let nameEdited = options.name && name.toLowerCase() !== model.name.toLowerCase();
    if (nameEdited) {
      if (await this.baseRepository.exists(model.name)) {
        let error = new ValidationError();
        error.target = model;
        error.property = "name";
        error.value = model.name;
        error.constraints = {
          NameNotUnique: "Name is not unique"
        };

        throw new ValidationException("Model is invalid", [error]);
      }
    }

    // Store model
    let newModel = await this.baseRepository.find(model.name);
    if (nameEdited) {
      await this.baseRepository.delete(name);
    }

    return newModel;
  }

  /**
   * Delete model
   * @param {string} name
   * @returns {Promise<boolean>}
   */
  public async delete(name: string): Promise<boolean> {
    if (await this.baseRepository.exists(name)) {
      await this.baseRepository.delete(name);
      return true;
    }
    return false;
  }

  /**
   * Get model by name
   * @param {string} name
   * @returns {Promise<T extends BaseModel>}
   */
  public getByName(name: string): Promise<T> {
    return this.baseRepository.find(name);
  }

  /**
   * Get all models
   * @returns {Promise<T[]>}
   */
  public getAll(): Promise<T[]> {
    return this.baseRepository.findAll();
  }

  /**
   * Get all models as serial stream
   * @returns {Observable<T extends BaseModel>}
   */
  public getAllAsStream(): Observable<T> {
    return this.baseRepository.findAllAsStream();
  }

  /**
   * Get all ids
   * @returns {Promise<string[]>}
   */
  public getAllIds(): Promise<string[]> {
    return this.baseRepository.findAllIds();
  }

}
