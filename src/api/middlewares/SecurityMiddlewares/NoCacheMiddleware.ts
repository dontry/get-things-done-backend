import express from "express";
import helmet from "helmet";
import { ExpressMiddlewareInterface, Middleware } from "routing-controllers";

@Middleware({ type: "before" })
export class NoCacheMiddleware implements ExpressMiddlewareInterface {
  public use(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): any {
    return helmet.noCache()(req, res, next);
  }
}
