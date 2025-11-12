import { useColorScheme, Platform } from "react-native";
import React from "react";
import { Stack, router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "@/constants/Colors";
const Layout = () => {
  const colorScheme = useColorScheme() || "light";
  return (
    <Stack>
      <Stack.Screen name="indexQuestion" options={{ headerShown: false }} />
      <Stack.Screen
        name="questionCategories"
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
      <Stack.Screen
        name="questionSubcategories"
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="questionVideos"
        options={{ headerShown: true, headerBackVisible: false }}
      />
    </Stack>
  );
};

export default Layout;
