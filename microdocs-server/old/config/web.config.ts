import bodyParser = require("body-parser");
import * as express from "express";
import { createExpressServer, useContainer } from "routing-controllers";
import { Container } from "typedi";
import * as winston from "winston";
import { OAuthServerService } from "../services/auth/oauth-server.service";
import { auth, web } from "./property-keys";
import { Settings } from "./settings";
const OAuthServer = require("express-oauth-server");

/**
 * Configure the HTTP server
 * @author S. Hermans <s.hermans@maxxton.com>
 */
export class WebConfig {

  public init(): void {
    useContainer(Container);
    // creates express app, registers all controller routes and returns you express app instance
    const app = createExpressServer({
      cors: true,
      controllers: [__dirname + "/../controllers/**/*.controller.js"],
      middlewares: [__dirname + "/../middlewares/**/*.middleware.js"],
      defaultErrorHandler: false
    });

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    // Health check
    app.get("/health", (req: express.Request, resp: express.Response) => {
      resp.sendStatus(200).send("ok");
    });

    // Auth middleware
    if (Settings.get(auth.server.enabled)) {
      winston.info("Init oauth2 server");
      app.oauth = new OAuthServer({
        model: Container.get(OAuthServerService),
        debug: true
      });
      app.all("/uaa/token", app.oauth.token());
      app.all("/uaa/authorize", app.oauth.authorize());
      app.all("/uaa/authenticate", app.oauth.authenticate());
    }

    // run express application
    const port = Settings.get(web.port, 8080);
    winston.info("Listen on port " + port);
    app.listen(port);
  }

}
