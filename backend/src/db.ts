import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

import Database from 'better-sqlite3';

const DB_PATH = path.join(process.cwd(), 'otulia.db');

const db = new Database(DB_PATH);

db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name   TEXT    NOT NULL,
    email       TEXT    NOT NULL UNIQUE,
    password    TEXT    NOT NULL,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
  )
`);

const rowCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
if (rowCount.count === 0) {
  console.log('[DB] No users found. Register through the app.');
}

db.exec(`
  CREATE TABLE IF NOT EXISTS listings (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    type        TEXT    NOT NULL CHECK(type IN ('car','estate','bike','yacht','jet')),
    title       TEXT    NOT NULL,
    subtitle    TEXT,
    price       REAL    NOT NULL,
    currency    TEXT    NOT NULL DEFAULT '€',
    location    TEXT    NOT NULL,
    images      TEXT    NOT NULL DEFAULT '[]',
    specs       TEXT    NOT NULL DEFAULT '{}',
    is_featured INTEGER NOT NULL DEFAULT 0,
    dealer_id   TEXT,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
  )
`);

console.log(`[DB] SQLite initialized at: ${DB_PATH}`);

export default db;
