import { User } from "../models";
import {
  EntityRepository,
  MongoRepository,
  Repository,
  EntityManager
} from "typeorm";
import { Service } from "typedi";
import { InjectRepository, InjectManager } from "typeorm-typedi-extensions";

// create custom Repostory class
@EntityRepository(User)
export class UserRepository extends MongoRepository<User> {}
