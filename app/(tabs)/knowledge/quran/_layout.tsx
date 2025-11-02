import { StyleSheet, Text, useColorScheme, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import i18n from "@/utils/i18n";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Platform } from "react-native";
import { Colors } from "@/constants/Colors";
const _layout = () => {
  const colorScheme = useColorScheme() || "light";
  return (
    <Stack>
      <Stack.Screen name="indexQuran" options={{ headerShown: false }} />
    </Stack>
  );
};

export default _layout;

const styles = StyleSheet.create({});
