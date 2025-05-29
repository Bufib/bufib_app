import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";
const _layout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="favoriteQuestions" options={{ headerShown: false }} />
      <Stack.Screen name="favoriteNewsArticles" options={{ headerShown: false }} />
      <Stack.Screen name="favoritePodcasts" options={{ headerShown: false }} />
      <Stack.Screen name="favoritePrayers" options={{ headerShown: false }} />
    </Stack>
  );
};

export default _layout;

const styles = StyleSheet.create({});
