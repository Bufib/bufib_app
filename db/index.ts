import * as SQLite from "expo-sqlite";

let db: SQLite.SQLiteDatabase | null = null;
let isInitializing = false;

// Promise that resolves once the Provider passes us the db handle.
let resolveReady: (() => void) | null = null;
const readyPromise = new Promise<void>((res) => (resolveReady = res));

export function setDatabase(instance: SQLite.SQLiteDatabase) {
  db = instance;
  resolveReady?.();
}

export async function whenDatabaseReady(): Promise<void> {
  if (db) return;
  await readyPromise;
}

export function getDatabase(): SQLite.SQLiteDatabase {
  if (!db) throw new Error("Database not ready yet (Provider not initialized)");
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
