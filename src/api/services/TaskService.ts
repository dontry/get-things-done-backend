import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";
import { TaskRepository } from "../repositories";
import { ILogger } from "../../utils";
import { Logger } from "../../decorators";
import { Task, User } from "../models";
import { ObjectID } from "typeorm";

@Service()
export class TaskService {
  constructor(
    @OrmRepository() private taskRepository: TaskRepository,
    @Logger() private log: ILogger
  ) {}

  public findAll(userId: string): Promise<Task[]> {
    this.log.info(`Find tasks of user ID ${userId}`);
    return this.taskRepository.find({ userId });
  }

  public create(task: Task): Promise<Task> {
    this.log.info(`Create a new task => ${task.toString()}`);
    return this.taskRepository.save(task);
  }

  /**
   * update
   */
  public update(id: string, task: Task): Promise<Task> {
    this.log.info("Update a task");
    task.id = new ObjectID(id);
    return this.taskRepository.save(task);
  }
}
