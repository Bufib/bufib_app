import { getDatabase } from '../index';
import { QuestionType } from '@/constants/Types';

export async function getQuestionCount(): Promise<number> {
  const db = await getDatabase();
  const result = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM questions;'
  );
  return result?.count ?? 0;
}

export async function getSubcategoriesForCategory(
  category: string
): Promise<string[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<{ question_subcategory_name: string }>(
    'SELECT DISTINCT question_subcategory_name FROM questions WHERE question_category_name = ?;',
    [category]
  );
  return rows.map(r => r.question_subcategory_name);
}
