// import * as SQLite from "expo-sqlite";
// import { supabase } from "@/utils/supabase";
// import Storage from "expo-sqlite/kv-store";
// import { router } from "expo-router";
// import { questionsDatabaseUpate } from "@/constants/messages";
// import { QuestionType, SearchResults } from "./types";
// import {
//   checkInternetConnection,
//   setupConnectivityListener,
// } from "./checkNetwork";
// import debounce from "lodash/debounce";
// import { Alert, Platform } from "react-native";
// import handleOpenExternalUrl from "./handleOpenExternalUrl";
// import Constants from "expo-constants";

// let dbInstance: SQLite.SQLiteDatabase | null = null;

// const getDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
//   if (!dbInstance) {
//     dbInstance = await SQLite.openDatabaseAsync("islam-fragen.db");
//     // Set up initial configuration
//     await dbInstance.execAsync(`
//       PRAGMA journal_mode = WAL;
//       PRAGMA foreign_keys = ON;
//     `);
//   }
//   return dbInstance;
// };

// // Flag to ensure only one initialization runs at a time.
// let isInitializing = false;

// /**
//  * Wraps initializeDatabase to avoid concurrent executions.
//  */
// export const safeInitializeDatabase = async () => {
//   if (isInitializing) {
//     console.log("Database initialization is already running. Skipping.");
//     return;
//   }
//   isInitializing = true;
//   try {
//     await initializeDatabase();
//   } finally {
//     isInitializing = false;
//   }
// };

// // Create a debounced version of safeInitializeDatabase (3 seconds delay).
// const debouncedSafeInitializeDatabase = debounce(() => {
//   safeInitializeDatabase();
// }, 3000);

// /**
//  * Main function to initialize the local database with remote data.
//  */
// export const initializeDatabase = async () => {
//   // Check for an active internet connection.
//   const isOnline = await checkInternetConnection();

//   if (!isOnline) {
//     // When offline, check if local data already exists.
//     const questionCount = await getQuestionCount();
//     if (questionCount > 0) {
//       console.log(
//         "Offline mode with existing data. Database considered initialized."
//       );
//       return; // Data exists, so we consider the DB initialized.
//     }
//     console.warn(
//       "No internet connection and no local data available. Running in offline mode."
//     );
//     // Set up a connectivity listener to re-initialize once online.
//     setupConnectivityListener(() => {
//       console.log("Internet connection restored. Re-initializing database...");
//       debouncedSafeInitializeDatabase();
//     });
//     return;
//   }

//   const getStoreURL = () => {
//     if (Platform.OS === "ios") {
//       return "https://apps.apple.com/de/app/islam-fragen/id6737857116"; // Replace with your App Store URL
//     } else {
//       return "https://play.google.com/store/apps/details?id=com.bufib.islamFragen&pcampaignid=web_share";
//     }
//   };

//   // Check if versions in Storage are up to date.
//   const checkVersion = async () => {
//     try {
//       // Data version check for your questions.
//       const versionFromStorage = await Storage.getItem("version");
//       const versionFromSupabase = await fetchVersionFromSupabase();
//       if (versionFromSupabase && versionFromStorage !== versionFromSupabase) {
//         await fetchQuestionsFromSupabase();
//         await fetchPayPalLink();
//         await Storage.setItemSync("version", versionFromSupabase);
//       }

//       // App version check: Compare current app version to the version required from Supabase.
//       const currentAppVersion = Constants.expoConfig?.version;
//       const appVersionFromSupabase = await fetchAppVersionFromSupabase();
//       if (
//         currentAppVersion &&
//         appVersionFromSupabase &&
//         currentAppVersion !== appVersionFromSupabase
//       ) {
//         Alert.alert(
//           "Update Verfügbar",
//           "Eine neue version ist im App-Store verfügbar!",
//           [
//             {
//               text: "Update",
//               onPress: () => handleOpenExternalUrl(getStoreURL()),
//             },
//           ]
//         );
//       }
//     } catch (error: any) {
//       console.error(
//         "Error during version check and data synchronization:",
//         error
//       );
//       Alert.alert("Fehler", error?.message);
//     }
//   };

//   await checkVersion();
//   setupSubscriptions();
// };

// const fetchVersionFromSupabase = async () => {
//   try {
//     const { data, error } = await supabase
//       .from("version")
//       .select("version")
//       .single();

//     if (error) {
//       console.error(error);
//       return null;
//     }
//     return data.version;
//   } catch (error) {
//     console.error(error);
//     return null;
//   }
// };

// // New function: Fetch the app version from Supabase.
// // We assume the app_version table contains a row with a field "version".
// const fetchAppVersionFromSupabase = async () => {
//   try {
//     const { data, error } = await supabase
//       .from("app_version")
//       .select("app_version")
//       .single();

//     if (error) {
//       console.error("Error fetching app version from Supabase:", error.message);
//       return null;
//     }
//     return data.app_version;
//   } catch (error) {
//     console.error("Error fetching app version from Supabase:", error);
//     return null;
//   }
// };

// const fetchQuestionsFromSupabase = async () => {
//   try {
//     // Fetch questions from Supabase.
//     const { data: questions, error } = await supabase
//       .from("question")
//       .select("*");

//     if (error) {
//       console.error("Error fetching questions from Supabase:", error.message);
//       return;
//     }

//     if (!questions || questions.length === 0) {
//       console.log("No questions found in Supabase.");
//       return;
//     }

//     // Open SQLite database.
//     const db = await getDatabase();

//     // Drop the existing question table to ensure a clean sync.
//     // Note: We do not drop the favorites table to preserve user data.
//     await db.execAsync(`DROP TABLE IF EXISTS question;`);

//     // Recreate the questions table.
//     await db.execAsync(`
//       PRAGMA journal_mode = WAL;
//       PRAGMA foreign_keys = ON;

//       CREATE TABLE IF NOT EXISTS question (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         title TEXT NOT NULL,
//         question TEXT UNIQUE NOT NULL,
//         answer TEXT,
//         answer_sistani TEXT,
//         answer_khamenei TEXT,
//         category_name TEXT REFERENCES category(category_name),
//         subcategory_name TEXT REFERENCES subcategory(subcategory_name),
//         created_at TEXT DEFAULT CURRENT_TIMESTAMP
//       );
//     `);

//     // Ensure the favorites table exists.
//     await createFavoritesTable();

//     // Use an exclusive transaction for batch insertion.
//     await db.withExclusiveTransactionAsync(async (txn) => {
//       const statement = await txn.prepareAsync(`
//         INSERT OR REPLACE INTO question
//         (id, title, question, answer, answer_sistani, answer_khamenei, category_name, subcategory_name, created_at)
//         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
//       `);

//       try {
//         // Insert each question.
//         for (const question of questions) {
//           await statement.executeAsync([
//             question.id,
//             question.title,
//             question.question,
//             question.answer || null,
//             question.answer_sistani || null,
//             question.answer_khamenei || null,
//             question.category_name,
//             question.subcategory_name,
//             question.created_at,
//           ]);
//         }
//       } finally {
//         await statement.finalizeAsync();
//       }
//     });

//     // Clean-up the favorites:
//     // Remove any favorite entries whose question_id no longer exists in the question table.
//     await db.execAsync(`
//       DELETE FROM favorites
//       WHERE question_id NOT IN (SELECT id FROM question);
//     `);

//     console.log(
//       "Questions successfully synced to SQLite and favorites cleaned up."
//     );
//   } catch (error) {
//     if (
//       error instanceof Error &&
//       !error.message.includes("database is locked")
//     ) {
//       console.error("Unexpected error in fetchQuestionsFromSupabase:", error);
//     }
//   }
// };

// const fetchPayPalLink = async () => {
//   try {
//     // Fetch PayPal data from Supabase.
//     const { data, error } = await supabase
//       .from("paypal")
//       .select("link")
//       .single();

//     if (error) {
//       console.error("Error fetching PayPal link from Supabase:", error.message);
//       return;
//     }
//     if (data?.link) {
//       Storage.setItemSync("paypal", data.link);
//     } else {
//       console.warn("No PayPal link found in Supabase.");
//     }
//   } catch (error) {
//     console.error("Unexpected error fetching PayPal link:", error);
//   }
// };

// const setupSubscriptions = () => {
//   // Subscribe to changes in the `version` table.
//   supabase
//     .channel("version")
//     .on(
//       "postgres_changes",
//       { event: "*", schema: "public", table: "version" },
//       async (payload) => {
//         try {
//           console.log("Change received!", payload);
//           await initializeDatabase(); // Re-fetch data if version changes.
//           router.replace("/(tabs)/home/");
//           questionsDatabaseUpate();
//         } catch (error) {
//           console.error("Error handling Supabase subscription change:", error);
//         }
//       }
//     )
//     .subscribe();

//   // Subscribe to changes in the `app_version` table.
//   supabase
//     .channel("app_version")
//     .on(
//       "postgres_changes",
//       { event: "*", schema: "public", table: "app_version" },
//       async (payload) => {
//         try {
//           await initializeDatabase();
//         } catch (error) {
//           console.error("Error handling Supabase subscription change:", error);
//         }
//       }
//     )
//     .subscribe();

//   // Subscribe to changes in the `paypal` table.
//   supabase
//     .channel("paypal")
//     .on(
//       "postgres_changes",
//       { event: "*", schema: "public", table: "paypal" },
//       async (payload) => {
//         try {
//           console.log("Change received!", payload);
//           await fetchPayPalLink(); // Re-fetch data if PayPal link changes.
//           router.replace("/(tabs)/home/");
//           questionsDatabaseUpate();
//         } catch (error) {
//           console.error("Error handling Supabase subscription change:", error);
//         }
//       }
//     )
//     .subscribe();
// };

// export const getQuestionCount = async (): Promise<number> => {
//   try {
//     const db = await getDatabase();
//     const result = await db.getFirstAsync<{ count: number }>(`
//       SELECT COUNT(*) as count FROM question;
//     `);
//     return result?.count ?? 0;
//   } catch (error) {
//     console.error("Error getting question count:", error);
//     return 0;
//   }
// };

// // const syncSingleQuestion = async (question: QuestionType) => {
// //   const db = await getDatabase();
// //   await db.runAsync(
// //     `
// //     INSERT OR REPLACE INTO question
// //     (id, title, question, answer, answer_sistani, answer_khamenei, category_name, subcategory_name, created_at)
// //     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
// //   `,
// //     [
// //       question.id,
// //       question.title,
// //       question.question,
// //       question.answer,
// //       question.answer_sistani,
// //       question.answer_khamenei,
// //       question.category_name,
// //       question.subcategory_name,
// //       question.created_at,
// //     ]
// //   );
// //   console.log("Question synced:", question.id);
// // };

// const createFavoritesTable = async () => {
//   const db = await getDatabase();
//   await db.execAsync(`
//     PRAGMA journal_mode = WAL;
//     CREATE TABLE IF NOT EXISTS favorites (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       question_id INTEGER NOT NULL UNIQUE,
//       added_at TEXT DEFAULT CURRENT_TIMESTAMP,
//       FOREIGN KEY (question_id) REFERENCES question(id) ON DELETE CASCADE
//     );
//   `);
// };

// export const addQuestionToFavorite = async (
//   questionId: number
// ): Promise<void> => {
//   try {
//     const db = await getDatabase();
//     await db.runAsync(
//       `
//       INSERT OR IGNORE INTO favorites (question_id) VALUES (?);
//     `,
//       [questionId]
//     );
//     console.log(`Question ${questionId} added to favorites.`);
//   } catch (error) {
//     console.error("Error adding favorite:", error);
//     throw error;
//   }
// };

// export const removeQuestionFromFavorite = async (
//   questionId: number
// ): Promise<void> => {
//   try {
//     const db = await getDatabase();
//     await db.runAsync(
//       `
//       DELETE FROM favorites WHERE question_id = ?;
//     `,
//       [questionId]
//     );
//     console.log(`Question ${questionId} removed from favorites.`);
//   } catch (error) {
//     console.error("Error removing favorite:", error);
//     throw error;
//   }
// };

// export const isQuestionInFavorite = async (
//   questionId: number
// ): Promise<boolean> => {
//   try {
//     const db = await getDatabase();
//     const result = await db.getFirstAsync<{ count: number }>(
//       `
//       SELECT COUNT(*) as count FROM favorites WHERE question_id = ?;
//     `,
//       [questionId]
//     );
//     if (result && result.count !== undefined) {
//       return result.count > 0;
//     }
//     return false;
//   } catch (error) {
//     console.error("Error checking favorite status:", error);
//     throw error;
//   }
// };

// export const getFavoriteQuestions = async (): Promise<QuestionType[]> => {
//   try {
//     const db = await getDatabase();
//     const rows = await db.getAllAsync<QuestionType>(`
//       SELECT q.*
//       FROM question q
//       INNER JOIN favorites f ON q.id = f.question_id
//       ORDER BY f.added_at DESC;
//     `);
//     return rows;
//   } catch (error) {
//     console.error("Error retrieving favorite questions:", error);
//     throw error;
//   }
// };

// // const deleteQuestionFromSQLite = async (questionId: number) => {
// //   const db = await getDatabase();
// //   await db.runAsync(`DELETE FROM question WHERE id = ?;`, [questionId]);
// //   console.log("Question deleted:", questionId);
// // };

// export const getSubcategoriesForCategory = async (
//   categoryName: string
// ): Promise<string[]> => {
//   try {
//     const db = await getDatabase();
//     const rows = await db.getAllAsync<{ subcategory_name: string }>(
//       `
//       SELECT DISTINCT subcategory_name FROM question WHERE category_name = ?;
//     `,
//       [categoryName]
//     );
//     // Only unique subcategories are returned.
//     return rows.map((row) => row.subcategory_name);
//   } catch (error) {
//     console.error("Error fetching subcategories:", error);
//     throw error;
//   }
// };

// export const getQuestionsForSubcategory = async (
//   categoryName: string,
//   subcategoryName: string
// ): Promise<QuestionType[]> => {
//   try {
//     const db = await getDatabase();
//     const rows = await db.getAllAsync<QuestionType>(
//       `
//       SELECT * FROM question WHERE category_name = ? AND subcategory_name = ?;
//     `,
//       [categoryName, subcategoryName]
//     );
//     return rows;
//   } catch (error) {
//     console.error("Error fetching questions for subcategory:", error);
//     throw error;
//   }
// };

// export const getQuestion = async (
//   categoryName: string,
//   subcategoryName: string,
//   questionId: number
// ): Promise<QuestionType> => {
//   try {
//     const db = await getDatabase();
//     const rows = await db.getAllAsync<QuestionType>(
//       `
//       SELECT * FROM question
//       WHERE category_name = ? AND subcategory_name = ? AND id = ?
//       LIMIT 1;
//     `,
//       [categoryName, subcategoryName, questionId]
//     );
//     return rows[0];
//   } catch (error) {
//     console.error("Error fetching question:", error);
//     throw error;
//   }
// };

// export const getQuestionInternalURL = async (
//   questionTitle: string
// ): Promise<QuestionType> => {
//   try {
//     const db = await getDatabase();
//     const rows = await db.getAllAsync<QuestionType>(
//       `
//       SELECT * FROM question
//       WHERE title = ?;
//     `,
//       [questionTitle]
//     );
//     return rows[0];
//   } catch (error) {
//     console.error("Error fetching question:", error);
//     throw error;
//   }
// };

// export const searchQuestions = async (
//   searchTerm: string
// ): Promise<SearchResults[]> => {
//   try {
//     const db = await getDatabase();
//     const rows = await db.getAllAsync<{
//       id: number;
//       category_name: string;
//       subcategory_name: string;
//       question: string;
//       title: string;
//     }>(
//       `
//       SELECT id, category_name, subcategory_name, question, title
//       FROM question
//       WHERE question LIKE ? OR title LIKE ?;
//     `,
//       [`%${searchTerm}%`, `%${searchTerm}%`]
//     );
//     return rows;
//   } catch (error) {
//     console.error("Error searching questions:", error);
//     throw error;
//   }
// };

// export const getLatestQuestions = async (
//   limit: number = 10
// ): Promise<QuestionType[]> => {
//   try {
//     const db = await getDatabase();
//     const rows = await db.getAllAsync<QuestionType>(
//       `
//       SELECT * FROM question
//       ORDER BY datetime(created_at) DESC
//       LIMIT ?;
//     `,
//       [limit]
//     );
//     return rows;
//   } catch (error) {
//     console.error("Error retrieving latest questions:", error);
//     throw error;
//   }
// };

import * as SQLite from "expo-sqlite";
import { supabase } from "@/utils/supabase";
import Storage from "expo-sqlite/kv-store";
import { router } from "expo-router";
import { questionsDatabaseUpate } from "@/constants/messages";
import { QuestionType, SearchResults } from "./types";
import {
  checkInternetConnection,
  setupConnectivityListener,
} from "./checkNetwork";
import debounce from "lodash.debounce";
import { Alert, Platform } from "react-native";
import handleOpenExternalUrl from "./handleExternalLink";
import Constants from "expo-constants";

let dbInstance: SQLite.SQLiteDatabase | null = null;

const getDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabaseAsync("islam-fragen.db");
    // Set up initial configuration
    await dbInstance.execAsync(`

      PRAGMA journal_mode = WAL;
      PRAGMA foreign_keys = ON;

      CREATE TABLE IF NOT EXISTS category (
        category_name TEXT PRIMARY KEY
      );
      CREATE TABLE IF NOT EXISTS subcategory (
        subcategory_name TEXT PRIMARY KEY
      );

      CREATE TABLE IF NOT EXISTS question (
        id               INTEGER PRIMARY KEY,
        title            TEXT    NOT NULL,
        question         TEXT    UNIQUE NOT NULL,
        answer           TEXT,
        answer_sistani   TEXT,
        answer_khamenei  TEXT,
        category_name    TEXT    REFERENCES category(category_name),
        subcategory_name TEXT    REFERENCES subcategory(subcategory_name),
        created_at       TEXT    DEFAULT CURRENT_TIMESTAMP
      );

    
      CREATE TABLE IF NOT EXISTS favorites (
        id           INTEGER PRIMARY KEY AUTOINCREMENT,
        question_id  INTEGER NOT NULL
                       REFERENCES question(id)
                       ON DELETE CASCADE,
        added_at     TEXT DEFAULT CURRENT_TIMESTAMP
      );
      
    `);
  }
  return dbInstance;
};

// Flag to ensure only one initialization runs at a time.
let isInitializing = false;

/**
 * Wraps initializeDatabase to avoid concurrent executions.
 */
export const safeInitializeDatabase = async () => {
  if (isInitializing) {
    console.log("Database initialization is already running. Skipping.");
    return;
  }
  isInitializing = true;
  try {
    await initializeDatabase();
  } finally {
    isInitializing = false;
  }
};

// Create a debounced version of safeInitializeDatabase (3 seconds delay).
const debouncedSafeInitializeDatabase = debounce(() => {
  safeInitializeDatabase();
}, 3000);

/**
 * Main function to initialize the local database with remote data.
 */
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
      return "https://apps.apple.com/de/app/islam-fragen/id6737857116"; // Replace with your App Store URL
    } else {
      return "https://play.google.com/store/apps/details?id=com.bufib.islamFragen&pcampaignid=web_share";
    }
  };

  // Check if versions in Storage are up to date.
  const checkVersion = async () => {
    try {
      // Data version check for your questions.
      const versionFromStorage = await Storage.getItem("version");
      const versionFromSupabase = await fetchVersionFromSupabase();
      if (versionFromSupabase && versionFromStorage !== versionFromSupabase) {
        await fetchQuestionsFromSupabase();
        await fetchPayPalLink();
        await Storage.setItemSync("version", versionFromSupabase);
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
          "Update Verfügbar",
          "Eine neue version ist im App-Store verfügbar!",
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
      Alert.alert("Fehler", error?.message);
    }
  };

  await checkVersion();
  setupSubscriptions();
};

const fetchVersionFromSupabase = async () => {
  try {
    const { data, error } = await supabase
      .from("version")
      .select("version")
      .single();

    if (error) {
      console.error(error);
      return null;
    }
    return data.version;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// New function: Fetch the app version from Supabase.
// We assume the app_version table contains a row with a field "version".
const fetchAppVersionFromSupabase = async () => {
  try {
    const { data, error } = await supabase
      .from("app_version")
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
      .from("question")
      .select("*");

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
        `DELETE FROM question WHERE id NOT IN (${placeholders});`,
        remoteIds
      );
    } else {
      // If no questions remotely, wipe local table (and cascade favorites)
      await db.runAsync(`DELETE FROM question;`);
    }

    // 3. Bulk upsert inside a single exclusive transaction
    await db.withExclusiveTransactionAsync(async (txn) => {
      const stmt = await txn.prepareAsync(`
        INSERT OR REPLACE INTO question
          (id, title, question, answer, answer_sistani,
           answer_khamenei, category_name, subcategory_name, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
      `);

      try {
        for (const q of questions) {
          await stmt.executeAsync([
            q.id,
            q.title,
            q.question,
            q.answer ?? null,
            q.answer_sistani ?? null,
            q.answer_khamenei ?? null,
            q.category_name,
            q.subcategory_name,
            q.created_at,
          ]);
        }
      } finally {
        await stmt.finalizeAsync();
      }
    });

    // 4. (Optional) Extra safety: remove any orphaned favorites
    await db.execAsync(`
      DELETE FROM favorites
      WHERE question_id NOT IN (SELECT id FROM question);
    `);

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
      Storage.setItemSync("paypal", data.link);
    } else {
      console.warn("No PayPal link found in Supabase.");
    }
  } catch (error) {
    console.error("Unexpected error fetching PayPal link:", error);
  }
};

const setupSubscriptions = () => {
  // Subscribe to changes in the `version` table.
  supabase
    .channel("version")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "version" },
      async (payload) => {
        try {
          console.log("Change received!", payload);
          await initializeDatabase(); // Re-fetch data if version changes.
          router.replace("/(tabs)/home/");
          questionsDatabaseUpate();
        } catch (error) {
          console.error("Error handling Supabase subscription change:", error);
        }
      }
    )
    .subscribe();

  // Subscribe to changes in the `app_version` table.
  supabase
    .channel("app_version")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "app_version" },
      async (payload) => {
        try {
          await initializeDatabase();
        } catch (error) {
          console.error("Error handling Supabase subscription change:", error);
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
          router.replace("/(tabs)/home/");
          questionsDatabaseUpate();
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
      SELECT COUNT(*) as count FROM question;
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
      FROM question q
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
      SELECT DISTINCT subcategory_name FROM question WHERE category_name = ?;
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
      SELECT * FROM question WHERE category_name = ? AND subcategory_name = ? ORDER BY created_at DESC;
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
      SELECT * FROM question
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
      SELECT * FROM question
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
): Promise<SearchResults[]> => {
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
      FROM question
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
    SELECT * FROM question
    ORDER BY created_at DESC
    LIMIT ?;
    `,
    [limit]
  );
};
