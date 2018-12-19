import request from "supertest";
import { IBootstrapSettings } from "../utils/bootstrap";
import { perpareServer } from "../utils/server";
import { Connection } from "typeorm";
import { createDatabaseConnection, closeDatabase } from "../utils";
import { User } from "../../src/api/models";
import { Jojo } from "../fixture/UserJojo";
import { Role } from "../../src/api/types/Role";
import { Sex } from "../../src/api/types";
jest.setTimeout(30000);

describe("/v1/auth", () => {
  let jojo;
  let settings: IBootstrapSettings;
  let connection: Connection;
  let authorizationToken;
  beforeAll(async done => {
    settings = await perpareServer();
    connection = settings.connection;
    const em = connection.createEntityManager();
    const user = new User();
    const { username, email, password, sex, fullName, age, role } = Jojo;
    user.create(username, password, email, fullName, age, sex, role as Role);
    jojo = await em.save(user);
    done();
  });

  afterAll(async done => {
    if (connection) {
      connection.getMongoRepository(User).clear();
      await closeDatabase(connection);
      done();
    }
  });

  test("/register", async done => {
    request(settings.app)
      .post("/v1/auth/register")
      .send({
        username: "brucelee",
        email: "brucel@gmail.com",
        password: "brucelee&jack18",
        age: 30,
        sex: Sex.MALE,
        fullName: {
          firstName: "Bruce",
          lastName: "Lee"
        }
      })
      .set("Accept", "application/json")
      // .expect("Content-type", /json/)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        const actual: User = res.body;
        expect(actual.username).toBe("brucelee");
        done();
      });
  });

  test("/login", async done => {
    request(settings.app)
      .post("/v1/auth/login")
      .send({
        username: Jojo.username,
        password: Jojo.password
      })
      .set("Accept", "application/json")
      // .expect("Content-type", /json/)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        const actual = res.body;
        expect(actual.user.username).toBe(Jojo.username);
        authorizationToken = actual.token;
        done();
      });
  });
});
