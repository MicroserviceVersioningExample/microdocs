import { IsString, MaxLength } from "class-validator";
import { BaseModel, BaseOptions } from "../common/base.model";

/**
 * /api/v2/projects
 *
 * @author S. Hermans <s.hermans@maxxton.com
 */
export class Project extends BaseModel<ProjectOptions> {

  /**
   * Update properties of this project
   * @param {ProjectOptions} options
   */
  public edit(options: ProjectOptions) {
    super.edit(options);
    if (options) {
      // Map custom options
    }
  }

}

export interface ProjectOptions extends BaseOptions{

}
