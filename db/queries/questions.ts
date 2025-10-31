import { getDatabase } from "../index";
import { QuestionType } from "@/constants/Types";

export async function getQuestionCount(): Promise<number> {
  const db = await getDatabase();
  const result = await db.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) as count FROM questions;"
  );
  return result?.count ?? 0;
}

export const getSubcategoriesForCategory = async (
  question_category_name: string,
  language: string
): Promise<string[]> => {
  try {
    const db = await getDatabase();
    const rows = await db.getAllAsync<{ question_subcategory_name: string }>(
      `
     SELECT DISTINCT question_subcategory_name
      FROM questions
      WHERE question_category_name = ?
      AND language_code = ?;
    `,
      [question_category_name, language]
    );
    return rows.map((row) => row.question_subcategory_name);
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    throw error;
  }
};

export const getQuestionsForSubcategory = async (
  categoryName: string,
  subcategoryName: string,
  language: string
): Promise<QuestionType[]> => {
  try {
    const db = await getDatabase();
    return await db.getAllAsync<QuestionType>(
      `
      SELECT * FROM questions WHERE question_category_name = ? AND question_subcategory_name = ?  AND language_code = ? ORDER BY created_at DESC;
    `,
      [categoryName, subcategoryName, language]
    );
  } catch (error) {
    console.error("Error fetching questions for subcategory:", error);
    throw error;
  }
};

export const getQuestion = async (
  categoryName: string,
  subcategoryName: string,
  questionId: number,
  language: string
): Promise<QuestionType> => {
  try {
    const db = await getDatabase();
    const rows = await db.getAllAsync<QuestionType>(
      `
      SELECT * FROM questions
      WHERE question_category_name = ? AND question_subcategory_name = ? AND id = ? AND language_code = ?
      LIMIT 1;
    `,
      [categoryName, subcategoryName, questionId, language]
    );
    return rows[0];
  } catch (error) {
    console.error("Error fetching question:", error);
    throw error;
  }
};

export const getQuestionInternalURL = async (
  questionTitle: string,
  language: string
): Promise<QuestionType> => {
  try {
    const db = await getDatabase();
    const rows = await db.getAllAsync<QuestionType>(
      `
      SELECT * FROM questions
      WHERE title = ?
      AND language_code = ?;
      
    `,
      [questionTitle, language]
    );
    return rows[0];
  } catch (error) {
    console.error("Error fetching question:", error);
    throw error;
  }
};

export const searchQuestions = async (
  searchTerm: string
): Promise<QuestionType[]> => {
  try {
    const db = await getDatabase();
    return await db.getAllAsync<QuestionType>(
      `
      SELECT id, question_category_name, question_subcategory_name, question, title
      FROM questions
      WHERE question LIKE ? OR title LIKE ?;
    `,
      [`%${searchTerm}%`, `%${searchTerm}%`]
    );
  } catch (error) {
    console.error("Error searching questions:", error);
    throw error;
  }
};

export const getLatestQuestions = async (
  language: string
): Promise<QuestionType[]> => {
  const db = await getDatabase();
  return await db.getAllAsync<QuestionType>(
    `
    SELECT * FROM questions
    WHERE language_code = ?
    ORDER BY created_at DESC
    LIMIT 10;
  `,
    [language]
  );
};

export const isQuestionInFavorite = async (
  questionId: number
): Promise<boolean> => {
  try {
    const db = await getDatabase();
    const result = await db.getFirstAsync<{ count: number }>(
      `
      SELECT COUNT(*) as count FROM favorite_questions WHERE question_id = ?;
    `,
      [questionId]
    );
    if (result && result.count !== undefined) {
      return result.count > 0;
    }
    return false;
  } catch (error) {
    console.error("Error checking favorite status:", error);
    throw error;
  }
};

export const getFavoriteQuestions = async (): Promise<QuestionType[]> => {
  try {
    const db = await getDatabase();
    return await db.getAllAsync<QuestionType>(`
      SELECT q.*
      FROM questions   AS q
      JOIN favorite_questions AS f
        ON q.id = f.question_id
      ORDER BY datetime(f.created_at) DESC;
    `);
  } catch (error) {
    console.error("Error retrieving favorite questions:", error);
    throw error;
  }
};

export const toggleQuestionFavorite = async (
  questionId: number
): Promise<boolean> => {
  const db = await getDatabase();
  const row = await db.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) AS count FROM favorite_questions WHERE question_id = ?;`,
    [questionId]
  );
  const exists = (row?.count ?? 0) > 0;

  if (exists) {
    await db.runAsync(`DELETE FROM favorite_questions WHERE question_id = ?;`, [
      questionId,
    ]);
    return false;
  } else {
    await db.runAsync(
      `INSERT OR IGNORE INTO favorite_questions (question_id) VALUES (?);`,
      [questionId]
    );
    return true;
  }
};

export const getRelatedQuestions = async (
  questionId: number,
  language: string
): Promise<QuestionType[]> => {
  const db = await getDatabase();

  // 1) Read the JSON array from the source question
  const row = await db.getFirstAsync<{ related_question: string | null }>(
    `SELECT related_question
       FROM questions
      WHERE id = ? AND language_code = ?
      LIMIT 1;`,
    [questionId, language]
  );
  if (!row?.related_question) return [];

  // 2) Expand JSON and join back to questions
  return await db.getAllAsync<QuestionType>(
    `
    SELECT q.*
      FROM json_each(?) AS j
      JOIN questions AS q
        ON q.id = CAST(j.value AS INTEGER)
       AND q.language_code = ?
     ORDER BY CAST(j.key AS INTEGER);  -- preserves input array order
    `,
    [row.related_question, language]
  );
};
