import { MongoConnectionOptions } from "typeorm/driver/mongodb/MongoConnectionOptions";

const connectionOptions: MongoConnectionOptions = {
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
};

export default connectionOptions;
