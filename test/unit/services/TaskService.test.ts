import "reflect-metadata";
import faker from "faker";
import { RepositoryMock, LoggerMock } from "../../utils";
import { Task, Sequence } from "../../../src/api/models";
import { TaskService } from "../../../src/api/services";

faker.seed(100);
describe("TaskService", () => {
  const taskRepo = new RepositoryMock<Task>();
  const sequenceRepo = new RepositoryMock<Sequence>();

  const logger = new LoggerMock();
  const userId = "adfad212asdf";
  const title = faker.lorem.words(5);
  const now = Date.now();
  const startAt = Date.now() + 2000;
  const endAt = Date.now() + 3000;
  let taskService;

  beforeEach(async () => {
    taskService = new TaskService(
      taskRepo as any,
      sequenceRepo as any,
      logger as any
    );
  });

  it("should create a task", async done => {
    const task = new Task();
    task.title = title;
    task.userId = userId;
    task.createdAt = now;
    task.startAt = endAt;
    task.endAt = startAt;
    const actual = await taskService.create(task);
    expect(actual).toStrictEqual(task);
    done();
  });
});
