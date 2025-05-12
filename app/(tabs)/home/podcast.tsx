// app/home/podcast.tsx
import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { PodcastPlayer } from "@/components/PodcastPlayer";

export default function PodcastScreen() {
  // pull in the raw JSON string
  const { podcast: podcastString } = useLocalSearchParams<{ podcast: string }>();
  
  let podcast;
  try {
    podcast = JSON.parse(podcastString);
  } catch {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          Invalid podcast data.
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <PodcastPlayer podcast={podcast} />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "red", marginBottom: 12 },
});
