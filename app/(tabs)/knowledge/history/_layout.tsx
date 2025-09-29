import { Platform, StyleSheet, Text, useColorScheme, View } from "react-native";
import React from "react";
import { router, Stack } from "expo-router";
import i18n from "@/utils/i18n";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
const _layout = () => {
  const colorScheme = useColorScheme() || "light";
  return (
    <Stack>
      <Stack.Screen name="indexHistory" options={{ headerShown: false }} />
      <Stack.Screen name="prophets" options={{ headerShown: false }} />
      <Stack.Screen name="ahlulbayt" options={{ headerShown: false }} />
          </Stack>
  );
};

export default _layout;

const styles = StyleSheet.create({});
