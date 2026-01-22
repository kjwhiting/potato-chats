const request = require("supertest");
const { describe, it, expect } = require("vitest");
const app = require("./index");

describe("Express API Endpoints", () => {
  it("GET /api/message should return 200 status", async () => {
    const res = await request(app).get("/api/message");
    expect(res.statusCode).toEqual(200);
  });

  it("GET /api/message should return the correct JSON text", async () => {
    const res = await request(app).get("/api/message");
    expect(res.body).toHaveProperty("text");
    expect(res.body.text).toBe("Hello from the Express backend!");
  });
});
