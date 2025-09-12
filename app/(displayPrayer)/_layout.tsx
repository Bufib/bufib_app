import { StyleSheet, Text, useColorScheme, View } from "react-native";
import React from "react";
import { router, Stack } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import HeaderLeftBackButton from "@/components/HeaderLeftBackButton";
import { Colors } from "@/constants/Colors";
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from "react-native-safe-area-context";
const _layout = () => {
  const colorScheme = useColorScheme() || "light";
  return (
      <Stack>
        <Stack.Screen
          name="[prayer]"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
  );
};

export default _layout;

const styles = StyleSheet.create({});
