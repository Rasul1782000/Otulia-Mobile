import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '..', 'otulia.db');

const db = new Database(DB_PATH);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// Create users table
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name   TEXT    NOT NULL,
    email       TEXT    NOT NULL UNIQUE,
    password    TEXT    NOT NULL,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
  )
`);

// Seed default sample user if table is empty
const rowCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
if (rowCount.count === 0) {
  const hashedPassword = bcrypt.hashSync('password123', 12);
  db.prepare('INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)')
    .run('James Anderson', 'james.anderson@email.com', hashedPassword);
  console.log('[DB] Seeded default sample user: james.anderson@email.com / password123');
}

console.log(`[DB] SQLite database initialized at: ${DB_PATH}`);

export default db;

