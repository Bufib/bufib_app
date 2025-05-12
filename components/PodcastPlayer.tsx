// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   Button,
//   ActivityIndicator,
//   StyleSheet,
//   ViewStyle,
//   TextStyle,
// } from "react-native";
// import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
// import { PodcastType } from "@/constants/Types";
// import { usePodcasts } from "@/hooks/useFetchPodcasts";

// interface PodcastPlayerProps {
//   podcast: PodcastType;
// }

// export const PodcastPlayer: React.FC<PodcastPlayerProps> = ({ podcast }) => {
//   const { stream, download } = usePodcasts(podcast.language_code);
//   const [sourceUri, setSourceUri] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [downloadProgress, setDownloadProgress] = useState(0);

//   // Audio player instance
//   const player = useAudioPlayer(
//     sourceUri ? { uri: sourceUri } : null,
//     /* updateIntervalMs */ 500
//   );
//   const status = useAudioPlayerStatus(player);

//   // disable loop
//   useEffect(() => {
//     if (player) player.loop = false;
//   }, [player]);

//   // stop & reset on finish
//   useEffect(() => {
//     if (status?.didJustFinish) {
//       player.pause();
//       player.seekTo(0);
//     }
//   }, [status?.didJustFinish]);

//   // STREAM
//   const handleStream = async () => {
//     setLoading(true);
//     try {
//       const signedUrl = await stream(podcast.sound_path);
//       setSourceUri(signedUrl);
//     } catch (err) {
//       console.error("Streaming error", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // DOWNLOAD & PLAY
//   const handleDownloadAndPlay = async () => {
//     setLoading(true);
//     setDownloadProgress(0);
//     try {
//       const uri = await download.mutateAsync({
//         soundPath: podcast.sound_path,
//         onProgress: (frac) => setDownloadProgress(frac),
//       });
//       setSourceUri(uri);
//     } catch (err) {
//       console.error("Download error", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // auto-play when loaded
//   useEffect(() => {
//     if (sourceUri && status?.isLoaded && !status.playing) {
//       player.play();
//     }
//   }, [sourceUri, status?.isLoaded]);

//   // controls
//   const togglePlayPause = () => {
//     if (!status?.isLoaded) return;
//     status.playing ? player.pause() : player.play();
//   };
//   const goBack = () => {
//     if (!status?.isLoaded) return;
//     const pos = Math.max(0, status.currentTime - 15);
//     player.seekTo(pos);
//   };
//   const goForward = () => {
//     if (!status?.isLoaded) return;
//     const pos = Math.min(status.duration, status.currentTime + 15);
//     player.seekTo(pos);
//   };
//   const stopPlayback = () => {
//     if (!status?.isLoaded) return;
//     player.pause();
//     player.seekTo(0);
//   };

//   return (
//     <View style={styles.container as ViewStyle}>
//       <Text style={styles.title as TextStyle}>{podcast.title}</Text>
//       <Text style={styles.desc as TextStyle}>{podcast.description}</Text>

//       {/* initial spinner */}
//       {loading && !sourceUri && (
//         <ActivityIndicator style={styles.loader as ViewStyle} />
//       )}

//       {/* download progress */}
//       {download.isLoading && (
//         <>
//           <View style={styles.progressContainer as ViewStyle}>
//             <View
//               style={[
//                 styles.progressBar as ViewStyle,
//                 { width: `${Math.round(downloadProgress * 100)}%` },
//               ]}
//             />
//           </View>
//           <Text style={styles.progressText as TextStyle}>
//             {Math.round(downloadProgress * 100)}%
//           </Text>
//         </>
//       )}

//       {!sourceUri ? (
//         <>
//           <Button title="Stream Episode" onPress={handleStream} disabled={loading} />
//           <View style={styles.spacer as ViewStyle} />
//           <Button
//             title="Download & Play"
//             onPress={handleDownloadAndPlay}
//             disabled={loading || download.isLoading}
//           />
//         </>
//       ) : (
//         <>
//           <Button
//             title={status.playing ? "Pause" : "Play"}
//             onPress={togglePlayPause}
//             disabled={!status.isLoaded}
//           />
//           <View style={styles.controls as ViewStyle}>
//             <Button title="⏪ 15s" onPress={goBack} disabled={!status.isLoaded} />
//             <Button title="🛑 Stop" onPress={stopPlayback} disabled={!status.isLoaded} />
//             <Button title="15s ⏩" onPress={goForward} disabled={!status.isLoaded} />
//           </View>
//         </>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 16,
//     backgroundColor: "#fff",
//     borderRadius: 8,
//     marginVertical: 8,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   title: { fontSize: 18, fontWeight: "600" },
//   desc: { fontSize: 14, color: "#666", marginVertical: 8 },
//   loader: { marginVertical: 8 },
//   spacer: { height: 8 },

//   progressContainer: {
//     width: "100%",
//     height: 4,
//     backgroundColor: "#e0e0e0",
//     borderRadius: 2,
//     overflow: "hidden",
//     marginVertical: 8,
//   },
//   progressBar: { height: "100%", backgroundColor: "#3b82f6" },
//   progressText: { textAlign: "right", fontSize: 12, marginBottom: 8 },

//   controls: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     marginTop: 12,
//   },
// });

import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Pressable, // Import Pressable for potentially better button styling/feedback
} from "react-native";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { PodcastType } from "@/constants/Types";
import { usePodcasts } from "@/hooks/useFetchPodcasts"; // Ensure this path is correct

interface PodcastPlayerProps {
  podcast: PodcastType;
}

export const PodcastPlayer: React.FC<PodcastPlayerProps> = ({ podcast }) => {
  // Fetch stream/download functions for the specific podcast language
  // Note: This might re-fetch podcast list data unnecessarily if language changes often here.
  // Consider passing stream/download down as props if player is part of a list.
  const { stream, download } = usePodcasts(podcast.language_code);

  const [sourceUri, setSourceUri] = useState<string | null>(null);
  // Use download mutation's loading state for download-specific loading
  // const [loading, setLoading] = useState(false); // Can remove this if only download mutation state is needed
  const [isStreamingLoading, setIsStreamingLoading] = useState(false); // Specific loading state for stream button
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [playerError, setPlayerError] = useState<string | null>(null);

  // Audio player instance - will automatically update when sourceUri changes
  const player = useAudioPlayer(
    sourceUri ? { uri: sourceUri } : null, // Pass the source object or null
    /* updateIntervalMs */ 500
  );
  const status = useAudioPlayerStatus(player);

  // --- Effects ---

  // Disable loop
  useEffect(() => {
    if (player) {
      player.loop = false;
    }
  }, [player]);

  // Stop & reset on finish
  useEffect(() => {
    if (status?.didJustFinish) {
      console.log("Playback finished.");
      // Optionally keep it paused at the end instead of seeking to 0
      // player.pause();
      // player.seekTo(0);
    }
  }, [status?.didJustFinish]);

  // Auto-play when loaded (if it was intended to play)
  // This might need adjustment based on whether stream/download initiated playback
  // useEffect(() => {
  //   if (sourceUri && status?.isLoaded && !status.playing && !status.didJustFinish) {
  //      console.log("Auto-playing loaded sound.");
  //      player.play();
  //   }
  // }, [sourceUri, status?.isLoaded, status?.playing, status?.didJustFinish, player]);

  // Reset source URI if the podcast prop changes
  useEffect(() => {
    setSourceUri(null);
    setPlayerError(null);
    setDownloadProgress(0);
    // player?.unload(); // Optionally unload previous sound immediately
  }, [podcast.id]); // Reset when podcast ID changes

  // --- Handlers ---

  // STREAM handler (now synchronous call to get URL)
  const handleStream = useCallback(() => {
    if (!podcast.sound_path) {
      console.error("No sound path available for streaming.");
      setPlayerError("Audio path missing.");
      return;
    }
    setIsStreamingLoading(true);
    setPlayerError(null);
    setSourceUri(null); // Reset source URI to trigger player reload
    setDownloadProgress(0); // Reset download progress indicator

    try {
      // Get the public URL *synchronously* from the hook
      const publicUrl = stream(podcast.sound_path); // NO await needed

      if (!publicUrl) {
        console.error("Streaming error: Could not get public URL.");
        setPlayerError("Failed to get streaming URL.");
        setIsStreamingLoading(false);
      } else {
        console.log("Setting sourceUri for streaming:", publicUrl);
        setSourceUri(publicUrl);
        // Loading state will resolve when player status updates (isLoaded=true or error)
        // setIsStreamingLoading(false); // Removed - rely on player status
      }
    } catch (err) {
      // Catch unexpected errors from the stream function itself
      console.error("Streaming error (unexpected):", err);
      setPlayerError("An unexpected error occurred.");
      setIsStreamingLoading(false);
    }
  }, [podcast.sound_path, stream]); // Dependencies for useCallback

  // DOWNLOAD & PLAY handler
  const handleDownloadAndPlay = useCallback(async () => {
    if (!podcast.sound_path) {
      console.error("No sound path available for download.");
      setPlayerError("Audio path missing.");
      return;
    }
    setPlayerError(null);
    setSourceUri(null); // Reset source URI
    setDownloadProgress(0); // Reset progress

    try {
      // Use the mutateAsync function from the download mutation object
      const localUri = await download.mutateAsync(
        {
          soundPath: podcast.sound_path,
          onProgress: (frac) => setDownloadProgress(frac), // Update progress state
        },
        {
          // Optional: onSuccess/onError specifically for this call
          onSuccess: (uri) =>
            console.log("Download successful via mutateAsync:", uri),
          onError: (err) =>
            console.error("Download failed via mutateAsync:", err),
        }
      );

      console.log("Setting sourceUri from download:", localUri);
      setSourceUri(localUri); // Set the local file URI as the source
    } catch (err) {
      // Error is already handled by onError in mutation, but catch potential issues
      console.error("Download error in component:", err);
      setPlayerError("Download failed.");
      setDownloadProgress(0); // Reset progress on error
    }
  }, [podcast.sound_path, download]); // Dependencies for useCallback

  // --- Player Controls (Memoized) ---
  const togglePlayPause = useCallback(() => {
    if (!status?.isLoaded) return;
    status.playing ? player.pause() : player.play();
  }, [player, status?.isLoaded, status?.playing]);

  // Inside your PodcastPlayer component, near the other useEffects:
useEffect(() => {
  // Log the full status object whenever it changes
  // Use a label to easily find it in your logs
  console.log("PLAYER STATUS:", JSON.stringify(status, null, 2));

  // Also explicitly log the error if it exists
  if (status?.error) {
     console.error("PLAYER ERROR DETECTED:", status.error);
     // Ensure the error state is being set for UI feedback
     setPlayerError(status.error);
  }
}, [status]); // Dependency array makes it run whenever status changes

  const goBack = useCallback(() => {
    if (!status?.isLoaded || !status.duration) return; // Need duration to seek correctly
    const newPosition = Math.max(0, status.currentTime - 15000); // Seek expects ms
    player.seekTo(newPosition);
  }, [player, status?.isLoaded, status?.currentTime, status?.duration]);

  const goForward = useCallback(() => {
    if (!status?.isLoaded || !status.duration) return; // Need duration
    const newPosition = Math.min(status.duration, status.currentTime + 15000); // Seek expects ms
    player.seekTo(newPosition);
  }, [player, status?.isLoaded, status?.currentTime, status?.duration]);

  const stopPlayback = useCallback(() => {
    if (!status?.isLoaded) return;
    player.pause();
    player.seekTo(0);
    // Optionally unload or reset sourceUri here if needed
    // setSourceUri(null);
  }, [player, status?.isLoaded]);

  // --- Render Logic ---

  // Display loading indicator based on relevant states
  const isLoading =
    isStreamingLoading ||
    download.isPending ||
    (sourceUri && status?.isLoading);
  const canPlay = status?.isLoaded && !status.error;
  const showInitialButtons = !sourceUri && !isLoading && !playerError;
  const showPlaybackControls = sourceUri && canPlay;
  const showDownloadProgress = download.isPending;

  // Format time helper
  const formatTime = (millis: number | undefined | null): string => {
    if (millis === undefined || millis === null || isNaN(millis)) return "0:00";
    const totalSeconds = Math.floor(millis / 1000);
    const seconds = totalSeconds % 60;
    const minutes = Math.floor(totalSeconds / 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{podcast.title}</Text>
      <Text style={styles.desc}>{podcast.description}</Text>

      {/* Error Display */}
      {playerError && (
        <Text style={styles.errorText}>Error: {playerError}</Text>
      )}
      {status?.error && (
        <Text style={styles.errorText}>Player Error: {status.error}</Text>
      )}

      {/* Loading Indicator */}
      {isLoading && <ActivityIndicator style={styles.loader} />}

      {/* Download Progress Bar */}
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

      {/* Initial Action Buttons */}
      {showInitialButtons && (
        <>
          <Button
            title="Stream Episode"
            onPress={handleStream}
            disabled={isLoading}
          />
          <View style={styles.spacer} />
          <Button
            title="Download & Play"
            onPress={handleDownloadAndPlay}
            disabled={isLoading}
          />
        </>
      )}

      {/* Playback Controls and Time */}
      {showPlaybackControls && (
        <>
          <View style={styles.timeContainer}>
            <Text>{formatTime(status?.currentTime)}</Text>
            <Text>{formatTime(status?.duration)}</Text>
          </View>
          {/* Add a simple Slider here if desired */}
          {/* <Slider value={status?.currentTime} maximumValue={status?.duration} ... /> */}

          <View style={styles.controls}>
            <Button
              title="⏪ 15s"
              onPress={goBack}
              disabled={isLoading || !canPlay}
            />
            <Button
              title={status?.playing ? "Pause" : "Play"}
              onPress={togglePlayPause}
              disabled={isLoading || !canPlay}
            />
            <Button
              title="15s ⏩"
              onPress={goForward}
              disabled={isLoading || !canPlay}
            />
          </View>
          <Button
            title="Stop"
            onPress={stopPlayback}
            disabled={isLoading || !canPlay}
          />
        </>
      )}
    </View>
  );
};

// --- Styles --- (Add errorText and timeContainer)
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
  loader: { marginVertical: 16 },
  spacer: { height: 8 },
  errorText: {
    color: "red",
    marginVertical: 8,
    textAlign: "center",
  },
  progressContainer: {
    width: "100%",
    height: 6, // Slightly thicker
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
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginVertical: 12,
  },
});
