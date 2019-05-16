import { UserService } from "../services";
import {
  Get,
  Post,
  Body,
  OnUndefined,
  Param,
  JsonController,
  QueryParam,
  UseBefore,
  Req,
  Delete,
  Put,
  UseInterceptor
} from "routing-controllers";
import { User } from "../models";
import { UserNotFoundError } from "../errors/UserNotFoundError";
import { logger } from "../../utils";
import { JwtAuthMiddleware, AuthorizationMiddleware } from "../middlewares";
import ResponseInterceptor from "../interceptors/ResponseInterceptor";

@UseBefore(AuthorizationMiddleware)
@UseBefore(JwtAuthMiddleware)
// @UseInterceptor(ResponseInterceptor())
@JsonController("/users")
export class UserController {
  constructor(private userService: UserService) {}

  @Get("/count")
  public count(): Promise<number> {
    return this.userService.count();
  }

  @Get("/:id")
  @OnUndefined(UserNotFoundError)
  public findById(@Param("id") id: string): Promise<User | undefined> {
    // const objectId: ObjectID = new ObjectID(id);
    return this.userService.findById(id);
  }

  @Delete("/:id")
  public delete(@Param("id") id: string): Promise<boolean> {
    return this.userService.deleteById(id);
  }

  @Put("/:id")
  public changeRole(@Param("id") id: string, @Body() body): Promise<any> {
    const { role } = body;
    return this.userService.changeRole(id, role);
  }

  @Put("/:id")
  public updateUser(@Param("id") id: string, @Body() user): Promise<any> {
    return this.userService.update(id, user);
  }

  @Get()
  public findAll(@Req() request): Promise<User[]> {
    logger.debug(`request user: ${request.user}`);
    return this.userService.findAll();
  }
  @Get()
  @OnUndefined(UserNotFoundError)
  public findByUsername(
    @QueryParam("username") username: string
  ): Promise<User[]> {
    return this.userService.find({ username });
  }

  @Post()
  public create(@Body() user: User): Promise<User> {
    logger.debug(`New user: ${JSON.stringify(user)}`);
    user.isVerified = true;
    return this.userService.create(user);
  }
}
