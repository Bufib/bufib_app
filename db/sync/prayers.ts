// import { supabase } from "@/utils/supabase";
// import { getDatabase } from "..";
// import { QuestionType } from "@/constants/Types";

//  async function syncPrayers(language: string) {
//   try {
//     const { data: categories, error: catErr } = await supabase
//       .from("prayer_categories")
//       .select("*");
//     if (catErr) throw catErr;

//     const { data: prayers, error: prayerErr } = await supabase
//       .from("prayers")
//       .select("*");
//     if (prayerErr) throw prayerErr;

//     const { data: translations, error: transErr } = await supabase
//       .from("prayer_translations")
//       .select("*");
//     if (transErr) throw transErr;

//     const db = await getDatabase();

//     await db.withExclusiveTransactionAsync(async (txn) => {
//       const stmtCat = await txn.prepareAsync(
//         `INSERT OR REPLACE INTO prayer_categories (id, title, parent_id) VALUES (?, ?, ?);`
//       );
//       try {
//         for (const c of categories) {
//           const parents = Array.isArray(c.parent_id) ? c.parent_id : [];
//           await stmtCat.executeAsync([c.id, c.title, JSON.stringify(parents)]);
//         }
//       } finally {
//         await stmtCat.finalizeAsync();
//       }
//     });

//     await db.withExclusiveTransactionAsync(async (txn) => {
//       const stmtPrayer = await txn.prepareAsync(
//         `INSERT OR REPLACE INTO prayers
//             (id, name, arabic_title, category_id, arabic_introduction,
//              arabic_text, arabic_notes, transliteration_text, source,
//              translated_languages, created_at, updated_at)
//            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`
//       );
//       try {
//         for (const p of prayers) {
//           await stmtPrayer.executeAsync([
//             p.id,
//             p.name,
//             p.arabic_title,
//             p.category_id,
//             p.arabic_introduction,
//             p.arabic_text,
//             p.arabic_notes,
//             p.transliteration_text,
//             p.source,
//             JSON.stringify(p.translated_languages),
//             p.created_at,
//             p.updated_at,
//           ]);
//         }
//       } finally {
//         await stmtPrayer.finalizeAsync();
//       }
//     });

//     await db.withExclusiveTransactionAsync(async (txn) => {
//       const stmtTrans = await txn.prepareAsync(
//         `INSERT OR REPLACE INTO prayer_translations
//             (id, prayer_id, language_code, translated_introduction,
//              translated_text, translated_notes, source, created_at, updated_at)
//            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`
//       );
//       try {
//         for (const t of translations) {
//           await stmtTrans.executeAsync([
//             t.id,
//             t.prayer_id,
//             t.language_code,
//             t.translated_introduction,
//             t.translated_text,
//             t.translated_notes,
//             t.source,
//             t.created_at,
//             t.updated_at,
//           ]);
//         }
//       } finally {
//         await stmtTrans.finalizeAsync();
//       }
//     });

//     console.log("Prayers and translations synced.");
//   } catch (error) {
//     console.error("Error in fetchPrayersFromSupabase:", error);
//   }
// }

// import { supabase } from "@/utils/supabase";
// import { getDatabase } from "..";

// /**
//  * Syncs prayer categories, prayers, and translations from Supabase into local SQLite.
//  * Uses one exclusive transaction to avoid database locks.
//  * @param language - language code (e.g. 'en', 'de') for filtered translations.
//  */
// async function syncPrayers(language: string) {
//   try {
//     // Fetch remote data
//     const { data: categories, error: catErr } = await supabase
//       .from("prayer_categories")
//       .select("*");
//     if (catErr) throw catErr;

//     const { data: prayers, error: prayerErr } = await supabase
//       .from("prayers")
//       .select("*");

//     if (prayerErr) throw prayerErr;

//     const { data: translations, error: transErr } = await supabase
//       .from("prayer_translations")
//       .select("*")
//       .eq("language_code", language);

//     if (transErr) throw transErr;

//     const db = await getDatabase();

//     // Wrap all operations in a single exclusive transaction
//     await db.withExclusiveTransactionAsync(async (txn) => {
//       // Prepare statements
//       const catStmt = await txn.prepareAsync(
//         `INSERT OR REPLACE INTO prayer_categories (id, title, parent_id) VALUES (?, ?, ?);`
//       );
//       const prayerStmt = await txn.prepareAsync(
//         `INSERT OR REPLACE INTO prayers
//           (id, name, arabic_title, category_id, arabic_introduction,
//            arabic_text, arabic_notes, transliteration_text, source,
//            translated_languages, created_at, updated_at)
//          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`
//       );
//       const transStmt = await txn.prepareAsync(
//         `INSERT OR REPLACE INTO prayer_translations
//           (id, prayer_id, language_code, translated_introduction,
//            translated_text, translated_notes, source, created_at, updated_at)
//          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`
//       );

//       try {
//         // 1. Sync categories
//         for (const c of categories) {
//           const parentField = Array.isArray(c.parent_id)
//             ? JSON.stringify(c.parent_id)
//             : null;
//           await catStmt.executeAsync([c.id, c.title, parentField]);
//         }

//         // 2. Sync prayers
//         for (const p of prayers) {
//           await prayerStmt.executeAsync([
//             p.id,
//             p.name,
//             p.arabic_title,
//             p.category_id,
//             p.arabic_introduction,
//             p.arabic_text,
//             p.arabic_notes,
//             p.transliteration_text,
//             p.source,
//             JSON.stringify(p.translated_languages),
//             p.created_at,
//             p.updated_at,
//           ]);
//         }

//         // 3. Sync translations for current language
//         for (const t of translations) {
//           await transStmt.executeAsync([
//             t.id,
//             t.prayer_id,
//             t.language_code,
//             t.translated_introduction,
//             t.translated_text,
//             t.translated_notes,
//             t.source,
//             t.created_at,
//             t.updated_at,
//           ]);
//         }

//         console.log(`Prayers and translations synced for '${language}'.`);
//       } catch (e) {
//         console.error("Error during syncPrayers transaction:", e);
//       } finally {
//         // Finalize statements
//         await catStmt.finalizeAsync();
//         await prayerStmt.finalizeAsync();
//         await transStmt.finalizeAsync();
//       }
//     });
//   } catch (error) {
//     console.error("Critical error in syncPrayers:", error);
//   }
// }

// export default syncPrayers;




import { supabase } from "@/utils/supabase";
import { getDatabase } from "..";
import {
  PrayerCategoryType,
  PrayerType,
  PrayerWithTranslationType,
} from "@/constants/Types";

/**
 * Syncs prayer categories, prayers, and translations from Supabase into local SQLite.
 * Wraps all operations in a single exclusive transaction to avoid database locks.
 * @param language - language code (e.g. 'en', 'de') for filtered translations.
 */
async function syncPrayers(language: string): Promise<void> {
  try {
    // 1) Fetch remote categories
    const { data: categories, error: catErr } = await supabase
      .from("prayer_categories")
      .select("id, title, parent_id, language_code");
    if (catErr) throw catErr;

    // 2) Fetch remote prayers
    const { data: prayers, error: prayerErr } = await supabase
      .from("prayers")
      .select(
        `id, name, arabic_title, category_id, arabic_introduction,
         arabic_text, arabic_notes, transliteration_text, source,
         translated_languages, created_at, updated_at`
      );

    if (prayerErr) throw prayerErr;

    // 3) Fetch translations for current language
    const { data: translations, error: transErr } = await supabase
      .from("prayer_translations")
      .select(
        `id, prayer_id, language_code, translated_introduction,
         translated_text, translated_notes, source, created_at, updated_at`
      )
      .eq("language_code", language);

    if (transErr) throw transErr;

    const db = await getDatabase();

    // 4) Perform all DB writes in one exclusive transaction
    await db.withExclusiveTransactionAsync(async (txn) => {
      const catStmt = await txn.prepareAsync(
        `INSERT OR REPLACE INTO prayer_categories (id, title, parent_id) VALUES (?, ?, ?);`
      );
      const prayerStmt = await txn.prepareAsync(
        `INSERT OR REPLACE INTO prayers
           (id, name, arabic_title, category_id, arabic_introduction,
            arabic_text, arabic_notes, transliteration_text, source,
            translated_languages, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`
      );
      const transStmt = await txn.prepareAsync(
        `INSERT OR REPLACE INTO prayer_translations
           (id, prayer_id, language_code, translated_introduction,
            translated_text, translated_notes, source, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`
      );

      try {
        // a) Sync categories
        for (const c of categories as PrayerCategoryType[]) {
          const parentField = Array.isArray(c.parent_id)
            ? JSON.stringify(c.parent_id)
            : null;
          await catStmt.executeAsync([c.id, c.title, parentField]);
        }

        // b) Sync prayers
        for (const p of prayers as PrayerType[]) {
          await prayerStmt.executeAsync([
            p.id,
            p.name,
            p.arabic_title ?? null,
            p.category_id ?? null,
            p.arabic_introduction ?? null,
            p.arabic_text ?? null,
            p.arabic_notes ?? null,
            p.transliteration_text ?? null,
            p.source ?? null,
            JSON.stringify(p.translated_languages ?? []),
            typeof p.created_at === "string"
              ? p.created_at
              : p.created_at?.toISOString(),
            typeof p.updated_at === "string"
              ? p.updated_at
              : p.updated_at?.toISOString(),
          ]);
        }

        // c) Sync translations
        for (const t of translations as PrayerWithTranslationType[]) {
          await transStmt.executeAsync([
            t.id,
            t.prayer_id,
            t.language_code,
            t.translated_introduction ?? null,
            t.translated_text ?? null,
            t.translated_notes ?? null,
            t.source ?? null,
            typeof t.created_at === "string"
              ? t.created_at
              : t.created_at?.toISOString(),
            typeof t.updated_at === "string"
              ? t.updated_at
              : t.updated_at?.toISOString(),
          ]);
        }
      } catch (e) {
        console.error("Transaction error in syncPrayers:", e);
      } finally {
        await catStmt.finalizeAsync();
        await prayerStmt.finalizeAsync();
        await transStmt.finalizeAsync();
      }
    });

    console.log(`Prayers and translations synced for '${language}'.`);
  } catch (error) {
    console.error("Critical error in syncPrayers:", error);
  }
}

export default syncPrayers;
