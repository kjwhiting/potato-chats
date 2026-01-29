import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "./index";

describe("Verify health endpoint", () => {
  it("GET /health should return 200 status", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toEqual(200);
    expect(res.body.text).toBe("Healthy!");
  });
});

describe("Verify /message endpoint", () => {
  it("POST /message with no id should create a new chat", async () => {
    fetch.mockResolvedValueOnce({ ok: true });

    const res = await request(app).post("/message");
    expect(res.ok);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("http://localhost:1234/v1/chat/completions"),
      expect.any(Object),
    );
  });

  it("Put /message/:id should return id", async () => {
    const res = await request(app).put("/message/123");
    expect(res.statusCode).toEqual(200);
    expect(res.body.id).toEqual("123");
  });
});
