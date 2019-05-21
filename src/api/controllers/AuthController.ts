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
  OnNull,
  Get,
  BadRequestError,
  QueryParam,
  NotFoundError,
  HttpCode
} from "routing-controllers";
import passport from "passport";
import { UserService } from "../services";
import { classToPlain } from "class-transformer";
import jwt from "jsonwebtoken";
import { User } from "../models";
import {
  JwtAuthMiddleware,
  AuthorizationMiddleware
} from "../../api/middlewares";
import { PRIVATE_KEY, PUBLIC_KEY } from "../../auth";
import { logger } from "../../utils";
import { sgMail } from "../../mailer";
import { IMessage } from "../types/IMessage";

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
              message: info
                ? info.message
                : `Login failed: ${error ? error : "Account not found"}`,
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
  @HttpCode(201)
  public async register(@Body() user: User): Promise<User> {
    // return this.userService.register(user)

    const newUser = await this.userService.register(user);
    logger.debug(`Register a new user ${newUser.id}`);
    const id = newUser.id.toString();

    return new Promise((resolve, reject) => {
      jwt.sign(
        { userId: id }, // the payload should be object
        PRIVATE_KEY,
        {
          expiresIn: "3d",
          algorithm: "RS256"
        },
        async (error, token: string) => {
          try {
            if (error) {
              throw new BadRequestError(`${error.message}`);
            }

            const url = `http://localhost:8686/v1/auth/verify?token=${token}`;
            const mailData = {
              from: "noreply@todo.com",
              to: user.email,
              subject: "Confirm Email",
              text: "prel",
              html: `Please click this <a href="${url}">link</a> to confirm your email`
            };
            await sgMail.send(mailData);
            resolve(user);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  }

  @Get("/verify")
  public async verify(@QueryParam("token") token: string): Promise<IMessage> {
    const { userId } = jwt.verify(token, PUBLIC_KEY);
    const createdUser = await this.userService.findById(userId);
    if (!createdUser) {
      throw new NotFoundError("This account is not registered.");
    } else if (createdUser.isVerified) {
      return { message: "This account is already verified." };
    } else {
      logger.debug(`Verfiy the user ${createdUser.id}`);
      const id = createdUser.id.toString();
      await this.userService.patch(id, { isVerified: true });
      return { message: "This account is verified." };
    }
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
