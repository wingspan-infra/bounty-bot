const Database = require('better-sqlite3');
const path = require('path');

// This database will store your active brokerage orders
const db = new Database(path.join(__dirname, '../data/brokerage.db'));

// Initialize tables based on the Python 'BountyDb' logic
db.exec(`
  -- Tracking specific J-code requests (e.g., J123456 for a specific client)
  CREATE TABLE IF NOT EXISTS specific_orders (
    sysId INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    customer TEXT,
    comments TEXT,
    date_added TEXT
  );

  -- Tracking generic requirements (e.g., "Any C2 with a C5 static")
  CREATE TABLE IF NOT EXISTS generic_orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer TEXT,
    description TEXT, -- The requirements string to match against
    date_added TEXT
  );
`);

module.exports = db;