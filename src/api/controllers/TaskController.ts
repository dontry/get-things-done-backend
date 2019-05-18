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
  UseInterceptor,
  QueryParams,
  QueryParam,
  BadRequestError
} from "routing-controllers";
import { TaskService } from "../services";
import { JwtAuthMiddleware, AuthorizationMiddleware } from "../middlewares";
import { Task } from "../models";
import ResponseInterceptor from "../interceptors/ResponseInterceptor";
import Pagination from "../types/Pagination";
import { Role } from "../types/Role";

@UseBefore(AuthorizationMiddleware)
@UseBefore(JwtAuthMiddleware)
// @UseInterceptor(ResponseInterceptor())
@JsonController("/tasks")
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get()
  public findAll(
    @QueryParam("limit") limit,
    @QueryParam("page") page,
    @QueryParam("category") category,
    @QueryParam("projectId") projectId,
    @Req() request
  ): Promise<Pagination<Task> | Task[]> {
    const { user } = request;
    if ((!limit || !page) && user.role !== Role.ADMIN) {
      throw new BadRequestError("Should have pagination params");
    } else if (!limit || !page) {
      return this.taskService.findAll(user.id.toString());
    } else {
      return this.taskService.find(user.id, {
        limit,
        page,
        category,
        projectId
      });
    }
  }

  @Post()
  public create(@Body() task: Task, @Req() request): Promise<Task> {
    const { user } = request;
    task.userId = user.id.toString();
    return this.taskService.create(task);
  }

  @Put("/:id")
  public update(@Param("id") id: string, @Body() task: Task): Promise<Task> {
    return this.taskService.update(id, task);
  }

  @Delete("/:id")
  public delete(@Param("id") id: string): Promise<void> {
    return this.taskService.delete(id);
  }
}
