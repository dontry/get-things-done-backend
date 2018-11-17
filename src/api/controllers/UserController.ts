import { UserService } from "../services";
import { Get, OnUndefined, Param, HttpError } from "routing-controllers";
import { User } from "../models";
import { UserNotFoundError } from "../errors/UserNotFoundError";

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
