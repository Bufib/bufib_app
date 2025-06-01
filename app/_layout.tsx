import { BackHandler } from "react-native";

import "@/utils/i18n"; // initialize i18next (from Code 2)
import React, { useEffect, useState } from "react";
import {
  ThemeProvider,
  DarkTheme,
  DefaultTheme,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useColorScheme } from "@/hooks/useColorScheme"; // Used by both
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext"; // From Code 2
import LanguageSelection from "@/components/LanguageSelectionScreen"; // From Code 2
import Toast from "react-native-toast-message"; // Used by both
import {
  ActivityIndicator,
  Appearance,
  Platform,
  View,
  Text,
} from "react-native";

import { useInitializeDatabase } from "@/hooks/useInitializeDatabase.ts";
import { SQLiteProvider } from "expo-sqlite";
import { Storage } from "expo-sqlite/kv-store";
import { useAuthStore } from "@/stores/authStore";
import { NoInternet } from "@/components/NoInternet";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { SupabaseRealtimeProvider } from "@/components/SupabaseRealtimeProvider";
import useNotificationStore from "@/stores/notificationStore";
import { useFontSizeStore } from "@/stores/fontSizeStore";
import ReMountManager from "@/components/ReMountManager";
import { useConnectionStatus } from "@/hooks/useConnectionStatus";
import { Colors } from "@/constants/Colors"; // For loading screen
import AppReviewPrompt from "@/components/AppReviewPrompt";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { cleanupCache } from "@/hooks/usePodcasts";

//! Needed or sign up won't work!
// If removeEventListener doesn’t exist, patch it on-the-fly:
if (typeof (BackHandler as any).removeEventListener !== "function") {
  (BackHandler as any).removeEventListener = (
    eventName: any,
    handler: () => boolean
  ) => {
    // Create a dummy subscription and immediately remove it.
    const subscription = BackHandler.addEventListener(eventName, handler);
    subscription.remove();
  };
}

// Prevent the splash screen from auto-hiding before asset loading is complete. (From Code 1)
SplashScreen.preventAutoHideAsync();

// Query client (defined at module level like in Code 2)
const queryClient = new QueryClient();

function AppContent() {
  const colorScheme = useColorScheme() || "light";
  const { ready: languageContextReady, language } = useLanguage(); // Renamed 'ready' to avoid conflict

  // State and hooks from Code 1
  const dbInitialized = useInitializeDatabase();
  const restoreSession = useAuthStore((state) => state.restoreSession);
  const [isSessionRestored, setIsSessionRestored] = useState(false);
  const hasInternet = useConnectionStatus();
  const { expoPushToken, notification } = usePushNotifications(); // Kept for completeness, original was commented
  const [storesHydrated, setStoresHydrated] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);

  // Effect to set color theme from Storage (from Code 1)
  useEffect(() => {
    const setColorTheme = () => {
      try {
        const savedColorScheme = Storage.getItemSync("isDarkMode");
        if (savedColorScheme === "true") {
          Appearance.setColorScheme("dark");
        } else if (savedColorScheme === "false") {
          Appearance.setColorScheme("light");
        }
        // If null or undefined, it will use system default or whatever Appearance.setColorScheme(null) does.
      } catch (error) {
        console.error("Failed to set color scheme from storage:", error);
      }
    };
    setColorTheme();
  }, []);

  // Effect to hydrate stores (from Code 1)
  useEffect(() => {
    const hydrateStores = async () => {
      try {
        await Promise.all([
          useAuthStore.persist.rehydrate(),
          useFontSizeStore.persist.rehydrate(),
          useNotificationStore.persist.rehydrate(),
        ]);
        // Call checkPermissions after notification store is rehydrated
        await useNotificationStore.getState().checkPermissions();
        setStoresHydrated(true);
      } catch (error) {
        console.error("Failed to hydrate stores:", error);
        setStoresHydrated(true); // Still set to true to allow app to proceed
      }
    };

    hydrateStores();
  }, []);

  // Effect for iOS notification permission request (from Code 1)
  useEffect(() => {
    if (storesHydrated && Platform.OS === "ios") {
      const { getNotifications, permissionStatus, toggleGetNotifications } =
        useNotificationStore.getState();
      if (!getNotifications && permissionStatus === "undetermined") {
        toggleGetNotifications(); // This likely triggers the permission prompt
      }
    }
  }, [storesHydrated]);

  // Effect for session restoration (from Code 1)
  useEffect(() => {
    const initSession = async () => {
      if (storesHydrated) {
        // Ensure stores are hydrated before restoring session
        await restoreSession();
        setIsSessionRestored(true);
      }
    };
    if (storesHydrated) {
      // Only run if stores are hydrated
      initSession();
    }
  }, [storesHydrated, restoreSession]);

  // Debounce showing the loadingScreen for DB initialization (from Code 1)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    // Show loading screen only if DB is not initialized, we have internet,
    // and other essential services (language, stores, session) are ready.
    if (
      languageContextReady &&
      storesHydrated &&
      isSessionRestored &&
      !dbInitialized &&
      hasInternet
    ) {
      timer = setTimeout(() => {
        setShowLoadingScreen(true);
      }, 2000); // 2-second delay
    } else {
      setShowLoadingScreen(false); // Hide if conditions are not met or change
    }

    return () => clearTimeout(timer);
  }, [
    languageContextReady,
    storesHydrated,
    isSessionRestored,
    dbInitialized,
    hasInternet,
  ]);

  // Combined SplashScreen hiding logic
  useEffect(() => {
    const allAppReady =
      languageContextReady &&
      storesHydrated &&
      isSessionRestored &&
      dbInitialized;

    if (allAppReady) {
      SplashScreen.hideAsync();
    } else if (!hasInternet && languageContextReady && storesHydrated) {
      // If critical initializations (language, stores) are done but there's no internet,
      // and DB might be pending or session restoration.
      SplashScreen.hideAsync();
      Toast.show({
        type: "error",
        text1: "Keine Internetverbindung", // TODO: Consider using i18n for this message
        text2: "Einige Funktionen sind möglicherweise nicht verfügbar.", // TODO: i18n
        visibilityTime: 5000,
      });
    }
    // If not all ready but hasInternet, splash remains visible.
    // The specific DB loading screen will appear if dbInitialized is false after timeout.
  }, [
    languageContextReady,
    storesHydrated,
    isSessionRestored,
    dbInitialized,
    hasInternet,
  ]);

  // Run cleanup once on app mount
  useEffect(() => {
    console.log("Running cache cleanup on App mount...");
    cleanupCache().catch(console.warn);
  }, []);

  // //! Store push token (from Code 1, kept commented)
  // useEffect(() => {
  //   if (expoPushToken?.data) {
  //     console.log("Push Token:", expoPushToken.data);
  //   }
  // }, [expoPushToken]);

  // //! Handle notifications (from Code 1, kept commented)
  // useEffect(() => {
  //   if (notification) {
  //     console.log("Received notification:", notification);
  //   }
  // }, [notification]);

  // Conditional rendering based on loading states
  // 1. Wait for language context, store hydration, and session restoration
  if (!languageContextReady || !storesHydrated || !isSessionRestored) {
    // Minimal loading state or null (keeps splash screen visible until ready)
    return null;
  }

  // 2. If language not yet selected (after initial readiness)
  if (!language) {
    return <LanguageSelection />;
  }

  // 3. Show specific DB loading screen (from Code 1)
  // This screen shows if DB is not ready, after a delay, and internet is available.
  if (!dbInitialized && showLoadingScreen && hasInternet) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor:
            colorScheme === "dark"
              ? Colors.dark.background
              : Colors.light.background,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
          gap: 30,
        }}
      >
        <Text
          style={{
            fontSize: 28, // Slightly adjusted
            color:
              colorScheme === "dark" ? Colors.dark.text : Colors.light.text,
            fontWeight: "700",
            textAlign: "center",
          }}
        >
          Fragen werden geladen! {/* TODO: i18n */}
        </Text>
        <ActivityIndicator
          size={"large"}
          color={colorScheme === "dark" ? Colors.dark.tint : Colors.light.tint}
        />
        <Text
          style={{
            fontSize: 16,
            textAlign: "center",
            color:
              colorScheme === "dark" ? Colors.dark.text : Colors.light.text,
          }}
        >
          Je nach Internetverbindung kann das einen Augenblick dauern.
          {/* TODO: i18n */}
        </Text>
        <Toast /> {/* Local Toast for this specific screen if needed */}
      </View>
    );
  }

  // 4. If essential data (like DB) is still not ready, but the specific loading screen isn't shown
  // (e.g. timeout not elapsed, or no internet and splash already handled),
  // returning null will keep the splash screen visible or show a blank screen if splash was hidden due to no internet.
  // This prevents rendering the main app structure prematurely.
  if (!dbInitialized && hasInternet) {
    // If still waiting for DB with internet, and not showing the specific loader.
    return null; // Keep splash or show blank
  }

  // Main app content
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <ReMountManager>
          <NoInternet showUI={!hasInternet} showToast={true} />
          <QueryClientProvider client={queryClient}>
            <SupabaseRealtimeProvider>
              <SQLiteProvider
                databaseName="islam-fragen.db"
                useSuspense={false}
              >
                {/* Set useSuspense={false} for SQLiteProvider if not using React Suspense for DB loading */}
                {/* Or handle suspense boundary if dbInitialized is used with it */}
                <Stack
                  screenOptions={{
                    headerTintColor:
                      colorScheme === "dark" ? "#d0d0c0" : "#000", // From Code 1
                  }}
                >
                  {/* Merged Stack Screens */}
                  <Stack.Screen name="index" options={{ headerShown: false }} />
                  <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="(auth)"
                    options={{ headerShown: false }}
                  />

                  <Stack.Screen
                    name="(displayQuestion)"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="(displayPrayer)"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="(askQuestion)"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen name="+not-found" />
                </Stack>
                <AppReviewPrompt />
                <StatusBar style="auto" />
              </SQLiteProvider>
            </SupabaseRealtimeProvider>
          </QueryClientProvider>
          <Toast />
        </ReMountManager>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
