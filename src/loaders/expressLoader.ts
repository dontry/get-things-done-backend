import { Application } from "express";
import {
  MicroframeworkLoader,
  MicroframeworkSettings
} from "microframework-w3tec";
import { createExpressServer } from "routing-controllers";
import { HelloWorldController, UserController } from "../api/controllers";
import { LoggingMiddleware } from "../api/middlewares";
import { logger } from "../utils";

export const expressLoader: MicroframeworkLoader = (
  settings: MicroframeworkSettings | undefined
) => {
  logger.debug("Express loader is loaded");
  if (settings) {
    const connection = settings.getData("connection");

    // TODO: WHAT IS THIS
    const expressApp: Application = createExpressServer({
      cors: true,
      classTransformer: true,
      routePrefix: "/v1",
      defaultErrorHandler: false,
      controllers: [HelloWorldController, UserController],
      middlewares: [LoggingMiddleware]
    });
    expressApp.listen(10010, () => {
      logger.info(`Express is running`);
    });
    settings.setData("express_app", expressApp);
  }
};
