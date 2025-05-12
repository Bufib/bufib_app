// components/PodcastPlayer.tsx
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { PodcastType } from "@/constants/Types";
import { supabase } from "@/utils/supabase";
import { useDownloadPodcastSound } from "@/hooks/useFetchPodcasts";

interface PodcastPlayerProps {
  podcast: PodcastType;
}

export const PodcastPlayer: React.FC<PodcastPlayerProps> = ({ podcast }) => {
  const [sourceUri, setSourceUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  // The hook will load the URI you pass in and keep status in sync
  const player = useAudioPlayer(
    sourceUri ? { uri: sourceUri } : null,
    /* updateIntervalMs */ 500
  );
  const status = useAudioPlayerStatus(player);

  const downloadMutation = useDownloadPodcastSound();

  // STREAMING
  const handleStream = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.storage
        .from("podcasts")
        .createSignedUrl(podcast.sound_path, 60 * 60);
      if (error) throw error;
      setSourceUri(data.signedUrl);
      // once the hook loads it, status.isLoaded will flip true
      // so watch status.isLoaded below and auto-play
    } catch (e) {
      console.error("Streaming error", e);
    } finally {
      setLoading(false);
    }
  }, [podcast.sound_path]);

  // DOWNLOAD & PLAY WITH PROGRESS
  const handleDownloadAndPlay = useCallback(async () => {
    setLoading(true);
    setDownloadProgress(0);
    try {
      const localUri = await downloadMutation.mutateAsync({
        soundPath: podcast.sound_path,
        onProgress: (frac) => setDownloadProgress(frac),
      });

      setSourceUri(localUri);
      // same: let the hook load, then watch status
    } catch (e) {
      console.error("Download error", e);
    } finally {
      setLoading(false);
    }
  }, [downloadMutation, podcast.sound_path]);

  // Auto-play whenever we have a sourceUri and it's loaded
  useEffect(() => {
    if (sourceUri && status.isLoaded && !status.playing) {
      player.play();
    }
  }, [sourceUri, status.isLoaded]);

  // Play/pause toggle
  const togglePlayPause = () => {
    if (!status.isLoaded) return;
    status.playing ? player.pause() : player.play();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{podcast.title}</Text>
      <Text style={styles.desc}>{podcast.description}</Text>

      {/* initial spinner */}
      {loading && !sourceUri && <ActivityIndicator style={styles.loader} />}

      {/* download progress bar */}
      {downloadMutation.isLoading && (
        <>
          <View style={styles.progressContainer}>
            <View
              style={[
                styles.progressBar,
                { width: `${Math.round(downloadProgress * 100)}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {Math.round(downloadProgress * 100)}%
          </Text>
        </>
      )}

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
  title: { fontSize: 18, fontWeight: "600" },
  desc: { fontSize: 14, color: "#666", marginVertical: 8 },
  loader: { marginVertical: 8 },
  spacer: { height: 8 },

  progressContainer: {
    width: "100%",
    height: 4,
    backgroundColor: "#e0e0e0",
    borderRadius: 2,
    overflow: "hidden",
    marginVertical: 8,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#3b82f6",
  },
  progressText: {
    textAlign: "right",
    fontSize: 12,
    marginBottom: 8,
  },
});
