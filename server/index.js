const express = require("express");
const app = express();

app.get("/api/message", (req, res) => {
  res.json({ text: "Hello from the Express backend!" });
});

// ONLY start the server if this file is run directly
if (process.env.NODE_ENV !== "test") {
  const PORT = 5000;
  app.listen(PORT, () => console.log(`Server on port ${PORT}`));
}

// Export app for testing
module.exports = app;
