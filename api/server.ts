import bodyParser from "body-parser";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import SwaggerExpress from "swagger-express-mw";
import { getHello } from "./controllers/hello_world";
import logger from "./utils/logger";

dotenv.config({ path: ".env" });
const port = process.env.PORT || 10010;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/hello", getHello);
app.use(
  express.static(path.join(__dirname, "public"), { maxAge: 31557600000 })
);
app.listen(port, () => {
  logger.info(`The server is running at http://127.0.0.1:${port}`);
});

// SwaggerExpress.create(config, (err, swaggerExpress) => {
//   if (err) {
//     logger.error(err.message);
//     throw err;
//   }

//   // install middleware
//   swaggerExpress.reggister(app);

//   const port = process.env.PORT || 10010;
//   app.listen(port);

//   if (swaggerExpress.runner.swagger.paths["/hello"]) {
//     logger.info(`try this:\ncurl http://127.0.0.1:${port}/hello?name=Scott}`);
//   }
// });
export default app;
