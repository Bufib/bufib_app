// src/db/hardReset.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDatabase, whenDatabaseReady, safeInitializeDatabase } from "@/db";
import { runDatabaseSync } from "@/db/runDatabaseSync";

/**
 * Hard-reset local data (language-agnostic):
 * - deletes rows from all user tables (keeps schema/migrations)
 * - clears all dataset version/sync markers (for all languages)
 * - VACUUM
 * - re-syncs ALL datasets (forceAllLanguages=true) incl. PayPal
 */
export async function hardResetAllData(): Promise<void> {
  await safeInitializeDatabase(async () => {
    await whenDatabaseReady();
    const db = getDatabase();

    // 1) Delete rows from all user tables (keep schema/migrations)
    const tables: { name: string }[] = await db.getAllAsync(
      `SELECT name FROM sqlite_master
       WHERE type='table'
         AND name NOT LIKE 'sqlite_%'
         AND name NOT LIKE 'pragma_%'`
    );

    const skip = new Set([
      "migrations",
      "expo_schema_migrations",
      // add any meta tables you must preserve
    ]);

    await db.withTransactionAsync(async () => {
      await db.execAsync("PRAGMA foreign_keys=OFF;");
      for (const { name } of tables) {
        if (skip.has(name)) continue;
        await db.execAsync(`DELETE FROM "${name}";`);
      }
      await db.execAsync("PRAGMA foreign_keys=ON;");
    });

    // 2) Clear ALL keys that govern dataset sync — independent of language
    const allKeys = await AsyncStorage.getAllKeys();

    const exactKeys = [
      "question_data_version",
      "quran_data_version",
      "calendar_data_version",
      "prayer_data_version",
    ];

    // remove every language-scoped marker (prefix only, any lang/version)
    const prefixes = [
      "synced_questions_",
      "synced_quran_",
      "synced_calendar_",
      "synced_prayers_",
    ];

    const toRemove = allKeys.filter(
      (k) => exactKeys.includes(k) || prefixes.some((p) => k.startsWith(p))
    );

    if (toRemove.length) {
      await AsyncStorage.multiRemove(toRemove);
    }

    // 3) Reclaim space
    await db.execAsync("VACUUM;");

    // 4) Force a full re-sync for ALL datasets (and PayPal), independent of language
    await runDatabaseSync();
  });
}
