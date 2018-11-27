import { UserService } from "../services";
import {
  Get,
  Post,
  Body,
  OnUndefined,
  Param,
  JsonController,
  QueryParam,
  UseBefore
} from "routing-controllers";
import { User } from "../models";
import { UserNotFoundError } from "../errors/UserNotFoundError";
import { logger } from "../../utils";

// @UseBefore(LocalAuthMiddleware)
@JsonController("/users")
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @OnUndefined(UserNotFoundError)
  public findByUsername(
    @QueryParam("username") username: string
  ): Promise<User[]> {
    return this.userService.find({ username });
  }

  @Get()
  public find(): Promise<User[]> {
    return this.userService.findAll();
  }

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

  @Post()
  public create(@Body() user: User): Promise<User> {
    logger.debug(`New user: ${JSON.stringify(user)}`);
    return this.userService.create(user);
  }
}
