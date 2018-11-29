import passport from "passport";
import {
  ExpressMiddlewareInterface,
  UnauthorizedError
} from "routing-controllers";
import { Response, Request, NextFunction } from "express";

export class PassportMiddleware implements ExpressMiddlewareInterface {
  private authenticate;
  constructor(private method: string) {
    this.authenticate = callback =>
      passport.authenticate(this.method, { session: false }, callback);
  }
  public use(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<any> {
    return this.authenticate((error, user, info) => {
      if (error || !user) {
        return next(new UnauthorizedError(info));
      }
      request.user = user;
      return next();
    })(request, response, next);
  }
}
