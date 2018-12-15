import {
  Get,
  Post,
  Body,
  Param,
  JsonController,
  UseBefore,
  Req,
  Put
} from "routing-controllers";
import { TaskService } from "../services";
import { JwtAuthMiddleware, AuthorizationMiddleware } from "../middlewares";
import { Task } from "../models";

@UseBefore(AuthorizationMiddleware)
@UseBefore(JwtAuthMiddleware)
@JsonController("/tasks")
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get()
  public findAll(@Req() request): Promise<Task[]> {
    const { user } = request;
    return this.taskService.findAll(user.id);
  }

  @Post()
  public create(@Body() task: Task, @Req() request): Promise<Task> {
    const { user } = request;
    task.userId = user.id;
    return this.taskService.create(task);
  }

  @Put("/:id")
  public update(
    @Param("id") id: string,
    @Body() task: Task,
    @Req() request
  ): Promise<Task> {
    const { user } = request;
    task.userId = user.id;
    return this.taskService.update(id, task);
  }
}
