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
  let options = {};
  logger.info(`NODE_ENV: ${process.env.NODE_ENV}`);
  if (process.env.NODE_ENV === "production") {
    options = {
      entities: ["dist/src/api/models/*.js"],
      cli: {
        entitiesDir: "dist/src/api/models"
      }
    };
  }
  const connectionOptions = Object.assign(loadedConnectionOptions, options);
  const connection = await createConnection(connectionOptions);

  if (settings) {
    settings.setData("connection", connection);
    settings.onShutdown(() => connection.close());
  }
};
