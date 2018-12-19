import { Request, Response, NextFunction } from "express";
import {
  ExpressErrorMiddlewareInterface,
  Middleware,
  HttpError
} from "routing-controllers";
import { Logger } from "../../decorators";
import { ILogger } from "../../utils";
import { ValidationError } from "class-validator";

@Middleware({ type: "after", priority: 5 })
export class ErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {
  public isProduction = process.env.ENV_NODE === "production";
  constructor(@Logger() private log: ILogger) {}

  /**
   * error
   */
  public error(
    error: HttpError,
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    if (!error) {
      next();
    }
    response.status(error.httpCode || 500);

    // Validation errors
    // if (Array.isArray(error) && error[0] instanceof ValidationError) {
    //   response.json({
    //     name: "ValidationError",
    //     message: "Validation Errors",
    //     errors: error
    //   });
    // }

    response.json({
      name: error.name,
      message: error.message.toString() || "Server errors",
      errors: error[`errors`]
    });

    if (this.isProduction) {
      this.log.error(error.name, error.message);
    } else {
      this.log.error(error.name, error.stack);
    }
  }
}
