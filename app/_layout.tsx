import AppReviewPrompt from "@/components/AppReviewPrompt";
import LanguageSelection from "@/components/LanguageSelectionScreen";
import { NoInternet } from "@/components/NoInternet";
import ReMountManager from "@/components/ReMountManager";
import { SupabaseRealtimeProvider } from "@/components/SupabaseRealtimeProvider";
import { Colors } from "@/constants/Colors";
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useConnectionStatus } from "@/hooks/useConnectionStatus";
import { useInitializeDatabase } from "@/hooks/useInitializeDatabase.ts";
import { cleanupCache } from "@/hooks/usePodcasts";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useAuthStore } from "@/stores/authStore";
import { useFontSizeStore } from "@/stores/fontSizeStore";
import useNotificationStore from "@/stores/notificationStore";
import "@/utils/i18n";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SQLiteProvider } from "expo-sqlite";
import { Storage } from "expo-sqlite/kv-store";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Appearance,
  BackHandler,
  Platform,
  Text,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MenuProvider } from "react-native-popup-menu";
import "react-native-reanimated";
import Toast from "react-native-toast-message";

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

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Query client (defined at module level like in Code 2)
const queryClient = new QueryClient();

function AppContent() {
  const colorScheme = useColorScheme() || "light";
  const { ready: languageContextReady, language } = useLanguage();
  const dbInitialized = useInitializeDatabase();
  const restoreSession = useAuthStore((state) => state.restoreSession);
  const [isSessionRestored, setIsSessionRestored] = useState(false);
  const hasInternet = useConnectionStatus();
  const { expoPushToken } = usePushNotifications();
  const [storesHydrated, setStoresHydrated] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const { t } = useTranslation();

  // Effect to set color theme from Storage
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

  // Effect to hydrate stores
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

  // Effect for iOS notification permission request
  useEffect(() => {
    if (storesHydrated && Platform.OS === "ios") {
      const { getNotifications, permissionStatus, toggleGetNotifications } =
        useNotificationStore.getState();
      if (!getNotifications && permissionStatus === "undetermined") {
        toggleGetNotifications();
      }
    }
  }, [storesHydrated]);

  // Effect for session restoration
  useEffect(() => {
    const initSession = async () => {
      if (storesHydrated) {
        await restoreSession();
        setIsSessionRestored(true);
      }
    };
    if (storesHydrated) {
      initSession();
    }
  }, [storesHydrated, restoreSession]);

  // Debounce showing the loadingScreen for DB initialization
  useEffect(() => {
    let timer: any;
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
        text1: t("noInternetTitle"),
        text2: t("noInternetMessage"),
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
  useEffect(() => {
    if (expoPushToken) {
      console.log("Push Token:", expoPushToken);
    }
  }, [expoPushToken]);

  // Conditional rendering based on loading states
  // 1. Wait for language context, store hydration, and session restoration
  if (!languageContextReady || !storesHydrated || !isSessionRestored) {
    // Minimal loading state or null (keeps splash screen visible until ready)
    return null;
  }

  // 2. If language not yet selected (after initial readiness)
  if (language === null) {
    return <LanguageSelection />;
  }

  // 3. Show specific DB loading screen
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
            fontSize: 28,
            color:
              colorScheme === "dark" ? Colors.dark.text : Colors.light.text,
            fontWeight: "700",
            textAlign: "center",
          }}
        >
          {t("questionsAreBeingLoadedTitle")}
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
          {t("questionsAreBeingLoadedMessage")}
        </Text>
        <Toast />
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
          <MenuProvider>
            <NoInternet showUI={!hasInternet} showToast={true} />
            <QueryClientProvider client={queryClient}>
              <SupabaseRealtimeProvider>
                <SQLiteProvider
                  databaseName="islam-fragen.db"
                  useSuspense={false}
                >
                  <Stack
                    screenOptions={{
                      headerTintColor:
                        colorScheme === "dark" ? "#d0d0c0" : "#000",
                    }}
                  >
                    <Stack.Screen
                      name="index"
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="(tabs)"
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="(addNews)"
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
                      name="(newsArticle)"
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
                    <Stack.Screen
                      name="(podcast)"
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen name="+not-found" />
                  </Stack>
                  <AppReviewPrompt />
                  <StatusBar style="auto" />
                </SQLiteProvider>
              </SupabaseRealtimeProvider>
            </QueryClientProvider>
          </MenuProvider>
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
