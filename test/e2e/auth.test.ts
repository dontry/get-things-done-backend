import supertest from "supertest";
import { bootstrapServer, IBootstrapSettings } from "../utils/server";
import { User } from "../../src/api/models";
import { logger } from "../../src/utils";
import { sgMail } from "../../src/mailer";
import createUser from "../fixture/createUser";
import { UserService } from "../../src/api/services";
import { Container } from "typedi";
import _ from "lodash";

jest.setTimeout(60000);

let authorizationToken;
const tokenRegex = /token=(\S+)"/;

jest.mock("../../src/mailer", () => {
  return {
    sgMail: {
      send: jest.fn(mailData => {
        return new Promise(res => {
          // logger.info(mailData.html);
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

function registerWith(request) {
  return async user => {
    return await request.post("/v1/auth/register").send(user);
  };
}

describe("/v1/auth", () => {
  let settings: IBootstrapSettings;
  let request;
  let register;

  beforeAll(async done => {
    settings = await bootstrapServer();
    request = supertest(settings.app);
    register = registerWith(request);
    done();
  });

  afterAll(async done => {
    await settings.shutdown();
    jest.clearAllMocks();
    done();
  });

  test("/register", async done => {
    try {
      const mockUser = createUser();
      const response = await register(mockUser);
      const actual: User = response.body;
      logger.info("register user:", actual);
      expect(actual.username).toBe(mockUser.username);
      expect(sgMail.send).toHaveBeenCalledTimes(1); // not sure why it has to be 2
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

  test("/login verfied", async done => {
    const mockUser = createUser();
    mockUser.isVerified = true;
    const userService = Container.get<UserService>(UserService);
    // the save method will change the original object;
    await userService.register(_.cloneDeep(mockUser));
    const res = await request
      .post("/v1/auth/login")
      .send({
        username: mockUser.username,
        password: mockUser.password
      })
      .set("Accept", "application/json")
      .expect(200);
    logger.info(res);
    expect(res.body.data.username).toBe(mockUser.username);
    expect(res.body.token).toBeTruthy();
    done();
  });
});
