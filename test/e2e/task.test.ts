import supertest from "supertest";
import { bootstrapServer, IBootstrapSettings } from "../utils/server";
import login from "../utils/login";
import user from "../fixture/TestUser";
import createTask from "../fixture/createTask";
import { Task } from "../../src/api/models";
import { logger } from "../../src/utils";
jest.setTimeout(60000);

const URL = "/v1/tasks";

describe("/v1/tasks", () => {
  let settings: IBootstrapSettings;
  let request;
  let accessToken;

  beforeAll(async done => {
    settings = await bootstrapServer({ migrate: true });
    request = supertest(settings.app);
    accessToken = await login(request, {
      username: user.username,
      password: user.password
    });
    done();
  });

  afterAll(async done => {
    await settings.shutdown();
    done();
  });

  describe("GET", () => {
    test("query: {}", done => {
      request
        .get(`${URL}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .accept("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err) {
            throw err;
          }
          expect(res.body.length).toBeGreaterThan(0);
          done();
        });
    });

    test("query: {limit:15,  page:1}", async done => {
      request
        .get(`${URL}`)
        .query("limit=15")
        .query("page=1")
        .set("Authorization", `Bearer ${accessToken}`)
        .accept("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err) {
            throw err;
          }
          expect(res.body.items.length).toBeGreaterThan(0);
          expect(res.body.itemCount).toBeGreaterThan(0);
          expect(res.body.totalItems).toBeGreaterThan(0);
          expect(res.body.pageCount).toBeGreaterThan(0);
          done();
        });
    });

    test("query: {limit:15, page: 1, category: 'inbox'}", async done => {
      request
        .get(`${URL}`)
        .query(`category="inbox"`)
        .query("limit=15") // if query param is string, we can not use object to represent
        .query("page=1")
        .set("Authorization", `Bearer ${accessToken}`)
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err) {
            throw err;
          }
          expect(res.body.items.length).toBeGreaterThan(0);
          expect(res.body.items[0].attribute).toBe("inbox");
          expect(res.body.itemCount).toBeGreaterThan(0);
          expect(res.body.totalItems).toBeGreaterThan(0);
          expect(res.body.pageCount).toBeGreaterThan(0);
          done();
        });
    });
  });

  describe("POST", () => {
    it(" create one task", done => {
      const task = createTask();
      request
        .post(`${URL}`)
        .send(task)
        .set("Authorization", `Bearer ${accessToken}`)
        .accept("Accept", "application/json")
        .expect(201)
        .end((err, res) => {
          if (err) {
            throw err;
          }
          expect(res.body.title).toEqual(task.title);
          done();
        });
    });
  });

  describe("/:id PUT", () => {
    it("update a task", async done => {
      const task = createTask();
      const response = await request
        .post(`${URL}`)
        .send(task)
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(201)
        .accept("Accept", "application/json");
      const newTask = response.body;

      newTask.title = "hello world";
      logger.info("newTask:", newTask);

      request
        .put(`${URL}/${newTask.id}`)
        .send(newTask)
        .set("Authorization", `Bearer ${accessToken}`)
        .accept("Accept", "application/json")
        // .expect(200)
        .end((err, res) => {
          if (err) {
            throw err;
          }
          expect(res.body.title).toBe("hello world");
          done();
        });
    });
  });
});
