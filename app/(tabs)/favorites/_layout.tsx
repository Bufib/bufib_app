import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";
const _layout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="favoritesQuestions" options={{ headerShown: false }} />
      <Stack.Screen name="favoritesNewsArticles" options={{ headerShown: false }} />
      <Stack.Screen name="favoritesPodcasts" options={{ headerShown: false }} />
      <Stack.Screen name="favoritesPrayers" options={{ headerShown: false }} />
    </Stack>
  );
};

export default _layout;

const styles = StyleSheet.create({});
