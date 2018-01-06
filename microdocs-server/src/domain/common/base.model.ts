import {
  IsNotEmpty, IsOptional, IsString, Matches, MaxLength, validate as validateClass,
  ValidationError
} from "class-validator";

/**
 * Base model
 *
 * @author S. Hermans <s.hermans@maxxton.com>
 */
export class BaseModel<O extends BaseOptions> {

  @IsNotEmpty()
  @IsString()
  @MaxLength(38)
  @Matches(/^[a-z0-9-]*$/)
  public id: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  public name: string;

  /**
   * Create new model
   * @param {BaseOptions} options
   */
  constructor(options: O) {
    this.edit(options);
  }

  /**
   * Update properties of this model
   * @param {BaseOptions} options
   */
  public edit(options: O) {
    if (options) {
      this.id = options.id ? options.id.toLowerCase() : undefined;
      this.name = options.name || options.id;
    }
  }

  /**
   * Validate this model
   * @returns {Promise<ValidationError[]>}
   */
  public validate(): Promise<ValidationError[]> {
    return validateClass(this);
  }

}

export interface BaseOptions {

  id: string;
  name?: string;

}
