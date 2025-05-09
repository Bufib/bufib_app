// app/_layout.tsx
import "@/utils/i18n"; // initialize i18next
import React, { useEffect } from "react";
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
import { useColorScheme } from "@/hooks/useColorScheme";
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";
import LanguageSelection from "@/components/LanguageSelectionScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";

const queryClient = new QueryClient();

function AppContent() {
  const colorScheme = useColorScheme();
  const { ready, language } = useLanguage();

  useEffect(() => {
    if (ready) {
      SplashScreen.hideAsync();
    }
  }, [ready]);

  // keep native splash visible until i18n + storage are ready
  if (!ready) {
    return null;
  }

  // on first run, show the picker
  if (!language) {
    return <LanguageSelection />;
  }

  // language chosen → render your app
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <QueryClientProvider client={queryClient}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
