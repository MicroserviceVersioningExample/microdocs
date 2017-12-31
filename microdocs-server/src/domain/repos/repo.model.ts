import { BaseModel, BaseOptions } from "../common/base.model";
import { MaxLength } from "class-validator";
import { ProjectOptions } from "../projects/project.model";

/**
 * /api/v2/projects/:project/repos
 *
 * @author S. Hermans <s.hermans@maxxton.com
 */
export class Repo extends BaseModel {

  @MaxLength(40)
  private name: string;

  /**
   * Create new Repo
   * @param {RepoOptions} options
   */
  constructor(options: RepoOptions) {
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

export interface RepoOptions extends BaseOptions {

  name?: string;

}