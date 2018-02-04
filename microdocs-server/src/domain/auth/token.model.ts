import { BaseModel, BaseOptions } from "../common/base.model";

/**
 * Token model
 *
 * @author S. Hermans <s.hermans@maxxton.com>
 */
export class Token extends BaseModel<TokenOptions> {

  public accessToken: string;
  public expiresAt: string;
  public scope: string;
  public clientId: string;
  public userId: string;

  constructor(options: TokenOptions) {
    super(options);
  }

  /**
   * Update properties of this project
   * @param {UserOptions} options
   */
  public edit(options: TokenOptions) {
    super.edit(options);
    if (options) {
      this.id = options.accessToken;
      this.accessToken = options.accessToken;
      this.expiresAt = options.expiresAt;
      this.scope = options.scope;
      this.clientId = options.clientId;
      this.userId = options.userId;
    }
  }

}

export interface TokenOptions extends BaseOptions {

  accessToken: string;
  expiresAt: string;
  scope: string;
  clientId: string;
  userId: string;

}
