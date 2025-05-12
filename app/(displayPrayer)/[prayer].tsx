import { StyleSheet, View } from "react-native";
import React from "react";
import RenderPrayer from "@/components/RenderPrayer";
import { useLocalSearchParams } from "expo-router";

const prayer = () => {
  const params = useLocalSearchParams();
  const prayerID = Array.isArray(params.prayer)
    ? params.prayer[0]
    : params.prayer;

  console.log(prayerID);
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
