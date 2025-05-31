import { StyleSheet, Text, useColorScheme, View } from "react-native";
import React from "react";
import { router, Stack } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
const _layout = () => {
  const colorScheme = useColorScheme() || "light";
  return (
    <Stack>
      <Stack.Screen
        name="[prayer]"
        options={{
          headerShown: true,
          headerLeft: () => {
            return (
              <Ionicons
                name="chevron-back-outline"
                size={30}
                style={{ marginLeft: -16 }}
                onPress={() => router.back()}
                color={colorScheme === "dark" ? "#d0d0c0" : "#000"}
              />
            );
          },
        }}
      />
    </Stack>
  );
};

export default _layout;

const styles = StyleSheet.create({});
