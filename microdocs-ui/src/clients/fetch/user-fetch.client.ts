import { config } from "../../config/index";
import { Token } from "../../domain/token.model";
import { User } from "../../domain/user.model";
import { UserClient } from "../user.client";

export class UserFetchClient implements UserClient {

  public async login(username: string, password: string): Promise<Token> {
    let data: any = {
      grant_type: "password",
      client_id: config.clientId,
      client_secret: config.clientSecret,
      username,
      password
    };
    let body = "";
    for (let key in data) {
      if (body.length === 0) {
        body += key + "=" + encodeURIComponent(data[key]);
      } else {
        body += "&" + key + "=" + encodeURIComponent(data[key]);
      }
    }

    let response = await fetch(config.baseUrl + "/uaa/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
      },
      body
    });
    let json = await response.json();
    return json as Token;
  }

  public getUser(username: string): Promise<User> {
    return undefined;
  }

}
