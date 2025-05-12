// components/PodcastPlayer.tsx
import React, { useEffect, useState, useCallback } from "react";
import { View, Text, Button, ActivityIndicator, StyleSheet } from "react-native";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { PodcastType } from "@/constants/Types";
import { supabase } from "@/utils/supabase";
import { useDownloadPodcastSound } from "@/hooks/useFetchPodcasts";

interface PodcastPlayerProps {
  podcast: PodcastType;
}

export const PodcastPlayer: React.FC<PodcastPlayerProps> = ({ podcast }) => {
  // Local state for the current audio source URI
  const [sourceUri, setSourceUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Expo Audio player hook
  // Pass sourceUri as { uri: sourceUri } or null
  const player = useAudioPlayer(
    sourceUri ? { uri: sourceUri } : null,
    /* updateInterval */ 500
  );

  // Playback status (loaded, playing, buffering, etc)
  const status = useAudioPlayerStatus(player);

  // Download mutation from your hook
  const downloadMutation = useDownloadPodcastSound();

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (player) {
        player.remove();
      }
    };
  }, [player]);

  // Stream from Supabase
  const handleStream = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.storage
        .from("podcasts")
        .createSignedUrl(podcast.soundPath, 60 * 60);
      if (error) throw error;
      setSourceUri(data.signedUrl);
      // expo-audio hook will auto-load; once loaded, call play
      // Wait until loaded:
      const waitForLoad = () =>
        new Promise<void>((resolve) => {
          const subscription = Audio.PLAYBACK_STATUS_UPDATE.subscribe((st) => {
            if (st.isLoaded) {
              subscription.remove();
              resolve();
            }
          });
        });
      await waitForLoad();
      player.play();
    } catch (e) {
      console.error("Streaming error", e);
    } finally {
      setLoading(false);
    }
  }, [podcast.soundPath, player]);

  // Download to local FS
  const handleDownloadAndPlay = useCallback(async () => {
    setLoading(true);
    try {
      const localUri = await downloadMutation.mutateAsync(podcast.soundPath);
      setSourceUri(localUri);
      // same load & play logic
      const waitForLoad = () =>
        new Promise<void>((resolve) => {
          const subscription = Audio.PLAYBACK_STATUS_UPDATE.subscribe((st) => {
            if (st.isLoaded) {
              subscription.remove();
              resolve();
            }
          });
        });
      await waitForLoad();
      player.play();
    } catch (e) {
      console.error("Download error", e);
    } finally {
      setLoading(false);
    }
  }, [downloadMutation, podcast.soundPath, player]);

  // Toggle play / pause
  const togglePlayPause = () => {
    if (!status.isLoaded) return;
    status.playing ? player.pause() : player.play();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{podcast.title}</Text>
      <Text style={styles.desc}>{podcast.description}</Text>

      {loading && <ActivityIndicator style={styles.loader} />}

      {!sourceUri ? (
        <>
          <Button
            title="Stream Episode"
            onPress={handleStream}
            disabled={loading}
          />
          <View style={styles.spacer} />
          <Button
            title="Download & Play"
            onPress={handleDownloadAndPlay}
            disabled={loading || downloadMutation.isLoading}
          />
        </>
      ) : (
        <Button
          title={status.playing ? "Pause" : "Play"}
          onPress={togglePlayPause}
          disabled={!status.isLoaded}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  desc: {
    fontSize: 14,
    color: "#666",
    marginVertical: 8,
  },
  loader: {
    marginVertical: 8,
  },
  spacer: {
    height: 8,
  },
});
