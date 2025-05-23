import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import i18n from "@/utils/i18n";
const _layout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="newsArticle"
        options={{ headerShown: true, headerBackTitle: i18n.t("back") }}
      />
    </Stack>
  );
};

export default _layout;

const styles = StyleSheet.create({});
