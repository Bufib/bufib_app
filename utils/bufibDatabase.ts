import { databaseUpdate } from "@/constants/messages";
import {
  CalendarType,
  FavoritePrayerFolderType,
  FullPrayer,
  PrayerCategoryType,
  PrayerRow,
  PrayerType,
  PrayerWithCategory,
  PrayerWithTranslationType,
  QuestionType,
  QuranSuraType,
} from "@/constants/Types";
import { supabase } from "@/utils/supabase";
import Constants from "expo-constants";
import { router } from "expo-router";
import * as SQLite from "expo-sqlite";
import Storage from "expo-sqlite/kv-store";
import debounce from "lodash.debounce";
import { Alert, Platform } from "react-native";
import {
  checkInternetConnection,
  setupConnectivityListener,
} from "./checkNetwork";
import handleOpenExternalUrl from "./handleOpenExternalUrl";
import i18n from "./i18n";

let dbInstance: SQLite.SQLiteDatabase | null = null;

const getDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabaseAsync("bufib.db");

    // Set up initial configuration and tables
    await dbInstance.execAsync(`
      PRAGMA journal_mode = WAL;
      PRAGMA foreign_keys = ON;

      CREATE TABLE IF NOT EXISTS question_categories (
        question_category_name TEXT PRIMARY KEY
      );

      CREATE TABLE IF NOT EXISTS question_subcategories (
        question_subcategory_name TEXT PRIMARY KEY

      );
      CREATE TABLE IF NOT EXISTS questions (
        id               INTEGER PRIMARY KEY,
        title            TEXT    NOT NULL,
        question         TEXT    NOT NULL,
        answer           TEXT,
        answer_sistani   TEXT,
        answer_khamenei  TEXT,
        question_category_name    TEXT    REFERENCES question_categories(question_category_name) ON DELETE SET NULL,
        question_subcategory_name TEXT    REFERENCES question_subcategories(question_subcategory_name) ON DELETE SET NULL,
        created_at       TEXT    DEFAULT CURRENT_TIMESTAMP,
        language_code    TEXT    NOT NULL
      );

      CREATE TABLE IF NOT EXISTS prayer_categories (
        id        INTEGER PRIMARY KEY,
        title     TEXT    NOT NULL,
        parent_id TEXT    -- JSON array of numeric IDs, no FK
      );

      CREATE TABLE IF NOT EXISTS prayers (
        id                   INTEGER PRIMARY KEY,
        name                 TEXT    NOT NULL,
        arabic_title         TEXT,
        category_id          INTEGER REFERENCES prayer_categories(id),
        arabic_introduction  TEXT,
        arabic_text          TEXT,
        arabic_notes         TEXT,
        transliteration_text TEXT,
        source               TEXT,
        translated_languages TEXT,   
        created_at           TEXT    DEFAULT CURRENT_TIMESTAMP,
        updated_at           TEXT    DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS prayer_translations (
        id                      INTEGER PRIMARY KEY,
        prayer_id               INTEGER REFERENCES prayers(id),
        language_code           TEXT    NOT NULL,
        translated_introduction TEXT,
        translated_text         TEXT,
        translated_notes        TEXT,
        source                  TEXT,
        created_at              TEXT    DEFAULT CURRENT_TIMESTAMP,
        updated_at              TEXT    DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS favorite_questions (  
        id                INTEGER PRIMARY KEY,                                      
        question_id        INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE UNIQUE, 
        created_at         TEXT    DEFAULT CURRENT_TIMESTAMP                                                                   
      );

        CREATE INDEX IF NOT EXISTS idx_fav_questions_question_id 
          ON favorite_questions(question_id);


      CREATE TABLE IF NOT EXISTS favorite_prayers (
        id            INTEGER PRIMARY KEY,
        prayer_id     INTEGER NOT NULL REFERENCES prayers(id) ON DELETE CASCADE,
        folder_name   TEXT NOT NULL,
        folder_color  TEXT NOT NULL,
        created_at    TEXT    DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(prayer_id, folder_name) 
    );
    
      CREATE TABLE IF NOT EXISTS prayer_folders (
        name       TEXT PRIMARY KEY,
        color      TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
      
       CREATE TABLE IF NOT EXISTS calendar (
        id             INTEGER PRIMARY KEY,
        title          TEXT NOT NULL,
        islamic_date   TEXT NOT NULL,
        gregorian_date TEXT   NOT NULL,
        description    TEXT NOT NULL,
        type           TEXT NOT NULL,
        countdown      INTEGER NOT NULL DEFAULT 1,
        created_at     TEXT DEFAULT CURRENT_TIMESTAMP,
        language_code  TEXT NOT NULL
      );

       CREATE TABLE IF NOT EXISTS quran_suras (
        id                INTEGER PRIMARY KEY,
        transliteration   TEXT NOT NULL,
        arabic_title      TEXT NOT NULL,
        german_title      TEXT NOT NULL,
        main_topic        TEXT,
        sura_description  TEXT,
        verse_count       INTEGER NOT NULL,
        created_at        TEXT DEFAULT CURRENT_TIMESTAMP,
        language_code     TEXT NOT NULL
      );
   

      CREATE TABLE IF NOT EXISTS quran_vers(
        id                INTEGER PRIMARY KEY,
        created_at        TEXT DEFAULT CURRENT_TIMESTAMP,
        sura_number       INTEGER NOT NULL,
        vers_number       INTEGER NOT NULL,
        arabic_text       TEXT NOT NULL,
        german_text       TEXT NOT NULL,
        explanation       TEXT NOT NULL,
        language_code     TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_fav_prayers_prayer_id
        ON favorite_prayers(prayer_id);

      CREATE INDEX IF NOT EXISTS idx_prayers_category_id
        ON prayers(category_id);

      CREATE INDEX IF NOT EXISTS idx_questions_created_at
        ON questions(created_at);

      CREATE INDEX IF NOT EXISTS idx_prayers_created_at
        ON prayers(created_at);

    `);
  }
  return dbInstance;
};

// Flag to ensure only one initialization runs at a time.
let isInitializing = false;

export const safeInitializeDatabase = async () => {
  if (isInitializing) {
    console.log("Database initialization is already running. Skipping.");
    return;
  }
  isInitializing = true;
  try {
    await initializeDatabase();
  } catch (error) {
    console.log(error);
  } finally {
    isInitializing = false;
  }
};

const debouncedSafeInitializeDatabase = debounce(() => {
  safeInitializeDatabase();
}, 3000);

export const initializeDatabase = async () => {
  const isOnline = await checkInternetConnection();

  if (!isOnline) {
    const questionCount = await getQuestionCount();
    if (questionCount > 0) {
      console.log(
        "Offline mode with existing data. Database considered initialized."
      );
      return;
    }
    console.warn(
      "No internet connection and no local data available. Running in offline mode."
    );
    setupConnectivityListener(() => {
      console.log("Internet connection restored. Re-initializing database...");
      debouncedSafeInitializeDatabase();
    });
    return;
  }

  const getStoreURL = () =>
    Platform.OS === "ios"
      ? "https://apps.apple.com/de/app/islam-fragen/id6737857116"
      : "https://play.google.com/store/apps/details?id=com.bufib.islamFragen&pcampaignid=web_share";

  const checkVersion = async () => {
    try {
      const versionFromStorage = await Storage.getItemAsync("database_version");
      const versionFromSupabase = await fetchVersionFromSupabase();
      if (versionFromSupabase && versionFromStorage !== versionFromSupabase) {
        await fetchQuestionsFromSupabase();
        await fetchCalendarFromSupabase();
        await fetchQuranSurasFromSupabase();
        await fetchPayPalLink();
        await fetchPrayersFromSupabase();
        await Storage.setItemAsync("database_version", versionFromSupabase);
      }

      const currentAppVersion = Constants.expoConfig?.version;
      const appVersionFromSupabase = await fetchAppVersionFromSupabase();
      if (
        currentAppVersion &&
        appVersionFromSupabase &&
        currentAppVersion !== appVersionFromSupabase
      ) {
        Alert.alert(
          i18n.t("updateAvailable"),
          i18n.t("newAppVersionAvailable"),
          [
            {
              text: "Update",
              onPress: () => handleOpenExternalUrl(getStoreURL()),
            },
          ]
        );
      }
    } catch (error: any) {
      console.error(
        "Error during version check and data synchronization:",
        error
      );
      Alert.alert(i18n.t("error"), error?.message);
    }
  };

  await checkVersion();
  setupSubscriptions();
};

const fetchVersionFromSupabase = async () => {
  try {
    const { data, error } = await supabase
      .from("versions")
      .select("database_version")
      .single();
    if (error) {
      console.error(error);
      return null;
    }
    return data.database_version;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const fetchAppVersionFromSupabase = async () => {
  try {
    const { data, error } = await supabase
      .from("versions")
      .select("app_version")
      .single();
    if (error) {
      console.error("Error fetching app version from Supabase:", error.message);
      return null;
    }
    return data.app_version;
  } catch (error) {
    console.error("Error fetching app version from Supabase:", error);
    return null;
  }
};

const fetchQuestionsFromSupabase = async () => {
  try {
    const { data: questions, error } = await supabase
      .from("questions")
      .select("*")
      .eq("language_code", "de");
    if (error) {
      console.error("Error fetching questions from Supabase:", error.message);
      return;
    }
    if (!questions || questions.length === 0) {
      console.log("No questions found in Supabase.");
      return;
    }

    const db = await getDatabase();

    // --- START: FIX ---
    // 1. Populate the parent tables (categories and subcategories) first.
    // This prevents foreign key constraint violations when inserting questions.
    const categories = Array.from(
      new Set(questions.map((q) => q.question_category_name).filter(Boolean))
    );
    const subcategories = Array.from(
      new Set(questions.map((q) => q.question_subcategory_name).filter(Boolean))
    );

    await db.withExclusiveTransactionAsync(async (txn) => {
      const catStmt = await txn.prepareAsync(
        `INSERT OR IGNORE INTO question_categories (question_category_name) VALUES (?);`
      );
      const subcatStmt = await txn.prepareAsync(
        `INSERT OR IGNORE INTO question_subcategories (question_subcategory_name) VALUES (?);`
      );

      try {
        for (const name of categories) {
          await catStmt.executeAsync([name]);
        }
        for (const name of subcategories) {
          await subcatStmt.executeAsync([name]);
        }
        console.log("Categories and subcategories synced.");
      } catch (e) {
        console.error("Error syncing categories/subcategories:", e);
      } finally {
        await catStmt.finalizeAsync();
        await subcatStmt.finalizeAsync();
      }
    });
    // --- END: FIX ---

    // 2. Clean up stale questions that are no longer in the remote database
    const remoteIds = questions.map((q) => q.id);
    if (remoteIds.length) {
      const placeholders = remoteIds.map(() => "?").join(",");
      await db.runAsync(
        `DELETE FROM questions WHERE id NOT IN (${placeholders});`,
        remoteIds
      );
    } else {
      // If remote returns no questions, clear the local table
      await db.runAsync(`DELETE FROM questions;`);
    }

    // 3. Insert or Replace the fetched questions
    await db.withExclusiveTransactionAsync(async (txn) => {
      const stmt = await txn.prepareAsync(
        `INSERT OR REPLACE INTO questions
          (id, title, question, answer, answer_sistani,
           answer_khamenei, question_category_name, question_subcategory_name, created_at, language_code)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`
      );
      try {
        for (const question of questions) {
          await stmt.executeAsync([
            question.id,
            question.title,
            question.question,
            question.answer ?? null,
            question.answer_sistani ?? null,
            question.answer_khamenei ?? null,
            question.question_category_name,
            question.question_subcategory_name,
            question.created_at,
            question.language_code,
          ]);
        }
      } catch (e) {
        console.error("Error inserting questions into database:", e);
      } finally {
        await stmt.finalizeAsync();
      }
    });

    console.log("Questions synced; stale rows cleaned up.");
  } catch (err) {
    console.error(
      "A critical error occurred in fetchQuestionsFromSupabase:",
      err
    );
  }
};

const fetchCalendarFromSupabase = async (): Promise<CalendarType[] | null> => {
  try {
    const { data, error } = await supabase.from("calendar").select("*");

    if (error) {
      console.error("Error fetching calendar from Supabase:", error.message);
      return null;
    }

    if (!data || data.length === 0) {
      console.warn("No calendar data found in Supabase.");
      return [];
    }

    const db = await getDatabase();

    await db.withExclusiveTransactionAsync(async (txn) => {
      const stmt = await txn.prepareAsync(
        `INSERT OR REPLACE INTO calendar
          (id, title, islamic_date, gregorian_date, description, type, countdown, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?);`
      );
      try {
        // loop through all rows
        for (const row of data) {
          await stmt.executeAsync([
            row.id,
            row.title,
            row.islamic_date,
            row.gregorian_date,
            row.description,
            row.type,
            row.countdown,
            row.created_at,
          ]);
        }
      } finally {
        await stmt.finalizeAsync();
      }
    });

    console.log("Calendar synced.");

    // return the array you fetched
    return data;
  } catch (error) {
    console.error("Unexpected error fetching calendar:", error);
    // on unexpected error, return null
    return null;
  }
};

const fetchQuranSurasFromSupabase = async (): Promise<
  QuranSuraType[] | null
> => {
  try {
    const { data, error } = await supabase.from("quran_suras").select("*");
    if (error) {
      console.error("Error fetching quran_suras from Supabase:", error.message);
      return null;
    }

    if (!data || data.length === 0) {
      console.warn("No Quran_suras data found in Supabase.");
      return [];
    }

    const db = await getDatabase();
    await db.withExclusiveTransactionAsync(async (txn) => {
      const stmt = await txn.prepareAsync(
        `INSERT OR REPLACE INTO quran_suras
           (id, transliteration, arabic_title, german_title, sura_description, verse_count, created_at, language_code)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?);`
      );

      try {
        // 3) Insert each row
        for (const sura of data) {
          await stmt.executeAsync([
            sura.id,
            sura.transliteration,
            sura.arabic_title,
            sura.german_title,
            sura.sura_description,
            sura.verse_count,
            sura.created_at,
            sura.language_code,
          ]);
        }
      } finally {
        await stmt.finalizeAsync();
      }
    });

    console.log("Quran_suras synced.");

    // 4) Return the fetched array
    return data;
  } catch (error) {
    console.error("Unexpected error fetching Quran_suras:", error);
    return null;
  }
};
// const fetchQuranVersFromSupabase = async (): Promise<QuranVersType[] | null> => {

//   try {
//     const { data, error } = await supabase
//       .from("quran_vers")
//       .select("*")
//     if (error) {
//       console.error("Error fetching quran_vers from Supabase:", error.message);
//       return;
//     }
//     if (data) {
//       const db = await getDatabase();
//       await db.withExclusiveTransactionAsync(async (txn) => {
//         const stmt = await txn.prepareAsync(
//           `INSERT OR REPLACE INTO quran_vers
//             (id, created_at, sura_number, vers_number, arabic_text, german_text, explanation, language_code)
//            VALUES (?, ?, ?, ?, ?, ?, ?, ?);`
//         );
//         try {
//            for (const vers of data) {
//           await stmt.executeAsync([
//             data.id,
//             data.created_at,
//             data.sura_number,
//             data.vers_number,
//             data.arabic_text,
//             data.german_text,
//             data.explanation,
//             data.language_code,
//           ]);
//         }
//         } finally {
//           await stmt.finalizeAsync();
//         }
//       });
//       console.log("Quran_vers synced.");
//     } else {
//       console.warn("No Quran_vers data found in Supabase.");
//     }
//   } catch (error) {
//     console.error("Unexpected error fetching Quran_vers:", error);
//   }
// };

const fetchPayPalLink = async () => {
  try {
    const { data, error } = await supabase
      .from("paypal")
      .select("link")
      .single();
    if (error) {
      console.error("Error fetching PayPal link from Supabase:", error.message);
      return;
    }
    if (data?.link) {
      Storage.setItemAsync("paypal", data.link);
    } else {
      console.warn("No PayPal link found in Supabase.");
    }
  } catch (error) {
    console.error("Unexpected error fetching PayPal link:", error);
  }
};

const fetchPrayersFromSupabase = async () => {
  try {
    const { data: categories, error: catErr } = await supabase
      .from("prayer_categories")
      .select("*");
    if (catErr) throw catErr;

    const { data: prayers, error: prayerErr } = await supabase
      .from("prayers")
      .select("*");
    if (prayerErr) throw prayerErr;

    const { data: translations, error: transErr } = await supabase
      .from("prayer_translations")
      .select("*");
    if (transErr) throw transErr;

    const db = await getDatabase();

    await db.withExclusiveTransactionAsync(async (txn) => {
      const stmtCat = await txn.prepareAsync(
        `INSERT OR REPLACE INTO prayer_categories (id, title, parent_id) VALUES (?, ?, ?);`
      );
      try {
        for (const c of categories) {
          const parents = Array.isArray(c.parent_id) ? c.parent_id : [];
          await stmtCat.executeAsync([c.id, c.title, JSON.stringify(parents)]);
        }
      } finally {
        await stmtCat.finalizeAsync();
      }
    });

    await db.withExclusiveTransactionAsync(async (txn) => {
      const stmtPrayer = await txn.prepareAsync(
        `INSERT OR REPLACE INTO prayers
          (id, name, arabic_title, category_id, arabic_introduction,
           arabic_text, arabic_notes, transliteration_text, source,
           translated_languages, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`
      );
      try {
        for (const p of prayers) {
          await stmtPrayer.executeAsync([
            p.id,
            p.name,
            p.arabic_title,
            p.category_id,
            p.arabic_introduction,
            p.arabic_text,
            p.arabic_notes,
            p.transliteration_text,
            p.source,
            JSON.stringify(p.translated_languages),
            p.created_at,
            p.updated_at,
          ]);
        }
      } finally {
        await stmtPrayer.finalizeAsync();
      }
    });

    await db.withExclusiveTransactionAsync(async (txn) => {
      const stmtTrans = await txn.prepareAsync(
        `INSERT OR REPLACE INTO prayer_translations
          (id, prayer_id, language_code, translated_introduction,
           translated_text, translated_notes, source, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`
      );
      try {
        for (const t of translations) {
          await stmtTrans.executeAsync([
            t.id,
            t.prayer_id,
            t.language_code,
            t.translated_introduction,
            t.translated_text,
            t.translated_notes,
            t.source,
            t.created_at,
            t.updated_at,
          ]);
        }
      } finally {
        await stmtTrans.finalizeAsync();
      }
    });

    console.log("Prayers and translations synced.");
  } catch (error) {
    console.error("Error in fetchPrayersFromSupabase:", error);
  }
};

const setupSubscriptions = () => {
  supabase
    .channel("versions")
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "versions" },
      async (payload) => {
        if (payload.new.database_version !== payload.old.database_version) {
          try {
            console.log("Change received!", payload);
            await initializeDatabase();
            router.replace("/(tabs)/home");
            databaseUpdate();
          } catch (error) {
            console.error(
              "Error handling Supabase subscription change:",
              error
            );
          }
        }
        if (payload.new.app_version !== payload.old.app_version) {
          try {
            await initializeDatabase();
          } catch (error) {
            console.error(
              "Error handling Supabase subscription change:",
              error
            );
          }
        }
      }
    )
    .subscribe();

  supabase
    .channel("paypal")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "paypal" },
      async (payload) => {
        try {
          console.log("Change received!", payload);
          await fetchPayPalLink();
          router.replace("/(tabs)/home");
          databaseUpdate();
        } catch (error) {
          console.error("Error handling Supabase subscription change:", error);
        }
      }
    )
    .subscribe();
};

export const getQuestionCount = async (): Promise<number> => {
  try {
    const db = await getDatabase();
    const result = await db.getFirstAsync<{ count: number }>(`
      SELECT COUNT(*) as count FROM questions;
    `);
    return result?.count ?? 0;
  } catch (error) {
    console.error("Error getting question count:", error);
    return 0;
  }
};

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

export const searchPrayers = async (
  searchTerm: string
): Promise<PrayerType[]> => {
  try {
    const db = await getDatabase();

    return await db.getAllAsync<PrayerType>(
      `
      SELECT *
      FROM prayers
      WHERE name LIKE ? OR arabic_title LIKE ?;
      `,
      [`%${searchTerm}%`, `%${searchTerm}%`]
    );
  } catch (error) {
    console.error("Error searching prayers:", error);
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

export async function getPrayerWithTranslations(
  prayerId: number
): Promise<FullPrayer | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<PrayerRow>(
    `SELECT * FROM prayers WHERE id = ? LIMIT 1;`,
    [prayerId]
  );
  if (!row) return null;

  const langs: string[] = JSON.parse(row.translated_languages || "[]");

  const translations = await db.getAllAsync<PrayerWithTranslationType>(
    `SELECT * FROM prayer_translations WHERE prayer_id = ?;`,
    [prayerId]
  );

  const prayer: PrayerType = {
    id: row.id,
    name: row.name,
    arabic_title: row.arabic_title,
    category_id: row.category_id,
    arabic_introduction: row.arabic_introduction,
    arabic_text: row.arabic_text,
    arabic_notes: row.arabic_notes,
    transliteration_text: row.transliteration_text,
    source: row.source,
    translated_languages: langs,
    created_at: new Date(row.created_at),
    updated_at: new Date(row.updated_at),
  };

  return {
    ...prayer,
    translations,
  };
}

export async function getCategoryByTitle(
  title: string
): Promise<PrayerCategoryType | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<PrayerCategoryType>(
    `SELECT id, title
     FROM prayer_categories
     WHERE title = ?
     LIMIT 1;`,
    [title]
  );
  return row ?? null;
}

export async function getChildCategories(
  parentId: number
): Promise<PrayerCategoryType[]> {
  const db = await getDatabase();
  return await db.getAllAsync<PrayerCategoryType>(
    `SELECT pc.id, pc.title
     FROM prayer_categories pc,
          json_each(pc.parent_id) AS j
     WHERE j.value = ?
     ORDER BY pc.title;`,
    [parentId]
  );
}

export async function getPrayersForCategory(
  categoryId: number,
  languageCode: string
): Promise<PrayerWithCategory[]> {
  const db = await getDatabase();
  return await db.getAllAsync<PrayerWithCategory>(
    `SELECT
       p.id,
       p.name,
       COALESCE(t.translated_text, p.arabic_text, '') AS prayer_text,
       p.category_id
     FROM prayers p
     LEFT JOIN prayer_translations t
       ON p.id = t.prayer_id
       AND t.language_code = ?
     WHERE p.category_id = ?
     ORDER BY p.name;`,
    [languageCode, categoryId]
  );
}

export const getFavoritePrayersForFolder = async (
  folderName: string
): Promise<PrayerType[]> => {
  const db = await getDatabase();
  return await db.getAllAsync<PrayerType>(
    `
    SELECT p.*
      FROM prayers p
      JOIN favorite_prayers f
        ON p.id = f.prayer_id
     WHERE f.folder_name = ?
     ORDER BY datetime(f.created_at) DESC;
    `,
    [folderName]
  );
};

export async function getAllPrayersForArabic(
  categoryId: number
): Promise<PrayerWithCategory[]> {
  const db = await getDatabase();
  return await db.getAllAsync<PrayerWithCategory>(
    `SELECT
       id,
       name,
       arabic_text AS prayer_text,
       category_id
     FROM prayers
     WHERE category_id = ?
     ORDER BY name;`,
    [categoryId]
  );
}

export const getFoldersForPrayer = async (
  prayerId: number
): Promise<string[]> => {
  const db = await getDatabase();
  const rows = await db.getAllAsync<{ folder_name: string }>(
    `SELECT folder_name FROM favorite_prayers WHERE prayer_id = ?;`,
    [prayerId]
  );
  return rows.map((r) => r.folder_name);
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

export const getFavoritePrayerFolders = async (): Promise<
  FavoritePrayerFolderType[]
> => {
  const db = await getDatabase();
  const rows = await db.getAllAsync<{
    name: string;
    color: string;
    cnt: number;
  }>(`
    SELECT
      f.name,
      f.color,
      COALESCE(fp.count, 0) AS cnt
    FROM prayer_folders AS f
    LEFT JOIN (
      SELECT folder_name, COUNT(*) AS count
      FROM favorite_prayers
      GROUP BY folder_name
    ) fp ON f.name = fp.folder_name
    ORDER BY LOWER(f.name);
  `);
  return rows.map((r) => ({
    name: r.name,
    color: r.color,
    prayerCount: r.cnt,
  }));
};

export const getFavoritePrayers = async (): Promise<PrayerType[]> => {
  try {
    const db = await getDatabase();
    return await db.getAllAsync<PrayerType>(`
      SELECT p.*
      FROM prayers     AS p
      JOIN favorite_prayers   AS f
        ON p.id = f.prayer_id
      ORDER BY datetime(f.created_at) DESC;
    `);
  } catch (error) {
    console.error("Error retrieving favorite prayers:", error);
    throw error;
  }
};

export const createFolder = async (name: string, color: string) => {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT OR IGNORE INTO prayer_folders (name, color) VALUES (?, ?);`,
    [name, color]
  );
  return { name, color };
};

export const addPrayerToFolder = async (
  prayerId: number,
  folder: { name: string; color: string }
): Promise<void> => {
  const db = await getDatabase();
  await db.runAsync(
    `
    INSERT OR IGNORE INTO favorite_prayers (prayer_id, folder_name, folder_color)
    VALUES (?, ?, ?);
    `,
    [prayerId, folder.name, folder.color]
  );
};

export async function removePrayerFromFolder(
  prayerId: number,
  folderName: string
): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `
    DELETE FROM favorite_prayers
    WHERE prayer_id = ? AND folder_name = ?;
    `,
    [prayerId, folderName]
  );
}

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

export const togglePrayerFavorite = async (
  prayerId: number
): Promise<boolean> => {
  const db = await getDatabase();
  const row = await db.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) AS count FROM favorite_prayers WHERE prayer_id = ?;`,
    [prayerId]
  );
  const exists = (row?.count ?? 0) > 0;

  if (exists) {
    await db.runAsync(`DELETE FROM favorite_prayers WHERE prayer_id = ?;`, [
      prayerId,
    ]);
    return false;
  } else {
    await db.runAsync(
      `INSERT OR IGNORE INTO favorite_prayers (prayer_id) VALUES (?);`,
      [prayerId]
    );
    return true;
  }
};

/**
 * Fetches all calendar events for the specified language from Supabase
 * and upserts them into the local SQLite "calendar" table.
 *
 * @param {string} languageCode – ISO code of the language (e.g. 'en', 'ar')
 */
// fetcher.ts

export const fetchCalendarEventsByLanguage = async (
  language_code: string
): Promise<CalendarType[] | undefined> => {
  try {
    const { data, error } = await supabase
      .from("calendar")
      .select("*")
      .eq("language_code", language_code);

    if (error) {
      console.error(
        `Error fetching calendar events for "${language_code}":`,
        error.message
      );
      return;
    }
    if (!data || data.length === 0) {
      console.warn(`No calendar events found for language "${language_code}".`);
      return [];
    }

    // Upsert into local DB
    const db = await getDatabase();
    await db.withExclusiveTransactionAsync(async (txn) => {
      const stmt = await txn.prepareAsync(
        `INSERT OR REPLACE INTO calendar
           (id, title, islamic_date, gregorian_date, description,
            type, countdown, created_at, language_code)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`
      );
      try {
        for (const row of data) {
          await stmt.executeAsync([
            row.id,
            row.title,
            row.islamic_date,
            row.gregorian_date,
            row.description,
            row.type,
            row.countdown,
            row.created_at,
            row.language_code,
          ]);
        }
      } finally {
        await stmt.finalizeAsync();
      }
    });

    console.log(
      `Synced ${data.length} calendar event(s) for "${language_code}".`
    );

    const parsed = (data as CalendarType[]).map((row) => ({
      ...row,
      gregorian_date: new Date(row.gregorian_date),
      created_at: new Date(row.created_at),
    }));

    return parsed;
  } catch (err) {
    console.error("Unexpected error syncing calendar events:", err);
    return;
  }
};

export const getAllQuranSuras = async (
  language_code: string
): Promise<QuranSuraType[]> => {
  try {
    const db = await getDatabase();
    const query = `
      SELECT *
        FROM quran_suras
       WHERE language_code = ?
    ORDER BY id;
    `;

    return await db.getAllAsync<QuranSuraType>(query, [language_code]);
  } catch (error) {
    console.error("Error fetching Quran suras:", error);
    throw error;
  }
};

export const getAllQuranVers = async (
  language_code: string
): Promise<QuranSuraType[]> => {
  try {
    const db = await getDatabase();
    const query = `
      SELECT *
        FROM quran_vers
       WHERE language_code = ?
    ORDER BY sura_number, vers_number;
    `;
    return await db.getAllAsync<QuranSuraType>(query, [language_code]);
  } catch (error) {
    console.error("Error fetching Quran suras:", error);
    throw error;
  }
};
