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
@Service()
// @EntityRepository(User)
export class UserRepository {
  /**
   * findById
   */
  @InjectManager()
  private entityManager: EntityManager;

  constructor(
    @InjectRepository(User) private repository: MongoRepository<User>
  ) {}
  public findByEmail(email: string): Promise<User | undefined> {
    return this.repository.findOne({ email });
  }

  public find() {
    return this.repository.find();
  }

  public findAll() {
    return this.entityManager.find(User);
  }

  public findOne({ id }) {
    return this.repository.findOne({ id });
  }

  public save(user: User): Promise<User> {
    return this.repository.save(user);
  }

  public saveUsingManager(user: User): Promise<User> {
    return this.entityManager.save(user);
  }

  public create(user: User) {
    return this.repository.create(user);
  }

  public delete(id: string) {
    return this.repository.delete(id);
  }
}
