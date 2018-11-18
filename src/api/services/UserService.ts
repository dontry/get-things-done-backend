import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";
import { User } from "../models";
import { UserRepository } from "../repositories";

@Service()
export class UserService {
  constructor(@OrmRepository() private userRepository: UserRepository) {}

  /**
   * findAll
   */
  public findAll(): Promise<User[]> {
    // this.log.info("Find all users");
    return this.userRepository.find();
  }

  /**
   * find
   */
  public find(params: object): Promise<User[]> {
    // this.log.info("Find all users");
    return this.userRepository.find(params);
  }

  /**
   * findOne
   */
  public findOne(id: string): Promise<User | undefined> {
    // this.log.info(`Find one user with id ${id}`);
    return this.userRepository.findOne({ id });
  }

  /**
   * create
   */
  public create(user: User): Promise<User> {
    // this.log.info(`Create a new user => ${user.toString()}`);
    return this.userRepository.save(user);
    // this.eventDispatcher.dispatch(events.user.created, newUser);
  }

  /**
   * update
   */
  public update(id: string, user: User): Promise<User> {
    // this.log.info("Update a user");
    user.id = id;
    return this.userRepository.save(user);
  }

  /**
   * delete
   */
  public async delete(id: string): Promise<void> {
    // this.log.info("Delete a user");
    this.userRepository.delete(id);
    return;
  }
}
