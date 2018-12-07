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
  Delete
} from "routing-controllers";
import { User } from "../models";
import { UserNotFoundError } from "../errors/UserNotFoundError";
import { logger } from "../../utils";
import { JwtAuthMiddleware } from "../middlewares";

// @UseBefore(LocalAuthMiddleware)
@UseBefore(JwtAuthMiddleware)
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
    return this.userService.create(user);
  }

  @Delete()
  public delete(@Req() request): Promise<void> {
    const { user } = request;
    return this.userService.delete(user.id);
  }
}
