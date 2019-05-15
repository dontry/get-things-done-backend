import { Service } from "typedi";
import { InternalServerError } from "routing-controllers";
import { OrmRepository } from "typeorm-typedi-extensions";
import { TaskRepository, SequenceRepository } from "../repositories";
import { ILogger } from "../../utils";
import { Logger } from "../../decorators";
import { Task } from "../models";
import { TASK_POSITION } from "../../constants";
import { ObjectID } from "typeorm";
import { ObjectId } from "bson";

@Service()
export class TaskService {
  public function;
  constructor(
    @OrmRepository() private taskRepository: TaskRepository,
    @OrmRepository() private sequenceRepository: SequenceRepository,
    @Logger() private log: ILogger
  ) {}

  public findAll(userId: string): Promise<Task[]> {
    this.log.info(`Find tasks of user ID ${userId}`);
    return this.taskRepository.find({ userId });
  }

  public async create(task: Task): Promise<Task> {
    this.log.info(`Create a new task => ${task.toString()}`);

    const sequence: number = await this.sequenceRepository.getNextSequenceValue(
      TASK_POSITION
    );
    task.pos = sequence;
    return this.taskRepository.save(task);
  }

  /**
   * update
   */
  public update(id: string, task: Task): Promise<Task> {
    this.log.info("Update a task");
    task.id = new ObjectId(id);
    return this.taskRepository.save(task);
  }

  /**
   * delete
   */
  public async delete(id: string | ObjectID | ObjectId): Promise<any> {
    this.log.info("Delete a task");
    const _id = new ObjectId(id);
    const result = await this.taskRepository.findOneAndDelete({ _id });
    return result.value;
  }
}
