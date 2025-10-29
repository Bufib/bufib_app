import * as SQLite from "expo-sqlite";

let db: SQLite.SQLiteDatabase | null = null;
let isInitializing = false;
let rerunRequested = false; // remembers if another trigger arrived mid-run

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

// export async function safeInitializeDatabase(initFn: () => Promise<void>) {
//   if (isInitializing) {
//     // called while a run is in progress?
//     rerunRequested = true; // queue exactly one more run after this one
//     return; // and exit now
//   }
//   isInitializing = true;
//   try {
//     do {
//       rerunRequested = false; // clear the rerun flag
//       await initFn(); // perform your migrations/sync
//     } while (rerunRequested); // if anything asked to run again, loop once more
//   } finally {
//     isInitializing = false;
//   }
// }

export async function safeInitializeDatabase<T>(initFn: () => Promise<T>): Promise<T | undefined> {
  if (isInitializing) { rerunRequested = true; return; }
  isInitializing = true;
  try {
    let result: T | undefined = undefined;
    do {
      rerunRequested = false;
      result = await initFn();
    } while (rerunRequested);
    return result;
  } finally {
    isInitializing = false;
  }
}

