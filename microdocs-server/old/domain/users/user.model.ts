import { IsArray, IsString } from "class-validator";
import { BaseModel, BaseOptions } from "../common/base.model";

/**
 * /api/v2/users
 *
 * @author S. Hermans <s.hermans@maxxton.com>
 */
export class User extends BaseModel<UserOptions> {

  @IsArray()
  public permissions: string[];
  @IsArray()
  public groups: string[];
  @IsString()
  public password: string;

  constructor(options: UserOptions) {
    super(options);
  }

  /**
   * Update properties of this project
   * @param {UserOptions} options
   */
  public edit(options: UserOptions) {
    super.edit(options);
    if (options) {
      // custom mapping
      this.permissions = options.permissions ? options.permissions.map(permission => permission.toLowerCase()) : [];
      this.groups = options.groups ? options.groups.map(permission => permission.toLowerCase()) : [];
      this.password = options.password;
    }
  }

  public addPermission(permission: string): void {
    if(this.permissions.indexOf(permission.toLowerCase()) === -1){
      this.permissions.push(permission.toLowerCase());
    }
  }

  /**
   * Get User without password
   * @returns {User}
   */
  public getSafeUser(): User {
    delete this.password;
    return this;
  }

}

export interface UserOptions extends BaseOptions {

  permissions?: string[];
  groups?: string[];
  password?: string;

}
