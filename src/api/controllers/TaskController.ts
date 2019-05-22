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
  BadRequestError,
  OnUndefined,
  HttpCode
} from "routing-controllers";
import { TaskService } from "../services";
import { JwtAuthMiddleware, AuthorizationMiddleware } from "../middlewares";
import { Task } from "../models";
import ResponseInterceptor from "../interceptors/ResponseInterceptor";
import Pagination from "../types/Pagination";
import { Role } from "../types/Role";
import { logger, ILogger } from "../../utils";
import { Logger } from "../../decorators";

@UseBefore(AuthorizationMiddleware)
@UseBefore(JwtAuthMiddleware)
// @UseInterceptor(ResponseInterceptor())
@JsonController("/tasks")
export class TaskController {
  constructor(
    private taskService: TaskService,
    @Logger() private log: ILogger
  ) {}

  @Get()
  public findAll(
    @QueryParam("limit") limit,
    @QueryParam("page") page,
    @QueryParam("category") category,
    @QueryParam("projectId") projectId,
    @Req() request
  ): Promise<Pagination<Task> | Task[]> {
    const { user } = request;
    if (
      (limit === undefined || page === undefined) &&
      user.role !== Role.ADMIN
    ) {
      throw new BadRequestError("Should have pagination params");
    } else if (limit === undefined || page === undefined) {
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
  @HttpCode(201)
  public create(@Body() task: Task, @Req() request): Promise<Task> {
    const { user } = request;
    task.userId = user.id.toString();
    return this.taskService.create(task);
  }

  @Put("/:id")
  public async update(
    @Param("id") id: string,
    @Body() task: Task
  ): Promise<Task> {
    const updatedTask = await this.taskService.update(id, task);
    return updatedTask;
  }

  @Delete("/:id")
  public delete(@Param("id") id: string): Promise<void> {
    return this.taskService.delete(id);
  }
}
