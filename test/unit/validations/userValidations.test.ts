import faker from "faker";
import { validate } from "class-validator";
import { User } from "../../../src/api/models/User";

faker.seed(10);

describe("User validations:", () => {
  const username = faker.name.findName();
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const fullName = {
    firstName,
    lastName
  };
  const email = faker.internet.email();
  const password = faker.internet.password();

  it("should have a username", async done => {
    const user = new User();
    user.username = username;
    user.password = password;
    user.email = email;
    const errors = await validate(user);
    expect(errors.length).toBeGreaterThanOrEqual(1);
    const usernameError = errors.find(e => e.property === "username");
    if (usernameError) {
      expect(usernameError.constraints.isNotEmpty).toBeDefined();
    } else {
      expect(false).toBeTruthy();
    }
    done();
  });
});
