import {
  Get,
  Post,
  Body,
  Param,
  JsonController,
  UseBefore,
  Req,
  Put,
  Delete,
  UseInterceptor
} from "routing-controllers";
import { TaskService } from "../services";
import { JwtAuthMiddleware, AuthorizationMiddleware } from "../middlewares";
import { Task } from "../models";
import ResponseInterceptor from "../interceptors/ResponseInterceptor";

@UseBefore(AuthorizationMiddleware)
@UseBefore(JwtAuthMiddleware)
// @UseInterceptor(ResponseInterceptor())
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

  @Delete("/:id")
  public delete(@Param("id") id: string): Promise<void> {
    return this.taskService.delete(id);
  }
}
