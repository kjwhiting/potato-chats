import { describe, it, expect } from "vitest";
const { saveMessage, getConversation, getAllChats } = require("./index");

describe("Potato AI Database Logic", () => {
  it("should successfully save and retrieve a message pair", () => {
    const convoId = "chat_001";
    saveMessage(convoId, "User Question", "Potato Answer");

    const history = getConversation(convoId);

    // Verify unrolling logic: 1 row = 2 message objects
    expect(history).toHaveLength(2);
    expect(history[0]).toEqual({ role: "user", content: "User Question" });
    expect(history[1]).toEqual({ role: "assistant", content: "Potato Answer" });
  });

  it("should maintain chronological order across multiple exchanges", () => {
    const convoId = "chat_order";
    saveMessage(convoId, "First", "1");
    saveMessage(convoId, "Second", "2");

    const history = getConversation(convoId);

    expect(history).toHaveLength(4);
    expect(history[0].content).toBe("First");
    expect(history[3].content).toBe("2");
  });

  it("should retrieve all rows for the debug endpoint", () => {
    saveMessage("id_a", "User A", "Bot A");
    saveMessage("id_b", "User B", "Bot B");

    const all = getAllChats();
    // Check that we're seeing all records in the system
    expect(all.length).toBeGreaterThanOrEqual(2);
  });
});
