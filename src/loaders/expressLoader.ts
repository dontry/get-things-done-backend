import { Application } from "express";
import {
  MicroframeworkLoader,
  MicroframeworkSettings
} from "microframework-w3tec";
import { createExpressServer } from "routing-controllers";
import {
  HelloWorldController,
  UserController,
  AuthController,
  TaskController
} from "../api/controllers";
import {
  LoggingMiddleware,
  ErrorHandlerMiddleware,
  NoCacheMiddleware
} from "../api/middlewares";
import { logger } from "../utils";
import { Passport } from "../auth";

export const expressLoader: MicroframeworkLoader = (
  settings: MicroframeworkSettings | undefined
) => {
  logger.debug("Express loader is loaded");
  if (settings) {
    // Get data from typeormconfig.json
    const connection = settings.getData("connection");
    Passport.useLocalStrategy();
    Passport.useJWTStrategy();

    const expressApp: Application = createExpressServer({
      cors: true,
      classTransformer: true,
      routePrefix: "/v1",
      defaultErrorHandler: false,
      controllers: [
        HelloWorldController,
        UserController,
        AuthController,
        TaskController
      ],
      middlewares: [
        LoggingMiddleware,
        ErrorHandlerMiddleware,
        NoCacheMiddleware,
        SecurityHstsMiddleware
      ]
    });

    // Authentication

    expressApp.listen(10010, () => {
      logger.info(`Express is running at port 10010`);
    });
    settings.setData("express_app", expressApp);
  }
};
