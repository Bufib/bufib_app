// // //! Funktioniert ohne drag und ohne collapse
// // import React, { useMemo, useRef, useState } from "react";
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   TouchableOpacity,
// //   useColorScheme,
// //   Dimensions,
// //   Platform,
// //   PanResponder,
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
// //   bottomOffset = 50,
// // }: Props) {
// //   const player = basePlayer as TaggedPlayer;
// //   const insets = useSafeAreaInsets();
// //   const scheme = useColorScheme() || "light";
// //   const pathname = usePathname();

// //   // State for slider interaction
// //   const [isDragging, setIsDragging] = useState(false);
// //   const [sliderWidth, setSliderWidth] = useState(0);
// //   const [dragProgress, setDragProgress] = useState(0);

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

// //   // Use drag progress when dragging, otherwise use actual progress
// //   const displayProgress = isDragging ? dragProgress : progressPct;

// //   // PanResponder for slider dragging
// //   const panResponder = useRef(
// //     PanResponder.create({
// //       onStartShouldSetPanResponder: () => true,
// //       onMoveShouldSetPanResponder: () => true,
// //       onPanResponderGrant: (evt) => {
// //         setIsDragging(true);

// //         // Immediately seek to tap position
// //         if (sliderWidth > 0 && duration > 0) {
// //           const touchX = evt.nativeEvent.locationX;
// //           const newProgress = Math.max(0, Math.min(1, touchX / sliderWidth));
// //           setDragProgress(newProgress);
// //           const newTime = newProgress * duration;
// //           player.currentTime = newTime;
// //         }
// //       },
// //       onPanResponderMove: (evt) => {
// //         if (sliderWidth > 0 && duration > 0) {
// //           const touchX = evt.nativeEvent.locationX;
// //           const newProgress = Math.max(0, Math.min(1, touchX / sliderWidth));
// //           setDragProgress(newProgress);
// //         }
// //       },
// //       onPanResponderRelease: (evt) => {
// //         setIsDragging(false);

// //         // Final seek position
// //         if (sliderWidth > 0 && duration > 0) {
// //           const touchX = evt.nativeEvent.locationX;
// //           const newProgress = Math.max(0, Math.min(1, touchX / sliderWidth));
// //           const newTime = newProgress * duration;
// //           player.currentTime = newTime;
// //         }
// //       },
// //     })
// //   ).current;

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
// //     <View
// //       style={[
// //         styles.wrap,
// //         {
// //           bottom: bottomOffset, // Position above navbar
// //         },
// //       ]}
// //     >
// //       <BlurView
// //         intensity={isDark ? 60 : 70}
// //         tint={isDark ? "dark" : "light"}
// //         style={styles.blurContainer}
// //       >
// //         <LinearGradient
// //           colors={
// //             isDark
// //               ? ["rgba(15,20,46,0.6)", "rgba(15,20,46,0.5)"]
// //               : ["rgba(255,255,255,0.7)", "rgba(255,255,255,0.6)"]
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
// //               {/* Artwork */}
// //               <View style={styles.artworkContainer}>
// //                 <Image
// //                   source={{ uri: player.__artwork }}
// //                   style={styles.artwork}
// //                   contentFit="cover"
// //                 />
// //                 {isPlaying && (
// //                   <View style={styles.playingIndicator}>
// //                     <View style={styles.bar} />
// //                     <View style={[styles.bar, styles.bar2]} />
// //                     <View style={styles.bar} />
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

// //           {/* Progress Bar - Interactive */}
// //           <View
// //             style={styles.progressContainer}
// //             onLayout={(event) => {
// //               setSliderWidth(event.nativeEvent.layout.width);
// //             }}
// //             {...panResponder.panHandlers}
// //           >
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
// //               <View
// //                 style={[
// //                   styles.progressFill,
// //                   {
// //                     width: `${displayProgress * 100}%`,
// //                   },
// //                 ]}
// //               >
// //                 <LinearGradient
// //                   colors={
// //                     isDragging ? ["#8B5CF6", "#A855F7"] : ["#667eea", "#764ba2"]
// //                   }
// //                   style={styles.progressGradient}
// //                   start={{ x: 0, y: 0 }}
// //                   end={{ x: 1, y: 0 }}
// //                 />
// //               </View>
// //               <View
// //                 style={[
// //                   styles.progressDot,
// //                   {
// //                     left: `${displayProgress * 100}%`,
// //                     backgroundColor: isDragging ? "#A855F7" : "#764ba2",
// //                     transform: isDragging ? [{ scale: 1.5 }] : [{ scale: 1 }],
// //                   },
// //                 ]}
// //               />
// //             </View>
// //           </View>
// //         </View>
// //       </BlurView>
// //     </View>
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
// //     shadowOffset: { width: 0, height: 12 },
// //     shadowOpacity: 0.25,
// //     shadowRadius: 25,
// //     elevation: 15,
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
// //     justifyContent: "center",
// //     backgroundColor: "rgba(0,0,0,0.7)",
// //     padding: 4,
// //     borderRadius: 4,
// //     gap: 2,
// //     height: 16,
// //   },
// //   bar: {
// //     width: 2,
// //     height: 10,
// //     backgroundColor: "#fff",
// //     borderRadius: 1,
// //   },
// //   bar2: {
// //     height: 14,
// //   },
// //   progressDot: {},
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
// //     overflow: "hidden",
// //   },
// //   progressFill: {
// //     height: "100%",
// //     borderRadius: 2,
// //     overflow: "hidden",
// //   },
// //   progressGradient: {
// //     flex: 1,
// //   },
// // });

// //! Mit drag aber nur wenn kugel

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
//   bottomOffset?: number; // Initial position above navbar
// };

// const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// export default function MiniPlayerBar({ onOpenFull, bottomOffset = 50 }: Props) {
//   const player = basePlayer as TaggedPlayer;
//   const insets = useSafeAreaInsets();
//   const scheme = useColorScheme() || "light";
//   const pathname = usePathname();

//   // State for collapse/expand
//   const [isCollapsed, setIsCollapsed] = useState(false);

//   // Position state for dragging
//   const pan = useRef(new Animated.ValueXY({
//     x: 0,
//     y: screenHeight - bottomOffset - 100 // Initial Y position
//   })).current;

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

//   // PanResponder for dragging the entire player
//   const panResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => true,
//       onMoveShouldSetPanResponder: () => true,
//       onPanResponderGrant: () => {
//         // Store current position
//         pan.setOffset({
//           x: (pan.x as any)._value,
//           y: (pan.y as any)._value,
//         });
//         pan.setValue({ x: 0, y: 0 });
//       },
//       onPanResponderMove: Animated.event(
//         [null, { dx: pan.x, dy: pan.y }],
//         { useNativeDriver: false }
//       ),
//       onPanResponderRelease: () => {
//         // Flatten the offset to save the position
//         pan.flattenOffset();

//         // Optional: Add bounds checking to keep player on screen
//         const currentX = (pan.x as any)._value;
//         const currentY = (pan.y as any)._value;

//         // Constrain to screen bounds
//         const padding = 10;
//         const maxX = screenWidth - 32 - padding; // accounting for margins
//         const maxY = screenHeight - 150; // accounting for player height
//         const minX = -screenWidth + 48 + padding;
//         const minY = insets.top + padding;

//         if (currentX > maxX || currentX < minX || currentY > maxY || currentY < minY) {
//           Animated.spring(pan, {
//             toValue: {
//               x: Math.max(minX, Math.min(maxX, currentX)),
//               y: Math.max(minY, Math.min(maxY, currentY)),
//             },
//             useNativeDriver: false,
//           }).start();
//         }
//       },
//     })
//   ).current;

//   // Hide the mini player in the podcast screen itself
//   if (pathname?.includes("indexPodcast")) return null;
//   if (!player.__currentUri && !player.__currentKey) return null;

//   const onToggle = () => {
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

//   // Collapsed view - just a floating button
//   if (isCollapsed) {
//     return (
//       <Animated.View
//         style={[
//           styles.collapsedWrap,
//           {
//             transform: [
//               { translateX: pan.x },
//               { translateY: pan.y },
//             ],
//           },
//         ]}
//         {...panResponder.panHandlers}
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
//             <View style={styles.collapsedContent}>
//               <Image
//                 source={{ uri: player.__artwork }}
//                 style={styles.collapsedArtwork}
//                 contentFit="cover"
//               />
//               {isPlaying && (
//                 <View style={styles.collapsedPlayingDot} />
//               )}
//               <Ionicons
//                 name="chevron-up"
//                 size={16}
//                 color={isDark ? "#fff" : "#1a1a2e"}
//                 style={styles.expandIcon}
//               />
//             </View>
//           </BlurView>
//         </TouchableOpacity>
//       </Animated.View>
//     );
//   }

//   // Full view
//   return (
//     <Animated.View
//       style={[
//         styles.wrap,
//         {
//           transform: [
//             { translateX: pan.x },
//             { translateY: pan.y },
//           ],
//         },
//       ]}
//     >
//       {/* Drag Handle */}
//       <View style={styles.dragHandle} {...panResponder.panHandlers}>
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
//           style={styles.collapseButton}
//           onPress={() => setIsCollapsed(true)}
//           hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//         >
//           <Ionicons
//             name="chevron-down"
//             size={20}
//             color={isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)"}
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

//           {/* Progress Bar - Non-interactive */}
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
//     overflow: "visible", // Changed to visible for drag handle
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
//     top: 8,
//     right: 12,
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
//   bar2: {
//     height: 14,
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
//     overflow: "hidden",
//   },
//   progressFill: {
//     height: "100%",
//     borderRadius: 2,
//     overflow: "hidden",
//   },
//   progressGradient: {
//     flex: 1,
//   },
//   // Collapsed state styles
//   collapsedWrap: {
//     position: "absolute",
//     width: 60,
//     height: 60,
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
//   collapsedBlur: {
//     flex: 1,
//     borderRadius: 30,
//   },
//   collapsedGradient: {
//     ...StyleSheet.absoluteFillObject,
//   },
//   collapsedContent: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   collapsedArtwork: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//   },
//   collapsedPlayingDot: {
//     position: "absolute",
//     bottom: 8,
//     right: 8,
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: "#4ade80",
//   },
//   expandIcon: {
//     position: "absolute",
//     top: 4,
//     opacity: 0.7,
//   },
// });

// //! Kann überall hin bewegft werden aber bounced zu links
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
//   bottomOffset?: number; // Initial position above navbar
// };

// const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// // Helper to read current animated value
// const readVal = (v: any) =>
//   typeof v?.__getValue === "function" ? v.__getValue() : v?._value ?? 0;

// // Clamp helper
// const clamp = (n: number, min: number, max: number) =>
//   Math.max(min, Math.min(max, n));

// export default function MiniPlayerBar({
//   onOpenFull,
//   bottomOffset = 50,
// }: Props) {
//   const player = basePlayer as TaggedPlayer;
//   const insets = useSafeAreaInsets();
//   const scheme = useColorScheme() || "light";
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

//   // Hide the mini player on the podcast screen itself
//   if (pathname?.includes("indexPodcast")) return null;
//   if (!player.__currentUri && !player.__currentKey) return null;

//   const onToggle = () => {
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
//             <View style={styles.collapsedContent}>
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
//           style={styles.collapseButton}
//           onPress={() => setIsCollapsed(true)}
//           hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//         >
//           <Ionicons
//             name="chevron-down"
//             size={20}
//             color={isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)"}
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
//     top: 8,
//     right: 12,
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
//   iconBtn: { padding: 4 },
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
//   collapsedContent: { flex: 1, alignItems: "center", justifyContent: "center" },
//   collapsedArtwork: { width: 40, height: 40, borderRadius: 20 },
//   collapsedPlayingDot: {
//     position: "absolute",
//     bottom: 8,
//     right: 8,
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: "#4ade80",
//   },
//   expandIcon: { position: "absolute", top: 4, opacity: 0.7 },
// });

//! Kann überall hin bewegft werden aber bounced zu links mit anzeige des fortschrits
import React, { useMemo, useRef, useState } from "react";
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
import { useEvent } from "expo";
import { router, usePathname } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { CircularProgressRing } from "./CircularProgressRing";
import { globalPlayer as basePlayer } from "@/components/GlobalVideoHost";
import { Colors } from "@/constants/Colors";

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
  bottomOffset?: number; // Initial position above navbar
};

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Helper to read current animated value
const readVal = (v: any) =>
  typeof v?.__getValue === "function" ? v.__getValue() : v?._value ?? 0;

// Clamp helper
const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

const COLLAPSED_SIZE = 55; // ensure artwork is square for a perfect ring

export default function MiniPlayerBar({
  onOpenFull,
  bottomOffset = 50,
}: Props) {
  const player = basePlayer as TaggedPlayer;
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() || "light";
  const pathname = usePathname();
  // Collapse/expand
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Track measured size so we can clamp properly in both states
  const [measured, setMeasured] = useState({ w: screenWidth - 32, h: 100 }); // NEW
  const onMeasure = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setMeasured({ w: width, h: height });
  };

  // Position (shared for both states)
  const pan = useRef(
    new Animated.ValueXY({
      x: 0,
      y: screenHeight - bottomOffset - 100, // initial guess; corrected by clamp on first release
    })
  ).current;

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

  // Compute bounds dynamically from measurement + insets
  const padding = 10;
  const leftMargin = 16; // your wrapper uses left:16
  // Horizontal:
  // The wrapper has left:16; translateX = 0 means left is 16.
  // We allow moving left until left hits 0 => minX = -leftMargin
  // We allow moving right until right hits 16 => maxX = (screenWidth - measured.w - 16) - leftMargin
  const maxX = screenWidth - measured.w - leftMargin - 16; // space to right edge
  const minX = -leftMargin;

  // Vertical:
  const minY = insets.top + padding;
  const maxY = screenHeight - insets.bottom - measured.h - padding;

  // Pan responder that doesn’t steal taps unless the finger actually moves a bit
  const panResponder = useRef(
    PanResponder.create({
      // Don’t start on tap; wait until there is actual movement
      onStartShouldSetPanResponder: () => false, // NEW
      onMoveShouldSetPanResponder: (_evt, g) => {
        const moveDist = Math.abs(g.dx) + Math.abs(g.dy);
        return moveDist > 4; // small threshold so taps still work  // NEW
      },
      onStartShouldSetPanResponderCapture: () => false, // NEW
      onMoveShouldSetPanResponderCapture: (_evt, g) => {
        const moveDist = Math.abs(g.dx) + Math.abs(g.dy);
        return moveDist > 4; // NEW
      },

      onPanResponderGrant: () => {
        pan.setOffset({ x: readVal(pan.x), y: readVal(pan.y) });
        pan.setValue({ x: 0, y: 0 });
      },

      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),

      onPanResponderRelease: (_evt, g) => {
        pan.flattenOffset();

        // Current values after drag
        const curX = readVal(pan.x);
        const curY = readVal(pan.y);

        // Clamp to visible area
        const targetX = clamp(curX, minX, Math.max(0, maxX));
        const targetY = clamp(curY, minY, Math.max(minY, maxY));

        // Optional: snap horizontally to nearest edge if close
        const snapEdgeThreshold = 24;
        let snapX = targetX;
        if (Math.abs(targetX - minX) < snapEdgeThreshold) snapX = minX;
        if (Math.abs(targetX - Math.max(0, maxX)) < snapEdgeThreshold)
          snapX = Math.max(0, maxX);

        Animated.spring(pan, {
          toValue: { x: snapX, y: targetY },
          useNativeDriver: false,
          friction: 7,
          tension: 80,
        }).start();
      },
    })
  ).current;

  // Hide the mini player on the podcast screen itself
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

  const isDark = colorScheme === "dark";

  // Collapsed: draggable sphere
  if (isCollapsed) {
    return (
      <Animated.View
        onLayout={onMeasure} // NEW: measure collapsed size too
        style={[
          styles.collapsedWrap,
          {
            transform: [{ translateX: pan.x }, { translateY: pan.y }],
          },
        ]}
        {...panResponder.panHandlers} // stays draggable when collapsed
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
            {/* <View style={styles.collapsedContent}>
              <Image
                source={{ uri: player.__artwork }}
                style={styles.collapsedArtwork}
                contentFit="cover"
              />
              {isPlaying && (
                <View
                  style={[
                    styles.collapsedPlayingDot,
                    {
                      width: `${progressPct * 100}%`,
                      height: `${progressPct * 100}%`,
                    },
                  ]}
                />
              )}
              <Ionicons
                name="chevron-up"
                size={16}
                color={isDark ? "#fff" : "#1a1a2e"}
                style={styles.expandIcon}
              />
            </View> */}
            <View
              style={[
                styles.collapsedContent,
                {
                  backgroundColor: "red",
                },
              ]}
            >
              <View style={[styles.artworkWrap, {}]}>
                <Image
                  source={{ uri: player.__artwork }}
                  style={styles.collapsedArtwork}
                  contentFit="cover"
                />
                {isPlaying && (
                  <View style={styles.ringOverlay}>
                    <CircularProgressRing
                      size={COLLAPSED_SIZE}
                      progress={progressPct} // 0..1
                      strokeWidth={5}
                      color="black"
                      trackColor={
                        isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.12)"
                      }
                    />
                  </View>
                )}
              </View>

              <Ionicons
                name="chevron-up"
                size={16}
                color={Colors[colorScheme].defaultIcon}
                style={styles.expandIcon}
              />
            </View>
          </BlurView>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  // Full view: now the WHOLE card is draggable (not just the handle)
  return (
    <Animated.View
      onLayout={onMeasure} // NEW: measure full size for correct clamping
      style={[
        styles.wrap,
        {
          transform: [{ translateX: pan.x }, { translateY: pan.y }],
        },
      ]}
      {...panResponder.panHandlers} // NEW: make entire full-size draggable
    >
      {/* Drag Handle (kept as visual affordance, but not required anymore) */}
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

        {/* Collapse Button */}
        <TouchableOpacity
          style={[styles.collapseButton, {}]}
          onPress={() => setIsCollapsed(true)}
        >
          <Ionicons
            name="chevron-down"
            size={22}
            color={Colors[colorScheme].defaultIcon}
            style={{}}
          />
        </TouchableOpacity>

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
                  style={[styles.title, { color: isDark ? "#fff" : "#1a1a2e" }]}
                >
                  {player.__title ?? "Now Playing"}
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

          {/* Progress Bar */}
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
                  {
                    width: `${progressPct * 100}%`,
                  },
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
  wrap: {
    position: "absolute",
    left: 16,
    right: 16,
    borderRadius: 20,
    overflow: "visible",
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
  collapseButton: {
    position: "absolute",
    top: 1,
    right: 8,
    zIndex: 10,
    padding: 4,
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
    paddingVertical: 25,
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
  progressContainer: { marginTop: 10 },
  progressTrack: { height: 4, borderRadius: 2, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 2, overflow: "hidden" },
  progressGradient: { flex: 1 },

  // Collapsed sphere
  collapsedWrap: {
    position: "absolute",
    width: 60,
    height: 60,
    left: 16, // keep same left base so clamping logic matches
  },
  collapsedButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  collapsedBlur: { flex: 1, borderRadius: 30 },
  collapsedGradient: { ...StyleSheet.absoluteFillObject },
  collapsedContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  collapsedArtwork: {
    width: "100%",
    height: "100%",
    borderRadius: COLLAPSED_SIZE / 2,
  },

  artworkWrap: {
    width: COLLAPSED_SIZE,
    height: COLLAPSED_SIZE,
  },

  ringOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  expandIcon: { position: "absolute", top: 4, opacity: 0.7 },
});
