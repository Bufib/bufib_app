// import { supabase } from "@/utils/supabase";
// import { getDatabase } from "..";
// import { QuestionType } from "@/constants/Types";

//  async function syncQuestions(language: string) {
//   try {
//     const { data: questions, error } = await supabase
//       .from("questions")
//       .select("*")
//       .eq("language_code", "de");
//     if (error) {
//       console.error("Error fetching questions from Supabase:", error.message);
//       return;
//     }
//     if (!questions || questions.length === 0) {
//       console.log("No questions found in Supabase.");
//       return;
//     }

//     const db = await getDatabase();

//     // --- START: FIX ---
//     // 1. Populate the parent tables (categories and subcategories) first.
//     // This prevents foreign key constraint violations when inserting questions.
//     const categories = Array.from(
//       new Set(questions.map((q) => q.question_category_name).filter(Boolean))
//     );
//     const subcategories = Array.from(
//       new Set(questions.map((q) => q.question_subcategory_name).filter(Boolean))
//     );

//     await db.withExclusiveTransactionAsync(async (txn) => {
//       const catStmt = await txn.prepareAsync(
//         `INSERT OR IGNORE INTO question_categories (question_category_name) VALUES (?);`
//       );
//       const subcatStmt = await txn.prepareAsync(
//         `INSERT OR IGNORE INTO question_subcategories (question_subcategory_name) VALUES (?);`
//       );

//       try {
//         for (const name of categories) {
//           await catStmt.executeAsync([name]);
//         }
//         for (const name of subcategories) {
//           await subcatStmt.executeAsync([name]);
//         }
//         console.log("Categories and subcategories synced.");
//       } catch (e) {
//         console.error("Error syncing categories/subcategories:", e);
//       } finally {
//         await catStmt.finalizeAsync();
//         await subcatStmt.finalizeAsync();
//       }
//     });
//     // --- END: FIX ---

//     // 2. Clean up stale questions that are no longer in the remote database
//     const remoteIds = questions.map((q) => q.id);
//     if (remoteIds.length) {
//       const placeholders = remoteIds.map(() => "?").join(",");
//       await db.runAsync(
//         `DELETE FROM questions WHERE id NOT IN (${placeholders});`,
//         remoteIds
//       );
//     } else {
//       // If remote returns no questions, clear the local table
//       await db.runAsync(`DELETE FROM questions;`);
//     }

//     // 3. Insert or Replace the fetched questions
//     await db.withExclusiveTransactionAsync(async (txn) => {
//       const stmt = await txn.prepareAsync(
//         `INSERT OR REPLACE INTO questions
//           (id, title, question, answer, answer_sistani,
//            answer_khamenei, question_category_name, question_subcategory_name, created_at, language_code)
//         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`
//       );
//       try {
//         for (const question of questions) {
//           await stmt.executeAsync([
//             question.id,
//             question.title,
//             question.question,
//             question.answer ?? null,
//             question.answer_sistani ?? null,
//             question.answer_khamenei ?? null,
//             question.question_category_name,
//             question.question_subcategory_name,
//             question.created_at,
//             question.language_code,
//           ]);
//         }
//       } catch (e) {
//         console.error("Error inserting questions into database:", e);
//       } finally {
//         await stmt.finalizeAsync();
//       }
//     });

//     console.log("Questions synced; stale rows cleaned up.");
//   } catch (err) {
//     console.error(
//       "A critical error occurred in fetchQuestionsFromSupabase:",
//       err
//     );
//   }
// }

// export default syncQuestions

// import { supabase } from "@/utils/supabase";
// import { getDatabase } from "..";

// /**
//  * Syncs all questions for a given language from Supabase into local SQLite.
//  * - Inserts categories and subcategories
//  * - Deletes stale questions
//  * - Inserts or replaces fetched questions
//  * Uses a single exclusive transaction to avoid database locks.
//  */
// async function syncQuestions(language: string) {
//   try {
//     // Fetch remote questions
//     const { data: questions, error } = await supabase
//       .from("questions")
//       .select("*")
//       .eq("language_code", language);
//     if (error) {
//       console.error("Error fetching questions from Supabase:", error.message);
//       return;
//     }
//     if (!questions || questions.length === 0) {
//       console.log("No questions found for language:", language);
//       return;
//     }

//     const db = await getDatabase();

//     // Perform all DB operations in one exclusive transaction
//     await db.withExclusiveTransactionAsync(async (txn) => {
//       // Prepare statements
//       const catStmt = await txn.prepareAsync(
//         `INSERT OR IGNORE INTO question_categories (question_category_name) VALUES (?);`
//       );
//       const subcatStmt = await txn.prepareAsync(
//         `INSERT OR IGNORE INTO question_subcategories (question_subcategory_name) VALUES (?);`
//       );
//       const qStmt = await txn.prepareAsync(
//         `INSERT OR REPLACE INTO questions
//           (id, title, question, answer, answer_sistani, answer_khamenei,
//            question_category_name, question_subcategory_name, created_at, language_code)
//         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`
//       );

//       try {
//         // 1. Sync categories and subcategories
//         const categories = Array.from(
//           new Set(
//             questions.map((q) => q.question_category_name).filter(Boolean)
//           )
//         );
//         const subcategories = Array.from(
//           new Set(
//             questions.map((q) => q.question_subcategory_name).filter(Boolean)
//           )
//         );
//         for (const name of categories) {
//           await catStmt.executeAsync([name]);
//         }
//         for (const name of subcategories) {
//           await subcatStmt.executeAsync([name]);
//         }

//         // 2. Delete stale questions
//         const remoteIds = questions.map((q) => q.id);
//         if (remoteIds.length > 0) {
//           const placeholders = remoteIds.map(() => "?").join(",");
//           await txn.runAsync(
//             `DELETE FROM questions
//              WHERE language_code = ?
//             AND id NOT IN (${placeholders});`,
//             [language, ...remoteIds]
//           );
//         } else {
//           await txn.runAsync(
//             `DELETE FROM questions
//              WHERE language_code = ?;`,
//             [language]
//           );
//         }

//         // 3. Insert or replace questions
//         for (const q of questions) {
//           await qStmt.executeAsync([
//             q.id,
//             q.title,
//             q.question,
//             q.answer ?? null,
//             q.answer_sistani ?? null,
//             q.answer_khamenei ?? null,
//             q.question_category_name,
//             q.question_subcategory_name,
//             q.created_at,
//             q.language_code,
//           ]);
//         }
//       } catch (e) {
//         console.error("Error during syncQuestions transaction:", e);
//       } finally {
//         // Finalize statements
//         await catStmt.finalizeAsync();
//         await subcatStmt.finalizeAsync();
//         await qStmt.finalizeAsync();
//       }
//     });

//     console.log("Questions synced successfully for language:", language);
//   } catch (err) {
//     console.error("A critical error occurred in syncQuestions:", err);
//   }
// }

// export default syncQuestions;

import { supabase } from "@/utils/supabase";
import { getDatabase } from "..";
import { QuestionType } from "@/constants/Types";

/**
 * Syncs all questions for a given language from Supabase into local SQLite.
 * - Inserts categories and subcategories
 * - Deletes stale questions
 * - Inserts or replaces fetched questions
 * Uses a single exclusive transaction to avoid database locks.
 */
async function syncQuestions(language: string): Promise<void> {
  try {
    // 1) Fetch remote questions
    const { data: questions, error } = await supabase
      .from("questions")
      .select("*")
      .eq("language_code", language);
    if (error) {
      console.error("Error fetching questions from Supabase:", error.message);
      return;
    }
    if (!questions?.length) {
      console.log("No questions found for language:", language);
      return;
    }

    const db = await getDatabase();

    // 2) All DB writes in one exclusive transaction
    await db.withExclusiveTransactionAsync(async (txn) => {
      // Prepare statements
      const catStmt = await txn.prepareAsync(
        `INSERT OR IGNORE INTO question_categories (question_category_name) VALUES (?);`
      );
      const subcatStmt = await txn.prepareAsync(
        `INSERT OR IGNORE INTO question_subcategories (question_subcategory_name) VALUES (?);`
      );
      const insertStmt = await txn.prepareAsync(
        `INSERT OR REPLACE INTO questions
           (id, title, question, answer, answer_sistani, answer_khamenei,
            question_category_name, question_subcategory_name, created_at, language_code)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`
      );

      try {
        // a) Sync categories
        const categories = Array.from(
          new Set(
            (questions as QuestionType[])
              .map((q) => q.question_category_name)
              .filter(Boolean)
          )
        );
        for (const name of categories) {
          await catStmt.executeAsync([name]);
        }
        // b) Sync subcategories
        const subcategories = Array.from(
          new Set(
            (questions as QuestionType[])
              .map((q) => q.question_subcategory_name)
              .filter(Boolean)
          )
        );
        for (const name of subcategories) {
          await subcatStmt.executeAsync([name]);
        }

        // c) Delete stale questions scoped to current language
        const remoteIds = (questions as QuestionType[]).map((q) => q.id);
        if (remoteIds.length) {
          const placeholders = remoteIds.map(() => "?").join(",");
          await txn.runAsync(
            `DELETE FROM questions
               WHERE language_code = ?
                 AND id NOT IN (${placeholders});`,
            [language, ...remoteIds]
          );
        } else {
          // No remote rows => clear all for this language
          await txn.runAsync(`DELETE FROM questions WHERE language_code = ?;`, [
            language,
          ]);
        }

        // d) Insert or replace questions
        for (const q of questions as QuestionType[]) {
          await insertStmt.executeAsync([
            q.id,
            q.title,
            q.question,
            q.answer ?? null,
            q.answer_sistani ?? null,
            q.answer_khamenei ?? null,
            q.question_category_name,
            q.question_subcategory_name,
            q.created_at,
            q.language_code,
          ]);
        }
      } catch (txnError) {
        console.error("Transaction error in syncQuestions:", txnError);
      } finally {
        // Finalize all statements
        await catStmt.finalizeAsync();
        await subcatStmt.finalizeAsync();
        await insertStmt.finalizeAsync();
      }
    });

    console.log("Questions synced successfully for language:", language);
  } catch (err) {
    console.error("Critical error in syncQuestions:", err);
  }
}

export default syncQuestions;
