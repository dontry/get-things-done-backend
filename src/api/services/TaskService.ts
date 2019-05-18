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
import paginate from "../types/paginate";
import Pagination from "../types/Pagination";
import {
  startOfToday,
  endOfToday,
  startOfTomorrow,
  endOfTomorrow
} from "date-fns";

interface IQueryOptions {
  limit: number;
  page: number;
  category?: string;
  projectId?: string;
}

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
    return this.taskRepository.find({ userId: userId.toString() });
  }

  public find(
    userId: string,
    options: IQueryOptions
  ): Promise<Pagination<Task>> {
    this.log.info(`Find tasks of user ID ${userId} with opitons`);
    const { limit, page, category, projectId } = options;
    const paginateOptions = getPaginateOptions(limit, page);
    const queryOptions = getQueryOptions(userId, projectId, category);
    this.log.info(`queryOptions: ${JSON.stringify(queryOptions)}`);

    return paginate<any>(this.taskRepository, paginateOptions, queryOptions);
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
    const taskId = new ObjectId(id);
    const result = await this.taskRepository.findOneAndDelete({
      _id: taskId
    });
    return result.value;
  }
}

function getQueryOptions(
  userId: string,
  projectId: string | undefined,
  category: string | undefined
) {
  let queryOptions: any = { userId: userId.toString() };
  if (projectId) {
    queryOptions = {
      projectId,
      ...queryOptions
    };
  }
  const categoryOption = getOptionByCategory(category);

  queryOptions = {
    ...queryOptions,
    ...categoryOption
  };

  return { where: queryOptions };
}

const active = {
  deleted: 0,
  completed: 0,
  archived: 0
};

function getPaginateOptions(limit: number = 15, page: number = 1) {
  return {
    limit,
    page
  };
}

function getOptionByCategory(category: string | undefined) {
  switch (category) {
    case "inbox":
      return {
        attribute: "inbox",
        ...active
      };
    case "next":
      return {
        attribute: "next",
        ...active
      };
    case "plan":
      return {
        attribute: "plan",
        ...active
      };
    case "today":
      return {
        startAt: {
          $gte: startOfToday().getTime(),
          $lte: endOfToday().getTime()
        },
        ...active
      };
    case "tomorrow":
      return {
        startAt: {
          $gte: startOfTomorrow().getTime(),
          $lte: endOfTomorrow().getTime()
        },
        ...active
      };
    case "scheduled":
      return {
        startAt: {
          startAt: { $gt: 0 }
        },
        ...active
      };
    case "deleted":
      return {
        deleted: {
          $gt: 0
        }
      };
    case "archived":
      return {
        archived: {
          $gt: 0
        }
      };
    default:
      return {};
  }
}
