import faker from "faker";
import { User } from "../../src/api/models";
import { Sex } from "../../src/api/types";
import { Role } from "../../src/api/types/Role";

export default function createUser(): User {
  const user = new User();

  const firstName = faker.name.firstName();
  user.create(
    firstName,
    "brucelee&Jack18",
    faker.internet.exampleEmail(),
    {
      firstName,
      lastName: faker.name.lastName()
    },
    20,
    Sex.FEMALE,
    Role.SUBSCRIBER
  );

  return user;
}
