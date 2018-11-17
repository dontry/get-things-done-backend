import {
  MicroframeworkSettings,
  MicroframeworkLoader
} from "microframework-w3tec";
import { createConnection, getConnectionOptions } from "typeorm";
import { MongoConnectionOptions } from "typeorm/driver/mongodb/MongoConnectionOptions";
import { User } from "../api/models";
import { UserService } from "../api/services";
import { UserRepository } from "../api/repositories";
import { Container } from "typedi";
import { logger } from "../utils";

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
  const user = new User();
  user.id = "1";
  user.username = "jdoe";
  user.password = "adf2313212";
  user.email = "john.doe@test.com";
  user.name = { firstName: "John", lastName: "Doe" };
  const repository = Container.get(UserRepository);
  const userService = new UserService(repository);
  // const list = await userService.find();
  const list = await connection.manager.find(User);
  logger.info("user list:", list);
  await connection.manager.save(user);
  logger.info("new user:", user);

  if (settings) {
    settings.setData("connection", connection);
    settings.onShutdown(() => connection.close());
  }
};
