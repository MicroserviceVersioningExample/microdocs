import { MaxLength } from "class-validator";
import { BaseModel } from "../common/base.model";

/**
 * /api/v2/projects
 *
 * @author S. Hermans <s.hermans@maxxton.com
 */
export class Project extends BaseModel {

  @MaxLength(40)
  private displayName: string;

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
      this.displayName = options.displayName || options.name;
    }
  }

}

export interface ProjectOptions {

  name: string;
  displayName?: string;

}
