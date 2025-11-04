//! Kann überall hin bewegft werden aber bounced zu links mit anzeige des fortschrits
// //! Last worked
// import React, { useMemo, useRef, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   useColorScheme,
//   Dimensions,
//   PanResponder,
//   Animated,
//   LayoutChangeEvent,
// } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { Image } from "expo-image";
// import { Ionicons } from "@expo/vector-icons";
// import { useEvent } from "expo";
// import { router, usePathname } from "expo-router";
// import { LinearGradient } from "expo-linear-gradient";
// import { BlurView } from "expo-blur";
// import { CircularProgressRing } from "./CircularProgressRing";
// import { globalPlayer as basePlayer } from "@/player/GlobalVideoHost";
// import { Colors } from "@/constants/Colors";

// type TaggedPlayer = typeof basePlayer & {
//   __currentUri?: string;
//   __currentKey?: string;
//   __title?: string;
//   __artwork?: string;
//   __podcastId?: string | number;
//   __filename?: string;
//   // add the helper types (for TS)
//   stopAndKeepSource?: () => Promise<void>;
//   stopAndUnload?: () => Promise<void>;
// };

// type Props = {
//   onOpenFull?: (podcastId?: string | number) => void;
//   bottomOffset?: number; // Initial position above navbar
// };

// const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// // Helper to read current animated value
// const readVal = (v: any) =>
//   typeof v?.__getValue === "function" ? v.__getValue() : v?._value ?? 0;

// // Clamp helper
// const clamp = (n: number, min: number, max: number) =>
//   Math.max(min, Math.min(max, n));

// const COLLAPSED_SIZE = 60; // ensure artwork is square for a perfect ring

// export default function MiniPlayerBar({
//   onOpenFull,
//   bottomOffset = 50,
// }: Props) {
//   const player = basePlayer as TaggedPlayer;
//   const insets = useSafeAreaInsets();
//   const colorScheme = useColorScheme() || "light";
//   const pathname = usePathname();
//   // Collapse/expand
//   const [isCollapsed, setIsCollapsed] = useState(false);

//   // Track measured size so we can clamp properly in both states
//   const [measured, setMeasured] = useState({ w: screenWidth - 32, h: 100 }); // NEW
//   const onMeasure = (e: LayoutChangeEvent) => {
//     const { width, height } = e.nativeEvent.layout;
//     setMeasured({ w: width, h: height });
//   };

//   // Position (shared for both states)
//   const pan = useRef(
//     new Animated.ValueXY({
//       x: 0,
//       y: screenHeight - bottomOffset - 100, // initial guess; corrected by clamp on first release
//     })
//   ).current;

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

//   // Compute bounds dynamically from measurement + insets
//   const padding = 10;
//   const leftMargin = 16; // your wrapper uses left:16
//   // Horizontal:
//   // The wrapper has left:16; translateX = 0 means left is 16.
//   // We allow moving left until left hits 0 => minX = -leftMargin
//   // We allow moving right until right hits 16 => maxX = (screenWidth - measured.w - 16) - leftMargin
//   const maxX = screenWidth - measured.w - leftMargin - 16; // space to right edge
//   const minX = -leftMargin;

//   // Vertical:
//   const minY = insets.top + padding;
//   const maxY = screenHeight - insets.bottom - measured.h - padding;

//   // Pan responder that doesn’t steal taps unless the finger actually moves a bit
//   const panResponder = useRef(
//     PanResponder.create({
//       // Don’t start on tap; wait until there is actual movement
//       onStartShouldSetPanResponder: () => false, // NEW
//       onMoveShouldSetPanResponder: (_evt, g) => {
//         const moveDist = Math.abs(g.dx) + Math.abs(g.dy);
//         return moveDist > 4; // small threshold so taps still work  // NEW
//       },
//       onStartShouldSetPanResponderCapture: () => false, // NEW
//       onMoveShouldSetPanResponderCapture: (_evt, g) => {
//         const moveDist = Math.abs(g.dx) + Math.abs(g.dy);
//         return moveDist > 4; // NEW
//       },

//       onPanResponderGrant: () => {
//         pan.setOffset({ x: readVal(pan.x), y: readVal(pan.y) });
//         pan.setValue({ x: 0, y: 0 });
//       },

//       onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
//         useNativeDriver: false,
//       }),

//       onPanResponderRelease: (_evt, g) => {
//         pan.flattenOffset();

//         // Current values after drag
//         const curX = readVal(pan.x);
//         const curY = readVal(pan.y);

//         // Clamp to visible area
//         const targetX = clamp(curX, minX, Math.max(0, maxX));
//         const targetY = clamp(curY, minY, Math.max(minY, maxY));

//         // Optional: snap horizontally to nearest edge if close
//         const snapEdgeThreshold = 24;
//         let snapX = targetX;
//         if (Math.abs(targetX - minX) < snapEdgeThreshold) snapX = minX;
//         if (Math.abs(targetX - Math.max(0, maxX)) < snapEdgeThreshold)
//           snapX = Math.max(0, maxX);

//         Animated.spring(pan, {
//           toValue: { x: snapX, y: targetY },
//           useNativeDriver: false,
//           friction: 7,
//           tension: 80,
//         }).start();
//       },
//     })
//   ).current;

//   // Don' show if user has stopped audio
//   if ((basePlayer as any).__stoppedByUser) return null;
//   // Hide the mini player on the podcast screen itself
//   if (pathname?.includes("indexPodcast")) return null;
//   if (!player.__currentUri && !player.__currentKey) return null;

//   const onToggle = () => {
//     if (isPlaying) player.pause();
//     else player.play();
//   };

//   const onStop = async () => {
//     try {
//       // ✅ keep the loaded source; just reset and hide Mini
//       await (player as any).stopAndKeepSource?.();
//     } catch {}
//   };

//   // Keep this: Mini should be hidden when user explicitly stopped
//   if ((basePlayer as any).__stoppedByUser) return null;

//   // Keep this: Mini only shows when something is/was loaded
//   if (!player.__currentUri && !player.__currentKey) return null;

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

//   const isDark = colorScheme === "dark";

//   // Collapsed: draggable sphere
//   if (isCollapsed) {
//     return (
//       <Animated.View
//         onLayout={onMeasure} // NEW: measure collapsed size too
//         style={[
//           styles.collapsedWrap,
//           {
//             transform: [{ translateX: pan.x }, { translateY: pan.y }],
//           },
//         ]}
//         {...panResponder.panHandlers} // stays draggable when collapsed
//       >
//         <TouchableOpacity
//           style={styles.collapsedButton}
//           onPress={() => setIsCollapsed(false)}
//           activeOpacity={0.9}
//         >
//           <BlurView
//             intensity={isDark ? 60 : 70}
//             tint={isDark ? "dark" : "light"}
//             style={styles.collapsedBlur}
//           >
//             <LinearGradient
//               colors={
//                 isDark
//                   ? ["rgba(15,20,46,0.7)", "rgba(15,20,46,0.6)"]
//                   : ["rgba(255,255,255,0.8)", "rgba(255,255,255,0.7)"]
//               }
//               style={styles.collapsedGradient}
//             />
//             {/* <View style={styles.collapsedContent}>
//               <Image
//                 source={{ uri: player.__artwork }}
//                 style={styles.collapsedArtwork}
//                 contentFit="cover"
//               />
//               {isPlaying && (
//                 <View
//                   style={[
//                     styles.collapsedPlayingDot,
//                     {
//                       width: `${progressPct * 100}%`,
//                       height: `${progressPct * 100}%`,
//                     },
//                   ]}
//                 />
//               )}
//               <Ionicons
//                 name="chevron-up"
//                 size={16}
//                 color={isDark ? "#fff" : "#1a1a2e"}
//                 style={styles.expandIcon}
//               />
//             </View> */}
//             <View style={[styles.collapsedContent, {}]}>
//               <View style={[styles.artworkWrap, {}]}>
//                 <Image
//                   source={{ uri: player.__artwork }}
//                   style={styles.collapsedArtwork}
//                   contentFit="cover"
//                 />
//                 {isPlaying && (
//                   <View style={styles.ringOverlay}>
//                     <CircularProgressRing
//                       size={COLLAPSED_SIZE}
//                       progress={progressPct} // 0..1
//                       strokeWidth={5}
//                       color="black"
//                       trackColor={
//                         isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.12)"
//                       }
//                     />
//                   </View>
//                 )}
//               </View>

//               <Ionicons
//                 name="chevron-up"
//                 size={16}
//                 color={Colors[colorScheme].defaultIcon}
//                 style={styles.expandIcon}
//               />
//             </View>
//           </BlurView>
//         </TouchableOpacity>
//       </Animated.View>
//     );
//   }

//   // Full view: now the WHOLE card is draggable (not just the handle)
//   return (
//     <Animated.View
//       onLayout={onMeasure} // NEW: measure full size for correct clamping
//       style={[
//         styles.wrap,
//         {
//           transform: [{ translateX: pan.x }, { translateY: pan.y }],
//         },
//       ]}
//       {...panResponder.panHandlers} // NEW: make entire full-size draggable
//     >
//       {/* Drag Handle (kept as visual affordance, but not required anymore) */}
//       <View style={styles.dragHandle}>
//         <View style={styles.dragIndicator} />
//       </View>

//       <BlurView
//         intensity={isDark ? 60 : 70}
//         tint={isDark ? "dark" : "light"}
//         style={styles.blurContainer}
//       >
//         <LinearGradient
//           colors={
//             isDark
//               ? ["rgba(15,20,46,0.6)", "rgba(15,20,46,0.5)"]
//               : ["rgba(255,255,255,0.7)", "rgba(255,255,255,0.6)"]
//           }
//           style={styles.gradientBg}
//         />

//         {/* Collapse Button */}
//         <TouchableOpacity
//           style={[styles.collapseButton, {}]}
//           onPress={() => setIsCollapsed(true)}
//         >
//           <Ionicons
//             name="chevron-down"
//             size={22}
//             color={Colors[colorScheme].defaultIcon}
//             style={{}}
//           />
//         </TouchableOpacity>

//         <View style={styles.content}>
//           {/* Main Content Row */}
//           <View style={styles.mainRow}>
//             <TouchableOpacity
//               style={styles.leftSection}
//               activeOpacity={0.9}
//               onPress={openFull}
//             >
//               {/* Artwork */}
//               <View style={styles.artworkContainer}>
//                 <Image
//                   source={{ uri: player.__artwork }}
//                   style={styles.artwork}
//                   contentFit="cover"
//                 />
//                 {isPlaying && (
//                   <View style={styles.playingIndicator}>
//                     <View style={styles.bar} />
//                     <View style={[styles.bar, styles.bar2]} />
//                     <View style={styles.bar} />
//                   </View>
//                 )}
//               </View>

//               <View style={styles.textContainer}>
//                 <Text
//                   numberOfLines={1}
//                   style={[styles.title, { color: isDark ? "#fff" : "#1a1a2e" }]}
//                 >
//                   {player.__title ?? "Now Playing"}
//                 </Text>
//                 <Text
//                   numberOfLines={1}
//                   style={[
//                     styles.time,
//                     {
//                       color: isDark
//                         ? "rgba(255,255,255,0.6)"
//                         : "rgba(0,0,0,0.5)",
//                     },
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
//                     isPlaying ? ["#FF6B6B", "#EE5A6F"] : ["#667eea", "#764ba2"]
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
//               <View
//                 style={[
//                   styles.progressFill,
//                   {
//                     width: `${progressPct * 100}%`,
//                   },
//                 ]}
//               >
//                 <LinearGradient
//                   colors={["#667eea", "#764ba2"]}
//                   style={styles.progressGradient}
//                   start={{ x: 0, y: 0 }}
//                   end={{ x: 1, y: 0 }}
//                 />
//               </View>
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
//     overflow: "visible",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 12 },
//     shadowOpacity: 0.25,
//     shadowRadius: 25,
//     elevation: 15,
//   },
//   dragHandle: {
//     position: "absolute",
//     top: -20,
//     left: 0,
//     right: 0,
//     height: 30,
//     alignItems: "center",
//     justifyContent: "center",
//     zIndex: 10,
//   },
//   dragIndicator: {
//     width: 40,
//     height: 4,
//     borderRadius: 2,
//     backgroundColor: "rgba(128,128,128,0.5)",
//   },
//   collapseButton: {
//     position: "absolute",
//     top: 1,
//     right: 8,
//     zIndex: 10,
//     padding: 4,
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
//     paddingVertical: 25,
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
//   artworkContainer: { position: "relative" },
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
//   bar: { width: 2, height: 10, backgroundColor: "#fff", borderRadius: 1 },
//   bar2: { height: 14 },
//   textContainer: { flex: 1, marginLeft: 12 },
//   title: { fontSize: 15, fontWeight: "600", marginBottom: 2 },
//   time: { fontSize: 12, fontWeight: "500" },
//   controls: { flexDirection: "row", alignItems: "center", gap: 8 },
//   iconBtn: { padding: 2 },
//   iconBg: {
//     width: 32,
//     height: 32,
//     borderRadius: 10,
//     backgroundColor: "rgba(0,0,0,0.05)",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   iconBgDark: { backgroundColor: "rgba(255,255,255,0.1)" },
//   playBtn: { marginHorizontal: 4 },
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
//   progressContainer: { marginTop: 10 },
//   progressTrack: { height: 4, borderRadius: 2, overflow: "hidden" },
//   progressFill: { height: "100%", borderRadius: 2, overflow: "hidden" },
//   progressGradient: { flex: 1 },

//   // Collapsed sphere
//   collapsedWrap: {
//     position: "absolute",
//     width: 60,
//     height: 60,
//     left: 16, // keep same left base so clamping logic matches
//   },
//   collapsedButton: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     overflow: "hidden",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 10,
//   },
//   collapsedBlur: { flex: 1, borderRadius: 30 },
//   collapsedGradient: { ...StyleSheet.absoluteFillObject },
//   collapsedContent: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   collapsedArtwork: {
//     width: "100%",
//     height: "100%",
//     borderRadius: COLLAPSED_SIZE / 2,
//   },

//   artworkWrap: {
//     width: COLLAPSED_SIZE,
//     height: COLLAPSED_SIZE,
//   },

//   ringOverlay: {
//     ...StyleSheet.absoluteFillObject,
//   },
//   expandIcon: { position: "absolute", top: 4, opacity: 0.7 },
// });

// // /components/MiniPlayerBar.tsx

// //! works but no collasable
// import React from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   useColorScheme,
// } from "react-native";
// import { BlurView } from "expo-blur";
// import { LinearGradient } from "expo-linear-gradient";
// import { Ionicons } from "@expo/vector-icons";
// import { useGlobalPlayer } from "@/player/useGlobalPlayer";

// export default function MiniPlayerBar() {
//   const scheme = useColorScheme() || "light";
//   const {
//     isPlaying,
//     position,
//     duration,
//     title,
//     currentKey,
//     currentUri,
//     stoppedByUser,
//     toggle,
//     seekBy,
//     stopAndKeepSource,
//   } = useGlobalPlayer();

//   // Show only when something is/was loaded and user didn’t explicitly stop
//   if (stoppedByUser) return null;
//   if (!currentUri && !currentKey) return null;

//   const fmt = (s?: number) => {
//     if (!s || s < 0 || isNaN(s)) return "0:00";
//     const SS = Math.floor(s);
//     const m = Math.floor(SS / 60);
//     const sec = String(SS % 60).padStart(2, "0");
//     return `${m}:${sec}`;
//   };

//   const progress =
//     duration > 0 ? Math.min(1, Math.max(0, (position || 0) / duration)) : 0;

//   return (
//     <View style={styles.wrap} pointerEvents="box-none">
//       <BlurView
//         intensity={scheme === "dark" ? 60 : 70}
//         tint={scheme === "dark" ? "dark" : "light"}
//         style={styles.blur}
//       >
//         <LinearGradient
//           colors={
//             scheme === "dark"
//               ? ["rgba(0,0,0,0.3)", "transparent"]
//               : ["rgba(255,255,255,0.4)", "transparent"]
//           }
//           style={StyleSheet.absoluteFillObject as any}
//         />
//         <View style={styles.row}>
//           <View style={styles.left}>
//             <View style={styles.artwork} />
//             <View style={{ marginLeft: 10, flex: 1 }}>
//               <Text numberOfLines={1} style={styles.title}>
//                 {title ?? "Now Playing"}
//               </Text>
//               <Text numberOfLines={1} style={styles.time}>
//                 {fmt(position)} / {fmt(duration)}
//               </Text>
//             </View>
//           </View>
//           <View style={styles.ctrls}>
//             <TouchableOpacity onPress={() => seekBy(-15)} style={styles.icon}>
//               <Ionicons name="play-skip-back" size={20} />
//             </TouchableOpacity>
//             <TouchableOpacity onPress={toggle} style={styles.play}>
//               <Ionicons
//                 name={isPlaying ? "pause" : "play"}
//                 size={22}
//                 color="#fff"
//               />
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => seekBy(15)} style={styles.icon}>
//               <Ionicons name="play-skip-forward" size={20} />
//             </TouchableOpacity>
//             <TouchableOpacity onPress={stopAndKeepSource} style={styles.icon}>
//               <Ionicons name="close" size={20} color="#ff6b6b" />
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* tiny progress bar */}
//         <View style={styles.progressTrack}>
//           <View
//             style={[styles.progressFill, { width: `${progress * 100}%` }]}
//           />
//         </View>
//       </BlurView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   wrap: {
//     position: "absolute",
//     left: 16,
//     right: 16,
//     bottom: 28,
//     borderRadius: 18,
//     overflow: "hidden",
//   },
//   blur: { borderRadius: 18, overflow: "hidden" },
//   row: { flexDirection: "row", alignItems: "center", padding: 12, gap: 8 },
//   left: { flexDirection: "row", alignItems: "center", flex: 1 },
//   artwork: {
//     width: 40,
//     height: 40,
//     borderRadius: 10,
//     backgroundColor: "rgba(0,0,0,0.15)",
//   },
//   title: { fontSize: 14, fontWeight: "700" },
//   time: { fontSize: 12, opacity: 0.65, marginTop: 2 },
//   ctrls: { flexDirection: "row", alignItems: "center", gap: 6 },
//   icon: { padding: 8, borderRadius: 10, backgroundColor: "rgba(0,0,0,0.06)" },
//   play: { padding: 10, borderRadius: 999, backgroundColor: "#667eea" },
//   progressTrack: { height: 3, backgroundColor: "rgba(0,0,0,0.12)" },
//   progressFill: { height: "100%", backgroundColor: "#667eea" },
// });

// /components/MiniPlayerBar.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Dimensions,
  PanResponder,
  Animated,
  LayoutChangeEvent,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Colors } from "@/constants/Colors";
import { useGlobalPlayer } from "@/player/useGlobalPlayer";
import { CircularProgressRing } from "./CircularProgressRing";

type Props = {
  bottomOffset?: number; // initial placement above bottom
};

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");
const COLLAPSED_SIZE = 60;
const LEFT_MARGIN = 16;
const RIGHT_MARGIN = 16;
const PADDING = 10;

const readVal = (v: any) =>
  typeof v?.__getValue === "function" ? v.__getValue() : v?._value ?? 0;

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

export default function MiniPlayerBar({ bottomOffset = 50 }: Props) {
  const colorScheme = useColorScheme() || "light";
  const insets = useSafeAreaInsets();
  const pathname = usePathname();

  // Global player state/actions (from your Zustand store)
  const {
    isPlaying,
    position,
    duration,
    title,
    artwork,
    currentKey,
    currentUri,
    podcastId,
    filename,
    stoppedByUser,
    toggle,
    seekBy,
    stopAndKeepSource,
  } = useGlobalPlayer();

  // ---- Hooks must be declared before any early return
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [measured, setMeasured] = React.useState({ w: SCREEN_W - 32, h: 100 });

  const pan = React.useRef(
    new Animated.ValueXY({
      x: 0,
      y: SCREEN_H - bottomOffset - 100, // initial guess; parked/clamped after we know size/insets
    })
  ).current;

  const onMeasure = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setMeasured({ w: width, h: height });
  };

  // Compute draggable bounds based on state & safe-area
  const bounds = React.useMemo(() => {
    const w = isCollapsed ? COLLAPSED_SIZE : measured.w;
    const h = isCollapsed ? COLLAPSED_SIZE : measured.h;

    const minX = -LEFT_MARGIN; // wrapper has left:16
    const maxX = SCREEN_W - w - LEFT_MARGIN - RIGHT_MARGIN;

    const minY = insets.top + PADDING;
    const maxY = SCREEN_H - insets.bottom - h - PADDING;

    return {
      minX,
      maxX: Math.max(minX, maxX),
      minY,
      maxY: Math.max(minY, maxY),
    };
  }, [isCollapsed, measured.w, measured.h, insets.top, insets.bottom]);

  // Park near bottom once we know sizes/insets
  const parkedRef = React.useRef(false);
  React.useEffect(() => {
    if (parkedRef.current) return;
    if (!measured.h) return;
    const targetY = clamp(
      SCREEN_H - insets.bottom - measured.h - bottomOffset,
      bounds.minY,
      bounds.maxY
    );
    pan.setValue({ x: 0, y: targetY });
    parkedRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [measured.h, insets.bottom, bounds.minY, bounds.maxY, bottomOffset]);

  // Draggable in both states; small threshold so taps don't get stolen
  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_e, g) =>
        Math.abs(g.dx) + Math.abs(g.dy) > 4,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponderCapture: (_e, g) =>
        Math.abs(g.dx) + Math.abs(g.dy) > 4,
      onPanResponderGrant: () => {
        pan.setOffset({ x: readVal(pan.x), y: readVal(pan.y) });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        pan.flattenOffset();
        const curX = readVal(pan.x);
        const curY = readVal(pan.y);
        const targetX = clamp(curX, bounds.minX, bounds.maxX);
        const targetY = clamp(curY, bounds.minY, bounds.maxY);

        // Optional: snap to nearest horizontal edge if close
        const thresh = 24;
        let snapX = targetX;
        if (Math.abs(targetX - bounds.minX) < thresh) snapX = bounds.minX;
        if (Math.abs(targetX - bounds.maxX) < thresh) snapX = bounds.maxX;

        Animated.spring(pan, {
          toValue: { x: snapX, y: targetY },
          useNativeDriver: false,
          friction: 7,
          tension: 80,
        }).start();
      },
    })
  ).current;

  // Re-clamp when state/metrics change
  React.useEffect(() => {
    const curX = readVal(pan.x);
    const curY = readVal(pan.y);
    const nx = clamp(curX, bounds.minX, bounds.maxX);
    const ny = clamp(curY, bounds.minY, bounds.maxY);
    if (nx !== curX || ny !== curY) {
      Animated.spring(pan, {
        toValue: { x: nx, y: ny },
        useNativeDriver: false,
      }).start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCollapsed, bounds.minX, bounds.maxX, bounds.minY, bounds.maxY]);

  // ---- Visibility (AFTER hooks)
  const hidden =
    stoppedByUser ||
    (!currentUri && !currentKey) ||
    (pathname?.includes("indexPodcast") ?? false); // hide on full podcast page
  if (hidden) return null;

  const isDark = colorScheme === "dark";

  const progressPct =
    duration && duration > 0
      ? Math.max(0, Math.min(1, (position || 0) / duration))
      : 0;

  const formatTime = (sec?: number | null) => {
    const s = Math.max(0, Math.floor(sec || 0));
    const m = Math.floor(s / 60);
    const ss = s % 60;
    return `${m}:${ss.toString().padStart(2, "0")}`;
  };

  const openFull = () => {
    router.push({
      pathname: "/(podcast)/indexPodcast",
      params: {
        podcast: JSON.stringify({
          id: podcastId,
          title: title,
          filename,
          currentUri,
        }),
      },
    });
  };

  // ---------------- Collapsed (draggable sphere with image + ring)
  if (isCollapsed) {
    return (
      <Animated.View
        onLayout={onMeasure}
        style={[
          styles.collapsedWrap,
          { transform: [{ translateX: pan.x }, { translateY: pan.y }] },
        ]}
        {...panResponder.panHandlers}
        pointerEvents="box-none"
      >
        <TouchableOpacity
          style={styles.collapsedButton}
          onPress={() => setIsCollapsed(false)}
          activeOpacity={0.9}
        >
          <BlurView
            intensity={isDark ? 60 : 70}
            tint={isDark ? "dark" : "light"}
            style={styles.collapsedBlur}
          >
            <LinearGradient
              colors={
                isDark
                  ? ["rgba(15,20,46,0.7)", "rgba(15,20,46,0.6)"]
                  : ["rgba(255,255,255,0.8)", "rgba(255,255,255,0.7)"]
              }
              style={styles.collapsedGradient}
            />
            <View style={styles.collapsedContent}>
              <View style={styles.artworkWrap}>
                <Image
                  source={require("@/assets/images/logo.png")}
                  style={styles.collapsedArtwork}
                  contentFit="cover"
                />
                {isPlaying && (
                  <View style={styles.ringOverlay}>
                    <CircularProgressRing
                      size={COLLAPSED_SIZE}
                      progress={progressPct}
                      strokeWidth={5}
                      color="#6366f1"
                      trackColor={
                        isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.12)"
                      }
                    />
                  </View>
                )}
              </View>
            </View>
          </BlurView>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  // ---------------- Expanded (card style with image + current time)
  return (
    <Animated.View
      onLayout={onMeasure}
      style={[
        styles.wrap,
        { transform: [{ translateX: pan.x }, { translateY: pan.y }] },
      ]}
      {...panResponder.panHandlers}
      pointerEvents="box-none"
    >
      {/* drag handle */}
      <View style={styles.dragHandle}>
        <View style={styles.dragIndicator} />
      </View>

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

        {/* Collapse */}
        <TouchableOpacity
          style={styles.collapseButton}
          onPress={() => setIsCollapsed(true)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name="chevron-down"
            size={22}
            color={Colors[colorScheme].defaultIcon}
          />
        </TouchableOpacity>

        <View style={styles.content}>
          <View style={styles.mainRow}>
            <TouchableOpacity
              style={styles.leftSection}
              activeOpacity={0.9}
              onPress={openFull}
            >
              {/* Artwork */}
              <View style={styles.artworkContainer}>
                <Image
                  source={require("@/assets/images/logo.png")}
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
                  style={[styles.title, { color: isDark ? "#fff" : "#1a1a2e" }]}
                >
                  {title ?? "Now Playing"}
                </Text>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.time,
                    {
                      color: isDark
                        ? "rgba(255,255,255,0.6)"
                        : "rgba(0,0,0,0.5)",
                    },
                  ]}
                >
                  {formatTime(position)} / {formatTime(duration)}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Controls */}
            <View style={styles.controls}>
              <TouchableOpacity
                onPress={() => seekBy(-15)}
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
                onPress={toggle}
                style={styles.playBtn}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={
                    isPlaying ? ["#FF6B6B", "#EE5A6F"] : ["#667eea", "#764ba2"]
                  }
                  style={styles.playBtnGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons
                    name={isPlaying ? "pause" : "play"}
                    size={24}
                    color="#fff"
                    style={!isPlaying ? { marginLeft: 2 } : undefined}
                  />
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => seekBy(15)}
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
                onPress={() => {
                  // Stop playback
                  stopAndKeepSource();
                  // Disable global auto-advance until a new Quran session starts
                  useGlobalPlayer.setState({
                    _quranNext: undefined,
                    _quranPrev: undefined,
                  } as any);
                  // Optional: hide the bar (you already use this flag in `hidden`)
                  useGlobalPlayer.setState({ stoppedByUser: true });
                }}
                style={styles.iconBtn}
                hitSlop={10}
              >
                <View style={styles.stopBtn}>
                  <Ionicons name="close" size={18} color="#FF6B6B" />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Progress bar */}
          <View style={styles.progressContainer}>
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
                  { width: `${progressPct * 100}%` },
                ]}
              >
                <LinearGradient
                  colors={["#667eea", "#764ba2"]}
                  style={styles.progressGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
              </View>
            </View>
          </View>
        </View>
      </BlurView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  // expanded
  wrap: {
    position: "absolute",
    left: 16,
    right: 16,
    borderRadius: 20,
    overflow: "visible",
    zIndex: 999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 15,
  },
  dragHandle: {
    position: "absolute",
    top: -20,
    left: 0,
    right: 0,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  dragIndicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(128,128,128,0.5)",
  },
  blurContainer: {
    borderRadius: 20,
    overflow: "hidden",
  },
  gradientBg: { ...StyleSheet.absoluteFillObject },
  content: { paddingHorizontal: 16, paddingVertical: 25 },
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
  artworkContainer: { position: "relative" },
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
  bar: { width: 2, height: 10, backgroundColor: "#fff", borderRadius: 1 },
  bar2: { height: 14 },
  textContainer: { flex: 1, marginLeft: 12 },
  title: { fontSize: 15, fontWeight: "600", marginBottom: 2 },
  time: { fontSize: 12, fontWeight: "500" },
  controls: { flexDirection: "row", alignItems: "center", gap: 8 },
  iconBtn: { padding: 2 },
  iconBg: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  iconBgDark: { backgroundColor: "rgba(255,255,255,0.1)" },
  playBtn: { marginHorizontal: 4 },
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
  collapseButton: {
    position: "absolute",
    top: 2,
    right: 9,
    zIndex: 10,
    padding: 4,
  },
  progressContainer: { marginTop: 10 },
  progressTrack: { height: 4, borderRadius: 2, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 2, overflow: "hidden" },
  progressGradient: { flex: 1 },

  // collapsed sphere
  collapsedWrap: {
    position: "absolute",
    width: COLLAPSED_SIZE,
    height: COLLAPSED_SIZE,
    left: 16,
    borderRadius: COLLAPSED_SIZE / 2,
    overflow: "visible",
    zIndex: 999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 12,
  },
  collapsedButton: {
    width: COLLAPSED_SIZE,
    height: COLLAPSED_SIZE,
    borderRadius: COLLAPSED_SIZE / 2,
    overflow: "hidden",
  },
  collapsedBlur: {
    flex: 1,
    borderRadius: COLLAPSED_SIZE / 2,
    overflow: "hidden",
  },
  collapsedGradient: { ...StyleSheet.absoluteFillObject },
  collapsedContent: { flex: 1, alignItems: "center", justifyContent: "center" },
  collapsedArtwork: {
    width: "100%",
    height: "100%",
    borderRadius: COLLAPSED_SIZE / 2,
    backgroundColor: "#e0e0e0",
  },
  artworkWrap: { width: COLLAPSED_SIZE, height: COLLAPSED_SIZE },
  ringOverlay: { ...StyleSheet.absoluteFillObject },
  expandIcon: { position: "absolute", top: 4, opacity: 0.7 },
});
