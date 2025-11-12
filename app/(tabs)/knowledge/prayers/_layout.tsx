import { Platform, useColorScheme } from "react-native";
import React from "react";
import { router, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
const Layout = () => {
  const colorScheme = useColorScheme() || "light";
  return (
    <Stack>
      <Stack.Screen name="indexPrayer" options={{ headerShown: false }} />
      <Stack.Screen
        name="names"
        options={{
          headerShown: true,
          headerLeft: () => {
            return (
              <Ionicons
                name="chevron-back-outline"
                size={30}
                color={
                  Platform.OS === "ios"
                    ? Colors.universal.link
                    : colorScheme === "dark"
                    ? "#d0d0c0"
                    : "#000"
                }
                style={{ marginLeft: -16 }}
                onPress={() =>
                  router.canGoBack()
                    ? router.back()
                    : router.replace("/(tabs)/knowledge")
                }
              />
            );
          },
        }}
      />

      <Stack.Screen name="special" options={{ headerShown: true }} />
      <Stack.Screen
        name="prayerCategory"
        options={{
          headerShown: true,
          headerLeft: () => {
            return (
              <Ionicons
                name="chevron-back-outline"
                size={30}
                color={
                  Platform.OS === "ios"
                    ? Colors.universal.link
                    : colorScheme === "dark"
                    ? "#d0d0c0"
                    : "#000"
                }
                style={{ marginLeft: -16 }}
                onPress={() =>
                  router.canGoBack()
                    ? router.back()
                    : router.replace("/(tabs)/knowledge")
                }
              />
            );
          },
        }}
      />
      <Stack.Screen name="tasbih" options={{ headerShown: false }} />
    </Stack>
  );
};

export default Layout;

