import { MaxLength } from "class-validator";
import { BaseModel } from "../common/base.model";

/**
 * /api/v2/projects
 *
 * @author S. Hermans <s.hermans@maxxton.com
 */
export class Project extends BaseModel {

  @MaxLength(40)
  private _displayName: string;

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
      this._displayName = options.displayName || options.name;
    }
  }

  get displayName(): string {
    return this._displayName;
  }

}

export interface ProjectOptions {

  name: string;
  displayName?: string;

}
