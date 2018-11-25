import passport from "passport";
import {
  ExpressMiddlewareInterface,
  UnauthorizedError
} from "routing-controllers";
import { Logger } from "../../decorators";
import { ILogger } from "../../utils";
import { Response, Request, NextFunction } from "express";

export class JWTMiddleware implements ExpressMiddlewareInterface {
  constructor(@Logger() private log: ILogger) {}
  public use(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<any> {
    return this.authenticate((error, user, info) => {
      if (error || !user) {
        this.log.info("Unauthrozied access");
        this.log.info(info);
        return next(new UnauthorizedError(info));
      }

      request.user = user;
      return next();
    })(request, response, next);
  }

  private authenticate = callback =>
    passport.authenticate("jwt", { session: false }, callback);
}
