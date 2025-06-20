import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, useColorScheme } from "react-native";

const HeaderLeftBackButton = ({
  color,
  size,
}: {
  color?: string | null;
  size?: number | null;
}) => {
  const colorScheme = useColorScheme() || "light";
  return (
    <Ionicons
      name="chevron-back-outline"
      size={size ? size : 30}
      style={{ marginLeft: -16 }}
      onPress={() => router.back()}
      color={color ? color : Colors.universal.link}
    />
  );
};

export default HeaderLeftBackButton;

const styles = StyleSheet.create({});
