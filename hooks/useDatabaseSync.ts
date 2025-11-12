// ! Funktioniert with lang

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

//! Without lang last that worked
// // src/hooks/useDatabaseSync.ts
// import { useEffect, useRef, useCallback, useState, useMemo } from "react";
// import { Alert, Platform } from "react-native";
// import Constants from "expo-constants";
// import debounce from "lodash.debounce";
// import i18n from "@/utils/i18n";
// import {
//   checkInternetConnection,
//   setupConnectivityListener,
// } from "@/utils/checkNetwork";
// import handleOpenExternalUrl from "@/utils/handleOpenExternalUrl";
// import { getQuestionCount } from "@/db/queries/questions";
// import { whenDatabaseReady, safeInitializeDatabase } from "@/db";
// import { runDatabaseSync } from "@/db/runDatabaseSync";
// import { fetchAppVersionFromSupabase } from "@/db/sync/versions";
// import { supabase } from "@/utils/supabase";
// import {
//   databaseUpdateCalendar,
//   databaseUpdatePrayer,
//   databaseUpdatePaypal,
//   databaseUpdateQuestions,
//   databaseUpdateQuran,
// } from "@/constants/messages";
// import syncPayPal from "@/db/sync/paypal"; // kept for realtime paypal handler
// import { router } from "expo-router";

// /**
//  * Manages local DB sync with Supabase.
//  * - Waits for SQLiteProvider onInit (migrations + handle ready)
//  * - Offline fallback: if local questions exist, app can start
//  * - Version-driven per-dataset sync (questions, quran, calendar, prayer) + PayPal
//  * - Realtime listeners (versions & PayPal) with event="*"
//  *
//  * @returns true when initial sync (or offline fallback) completes
//  */
// export function useDatabaseSync(): boolean {
//   const [isReady, setIsReady] = useState(false);

//   // Keep a ref to the latest initializeDatabase so initializeSafely never goes stale.
//   const initRef = useRef<() => Promise<void>>(async () => {});

//   // Connectivity unsubscribe holder.
//   const connectivityUnsubRef = useRef<null | (() => void)>(null);

//   // initializeSafely uses the ref (no dependency cycles).
//   const initializeSafely = useCallback(async () => {
//     await safeInitializeDatabase(initRef.current);
//   }, []);

//   // Debounced init for connectivity flaps.
//   const debouncedInit = useMemo(
//     () =>
//       debounce(() => {
//         void initializeSafely();
//       }, 3000),
//     [initializeSafely]
//   );

//   // Cancel pending debounce on unmount.
//   useEffect(() => {
//     return () => {
//       debouncedInit.cancel();
//     };
//   }, [debouncedInit]);

//   const initializeDatabase = useCallback(async () => {
//     // Ensure the DB handle is set before any local reads (offline fallback).
//     await whenDatabaseReady();

//     const isOnline = await checkInternetConnection();
//     if (!isOnline) {
//       // Offline: if we have any questions locally, proceed.
//       const questionCount = await getQuestionCount();
//       if (questionCount > 0) {
//         setIsReady(true);
//         return;
//       }
//       // Otherwise wait for connectivity and retry (debounced).
//       connectivityUnsubRef.current?.();
//       connectivityUnsubRef.current = setupConnectivityListener(() => {
//         debouncedInit();
//       });
//       return;
//     }

//     // We are online: clear any dangling connectivity listener.
//     connectivityUnsubRef.current?.();
//     connectivityUnsubRef.current = null;

//     const getStoreURL = () =>
//       Platform.OS === "ios"
//         ? "https://apps.apple.com/de/app/islam-fragen/id6737857116"
//         : "https://play.google.com/store/apps/details?id=com.bufib.islamFragen";

//     try {
//       // Core dataset sync (questions, quran, calendar, prayers) + PayPal.
//       await runDatabaseSync();
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
//   }, [debouncedInit]);

//   // Keep the ref pointing to the latest initializeDatabase.
//   useEffect(() => {
//     initRef.current = initializeDatabase;
//   }, [initializeDatabase]);

//   // Kick off initial pass.
//   useEffect(() => {
//     void initializeSafely();
//   }, [initializeSafely]);

//   // Realtime: stay with event="*" for both tables and behavior identical to your snippet.
//   useEffect(() => {
//     const handleVersionChange = async (payload: any) => {
//       const { new: n, old: o } = payload;

//       const questionsChanged =
//         n?.question_data_version !== o?.question_data_version;
//       const quranChanged = n?.quran_data_version !== o?.quran_data_version;
//       const calendarChanged =
//         n?.calendar_data_version !== o?.calendar_data_version;
//       const prayerChanged = n?.prayer_data_version !== o?.prayer_data_version;

//       if (
//         questionsChanged ||
//         quranChanged ||
//         calendarChanged ||
//         prayerChanged
//       ) {
//         await initializeSafely();

//           router.replace("/(tabs)/home");

//         questionsChanged && databaseUpdateQuestions();
//         quranChanged && databaseUpdateQuran();
//         calendarChanged && databaseUpdateCalendar();
//         prayerChanged && databaseUpdatePrayer();
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
//           // Keep PayPal handling exactly as you had it.
//           await syncPayPal();

//             router.replace("/(tabs)/home");

//           databaseUpdatePaypal();
//         }
//       )
//       .subscribe();

//     return () => {
//       void supabase.removeChannel(verChannel);
//       void supabase.removeChannel(ppChannel);
//       connectivityUnsubRef.current?.();
//       connectivityUnsubRef.current = null;
//     };
//   }, [initializeSafely]);

//   return isReady;
// }

// src/hooks/useDatabaseSync.ts

import { useEffect, useRef, useCallback, useState, useMemo } from "react";
import { Alert, Platform } from "react-native";
import Constants from "expo-constants";
import debounce from "lodash.debounce";
import {
  checkInternetConnection,
  setupConnectivityListener,
} from "@/utils/checkNetwork";
import handleOpenExternalUrl from "@/utils/handleOpenExternalUrl";
import { getQuestionCount } from "@/db/queries/questions";
import { whenDatabaseReady, safeInitializeDatabase } from "@/db";
import { runDatabaseSync } from "@/db/runDatabaseSync";
import { fetchAppVersionFromSupabase } from "@/db/sync/versions";
import { supabase } from "@/utils/supabase";
import {
  databaseUpdateCalendar,
  databaseUpdatePrayer,
  databaseUpdatePaypal,
  databaseUpdateQuestions,
  databaseUpdateQuran,
} from "@/constants/messages";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

/** Robust version comparison helper (null/undefined/number-safe). */
function changed(newVal: any, oldVal: any): boolean {
  const normalize = (val: any): string =>
    val === null || val === undefined ? "" : String(val);
  console.log(normalize(newVal) !== normalize(oldVal));
  return normalize(newVal) !== normalize(oldVal);
}

/** Main hook */
export function useDatabaseSync(): boolean {
  const [isReady, setIsReady] = useState(false);
  const [isInitialSyncComplete, setIsInitialSyncComplete] = useState(false);
  const { t } = useTranslation();
  // Mount + concurrency guards
  const isMountedRef = useRef(true);
  const isSyncingRef = useRef(false);
  const listenersSetupRef = useRef(false);
  // latest initializeDatabase for safeInitializeDatabase
  const initRef = useRef<() => Promise<void>>(async () => {});

  // Connectivity unsubscribe
  const connectivityUnsubRef = useRef<null | (() => void)>(null);

  // Supabase channels
  const verChannelRef = useRef<any>(null);

  // Guarded navigation to home

  const goHomeIfNeeded = useCallback(() => {
    if (!isMountedRef.current) return;
    // if (pathname !== "/home") {
      router.replace("/(tabs)/home");
    // }
  }, []);

  // Single-flight initialize wrapper
  const initializeSafely = useCallback(async () => {
    if (!isMountedRef.current) return;
    if (isSyncingRef.current) return; // coalesce
    await safeInitializeDatabase(initRef.current);
  }, []);

  // Debounce only the connectivity-triggered init (optional)
  const debouncedInit = useMemo(
    () =>
      debounce(() => {
        if (isMountedRef.current && !isSyncingRef.current) {
          void initializeSafely();
        }
      }, 3000),
    [initializeSafely]
  );

  // Connectivity cleanup
  const cleanupConnectivityListener = useCallback(() => {
    if (connectivityUnsubRef.current) {
      connectivityUnsubRef.current();
      connectivityUnsubRef.current = null;
    }
  }, []);

  // Can proceed offline?
  const canProceedOffline = async (): Promise<boolean> => {
    try {
      const questionCount = await getQuestionCount();
      return questionCount > 0;
    } catch {
      return false;
    }
  };

  const initializeDatabase = useCallback(async () => {
    if (!isMountedRef.current) return;

    isSyncingRef.current = true;
    try {
      // Wait for SQLite handle
      await whenDatabaseReady();

      const isOnline = await checkInternetConnection();

      // -------- OFFLINE PATH: proceed only if cached questions exist
      if (!isOnline) {
        const canProceed = await canProceedOffline();
        if (canProceed) {
          if (isMountedRef.current) {
            setIsReady(true); // show cached
          }
          return;
        }
        // Wait for connectivity and retry init (debounced)
        cleanupConnectivityListener();
        connectivityUnsubRef.current = setupConnectivityListener(() => {
          debouncedInit();
        });
        return;
      }

      // -------- ONLINE PATH: strictly gate on fully successful sync
      cleanupConnectivityListener();

      const getStoreURL = () =>
        Platform.OS === "ios"
          ? "https://apps.apple.com/de/app/islam-fragen/id6737857116"
          : "https://play.google.com/store/apps/details?id=com.bufib.islamFragen";

      let retries = 3;
      let lastError: any = null;

      while (retries > 0 && isMountedRef.current) {
        try {
          const syncResult = await runDatabaseSync();

          const hasErrors =
            !!syncResult &&
            syncResult.errors &&
            Object.keys(syncResult.errors).length > 0;

          if (hasErrors) {
            lastError = new Error(
              "Initial sync unsuccessful: " +
                Object.keys(syncResult.errors).join(", ")
            );
            throw lastError;
          }

          // Force-update prompt (no cooldown)
          const currentAppVersion = Constants.expoConfig?.version;
          const remoteAppVersion = await fetchAppVersionFromSupabase();
          if (
            currentAppVersion &&
            remoteAppVersion &&
            currentAppVersion !== remoteAppVersion
          ) {
            Alert.alert(t("updateAvailable"), t("newAppVersionAvailable"), [
              {
                text: t("update"),
                onPress: () => handleOpenExternalUrl(getStoreURL()),
              },
            ]);
          }

          if (isMountedRef.current) {
            setIsReady(true);
            setIsInitialSyncComplete(true); // attach realtime after success
          }
          return; // success → exit
        } catch (e) {
          lastError = e;
          retries--;
          if (retries > 0 && isMountedRef.current) {
            await new Promise((r) => setTimeout(r, (3 - retries) * 2000));
          }
        }
      }

      if (!isMountedRef.current) return;

      // Still online but sync never succeeded → block UI; let user retry.
      Alert.alert(
        t("error"),
        (lastError && (lastError.message || String(lastError))) ||
          t("syncFailedTryAgain"),
        [
          {
            text: t("retry"),
            onPress: () => void initializeSafely(),
          },
        ]
      );
      return;
    } catch (err: any) {
      console.error("Critical error during initialization:", err);
      if (!isMountedRef.current) return;

      // If offline cache exists, allow; otherwise block
      const canProceed = await canProceedOffline();
      if (canProceed) {
        if (isMountedRef.current) {
          setIsReady(true);
        }
      } else {
        Alert.alert(t("error"), err?.message ?? String(err), [
          {
            text: t("retry"),
            onPress: () => void initializeSafely(),
          },
        ]);
      }
    } finally {
      isSyncingRef.current = false;
    }
  }, [debouncedInit, initializeSafely, cleanupConnectivityListener, t]);

  // Keep latest initializeDatabase in ref for safeInitializeDatabase
  useEffect(() => {
    initRef.current = initializeDatabase;
  }, [initializeDatabase]);

  // Kick off initial pass
  useEffect(() => {
    void initializeSafely();
  }, [initializeSafely]);

  // Realtime: versions only (NO separate PayPal table channel)
  useEffect(() => {
    if (!isInitialSyncComplete || listenersSetupRef.current) return;
    listenersSetupRef.current = true;

    const handleVersionChange = async (payload: any) => {
      if (isSyncingRef.current || !isMountedRef.current) return;

      const { new: n, old: o } = payload;

      const questionsChanged = changed(
        n?.question_data_version,
        o?.question_data_version
      );
      const quranChanged = changed(
        n?.quran_data_version,
        o?.quran_data_version
      );
      const calendarChanged = changed(
        n?.calendar_data_version,
        o?.calendar_data_version
      );
      const prayerChanged = changed(
        n?.prayer_data_version,
        o?.prayer_data_version
      );
      const paypalChanged = changed(
        n?.paypal_data_version,
        o?.paypal_data_version
      ); // <- NEW
      const appVersionChanged = changed(n?.app_version, o?.app_version);

      console.log(
        payload.eventType,
        Object.keys(payload.old || {}), // likely only ["id"]
        Object.keys(payload.new || {}) // full set
      );

      if (
        questionsChanged ||
        quranChanged ||
        calendarChanged ||
        prayerChanged ||
        paypalChanged
      ) {
        console.log(
          questionsChanged,
          quranChanged,
          calendarChanged,
          prayerChanged,
          paypalChanged
        );
        await initializeSafely();
        goHomeIfNeeded();
        questionsChanged && databaseUpdateQuestions();
        quranChanged && databaseUpdateQuran();
        calendarChanged && databaseUpdateCalendar();
        prayerChanged && databaseUpdatePrayer();
        paypalChanged && databaseUpdatePaypal(); // <- NEW
      }

      if (appVersionChanged) {
        await initializeSafely();
      }
    };

    verChannelRef.current = supabase
      .channel("versions")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "versions" },
        handleVersionChange
      )
      .subscribe();

    return () => {
      listenersSetupRef.current = false;
      if (verChannelRef.current) {
        void supabase.removeChannel(verChannelRef.current);
        verChannelRef.current = null;
      }
    };
  }, [isInitialSyncComplete, initializeSafely, goHomeIfNeeded]);

  // Mount / unmount cleanup
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      debouncedInit.cancel();
      cleanupConnectivityListener();

      if (verChannelRef.current) {
        void supabase.removeChannel(verChannelRef.current);
        verChannelRef.current = null;
      }

      listenersSetupRef.current = false;
      isSyncingRef.current = false;
    };
  }, [debouncedInit, cleanupConnectivityListener]);

  return isReady;
}
