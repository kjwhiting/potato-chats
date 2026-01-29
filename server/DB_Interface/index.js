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
      prev_id INTEGER,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      sent_msg TEXT,
      received_msg TEXT
    )
  `);

  return db;
}

function saveMessage(id, previd, userMsg, botMsg) {
  if (!db) throw new Error("Database not connected. Call connect() first.");

  const insert = db.prepare(`
    INSERT INTO messages (id, prev_id, sent_msg, received_msg) 
    VALUES (?, ?, ?, ?)
  `);
  return insert.run(id, previd, userMsg, botMsg);
}

function getConversation(id) {
  if (!db) throw new Error("Database not connected. Call connect() first.");

  const query = db.prepare(`
    SELECT * FROM messages 
    WHERE id = ? 
    ORDER BY timestamp ASC
  `);
  return query.all(id);
}

module.exports = {
  connect,
  saveMessage,
  getConversation,
};
