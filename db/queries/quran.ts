// //! Orginal ohne JUZ

// // import { getDatabase } from "../index";
// // import {
// //   Language,
// //   QuranVerseType,
// //   SuraRowType,
// //   MarkerRowType,
// //   JuzRow,
// // } from "@/constants/Types";

// // // small helper to map language → table/column
// // function verseSelectFor(lang: Language) {
// //   if (lang === "ar") {
// //     return {
// //       table: "aya_ar",
// //       col: "quran_arabic_text",
// //       select: "id, sura, aya, quran_arabic_text AS text",
// //     } as const;
// //   }
// //   if (lang === "de") {
// //     return {
// //       table: "aya_de",
// //       col: "quran_german_text",
// //       select: "id, sura, aya, quran_german_text AS text",
// //     } as const;
// //   }
// //   // en
// //   return {
// //     table: "aya_en",
// //     col: `"desc"`,
// //     select: 'id, sura, aya, "desc" AS text',
// //   } as const;
// // }

// // /** LIKE search over verses in the chosen language. */
// // export async function searchQuran(
// //   searchTerm: string,
// //   lang: Language,
// //   limit = 50
// // ): Promise<QuranVerseType[]> {
// //   const db = getDatabase();
// //   const { table, col, select } = verseSelectFor(lang);

// //   return db.getAllAsync<QuranVerseType>(
// //     `
// //     SELECT ${select}
// //     FROM ${table}
// //     WHERE ${col} LIKE ?
// //     ORDER BY sura, aya
// //     LIMIT ?;
// //     `,
// //     [`%${searchTerm}%`, limit]
// //   );
// // }

// // /** Get a single ayah (with transliteration for English). */
// // export async function getAyah(
// //   lang: Language,
// //   sura: number,
// //   aya: number
// // ): Promise<QuranVerseType | null> {
// //   const db = getDatabase();

// //   if (lang === "en") {
// //     const row = await db.getFirstAsync<
// //       QuranVerseType & { transliteration: string | null }
// //     >(
// //       `
// //       SELECT e.sura, e.aya, e."desc" AS text, t.quran_transliteration_text AS transliteration
// //       FROM aya_en e
// //       LEFT JOIN aya_en_transliteration t
// //         ON t.sura = e.sura AND t.aya = e.aya
// //       WHERE e.sura = ? AND e.aya = ?
// //       LIMIT 1;
// //       `,
// //       [sura, aya]
// //     );
// //     return row ?? null;
// //   }

// //   const { table, col } = verseSelectFor(lang);
// //   const row = await db.getFirstAsync<QuranVerseType>(
// //     `
// //     SELECT sura, aya, ${col} AS text
// //     FROM ${table}
// //     WHERE sura = ? AND aya = ?
// //     LIMIT 1;
// //     `,
// //     [sura, aya]
// //   );
// //   return row ?? null;
// // }

// // /** Get all verses for a surah (with transliteration for English). */
// // export async function getSurahVerses(
// //   lang: Language,
// //   sura: number
// // ): Promise<QuranVerseType[]> {
// //   const db = getDatabase();

// //   if (lang === "en") {
// //     return db.getAllAsync<QuranVerseType & { transliteration: string | null }>(
// //       `
// //       SELECT e.sura, e.aya, e."desc" AS text, t.quran_transliteration_text AS transliteration
// //       FROM aya_en e
// //       LEFT JOIN aya_en_transliteration t
// //         ON t.sura = e.sura AND t.aya = e.aya
// //       WHERE e.sura = ?
// //       ORDER BY e.aya;
// //       `,
// //       [sura]
// //     );
// //   }

// //   const { table, col } = verseSelectFor(lang);
// //   return db.getAllAsync<QuranVerseType>(
// //     `
// //     SELECT sura, aya, ${col} AS text
// //     FROM ${table}
// //     WHERE sura = ?
// //     ORDER BY aya;
// //     `,
// //     [sura]
// //   );
// // }

// // /** List all surahs (metadata). */
// // export async function getSurahList(): Promise<SuraRowType[]> {
// //   const db = getDatabase();
// //   return db.getAllAsync<SuraRowType>(
// //     `
// //     SELECT
// //       id, orderId, label, label_en, label_de,
// //       nbAyat, nbWord, nbLetter, startPage, endPage, makki, ruku
// //     FROM sura
// //     ORDER BY id;
// //     `
// //   );
// // }

// // export async function getSurahInfoByNumber(
// //   surahNumber: number
// // ): Promise<SuraRowType | null> {
// //   const db = getDatabase();
// //   const row = await db.getFirstAsync<SuraRowType>(
// //     `
// //     SELECT
// //       id, orderId, label, label_en, label_de,
// //       nbAyat, nbWord, nbLetter, startPage, endPage, makki, ruku
// //     FROM sura
// //     WHERE id = ?
// //     LIMIT 1;
// //     `,
// //     [surahNumber]
// //   );
// //   return row ?? null;
// // }

// // /** Localized display name helper. */
// // export async function getSurahDisplayName(
// //   surahNumber: number,
// //   lang: Language
// // ): Promise<string | null> {
// //   const info = await getSurahInfoByNumber(surahNumber);
// //   if (!info) return null;
// //   if (lang === "en") return info.label_en ?? info.label;
// //   if (lang === "de") return info.label_de ?? info.label;
// //   return info.label;
// // }

// // /** Markers for a given surah. */
// // export async function getHizbForSurah(sura: number): Promise<MarkerRowType[]> {
// //   const db = getDatabase();
// //   return db.getAllAsync<MarkerRowType>(
// //     `SELECT id, sura, aya FROM hizb WHERE sura = ? ORDER BY aya;`,
// //     [sura]
// //   );
// // }

// // export async function getRukuForSurah(sura: number): Promise<MarkerRowType[]> {
// //   const db = getDatabase();
// //   return db.getAllAsync<MarkerRowType>(
// //     `SELECT id, sura, aya FROM ruku WHERE sura = ? ORDER BY aya;`,
// //     [sura]
// //   );
// // }

// // export async function getSajdaForSurah(
// //   sura: number
// // ): Promise<(MarkerRowType & { type: number | null })[]> {
// //   const db = getDatabase();
// //   return db.getAllAsync<MarkerRowType & { type: number | null }>(
// //     `SELECT id, sura, aya, type FROM sajda WHERE sura = ? ORDER BY aya;`,
// //     [sura]
// //   );
// // }

// // export async function getJuzForSurah(sura: number): Promise<JuzRow[]> {
// //   const db = getDatabase();
// //   return db.getAllAsync<JuzRow>(
// //     `SELECT id, sura, aya, page FROM juz WHERE sura = ? ORDER BY aya;`,
// //     [sura]
// //   );
// // }

// // /** Find the page that contains a particular ayah (based on page markers in juz). */
// // export async function getPageForAyah(
// //   sura: number,
// //   aya: number
// // ): Promise<number | null> {
// //   const db = getDatabase();
// //   const row = await db.getFirstAsync<{ page: number }>(
// //     `
// //     SELECT page
// //     FROM juz
// //     WHERE (sura < ? OR (sura = ? AND aya <= ?))
// //     ORDER BY sura DESC, aya DESC
// //     LIMIT 1;
// //     `,
// //     [sura, sura, aya]
// //   );
// //   return row?.page ?? null;
// // }

// // import { getDatabase } from "../index";
// // import {
// //   Language,
// //   QuranVerseType,
// //   SuraRowType,
// //   MarkerRowType,
// //   JuzRow,
// // } from "@/constants/Types";

// // // small helper to map language → table/column
// // function verseSelectFor(lang: Language) {
// //   if (lang === "ar") {
// //     return {
// //       table: "aya_ar",
// //       col: "quran_arabic_text",
// //       select: "id, sura, aya, quran_arabic_text AS text",
// //     } as const;
// //   }
// //   if (lang === "de") {
// //     return {
// //       table: "aya_de",
// //       col: "quran_german_text",
// //       select: "id, sura, aya, quran_german_text AS text",
// //     } as const;
// //   }
// //   // en
// //   return {
// //     table: "aya_en",
// //     col: "quran_english_text",
// //     select: "id, sura, aya, quran_english_text AS text",
// //   } as const;
// // }

// // /** LIKE search over verses in the chosen language. */
// // export async function searchQuran(
// //   searchTerm: string,
// //   lang: Language,
// //   limit = 50
// // ): Promise<QuranVerseType[]> {
// //   const db = getDatabase();
// //   const { table, col, select } = verseSelectFor(lang);

// //   return db.getAllAsync<QuranVerseType>(
// //     `
// //     SELECT ${select}
// //     FROM ${table}
// //     WHERE ${col} LIKE ?
// //     ORDER BY sura, aya
// //     LIMIT ?;
// //     `,
// //     [`%${searchTerm}%`, limit]
// //   );
// // }

// // /** Get a single ayah (always with Arabic transliteration). */
// // export async function getAyah(
// //   lang: Language,
// //   sura: number,
// //   aya: number
// // ): Promise<QuranVerseType | null> {
// //   const db = getDatabase();

// //   // Always include transliteration from aya_en_transliteration table
// //   // as it contains the Arabic transliteration for all languages
// //   if (lang === "ar") {
// //     const row = await db.getFirstAsync<
// //       QuranVerseType & { transliteration: string | null }
// //     >(
// //       `
// //       SELECT a.sura, a.aya, a.quran_arabic_text AS text,
// //              t.quran_transliteration_text AS transliteration
// //       FROM aya_ar a
// //       LEFT JOIN aya_en_transliteration t
// //         ON t.sura = a.sura AND t.aya = a.aya
// //       WHERE a.sura = ? AND a.aya = ?
// //       LIMIT 1;
// //       `,
// //       [sura, aya]
// //     );
// //     return row ?? null;
// //   }

// //   if (lang === "de") {
// //     const row = await db.getFirstAsync<
// //       QuranVerseType & { transliteration: string | null }
// //     >(
// //       `
// //       SELECT d.sura, d.aya, d.quran_german_text AS text,
// //              t.quran_transliteration_text AS transliteration
// //       FROM aya_de d
// //       LEFT JOIN aya_en_transliteration t
// //         ON t.sura = d.sura AND t.aya = d.aya
// //       WHERE d.sura = ? AND d.aya = ?
// //       LIMIT 1;
// //       `,
// //       [sura, aya]
// //     );
// //     return row ?? null;
// //   }

// //   // English
// //   const row = await db.getFirstAsync<
// //     QuranVerseType & { transliteration: string | null }
// //   >(
// //     `
// //     SELECT e.sura, e.aya, e.quran_english_text AS text,
// //            t.quran_transliteration_text AS transliteration
// //     FROM aya_en e
// //     LEFT JOIN aya_en_transliteration t
// //       ON t.sura = e.sura AND t.aya = e.aya
// //     WHERE e.sura = ? AND e.aya = ?
// //     LIMIT 1;
// //     `,
// //     [sura, aya]
// //   );
// //   return row ?? null;
// // }

// // /** Get all verses for a surah (always with Arabic transliteration). */
// // export async function getSurahVerses(
// //   lang: Language,
// //   sura: number
// // ): Promise<QuranVerseType[]> {
// //   const db = getDatabase();

// //   // Always include transliteration from aya_en_transliteration table
// //   // as it contains the Arabic transliteration for all languages
// //   if (lang === "ar") {
// //     return db.getAllAsync<QuranVerseType & { transliteration: string | null }>(
// //       `
// //       SELECT a.sura, a.aya, a.quran_arabic_text AS text,
// //              t.quran_transliteration_text AS transliteration
// //       FROM aya_ar a
// //       LEFT JOIN aya_en_transliteration t
// //         ON t.sura = a.sura AND t.aya = a.aya
// //       WHERE a.sura = ?
// //       ORDER BY a.aya;
// //       `,
// //       [sura]
// //     );
// //   }

// //   if (lang === "de") {
// //     return db.getAllAsync<QuranVerseType & { transliteration: string | null }>(
// //       `
// //       SELECT d.sura, d.aya, d.quran_german_text AS text,
// //              t.quran_transliteration_text AS transliteration
// //       FROM aya_de d
// //       LEFT JOIN aya_en_transliteration t
// //         ON t.sura = d.sura AND t.aya = d.aya
// //       WHERE d.sura = ?
// //       ORDER BY d.aya;
// //       `,
// //       [sura]
// //     );
// //   }

// //   // English
// //   return db.getAllAsync<QuranVerseType & { transliteration: string | null }>(
// //     `
// //     SELECT e.sura, e.aya, e.quran_english_text AS text,
// //            t.quran_transliteration_text AS transliteration
// //     FROM aya_en e
// //     LEFT JOIN aya_en_transliteration t
// //       ON t.sura = e.sura AND t.aya = e.aya
// //     WHERE e.sura = ?
// //     ORDER BY e.aya;
// //     `,
// //     [sura]
// //   );
// // }

// // /** List all surahs (metadata). */
// // export async function getSurahList(): Promise<SuraRowType[]> {
// //   const db = getDatabase();
// //   return db.getAllAsync<SuraRowType>(
// //     `
// //     SELECT
// //       id, orderId, label, label_en, label_de,
// //       nbAyat, nbWord, nbLetter, startPage, endPage, makki, ruku
// //     FROM sura
// //     ORDER BY id;
// //     `
// //   );
// // }

// // export async function getSurahInfoByNumber(
// //   surahNumber: number
// // ): Promise<SuraRowType | null> {
// //   const db = getDatabase();
// //   const row = await db.getFirstAsync<SuraRowType>(
// //     `
// //     SELECT
// //       id, orderId, label, label_en, label_de,
// //       nbAyat, nbWord, nbLetter, startPage, endPage, makki, ruku
// //     FROM sura
// //     WHERE id = ?
// //     LIMIT 1;
// //     `,
// //     [surahNumber]
// //   );
// //   return row ?? null;
// // }

// // /** Localized display name helper. */
// // export async function getSurahDisplayName(
// //   surahNumber: number,
// //   lang: Language
// // ): Promise<string | null> {
// //   const info = await getSurahInfoByNumber(surahNumber);
// //   if (!info) return null;
// //   if (lang === "en") return info.label_en ?? info.label;
// //   if (lang === "de") return info.label_de ?? info.label;
// //   return info.label;
// // }

// // /** Markers for a given surah. */
// // export async function getHizbForSurah(sura: number): Promise<MarkerRowType[]> {
// //   const db = getDatabase();
// //   return db.getAllAsync<MarkerRowType>(
// //     `SELECT id, sura, aya FROM hizb WHERE sura = ? ORDER BY aya;`,
// //     [sura]
// //   );
// // }

// // export async function getRukuForSurah(sura: number): Promise<MarkerRowType[]> {
// //   const db = getDatabase();
// //   return db.getAllAsync<MarkerRowType>(
// //     `SELECT id, sura, aya FROM ruku WHERE sura = ? ORDER BY aya;`,
// //     [sura]
// //   );
// // }

// // export async function getSajdaForSurah(
// //   sura: number
// // ): Promise<(MarkerRowType & { type: number | null })[]> {
// //   const db = getDatabase();
// //   return db.getAllAsync<MarkerRowType & { type: number | null }>(
// //     `SELECT id, sura, aya, type FROM sajda WHERE sura = ? ORDER BY aya;`,
// //     [sura]
// //   );
// // }

// // export async function getJuzForSurah(sura: number): Promise<JuzRow[]> {
// //   const db = getDatabase();
// //   return db.getAllAsync<JuzRow>(
// //     `SELECT id, sura, aya, page FROM juz WHERE sura = ? ORDER BY aya;`,
// //     [sura]
// //   );
// // }

// // /** Find the page that contains a particular ayah (based on page markers in juz). */
// // export async function getPageForAyah(
// //   sura: number,
// //   aya: number
// // ): Promise<number | null> {
// //   const db = getDatabase();
// //   const row = await db.getFirstAsync<{ page: number }>(
// //     `
// //     SELECT page
// //     FROM juz
// //     WHERE (sura < ? OR (sura = ? AND aya <= ?))
// //     ORDER BY sura DESC, aya DESC
// //     LIMIT 1;
// //     `,
// //     [sura, sura, aya]
// //   );
// //   return row?.page ?? null;
// // }

// //! First try mit juz
// import { getDatabase } from "../index";
// import {
//   Language,
//   QuranVerseType,
//   SuraRowType,
//   MarkerRowType,
//   JuzRow,
//   JuzStartType,
//   JuzBoundsType,
// } from "@/constants/Types";

// // small helper to map language → table/column
// function verseSelectFor(lang: Language) {
//   if (lang === "ar") {
//     return {
//       table: "aya_ar",
//       col: "quran_arabic_text",
//       select: "id, sura, aya, quran_arabic_text AS text",
//     } as const;
//   }
//   if (lang === "de") {
//     return {
//       table: "aya_de",
//       col: "quran_german_text",
//       select: "id, sura, aya, quran_german_text AS text",
//     } as const;
//   }
//   // en
//   return {
//     table: "aya_en",
//     col: "quran_english_text",
//     select: "id, sura, aya, quran_english_text AS text",
//   } as const;
// }

// /** LIKE search over verses in the chosen language. */
// export async function searchQuran(
//   searchTerm: string,
//   lang: Language,
//   limit = 50
// ): Promise<QuranVerseType[]> {
//   const db = getDatabase();
//   const { table, col, select } = verseSelectFor(lang);

//   return db.getAllAsync<QuranVerseType>(
//     `
//     SELECT ${select}
//     FROM ${table}
//     WHERE ${col} LIKE ?
//     ORDER BY sura, aya
//     LIMIT ?;
//     `,
//     [`%${searchTerm}%`, limit]
//   );
// }

// /** Get a single ayah (always with Arabic transliteration). */
// export async function getAyah(
//   lang: Language,
//   sura: number,
//   aya: number
// ): Promise<QuranVerseType | null> {
//   const db = getDatabase();

//   // Always include transliteration from aya_en_transliteration table
//   // as it contains the Arabic transliteration for all languages
//   if (lang === "ar") {
//     const row = await db.getFirstAsync<
//       QuranVerseType & { transliteration: string | null }
//     >(
//       `
//       SELECT a.sura, a.aya, a.quran_arabic_text AS text,
//              t.quran_transliteration_text AS transliteration
//       FROM aya_ar a
//       LEFT JOIN aya_en_transliteration t
//         ON t.sura = a.sura AND t.aya = a.aya
//       WHERE a.sura = ? AND a.aya = ?
//       LIMIT 1;
//       `,
//       [sura, aya]
//     );
//     return row ?? null;
//   }

//   if (lang === "de") {
//     const row = await db.getFirstAsync<
//       QuranVerseType & { transliteration: string | null }
//     >(
//       `
//       SELECT d.sura, d.aya, d.quran_german_text AS text,
//              t.quran_transliteration_text AS transliteration
//       FROM aya_de d
//       LEFT JOIN aya_en_transliteration t
//         ON t.sura = d.sura AND t.aya = d.aya
//       WHERE d.sura = ? AND d.aya = ?
//       LIMIT 1;
//       `,
//       [sura, aya]
//     );
//     return row ?? null;
//   }

//   // English
//   const row = await db.getFirstAsync<
//     QuranVerseType & { transliteration: string | null }
//   >(
//     `
//     SELECT e.sura, e.aya, e.quran_english_text AS text,
//            t.quran_transliteration_text AS transliteration
//     FROM aya_en e
//     LEFT JOIN aya_en_transliteration t
//       ON t.sura = e.sura AND t.aya = e.aya
//     WHERE e.sura = ? AND e.aya = ?
//     LIMIT 1;
//     `,
//     [sura, aya]
//   );
//   return row ?? null;
// }

// /** Get all verses for a surah (always with Arabic transliteration). */
// export async function getSurahVerses(
//   lang: Language,
//   sura: number
// ): Promise<QuranVerseType[]> {
//   const db = getDatabase();

//   // Always include transliteration from aya_en_transliteration table
//   // as it contains the Arabic transliteration for all languages
//   if (lang === "ar") {
//     return db.getAllAsync<QuranVerseType & { transliteration: string | null }>(
//       `
//       SELECT a.sura, a.aya, a.quran_arabic_text AS text,
//              t.quran_transliteration_text AS transliteration
//       FROM aya_ar a
//       LEFT JOIN aya_en_transliteration t
//         ON t.sura = a.sura AND t.aya = a.aya
//       WHERE a.sura = ?
//       ORDER BY a.aya;
//       `,
//       [sura]
//     );
//   }

//   if (lang === "de") {
//     return db.getAllAsync<QuranVerseType & { transliteration: string | null }>(
//       `
//       SELECT d.sura, d.aya, d.quran_german_text AS text,
//              t.quran_transliteration_text AS transliteration
//       FROM aya_de d
//       LEFT JOIN aya_en_transliteration t
//         ON t.sura = d.sura AND t.aya = d.aya
//       WHERE d.sura = ?
//       ORDER BY d.aya;
//       `,
//       [sura]
//     );
//   }

//   // English
//   return db.getAllAsync<QuranVerseType & { transliteration: string | null }>(
//     `
//     SELECT e.sura, e.aya, e.quran_english_text AS text,
//            t.quran_transliteration_text AS transliteration
//     FROM aya_en e
//     LEFT JOIN aya_en_transliteration t
//       ON t.sura = e.sura AND t.aya = e.aya
//     WHERE e.sura = ?
//     ORDER BY e.aya;
//     `,
//     [sura]
//   );
// }

// /** List all surahs (metadata). */
// export async function getSurahList(): Promise<SuraRowType[]> {
//   const db = getDatabase();
//   return db.getAllAsync<SuraRowType>(
//     `
//     SELECT
//       id, orderId, label, label_en, label_de,
//       nbAyat, nbWord, nbLetter, startPage, endPage, makki, ruku
//     FROM sura
//     ORDER BY id;
//     `
//   );
// }

// export async function getSurahInfoByNumber(
//   surahNumber: number
// ): Promise<SuraRowType | null> {
//   const db = getDatabase();
//   const row = await db.getFirstAsync<SuraRowType>(
//     `
//     SELECT
//       id, orderId, label, label_en, label_de,
//       nbAyat, nbWord, nbLetter, startPage, endPage, makki, ruku
//     FROM sura
//     WHERE id = ?
//     LIMIT 1;
//     `,
//     [surahNumber]
//   );
//   return row ?? null;
// }

// /** Localized display name helper. */
// export async function getSurahDisplayName(
//   surahNumber: number,
//   lang: Language
// ): Promise<string | null> {
//   const info = await getSurahInfoByNumber(surahNumber);
//   if (!info) return null;
//   if (lang === "en") return info.label_en ?? info.label;
//   if (lang === "de") return info.label_de ?? info.label;
//   return info.label;
// }

// /** Markers for a given surah. */
// export async function getHizbForSurah(sura: number): Promise<MarkerRowType[]> {
//   const db = getDatabase();
//   return db.getAllAsync<MarkerRowType>(
//     `SELECT id, sura, aya FROM hizb WHERE sura = ? ORDER BY aya;`,
//     [sura]
//   );
// }

// export async function getRukuForSurah(sura: number): Promise<MarkerRowType[]> {
//   const db = getDatabase();
//   return db.getAllAsync<MarkerRowType>(
//     `SELECT id, sura, aya FROM ruku WHERE sura = ? ORDER BY aya;`,
//     [sura]
//   );
// }

// export async function getSajdaForSurah(
//   sura: number
// ): Promise<(MarkerRowType & { type: number | null })[]> {
//   const db = getDatabase();
//   return db.getAllAsync<MarkerRowType & { type: number | null }>(
//     `SELECT id, sura, aya, type FROM sajda WHERE sura = ? ORDER BY aya;`,
//     [sura]
//   );
// }

// export async function getJuzForSurah(sura: number): Promise<JuzRow[]> {
//   const db = getDatabase();
//   return db.getAllAsync<JuzRow>(
//     `SELECT id, sura, aya, page FROM juz WHERE sura = ? ORDER BY aya;`,
//     [sura]
//   );
// }

// /** Find the page that contains a particular ayah (based on page markers in juz). */
// export async function getPageForAyah(
//   sura: number,
//   aya: number
// ): Promise<number | null> {
//   const db = getDatabase();
//   const row = await db.getFirstAsync<{ page: number }>(
//     `
//     SELECT page
//     FROM juz
//     WHERE (sura < ? OR (sura = ? AND aya <= ?))
//     ORDER BY sura DESC, aya DESC
//     LIMIT 1;
//     `,
//     [sura, sura, aya]
//   );
//   return row?.page ?? null;
// }

// /** Start (sura/aya) for a specific juz (1..30). */
// export async function getJuzStart(juz: number): Promise<JuzStartType | null> {
//   const db = getDatabase();
//   const row = await db.getFirstAsync<{
//     id: number;
//     sura: number;
//     aya: number;
//     page: number | null;
//   }>(`SELECT id, sura, aya, page FROM juz WHERE id = ? LIMIT 1;`, [juz]);
//   return row
//     ? { juz: row.id, sura: row.sura, aya: row.aya, page: row.page ?? null }
//     : null;
// }

// /** All juz starts in order 1..30. */
// export async function getAllJuzStarts(): Promise<JuzStartType[]> {
//   const db = getDatabase();
//   const rows = await db.getAllAsync<{
//     id: number;
//     sura: number;
//     aya: number;
//     page: number | null;
//   }>(`SELECT id, sura, aya, page FROM juz ORDER BY id;`);
//   return rows.map((r) => ({
//     juz: r.id,
//     sura: r.sura,
//     aya: r.aya,
//     page: r.page ?? null,
//   }));
// }

// /** Optional: labels for buttons like "Juz 1 — Al-Fātiḥa 1" in your UI language. */
// export async function getJuzButtonLabels(
//   lang: Language
// ): Promise<Array<{ juz: number; label: string; sura: number; aya: number }>> {
//   const starts = await getAllJuzStarts();
//   const out: Array<{ juz: number; label: string; sura: number; aya: number }> =
//     [];
//   for (const s of starts) {
//     const surahName =
//       (await getSurahDisplayName(s.sura, lang)) ?? `Sura ${s.sura}`;
//     out.push({
//       juz: s.juz,
//       label: `Juz ${s.juz} — ${surahName} ${s.aya}`,
//       sura: s.sura,
//       aya: s.aya,
//     });
//   }
//   return out;
// }

// /** Which juz does (sura, aya) belong to? Handy for highlighting the active juz button. */
// export async function getJuzOfAyah(
//   sura: number,
//   aya: number
// ): Promise<number | null> {
//   const db = getDatabase();
//   const row = await db.getFirstAsync<{ id: number }>(
//     `
//     SELECT id
//     FROM juz
//     WHERE (sura < ? OR (sura = ? AND aya <= ?))
//     ORDER BY sura DESC, aya DESC
//     LIMIT 1;
//     `,
//     [sura, sura, aya]
//   );
//   return row?.id ?? null;
// }

// /** Compute [start, end) bounds for a juz (1..30). */
// export async function getJuzBounds(juz: number): Promise<JuzBoundsType | null> {
//   if (juz < 1 || juz > 30) return null;
//   const db = getDatabase();

//   const start = await db.getFirstAsync<{ sura: number; aya: number }>(
//     `SELECT sura, aya FROM juz WHERE id = ? LIMIT 1;`,
//     [juz]
//   );
//   if (!start) return null;

//   // next juz start → exclusive end bound
//   const next = await db.getFirstAsync<{ sura: number; aya: number }>(
//     `SELECT sura, aya FROM juz WHERE id = ? LIMIT 1;`,
//     [juz + 1]
//   );

//   if (next) {
//     return {
//       startSura: start.sura,
//       startAya: start.aya,
//       endSura: next.sura,
//       endAya: next.aya,
//     };
//   }

//   // Juz 30 → end at the very last ayah of the Quran
//   const last = await db.getFirstAsync<{ sura: number; nbAyat: number }>(
//     `SELECT id AS sura, nbAyat FROM sura ORDER BY id DESC LIMIT 1;`
//   );
//   return {
//     startSura: start.sura,
//     startAya: start.aya,
//     endSura: last?.sura ?? 114,
//     endAya: last?.nbAyat ?? 6, // fallback (An-Nas has 6)
//   };
// }

// /** Return only (sura, aya) pairs belonging to a juz. */
// export async function getJuzAyahRefs(
//   juz: number
// ): Promise<Array<{ sura: number; aya: number }>> {
//   const db = getDatabase();
//   const bounds = await getJuzBounds(juz);
//   if (!bounds) return [];

//   const { startSura, startAya, endSura, endAya } = bounds;

//   if (endSura != null && endAya != null) {
//     return db.getAllAsync<{ sura: number; aya: number }>(
//       `
//       SELECT a.sura, a.aya
//       FROM aya_ar a
//       WHERE
//         (a.sura > ? OR (a.sura = ? AND a.aya >= ?)) AND
//         (a.sura < ? OR (a.sura = ? AND a.aya < ?))
//       ORDER BY a.sura, a.aya;
//       `,
//       [startSura, startSura, startAya, endSura, endSura, endAya]
//     );
//   }

//   return db.getAllAsync<{ sura: number; aya: number }>(
//     `
//     SELECT a.sura, a.aya
//     FROM aya_ar a
//     WHERE (a.sura > ? OR (a.sura = ? AND a.aya >= ?))
//     ORDER BY a.sura, a.aya;
//     `,
//     [startSura, startSura, startAya]
//   );
// }

// export async function getJuzVerses(
//   lang: Language,
//   juz: number
// ): Promise<(QuranVerseType & { transliteration: string | null })[]> {
//   const db = getDatabase();
//   const bounds = await getJuzBounds(juz);
//   if (!bounds) return [];

//   const { table } = verseSelectFor(lang);
//   const { startSura, startAya, endSura, endAya } = bounds;

//   // main table alias
//   const alias = table === "aya_ar" ? "a" : table === "aya_de" ? "d" : "e";

//   // build a qualified select list
//   const selectCols =
//     table === "aya_ar"
//       ? `${alias}.sura AS sura, ${alias}.aya AS aya, ${alias}.quran_arabic_text AS text`
//       : table === "aya_de"
//       ? `${alias}.sura AS sura, ${alias}.aya AS aya, ${alias}.quran_german_text AS text`
//       : `${alias}.sura AS sura, ${alias}.aya AS aya, ${alias}.quran_english_text AS text`;

//   const fromJoin = `
//     FROM ${table} ${alias}
//     LEFT JOIN aya_en_transliteration t
//       ON t.sura = ${alias}.sura AND t.aya = ${alias}.aya
//   `;

//   if (endSura != null && endAya != null) {
//     return db.getAllAsync<QuranVerseType & { transliteration: string | null }>(
//       `
//       SELECT ${selectCols},
//              t.quran_transliteration_text AS transliteration
//       ${fromJoin}
//       WHERE
//         (${alias}.sura > ? OR (${alias}.sura = ? AND ${alias}.aya >= ?)) AND
//         (${alias}.sura < ? OR (${alias}.sura = ? AND ${alias}.aya < ?))
//       ORDER BY ${alias}.sura, ${alias}.aya;
//       `,
//       [startSura, startSura, startAya, endSura, endSura, endAya]
//     );
//   }

//   // Juz 30 (no end bound)
//   return db.getAllAsync<QuranVerseType & { transliteration: string | null }>(
//     `
//     SELECT ${selectCols},
//            t.quran_transliteration_text AS transliteration
//     ${fromJoin}
//     WHERE (${alias}.sura > ? OR (${alias}.sura = ? AND ${alias}.aya >= ?))
//     ORDER BY ${alias}.sura, ${alias}.aya;
//     `,
//     [startSura, startSura, startAya]
//   );
// }

//! Neu geordnet

import { getDatabase } from "../index";
import {
  Language,
  QuranVerseType,
  SuraRowType,
  MarkerRowType,
  JuzRow,
  JuzStartType,
  JuzBoundsType,
} from "@/constants/Types";

// --- helpers ---------------------------------------------------------------

/** Map language → table/column/select (used where convenient). */
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
    col: "quran_english_text",
    select: "id, sura, aya, quran_english_text AS text",
  } as const;
}

/** Internal: common juz-row lookup used by getPageForAyah/getJuzOfAyah. */
async function getJuzRowAtOrBefore(
  sura: number,
  aya: number
): Promise<{ id: number; page: number; sura: number; aya: number } | null> {
  try {
    const db = getDatabase();
    return await db.getFirstAsync(
      `
      SELECT id, page, sura, aya
      FROM juz
      WHERE (sura < ? OR (sura = ? AND aya <= ?))
      ORDER BY sura DESC, aya DESC
      LIMIT 1;
      `,
      [sura, sura, aya]
    );
  } catch (err) {
    console.error("getJuzRowAtOrBefore error", { sura, aya, err });
    return null;
  }
}

// --- queries ---------------------------------------------------------------

/** Get a single ayah (always with Arabic transliteration). */
export async function getAyah(
  lang: Language,
  sura: number,
  aya: number
): Promise<QuranVerseType | null> {
  try {
    const db = getDatabase();

    if (lang === "ar") {
      const row = await db.getFirstAsync<
        QuranVerseType & { transliteration: string | null }
      >(
        `
        SELECT a.sura, a.aya, a.quran_arabic_text AS text, 
               t.quran_transliteration_text AS transliteration
        FROM aya_ar a
        LEFT JOIN aya_en_transliteration t
          ON t.sura = a.sura AND t.aya = a.aya
        WHERE a.sura = ? AND a.aya = ?
        LIMIT 1;
        `,
        [sura, aya]
      );
      return row ?? null;
    }

    if (lang === "de") {
      const row = await db.getFirstAsync<
        QuranVerseType & { transliteration: string | null }
      >(
        `
        SELECT d.sura, d.aya, d.quran_german_text AS text, 
               t.quran_transliteration_text AS transliteration
        FROM aya_de d
        LEFT JOIN aya_en_transliteration t
          ON t.sura = d.sura AND t.aya = d.aya
        WHERE d.sura = ? AND d.aya = ?
        LIMIT 1;
        `,
        [sura, aya]
      );
      return row ?? null;
    }

    const row = await db.getFirstAsync<
      QuranVerseType & { transliteration: string | null }
    >(
      `
      SELECT e.sura, e.aya, e.quran_english_text AS text, 
             t.quran_transliteration_text AS transliteration
      FROM aya_en e
      LEFT JOIN aya_en_transliteration t
        ON t.sura = e.sura AND t.aya = e.aya
      WHERE e.sura = ? AND e.aya = ?
      LIMIT 1;
      `,
      [sura, aya]
    );
    return row ?? null;
  } catch (err) {
    console.error("getAyah error", { lang, sura, aya, err });
    return null;
  }
}

/** Get all verses for a surah (always with Arabic transliteration). */
export async function getSurahVerses(
  lang: Language,
  sura: number
): Promise<QuranVerseType[]> {
  try {
    const db = getDatabase();

    if (lang === "ar") {
      return await db.getAllAsync<
        QuranVerseType & { transliteration: string | null }
      >(
        `
        SELECT a.sura, a.aya, a.quran_arabic_text AS text,
               t.quran_transliteration_text AS transliteration
        FROM aya_ar a
        LEFT JOIN aya_en_transliteration t
          ON t.sura = a.sura AND t.aya = a.aya
        WHERE a.sura = ?
        ORDER BY a.aya;
        `,
        [sura]
      );
    }

    if (lang === "de") {
      return await db.getAllAsync<
        QuranVerseType & { transliteration: string | null }
      >(
        `
        SELECT d.sura, d.aya, d.quran_german_text AS text,
               t.quran_transliteration_text AS transliteration
        FROM aya_de d
        LEFT JOIN aya_en_transliteration t
          ON t.sura = d.sura AND t.aya = d.aya
        WHERE d.sura = ?
        ORDER BY d.aya;
        `,
        [sura]
      );
    }

    return await db.getAllAsync<
      QuranVerseType & { transliteration: string | null }
    >(
      `
      SELECT e.sura, e.aya, e.quran_english_text AS text, 
             t.quran_transliteration_text AS transliteration
      FROM aya_en e
      LEFT JOIN aya_en_transliteration t
        ON t.sura = e.sura AND t.aya = e.aya
      WHERE e.sura = ?
      ORDER BY e.aya;
      `,
      [sura]
    );
  } catch (err) {
    console.error("getSurahVerses error", { lang, sura, err });
    return [];
  }
}

/** List all surahs (metadata). */
export async function getSurahList(): Promise<SuraRowType[]> {
  try {
    const db = getDatabase();
    return await db.getAllAsync<SuraRowType>(
      `
      SELECT
        id, orderId, label, label_en, label_de,
        nbAyat, nbWord, nbLetter, startPage, endPage, makki, ruku
      FROM sura
      ORDER BY id;
      `
    );
  } catch (err) {
    console.error("getSurahList error", err);
    return [];
  }
}

export async function getSurahInfoByNumber(
  surahNumber: number
): Promise<SuraRowType | null> {
  try {
    const db = getDatabase();
    const row = await db.getFirstAsync<SuraRowType>(
      `
      SELECT
        id, orderId, label, label_en, label_de,
        nbAyat, nbWord, nbLetter, startPage, endPage, makki, ruku
      FROM sura
      WHERE id = ?          
      LIMIT 1;
      `,
      [surahNumber]
    );
    return row ?? null;
  } catch (err) {
    console.error("getSurahInfoByNumber error", { surahNumber, err });
    return null;
  }
}

/** Localized display name helper. */
export async function getSurahDisplayName(
  surahNumber: number,
  lang: Language
): Promise<string | null> {
  try {
    const info = await getSurahInfoByNumber(surahNumber);
    if (!info) return null;
    if (lang === "en") return info.label_en ?? info.label;
    if (lang === "de") return info.label_de ?? info.label;
    return info.label;
  } catch (err) {
    console.error("getSurahDisplayName error", { surahNumber, lang, err });
    return null;
  }
}

/** Markers for a given surah. */
export async function getHizbForSurah(sura: number): Promise<MarkerRowType[]> {
  try {
    const db = getDatabase();
    return await db.getAllAsync<MarkerRowType>(
      `SELECT id, sura, aya FROM hizb WHERE sura = ? ORDER BY aya;`,
      [sura]
    );
  } catch (err) {
    console.error("getHizbForSurah error", { sura, err });
    return [];
  }
}

export async function getRukuForSurah(sura: number): Promise<MarkerRowType[]> {
  try {
    const db = getDatabase();
    return await db.getAllAsync<MarkerRowType>(
      `SELECT id, sura, aya FROM ruku WHERE sura = ? ORDER BY aya;`,
      [sura]
    );
  } catch (err) {
    console.error("getRukuForSurah error", { sura, err });
    return [];
  }
}

export async function getSajdaForSurah(
  sura: number
): Promise<(MarkerRowType & { type: number | null })[]> {
  try {
    const db = getDatabase();
    return await db.getAllAsync<MarkerRowType & { type: number | null }>(
      `SELECT id, sura, aya, type FROM sajda WHERE sura = ? ORDER BY aya;`,
      [sura]
    );
  } catch (err) {
    console.error("getSajdaForSurah error", { sura, err });
    return [];
  }
}

export async function getJuzForSurah(sura: number): Promise<JuzRow[]> {
  try {
    const db = getDatabase();
    return await db.getAllAsync<JuzRow>(
      `SELECT id, sura, aya, page FROM juz WHERE sura = ? ORDER BY aya;`,
      [sura]
    );
  } catch (err) {
    console.error("getJuzForSurah error", { sura, err });
    return [];
  }
}

/** Find the page that contains a particular ayah (based on page markers in juz). */
export async function getPageForAyah(
  sura: number,
  aya: number
): Promise<number | null> {
  try {
    const row = await getJuzRowAtOrBefore(sura, aya);
    return row?.page ?? null;
  } catch (err) {
    console.error("getPageForAyah error", { sura, aya, err });
    return null;
  }
}

/** Which juz does (sura, aya) belong to? Handy for highlighting the active juz button. */
export async function getJuzOfAyah(
  sura: number,
  aya: number
): Promise<number | null> {
  try {
    const row = await getJuzRowAtOrBefore(sura, aya);
    return row?.id ?? null;
  } catch (err) {
    console.error("getJuzOfAyah error", { sura, aya, err });
    return null;
  }
}

/** Start (sura/aya) for a specific juz (1..30). */
export async function getJuzStart(juz: number): Promise<JuzStartType | null> {
  try {
    const db = getDatabase();
    const row = await db.getFirstAsync<{
      id: number;
      sura: number;
      aya: number;
      page: number | null;
    }>(`SELECT id, sura, aya, page FROM juz WHERE id = ? LIMIT 1;`, [juz]);
    return row
      ? { juz: row.id, sura: row.sura, aya: row.aya, page: row.page ?? null }
      : null;
  } catch (err) {
    console.error("getJuzStart error", { juz, err });
    return null;
  }
}

/** All juz starts in order 1..30. */
export async function getAllJuzStarts(): Promise<JuzStartType[]> {
  try {
    const db = getDatabase();
    const rows = await db.getAllAsync<{
      id: number;
      sura: number;
      aya: number;
      page: number | null;
    }>(`SELECT id, sura, aya, page FROM juz ORDER BY id;`);
    return rows.map((r) => ({
      juz: r.id,
      sura: r.sura,
      aya: r.aya,
      page: r.page ?? null,
    }));
  } catch (err) {
    console.error("getAllJuzStarts error", err);
    return [];
  }
}

/** Optional: labels like "Juz 1 — Al-Fātiḥa 1" in UI language. */
export async function getJuzButtonLabels(
  lang: Language
): Promise<Array<{ juz: number; label: string; sura: number; aya: number }>> {
  try {
    const starts = await getAllJuzStarts();
    const out: Array<{
      juz: number;
      label: string;
      sura: number;
      aya: number;
    }> = [];
    for (const s of starts) {
      const surahName =
        (await getSurahDisplayName(s.sura, lang)) ?? `Sura ${s.sura}`;
      out.push({
        juz: s.juz,
        label: `Juz ${s.juz} — ${surahName} ${s.aya}`,
        sura: s.sura,
        aya: s.aya,
      });
    }
    return out;
  } catch (err) {
    console.error("getJuzButtonLabels error", { lang, err });
    return [];
  }
}

/** Compute [start, end) bounds for a juz (1..30). */
export async function getJuzBounds(juz: number): Promise<JuzBoundsType | null> {
  if (juz < 1 || juz > 30) return null;
  try {
    const db = getDatabase();

    const start = await db.getFirstAsync<{ sura: number; aya: number }>(
      `SELECT sura, aya FROM juz WHERE id = ? LIMIT 1;`,
      [juz]
    );
    if (!start) return null;

    // next juz start → exclusive end bound
    const next = await db.getFirstAsync<{ sura: number; aya: number }>(
      `SELECT sura, aya FROM juz WHERE id = ? LIMIT 1;`,
      [juz + 1]
    );

    if (next) {
      return {
        startSura: start.sura,
        startAya: start.aya,
        endSura: next.sura,
        endAya: next.aya,
      };
    }

    // Juz 30 → end at the very last ayah of the Quran
    const last = await db.getFirstAsync<{ sura: number; nbAyat: number }>(
      `SELECT id AS sura, nbAyat FROM sura ORDER BY id DESC LIMIT 1;`
    );
    return {
      startSura: start.sura,
      startAya: start.aya,
      endSura: last?.sura ?? 114,
      endAya: last?.nbAyat ?? 6, // fallback (An-Nas has 6)
    };
  } catch (err) {
    console.error("getJuzBounds error", { juz, err });
    return null;
  }
}

/** Return only (sura, aya) pairs belonging to a juz. */
export async function getJuzAyahRefs(
  juz: number
): Promise<Array<{ sura: number; aya: number }>> {
  try {
    const db = getDatabase();
    const bounds = await getJuzBounds(juz);
    if (!bounds) return [];

    const { startSura, startAya, endSura, endAya } = bounds;

    if (endSura != null && endAya != null) {
      // [start, end) — end exclusive
      return await db.getAllAsync<{ sura: number; aya: number }>(
        `
        SELECT a.sura, a.aya
        FROM aya_ar a
        WHERE
          (a.sura > ? OR (a.sura = ? AND a.aya >= ?)) AND
          (a.sura < ? OR (a.sura = ? AND a.aya < ?))
        ORDER BY a.sura, a.aya;
        `,
        [startSura, startSura, startAya, endSura, endSura, endAya]
      );
    }

    // No end bound → from start to the end of Quran
    return await db.getAllAsync<{ sura: number; aya: number }>(
      `
      SELECT a.sura, a.aya
      FROM aya_ar a
      WHERE (a.sura > ? OR (a.sura = ? AND a.aya >= ?))
      ORDER BY a.sura, a.aya;
      `,
      [startSura, startSura, startAya]
    );
  } catch (err) {
    console.error("getJuzAyahRefs error", { juz, err });
    return [];
  }
}

/** Return full verses (with transliteration) for a juz in the chosen language. */
export async function getJuzVerses(
  lang: Language,
  juz: number
): Promise<(QuranVerseType & { transliteration: string | null })[]> {
  try {
    const db = getDatabase();
    const bounds = await getJuzBounds(juz);
    if (!bounds) return [];

    const { table } = verseSelectFor(lang);
    const { startSura, startAya, endSura, endAya } = bounds;

    // main table alias
    const alias = table === "aya_ar" ? "a" : table === "aya_de" ? "d" : "e";

    // build a qualified select list (avoid ambiguous sura/aya with the JOIN)
    const selectCols =
      table === "aya_ar"
        ? `${alias}.sura AS sura, ${alias}.aya AS aya, ${alias}.quran_arabic_text AS text`
        : table === "aya_de"
        ? `${alias}.sura AS sura, ${alias}.aya AS aya, ${alias}.quran_german_text AS text`
        : `${alias}.sura AS sura, ${alias}.aya AS aya, ${alias}.quran_english_text AS text`;

    const fromJoin = `
      FROM ${table} ${alias}
      LEFT JOIN aya_en_transliteration t
        ON t.sura = ${alias}.sura AND t.aya = ${alias}.aya
    `;

    if (endSura != null && endAya != null) {
      return await db.getAllAsync<
        QuranVerseType & { transliteration: string | null }
      >(
        `
        SELECT ${selectCols},
               t.quran_transliteration_text AS transliteration
        ${fromJoin}
        WHERE
          (${alias}.sura > ? OR (${alias}.sura = ? AND ${alias}.aya >= ?)) AND
          (${alias}.sura < ? OR (${alias}.sura = ? AND ${alias}.aya < ?))
        ORDER BY ${alias}.sura, ${alias}.aya;
        `,
        [startSura, startSura, startAya, endSura, endSura, endAya]
      );
    }

    // Juz 30 (no end bound)
    return await db.getAllAsync<
      QuranVerseType & { transliteration: string | null }
    >(
      `
      SELECT ${selectCols},
             t.quran_transliteration_text AS transliteration
      ${fromJoin}
      WHERE (${alias}.sura > ? OR (${alias}.sura = ? AND ${alias}.aya >= ?))
      ORDER BY ${alias}.sura, ${alias}.aya;
      `,
      [startSura, startSura, startAya]
    );
  } catch (err) {
    console.error("getJuzVerses error", { lang, juz, err });
    return [];
  }
}
/** Internal: page-row lookup used by getPageForAyah/getPageVerses. */
async function getPageRowAtOrBefore(
  sura: number,
  aya: number
): Promise<{ id: number; sura: number; aya: number } | null> {
  try {
    const db = getDatabase();
    return await db.getFirstAsync(
      `
      SELECT id, sura, aya
      FROM page
      WHERE (sura < ? OR (sura = ? AND aya <= ?))
      ORDER BY sura DESC, aya DESC
      LIMIT 1;
      `,
      [sura, sura, aya]
    );
  } catch (err) {
    console.error("getPageRowAtOrBefore error", { sura, aya, err });
    return null;
  }
}
export async function getPageStart(
  page: number
): Promise<{ page: number; sura: number; aya: number } | null> {
  try {
    const db = getDatabase();
    const row = await db.getFirstAsync<{
      id: number;
      sura: number;
      aya: number;
    }>(`SELECT id, sura, aya FROM page WHERE id = ? LIMIT 1;`, [page]);
    return row ? { page: row.id, sura: row.sura, aya: row.aya } : null;
  } catch (err) {
    console.error("getPageStart error", { page, err });
    return null;
  }
}
export async function getPageBounds(page: number): Promise<{
  startSura: number;
  startAya: number;
  endSura: number | null;
  endAya: number | null;
} | null> {
  try {
    const db = getDatabase();

    const start = await db.getFirstAsync<{ sura: number; aya: number }>(
      `SELECT sura, aya FROM page WHERE id = ? LIMIT 1;`,
      [page]
    );
    if (!start) return null;

    const next = await db.getFirstAsync<{ sura: number; aya: number }>(
      `SELECT sura, aya FROM page WHERE id = ? LIMIT 1;`,
      [page + 1]
    );

    if (next) {
      return {
        startSura: start.sura,
        startAya: start.aya,
        endSura: next.sura,
        endAya: next.aya,
      };
    }

    // last page → open-ended (to the end of the Qur'an)
    return {
      startSura: start.sura,
      startAya: start.aya,
      endSura: null,
      endAya: null,
    };
  } catch (err) {
    console.error("getPageBounds error", { page, err });
    return null;
  }
}
export async function getPageVerses(
  lang: Language,
  page: number
): Promise<(QuranVerseType & { transliteration: string | null })[]> {
  try {
    const db = getDatabase();
    const bounds = await getPageBounds(page);
    if (!bounds) return [];

    const { table } = verseSelectFor(lang);
    const alias = table === "aya_ar" ? "a" : table === "aya_de" ? "d" : "e";
    const selectCols =
      table === "aya_ar"
        ? `${alias}.sura AS sura, ${alias}.aya AS aya, ${alias}.quran_arabic_text AS text`
        : table === "aya_de"
        ? `${alias}.sura AS sura, ${alias}.aya AS aya, ${alias}.quran_german_text AS text`
        : `${alias}.sura AS sura, ${alias}.aya AS aya, ${alias}.quran_english_text AS text`;

    const fromJoin = `
      FROM ${table} ${alias}
      LEFT JOIN aya_en_transliteration t
        ON t.sura = ${alias}.sura AND t.aya = ${alias}.aya
    `;

    const { startSura, startAya, endSura, endAya } = bounds;

    if (endSura != null && endAya != null) {
      // [start, end) — end exclusive
      return await db.getAllAsync<
        QuranVerseType & { transliteration: string | null }
      >(
        `
        SELECT ${selectCols}, t.quran_transliteration_text AS transliteration
        ${fromJoin}
        WHERE
          (${alias}.sura > ? OR (${alias}.sura = ? AND ${alias}.aya >= ?)) AND
          (${alias}.sura < ? OR (${alias}.sura = ? AND ${alias}.aya < ?))
        ORDER BY ${alias}.sura, ${alias}.aya;
        `,
        [startSura, startSura, startAya, endSura, endSura, endAya]
      );
    }

    // last page → from start to the end of the Qur'an
    return await db.getAllAsync<
      QuranVerseType & { transliteration: string | null }
    >(
      `
      SELECT ${selectCols}, t.quran_transliteration_text AS transliteration
      ${fromJoin}
      WHERE (${alias}.sura > ? OR (${alias}.sura = ? AND ${alias}.aya >= ?))
      ORDER BY ${alias}.sura, ${alias}.aya;
      `,
      [startSura, startSura, startAya]
    );
  } catch (err) {
    console.error("getPageVerses error", { lang, page, err });
    return [];
  }
}
/** Exact page for an ayah, using the page table (better than via juz). */
export async function getPageOfAyah(
  sura: number,
  aya: number
): Promise<number | null> {
  try {
    const row = await getPageRowAtOrBefore(sura, aya);
    return row?.id ?? null;
  } catch (err) {
    console.error("getPageOfAyah error", { sura, aya, err });
    return null;
  }
}

/** Page buttons like: "Page 1 — Al-Fātiḥa 1" */
export async function getPageButtonLabels(
  lang: Language
): Promise<Array<{ page: number; label: string; sura: number; aya: number }>> {
  try {
    const db = getDatabase();
    const rows = await db.getAllAsync<{
      id: number;
      sura: number;
      aya: number;
    }>(`SELECT id, sura, aya FROM page ORDER BY id;`);

    const out: Array<{
      page: number;
      label: string;
      sura: number;
      aya: number;
    }> = [];
    for (const r of rows) {
      const surahName =
        (await getSurahDisplayName(r.sura, lang)) ?? `Sura ${r.sura}`;
      out.push({
        page: r.id,
        label: `Page ${r.id} — ${surahName} ${r.aya}`,
        sura: r.sura,
        aya: r.aya,
      });
    }
    return out;
  } catch (err) {
    console.error("getPageButtonLabels error", { lang, err });
    return [];
  }
}

