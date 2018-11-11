import dotenv from "dotenv";
import fs from "fs";
import Logger from "../utils/logger";

if (fs.existsSync(".env")) {
  Logger.debug("Using .env file to supply config environment variables.");
  dotenv.config({ path: ".env" });
}
