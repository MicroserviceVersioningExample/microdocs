import { BaseModel, BaseOptions } from "../common/base.model";

/**
 * AuthorizationCode model
 *
 * @author S. Hermans <s.hermans@maxxton.com>
 */
export class AuthorizationCode extends BaseModel<AuthorizationCodeOptions> {

  public authorizationCode: string;
  public redirectUri: string;
  public expiresAt: string;
  public scope: string;
  public clientId: string;
  public userId: string;

  constructor(options: AuthorizationCodeOptions) {
    super(options);
  }

  /**
   * Update properties of this project
   * @param {UserOptions} options
   */
  public edit(options: AuthorizationCodeOptions) {
    super.edit(options);
    if (options) {
      this.id = options.authorizationCode;
      this.authorizationCode = options.authorizationCode;
      this.redirectUri = options.redirectUri;
      this.expiresAt = options.expiresAt;
      this.scope = options.scope;
      this.clientId = options.clientId;
      this.userId = options.userId;
    }
  }

}

export interface AuthorizationCodeOptions extends BaseOptions {

  authorizationCode: string;
  redirectUri: string;
  expiresAt: string;
  scope: string;
  clientId: string;
  userId: string;

}
