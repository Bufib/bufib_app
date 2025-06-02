import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import i18n from "@/utils/i18n";
import HeaderLeftBackButton from "@/components/HeaderLeftBackButton";
const _layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          headerLeft: () => {
            return <HeaderLeftBackButton />;
          },
        }}
      />
    </Stack>
  );
};

export default _layout;

const styles = StyleSheet.create({});
