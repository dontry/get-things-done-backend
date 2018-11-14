import { User } from "../models";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  /**
   * findById
   */
  public findById(id: string): Promise<User[]> {
   return this.creat 
  }

}
