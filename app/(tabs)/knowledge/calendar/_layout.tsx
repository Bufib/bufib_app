import { Platform, StyleSheet, Text, useColorScheme, View } from "react-native";
import React from "react";
import { router, Stack } from "expo-router";

const _layout = () => {
  const colorScheme = useColorScheme() || "light";
  return (
    <Stack>
      <Stack.Screen name="indexCalandar" options={{ headerShown: true }} />
    </Stack>
  );
};

export default _layout;

const styles = StyleSheet.create({});
