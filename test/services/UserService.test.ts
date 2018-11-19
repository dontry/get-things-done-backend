import { User } from "../../src/api/models/User";
import { RepositoryMock } from "../lib";
import { UserService } from "../../dist/src/api/services";

describe("UserService", () => {
  it("should return a list of users", async () => {
    const repo = new RepositoryMock();
    const user = new User();
    user.username = "jojo";
    user.email = "jjoestar@test.com";
    repo.list = [user];
    const userService = new UserService(repo);
    const list = await userService.findAll();
    expect(list.length).toBe(repo.list.length);
    expect(list[0].username).toBe(user.username);
  });
});
