import bodyParser from "body-parser";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import SwaggerExpress from "swagger-express-mw";
import logger from "./utils/logger";

dotenv.config({ path: ".env" });
const config = {
  appRoot: __dirname
};
const app = express();

SwaggerExpress.create(config, (err, swaggerExpress) => {
  if (err) {
    logger.error(err.message);
    throw err;
  }

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(
    express.static(path.join(__dirname, "public"), { maxAge: 31557600000 })
  );
  // install middleware
  swaggerExpress.register(app);
  // app.use("/v1/hello", hello_world);

  const port = process.env.PORT || 10010;
  app.listen(port, () => {
    logger.info(`The server is running at http://127.0.0.1:${port}`);
  });

  if (swaggerExpress.runner.swagger.paths["/hello"]) {
    logger.info(
      `try this:\ncurl http://127.0.0.1:${port}/v1/hello?name=Scott}`
    );
  }
});
export default app;
