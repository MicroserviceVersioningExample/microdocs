import { IsArray } from "class-validator";
import { BaseModel, BaseOptions } from "../common/base.model";

/**
 * /api/v2/groups
 *
 * @author S. Hermans <s.hermans@maxxton.com>
 */
export class Group extends BaseModel<GroupOptions> {

  @IsArray()
  private permissions: string[];
  @IsArray()
  private users: string[];

  constructor(options: GroupOptions) {
    super(options);
  }

  /**
   * Update properties of this project
   * @param {UserOptions} options
   */
  public edit(options: GroupOptions) {
    super.edit(options);
    if (options) {
      // custom mapping
      this.permissions = options.permissions || [];
      this.users = options.users || [];
    }
  }

}

export interface GroupOptions extends BaseOptions {

  permissions?: string[];
  users?: string[];

}
