import { config } from "../../config/index";
import { Context } from "../../context";
import { Token } from "../../domain/token.model";

export abstract class BaseFetchClient {

  protected async request(method: string, path: string, options: RequestInit = {}): Promise<Response> {
    let url = config.baseUrl + path;
    let requestOptions = { ...options, method };
    if (!requestOptions.headers) {
      requestOptions.headers = {};
    }

    // Set Authorization header
    try {
      let token = await this.getToken();
      (requestOptions.headers as any)["Authorization"] = "Bearer " + token;
    } catch (e) {
      // ignore error
    }

    // Make request
    let response = await fetch(url, requestOptions);

    if (response.status === 401) {
      // reset token
      Context.token = null;
      let token = await this.getToken();
      (requestOptions.headers as any)["Authorization"] = "Bearer " + token;

      // Retry request
      return fetch(url, requestOptions);
    }
    return response;
  }

  /**
   * Get access token
   * @returns {Promise<string>}
   */
  private async getToken(): Promise<string | null> {
    let context = Context.context;
    if (!context.token && context.refreshToken) {
      // Authenticate
      let token = await this.refreshToken(context.refreshToken);
      if (!token) {
        Context.refreshToken = null;
        throw new Error("Refresh token not valid");
      } else {
        context.token = token.access_token;
        context.refreshToken = token.refresh_token;
        Context.context = context;
      }
    } else if (!context.token) {
      throw new Error("No token, login first");
    }
    return context.token;
  }

  /**
   * Request new token with a refresh token
   * @param {string} refreshToken
   * @returns {Promise<Token>}
   */
  private async refreshToken(refreshToken: string): Promise<Token> {
    let formData = new FormData();
    formData.append("grant_type", "refresh_token");
    formData.append("refresh_token", refreshToken);

    let response = await fetch("", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: formData
    });
    let json = await response.json();
    return json as Token;
  }

}
