import { bootstrapApp } from "./bootstrap";

export const perpareServer = async (options?: { migrate: boolean }) => {
  const settings = await bootstrapApp();
  if (options && options.migrate) {
    // TODO: migrate database
  }
  return settings;
};
