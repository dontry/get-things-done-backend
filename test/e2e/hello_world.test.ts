import supertest = require("supertest");
import { IBootstrapSettings, bootstrapServer } from "../utils/server";

describe("hello_world", () => {
  let settings: IBootstrapSettings;
  let request;
  beforeAll(async done => {
    settings = await bootstrapServer({ migrate: true });
    request = supertest(settings.app);
    done();
  });

  afterAll(async done => {
    await settings.shutdown();
    done();
  });

  describe("GET /hello", () => {
    it("should return a default string", done => {
      request
        .get("/v1/hello")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          expect(err).toBeFalsy();
          expect(res.body).toEqual("Hello, stranger!");
          done();
        });
    });

    it("should accept a name parameter", done => {
      request
        .get("/v1/hello")
        .query({ name: "Scott" })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          expect(err).toBeFalsy();
          expect(res.body).toEqual("Hello, Scott!");
          done();
        });
    });
  });
});
