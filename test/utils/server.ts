import http from "http";
import { Application } from "express";
import { Connection } from "typeorm";
import { bootstrapApp } from "./bootstrap";
import { migrateDatabase } from "./Database";
import { logger } from "../../src/utils";

export interface IBootstrapSettings {
  app: Application;
  connection: Connection;
  shutdown(): void;
}

export const perpareServer = async (options?: { migrate: boolean }) => {
  logger.info(`process.env.NODE_ENV=${process.env.NODE_ENV}. Prepare server.`);
  const framework = await bootstrapApp();
  const app = framework.settings.getData("express_app") as Application;
  const connection = framework.settings.getData("connection") as Connection;
  if (options && options.migrate) {
    logger.debug("database migration");
    await migrateDatabase(connection);
  }

  return {
    app,
    connection,
    shutdown: framework.shutdown.bind(framework)
  } as IBootstrapSettings;
};
