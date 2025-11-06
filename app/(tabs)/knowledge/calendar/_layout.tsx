import React from "react";
import { Stack } from "expo-router";

const _layout = () => {
  return (
    <Stack>
      <Stack.Screen name="indexCalandar" options={{ headerShown: true }} />
    </Stack>
  );
};

export default _layout;
