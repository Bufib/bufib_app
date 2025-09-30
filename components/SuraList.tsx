// import type React from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   StyleSheet,
//   useColorScheme,
//   Dimensions,
//   ScrollView,
//   Animated,
//   Alert,
// } from "react-native";
// import { useEffect, useMemo, useState, useRef, useCallback } from "react";
// import { useTranslation } from "react-i18next";
// import { Colors } from "../constants/Colors";
// import Entypo from "@expo/vector-icons/Entypo";
// import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
// import { whenDatabaseReady } from "@/db";
// import { useLanguage } from "@/contexts/LanguageContext";
// import {
//   Language,
//   LanguageCode,
//   SuraRowType,
//   JuzStartType,
// } from "@/constants/Types";
// import {
//   getSurahList,
//   getAllJuzStarts,
//   getSurahDisplayName,
//   getJuzButtonLabels,
// } from "@/db/queries/quran";
// import { ThemedView } from "./ThemedView";
// import { ThemedText } from "./ThemedText";
// import { LoadingIndicator } from "./LoadingIndicator";
// import { router } from "expo-router";
// import { Image } from "expo-image";
// import { useLastSuraStore } from "@/stores/useLastSura";
// import { LinearGradient } from "expo-linear-gradient";
// import { FlashList } from "@shopify/flash-list";
// import { useReadingProgressQuran } from "@/stores/useReadingProgressQuran";
// import i18n from "@/utils/i18n";
// import { returnSize } from "@/utils/sizes";

// const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// const { badgeSize } = returnSize(screenWidth, screenHeight);
// const SuraProgressBadge: React.FC<{ suraId: number; total?: number }> = ({
//   suraId,
//   total,
// }) => {
//   const progress = useReadingProgressQuran((s) => s.progressBySura[suraId]);

//   const totalVerses =
//     progress?.totalVerses && progress.totalVerses > 0
//       ? progress.totalVerses
//       : total ?? 0;

//   const percent =
//     totalVerses > 0 && (progress?.lastVerseNumber ?? 0) > 0
//       ? Math.max(
//           0,
//           Math.min(
//             100,
//             Math.round(((progress?.lastVerseNumber ?? 0) / totalVerses) * 100)
//           )
//         )
//       : 0;

//   const ringColor =
//     percent >= 100 ? "#2ECC71" : percent > 0 ? "#4A90E2" : "#C9CDD3";

//   return (
//     <View
//       style={{
//         justifyContent: "center",
//         alignItems: "center",
//         width: 55,
//         height: 55,
//         borderWidth: 4,
//         borderColor: ringColor,
//         borderRadius: 99,
//       }}
//     >
//       <ThemedText style={{ fontWeight: "700" }}>{percent}%</ThemedText>
//     </View>
//   );
// };

// const SuraList: React.FC = () => {
//   const { t } = useTranslation();
//   const { language, isArabic } = useLanguage();
//   const lang = (language ?? "de") as LanguageCode;

//   const [suras, setSuras] = useState<SuraRowType[]>([]);
//   const [juzList, setJuzList] = useState<
//     Array<{
//       juz: number;
//       label: string;
//       sura: number;
//       aya: number;
//     }>
//   >([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [viewMode, setViewMode] = useState("sura");
//   const colorScheme = useColorScheme() || "light";

//   // Animation for tab indicator
//   const slideAnim = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     let cancelled = false;
//     (async () => {
//       try {
//         setIsLoading(true);
//         await whenDatabaseReady();

//         // Load both suras and juz data
//         const [suraRows, juzLabels] = await Promise.all([
//           getSurahList(),
//           getJuzButtonLabels(lang as Language),
//         ]);

//         if (!cancelled) {
//           setSuras(suraRows ?? []);
//           setJuzList(juzLabels ?? []);
//         }
//       } catch (error) {
//         console.error("Failed to load data:", error);
//         if (!cancelled) {
//           setSuras([]);
//           setJuzList([]);
//         }
//       } finally {
//         if (!cancelled) setIsLoading(false);
//       }
//     })();
//     return () => {
//       cancelled = true;
//     };
//   }, [lang]);

//   // Animate tab indicator when view mode changes
//   useEffect(() => {
//     Animated.spring(slideAnim, {
//       toValue: viewMode === "sura" ? 0 : viewMode === "juz" ? 1 : 2,
//       useNativeDriver: true,
//       tension: 50,
//       friction: 8,
//     }).start();
//   }, [viewMode]);

//   const getSuraName = (s: SuraRowType) => {
//     if (lang === "ar") return s.label ?? s.label_en ?? s.label_de ?? "";
//     if (lang === "de") return s.label_de ?? s.label_en ?? s.label ?? "";
//     return s.label_en ?? s.label_de ?? s.label ?? "";
//   };

//   const lastSuraNumber = useLastSuraStore((s) => s.lastSura);

//   const lastSuraRow = useMemo(
//     () =>
//       lastSuraNumber != null
//         ? suras.find((s) => s.id === lastSuraNumber) ?? null
//         : null,
//     [suras, lastSuraNumber]
//   );
//   const lastSuraTitle = lastSuraRow ? `${getSuraName(lastSuraRow)}` : "—";
//   const setTotalVerses = useReadingProgressQuran((s) => s.setTotalVerses);
//   const updateBookmarkProgress = useReadingProgressQuran(
//     (s) => s.updateBookmark
//   );
//   const markSuraDone = useCallback(
//     (suraId: number, totalVerses: number) => {
//       // ensure the store knows the total
//       setTotalVerses(suraId, totalVerses);
//       // set lastVerseNumber to total and lastIndex to total-1 (0-based)
//       updateBookmarkProgress(
//         suraId,
//         totalVerses,
//         Math.max(0, totalVerses - 1),
//         lang
//       );
//     },
//     [lang, setTotalVerses, updateBookmarkProgress]
//   );

//   const DoneToggleButton: React.FC<{
//     suraId: number;
//     total: number;
//     onPress: () => void;
//   }> = ({ suraId, total, onPress }) => {
//     const { t } = useTranslation();
//     const p = useReadingProgressQuran((s) => s.progressBySura[suraId]);
//     const totalVerses =
//       p?.totalVerses && p.totalVerses > 0 ? p.totalVerses : total;
//     const isComplete =
//       !!totalVerses && (p?.lastVerseNumber ?? 0) >= totalVerses;

//     return (
//       <TouchableOpacity onPress={onPress} style={{}}>
//         <ThemedText style={{ fontSize: 14 }}>
//           {isComplete ? t("remove") : t("done")}
//         </ThemedText>
//       </TouchableOpacity>
//     );
//   };

//   const confirmToggleComplete = useCallback(
//     (suraId: number, fallbackTotal: number) => {
//       const { progressBySura } = useReadingProgressQuran.getState();
//       const prog = progressBySura[suraId];

//       const total =
//         prog?.totalVerses && prog.totalVerses > 0
//           ? prog.totalVerses
//           : fallbackTotal;

//       const done = prog?.lastVerseNumber ?? 0;
//       const isComplete = !!total && done >= total;

//       if (isComplete) {
//         // Already 100% → ask to remove progress (undo to 0%)
//         Alert.alert(t("confirm"), t("removeProgress"), [
//           { text: t("cancel", "Cancel"), style: "cancel" },
//           {
//             text: t("reset", "Reset"),
//             style: "destructive",
//             onPress: () => updateBookmarkProgress(suraId, 0, -1, lang),
//           },
//         ]);
//       } else {
//         // Not complete → ask to mark as read (set to 100%)
//         Alert.alert(t("confirm"), t("markAsRead"), [
//           { text: t("cancel", "Cancel"), style: "cancel" },
//           {
//             text: t("yes", "Yes"),
//             onPress: () => markSuraDone(suraId, total || fallbackTotal),
//           },
//         ]);
//       }
//     },
//     [lang, markSuraDone, updateBookmarkProgress]
//   );

//   const renderSuraItem = ({ item }: { item: SuraRowType }) => {
//     const name = getSuraName(item);
//     const isMakki = !!item.makki;

//     return (
//       <TouchableOpacity
//         style={[
//           styles.card,
//           {
//             backgroundColor: Colors[colorScheme].background,
//           },
//         ]}
//         activeOpacity={0.6}
//         onPress={() =>
//           router.push({
//             pathname: "/knowledge/quran/sura",
//             params: {
//               suraId: item.id.toString(),
//             },
//           })
//         }
//       >
//         <View
//           style={[
//             styles.cardContent,
//             isArabic()
//               ? {
//                   flexDirection: "row-reverse",
//                 }
//               : { flexDirection: "row" },
//           ]}
//         >
//           {/* Number Badge */}
//           <View
//             style={[
//               styles.numberSection,
//               isArabic()
//                 ? {
//                     marginLeft: 25,
//                   }
//                 : {
//                     marginRight: 20,
//                   },
//             ]}
//           >
//             <LinearGradient
//               colors={isMakki ? ["#4A90E2", "#6BA3E5"] : ["#2ECC71", "#52D681"]}
//               style={styles.numberBadge}
//             >
//               <Text style={styles.numberText}>{item.id}</Text>
//             </LinearGradient>
//           </View>

//           {/* Content Section */}
//           <View style={styles.contentSection}>
//             <ThemedText
//               style={[styles.suraName, isArabic() && styles.suraNameAr]}
//             >
//               {name}
//             </ThemedText>

//             <View style={styles.metaContainer}>
//               <View
//                 style={[
//                   styles.metaBadge,
//                   {
//                     backgroundColor: Colors[colorScheme].contrast,
//                   },
//                 ]}
//               >
//                 <ThemedText style={[styles.metaText, { fontSize: badgeSize }]}>
//                   {item.nbAyat} {t("ayatCount").toUpperCase()}
//                 </ThemedText>
//               </View>

//               <View
//                 style={[
//                   styles.typeBadge,
//                   { backgroundColor: isMakki ? "#E8F2FD" : "#E8F8F0" },
//                 ]}
//               >
//                 <Text
//                   style={[
//                     styles.typeText,
//                     {
//                       color: isMakki ? "#4A90E2" : "#2ECC71",
//                       fontSize: badgeSize,
//                     },
//                   ]}
//                 >
//                   {isMakki
//                     ? t("makki").toUpperCase()
//                     : t("madani").toUpperCase()}
//                 </Text>
//               </View>
//             </View>
//           </View>
//           <View
//             style={{
//               width: 65,
//               flexDirection: "column",
//               justifyContent: "center",
//               alignItems: "center",
//               gap: 2,
//             }}
//           >
//             <SuraProgressBadge suraId={item.id} total={item.nbAyat} />
//             <DoneToggleButton
//               suraId={item.id}
//               total={item.nbAyat}
//               onPress={() => confirmToggleComplete(item.id, item.nbAyat)}
//             />
//           </View>
//           {/* Arrow */}
//           <View
//             style={[
//               styles.arrowSection,
//               isArabic()
//                 ? {
//                     marginRight: 15,
//                   }
//                 : {
//                     marginLeft: 12,
//                   },
//             ]}
//           >
//             <View
//               style={[
//                 styles.arrowCircle,
//                 {
//                   backgroundColor: Colors[colorScheme].contrast,
//                 },
//               ]}
//             >
//               <Entypo
//                 name={isArabic() ? "chevron-small-left" : "chevron-small-right"}
//                 size={30}
//                 color={Colors[colorScheme].defaultIcon}
//               />
//             </View>
//           </View>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   const renderJuzItem = ({ item }: { item: (typeof juzList)[0] }) => {
//     const juzNumber = item.juz;
//     const [surahName, ayahNumber] = item.label.split(" — ")[1]?.split(" ") ?? [
//       "",
//       "",
//     ];

//     return (
//       <TouchableOpacity
//         style={[
//           styles.juzCard,
//           {
//             backgroundColor: Colors[colorScheme].background,
//           },
//         ]}
//         activeOpacity={0.8}
//         onPress={() =>
//           router.push({
//             pathname: "/knowledge/quran/sura",
//             params: { juzId: String(item.juz) },
//           })
//         }
//       >
//         <View
//           style={[
//             styles.juzContent,
//             isArabic()
//               ? {
//                   flexDirection: "row-reverse",
//                 }
//               : { flexDirection: "row" },
//           ]}
//         >
//           <View style={[styles.juzNameAndNumber, {}]}>
//             <ThemedText style={styles.juzNumber}>
//               {t("juz")} {juzNumber}
//             </ThemedText>
//           </View>

//           <View style={styles.juzInfo}>
//             <ThemedText style={styles.juzSuraName}>
//               {item.label.split(" — ")[1] || ""}
//             </ThemedText>
//           </View>

//           <View
//             style={[
//               styles.arrowSection,
//               isArabic()
//                 ? {
//                     marginRight: 15,
//                   }
//                 : {
//                     marginLeft: 12,
//                   },
//             ]}
//           >
//             <View
//               style={[
//                 styles.arrowCircle,
//                 {
//                   backgroundColor: Colors[colorScheme].contrast,
//                 },
//               ]}
//             >
//               <Entypo
//                 name={isArabic() ? "chevron-small-left" : "chevron-small-right"}
//                 size={30}
//                 color={Colors[colorScheme].defaultIcon}
//               />
//             </View>
//           </View>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   if (isLoading) {
//     return (
//       <ThemedView style={styles.centerContainer}>
//         <LoadingIndicator size={"large"} />
//       </ThemedView>
//     );
//   }

//   return (
//     <ThemedView style={styles.container}>
//       <TouchableOpacity
//         style={styles.headerCard}
//         activeOpacity={lastSuraRow ? 0.85 : 1}
//         onPress={() => {
//           if (lastSuraRow) {
//             router.push({
//               pathname: "/knowledge/quran/sura",
//               params: { suraId: String(lastSuraRow.id) },
//             });
//           }
//         }}
//       >
//         <LinearGradient
//           colors={
//             colorScheme === "dark"
//               ? ["#2a3142", "#34495e"]
//               : ["#4A90E2", "#6BA3E5"]
//           }
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 1 }}
//           style={styles.headerGradient}
//         >
//           <View style={styles.headerContent}>
//             <View style={styles.headerTextSection}>
//               <Text style={styles.lastReadLabel}>
//                 {t("lastRead").toUpperCase()}
//               </Text>
//               <Text
//                 style={styles.lastReadSura}
//                 numberOfLines={1}
//                 ellipsizeMode="tail"
//               >
//                 {lastSuraTitle}
//               </Text>
//               {lastSuraRow && (
//                 <View style={styles.lastReadMeta}>
//                   <Text style={styles.lastReadMetaText}>
//                     {t("ayatCount")}: {lastSuraRow.nbAyat}
//                   </Text>
//                 </View>
//               )}
//             </View>

//             <View style={styles.headerImageSection}>
//               <Image
//                 source={require("@/assets/images/quranImage2.png")}
//                 style={styles.headerImage}
//                 contentFit="contain"
//               />
//               <View style={styles.imageOverlay} />
//             </View>
//           </View>
//         </LinearGradient>
//       </TouchableOpacity>

//       {/* Tab Selector */}
//       <View style={styles.tabContainer}>
//         <View
//           style={[
//             styles.tabBackground,
//             {
//               backgroundColor: colorScheme === "dark" ? "#34495e" : "#F0F8FF",
//             },
//           ]}
//         >
//           <Animated.View
//             style={[
//               styles.tabIndicator,
//               {
//                 backgroundColor: colorScheme === "dark" ? "#4A90E2" : "#ffffff",
//                 transform: [
//                   {
//                     translateX: slideAnim.interpolate({
//                       inputRange: [0, 1, 2],
//                       outputRange: [
//                         4,
//                         4 + (screenWidth - 32) / 3,
//                         4 + (2 * (screenWidth - 32)) / 3,
//                       ],
//                       extrapolate: "clamp",
//                     }),
//                   },
//                 ],
//               },
//             ]}
//           />
//           {/* Sura */}
//           <TouchableOpacity
//             style={styles.tab}
//             onPress={() => setViewMode("sura")}
//             activeOpacity={0.7}
//           >
//             <ThemedText
//               style={[
//                 styles.tabText,
//                 viewMode === "sura" && styles.tabTextActive,
//               ]}
//             >
//               {t("sura")} (114)
//             </ThemedText>
//           </TouchableOpacity>
//           {/* Juz */}

//           <TouchableOpacity
//             style={styles.tab}
//             onPress={() => setViewMode("juz")}
//             activeOpacity={0.7}
//           >
//             <ThemedText
//               style={[
//                 styles.tabText,
//                 viewMode === "juz" && styles.tabTextActive,
//               ]}
//             >
//               {t("juz")} (30)
//             </ThemedText>
//           </TouchableOpacity>

//           {/* Page */}

//           <TouchableOpacity
//             style={styles.tab}
//             onPress={() => setViewMode("page")}
//             activeOpacity={0.7}
//           >
//             <ThemedText
//               style={[
//                 styles.tabText,
//                 viewMode === "page" && styles.tabTextActive,
//               ]}
//             >
//               {t("page")} (604)
//             </ThemedText>
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Content List */}
//       {viewMode === "sura" ? (
//         <FlashList
//           data={suras}
//           extraData={[colorScheme, lang]}
//           renderItem={renderSuraItem}
//           keyExtractor={(item) => item.id.toString()}
//           showsVerticalScrollIndicator={false}
//           style={{}}
//           contentContainerStyle={styles.listContent}
//         />
//       ) : (
//         <FlashList
//           data={juzList}
//           extraData={[colorScheme, lang]}
//           renderItem={renderJuzItem}
//           keyExtractor={(item) => item.juz.toString()}
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={styles.listContent}
//         />
//       )}
//     </ThemedView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },

//   // Header Styles
//   headerCard: {
//     marginHorizontal: 16,
//     marginTop: 12,
//     marginBottom: 16,
//     borderRadius: 24,
//     overflow: "hidden",
//   },

//   headerGradient: {
//     borderRadius: 24,
//   },

//   headerContent: {
//     flexDirection: "row",
//     padding: 24,
//     minHeight: 140,
//   },

//   headerTextSection: {
//     flex: 1,
//     justifyContent: "center",
//     paddingRight: 16,
//   },

//   lastReadLabel: {
//     fontSize: 11,
//     fontWeight: "700",
//     color: "rgba(255, 255, 255, 0.7)",
//     letterSpacing: 1.2,
//     marginBottom: 8,
//   },

//   lastReadSura: {
//     fontSize: 24,
//     fontWeight: "800",
//     color: "#ffffff",
//     marginBottom: 12,
//     lineHeight: 30,
//   },

//   lastReadMeta: {
//     flexDirection: "row",
//     alignItems: "center",
//   },

//   lastReadMetaText: {
//     fontSize: 13,
//     color: "rgba(255, 255, 255, 0.8)",
//     fontWeight: "600",
//   },

//   headerImageSection: {
//     width: 120,
//     justifyContent: "center",
//     alignItems: "center",
//     position: "relative",
//   },

//   headerImage: {
//     width: 100,
//     height: 100,
//     opacity: 0.9,
//   },

//   imageOverlay: {
//     position: "absolute",
//     width: "100%",
//     height: "100%",
//     backgroundColor: "rgba(255, 255, 255, 0.05)",
//     borderRadius: 50,
//   },

//   tabContainer: {
//     marginHorizontal: 16,
//     marginBottom: 16,
//   },

//   tabBackground: {
//     flexDirection: "row",
//     borderRadius: 16,
//     padding: 4,
//     position: "relative",
//     borderWidth: 0.5,
//   },

//   tabIndicator: {
//     position: "absolute",
//     top: 4,
//     bottom: 4,
//     width: (screenWidth - 32)/3 - 8,
//     borderRadius: 12,
//     elevation: 2,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },

//   tab: {
//     flex: 1,
//     paddingVertical: 12,
//     alignItems: "center",
//     justifyContent: "center",
//     zIndex: 1,
//   },

//   tabText: {
//     fontSize: 15,
//     fontWeight: "600",
//     opacity: 0.6,
//   },

//   tabTextActive: {
//     opacity: 1,
//     fontWeight: "700",
//   },

//   listContent: {
//     paddingBottom: 24,
//     paddingHorizontal: 10,
//   },

//   card: {
//     borderBottomWidth: 0.5,
//     overflow: "hidden",
//     elevation: 2,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//   },

//   cardContent: {
//     alignItems: "stretch",
//     padding: 10,
//   },
//   numberSection: {},
//   numberBadge: {
//     width: 48,
//     height: 48,
//     borderRadius: 14,
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   numberText: {
//     fontSize: 18,
//     fontWeight: "800",
//     color: "#ffffff",
//   },

//   contentSection: {
//     flex: 1,
//     justifyContent: "center",
//   },

//   suraName: {
//     fontSize: 18,
//     fontWeight: "700",
//     marginBottom: 8,
//     letterSpacing: 0.2,
//   },

//   suraNameAr: {
//     fontSize: 20,
//     textAlign: "right",
//     fontWeight: "600",
//     letterSpacing: 0,
//   },

//   metaContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 3,
//   },

//   metaBadge: {
//     paddingHorizontal: 10,
//     height: 25,
//     borderRadius: 8,
//   },

//   metaText: {
//     fontWeight: "800",
//   },

//   typeBadge: {
//     paddingHorizontal: 10,
//     height: 25,
//     borderRadius: 8,
//     justifyContent: "center",
//   },

//   typeText: {
//     fontWeight: "800",
//   },

//   arrowSection: {},

//   arrowCircle: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   juzCard: {
//     borderBottomWidth: 0.5,
//     overflow: "hidden",
//     elevation: 2,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//   },

//   juzContent: {
//     padding: 15,
//     flexDirection: "row",
//     alignItems: "center",
//     height: "100%",
//   },

//   juzNameAndNumber: {
//     width: 90,
//     alignItems: "center",
//     borderWidth: 1,
//     padding: 10,
//     borderRadius: 10,
//   },

//   juzNumber: {
//     fontSize: 20,
//     fontWeight: "700",
//     marginBottom: 4,
//   },

//   juzInfo: {
//     flex: 1,
//     alignItems: "center",
//   },

//   juzSuraName: {
//     fontSize: 19,
//     fontWeight: "500",
//     textAlign: "center",
//   },

//   centerContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingVertical: 48,
//   },
// });

// export default SuraList;

import type React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  Dimensions,
  ScrollView,
  Animated,
  Alert,
} from "react-native";
import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Colors } from "../constants/Colors";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { whenDatabaseReady } from "@/db";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Language,
  LanguageCode,
  SuraRowType,
  JuzStartType,
} from "@/constants/Types";
import {
  getSurahList,
  getSurahDisplayName,
  getJuzButtonLabels,
  getPageButtonLabels,
} from "@/db/queries/quran";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { LoadingIndicator } from "./LoadingIndicator";
import { router } from "expo-router";
import { Image } from "expo-image";
import { useLastSuraStore } from "@/stores/useLastSura";
import { LinearGradient } from "expo-linear-gradient";
import { FlashList } from "@shopify/flash-list";
import { useReadingProgressQuran } from "@/stores/useReadingProgressQuran";
import i18n from "@/utils/i18n";
import { returnSize } from "@/utils/sizes";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const { badgeSize } = returnSize(screenWidth, screenHeight);
const SuraProgressBadge: React.FC<{ suraId: number; total?: number }> = ({
  suraId,
  total,
}) => {
  const progress = useReadingProgressQuran((s) => s.progressBySura[suraId]);

  const totalVerses =
    progress?.totalVerses && progress.totalVerses > 0
      ? progress.totalVerses
      : total ?? 0;

  const percent =
    totalVerses > 0 && (progress?.lastVerseNumber ?? 0) > 0
      ? Math.max(
          0,
          Math.min(
            100,
            Math.round(((progress?.lastVerseNumber ?? 0) / totalVerses) * 100)
          )
        )
      : 0;

  const ringColor =
    percent >= 100 ? "#2ECC71" : percent > 0 ? "#4A90E2" : "#C9CDD3";

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        width: 55,
        height: 55,
        borderWidth: 4,
        borderColor: ringColor,
        borderRadius: 99,
      }}
    >
      <ThemedText style={{ fontWeight: "700" }}>{percent}%</ThemedText>
    </View>
  );
};

const SuraList: React.FC = () => {
  const { t } = useTranslation();
  const { language, isArabic } = useLanguage();
  const lang = (language ?? "de") as LanguageCode;

  const [suras, setSuras] = useState<SuraRowType[]>([]);
  const [juzList, setJuzList] = useState<
    Array<{
      juz: number;
      label: string;
      sura: number;
      aya: number;
    }>
  >([]);
  const [pageList, setPageList] = useState<
    Array<{ page: number; label: string; sura: number; aya: number }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("sura");
  const colorScheme = useColorScheme() || "light";

  // Animation for tab indicator
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setIsLoading(true);
        await whenDatabaseReady();

        // Load both suras and juz data
        const [suraRows, juzLabels, pageLabels] = await Promise.all([
          getSurahList(),
          getJuzButtonLabels(lang as Language),
          getPageButtonLabels(lang as Language),
        ]);

        if (!cancelled) {
          setSuras(suraRows ?? []);
          setJuzList(juzLabels ?? []);
          setPageList(pageLabels ?? []);
        }
      } catch (error) {
        console.error("Failed to load data:", error);
        if (!cancelled) {
          setSuras([]);
          setJuzList([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [lang]);

  // Animate tab indicator when view mode changes
  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: viewMode === "sura" ? 0 : viewMode === "juz" ? 1 : 2,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start();
  }, [viewMode]);

  const getSuraName = (s: SuraRowType) => {
    if (lang === "ar") return s.label ?? s.label_en ?? s.label_de ?? "";
    if (lang === "de") return s.label_de ?? s.label_en ?? s.label ?? "";
    return s.label_en ?? s.label_de ?? s.label ?? "";
  };

  const lastSuraNumber = useLastSuraStore((s) => s.lastSura);

  const lastSuraRow = useMemo(
    () =>
      lastSuraNumber != null
        ? suras.find((s) => s.id === lastSuraNumber) ?? null
        : null,
    [suras, lastSuraNumber]
  );
  const lastSuraTitle = lastSuraRow ? `${getSuraName(lastSuraRow)}` : "—";
  const setTotalVerses = useReadingProgressQuran((s) => s.setTotalVerses);
  const updateBookmarkProgress = useReadingProgressQuran(
    (s) => s.updateBookmark
  );
  const markSuraDone = useCallback(
    (suraId: number, totalVerses: number) => {
      // ensure the store knows the total
      setTotalVerses(suraId, totalVerses);
      // set lastVerseNumber to total and lastIndex to total-1 (0-based)
      updateBookmarkProgress(
        suraId,
        totalVerses,
        Math.max(0, totalVerses - 1),
        lang
      );
    },
    [lang, setTotalVerses, updateBookmarkProgress]
  );

  const DoneToggleButton: React.FC<{
    suraId: number;
    total: number;
    onPress: () => void;
  }> = ({ suraId, total, onPress }) => {
    const { t } = useTranslation();
    const p = useReadingProgressQuran((s) => s.progressBySura[suraId]);
    const totalVerses =
      p?.totalVerses && p.totalVerses > 0 ? p.totalVerses : total;
    const isComplete =
      !!totalVerses && (p?.lastVerseNumber ?? 0) >= totalVerses;

    return (
      <TouchableOpacity onPress={onPress} style={{}}>
        <ThemedText style={{ fontSize: 14 }}>
          {isComplete ? t("remove") : t("done")}
        </ThemedText>
      </TouchableOpacity>
    );
  };

  const confirmToggleComplete = useCallback(
    (suraId: number, fallbackTotal: number) => {
      const { progressBySura } = useReadingProgressQuran.getState();
      const prog = progressBySura[suraId];

      const total =
        prog?.totalVerses && prog.totalVerses > 0
          ? prog.totalVerses
          : fallbackTotal;

      const done = prog?.lastVerseNumber ?? 0;
      const isComplete = !!total && done >= total;

      if (isComplete) {
        // Already 100% → ask to remove progress (undo to 0%)
        Alert.alert(t("confirm"), t("removeProgress"), [
          { text: t("cancel", "Cancel"), style: "cancel" },
          {
            text: t("reset", "Reset"),
            style: "destructive",
            onPress: () => updateBookmarkProgress(suraId, 0, -1, lang),
          },
        ]);
      } else {
        // Not complete → ask to mark as read (set to 100%)
        Alert.alert(t("confirm"), t("markAsRead"), [
          { text: t("cancel", "Cancel"), style: "cancel" },
          {
            text: t("yes", "Yes"),
            onPress: () => markSuraDone(suraId, total || fallbackTotal),
          },
        ]);
      }
    },
    [lang, markSuraDone, updateBookmarkProgress]
  );

  const renderSuraItem = ({ item }: { item: SuraRowType }) => {
    const name = getSuraName(item);
    const isMakki = !!item.makki;

    return (
      <TouchableOpacity
        style={[
          styles.card,
          {
            backgroundColor: Colors[colorScheme].background,
          },
        ]}
        activeOpacity={0.6}
        onPress={() =>
          router.push({
            pathname: "/knowledge/quran/sura",
            params: {
              suraId: item.id.toString(),
            },
          })
        }
      >
        <View
          style={[
            styles.cardContent,
            isArabic()
              ? {
                  flexDirection: "row-reverse",
                }
              : { flexDirection: "row" },
          ]}
        >
          {/* Number Badge */}
          <View
            style={[
              styles.numberSection,
              isArabic()
                ? {
                    marginLeft: 25,
                  }
                : {
                    marginRight: 20,
                  },
            ]}
          >
            <LinearGradient
              colors={isMakki ? ["#4A90E2", "#6BA3E5"] : ["#2ECC71", "#52D681"]}
              style={styles.numberBadge}
            >
              <Text style={styles.numberText}>{item.id}</Text>
            </LinearGradient>
          </View>

          {/* Content Section */}
          <View style={styles.contentSection}>
            <ThemedText
              style={[styles.suraName, isArabic() && styles.suraNameAr]}
            >
              {name}
            </ThemedText>

            <View style={styles.metaContainer}>
              <View
                style={[
                  styles.metaBadge,
                  {
                    backgroundColor: Colors[colorScheme].contrast,
                  },
                ]}
              >
                <ThemedText style={[styles.metaText, { fontSize: badgeSize }]}>
                  {item.nbAyat} {t("ayatCount").toUpperCase()}
                </ThemedText>
              </View>

              <View
                style={[
                  styles.typeBadge,
                  { backgroundColor: isMakki ? "#E8F2FD" : "#E8F8F0" },
                ]}
              >
                <Text
                  style={[
                    styles.typeText,
                    {
                      color: isMakki ? "#4A90E2" : "#2ECC71",
                      fontSize: badgeSize,
                    },
                  ]}
                >
                  {isMakki
                    ? t("makki").toUpperCase()
                    : t("madani").toUpperCase()}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              width: 65,
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
            }}
          >
            <SuraProgressBadge suraId={item.id} total={item.nbAyat} />
            <DoneToggleButton
              suraId={item.id}
              total={item.nbAyat}
              onPress={() => confirmToggleComplete(item.id, item.nbAyat)}
            />
          </View>
          {/* Arrow */}
          <View
            style={[
              styles.arrowSection,
              isArabic()
                ? {
                    marginRight: 15,
                  }
                : {
                    marginLeft: 12,
                  },
            ]}
          ></View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderJuzItem = ({ item }: { item: (typeof juzList)[0] }) => {
    const juzNumber = item.juz;
    const [surahName, ayahNumber] = item.label.split(" — ")[1]?.split(" ") ?? [
      "",
      "",
    ];

    return (
      <TouchableOpacity
        style={[
          styles.juzCard,
          {
            backgroundColor: Colors[colorScheme].background,
          },
        ]}
        activeOpacity={0.8}
        onPress={() =>
          router.push({
            pathname: "/knowledge/quran/sura",
            params: { juzId: String(item.juz) },
          })
        }
      >
        <View
          style={[
            styles.juzContent,
            isArabic()
              ? {
                  flexDirection: "row-reverse",
                }
              : { flexDirection: "row" },
          ]}
        >
          <View style={[styles.juzNameAndNumber, {}]}>
            <ThemedText style={styles.juzNumber}>
              {t("juz")} {juzNumber}
            </ThemedText>
          </View>

          <View style={styles.juzInfo}>
            <ThemedText style={styles.juzSuraName}>
              {item.label.split(" — ")[1] || ""}
            </ThemedText>
          </View>

          <View
            style={[
              styles.arrowSection,
              isArabic()
                ? {
                    marginRight: 15,
                  }
                : {
                    marginLeft: 12,
                  },
            ]}
          >
            <View
              style={[
                styles.arrowCircle,
                {
                  backgroundColor: Colors[colorScheme].contrast,
                },
              ]}
            >
              <Entypo
                name={isArabic() ? "chevron-small-left" : "chevron-small-right"}
                size={30}
                color={Colors[colorScheme].defaultIcon}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderPageItem = ({
    item,
  }: {
    item: { page: number; label: string; sura: number; aya: number };
  }) => {
    return (
      <TouchableOpacity
        style={[
          styles.juzCard, // reuse same card style
          { backgroundColor: Colors[colorScheme].background },
        ]}
        activeOpacity={0.8}
        onPress={() =>
          router.push({
            pathname: "/knowledge/quran/sura",
            params: { pageId: String(item.page) }, // your reader should handle pageId
          })
        }
      >
        <View
          style={[
            styles.juzContent,
            isArabic()
              ? { flexDirection: "row-reverse" }
              : { flexDirection: "row" },
          ]}
        >
          <View style={[styles.juzNameAndNumber, {}]}>
            <ThemedText style={styles.juzNumber}>
              {t("page")} {item.page}
            </ThemedText>
          </View>

          <View style={styles.juzInfo}>
            <ThemedText style={styles.juzSuraName}>
              {item.label.split(" — ")[1] || ""}
            </ThemedText>
          </View>

          <View
            style={[
              styles.arrowSection,
              isArabic() ? { marginRight: 15 } : { marginLeft: 12 },
            ]}
          >
            <View
              style={[
                styles.arrowCircle,
                { backgroundColor: Colors[colorScheme].contrast },
              ]}
            >
              <Entypo
                name={isArabic() ? "chevron-small-left" : "chevron-small-right"}
                size={30}
                color={Colors[colorScheme].defaultIcon}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <LoadingIndicator size={"large"} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity
        style={styles.headerCard}
        activeOpacity={lastSuraRow ? 0.85 : 1}
        onPress={() => {
          if (lastSuraRow) {
            router.push({
              pathname: "/knowledge/quran/sura",
              params: { suraId: String(lastSuraRow.id) },
            });
          }
        }}
      >
        <LinearGradient
          colors={
            colorScheme === "dark"
              ? ["#2a3142", "#34495e"]
              : ["#4A90E2", "#6BA3E5"]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerTextSection}>
              <Text style={styles.lastReadLabel}>
                {t("lastRead").toUpperCase()}
              </Text>
              <Text
                style={styles.lastReadSura}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {lastSuraTitle}
              </Text>
              {lastSuraRow && (
                <View style={styles.lastReadMeta}>
                  <Text style={styles.lastReadMetaText}>
                    {t("ayatCount")}: {lastSuraRow.nbAyat}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.headerImageSection}>
              <Image
                source={require("@/assets/images/quranImage2.png")}
                style={styles.headerImage}
                contentFit="contain"
              />
              <View style={styles.imageOverlay} />
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <View
          style={[
            styles.tabBackground,
            {
              backgroundColor: colorScheme === "dark" ? "#34495e" : "#F0F8FF",
            },
          ]}
        >
          <Animated.View
            style={[
              styles.tabIndicator,
              {
                backgroundColor: colorScheme === "dark" ? "#4A90E2" : "#ffffff",
                transform: [
                  {
                    translateX: slideAnim.interpolate({
                      inputRange: [0, 1, 2],
                      outputRange: [
                        4,
                        4 + (screenWidth - 32) / 3,
                        4 + (2 * (screenWidth - 32)) / 3,
                      ],
                      extrapolate: "clamp",
                    }),
                  },
                ],
              },
            ]}
          />
          {/* Sura */}
          <TouchableOpacity
            style={styles.tab}
            onPress={() => setViewMode("sura")}
            activeOpacity={0.7}
          >
            <ThemedText
              style={[
                styles.tabText,
                viewMode === "sura" && styles.tabTextActive,
              ]}
            >
              {t("sura")} (114)
            </ThemedText>
          </TouchableOpacity>
          {/* Juz */}

          <TouchableOpacity
            style={styles.tab}
            onPress={() => setViewMode("juz")}
            activeOpacity={0.7}
          >
            <ThemedText
              style={[
                styles.tabText,
                viewMode === "juz" && styles.tabTextActive,
              ]}
            >
              {t("juz")} (30)
            </ThemedText>
          </TouchableOpacity>

          {/* Page */}

          <TouchableOpacity
            style={styles.tab}
            onPress={() => setViewMode("page")}
            activeOpacity={0.7}
          >
            <ThemedText
              style={[
                styles.tabText,
                viewMode === "page" && styles.tabTextActive,
              ]}
            >
              {t("page")} ({pageList.length})
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content List */}
      {viewMode === "sura" ? (
        <FlashList
          data={suras}
          extraData={[colorScheme, lang]}
          renderItem={renderSuraItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          style={{}}
          contentContainerStyle={styles.listContent}
        />
      ) : viewMode === "juz" ? (
        <FlashList
          data={juzList}
          extraData={[colorScheme, lang]}
          renderItem={renderJuzItem}
          keyExtractor={(item) => item.juz.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <FlashList
          data={pageList}
          extraData={[colorScheme, lang]}
          renderItem={renderPageItem}
          keyExtractor={(item) => item.page.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Header Styles
  headerCard: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 16,
    borderRadius: 24,
    overflow: "hidden",
  },

  headerGradient: {
    borderRadius: 24,
  },

  headerContent: {
    flexDirection: "row",
    padding: 24,
    minHeight: 140,
  },

  headerTextSection: {
    flex: 1,
    justifyContent: "center",
    paddingRight: 16,
  },

  lastReadLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "rgba(255, 255, 255, 0.7)",
    letterSpacing: 1.2,
    marginBottom: 8,
  },

  lastReadSura: {
    fontSize: 24,
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: 12,
    lineHeight: 30,
  },

  lastReadMeta: {
    flexDirection: "row",
    alignItems: "center",
  },

  lastReadMetaText: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "600",
  },

  headerImageSection: {
    width: 120,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  headerImage: {
    width: 100,
    height: 100,
    opacity: 0.9,
  },

  imageOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 50,
  },

  tabContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },

  tabBackground: {
    flexDirection: "row",
    borderRadius: 16,
    padding: 4,
    position: "relative",
    borderWidth: 0.5,
  },

  tabIndicator: {
    position: "absolute",
    top: 4,
    bottom: 4,
    width: (screenWidth - 32) / 3 - 8,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },

  tabText: {
    fontSize: 15,
    fontWeight: "600",
    opacity: 0.6,
  },

  tabTextActive: {
    opacity: 1,
    fontWeight: "700",
  },

  listContent: {
    paddingBottom: 24,
    paddingHorizontal: 10,
  },

  card: {
    borderBottomWidth: 0.5,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },

  cardContent: {
    alignItems: "stretch",
    padding: 10,
  },
  numberSection: {},
  numberBadge: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  numberText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#ffffff",
  },

  contentSection: {
    flex: 1,
    justifyContent: "center",
  },

  suraName: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
    letterSpacing: 0.2,
  },

  suraNameAr: {
    fontSize: 20,
    textAlign: "right",
    fontWeight: "600",
    letterSpacing: 0,
  },

  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  metaBadge: {
    paddingHorizontal: 10,
    height: 25,
    borderRadius: 8,
  },

  metaText: {
    fontWeight: "800",
  },

  typeBadge: {
    paddingHorizontal: 10,
    height: 25,
    borderRadius: 8,
    justifyContent: "center",
  },

  typeText: {
    fontWeight: "800",
  },

  arrowSection: {},

  arrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  juzCard: {
    borderBottomWidth: 0.5,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },

  juzContent: {
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    height: "100%",
  },

  juzNameAndNumber: {
    width: 90,
    alignItems: "center",
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },

  juzNumber: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },

  juzInfo: {
    flex: 1,
    alignItems: "center",
  },

  juzSuraName: {
    fontSize: 19,
    fontWeight: "500",
    textAlign: "center",
  },

  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 48,
  },
});

export default SuraList;
