import { User, Task, Project } from "../models";
import {
  EntityRepository,
  ObjectID,
  MongoRepository,
  MongoEntityManager
} from "typeorm";
import { InjectManager } from "typeorm-typedi-extensions";
import { Service } from "typedi";
import _ from "lodash";

// create custom Repostory class
@EntityRepository(User)
@Service()
export class UserRepository extends MongoRepository<User> {
  constructor(@InjectManager() private entityManager: MongoEntityManager) {
    super();
  }

  public async deleteById(id: ObjectID): Promise<void> {
    await this.entityManager.deleteMany(Task, { userId: id });
    await this.entityManager.deleteMany(Project, { userId: id });
    await this.delete({ id });
  }
}
