import request from "supertest";
import server from "../../../server";

describe("controllers", () => {
  describe("hello_world", () => {
    describe("GET /hello", () => {
      it("should return a default string", done => {
        request(server)
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
        request(server)
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
});
