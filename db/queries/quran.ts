import { getDatabase } from "../index";
import {
  Language,
  QuranVerseType,
  SuraRowType,
  MarkerRowType,
  JuzRow,
} from "@/constants/Types";

// small helper to map language → table/column
function verseSelectFor(lang: Language) {
  if (lang === "ar") {
    return {
      table: "aya_ar",
      col: "quran_arabic_text",
      select: "id, sura, aya, quran_arabic_text AS text",
    } as const;
  }
  if (lang === "de") {
    return {
      table: "aya_de",
      col: "quran_german_text",
      select: "id, sura, aya, quran_german_text AS text",
    } as const;
  }
  // en
  return {
    table: "aya_en",
    col: `"desc"`,
    select: 'id, sura, aya, "desc" AS text',
  } as const;
}

/** LIKE search over verses in the chosen language. */
export async function searchQuran(
  searchTerm: string,
  lang: Language,
  limit = 50
): Promise<QuranVerseType[]> {
  const db = await getDatabase();
  const { table, col, select } = verseSelectFor(lang);

  return db.getAllAsync<QuranVerseType>(
    `
    SELECT ${select}
    FROM ${table}
    WHERE ${col} LIKE ?
    ORDER BY sura, aya
    LIMIT ?;
    `,
    [`%${searchTerm}%`, limit]
  );
}

/** Get a single ayah (with transliteration for English). */
export async function getAyah(
  lang: Language,
  sura: number,
  aya: number
): Promise<QuranVerseType | null> {
  const db = await getDatabase();

  if (lang === "en") {
    const row = await db.getFirstAsync<
      QuranVerseType & { transliteration: string | null }
    >(
      `
      SELECT e.sura, e.aya, e."desc" AS text, t.quran_transliteration_text AS transliteration
      FROM aya_en e
      LEFT JOIN aya_en_transliteration t
        ON t.sura = e.sura AND t.aya = e.aya
      WHERE e.sura = ? AND e.aya = ?
      LIMIT 1;
      `,
      [sura, aya]
    );
    return row ?? null;
  }

  const { table, col } = verseSelectFor(lang);
  const row = await db.getFirstAsync<QuranVerseType>(
    `
    SELECT sura, aya, ${col} AS text
    FROM ${table}
    WHERE sura = ? AND aya = ?
    LIMIT 1;
    `,
    [sura, aya]
  );
  return row ?? null;
}

/** Get all verses for a surah (with transliteration for English). */
export async function getSurahVerses(
  lang: Language,
  sura: number
): Promise<QuranVerseType[]> {
  const db = await getDatabase();

  if (lang === "en") {
    return db.getAllAsync<QuranVerseType & { transliteration: string | null }>(
      `
      SELECT e.sura, e.aya, e."desc" AS text, t.quran_transliteration_text AS transliteration
      FROM aya_en e
      LEFT JOIN aya_en_transliteration t
        ON t.sura = e.sura AND t.aya = e.aya
      WHERE e.sura = ?
      ORDER BY e.aya;
      `,
      [sura]
    );
  }

  const { table, col } = verseSelectFor(lang);
  return db.getAllAsync<QuranVerseType>(
    `
    SELECT sura, aya, ${col} AS text
    FROM ${table}
    WHERE sura = ?
    ORDER BY aya;
    `,
    [sura]
  );
}

/** List all surahs (metadata). */
export async function getSurahList(): Promise<SuraRowType[]> {
  const db = await getDatabase();
  return db.getAllAsync<SuraRowType>(
    `
    SELECT
      id, orderId, label, label_en, label_de,
      nbAyat, nbWord, nbLetter, startPage, endPage, makki, ruku
    FROM sura
    ORDER BY orderId;
    `
  );
}

/** Get one surah’s metadata by canonical number (1..114). */
export async function getSurahInfoByNumber(
  surahNumber: number
): Promise<SuraRowType | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<SuraRowType>(
    `
    SELECT
      id, orderId, label, label_en, label_de,
      nbAyat, nbWord, nbLetter, startPage, endPage, makki, ruku
    FROM sura
    WHERE orderId = ?
    LIMIT 1;
    `,
    [surahNumber]
  );
  return row ?? null;
}

/** Localized display name helper. */
export async function getSurahDisplayName(
  surahNumber: number,
  lang: Language
): Promise<string | null> {
  const info = await getSurahInfoByNumber(surahNumber);
  if (!info) return null;
  if (lang === "en") return info.label_en ?? info.label;
  if (lang === "de") return info.label_de ?? info.label;
  return info.label;
}

/** Markers for a given surah. */
export async function getHizbForSurah(sura: number): Promise<MarkerRowType[]> {
  const db = await getDatabase();
  return db.getAllAsync<MarkerRowType>(
    `SELECT id, sura, aya FROM hizb WHERE sura = ? ORDER BY aya;`,
    [sura]
  );
}

export async function getRukuForSurah(sura: number): Promise<MarkerRowType[]> {
  const db = await getDatabase();
  return db.getAllAsync<MarkerRowType>(
    `SELECT id, sura, aya FROM ruku WHERE sura = ? ORDER BY aya;`,
    [sura]
  );
}

export async function getSajdaForSurah(
  sura: number
): Promise<(MarkerRowType & { type: number | null })[]> {
  const db = await getDatabase();
  return db.getAllAsync<MarkerRowType & { type: number | null }>(
    `SELECT id, sura, aya, type FROM sajda WHERE sura = ? ORDER BY aya;`,
    [sura]
  );
}

export async function getJuzForSurah(sura: number): Promise<JuzRow[]> {
  const db = await getDatabase();
  return db.getAllAsync<JuzRow>(
    `SELECT id, sura, aya, page FROM juz WHERE sura = ? ORDER BY aya;`,
    [sura]
  );
}

/** Find the page that contains a particular ayah (based on page markers in juz). */
export async function getPageForAyah(
  sura: number,
  aya: number
): Promise<number | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<{ page: number }>(
    `
    SELECT page
    FROM juz
    WHERE (sura < ? OR (sura = ? AND aya <= ?))
    ORDER BY sura DESC, aya DESC
    LIMIT 1;
    `,
    [sura, sura, aya]
  );
  return row?.page ?? null;
}
