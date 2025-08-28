// import { useEffect, useRef, useCallback, useState } from "react";
// import { Alert, Platform } from "react-native";
// import Constants from "expo-constants";
// import Storage from "expo-sqlite/kv-store";
// import debounce from "lodash.debounce";

// import {
//   checkInternetConnection,
//   setupConnectivityListener,
// } from "@/utils/checkNetwork";
// import handleOpenExternalUrl from "@/utils/handleOpenExternalUrl";
// import i18n from "@/utils/i18n";
// import { getQuestionCount } from "@/app/db/queries/questions";
// import syncCalendar from "@/app/db/sync/calendar";
// import syncPayPal from "@/app/db/sync/paypal";
// import syncPrayers from "@/app/db/sync/prayers";
// import syncQuestions from "@/app/db/sync/questions";
// import {
//   fetchVersionFromSupabase,
//   fetchAppVersionFromSupabase,
// } from "@/app/db/sync/versions";
// import { router } from "expo-router";
// import { supabase } from "@/utils/supabase";
// import { databaseUpdate } from "@/constants/messages";
// import { whenDatabaseReady, safeInitializeDatabase } from "@/app/db";

// /**
//  * Manages local DB sync with Supabase.
//  * - Waits for SQLiteProvider onInit (migrations + handle ready)
//  * - Offline fallback: if local questions exist, app can start
//  * - Versioned + per-language sync
//  * - Realtime listeners to re-sync when versions change
//  *
//  * @param language i18n language code (e.g. 'en', 'de')
//  * @returns true when initial sync (or offline fallback) completes
//  */
// export function useDatabaseSync(language: string = i18n.language): boolean {
//   const [isReady, setIsReady] = useState(false);

//   // Debounced re-init used when connectivity returns
//   const debouncedInit = useRef(
//     debounce(() => initializeSafely(), 3000)
//   ).current;

//   const initializeDatabase = useCallback(async () => {
//     // Ensure the DB handle is set and migrations have run (Provider onInit).
//     await whenDatabaseReady();

//     const isOnline = await checkInternetConnection();
//     if (!isOnline) {
//       // If offline but we already have data, allow app to proceed.
//       const questionCount = await getQuestionCount();
//       if (questionCount > 0) {
//         setIsReady(true);
//         return;
//       }
//       // Otherwise, wait for connectivity and retry (debounced to avoid flapping)
//       setupConnectivityListener(() => debouncedInit());
//       return;
//     }

//     const getStoreURL = () =>
//       Platform.OS === "ios"
//         ? "https://apps.apple.com/de/app/islam-fragen/id6737857116"
//         : "https://play.google.com/store/apps/details?id=com.bufib.islamFragen";

//     try {
//       // --- FETCH REMOTE DB VERSION ---
//       const storedVersion = await Storage.getItemAsync("database_version");
//       const remoteVersion = await fetchVersionFromSupabase();

//       if (remoteVersion) {
//         const versionChanged = remoteVersion !== storedVersion;
//         const langVersionKey = `synced_${language}_${remoteVersion}`;
//         const alreadySyncedLang = await Storage.getItemAsync(langVersionKey);

//         if (versionChanged) {
//           // New DB version → sync all relevant data
//           await Promise.allSettled([
//             syncQuestions(language),
//             syncCalendar(language),
//             syncPrayers(language),
//             syncPayPal(),
//           ]);
//           await Storage.setItemAsync("database_version", remoteVersion);
//           await Storage.setItemAsync(langVersionKey, "true");
//         } else if (!alreadySyncedLang) {
//           // Same DB version, but first time for this language -> sync language-specific data
//           await Promise.allSettled([
//             syncQuestions(language),
//             syncCalendar(language),
//             syncPrayers(language),
//           ]);
//           await Storage.setItemAsync(langVersionKey, "true");
//         }
//       }

//       // --- APP VERSION CHECK ---
//       const currentAppVersion = Constants.expoConfig?.version;
//       const remoteAppVersion = await fetchAppVersionFromSupabase();
//       if (
//         currentAppVersion &&
//         remoteAppVersion &&
//         currentAppVersion !== remoteAppVersion
//       ) {
//         Alert.alert(
//           i18n.t("updateAvailable"),
//           i18n.t("newAppVersionAvailable"),
//           [
//             {
//               text: "Update",
//               onPress: () => handleOpenExternalUrl(getStoreURL()),
//             },
//             { text: "Later", style: "cancel" },
//           ]
//         );
//       }
//     } catch (err: any) {
//       console.error("Error during sync:", err);
//       Alert.alert(i18n.t("error"), err?.message ?? String(err));
//     } finally {
//       setIsReady(true);
//     }
//   }, [debouncedInit, language]);

//   // Global guard so init never runs concurrently (across remounts, listeners, etc.)
//   const initializeSafely = useCallback(async () => {
//     await safeInitializeDatabase(initializeDatabase);
//   }, [initializeDatabase]);

//   // Kick off initial pass
//   useEffect(() => {
//     initializeSafely();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [initializeSafely]);

//   // Realtime: re-sync when versions or paypal rows change
//   useEffect(() => {
//     const handleVersionChange = async (payload: any) => {
//       const { new: n, old: o } = payload;

//       // Database version change → full re-init & user feedback
//       if (n.database_version !== o.database_version) {
//         await initializeSafely();
//         router.replace("/(tabs)/home");
//         databaseUpdate();
//       }

//       // App version change → allow hook to handle alert flow again
//       if (n.app_version !== o.app_version) {
//         await initializeSafely();
//       }
//     };

//     const verChannel = supabase
//       .channel("versions")
//       .on(
//         "postgres_changes",
//         { event: "UPDATE", schema: "public", table: "versions" },
//         handleVersionChange
//       )
//       .subscribe();

//     const ppChannel = supabase
//       .channel("paypal")
//       .on(
//         "postgres_changes",
//         { event: "*", schema: "public", table: "paypal" },
//         async () => {
//           // Only PayPal data → keep it light
//           await syncPayPal();
//           router.replace("/(tabs)/home");
//           databaseUpdate();
//         }
//       )
//       .subscribe();

//     return () => {
//       supabase.removeChannel(verChannel).catch(console.error);
//       supabase.removeChannel(ppChannel).catch(console.error);
//     };
//   }, [initializeSafely, language]);

//   return isReady;
// }

// hooks/useDatabaseSync.ts
import { useEffect, useRef, useCallback, useState } from "react";
import { Alert, Platform } from "react-native";
import Constants from "expo-constants";
import Storage from "expo-sqlite/kv-store";
import debounce from "lodash.debounce";

import {
  checkInternetConnection,
  setupConnectivityListener,
} from "@/utils/checkNetwork";
import handleOpenExternalUrl from "@/utils/handleOpenExternalUrl";
import i18n from "@/utils/i18n";

import { getQuestionCount } from "@/db/queries/questions";
import syncCalendar from "@/db/sync/calendar";
import syncPayPal from "@/db/sync/paypal";
import syncPrayers from "@/db/sync/prayers";
import syncQuestions from "@/db/sync/questions";
import syncQuran from "@/db/sync/quran";
import {
  fetchVersionFromSupabase,
  fetchAppVersionFromSupabase,
} from "@/db/sync/versions";
import { router } from "expo-router";
import { supabase } from "@/utils/supabase";
import { databaseUpdate } from "@/constants/messages";
import { whenDatabaseReady, safeInitializeDatabase } from "@/db";

/**
 * Manages local DB sync with Supabase.
 * - Waits for SQLiteProvider onInit (migrations + handle ready)
 * - Offline fallback: if local questions exist, app can start
 * - Per-dataset, per-language versions (questions, quran, calendar, dua)
 * - Realtime listeners to re-sync when any dataset version changes
 *
 * @param language i18n language code (e.g. 'en', 'de')
 * @returns true when initial sync (or offline fallback) completes
 */
export function useDatabaseSync(language: string = i18n.language): boolean {
  const [isReady, setIsReady] = useState(false);

  // Debounced re-init used when connectivity returns
  const debouncedInit = useRef(
    debounce(() => initializeSafely(), 3000)
  ).current;

  const initializeDatabase = useCallback(async () => {
    // Ensure the DB handle is set and migrations have run (Provider onInit).
    await whenDatabaseReady();

    const isOnline = await checkInternetConnection();
    if (!isOnline) {
      // If offline but we already have questions, allow app to proceed.
      const questionCount = await getQuestionCount();
      if (questionCount > 0) {
        setIsReady(true);
        return;
      }
      // Otherwise, wait for connectivity and retry (debounced to avoid flapping)
      setupConnectivityListener(() => debouncedInit());
      return;
    }

    const getStoreURL = () =>
      Platform.OS === "ios"
        ? "https://apps.apple.com/de/app/islam-fragen/id6737857116"
        : "https://play.google.com/store/apps/details?id=com.bufib.islamFragen";

    try {
      // --- FETCH REMOTE DATASET VERSIONS ---
      // Expected shape:
      // {
      //   question_data_version: string,
      //   app_version: string,
      //   quran_data_version?: string,
      //   dua_data_version?: string,
      //   calendar_data_version?: string
      // }
      const remote = await fetchVersionFromSupabase();

      if (remote) {
        const {
          question_data_version: questionsVer,
          quran_data_version: quranVer,
          calendar_data_version: calendarVer,
          dua_data_version: duaVer,
        } = remote;

        // helper to sync one dataset with version + language awareness
        const syncDataset = async (
          storedVersionKey: string, // e.g. "questions_version"
          langMarkerPrefix: string, // e.g. "synced_questions"
          remoteVersion: string | undefined | null,
          runSync: () => Promise<any>, // sync function to run
          languageScoped: boolean = true // most are language-scoped
        ) => {
          if (!remoteVersion) return false; // nothing to do if not provided

          const storedVersion = await Storage.getItemAsync(storedVersionKey);
          const versionChanged = remoteVersion !== storedVersion;

          const langKey = languageScoped
            ? `${langMarkerPrefix}_${language}_${remoteVersion}`
            : `${langMarkerPrefix}_${remoteVersion}`;

          const alreadySyncedLang = await Storage.getItemAsync(langKey);

          if (versionChanged) {
            // New dataset version → full sync for this dataset
            await runSync();
            await Storage.setItemAsync(storedVersionKey, remoteVersion);
            await Storage.setItemAsync(langKey, "true");
            return true;
          } else if (!alreadySyncedLang) {
            // Same dataset version, but first time for this language
            await runSync();
            await Storage.setItemAsync(langKey, "true");
            return true;
          }
          return false;
        };

        // Run per-dataset syncs (in parallel)
        const results = await Promise.allSettled([
          syncDataset(
            "questions_version",
            "synced_questions",
            questionsVer,
            () => syncQuestions(language),
            true
          ),
          syncDataset(
            "quran_version",
            "synced_quran",
            quranVer,
            () => syncQuran(language),
            true // treat Quran as language-scoped (you can set false if you prefer)
          ),
          syncDataset(
            "calendar_version",
            "synced_calendar",
            calendarVer,
            () => syncCalendar(language),
            true
          ),
          syncDataset(
            "dua_version",
            "synced_dua",
            duaVer,
            () => syncPrayers(language),
            true
          ),
        ]);

        // Keep PayPal up-to-date during normal runs as well
        await syncPayPal();
      }

      // --- APP VERSION CHECK ---
      const currentAppVersion = Constants.expoConfig?.version;
      const remoteAppVersion = await fetchAppVersionFromSupabase();
      if (
        currentAppVersion &&
        remoteAppVersion &&
        currentAppVersion !== remoteAppVersion
      ) {
        Alert.alert(
          i18n.t("updateAvailable"),
          i18n.t("newAppVersionAvailable"),
          [
            {
              text: "Update",
              onPress: () => handleOpenExternalUrl(getStoreURL()),
            },
            { text: "Later", style: "cancel" },
          ]
        );
      }
    } catch (err: any) {
      console.error("Error during sync:", err);
      Alert.alert(i18n.t("error"), err?.message ?? String(err));
    } finally {
      setIsReady(true);
    }
  }, [debouncedInit, language]);

  // Global guard so init never runs concurrently (across remounts, listeners, etc.)
  const initializeSafely = useCallback(async () => {
    await safeInitializeDatabase(initializeDatabase);
  }, [initializeDatabase]);

  // Kick off initial pass
  useEffect(() => {
    initializeSafely();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initializeSafely]);

  // Realtime: re-sync when ANY dataset version or paypal rows change
  useEffect(() => {
    const handleVersionChange = async (payload: any) => {
      const { new: n, old: o } = payload;
      const questionsChanged =
        n?.question_data_version !== o?.question_data_version;
      const quranChanged = n?.quran_data_version !== o?.quran_data_version;
      const calendarChanged =
        n?.calendar_data_version !== o?.calendar_data_version;
      const duaChanged = n?.dua_data_version !== o?.dua_data_version;

      if (questionsChanged || quranChanged || calendarChanged || duaChanged) {
        await initializeSafely();
        router.replace("/(tabs)/home");
        databaseUpdate();
      }

      if (n?.app_version !== o?.app_version) {
        await initializeSafely();
      }
    };

    const verChannel = supabase
      .channel("versions")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "versions" },
        handleVersionChange
      )
      .subscribe();

    const ppChannel = supabase
      .channel("paypal")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "paypal" },
        async () => {
          await syncPayPal();
          router.replace("/(tabs)/home");
          databaseUpdate();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(verChannel).catch(console.error);
      supabase.removeChannel(ppChannel).catch(console.error);
    };
  }, [initializeSafely, language]);

  return isReady;
}
