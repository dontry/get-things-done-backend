import { Request, Response } from "express";
import morgan from "morgan";
import { Middleware, ExpressMiddlewareInterface } from "routing-controllers";
import { logger } from "../../utils";

@Middleware({ type: "before" })
export class LoggingMiddleware implements ExpressMiddlewareInterface {
  public use(request: Request, response: Response, next: (err?: any) => any) {
    return morgan("combine", {
      stream: {
        write: logger.info.bind(logger)
      }
    })(request, response, next);
  }
}
