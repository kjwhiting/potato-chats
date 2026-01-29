const express = require("express");
const potatoChatsDB = require("./DB_Interface");
const { systemContext, aiModel } = require("./src/setup-ai");

potatoChatsDB.connect();

const app = express();

/**
 * We have two endpoints for the active chats
 * post to start the converstion and put to repeatedly have the converstion.
 *
 * To simplify the front end I think having post with /message/id and if the id is not provided we will create a new chat.
 *
 */
app.put("/message/:id", (req, res) => {
  /**
   * Take the original post ID and update the query
   */

  res.json(req.params);
});

app.post("/message", async (req, res) => {
  const userMsg = "Let me know when you're ready to get started";
  const botMsg = "Lets chat about potatoes!";

  const response = await fetch("http://localhost:1234/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: aiModel,
      messages: [
        { role: "system", content: systemContext },
        {
          role: "user",
          content: userMsg,
        },
      ],
      temperature: 0.7,
    }),
  });

  const aiResponseData = await response.json();

  potatoChatsDB.saveMessage("123", null, "", userMsg, botMsg);

  res.json({ id: "123", msg: aiResponseData });
});

app.get("/health", (req, res) => {
  res.json({ text: "Healthy!" });
});

// ONLY start the server if this file is run directly
if (process.env.NODE_ENV !== "test") {
  const PORT = 5000;
  app.listen(PORT, () => console.log(`Server on port ${PORT}`));
}

// Export app for testing
module.exports = app;
