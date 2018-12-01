import "reflect-metadata";
import {
  MicroframeworkSettings,
  MicroframeworkLoader
} from "microframework-w3tec";
import {
  createConnection,
  getConnectionOptions,
  ConnectionOptions
} from "typeorm";
import { logger } from "../utils";

export const typeormLoader: MicroframeworkLoader = async (
  settings: MicroframeworkSettings | undefined
) => {
  logger.debug("typeormLoader is loaded");
  const loadedConnectionOptions: ConnectionOptions = await getConnectionOptions();
  const connectionOptions = Object.assign(loadedConnectionOptions, {
    type: "mongodb",
    database: "gtd"
  });
  const connection = await createConnection(connectionOptions);

  if (settings) {
    settings.setData("connection", connection);
    settings.onShutdown(() => connection.close());
  }
};
