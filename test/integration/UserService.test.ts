import { Container } from "typedi";
import { User } from "../../src/api/models";
import { UserService } from "../../src/api/services";
import { Connection } from "typeorm";
import { createDatabaseConnection, closeDatabase } from "../utils";
import faker from "faker";
import { Sex } from "../../src/api/types";
import { bootstrapServer, IBootstrapSettings } from "../utils/server";
import createUser from "../fixture/createUser";

describe("User service", () => {
  let settings: IBootstrapSettings;

  beforeAll(async done => {
    settings = await bootstrapServer();
    done();
  });
  afterAll(async done => {
    await settings.connection.getMongoRepository(User).clear();
    await closeDatabase(settings.connection);
    done();
  });

  it("should create a new user in the database", async done => {
    const user: User = createUser();
    const userService = Container.get<UserService>(UserService);
    const actual = await userService.create(user);
    if (actual) {
      expect(actual.username).toBe(user.username);
    } else {
      fail("Cannot create user");
    }
    done();
  });

  it("should update the user in the database", async done => {
    const user: User = createUser();
    const userService = Container.get<UserService>(UserService);
    const createdUser: User = await userService.create(user);
    // because the createdUser doesn't have password
    if (createdUser) {
      user.age = 100;
      user.sex = Sex.MALE;
      const actual = await userService.update(createdUser.id.toString(), user);
      if (actual) {
        expect(actual.age).toBe(100);
        expect(actual.sex).toBe(Sex.MALE);
      } else {
        fail("Cannot update user");
      }
    } else {
      fail("Cannot find user");
    }
    done();
  });
});
