import * as SQLite from "expo-sqlite";
import { supabase } from "@/utils/supabase";
import Storage from "expo-sqlite/kv-store";
import { router } from "expo-router";
import { databaseUpdate } from "@/constants/messages";
import {
  checkInternetConnection,
  setupConnectivityListener,
} from "./checkNetwork";
import debounce from "lodash.debounce";
import { Alert, Platform } from "react-native";
import handleOpenExternalUrl from "./handleExternalLink";
import Constants from "expo-constants";
import { QuestionType, SearchResultQAType } from "@/constants/Types";
import i18n from "./i18n";

let dbInstance: SQLite.SQLiteDatabase | null = null;

const getDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabaseAsync("bufib.db");

    // Set up initial configuration
    await dbInstance.execAsync(`

      PRAGMA journal_mode = WAL;
      PRAGMA foreign_keys = ON;

      CREATE TABLE IF NOT EXISTS categories (
        category_name TEXT PRIMARY KEY
      );
      CREATE TABLE IF NOT EXISTS subcategories (
        subcategory_name TEXT PRIMARY KEY
      );

      CREATE TABLE IF NOT EXISTS questions (
        id               INTEGER PRIMARY KEY,
        title            TEXT    NOT NULL,
        question         TEXT    UNIQUE NOT NULL,
        answer           TEXT,
        answer_sistani   TEXT,
        answer_khamenei  TEXT,
        category_name    TEXT    REFERENCES categories(category_name),
        subcategory_name TEXT    REFERENCES subcategories(subcategory_name),
        created_at       TEXT    DEFAULT CURRENT_TIMESTAMP,
        language_code    Text    NOT NULL
      );
    `);
  }
  return dbInstance;
};

// Flag to ensure only one initialization runs at a time.
let isInitializing = false;

// Wraps initializeDatabase to avoid concurrent executions.

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

// Create a debounced version of safeInitializeDatabase (3 seconds delay).
const debouncedSafeInitializeDatabase = debounce(() => {
  safeInitializeDatabase();
}, 3000);

// Main function to initialize the local database with remote data.
export const initializeDatabase = async () => {
  // Check for an active internet connection.
  const isOnline = await checkInternetConnection();

  if (!isOnline) {
    // When offline, check if local data already exists.
    const questionCount = await getQuestionCount();
    if (questionCount > 0) {
      console.log(
        "Offline mode with existing data. Database considered initialized."
      );
      return; // Data exists, so we consider the DB initialized.
    }
    console.warn(
      "No internet connection and no local data available. Running in offline mode."
    );
    // Set up a connectivity listener to re-initialize once online.
    setupConnectivityListener(() => {
      console.log("Internet connection restored. Re-initializing database...");
      debouncedSafeInitializeDatabase();
    });
    return;
  }

  const getStoreURL = () => {
    if (Platform.OS === "ios") {
      return "https://apps.apple.com/de/app/islam-fragen/id6737857116";
    } else {
      return "https://play.google.com/store/apps/details?id=com.bufib.islamFragen&pcampaignid=web_share";
    }
  };

  // Check if versions in Storage are up to date.
  const checkVersion = async () => {
    try {
      // Data version check for your questions.
      const versionFromStorage = await Storage.getItemAsync("database_version");
      const versionFromSupabase = await fetchVersionFromSupabase();
      if (versionFromSupabase && versionFromStorage !== versionFromSupabase) {
        await fetchQuestionsFromSupabase();
        await fetchPayPalLink();
        await Storage.setItemAsync("database_version", versionFromSupabase);
      }

      // App version check: Compare current app version to the version required from Supabase.
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

// Check the app version in supabase
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
    // 1. Fetch all questions from Supabase
    const { data: questions, error } = await supabase
      .from("questions")
      .select("*")
      .eq("language_code", i18n.language);

    if (error) {
      console.error("Error fetching questions from Supabase:", error.message);
      return;
    }
    if (!questions || questions.length === 0) {
      console.log("No questions found in Supabase.");
      return;
    }

    const db = await getDatabase();

    // 2. Delete any local questions not in the Supabase list
    const remoteIds = questions.map((q) => q.id);
    if (remoteIds.length) {
      const placeholders = remoteIds.map(() => "?").join(",");
      await db.runAsync(
        `DELETE FROM questions WHERE id NOT IN (${placeholders});`,
        remoteIds
      );
    } else {
      // If no questions remotely, wipe local table (and cascade favorites)
      await db.runAsync(`DELETE FROM questions;`);
    }

    // 3. Bulk upsert inside a single exclusive transaction
    await db.withExclusiveTransactionAsync(async (txn) => {
      const stmt = await txn.prepareAsync(`
        INSERT OR REPLACE INTO questions
          (id, title, question, answer, answer_sistani,
           answer_khamenei, category_name, subcategory_name, created_at, language_code)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
      `);

      try {
        for (const question of questions) {
          await stmt.executeAsync([
            question.id,
            question.title,
            question.question,
            question.answer ?? null,
            question.answer_sistani ?? null,
            question.answer_khamenei ?? null,
            question.category_name,
            question.subcategory_name,
            question.created_at,
            question.language_code,
          ]);
        }
      } finally {
        await stmt.finalizeAsync();
      }
    });

    // //!
    // // 4. (Optional) Extra safety: remove any orphaned favorites
    // await db.execAsync(`
    //   DELETE FROM favorites
    //   WHERE question_id NOT IN (SELECT id FROM questions);
    // `);

    console.log("Questions synced; stale rows & favorites cleaned up.");
  } catch (err) {
    if (err instanceof Error && !err.message.includes("database is locked")) {
      console.error("Unexpected error in fetchQuestionsFromSupabase:", err);
    }
  }
};

const fetchPayPalLink = async () => {
  try {
    // Fetch PayPal data from Supabase.
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

const setupSubscriptions = () => {
  supabase
    .channel("versions")
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "versions" },
      async (payload) => {
        // database_version changed?
        if (payload.new.database_version !== payload.old.database_version) {
          try {
            console.log("Change received!", payload);
            await initializeDatabase(); // Refetch with changes
            router.replace("/(tabs)/home");
            databaseUpdate();
          } catch (error) {
            console.error(
              "Error handling Supabase subscription change:",
              error
            );
          }
        }

        // app_version changed?
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

  // Subscribe to changes in the `paypal` table.
  supabase
    .channel("paypal")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "paypal" },
      async (payload) => {
        try {
          console.log("Change received!", payload);
          await fetchPayPalLink(); // Re-fetch data if PayPal link changes.
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

export const addQuestionToFavorite = async (
  questionId: number
): Promise<void> => {
  try {
    const db = await getDatabase();
    await db.runAsync(
      `
      INSERT OR IGNORE INTO favorites (question_id) VALUES (?);
    `,
      [questionId]
    );
    console.log(`Question ${questionId} added to favorites.`);
  } catch (error) {
    console.error("Error adding favorite:", error);
    throw error;
  }
};

export const removeQuestionFromFavorite = async (
  questionId: number
): Promise<void> => {
  try {
    const db = await getDatabase();
    await db.runAsync(
      `
      DELETE FROM favorites WHERE question_id = ?;
    `,
      [questionId]
    );
    console.log(`Question ${questionId} removed from favorites.`);
  } catch (error) {
    console.error("Error removing favorite:", error);
    throw error;
  }
};

export const isQuestionInFavorite = async (
  questionId: number
): Promise<boolean> => {
  try {
    const db = await getDatabase();
    const result = await db.getFirstAsync<{ count: number }>(
      `
      SELECT COUNT(*) as count FROM favorites WHERE question_id = ?;
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
    const rows = await db.getAllAsync<QuestionType>(`
      SELECT q.*
      FROM questions q
      INNER JOIN favorites f ON q.id = f.question_id
      ORDER BY f.added_at DESC;
    `);
    return rows;
  } catch (error) {
    console.error("Error retrieving favorite questions:", error);
    throw error;
  }
};

export const getSubcategoriesForCategory = async (
  categoryName: string
): Promise<string[]> => {
  try {
    const db = await getDatabase();
    const rows = await db.getAllAsync<{ subcategory_name: string }>(
      `
      SELECT DISTINCT subcategory_name FROM questions WHERE category_name = ?;
    `,
      [categoryName]
    );
    // Only unique subcategories are returned.
    return rows.map((row) => row.subcategory_name);
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
    const rows = await db.getAllAsync<QuestionType>(
      `
      SELECT * FROM questions WHERE category_name = ? AND subcategory_name = ? ORDER BY created_at DESC;
    `,
      [categoryName, subcategoryName]
    );
    return rows;
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
      WHERE category_name = ? AND subcategory_name = ? AND id = ?
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
): Promise<SearchResultQAType[]> => {
  try {
    const db = await getDatabase();
    const rows = await db.getAllAsync<{
      id: number;
      category_name: string;
      subcategory_name: string;
      question: string;
      title: string;
    }>(
      `
      SELECT id, category_name, subcategory_name, question, title
      FROM questions
      WHERE question LIKE ? OR title LIKE ?;
    `,
      [`%${searchTerm}%`, `%${searchTerm}%`]
    );
    return rows;
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
