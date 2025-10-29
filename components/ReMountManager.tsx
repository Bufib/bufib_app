import React, { useEffect, useCallback } from "react";
import { AppState } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import useNotificationStore from "@/stores/notificationStore";
import { safeInitializeDatabase } from "@/db";
import { runDatabaseSync } from "@/db/runDatabaseSync";
import { useLanguage } from "@/contexts/LanguageContext";

const REFETCH_THRESHOLD = 5 * 60 * 1000; // 5 minutes
const LAST_FETCH_KEY = "lastFetchTime";

interface ReMountManagerProps {
  children: React.ReactNode;
  onInitialize?: () => void;
}

const ReMountManager = ({ children, onInitialize }: ReMountManagerProps) => {
  const checkPermissions = useNotificationStore(
    (state) => state.checkPermissions
  );
  const { lang } = useLanguage();

  const updateLastFetchTime = useCallback(async () => {
    await AsyncStorage.setItem(LAST_FETCH_KEY, Date.now().toString());
  }, []);

  const shouldReinitialize = useCallback(async () => {
    const lastFetchTime = await AsyncStorage.getItem(LAST_FETCH_KEY);
    const timeSinceLastFetch = Date.now() - parseInt(lastFetchTime || "0", 10);
    return timeSinceLastFetch > REFETCH_THRESHOLD;
  }, []);

  // Use your guarded core sync instead of the old initializeDatabase()
  const runSyncIfNeeded = useCallback(async () => {
    try {
      await safeInitializeDatabase(() => runDatabaseSync(lang));
      await updateLastFetchTime();
      onInitialize?.();
    } catch (error) {
      console.error("Error reinitializing database:", error);
    }
  }, [lang, updateLastFetchTime, onInitialize]);

  const handleAppStateChange = useCallback(
    async (nextAppState: AppState["currentState"]) => {
      try {
        const netState = await NetInfo.fetch();
        if (nextAppState === "active") {
          await checkPermissions();
          if (netState.isConnected) {
            const needsReinitialization = await shouldReinitialize();
            if (needsReinitialization) {
              await runSyncIfNeeded();
            }
          }
        } else if (
          nextAppState === "background" ||
          nextAppState === "inactive"
        ) {
          await updateLastFetchTime();
        }
      } catch (error) {
        console.error("Error handling app state change:", error);
      }
    },
    [checkPermissions, shouldReinitialize, runSyncIfNeeded, updateLastFetchTime]
  );

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    return () => subscription.remove();
  }, [handleAppStateChange]);

  return <>{children}</>;
};

export default ReMountManager;
