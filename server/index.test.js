import request from "supertest";
import { describe, it, expect, beforeEach } from "vitest";
import app from "./index";
import { fetchMock } from "./test-setup.js";

describe("Potato Chat API Integration", () => {
  beforeEach(() => {
    fetchMock.mockClear();

    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        choices: [
          {
            message: {
              content: "Default Mock Response",
            },
          },
        ],
      }),
    });
  });

  describe("System Health", () => {
    it("GET /health should return 200 and 'Healthy!'", async () => {
      const res = await request(app).get("/health");
      expect(res.statusCode).toBe(200);
      expect(res.body.text).toBe("Healthy!");
    });
  });

  describe("Chat Endpoints", () => {
    it("POST /message should start a new session and generate a UUID", async () => {
      const res = await request(app).post("/message");

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("id");
      expect(res.body.msg.choices[0].message.content).toBe(
        "Default Mock Response",
      );

      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it("PUT /message/:id should continue a session with provided ID", async () => {
      const customId = "potato-session-999";
      const res = await request(app)
        .put(`/message/${customId}`)
        .send({ message: "Is a sweet potato a real potato?" });

      expect(res.statusCode).toBe(200);
      expect(res.body.id).toBe(customId);
      expect(res.body.msg.choices[0].message.content).toBe(
        "Default Mock Response",
      );

      const lastCall = fetchMock.mock.calls[0];
      const aiRequestBody = JSON.parse(lastCall[1].body);
      const messages = aiRequestBody.messages;

      expect(messages[messages.length - 1].content).toBe(
        "Is a sweet potato a real potato?",
      );
    });

    it("GET /chats should return the raw JSON history from the DB", async () => {
      await request(app).post("/message");

      const res = await request(app).get("/chats");

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);

      if (res.body.length > 0) {
        const firstEntry = res.body[0];
        expect(firstEntry).toHaveProperty("id");
        expect(firstEntry).toHaveProperty("sent_msg");
        expect(firstEntry).toHaveProperty("received_msg");
        expect(firstEntry).toHaveProperty("timestamp");
      }
    });
  });

  describe("Error Handling", () => {
    it("should return 500 if the AI service fails", async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 502,
        statusText: "Bad Gateway",
      });

      const res = await request(app).post("/message");
      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty("error");
    });
  });
});
