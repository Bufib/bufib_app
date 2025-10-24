// // // // import { supabase } from "@/utils/supabase";
// // // // import { getDatabase } from "..";

// // // // async function syncCalendar(language: string) {
// // // //   try {
// // // //     const { data, error } = await supabase.from("calendar").select("*").eq("language_code", language);

// // // //     if (error) {
// // // //       console.error("Error fetching calendar from Supabase:", error.message);
// // // //       return null;
// // // //     }

// // // //     if (!data || data.length === 0) {
// // // //       console.warn("No calendar data found in Supabase.");
// // // //       return [];
// // // //     }

// // // //     const db = await getDatabase();

// // // //     await db.withExclusiveTransactionAsync(async (txn) => {
// // // //       const stmt = await txn.prepareAsync(
// // // //         `INSERT OR REPLACE INTO calendar
// // // //             (id, title, islamic_date, gregorian_date, description, type, countdown, created_at, language_code)
// // // //            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`
// // // //       );
// // // //       try {
// // // //         // loop through all rows
// // // //         for (const row of data) {
// // // //           await stmt.executeAsync([
// // // //             row.id,
// // // //             row.title,
// // // //             row.islamic_date,
// // // //             row.gregorian_date,
// // // //             row.description,
// // // //             row.type,
// // // //             row.countdown,
// // // //             row.created_at,
// // // //             row.language_code
// // // //           ]);
// // // //         }
// // // //       } finally {
// // // //         await stmt.finalizeAsync();
// // // //       }
// // // //     });

// // // //     console.log("Calendar synced.");

// // // //     // return the array you fetched
// // // //     return data;
// // // //   } catch (error) {
// // // //     console.error("Unexpected error fetching calendar:", error);
// // // //     // on unexpected error, return null
// // // //     return null;
// // // //   }
// // // // }

// // // // import { supabase } from "@/utils/supabase";
// // // // import { getDatabase } from "..";
// // // // import { calendarLegend } from "@/constants/Types";

// // // // /**
// // // //  * Syncs calendar entries for a specific language from Supabase into SQLite.
// // // //  * Wraps all inserts in one exclusive transaction to avoid database locks.
// // // //  * @param language - ISO code (e.g. 'en' or 'de')
// // // //  * @returns the fetched calendar data or null on error
// // // //  */
// // // // async function syncCalendar(language: string): Promise<calendarLegend[] | null> {
// // // //   try {
// // // //     // Fetch remote calendar entries
// // // //     const { data, error } = await supabase
// // // //       .from("calendar")
// // // //       .select("*")
// // // //       .eq("language_code", language);

// // // //     if (error) {
// // // //       console.error("Error fetching calendar from Supabase:", error.message);
// // // //       return null;
// // // //     }
// // // //     if (!data || data.length === 0) {
// // // //       console.warn("No calendar data found in Supabase for:", language);
// // // //       return [];
// // // //     }

// // // //     const db = await getDatabase();

// // // //     // Perform all DB writes in a single exclusive transaction
// // // //     await db.withExclusiveTransactionAsync(async (txn) => {
// // // //       const stmt = await txn.prepareAsync(
// // // //         `INSERT OR REPLACE INTO calendar
// // // //           (id, title, islamic_date, gregorian_date, description,
// // // //            type, countdown, created_at, language_code)
// // // //          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`
// // // //       );
// // // //       try {
// // // //         for (const row of data) {
// // // //           await stmt.executeAsync([
// // // //             row.id,
// // // //             row.title,
// // // //             row.islamic_date,
// // // //             row.gregorian_date,
// // // //             row.description,
// // // //             row.type,
// // // //             row.countdown,
// // // //             row.created_at,
// // // //             row.language_code,
// // // //           ]);
// // // //         }
// // // //         console.log(`Calendar synced successfully for '${language}'.`);
// // // //       } catch (e) {
// // // //         console.error("Error during syncCalendar transaction:", e);
// // // //       } finally {
// // // //         await stmt.finalizeAsync();
// // // //       }
// // // //     });

// // // //     return data;
// // // //   } catch (err) {
// // // //     console.error("Unexpected error in syncCalendar:", err);
// // // //     return null;
// // // //   }
// // // // }

// // // import { supabase } from "@/utils/supabase";
// // // import { getDatabase } from "..";
// // // import { calendarLegend } from "@/constants/Types";

// // // /**
// // //  * Syncs calendar entries for a specific language from Supabase into SQLite.
// // //  * Wraps all inserts in a single exclusive transaction to avoid database locks.
// // //  * @param language - ISO code (e.g. 'en' or 'de')
// // //  * @returns the fetched calendar data or null on error
// // //  */
// // // async function syncCalendar(language: string): Promise<calendarLegend[] | null> {
// // //   try {
// // //     // 1) Fetch remote calendar entries
// // //     const { data, error } = await supabase
// // //       .from("calendar")
// // //       .select("*")
// // //       .eq("language_code", language);

// // //     if (error) {
// // //       console.error("Error fetching calendar from Supabase:", error.message);
// // //       return null;
// // //     }
// // //     if (!data?.length) {
// // //       console.warn("No calendar data found in Supabase for:", language);
// // //       return [];
// // //     }

// // //     const db = await getDatabase();

// // //     // 2) Perform all DB writes in one exclusive transaction
// // //     await db.withExclusiveTransactionAsync(async (txn) => {
// // //       const stmt = await txn.prepareAsync(
// // //         `INSERT OR REPLACE INTO calendar
// // //            (id, title, islamic_date, gregorian_date, description,
// // //             type, created_at, language_code)
// // //          VALUES (?, ?, ?, ?, ?, ?, ?, ?);`
// // //       );
// // //       try {
// // //         for (const row of data as calendarLegend[]) {
// // //           await stmt.executeAsync([
// // //             row.id,
// // //             row.title,
// // //             row.islamic_date,
// // //             // store date as ISO string
// // //             typeof row.gregorian_date === 'string'
// // //               ? row.gregorian_date
// // //               : row.gregorian_date?.toISOString(),
// // //             row.description,
// // //             row.type,
// // //             // created_at as ISO string
// // //             typeof row.created_at === 'string'
// // //               ? row.created_at
// // //               : row.created_at?.toISOString(),
// // //             row.language_code,
// // //           ]);
// // //         }
// // //       } catch (txnError) {
// // //         console.error("Transaction error in syncCalendar:", txnError);
// // //       } finally {
// // //         await stmt.finalizeAsync();
// // //       }
// // //     });

// // //     console.log(`Calendar synced successfully for '${language}'.`);
// // //     return data;
// // //   } catch (err) {
// // //     console.error("Critical error in syncCalendar:", err);
// // //     return null;
// // //   }
// // // }

// // // export default syncCalendar;

// // import { supabase } from "@/utils/supabase";
// // import { getDatabase } from "..";

// // async function syncCalendar(language: string): Promise<void> {
// //   try {
// //     // 1) Fetch remote data in parallel
// //     const [legenTypRes, calRes] = await Promise.all([
// //       supabase
// //         .from("calendarLegend")
// //         .select("id, legend_type, created_at, language_code")
// //         .order("id", { ascending: true }),
// //       supabase
// //         .from("calendar")
// //         .select(`
// //           id, title, islamic_date, gregorian_date,
// //           description, legend_type, created_at, language_code
// //         `)
// //         .eq("language_code", language)
// //         .order("id", { ascending: true }),
// //     ]);

// //     if (legenTypRes.error) {
// //       console.error("Error fetching calendarLegend:", legenTypRes.error.message);
// //       return;
// //     }
// //     if (calRes.error) {
// //       console.error("Error fetching calendar:", calRes.error.message);
// //       return;
// //     }

// //     const types = legenTypRes.data ?? [];
// //     const rows = calRes.data ?? [];

// //     const db = await getDatabase();
// //     const runTx =
// //       (db as any).withExclusiveTransactionAsync?.bind(db) ??
// //       db.withTransactionAsync.bind(db);

// //     // 2) Single transaction: delete + insert
// //     await runTx(async (txn: any) => {
// //       // a) prune old data
// //       await txn.execAsync(`DELETE FROM calendarLegend WHERE language_code = ?;`, [language]);
// //       await txn.runAsync(`DELETE FROM calendar WHERE language_code = ?;`, [language]);

// //       // b) upsert calendarLegend (insert created_at as provided; no ISO conversion)
// //       const typeStmt = await txn.prepareAsync(
// //         `INSERT OR REPLACE INTO calendarLegend (id, created_at, legend_type, language_Code)
// //          VALUES (?, ?, ?, ?);`
// //       );
// //       for (const t of types) {
// //         await typeStmt.executeAsync([t.id, t.created_at, t.legend_type, t.language_code]);
// //       }
// //       await typeStmt.finalizeAsync();

// //       // c) upsert calendar rows for this language
// //       const calStmt = await txn.prepareAsync(
// //         `INSERT OR REPLACE INTO calendar
// //            (id, title, islamic_date, gregorian_date, description,
// //             legend_type, created_at, language_code)
// //          VALUES (?, ?, ?, ?, ?, ?, ?, ?);`
// //       );
// //       for (const r of rows) {
// //         await calStmt.executeAsync([
// //           r.id,
// //           r.title,
// //           r.islamic_date,
// //           r.gregorian_date,   // pass through (TEXT in your schema)
// //           r.description ?? null,
// //           r.legend_type,
// //           r.created_at,       // pass through (TEXT in your schema)
// //           r.language_code,
// //         ]);
// //       }
// //       await calStmt.finalizeAsync();
// //     });

// //     console.log(`Calendar + calendarLegend synced for '${language}'.`);
// //   } catch (err) {
// //     console.error("Critical error in syncCalendar:", err);
// //   }
// // }

// // export default syncCalendar;

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

//     const db = await getDatabase();
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

// db/sync/calendar.ts
import { supabase } from "@/utils/supabase";
import { getDatabase } from "..";

export default async function syncCalendar(): Promise<void> {
  try {
    // 1) Fetch ALL languages (no .eq("language_code", …))
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

    const db = await getDatabase();
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
  } catch (err) {
    console.error("Critical error in syncCalendar:", err);
  }
}
