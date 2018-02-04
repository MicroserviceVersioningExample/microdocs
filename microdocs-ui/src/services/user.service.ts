import { UserClient } from "../clients/user.client";
import { Context } from "../context";
import { User } from "../domain/user.model";
import { LoggerService } from "./logger.service";

export class UserService {

  constructor(private loggerService: LoggerService, private userClient: UserClient) {

  }

  /**
   * Login
   * @param {string} username
   * @param {string} password
   * @returns {Promise<User>}
   */
  public async login(username: string, password: string): Promise<User | null> {
    let token = await this.userClient.login(username, password);
    if (!token) {
      return null;
    }
    Context.context = {
      userId: username,
      token: token.access_token,
      refreshToken: token.refresh_token
    };
    return this.userClient.getUser(username);
  }

}
