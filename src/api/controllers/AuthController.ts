import {
  Post,
  JsonController,
  Res,
  Req,
  Body,
  OnUndefined
} from "routing-controllers";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Passport } from "../../auth";
import { UserNotFoundError } from "../errors";

@JsonController("/auth")
export class AuthController {
  constructor() {
    Passport.useLocalStrategy();
  }
  @Post("/login")
  @OnUndefined(200)
  public login(
    @Req() request: any,
    @Res() response: any,
    @Body() body: any
  ): void {
    passport.authenticate("local", { session: false }, (error, user, info) => {
      if (error || !user) {
        return response.status(400).json({
          message: info ? info.message : "Login failed",
          user
        });
      }
      const token = jwt.sign(user, "token");
      return response.json({ user, token });
    })(request, response);
  }
}
