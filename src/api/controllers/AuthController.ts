import {
  Post,
  JsonController,
  Res,
  Req,
  Body,
  OnUndefined,
  UseBefore
} from "routing-controllers";
import jwt from "jsonwebtoken";
import passport from "passport";
import { UserService } from "../services";
import { classToPlain } from "class-transformer";
import { User } from "../models";
import { logger } from "../../utils";

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
              message: info ? info.message : "Login failed",
              error
            });
          }

          const token = jwt.sign(classToPlain(user), "token");
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
}
