import request from "supertest";
import app from "../src/server";

describe("Login API (TypeScript)", () => {

  it("should login successfully with correct credentials", async () => {
    const res = await request(app)
      .post("/login")
      .send({
        name: "max",
        password: "1234"
      });

    expect(res.status).toBe(200);
    expect(res.body.user_id).toBe(1);
  });

  it("should fail if no data is sent", async () => {
    const res = await request(app)
      .post("/login")
      .send({});

    expect(res.status).toBe(400);
  });

  it("should fail with wrong credentials", async () => {
    const res = await request(app)
      .post("/login")
      .send({
        name: "wrong",
        password: "wrong"
      });

    expect(res.status).toBe(401);
  });

});