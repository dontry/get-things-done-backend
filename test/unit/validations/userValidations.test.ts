import faker from "faker";
import { validate } from "class-validator";
import { User } from "../../../src/api/models/User";
import { Sex } from "../../../src/api/types/Sex";

faker.seed();

describe("User validations:", () => {
  const username = faker.name.findName();
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const fullName = {
    firstName,
    lastName
  };
  const email = faker.internet.email();
  const password = "Jojo88@xx.yck";
  const age = 20;
  const sex = Sex.MALE;

  it("should have a username", async done => {
    const user = new User();
    user.password = password;
    user.email = email;
    const errors = await validate(user);
    const usernameError = errors.find(e => e.property === "username");
    if (usernameError) {
      expect(usernameError.constraints.isNotEmpty).toBeDefined();
    } else {
      expect(false).toBeTruthy();
    }

    user.username = username;
    const errors2 = await validate(user);
    const usernameError2 = errors2.find(e => e.property === "username");
    expect(usernameError2).toBeUndefined();

    done();
  });

  it("should have a password", async done => {
    const user = new User();
    user.username = username;
    user.email = email;
    const errors = await validate(user);
    const passwordError = errors.find(e => e.property === "password");
    if (passwordError) {
      expect(passwordError.constraints.isNotEmpty).toBeDefined();
    } else {
      expect(false).toBeTruthy();
    }

    user.password = password;
    const errors2 = await validate(user);
    const passwordError2 = errors2.find(e => e.property === "password");
    expect(passwordError2).toBeUndefined();

    done();
  });

  it("should only accept the password with required characters", async done => {
    const user = new User();
    user.username = username;
    user.email = email;
    user.password = "xxxx";
    const errors = await validate(user);
    const passwordError = errors.find(e => e.property === "password");
    if (passwordError) {
      expect(passwordError.constraints.PasswordPattern).toBeDefined();
    } else {
      expect(false).toBeTruthy();
    }

    user.password = "Jojo88@xx.yck";
    const errors2 = await validate(user);
    const passwordError2 = errors2.find(e => e.property === "password");
    expect(passwordError2).toBeUndefined();

    done();
  });

  it("should only accept the user whose age is greater than 10", async done => {
    const user = new User();
    user.username = username;
    user.email = email;
    user.password = password;
    user.age = 9;
    const errors = await validate(user);
    const passwordError = errors.find(e => e.property === "age");
    if (passwordError) {
      expect(passwordError.constraints.min).toBeDefined();
    } else {
      expect(false).toBeTruthy();
    }

    user.age = age;
    const errors2 = await validate(user);
    const passwordError2 = errors2.find(e => e.property === "age");
    expect(passwordError2).toBeUndefined();

    done();
  });

  it("should only accept the valid email address", async done => {
    const user = new User();
    user.username = username;
    user.email = "invalid emal";
    user.password = password;
    user.age = age;
    const errors = await validate(user);
    const emailError = errors.find(e => e.property === "email");
    if (emailError) {
      expect(emailError.constraints.isEmail).toBeDefined();
    } else {
      expect(false).toBeTruthy();
    }

    user.email = email;
    const errors2 = await validate(user);
    const emailError2 = errors2.find(e => e.property === "email");
    expect(emailError2).toBeUndefined();
    done();
  });

  it("should only accept MALE, FEMALE, and OTHER for sex", async done => {
    const user = new User();
    user.username = username;
    user.email = "invalid emal";
    user.password = password;
    user.age = age;
    user.email = email;
    user.sex = sex;
    const errors = await validate(user);
    expect(errors.length).toEqual(0);
    done();
  });
});
