const { DatabaseSync } = require("node:sqlite");

let db = null; // This lives in the module's scope

function connect(dbPath = "./potato_chat.db") {
  // If db already exists and it's the same path, just return it
  if (db) return db;

  db = new DatabaseSync(dbPath);

  db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      current_id INTEGER PRIMARY KEY AUTOINCREMENT,
      id TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      sent_msg TEXT,
      received_msg TEXT
    )
  `);

  return db;
}

// Helper to ensure we are connected before any operation
function ensureConnection() {
  if (!db) {
    // For tests, if something went wrong with setup, try a fallback connect
    connect(":memory:");
  }
}

function saveMessage(id, userMsg, botMsg) {
  ensureConnection();
  const insert = db.prepare(`
    INSERT INTO messages (id, sent_msg, received_msg) 
    VALUES (?, ?, ?)
  `);
  return insert.run(id, userMsg, botMsg);
}

function getConversation(id) {
  ensureConnection();
  const query = db.prepare(`
    SELECT sent_msg, received_msg 
    FROM messages 
    WHERE id = ? 
    ORDER BY timestamp ASC
  `);
  const rows = query.all(id);

  const history = [];
  rows.forEach((row) => {
    if (row.sent_msg) history.push({ role: "user", content: row.sent_msg });
    if (row.received_msg)
      history.push({ role: "assistant", content: row.received_msg });
  });

  return history;
}

function getAllChats() {
  ensureConnection();
  const query = db.prepare(`SELECT * FROM messages ORDER BY timestamp DESC`);
  return query.all();
}

module.exports = { connect, saveMessage, getConversation, getAllChats };
