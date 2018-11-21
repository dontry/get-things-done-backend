import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";
import { User } from "../models";
import { UserRepository } from "../repositories";
import { ObjectID } from "typeorm";
import { validate } from "class-validator";

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
  public findById(id: string): Promise<User | undefined> {
    // this.log.info(`Find one user with id ${id}`);
    return this.userRepository.findOne(id);
  }

  /**
   * create
   */
  public create(user: User): Promise<User> {
    // this.log.info(`Create a new user => ${user.toString()}`);
    return new Promise((resolve, reject) =>
      validate(user).then(errors => {
        if (errors.length > 0) {
          reject(errors);
        } else {
          resolve(this.userRepository.save(user));
        }
      })
    );
    // this.eventDispatcher.dispatch(events.user.created, newUser);
  }

  /**
   * update
   */
  public update(id: string, user: User): Promise<User> {
    // this.log.info("Update a user");
    user.id = new ObjectID(id);
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
