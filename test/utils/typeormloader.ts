import {
  MicroframeworkLoader,
  MicroframeworkSettings
} from "microframework-w3tec";
import { createDatabaseConnection } from "./Database";

export const typeormLoader: MicroframeworkLoader = async (
  settings: MicroframeworkSettings | undefined
) => {
  const connection = await createDatabaseConnection();
  if (settings) {
    settings.setData("connection", connection);
    settings.onShutdown(() => connection.close());
  }
};
