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
      SELECT DISTINCT question_subcategory_name FROM questions WHERE question_category_name = ?;
    `,
      [question_category_name]
    );
    return rows.map((row) => row.question_subcategory_name);
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    throw error;
  }
};

export const getQuestionsForSubcategory = async (
  categoryName: string,
  subcategoryName: string
): Promise<QuestionType[]> => {
  try {
    const db = await getDatabase();
    return await db.getAllAsync<QuestionType>(
      `
      SELECT * FROM questions WHERE question_category_name = ? AND question_subcategory_name = ? ORDER BY created_at DESC;
    `,
      [categoryName, subcategoryName]
    );
  } catch (error) {
    console.error("Error fetching questions for subcategory:", error);
    throw error;
  }
};

export const getQuestion = async (
  categoryName: string,
  subcategoryName: string,
  questionId: number
): Promise<QuestionType> => {
  try {
    const db = await getDatabase();
    const rows = await db.getAllAsync<QuestionType>(
      `
      SELECT * FROM questions
      WHERE question_category_name = ? AND question_subcategory_name = ? AND id = ?
      LIMIT 1;
    `,
      [categoryName, subcategoryName, questionId]
    );
    return rows[0];
  } catch (error) {
    console.error("Error fetching question:", error);
    throw error;
  }
};

export const getQuestionInternalURL = async (
  questionTitle: string
): Promise<QuestionType> => {
  try {
    const db = await getDatabase();
    const rows = await db.getAllAsync<QuestionType>(
      `
      SELECT * FROM questions
      WHERE title = ?;
    `,
      [questionTitle]
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
  limit: number = 10
): Promise<QuestionType[]> => {
  const db = await getDatabase();
  return await db.getAllAsync<QuestionType>(
    `
    SELECT * FROM questions
    ORDER BY created_at DESC
    LIMIT ?;
  `,
    [limit]
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