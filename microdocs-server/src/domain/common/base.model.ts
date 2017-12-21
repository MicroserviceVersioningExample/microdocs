
import { IsNotEmpty, Matches, MaxLength, validate as validateClass, ValidationError } from "class-validator";
import { Unique } from "./unique.validator";

/**
 * Base model
 *
 * @author S. Hermans <s.hermans@maxxton.com
 */
export class BaseModel {

  @IsNotEmpty()
  @MaxLength(30)
  @Matches(/^[a-z][a-z0-9-]*$/)
  @Unique()
  public name: string;

  /**
   * Create new model
   * @param {BaseOptions} options
   */
  constructor(options: BaseOptions) {
    this.edit(options);
  }

  /**
   * Update properties of this model
   * @param {BaseOptions} options
   */
  public edit(options: BaseOptions) {
    if (options) {
      this.name = options.name ? options.name.toLowerCase() : undefined;
    }
  }

  /**
   * Validate this model
   * @returns {Promise<ValidationError[]>}
   */
  public validate(): Promise<ValidationError[]> {
    return validateClass(this);
  }

  public toJSON(): string {
    let obj: any = {};

    for (let key in this) {
      if (key[0] !== "_") {
        obj[key] = this[key];
      } else {
        let keyName = key.substr(1);
        obj[keyName] = this[key];
      }
    }

    return obj;
  }

}

export interface BaseOptions {

  name: string;

}
