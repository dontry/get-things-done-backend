import {
  Post,
  Delete,
  JsonController,
  Res,
  Req,
  Body,
  OnUndefined,
  Put,
  UseBefore,
  UseInterceptor
} from "routing-controllers";
import jwt from "jsonwebtoken";
import passport from "passport";
import { UserService } from "../services";
import { classToPlain } from "class-transformer";
import { User } from "../models";
import {
  JwtAuthMiddleware,
  AuthorizationMiddleware
} from "../../api/middlewares";
import { PRIVATE_KEY } from "../../auth";

@JsonController("/auth")
export class AuthController {
  constructor(private userService: UserService) {}
  @Post("/login")
  @OnUndefined(200)
  public login(
    @Req() request: any,
    @Res() response: any,
    @Body() body: any
  ): Promise<any> {
    return new Promise((res, rej) => {
      passport.authenticate(
        "local",
        { session: false },
        (error, user, info) => {
          if (error || !user) {
            return rej({
              message: info ? info.message : `Login failed: ${error}`,
              httpCode: 401,
              name: "Unauthorized"
            });
          }

          // token = jwt.sign(payload, privateKEY, signOptions);
          const token = jwt.sign(classToPlain(user), PRIVATE_KEY, {
            expiresIn: "30d",
            algorithm: "RS256"
          });
          return res({ user, token });
        }
      )(request, response);
    });
  }

  @Post("/register")
  @OnUndefined(200)
  public register(@Body() user: User): Promise<User> {
    return this.userService.register(user);
  }

  @UseBefore(AuthorizationMiddleware)
  @UseBefore(JwtAuthMiddleware)
  @Delete("/unsubscribe")
  public unsubscribe(@Req() request): Promise<boolean> {
    const { user } = request;
    return this.userService.deleteById(user.id);
  }

  @UseBefore(AuthorizationMiddleware)
  @UseBefore(JwtAuthMiddleware)
  @Put("/update")
  public update(@Req() request, @Body() info: User): Promise<User | void> {
    const { user } = request;
    return this.userService.update(user.id, info);
  }
}
