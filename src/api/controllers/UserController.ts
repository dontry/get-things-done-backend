import { UserService } from "../services";
import { Get, OnUndefined, Param } from "routing-controllers";
import { User } from "../models";

export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  public find(): Promise<User[]> {
    return this.userService.find();
  }

  @Get("/:id")
  // @OnUndefined("xxx")
  public findOne(@Param("id") id: string): Promise<User> {
    return this.userService.findOne(id);
  }
}
