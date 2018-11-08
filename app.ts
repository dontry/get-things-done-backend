import bodyParser from "body-parser";
import mongo from "connect-mongo";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import path from "path";
import session from "session";
import SwaggerExpress from "swagger-express-mw";
import logger from "./utils/logger";

dotenv.config({ path: ".env" });

const app = express();
const config = {
  appRoot: __dirname // required config
};

SwaggerExpress.create(config, (err, swaggerExpress) => {
  if (err) {
    logger.error(err.message);
    throw err;
  }

  // install middleware
  swaggerExpress.register(app);

  const port = process.env.PORT || 10010;
  app.listen(port);

  if (swaggerExpress.runner.swagger.paths["/hello"]) {
    logger.info(
      "try this:\ncurl http://127.0.0.1:" + port + "/hello?name=Scott"
    );
  }
});
export default app;
