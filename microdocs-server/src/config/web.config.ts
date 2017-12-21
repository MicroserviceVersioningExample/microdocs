
import * as express from "express";
import { createExpressServer, useContainer } from "routing-controllers";
import { Container } from "typedi";
import * as winston from "winston";
import { web } from "./property-keys";
import { Settings } from "./settings";
import { ProjectController } from "../controllers/project.controller";

/**
 * Configure the HTTP server
 * @author S. Hermans <s.hermans@maxxton.com>
 */
export class WebConfig {

  public init(): void {
    useContainer(Container);
    // creates express app, registers all controller routes and returns you express app instance
    const app = createExpressServer({
      controllers: [__dirname + "/../controllers/**/*.controller.js"]
    });

    // Health check
    app.get("/health", (req: express.Request, resp: express.Response) => {
      resp.sendStatus(200).send("ok");
    });

    // run express application
    const port = Settings.get(web.port, 8080);
    winston.info("Listen on port " + port);
    app.listen(port);
  }

}
