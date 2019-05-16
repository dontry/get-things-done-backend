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
import { Passport } from "../auth";
import { sgMail } from "../mailer";
import { logger } from "../utils";
import swaggerUi from "swagger-ui-express";
import { yamlConverter } from "../utils";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });
const port = process.env.PORT || 9999;

export const expressLoader: MicroframeworkLoader = (
  settings: MicroframeworkSettings | undefined
) => {
  logger.debug("Express loader is loaded");
  if (settings) {
    // Get data from typeormconfig.json
    const connection = settings.getData("connection");
    Passport.useLocalStrategy();
    Passport.useJWTStrategy();

    logger.info(`SG_MAIL_APIKEY: ${process.env.SG_MAIL_APIKEY}`);

    if (process.env.SG_MAIL_APIKEY) {
      sgMail.setApiKey(process.env.SG_MAIL_APIKEY);
    }

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
        NoCacheMiddleware
      ]
    });

    // Swagger api, read yaml file
    if (process.env.NODE_ENV !== "production") {
      const swaggerDoc = yamlConverter("src/swagger/swagger.yaml");
      expressApp.use(
        "/api-docs",
        swaggerUi.serve,
        swaggerUi.setup(swaggerDoc, {
          explorer: true
        })
      );
    }

    expressApp.listen(port, () => {
      logger.info(`Express is running at port ${port}`);
    });
    settings.setData("express_app", expressApp);
  }
};
