import "reflect-metadata";
import { User } from "../../../src/api/models/User";
import { RepositoryMock, LoggerMock } from "../../utils";
import { UserService } from "../../../src/api/services";
import createUser from "../../fixture/createUser";

describe("UserService", () => {
  const repo = new RepositoryMock<User>();
  const logger = new LoggerMock();

  afterEach(() => {
    repo.clear();
  });

  it("should create a user", async done => {
    const user = createUser();
    const userService = new UserService(repo as any, logger as any);
    const actual = await userService.create(user);
    expect(actual.email).toBe(user.email);
    expect(actual.sex).toBe(user.sex);

    done();
  });

  it("should return a list of users", async done => {
    const user = createUser();
    const userService = new UserService(repo as any, logger as any);
    await userService.create(user);
    const actual = await userService.findAll();
    expect(actual.length).toBe(repo.list.length);
    expect(actual[0].username).toBe(user.username);
    done();
  });
});
