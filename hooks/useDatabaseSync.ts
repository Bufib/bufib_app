// //! Funktioniert

// import { useEffect, useRef, useCallback, useState } from "react";
// import { Alert, Platform } from "react-native";
// import Constants from "expo-constants";

// import debounce from "lodash.debounce";

// import {
//   checkInternetConnection,
//   setupConnectivityListener,
// } from "@/utils/checkNetwork";
// import handleOpenExternalUrl from "@/utils/handleOpenExternalUrl";
// import i18n from "@/utils/i18n";

// import { getQuestionCount } from "@/db/queries/questions";
// import syncCalendar from "@/db/sync/calendar";
// import syncPayPal from "@/db/sync/paypal";
// import syncPrayers from "@/db/sync/prayers";
// import syncQuestions from "@/db/sync/questions";
// import syncQuran from "@/db/sync/quran";
// import {
//   fetchVersionFromSupabase,
//   fetchAppVersionFromSupabase,
// } from "@/db/sync/versions";
// import { router } from "expo-router";
// import { supabase } from "@/utils/supabase";
// import { databaseUpdate } from "@/constants/messages";
// import { whenDatabaseReady, safeInitializeDatabase } from "@/db";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// /**
//  * Manages local DB sync with Supabase.
//  * - Waits for SQLiteProvider onInit (migrations + handle ready)
//  * - Offline fallback: if local questions exist, app can start
//  * - Per-dataset, per-language versions (questions, quran, calendar, prayer)
//  * - Realtime listeners to re-sync when any dataset version changes
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
//       // If offline but we already have questions, allow app to proceed.
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
//       // --- FETCH REMOTE DATASET VERSIONS ---
//       // Expected shape:
//       // {
//       //   question_data_version: string,
//       //   app_version: string,
//       //   quran_data_version?: string,
//       //   prayer_data_version?: string,
//       //   calendar_data_version?: string
//       // }
//       const remote = await fetchVersionFromSupabase();

//       if (remote) {
//         const {
//           question_data_version: questionsVer,
//           quran_data_version: quranVer,
//           calendar_data_version: calendarVer,
//           prayer_data_version: prayerVer,
//         } = remote;

//         // helper to sync one dataset with version + language awareness
//         const syncDataset = async (
//           storedVersionKey: string, // e.g. "questions_version"
//           langMarkerPrefix: string, // e.g. "synced_questions"
//           remoteVersion: string | undefined | null,
//           runSync: () => Promise<any>, // sync function to run
//           languageScoped: boolean = true // most are language-scoped
//         ) => {
//           if (!remoteVersion) return false; // nothing to do if not provided

//           const storedVersion = await AsyncStorage.getItem(storedVersionKey);
//           const versionChanged = remoteVersion !== storedVersion;

//           const langKey = languageScoped
//             ? `${langMarkerPrefix}_${language}_${remoteVersion}`
//             : `${langMarkerPrefix}_${remoteVersion}`;

//           const alreadySyncedLang = await AsyncStorage.getItem(langKey);

//           if (versionChanged) {
//             // New dataset version → full sync for this dataset
//             await runSync();
//             await AsyncStorage.setItem(storedVersionKey, remoteVersion);
//             await AsyncStorage.setItem(langKey, "true");
//             return true;
//           } else if (!alreadySyncedLang) {
//             // Same dataset version, but first time for this language
//             await runSync();
//             await AsyncStorage.setItem(langKey, "true");
//             return true;
//           }
//           return false;
//         };

//         // // Run per-dataset syncs (in parallel)
//         // const results = await Promise.allSettled([
//         //   syncDataset(
//         //     "questions_version",
//         //     "synced_questions",
//         //     questionsVer,
//         //     () => syncQuestions(language),
//         //     true
//         //   ),
//         //   syncDataset(
//         //     "quran_version",
//         //     "synced_quran",
//         //     quranVer,
//         //     () => syncQuran(language),
//         //     true // treat Quran as language-scoped (you can set false if you prefer)
//         //   ),
//         //   syncDataset(
//         //     "calendar_version",
//         //     "synced_calendar",
//         //     calendarVer,
//         //     () => syncCalendar(language),
//         //     true
//         //   ),
//         //   syncDataset(
//         //     "dua_version",
//         //     "synced_prayers",
//         //     prayerVer,
//         //     () => syncPrayers(language),
//         //     true
//         //   ),
//         // ]);

//         // useDatabaseSync.ts — run sequentially to avoid lock contention
//         await syncDataset(
//           "question_data_version",
//           "synced_questions",
//           questionsVer,
//           () => syncQuestions(),
//           true
//         );
//         await syncDataset(
//           "quran_data_version",
//           "synced_quran",
//           quranVer,
//           () => syncQuran(),
//           true
//         );
//         await syncDataset(
//           "calendar_data_version",
//           "synced_calendar",
//           calendarVer,
//           () => syncCalendar(),
//           true
//         );
//         await syncDataset(
//           "prayer_data_version",
//           "synced_prayers",
//           prayerVer,
//           () => syncPrayers(),
//           true
//         );

//         // Keep PayPal up-to-date during normal runs as well
//         await syncPayPal();
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

//   // Realtime: re-sync when ANY dataset version or paypal rows change
//   useEffect(() => {
//     const handleVersionChange = async (payload: any) => {
//       const { new: n, old: o } = payload;
//       const questionsChanged =
//         n?.question_data_version !== o?.question_data_version;
//       const quranChanged = n?.quran_data_version !== o?.quran_data_version;
//       const calendarChanged =
//         n?.calendar_data_version !== o?.calendar_data_version;
//       const prayerChanged = n?.prayer_data_version !== o?.prayer_data_version;

//       if (questionsChanged || quranChanged || calendarChanged || prayerChanged) {
//         await initializeSafely();
//         router.replace("/(tabs)/home");
//         databaseUpdate();
//       }

//       if (n?.app_version !== o?.app_version) {
//         await initializeSafely();
//       }
//     };

//     const verChannel = supabase
//       .channel("versions")
//       .on(
//         "postgres_changes",
//         { event: "*", schema: "public", table: "versions" },
//         handleVersionChange
//       )
//       .subscribe();

//     const ppChannel = supabase
//       .channel("paypal")
//       .on(
//         "postgres_changes",
//         { event: "*", schema: "public", table: "paypal" },
//         async () => {
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

//! Neu und aufgeräumt aber ungetestet

import { useEffect, useRef, useCallback, useState, useMemo } from "react";
import { Alert, Platform } from "react-native";
import Constants from "expo-constants";
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
import { router, usePathname } from "expo-router";
import { supabase } from "@/utils/supabase";
import { databaseUpdate } from "@/constants/messages";
import { whenDatabaseReady, safeInitializeDatabase } from "@/db";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Manages local DB sync with Supabase.
 * - Waits for SQLiteProvider onInit (migrations + handle ready)
 * - Offline fallback: if local questions exist, app can start
 * - Per-dataset, per-language versions (questions, quran, calendar, prayer)
 * - Realtime listeners to re-sync when any dataset version changes
 *
 * @param language i18n language code (e.g. 'en', 'de')
 * @returns true when initial sync (or offline fallback) completes
 */
export function useDatabaseSync(language: string = i18n.language): boolean {
  const [isReady, setIsReady] = useState(false);

  // --- Keep a ref to the latest initializeDatabase so initializeSafely never goes stale ---
  const initRef = useRef<() => Promise<void>>(async () => {});

  // --- Connectivity unsubscribe holder ---
  const connectivityUnsubRef = useRef<null | (() => void)>(null);

  const pathname = usePathname();
  console.log(pathname);
  // --- initializeSafely uses a ref (no dependency cycles) ---
  const initializeSafely = useCallback(async () => {
    await safeInitializeDatabase(initRef.current);
  }, []);

  // --- Debounced init that tracks the latest initializeSafely ---
  const debouncedInit = useMemo(
    () =>
      debounce(() => {
        void initializeSafely();
      }, 3000),
    [initializeSafely]
  );

  // Cancel any pending debounce on unmount
  useEffect(() => {
    return () => {
      debouncedInit.cancel();
    };
  }, [debouncedInit]);

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
      // Clear any previous listener, then set a new one
      connectivityUnsubRef.current?.();
      connectivityUnsubRef.current = setupConnectivityListener(() => {
        debouncedInit();
      });
      return;
    }

    // We are online: ensure we don't keep a dangling listener
    connectivityUnsubRef.current?.();
    connectivityUnsubRef.current = null;

    const getStoreURL = () =>
      Platform.OS === "ios"
        ? "https://apps.apple.com/de/app/islam-fragen/id6737857116"
        : "https://play.google.com/store/apps/details?id=com.bufib.islamFragen";

    try {
      const remote = await fetchVersionFromSupabase();

      if (remote) {
        const {
          question_data_version: questionsVer,
          quran_data_version: quranVer,
          calendar_data_version: calendarVer,
          prayer_data_version: prayerVer,
        } = remote;

        // helper to sync one dataset with version + language awareness
        const syncDataset = async (
          storedVersionKey: string, // e.g. "question_data_version"
          langMarkerPrefix: string, // e.g. "synced_questions"
          remoteVersion: string | undefined | null,
          runSync: () => Promise<any>, // sync function to run
          languageScoped: boolean = true // most are language-scoped
        ) => {
          if (!remoteVersion) return false; // nothing to do if not provided

          const storedVersion = await AsyncStorage.getItem(storedVersionKey);
          const versionChanged = remoteVersion !== storedVersion;

          const langKey = languageScoped
            ? `${langMarkerPrefix}_${language}_${remoteVersion}`
            : `${langMarkerPrefix}_${remoteVersion}`;

          const alreadySyncedLang = await AsyncStorage.getItem(langKey);

          if (versionChanged) {
            // New dataset version → full sync for this dataset
            await runSync();
            await AsyncStorage.setItem(storedVersionKey, remoteVersion);
            await AsyncStorage.setItem(langKey, "true");
            return true;
          } else if (!alreadySyncedLang) {
            // Same dataset version, but first time for this language
            await runSync();
            await AsyncStorage.setItem(langKey, "true");
            return true;
          }
          return false;
        };

        // Run sequentially to avoid SQLite lock contention
        await syncDataset(
          "question_data_version",
          "synced_questions",
          questionsVer,
          () => syncQuestions(),
          true
        );
        await syncDataset(
          "quran_data_version",
          "synced_quran",
          quranVer,
          () => syncQuran(),
          true
        );
        await syncDataset(
          "calendar_data_version",
          "synced_calendar",
          calendarVer,
          () => syncCalendar(),
          true
        );
        await syncDataset(
          "prayer_data_version",
          "synced_prayers",
          prayerVer,
          () => syncPrayers(),
          true
        );

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

  // Keep the ref pointing to the latest initializeDatabase
  useEffect(() => {
    initRef.current = initializeDatabase;
  }, [initializeDatabase]);

  // Kick off initial pass
  useEffect(() => {
    void initializeSafely();
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

      const prayerChanged = n?.prayer_data_version !== o?.prayer_data_version;

      if (
        questionsChanged ||
        quranChanged ||
        calendarChanged ||
        prayerChanged
      ) {
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
      // explicit void so React never sees a promise
      void supabase.removeChannel(verChannel);
      void supabase.removeChannel(ppChannel);
      // also clean any connectivity listener if present
      connectivityUnsubRef.current?.();
      connectivityUnsubRef.current = null;
    };
  }, [initializeSafely, language]);

  return isReady;
}
