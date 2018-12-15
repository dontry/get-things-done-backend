import { Response, Request, NextFunction } from "express";
import {
  ExpressMiddlewareInterface,
  ForbiddenError
} from "routing-controllers";
import { InjectManager } from "typeorm-typedi-extensions";
import { MongoEntityManager } from "typeorm";
import { User } from "../models/User";
import { Inject } from "typedi";
import { Authorizer } from "../../auth";

export class AuthorizationMiddleware implements ExpressMiddlewareInterface {
  @Inject()
  private authorizer: Authorizer;

  constructor(
    @InjectManager()
    private entityManager: MongoEntityManager
  ) {}
  public use(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<any> {
    const { user } = request;
    return this.entityManager
      .findOne(User, {
        username: user.username
      })
      .then((currentUser: User | void) => {
        if (currentUser) {
          const { role } = currentUser;
          const { path, method } = request;
          const authorized = this.authorizer.checkPermission(
            role,
            path,
            method
          );
          if (authorized) {
            next();
          } else {
            return next(new ForbiddenError("User permission denied"));
          }
        } else {
          return next(new ForbiddenError("User permission denied"));
        }
      });
  }
}
