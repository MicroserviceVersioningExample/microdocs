import {
  AuthorizationCode, AuthorizationCodeModel, Client, ClientCredentialsModel, ExtensionModel, PasswordModel,
  RefreshToken, RefreshTokenModel,
  Token, User
} from "oauth2-server";
import { Inject, Service } from "typedi";
import {
  AuthorizationCode as AuthorizationCodeObject,
  AuthorizationCodeOptions
} from "../../domain/auth/authorization-code.model";
import { RefreshToken as RefreshTokenObject, RefreshTokenOptions } from "../../domain/auth/refresh-token.model";
import { Token as TokenObject, TokenOptions } from "../../domain/auth/token.model";
import { AuthorizationCodeRepository } from "../../repositories/auth/authorization-code.repo";
import { ClientRepository } from "../../repositories/auth/client.repo";
import { RefreshTokenRepository } from "../../repositories/auth/refresh-token.repo";
import { TokenRepository } from "../../repositories/auth/token.repo";
import { UserService } from "../user.service";

/**
 * OAuth2 service for storage tokens and clients
 */
@Service()
export class OAuthServerService implements AuthorizationCodeModel, ClientCredentialsModel, RefreshTokenModel,
  PasswordModel, ExtensionModel {

  constructor(@Inject("user.service") private userService: UserService,
              @Inject("token.repo") private  tokenRepository: TokenRepository,
              @Inject("refresh-token.repo") private refreshTokenRepository: RefreshTokenRepository,
              @Inject("authorization-code.repo") private authorizationCodeRepository: AuthorizationCodeRepository,
              @Inject("client.repo") private clientRepoistory: ClientRepository) {

  }

  public async getAuthorizationCode(authorizationCode: string): Promise<AuthorizationCode> {
    let code = await this.authorizationCodeRepository.find(authorizationCode);
    if (code) {
      let client = await this.clientRepoistory.find(code.clientId);
      let user = await this.userService.getById(code.userId);

      return {
        authorizationCode: code.authorizationCode,
        expiresAt: code.expiresAt ? new Date(code.expiresAt) : null,
        redirectUri: code.redirectUri,
        scope: code.scope,
        client,
        user
      };
    }
    return null;
  }

  public async saveAuthorizationCode(code: AuthorizationCode, client: Client, user: User): Promise<AuthorizationCode> {
    let authorizationCodeOptions: AuthorizationCodeOptions = {
      authorizationCode: code.authorizationCode,
      id: code.authorizationCode,
      scope: code.scope,
      redirectUri: code.redirectUri,
      expiresAt: code.expiresAt ? code.expiresAt.toISOString() : null,
      userId: user.id,
      clientId: client.id
    };
    await this.authorizationCodeRepository.save(new AuthorizationCodeObject(authorizationCodeOptions));

    return code;
  }

  public revokeAuthorizationCode(code: AuthorizationCode): Promise<boolean> {
    return this.authorizationCodeRepository.delete(code.authorizationCode);
  }

  public async getClient(clientId: string, clientSecret: string): Promise<Client> {
    let client = await this.clientRepoistory.find(clientId);
    if (client) {
      return {
        id: client.id,
        grants: client.grants,
        redirectUris: client.redirectUris,
        accessTokenLifetime: client.accessTokenLifetime,
        refreshTokenLifetime: client.refreshTokenLifetime
      };
    }
    return null;
  }

  public async saveToken(token: Token, client: Client, user: User): Promise<Token> {
    let tokenOptions: TokenOptions = {
      accessToken: token.accessToken,
      expiresAt: token.accessTokenExpiresAt ? token.accessTokenExpiresAt.toISOString() : null,
      id: token.authorizationCode,
      scope: token.scope,
      userId: user.id,
      clientId: client.id
    };

    let refreshOptions: RefreshTokenOptions = {
      refreshToken: token.refreshToken,
      expiresAt: token.refreshTokenExpiresAt ? token.refreshTokenExpiresAt.toISOString() : null,
      id: token.authorizationCode,
      scope: token.scope,
      userId: user.id,
      clientId: client.id
    };
    await Promise.all([
      this.tokenRepository.save(new TokenObject(tokenOptions)),
      this.refreshTokenRepository.save(new RefreshTokenObject(refreshOptions))
    ]);

    return {
      accessToken: token.accessToken,
      accessTokenExpiresAt: token.accessTokenExpiresAt,
      refreshToken: token.refreshToken,
      refreshTokenExpiresAt: token.refreshTokenExpiresAt,
      id: token.authorizationCode,
      scope: token.scope,
      user,
      client
    };
  }

  public async getAccessToken(accessToken: string): Promise<Token> {
    let token = await this.tokenRepository.find(accessToken);
    if (token) {
      let client = await this.clientRepoistory.find(token.clientId);
      let user = await this.userService.getById(token.userId);

      return {
        accessToken: token.accessToken,
        accessTokenExpiresAt: token.expiresAt ? new Date(token.expiresAt) : null,
        scope: token.scope,
        client,
        user
      };
    }
    return null;
  }

  public async verifyScope(token: Token, scope: string): Promise<boolean> {
    if (!token.scope) {
      return false;
    }
    let requestedScopes = scope.split(" ");
    let authorizedScopes = token.scope.split(" ");
    return requestedScopes.every(s => authorizedScopes.indexOf(s) >= 0);
  }

  public getUserFromClient(client: Client): Promise<User> {
    // todo: get user for api key
    return null;
  }

  public async getRefreshToken(refreshToken: string): Promise<RefreshToken> {
    let token = await this.refreshTokenRepository.find(refreshToken);
    if (token) {
      let client = await this.clientRepoistory.find(token.clientId);
      let user = await this.userService.getById(token.userId);

      return {
        refreshToken: token.refreshToken,
        refreshTokenExpiresAt: token.expiresAt ? new Date(token.expiresAt) : null,
        scope: token.scope,
        client,
        user
      };
    }
    return null;
  }

  public revokeToken(token: Token): Promise<boolean> {
    return this.refreshTokenRepository.delete(token.refreshToken);
  }

  public async getUser(username: string, password: string): Promise<User> {
    return this.userService.authenticate(username, password);
  }

}
