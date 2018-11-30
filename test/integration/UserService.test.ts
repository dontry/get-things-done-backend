import { Container } from "typedi";
import { Connection } from "typeorm";
import { createDatabaseConnection } from "../utils";

describe("User service", () => {
  const connection: Connection;
  beforeAll(async () => {
    connection = await createDatabaseConnection();
  });
});
