// // // // app/db/sync/quran.ts
// // // import { supabase } from "@/utils/supabase";
// // // import { getDatabase } from "..";

// // // /**
// // //  * Sync Quran data into local SQLite (no quran_suras):
// // //  * - Global tables: sura, hizb, juz, ruku, sajda
// // //  * - Language-specific ayah table:
// // //  *    ar -> aya_ar(quran_arabic_text)
// // //  *    de -> aya_de(quran_german_text)
// // //  *    en -> aya_en(quran_english_text) + aya_en_transliteration(quran_transliteration_text)
// // //  *
// // //  * All writes are done in a single exclusive transaction.
// // //  */
// // // async function syncQuran(language: string): Promise<void> {
// // //   type AyahPlan =
// // //     | { kind: "ar"; primary: "aya_ar" }
// // //     | { kind: "de"; primary: "aya_de" }
// // //     | { kind: "en"; primary: "aya_en"; translit: "aya_en_transliteration" };

// // //   const plan: AyahPlan =
// // //     language === "ar"
// // //       ? { kind: "ar", primary: "aya_ar" }
// // //       : language === "en"
// // //       ? { kind: "en", primary: "aya_en", translit: "aya_en_transliteration" }
// // //       : { kind: "de", primary: "aya_de" }; // default to 'de'

// // //   try {
// // //     // --- Build fetches ---
// // //     const suraFetch = supabase
// // //       .from("sura")
// // //       .select(
// // //         "id, label, label_en, label_de, nbAyat, nbWord, nbLetter, orderId, makki, startPage, endPage, ruku"
// // //       );

// // //     const hizbFetch = supabase.from("hizb").select("id, sura, aya");
// // //     const juzFetch = supabase.from("juz").select("id, sura, aya, page");
// // //     const rukuFetch = supabase.from("ruku").select("id, sura, aya");
// // //     const sajdaFetch = supabase.from("sajda").select("id, sura, aya, type");

// // //     const ayahPrimaryFetch =
// // //       plan.kind === "ar"
// // //         ? supabase.from(plan.primary).select("id, sura, aya, quran_arabic_text")
// // //         : plan.kind === "de"
// // //         ? supabase.from(plan.primary).select("id, sura, aya, quran_german_text")
// // //         : supabase.from(plan.primary).select('id, sura, aya, quran_english_text');

// // //     const ayahTranslitFetch =
// // //       plan.kind === "en"
// // //         ? supabase
// // //             .from("aya_en_transliteration")
// // //             .select("id, sura, aya, quran_transliteration_text")
// // //         : null;

// // //     // --- Execute fetches in parallel ---
// // //     const [
// // //       { data: suraRows, error: suraErr },
// // //       { data: hizbRows, error: hizbErr },
// // //       { data: juzRows, error: juzErr },
// // //       { data: rukuRows, error: rukuErr },
// // //       { data: sajdaRows, error: sajdaErr },
// // //       { data: ayahPrimaryRows, error: ayahPrimaryErr },
// // //       ayahTranslitResult,
// // //     ] = await Promise.all([
// // //       suraFetch,
// // //       hizbFetch,
// // //       juzFetch,
// // //       rukuFetch,
// // //       sajdaFetch,
// // //       ayahPrimaryFetch,
// // //       ayahTranslitFetch ?? Promise.resolve({ data: null, error: null } as any),
// // //     ]);

// // //     if (suraErr) throw suraErr;
// // //     if (hizbErr) throw hizbErr;
// // //     if (juzErr) throw juzErr;
// // //     if (rukuErr) throw rukuErr;
// // //     if (sajdaErr) throw sajdaErr;
// // //     if (ayahPrimaryErr) throw ayahPrimaryErr;

// // //     const ayahTranslitRows = ayahTranslitResult?.data ?? null;
// // //     const ayahTranslitErr = ayahTranslitResult?.error ?? null;
// // //     if (ayahTranslitErr) throw ayahTranslitErr;

// // //     const db = await getDatabase();

// // //     // --- Transaction: mirror server state ---
// // //     await db.withExclusiveTransactionAsync(async (txn) => {
// // //       // Clear global marker tables & sura
// // //       await txn.execAsync("DELETE FROM hizb;");
// // //       await txn.execAsync("DELETE FROM juz;");
// // //       await txn.execAsync("DELETE FROM ruku;");
// // //       await txn.execAsync("DELETE FROM sajda;");
// // //       await txn.execAsync("DELETE FROM sura;");

// // //       // Clear only the current language’s ayah tables
// // //       if (plan.kind === "ar") {
// // //         await txn.execAsync("DELETE FROM aya_ar;");
// // //       } else if (plan.kind === "de") {
// // //         await txn.execAsync("DELETE FROM aya_de;");
// // //       } else {
// // //         await txn.execAsync("DELETE FROM aya_en;");
// // //         await txn.execAsync("DELETE FROM aya_en_transliteration;");
// // //       }

// // //       // Prepare statements
// // //       const suraStmt = await txn.prepareAsync(
// // //         `INSERT OR REPLACE INTO sura
// // //            (id, label, label_en, label_de, nbAyat, nbWord, nbLetter, orderId, makki, startPage, endPage, ruku)
// // //          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`
// // //       );
// // //       const hizbStmt = await txn.prepareAsync(
// // //         `INSERT OR REPLACE INTO hizb (id, sura, aya) VALUES (?, ?, ?);`
// // //       );
// // //       const juzStmt = await txn.prepareAsync(
// // //         `INSERT OR REPLACE INTO juz (id, sura, aya, page) VALUES (?, ?, ?, ?);`
// // //       );
// // //       const rukuStmt = await txn.prepareAsync(
// // //         `INSERT OR REPLACE INTO ruku (id, sura, aya) VALUES (?, ?, ?);`
// // //       );
// // //       const sajdaStmt = await txn.prepareAsync(
// // //         `INSERT OR REPLACE INTO sajda (id, sura, aya, type) VALUES (?, ?, ?, ?);`
// // //       );

// // //       const ayahPrimaryStmt =
// // //         plan.kind === "ar"
// // //           ? await txn.prepareAsync(
// // //               `INSERT OR REPLACE INTO aya_ar (id, sura, aya, quran_arabic_text)
// // //                VALUES (?, ?, ?, ?);`
// // //             )
// // //           : plan.kind === "de"
// // //           ? await txn.prepareAsync(
// // //               `INSERT OR REPLACE INTO aya_de (id, sura, aya, quran_german_text)
// // //                VALUES (?, ?, ?, ?);`
// // //             )
// // //           : await txn.prepareAsync(
// // //               `INSERT OR REPLACE INTO aya_en (id, sura, aya, quran_english_text)
// // //                VALUES (?, ?, ?, ?);`
// // //             );

// // //       const ayahTranslitStmt =
// // //         plan.kind === "en"
// // //           ? await txn.prepareAsync(
// // //               `INSERT OR REPLACE INTO aya_en_transliteration
// // //                  (id, sura, aya, quran_transliteration_text)
// // //                VALUES (?, ?, ?, ?);`
// // //             )
// // //           : null;

// // //       try {
// // //         // sura
// // //         for (const s of (suraRows ?? []) as any[]) {
// // //           await suraStmt.executeAsync([
// // //             s.id,
// // //             s.label,
// // //             s.label_en ?? null,
// // //             s.label_de ?? null,
// // //             s.nbAyat,
// // //             s.nbWord,
// // //             s.nbLetter,
// // //             s.orderId,
// // //             s.makki,
// // //             s.startPage,
// // //             s.endPage,
// // //             s.ruku ?? null,
// // //           ]);
// // //         }
// // //         // hizb
// // //         for (const h of (hizbRows ?? []) as any[]) {
// // //           await hizbStmt.executeAsync([h.id, h.sura, h.aya]);
// // //         }
// // //         // juz
// // //         for (const j of (juzRows ?? []) as any[]) {
// // //           await juzStmt.executeAsync([j.id, j.sura, j.aya, j.page]);
// // //         }
// // //         // ruku
// // //         for (const r of (rukuRows ?? []) as any[]) {
// // //           await rukuStmt.executeAsync([r.id, r.sura, r.aya]);
// // //         }
// // //         // sajda
// // //         for (const s of (sajdaRows ?? []) as any[]) {
// // //           await sajdaStmt.executeAsync([s.id, s.sura, s.aya, s.type ?? null]);
// // //         }
// // //         // primary ayah
// // //         for (const a of (ayahPrimaryRows ?? []) as any[]) {
// // //           if (plan.kind === "ar") {
// // //             await ayahPrimaryStmt.executeAsync([
// // //               a.id,
// // //               a.sura,
// // //               a.aya,
// // //               a.quran_arabic_text,
// // //             ]);
// // //           } else if (plan.kind === "de") {
// // //             await ayahPrimaryStmt.executeAsync([
// // //               a.id,
// // //               a.sura,
// // //               a.aya,
// // //               a.quran_german_text,
// // //             ]);
// // //           } else {
// // //             await ayahPrimaryStmt.executeAsync([a.id, a.sura, a.aya, a.quran_english_text]);
// // //           }
// // //         }
// // //         // transliteration (en only)
// // //         if (plan.kind === "en" && ayahTranslitStmt) {
// // //           for (const t of (ayahTranslitRows ?? []) as any[]) {
// // //             await ayahTranslitStmt.executeAsync([
// // //               t.id,
// // //               t.sura,
// // //               t.aya,
// // //               t.quran_transliteration_text,
// // //             ]);
// // //           }
// // //         }
// // //       } finally {
// // //         await suraStmt.finalizeAsync();
// // //         await hizbStmt.finalizeAsync();
// // //         await juzStmt.finalizeAsync();
// // //         await rukuStmt.finalizeAsync();
// // //         await sajdaStmt.finalizeAsync();
// // //         await ayahPrimaryStmt.finalizeAsync();
// // //         if (ayahTranslitStmt) await ayahTranslitStmt.finalizeAsync();
// // //       }
// // //     });

// // //     console.log(`Quran synced for '${language}'.`);
// // //   } catch (error) {
// // //     console.error("Critical error in syncQuran:", error);
// // //   }
// // // }

// // // export default syncQuran;
// // // app/db/sync/quran.ts
// // import { supabase } from "@/utils/supabase";
// // import { getDatabase } from "..";

// // /**
// //  * Sync Quran data into local SQLite:
// //  * - Global tables: sura, hizb, juz, ruku, sajda
// //  * - Language-specific ayah table:
// //  *    ar -> aya_ar(quran_arabic_text)
// //  *    de -> aya_de(quran_german_text)
// //  *    en -> aya_en(quran_english_text)
// //  * - Always sync aya_en_transliteration (Arabic transliteration for ALL languages)
// //  *
// //  * All writes are done in a single exclusive transaction.
// //  */
// // async function syncQuran(language: string): Promise<void> {
// //   type AyahPlan =
// //     | { kind: "ar"; primary: "aya_ar" }
// //     | { kind: "de"; primary: "aya_de" }
// //     | { kind: "en"; primary: "aya_en" };

// //   const plan: AyahPlan =
// //     language === "ar"
// //       ? { kind: "ar", primary: "aya_ar" }
// //       : language === "en"
// //       ? { kind: "en", primary: "aya_en" }
// //       : { kind: "de", primary: "aya_de" }; // default to 'de'

// //   try {
// //     // --- Build fetches ---
// //     const suraFetch = supabase
// //       .from("sura")
// //       .select(
// //         "id, label, label_en, label_de, nbAyat, nbWord, nbLetter, orderId, makki, startPage, endPage, ruku"
// //       );

// //     const hizbFetch = supabase.from("hizb").select("id, sura, aya");
// //     const juzFetch = supabase.from("juz").select("id, sura, aya, page");
// //     const rukuFetch = supabase.from("ruku").select("id, sura, aya");
// //     const sajdaFetch = supabase.from("sajda").select("id, sura, aya, type");

// //     const ayahPrimaryFetch =
// //       plan.kind === "ar"
// //         ? supabase.from(plan.primary).select("id, sura, aya, quran_arabic_text")
// //         : plan.kind === "de"
// //         ? supabase.from(plan.primary).select("id, sura, aya, quran_german_text")
// //         : supabase
// //             .from(plan.primary)
// //             .select("id, sura, aya, quran_english_text");

// //     // ALWAYS fetch transliteration data regardless of language
// //     // because it contains Arabic transliteration for ALL users
// //     const ayahTranslitFetch = supabase
// //       .from("aya_en_transliteration")
// //       .select("id, sura, aya, quran_transliteration_text");

// //     // --- Execute fetches in parallel ---
// //     const [
// //       { data: suraRows, error: suraErr },
// //       { data: hizbRows, error: hizbErr },
// //       { data: juzRows, error: juzErr },
// //       { data: rukuRows, error: rukuErr },
// //       { data: sajdaRows, error: sajdaErr },
// //       { data: ayahPrimaryRows, error: ayahPrimaryErr },
// //       { data: ayahTranslitRows, error: ayahTranslitErr },
// //     ] = await Promise.all([
// //       suraFetch,
// //       hizbFetch,
// //       juzFetch,
// //       rukuFetch,
// //       sajdaFetch,
// //       ayahPrimaryFetch,
// //       ayahTranslitFetch,
// //     ]);

// //     if (suraErr) throw suraErr;
// //     if (hizbErr) throw hizbErr;
// //     if (juzErr) throw juzErr;
// //     if (rukuErr) throw rukuErr;
// //     if (sajdaErr) throw sajdaErr;
// //     if (ayahPrimaryErr) throw ayahPrimaryErr;
// //     if (ayahTranslitErr) throw ayahTranslitErr;

// //     const db = await getDatabase();

// //     // --- Transaction: mirror server state ---
// //     await db.withExclusiveTransactionAsync(async (txn) => {
// //       // Clear global marker tables & sura
// //       await txn.execAsync("DELETE FROM hizb;");
// //       await txn.execAsync("DELETE FROM juz;");
// //       await txn.execAsync("DELETE FROM ruku;");
// //       await txn.execAsync("DELETE FROM sajda;");
// //       await txn.execAsync("DELETE FROM sura;");

// //       // ALWAYS clear transliteration table (for all languages)
// //       await txn.execAsync("DELETE FROM aya_en_transliteration;");

// //       // Clear only the current language's ayah table
// //       if (plan.kind === "ar") {
// //         await txn.execAsync("DELETE FROM aya_ar;");
// //       } else if (plan.kind === "de") {
// //         await txn.execAsync("DELETE FROM aya_de;");
// //       } else {
// //         await txn.execAsync("DELETE FROM aya_en;");
// //       }

// //       // Prepare statements
// //       const suraStmt = await txn.prepareAsync(
// //         `INSERT OR REPLACE INTO sura
// //            (id, label, label_en, label_de, nbAyat, nbWord, nbLetter, orderId, makki, startPage, endPage, ruku)
// //          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`
// //       );
// //       const hizbStmt = await txn.prepareAsync(
// //         `INSERT OR REPLACE INTO hizb (id, sura, aya) VALUES (?, ?, ?);`
// //       );
// //       const juzStmt = await txn.prepareAsync(
// //         `INSERT OR REPLACE INTO juz (id, sura, aya, page) VALUES (?, ?, ?, ?);`
// //       );
// //       const rukuStmt = await txn.prepareAsync(
// //         `INSERT OR REPLACE INTO ruku (id, sura, aya) VALUES (?, ?, ?);`
// //       );
// //       const sajdaStmt = await txn.prepareAsync(
// //         `INSERT OR REPLACE INTO sajda (id, sura, aya, type) VALUES (?, ?, ?, ?);`
// //       );

// //       const ayahPrimaryStmt =
// //         plan.kind === "ar"
// //           ? await txn.prepareAsync(
// //               `INSERT OR REPLACE INTO aya_ar (id, sura, aya, quran_arabic_text)
// //                VALUES (?, ?, ?, ?);`
// //             )
// //           : plan.kind === "de"
// //           ? await txn.prepareAsync(
// //               `INSERT OR REPLACE INTO aya_de (id, sura, aya, quran_german_text)
// //                VALUES (?, ?, ?, ?);`
// //             )
// //           : await txn.prepareAsync(
// //               `INSERT OR REPLACE INTO aya_en (id, sura, aya, quran_english_text)
// //                VALUES (?, ?, ?, ?);`
// //             );

// //       // ALWAYS prepare transliteration statement (for all languages)
// //       const ayahTranslitStmt = await txn.prepareAsync(
// //         `INSERT OR REPLACE INTO aya_en_transliteration
// //            (id, sura, aya, quran_transliteration_text)
// //          VALUES (?, ?, ?, ?);`
// //       );

// //       try {
// //         // sura
// //         for (const s of (suraRows ?? []) as any[]) {
// //           await suraStmt.executeAsync([
// //             s.id,
// //             s.label,
// //             s.label_en ?? null,
// //             s.label_de ?? null,
// //             s.nbAyat,
// //             s.nbWord,
// //             s.nbLetter,
// //             s.orderId,
// //             s.makki,
// //             s.startPage,
// //             s.endPage,
// //             s.ruku ?? null,
// //           ]);
// //         }
// //         // hizb
// //         for (const h of (hizbRows ?? []) as any[]) {
// //           await hizbStmt.executeAsync([h.id, h.sura, h.aya]);
// //         }
// //         // juz
// //         for (const j of (juzRows ?? []) as any[]) {
// //           await juzStmt.executeAsync([j.id, j.sura, j.aya, j.page]);
// //         }
// //         // ruku
// //         for (const r of (rukuRows ?? []) as any[]) {
// //           await rukuStmt.executeAsync([r.id, r.sura, r.aya]);
// //         }
// //         // sajda
// //         for (const s of (sajdaRows ?? []) as any[]) {
// //           await sajdaStmt.executeAsync([s.id, s.sura, s.aya, s.type ?? null]);
// //         }

// //         // primary ayah
// //         for (const a of (ayahPrimaryRows ?? []) as any[]) {
// //           if (plan.kind === "ar") {
// //             await ayahPrimaryStmt.executeAsync([
// //               a.id,
// //               a.sura,
// //               a.aya,
// //               a.quran_arabic_text,
// //             ]);
// //           } else if (plan.kind === "de") {
// //             await ayahPrimaryStmt.executeAsync([
// //               a.id,
// //               a.sura,
// //               a.aya,
// //               a.quran_german_text,
// //             ]);
// //           } else {
// //             await ayahPrimaryStmt.executeAsync([
// //               a.id,
// //               a.sura,
// //               a.aya,
// //               a.quran_english_text,
// //             ]);
// //           }
// //         }

// //         // ALWAYS insert transliteration data (for all languages)
// //         for (const t of (ayahTranslitRows ?? []) as any[]) {
// //           await ayahTranslitStmt.executeAsync([
// //             t.id,
// //             t.sura,
// //             t.aya,
// //             t.quran_transliteration_text,
// //           ]);
// //         }
// //       } finally {
// //         await suraStmt.finalizeAsync();
// //         await hizbStmt.finalizeAsync();
// //         await juzStmt.finalizeAsync();
// //         await rukuStmt.finalizeAsync();
// //         await sajdaStmt.finalizeAsync();
// //         await ayahPrimaryStmt.finalizeAsync();
// //         await ayahTranslitStmt.finalizeAsync();
// //       }
// //     });

// //     console.log(`Quran synced for '${language}' with Arabic transliteration.`);
// //   } catch (error) {
// //     console.error("Critical error in syncQuran:", error);
// //   }
// // }

// // export default syncQuran;

// app/db/sync/quran.ts

import { supabase } from "@/utils/supabase";
import { getDatabase } from "..";
import { useDataVersionStore } from "@/stores/dataVersionStore";

/**
 * Sync Quran data into local SQLite:
 * - Global tables: sura, hizb, juz, ruku, sajda
 * - Always sync ALL ayah tables:
 *   aya_ar(quran_arabic_text)
 *   aya_de(quran_german_text)
 *   aya_en(quran_english_text)
 *   aya_en_transliteration(quran_transliteration_text)
 *
 * All writes are done in a single exclusive transaction.
 */
async function syncQuran(): Promise<void> {
  try {
    // --- Build fetches (with high range + stable order) ---
    const suraFetch = supabase
      .from("sura")
      .select(
        "id, label, label_en, label_de, nbAyat, nbWord, nbLetter, orderId, makki, startPage, endPage, ruku"
      )
      .range(0, 7000)
      .order("id", { ascending: true });

    const hizbFetch = supabase
      .from("hizb")
      .select("id, sura, aya")
      .range(0, 7000)
      .order("id", { ascending: true });
    const juzFetch = supabase
      .from("juz")
      .select("id, sura, aya, page")
      .range(0, 7000)
      .order("id", { ascending: true });
    const rukuFetch = supabase
      .from("ruku")
      .select("id, sura, aya")
      .range(0, 7000)
      .order("id", { ascending: true });
    const sajdaFetch = supabase
      .from("sajda")
      .select("id, sura, aya, type")
      .range(0, 7000)
      .order("id", { ascending: true });
    const ayaArFetch = supabase
      .from("aya_ar")
      .select("id, sura, aya, quran_arabic_text")
      .range(0, 7000)
      .order("id", { ascending: true });
    const ayaDeFetch = supabase
      .from("aya_de")
      .select("id, sura, aya, quran_german_text")
      .range(0, 7000)
      .order("id", { ascending: true });
    const ayaEnFetch = supabase
      .from("aya_en")
      .select("id, sura, aya, quran_english_text")
      .range(0, 7000)
      .order("id", { ascending: true });
    const ayaTrFetch = supabase
      .from("aya_en_transliteration")
      .select("id, sura, aya, quran_transliteration_text")
      .range(0, 7000)
      .order("id", { ascending: true });
    const pageFetch = supabase
      .from("page")
      .select("id, sura, aya")
      .range(0, 7000)
      .order("id");

    // --- Execute in parallel ---
    const [
      { data: suraRows, error: suraErr },
      { data: hizbRows, error: hizbErr },
      { data: juzRows, error: juzErr },
      { data: rukuRows, error: rukuErr },
      { data: sajdaRows, error: sajdaErr },
      { data: ayaArRows, error: ayaArErr },
      { data: ayaDeRows, error: ayaDeErr },
      { data: ayaEnRows, error: ayaEnErr },
      { data: ayaTrRows, error: ayaTrErr },
      { data: pageRows, error: pageErr },
    ] = await Promise.all([
      suraFetch,
      hizbFetch,
      juzFetch,
      rukuFetch,
      sajdaFetch,
      ayaArFetch,
      ayaDeFetch,
      ayaEnFetch,
      ayaTrFetch,
      pageFetch,
    ]);

    if (suraErr) throw suraErr;
    if (hizbErr) throw hizbErr;
    if (juzErr) throw juzErr;
    if (rukuErr) throw rukuErr;
    if (sajdaErr) throw sajdaErr;
    if (ayaArErr) throw ayaArErr;
    if (ayaDeErr) throw ayaDeErr;
    if (ayaEnErr) throw ayaEnErr;
    if (ayaTrErr) throw ayaTrErr;
    if (pageErr) throw pageErr;

    const db = await getDatabase();

    // --- Transaction: clear + insert ---
    await db.withExclusiveTransactionAsync(async (txn) => {
      // Clear all tables
      await txn.execAsync("DELETE FROM hizb;");
      await txn.execAsync("DELETE FROM juz;");
      await txn.execAsync("DELETE FROM ruku;");
      await txn.execAsync("DELETE FROM sajda;");
      await txn.execAsync("DELETE FROM sura;");
      await txn.execAsync("DELETE FROM aya_ar;");
      await txn.execAsync("DELETE FROM aya_de;");
      await txn.execAsync("DELETE FROM aya_en;");
      await txn.execAsync("DELETE FROM aya_en_transliteration;");
      await txn.execAsync("DELETE FROM page;");

      // Prepare statements
      const suraStmt = await txn.prepareAsync(
        `INSERT OR REPLACE INTO sura
         (id, label, label_en, label_de, nbAyat, nbWord, nbLetter, orderId, makki, startPage, endPage, ruku)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`
      );
      const hizbStmt = await txn.prepareAsync(
        `INSERT OR REPLACE INTO hizb (id, sura, aya) VALUES (?, ?, ?);`
      );
      const juzStmt = await txn.prepareAsync(
        `INSERT OR REPLACE INTO juz (id, sura, aya, page) VALUES (?, ?, ?, ?);`
      );
      const rukuStmt = await txn.prepareAsync(
        `INSERT OR REPLACE INTO ruku (id, sura, aya) VALUES (?, ?, ?);`
      );
      const sajdaStmt = await txn.prepareAsync(
        `INSERT OR REPLACE INTO sajda (id, sura, aya, type) VALUES (?, ?, ?, ?);`
      );
      const ayaArStmt = await txn.prepareAsync(
        `INSERT OR REPLACE INTO aya_ar (id, sura, aya, quran_arabic_text) VALUES (?, ?, ?, ?);`
      );
      const ayaDeStmt = await txn.prepareAsync(
        `INSERT OR REPLACE INTO aya_de (id, sura, aya, quran_german_text) VALUES (?, ?, ?, ?);`
      );
      const ayaEnStmt = await txn.prepareAsync(
        `INSERT OR REPLACE INTO aya_en (id, sura, aya, quran_english_text) VALUES (?, ?, ?, ?);`
      );
      const ayaTrStmt = await txn.prepareAsync(
        `INSERT OR REPLACE INTO aya_en_transliteration (id, sura, aya, quran_transliteration_text) VALUES (?, ?, ?, ?);`
      );
      const pageStmt = await txn.prepareAsync(
        `INSERT OR REPLACE INTO page (id, sura, aya) VALUES (?, ?, ?);`
      );
      try {
        for (const s of suraRows ?? []) {
          await suraStmt.executeAsync([
            s.id,
            s.label,
            s.label_en ?? null,
            s.label_de,
            s.nbAyat,
            s.nbWord,
            s.nbLetter,
            s.orderId,
            s.makki,
            s.startPage,
            s.endPage,
            s.ruku ?? null,
          ]);
        }
        for (const h of hizbRows ?? [])
          await hizbStmt.executeAsync([h.id, h.sura, h.aya]);
        for (const j of juzRows ?? [])
          await juzStmt.executeAsync([j.id, j.sura, j.aya, j.page]);
        for (const r of rukuRows ?? [])
          await rukuStmt.executeAsync([r.id, r.sura, r.aya]);
        for (const s of sajdaRows ?? [])
          await sajdaStmt.executeAsync([s.id, s.sura, s.aya, s.type ?? null]);
        for (const a of ayaArRows ?? [])
          await ayaArStmt.executeAsync([
            a.id,
            a.sura,
            a.aya,
            a.quran_arabic_text,
          ]);
        for (const a of ayaDeRows ?? [])
          await ayaDeStmt.executeAsync([
            a.id,
            a.sura,
            a.aya,
            a.quran_german_text,
          ]);
        for (const a of ayaEnRows ?? [])
          await ayaEnStmt.executeAsync([
            a.id,
            a.sura,
            a.aya,
            a.quran_english_text,
          ]);
        for (const t of ayaTrRows ?? [])
          await ayaTrStmt.executeAsync([
            t.id,
            t.sura,
            t.aya,
            t.quran_transliteration_text,
          ]);
        for (const p of pageRows ?? []) {
          await pageStmt.executeAsync([p.id, p.sura, p.aya]);
        }
      } finally {
        await suraStmt.finalizeAsync();
        await hizbStmt.finalizeAsync();
        await juzStmt.finalizeAsync();
        await rukuStmt.finalizeAsync();
        await sajdaStmt.finalizeAsync();
        await ayaArStmt.finalizeAsync();
        await ayaDeStmt.finalizeAsync();
        await ayaEnStmt.finalizeAsync();
        await ayaTrStmt.finalizeAsync();
        await pageStmt.finalizeAsync();
      }
    });

    console.log("Quran synced (ar, de, en, transliteration).");
    // Increment the Quran version after successful sync
    const { incrementQuranDataVersion } = useDataVersionStore.getState();
    incrementQuranDataVersion();
  } catch (error) {
    console.error("Critical error in syncQuran:", error);
  }
}

export default syncQuran;
