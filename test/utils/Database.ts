import { Container } from "typedi";
import { Connection, createConnection, useContainer } from "typeorm";

export const createDatabaseConnection = async (): Promise<Connection> => {
  useContainer(Container);
  const connection = await createConnection({
    type: "mongodb",
    database: "test",
    logging: true,
    entities: ["src/api/models/*.ts"],
    migrations: ["src/database/migrations/*.ts"],
    cli: {
      entitiesDir: "src/api/models",
      migrationsDir: "src/database/migrations"
    },
    synchronize: true
  });
  return connection;
};

export const syncDatabase = async (connection: Connection) => {
  await connection.dropDatabase();
  return connection.synchronize(true);
};

export const closeDatabase = (connection: Connection) => {
  return connection.close();
};
