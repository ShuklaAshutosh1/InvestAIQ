import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";

export type AppDatabase = DatabaseSync;

export function createDatabase(filePath = resolve("data", "investaiq.db")): AppDatabase {
  if (filePath !== ":memory:") mkdirSync(dirname(filePath), { recursive: true });
  const database = new DatabaseSync(filePath);
  database.exec("PRAGMA journal_mode = WAL;");
  database.exec(`
    CREATE TABLE IF NOT EXISTS pattern_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      symbol TEXT NOT NULL,
      direction TEXT NOT NULL,
      length INTEGER NOT NULL,
      average_price REAL NOT NULL,
      volatility REAL NOT NULL,
      suggestion TEXT NOT NULL,
      captured_at TEXT NOT NULL
    );
  `);
  return database;
}
