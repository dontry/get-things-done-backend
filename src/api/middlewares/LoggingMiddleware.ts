import { Request, Response } from "express";
import { Middleware, ExpressMiddlewareInterface } from "routing-controllers";
import { logger } from "../../utils";

@Middleware({ type: "before" })
class LoggingMiddleware implements ExpressMiddlewareInterface {
  public use(
    request: Request,
    response: Response,
    next: (err?: any) => any
  ): void {
    logger.info("request:", request);
    next();
  }
}
export default LoggingMiddleware;
