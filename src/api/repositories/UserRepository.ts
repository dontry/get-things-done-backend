import { User } from "../models";
import { EntityRepository, MongoRepository } from "typeorm";
import { Service } from "typedi";

// create custom Repostory class
@Service()
@EntityRepository(User)
export class UserRepository extends MongoRepository<User> {
  /**
   * findById
   */
  public findByEmail(email: string): Promise<User | undefined> {
    return this.findOne({ email });
  }
}
