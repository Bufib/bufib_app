//! Without sync all languages
// import { supabase } from "@/utils/supabase";
// import { getDatabase } from "..";

// async function syncCalendar(language: string): Promise<void> {
//   try {
//     // 1) Fetch remote data in parallel (scope both to the same language)
//     const [legendRes, calRes] = await Promise.all([
//       supabase
//         .from("calendarLegend")
//         .select("id, legend_type, created_at, language_code")
//         .eq("language_code", language)
//         .order("id", { ascending: true }),
//       supabase
//         .from("calendar")
//         .select(
//           `
//           id, title, islamic_date, gregorian_date,
//           description, legend_type, created_at, language_code
//         `
//         )
//         .eq("language_code", language)
//         .order("id", { ascending: true }),
//     ]);

//     if (legendRes.error) {
//       console.error("Error fetching calendarLegend:", legendRes.error.message);
//       return;
//     }
//     if (calRes.error) {
//       console.error("Error fetching calendar:", calRes.error.message);
//       return;
//     }

//     const legends = legendRes.data ?? [];
//     const rows = calRes.data ?? [];

//     const db = getDatabase();
//     const runTx =
//       (db as any).withExclusiveTransactionAsync?.bind(db) ??
//       db.withTransactionAsync.bind(db);

//     // 2) Single transaction: prune then upsert
//     await runTx(async (txn: any) => {
//       // a) prune old data (delete children first for future FK-safety)
//       await txn.runAsync(`DELETE FROM calendar WHERE language_code = ?;`, [
//         language,
//       ]);
//       await txn.runAsync(
//         `DELETE FROM calendarLegend WHERE language_code = ?;`,
//         [language]
//       );

//       // b) upsert calendarLegend
//       const typeStmt = await txn.prepareAsync(
//         `INSERT OR REPLACE INTO calendarLegend (id, created_at, legend_type, language_code)
//          VALUES (?, ?, ?, ?);`
//       );
//       for (const t of legends) {
//         await typeStmt.executeAsync([
//           t.id,
//           t.created_at,
//           t.legend_type,
//           t.language_code,
//         ]);
//       }
//       await typeStmt.finalizeAsync();

//       // c) upsert calendar rows
//       const calStmt = await txn.prepareAsync(
//         `INSERT OR REPLACE INTO calendar
//            (id, title, islamic_date, gregorian_date, description,
//             legend_type, created_at, language_code)
//          VALUES (?, ?, ?, ?, ?, ?, ?, ?);`
//       );
//       for (const r of rows) {
//         await calStmt.executeAsync([
//           r.id,
//           r.title,
//           r.islamic_date,
//           r.gregorian_date, // ISO "YYYY-MM-DD" recommended in SQLite
//           r.description ?? null,
//           r.legend_type,
//           r.created_at,
//           r.language_code,
//         ]);
//       }
//       await calStmt.finalizeAsync();
//     });

//     console.log(`Calendar + calendarLegend synced for '${language}'.`);
//   } catch (err) {
//     console.error("Critical error in syncCalendar:", err);
//   }
// }

// export default syncCalendar;

import { supabase } from "@/utils/supabase";
import { getDatabase } from "..";
import { useDataVersionStore } from "@/stores/dataVersionStore";

export default async function syncCalendar(): Promise<void> {
  try {
    // 1) Fetch ALL languages
    const [legendRes, calRes] = await Promise.all([
      supabase
        .from("calendarLegend")
        .select("id, legend_type, created_at, language_code")
        .order("id", { ascending: true }),
      supabase
        .from("calendar")
        .select(
          `
          id, title, islamic_date, gregorian_date,
          description, legend_type, created_at, language_code
        `
        )
        .order("id", { ascending: true }),
    ]);

    if (legendRes.error) {
      console.error("Error fetching calendarLegend:", legendRes.error.message);
      return;
    }
    if (calRes.error) {
      console.error("Error fetching calendar:", calRes.error.message);
      return;
    }

    const legends = legendRes.data ?? [];
    const rows = calRes.data ?? [];

    const db = getDatabase();
    const runTx =
      (db as any).withExclusiveTransactionAsync?.bind(db) ??
      db.withTransactionAsync.bind(db);

    // 2) Single transaction: full replace (all languages)
    await runTx(async (txn: any) => {
      // a) wipe local data
      await txn.runAsync(`DELETE FROM calendar;`);
      await txn.runAsync(`DELETE FROM calendarLegend;`);

      // b) upsert legends
      const typeStmt = await txn.prepareAsync(
        `INSERT OR REPLACE INTO calendarLegend
           (id, created_at, legend_type, language_code)
         VALUES (?, ?, ?, ?);`
      );
      for (const t of legends) {
        await typeStmt.executeAsync([
          t.id,
          t.created_at,
          t.legend_type,
          t.language_code,
        ]);
      }
      await typeStmt.finalizeAsync();

      // c) upsert calendar rows
      const calStmt = await txn.prepareAsync(
        `INSERT OR REPLACE INTO calendar
           (id, title, islamic_date, gregorian_date, description,
            legend_type, created_at, language_code)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?);`
      );
      for (const r of rows) {
        await calStmt.executeAsync([
          r.id,
          r.title,
          r.islamic_date,
          r.gregorian_date, // ISO "YYYY-MM-DD" recommended
          r.description ?? null,
          r.legend_type,
          r.created_at,
          r.language_code,
        ]);
      }
      await calStmt.finalizeAsync();
    });

    console.log(
      `Calendar & calendarLegend synced (FULL replace, ALL languages).`
    );
    // Increment the calendar version after successful sync
    const { incrementCalendarVersion } = useDataVersionStore.getState();
    incrementCalendarVersion();
  } catch (err) {
    console.error("Critical error in syncCalendar:", err);
  }
}
