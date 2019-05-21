import { bootstrapApp } from "./bootstrap";
import { migrateDatabase } from "./Database";
import { logger } from "../../src/utils";

export const perpareServer = async (options?: { migrate: boolean }) => {
  logger.info("prepare server.");
  const settings = await bootstrapApp();
  if (options && options.migrate) {
    logger.debug("database migration");
    await migrateDatabase(settings.connection);
  }
  return settings;
};
