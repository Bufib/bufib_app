// import React, { useEffect, useState, useCallback } from "react";
// import {
//   View,
//   Text,
//   Button,
//   ActivityIndicator,
//   StyleSheet,
//   // Slider // Import if using
// } from "react-native";
// import { useAudioPlayer, useAudioPlayerStatus, AudioStatus } from "expo-audio";
// import { PodcastType } from "@/constants/Types"; // Adjust path if needed
// import { usePodcasts } from "@/hooks/useFetchPodcasts"; // Adjust path if needed

// interface PodcastPlayerProps {
//   podcast: PodcastType;
// }

// export const PodcastPlayer: React.FC<PodcastPlayerProps> = ({ podcast }) => {
//   const { stream, download } = usePodcasts(podcast.language_code);

//   const [sourceUri, setSourceUri] = useState<string | null>(null);
//   const [isPreparingStream, setIsPreparingStream] = useState(false);
//   const [downloadProgress, setDownloadProgress] = useState(0);
//   const [playerError, setPlayerError] = useState<string | null>(null);
//   // State to prevent auto-play after manual pause/stop
//   const [didInitiatePlayback, setDidInitiatePlayback] = useState(false);

//   const player = useAudioPlayer(sourceUri ? { uri: sourceUri } : null, 500);
//   const status: AudioStatus | null = useAudioPlayerStatus(player);

//   // --- Effects ---

//   useEffect(() => {
//     // Ensure player doesn't loop
//     if (player) player.loop = false;
//   }, [player]);

//   useEffect(() => {
//     // Log when playback finishes naturally
//     if (status?.didJustFinish) {
//       console.log("Playback finished.");
//       setDidInitiatePlayback(false); // Allow auto-play if user restarts action
//     }
//   }, [status?.didJustFinish]);

//   useEffect(() => {
//     // Reset component state when the podcast prop changes
//     setSourceUri(null);
//     setPlayerError(null);
//     setDownloadProgress(0);
//     setIsPreparingStream(false);
//     setDidInitiatePlayback(false); // Reset playback flag
//   }, [podcast.id]);

//   useEffect(() => {
//     // Optional: Log status for debugging
//     // console.log("PLAYER STATUS:", JSON.stringify(status, null, 2));
//   }, [status]);

//   // Auto-play only once after initial load
//   useEffect(() => {
//     if (
//       player &&
//       sourceUri &&
//       status?.isLoaded &&
//       !status.playing &&
//       !playerError &&
//       !status.didJustFinish &&
//       !didInitiatePlayback // Only run if not manually paused/stopped/played
//     ) {
//       console.log("Auto-playing initial load...");
//       try {
//         player.play();
//         setDidInitiatePlayback(true); // Mark auto-play as done
//       } catch (err) {
//         const errorMsg =
//           err instanceof Error ? err.message : "Unknown playback error";
//         console.error("Synchronous Auto-play failed:", errorMsg);
//         setPlayerError(`Failed to start playback: ${errorMsg}`);
//       }
//     }
//   }, [
//     player,
//     sourceUri,
//     status?.isLoaded,
//     status?.playing,
//     playerError,
//     status?.didJustFinish,
//     didInitiatePlayback, // Add flag to dependencies
//   ]);

//   // --- Handlers ---

//   const handleStream = useCallback(() => {
//     if (!podcast.sound_path) {
//       setPlayerError("Audio path missing.");
//       return;
//     }
//     setIsPreparingStream(true);
//     setPlayerError(null);
//     setSourceUri(null);
//     setDownloadProgress(0);
//     setDidInitiatePlayback(false); // Reset flag for potential auto-play

//     try {
//       const publicUrl = stream(podcast.sound_path);
//       if (!publicUrl) {
//         setPlayerError("Failed to get streaming URL.");
//         setIsPreparingStream(false);
//       } else {
//         setSourceUri(publicUrl);
//         setIsPreparingStream(false); // Stop prep loading
//       }
//     } catch (err) {
//       const errorMsg =
//         err instanceof Error ? err.message : "Unknown streaming error";
//       console.error("Streaming error (unexpected):", errorMsg);
//       setPlayerError(`Streaming error: ${errorMsg}`);
//       setIsPreparingStream(false);
//     }
//   }, [podcast.sound_path, stream]);

//   const handleDownloadAndPlay = useCallback(async () => {
//     if (!podcast.sound_path) {
//       setPlayerError("Audio path missing.");
//       return;
//     }
//     setPlayerError(null);
//     setSourceUri(null);
//     setDownloadProgress(0);
//     setIsPreparingStream(false);
//     setDidInitiatePlayback(false); // Reset flag for potential auto-play

//     try {
//       const localUri = await download.mutateAsync({
//         soundPath: podcast.sound_path,
//         onProgress: setDownloadProgress,
//       });
//       setSourceUri(localUri);
//     } catch (err) {
//       const errorMsg =
//         err instanceof Error ? err.message : "Unknown download error";
//       console.error("Download error in component:", errorMsg);
//       setPlayerError(`Download failed: ${errorMsg}`);
//       setDownloadProgress(0);
//     }
//   }, [podcast.sound_path, download]);

//   // --- Player Controls ---
//   const togglePlayPause = useCallback(() => {
//     if (!status?.isLoaded || !!playerError) return;
//     if (status.playing) {
//       player.pause();
//       // User manually paused, auto-play should not restart it.
//       // No need to change didInitiatePlayback here.
//     } else {
//       try {
//         player.play();
//         setDidInitiatePlayback(true); // User manually started play
//       } catch (err) {
//         const errorMsg =
//           err instanceof Error ? err.message : "Unknown playback error";
//         setPlayerError(`Play command failed: ${errorMsg}`);
//       }
//     }
//   }, [player, status?.isLoaded, status?.playing, playerError]);

//   const goBack = useCallback(() => {
//     if (!status?.isLoaded || !status.duration || !!playerError) return;
//     const newPosition = Math.max(0, status.currentTime - 15000);
//     player.seekTo(newPosition);
//   }, [
//     player,
//     status?.isLoaded,
//     status?.currentTime,
//     status?.duration,
//     playerError,
//   ]);

//   const goForward = useCallback(() => {
//     if (!status?.isLoaded || !status.duration || !!playerError) return;
//     const newPosition = Math.min(status.duration, status.currentTime + 15000);
//     player.seekTo(newPosition);
//   }, [
//     player,
//     status?.isLoaded,
//     status?.currentTime,
//     status?.duration,
//     playerError,
//   ]);

//   const stopPlayback = useCallback(() => {
//     if (!status?.isLoaded || !!playerError) return;
//     player.pause();
//     player.seekTo(0);
//     // User manually stopped, auto-play should not restart it.
//     // No need to change didInitiatePlayback here.
//   }, [player, status?.isLoaded, playerError]);

//   // --- Render Logic ---
//   const isPlayerActuallyLoading = !!(sourceUri && !status?.isLoaded);
//   const isPreparing = isPreparingStream || download.isPending;
//   const isLoading = isPreparing || isPlayerActuallyLoading;
//   const canPlay = !!status?.isLoaded;

//   const showInitialButtons = !sourceUri && !isLoading && !playerError;
//   const showPlaybackControls = sourceUri && canPlay;
//   const showDownloadProgress = download.isPending;
//   const controlsDisabled = isLoading || !canPlay || !!playerError;

//   const formatTime = (millis: number | undefined | null): string => {
//     if (millis === undefined || millis === null || isNaN(millis) || millis < 0)
//       return "0:00";
//     const totalSeconds = Math.floor(millis / 1000);
//     const seconds = totalSeconds % 60;
//     const minutes = Math.floor(totalSeconds / 60);
//     return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>{podcast.title}</Text>
//       <Text style={styles.desc} numberOfLines={2}>
//         {podcast.description}
//       </Text>

//       {playerError && (
//         <Text style={styles.errorText}>Error: {playerError}</Text>
//       )}
//       {isLoading && !playerError && <ActivityIndicator style={styles.loader} />}

//       {showDownloadProgress && (
//         <>
//           <View style={styles.progressContainer}>
//             <View
//               style={[
//                 styles.progressBar,
//                 { width: `${Math.round(downloadProgress * 100)}%` },
//               ]}
//             />
//           </View>
//           <Text style={styles.progressText}>
//             Downloading: {Math.round(downloadProgress * 100)}%
//           </Text>
//         </>
//       )}

//       {showInitialButtons && (
//         <>
//           <Button
//             title="Stream Episode"
//             onPress={handleStream}
//             disabled={isLoading}
//           />
//           <View style={styles.spacer} />
//           <Button
//             title="Download & Play"
//             onPress={handleDownloadAndPlay}
//             disabled={isLoading}
//           />
//         </>
//       )}

//       {showPlaybackControls && !playerError && (
//         <>
//           <View style={styles.timeContainer}>
//             <Text>{formatTime(status?.currentTime)}</Text>
//             <Text>{formatTime(status?.duration)}</Text>
//           </View>
//           {/* Optional: <Slider /> component here */}
//           <View style={styles.controls}>
//             <Button
//               title="⏪ 15s"
//               onPress={goBack}
//               disabled={controlsDisabled}
//             />
//             <Button
//               title={status?.playing ? "Pause" : "Play"}
//               onPress={togglePlayPause}
//               disabled={controlsDisabled}
//             />
//             <Button
//               title="15s ⏩"
//               onPress={goForward}
//               disabled={controlsDisabled}
//             />
//           </View>
//           <Button
//             title="Stop"
//             onPress={stopPlayback}
//             disabled={controlsDisabled}
//           />
//         </>
//       )}
//     </View>
//   );
// };

// // --- Styles ---
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
//   loader: { marginVertical: 16, alignSelf: "center" },
//   spacer: { height: 8 },
//   errorText: { color: "red", marginVertical: 8, textAlign: "center" },
//   progressContainer: {
//     width: "100%",
//     height: 6,
//     backgroundColor: "#e0e0e0",
//     borderRadius: 3,
//     overflow: "hidden",
//     marginVertical: 8,
//   },
//   progressBar: { height: "100%", backgroundColor: "#3b82f6" },
//   progressText: {
//     textAlign: "center",
//     fontSize: 12,
//     color: "#444",
//     marginBottom: 8,
//   },
//   timeContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginVertical: 5,
//     paddingHorizontal: 10,
//   },
//   controls: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     alignItems: "center",
//     marginVertical: 12,
//   },
// });

// import React, { useEffect, useState, useCallback } from "react";
// import {
//   View,
//   Text,
//   Button,
//   ActivityIndicator,
//   StyleSheet,
//   // Slider // Import if using
// } from "react-native";
// import { useAudioPlayer, useAudioPlayerStatus, AudioStatus } from "expo-audio";
// import { PodcastType } from "@/constants/Types"; // Adjust path if needed
// import { usePodcasts } from "@/hooks/useFetchPodcasts"; // Adjust path if needed

// interface PodcastPlayerProps {
//   podcast: PodcastType;
// }

// export const PodcastPlayer: React.FC<PodcastPlayerProps> = ({ podcast }) => {
//   const { stream, download } = usePodcasts(podcast.language_code);

//   const [sourceUri, setSourceUri] = useState<string | null>(null);
//   const [isPreparingStream, setIsPreparingStream] = useState(false);
//   const [downloadProgress, setDownloadProgress] = useState(0);
//   const [playerError, setPlayerError] = useState<string | null>(null);
//   const [didInitiatePlayback, setDidInitiatePlayback] = useState(false);

//   const player = useAudioPlayer(sourceUri ? { uri: sourceUri } : null, 500);
//   const status: AudioStatus | null = useAudioPlayerStatus(player);

//   // --- Effects ---

//   useEffect(() => {
//     if (player) player.loop = false;
//   }, [player]);

//   useEffect(() => {
//     if (status?.didJustFinish) {
//       console.log("Playback finished.");
//       setDidInitiatePlayback(false);
//     }
//   }, [status?.didJustFinish]);

//   useEffect(() => {
//     setSourceUri(null);
//     setPlayerError(null);
//     setDownloadProgress(0);
//     setIsPreparingStream(false);
//     setDidInitiatePlayback(false);
//   }, [podcast.id]);

//   useEffect(() => {
//     // console.log("PLAYER STATUS:", JSON.stringify(status, null, 2));
//   }, [status]);

//   useEffect(() => {
//     if (
//       player &&
//       sourceUri &&
//       status?.isLoaded &&
//       !status.playing &&
//       !playerError &&
//       !status.didJustFinish &&
//       !didInitiatePlayback
//     ) {
//       console.log("Auto-playing initial load...");
//       try {
//         player.play();
//         setDidInitiatePlayback(true);
//       } catch (err) {
//         const errorMsg =
//           err instanceof Error ? err.message : "Unknown playback error";
//         console.error("Synchronous Auto-play failed:", errorMsg);
//         setPlayerError(`Failed to start playback: ${errorMsg}`);
//       }
//     }
//   }, [
//     player,
//     sourceUri,
//     status?.isLoaded,
//     status?.playing,
//     playerError,
//     status?.didJustFinish,
//     didInitiatePlayback,
//   ]);

//   // --- Handlers ---

//   const handleStream = useCallback(() => {
//     if (!podcast.sound_path) {
//       setPlayerError("Audio path missing.");
//       return;
//     }
//     setIsPreparingStream(true);
//     setPlayerError(null);
//     setSourceUri(null);
//     setDownloadProgress(0);
//     setDidInitiatePlayback(false);

//     try {
//       const publicUrl = stream(podcast.sound_path);
//       if (!publicUrl) {
//         setPlayerError("Failed to get streaming URL.");
//         setIsPreparingStream(false);
//       } else {
//         setSourceUri(publicUrl);
//         setIsPreparingStream(false);
//       }
//     } catch (err) {
//       const errorMsg =
//         err instanceof Error ? err.message : "Unknown streaming error";
//       console.error("Streaming error (unexpected):", errorMsg);
//       setPlayerError(`Streaming error: ${errorMsg}`);
//       setIsPreparingStream(false);
//     }
//   }, [podcast.sound_path, stream]);

//   const handleDownloadAndPlay = useCallback(async () => {
//     if (!podcast.sound_path) {
//       setPlayerError("Audio path missing.");
//       return;
//     }
//     setPlayerError(null);
//     setSourceUri(null);
//     setDownloadProgress(0);
//     setIsPreparingStream(false);
//     setDidInitiatePlayback(false);

//     try {
//       const localUri = await download.mutateAsync({
//         soundPath: podcast.sound_path,
//         onProgress: setDownloadProgress,
//       });
//       setSourceUri(localUri);
//     } catch (err) {
//       const errorMsg =
//         err instanceof Error ? err.message : "Unknown download error";
//       console.error("Download error in component:", errorMsg);
//       setPlayerError(`Download failed: ${errorMsg}`);
//       setDownloadProgress(0);
//     }
//   }, [podcast.sound_path, download]);

//   // --- Player Controls ---
//   const togglePlayPause = useCallback(() => {
//     if (!status?.isLoaded || !!playerError) return;
//     if (status.playing) {
//       player.pause();
//     } else {
//       try {
//         player.play();
//         setDidInitiatePlayback(true);
//       } catch (err) {
//         const errorMsg =
//           err instanceof Error ? err.message : "Unknown playback error";
//         setPlayerError(`Play command failed: ${errorMsg}`);
//       }
//     }
//   }, [player, status?.isLoaded, status?.playing, playerError]);

//   const goBack = useCallback(() => {
//     if (!status?.isLoaded || !status.duration || !!playerError) return;
//     const newPosition = Math.max(0, status.currentTime - 15000);
//     player.seekTo(newPosition);
//   }, [
//     player,
//     status?.isLoaded,
//     status?.currentTime,
//     status?.duration,
//     playerError,
//   ]);

//   const goForward = useCallback(() => {
//     if (!status?.isLoaded || !status.duration || !!playerError) return;
//     const newPosition = Math.min(status.duration, status.currentTime + 15000);
//     player.seekTo(newPosition);
//   }, [
//     player,
//     status?.isLoaded,
//     status?.currentTime,
//     status?.duration,
//     playerError,
//   ]);

//   const stopPlayback = useCallback(() => {
//     if (!status?.isLoaded || !!playerError) return;
//     player.pause();
//     player.seekTo(0);
//   }, [player, status?.isLoaded, playerError]);

//   // --- Render Logic ---
//   const isPlayerActuallyLoading = !!(sourceUri && !status?.isLoaded);
//   const isPreparing = isPreparingStream || download.isPending;
//   const isLoading = isPreparing || isPlayerActuallyLoading;
//   const canPlay = !!status?.isLoaded;

//   const showInitialButtons = !sourceUri && !isLoading && !playerError;
//   const showPlaybackControls = sourceUri && canPlay;
//   const showDownloadProgress = download.isPending;
//   const controlsDisabled = isLoading || !canPlay || !!playerError;

//   // Format time helper (kept for later, but not used in JSX currently)
//   const formatTime = (
//     label: string,
//     millis: number | undefined | null
//   ): string => {
//     if (
//       millis === undefined ||
//       millis === null ||
//       isNaN(millis) ||
//       millis < 0
//     ) {
//       return "0:00";
//     }
//     try {
//       const totalSeconds = Math.floor(millis / 1000);
//       const seconds = totalSeconds % 60;
//       const minutes = Math.floor(totalSeconds / 60);
//       const result = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
//       return result;
//     } catch (e) {
//       console.error(`formatTime (${label}) error:`, e);
//       return "0:00";
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>{podcast.title}</Text>
//       <Text style={styles.desc} numberOfLines={2}>
//         {podcast.description}
//       </Text>

//       {playerError && (
//         <Text style={styles.errorText}>Error: {playerError}</Text>
//       )}
//       {isLoading && !playerError && <ActivityIndicator style={styles.loader} />}

//       {showDownloadProgress && (
//         <>
//           <View style={styles.progressContainer}>
//             <View
//               style={[
//                 styles.progressBar,
//                 { width: `${Math.round(downloadProgress * 100)}%` },
//               ]}
//             />
//           </View>
//           <Text style={styles.progressText}>
//             Downloading: {Math.round(downloadProgress * 100)}%
//           </Text>
//         </>
//       )}

//       {showInitialButtons && (
//         <>
//           <Button
//             title="Stream Episode"
//             onPress={handleStream}
//             disabled={isLoading}
//           />
//           <View style={styles.spacer} />
//           <Button
//             title="Download & Play"
//             onPress={handleDownloadAndPlay}
//             disabled={isLoading}
//           />
//         </>
//       )}

//       {showPlaybackControls && !playerError && (
//         <>
//           <View style={styles.timeContainer}>
//             {/* *** CHANGE HERE: Display raw values for debugging *** */}
//             <Text>Current (ms): {status?.currentTime ?? "N/A"}</Text>
//             <Text>Duration (ms): {status?.duration ?? "N/A"}</Text>
//           </View>
//           {/* Optional: <Slider /> component here */}
//           <View style={styles.controls}>
//             <Button
//               title="⏪ 15s"
//               onPress={goBack}
//               disabled={controlsDisabled}
//             />
//             <Button
//               title={status?.playing ? "Pause" : "Play"}
//               onPress={togglePlayPause}
//               disabled={controlsDisabled}
//             />
//             <Button
//               title="15s ⏩"
//               onPress={goForward}
//               disabled={controlsDisabled}
//             />
//           </View>
//           <Button
//             title="Stop"
//             onPress={stopPlayback}
//             disabled={controlsDisabled}
//           />
//         </>
//       )}
//     </View>
//   );
// };

// // --- Styles ---
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
//   loader: { marginVertical: 16, alignSelf: "center" },
//   spacer: { height: 8 },
//   errorText: { color: "red", marginVertical: 8, textAlign: "center" },
//   progressContainer: {
//     width: "100%",
//     height: 6,
//     backgroundColor: "#e0e0e0",
//     borderRadius: 3,
//     overflow: "hidden",
//     marginVertical: 8,
//   },
//   progressBar: { height: "100%", backgroundColor: "#3b82f6" },
//   progressText: {
//     textAlign: "center",
//     fontSize: 12,
//     color: "#444",
//     marginBottom: 8,
//   },
//   timeContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginVertical: 5,
//     paddingHorizontal: 10,
//   },
//   controls: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     alignItems: "center",
//     marginVertical: 12,
//   },
// });

import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  StyleSheet,
  // Slider // Import if using
} from "react-native";
import { useAudioPlayer, useAudioPlayerStatus, AudioStatus } from "expo-audio";
import { PodcastType } from "@/constants/Types"; // Adjust path if needed
import { usePodcasts } from "@/hooks/useFetchPodcasts"; // Adjust path if needed

interface PodcastPlayerProps {
  podcast: PodcastType;
}

export const PodcastPlayer: React.FC<PodcastPlayerProps> = ({ podcast }) => {
  const { stream, download } = usePodcasts(podcast.language_code);

  const [sourceUri, setSourceUri] = useState<string | null>(null);
  const [isPreparingStream, setIsPreparingStream] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [playerError, setPlayerError] = useState<string | null>(null);
  const [didInitiatePlayback, setDidInitiatePlayback] = useState(false);

  const player = useAudioPlayer(sourceUri ? { uri: sourceUri } : null, 500);
  const status: AudioStatus | null = useAudioPlayerStatus(player);

  // --- Effects ---

  useEffect(() => {
    if (player) player.loop = false;
  }, [player]);

  useEffect(() => {
    if (status?.didJustFinish) {
      console.log("Playback finished.");
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
    // console.log("PLAYER STATUS:", JSON.stringify(status, null, 2));
  }, [status]);

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

  // --- Handlers ---

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
    const newPosition = Math.max(0, status.currentTime - 15000);
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
    const newPosition = Math.min(status.duration, status.currentTime + 15000);
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

  // --- Render Logic ---
  const isPlayerActuallyLoading = !!(sourceUri && !status?.isLoaded);
  const isPreparing = isPreparingStream || download.isPending;
  const isLoading = isPreparing || isPlayerActuallyLoading;
  const canPlay = !!status?.isLoaded;

  const showInitialButtons = !sourceUri && !isLoading && !playerError;
  const showPlaybackControls = sourceUri && canPlay;
  const showDownloadProgress = download.isPending;
  const controlsDisabled = isLoading || !canPlay || !!playerError;

  // Format time helper
  const formatTime = (seconds: number | null | undefined) => {
    if (!seconds || isNaN(seconds) || seconds < 0) {
      return "0:00";
    }
    const total = Math.floor(seconds); // already in seconds
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{podcast.title}</Text>
      <Text style={styles.desc} numberOfLines={2}>
        {podcast.description}
      </Text>

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

      {showPlaybackControls && !playerError && (
        <>
          <View style={styles.timeContainer}>
            {/* *** CHANGE HERE: Use formatTime again *** */}
            <Text>{formatTime(status?.currentTime)}</Text>
            <Text>{formatTime(status?.duration)}</Text>
          </View>
          {/* Optional: <Slider /> component here */}
          <View style={styles.controls}>
            <Button
              title="⏪ 15s"
              onPress={goBack}
              disabled={controlsDisabled}
            />
            <Button
              title={status?.playing ? "Pause" : "Play"}
              onPress={togglePlayPause}
              disabled={controlsDisabled}
            />
            <Button
              title="15s ⏩"
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
    </View>
  );
};

// --- Styles ---
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
  loader: { marginVertical: 16, alignSelf: "center" },
  spacer: { height: 8 },
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
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginVertical: 12,
  },
});
