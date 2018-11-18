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

  if (settings) {
    settings.setData("connection", connection);
    settings.onShutdown(() => connection.close());
  }
};
