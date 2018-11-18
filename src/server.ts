import dotenv from "dotenv";
import HelloWorldController from "./api/controllers/hello_world";
import path from "path";
import "reflect-metadata";
import { createExpressServer } from "routing-controllers";
import { logger } from "./utils";

dotenv.config({ path: ".env" });
const port = process.env.PORT || 10010;

const app = createExpressServer({
  controllers: [HelloWorldController],
  cors: true,
  routePrefix: "/v1"
});
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.listen(port, () => {
  logger.info(`The server is running at http://127.0.0.1:${port}`);
});

export default app;
