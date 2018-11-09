import dotenv from "dotenv";
import express from "express";
import SwaggerExpress from "swagger-express-mw";
import logger from "./utils/logger";

dotenv.config({ path: ".env" });

const app = express();
const config = {
  appRoot: __dirname
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
