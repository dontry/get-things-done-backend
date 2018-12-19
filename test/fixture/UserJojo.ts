import { Sex } from "../../src/api/types";
import { Seed, Factory } from "typeorm-seeding";
import { User } from "../../src/api/models";
import { Role } from "../../src/api/types/Role";
import { Connection } from "typeorm";

export const Jojo = {
  username: "Jojo",
  email: "jojo@gmail.com",
  password: "123&123^d",
  sex: Sex.MALE,
  fullName: {
    firstName: "Jonathan",
    lastName: "Jonstar"
  },
  age: 25,
  role: "ADMIN"
};

export class CreateJojo {
  // implements Seed {
  /**
   *  seed
   */
  // public async seed(factory: Factory, connection: Connection): Promise<User> {
  //   const em = connection.createEntityManager();
  //   const user = new User();
  //   const { username, email, password, sex, fullName, age, role } = Jojo;
  //   user.create(username, password, email, fullName, age, sex, role as Role);
  //   return await em.save(user);
  // }
}
