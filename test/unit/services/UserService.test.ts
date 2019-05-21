import "reflect-metadata";
import { User } from "../../../src/api/models/User";
import { RepositoryMock, LoggerMock } from "../../utils";
import { UserService } from "../../../src/api/services";
import { Sex } from "../../../src/api/types";
import faker from "faker";

faker.seed(2);
describe("UserService", () => {
  const repo = new RepositoryMock<User>();
  const logger = new LoggerMock();

  const username = faker.name.findName();
  const email = faker.internet.email();
  const password = "12nzsd&dasdA";
  const age = 39;
  const sex = Sex.FEMALE;
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const fullName = {
    firstName,
    lastName
  };

  it("should return a list of users", async done => {
    const user = new User();
    user.username = username;
    user.email = email;
    user.password = password;
    user.sex = sex;
    user.fullName = fullName;
    repo.list = [user];
    const userService = new UserService(repo as any, logger as any);
    const actual = await userService.findAll();
    expect(actual.length).toBe(repo.list.length);
    expect(actual[0].username).toBe(user.username);
    done();
  });

  it("should create a user", async done => {
    const user = new User();
    user.email = "jjoestar@test.com";
    const userService = new UserService(repo as any, logger as any);
    const actual = await userService.create(user);
    expect(actual.email).toBe(user.email);
    expect(actual.email).toBe(user.email);

    done();
  });
});
