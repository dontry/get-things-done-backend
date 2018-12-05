import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";
import { TaskRepository } from "../repositories";
import { ILogger } from "../../utils";
import { Logger } from "../../decorators";
import { Task, User } from "../models";

@Service()
export class TaskService {
  constructor(
    @OrmRepository() private taskRepository: TaskRepository,
    @Logger() private log: ILogger
  ) {}

  public findAll(user: User): Promise<Task[]> {
    this.log.info(`Find tasks of user ${user.id}`);
    return this.taskRepository.find({ user });
  }

  public create(task: Task): Promise<Task> {
    this.log.info(`Create a new task => ${task.toString()}`);
    return this.taskRepository.save(task);
  }
}
