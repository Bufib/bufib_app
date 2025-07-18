import HeaderLeftBackButton from "@/components/HeaderLeftBackButton";
import { Stack } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
const _layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          headerLeft: () => <HeaderLeftBackButton />,
        }}
      />
    </Stack>
  );
};

export default _layout;

const styles = StyleSheet.create({});
