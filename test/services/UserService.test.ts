import "reflect-metadata";
import { User } from "../../src/api/models/User";
import { RepositoryMock } from "../lib";
import { UserService } from "../../dist/src/api/services";

describe("UserService", () => {
  it("should return a list of users", async done => {
    const repo = new RepositoryMock();
    const user = new User();
    user.username = "jojo";
    user.email = "jjoestar@test.com";
    repo.list = [user];
    const userService = new UserService(repo);
    const actual = await userService.findAll();
    expect(actual.length).toBe(repo.list.length);
    expect(actual[0].username).toBe(user.username);
    done();
  });

  it("should create a user", async done => {
    const repo = new RepositoryMock();
    const user = new User();
    user.email = "jjoestar@test.com";
    const userService = new UserService(repo);
    try {
      await userService.create(user);
    } catch (error) {
      expect(error.length).toBe(3);
    } finally {
      done();
    }
  });
});
