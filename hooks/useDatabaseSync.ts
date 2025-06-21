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
// import { fetchVersionFromSupabase, fetchAppVersionFromSupabase } from "@/app/db/sync/versions";
// import { router } from "expo-router";
// import { supabase } from "@/utils/supabase";
// import { databaseUpdate } from "@/constants/messages";

// /**
//  * Custom hook to manage local database synchronization with Supabase.
//  * - Handles offline fallback and retries on reconnect.
//  * - Checks for data and app version updates.
//  * @returns {boolean} true when the database is initialized (either offline or online).
//  */
// export function useDatabaseSync(language: string): boolean {
//   const isInitializing = useRef(false);
//   const [isReady, setIsReady] = useState(false);

//   // Persist a debounced initializer across renders
//   const debouncedInit = useRef(
//     debounce(() => {
//       safeInitialize();
//     }, 3000)
//   ).current;

//   /**
//    * Core initialization logic: offline fallback, data sync, version checks.
//    */
//   const initializeDatabase = useCallback(async () => {
//     const isOnline = await checkInternetConnection();

//     if (!isOnline) {
//       const questionCount = await getQuestionCount();
//       if (questionCount > 0) {
//         console.log("Offline: Local data found. Database is ready.");
//         setIsReady(true);
//         return;
//       }
//       console.warn("Offline: No local data. Awaiting connection...");
//       setupConnectivityListener(() => {
//         console.log("Connection restored. Re-initializing...");
//         debouncedInit();
//       });
//       return;
//     }

//     const getStoreURL = () =>
//       Platform.OS === "ios"
//         ? "https://apps.apple.com/de/app/islam-fragen/id6737857116"
//         : "https://play.google.com/store/apps/details?id=com.bufib.islamFragen&pcampaignid=web_share";

//     try {
//       // 1) Database content version check & sync
//       const versionFromStorage = await Storage.getItemAsync("database_version");
//       const versionFromSupabase = await fetchVersionFromSupabase();

//       if (versionFromSupabase && versionFromSupabase !== versionFromStorage) {
//         console.log("New database version detected, syncing...");
//         await Promise.allSettled([
//           syncQuestions(language),
//           syncCalendar(language),
//           syncPrayers(language),
//           syncPayPal(),
//         ]);
//         await Storage.setItemAsync("database_version", versionFromSupabase);
//         console.log("Database sync complete.");
//       } else {
//         console.log("Database is up to date.");
//       }

//       // 2) App version update check
//       const currentAppVersion = Constants.expoConfig?.version;
//       const appVersionFromSupabase = await fetchAppVersionFromSupabase();

//       if (
//         currentAppVersion &&
//         appVersionFromSupabase &&
//         currentAppVersion !== appVersionFromSupabase
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
//     } catch (error: any) {
//       console.error("Error during version check/sync:", error);
//       Alert.alert(i18n.t("error"), error?.message);
//     } finally {
//       // Mark ready regardless of outcome
//       setIsReady(true);
//     }
//   }, [debouncedInit]);

//   /**
//    * Safe wrapper to avoid concurrent initializations.
//    */
//   const safeInitialize = useCallback(async () => {
//     if (isInitializing.current) {
//       console.log("Database initialization already running. Skipping.");
//       return;
//     }
//     isInitializing.current = true;
//     try {
//       await initializeDatabase();
//     } catch (error) {
//       console.error("Failed to initialize database:", error);
//     } finally {
//       isInitializing.current = false;
//     }
//   }, [initializeDatabase]);

//   // Run once on mount
//   useEffect(() => {
//     safeInitialize();
//   }, [safeInitialize]);

//   // Set up Supabase subscriptions for remote changes
//   useEffect(() => {
//     // Versions table subscription
//     const versionsChannel = supabase
//       .channel("versions")
//       .on(
//         "postgres_changes",
//         { event: "UPDATE", schema: "public", table: "versions" },
//         async (payload) => {
//           const { new: newRec, old: oldRec } = payload;
//           if (newRec.database_version !== oldRec.database_version) {
//             try {
//               console.log("Versions change detected:", payload);
//               await safeInitialize();
//               router.replace("/(tabs)/home");
//               databaseUpdate();
//             } catch (err) {
//               console.error("Error handling versions subscription:", err);
//             }
//           }
//           if (newRec.app_version !== oldRec.app_version) {
//             try {
//               await safeInitialize();
//             } catch (err) {
//               console.error("Error handling app_version subscription:", err);
//             }
//           }
//         }
//       )
//       .subscribe();

//     // PayPal table subscription
//     const paypalChannel = supabase
//       .channel("paypal")
//       .on(
//         "postgres_changes",
//         { event: "*", schema: "public", table: "paypal" },
//         async (payload) => {
//           try {
//             console.log("PayPal change detected:", payload);
//             await syncPayPal();
//             router.replace("/(tabs)/home");
//             databaseUpdate();
//           } catch (err) {
//             console.error("Error handling PayPal subscription:", err);
//           }
//         }
//       )
//       .subscribe();

//     return () => {
//       supabase.removeChannel(versionsChannel).catch(console.error);
//       supabase.removeChannel(paypalChannel).catch(console.error);
//     };
//   }, [safeInitialize]);

//   return isReady;
// }

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

import { getQuestionCount } from "@/app/db/queries/questions";
import syncCalendar from "@/app/db/sync/calendar";
import syncPayPal from "@/app/db/sync/paypal";
import syncPrayers from "@/app/db/sync/prayers";
import syncQuestions from "@/app/db/sync/questions";
import {
  fetchVersionFromSupabase,
  fetchAppVersionFromSupabase,
} from "@/app/db/sync/versions";
import { router } from "expo-router";
import { supabase } from "@/utils/supabase";
import { databaseUpdate } from "@/constants/messages";

/**
 * Custom hook to manage local database synchronization with Supabase.
 * - Offline fallback, connectivity retries, version checks.
 * - Per-language sync: only fetch content for current language once per version.
 * @param language - i18n language code (e.g. 'en', 'de')
 * @returns true when initial sync (or fallback) completes.
 */
export function useDatabaseSync(language: string = i18n.language): boolean {
  const isInitializing = useRef(false);
  const [isReady, setIsReady] = useState(false);

  const debouncedInit = useRef(debounce(() => safeInitialize(), 3000)).current;

  const initializeDatabase = useCallback(async () => {
    const isOnline = await checkInternetConnection();
    if (!isOnline) {
      const questionCount = await getQuestionCount();
      if (questionCount > 0) {
        setIsReady(true);
        return;
      }
      setupConnectivityListener(() => debouncedInit());
      return;
    }

    const getStoreURL = () =>
      Platform.OS === "ios"
        ? "https://apps.apple.com/de/app/islam-fragen/id6737857116"
        : "https://play.google.com/store/apps/details?id=com.bufib.islamFragen";

    try {
      // --- FETCH VERSIONS ---
      const storedVersion = await Storage.getItemAsync("database_version");
      const remoteVersion = await fetchVersionFromSupabase();

      if (remoteVersion) {
        const versionChanged = remoteVersion !== storedVersion;
        const langVersionKey = `synced_${language}_${remoteVersion}`;
        const alreadySyncedLang = await Storage.getItemAsync(langVersionKey);

        if (versionChanged) {
          // New version: sync all data regardless of language
          await Promise.allSettled([
            syncQuestions(language),
            syncCalendar(language),
            syncPrayers(language),
            syncPayPal(),
          ]);
          await Storage.setItemAsync("database_version", remoteVersion);
          // mark this language as synced for this version
          await Storage.setItemAsync(langVersionKey, "true");
        } else if (!alreadySyncedLang) {
          // Version same but first time in this language: sync only language-specific data
          await Promise.allSettled([
            syncQuestions(language),
            syncCalendar(language),
            syncPrayers(language),
          ]);
          await Storage.setItemAsync(langVersionKey, "true");
        }
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
      Alert.alert(i18n.t("error"), err.message);
    } finally {
      setIsReady(true);
    }
  }, [debouncedInit, language]);

  const safeInitialize = useCallback(async () => {
    if (isInitializing.current) return;
    isInitializing.current = true;
    try {
      await initializeDatabase();
    } finally {
      isInitializing.current = false;
    }
  }, [initializeDatabase]);

  useEffect(() => {
    safeInitialize();
  }, [safeInitialize]);

  // Subscriptions for remote changes
  useEffect(() => {
    const handleVersionChange = async (payload: any) => {
      const { new: n, old: o } = payload;
      if (n.database_version !== o.database_version) {
        await safeInitialize();
        router.replace("/(tabs)/home");
        databaseUpdate();
      }
      if (n.app_version !== o.app_version) {
        await safeInitialize();
      }
    };

    const verChannel = supabase
      .channel("versions")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "versions" },
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
  }, [safeInitialize, language]);

  return isReady;
}
