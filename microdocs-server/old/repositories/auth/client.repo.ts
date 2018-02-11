import { Client } from "oauth2-server";
import { Settings } from "../../config/settings";
import { auth } from "../../config/property-keys";

export class ClientRepository {

  private clients: Client[] = [];

  constructor() {
    let redirectUris: string = Settings.get(auth.server.client.redirect_uris);
    this.clients.push({
      id: Settings.get(auth.server.client.id, "microdocs"),
      secret: Settings.get(auth.server.client.secret, "microdocs"),
      grants: Settings.get(auth.server.client.grants, "authorization_code,client_credentials,refresh_token,password")
        .split(","),
      redirectUris: redirectUris ? redirectUris.split(",") : [],
      refreshTokenLifetime:
        parseInt(Settings.get(auth.server.client.refresh_token_lifetime, "2592000")),
      accessTokenLifetime:
        parseInt(Settings.get(auth.server.client.access_token_lifetime, "86400"))
    })
    ;
  }

  public find(id: string): Promise<Client> {
    return Promise.resolve(this.clients.filter(client => client.id === id)[0] || null);
  }

}
