import { Container } from "typedi";
import { User } from "../../src/api/models";
import { UserService } from "../../src/api/services";
import { Connection } from "typeorm";
import { createDatabaseConnection, closeDatabase } from "../utils";
import faker from "faker";
import { Sex } from "../../src/api/types";

describe("User service", () => {
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
  let user;

  let connection: Connection;
  beforeAll(async () => {
    connection = await createDatabaseConnection();
  });
  afterAll(() => {
    connection.getMongoRepository(User).clear();
    closeDatabase(connection);
  });

  test("should create a new user in the database", async done => {
    user = new User();
    user.create(username, password, email, fullName, age, sex);
    const userService = Container.get<UserService>(UserService);
    const actual = await userService.create(user);
    if (actual) {
      expect(actual.username).toBe(user.username);
    } else {
      fail("Cannot create user");
    }
    done();
  });

  test("should update the user in the database", async done => {
    const userService = Container.get<UserService>(UserService);
    const createdUser = await userService.findOne({
      username
    });
    if (createdUser) {
      createdUser.age = 100;
      createdUser.sex = Sex.MALE;
      const actual = await userService.update(createdUser.id, createdUser);
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
