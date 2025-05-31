import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  StyleSheet,
  useColorScheme,
  Pressable,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Slider from "@react-native-community/slider";
import { useAudioPlayer, useAudioPlayerStatus, AudioStatus } from "expo-audio";
import { PodcastType, PodcastPlayerPropsType } from "@/constants/Types";
import { usePodcasts } from "@/hooks/usePodcasts";
import { ThemedView } from "./ThemedView";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "./ThemedText";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { Image } from "expo-image";
export const PodcastPlayer: React.FC<PodcastPlayerPropsType> = ({
  podcast,
}) => {
  const { stream, download, getCachedUri } = usePodcasts();

  const [sourceUri, setSourceUri] = useState<string | null>(null);
  const [isPreparingStream, setIsPreparingStream] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [playerError, setPlayerError] = useState<string | null>(null);
  const [didInitiatePlayback, setDidInitiatePlayback] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [wantsPlay, setWantsPlay] = useState(false);

  const colorScheme = useColorScheme() || "light";
  const player = useAudioPlayer(sourceUri ? { uri: sourceUri } : null, 500);
  const status: AudioStatus | null = useAudioPlayerStatus(player);

  // Reset state and check for cached audio when podcast changes
  useEffect(() => {
    setSourceUri(null);
    setPlayerError(null);
    setDownloadProgress(0);
    setIsPreparingStream(false);
    setDidInitiatePlayback(false);
    setWantsPlay(false);

    (async () => {
      if (!podcast.filename) return;
      const uri = await getCachedUri(podcast.filename);
      if (uri) {
        setSourceUri(uri);
      }
    })();
  }, [podcast.id, podcast.filename]);

  // Disable looping
  useEffect(() => {
    if (player) player.loop = false;
  }, [player]);

  // Reset play intent when episode finishes
  useEffect(() => {
    if (status?.didJustFinish) {
      setDidInitiatePlayback(false);
    }
  }, [status?.didJustFinish]);

  // Auto-play only when user explicitly requested
  useEffect(() => {
    if (
      player &&
      sourceUri &&
      status?.isLoaded &&
      wantsPlay &&
      !status.playing &&
      !status.didJustFinish &&
      !playerError
    ) {
      try {
        player.play();
        setDidInitiatePlayback(true);
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Unknown playback error";
        setPlayerError(`Failed to start playback: ${errorMsg}`);
      }
      setWantsPlay(false);
    }
  }, [
    player,
    sourceUri,
    status?.isLoaded,
    status?.playing,
    status?.didJustFinish,
    playerError,
    wantsPlay,
  ]);

  // Stream handler
  const handleStream = useCallback(() => {
    if (!podcast.filename) {
      setPlayerError("Audio path missing.");
      return;
    }
    setIsPreparingStream(true);
    setPlayerError(null);
    setDownloadProgress(0);
    setDidInitiatePlayback(false);

    try {
      const publicUrl = stream(podcast.filename);
      console.log("→ streaming URL:", publicUrl);
      if (!publicUrl) {
        setPlayerError("Failed to get streaming URL.");
      } else {
        setSourceUri(publicUrl);
        setWantsPlay(true);
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Unknown streaming error";
      setPlayerError(`Streaming error: ${errorMsg}`);
    } finally {
      setIsPreparingStream(false);
    }
  }, [podcast.filename, stream]);

  // Download & play handler
  const handleDownloadAndPlay = useCallback(async () => {
    if (!podcast.filename) {
      setPlayerError("Audio path missing.");
      return;
    }
    setPlayerError(null);
    setSourceUri(null);
    setDownloadProgress(0);
    setDidInitiatePlayback(false);

    try {
      const localUri = await download.mutateAsync({
        filename: podcast.filename,
        onProgress: setDownloadProgress,
      });
      setSourceUri(localUri);
      setWantsPlay(true);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Unknown download error";
      setPlayerError(`Download failed: ${errorMsg}`);
      setDownloadProgress(0);
    }
  }, [podcast.filename, download]);

  // Playback controls
  const togglePlayPause = useCallback(() => {
    if (!status?.isLoaded || !!playerError) return;
    if (status.playing) {
      player.pause();
    } else {
      player.play();
      setDidInitiatePlayback(true);
    }
  }, [player, status?.isLoaded, status?.playing, playerError]);

  const goBack = useCallback(() => {
    if (!status?.isLoaded || !status.duration || playerError) return;
    player.seekTo(Math.max(0, status.currentTime - 15));
  }, [
    player,
    status?.isLoaded,
    status?.currentTime,
    status?.duration,
    playerError,
  ]);

  const goForward = useCallback(() => {
    if (!status?.isLoaded || !status.duration || playerError) return;
    player.seekTo(Math.min(status.duration, status.currentTime + 15));
  }, [
    player,
    status?.isLoaded,
    status?.currentTime,
    status?.duration,
    playerError,
  ]);

  const stopPlayback = useCallback(() => {
    if (!status?.isLoaded || playerError) return;
    player.pause();
    player.seekTo(0);
  }, [player, status?.isLoaded, playerError]);

  const handleSeek = useCallback(
    (value: number) => {
      if (!status?.isLoaded || !player) return;
      setIsSeeking(false);
      player.seekTo(value);
    },
    [player, status?.isLoaded]
  );

  // Render logic
  const isPlayerActuallyLoading = !!(sourceUri && !status?.isLoaded);
  const isPreparing = isPreparingStream || download.isPending;
  const isLoading = isPreparing || isPlayerActuallyLoading;
  const canPlay = !!status?.isLoaded;
  const showInitialButtons = !sourceUri && !isLoading && !playerError;
  const showPlaybackControls = sourceUri && canPlay;
  const showDownloadProgress = download.isPending;
  const controlsDisabled = isLoading || !canPlay || !!playerError || isSeeking;

  const formatTime = (secs?: number | null): string => {
    if (!secs || secs < 0 || isNaN(secs)) return "0:00";
    const total = Math.floor(secs);
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <ScrollView
      style={[
        styles.scrollStyle,
        { backgroundColor: Colors[colorScheme].background },
      ]}
      contentContainerStyle={styles.scrollContent}
    >
      <View
        style={[
          styles.headerContainer,
          { backgroundColor: Colors[colorScheme].contrast },
        ]}
      >
        <ThemedText style={styles.title} type="titleSmall">
          {podcast.title}
        </ThemedText>
        <ThemedText style={styles.descriptionText}>
          {podcast.description}
        </ThemedText>

        {status.isLoaded && (
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Text
              style={[
                styles.descriptionText,
                { fontWeight: 600, color: Colors.universal.primary },
              ]}
            >
              {formatTime(status?.duration)} min
            </Text>
            <AntDesign
              name="clockcircleo"
              size={24}
              color={Colors.universal.primary}
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

      {/* *** Main *** */}
      {showPlaybackControls && !playerError && status?.isLoaded && (
        <View style={styles.mainComponentsContainer}>
          <Image
            source={require("@/assets/images/logo.png")}
            style={styles.logo}
            contentFit="cover"
          />

          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>
              {formatTime(status?.currentTime)}
            </Text>
            <Text style={styles.timeText}>{formatTime(status?.duration)}</Text>
          </View>
          <Slider
            style={styles.slider}
            value={Math.min(status.currentTime || 0, status.duration || 0)}
            minimumValue={0}
            maximumValue={status.duration || 0}
            onSlidingStart={() => setIsSeeking(true)}
            onSlidingComplete={handleSeek}
            minimumTrackTintColor="#3b82f6"
            maximumTrackTintColor="#d1d5db"
            thumbTintColor="#3b82f6"
            disabled={controlsDisabled}
          />

          <View style={styles.controls}>
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
              onPress={goBack}
            >
              <AntDesign
                name="stepbackward"
                size={30}
                color={Colors[colorScheme].defaultIcon}
              />
              <ThemedText disabled={controlsDisabled}>15 s</ThemedText>
            </TouchableOpacity>

            {status?.playing ? (
              <AntDesign
                name="pausecircleo"
                size={30}
                color={Colors[colorScheme].defaultIcon}
                onPress={togglePlayPause}
                disabled={controlsDisabled}
              />
            ) : (
              <AntDesign
                name="playcircleo"
                size={30}
                color={Colors[colorScheme].defaultIcon}
                onPress={togglePlayPause}
                disabled={controlsDisabled}
              />
            )}

            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
              onPress={goForward}
            >
              <ThemedText disabled={controlsDisabled}>15 s</ThemedText>
              <AntDesign
                name="stepforward"
                size={30}
                color={Colors[colorScheme].defaultIcon}
              />
            </TouchableOpacity>
          </View>
          <Feather
            style={{ alignSelf: "center" }}
            name="stop-circle"
            size={32}
            color={Colors[colorScheme].error}
            onPress={stopPlayback}
            disabled={controlsDisabled}
          />
        </View>
      )}
    </ScrollView>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  scrollStyle: {
    flex: 1,
  },
  scrollContent: {
    gap: 20,
  },
  headerContainer: {
    flexDirection: "column",
    alignItems: "center",
    padding: 20,
    gap: 10,
  },

  title: {},
  descriptionText: {
    fontSize: 18,
  },
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
  mainComponentsContainer: {
    flex: 1,
  },
  logo: {
    width: "90%",
    height: 300,
    alignSelf: "center",
    marginBottom: 20,
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
