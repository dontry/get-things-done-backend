import { TaskService } from "../services";
import {
  Get,
  Post,
  Body,
  Param,
  JsonController,
  QueryParam,
  UseBefore,
  Req
} from "routing-controllers";
import { JwtAuthMiddleware } from "../middlewares";
import { Task } from "../models";

@UseBefore(JwtAuthMiddleware)
@JsonController("/tasks")
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get()
  public findAll(@Req() request): Promise<Task[]> {
    const { user } = request;
    return this.taskService.findAll(user);
  }

  @Post()
  public create(@Body() task: Task, @Req() request): Promise<Task> {
    const { user } = request;
    task.user = user;
    return this.taskService.create(task);
  }
}
