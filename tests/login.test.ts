import request from "supertest";
import app from "../src/server/api";

describe("Login API", () => {

  test("should login successfully", async () => {
    const res = await request(app)
      .post("/login")
      .send({
        name: "Max",
        password: "1234"
      });

    expect(res.status).toBe(200);
    expect(res.body.user_id).toBeDefined();
  });

});