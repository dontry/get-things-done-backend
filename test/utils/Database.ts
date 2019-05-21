import { Container } from "typedi";
import { Connection, createConnection, useContainer } from "typeorm";
import { logger } from "../../src/utils";
import { MongoConnectionOptions } from "typeorm/driver/mongodb/MongoConnectionOptions";

export const createDatabaseConnection = async (
  options: MongoConnectionOptions
): Promise<Connection> => {
  useContainer(Container);
  // connects to test database;
  const connection = await createConnection(options);
  return connection;
};

export const syncDatabase = async (connection: Connection) => {
  await connection.dropDatabase();
  return connection.synchronize(true);
};

export const closeDatabase = (connection: Connection) => {
  return connection.close();
};

export const migrateDatabase = async (connection: Connection) => {
  logger.info("run");
  await connection.dropDatabase();
  return connection.runMigrations();
};
