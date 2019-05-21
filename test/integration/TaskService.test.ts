import { Container } from "typedi";
import { Task } from "../../src/api/models";
import { TaskService } from "../../src/api/services";
import { closeDatabase, migrateDatabase } from "../utils";
import faker from "faker";
import { logger } from "../../src/utils";
import { POS_SEQUENCE_STEP } from "../../src/constants";
import { perpareServer } from "../utils/server";
import { IBootstrapSettings } from "../utils/bootstrap";

describe("Task service", () => {
  const userId = "adsfas1.123df";
  const title = faker.lorem.words(5);
  const createdAt = Date.now();
  const attribute = "inbox";
  const startAt = Date.now() + 2000;
  const endAt = Date.now() + 3000;

  let settings: IBootstrapSettings;
  let taskService: TaskService;
  beforeAll(async done => {
    logger.info("beforeall");
    settings = await perpareServer();
    await migrateDatabase(settings.connection);
    taskService = Container.get<TaskService>(TaskService);
    done();
  });

  afterAll(async done => {
    if (settings.connection) {
      await settings.connection.getMongoRepository(Task).clear();
      closeDatabase(settings.connection);
    }
    await settings.server.close();
    done();
  });

  it("should create a new task in the database with default value", async done => {
    const task = new Task();
    task.create(title, userId, attribute, createdAt);
    const actual = await taskService.create(task);
    expect(actual.title).toBe(task.title);
    expect(typeof actual.pos).toBe("number");
    expect(actual.pos).toBe(0);
    expect(actual.attribute).toBe(attribute);
    expect(actual.createdAt).toBe(createdAt);
    done();
  });

  it("should delete a task successfully", async done => {
    const task = new Task();
    task.create(title, userId, attribute, createdAt);
    const newTask = await taskService.create(task);
    const deletedTask = await taskService.delete(newTask.id);
    expect(newTask).toEqual(deletedTask);
    done();
  });

  it("should create a new task in the database with incremental pos sequence", async done => {
    const task = new Task();
    task.create(title, userId, attribute, createdAt);
    const actual = await taskService.create(task);
    expect(actual.pos).toBeGreaterThanOrEqual(POS_SEQUENCE_STEP);
    done();
  });

  it("should fail to create a new task due to invalid date", async done => {
    const task = new Task();
    task.create(title, userId, attribute, createdAt);
    task.startAt = endAt;
    task.endAt = startAt;
    try {
      await taskService.create(task);
    } catch (e) {
      expect(e).toBeTruthy();
      expect(e.message).toBe(
        "Validation error: startAt should be prior to endAt"
      );
      done();
    }
  });

  it("should fetch tasks with pagination", async done => {
    const actual = await taskService.find(userId, {
      limit: 15,
      page: 0,
      category: "inbox"
    });

    expect(actual.itemCount).toBeGreaterThan(0);
    expect(actual.totalItems).toBeGreaterThan(0);
  });
});
