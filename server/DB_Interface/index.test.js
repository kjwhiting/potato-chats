import { describe, it, expect, beforeEach } from "vitest";
const { connect, saveMessage, getConversation } = require("./index");

describe("Potato AI Database", () => {
  beforeEach(() => {
    // Initialize a fresh RAM-based DB before every single test
    connect(":memory:");
  });

  it("should successfully save a message pair", () => {
    const result = saveMessage(
      "chat_001",
      null,
      "Hello Potato",
      "I am starch.",
    );

    expect(result.changes).toBe(1);
    expect(result.lastInsertRowid).toBe(1);
  });

  it("should retrieve conversation history in the correct order", () => {
    const convoId = "chat_002";

    // Insert two messages
    const first = saveMessage(convoId, null, "Msg 1", "Reply 1");
    saveMessage(convoId, Number(first.lastInsertRowid), "Msg 2", "Reply 2");

    const history = getConversation(convoId);

    expect(history).toHaveLength(2);
    expect(history[0].sent_msg).toBe("Msg 1");
    expect(history[1].sent_msg).toBe("Msg 2");
    // Ensure the chain is linked
    expect(history[1].prev_id).toBe(Number(history[0].current_id));
  });

  it("should return an empty array for a non-existent conversation", () => {
    const history = getConversation("fake_id");
    expect(history).toEqual([]);
  });

  it("should handle special characters in messages", () => {
    const userMsg = "What's up, Potato? { } [ ] ; ' \"";
    const botMsg = "🥔";

    saveMessage("chat_special", null, userMsg, botMsg);
    const history = getConversation("chat_special");

    expect(history[0].sent_msg).toBe(userMsg);
    expect(history[0].received_msg).toBe(botMsg);
  });
});
