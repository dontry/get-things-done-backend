import { User } from "../models";
import { EntityRepository, MongoRepository } from "typeorm";

// create custom Repostory class
@EntityRepository(User)
export class UserRepository extends MongoRepository<User> {}
