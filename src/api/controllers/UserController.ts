import { UserService } from "../services";
import {
  Get,
  OnUndefined,
  Param,
  HttpError,
  JsonController
} from "routing-controllers";
import { User } from "../models";
import { UserNotFoundError } from "../errors/UserNotFoundError";

@JsonController("/users")
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  public find(): Promise<User[]> {
    return this.userService.find();
  }

  @Get("/:id")
  @OnUndefined(UserNotFoundError)
  public findOne(@Param("id") id: string): Promise<User | undefined> {
    return this.userService.findOne(id);
  }
}
