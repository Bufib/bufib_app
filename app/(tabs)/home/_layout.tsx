import { StyleSheet } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { MenuProvider } from "react-native-popup-menu";
const _layout = () => {
  return (
    <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
};

export default _layout;

const styles = StyleSheet.create({});
