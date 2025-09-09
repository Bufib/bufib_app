// src/db/queries/calendar.ts
import { getDatabase } from "..";
import { CalendarType, calendarLegendType } from "@/constants/Types";

/** All calendar rows for a language (ordered by date). */
export async function getAllCalendarDates(
  language: string
): Promise<CalendarType[]> {
  try {
    const db = await getDatabase();
    return db.getAllAsync<CalendarType>(
      `
      SELECT id, title, islamic_date, gregorian_date, description, legend_type, created_at, language_code
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

/** All legend rows for a language (alphabetical). */
export async function getAllCalendarLegend(
  language: string
): Promise<calendarLegendType[]> {
  try {
    const db = await getDatabase();
    return db.getAllAsync<calendarLegendType>(
      `
      SELECT id, legend_type, created_at, language_code
      FROM calendarLegend
      WHERE language_code = ?
      ORDER BY LOWER(legend_type);
      `,
      [language]
    );
  } catch (error) {
    console.error("Error fetching calendar legend_type:", error);
    return [];
  }
}

/** Just the legend_type names (for pickers), filtered by language. */
export async function getCalendarLegendTypeNames(
  language: string
): Promise<string[]> {
  try {
    const db = await getDatabase();
    const rows = await db.getAllAsync<{ legend_type: string }>(
      `
      SELECT legend_type
      FROM calendarLegend
      WHERE language_code = ?
      ORDER BY LOWER(legend_type);
      `,
      [language]
    );
    return rows.map((r) => r.legend_type);
  } catch (error) {
    console.error("Error fetching calendar legend_type:", error);
    return [];
  }
}

/** Count how many events each legend_type has (for a language). */
export async function getCalendarEventsCount(
  language: string
): Promise<Array<{ legend_type: string; count: number }>> {
  try {
    const db = await getDatabase();
    return db.getAllAsync<{ legend_type: string; count: number }>(
      `
      SELECT cl.legend_type AS legend_type, COUNT(c.id) AS count
      FROM calendarLegend cl
      LEFT JOIN calendar c
        ON c.legend_type = cl.legend_type
       AND c.language_code = cl.language_code
      WHERE cl.language_code = ?
      GROUP BY cl.legend_type
      ORDER BY LOWER(cl.legend_type);
      `,
      [language]
    );
  } catch (error) {
    console.error("Error fetching calendar legend_type counts:", error);
    return [];
  }
}

/** All events of a specific legend_type for a language (oldest → newest). */
export async function getCalendarEventsByLegendType(
  language: string,
  legend_type: string
): Promise<CalendarType[]> {
  try {
    const db = await getDatabase();
    return db.getAllAsync<CalendarType>(
      `
      SELECT id, title, islamic_date, gregorian_date, description, legend_type, created_at, language_code
      FROM calendar
      WHERE language_code = ? AND legend_type = ?
      ORDER BY gregorian_date;
      `,
      [language, legend_type]
    );
  } catch (error) {
    console.error("Error fetching events by legend_type:", error);
    return [];
  }
}
