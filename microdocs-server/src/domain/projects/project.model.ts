import { MaxLength } from "class-validator";
import { BaseModel, BaseOptions } from "../common/base.model";

/**
 * /api/v2/projects
 *
 * @author S. Hermans <s.hermans@maxxton.com
 */
export class Project extends BaseModel {

  @MaxLength(40)
  private name: string;

  /**
   * Create new project
   * @param {ProjectOptions} options
   */
  constructor(options: ProjectOptions) {
    super(options);
  }

  /**
   * Update properties of this project
   * @param {ProjectOptions} options
   */
  public edit(options: ProjectOptions) {
    super.edit(options);
    if (options) {
      this.name = options.name || options.id;
    }
  }

}

export interface ProjectOptions extends BaseOptions{

  name?: string;

}
