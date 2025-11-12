// //! Works
// import React, { useEffect, useMemo, useRef, useState } from "react";
// import {
//   Animated,
//   Easing,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   useColorScheme,
//   View,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import Slider from "@react-native-community/slider";
// import { LinearGradient } from "expo-linear-gradient";
// import { Ionicons, AntDesign } from "@expo/vector-icons";
// import { Image } from "expo-image";
// import { Asset } from "expo-asset";
// import type { VideoSource } from "expo-video";
// import { useTranslation } from "react-i18next";

// import { Colors } from "@/constants/Colors";
// import type { PodcastPlayerPropsType } from "@/constants/Types";
// import HeaderLeftBackButton from "@/components/HeaderLeftBackButton";
// import { LoadingIndicator } from "@/components/LoadingIndicator";
// import { useGlobalPlayer } from "@/player/useGlobalPlayer";
// import { remoteUrlFor, usePodcasts } from "@/hooks/usePodcasts";
// import { useRefreshFavorites } from "@/stores/refreshFavoriteStore";
// import { isPodcastFavorited, togglePodcastFavorite } from "@/utils/favorites";

// export default function PodcastPlayer({ podcast }: PodcastPlayerPropsType) {
//   const { t } = useTranslation();
//   const scheme = useColorScheme() || "light";
//   const isDark = scheme === "dark";

//   // Artwork (local app logo)
//   const logoAsset = Asset.fromModule(require("@/assets/images/logo.png"));
//   const artworkUri: string | undefined = logoAsset?.uri || undefined;

//   // Global player state & actions
//   const {
//     isPlaying,
//     position,
//     duration,
//     status,
//     rate,
//     podcastId,
//     currentUri,
//     currentKey,
//     load,
//     play,
//     pause,
//     toggle,
//     seekBy,
//     setPosition,
//     setRate,
//     stopAndKeepSource,
//     stopAndUnload,
//   } = useGlobalPlayer();

//   // Cache/download helpers
//   const { download, getCachedUri } = usePodcasts(podcast?.language_code ?? "de");

//   // UI state
//   const [isFavorite, setIsFavorite] = useState(false);
//   const [playerError, setPlayerError] = useState<string | null>(null);
//   const [isSeeking, setIsSeeking] = useState(false);
//   const [showSpeedMenu, setShowSpeedMenu] = useState(false);
//   const [isStreamLoading, setIsStreamLoading] = useState(false);
//   const [downloadProgress, setDownloadProgress] = useState(0);

//   // Animations
//   const fadeAnim = useMemo(() => new Animated.Value(0), []);
//   const slideAnim = useMemo(() => new Animated.Value(50), []);

//   // Cached file, if available
//   const [cachedUri, setCachedUri] = useState<string | null>(null);
//   useEffect(() => {
//     let alive = true;
//     (async () => {
//       if (!podcast?.filename) {
//         if (alive) setCachedUri(null);
//         return;
//       }
//       try {
//         const uri = await getCachedUri(podcast.filename);
//         if (alive) setCachedUri(uri ?? null);
//       } catch {
//         if (alive) setCachedUri(null);
//       }
//     })();
//     return () => {
//       alive = false;
//     };
//   }, [podcast?.id, podcast?.filename, getCachedUri]);

//   // Favorite
//   useEffect(() => {
//     (async () => {
//       if (!podcast?.id) return;
//       try {
//         setIsFavorite(await isPodcastFavorited(podcast.id));
//       } catch {}
//     })();
//   }, [podcast?.id]);
//   const { triggerRefreshFavorites } = useRefreshFavorites();
//   const onPressToggleFavorite = async () => {
//     if (!podcast?.id) return;
//     try {
//       const next = await togglePodcastFavorite(podcast.id);
//       setIsFavorite(next);
//       triggerRefreshFavorites();
//     } catch {}
//   };

//   // Loaded/visibility flags
//   const isThisEpisodeLoaded =
//     podcastId === podcast?.id &&
//     !!(currentUri || currentKey) &&
//     status !== "stopped" &&
//     status !== "idle";

//   // Let controls show as soon as it's loaded (even if duration isn't known yet)
//   const showPlaybackControls = isThisEpisodeLoaded && !playerError;

//   // Only consider as "loading" when streaming or actively downloading
//   const isLoading = download.isPending || isStreamLoading;
//   const controlsDisabled = isLoading || !!playerError || isSeeking;

//   // If nothing for this episode is loaded yet, we show initial area.
//   const shouldShowInitial = !isThisEpisodeLoaded && !isLoading && !playerError;

//   // When initial area is shown, always unload any previous episode to avoid autoplay behind UI
//   useEffect(() => {
//     if (shouldShowInitial) stopAndUnload();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [shouldShowInitial, podcast?.id]);

//   // ✅ NEW: If cached, preload the source (no autoplay) and show full controls paused.
//   useEffect(() => {
//     if (shouldShowInitial && cachedUri) {
//       const src: VideoSource = {
//         uri: cachedUri,
//         metadata: {
//           title: podcast.title ?? "Podcast",
//           artist: "Podcast",
//           ...(artworkUri ? { artwork: artworkUri } : {}),
//         },
//       };
//       load(src, {
//         autoplay: false, // ← important: show UI paused, wait for user to press play
//         title: podcast.title,
//         artwork: artworkUri,
//         podcastId: podcast.id,
//         filename: podcast.filename,
//         rate,
//       }).catch((e) => setPlayerError(e?.message ?? "Player error"));
//     }
//   }, [
//     shouldShowInitial,
//     cachedUri,
//     load,
//     podcast.id,
//     podcast.filename,
//     podcast.title,
//     artworkUri,
//     rate,
//   ]);

//   // Entrance animation
//   useEffect(() => {
//     Animated.parallel([
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 800,
//         useNativeDriver: true,
//       }),
//       Animated.timing(slideAnim, {
//         toValue: 0,
//         duration: 600,
//         easing: Easing.out(Easing.cubic),
//         useNativeDriver: true,
//       }),
//     ]).start();
//   }, [fadeAnim, slideAnim]);

//   // Actions
//   const toSource = (uri: string): VideoSource => ({
//     uri,
//     metadata: {
//       title: podcast.title ?? "Podcast",
//       artist: "Podcast",
//       ...(artworkUri ? { artwork: artworkUri } : {}),
//     },
//   });

//   const handleStream = () => {
//     setPlayerError(null);
//     if (!podcast?.filename) {
//       setPlayerError("Audio path missing.");
//       return;
//     }
//     const remote = remoteUrlFor(podcast.filename);
//     if (!remote) {
//       setPlayerError("Cannot create stream URL.");
//       return;
//     }
//     setIsStreamLoading(true);
//     load(toSource(remote), {
//       autoplay: true,
//       title: podcast.title,
//       artwork: artworkUri,
//       podcastId: podcast.id,
//       filename: podcast.filename,
//       rate,
//     }).catch((e) => setPlayerError(e?.message ?? "Player error"));
//   };

//   const handleDownload = async () => {
//     setPlayerError(null);
//     if (!podcast?.filename) {
//       setPlayerError("Audio path missing.");
//       return;
//     }
//     setDownloadProgress(0);
//     try {
//       const localUri = await download.mutateAsync({
//         filename: podcast.filename,
//         onProgress: (p) => setDownloadProgress(p),
//       });
//       setCachedUri(localUri);
//       // Do not autoplay; user will press play (but now the source is cached)
//       load(toSource(localUri), {
//         autoplay: false,
//         title: podcast.title,
//         artwork: artworkUri,
//         podcastId: podcast.id,
//         filename: podcast.filename,
//         rate,
//       }).catch((e) => setPlayerError(e?.message ?? "Player error"));
//     } catch (err: any) {
//       setPlayerError(err?.message ?? "Download failed");
//       setDownloadProgress(0);
//     }
//   };

//   const togglePlayPause = () => {
//     if (playerError || !isThisEpisodeLoaded) return;
//     toggle();
//   };

//   const goBack = () => {
//     if (!isThisEpisodeLoaded) return;
//     seekBy(-15);
//   };
//   const goForward = () => {
//     if (!isThisEpisodeLoaded) return;
//     seekBy(15);
//   };

//   // Scrub: pause → seek (seekBy for tiny nudges) → resume if needed
//   const wasPlayingRef = useRef(false);
//   const startPosRef = useRef(0);
//   const onScrubStart = () => {
//     wasPlayingRef.current = isPlaying;
//     pause();
//     startPosRef.current = position || 0;
//     setIsSeeking(true);
//   };
//   const handleSeek = (value: number) => {
//     setIsSeeking(false);
//     const delta = value - startPosRef.current;
//     if (Math.abs(delta) < 1) seekBy(delta);
//     else setPosition(value);
//     if (wasPlayingRef.current) play();
//   };

//   const stopPlayback = async () => {
//     if (!isThisEpisodeLoaded) return;
//     await stopAndKeepSource();
//   };

//   const formatTime = (secs?: number | null): string => {
//     if (!secs || secs < 0 || isNaN(secs)) return "0:00";
//     const total = Math.floor(secs);
//     const hours = Math.floor(total / 3600);
//     const minutes = Math.floor((total % 3600) / 60);
//     const seconds = total % 60;
//     if (hours > 0) {
//       return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
//         .toString()
//         .padStart(2, "0")}`;
//     }
//     return `${minutes}:${seconds.toString().padStart(2, "0")}`;
//   };

//   // UI render
//   const showDownloadProgress = download.isPending;
//   // Only show the Stream/Download choices when NOT cached and nothing is loaded
//   const showInitialButtons = shouldShowInitial && !cachedUri;

//   return (
//     <LinearGradient
//       colors={isDark ? ["#242c40", "#27272a"] : ["#6366f1", "#818cf8"]}
//       style={styles.heroSection}
//     >
//       <SafeAreaView style={{ flex: 1 }} edges={["top", "left"]}>
//         <View style={{ marginLeft: 20 }}>
//           <HeaderLeftBackButton color={isDark ? "#fff" : "#000"} size={35} />
//         </View>

//         <ScrollView
//           style={styles.container}
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={{ flexGrow: 0 }}
//         >
//           <Animated.View
//             style={[
//               styles.content,
//               { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
//             ]}
//           >
//             {/* Header / Artwork / Info */}
//             <View style={styles.headerContainer}>
//               <View style={styles.coverArtContainer}>
//                 <Image
//                   source={require("@/assets/images/logo.png")}
//                   style={styles.coverArt}
//                   contentFit="cover"
//                 />
//                 <View style={styles.coverArtShadow} />
//               </View>

//               <View style={styles.podcastInfo}>
//                 <Text style={styles.podcastTitle} numberOfLines={2}>
//                   {podcast.title}
//                 </Text>
//               </View>

//               <Text style={styles.podcastDescription} numberOfLines={3}>
//                 {podcast.description}
//               </Text>

//               <View style={{ flexDirection: "row", gap: 20 }}>
//                 {showPlaybackControls && (
//                   <View style={styles.durationContainer}>
//                     <Ionicons name="time-outline" size={16} color="#fff" />
//                     <Text style={styles.durationText}>
//                       {formatTime(duration)}
//                     </Text>
//                   </View>
//                 )}
//                 <TouchableOpacity
//                   onPress={onPressToggleFavorite}
//                   style={styles.favoriteButton}
//                 >
//                   <AntDesign
//                     name={isFavorite ? "star" : "staro"}
//                     size={25}
//                     color={isFavorite ? Colors.universal.favorite : "#fff"}
//                   />
//                 </TouchableOpacity>
//               </View>
//             </View>

//             {/* Error */}
//             {!!playerError && (
//               <View style={styles.errorContainer}>
//                 <Ionicons name="alert-circle" size={24} color="#ff6b6b" />
//                 <Text style={styles.errorText}>{playerError}</Text>
//               </View>
//             )}

//             {/* Download Progress */}
//             {showDownloadProgress && (
//               <View style={styles.downloadContainer}>
//                 <Text style={styles.downloadText}>
//                   {t("downloading")} {Math.round(downloadProgress * 100)}%
//                 </Text>
//                 <View style={styles.progressBarContainer}>
//                   <View
//                     style={[
//                       styles.progressBar,
//                       { width: `${Math.round(downloadProgress * 100)}%` },
//                     ]}
//                   />
//                 </View>
//               </View>
//             )}

//             {/* Initial Actions (only when NOT cached) */}
//             {showInitialButtons && (
//               <View style={{ gap: 10, marginHorizontal: 10 }}>
//                 <TouchableOpacity
//                   style={styles.downloadButton}
//                   onPress={handleStream}
//                   disabled={isLoading}
//                 >
//                   <LinearGradient
//                     colors={["#667eea", "#764ba2"]}
//                     style={styles.downloadButtonGradient}
//                   >
//                     <Ionicons name="play" size={24} color="#fff" />
//                     <Text style={styles.downloadButtonText}>{t("stream")}</Text>
//                   </LinearGradient>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   style={styles.downloadButton}
//                   onPress={handleDownload}
//                   disabled={isLoading}
//                 >
//                   <LinearGradient
//                     colors={["#667eea", "#764ba2"]}
//                     style={styles.downloadButtonGradient}
//                   >
//                     <Ionicons name="download" size={24} color="#fff" />
//                     <Text style={styles.downloadButtonText}>
//                       {t("download")}
//                     </Text>
//                   </LinearGradient>
//                 </TouchableOpacity>
//               </View>
//             )}

//             {/* Loading */}
//             {isLoading && !playerError && (
//               <View style={styles.loadingContainer}>
//                 <LoadingIndicator size="large" />
//                 <Text style={styles.loadingText}>
//                   {download.isPending
//                     ? t("preparing")
//                     : isStreamLoading
//                     ? t("loading_stream")
//                     : t("downloading")}
//                 </Text>
//               </View>
//             )}

//             {/* Player Controls (visible as soon as source is loaded; paused until user hits play) */}
//             {showPlaybackControls && !playerError && (
//               <View
//                 style={[
//                   styles.playerContainer,
//                   {
//                     backgroundColor: Colors[scheme].contrast,
//                     shadowColor: Colors[scheme].border,
//                   },
//                 ]}
//               >
//                 {/* Progress */}
//                 <View style={styles.progressSection}>
//                   <View style={styles.timeLabels}>
//                     <Text style={styles.timeText}>{formatTime(position)}</Text>
//                     <Text style={styles.timeText}>{formatTime(duration)}</Text>
//                   </View>

//                   <Slider
//                     style={styles.progressSlider}
//                     value={Math.min(position || 0, duration || 0)}
//                     minimumValue={0}
//                     maximumValue={duration || 0}
//                     onSlidingStart={() => {
//                       wasPlayingRef.current = isPlaying;
//                       pause();
//                       setIsSeeking(true);
//                       startPosRef.current = position || 0;
//                     }}
//                     onSlidingComplete={(value) => {
//                       setIsSeeking(false);
//                       const delta = value - startPosRef.current;
//                       if (Math.abs(delta) < 1) seekBy(delta);
//                       else setPosition(value);
//                       if (wasPlayingRef.current) play();
//                     }}
//                     minimumTrackTintColor="#667eea"
//                     maximumTrackTintColor={isDark ? "#333" : "#ddd"}
//                     thumbTintColor="#667eea"
//                     disabled={controlsDisabled}
//                   />
//                 </View>

//                 {/* Main Controls */}
//                 <View style={styles.mainControls}>
//                   <TouchableOpacity
//                     style={styles.skipButton}
//                     onPress={goBack}
//                     disabled={controlsDisabled}
//                   >
//                     <Ionicons
//                       name="play-skip-back"
//                       size={32}
//                       color={
//                         controlsDisabled ? "#999" : isDark ? "#fff" : "#333"
//                       }
//                     />
//                     <Text style={styles.skipText}>15s</Text>
//                   </TouchableOpacity>

//                   <View>
//                     <TouchableOpacity
//                       style={[
//                         styles.playButton,
//                         { opacity: controlsDisabled ? 0.5 : 1 },
//                       ]}
//                       onPress={togglePlayPause}
//                       disabled={controlsDisabled}
//                     >
//                       <LinearGradient
//                         colors={["#667eea", "#764ba2"]}
//                         style={styles.playButtonGradient}
//                       >
//                         <Ionicons
//                           name={isPlaying ? "pause" : "play"}
//                           size={36}
//                           color="#fff"
//                         />
//                       </LinearGradient>
//                     </TouchableOpacity>
//                   </View>

//                   <TouchableOpacity
//                     style={styles.skipButton}
//                     onPress={goForward}
//                     disabled={controlsDisabled}
//                   >
//                     <Ionicons
//                       name="play-skip-forward"
//                       size={32}
//                       color={
//                         controlsDisabled ? "#999" : isDark ? "#fff" : "#333"
//                       }
//                     />
//                     <Text style={styles.skipText}>15s</Text>
//                   </TouchableOpacity>
//                 </View>

//                 {/* Secondary Controls */}
//                 <View style={styles.secondaryControls}>
//                   <TouchableOpacity
//                     style={styles.speedButton}
//                     onPress={() => setShowSpeedMenu((v) => !v)}
//                   >
//                     <Text style={styles.speedText}>
//                       {rate.toFixed(2).replace(/\.00$/, "")}x
//                     </Text>
//                   </TouchableOpacity>

//                   <TouchableOpacity
//                     style={styles.stopButton}
//                     onPress={stopPlayback}
//                     disabled={controlsDisabled}
//                   >
//                     <Ionicons
//                       name="stop"
//                       size={24}
//                       color={controlsDisabled ? "#999" : "#ff6b6b"}
//                     />
//                   </TouchableOpacity>
//                 </View>

//                 {/* Speed Menu */}
//                 {showSpeedMenu && (
//                   <View
//                     style={[
//                       styles.speedMenu,
//                       { backgroundColor: Colors[scheme].contrast },
//                     ]}
//                   >
//                     {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map((speed) => (
//                       <TouchableOpacity
//                         key={speed}
//                         style={[
//                           styles.speedOption,
//                           rate === speed && styles.speedOptionActive,
//                         ]}
//                         onPress={() => {
//                           setRate(speed);
//                           setShowSpeedMenu(false);
//                         }}
//                       >
//                         <Text
//                           style={[
//                             styles.speedOptionText,
//                             rate === speed && styles.speedOptionTextActive,
//                           ]}
//                         >
//                           {speed}x
//                         </Text>
//                       </TouchableOpacity>
//                     ))}
//                   </View>
//                 )}
//               </View>
//             )}
//           </Animated.View>
//         </ScrollView>
//       </SafeAreaView>
//     </LinearGradient>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   content: { flex: 1, justifyContent: "flex-start" },
//   heroSection: { flex: 1 },
//   headerContainer: {
//     flex: 1,
//     paddingHorizontal: 20,
//     paddingTop: 20,
//     paddingBottom: 30,
//     alignItems: "center",
//   },
//   coverArtContainer: { position: "relative", marginBottom: 20 },
//   coverArt: { width: 200, height: 200, borderRadius: 20 },
//   coverArtShadow: {
//     position: "absolute",
//     top: 10,
//     left: 10,
//     right: 10,
//     bottom: 10,
//     backgroundColor: "rgba(0,0,0,0.2)",
//     borderRadius: 20,
//     zIndex: -1,
//   },
//   podcastInfo: {
//     flexDirection: "column",
//     alignItems: "center",
//     paddingHorizontal: 20,
//   },
//   podcastTitle: {
//     fontSize: 27,
//     fontWeight: "bold",
//     color: "#fff",
//     textAlign: "center",
//     textShadowColor: "rgba(0,0,0,0.3)",
//     textShadowOffset: { width: 0, height: 1 },
//     textShadowRadius: 3,
//   },
//   podcastDescription: {
//     fontSize: 16,
//     color: "rgba(255,255,255,0.9)",
//     textAlign: "center",
//     lineHeight: 22,
//     marginBottom: 12,
//   },
//   durationContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "rgba(255,255,255,0.2)",
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//   },
//   durationText: {
//     color: "#fff",
//     fontSize: 14,
//     fontWeight: "600",
//     marginLeft: 4,
//   },
//   favoriteButton: {
//     backgroundColor: "rgba(255,255,255,0.2)",
//     padding: 12,
//     borderRadius: 25,
//   },
//   errorContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#ffe6e6",
//     margin: 20,
//     padding: 16,
//     borderRadius: 12,
//     borderLeftWidth: 4,
//     borderLeftColor: "#ff6b6b",
//   },
//   errorText: { color: "#d63031", fontSize: 16, marginLeft: 12, flex: 1 },
//   downloadContainer: {
//     margin: 20,
//     padding: 20,
//     backgroundColor: "#fff",
//     borderRadius: 16,
//   },
//   downloadText: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#333",
//     textAlign: "center",
//     marginBottom: 12,
//   },
//   progressBarContainer: {
//     height: 8,
//     backgroundColor: "#e9ecef",
//     borderRadius: 4,
//     overflow: "hidden",
//   },
//   progressBar: { height: "100%", backgroundColor: "#667eea", borderRadius: 4 },
//   downloadButton: { borderWidth: 1, borderRadius: 16, overflow: "hidden" },
//   downloadButtonGradient: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 18,
//   },
//   downloadButtonText: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "600",
//     marginLeft: 12,
//   },
//   loadingContainer: { alignItems: "center" },
//   loadingText: { fontSize: 16, color: "#000", marginTop: 12 },
//   playerContainer: { margin: 20, borderRadius: 20, padding: 24 },
//   progressSection: { marginBottom: 24 },
//   timeLabels: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 8,
//   },
//   timeText: { fontSize: 14, color: "#666", fontWeight: "500" },
//   progressSlider: { width: "100%", height: 40 },
//   mainControls: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-around",
//     marginBottom: 20,
//   },
//   skipButton: { alignItems: "center", padding: 12 },
//   skipText: { fontSize: 12, color: "#666", marginTop: 4, fontWeight: "500" },
//   playButton: {},
//   playButtonGradient: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   secondaryControls: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   speedButton: {
//     backgroundColor: "#ccc",
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: "#e9ecef",
//   },
//   speedText: { fontSize: 14, fontWeight: "600", color: "#495057" },
//   stopButton: {
//     backgroundColor: "#fecaca",
//     padding: 12,
//     borderRadius: 25,
//     borderWidth: 1,
//   },
//   speedMenu: {
//     position: "absolute",
//     bottom: 80,
//     left: 24,
//     borderRadius: 12,
//     padding: 8,
//   },
//   speedOption: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
//   speedOptionActive: { backgroundColor: "#667eea" },
//   speedOptionText: { fontSize: 14, fontWeight: "500", color: "#495057" },
//   speedOptionTextActive: { color: "#fff" },
// });

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Slider from "@react-native-community/slider";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Asset } from "expo-asset";
import type { VideoSource } from "expo-video";
import { useTranslation } from "react-i18next";
import { Colors } from "@/constants/Colors";
import type { PodcastPlayerPropsType, SavedProgress } from "@/constants/Types";
import HeaderLeftBackButton from "@/components/HeaderLeftBackButton";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { useGlobalPlayer } from "@/player/useGlobalPlayer";
import { remoteUrlFor, usePodcasts } from "@/hooks/usePodcasts";
import { useRefreshFavorites } from "@/stores/refreshFavoriteStore";
import { isPodcastFavorited, togglePodcastFavorite } from "@/utils/favorites";
import { ThemedText } from "./ThemedText";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLanguage } from "@/contexts/LanguageContext";
export default function PodcastPlayer({ podcast }: PodcastPlayerPropsType) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";
  const isDark = colorScheme === "dark";
  const lastTimeKey = (id: string | number) => `podcast:lastTime:${id}`;
  // Artwork (local app logo)
  const logoAsset = Asset.fromModule(require("@/assets/images/logo.png"));
  const artworkUri: string | undefined = logoAsset?.uri || undefined;

  // Global player state & actions
  const {
    isPlaying,
    position,
    duration,
    status,
    rate,
    podcastId,
    currentUri,
    currentKey,
    load,
    play,
    pause,
    toggle,
    seekBy,
    setPosition,
    setRate,
    stopAndKeepSource,
    stopAndUnload,
  } = useGlobalPlayer();

  // Cache/download helpers
  const { download, getCachedUri } = usePodcasts(
    podcast?.language_code ?? "de"
  );

  // UI state
  const [isFavorite, setIsFavorite] = useState(false);
  const [playerError, setPlayerError] = useState<string | null>(null);
  const [isSeeking, setIsSeeking] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [isStreamLoading, setIsStreamLoading] = useState(false);
  const [isStream, setIsStream] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [lastTime, setLastTime] = useState<SavedProgress | null>(null);
  const { lang } = useLanguage();
  // Animations
  const fadeAnim = useMemo(() => new Animated.Value(0), []);
  const slideAnim = useMemo(() => new Animated.Value(50), []);
  const loadedPodcastIdRef = useRef<string | number | null>(null);

  // Cached file, if available
  const [cachedUri, setCachedUri] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    (async () => {
      if (!podcast?.filename) {
        if (alive) setCachedUri(null);
        return;
      }
      try {
        const uri = await getCachedUri(podcast.filename);
        if (alive) setCachedUri(uri ?? null);
      } catch {
        if (alive) setCachedUri(null);
      }
    })();
    return () => {
      alive = false;
    };
  }, [podcast?.id, podcast?.filename, getCachedUri]);

  // Favorite
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!podcast?.id) return;
      try {
        const result = await isPodcastFavorited(podcast.id);
        if (mounted) setIsFavorite(result);
      } catch {}
    })();
    return () => {
      mounted = false;
    };
  }, [podcast?.id]);

  const { triggerRefreshFavorites } = useRefreshFavorites();
  const onPressToggleFavorite = async () => {
    if (!podcast?.id) return;
    try {
      const next = await togglePodcastFavorite(podcast.id, lang);
      setIsFavorite(next);
      triggerRefreshFavorites();
    } catch {}
  };

  // Loaded/visibility flags
  const isThisEpisodeLoaded =
    podcastId === podcast?.id &&
    !!(currentUri || currentKey) &&
    status !== "stopped" &&
    status !== "idle";

  // Let controls show as soon as it's loaded (even if duration isn't known yet)
  const showPlaybackControls = isThisEpisodeLoaded && !playerError;

  // Only consider as "loading" when streaming or actively downloading
  const isLoading = download.isPending || isStreamLoading;
  const controlsDisabled = isLoading || !!playerError || isSeeking;

  // If nothing for this episode is loaded yet, we show initial area.
  const shouldShowInitial = !isThisEpisodeLoaded && !isLoading && !playerError;

  // When initial area is shown, always unload any previous episode to avoid autoplay behind UI
  useEffect(() => {
    if (shouldShowInitial) stopAndUnload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldShowInitial, podcast?.id]);

  //! Old
  // // ✅ If cached, preload the source (no autoplay) and show full controls paused.
  // useEffect(() => {
  //   if (shouldShowInitial && cachedUri) {
  //     const src: VideoSource = {
  //       uri: cachedUri,
  //       metadata: {
  //         title: podcast.title ?? "Podcast",
  //         artist: "Podcast",
  //         ...(artworkUri ? { artwork: artworkUri } : {}),
  //       },
  //     };
  //     load(src, {
  //       autoplay: false, // show UI paused, user starts playback
  //       title: podcast.title,
  //       artwork: artworkUri,
  //       podcastId: podcast.id,
  //       filename: podcast.filename,
  //       rate,
  //     }).catch((e) => setPlayerError(e?.message ?? "Player error"));
  //   }
  // }, [
  //   shouldShowInitial,
  //   cachedUri,
  //   load,
  //   podcast.id,
  //   podcast.filename,
  //   podcast.title,
  //   artworkUri,
  //   rate,
  // ]);

  // Replace the current preload effect (lines 128-150) with:
  useEffect(() => {
    // Only load if: initial state, has cache, and haven't loaded this episode yet
    if (
      shouldShowInitial &&
      cachedUri &&
      loadedPodcastIdRef.current !== podcast.id
    ) {
      const src: VideoSource = {
        uri: cachedUri,
        metadata: {
          title: podcast.title ?? "Podcast",
          artist: "Podcast",
          ...(artworkUri ? { artwork: artworkUri } : {}),
        },
      };

      loadedPodcastIdRef.current = podcast.id; // Mark as loaded

      load(src, {
        autoplay: false,
        title: podcast.title,
        artwork: artworkUri,
        podcastId: podcast.id,
        filename: podcast.filename,
        rate,
      }).catch((e) => setPlayerError(e?.message ?? "Player error"));
    }

    // Reset tracking when switching episodes
    if (!shouldShowInitial) {
      loadedPodcastIdRef.current = null;
    }
  }, [
    shouldShowInitial,
    cachedUri,
    podcast.id,
    podcast.filename,
    podcast.title,
    rate,
    artworkUri,
    load,
  ]); // Only the essentials
  // Metadata like title, artwork, rate are captured in closure—fine for this use case

  // Entrance animation
  useEffect(() => {
    const anim = Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);

    anim.start();

    return () => {
      anim.stop();
    };
  }, [fadeAnim, slideAnim]);

  // Actions
  const toSource = (uri: string): VideoSource => ({
    uri,
    metadata: {
      title: podcast.title ?? "Podcast",
      artist: "Podcast",
      ...(artworkUri ? { artwork: artworkUri } : {}),
    },
  });

  const handleStream = () => {
    setPlayerError(null);
    if (!podcast?.filename) {
      setPlayerError("Audio path missing.");
      return;
    }
    const remote = remoteUrlFor(podcast.filename);
    if (!remote) {
      setPlayerError("Cannot create stream URL.");
      return;
    }
    setIsStreamLoading(true);
    setIsStream(true);
    load(toSource(remote), {
      autoplay: true,
      title: podcast.title,
      artwork: artworkUri,
      podcastId: podcast.id,
      filename: podcast.filename,
      rate,
    })
      .catch((e) => setPlayerError(e?.message ?? "Player error"))
      .finally(() => setIsStreamLoading(false));
  };

  const handleDownload = async () => {
    pause();
    setPlayerError(null);
    if (!podcast?.filename) {
      setPlayerError("Audio path missing.");
      return;
    }
    setDownloadProgress(0);
    try {
      setIsStream(false);
      setIsDownloading(true);
      const localUri = await download.mutateAsync({
        filename: podcast.filename,
        onProgress: (p) => setDownloadProgress(p),
      });
      setCachedUri(localUri);
      // Do not autoplay; user will press play (but now the source is cached)
      load(toSource(localUri), {
        autoplay: false,
        title: podcast.title,
        artwork: artworkUri,
        podcastId: podcast.id,
        filename: podcast.filename,
        rate,
      }).catch((e) => setPlayerError(e?.message ?? "Player error"));
    } catch (err: any) {
      setPlayerError(err?.message ?? "Download failed");
      setDownloadProgress(0);
    } finally {
      setIsDownloading(false);
    }
  };

  const togglePlayPause = () => {
    if (playerError || !isThisEpisodeLoaded) return;
    toggle();
  };

  const goBack = () => {
    if (!isThisEpisodeLoaded) return;
    seekBy(-15);
  };
  const goForward = () => {
    if (!isThisEpisodeLoaded) return;
    seekBy(15);
  };

  // Scrub: pause → seek (seekBy for tiny nudges) → resume if needed
  const wasPlayingRef = useRef(false);
  const startPosRef = useRef(0);

  // const onScrubStart = () => {
  //   wasPlayingRef.current = isPlaying;
  //   pause();
  //   startPosRef.current = position || 0;
  //   setIsSeeking(true);
  // };
  // const handleSeek = (value: number) => {
  //   setIsSeeking(false);
  //   const delta = value - startPosRef.current;
  //   if (Math.abs(delta) < 1) seekBy(delta);
  //   else setPosition(value);
  //   if (wasPlayingRef.current) play();
  // };

  const stopPlayback = async () => {
    if (!isThisEpisodeLoaded) return;
    await stopAndKeepSource(); // keep UI controls; Mini hides globally
  };

  const formatTime = (secs?: number | null): string => {
    if (!secs || secs < 0 || isNaN(secs)) return "0:00";
    const total = Math.floor(secs);
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const seconds = total % 60;
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // UI render
  const showDownloadProgress = download.isPending;
  // Only show the Stream/Download choices when NOT cached and nothing is loaded
  const showInitialButtons = shouldShowInitial && !cachedUri;

  // Get last time
  // Get last time
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!podcast?.id) {
        if (mounted) setLastTime(null);
        return;
      }
      try {
        const json = await AsyncStorage.getItem(lastTimeKey(podcast.id));
        if (json) {
          const {
            position = 0,
            duration = 0,
            savedAt = Date.now(),
          } = JSON.parse(json) || {};
          if (mounted) setLastTime({ position, duration, savedAt });
        } else {
          if (mounted) setLastTime(null);
        }
      } catch {
        // ignore read errors; keep UI stable
      }
    })();
    return () => {
      mounted = false;
    };
  }, [podcast?.id]);

  const handleLastTime = async () => {
    if (!podcast?.id) return;
    try {
      const payload = {
        podcastId: podcast.id,
        title: podcast.title ?? null,
        filename: podcast.filename ?? null,
        uri: currentUri ?? null,
        key: currentKey ?? null,
        position: typeof position === "number" ? position : 0,
        duration: typeof duration === "number" ? duration : 0,
        rate: typeof rate === "number" ? rate : 1,
        savedAt: Date.now(),
      };
      await AsyncStorage.setItem(
        lastTimeKey(podcast.id),
        JSON.stringify(payload)
      );
      // reflect immediately in UI
      setLastTime({
        position: payload.position,
        duration: payload.duration,
        savedAt: payload.savedAt,
      });
      // console.log("Saved last time:", payload);
    } catch {
      setPlayerError("Could not save last time.");
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors[colorScheme].background }}
      edges={["top", "left"]}
    >
      <View style={{ marginLeft: 20 }}>
        <HeaderLeftBackButton
          color={Colors[colorScheme].defaultIcon}
          size={35}
        />
      </View>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 0 }}
      >
        <Animated.View
          style={[
            styles.content,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* Header / Artwork / Info */}
          <View style={styles.headerContainer}>
            <Image
              source={require("@/assets/images/logo.png")}
              style={styles.coverArt}
              contentFit="cover"
            />
            {isStream && (
              <Ionicons
                name="download"
                size={35}
                color={Colors[colorScheme].defaultIcon}
                onPress={handleDownload}
              />
            )}

            <View style={styles.podcastInfo}>
              <ThemedText
                style={styles.podcastTitle}
                type="title"
                numberOfLines={2}
              >
                {podcast.title}
              </ThemedText>
            </View>

            <ThemedText style={styles.podcastDescription} numberOfLines={3}>
              {podcast.description}
            </ThemedText>

            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            >
              {showPlaybackControls && (
                <View style={styles.durationContainer}>
                  <Ionicons
                    name="time-outline"
                    size={25}
                    color={Colors[colorScheme].defaultIcon}
                  />
                  <ThemedText style={styles.durationText}>
                    {formatTime(duration)}
                  </ThemedText>
                </View>
              )}
              <TouchableOpacity
                onPress={onPressToggleFavorite}
                style={styles.favoriteButton}
              >
                <Ionicons
                  name={isFavorite ? "star" : "star-outline"}
                  size={showPlaybackControls ? 25 : 35}
                  color={
                    isFavorite
                      ? Colors.universal.favorite
                      : Colors[colorScheme].defaultIcon
                  }
                />
              </TouchableOpacity>
              {showPlaybackControls && (
                <Ionicons
                  name="time-outline"
                  size={27}
                  color={Colors[colorScheme].defaultIcon}
                  style={{
                    alignSelf: "center",
                    backgroundColor: "rgba(255,255,255,0.2)",
                    padding: 12,
                    borderRadius: 25,
                  }}
                  onPress={() => handleLastTime()}
                />
              )}
              {!!lastTime && showPlaybackControls && (
                <TouchableOpacity
                  style={styles.lastTimePill}
                  onPress={() => {
                    setPosition(lastTime.position);
                  }}
                >
                  <Ionicons
                    name="bookmark-outline"
                    size={25}
                    color={Colors[colorScheme].defaultIcon}
                  />
                  <ThemedText style={styles.lastTimePillText}>
                    {formatTime(lastTime.position)} /{" "}
                    {formatTime(lastTime.duration)}
                  </ThemedText>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Error */}
          {!!playerError && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={24} color="#ff6b6b" />
              <Text style={styles.errorText}>{playerError}</Text>
            </View>
          )}

          {/* Download Progress */}
          {showDownloadProgress && (
            <View style={styles.downloadContainer}>
              <ThemedText style={styles.downloadText}>
                {t("downloading")} {Math.round(downloadProgress * 100)}%
              </ThemedText>
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBar,
                    { width: `${Math.round(downloadProgress * 100)}%` },
                  ]}
                />
              </View>
            </View>
          )}

          {/* Initial Actions (only when NOT cached) */}
          {showInitialButtons && (
            <View style={{ gap: 10, marginHorizontal: 10 }}>
              <TouchableOpacity
                style={styles.downloadButton}
                onPress={handleStream}
                disabled={isLoading}
              >
                <View style={styles.streamDownloadButton}>
                  <Ionicons
                    name="play"
                    size={24}
                    color={Colors[colorScheme].defaultIcon}
                  />
                  <ThemedText style={styles.downloadButtonText}>
                    {t("stream")}
                  </ThemedText>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.downloadButton}
                onPress={handleDownload}
                disabled={isLoading}
              >
                <View style={styles.streamDownloadButton}>
                  <Ionicons
                    name="download"
                    size={24}
                    color={Colors[colorScheme].defaultIcon}
                  />
                  <ThemedText style={styles.downloadButtonText}>
                    {t("download")}
                  </ThemedText>
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* Loading */}
          {isLoading && !playerError && (
            <View style={styles.loadingContainer}>
              <LoadingIndicator size="large" />
              <ThemedText style={styles.loadingText}>
                {download.isPending
                  ? t("preparing")
                  : isStreamLoading
                  ? t("loading_stream")
                  : t("downloading")}
              </ThemedText>
            </View>
          )}

          {/* Player Controls (visible as soon as source is loaded; paused until user hits play) */}
          {showPlaybackControls && !playerError && !isDownloading && (
            <View
              style={[
                styles.playerContainer,
                {
                  backgroundColor: Colors[colorScheme].contrast,
                  shadowColor: Colors[colorScheme].border,
                },
              ]}
            >
              {/* Progress */}
              <View style={styles.progressSection}>
                <View style={styles.timeLabels}>
                  <ThemedText style={styles.timeText}>
                    {formatTime(position)}
                  </ThemedText>
                  <ThemedText style={styles.timeText}>
                    {formatTime(duration)}
                  </ThemedText>
                </View>

                <Slider
                  style={styles.progressSlider}
                  value={Math.min(position || 0, duration || 0)}
                  minimumValue={0}
                  maximumValue={duration || 0}
                  onSlidingStart={() => {
                    wasPlayingRef.current = isPlaying;
                    pause();
                    setIsSeeking(true);
                    startPosRef.current = position || 0;
                  }}
                  onSlidingComplete={(value) => {
                    setIsSeeking(false);
                    const delta = value - startPosRef.current;
                    if (Math.abs(delta) < 1) seekBy(delta);
                    else setPosition(value);
                    if (wasPlayingRef.current) play();
                  }}
                  minimumTrackTintColor="#667eea"
                  maximumTrackTintColor={isDark ? "#333" : "#ddd"}
                  thumbTintColor="#667eea"
                  disabled={controlsDisabled}
                />
              </View>

              {/* Main Controls */}
              <View style={styles.mainControls}>
                <TouchableOpacity
                  style={styles.skipButton}
                  onPress={goBack}
                  disabled={controlsDisabled}
                >
                  <Ionicons
                    name="play-skip-back"
                    size={32}
                    color={controlsDisabled ? "#999" : isDark ? "#fff" : "#333"}
                  />
                  <ThemedText style={styles.skipText}>15s</ThemedText>
                </TouchableOpacity>

                <View>
                  <TouchableOpacity
                    style={[
                      styles.playButton,
                      { opacity: controlsDisabled ? 0.5 : 1 },
                    ]}
                    onPress={togglePlayPause}
                    disabled={controlsDisabled}
                  >
                    <LinearGradient
                      colors={["#667eea", "#764ba2"]}
                      style={styles.playButtonGradient}
                    >
                      <Ionicons
                        name={isPlaying ? "pause" : "play"}
                        size={36}
                        color="#fff"
                      />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.skipButton}
                  onPress={goForward}
                  disabled={controlsDisabled}
                >
                  <Ionicons
                    name="play-skip-forward"
                    size={32}
                    color={controlsDisabled ? "#999" : isDark ? "#fff" : "#333"}
                  />
                  <ThemedText style={styles.skipText}>15s</ThemedText>
                </TouchableOpacity>
              </View>

              {/* Secondary Controls */}
              <View style={styles.secondaryControls}>
                <TouchableOpacity
                  style={[
                    styles.speedButton,
                    { backgroundColor: Colors[colorScheme].background },
                  ]}
                  onPress={() => setShowSpeedMenu((v) => !v)}
                >
                  <ThemedText style={styles.speedText}>
                    {rate.toFixed(2).replace(/\.00$/, "")}x
                  </ThemedText>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.stopButton}
                  onPress={stopPlayback}
                  disabled={controlsDisabled}
                >
                  <Ionicons
                    name="stop"
                    size={24}
                    color={controlsDisabled ? "#999" : "#ff6b6b"}
                  />
                </TouchableOpacity>
              </View>

              {/* Speed Menu */}
              {showSpeedMenu && (
                <View
                  style={[
                    styles.speedMenu,
                    {
                      backgroundColor: Colors[colorScheme].contrast,
                      borderColor: Colors[colorScheme].border,
                    },
                  ]}
                >
                  {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map((speed) => (
                    <TouchableOpacity
                      key={speed}
                      style={[
                        styles.speedOption,
                        rate === speed && styles.speedOptionActive,
                      ]}
                      onPress={() => {
                        setRate(speed);
                        setShowSpeedMenu(false);
                      }}
                    >
                      <ThemedText
                        style={[
                          styles.speedOptionText,
                          rate === speed && styles.speedOptionTextActive,
                        ]}
                      >
                        {speed}x
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "flex-start",
    paddingBottom: 30,
  },
  heroSection: {
    flex: 1,
  },
  headerContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    alignItems: "center",
    gap: 20,
  },
  coverArtContainer: {
    position: "relative",
    marginBottom: 20,
  },
  coverArt: { width: 200, height: 200, borderRadius: 20 },
  coverArtShadow: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    bottom: 10,
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 20,
    zIndex: -1,
  },
  podcastInfo: {
    flexDirection: "column",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  podcastTitle: {
    fontWeight: "bold",
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    lineHeight: 40,
  },
  podcastDescription: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 12,
  },
  durationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  durationText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },
  favoriteButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 12,
    borderRadius: 25,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffe6e6",
    margin: 20,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#ff6b6b",
  },
  errorText: { color: "#d63031", fontSize: 16, marginLeft: 12, flex: 1 },
  downloadContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 16,
  },
  downloadText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginBottom: 12,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#e9ecef",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: { height: "100%", backgroundColor: "#667eea", borderRadius: 4 },
  downloadButton: { borderWidth: 1, borderRadius: 16, overflow: "hidden" },
  streamDownloadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
  },
  downloadButtonText: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 12,
  },
  loadingContainer: { alignItems: "center" },
  loadingText: { fontSize: 16, marginTop: 12 },
  playerContainer: { margin: 20, borderRadius: 20, padding: 24 },
  progressSection: { marginBottom: 24 },
  timeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  timeText: { fontSize: 14, fontWeight: "500" },
  progressSlider: { width: "100%", height: 40 },
  mainControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  skipButton: {
    alignItems: "center",
    padding: 12,
  },
  skipText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: "500",
  },
  playButton: {},
  playButtonGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  speedButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  speedText: { fontSize: 14, fontWeight: "600" },
  stopButton: {
    backgroundColor: "#fecaca",
    padding: 12,
    borderRadius: 25,
    borderWidth: 1,
  },
  speedMenu: {
    position: "absolute",
    bottom: 80,
    left: 24,
    borderRadius: 12,
    padding: 8,
    zIndex: 99,
    borderWidth: 1,
  },
  speedOption: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  speedOptionActive: { backgroundColor: "#667eea" },
  speedOptionText: { fontSize: 14, fontWeight: "500" },
  speedOptionTextActive: {},
  lastTimePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: "center",
  },
  lastTimePillText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
