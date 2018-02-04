/**
 * Logger property keys
 */
export const logger = {
  level: "logger.level"
};

/**
 * Web property keys
 */
export const web = {
  port: "web.port"
};

/**
 * Storage property keys
 */
export const storage = {
  driver: "storage.driver",
  json: {
    folder: "storage.json.folder"
  }
};

export const auth = {
  server: {
    enabled: "auth.server.enabled",

    client: {
      id: "auth.server.client.id",
      secret: "auth.server.client.secret",
      redirect_uris: "auth.server.client.redirect_uris",
      grants: "auth.server.client.grants",
      access_token_lifetime: "auth.server.client.access_token_lifetime",
      refresh_token_lifetime: "auth.server.client.refresh_token_lifetime"
    }
  }
};
