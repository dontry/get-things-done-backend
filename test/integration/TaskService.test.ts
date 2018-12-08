import { Container } from "typedi";
import { User, Task } from "../../src/api/models";
import { UserService, TaskService } from "../../src/api/services";
import { Connection } from "typeorm";
import { createDatabaseConnection, closeDatabase } from "../utils";
import faker from "faker";

describe("Task service", () => {
  const userId = "adsfas1.123df";
  const title = faker.lorem.words(5);
  const now = Date.now();
  const startAt = Date.now() + 2000;
  const endAt = Date.now() + 3000;

  let connection: Connection;
  beforeAll(async () => {
    connection = await createDatabaseConnection();
  });
  afterAll(() => {
    connection.getMongoRepository(Task).clear();
    closeDatabase(connection);
  });

  test("should create a new task in the database", async done => {
    const task = new Task();
    task.create(title, userId, now);
    const taskService = Container.get<TaskService>(TaskService);
    const actual = await taskService.create(task);
    expect(actual.title).toBe(task.title);
    done();
  });
});
