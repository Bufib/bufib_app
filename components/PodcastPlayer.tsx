// // // // //! Normal audio player
// // // // // import { Colors } from "@/constants/Colors";
// // // // // import { PodcastPlayerPropsType } from "@/constants/Types";
// // // // // import { useLanguage } from "@/contexts/LanguageContext";
// // // // // import { remoteUrlFor, usePodcasts } from "@/hooks/usePodcasts";
// // // // // import { useRefreshFavorites } from "@/stores/refreshFavoriteStore";
// // // // // import { isPodcastFavorited, togglePodcastFavorite } from "@/utils/favorites";
// // // // // import { AntDesign, Ionicons } from "@expo/vector-icons";
// // // // // import Slider from "@react-native-community/slider";
// // // // // import { AudioStatus, useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
// // // // // import { Image } from "expo-image";
// // // // // import { LinearGradient } from "expo-linear-gradient";
// // // // // import React, { useCallback, useEffect, useState } from "react";
// // // // // import { useTranslation } from "react-i18next";
// // // // // import {
// // // // //   ActivityIndicator,
// // // // //   Animated,
// // // // //   Easing,
// // // // //   ScrollView,
// // // // //   StyleSheet,
// // // // //   Text,
// // // // //   TouchableOpacity,
// // // // //   useColorScheme,
// // // // //   useWindowDimensions,
// // // // //   View,
// // // // // } from "react-native";
// // // // // import { SafeAreaView } from "react-native-safe-area-context";
// // // // // import HeaderLeftBackButton from "./HeaderLeftBackButton";

// // // // // export const PodcastPlayer: React.FC<PodcastPlayerPropsType> = ({
// // // // //   podcast,
// // // // // }) => {
// // // // //   const { language } = useLanguage();
// // // // //   const { download, getCachedUri } = usePodcasts(language || "de");
// // // // //   const [isFavorite, setIsFavorite] = useState(false);
// // // // //   const [sourceUri, setSourceUri] = useState<string | null>(null);
// // // // //   const [downloadProgress, setDownloadProgress] = useState(0);
// // // // //   const [playerError, setPlayerError] = useState<string | null>(null);
// // // // //   const [didInitiatePlayback, setDidInitiatePlayback] = useState(false);
// // // // //   const [isSeeking, setIsSeeking] = useState(false);
// // // // //   const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
// // // // //   const [showSpeedMenu, setShowSpeedMenu] = useState(false);

// // // // //   // Animation values
// // // // //   const [pulseAnim] = useState(new Animated.Value(1));
// // // // //   const [fadeAnim] = useState(new Animated.Value(0));
// // // // //   const [slideAnim] = useState(new Animated.Value(50));
// // // // //   const { width } = useWindowDimensions();
// // // // //   const { refreshTriggerFavorites, triggerRefreshFavorites } =
// // // // //     useRefreshFavorites();
// // // // //   const colorScheme = useColorScheme() || "light";
// // // // //   const player = useAudioPlayer(sourceUri ? { uri: sourceUri } : null, 500);
// // // // //   const status: AudioStatus | null = useAudioPlayerStatus(player);
// // // // //   const { t } = useTranslation();

// // // // //   // Entrance animation
// // // // //   useEffect(() => {
// // // // //     Animated.parallel([
// // // // //       Animated.timing(fadeAnim, {
// // // // //         toValue: 1,
// // // // //         duration: 800,
// // // // //         useNativeDriver: true,
// // // // //       }),
// // // // //       Animated.timing(slideAnim, {
// // // // //         toValue: 0,
// // // // //         duration: 600,
// // // // //         easing: Easing.out(Easing.cubic),
// // // // //         useNativeDriver: true,
// // // // //       }),
// // // // //     ]).start();
// // // // //   }, []);

// // // // //   // // Pulse animation for play button
// // // // //   // const startPulseAnimation = () => {
// // // // //   //   Animated.loop(
// // // // //   //     Animated.sequence([
// // // // //   //       Animated.timing(pulseAnim, {
// // // // //   //         toValue: 1.1,
// // // // //   //         duration: 1000,
// // // // //   //         useNativeDriver: true,
// // // // //   //       }),
// // // // //   //       Animated.timing(pulseAnim, {
// // // // //   //         toValue: 1,
// // // // //   //         duration: 1000,
// // // // //   //         useNativeDriver: true,
// // // // //   //       }),
// // // // //   //     ])
// // // // //   //   ).start();
// // // // //   // };

// // // // //   // const stopPulseAnimation = () => {
// // // // //   //   pulseAnim.setValue(1);
// // // // //   // };

// // // // //   // On podcast change: reset UI state and check for a cached file
// // // // //   useEffect(() => {
// // // // //     setSourceUri(null);
// // // // //     setPlayerError(null);
// // // // //     setDownloadProgress(0);
// // // // //     setDidInitiatePlayback(false);

// // // // //     (async () => {
// // // // //       if (!podcast.filename) return;
// // // // //       const uri = await getCachedUri(podcast.filename);
// // // // //       if (uri) {
// // // // //         setSourceUri(uri);
// // // // //       }
// // // // //     })();
// // // // //   }, [podcast.id, podcast.filename]);

// // // // //   // Disable looping and set playback speed
// // // // //   useEffect(() => {
// // // // //     if (player) {
// // // // //       player.loop = false;
// // // // //       player.setPlaybackRate(playbackSpeed); // Set initial playback rate
// // // // //     }
// // // // //   }, [player, playbackSpeed]);

// // // // //   // Proactively pause the player as soon as it's loaded to prevent autoplay
// // // // //   useEffect(() => {
// // // // //     if (status?.isLoaded && !didInitiatePlayback) {
// // // // //       player.pause();
// // // // //     }
// // // // //   }, [status?.isLoaded, didInitiatePlayback, player]);

// // // // //   // // Pulse animation control
// // // // //   // useEffect(() => {
// // // // //   //   if (status?.playing) {
// // // // //   //     startPulseAnimation();
// // // // //   //   } else {
// // // // //   //     stopPulseAnimation();
// // // // //   //   }
// // // // //   // }, [status?.playing]);

// // // // //   // When playback finishes, reset play intent
// // // // //   useEffect(() => {
// // // // //     if (status?.didJustFinish) {
// // // // //       setDidInitiatePlayback(false);
// // // // //     }
// // // // //   }, [status?.didJustFinish]);

// // // // //   // Download handler
// // // // //   const handleDownload = useCallback(async () => {
// // // // //     if (!podcast.filename) {
// // // // //       setPlayerError("Audio path missing.");
// // // // //       return;
// // // // //     }
// // // // //     setPlayerError(null);
// // // // //     setSourceUri(null);
// // // // //     setDownloadProgress(0);
// // // // //     setDidInitiatePlayback(false);

// // // // //     try {
// // // // //       const localUri = await download.mutateAsync({
// // // // //         filename: podcast.filename,
// // // // //         onProgress: setDownloadProgress,
// // // // //       });
// // // // //       setSourceUri(localUri);
// // // // //     } catch (err) {
// // // // //       const errorMsg =
// // // // //         err instanceof Error ? err.message : "Unknown download error";
// // // // //       setPlayerError(`Download failed: ${errorMsg}`);
// // // // //       setDownloadProgress(0);
// // // // //     }
// // // // //   }, [podcast.filename, download]);

// // // // //   // Playback controls
// // // // //   const togglePlayPause = useCallback(() => {
// // // // //     if (!status?.isLoaded || !!playerError) return;
// // // // //     if (status.playing) {
// // // // //       player.pause();
// // // // //     } else {
// // // // //       player.play();
// // // // //       setDidInitiatePlayback(true);
// // // // //     }
// // // // //   }, [player, status?.isLoaded, status?.playing, playerError]);

// // // // //   const goBack = useCallback(() => {
// // // // //     if (!status?.isLoaded || !status.duration || playerError) return;
// // // // //     player.seekTo(Math.max(0, status.currentTime - 15));
// // // // //   }, [
// // // // //     player,
// // // // //     status?.isLoaded,
// // // // //     status?.currentTime,
// // // // //     status?.duration,
// // // // //     playerError,
// // // // //   ]);

// // // // //   const goForward = useCallback(() => {
// // // // //     if (!status?.isLoaded || !status.duration || playerError) return;
// // // // //     player.seekTo(Math.min(status.duration, status.currentTime + 15));
// // // // //   }, [
// // // // //     player,
// // // // //     status?.isLoaded,
// // // // //     status?.currentTime,
// // // // //     status?.duration,
// // // // //     playerError,
// // // // //   ]);

// // // // //   const stopPlayback = useCallback(() => {
// // // // //     if (!status?.isLoaded || playerError) return;
// // // // //     player.pause();
// // // // //     player.seekTo(0);
// // // // //   }, [player, status?.isLoaded, playerError]);

// // // // //   const handleSeek = useCallback(
// // // // //     (value: number) => {
// // // // //       if (!status?.isLoaded || !player) return;
// // // // //       setIsSeeking(false);
// // // // //       player.seekTo(value);
// // // // //     },
// // // // //     [player, status?.isLoaded]
// // // // //   );

// // // // //   // Speed control
// // // // //   const speedOptions = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

// // // // //   const handleSpeedChange = (speed: number) => {
// // // // //     if (player && status) {
// // // // //       // Remember if the player was playing before the speed change
// // // // //       const wasPlaying = status.playing;

// // // // //       // Set the new playback speed
// // // // //       player.setPlaybackRate(speed);
// // // // //       setPlaybackSpeed(speed);
// // // // //       setShowSpeedMenu(false);

// // // // //       // It starts playing anyway and player.pause() is not working -> just make it start when stopped and user changes the speed
// // // // //       player.play();
// // // // //     }
// // // // //   };

// // // // //   // Render logic
// // // // //   const isPlayerActuallyLoading = !!(sourceUri && !status?.isLoaded);
// // // // //   const isPreparing = download.isPending;
// // // // //   const isLoading = isPreparing || isPlayerActuallyLoading;
// // // // //   const canPlay = !!status?.isLoaded;
// // // // //   const showInitialButton = !sourceUri && !isLoading && !playerError;
// // // // //   const showPlaybackControls = sourceUri && canPlay;
// // // // //   const showDownloadProgress = download.isPending;
// // // // //   const controlsDisabled = isLoading || !canPlay || !!playerError || isSeeking;

// // // // //   const formatTime = (secs?: number | null): string => {
// // // // //     if (!secs || secs < 0 || isNaN(secs)) return "0:00";
// // // // //     const total = Math.floor(secs);
// // // // //     const hours = Math.floor(total / 3600);
// // // // //     const minutes = Math.floor((total % 3600) / 60);
// // // // //     const seconds = total % 60;

// // // // //     if (hours > 0) {
// // // // //       return `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${
// // // // //         seconds < 10 ? "0" : ""
// // // // //       }${seconds}`;
// // // // //     }
// // // // //     return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
// // // // //   };

// // // // //   // Load favorite state on podcast change
// // // // //   useEffect(() => {
// // // // //     (async () => {
// // // // //       if (!podcast.id) return;
// // // // //       try {
// // // // //         const fav = await isPodcastFavorited(podcast.id);
// // // // //         setIsFavorite(fav);
// // // // //       } catch (error) {
// // // // //         console.log(error);
// // // // //       }
// // // // //     })();
// // // // //   }, [podcast.id]);

// // // // //   // Toggle favorite handler
// // // // //   const onPressToggleFavorite = useCallback(async () => {
// // // // //     if (!podcast.id) return;
// // // // //     try {
// // // // //       const newStatus = await togglePodcastFavorite(podcast.id);
// // // // //       setIsFavorite(newStatus);
// // // // //       triggerRefreshFavorites();
// // // // //     } catch (error) {
// // // // //       console.error("Error toggling podcast favorite:", error);
// // // // //     }
// // // // //   }, [podcast.id, triggerRefreshFavorites]);

// // // // //   const isDark = colorScheme === "dark";

// // // // //   // new handler
// // // // //   const handleStream = useCallback(() => {
// // // // //     if (!podcast.filename) return;
// // // // //     setPlayerError(null);
// // // // //     setDownloadProgress(0);
// // // // //     setSourceUri(remoteUrlFor(podcast.filename)); // <- remote stream
// // // // //     setDidInitiatePlayback(false);
// // // // //   }, [podcast.filename]);

// // // // //   return (
// // // // //     <LinearGradient
// // // // //       colors={
// // // // //         isDark
// // // // //           ? ["#242c40", "#27272a"] // Near-black to dark gray
// // // // //           : ["#6366f1", "#818cf8"] // Indigo gradient
// // // // //       }
// // // // //       style={styles.heroSection}
// // // // //     >
// // // // //       <SafeAreaView style={{ flex: 1 }} edges={["top", "left"]}>
// // // // //         <View style={{ marginLeft: 20 }}>
// // // // //           <HeaderLeftBackButton
// // // // //             color={colorScheme === "dark" ? "#fff" : "#000"}
// // // // //             size={35}
// // // // //           />
// // // // //         </View>
// // // // //         <ScrollView
// // // // //           style={[styles.container]}
// // // // //           showsVerticalScrollIndicator={false}
// // // // //           contentContainerStyle={{ flexGrow: 0 }}
// // // // //         >
// // // // //           {/* Hero Section with Gradient Background */}
// // // // //           <Animated.View
// // // // //             style={[
// // // // //               styles.content,
// // // // //               {
// // // // //                 opacity: fadeAnim,
// // // // //                 transform: [{ translateY: slideAnim }],
// // // // //               },
// // // // //             ]}
// // // // //           >
// // // // //             <View style={styles.headerContainer}>
// // // // //               {/* Podcast Cover Art */}
// // // // //               <View style={styles.coverArtContainer}>
// // // // //                 <Image
// // // // //                   source={require("@/assets/images/logo.png")}
// // // // //                   style={styles.coverArt}
// // // // //                   contentFit="cover"
// // // // //                 />
// // // // //                 <View style={styles.coverArtShadow} />
// // // // //               </View>

// // // // //               {/* Podcast Info */}
// // // // //               <View style={styles.podcastInfo}>
// // // // //                 <View
// // // // //                   style={{
// // // // //                     flexDirection: "row",
// // // // //                     justifyContent: "center",
// // // // //                     alignItems: "center",
// // // // //                     gap: 10,
// // // // //                     marginBottom: 20,
// // // // //                   }}
// // // // //                 >
// // // // //                   <Text style={styles.podcastTitle} numberOfLines={2}>
// // // // //                     {podcast.title}
// // // // //                   </Text>
// // // // //                   {/* Favorite Button */}
// // // // //                   <TouchableOpacity
// // // // //                     onPress={onPressToggleFavorite}
// // // // //                     style={styles.favoriteButton}
// // // // //                   >
// // // // //                     <AntDesign
// // // // //                       name={isFavorite ? "star" : "staro"}
// // // // //                       size={25}
// // // // //                       color={isFavorite ? Colors.universal.favorite : "#fff"}
// // // // //                     />
// // // // //                   </TouchableOpacity>
// // // // //                 </View>
// // // // //                 <Text style={styles.podcastDescription} numberOfLines={3}>
// // // // //                   {podcast.description}
// // // // //                 </Text>

// // // // //                 {status?.isLoaded && (
// // // // //                   <View style={styles.durationContainer}>
// // // // //                     <Ionicons name="time-outline" size={16} color="#fff" />
// // // // //                     <Text style={styles.durationText}>
// // // // //                       {formatTime(status.duration)}
// // // // //                     </Text>
// // // // //                   </View>
// // // // //                 )}
// // // // //               </View>
// // // // //             </View>

// // // // //             {/* Error Display */}
// // // // //             {playerError && (
// // // // //               <View style={styles.errorContainer}>
// // // // //                 <Ionicons name="alert-circle" size={24} color="#ff6b6b" />
// // // // //                 <Text style={styles.errorText}>{playerError}</Text>
// // // // //               </View>
// // // // //             )}

// // // // //             {/* Download Progress */}
// // // // //             {showDownloadProgress && (
// // // // //               <View style={styles.downloadContainer}>
// // // // //                 <Text style={styles.downloadText}>
// // // // //                   {t("downloading")} {Math.round(downloadProgress * 100)}%
// // // // //                 </Text>
// // // // //                 <View style={styles.progressBarContainer}>
// // // // //                   <View
// // // // //                     style={[
// // // // //                       styles.progressBar,
// // // // //                       { width: `${Math.round(downloadProgress * 100)}%` },
// // // // //                     ]}
// // // // //                   />
// // // // //                 </View>
// // // // //               </View>
// // // // //             )}

// // // // //             {!sourceUri && !isLoading && !playerError && (
// // // // //               <TouchableOpacity
// // // // //                 style={styles.downloadButton}
// // // // //                 onPress={handleStream}
// // // // //               >
// // // // //                 <LinearGradient
// // // // //                   colors={["#667eea", "#764ba2"]}
// // // // //                   style={styles.downloadButtonGradient}
// // // // //                 >
// // // // //                   <Ionicons name="play" size={24} color="#fff" />
// // // // //                   <Text style={styles.downloadButtonText}>{t("stream")}</Text>
// // // // //                 </LinearGradient>
// // // // //               </TouchableOpacity>
// // // // //             )}

// // // // //             {/* Initial Download Button */}
// // // // //             {showInitialButton && (
// // // // //               <TouchableOpacity
// // // // //                 style={styles.downloadButton}
// // // // //                 onPress={handleDownload}
// // // // //                 disabled={isLoading}
// // // // //               >
// // // // //                 <LinearGradient
// // // // //                   colors={["#667eea", "#764ba2"]}
// // // // //                   style={styles.downloadButtonGradient}
// // // // //                 >
// // // // //                   <Ionicons name="download" size={24} color="#fff" />
// // // // //                   <Text style={styles.downloadButtonText}>{t("download")}</Text>
// // // // //                 </LinearGradient>
// // // // //               </TouchableOpacity>
// // // // //             )}

// // // // //             {/* Loading Indicator */}
// // // // //             {isLoading && !playerError && (
// // // // //               <View style={styles.loadingContainer}>
// // // // //                 <ActivityIndicator size="large" color="#667eea" />
// // // // //                 <Text style={styles.loadingText}>
// // // // //                   {isPreparing ? t("preparing") : t("loading")}
// // // // //                 </Text>
// // // // //               </View>
// // // // //             )}

// // // // //             {/* Main Player Controls */}
// // // // //             {showPlaybackControls && !playerError && (
// // // // //               <View
// // // // //                 style={[
// // // // //                   styles.playerContainer,
// // // // //                   {
// // // // //                     backgroundColor: Colors[colorScheme].contrast,
// // // // //                     shadowColor: Colors[colorScheme].border,
// // // // //                   },
// // // // //                 ]}
// // // // //               >
// // // // //                 {/* Progress Section */}
// // // // //                 <View style={styles.progressSection}>
// // // // //                   <View style={styles.timeLabels}>
// // // // //                     <Text style={styles.timeText}>
// // // // //                       {formatTime(status.currentTime)}
// // // // //                     </Text>
// // // // //                     <Text style={styles.timeText}>
// // // // //                       {formatTime(status.duration)}
// // // // //                     </Text>
// // // // //                   </View>

// // // // //                   <Slider
// // // // //                     style={styles.progressSlider}
// // // // //                     value={Math.min(
// // // // //                       status.currentTime || 0,
// // // // //                       status.duration || 0
// // // // //                     )}
// // // // //                     minimumValue={0}
// // // // //                     maximumValue={status.duration || 0}
// // // // //                     onSlidingStart={() => setIsSeeking(true)}
// // // // //                     onSlidingComplete={handleSeek}
// // // // //                     minimumTrackTintColor="#667eea"
// // // // //                     maximumTrackTintColor={isDark ? "#333" : "#ddd"}
// // // // //                     thumbTintColor="#667eea"
// // // // //                     disabled={controlsDisabled}
// // // // //                   />
// // // // //                 </View>

// // // // //                 {/* Main Controls */}
// // // // //                 <View style={styles.mainControls}>
// // // // //                   {/* Skip Back */}
// // // // //                   <TouchableOpacity
// // // // //                     style={styles.skipButton}
// // // // //                     onPress={goBack}
// // // // //                     disabled={controlsDisabled}
// // // // //                   >
// // // // //                     <Ionicons
// // // // //                       name="play-skip-back"
// // // // //                       size={32}
// // // // //                       color={
// // // // //                         controlsDisabled ? "#999" : isDark ? "#fff" : "#333"
// // // // //                       }
// // // // //                     />
// // // // //                     <Text style={styles.skipText}>15s</Text>
// // // // //                   </TouchableOpacity>

// // // // //                   {/* Play/Pause Button */}
// // // // //                   <View style={{}}>
// // // // //                     <TouchableOpacity
// // // // //                       style={[
// // // // //                         styles.playButton,
// // // // //                         { opacity: controlsDisabled ? 0.5 : 1 },
// // // // //                       ]}
// // // // //                       onPress={togglePlayPause}
// // // // //                       disabled={controlsDisabled}
// // // // //                     >
// // // // //                       <LinearGradient
// // // // //                         colors={["#667eea", "#764ba2"]}
// // // // //                         style={styles.playButtonGradient}
// // // // //                       >
// // // // //                         <Ionicons
// // // // //                           name={status?.playing ? "pause" : "play"}
// // // // //                           size={36}
// // // // //                           color="#fff"
// // // // //                         />
// // // // //                       </LinearGradient>
// // // // //                     </TouchableOpacity>
// // // // //                   </View>

// // // // //                   {/* Skip Forward */}
// // // // //                   <TouchableOpacity
// // // // //                     style={styles.skipButton}
// // // // //                     onPress={goForward}
// // // // //                     disabled={controlsDisabled}
// // // // //                   >
// // // // //                     <Ionicons
// // // // //                       name="play-skip-forward"
// // // // //                       size={32}
// // // // //                       color={
// // // // //                         controlsDisabled ? "#999" : isDark ? "#fff" : "#333"
// // // // //                       }
// // // // //                     />
// // // // //                     <Text style={styles.skipText}>15s</Text>
// // // // //                   </TouchableOpacity>
// // // // //                 </View>

// // // // //                 {/* Secondary Controls */}
// // // // //                 <View style={styles.secondaryControls}>
// // // // //                   {/* Speed Control */}
// // // // //                   <TouchableOpacity
// // // // //                     style={styles.speedButton}
// // // // //                     onPress={() => setShowSpeedMenu(!showSpeedMenu)}
// // // // //                   >
// // // // //                     <Text style={styles.speedText}>{playbackSpeed}x</Text>
// // // // //                   </TouchableOpacity>

// // // // //                   {/* Stop Button */}
// // // // //                   <TouchableOpacity
// // // // //                     style={styles.stopButton}
// // // // //                     onPress={stopPlayback}
// // // // //                     disabled={controlsDisabled}
// // // // //                   >
// // // // //                     <Ionicons
// // // // //                       name="stop"
// // // // //                       size={24}
// // // // //                       color={controlsDisabled ? "#999" : "#ff6b6b"}
// // // // //                     />
// // // // //                   </TouchableOpacity>
// // // // //                 </View>

// // // // //                 {/* Speed Menu */}
// // // // //                 {showSpeedMenu && (
// // // // //                   <View
// // // // //                     style={[
// // // // //                       styles.speedMenu,
// // // // //                       { backgroundColor: Colors[colorScheme].contrast },
// // // // //                     ]}
// // // // //                   >
// // // // //                     {speedOptions.map((speed) => (
// // // // //                       <TouchableOpacity
// // // // //                         key={speed}
// // // // //                         style={[
// // // // //                           styles.speedOption,
// // // // //                           playbackSpeed === speed && styles.speedOptionActive,
// // // // //                         ]}
// // // // //                         onPress={() => handleSpeedChange(speed)}
// // // // //                       >
// // // // //                         <Text
// // // // //                           style={[
// // // // //                             styles.speedOptionText,
// // // // //                             playbackSpeed === speed &&
// // // // //                               styles.speedOptionTextActive,
// // // // //                           ]}
// // // // //                         >
// // // // //                           {speed}x
// // // // //                         </Text>
// // // // //                       </TouchableOpacity>
// // // // //                     ))}
// // // // //                   </View>
// // // // //                 )}
// // // // //               </View>
// // // // //             )}
// // // // //           </Animated.View>
// // // // //         </ScrollView>
// // // // //       </SafeAreaView>
// // // // //     </LinearGradient>
// // // // //   );
// // // // // };

// // // // // const styles = StyleSheet.create({
// // // // //   container: {
// // // // //     flex: 1,
// // // // //   },
// // // // //   content: {
// // // // //     flex: 1,
// // // // //     justifyContent: "flex-start",
// // // // //   },
// // // // //   heroSection: {
// // // // //     flex: 1,
// // // // //   },
// // // // //   headerContainer: {
// // // // //     flex: 1,
// // // // //     paddingHorizontal: 20,
// // // // //     paddingTop: 20,
// // // // //     paddingBottom: 30,
// // // // //     alignItems: "center",
// // // // //   },
// // // // //   coverArtContainer: {
// // // // //     position: "relative",
// // // // //     marginBottom: 20,
// // // // //   },
// // // // //   coverArt: {
// // // // //     width: 200,
// // // // //     height: 200,
// // // // //     borderRadius: 20,
// // // // //     shadowColor: "#000",
// // // // //     shadowOffset: { width: 0, height: 10 },
// // // // //     shadowOpacity: 0.3,
// // // // //     shadowRadius: 20,
// // // // //     elevation: 10,
// // // // //   },
// // // // //   coverArtShadow: {
// // // // //     position: "absolute",
// // // // //     top: 10,
// // // // //     left: 10,
// // // // //     right: 10,
// // // // //     bottom: 10,
// // // // //     backgroundColor: "rgba(0,0,0,0.2)",
// // // // //     borderRadius: 20,
// // // // //     zIndex: -1,
// // // // //   },
// // // // //   podcastInfo: {
// // // // //     flexDirection: "column",
// // // // //     alignItems: "center",
// // // // //     paddingHorizontal: 20,
// // // // //   },
// // // // //   podcastTitle: {
// // // // //     fontSize: 24,
// // // // //     fontWeight: "bold",
// // // // //     color: "#fff",
// // // // //     textAlign: "center",
// // // // //     textShadowColor: "rgba(0,0,0,0.3)",
// // // // //     textShadowOffset: { width: 0, height: 1 },
// // // // //     textShadowRadius: 3,
// // // // //   },
// // // // //   podcastDescription: {
// // // // //     fontSize: 16,
// // // // //     color: "rgba(255,255,255,0.9)",
// // // // //     textAlign: "center",
// // // // //     lineHeight: 22,
// // // // //     marginBottom: 12,
// // // // //   },
// // // // //   durationContainer: {
// // // // //     flexDirection: "row",
// // // // //     alignItems: "center",
// // // // //     backgroundColor: "rgba(255,255,255,0.2)",
// // // // //     paddingHorizontal: 12,
// // // // //     paddingVertical: 6,
// // // // //     borderRadius: 20,
// // // // //   },
// // // // //   durationText: {
// // // // //     color: "#fff",
// // // // //     fontSize: 14,
// // // // //     fontWeight: "600",
// // // // //     marginLeft: 4,
// // // // //   },
// // // // //   favoriteButton: {
// // // // //     backgroundColor: "rgba(255,255,255,0.2)",
// // // // //     padding: 12,
// // // // //     borderRadius: 25,
// // // // //   },
// // // // //   errorContainer: {
// // // // //     flexDirection: "row",
// // // // //     alignItems: "center",
// // // // //     backgroundColor: "#ffe6e6",
// // // // //     margin: 20,
// // // // //     padding: 16,
// // // // //     borderRadius: 12,
// // // // //     borderLeftWidth: 4,
// // // // //     borderLeftColor: "#ff6b6b",
// // // // //   },
// // // // //   errorText: {
// // // // //     color: "#d63031",
// // // // //     fontSize: 16,
// // // // //     marginLeft: 12,
// // // // //     flex: 1,
// // // // //   },
// // // // //   downloadContainer: {
// // // // //     margin: 20,
// // // // //     padding: 20,
// // // // //     backgroundColor: "#fff",
// // // // //     borderRadius: 16,
// // // // //     shadowColor: "#000",
// // // // //     shadowOffset: { width: 0, height: 2 },
// // // // //     shadowOpacity: 0.1,
// // // // //     shadowRadius: 8,
// // // // //     elevation: 4,
// // // // //   },
// // // // //   downloadText: {
// // // // //     fontSize: 16,
// // // // //     fontWeight: "600",
// // // // //     color: "#333",
// // // // //     textAlign: "center",
// // // // //     marginBottom: 12,
// // // // //   },
// // // // //   progressBarContainer: {
// // // // //     height: 8,
// // // // //     backgroundColor: "#e9ecef",
// // // // //     borderRadius: 4,
// // // // //     overflow: "hidden",
// // // // //   },
// // // // //   progressBar: {
// // // // //     height: "100%",
// // // // //     backgroundColor: "#667eea",
// // // // //     borderRadius: 4,
// // // // //   },
// // // // //   downloadButton: {
// // // // //     margin: 20,
// // // // //     borderRadius: 16,
// // // // //     overflow: "hidden",
// // // // //     shadowColor: "#000",
// // // // //     shadowOffset: { width: 0, height: 4 },
// // // // //     shadowOpacity: 0.2,
// // // // //     shadowRadius: 12,
// // // // //     elevation: 6,
// // // // //   },
// // // // //   downloadButtonGradient: {
// // // // //     flexDirection: "row",
// // // // //     alignItems: "center",
// // // // //     justifyContent: "center",
// // // // //     padding: 18,
// // // // //   },
// // // // //   downloadButtonText: {
// // // // //     color: "#fff",
// // // // //     fontSize: 18,
// // // // //     fontWeight: "600",
// // // // //     marginLeft: 12,
// // // // //   },
// // // // //   loadingContainer: {
// // // // //     alignItems: "center",
// // // // //     padding: 40,
// // // // //   },
// // // // //   loadingText: {
// // // // //     fontSize: 16,
// // // // //     color: "#666",
// // // // //     marginTop: 12,
// // // // //   },
// // // // //   playerContainer: {
// // // // //     margin: 20,
// // // // //     borderRadius: 20,
// // // // //     padding: 24,
// // // // //     shadowRadius: 12,
// // // // //     elevation: 6,
// // // // //   },
// // // // //   progressSection: {
// // // // //     marginBottom: 24,
// // // // //   },
// // // // //   timeLabels: {
// // // // //     flexDirection: "row",
// // // // //     justifyContent: "space-between",
// // // // //     marginBottom: 8,
// // // // //   },
// // // // //   timeText: {
// // // // //     fontSize: 14,
// // // // //     color: "#666",
// // // // //     fontWeight: "500",
// // // // //   },
// // // // //   progressSlider: {
// // // // //     width: "100%",
// // // // //     height: 40,
// // // // //   },
// // // // //   mainControls: {
// // // // //     flexDirection: "row",
// // // // //     alignItems: "center",
// // // // //     justifyContent: "space-around",
// // // // //     marginBottom: 20,
// // // // //   },
// // // // //   skipButton: {
// // // // //     alignItems: "center",
// // // // //     padding: 12,
// // // // //   },
// // // // //   skipText: {
// // // // //     fontSize: 12,
// // // // //     color: "#666",
// // // // //     marginTop: 4,
// // // // //     fontWeight: "500",
// // // // //   },
// // // // //   playButton: {
// // // // //     shadowColor: "#667eea",
// // // // //     shadowOffset: { width: 0, height: 2 },
// // // // //     shadowOpacity: 0.2,
// // // // //     shadowRadius: 8,
// // // // //     elevation: 6,
// // // // //   },
// // // // //   playButtonGradient: {
// // // // //     width: 80,
// // // // //     height: 80,
// // // // //     borderRadius: 40,
// // // // //     alignItems: "center",
// // // // //     justifyContent: "center",
// // // // //   },
// // // // //   secondaryControls: {
// // // // //     flexDirection: "row",
// // // // //     justifyContent: "space-between",
// // // // //     alignItems: "center",
// // // // //   },
// // // // //   speedButton: {
// // // // //     backgroundColor: "#ccc",
// // // // //     paddingHorizontal: 16,
// // // // //     paddingVertical: 8,
// // // // //     borderRadius: 20,
// // // // //     borderWidth: 1,
// // // // //     borderColor: "#e9ecef",
// // // // //   },
// // // // //   speedText: {
// // // // //     fontSize: 14,
// // // // //     fontWeight: "600",
// // // // //     color: "#495057",
// // // // //   },
// // // // //   stopButton: {
// // // // //     backgroundColor: "#fecaca",
// // // // //     padding: 12,
// // // // //     borderRadius: 25,
// // // // //     borderWidth: 1,
// // // // //   },
// // // // //   speedMenu: {
// // // // //     position: "absolute",
// // // // //     bottom: 80,
// // // // //     left: 24,
// // // // //     borderRadius: 12,
// // // // //     padding: 8,
// // // // //     shadowColor: "#000",
// // // // //     shadowOffset: { width: 0, height: 4 },
// // // // //     shadowOpacity: 0.15,
// // // // //     shadowRadius: 12,
// // // // //     elevation: 8,
// // // // //     zIndex: 1000,
// // // // //   },
// // // // //   speedOption: {
// // // // //     paddingHorizontal: 16,
// // // // //     paddingVertical: 8,
// // // // //     borderRadius: 8,
// // // // //   },
// // // // //   speedOptionActive: {
// // // // //     backgroundColor: "#667eea",
// // // // //   },
// // // // //   speedOptionText: {
// // // // //     fontSize: 14,
// // // // //     fontWeight: "500",
// // // // //     color: "#495057",
// // // // //   },
// // // // //   speedOptionTextActive: {
// // // // //     color: "#fff",
// // // // //   },
// // // // // });

// // // //! Global
// // // import React, { useCallback, useEffect, useMemo, useState } from "react";
// // // import {
// // //   ActivityIndicator,
// // //   Animated,
// // //   Easing,
// // //   ScrollView,
// // //   StyleSheet,
// // //   Text,
// // //   TouchableOpacity,
// // //   useColorScheme,
// // //   View,
// // // } from "react-native";
// // // import { SafeAreaView } from "react-native-safe-area-context";
// // // import { useTranslation } from "react-i18next";
// // // import Slider from "@react-native-community/slider";
// // // import { AntDesign, Ionicons } from "@expo/vector-icons";
// // // import { LinearGradient } from "expo-linear-gradient";
// // // import { Image } from "expo-image";
// // // import { Asset } from "expo-asset";
// // // import { useEvent } from "expo";
// // // import { VideoSource } from "expo-video";
// // // import { setAudioModeAsync } from "expo-audio";

// // // import { Colors } from "@/constants/Colors";
// // // import { PodcastPlayerPropsType } from "@/constants/Types";
// // // import { useLanguage } from "@/contexts/LanguageContext";
// // // import { remoteUrlFor, usePodcasts } from "@/hooks/usePodcasts";
// // // import { useRefreshFavorites } from "@/stores/refreshFavoriteStore";
// // // import { isPodcastFavorited, togglePodcastFavorite } from "@/utils/favorites";
// // // import HeaderLeftBackButton from "./HeaderLeftBackButton";

// // // // ✅ singleton player that persists across screens
// // // import { globalPlayer as player } from "@/components/GlobalVideoHost";

// // // // Optional: annotate a custom field on the player to remember what's loaded
// // // type PlayerWithTag = typeof player & { __currentUri?: string };

// // // export const PodcastPlayer: React.FC<PodcastPlayerPropsType> = ({
// // //   podcast,
// // // }) => {
// // //   const { language } = useLanguage();
// // //   const { download, getCachedUri } = usePodcasts(language || "de");
// // //   const { triggerRefreshFavorites } = useRefreshFavorites();
// // //   const { t } = useTranslation();
// // //   const colorScheme = useColorScheme() || "light";
// // //   const isDark = colorScheme === "dark";

// // //   // UI state
// // //   const [isFavorite, setIsFavorite] = useState(false);
// // //   const [sourceUri, setSourceUri] = useState<string | null>(null);
// // //   const [downloadProgress, setDownloadProgress] = useState(0);
// // //   const [playerError, setPlayerError] = useState<string | null>(null);
// // //   const [didInitiatePlayback, setDidInitiatePlayback] = useState(false);
// // //   const [isSeeking, setIsSeeking] = useState(false);
// // //   const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
// // //   const [showSpeedMenu, setShowSpeedMenu] = useState(false);

// // //   // progress state
// // //   const [positionSec, setPositionSec] = useState(0);
// // //   const [durationSec, setDurationSec] = useState(0);

// // //   // animations
// // //   const [fadeAnim] = useState(new Animated.Value(0));
// // //   const [slideAnim] = useState(new Animated.Value(50));

// // //   // ---- Artwork (for lockscreen/notification) ----
// // //   const logoAsset = Asset.fromModule(require("@/assets/images/logo.png"));
// // //   const artworkUri = logoAsset?.uri ?? undefined;

// // //   // ---- Derive the two possible URIs for this episode ----
// // //   const [cachedUri, setCachedUri] = useState<string | null>(null);
// // //   const remoteUri = podcast.filename ? remoteUrlFor(podcast.filename) : null;

// // //   useEffect(() => {
// // //     let alive = true;
// // //     (async () => {
// // //       if (!podcast.filename) return;
// // //       try {
// // //         const uri = await getCachedUri(podcast.filename);
// // //         if (alive) setCachedUri(uri ?? null);
// // //       } catch {}
// // //     })();
// // //     return () => {
// // //       alive = false;
// // //     };
// // //   }, [podcast.id, podcast.filename, getCachedUri]);

// // //   // If the global player is already on THIS episode, bind UI to that without replacing
// // //   useEffect(() => {
// // //     const p = player as PlayerWithTag;
// // //     const current = p.__currentUri;
// // //     if (!current) return; // player not loaded yet

// // //     // If the player has either the cached or remote URI for this episode, bind UI to it
// // //     if (
// // //       (cachedUri && current === cachedUri) ||
// // //       (remoteUri && current === remoteUri)
// // //     ) {
// // //       setSourceUri(current);
// // //       // Do NOT reset didInitiatePlayback; let playback continue seamlessly
// // //     } else {
// // //       // Different episode is playing; show buttons but don’t auto stop/replace
// // //       setSourceUri(null);
// // //     }
// // //   }, [cachedUri, remoteUri]);

// // //   // ---- Build VideoSource with metadata (from selected sourceUri) ----
// // //   const sourceWithMetadata = useMemo<VideoSource | null>(() => {
// // //     if (!sourceUri) return null;
// // //     return {
// // //       uri: sourceUri,
// // //       metadata: {
// // //         title: podcast.title ?? "Podcast",
// // //         artist: "Podcast",
// // //         artwork: artworkUri,
// // //       },
// // //     };
// // //   }, [sourceUri, podcast.title, artworkUri]);

// // //   // ---- Only replace when URI actually changes ----
// // //   useEffect(() => {
// // //     (async () => {
// // //       const p = player as PlayerWithTag;
// // //       if (!sourceWithMetadata) return;

// // //       // Guard: if already loaded, do nothing (prevents restart)
// // //       if (p.__currentUri === sourceWithMetadata.uri) {
// // //         // keep speed in sync
// // //         try {
// // //           p.playbackRate = playbackSpeed;
// // //         } catch {}
// // //         return;
// // //       }

// // //       const wasPlaying = p.playing;
// // //       try {
// // //         await p.replaceAsync(sourceWithMetadata);
// // //         p.__currentUri = sourceWithMetadata.uri; // remember what we loaded
// // //         p.playbackRate = playbackSpeed;

// // //         if (didInitiatePlayback || wasPlaying) {
// // //           p.play();
// // //         } else {
// // //           // do nothing; don’t pause an already-playing other episode here
// // //         }
// // //       } catch (e: any) {
// // //         setPlayerError(e?.message ?? "Player error");
// // //       }
// // //     })();
// // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // //   }, [sourceWithMetadata]);

// // //   // ---- Player events (no initial-state arg) ----
// // //   const playingEvt = useEvent(player, "playingChange");
// // //   const isPlaying = !!playingEvt?.isPlaying;

// // //   const sourceLoadEvt = useEvent(player, "sourceLoad");
// // //   const timeEvt = useEvent(player, "timeUpdate");

// // //   // Set duration when source loads
// // //   useEffect(() => {
// // //     setDurationSec(player.duration ?? 0);
// // //   }, [sourceLoadEvt]);

// // //   // Progress updates
// // //   useEffect(() => {
// // //     setPositionSec(timeEvt?.currentTime ?? player.currentTime ?? 0);
// // //     const d = player.duration;
// // //     if (typeof d === "number" && d !== durationSec) setDurationSec(d);
// // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // //   }, [timeEvt]);

// // //   // Background-friendly audio session
// // //   useEffect(() => {
// // //     setAudioModeAsync({
// // //       shouldPlayInBackground: true,
// // //       playsInSilentMode: true,
// // //       allowsRecording: false,
// // //       shouldRouteThroughEarpiece: false,
// // //       interruptionMode: "doNotMix",
// // //       interruptionModeAndroid: "doNotMix",
// // //     } as any).catch(() => {});
// // //   }, []);

// // //   // Entrance animation
// // //   useEffect(() => {
// // //     Animated.parallel([
// // //       Animated.timing(fadeAnim, {
// // //         toValue: 1,
// // //         duration: 800,
// // //         useNativeDriver: true,
// // //       }),
// // //       Animated.timing(slideAnim, {
// // //         toValue: 0,
// // //         duration: 600,
// // //         easing: Easing.out(Easing.cubic),
// // //         useNativeDriver: true,
// // //       }),
// // //     ]).start();
// // //   }, []);

// // //   // Favorites
// // //   useEffect(() => {
// // //     (async () => {
// // //       if (!podcast.id) return;
// // //       try {
// // //         setIsFavorite(await isPodcastFavorited(podcast.id));
// // //       } catch {}
// // //     })();
// // //   }, [podcast.id]);

// // //   const onPressToggleFavorite = useCallback(async () => {
// // //     if (!podcast.id) return;
// // //     try {
// // //       const newStatus = await togglePodcastFavorite(podcast.id);
// // //       setIsFavorite(newStatus);
// // //       triggerRefreshFavorites();
// // //     } catch {}
// // //   }, [podcast.id, triggerRefreshFavorites]);

// // //   // ---- Actions to choose a source (DON’T clear/replace automatically) ----
// // //   const handleDownload = useCallback(async () => {
// // //     if (!podcast.filename) {
// // //       setPlayerError("Audio path missing.");
// // //       return;
// // //     }
// // //     setPlayerError(null);
// // //     setDownloadProgress(0);
// // //     setDidInitiatePlayback(true); // user intent

// // //     try {
// // //       const localUri = await download.mutateAsync({
// // //         filename: podcast.filename,
// // //         onProgress: setDownloadProgress,
// // //       });
// // //       setSourceUri(localUri); // triggers guarded replace effect
// // //     } catch (err: any) {
// // //       const msg = err instanceof Error ? err.message : "Unknown download error";
// // //       setPlayerError(`Download failed: ${msg}`);
// // //       setDownloadProgress(0);
// // //     }
// // //   }, [podcast.filename, download]);

// // //   const handleStream = useCallback(() => {
// // //     if (!podcast.filename) return;
// // //     setPlayerError(null);
// // //     setDownloadProgress(0);
// // //     setDidInitiatePlayback(true); // user intent
// // //     setSourceUri(remoteUrlFor(podcast.filename)); // triggers guarded replace effect
// // //   }, [podcast.filename]);

// // //   // ---- Controls ----
// // //   const togglePlayPause = useCallback(() => {
// // //     if (playerError) return;
// // //     const p = player as PlayerWithTag;
// // //     if (!p.__currentUri) return; // nothing loaded yet
// // //     if (isPlaying) p.pause();
// // //     else p.play();
// // //   }, [isPlaying, playerError]);

// // //   const goBack = () => player.seekBy(-15);
// // //   const goForward = () => player.seekBy(15);

// // //   const handleSeek = useCallback((value: number) => {
// // //     setIsSeeking(false);
// // //     player.currentTime = value; // precise seek
// // //   }, []);

// // //   const stopPlayback = useCallback(() => {
// // //     try {
// // //       player.pause();
// // //       player.currentTime = 0;
// // //     } catch {}
// // //   }, []);

// // //   const speedOptions = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
// // //   const handleSpeedChange = (speed: number) => {
// // //     try {
// // //       player.playbackRate = speed;
// // //       setPlaybackSpeed(speed);
// // //       setShowSpeedMenu(false);
// // //     } catch {
// // //       setPlayerError("Unable to change speed on this device.");
// // //     }
// // //   };

// // //   // ---- Derived UI flags ----
// // //   const isPreparing = download.isPending;
// // //   const isLoading = isPreparing; // replacing is instant; duration will populate via event
// // //   const canPlay =
// // //     (durationSec ?? 0) > 0 || (player as PlayerWithTag).__currentUri;
// // //   const showInitialButton =
// // //     !sourceUri &&
// // //     !(player as PlayerWithTag).__currentUri &&
// // //     !isLoading &&
// // //     !playerError;
// // //   const showPlaybackControls = !!canPlay;
// // //   const showDownloadProgress = download.isPending;
// // //   const controlsDisabled = isLoading || !!playerError || isSeeking;

// // //   const formatTime = (secs?: number | null): string => {
// // //     if (!secs || secs < 0 || isNaN(secs)) return "0:00";
// // //     const total = Math.floor(secs);
// // //     const hours = Math.floor(total / 3600);
// // //     const minutes = Math.floor((total % 3600) / 60);
// // //     const seconds = total % 60;
// // //     if (hours > 0) {
// // //       return `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${
// // //         seconds < 10 ? "0" : ""
// // //       }${seconds}`;
// // //     }
// // //     return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
// // //   };

// // //   return (
// // //     <LinearGradient
// // //       colors={isDark ? ["#242c40", "#27272a"] : ["#6366f1", "#818cf8"]}
// // //       style={styles.heroSection}
// // //     >
// // //       <SafeAreaView style={{ flex: 1 }} edges={["top", "left"]}>
// // //         <View style={{ marginLeft: 20 }}>
// // //           <HeaderLeftBackButton color={isDark ? "#fff" : "#000"} size={35} />
// // //         </View>

// // //         <ScrollView
// // //           style={[styles.container]}
// // //           showsVerticalScrollIndicator={false}
// // //           contentContainerStyle={{ flexGrow: 0 }}
// // //         >
// // //           <Animated.View
// // //             style={[
// // //               styles.content,
// // //               { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
// // //             ]}
// // //           >
// // //             <View style={styles.headerContainer}>
// // //               {/* Cover Art */}
// // //               <View style={styles.coverArtContainer}>
// // //                 <Image
// // //                   source={require("@/assets/images/logo.png")}
// // //                   style={styles.coverArt}
// // //                   contentFit="cover"
// // //                 />
// // //                 <View style={styles.coverArtShadow} />
// // //               </View>

// // //               {/* Podcast Info */}
// // //               <View style={styles.podcastInfo}>
// // //                 <View
// // //                   style={{
// // //                     flexDirection: "row",
// // //                     justifyContent: "center",
// // //                     alignItems: "center",
// // //                     gap: 10,
// // //                     marginBottom: 20,
// // //                   }}
// // //                 >
// // //                   <Text style={styles.podcastTitle} numberOfLines={2}>
// // //                     {podcast.title}
// // //                   </Text>
// // //                   <TouchableOpacity
// // //                     onPress={onPressToggleFavorite}
// // //                     style={styles.favoriteButton}
// // //                   >
// // //                     <AntDesign
// // //                       name={isFavorite ? "star" : "staro"}
// // //                       size={25}
// // //                       color={isFavorite ? Colors.universal.favorite : "#fff"}
// // //                     />
// // //                   </TouchableOpacity>
// // //                 </View>
// // //                 <Text style={styles.podcastDescription} numberOfLines={3}>
// // //                   {podcast.description}
// // //                 </Text>

// // //                 {canPlay && (
// // //                   <View style={styles.durationContainer}>
// // //                     <Ionicons name="time-outline" size={16} color="#fff" />
// // //                     <Text style={styles.durationText}>
// // //                       {formatTime(durationSec)}
// // //                     </Text>
// // //                   </View>
// // //                 )}
// // //               </View>
// // //             </View>

// // //             {/* Error */}
// // //             {!!playerError && (
// // //               <View style={styles.errorContainer}>
// // //                 <Ionicons name="alert-circle" size={24} color="#ff6b6b" />
// // //                 <Text style={styles.errorText}>{playerError}</Text>
// // //               </View>
// // //             )}

// // //             {/* Download Progress */}
// // //             {showDownloadProgress && (
// // //               <View style={styles.downloadContainer}>
// // //                 <Text style={styles.downloadText}>
// // //                   {t("downloading")} {Math.round(downloadProgress * 100)}%
// // //                 </Text>
// // //                 <View style={styles.progressBarContainer}>
// // //                   <View
// // //                     style={[
// // //                       styles.progressBar,
// // //                       { width: `${Math.round(downloadProgress * 100)}%` },
// // //                     ]}
// // //                   />
// // //                 </View>
// // //               </View>
// // //             )}

// // //             {/* Stream Button (only if nothing is playing yet) */}
// // //             {showInitialButton && (
// // //               <TouchableOpacity
// // //                 style={styles.downloadButton}
// // //                 onPress={handleStream}
// // //               >
// // //                 <LinearGradient
// // //                   colors={["#667eea", "#764ba2"]}
// // //                   style={styles.downloadButtonGradient}
// // //                 >
// // //                   <Ionicons name="play" size={24} color="#fff" />
// // //                   <Text style={styles.downloadButtonText}>{t("stream")}</Text>
// // //                 </LinearGradient>
// // //               </TouchableOpacity>
// // //             )}

// // //             {/* Download Button */}
// // //             <TouchableOpacity
// // //               style={styles.downloadButton}
// // //               onPress={handleDownload}
// // //               disabled={isLoading}
// // //             >
// // //               <LinearGradient
// // //                 colors={["#667eea", "#764ba2"]}
// // //                 style={styles.downloadButtonGradient}
// // //               >
// // //                 <Ionicons name="download" size={24} color="#fff" />
// // //                 <Text style={styles.downloadButtonText}>{t("download")}</Text>
// // //               </LinearGradient>
// // //             </TouchableOpacity>

// // //             {/* Loading */}
// // //             {isLoading && !playerError && (
// // //               <View style={styles.loadingContainer}>
// // //                 <ActivityIndicator size="large" color="#667eea" />
// // //                 <Text style={styles.loadingText}>
// // //                   {isPreparing ? t("preparing") : t("loading")}
// // //                 </Text>
// // //               </View>
// // //             )}

// // //             {/* Player Controls */}
// // //             {showPlaybackControls && !playerError && (
// // //               <View
// // //                 style={[
// // //                   styles.playerContainer,
// // //                   {
// // //                     backgroundColor: Colors[colorScheme].contrast,
// // //                     shadowColor: Colors[colorScheme].border,
// // //                   },
// // //                 ]}
// // //               >
// // //                 {/* Progress */}
// // //                 <View style={styles.progressSection}>
// // //                   <View style={styles.timeLabels}>
// // //                     <Text style={styles.timeText}>
// // //                       {formatTime(positionSec)}
// // //                     </Text>
// // //                     <Text style={styles.timeText}>
// // //                       {formatTime(durationSec)}
// // //                     </Text>
// // //                   </View>

// // //                   <Slider
// // //                     style={styles.progressSlider}
// // //                     value={Math.min(positionSec || 0, durationSec || 0)}
// // //                     minimumValue={0}
// // //                     maximumValue={durationSec || 0}
// // //                     onSlidingStart={() => setIsSeeking(true)}
// // //                     onSlidingComplete={handleSeek}
// // //                     minimumTrackTintColor="#667eea"
// // //                     maximumTrackTintColor={isDark ? "#333" : "#ddd"}
// // //                     thumbTintColor="#667eea"
// // //                     disabled={controlsDisabled}
// // //                   />
// // //                 </View>

// // //                 {/* Main Controls */}
// // //                 <View style={styles.mainControls}>
// // //                   <TouchableOpacity
// // //                     style={styles.skipButton}
// // //                     onPress={goBack}
// // //                     disabled={controlsDisabled}
// // //                   >
// // //                     <Ionicons
// // //                       name="play-skip-back"
// // //                       size={32}
// // //                       color={
// // //                         controlsDisabled ? "#999" : isDark ? "#fff" : "#333"
// // //                       }
// // //                     />
// // //                     <Text style={styles.skipText}>15s</Text>
// // //                   </TouchableOpacity>

// // //                   <View>
// // //                     <TouchableOpacity
// // //                       style={[
// // //                         styles.playButton,
// // //                         { opacity: controlsDisabled ? 0.5 : 1 },
// // //                       ]}
// // //                       onPress={togglePlayPause}
// // //                       disabled={controlsDisabled}
// // //                     >
// // //                       <LinearGradient
// // //                         colors={["#667eea", "#764ba2"]}
// // //                         style={styles.playButtonGradient}
// // //                       >
// // //                         <Ionicons
// // //                           name={isPlaying ? "pause" : "play"}
// // //                           size={36}
// // //                           color="#fff"
// // //                         />
// // //                       </LinearGradient>
// // //                     </TouchableOpacity>
// // //                   </View>

// // //                   <TouchableOpacity
// // //                     style={styles.skipButton}
// // //                     onPress={goForward}
// // //                     disabled={controlsDisabled}
// // //                   >
// // //                     <Ionicons
// // //                       name="play-skip-forward"
// // //                       size={32}
// // //                       color={
// // //                         controlsDisabled ? "#999" : isDark ? "#fff" : "#333"
// // //                       }
// // //                     />
// // //                     <Text style={styles.skipText}>15s</Text>
// // //                   </TouchableOpacity>
// // //                 </View>

// // //                 {/* Secondary Controls */}
// // //                 <View style={styles.secondaryControls}>
// // //                   <TouchableOpacity
// // //                     style={styles.speedButton}
// // //                     onPress={() => setShowSpeedMenu(!showSpeedMenu)}
// // //                   >
// // //                     <Text style={styles.speedText}>{playbackSpeed}x</Text>
// // //                   </TouchableOpacity>

// // //                   <TouchableOpacity
// // //                     style={styles.stopButton}
// // //                     onPress={stopPlayback}
// // //                     disabled={controlsDisabled}
// // //                   >
// // //                     <Ionicons
// // //                       name="stop"
// // //                       size={24}
// // //                       color={controlsDisabled ? "#999" : "#ff6b6b"}
// // //                     />
// // //                   </TouchableOpacity>
// // //                 </View>

// // //                 {/* Speed Menu */}
// // //                 {showSpeedMenu && (
// // //                   <View
// // //                     style={[
// // //                       styles.speedMenu,
// // //                       { backgroundColor: Colors[colorScheme].contrast },
// // //                     ]}
// // //                   >
// // //                     {speedOptions.map((speed) => (
// // //                       <TouchableOpacity
// // //                         key={speed}
// // //                         style={[
// // //                           styles.speedOption,
// // //                           playbackSpeed === speed && styles.speedOptionActive,
// // //                         ]}
// // //                         onPress={() => handleSpeedChange(speed)}
// // //                       >
// // //                         <Text
// // //                           style={[
// // //                             styles.speedOptionText,
// // //                             playbackSpeed === speed &&
// // //                               styles.speedOptionTextActive,
// // //                           ]}
// // //                         >
// // //                           {speed}x
// // //                         </Text>
// // //                       </TouchableOpacity>
// // //                     ))}
// // //                   </View>
// // //                 )}
// // //               </View>
// // //             )}
// // //           </Animated.View>
// // //         </ScrollView>
// // //       </SafeAreaView>
// // //     </LinearGradient>
// // //   );
// // // };

// // // const styles = StyleSheet.create({
// // //   container: { flex: 1 },
// // //   content: { flex: 1, justifyContent: "flex-start" },
// // //   heroSection: { flex: 1 },
// // //   headerContainer: {
// // //     flex: 1,
// // //     paddingHorizontal: 20,
// // //     paddingTop: 20,
// // //     paddingBottom: 30,
// // //     alignItems: "center",
// // //   },
// // //   coverArtContainer: { position: "relative", marginBottom: 20 },
// // //   coverArt: {
// // //     width: 200,
// // //     height: 200,
// // //     borderRadius: 20,
// // //     shadowColor: "#000",
// // //     shadowOffset: { width: 0, height: 10 },
// // //     shadowOpacity: 0.3,
// // //     shadowRadius: 20,
// // //     elevation: 10,
// // //   },
// // //   coverArtShadow: {
// // //     position: "absolute",
// // //     top: 10,
// // //     left: 10,
// // //     right: 10,
// // //     bottom: 10,
// // //     backgroundColor: "rgba(0,0,0,0.2)",
// // //     borderRadius: 20,
// // //     zIndex: -1,
// // //   },
// // //   podcastInfo: {
// // //     flexDirection: "column",
// // //     alignItems: "center",
// // //     paddingHorizontal: 20,
// // //   },
// // //   podcastTitle: {
// // //     fontSize: 24,
// // //     fontWeight: "bold",
// // //     color: "#fff",
// // //     textAlign: "center",
// // //     textShadowColor: "rgba(0,0,0,0.3)",
// // //     textShadowOffset: { width: 0, height: 1 },
// // //     textShadowRadius: 3,
// // //   },
// // //   podcastDescription: {
// // //     fontSize: 16,
// // //     color: "rgba(255,255,255,0.9)",
// // //     textAlign: "center",
// // //     lineHeight: 22,
// // //     marginBottom: 12,
// // //   },
// // //   durationContainer: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     backgroundColor: "rgba(255,255,255,0.2)",
// // //     paddingHorizontal: 12,
// // //     paddingVertical: 6,
// // //     borderRadius: 20,
// // //   },
// // //   durationText: {
// // //     color: "#fff",
// // //     fontSize: 14,
// // //     fontWeight: "600",
// // //     marginLeft: 4,
// // //   },
// // //   favoriteButton: {
// // //     backgroundColor: "rgba(255,255,255,0.2)",
// // //     padding: 12,
// // //     borderRadius: 25,
// // //   },
// // //   errorContainer: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     backgroundColor: "#ffe6e6",
// // //     margin: 20,
// // //     padding: 16,
// // //     borderRadius: 12,
// // //     borderLeftWidth: 4,
// // //     borderLeftColor: "#ff6b6b",
// // //   },
// // //   errorText: { color: "#d63031", fontSize: 16, marginLeft: 12, flex: 1 },
// // //   downloadContainer: {
// // //     margin: 20,
// // //     padding: 20,
// // //     backgroundColor: "#fff",
// // //     borderRadius: 16,
// // //     shadowColor: "#000",
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.1,
// // //     shadowRadius: 8,
// // //     elevation: 4,
// // //   },
// // //   downloadText: {
// // //     fontSize: 16,
// // //     fontWeight: "600",
// // //     color: "#333",
// // //     textAlign: "center",
// // //     marginBottom: 12,
// // //   },
// // //   progressBarContainer: {
// // //     height: 8,
// // //     backgroundColor: "#e9ecef",
// // //     borderRadius: 4,
// // //     overflow: "hidden",
// // //   },
// // //   progressBar: { height: "100%", backgroundColor: "#667eea", borderRadius: 4 },
// // //   downloadButton: {
// // //     margin: 20,
// // //     borderRadius: 16,
// // //     overflow: "hidden",
// // //     shadowColor: "#000",
// // //     shadowOffset: { width: 0, height: 4 },
// // //     shadowOpacity: 0.2,
// // //     shadowRadius: 12,
// // //     elevation: 6,
// // //   },
// // //   downloadButtonGradient: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //     padding: 18,
// // //   },
// // //   downloadButtonText: {
// // //     color: "#fff",
// // //     fontSize: 18,
// // //     fontWeight: "600",
// // //     marginLeft: 12,
// // //   },
// // //   loadingContainer: { alignItems: "center", padding: 40 },
// // //   loadingText: { fontSize: 16, color: "#666", marginTop: 12 },
// // //   playerContainer: {
// // //     margin: 20,
// // //     borderRadius: 20,
// // //     padding: 24,
// // //     shadowRadius: 12,
// // //     elevation: 6,
// // //   },
// // //   progressSection: { marginBottom: 24 },
// // //   timeLabels: {
// // //     flexDirection: "row",
// // //     justifyContent: "space-between",
// // //     marginBottom: 8,
// // //   },
// // //   timeText: { fontSize: 14, color: "#666", fontWeight: "500" },
// // //   progressSlider: { width: "100%", height: 40 },
// // //   mainControls: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     justifyContent: "space-around",
// // //     marginBottom: 20,
// // //   },
// // //   skipButton: { alignItems: "center", padding: 12 },
// // //   skipText: { fontSize: 12, color: "#666", marginTop: 4, fontWeight: "500" },
// // //   playButton: {
// // //     shadowColor: "#667eea",
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.2,
// // //     shadowRadius: 8,
// // //     elevation: 6,
// // //   },
// // //   playButtonGradient: {
// // //     width: 80,
// // //     height: 80,
// // //     borderRadius: 40,
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //   },
// // //   secondaryControls: {
// // //     flexDirection: "row",
// // //     justifyContent: "space-between",
// // //     alignItems: "center",
// // //   },
// // //   speedButton: {
// // //     backgroundColor: "#ccc",
// // //     paddingHorizontal: 16,
// // //     paddingVertical: 8,
// // //     borderRadius: 20,
// // //     borderWidth: 1,
// // //     borderColor: "#e9ecef",
// // //   },
// // //   speedText: { fontSize: 14, fontWeight: "600", color: "#495057" },
// // //   stopButton: {
// // //     backgroundColor: "#fecaca",
// // //     padding: 12,
// // //     borderRadius: 25,
// // //     borderWidth: 1,
// // //   },
// // //   speedMenu: {
// // //     position: "absolute",
// // //     bottom: 80,
// // //     left: 24,
// // //     borderRadius: 12,
// // //     padding: 8,
// // //     shadowColor: "#000",
// // //     shadowOffset: { width: 0, height: 4 },
// // //     shadowOpacity: 0.15,
// // //     shadowRadius: 12,
// // //     elevation: 8,
// // //     zIndex: 1000,
// // //   },
// // //   speedOption: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
// // //   speedOptionActive: { backgroundColor: "#667eea" },
// // //   speedOptionText: { fontSize: 14, fontWeight: "500", color: "#495057" },
// // //   speedOptionTextActive: { color: "#fff" },
// // // });
// // // PodcastPlayer.tsx

// // //! Global mit minplayer
// // import React, { useCallback, useEffect, useMemo, useState } from "react";
// // import {
// //   ActivityIndicator,
// //   Animated,
// //   Easing,
// //   ScrollView,
// //   StyleSheet,
// //   Text,
// //   TouchableOpacity,
// //   useColorScheme,
// //   View,
// // } from "react-native";
// // import { SafeAreaView } from "react-native-safe-area-context";
// // import { useTranslation } from "react-i18next";
// // import Slider from "@react-native-community/slider";
// // import { AntDesign, Ionicons } from "@expo/vector-icons";
// // import { LinearGradient } from "expo-linear-gradient";
// // import { Image } from "expo-image";
// // import { Asset } from "expo-asset";
// // import { useEvent } from "expo";
// // import type { VideoSource } from "expo-video";
// // import { setAudioModeAsync } from "expo-audio";

// // import { Colors } from "@/constants/Colors";
// // import type { PodcastPlayerPropsType } from "@/constants/Types";
// // import { useLanguage } from "@/contexts/LanguageContext";
// // import { remoteUrlFor, usePodcasts } from "@/hooks/usePodcasts";
// // import { useRefreshFavorites } from "@/stores/refreshFavoriteStore";
// // import { isPodcastFavorited, togglePodcastFavorite } from "@/utils/favorites";
// // import HeaderLeftBackButton from "./HeaderLeftBackButton";

// // // ✅ singleton player that persists (mounted by GlobalVideoHost at app root)
// // import { globalPlayer as basePlayer } from "@/components/GlobalVideoHost";
// // import { usePathname } from "expo-router";

// // /** App-private fields tagged onto the player (note the `__` prefix). */
// // type TaggedPlayer = typeof basePlayer & {
// //   __currentKey?: string; // stable key for the loaded source (uri/asset)
// //   __currentUri?: string; // the exact string uri, if available
// //   __title?: string; // episode title for mini bar / now playing
// //   __artwork?: string; // artwork URI string (optional)
// //   __podcastId?: string | number; // for deep-link back to this episode
// // };
// // const player = basePlayer as TaggedPlayer;

// // /** Returns a stable string key for any source (including null/undefined). */
// // function getSourceKey(src: VideoSource | null | undefined): string {
// //   if (src == null) return "unknown";
// //   if (typeof src === "string") return src; // "https://.../file.mp3" or "file://..."
// //   if (typeof src === "number") return `asset:${src}`; // require(...) id
// //   // object case — guard property access with `in` checks
// //   if ("uri" in src && typeof src.uri === "string") return src.uri;
// //   if ("assetId" in src && typeof src.assetId === "number")
// //     return `asset:${src.assetId}`;
// //   return "unknown";
// // }

// // export const PodcastPlayer: React.FC<PodcastPlayerPropsType> = ({
// //   podcast,
// // }) => {
// //   const { language } = useLanguage();
// //   const { download, getCachedUri } = usePodcasts(language || "de");
// //   const { triggerRefreshFavorites } = useRefreshFavorites();
// //   const { t } = useTranslation();
// //   const scheme = useColorScheme() || "light";
// //   const isDark = scheme === "dark";

// //   // UI state
// //   const [isFavorite, setIsFavorite] = useState(false);
// //   const [sourceUri, setSourceUri] = useState<string | null>(null);
// //   const [cachedUri, setCachedUri] = useState<string | null>(null);
// //   const [downloadProgress, setDownloadProgress] = useState(0);
// //   const [playerError, setPlayerError] = useState<string | null>(null);
// //   const [didInitiatePlayback, setDidInitiatePlayback] = useState(false);
// //   const [isSeeking, setIsSeeking] = useState(false);
// //   const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
// //   const [showSpeedMenu, setShowSpeedMenu] = useState(false);

// //   // progress state
// //   const [positionSec, setPositionSec] = useState(0);
// //   const [durationSec, setDurationSec] = useState(0);

// //   // animations
// //   const [fadeAnim] = useState(new Animated.Value(0));
// //   const [slideAnim] = useState(new Animated.Value(50));

// //   // artwork for lock screen / notification
// //   const logoAsset = Asset.fromModule(require("@/assets/images/logo.png"));
// //   const artworkUri: string | undefined = logoAsset?.uri || undefined;

// //   // Precompute possible URIs for this episode
// //   const remoteUri = podcast.filename ? remoteUrlFor(podcast.filename) : null;

// //   // Load cached file URI (if previously downloaded)
// //   useEffect(() => {
// //     let alive = true;
// //     (async () => {
// //       if (!podcast.filename) {
// //         if (alive) setCachedUri(null);
// //         return;
// //       }
// //       try {
// //         const uri = await getCachedUri(podcast.filename);
// //         if (alive) setCachedUri(uri ?? null);
// //       } catch {
// //         if (alive) setCachedUri(null);
// //       }
// //     })();
// //     return () => {
// //       alive = false;
// //     };
// //   }, [podcast.id, podcast.filename, getCachedUri]);

// //   // If the global player is already loaded with THIS episode, bind UI to it
// //   useEffect(() => {
// //     const currentKey = player.__currentKey;
// //     if (!currentKey) return;
// //     if (currentKey === cachedUri || currentKey === remoteUri) {
// //       setSourceUri(currentKey);
// //     }
// //   }, [player.__currentKey, cachedUri, remoteUri]);

// //   // Build VideoSource with metadata (guard so we never pass null)
// //   const sourceWithMetadata = useMemo<VideoSource | null>(() => {
// //     if (!sourceUri) return null;
// //     return {
// //       uri: sourceUri,
// //       metadata: {
// //         title: podcast.title ?? "Podcast",
// //         artist: "Podcast",
// //         ...(artworkUri ? { artwork: artworkUri } : {}),
// //       },
// //     };
// //   }, [sourceUri, podcast.title, artworkUri]);

// //   // Only replace when the key actually changes (prevents unwanted restarts)
// //   useEffect(() => {
// //     if (!sourceWithMetadata) return;
// //     const src = sourceWithMetadata; // capture to keep TS narrow inside async

// //     (async () => {
// //       const nextKey = getSourceKey(src);
// //       if (player.__currentKey === nextKey) {
// //         // Keep speed in sync but don't restart playback
// //         try {
// //           player.playbackRate = playbackSpeed;
// //         } catch {}
// //         return;
// //       }

// //       const wasPlaying = player.playing;
// //       try {
// //         await player.replaceAsync(src);

// //         // ---- tag the global player for other UI (mini bar, etc.) ----
// //         player.__currentKey = nextKey;

// //         if ("uri" in src && typeof src.uri === "string") {
// //           player.__currentUri = src.uri;
// //         } else {
// //           player.__currentUri = undefined;
// //         }
// //         player.__title = podcast.title ?? "Podcast";
// //         player.__artwork = artworkUri; // may be undefined and that's OK
// //         player.__podcastId = podcast.id;

// //         // Playback settings
// //         player.playbackRate = playbackSpeed;
// //         if (wasPlaying || didInitiatePlayback) player.play();
// //       } catch (e: any) {
// //         setPlayerError(e?.message ?? "Player error");
// //       }
// //     })();
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [sourceWithMetadata]);

// //   // Player events (no polling). Payloads can be null -> guard reads.
// //   const playingEvt = useEvent(player, "playingChange");
// //   const sourceLoadEvt = useEvent(player, "sourceLoad");
// //   const timeEvt = useEvent(player, "timeUpdate");
// //   const isPlaying = !!playingEvt?.isPlaying;

// //   // Duration as soon as source loads
// //   useEffect(() => {
// //     const d = player.duration;
// //     if (typeof d === "number") setDurationSec(d);
// //   }, [sourceLoadEvt]);

// //   // Position on each tick; keep duration fresh for streams
// //   useEffect(() => {
// //     const cur =
// //       typeof timeEvt?.currentTime === "number"
// //         ? timeEvt.currentTime
// //         : player.currentTime;
// //     setPositionSec(typeof cur === "number" ? cur : 0);

// //     const d = player.duration;
// //     if (typeof d === "number" && d !== durationSec) setDurationSec(d);
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [timeEvt]);

// //   // Background / silent switch friendly audio session
// //   useEffect(() => {
// //     setAudioModeAsync({
// //       shouldPlayInBackground: true,
// //       playsInSilentMode: true,
// //       allowsRecording: false,
// //       shouldRouteThroughEarpiece: false,
// //       interruptionMode: "doNotMix",
// //       interruptionModeAndroid: "doNotMix",
// //     } as any).catch(() => {});
// //   }, []);

// //   // Entrance animation
// //   useEffect(() => {
// //     Animated.parallel([
// //       Animated.timing(fadeAnim, {
// //         toValue: 1,
// //         duration: 800,
// //         useNativeDriver: true,
// //       }),
// //       Animated.timing(slideAnim, {
// //         toValue: 0,
// //         duration: 600,
// //         easing: Easing.out(Easing.cubic),
// //         useNativeDriver: true,
// //       }),
// //     ]).start();
// //   }, []);

// //   // Playback rate (user changed speed)
// //   useEffect(() => {
// //     try {
// //       player.playbackRate = playbackSpeed;
// //     } catch {}
// //   }, [playbackSpeed]);

// //   // Reset intent when finished
// //   useEffect(() => {
// //     if (durationSec > 0 && positionSec >= durationSec - 0.25) {
// //       setDidInitiatePlayback(false);
// //     }
// //   }, [positionSec, durationSec]);

// //   // Favorites
// //   useEffect(() => {
// //     (async () => {
// //       if (!podcast.id) return;
// //       try {
// //         setIsFavorite(await isPodcastFavorited(podcast.id));
// //       } catch {}
// //     })();
// //   }, [podcast.id]);

// //   const onPressToggleFavorite = useCallback(async () => {
// //     if (!podcast.id) return;
// //     try {
// //       const newStatus = await togglePodcastFavorite(podcast.id);
// //       setIsFavorite(newStatus);
// //       triggerRefreshFavorites();
// //     } catch {}
// //   }, [podcast.id, triggerRefreshFavorites]);

// //   // Choose stream/download (don’t auto-clear/replace)
// //   const handleDownload = useCallback(async () => {
// //     if (!podcast.filename) {
// //       setPlayerError("Audio path missing.");
// //       return;
// //     }
// //     setPlayerError(null);
// //     setDownloadProgress(0);
// //     setDidInitiatePlayback(true);

// //     try {
// //       const localUri = await download.mutateAsync({
// //         filename: podcast.filename,
// //         onProgress: setDownloadProgress,
// //       });
// //       setSourceUri(localUri); // triggers guarded replace effect
// //     } catch (err: any) {
// //       const msg = err instanceof Error ? err.message : "Unknown download error";
// //       setPlayerError(`Download failed: ${msg}`);
// //       setDownloadProgress(0);
// //     }
// //   }, [podcast.filename, download]);

// //   const handleStream = useCallback(() => {
// //     if (!podcast.filename) return;
// //     setPlayerError(null);
// //     setDownloadProgress(0);
// //     setDidInitiatePlayback(true);
// //     setSourceUri(remoteUrlFor(podcast.filename)); // triggers guarded replace effect
// //   }, [podcast.filename]);

// //   // Controls
// //   const hasSomethingLoaded = !!player.__currentKey;

// //   const togglePlayPause = useCallback(() => {
// //     if (playerError) return;
// //     if (!hasSomethingLoaded) return;
// //     if (player.playing) player.pause();
// //     else {
// //       player.play();
// //       setDidInitiatePlayback(true);
// //     }
// //   }, [playerError, hasSomethingLoaded]);

// //   const goBack = () => player.seekBy(-15);
// //   const goForward = () => player.seekBy(15);

// //   const handleSeek = useCallback((value: number) => {
// //     setIsSeeking(false);
// //     player.currentTime = value; // precise seek
// //   }, []);

// //   const stopPlayback = useCallback(() => {
// //     if (!hasSomethingLoaded) return;
// //     try {
// //       player.pause();
// //       player.currentTime = 0;
// //     } catch {}
// //   }, [hasSomethingLoaded]);

// //   // Derived UI flags
// //   const isPreparing = download.isPending;
// //   const isLoading = isPreparing;
// //   const canPlay = hasSomethingLoaded || (durationSec ?? 0) > 0;

// //   // Show “Stream” only if literally nothing is loaded anywhere yet
// //   const showInitialButton =
// //     !hasSomethingLoaded && !sourceUri && !isLoading && !playerError;

// //   // Show controls whenever the global player has something
// //   const showPlaybackControls = hasSomethingLoaded && !playerError;
// //   const showDownloadProgress = download.isPending;
// //   const controlsDisabled = isLoading || !!playerError || isSeeking;

// //   const formatTime = (secs?: number | null): string => {
// //     if (!secs || secs < 0 || isNaN(secs)) return "0:00";
// //     const total = Math.floor(secs);
// //     const hours = Math.floor(total / 3600);
// //     const minutes = Math.floor((total % 3600) / 60);
// //     const seconds = total % 60;
// //     if (hours > 0) {
// //       return `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${
// //         seconds < 10 ? "0" : ""
// //       }${seconds}`;
// //     }
// //     return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
// //   };

// //   return (
// //     <LinearGradient
// //       colors={isDark ? ["#242c40", "#27272a"] : ["#6366f1", "#818cf8"]}
// //       style={styles.heroSection}
// //     >
// //       <SafeAreaView style={{ flex: 1 }} edges={["top", "left"]}>
// //         <View style={{ marginLeft: 20 }}>
// //           <HeaderLeftBackButton color={isDark ? "#fff" : "#000"} size={35} />
// //         </View>

// //         <ScrollView
// //           style={styles.container}
// //           showsVerticalScrollIndicator={false}
// //           contentContainerStyle={{ flexGrow: 0 }}
// //         >
// //           <Animated.View
// //             style={[
// //               styles.content,
// //               { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
// //             ]}
// //           >
// //             <View style={styles.headerContainer}>
// //               {/* Cover Art */}
// //               <View style={styles.coverArtContainer}>
// //                 <Image
// //                   source={require("@/assets/images/logo.png")}
// //                   style={styles.coverArt}
// //                   contentFit="cover"
// //                 />
// //                 <View style={styles.coverArtShadow} />
// //               </View>

// //               {/* Podcast Info */}
// //               <View style={styles.podcastInfo}>
// //                 <View
// //                   style={{
// //                     flexDirection: "row",
// //                     alignItems: "center",
// //                     gap: 10,
// //                     marginBottom: 20,
// //                   }}
// //                 >
// //                   <Text style={styles.podcastTitle} numberOfLines={2}>
// //                     {podcast.title}
// //                   </Text>
// //                   <TouchableOpacity
// //                     onPress={onPressToggleFavorite}
// //                     style={styles.favoriteButton}
// //                   >
// //                     <AntDesign
// //                       name={isFavorite ? "star" : "staro"}
// //                       size={25}
// //                       color={isFavorite ? Colors.universal.favorite : "#fff"}
// //                     />
// //                   </TouchableOpacity>
// //                 </View>

// //                 <Text style={styles.podcastDescription} numberOfLines={3}>
// //                   {podcast.description}
// //                 </Text>

// //                 {canPlay && (
// //                   <View style={styles.durationContainer}>
// //                     <Ionicons name="time-outline" size={16} color="#fff" />
// //                     <Text style={styles.durationText}>
// //                       {formatTime(durationSec)}
// //                     </Text>
// //                   </View>
// //                 )}
// //               </View>
// //             </View>

// //             {/* Error */}
// //             {!!playerError && (
// //               <View style={styles.errorContainer}>
// //                 <Ionicons name="alert-circle" size={24} color="#ff6b6b" />
// //                 <Text style={styles.errorText}>{playerError}</Text>
// //               </View>
// //             )}

// //             {/* Download Progress */}
// //             {showDownloadProgress && (
// //               <View style={styles.downloadContainer}>
// //                 <Text style={styles.downloadText}>
// //                   {t("downloading")} {Math.round(downloadProgress * 100)}%
// //                 </Text>
// //                 <View style={styles.progressBarContainer}>
// //                   <View
// //                     style={[
// //                       styles.progressBar,
// //                       { width: `${Math.round(downloadProgress * 100)}%` },
// //                     ]}
// //                   />
// //                 </View>
// //               </View>
// //             )}

// //             {/* Stream Button (only if nothing is loaded yet) */}
// //             {showInitialButton && (
// //               <TouchableOpacity
// //                 style={styles.downloadButton}
// //                 onPress={handleStream}
// //               >
// //                 <LinearGradient
// //                   colors={["#667eea", "#764ba2"]}
// //                   style={styles.downloadButtonGradient}
// //                 >
// //                   <Ionicons name="play" size={24} color="#fff" />
// //                   <Text style={styles.downloadButtonText}>{t("stream")}</Text>
// //                 </LinearGradient>
// //               </TouchableOpacity>
// //             )}

// //             {/* Download Button (always available) */}
// //             <TouchableOpacity
// //               style={styles.downloadButton}
// //               onPress={handleDownload}
// //               disabled={isLoading}
// //             >
// //               <LinearGradient
// //                 colors={["#667eea", "#764ba2"]}
// //                 style={styles.downloadButtonGradient}
// //               >
// //                 <Ionicons name="download" size={24} color="#fff" />
// //                 <Text style={styles.downloadButtonText}>{t("download")}</Text>
// //               </LinearGradient>
// //             </TouchableOpacity>

// //             {/* Loading */}
// //             {isLoading && !playerError && (
// //               <View style={styles.loadingContainer}>
// //                 <ActivityIndicator size="large" color="#667eea" />
// //                 <Text style={styles.loadingText}>
// //                   {isPreparing ? t("preparing") : t("loading")}
// //                 </Text>
// //               </View>
// //             )}

// //             {/* Player Controls */}
// //             {showPlaybackControls && !playerError && (
// //               <View
// //                 style={[
// //                   styles.playerContainer,
// //                   {
// //                     backgroundColor: Colors[scheme].contrast,
// //                     shadowColor: Colors[scheme].border,
// //                   },
// //                 ]}
// //               >
// //                 {/* Progress */}
// //                 <View style={styles.progressSection}>
// //                   <View style={styles.timeLabels}>
// //                     <Text style={styles.timeText}>
// //                       {formatTime(positionSec)}
// //                     </Text>
// //                     <Text style={styles.timeText}>
// //                       {formatTime(durationSec)}
// //                     </Text>
// //                   </View>

// //                   <Slider
// //                     style={styles.progressSlider}
// //                     value={Math.min(positionSec || 0, durationSec || 0)}
// //                     minimumValue={0}
// //                     maximumValue={durationSec || 0}
// //                     onSlidingStart={() => setIsSeeking(true)}
// //                     onSlidingComplete={handleSeek}
// //                     minimumTrackTintColor="#667eea"
// //                     maximumTrackTintColor={isDark ? "#333" : "#ddd"}
// //                     thumbTintColor="#667eea"
// //                     disabled={controlsDisabled}
// //                   />
// //                 </View>

// //                 {/* Main Controls */}
// //                 <View style={styles.mainControls}>
// //                   <TouchableOpacity
// //                     style={styles.skipButton}
// //                     onPress={goBack}
// //                     disabled={controlsDisabled}
// //                   >
// //                     <Ionicons
// //                       name="play-skip-back"
// //                       size={32}
// //                       color={
// //                         controlsDisabled ? "#999" : isDark ? "#fff" : "#333"
// //                       }
// //                     />
// //                     <Text style={styles.skipText}>15s</Text>
// //                   </TouchableOpacity>

// //                   <View>
// //                     <TouchableOpacity
// //                       style={[
// //                         styles.playButton,
// //                         { opacity: controlsDisabled ? 0.5 : 1 },
// //                       ]}
// //                       onPress={togglePlayPause}
// //                       disabled={controlsDisabled}
// //                     >
// //                       <LinearGradient
// //                         colors={["#667eea", "#764ba2"]}
// //                         style={styles.playButtonGradient}
// //                       >
// //                         <Ionicons
// //                           name={isPlaying ? "pause" : "play"}
// //                           size={36}
// //                           color="#fff"
// //                         />
// //                       </LinearGradient>
// //                     </TouchableOpacity>
// //                   </View>

// //                   <TouchableOpacity
// //                     style={styles.skipButton}
// //                     onPress={goForward}
// //                     disabled={controlsDisabled}
// //                   >
// //                     <Ionicons
// //                       name="play-skip-forward"
// //                       size={32}
// //                       color={
// //                         controlsDisabled ? "#999" : isDark ? "#fff" : "#333"
// //                       }
// //                     />
// //                     <Text style={styles.skipText}>15s</Text>
// //                   </TouchableOpacity>
// //                 </View>

// //                 {/* Secondary Controls */}
// //                 <View style={styles.secondaryControls}>
// //                   <TouchableOpacity
// //                     style={styles.speedButton}
// //                     onPress={() => setShowSpeedMenu(!showSpeedMenu)}
// //                   >
// //                     <Text style={styles.speedText}>{playbackSpeed}x</Text>
// //                   </TouchableOpacity>

// //                   <TouchableOpacity
// //                     style={styles.stopButton}
// //                     onPress={stopPlayback}
// //                     disabled={controlsDisabled}
// //                   >
// //                     <Ionicons
// //                       name="stop"
// //                       size={24}
// //                       color={controlsDisabled ? "#999" : "#ff6b6b"}
// //                     />
// //                   </TouchableOpacity>
// //                 </View>

// //                 {/* Speed Menu */}
// //                 {showSpeedMenu && (
// //                   <View
// //                     style={[
// //                       styles.speedMenu,
// //                       { backgroundColor: Colors[scheme].contrast },
// //                     ]}
// //                   >
// //                     {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map((speed) => (
// //                       <TouchableOpacity
// //                         key={speed}
// //                         style={[
// //                           styles.speedOption,
// //                           playbackSpeed === speed && styles.speedOptionActive,
// //                         ]}
// //                         onPress={() => {
// //                           try {
// //                             player.playbackRate = speed;
// //                             setPlaybackSpeed(speed);
// //                             setShowSpeedMenu(false);
// //                           } catch {
// //                             setPlayerError(
// //                               "Unable to change speed on this device."
// //                             );
// //                           }
// //                         }}
// //                       >
// //                         <Text
// //                           style={[
// //                             styles.speedOptionText,
// //                             playbackSpeed === speed &&
// //                               styles.speedOptionTextActive,
// //                           ]}
// //                         >
// //                           {speed}x
// //                         </Text>
// //                       </TouchableOpacity>
// //                     ))}
// //                   </View>
// //                 )}
// //               </View>
// //             )}
// //           </Animated.View>
// //         </ScrollView>
// //       </SafeAreaView>
// //     </LinearGradient>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: { flex: 1 },
// //   content: { flex: 1, justifyContent: "flex-start" },
// //   heroSection: { flex: 1 },
// //   headerContainer: {
// //     flex: 1,
// //     paddingHorizontal: 20,
// //     paddingTop: 20,
// //     paddingBottom: 30,
// //     alignItems: "center",
// //   },
// //   coverArtContainer: { position: "relative", marginBottom: 20 },
// //   coverArt: { width: 200, height: 200, borderRadius: 20 },
// //   coverArtShadow: {
// //     position: "absolute",
// //     top: 10,
// //     left: 10,
// //     right: 10,
// //     bottom: 10,
// //     backgroundColor: "rgba(0,0,0,0.2)",
// //     borderRadius: 20,
// //     zIndex: -1,
// //   },
// //   podcastInfo: {
// //     flexDirection: "column",
// //     alignItems: "center",
// //     paddingHorizontal: 20,
// //   },
// //   podcastTitle: {
// //     fontSize: 24,
// //     fontWeight: "bold",
// //     color: "#fff",
// //     textAlign: "center",
// //     textShadowColor: "rgba(0,0,0,0.3)",
// //     textShadowOffset: { width: 0, height: 1 },
// //     textShadowRadius: 3,
// //   },
// //   podcastDescription: {
// //     fontSize: 16,
// //     color: "rgba(255,255,255,0.9)",
// //     textAlign: "center",
// //     lineHeight: 22,
// //     marginBottom: 12,
// //   },
// //   durationContainer: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     backgroundColor: "rgba(255,255,255,0.2)",
// //     paddingHorizontal: 12,
// //     paddingVertical: 6,
// //     borderRadius: 20,
// //   },
// //   durationText: {
// //     color: "#fff",
// //     fontSize: 14,
// //     fontWeight: "600",
// //     marginLeft: 4,
// //   },
// //   favoriteButton: {
// //     backgroundColor: "rgba(255,255,255,0.2)",
// //     padding: 12,
// //     borderRadius: 25,
// //   },
// //   errorContainer: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     backgroundColor: "#ffe6e6",
// //     margin: 20,
// //     padding: 16,
// //     borderRadius: 12,
// //     borderLeftWidth: 4,
// //     borderLeftColor: "#ff6b6b",
// //   },
// //   errorText: { color: "#d63031", fontSize: 16, marginLeft: 12, flex: 1 },
// //   downloadContainer: {
// //     margin: 20,
// //     padding: 20,
// //     backgroundColor: "#fff",
// //     borderRadius: 16,
// //   },
// //   downloadText: {
// //     fontSize: 16,
// //     fontWeight: "600",
// //     color: "#333",
// //     textAlign: "center",
// //     marginBottom: 12,
// //   },
// //   progressBarContainer: {
// //     height: 8,
// //     backgroundColor: "#e9ecef",
// //     borderRadius: 4,
// //     overflow: "hidden",
// //   },
// //   progressBar: { height: "100%", backgroundColor: "#667eea", borderRadius: 4 },
// //   downloadButton: { margin: 20, borderRadius: 16, overflow: "hidden" },
// //   downloadButtonGradient: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     justifyContent: "center",
// //     padding: 18,
// //   },
// //   downloadButtonText: {
// //     color: "#fff",
// //     fontSize: 18,
// //     fontWeight: "600",
// //     marginLeft: 12,
// //   },
// //   loadingContainer: { alignItems: "center", padding: 40 },
// //   loadingText: { fontSize: 16, color: "#666", marginTop: 12 },
// //   playerContainer: { margin: 20, borderRadius: 20, padding: 24 },
// //   progressSection: { marginBottom: 24 },
// //   timeLabels: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     marginBottom: 8,
// //   },
// //   timeText: { fontSize: 14, color: "#666", fontWeight: "500" },
// //   progressSlider: { width: "100%", height: 40 },
// //   mainControls: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     justifyContent: "space-around",
// //     marginBottom: 20,
// //   },
// //   skipButton: { alignItems: "center", padding: 12 },
// //   skipText: { fontSize: 12, color: "#666", marginTop: 4, fontWeight: "500" },
// //   playButton: {},
// //   playButtonGradient: {
// //     width: 80,
// //     height: 80,
// //     borderRadius: 40,
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },
// //   secondaryControls: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //   },
// //   speedButton: {
// //     backgroundColor: "#ccc",
// //     paddingHorizontal: 16,
// //     paddingVertical: 8,
// //     borderRadius: 20,
// //     borderWidth: 1,
// //     borderColor: "#e9ecef",
// //   },
// //   speedText: { fontSize: 14, fontWeight: "600", color: "#495057" },
// //   stopButton: {
// //     backgroundColor: "#fecaca",
// //     padding: 12,
// //     borderRadius: 25,
// //     borderWidth: 1,
// //   },
// //   speedMenu: {
// //     position: "absolute",
// //     bottom: 80,
// //     left: 24,
// //     borderRadius: 12,
// //     padding: 8,
// //   },
// //   speedOption: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
// //   speedOptionActive: { backgroundColor: "#667eea" },
// //   speedOptionText: { fontSize: 14, fontWeight: "500", color: "#495057" },
// //   speedOptionTextActive: { color: "#fff" },
// // });

// import React, { useCallback, useEffect, useMemo, useState } from "react";
// import {
//   ActivityIndicator,
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
// import { useTranslation } from "react-i18next";
// import Slider from "@react-native-community/slider";
// import { AntDesign, Ionicons } from "@expo/vector-icons";
// import { LinearGradient } from "expo-linear-gradient";
// import { Image } from "expo-image";
// import { Asset } from "expo-asset";
// import { useEvent } from "expo";
// import type { VideoSource } from "expo-video";
// import { setAudioModeAsync } from "expo-audio";

// import { Colors } from "@/constants/Colors";
// import type { PodcastPlayerPropsType } from "@/constants/Types";
// import { useLanguage } from "@/contexts/LanguageContext";
// import { remoteUrlFor, usePodcasts } from "@/hooks/usePodcasts";
// import { useRefreshFavorites } from "@/stores/refreshFavoriteStore";
// import { isPodcastFavorited, togglePodcastFavorite } from "@/utils/favorites";
// import HeaderLeftBackButton from "./HeaderLeftBackButton";

// // ✅ singleton player that persists (mounted by GlobalVideoHost at app root)
// import { globalPlayer as basePlayer } from "@/components/GlobalVideoHost";

// /** App-private fields tagged onto the player */
// type TaggedPlayer = typeof basePlayer & {
//   __currentKey?: string;
//   __currentUri?: string;
//   __title?: string;
//   __artwork?: string;
//   __podcastId?: string | number;
// };
// const player = basePlayer as TaggedPlayer;

// /** Returns a stable string key for any source */
// function getSourceKey(src: VideoSource | null | undefined): string {
//   if (src == null) return "unknown";
//   if (typeof src === "string") return src;
//   if (typeof src === "number") return `asset:${src}`;
//   if ("uri" in src && typeof src.uri === "string") return src.uri;
//   if ("assetId" in src && typeof src.assetId === "number")
//     return `asset:${src.assetId}`;
//   return "unknown";
// }

// export const PodcastPlayer: React.FC<PodcastPlayerPropsType> = ({
//   podcast,
// }) => {
//   const { language } = useLanguage();
//   const { download, getCachedUri } = usePodcasts(language || "de");
//   const { triggerRefreshFavorites } = useRefreshFavorites();
//   const { t } = useTranslation();
//   const scheme = useColorScheme() || "light";
//   const isDark = scheme === "dark";

//   // UI state
//   const [isFavorite, setIsFavorite] = useState(false);
//   const [sourceUri, setSourceUri] = useState<string | null>(null);
//   const [cachedUri, setCachedUri] = useState<string | null>(null);
//   const [downloadProgress, setDownloadProgress] = useState(0);
//   const [playerError, setPlayerError] = useState<string | null>(null);
//   const [didInitiatePlayback, setDidInitiatePlayback] = useState(false);
//   const [isSeeking, setIsSeeking] = useState(false);
//   const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
//   const [showSpeedMenu, setShowSpeedMenu] = useState(false);
//   const [isStreamLoading, setIsStreamLoading] = useState(false);

//   // progress state
//   const [positionSec, setPositionSec] = useState(0);
//   const [durationSec, setDurationSec] = useState(0);

//   // animations
//   const [fadeAnim] = useState(new Animated.Value(0));
//   const [slideAnim] = useState(new Animated.Value(50));

//   // artwork for lock screen / notification
//   const logoAsset = Asset.fromModule(require("@/assets/images/logo.png"));
//   const artworkUri: string | undefined = logoAsset?.uri || undefined;

//   // Precompute possible URIs for this episode
//   const remoteUri = podcast.filename ? remoteUrlFor(podcast.filename) : null;

//   // Load cached file URI (if previously downloaded)
//   useEffect(() => {
//     let alive = true;
//     (async () => {
//       if (!podcast.filename) {
//         if (alive) setCachedUri(null);
//         return;
//       }
//       try {
//         const uri = await getCachedUri(podcast.filename);
//         if (alive) setCachedUri(uri ?? null);
//       } catch (err) {
//         console.error("Error getting cached URI:", err);
//         if (alive) setCachedUri(null);
//       }
//     })();
//     return () => {
//       alive = false;
//     };
//   }, [podcast.id, podcast.filename, getCachedUri]);

//   // near other effects
//   useEffect(() => {
//     // A) If the global player is already on THIS podcast, adopt it
//     if (player.__podcastId === podcast.id) {
//       if (player.__currentUri) {
//         setSourceUri(player.__currentUri);
//         setIsStreamLoading(false);
//         return;
//       }
//       if (player.__currentKey) {
//         setSourceUri(player.__currentKey);
//         setIsStreamLoading(false);
//         return;
//       }
//     }

//     // B) If we have it cached, preload from cache (no autoplay)
//     if (!sourceUri && cachedUri) {
//       setSourceUri(cachedUri);
//       setIsStreamLoading(false);
//     }
//   }, [podcast.id, cachedUri, sourceUri]);

//   // If the global player is already loaded with THIS episode, bind UI to it
//   useEffect(() => {
//     const currentKey = player.__currentKey;
//     if (!currentKey) return;
//     // If the global player says it's the same podcast, bind to it directly
//     if (player.__podcastId === podcast.id) {
//       setSourceUri(player.__currentUri ?? currentKey);
//       setIsStreamLoading(false);
//       return;
//     }
//     // Fallback: match by URIs if available
//     if (
//       (cachedUri && currentKey === cachedUri) ||
//       (remoteUri && currentKey === remoteUri)
//     ) {
//       setSourceUri(currentKey);
//       setIsStreamLoading(false);
//     }
//   }, [podcast.id, cachedUri, remoteUri]);

//   // Build VideoSource with metadata
//   const sourceWithMetadata = useMemo<VideoSource | null>(() => {
//     if (!sourceUri) return null;
//     return {
//       uri: sourceUri,
//       metadata: {
//         title: podcast.title ?? "Podcast",
//         artist: "Podcast",
//         ...(artworkUri ? { artwork: artworkUri } : {}),
//       },
//     };
//   }, [sourceUri, podcast.title, artworkUri]);

//   // Only replace when the key actually changes
//   useEffect(() => {
//     if (!sourceWithMetadata) return;
//     const src = sourceWithMetadata;

//     (async () => {
//       const nextKey = getSourceKey(src);

//       // Don't reload if already playing this source
//       if (player.__currentKey === nextKey) {
//         try {
//           player.playbackRate = playbackSpeed;
//           setIsStreamLoading(false);
//         } catch (err) {
//           console.error("Error setting playback rate:", err);
//         }
//         return;
//       }

//       const wasPlaying = player.playing;
//       try {
//         console.log("Replacing player source with:", nextKey);
//         await player.replaceAsync(src);

//         // Tag the global player for other UI
//         player.__currentKey = nextKey;
//         if ("uri" in src && typeof src.uri === "string") {
//           player.__currentUri = src.uri;
//         } else {
//           player.__currentUri = undefined;
//         }
//         player.__title = podcast.title ?? "Podcast";
//         player.__artwork = artworkUri;
//         player.__podcastId = podcast.id;

//         // Playback settings
//         player.playbackRate = playbackSpeed;

//         // Auto-play if user initiated
//         if (wasPlaying || didInitiatePlayback) {
//           console.log("Starting playback...");
//           player.play();
//         }

//         setIsStreamLoading(false);
//       } catch (e: any) {
//         console.error("Player error:", e);
//         setPlayerError(e?.message ?? "Player error");
//         setIsStreamLoading(false);
//       }
//     })();
//   }, [
//     sourceWithMetadata,
//     playbackSpeed,
//     didInitiatePlayback,
//     podcast.title,
//     podcast.id,
//     artworkUri,
//   ]);

//   // Player events
//   const playingEvt = useEvent(player, "playingChange");
//   const sourceLoadEvt = useEvent(player, "sourceLoad");
//   const timeEvt = useEvent(player, "timeUpdate");

//   // Use direct player state for more accurate play state
//   const isPlaying = player.playing || !!playingEvt?.isPlaying;

//   // Duration when source loads
//   useEffect(() => {
//     const d = player.duration;
//     if (typeof d === "number" && d > 0) {
//       console.log("Duration loaded:", d);
//       setDurationSec(d);
//     }
//   }, [sourceLoadEvt]);

//   // Position updates
//   useEffect(() => {
//     const cur =
//       typeof timeEvt?.currentTime === "number"
//         ? timeEvt.currentTime
//         : player.currentTime;
//     setPositionSec(typeof cur === "number" ? cur : 0);

//     const d = player.duration;
//     if (typeof d === "number" && d > 0 && d !== durationSec) {
//       setDurationSec(d);
//     }
//   }, [timeEvt, durationSec]);

//   // Background audio session
//   useEffect(() => {
//     console.log("Setting audio mode for background playback...");
//     setAudioModeAsync({
//       shouldPlayInBackground: true,
//       playsInSilentMode: true,
//       allowsRecording: false,
//       shouldRouteThroughEarpiece: false,
//       interruptionMode: "doNotMix",
//       interruptionModeAndroid: "doNotMix",
//     } as any).catch((err) => {
//       console.error("Error setting audio mode:", err);
//     });
//   }, []);

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

//   // Playback rate
//   useEffect(() => {
//     try {
//       player.playbackRate = playbackSpeed;
//     } catch (err) {
//       console.error("Error setting playback rate:", err);
//     }
//   }, [playbackSpeed]);

//   // Reset intent when finished
//   useEffect(() => {
//     if (durationSec > 0 && positionSec >= durationSec - 0.25) {
//       setDidInitiatePlayback(false);
//     }
//   }, [positionSec, durationSec]);

//   // Favorites
//   useEffect(() => {
//     (async () => {
//       if (!podcast.id) return;
//       try {
//         setIsFavorite(await isPodcastFavorited(podcast.id));
//       } catch (err) {
//         console.error("Error checking favorite status:", err);
//       }
//     })();
//   }, [podcast.id]);

//   const onPressToggleFavorite = useCallback(async () => {
//     if (!podcast.id) return;
//     try {
//       const newStatus = await togglePodcastFavorite(podcast.id);
//       setIsFavorite(newStatus);
//       triggerRefreshFavorites();
//     } catch (err) {
//       console.error("Error toggling favorite:", err);
//     }
//   }, [podcast.id, triggerRefreshFavorites]);

//   // Download handler
//   const handleDownload = useCallback(async () => {
//     if (!podcast.filename) {
//       setPlayerError("Audio path missing.");
//       return;
//     }
//     setPlayerError(null);
//     setDownloadProgress(0);
//     setDidInitiatePlayback(true);

//     try {
//       console.log("Starting download for:", podcast.filename);
//       const localUri = await download.mutateAsync({
//         filename: podcast.filename,
//         onProgress: setDownloadProgress,
//       });
//       console.log("Download complete, local URI:", localUri);
//       setSourceUri(localUri);
//     } catch (err: any) {
//       const msg = err instanceof Error ? err.message : "Unknown download error";
//       console.error("Download error:", err);
//       setPlayerError(`Download failed: ${msg}`);
//       setDownloadProgress(0);
//     }
//   }, [podcast.filename, download]);

//   // Stream handler
//   const handleStream = useCallback(() => {
//     if (!podcast.filename) {
//       setPlayerError("Audio path missing.");
//       return;
//     }
//     if (!remoteUri) {
//       setPlayerError("Cannot create stream URL.");
//       return;
//     }

//     console.log("Starting stream for:", remoteUri);
//     setPlayerError(null);
//     setDownloadProgress(0);
//     setDidInitiatePlayback(true);
//     setIsStreamLoading(true);
//     setSourceUri(remoteUri);
//   }, [podcast.filename, remoteUri]);

//   // Controls
//   const hasSomethingLoaded = !!player.__currentKey && !isStreamLoading;
//   const isThisEpisodeLoaded =
//   hasSomethingLoaded &&
//   (
//     player.__podcastId === podcast.id ||           // <-- accept id match
//     player.__currentKey === sourceUri ||
//     player.__currentKey === cachedUri ||
//     player.__currentKey === remoteUri
//   );

//   const togglePlayPause = useCallback(() => {
//     if (playerError) return;
//     if (!isThisEpisodeLoaded) return;

//     if (player.playing) {
//       console.log("Pausing playback");
//       player.pause();
//     } else {
//       console.log("Starting playback");
//       player.play();
//       setDidInitiatePlayback(true);
//     }
//   }, [playerError, isThisEpisodeLoaded]);

//   const goBack = () => {
//     if (isThisEpisodeLoaded) player.seekBy(-15);
//   };

//   const goForward = () => {
//     if (isThisEpisodeLoaded) player.seekBy(15);
//   };

//   const handleSeek = useCallback(
//     (value: number) => {
//       setIsSeeking(false);
//       if (isThisEpisodeLoaded) {
//         player.currentTime = value;
//       }
//     },
//     [isThisEpisodeLoaded]
//   );

//   const stopPlayback = useCallback(() => {
//     if (!isThisEpisodeLoaded) return;
//     try {
//       console.log("Stopping playback");
//       player.pause();
//       player.currentTime = 0;
//     } catch (err) {
//       console.error("Error stopping playback:", err);
//     }
//   }, [isThisEpisodeLoaded]);

//   // Derived UI flags
//   const isPreparing = download.isPending;
//   const isLoading = isPreparing || isStreamLoading;
//   const canPlay = isThisEpisodeLoaded && durationSec > 0;

//   // Show initial buttons only if nothing is loaded for this episode
//   const showInitialButtons =
//     !sourceUri && !isLoading && !playerError && !isThisEpisodeLoaded;
//   const showPlaybackControls = canPlay && !playerError;
//   const showDownloadProgress = download.isPending;
//   const controlsDisabled = isLoading || !!playerError || isSeeking;

//   const formatTime = (secs?: number | null): string => {
//     if (!secs || secs < 0 || isNaN(secs)) return "0:00";
//     const total = Math.floor(secs);
//     const hours = Math.floor(total / 3600);
//     const minutes = Math.floor((total % 3600) / 60);
//     const seconds = total % 60;
//     if (hours > 0) {
//       return `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${
//         seconds < 10 ? "0" : ""
//       }${seconds}`;
//     }
//     return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
//   };

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
//             <View style={styles.headerContainer}>
//               {/* Cover Art */}
//               <View style={styles.coverArtContainer}>
//                 <Image
//                   source={require("@/assets/images/logo.png")}
//                   style={styles.coverArt}
//                   contentFit="cover"
//                 />
//                 <View style={styles.coverArtShadow} />
//               </View>

//               {/* Podcast Info */}
//               <View style={styles.podcastInfo}>
//                 <View
//                   style={{
//                     flexDirection: "row",
//                     alignItems: "center",
//                     gap: 10,
//                     marginBottom: 20,
//                   }}
//                 >
//                   <Text style={styles.podcastTitle} numberOfLines={2}>
//                     {podcast.title}
//                   </Text>
//                   <TouchableOpacity
//                     onPress={onPressToggleFavorite}
//                     style={styles.favoriteButton}
//                   >
//                     <AntDesign
//                       name={isFavorite ? "star" : "staro"}
//                       size={25}
//                       color={isFavorite ? Colors.universal.favorite : "#fff"}
//                     />
//                   </TouchableOpacity>
//                 </View>

//                 <Text style={styles.podcastDescription} numberOfLines={3}>
//                   {podcast.description}
//                 </Text>

//                 {canPlay && (
//                   <View style={styles.durationContainer}>
//                     <Ionicons name="time-outline" size={16} color="#fff" />
//                     <Text style={styles.durationText}>
//                       {formatTime(durationSec)}
//                     </Text>
//                   </View>
//                 )}
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

//             {/* Initial Action Buttons - Only show when nothing is loaded */}
//             {showInitialButtons && (
//               <>
//                 {/* Stream Button */}
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

//                 {/* Download Button */}
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
//               </>
//             )}

//             {/* Loading */}
//             {isLoading && !playerError && (
//               <View style={styles.loadingContainer}>
//                 <ActivityIndicator size="large" color="#667eea" />
//                 <Text style={styles.loadingText}>
//                   {isPreparing
//                     ? t("preparing")
//                     : isStreamLoading
//                     ? t("loading_stream")
//                     : t("loading")}
//                 </Text>
//               </View>
//             )}

//             {/* Player Controls */}
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
//                     <Text style={styles.timeText}>
//                       {formatTime(positionSec)}
//                     </Text>
//                     <Text style={styles.timeText}>
//                       {formatTime(durationSec)}
//                     </Text>
//                   </View>

//                   <Slider
//                     style={styles.progressSlider}
//                     value={Math.min(positionSec || 0, durationSec || 0)}
//                     minimumValue={0}
//                     maximumValue={durationSec || 0}
//                     onSlidingStart={() => setIsSeeking(true)}
//                     onSlidingComplete={handleSeek}
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
//                     onPress={() => setShowSpeedMenu(!showSpeedMenu)}
//                   >
//                     <Text style={styles.speedText}>{playbackSpeed}x</Text>
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
//                           playbackSpeed === speed && styles.speedOptionActive,
//                         ]}
//                         onPress={() => {
//                           try {
//                             player.playbackRate = speed;
//                             setPlaybackSpeed(speed);
//                             setShowSpeedMenu(false);
//                           } catch {
//                             setPlayerError(
//                               "Unable to change speed on this device."
//                             );
//                           }
//                         }}
//                       >
//                         <Text
//                           style={[
//                             styles.speedOptionText,
//                             playbackSpeed === speed &&
//                               styles.speedOptionTextActive,
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
// };

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
//     fontSize: 24,
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
//   downloadButton: { margin: 20, borderRadius: 16, overflow: "hidden" },
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
//   loadingContainer: { alignItems: "center", padding: 40 },
//   loadingText: { fontSize: 16, color: "#666", marginTop: 12 },
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

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
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
import { useTranslation } from "react-i18next";
import Slider from "@react-native-community/slider";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { Asset } from "expo-asset";
import { useEvent } from "expo";
import type { VideoSource } from "expo-video";
import { setAudioModeAsync } from "expo-audio";

import { Colors } from "@/constants/Colors";
import type { PodcastPlayerPropsType } from "@/constants/Types";
import { useLanguage } from "@/contexts/LanguageContext";
import { remoteUrlFor, usePodcasts } from "@/hooks/usePodcasts";
import { useRefreshFavorites } from "@/stores/refreshFavoriteStore";
import { isPodcastFavorited, togglePodcastFavorite } from "@/utils/favorites";
import HeaderLeftBackButton from "./HeaderLeftBackButton";

// ✅ singleton player (mounted by GlobalVideoHost at app root)
import { globalPlayer as basePlayer } from "@/components/GlobalVideoHost";

/** Runtime methods we actually use */
type CorePlayer = typeof basePlayer & {
  replaceAsync: (src: VideoSource | null) => Promise<void>;
  play: () => void;
  pause: () => void;
  seekBy: (deltaSeconds: number) => void;
  currentTime: number;
  duration: number;
  playbackRate: number;
  playing: boolean;
};

/** App-private tags */
type TaggedPlayer = CorePlayer & {
  __currentKey?: string;
  __currentUri?: string;
  __title?: string;
  __artwork?: string;
  __podcastId?: string | number;
};

const player = basePlayer as TaggedPlayer;

/** Stable key for any source */
function getSourceKey(src: VideoSource | null | undefined): string {
  if (src == null) return "unknown";
  if (typeof src === "string") return src;
  if (typeof src === "number") return `asset:${src}`;
  if (
    typeof src === "object" &&
    src &&
    "uri" in src &&
    typeof (src as any).uri === "string"
  ) {
    return (src as any).uri as string;
  }
  if (
    typeof src === "object" &&
    src &&
    "assetId" in src &&
    typeof (src as any).assetId === "number"
  ) {
    return `asset:${(src as any).assetId}`;
  }
  return "unknown";
}

export const PodcastPlayer: React.FC<PodcastPlayerPropsType> = ({
  podcast,
}) => {
  const { language } = useLanguage();
  const { download, getCachedUri } = usePodcasts(language || "de");
  const { triggerRefreshFavorites } = useRefreshFavorites();
  const { t } = useTranslation();
  const scheme = useColorScheme() || "light";
  const isDark = scheme === "dark";

  // UI state
  const [isFavorite, setIsFavorite] = useState(false);
  const [sourceUri, setSourceUri] = useState<string | null>(null);
  const [cachedUri, setCachedUri] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [playerError, setPlayerError] = useState<string | null>(null);
  const [didInitiatePlayback, setDidInitiatePlayback] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [isStreamLoading, setIsStreamLoading] = useState(false);

  // progress state
  const [positionSec, setPositionSec] = useState(0);
  const [durationSec, setDurationSec] = useState(0);

  // animations
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  // lock-screen/notification artwork – your local logo (no external artwork)
  const logoAsset = Asset.fromModule(require("@/assets/images/logo.png"));
  const artworkUri: string | undefined = logoAsset?.uri || undefined;

  // Precompute possible URIs for this episode
  const remoteUri = podcast.filename ? remoteUrlFor(podcast.filename) : null;

  // Load cached file URI (if previously downloaded)
  useEffect(() => {
    let alive = true;
    (async () => {
      if (!podcast.filename) {
        if (alive) setCachedUri(null);
        return;
      }
      try {
        const uri = await getCachedUri(podcast.filename);
        if (alive) setCachedUri(uri ?? null);
      } catch (err) {
        console.error("Error getting cached URI:", err);
        if (alive) setCachedUri(null);
      }
    })();
    return () => {
      alive = false;
    };
  }, [podcast.id, podcast.filename, getCachedUri]);

  // Adopt already-playing episode by id (prevents “ask again” from Mini and after reload)
  useEffect(() => {
    if (player.__podcastId === podcast.id) {
      if (player.__currentUri) {
        setSourceUri(player.__currentUri);
        setIsStreamLoading(false);
        return;
      }
      if (player.__currentKey) {
        setSourceUri(player.__currentKey);
        setIsStreamLoading(false);
        return;
      }
    }
    // If nothing adopted and we have a cached file, prefill the source
    if (!sourceUri && cachedUri) {
      setSourceUri(cachedUri);
      setIsStreamLoading(false);
    }
  }, [podcast.id, cachedUri, sourceUri]);

  // Also bind if the global player's current key matches our URIs
  useEffect(() => {
    const currentKey = player.__currentKey;
    if (!currentKey) return;
    if (player.__podcastId === podcast.id) {
      setSourceUri(player.__currentUri ?? currentKey);
      setIsStreamLoading(false);
      return;
    }
    if (
      (cachedUri && currentKey === cachedUri) ||
      (remoteUri && currentKey === remoteUri)
    ) {
      setSourceUri(currentKey);
      setIsStreamLoading(false);
    }
  }, [podcast.id, cachedUri, remoteUri]);

  // Build VideoSource with metadata
  const sourceWithMetadata = useMemo<VideoSource | null>(() => {
    if (!sourceUri) return null;
    return {
      uri: sourceUri,
      metadata: {
        title: podcast.title ?? "Podcast",
        artist: "Podcast",
        ...(artworkUri ? { artwork: artworkUri } : {}),
      },
    };
  }, [sourceUri, podcast.title, artworkUri]);

  // Replace source in global player
  useEffect(() => {
    if (!sourceWithMetadata) return;
    const src = sourceWithMetadata;

    (async () => {
      const nextKey = getSourceKey(src);

      // Skip if already set
      if (player.__currentKey === nextKey) {
        try {
          player.playbackRate = playbackSpeed;
          setIsStreamLoading(false);
        } catch (err) {
          console.error("Error setting playback rate:", err);
        }
        return;
      }

      const wasPlaying = player.playing;
      try {
        console.log("Replacing player source with:", nextKey);
        await player.replaceAsync(src);

        // Tag global player
        player.__currentKey = nextKey;
        if (
          typeof src === "object" &&
          src &&
          "uri" in src &&
          typeof (src as any).uri === "string"
        ) {
          player.__currentUri = (src as any).uri;
        } else {
          player.__currentUri = undefined;
        }
        player.__title = podcast.title ?? "Podcast";
        player.__artwork = artworkUri;
        player.__podcastId = podcast.id;

        // Playback settings
        player.playbackRate = playbackSpeed;

        if (wasPlaying || didInitiatePlayback) {
          console.log("Starting playback...");
          player.play();
        }

        setIsStreamLoading(false);
      } catch (e: any) {
        console.error("Player error:", e);
        setPlayerError(e?.message ?? "Player error");
        setIsStreamLoading(false);
      }
    })();
  }, [
    sourceWithMetadata,
    playbackSpeed,
    didInitiatePlayback,
    podcast.title,
    podcast.id,
    artworkUri,
  ]);

  // Player events
  const playingEvt = useEvent(player, "playingChange");
  const sourceLoadEvt = useEvent(player, "sourceLoad");
  const timeEvt = useEvent(player, "timeUpdate");

  // Playing state
  const isPlaying = player.playing || !!playingEvt?.isPlaying;

  // Duration when source loads
  useEffect(() => {
    const d = player.duration;
    if (typeof d === "number" && d > 0) {
      console.log("Duration loaded:", d);
      setDurationSec(d);
    }
  }, [sourceLoadEvt]);

  // Position updates
  useEffect(() => {
    const cur =
      typeof timeEvt?.currentTime === "number"
        ? timeEvt.currentTime
        : player.currentTime;
    setPositionSec(typeof cur === "number" ? cur : 0);

    const d = player.duration;
    if (typeof d === "number" && d > 0 && d !== durationSec) {
      setDurationSec(d);
    }
  }, [timeEvt, durationSec]);

  // Background audio session (valid keys for expo-audio)
  useEffect(() => {
    console.log("Setting audio mode for background playback...");
    setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
      interruptionModeAndroid: "duckOthers",
      interruptionMode: "mixWithOthers",
    }).catch((err) => {
      console.error("Error setting audio mode:", err);
    });
  }, []);

  // Entrance animation
  useEffect(() => {
    Animated.parallel([
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
    ]).start();
  }, [fadeAnim, slideAnim]);

  // Playback rate
  useEffect(() => {
    try {
      player.playbackRate = playbackSpeed;
    } catch (err) {
      console.error("Error setting playback rate:", err);
    }
  }, [playbackSpeed]);

  // Reset intent when finished
  useEffect(() => {
    if (durationSec > 0 && positionSec >= durationSec - 0.25) {
      setDidInitiatePlayback(false);
    }
  }, [positionSec, durationSec]);

  // Favorites
  useEffect(() => {
    (async () => {
      if (!podcast.id) return;
      try {
        setIsFavorite(await isPodcastFavorited(podcast.id));
      } catch (err) {
        console.error("Error checking favorite status:", err);
      }
    })();
  }, [podcast.id]);

  const onPressToggleFavorite = useCallback(async () => {
    if (!podcast.id) return;
    try {
      const newStatus = await togglePodcastFavorite(podcast.id);
      setIsFavorite(newStatus);
      triggerRefreshFavorites();
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  }, [podcast.id, triggerRefreshFavorites]);

  // Download
  const handleDownload = useCallback(async () => {
    if (!podcast.filename) {
      setPlayerError("Audio path missing.");
      return;
    }
    setPlayerError(null);
    setDownloadProgress(0);
    setDidInitiatePlayback(true);

    try {
      console.log("Starting download for:", podcast.filename);
      const localUri = await download.mutateAsync({
        filename: podcast.filename,
        onProgress: setDownloadProgress,
      });
      console.log("Download complete, local URI:", localUri);
      setSourceUri(localUri);
    } catch (err: any) {
      const msg = err instanceof Error ? err.message : "Unknown download error";
      console.error("Download error:", err);
      setPlayerError(`Download failed: ${msg}`);
      setDownloadProgress(0);
    }
  }, [podcast.filename, download]);

  // Stream
  const handleStream = useCallback(() => {
    if (!podcast.filename) {
      setPlayerError("Audio path missing.");
      return;
    }
    if (!remoteUri) {
      setPlayerError("Cannot create stream URL.");
      return;
    }

    console.log("Starting stream for:", remoteUri);
    setPlayerError(null);
    setDownloadProgress(0);
    setDidInitiatePlayback(true);
    setIsStreamLoading(true);
    setSourceUri(remoteUri);
  }, [podcast.filename, remoteUri]);

  // Controls
  const hasSomethingLoaded = !!player.__currentKey && !isStreamLoading;
  const isThisEpisodeLoaded =
    hasSomethingLoaded &&
    (player.__podcastId === podcast.id ||
      player.__currentKey === sourceUri ||
      player.__currentKey === cachedUri ||
      player.__currentKey === remoteUri);

  const togglePlayPause = useCallback(() => {
    if (playerError) return;
    if (!isThisEpisodeLoaded) return;

    if (player.playing) {
      console.log("Pausing playback");
      player.pause();
    } else {
      console.log("Starting playback");
      player.play();
      setDidInitiatePlayback(true);
    }
  }, [playerError, isThisEpisodeLoaded]);

  const goBack = () => {
    if (!isThisEpisodeLoaded) return;
    player.seekBy(-15);
  };

  const goForward = () => {
    if (!isThisEpisodeLoaded) return;
    player.seekBy(15);
  };

  const handleSeek = useCallback(
    (value: number) => {
      setIsSeeking(false);
      if (isThisEpisodeLoaded) {
        player.currentTime = value; // precise seek
      }
    },
    [isThisEpisodeLoaded]
  );

  const stopPlayback = useCallback(() => {
    if (!isThisEpisodeLoaded) return;
    try {
      console.log("Stopping playback");
      player.pause();
      player.currentTime = 0;
    } catch (err) {
      console.error("Error stopping playback:", err);
    }
  }, [isThisEpisodeLoaded]);

  // Derived UI flags
  const isPreparing = download.isPending;
  const isLoading = isPreparing || isStreamLoading;
  const canPlay = isThisEpisodeLoaded && durationSec > 0;

  // Initial buttons only if nothing is loaded for this episode
  const showInitialButtons =
    !sourceUri && !isLoading && !playerError && !isThisEpisodeLoaded;
  const showPlaybackControls = canPlay && !playerError;
  const showDownloadProgress = download.isPending;
  const controlsDisabled = isLoading || !!playerError || isSeeking;

  const formatTime = (secs?: number | null): string => {
    if (!secs || secs < 0 || isNaN(secs)) return "0:00";
    const total = Math.floor(secs);
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const seconds = total % 60;
    if (hours > 0) {
      return `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${
        seconds < 10 ? "0" : ""
      }${seconds}`;
    }
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <LinearGradient
      colors={isDark ? ["#242c40", "#27272a"] : ["#6366f1", "#818cf8"]}
      style={styles.heroSection}
    >
      <SafeAreaView style={{ flex: 1 }} edges={["top", "left"]}>
        <View style={{ marginLeft: 20 }}>
          <HeaderLeftBackButton color={isDark ? "#fff" : "#000"} size={35} />
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
            <View style={styles.headerContainer}>
              {/* Cover Art (your local logo only) */}
              <View style={styles.coverArtContainer}>
                <Image
                  source={require("@/assets/images/logo.png")}
                  style={styles.coverArt}
                  contentFit="cover"
                />
                <View style={styles.coverArtShadow} />
              </View>

              {/* Podcast Info */}
              <View style={styles.podcastInfo}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 20,
                  }}
                >
                  <Text style={styles.podcastTitle} numberOfLines={2}>
                    {podcast.title}
                  </Text>
                  <TouchableOpacity
                    onPress={onPressToggleFavorite}
                    style={styles.favoriteButton}
                  >
                    <AntDesign
                      name={isFavorite ? "star" : "staro"}
                      size={25}
                      color={isFavorite ? Colors.universal.favorite : "#fff"}
                    />
                  </TouchableOpacity>
                </View>

                <Text style={styles.podcastDescription} numberOfLines={3}>
                  {podcast.description}
                </Text>

                {canPlay && (
                  <View style={styles.durationContainer}>
                    <Ionicons name="time-outline" size={16} color="#fff" />
                    <Text style={styles.durationText}>
                      {formatTime(durationSec)}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Error */}
            {!!playerError && (
              <View className="error" style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={24} color="#ff6b6b" />
                <Text style={styles.errorText}>{playerError}</Text>
              </View>
            )}

            {/* Download Progress */}
            {showDownloadProgress && (
              <View style={styles.downloadContainer}>
                <Text style={styles.downloadText}>
                  {t("downloading")} {Math.round(downloadProgress * 100)}%
                </Text>
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

            {/* Initial Actions */}
            {showInitialButtons && (
              <>
                <TouchableOpacity
                  style={styles.downloadButton}
                  onPress={handleStream}
                  disabled={isLoading}
                >
                  <LinearGradient
                    colors={["#667eea", "#764ba2"]}
                    style={styles.downloadButtonGradient}
                  >
                    <Ionicons name="play" size={24} color="#fff" />
                    <Text style={styles.downloadButtonText}>{t("stream")}</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.downloadButton}
                  onPress={handleDownload}
                  disabled={isLoading}
                >
                  <LinearGradient
                    colors={["#667eea", "#764ba2"]}
                    style={styles.downloadButtonGradient}
                  >
                    <Ionicons name="download" size={24} color="#fff" />
                    <Text style={styles.downloadButtonText}>
                      {t("download")}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </>
            )}

            {/* Loading */}
            {isLoading && !playerError && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#667eea" />
                <Text style={styles.loadingText}>
                  {download.isPending
                    ? t("preparing")
                    : isStreamLoading
                    ? t("loading_stream")
                    : t("loading")}
                </Text>
              </View>
            )}

            {/* Player Controls */}
            {showPlaybackControls && !playerError && (
              <View
                style={[
                  styles.playerContainer,
                  {
                    backgroundColor: Colors[scheme].contrast,
                    shadowColor: Colors[scheme].border,
                  },
                ]}
              >
                {/* Progress */}
                <View style={styles.progressSection}>
                  <View style={styles.timeLabels}>
                    <Text style={styles.timeText}>
                      {formatTime(positionSec)}
                    </Text>
                    <Text style={styles.timeText}>
                      {formatTime(durationSec)}
                    </Text>
                  </View>

                  <Slider
                    style={styles.progressSlider}
                    value={Math.min(positionSec || 0, durationSec || 0)}
                    minimumValue={0}
                    maximumValue={durationSec || 0}
                    onSlidingStart={() => setIsSeeking(true)}
                    onSlidingComplete={handleSeek}
                    minimumTrackTintColor="#667eea"
                    maximumTrackTintColor={isDark ? "#333" : "#ddd"}
                    thumbTintColor="#667eea"
                    disabled={controlsDisabled}
                  />
                </View>

                {/* Main Controls */}
                <View className="mainControls" style={styles.mainControls}>
                  <TouchableOpacity
                    style={styles.skipButton}
                    onPress={goBack}
                    disabled={controlsDisabled}
                  >
                    <Ionicons
                      name="play-skip-back"
                      size={32}
                      color={
                        controlsDisabled ? "#999" : isDark ? "#fff" : "#333"
                      }
                    />
                    <Text style={styles.skipText}>15s</Text>
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
                      color={
                        controlsDisabled ? "#999" : isDark ? "#fff" : "#333"
                      }
                    />
                    <Text style={styles.skipText}>15s</Text>
                  </TouchableOpacity>
                </View>

                {/* Secondary Controls */}
                <View style={styles.secondaryControls}>
                  <TouchableOpacity
                    style={styles.speedButton}
                    onPress={() => setShowSpeedMenu(!showSpeedMenu)}
                  >
                    <Text style={styles.speedText}>{playbackSpeed}x</Text>
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
                      { backgroundColor: Colors[scheme].contrast },
                    ]}
                  >
                    {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map((speed) => (
                      <TouchableOpacity
                        key={speed}
                        style={[
                          styles.speedOption,
                          playbackSpeed === speed && styles.speedOptionActive,
                        ]}
                        onPress={() => {
                          try {
                            player.playbackRate = speed;
                            setPlaybackSpeed(speed);
                            setShowSpeedMenu(false);
                          } catch {
                            setPlayerError("Unable to change speed.");
                          }
                        }}
                      >
                        <Text
                          style={[
                            styles.speedOptionText,
                            playbackSpeed === speed &&
                              styles.speedOptionTextActive,
                          ]}
                        >
                          {speed}x
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            )}
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: "flex-start" },
  heroSection: { flex: 1 },
  headerContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    alignItems: "center",
  },
  coverArtContainer: { position: "relative", marginBottom: 20 },
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
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  podcastDescription: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 12,
  },
  durationContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  durationText: {
    color: "#fff",
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
  downloadButton: { margin: 20, borderRadius: 16, overflow: "hidden" },
  downloadButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
  },
  downloadButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 12,
  },
  loadingContainer: { alignItems: "center", padding: 40 },
  loadingText: { fontSize: 16, color: "#666", marginTop: 12 },
  playerContainer: { margin: 20, borderRadius: 20, padding: 24 },
  progressSection: { marginBottom: 24 },
  timeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  timeText: { fontSize: 14, color: "#666", fontWeight: "500" },
  progressSlider: { width: "100%", height: 40 },
  mainControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  skipButton: { alignItems: "center", padding: 12 },
  skipText: { fontSize: 12, color: "#666", marginTop: 4, fontWeight: "500" },
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
    backgroundColor: "#ccc",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  speedText: { fontSize: 14, fontWeight: "600", color: "#495057" },
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
  },
  speedOption: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  speedOptionActive: { backgroundColor: "#667eea" },
  speedOptionText: { fontSize: 14, fontWeight: "500", color: "#495057" },
  speedOptionTextActive: { color: "#fff" },
});
