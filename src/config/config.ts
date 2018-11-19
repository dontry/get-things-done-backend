import dotenv from "dotenv";
import fs from "fs";
import { logger } from "../utils";

if (fs.existsSync(".env")) {
  logger.debug("Using .env file to supply config environment variables.");
  dotenv.config({ path: ".env" });
}
