import { Application } from "express";
import {
  MicroframeworkLoader,
  MicroframeworkSettings
} from "microframework-w3tec";
import { createExpressServer } from "routing-controllers";
// import { HelloWorldController } from "../api/controllers";
// import { LoggingMiddleware } from "../api/middlewares";
import { logger } from "../utils";

export const expressLoader: MicroframeworkLoader = (
  settings: MicroframeworkSettings | undefined
) => {
  logger.debug("Express loader is loaded");
  if (settings) {
    // Get data from typeormconfig.json
    const connection = settings.getData("connection");

    const expressApp: Application = createExpressServer({
      cors: true,
      classTransformer: true,
      routePrefix: "/v1",
      // defaultErrorHandler: false,
      controllers: []
      // middlewares: [LoggingMiddleware]
    });

    // Authentication

    expressApp.listen(10010, () => {
      logger.info(`Express is running`);
    });
    settings.setData("express_app", expressApp);
  }
};
