import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";
import { User } from "../models";
import { UserRepository } from "../repositories";
import { ObjectID } from "typeorm";
import { validate } from "class-validator";
import { Logger } from "../../decorators";
import { ILogger } from "../../utils";
import _ from "lodash";
import { Role } from "../types/Role";
import { UserNotFoundError } from "../errors";

@Service()
export class UserService {
  constructor(
    @OrmRepository() private userRepository: UserRepository,
    @Logger() private log: ILogger
  ) {}

  /**
   * findAll
   */
  public findAll(): Promise<User[]> {
    this.log.info("Find all users");
    return this.userRepository.find();
  }

  /**
   * find
   */
  public find(params: object): Promise<User[]> {
    this.log.info(`Find users with params: ${JSON.stringify(params)}`);
    return this.userRepository.find(params);
  }

  /**
   * findOne
   */
  public findOne(params): Promise<User | undefined> {
    this.log.info(`Find a user with params: ${JSON.stringify(params)}`);
    return this.userRepository.findOne(params);
  }

  /**
   * count
   */
  public count(): Promise<number> {
    return this.userRepository.count();
  }

  /**
   * findOne
   */
  public findById(id: string | ObjectID): Promise<User | undefined> {
    this.log.info(`Find one user with id ${id}`);
    return this.userRepository.findOne(id);
  }

  /**
   * create
   */
  public async create(user: User): Promise<User> {
    this.log.info(`Create a new user => ${user.toString()}`);
    const errors = await validate(user, { whitelist: true });
    if (errors.length > 0) {
      throw errors;
    }
    return this.userRepository.save(user);
    // this.eventDispatcher.dispatch(events.user.created, newUser);
  }

  /**
   * register
   */
  public async register(user: User): Promise<User> {
    this.log.info(`Register a new subscriber => ${user.toString()}`);
    user.role = Role.SUBSCRIBER;
    const errors = await validate(user, { whitelist: true });
    if (errors.length > 0) {
      throw errors;
    }
    return this.userRepository.save(user);
  }

  /**
   * update
   */
  public async update(id: string | ObjectID, user: User): Promise<User | void> {
    this.log.info("Update a user");
    const oldUser = await this.userRepository.findOne(id);
    if (oldUser) {
      user.id = oldUser.id;
      user.role = oldUser.role;
      const errors = await validate(user, { whitelist: true });
      if (errors.length > 0) {
        throw errors;
      }
      return this.userRepository.save(user);
    } else {
      throw new UserNotFoundError();
    }
  }

  /**
   * change user role
   */
  public async changeRole(
    id: string | ObjectID,
    role: Role
  ): Promise<string | void> {
    const user = await this.findById(id);
    if (user) {
      user.role = role;
      const errors = await validate(user, { whitelist: true });
      if (errors.length > 0) {
        throw errors;
      }
      const newUser = await this.userRepository.save(user);
      return newUser.role;
    } else {
      throw new UserNotFoundError();
    }
  }

  /**
   * delete
   */
  public async deleteById(id: string | ObjectID): Promise<boolean> {
    this.log.info(`Delete user by Id ${id}`);
    await this.userRepository.deleteById(id);
    const user = await this.userRepository.findOne(id);
    return _.isEmpty(user);
  }
}
