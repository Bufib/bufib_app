import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  StyleSheet,
  Platform,
  useColorScheme,
} from "react-native";
import Slider from "@react-native-community/slider";
import { useAudioPlayer, useAudioPlayerStatus, AudioStatus } from "expo-audio";
import { PodcastType } from "@/constants/Types";
import { usePodcasts } from "@/hooks/usePodcasts";
import { ThemedView } from "./ThemedView";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "./ThemedText";
import AntDesign from "@expo/vector-icons/AntDesign";
import { PodcastPlayerPropsType } from "@/constants/Types";
export const PodcastPlayer: React.FC<PodcastPlayerPropsType> = ({
  podcast,
}) => {
  const { stream, download, getCachedUri } = usePodcasts(podcast.language_code);
  const [sourceUri, setSourceUri] = useState<string | null>(null);
  const [isPreparingStream, setIsPreparingStream] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [playerError, setPlayerError] = useState<string | null>(null);
  const [didInitiatePlayback, setDidInitiatePlayback] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const colorScheme = useColorScheme() || "light";
  const player = useAudioPlayer(sourceUri ? { uri: sourceUri } : null, 500);
  const status: AudioStatus | null = useAudioPlayerStatus(player);

  useEffect(() => {
    (async () => {
      if (!podcast.sound_path) return;
      // try to re-use existing file
      const uri = await getCachedUri(podcast.sound_path);
      if (uri) {
        setSourceUri(uri);
        return;
      }
     
    })();
  }, [podcast.sound_path]);

  useEffect(() => {
    if (player) player.loop = false;
  }, [player]);

  useEffect(() => {
    if (status?.didJustFinish) {
      setDidInitiatePlayback(false);
    }
  }, [status?.didJustFinish]);

  useEffect(() => {
    setSourceUri(null);
    setPlayerError(null);
    setDownloadProgress(0);
    setIsPreparingStream(false);
    setDidInitiatePlayback(false);
  }, [podcast.id]);

  useEffect(() => {
    if (
      player &&
      sourceUri &&
      status?.isLoaded &&
      !status.playing &&
      !playerError &&
      !status.didJustFinish &&
      !didInitiatePlayback
    ) {
      console.log("Auto-playing initial load...");
      try {
        player.play();
        setDidInitiatePlayback(true);
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Unknown playback error";
        console.error("Synchronous Auto-play failed:", errorMsg);
        setPlayerError(`Failed to start playback: ${errorMsg}`);
      }
    }
  }, [
    player,
    sourceUri,
    status?.isLoaded,
    status?.playing,
    playerError,
    status?.didJustFinish,
    didInitiatePlayback,
  ]);

  const handleStream = useCallback(() => {
    if (!podcast.sound_path) {
      setPlayerError("Audio path missing.");
      return;
    }
    setIsPreparingStream(true);
    setPlayerError(null);
    setSourceUri(null);
    setDownloadProgress(0);
    setDidInitiatePlayback(false);

    try {
      const publicUrl = stream(podcast.sound_path);
      if (!publicUrl) {
        setPlayerError("Failed to get streaming URL.");
        setIsPreparingStream(false);
      } else {
        setSourceUri(publicUrl);
        setIsPreparingStream(false);
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Unknown streaming error";
      console.error("Streaming error (unexpected):", errorMsg);
      setPlayerError(`Streaming error: ${errorMsg}`);
      setIsPreparingStream(false);
    }
  }, [podcast.sound_path, stream]);

  const handleDownloadAndPlay = useCallback(async () => {
    if (!podcast.sound_path) {
      setPlayerError("Audio path missing.");
      return;
    }
    setPlayerError(null);
    setSourceUri(null);
    setDownloadProgress(0);
    setIsPreparingStream(false);
    setDidInitiatePlayback(false);

    try {
      const localUri = await download.mutateAsync({
        soundPath: podcast.sound_path,
        onProgress: setDownloadProgress,
      });
      setSourceUri(localUri);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Unknown download error";
      console.error("Download error in component:", errorMsg);
      setPlayerError(`Download failed: ${errorMsg}`);
      setDownloadProgress(0);
    }
  }, [podcast.sound_path, download]);

  // --- Player Controls ---
  const togglePlayPause = useCallback(() => {
    if (!status?.isLoaded || !!playerError) return;
    if (status.playing) {
      player.pause();
    } else {
      try {
        player.play();
        setDidInitiatePlayback(true);
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Unknown playback error";
        setPlayerError(`Play command failed: ${errorMsg}`);
      }
    }
  }, [player, status?.isLoaded, status?.playing, playerError]);

  const goBack = useCallback(() => {
    if (!status?.isLoaded || !status.duration || !!playerError) return;
    const newPosition = Math.max(0, status.currentTime - 15);
    player.seekTo(newPosition);
  }, [
    player,
    status?.isLoaded,
    status?.currentTime,
    status?.duration,
    playerError,
  ]);

  const goForward = useCallback(() => {
    if (!status?.isLoaded || !status.duration || !!playerError) return;
    const newPosition = Math.min(status.duration, status.currentTime + 15);
    player.seekTo(newPosition);
  }, [
    player,
    status?.isLoaded,
    status?.currentTime,
    status?.duration,
    playerError,
  ]);

  const stopPlayback = useCallback(() => {
    if (!status?.isLoaded || !!playerError) return;
    player.pause();
    player.seekTo(0);
  }, [player, status?.isLoaded, playerError]);

  // *** 2. Handler for Slider seek ***
  const handleSeek = useCallback(
    (value: number) => {
      if (!status?.isLoaded || !player) return;
      console.log(`Seeking to: ${value} seconds`);
      setIsSeeking(false); // Mark seeking as complete
      player.seekTo(value);
      // Optional: If paused, resume playback after seek?
      // if (!status.playing) {
      //   player.play();
      //   setDidInitiatePlayback(true);
      // }
    },
    [player, status?.isLoaded]
  );

  // --- Render Logic ---
  const isPlayerActuallyLoading = !!(sourceUri && !status?.isLoaded);
  const isPreparing = isPreparingStream || download.isPending;
  const isLoading = isPreparing || isPlayerActuallyLoading;
  const canPlay = !!status?.isLoaded;
  const showInitialButtons = !sourceUri && !isLoading && !playerError;
  const showPlaybackControls = sourceUri && canPlay;
  const showDownloadProgress = download.isPending;
  // Disable controls if loading, not ready, error exists, OR if actively seeking
  const controlsDisabled = isLoading || !canPlay || !!playerError || isSeeking;

  const formatTime = (minutes: number | null | undefined): string => {
    if (
      minutes === null ||
      minutes === undefined ||
      isNaN(minutes) ||
      minutes < 0
    ) {
      return "0:00";
    }
    const total = Math.floor(minutes);
    const mins = Math.floor(total / 3600);
    const secs = total % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <ThemedView style={styles.container}>
      <View
        style={[
          styles.headerContainer,
          { backgroundColor: Colors[colorScheme].contrast },
        ]}
      >
        <ThemedText style={styles.title} type="titleSmall">
          {podcast.title}
        </ThemedText>
        <ThemedText style={styles.descriptionText} type="subtitle">
          {podcast.description}
        </ThemedText>

        {status.isLoaded && (
          <View style={{ flexDirection: "row", gap: 10 }}>
            <ThemedText style={styles.descriptionText} type="subtitle">
              {formatTime(status?.duration)} min
            </ThemedText>
            <AntDesign
              name="clockcircleo"
              size={24}
              color={Colors[colorScheme].defaultIcon}
            />
          </View>
        )}
        {showInitialButtons && (
          <View style={styles.initialButtons}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Button
                title="Stream Episode"
                onPress={handleStream}
                disabled={isLoading}
              />
              <AntDesign
                name="clouddownloado"
                size={24}
                color={Colors[colorScheme].defaultIcon}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Button
                title="Download & Play"
                onPress={handleDownloadAndPlay}
                disabled={isLoading}
              />
              <AntDesign
                name="download"
                size={24}
                color={Colors[colorScheme].defaultIcon}
              />
            </View>
          </View>
        )}
      </View>

      {playerError && (
        <Text style={styles.errorText}>Error: {playerError}</Text>
      )}
      {isLoading && !playerError && <ActivityIndicator style={styles.loader} />}

      {showDownloadProgress && (
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
            Downloading: {Math.round(downloadProgress * 100)}%
          </Text>
        </>
      )}

      {showPlaybackControls && !playerError && (
        <>
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>
              {formatTime(status?.currentTime)}
            </Text>
            <Text style={styles.timeText}>{formatTime(status?.duration)}</Text>
          </View>

          {/* *** 3. Add the Slider component *** */}
          <Slider
            style={styles.slider}
            value={status?.currentTime ?? 0} // Current position
            minimumValue={0}
            maximumValue={status?.duration ?? 1} // Total duration (use 1 as fallback)
            // Use onSlidingStart/Complete to avoid seeking too often during drag
            onSlidingStart={() => setIsSeeking(true)} // Optional: Indicate seeking start
            onSlidingComplete={handleSeek} // Seek when user releases slider
            minimumTrackTintColor="#3b82f6" // Example color
            maximumTrackTintColor="#d1d5db" // Example color
            thumbTintColor="#3b82f6" // Example color
            disabled={controlsDisabled || !status?.duration} // Disable if controls are disabled or duration unknown
          />

          <View style={styles.controls}>
            <Button
              title="15 s"
              onPress={goBack}
              disabled={controlsDisabled}
            />
            <Button
              title={status?.playing ? "Pause" : "Play"}
              onPress={togglePlayPause}
              disabled={controlsDisabled}
            />
            <Button
              title="15 s"
              onPress={goForward}
              disabled={controlsDisabled}
            />
          </View>
          <Button
            title="Stop"
            onPress={stopPlayback}
            disabled={controlsDisabled}
          />
        </>
      )}
    </ThemedView>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "column",
    alignItems: "center",
    padding: 20,
    gap: 10,
  },

  title: {},
  descriptionText: {},
  loader: { marginVertical: 16, alignSelf: "center" },
  spacer: { height: 8 },
  initialButtons: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  errorText: { color: "red", marginVertical: 8, textAlign: "center" },
  progressContainer: {
    width: "100%",
    height: 6,
    backgroundColor: "#e0e0e0",
    borderRadius: 3,
    overflow: "hidden",
    marginVertical: 8,
  },
  progressBar: { height: "100%", backgroundColor: "#3b82f6" },
  progressText: {
    textAlign: "center",
    fontSize: 12,
    color: "#444",
    marginBottom: 8,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
    paddingHorizontal: 10,
  },
  timeText: {
    fontSize: 12,
    color: "#444",
  },
  slider: {
    width: "100%",
    height: 40,
    marginVertical: 5,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginVertical: 12,
  },
});
