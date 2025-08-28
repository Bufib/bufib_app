// import { supabase } from "@/utils/supabase";
// import { getDatabase } from "..";

// async function syncCalendar(language: string) {
//   try {
//     const { data, error } = await supabase.from("calendar").select("*").eq("language_code", language);

//     if (error) {
//       console.error("Error fetching calendar from Supabase:", error.message);
//       return null;
//     }

//     if (!data || data.length === 0) {
//       console.warn("No calendar data found in Supabase.");
//       return [];
//     }

//     const db = await getDatabase();

//     await db.withExclusiveTransactionAsync(async (txn) => {
//       const stmt = await txn.prepareAsync(
//         `INSERT OR REPLACE INTO calendar
//             (id, title, islamic_date, gregorian_date, description, type, countdown, created_at, language_code)
//            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`
//       );
//       try {
//         // loop through all rows
//         for (const row of data) {
//           await stmt.executeAsync([
//             row.id,
//             row.title,
//             row.islamic_date,
//             row.gregorian_date,
//             row.description,
//             row.type,
//             row.countdown,
//             row.created_at,
//             row.language_code
//           ]);
//         }
//       } finally {
//         await stmt.finalizeAsync();
//       }
//     });

//     console.log("Calendar synced.");

//     // return the array you fetched
//     return data;
//   } catch (error) {
//     console.error("Unexpected error fetching calendar:", error);
//     // on unexpected error, return null
//     return null;
//   }
// }


// import { supabase } from "@/utils/supabase";
// import { getDatabase } from "..";
// import { CalendarType } from "@/constants/Types";

// /**
//  * Syncs calendar entries for a specific language from Supabase into SQLite.
//  * Wraps all inserts in one exclusive transaction to avoid database locks.
//  * @param language - ISO code (e.g. 'en' or 'de')
//  * @returns the fetched calendar data or null on error
//  */
// async function syncCalendar(language: string): Promise<CalendarType[] | null> {
//   try {
//     // Fetch remote calendar entries
//     const { data, error } = await supabase
//       .from("calendar")
//       .select("*")
//       .eq("language_code", language);

//     if (error) {
//       console.error("Error fetching calendar from Supabase:", error.message);
//       return null;
//     }
//     if (!data || data.length === 0) {
//       console.warn("No calendar data found in Supabase for:", language);
//       return [];
//     }

//     const db = await getDatabase();

//     // Perform all DB writes in a single exclusive transaction
//     await db.withExclusiveTransactionAsync(async (txn) => {
//       const stmt = await txn.prepareAsync(
//         `INSERT OR REPLACE INTO calendar
//           (id, title, islamic_date, gregorian_date, description,
//            type, countdown, created_at, language_code)
//          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`
//       );
//       try {
//         for (const row of data) {
//           await stmt.executeAsync([
//             row.id,
//             row.title,
//             row.islamic_date,
//             row.gregorian_date,
//             row.description,
//             row.type,
//             row.countdown,
//             row.created_at,
//             row.language_code,
//           ]);
//         }
//         console.log(`Calendar synced successfully for '${language}'.`);
//       } catch (e) {
//         console.error("Error during syncCalendar transaction:", e);
//       } finally {
//         await stmt.finalizeAsync();
//       }
//     });

//     return data;
//   } catch (err) {
//     console.error("Unexpected error in syncCalendar:", err);
//     return null;
//   }
// }

import { supabase } from "@/utils/supabase";
import { getDatabase } from "..";
import { CalendarType } from "@/constants/Types";

/**
 * Syncs calendar entries for a specific language from Supabase into SQLite.
 * Wraps all inserts in a single exclusive transaction to avoid database locks.
 * @param language - ISO code (e.g. 'en' or 'de')
 * @returns the fetched calendar data or null on error
 */
async function syncCalendar(language: string): Promise<CalendarType[] | null> {
  try {
    // 1) Fetch remote calendar entries
    const { data, error } = await supabase
      .from("calendar")
      .select("*")
      .eq("language_code", language);

    if (error) {
      console.error("Error fetching calendar from Supabase:", error.message);
      return null;
    }
    if (!data?.length) {
      console.warn("No calendar data found in Supabase for:", language);
      return [];
    }

    const db = await getDatabase();

    // 2) Perform all DB writes in one exclusive transaction
    await db.withExclusiveTransactionAsync(async (txn) => {
      const stmt = await txn.prepareAsync(
        `INSERT OR REPLACE INTO calendar
           (id, title, islamic_date, gregorian_date, description,
            type, created_at, language_code)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?);`
      );
      try {
        for (const row of data as CalendarType[]) {
          await stmt.executeAsync([
            row.id,
            row.title,
            row.islamic_date,
            // store date as ISO string
            typeof row.gregorian_date === 'string'
              ? row.gregorian_date
              : row.gregorian_date?.toISOString(),
            row.description,
            row.type,
            // created_at as ISO string
            typeof row.created_at === 'string'
              ? row.created_at
              : row.created_at?.toISOString(),
            row.language_code,
          ]);
        }
      } catch (txnError) {
        console.error("Transaction error in syncCalendar:", txnError);
      } finally {
        await stmt.finalizeAsync();
      }
    });

    console.log(`Calendar synced successfully for '${language}'.`);
    return data;
  } catch (err) {
    console.error("Critical error in syncCalendar:", err);
    return null;
  }
}

export default syncCalendar;
