import express from "express";
import helmet from "helmet";
import { ExpressMiddlewareInterface, Middleware } from "routing-controllers";

@Middleware({ type: "before" })
export class HstsMiddleware implements ExpressMiddlewareInterface {
  public use(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ): any {
    return helmet.hsts({
      maxAge: 31536000,
      includeSubdomains: true
    })(request, response, next);
  }
}
