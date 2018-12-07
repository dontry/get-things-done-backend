import "reflect-metadata";
import faker from "faker";
import { RepositoryMock, LoggerMock } from "../../utils";
import { Task } from "../../../src/api/models";
import { TaskService } from "../../../src/api/services";

faker.seed(100);
describe("TaskService", () => {
  const repo = new RepositoryMock<Task>();
  const logger = new LoggerMock();
  const userId = "adfad212asdf";
  const title = faker.lorem.words(5);
  const now = Date.now();
  const startAt = Date.now() + 2000;
  const endAt = Date.now() + 3000;
  let taskService;

  beforeEach(async () => {
    taskService = new TaskService(repo as any, logger as any);
  });

  it("should create a task", async done => {
    const task = new Task();
    task.title = title;
    task.userId = userId;
    task.now = now;
    task.startAt = endAt;
    task.endAt = startAt;
    const actual = await taskService.create(task);
    expect(actual).toStrictEqual(task);
    done();
  });
});
