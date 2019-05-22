import {
  MicroframeworkLoader,
  MicroframeworkSettings
} from "microframework-w3tec";
import { createDatabaseConnection } from "./Database";
import databaseOptions from "../fixture/databaseOption";

export const typeormLoader: MicroframeworkLoader = async (
  settings: MicroframeworkSettings | undefined
) => {
  const connection = await createDatabaseConnection(databaseOptions);
  if (settings) {
    settings.setData("connection", connection);
    settings.onShutdown(async () => {
      connection.dropDatabase();
      connection.close();
    });
  }
};
