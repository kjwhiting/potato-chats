const express = require("express");
const potatoChatsDB = require("./DB_Interface");
const { systemContext, aiModel } = require("./src/setup-ai");

potatoChatsDB.connect();

const app = express();
app.use(express.json());

app.put("/message/:id", async (req, res) => {
  const { id } = req.params;
  const { message: userContent } = req.body;

  try {
    const history = await potatoChatsDB.getConversation(id);

    const messagesForAI = [
      { role: "system", content: systemContext },
      ...history,
      { role: "user", content: userContent },
    ];

    const aiResponse = await fetch(
      "http://localhost:1234/v1/chat/completions",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: aiModel,
          messages: messagesForAI,
          temperature: 0.7,
        }),
      },
    );

    const aiData = await aiResponse.json();
    const botContent =
      aiData?.choices[0]?.message?.content |
      "There was an error, Try again. What questions do you have about potatoes?";

    await potatoChatsDB.saveMessage(id, userContent, botContent);

    res.json({ id, msg: aiData });
  } catch (error) {
    console.error("Chat Update Error:", error);
    res.status(500).json({ error: "Failed to process potato query" });
  }
});

app.post("/message", async (req, res) => {
  const chatId = Date.now().toString();
  const userMsg = "Let me know when you're ready to get started";

  try {
    const response = await fetch("http://localhost:1234/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: aiModel,
        messages: [
          { role: "system", content: systemContext },
          { role: "user", content: userMsg },
        ],
        temperature: 0.7,
      }),
    });

    const aiResponseData = await response.json();
    const botMsg =
      aiResponseData?.choices[0]?.message?.content |
      "What questions do you have about potatoes?";

    await potatoChatsDB.saveMessage(chatId, userMsg, botMsg);

    res.json({ id: chatId, msg: aiResponseData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to initialize chat" });
  }
});

app.get("/chats", (req, res) => {
  try {
    const allMessages = potatoChatsDB.getAllChats();
    res.json(allMessages);
  } catch (error) {
    console.error("Failed to fetch all chats:", error);
    res.status(500).json({ error: "Could not retrieve potato archives." });
  }
});

app.get("/health", (req, res) => {
  res.json({ text: "Healthy!" });
});

if (process.env.NODE_ENV !== "test") {
  const PORT = 5000;
  app.listen(PORT, () => console.log(`Server on port ${PORT}`));
}

module.exports = app;
