import supertest from "supertest";
import { IBootstrapSettings } from "../utils/bootstrap";
import { perpareServer } from "../utils/server";
import { closeDatabase } from "../utils";
import { User } from "../../src/api/models";
import { logger } from "../../src/utils";
import { sgMail } from "../../src/mailer";
import createUser from "../fixture/createUser";

jest.setTimeout(60000);

let authorizationToken;
const tokenRegex = /token=(\S+)"/;
jest.mock("../../src/mailer", () => {
  return {
    sgMail: {
      send: jest.fn(mailData => {
        return new Promise(res => {
          logger.info(mailData.html);
          const result = tokenRegex.exec(mailData.html);
          if (result) {
            authorizationToken = result[1];
          }
          res(mailData.html);
        });
      }),
      setApiKey: jest.fn(key => key)
    }
  };
});

describe("/v1/auth", () => {
  let settings: IBootstrapSettings;
  let request;
  let register;

  beforeAll(async done => {
    logger.info("beforeall");
    settings = await perpareServer();
    request = supertest(settings.server);
    register = registerWith(request);
    done();
  });

  afterAll(async done => {
    if (settings.connection) {
      await closeDatabase(settings.connection);
    }
    await settings.server.close();
    jest.clearAllMocks();
    jest.clearAllTimers();
    done();
  });

  afterEach(async done => {
    if (settings.connection) {
      await settings.connection.getMongoRepository(User).clear();
    }
    done();
  });

  test("/register", async done => {
    try {
      const mockUser = createUser();
      const response = await register(mockUser);
      const actual: User = response.body;
      logger.info("register user:", actual);
      expect(actual.username).toBe(mockUser.username);
      done();
    } catch (error) {
      return done(error);
    }
  });

  test("/login not verified", async done => {
    const mockUser = createUser();
    await register(mockUser);

    const res = await request
      .post("/v1/auth/login")
      .send({
        username: mockUser.username,
        password: mockUser.password
      })
      .set("Accept", "application/json")
      // .expect("Content-type", /json/)
      .expect(401);

    expect(res.body.name).toBe("Unauthorized");
    expect(res.body.message).toBe(
      "Login failed: The account has not been verified yet."
    );
    expect(sgMail.send).toHaveBeenCalledTimes(2); // not sure why it has to be 2
    done();
  });

  test("/verify", async done => {
    const mockUser = createUser();
    await register(mockUser);
    const res = await request
      .get("/v1/auth/verify")
      .query({ token: authorizationToken })
      .set("Accept", "application/json")
      // .expect("Content-type", /json/)
      .expect(200);

    expect(res.body.message).toBe("This account is verified.");
    done();
  });
});

function registerWith(_r) {
  return async user => {
    return await _r.post("/v1/auth/register").send(user);
  };
}
