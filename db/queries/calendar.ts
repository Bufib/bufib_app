import { getDatabase } from "..";
import { CalendarType } from "@/constants/Types";

export async function getAllCalendarEvents(
  language: string
): Promise<CalendarType[]> {
  try {
    const db = await getDatabase();
    return db.getAllAsync<CalendarType>(
      `
      SELECT *
      FROM calendar
      WHERE language_code = ?
      ORDER BY gregorian_date;
      `,
      [language]
    );
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    return [];
  }
}
