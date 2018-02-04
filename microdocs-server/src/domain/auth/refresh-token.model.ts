import { BaseModel, BaseOptions } from "../common/base.model";

/**
 * RefreshToken model
 *
 * @author S. Hermans <s.hermans@maxxton.com>
 */
export class RefreshToken extends BaseModel<RefreshTokenOptions> {

  public refreshToken: string;
  public expiresAt: string;
  public scope: string;
  public clientId: string;
  public userId: string;

  constructor(options: RefreshTokenOptions) {
    super(options);
  }

  /**
   * Update properties of this project
   * @param {UserOptions} options
   */
  public edit(options: RefreshTokenOptions) {
    super.edit(options);
    if (options) {
      this.id = options.refreshToken;
      this.refreshToken = options.refreshToken;
      this.expiresAt = options.expiresAt;
      this.scope = options.scope;
      this.clientId = options.clientId;
      this.userId = options.userId;
    }
  }

}

export interface RefreshTokenOptions extends BaseOptions {

  refreshToken: string;
  expiresAt: string;
  scope: string;
  clientId: string;
  userId: string;

}