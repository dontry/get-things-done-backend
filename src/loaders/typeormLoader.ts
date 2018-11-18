import "reflect-metadata";
import {
  MicroframeworkSettings,
  MicroframeworkLoader
} from "microframework-w3tec";
import {
  createConnection,
  getConnectionOptions,
  useContainer,
  ConnectionOptions
} from "typeorm";
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
  const loadedConnectionOptions: ConnectionOptions = await getConnectionOptions();
  // const connectionOptions: MongoConnectionOptions = {
  //   type: "mongodb",
  //   host: "localhost",
  //   database: "gtd",
  //   synchronize: true,
  //   logging: false,
  //   entities: ["src/api/models/*.ts"],
  //   cli: {
  //     entitiesDir: "src/api/models"
  //   }
  // };

  const connection = await createConnection(loadedConnectionOptions);
  const userRepository = Container.get(UserRepository);

  const user = new User();
  user.username = "sssso";
  user.password = "adf2313212";
  user.email = "john.joestar@test.com";
  user.name = { firstName: "John", lastName: "Doe" };
  user.age = -1100;
  const userService = new UserService(userRepository);
  const list = await userService.find();
  logger.info("user list:", list);
  const newUser2 = await userService.create(user);
  logger.info("saved user:", newUser2);

  if (settings) {
    settings.setData("connection", connection);
    settings.onShutdown(() => connection.close());
  }
};
