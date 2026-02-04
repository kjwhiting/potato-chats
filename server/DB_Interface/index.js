const { DatabaseSync } = require("node:sqlite");

let db = null;

/**
 * Initializes the connection to a specific file.
 * @param {string} dbPath - Path to the sqlite file or ':memory:'
 */
function connect(dbPath = "./potato_chat.db") {
  db = new DatabaseSync(dbPath);

  // Ensure table exists on connection
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

function saveMessage(id, userMsg, botMsg) {
  if (!db) throw new Error("Database not connected. Call connect() first.");

  const insert = db.prepare(`
    INSERT INTO messages (id, sent_msg, received_msg) 
    VALUES (?, ?, ?)
  `);
  return insert.run(id, userMsg, botMsg);
}

function getConversation(id) {
  if (!db) throw new Error("Database not connected.");

  const query = db.prepare(`
    SELECT sent_msg, received_msg 
    FROM messages 
    WHERE id = ? 
    ORDER BY timestamp ASC
  `);

  const rows = query.all(id);

  const history = [];
  rows.forEach((row) => {
    if (row.sent_msg) {
      history.push({ role: "user", content: row.sent_msg });
    }
    if (row.received_msg) {
      history.push({ role: "assistant", content: row.received_msg });
    }
  });

  return history;
}

module.exports = {
  connect,
  saveMessage,
  getConversation,
};
