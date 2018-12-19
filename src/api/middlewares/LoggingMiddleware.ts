import { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import { Middleware, ExpressMiddlewareInterface } from "routing-controllers";
import { logger } from "../../utils";

@Middleware({ type: "before" })
export class LoggingMiddleware implements ExpressMiddlewareInterface {
  public use(request: Request, response: Response, next: NextFunction) {
    return morgan("combined", {
      stream: {
        write: meta => logger.info(meta)
      }
    })(request, response, next);
  }
}
