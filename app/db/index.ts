import * as SQLite from "expo-sqlite";
import { migrationSQL } from "./migrations";

let db: SQLite.SQLiteDatabase | null = null;
let isInitializing = false;

export async function getDatabase() {
  if (!db) {
    db = await SQLite.openDatabaseAsync("bufib.db");
    await db.execAsync(migrationSQL);
  }
  return db;
}

export async function safeInitializeDatabase(initFn: () => Promise<void>) {
  if (isInitializing) return;
  isInitializing = true;
  try {
    await initFn();
  } finally {
    isInitializing = false;
  }
}
