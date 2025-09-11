// // // // import React, { useMemo } from "react";
// // // // import {
// // // //   View,
// // // //   Text,
// // // //   StyleSheet,
// // // //   TouchableOpacity,
// // // //   useColorScheme,
// // // // } from "react-native";
// // // // import { useSafeAreaInsets } from "react-native-safe-area-context";
// // // // import { Image } from "expo-image";
// // // // import { Ionicons } from "@expo/vector-icons";
// // // // import { useEvent } from "expo";
// // // // import { globalPlayer as basePlayer } from "@/components/GlobalVideoHost";
// // // // import { router, usePathname } from "expo-router";

// // // // type TaggedPlayer = typeof basePlayer & {
// // // //   __currentKey?: string;
// // // //   __currentUri?: string;
// // // //   __title?: string;
// // // //   __artwork?: string;
// // // //   __podcastId?: string | number;
// // // // };

// // // // type Props = {
// // // //   /** Optional: open your full podcast screen (e.g. router.push) */
// // // //   onOpenFull?: (podcastId?: string | number) => void;
// // // // };

// // // // export default function MiniPlayerBar({ onOpenFull }: Props) {
// // // //   const player = basePlayer as TaggedPlayer;
// // // //   const insets = useSafeAreaInsets();
// // // //   const scheme = useColorScheme() || "light";
// // // //   const pathname = usePathname();

// // // //   // Listen to player state
// // // //   const playingEvt = useEvent(player, "playingChange");
// // // //   const timeEvt = useEvent(player, "timeUpdate");

// // // //   // Use direct player state for more accurate play state
// // // //   const isPlaying = player.playing || !!playingEvt?.isPlaying;

// // // //   const currentTime = timeEvt?.currentTime ?? player.currentTime ?? 0;
// // // //   const duration = player.duration ?? 0;

// // // //   const progressPct = useMemo(() => {
// // // //     if (!duration || duration <= 0) return 0;
// // // //     return Math.max(0, Math.min(1, currentTime / duration));
// // // //   }, [currentTime, duration]);

// // // //   // Hide inside the podcast stack/group or if nothing is loaded
// // // //   if (
// // // //     pathname?.startsWith("/indexPodcast") ||
// // // //     pathname?.includes("podcast") ||
// // // //     !player.__currentKey ||
// // // //     !player.__currentUri
// // // //   ) {
// // // //     return null;
// // // //   }

// // // //   const onToggle = () => {
// // // //     // Use the actual player state
// // // //     if (player.playing) {
// // // //       player.pause();
// // // //     } else {
// // // //       player.play();
// // // //     }
// // // //   };

// // // //   const onStop = () => {
// // // //     try {
// // // //       player.pause();
// // // //       player.currentTime = 0;
// // // //       // Clear the player tags to hide the mini player
// // // //       player.__currentKey = undefined;
// // // //       player.__currentUri = undefined;
// // // //       player.__title = undefined;
// // // //       player.__artwork = undefined;
// // // //       player.__podcastId = undefined;
// // // //     } catch (err) {
// // // //       console.error("Error stopping playback:", err);
// // // //     }
// // // //   };

// // // //   const handleNavigateToPodcast = () => {
// // // //     if (player.__podcastId) {
// // // //       console.log("Navigating to podcast with ID:", player.__podcastId);
// // // //       // Navigate to the podcast player with the podcast ID
// // // //       router.push({
// // // //         pathname: "/(podcast)/indexPodcast",
// // // //         params: {
// // // //           podcast: JSON.stringify({
// // // //             id: player.__podcastId,
// // // //             // Include other data if available
// // // //             title: player.__title,
// // // //           }),
// // // //         },
// // // //       });
// // // //     } else if (onOpenFull) {
// // // //       onOpenFull(player.__podcastId);
// // // //     }
// // // //   };

// // // //   return (
// // // //     <View
// // // //       style={[
// // // //         styles.wrap,
// // // //         {
// // // //           paddingBottom: Math.max(8, insets.bottom),
// // // //           backgroundColor: scheme === "dark" ? "#121212" : "#fff",
// // // //           borderColor: scheme === "dark" ? "#222" : "#e5e5e5",
// // // //         },
// // // //       ]}
// // // //     >
// // // //       <TouchableOpacity
// // // //         style={styles.meta}
// // // //         activeOpacity={0.8}
// // // //         onPress={handleNavigateToPodcast}
// // // //       >
// // // //         {!!player.__artwork && (
// // // //           <Image
// // // //             source={{ uri: player.__artwork }}
// // // //             style={styles.art}
// // // //             contentFit="cover"
// // // //             cachePolicy="memory-disk"
// // // //           />
// // // //         )}
// // // //         <View style={{ flex: 1, marginHorizontal: 12 }}>
// // // //           <Text
// // // //             numberOfLines={1}
// // // //             style={{
// // // //               fontSize: 14,
// // // //               fontWeight: "700",
// // // //               color: scheme === "dark" ? "#fff" : "#111",
// // // //             }}
// // // //           >
// // // //             {player.__title ?? "Now Playing"}
// // // //           </Text>
// // // //           <Text
// // // //             numberOfLines={1}
// // // //             style={{ fontSize: 12, color: scheme === "dark" ? "#bbb" : "#555" }}
// // // //           >
// // // //             {formatTime(currentTime)} • {formatTime(duration)}
// // // //           </Text>
// // // //         </View>
// // // //       </TouchableOpacity>

// // // //       <View style={styles.controls}>
// // // //         <TouchableOpacity
// // // //           onPress={() => player.seekBy(-15)}
// // // //           style={styles.iconBtn}
// // // //           hitSlop={10}
// // // //         >
// // // //           <Ionicons
// // // //             name="play-skip-back"
// // // //             size={22}
// // // //             color={scheme === "dark" ? "#fff" : "#111"}
// // // //           />
// // // //         </TouchableOpacity>

// // // //         <TouchableOpacity
// // // //           onPress={onToggle}
// // // //           style={[styles.playBtn]}
// // // //           activeOpacity={0.8}
// // // //         >
// // // //           <Ionicons
// // // //             name={isPlaying ? "pause" : "play"}
// // // //             size={22}
// // // //             color="#fff"
// // // //           />
// // // //         </TouchableOpacity>

// // // //         <TouchableOpacity
// // // //           onPress={() => player.seekBy(15)}
// // // //           style={styles.iconBtn}
// // // //           hitSlop={10}
// // // //         >
// // // //           <Ionicons
// // // //             name="play-skip-forward"
// // // //             size={22}
// // // //             color={scheme === "dark" ? "#fff" : "#111"}
// // // //           />
// // // //         </TouchableOpacity>

// // // //         <TouchableOpacity
// // // //           onPress={onStop}
// // // //           style={[styles.iconBtn, { marginLeft: 2 }]}
// // // //           hitSlop={10}
// // // //         >
// // // //           <Ionicons name="stop" size={20} color="#ff6b6b" />
// // // //         </TouchableOpacity>
// // // //       </View>

// // // //       {/* progress bar */}
// // // //       <View
// // // //         style={[
// // // //           styles.progressTrack,
// // // //           { backgroundColor: scheme === "dark" ? "#2a2a2a" : "#e9e9e9" },
// // // //         ]}
// // // //       >
// // // //         <View
// // // //           style={[
// // // //             styles.progressFill,
// // // //             {
// // // //               width: `${progressPct * 100}%`,
// // // //               backgroundColor: scheme === "dark" ? "#8b5cf6" : "#6366f1",
// // // //             },
// // // //           ]}
// // // //         />
// // // //       </View>
// // // //     </View>
// // // //   );
// // // // }

// // // // function formatTime(secs?: number | null): string {
// // // //   if (!secs || secs < 0 || isNaN(secs)) return "0:00";
// // // //   const total = Math.floor(secs);
// // // //   const h = Math.floor(total / 3600);
// // // //   const m = Math.floor((total % 3600) / 60);
// // // //   const s = total % 60;
// // // //   if (h > 0) return `${h}:${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
// // // //   return `${m}:${s < 10 ? "0" : ""}${s}`;
// // // // }

// // // // const styles = StyleSheet.create({
// // // //   wrap: {
// // // //     position: "absolute",
// // // //     left: 0,
// // // //     right: 0,
// // // //     bottom: 0,
// // // //     paddingHorizontal: 12,
// // // //     paddingTop: 10,
// // // //     borderTopWidth: StyleSheet.hairlineWidth,
// // // //     shadowColor: "#000",
// // // //     shadowOpacity: 0.08,
// // // //     shadowOffset: { width: 0, height: -2 },
// // // //     shadowRadius: 6,
// // // //     elevation: 10,
// // // //   },
// // // //   meta: { flexDirection: "row", alignItems: "center" },
// // // //   art: { width: 36, height: 36, borderRadius: 6, backgroundColor: "#ccc" },
// // // //   controls: { flexDirection: "row", alignItems: "center", marginTop: 8 },
// // // //   playBtn: {
// // // //     marginHorizontal: 10,
// // // //     width: 36,
// // // //     height: 36,
// // // //     borderRadius: 18,
// // // //     alignItems: "center",
// // // //     justifyContent: "center",
// // // //     backgroundColor: "#6d5dfc",
// // // //   },
// // // //   iconBtn: { padding: 6, alignItems: "center", justifyContent: "center" },
// // // //   progressTrack: {
// // // //     height: 3,
// // // //     borderRadius: 2,
// // // //     overflow: "hidden",
// // // //     marginTop: 8,
// // // //   },
// // // //   progressFill: { height: "100%" },
// // // // });

// // // import React, { useMemo } from "react";
// // // import {
// // //   View,
// // //   Text,
// // //   StyleSheet,
// // //   TouchableOpacity,
// // //   useColorScheme,
// // // } from "react-native";
// // // import { useSafeAreaInsets } from "react-native-safe-area-context";
// // // import { Image } from "expo-image";
// // // import { Ionicons } from "@expo/vector-icons";
// // // import { useEvent } from "expo";
// // // import { router, usePathname } from "expo-router";

// // // import { globalPlayer as basePlayer } from "@/components/GlobalVideoHost";

// // // type TaggedPlayer = typeof basePlayer & {
// // //   __currentUri?: string;
// // //   __currentKey?: string;
// // //   __title?: string;
// // //   __artwork?: string;
// // //   __podcastId?: string | number;
// // //   __filename?: string;
// // // };

// // // type Props = {
// // //   onOpenFull?: (podcastId?: string | number) => void;
// // // };

// // // export default function MiniPlayerBar({ onOpenFull }: Props) {
// // //   const player = basePlayer as TaggedPlayer;
// // //   const insets = useSafeAreaInsets();
// // //   const scheme = useColorScheme() || "light";
// // //   const pathname = usePathname();

// // //   // Player events
// // //   const playingEvt = useEvent(player, "playingChange");
// // //   const timeEvt = useEvent(player, "timeUpdate");
// // //   const isPlaying = player.playing || !!playingEvt?.isPlaying;

// // //   const currentTime = timeEvt?.currentTime ?? player.currentTime ?? 0;
// // //   const duration = player.duration ?? 0;

// // //   const progressPct = useMemo(() => {
// // //     if (!duration || duration <= 0) return 0;
// // //     return Math.max(0, Math.min(1, currentTime / duration));
// // //   }, [currentTime, duration]);

// // //   // Hide the mini player in the podcast screen itself
// // //   if (pathname?.includes("indexPodcast")) return null;
// // //   if (!player.__currentUri && !player.__currentKey) return null;

// // //   const onToggle = () => {
// // //     if (isPlaying) player.pause();
// // //     else player.play();
// // //   };

// // //   const onStop = () => {
// // //     try {
// // //       player.pause();
// // //       player.currentTime = 0;
// // //       // Clear only our tags; keep the source loaded so UI stays consistent
// // //       player.__currentUri = undefined;
// // //       player.__currentKey = undefined;
// // //       player.__title = undefined;
// // //       player.__artwork = undefined;
// // //       player.__podcastId = undefined;
// // //       player.__filename = undefined;
// // //     } catch {}
// // //   };
// // //   const openFull = () => {
// // //     router.push({
// // //       pathname: "/(podcast)/indexPodcast",
// // //       params: {
// // //         podcast: JSON.stringify({
// // //           id: player.__podcastId,
// // //           title: player.__title,
// // //           filename: player.__filename,
// // //           currentUri: player.__currentUri,
// // //         }),
// // //       },
// // //     });
// // //   };

// // //   const formatTime = (sec: number) => {
// // //     const s = Math.max(0, Math.floor(sec));
// // //     const m = Math.floor(s / 60);
// // //     const ss = s % 60;
// // //     return `${m}:${ss.toString().padStart(2, "0")}`;
// // //   };

// // //   return (
// // //     <View
// // //       style={[
// // //         styles.wrap,
// // //         {
// // //           paddingBottom: Math.max(8, insets.bottom),
// // //           backgroundColor: scheme === "dark" ? "#0f142e" : "#ffffff",
// // //           borderTopColor:
// // //             scheme === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)",
// // //         },
// // //       ]}
// // //     >
// // //       <TouchableOpacity
// // //         style={styles.left}
// // //         activeOpacity={0.9}
// // //         onPress={openFull}
// // //       >
// // //         <Image
// // //           source={{ uri: player.__artwork }}
// // //           style={styles.artwork}
// // //           contentFit="cover"
// // //         />

// // //         <View style={{ flex: 1, marginLeft: 12 }}>
// // //           <Text
// // //             numberOfLines={1}
// // //             style={{
// // //               fontSize: 14,
// // //               fontWeight: "700",
// // //               color: scheme === "dark" ? "#fff" : "#111",
// // //             }}
// // //           >
// // //             {player.__title ?? "Now Playing"}
// // //           </Text>
// // //           <Text
// // //             numberOfLines={1}
// // //             style={{ fontSize: 12, color: scheme === "dark" ? "#bbb" : "#555" }}
// // //           >
// // //             {formatTime(currentTime)} • {formatTime(duration)}
// // //           </Text>
// // //         </View>
// // //       </TouchableOpacity>

// // //       <View style={styles.controls}>
// // //         <TouchableOpacity
// // //           onPress={() => player.seekBy(-15)}
// // //           style={styles.iconBtn}
// // //           hitSlop={10}
// // //         >
// // //           <Ionicons
// // //             name="play-skip-back"
// // //             size={22}
// // //             color={scheme === "dark" ? "#fff" : "#111"}
// // //           />
// // //         </TouchableOpacity>

// // //         <TouchableOpacity
// // //           onPress={onToggle}
// // //           style={styles.playBtn}
// // //           activeOpacity={0.85}
// // //         >
// // //           <Ionicons
// // //             name={isPlaying ? "pause" : "play"}
// // //             size={22}
// // //             color="#fff"
// // //           />
// // //         </TouchableOpacity>

// // //         <TouchableOpacity
// // //           onPress={() => player.seekBy(15)}
// // //           style={styles.iconBtn}
// // //           hitSlop={10}
// // //         >
// // //           <Ionicons
// // //             name="play-skip-forward"
// // //             size={22}
// // //             color={scheme === "dark" ? "#fff" : "#111"}
// // //           />
// // //         </TouchableOpacity>

// // //         <TouchableOpacity
// // //           onPress={onStop}
// // //           style={[styles.iconBtn, { marginLeft: 2 }]}
// // //           hitSlop={10}
// // //         >
// // //           <Ionicons name="stop" size={20} color="#ff6b6b" />
// // //         </TouchableOpacity>
// // //       </View>

// // //       {/* progress bar */}
// // //       <View
// // //         style={[
// // //           styles.progressTrack,
// // //           {
// // //             backgroundColor:
// // //               scheme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
// // //           },
// // //         ]}
// // //       >
// // //         <View
// // //           style={[
// // //             styles.progressFill,
// // //             {
// // //               width: `${progressPct * 100}%`,
// // //               backgroundColor: scheme === "dark" ? "#667eea" : "#4c6ef5",
// // //             },
// // //           ]}
// // //         />
// // //       </View>
// // //     </View>
// // //   );
// // // }

// // // const styles = StyleSheet.create({
// // //   wrap: {
// // //     position: "absolute",
// // //     left: 0,
// // //     right: 0,
// // //     bottom: 0,
// // //     borderTopWidth: StyleSheet.hairlineWidth,
// // //     paddingHorizontal: 12,
// // //     paddingTop: 10,
// // //   },
// // //   left: { flexDirection: "row", alignItems: "center" },
// // //   artwork: {
// // //     width: 40,
// // //     height: 40,
// // //     borderRadius: 8,
// // //     backgroundColor: "#ddd",
// // //   },
// // //   controls: { flexDirection: "row", alignItems: "center" },
// // //   playBtn: {
// // //     width: 40,
// // //     height: 40,
// // //     borderRadius: 18,
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //     backgroundColor: "#6d5dfc",
// // //     marginHorizontal: 6,
// // //   },
// // //   iconBtn: { padding: 6, alignItems: "center", justifyContent: "center" },
// // //   progressTrack: {
// // //     height: 3,
// // //     borderRadius: 2,
// // //     overflow: "hidden",
// // //     marginTop: 8,
// // //   },
// // //   progressFill: { height: "100%" },
// // // });

// // import React, { useMemo, useEffect, useRef } from "react";
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   TouchableOpacity,
// //   useColorScheme,
// //   Animated,
// //   Dimensions,
// //   Platform,
// // } from "react-native";
// // import { useSafeAreaInsets } from "react-native-safe-area-context";
// // import { Image } from "expo-image";
// // import { Ionicons } from "@expo/vector-icons";
// // import { useEvent } from "expo";
// // import { router, usePathname } from "expo-router";
// // import { LinearGradient } from "expo-linear-gradient";
// // import { BlurView } from "expo-blur";

// // import { globalPlayer as basePlayer } from "@/components/GlobalVideoHost";

// // type TaggedPlayer = typeof basePlayer & {
// //   __currentUri?: string;
// //   __currentKey?: string;
// //   __title?: string;
// //   __artwork?: string;
// //   __podcastId?: string | number;
// //   __filename?: string;
// // };

// // type Props = {
// //   onOpenFull?: (podcastId?: string | number) => void;
// //   bottomOffset?: number; // Add this to position above navbar
// // };

// // const { width: screenWidth } = Dimensions.get("window");

// // export default function MiniPlayerBar({
// //   onOpenFull,
// //   bottomOffset = 80,
// // }: Props) {
// //   const player = basePlayer as TaggedPlayer;
// //   const insets = useSafeAreaInsets();
// //   const scheme = useColorScheme() || "light";
// //   const pathname = usePathname();

// //   // Animation values
// //   const slideAnim = useRef(new Animated.Value(100)).current;
// //   const fadeAnim = useRef(new Animated.Value(0)).current;
// //   const scaleAnim = useRef(new Animated.Value(0.95)).current;
// //   const progressAnim = useRef(new Animated.Value(0)).current;

// //   // Player events
// //   const playingEvt = useEvent(player, "playingChange");
// //   const timeEvt = useEvent(player, "timeUpdate");
// //   const isPlaying = player.playing || !!playingEvt?.isPlaying;

// //   const currentTime = timeEvt?.currentTime ?? player.currentTime ?? 0;
// //   const duration = player.duration ?? 0;

// //   const progressPct = useMemo(() => {
// //     if (!duration || duration <= 0) return 0;
// //     return Math.max(0, Math.min(1, currentTime / duration));
// //   }, [currentTime, duration]);

// //   // Animate progress bar
// //   useEffect(() => {
// //     Animated.timing(progressAnim, {
// //       toValue: progressPct,
// //       duration: 200,
// //       useNativeDriver: false,
// //     }).start();
// //   }, [progressPct]);

// //   // Entrance animation
// //   useEffect(() => {
// //     if (player.__currentUri || player.__currentKey) {
// //       Animated.parallel([
// //         Animated.spring(slideAnim, {
// //           toValue: 0,
// //           damping: 20,
// //           stiffness: 300,
// //           useNativeDriver: true,
// //         }),
// //         Animated.timing(fadeAnim, {
// //           toValue: 1,
// //           duration: 300,
// //           useNativeDriver: true,
// //         }),
// //         Animated.spring(scaleAnim, {
// //           toValue: 1,
// //           damping: 15,
// //           stiffness: 200,
// //           useNativeDriver: true,
// //         }),
// //       ]).start();
// //     } else {
// //       Animated.parallel([
// //         Animated.timing(slideAnim, {
// //           toValue: 100,
// //           duration: 200,
// //           useNativeDriver: true,
// //         }),
// //         Animated.timing(fadeAnim, {
// //           toValue: 0,
// //           duration: 200,
// //           useNativeDriver: true,
// //         }),
// //       ]).start();
// //     }
// //   }, [!!player.__currentUri, !!player.__currentKey]);

// //   // Hide the mini player in the podcast screen itself
// //   if (pathname?.includes("indexPodcast")) return null;
// //   if (!player.__currentUri && !player.__currentKey) return null;

// //   const onToggle = () => {
// //     if (isPlaying) player.pause();
// //     else player.play();
// //   };

// //   const onStop = () => {
// //     try {
// //       player.pause();
// //       player.currentTime = 0;
// //       player.__currentUri = undefined;
// //       player.__currentKey = undefined;
// //       player.__title = undefined;
// //       player.__artwork = undefined;
// //       player.__podcastId = undefined;
// //       player.__filename = undefined;
// //     } catch {}
// //   };

// //   const openFull = () => {
// //     router.push({
// //       pathname: "/(podcast)/indexPodcast",
// //       params: {
// //         podcast: JSON.stringify({
// //           id: player.__podcastId,
// //           title: player.__title,
// //           filename: player.__filename,
// //           currentUri: player.__currentUri,
// //         }),
// //       },
// //     });
// //   };

// //   const formatTime = (sec: number) => {
// //     const s = Math.max(0, Math.floor(sec));
// //     const m = Math.floor(s / 60);
// //     const ss = s % 60;
// //     return `${m}:${ss.toString().padStart(2, "0")}`;
// //   };

// //   const isDark = scheme === "dark";

// //   return (
// //     <Animated.View
// //       style={[
// //         styles.wrap,
// //         {
// //           bottom: bottomOffset, // Position above navbar
// //           transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
// //           opacity: fadeAnim,
// //         },
// //       ]}
// //     >
// //       <BlurView
// //         intensity={isDark ? 80 : 95}
// //         tint={isDark ? "dark" : "light"}
// //         style={styles.blurContainer}
// //       >
// //         <LinearGradient
// //           colors={
// //             isDark
// //               ? ["rgba(15,20,46,0.9)", "rgba(15,20,46,0.85)"]
// //               : ["rgba(255,255,255,0.95)", "rgba(255,255,255,0.9)"]
// //           }
// //           style={styles.gradientBg}
// //         />

// //         <View style={styles.content}>
// //           {/* Main Content Row */}
// //           <View style={styles.mainRow}>
// //             <TouchableOpacity
// //               style={styles.leftSection}
// //               activeOpacity={0.9}
// //               onPress={openFull}
// //             >
// //               {/* Animated Artwork */}
// //               <View style={styles.artworkContainer}>
// //                 <Image
// //                   source={{ uri: player.__artwork }}
// //                   style={styles.artwork}
// //                   contentFit="cover"
// //                 />
// //                 {isPlaying && (
// //                   <View style={styles.playingIndicator}>
// //                     <View style={[styles.bar, styles.bar1]} />
// //                     <View style={[styles.bar, styles.bar2]} />
// //                     <View style={[styles.bar, styles.bar3]} />
// //                   </View>
// //                 )}
// //               </View>

// //               <View style={styles.textContainer}>
// //                 <Text
// //                   numberOfLines={1}
// //                   style={[styles.title, { color: isDark ? "#fff" : "#1a1a2e" }]}
// //                 >
// //                   {player.__title ?? "Now Playing"}
// //                 </Text>
// //                 <Text
// //                   numberOfLines={1}
// //                   style={[
// //                     styles.time,
// //                     {
// //                       color: isDark
// //                         ? "rgba(255,255,255,0.6)"
// //                         : "rgba(0,0,0,0.5)",
// //                     },
// //                   ]}
// //                 >
// //                   {formatTime(currentTime)} / {formatTime(duration)}
// //                 </Text>
// //               </View>
// //             </TouchableOpacity>

// //             {/* Controls */}
// //             <View style={styles.controls}>
// //               <TouchableOpacity
// //                 onPress={() => player.seekBy(-15)}
// //                 style={styles.iconBtn}
// //                 hitSlop={10}
// //               >
// //                 <View style={[styles.iconBg, isDark && styles.iconBgDark]}>
// //                   <Ionicons
// //                     name="play-skip-back"
// //                     size={18}
// //                     color={isDark ? "#fff" : "#1a1a2e"}
// //                   />
// //                 </View>
// //               </TouchableOpacity>

// //               <TouchableOpacity
// //                 onPress={onToggle}
// //                 style={styles.playBtn}
// //                 activeOpacity={0.85}
// //               >
// //                 <LinearGradient
// //                   colors={
// //                     isPlaying ? ["#FF6B6B", "#EE5A6F"] : ["#667eea", "#764ba2"]
// //                   }
// //                   style={styles.playBtnGradient}
// //                   start={{ x: 0, y: 0 }}
// //                   end={{ x: 1, y: 1 }}
// //                 >
// //                   <Ionicons
// //                     name={isPlaying ? "pause" : "play"}
// //                     size={24}
// //                     color="#fff"
// //                     style={isPlaying ? {} : { marginLeft: 2 }}
// //                   />
// //                 </LinearGradient>
// //               </TouchableOpacity>

// //               <TouchableOpacity
// //                 onPress={() => player.seekBy(15)}
// //                 style={styles.iconBtn}
// //                 hitSlop={10}
// //               >
// //                 <View style={[styles.iconBg, isDark && styles.iconBgDark]}>
// //                   <Ionicons
// //                     name="play-skip-forward"
// //                     size={18}
// //                     color={isDark ? "#fff" : "#1a1a2e"}
// //                   />
// //                 </View>
// //               </TouchableOpacity>

// //               <TouchableOpacity
// //                 onPress={onStop}
// //                 style={styles.iconBtn}
// //                 hitSlop={10}
// //               >
// //                 <View style={styles.stopBtn}>
// //                   <Ionicons name="close" size={18} color="#FF6B6B" />
// //                 </View>
// //               </TouchableOpacity>
// //             </View>
// //           </View>

// //           {/* Progress Bar */}
// //           <View style={styles.progressContainer}>
// //             <View
// //               style={[
// //                 styles.progressTrack,
// //                 {
// //                   backgroundColor: isDark
// //                     ? "rgba(255,255,255,0.1)"
// //                     : "rgba(0,0,0,0.08)",
// //                 },
// //               ]}
// //             >
// //               <Animated.View
// //                 style={[
// //                   styles.progressFill,
// //                   {
// //                     width: progressAnim.interpolate({
// //                       inputRange: [0, 1],
// //                       outputRange: ["0%", "100%"],
// //                     }),
// //                   },
// //                 ]}
// //               >
// //                 <LinearGradient
// //                   colors={["#667eea", "#764ba2"]}
// //                   style={styles.progressGradient}
// //                   start={{ x: 0, y: 0 }}
// //                   end={{ x: 1, y: 0 }}
// //                 />
// //               </Animated.View>
// //               <Animated.View
// //                 style={[
// //                   styles.progressDot,
// //                   {
// //                     left: progressAnim.interpolate({
// //                       inputRange: [0, 1],
// //                       outputRange: ["0%", "100%"],
// //                     }),
// //                   },
// //                 ]}
// //               />
// //             </View>
// //           </View>
// //         </View>
// //       </BlurView>
// //     </Animated.View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   wrap: {
// //     position: "absolute",
// //     left: 16,
// //     right: 16,
// //     borderRadius: 20,
// //     overflow: "hidden",
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 10 },
// //     shadowOpacity: 0.15,
// //     shadowRadius: 20,
// //     elevation: 10,
// //   },
// //   blurContainer: {
// //     borderRadius: 20,
// //     overflow: "hidden",
// //   },
// //   gradientBg: {
// //     ...StyleSheet.absoluteFillObject,
// //   },
// //   content: {
// //     paddingHorizontal: 16,
// //     paddingTop: 14,
// //     paddingBottom: 10,
// //   },
// //   mainRow: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     justifyContent: "space-between",
// //   },
// //   leftSection: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     flex: 1,
// //     marginRight: 12,
// //   },
// //   artworkContainer: {
// //     position: "relative",
// //   },
// //   artwork: {
// //     width: 48,
// //     height: 48,
// //     borderRadius: 12,
// //     backgroundColor: "#e0e0e0",
// //   },
// //   playingIndicator: {
// //     position: "absolute",
// //     bottom: 4,
// //     right: 4,
// //     flexDirection: "row",
// //     alignItems: "flex-end",
// //     backgroundColor: "rgba(0,0,0,0.7)",
// //     padding: 3,
// //     borderRadius: 4,
// //     gap: 2,
// //   },
// //   bar: {
// //     width: 2,
// //     backgroundColor: "#fff",
// //     borderRadius: 1,
// //   },
// //   bar1: {
// //     height: 8,
// //     animation: "pulse 1s ease-in-out infinite",
// //   },
// //   bar2: {
// //     height: 12,
// //     animation: "pulse 1s ease-in-out infinite 0.2s",
// //   },
// //   bar3: {
// //     height: 6,
// //     animation: "pulse 1s ease-in-out infinite 0.4s",
// //   },
// //   textContainer: {
// //     flex: 1,
// //     marginLeft: 12,
// //   },
// //   title: {
// //     fontSize: 15,
// //     fontWeight: "600",
// //     marginBottom: 2,
// //   },
// //   time: {
// //     fontSize: 12,
// //     fontWeight: "500",
// //   },
// //   controls: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 8,
// //   },
// //   iconBtn: {
// //     padding: 4,
// //   },
// //   iconBg: {
// //     width: 32,
// //     height: 32,
// //     borderRadius: 10,
// //     backgroundColor: "rgba(0,0,0,0.05)",
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },
// //   iconBgDark: {
// //     backgroundColor: "rgba(255,255,255,0.1)",
// //   },
// //   playBtn: {
// //     marginHorizontal: 4,
// //   },
// //   playBtnGradient: {
// //     width: 44,
// //     height: 44,
// //     borderRadius: 14,
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },
// //   stopBtn: {
// //     width: 32,
// //     height: 32,
// //     borderRadius: 10,
// //     backgroundColor: "rgba(255,107,107,0.1)",
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },
// //   progressContainer: {
// //     marginTop: 10,
// //   },
// //   progressTrack: {
// //     height: 4,
// //     borderRadius: 2,
// //     overflow: "visible",
// //     position: "relative",
// //   },
// //   progressFill: {
// //     height: "100%",
// //     borderRadius: 2,
// //     overflow: "hidden",
// //   },
// //   progressGradient: {
// //     flex: 1,
// //   },
// //   progressDot: {
// //     position: "absolute",
// //     width: 12,
// //     height: 12,
// //     borderRadius: 6,
// //     backgroundColor: "#764ba2",
// //     top: -4,
// //     marginLeft: -6,
// //     shadowColor: "#764ba2",
// //     shadowOffset: { width: 0, height: 0 },
// //     shadowOpacity: 0.3,
// //     shadowRadius: 4,
// //   },
// // });

// import React, { useMemo, useEffect, useRef } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   useColorScheme,
//   Animated,
//   Dimensions,
//   Platform,
// } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { Image } from "expo-image";
// import { Ionicons } from "@expo/vector-icons";
// import { useEvent } from "expo";
// import { router, usePathname } from "expo-router";
// import { LinearGradient } from "expo-linear-gradient";
// import { BlurView } from "expo-blur";

// import { globalPlayer as basePlayer } from "@/components/GlobalVideoHost";

// type TaggedPlayer = typeof basePlayer & {
//   __currentUri?: string;
//   __currentKey?: string;
//   __title?: string;
//   __artwork?: string;
//   __podcastId?: string | number;
//   __filename?: string;
// };

// type Props = {
//   onOpenFull?: (podcastId?: string | number) => void;
//   bottomOffset?: number; // Add this to position above navbar
// };

// const { width: screenWidth } = Dimensions.get("window");

// export default function MiniPlayerBar({ onOpenFull, bottomOffset = 50 }: Props) {
//   const player = basePlayer as TaggedPlayer;
//   const insets = useSafeAreaInsets();
//   const scheme = useColorScheme() || "light";
//   const pathname = usePathname();

//   // Animation values
//   const slideAnim = useRef(new Animated.Value(100)).current;
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const scaleAnim = useRef(new Animated.Value(0.95)).current;
//   const progressAnim = useRef(new Animated.Value(0)).current;

//   // Player events
//   const playingEvt = useEvent(player, "playingChange");
//   const timeEvt = useEvent(player, "timeUpdate");
//   const isPlaying = player.playing || !!playingEvt?.isPlaying;

//   const currentTime = timeEvt?.currentTime ?? player.currentTime ?? 0;
//   const duration = player.duration ?? 0;

//   const progressPct = useMemo(() => {
//     if (!duration || duration <= 0) return 0;
//     return Math.max(0, Math.min(1, currentTime / duration));
//   }, [currentTime, duration]);

//   // Animate progress bar
//   useEffect(() => {
//     Animated.timing(progressAnim, {
//       toValue: progressPct,
//       duration: 200,
//       useNativeDriver: false,
//     }).start();
//   }, [progressPct]);

//   // Entrance animation
//   useEffect(() => {
//     if (player.__currentUri || player.__currentKey) {
//       Animated.parallel([
//         Animated.spring(slideAnim, {
//           toValue: 0,
//           damping: 20,
//           stiffness: 300,
//           useNativeDriver: true,
//         }),
//         Animated.timing(fadeAnim, {
//           toValue: 1,
//           duration: 300,
//           useNativeDriver: true,
//         }),
//         Animated.spring(scaleAnim, {
//           toValue: 1,
//           damping: 15,
//           stiffness: 200,
//           useNativeDriver: true,
//         }),
//       ]).start();
//     } else {
//       Animated.parallel([
//         Animated.timing(slideAnim, {
//           toValue: 100,
//           duration: 200,
//           useNativeDriver: true,
//         }),
//         Animated.timing(fadeAnim, {
//           toValue: 0,
//           duration: 200,
//           useNativeDriver: true,
//         }),
//       ]).start();
//     }
//   }, [!!player.__currentUri, !!player.__currentKey]);

//   // Hide the mini player in the podcast screen itself
//   if (pathname?.includes("indexPodcast")) return null;
//   if (!player.__currentUri && !player.__currentKey) return null;

//   const onToggle = () => {
//     // Add haptic feedback if available
//     if (Platform.OS === "ios") {
//       // You can add haptic feedback here using expo-haptics
//     }
//     if (isPlaying) player.pause();
//     else player.play();
//   };

//   const onStop = () => {
//     try {
//       player.pause();
//       player.currentTime = 0;
//       player.__currentUri = undefined;
//       player.__currentKey = undefined;
//       player.__title = undefined;
//       player.__artwork = undefined;
//       player.__podcastId = undefined;
//       player.__filename = undefined;
//     } catch {}
//   };

//   const openFull = () => {
//     router.push({
//       pathname: "/(podcast)/indexPodcast",
//       params: {
//         podcast: JSON.stringify({
//           id: player.__podcastId,
//           title: player.__title,
//           filename: player.__filename,
//           currentUri: player.__currentUri,
//         }),
//       },
//     });
//   };

//   const formatTime = (sec: number) => {
//     const s = Math.max(0, Math.floor(sec));
//     const m = Math.floor(s / 60);
//     const ss = s % 60;
//     return `${m}:${ss.toString().padStart(2, "0")}`;
//   };

//   const isDark = scheme === "dark";

//   return (
//     <Animated.View
//       style={[
//         styles.wrap,
//         {
//           bottom: bottomOffset, // Position above navbar
//           transform: [
//             { translateY: slideAnim },
//             { scale: scaleAnim }
//           ],
//           opacity: fadeAnim,
//         },
//       ]}
//     >
//       <BlurView
//         intensity={isDark ? 80 : 95}
//         tint={isDark ? "dark" : "light"}
//         style={styles.blurContainer}
//       >
//         <LinearGradient
//           colors={
//             isDark
//               ? ["rgba(15,20,46,0.9)", "rgba(15,20,46,0.85)"]
//               : ["rgba(255,255,255,0.95)", "rgba(255,255,255,0.9)"]
//           }
//           style={styles.gradientBg}
//         />

//         <View style={styles.content}>
//           {/* Main Content Row */}
//           <View style={styles.mainRow}>
//             <TouchableOpacity
//               style={styles.leftSection}
//               activeOpacity={0.9}
//               onPress={openFull}
//             >
//               {/* Animated Artwork */}
//               <View style={styles.artworkContainer}>
//                 <Image
//                   source={{ uri: player.__artwork }}
//                   style={styles.artwork}
//                   contentFit="cover"
//                 />
//                 {isPlaying && (
//                   <View style={styles.playingIndicator}>
//                     <View style={[styles.bar, styles.bar1]} />
//                     <View style={[styles.bar, styles.bar2]} />
//                     <View style={[styles.bar, styles.bar3]} />
//                   </View>
//                 )}
//               </View>

//               <View style={styles.textContainer}>
//                 <Text
//                   numberOfLines={1}
//                   style={[
//                     styles.title,
//                     { color: isDark ? "#fff" : "#1a1a2e" }
//                   ]}
//                 >
//                   {player.__title ?? "Now Playing"}
//                 </Text>
//                 <Text
//                   numberOfLines={1}
//                   style={[
//                     styles.time,
//                     { color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)" }
//                   ]}
//                 >
//                   {formatTime(currentTime)} / {formatTime(duration)}
//                 </Text>
//               </View>
//             </TouchableOpacity>

//             {/* Controls */}
//             <View style={styles.controls}>
//               <TouchableOpacity
//                 onPress={() => player.seekBy(-15)}
//                 style={styles.iconBtn}
//                 hitSlop={10}
//               >
//                 <View style={[styles.iconBg, isDark && styles.iconBgDark]}>
//                   <Ionicons
//                     name="play-skip-back"
//                     size={18}
//                     color={isDark ? "#fff" : "#1a1a2e"}
//                   />
//                 </View>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 onPress={onToggle}
//                 style={styles.playBtn}
//                 activeOpacity={0.85}
//               >
//                 <LinearGradient
//                   colors={
//                     isPlaying
//                       ? ["#FF6B6B", "#EE5A6F"]
//                       : ["#667eea", "#764ba2"]
//                   }
//                   style={styles.playBtnGradient}
//                   start={{ x: 0, y: 0 }}
//                   end={{ x: 1, y: 1 }}
//                 >
//                   <Ionicons
//                     name={isPlaying ? "pause" : "play"}
//                     size={24}
//                     color="#fff"
//                     style={isPlaying ? {} : { marginLeft: 2 }}
//                   />
//                 </LinearGradient>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 onPress={() => player.seekBy(15)}
//                 style={styles.iconBtn}
//                 hitSlop={10}
//               >
//                 <View style={[styles.iconBg, isDark && styles.iconBgDark]}>
//                   <Ionicons
//                     name="play-skip-forward"
//                     size={18}
//                     color={isDark ? "#fff" : "#1a1a2e"}
//                   />
//                 </View>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 onPress={onStop}
//                 style={styles.iconBtn}
//                 hitSlop={10}
//               >
//                 <View style={styles.stopBtn}>
//                   <Ionicons name="close" size={18} color="#FF6B6B" />
//                 </View>
//               </TouchableOpacity>
//             </View>
//           </View>

//           {/* Progress Bar */}
//           <View style={styles.progressContainer}>
//             <View
//               style={[
//                 styles.progressTrack,
//                 {
//                   backgroundColor: isDark 
//                     ? "rgba(255,255,255,0.1)" 
//                     : "rgba(0,0,0,0.08)",
//                 },
//               ]}
//             >
//               <Animated.View
//                 style={[
//                   styles.progressFill,
//                   {
//                     width: progressAnim.interpolate({
//                       inputRange: [0, 1],
//                       outputRange: ["0%", "100%"],
//                     }),
//                   },
//                 ]}
//               >
//                 <LinearGradient
//                   colors={["#667eea", "#764ba2"]}
//                   style={styles.progressGradient}
//                   start={{ x: 0, y: 0 }}
//                   end={{ x: 1, y: 0 }}
//                 />
//               </Animated.View>
//               <Animated.View
//                 style={[
//                   styles.progressDot,
//                   {
//                     left: progressAnim.interpolate({
//                       inputRange: [0, 1],
//                       outputRange: ["0%", "100%"],
//                     }),
//                   },
//                 ]}
//               />
//             </View>
//           </View>
//         </View>
//       </BlurView>
//     </Animated.View>
//   );
// }

// const styles = StyleSheet.create({
//   wrap: {
//     position: "absolute",
//     left: 16,
//     right: 16,
//     borderRadius: 20,
//     overflow: "hidden",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 10 },
//     shadowOpacity: 0.15,
//     shadowRadius: 20,
//     elevation: 10,
//   },
//   blurContainer: {
//     borderRadius: 20,
//     overflow: "hidden",
//   },
//   gradientBg: {
//     ...StyleSheet.absoluteFillObject,
//   },
//   content: {
//     paddingHorizontal: 16,
//     paddingTop: 14,
//     paddingBottom: 10,
//   },
//   mainRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   leftSection: {
//     flexDirection: "row",
//     alignItems: "center",
//     flex: 1,
//     marginRight: 12,
//   },
//   artworkContainer: {
//     position: "relative",
//   },
//   artwork: {
//     width: 48,
//     height: 48,
//     borderRadius: 12,
//     backgroundColor: "#e0e0e0",
//   },
//   playingIndicator: {
//     position: "absolute",
//     bottom: 4,
//     right: 4,
//     flexDirection: "row",
//     alignItems: "flex-end",
//     justifyContent: "center",
//     backgroundColor: "rgba(0,0,0,0.7)",
//     padding: 4,
//     borderRadius: 4,
//     gap: 2,
//     height: 16,
//   },
//   bar: {
//     width: 2,
//     height: 10,
//     backgroundColor: "#fff",
//     borderRadius: 1,
//   },
//   textContainer: {
//     flex: 1,
//     marginLeft: 12,
//   },
//   title: {
//     fontSize: 15,
//     fontWeight: "600",
//     marginBottom: 2,
//   },
//   time: {
//     fontSize: 12,
//     fontWeight: "500",
//   },
//   controls: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//   },
//   iconBtn: {
//     padding: 4,
//   },
//   iconBg: {
//     width: 32,
//     height: 32,
//     borderRadius: 10,
//     backgroundColor: "rgba(0,0,0,0.05)",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   iconBgDark: {
//     backgroundColor: "rgba(255,255,255,0.1)",
//   },
//   playBtn: {
//     marginHorizontal: 4,
//   },
//   playBtnGradient: {
//     width: 44,
//     height: 44,
//     borderRadius: 14,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   stopBtn: {
//     width: 32,
//     height: 32,
//     borderRadius: 10,
//     backgroundColor: "rgba(255,107,107,0.1)",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   progressContainer: {
//     marginTop: 10,
//   },
//   progressTrack: {
//     height: 4,
//     borderRadius: 2,
//     overflow: "visible",
//     position: "relative",
//   },
//   progressFill: {
//     height: "100%",
//     borderRadius: 2,
//     overflow: "hidden",
//   },
//   progressGradient: {
//     flex: 1,
//   },
//   progressDot: {
//     position: "absolute",
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     backgroundColor: "#764ba2",
//     top: -4,
//     marginLeft: -6,
//     shadowColor: "#764ba2",
//     shadowOffset: { width: 0, height: 0 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//   },
// });

import React, { useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Dimensions,
  Platform,
  PanResponder,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useEvent } from "expo";
import { router, usePathname } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

import { globalPlayer as basePlayer } from "@/components/GlobalVideoHost";

type TaggedPlayer = typeof basePlayer & {
  __currentUri?: string;
  __currentKey?: string;
  __title?: string;
  __artwork?: string;
  __podcastId?: string | number;
  __filename?: string;
};

type Props = {
  onOpenFull?: (podcastId?: string | number) => void;
  bottomOffset?: number; // Add this to position above navbar
};

const { width: screenWidth } = Dimensions.get("window");

export default function MiniPlayerBar({ onOpenFull, bottomOffset = 90 }: Props) {
  const player = basePlayer as TaggedPlayer;
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme() || "light";
  const pathname = usePathname();
  
  // State for slider interaction
  const [isDragging, setIsDragging] = useState(false);
  const [sliderWidth, setSliderWidth] = useState(0);
  const [dragProgress, setDragProgress] = useState(0);

  // Player events
  const playingEvt = useEvent(player, "playingChange");
  const timeEvt = useEvent(player, "timeUpdate");
  const isPlaying = player.playing || !!playingEvt?.isPlaying;

  const currentTime = timeEvt?.currentTime ?? player.currentTime ?? 0;
  const duration = player.duration ?? 0;

  const progressPct = useMemo(() => {
    if (!duration || duration <= 0) return 0;
    return Math.max(0, Math.min(1, currentTime / duration));
  }, [currentTime, duration]);

  // Use drag progress when dragging, otherwise use actual progress
  const displayProgress = isDragging ? dragProgress : progressPct;

  // PanResponder for slider dragging
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        setIsDragging(true);
        
        // Immediately seek to tap position
        if (sliderWidth > 0 && duration > 0) {
          const touchX = evt.nativeEvent.locationX;
          const newProgress = Math.max(0, Math.min(1, touchX / sliderWidth));
          setDragProgress(newProgress);
          const newTime = newProgress * duration;
          player.currentTime = newTime;
        }
      },
      onPanResponderMove: (evt) => {
        if (sliderWidth > 0 && duration > 0) {
          const touchX = evt.nativeEvent.locationX;
          const newProgress = Math.max(0, Math.min(1, touchX / sliderWidth));
          setDragProgress(newProgress);
        }
      },
      onPanResponderRelease: (evt) => {
        setIsDragging(false);
        
        // Final seek position
        if (sliderWidth > 0 && duration > 0) {
          const touchX = evt.nativeEvent.locationX;
          const newProgress = Math.max(0, Math.min(1, touchX / sliderWidth));
          const newTime = newProgress * duration;
          player.currentTime = newTime;
        }
      },
    })
  ).current;

  // Hide the mini player in the podcast screen itself
  if (pathname?.includes("indexPodcast")) return null;
  if (!player.__currentUri && !player.__currentKey) return null;

  const onToggle = () => {
    if (isPlaying) player.pause();
    else player.play();
  };

  const onStop = () => {
    try {
      player.pause();
      player.currentTime = 0;
      player.__currentUri = undefined;
      player.__currentKey = undefined;
      player.__title = undefined;
      player.__artwork = undefined;
      player.__podcastId = undefined;
      player.__filename = undefined;
    } catch {}
  };

  const openFull = () => {
    router.push({
      pathname: "/(podcast)/indexPodcast",
      params: {
        podcast: JSON.stringify({
          id: player.__podcastId,
          title: player.__title,
          filename: player.__filename,
          currentUri: player.__currentUri,
        }),
      },
    });
  };

  const formatTime = (sec: number) => {
    const s = Math.max(0, Math.floor(sec));
    const m = Math.floor(s / 60);
    const ss = s % 60;
    return `${m}:${ss.toString().padStart(2, "0")}`;
  };

  const isDark = scheme === "dark";

  return (
    <View
      style={[
        styles.wrap,
        {
          bottom: bottomOffset, // Position above navbar
        },
      ]}
    >
      <BlurView
        intensity={isDark ? 60 : 70}
        tint={isDark ? "dark" : "light"}
        style={styles.blurContainer}
      >
        <LinearGradient
          colors={
            isDark
              ? ["rgba(15,20,46,0.6)", "rgba(15,20,46,0.5)"]
              : ["rgba(255,255,255,0.7)", "rgba(255,255,255,0.6)"]
          }
          style={styles.gradientBg}
        />

        <View style={styles.content}>
          {/* Main Content Row */}
          <View style={styles.mainRow}>
            <TouchableOpacity
              style={styles.leftSection}
              activeOpacity={0.9}
              onPress={openFull}
            >
              {/* Artwork */}
              <View style={styles.artworkContainer}>
                <Image
                  source={{ uri: player.__artwork }}
                  style={styles.artwork}
                  contentFit="cover"
                />
                {isPlaying && (
                  <View style={styles.playingIndicator}>
                    <View style={styles.bar} />
                    <View style={[styles.bar, styles.bar2]} />
                    <View style={styles.bar} />
                  </View>
                )}
              </View>

              <View style={styles.textContainer}>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.title,
                    { color: isDark ? "#fff" : "#1a1a2e" }
                  ]}
                >
                  {player.__title ?? "Now Playing"}
                </Text>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.time,
                    { color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)" }
                  ]}
                >
                  {formatTime(currentTime)} / {formatTime(duration)}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Controls */}
            <View style={styles.controls}>
              <TouchableOpacity
                onPress={() => player.seekBy(-15)}
                style={styles.iconBtn}
                hitSlop={10}
              >
                <View style={[styles.iconBg, isDark && styles.iconBgDark]}>
                  <Ionicons
                    name="play-skip-back"
                    size={18}
                    color={isDark ? "#fff" : "#1a1a2e"}
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onToggle}
                style={styles.playBtn}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={
                    isPlaying
                      ? ["#FF6B6B", "#EE5A6F"]
                      : ["#667eea", "#764ba2"]
                  }
                  style={styles.playBtnGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons
                    name={isPlaying ? "pause" : "play"}
                    size={24}
                    color="#fff"
                    style={isPlaying ? {} : { marginLeft: 2 }}
                  />
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => player.seekBy(15)}
                style={styles.iconBtn}
                hitSlop={10}
              >
                <View style={[styles.iconBg, isDark && styles.iconBgDark]}>
                  <Ionicons
                    name="play-skip-forward"
                    size={18}
                    color={isDark ? "#fff" : "#1a1a2e"}
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onStop}
                style={styles.iconBtn}
                hitSlop={10}
              >
                <View style={styles.stopBtn}>
                  <Ionicons name="close" size={18} color="#FF6B6B" />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Progress Bar - Interactive */}
          <View 
            style={styles.progressContainer}
            onLayout={(event) => {
              setSliderWidth(event.nativeEvent.layout.width);
            }}
            {...panResponder.panHandlers}
          >
            <View
              style={[
                styles.progressTrack,
                {
                  backgroundColor: isDark 
                    ? "rgba(255,255,255,0.1)" 
                    : "rgba(0,0,0,0.08)",
                },
              ]}
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${displayProgress * 100}%`,
                  },
                ]}
              >
                <LinearGradient
                  colors={isDragging ? ["#8B5CF6", "#A855F7"] : ["#667eea", "#764ba2"]}
                  style={styles.progressGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
              </View>
              <View
                style={[
                  styles.progressDot,
                  {
                    left: `${displayProgress * 100}%`,
                    backgroundColor: isDragging ? "#A855F7" : "#764ba2",
                    transform: isDragging ? [{ scale: 1.5 }] : [{ scale: 1 }],
                  },
                ]}
              />
            </View>
          </View>
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 16,
    right: 16,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 15,
  },
  blurContainer: {
    borderRadius: 20,
    overflow: "hidden",
  },
  gradientBg: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
  },
  mainRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },
  artworkContainer: {
    position: "relative",
  },
  artwork: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#e0e0e0",
  },
  playingIndicator: {
    position: "absolute",
    bottom: 4,
    right: 4,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 4,
    borderRadius: 4,
    gap: 2,
    height: 16,
  },
  bar: {
    width: 2,
    height: 10,
    backgroundColor: "#fff",
    borderRadius: 1,
  },
  bar2: {
    height: 14,
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 2,
  },
  time: {
    fontSize: 12,
    fontWeight: "500",
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconBtn: {
    padding: 4,
  },
  iconBg: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  iconBgDark: {
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  playBtn: {
    marginHorizontal: 4,
  },
  playBtnGradient: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  stopBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "rgba(255,107,107,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  progressContainer: {
    marginTop: 10,
    paddingVertical: 8,
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    overflow: "visible",
    position: "relative",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressGradient: {
    flex: 1,
  },
  progressDot: {
    position: "absolute",
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#764ba2",
    top: -6,
    marginLeft: -8,
    shadowColor: "#764ba2",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
});