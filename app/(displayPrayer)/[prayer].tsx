import { StyleSheet, View } from "react-native";
import React from "react";
import RenderPrayer from "@/components/RenderPrayer";
import { Stack, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";

const prayer = () => {
  const params = useLocalSearchParams();
  const prayerID = Array.isArray(params.prayer)
    ? params.prayer[0]
    : params.prayer;
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <RenderPrayer prayerID={parseInt(prayerID)} />
    </View>
  );
};

export default prayer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
