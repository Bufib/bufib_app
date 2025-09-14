// //! Without related_question
// import { supabase } from "@/utils/supabase";
// import { getDatabase } from "..";
// import { QuestionType } from "@/constants/Types";

// async function syncQuestions(language: string): Promise<void> {
//   try {
//     // 1) Fetch remote questions (only columns we need)
//     const { data: questions, error } = await supabase
//       .from("questions")
//       .select(`
//         id, title, question, answer, answer_sistani, answer_khamenei,
//         question_category_name, question_subcategory_name, created_at, language_code
//       `)
//       .eq("language_code", language);

//     if (error) {
//       console.error("Error fetching questions from Supabase:", error.message);
//       return;
//     }

//     const list = (questions ?? []) as QuestionType[];
//     const db = await getDatabase();

//     // 2) Single transaction
//     const runTx =
//       (db as any).withExclusiveTransactionAsync?.bind(db) ??
//       db.withTransactionAsync.bind(db);

//     await runTx(async (txn: any) => {
//       // Prepare statements matching YOUR migration
//       const catStmt = await txn.prepareAsync(
//         `INSERT OR IGNORE INTO question_categories (category_name, language_code)
//          VALUES (?, ?);`
//       );
//       const subcatStmt = await txn.prepareAsync(
//         `INSERT OR IGNORE INTO question_subcategories (subcategory_name, language_code, created_at)
//          VALUES (?, ?, ?);`
//       );
//       const insertStmt = await txn.prepareAsync(
//         `INSERT OR REPLACE INTO questions
//            (id, title, question, answer, answer_sistani, answer_khamenei,
//             question_category_name, question_subcategory_name, created_at, language_code)
//          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`
//       );

//       try {
//         // a) Build category/subcategory sets from the payload
//         const categories = new Set<string>();
//         const subcategories = new Set<string>();
//         for (const q of list) {
//           if (q.question_category_name) categories.add(q.question_category_name);
//           if (q.question_subcategory_name) subcategories.add(q.question_subcategory_name);
//         }

//         // b) Upsert categories (need language_code)
//         for (const name of categories) {
//           await catStmt.executeAsync([name, language]);
//         }

//         // c) Upsert subcategories (need language_code + created_at)
//         //    We don’t have a dedicated timestamp from Supabase here, so use NOW ISO.
//         const nowIso = new Date().toISOString();
//         for (const name of subcategories) {
//           await subcatStmt.executeAsync([name, language, nowIso]);
//         }

//         // d) Replace all questions for this language (simpler/safer than NOT IN list)
//         await txn.runAsync(`DELETE FROM questions WHERE language_code = ?;`, [language]);

//         // e) Insert questions
//         for (const q of list) {
//           await insertStmt.executeAsync([
//             q.id,
//             q.title,
//             q.question,
//             q.answer ?? null,
//             q.answer_sistani ?? null,
//             q.answer_khamenei ?? null,
//             q.question_category_name,
//             q.question_subcategory_name,
//             q.created_at,   // you said these are always present/valid
//             q.language_code,
//           ]);
//         }
//       } finally {
//         await Promise.allSettled([
//           catStmt.finalizeAsync(),
//           subcatStmt.finalizeAsync(),
//           insertStmt.finalizeAsync(),
//         ]);
//       }
//     });

//     console.log("Questions synced successfully for language:", language);
//   } catch (err) {
//     console.error("Critical error in syncQuestions:", err);
//   }
// }

// export default syncQuestions;

import { supabase } from "@/utils/supabase";
import { getDatabase } from "..";
import { QuestionType } from "@/constants/Types";

function serializeRelatedQuestion(value: any): string | null {
  if (value == null) return null;
  if (typeof value === "string") return value; // already JSON string
  try {
    return JSON.stringify(value); // array/object → string
  } catch {
    return null;
  }
}

async function syncQuestions(language: string): Promise<void> {
  try {
    // 1) Fetch remote questions (only columns we need)
    const { data: questions, error } = await supabase
      .from("questions")
      .select(
        `
        id, title, question, answer, answer_sistani, answer_khamenei,
        question_category_name, question_subcategory_name, created_at, language_code,
        related_question
      `
      )
      .eq("language_code", language);

    if (error) {
      console.error("Error fetching questions from Supabase:", error.message);
      return;
    }

    const list = (questions ?? []) as QuestionType[]; // may carry related_question alongside
    const db = await getDatabase();

    // 2) Single transaction
    const runTx =
      (db as any).withExclusiveTransactionAsync?.bind(db) ??
      db.withTransactionAsync.bind(db);

    await runTx(async (txn: any) => {
      // Prepare statements matching YOUR migration
      const catStmt = await txn.prepareAsync(
        `INSERT OR IGNORE INTO question_categories (category_name, language_code)
         VALUES (?, ?);`
      );
      const subcatStmt = await txn.prepareAsync(
        `INSERT OR IGNORE INTO question_subcategories (subcategory_name, language_code, created_at)
         VALUES (?, ?, ?);`
      );
      const insertStmt = await txn.prepareAsync(
        `INSERT OR REPLACE INTO questions
           (id, title, question, answer, answer_sistani, answer_khamenei,
            question_category_name, question_subcategory_name, created_at, related_question, language_code)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`
      );

      try {
        // a) Build category/subcategory sets from the payload
        const categories = new Set<string>();
        const subcategories = new Set<string>();
        for (const q of list as any[]) {
          if (q.question_category_name)
            categories.add(q.question_category_name);
          if (q.question_subcategory_name)
            subcategories.add(q.question_subcategory_name);
        }

        // b) Upsert categories (need language_code)
        for (const name of categories) {
          await catStmt.executeAsync([name, language]);
        }

        // c) Upsert subcategories (need language_code + created_at)
        const nowIso = new Date().toISOString();
        for (const name of subcategories) {
          await subcatStmt.executeAsync([name, language, nowIso]);
        }

        // d) Replace all questions for this language
        await txn.runAsync(`DELETE FROM questions WHERE language_code = ?;`, [
          language,
        ]);

        // e) Insert questions (now includes related_question)
        for (const q of list as any[]) {
          const related = serializeRelatedQuestion(q.related_question);
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
            related, // JSON string or null
            q.language_code,
          ]);
        }
      } finally {
        await Promise.allSettled([
          catStmt.finalizeAsync(),
          subcatStmt.finalizeAsync(),
          insertStmt.finalizeAsync(),
        ]);
      }
    });

    console.log("Questions synced successfully for language:", language);
  } catch (err) {
    console.error("Critical error in syncQuestions:", err);
  }
}

export default syncQuestions;
