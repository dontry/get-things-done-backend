import { Container } from "typedi";
import { Task, User } from "../../src/api/models";
import { TaskService } from "../../src/api/services";
import { closeDatabase, migrateDatabase } from "../utils";
import faker from "faker";
import { logger } from "../../src/utils";
import { POS_SEQUENCE_STEP } from "../../src/constants";
import { bootstrapServer, IBootstrapSettings } from "../utils/server";
import createTask from "../fixture/createTask";

describe("Task service", () => {
  const startAt = Date.now() + 2000;
  const endAt = Date.now() + 3000;
  let settings: IBootstrapSettings;

  beforeAll(async done => {
    logger.info("beforeall");
    settings = await bootstrapServer({
      migrate: true
    });
    done();
  });

  afterAll(async done => {
    if (settings.connection) {
      await settings.connection.getMongoRepository(User).clear();
      await settings.connection.getMongoRepository(Task).clear();
      settings.shutdown();
    }
    done();
  });

  it("should create a new task in the database with default value", async done => {
    const taskService = Container.get<TaskService>(TaskService);
    const task = createTask();
    const actual = await taskService.create(task);
    expect(actual.title).toBe(task.title);
    expect(typeof actual.pos).toBe("number");
    expect(actual.pos).toBe(0);
    expect(actual.attribute).toBe(task.attribute);
    expect(actual.createdAt).toBe(task.createdAt);
    done();
  });

  it("should delete a task successfully", async done => {
    const taskService = Container.get<TaskService>(TaskService);
    const task = createTask();
    const newTask = await taskService.create(task);
    const deletedTask = await taskService.delete(newTask.id);
    expect(newTask.title).toEqual(deletedTask.title);
    expect(newTask.pos).toEqual(deletedTask.pos);
    done();
  });

  it("should create a new task in the database with incremental pos sequence", async done => {
    const taskService = Container.get<TaskService>(TaskService);
    const task = createTask();
    const actual = await taskService.create(task);
    expect(actual.pos).toBeGreaterThanOrEqual(POS_SEQUENCE_STEP);
    done();
  });

  it("should fail to create a new task due to invalid date", async done => {
    const taskService = Container.get<TaskService>(TaskService);
    const task = createTask();
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
});
