import "reflect-metadata";
import {
  MicroframeworkSettings,
  MicroframeworkLoader
} from "microframework-w3tec";
import { createConnection, getConnectionOptions, useContainer } from "typeorm";
import { MongoConnectionOptions } from "typeorm/driver/mongodb/MongoConnectionOptions";
import { User } from "../api/models";
import { UserService } from "../api/services";
import { UserRepository } from "../api/repositories";
import { Container } from "typedi";
import { logger } from "../utils";

useContainer(Container);
export const typeormLoader: MicroframeworkLoader = async (
  settings: MicroframeworkSettings | undefined
) => {
  logger.debug("typeormLoader is loaded");
  // const loadedConnectionOptions: MongoConnectionOptions = await getConnectionOptions();
  const connectionOptions: MongoConnectionOptions = {
    type: "mongodb",
    host: "localhost",
    database: "gtd",
    synchronize: true,
    logging: false,
    entities: ["src/api/models/*.ts"],
    cli: {
      entitiesDir: "src/api/models"
    }
  };

  const connection = await createConnection(connectionOptions);
  const userRepository = Container.get(UserRepository);

  const user = new User();
  user.username = "jojo";
  user.password = "adf2313212";
  user.email = "john.joestar@test.com";
  user.name = { firstName: "John", lastName: "Doe" };
  // // const userService = new UserService(repository);
  const list = await userRepository.find();
  // // const list = await connection.manager.find(User);
  logger.info("user list:", list);
  // // await connection.manager.save(user);
  // const dd = userRepository.findByEmail(user.email);
  // logger.info("found user:", dd);
  // const newUser = await userRepository.save(user);
  // logger.info("new user:", newUser);
  const newList = await userRepository.findAll();
  logger.info("new list:", newList);
  // user.username = "jojo";
  const newUser2 = await userRepository.save(user);
  logger.info("saved user:", newUser2);

  if (settings) {
    settings.setData("connection", connection);
    settings.onShutdown(() => connection.close());
  }
};
