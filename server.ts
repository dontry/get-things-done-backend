import bodyParser from "body-parser";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import hello from "./api/controllers/hello_world";
import logger from "./utils/logger";

dotenv.config({ path: ".env" });
const port = process.env.PORT || 10010;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  express.static(path.join(__dirname, "public"), { maxAge: 31557600000 })
);
app.use("/v1/hello", hello);
app.listen(port, () => {
  logger.info(`The server is running at http://127.0.0.1:${port}`);
});

export default app;
