import { EntityManager } from "typeorm";
import { Task, User } from "../models";
import { MongoRepository, EntityRepository } from "typeorm";
import { InjectManager } from "typeorm-typedi-extensions";

@EntityRepository(Task)
export class TaskRepository extends MongoRepository<Task> {}
