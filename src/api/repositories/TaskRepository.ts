import { Task } from "../models";
import { MongoRepository, EntityRepository } from "typeorm";

@EntityRepository(Task)
export class TaskRepository extends MongoRepository<Task> {}
