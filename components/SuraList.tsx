// // //! Ohne pages
// // // import type React from "react";
// // // import {
// // //   View,
// // //   Text,
// // //   FlatList,
// // //   TouchableOpacity,
// // //   StyleSheet,
// // //   useColorScheme,
// // //   Dimensions,
// // //   ScrollView,
// // //   Animated,
// // //   Alert,
// // // } from "react-native";
// // // import { useEffect, useMemo, useState, useRef, useCallback } from "react";
// // // import { useTranslation } from "react-i18next";
// // // import { Colors } from "../constants/Colors";
// // // import Entypo from "@expo/vector-icons/Entypo";
// // // import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
// // // import { whenDatabaseReady } from "@/db";
// // // import { useLanguage } from "@/contexts/LanguageContext";
// // // import {
// // //   Language,
// // //   LanguageCode,
// // //   SuraRowType,
// // //   JuzStartType,
// // // } from "@/constants/Types";
// // // import {
// // //   getSurahList,
// // //   getAllJuzStarts,
// // //   getSurahDisplayName,
// // //   getJuzButtonLabels,
// // // } from "@/db/queries/quran";
// // // import { ThemedView } from "./ThemedView";
// // // import { ThemedText } from "./ThemedText";
// // // import { LoadingIndicator } from "./LoadingIndicator";
// // // import { router } from "expo-router";
// // // import { Image } from "expo-image";
// // // import { useLastSuraStore } from "@/stores/useLastSura";
// // // import { LinearGradient } from "expo-linear-gradient";
// // // import { FlashList } from "@shopify/flash-list";
// // // import { useReadingProgressQuran } from "@/stores/useReadingProgressQuran";
// // // import i18n from "@/utils/i18n";
// // // import { returnSize } from "@/utils/sizes";

// // // const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// // // const { badgeSize } = returnSize(screenWidth, screenHeight);
// // // const SuraProgressBadge: React.FC<{ suraId: number; total?: number }> = ({
// // //   suraId,
// // //   total,
// // // }) => {
// // //   const progress = useReadingProgressQuran((s) => s.progressBySura[suraId]);

// // //   const totalVerses =
// // //     progress?.totalVerses && progress.totalVerses > 0
// // //       ? progress.totalVerses
// // //       : total ?? 0;

// // //   const percent =
// // //     totalVerses > 0 && (progress?.lastVerseNumber ?? 0) > 0
// // //       ? Math.max(
// // //           0,
// // //           Math.min(
// // //             100,
// // //             Math.round(((progress?.lastVerseNumber ?? 0) / totalVerses) * 100)
// // //           )
// // //         )
// // //       : 0;

// // //   const ringColor =
// // //     percent >= 100 ? "#2ECC71" : percent > 0 ? "#4A90E2" : "#C9CDD3";

// // //   return (
// // //     <View
// // //       style={{
// // //         justifyContent: "center",
// // //         alignItems: "center",
// // //         width: 55,
// // //         height: 55,
// // //         borderWidth: 4,
// // //         borderColor: ringColor,
// // //         borderRadius: 99,
// // //       }}
// // //     >
// // //       <ThemedText style={{ fontWeight: "700" }}>{percent}%</ThemedText>
// // //     </View>
// // //   );
// // // };

// // // const SuraList: React.FC = () => {
// // //   const { t } = useTranslation();
// // //   const { language, isArabic } = useLanguage();
// // //   const lang = (language ?? "de") as LanguageCode;

// // //   const [suras, setSuras] = useState<SuraRowType[]>([]);
// // //   const [juzList, setJuzList] = useState<
// // //     Array<{
// // //       juz: number;
// // //       label: string;
// // //       sura: number;
// // //       aya: number;
// // //     }>
// // //   >([]);
// // //   const [isLoading, setIsLoading] = useState(true);
// // //   const [viewMode, setViewMode] = useState("sura");
// // //   const colorScheme = useColorScheme() || "light";

// // //   // Animation for tab indicator
// // //   const slideAnim = useRef(new Animated.Value(0)).current;

// // //   useEffect(() => {
// // //     let cancelled = false;
// // //     (async () => {
// // //       try {
// // //         setIsLoading(true);
// // //         await whenDatabaseReady();

// // //         // Load both suras and juz data
// // //         const [suraRows, juzLabels] = await Promise.all([
// // //           getSurahList(),
// // //           getJuzButtonLabels(lang as Language),
// // //         ]);

// // //         if (!cancelled) {
// // //           setSuras(suraRows ?? []);
// // //           setJuzList(juzLabels ?? []);
// // //         }
// // //       } catch (error) {
// // //         console.error("Failed to load data:", error);
// // //         if (!cancelled) {
// // //           setSuras([]);
// // //           setJuzList([]);
// // //         }
// // //       } finally {
// // //         if (!cancelled) setIsLoading(false);
// // //       }
// // //     })();
// // //     return () => {
// // //       cancelled = true;
// // //     };
// // //   }, [lang]);

// // //   // Animate tab indicator when view mode changes
// // //   useEffect(() => {
// // //     Animated.spring(slideAnim, {
// // //       toValue: viewMode === "sura" ? 0 : viewMode === "juz" ? 1 : 2,
// // //       useNativeDriver: true,
// // //       tension: 50,
// // //       friction: 8,
// // //     }).start();
// // //   }, [viewMode]);

// // //   const getSuraName = (s: SuraRowType) => {
// // //     if (lang === "ar") return s.label ?? s.label_en ?? s.label_de ?? "";
// // //     if (lang === "de") return s.label_de ?? s.label_en ?? s.label ?? "";
// // //     return s.label_en ?? s.label_de ?? s.label ?? "";
// // //   };

// // //   const lastSuraNumber = useLastSuraStore((s) => s.lastSura);

// // //   const lastSuraRow = useMemo(
// // //     () =>
// // //       lastSuraNumber != null
// // //         ? suras.find((s) => s.id === lastSuraNumber) ?? null
// // //         : null,
// // //     [suras, lastSuraNumber]
// // //   );
// // //   const lastSuraTitle = lastSuraRow ? `${getSuraName(lastSuraRow)}` : "—";
// // //   const setTotalVerses = useReadingProgressQuran((s) => s.setTotalVerses);
// // //   const updateBookmarkProgress = useReadingProgressQuran(
// // //     (s) => s.updateBookmark
// // //   );
// // //   const markSuraDone = useCallback(
// // //     (suraId: number, totalVerses: number) => {
// // //       // ensure the store knows the total
// // //       setTotalVerses(suraId, totalVerses);
// // //       // set lastVerseNumber to total and lastIndex to total-1 (0-based)
// // //       updateBookmarkProgress(
// // //         suraId,
// // //         totalVerses,
// // //         Math.max(0, totalVerses - 1),
// // //         lang
// // //       );
// // //     },
// // //     [lang, setTotalVerses, updateBookmarkProgress]
// // //   );

// // //   const DoneToggleButton: React.FC<{
// // //     suraId: number;
// // //     total: number;
// // //     onPress: () => void;
// // //   }> = ({ suraId, total, onPress }) => {
// // //     const { t } = useTranslation();
// // //     const p = useReadingProgressQuran((s) => s.progressBySura[suraId]);
// // //     const totalVerses =
// // //       p?.totalVerses && p.totalVerses > 0 ? p.totalVerses : total;
// // //     const isComplete =
// // //       !!totalVerses && (p?.lastVerseNumber ?? 0) >= totalVerses;

// // //     return (
// // //       <TouchableOpacity onPress={onPress} style={{}}>
// // //         <ThemedText style={{ fontSize: 14 }}>
// // //           {isComplete ? t("remove") : t("done")}
// // //         </ThemedText>
// // //       </TouchableOpacity>
// // //     );
// // //   };

// // //   const confirmToggleComplete = useCallback(
// // //     (suraId: number, fallbackTotal: number) => {
// // //       const { progressBySura } = useReadingProgressQuran.getState();
// // //       const prog = progressBySura[suraId];

// // //       const total =
// // //         prog?.totalVerses && prog.totalVerses > 0
// // //           ? prog.totalVerses
// // //           : fallbackTotal;

// // //       const done = prog?.lastVerseNumber ?? 0;
// // //       const isComplete = !!total && done >= total;

// // //       if (isComplete) {
// // //         // Already 100% → ask to remove progress (undo to 0%)
// // //         Alert.alert(t("confirm"), t("removeProgress"), [
// // //           { text: t("cancel", "Cancel"), style: "cancel" },
// // //           {
// // //             text: t("reset", "Reset"),
// // //             style: "destructive",
// // //             onPress: () => updateBookmarkProgress(suraId, 0, -1, lang),
// // //           },
// // //         ]);
// // //       } else {
// // //         // Not complete → ask to mark as read (set to 100%)
// // //         Alert.alert(t("confirm"), t("markAsRead"), [
// // //           { text: t("cancel", "Cancel"), style: "cancel" },
// // //           {
// // //             text: t("yes", "Yes"),
// // //             onPress: () => markSuraDone(suraId, total || fallbackTotal),
// // //           },
// // //         ]);
// // //       }
// // //     },
// // //     [lang, markSuraDone, updateBookmarkProgress]
// // //   );

// // //   const renderSuraItem = ({ item }: { item: SuraRowType }) => {
// // //     const name = getSuraName(item);
// // //     const isMakki = !!item.makki;

// // //     return (
// // //       <TouchableOpacity
// // //         style={[
// // //           styles.card,
// // //           {
// // //             backgroundColor: Colors[colorScheme].background,
// // //           },
// // //         ]}
// // //         activeOpacity={0.6}
// // //         onPress={() =>
// // //           router.push({
// // //             pathname: "/knowledge/quran/sura",
// // //             params: {
// // //               suraId: item.id.toString(),
// // //             },
// // //           })
// // //         }
// // //       >
// // //         <View
// // //           style={[
// // //             styles.cardContent,
// // //             isArabic()
// // //               ? {
// // //                   flexDirection: "row-reverse",
// // //                 }
// // //               : { flexDirection: "row" },
// // //           ]}
// // //         >
// // //           {/* Number Badge */}
// // //           <View
// // //             style={[
// // //               styles.numberSection,
// // //               isArabic()
// // //                 ? {
// // //                     marginLeft: 25,
// // //                   }
// // //                 : {
// // //                     marginRight: 20,
// // //                   },
// // //             ]}
// // //           >
// // //             <LinearGradient
// // //               colors={isMakki ? ["#4A90E2", "#6BA3E5"] : ["#2ECC71", "#52D681"]}
// // //               style={styles.numberBadge}
// // //             >
// // //               <Text style={styles.numberText}>{item.id}</Text>
// // //             </LinearGradient>
// // //           </View>

// // //           {/* Content Section */}
// // //           <View style={styles.contentSection}>
// // //             <ThemedText
// // //               style={[styles.suraName, isArabic() && styles.suraNameAr]}
// // //             >
// // //               {name}
// // //             </ThemedText>

// // //             <View style={styles.metaContainer}>
// // //               <View
// // //                 style={[
// // //                   styles.metaBadge,
// // //                   {
// // //                     backgroundColor: Colors[colorScheme].contrast,
// // //                   },
// // //                 ]}
// // //               >
// // //                 <ThemedText style={[styles.metaText, { fontSize: badgeSize }]}>
// // //                   {item.nbAyat} {t("ayatCount").toUpperCase()}
// // //                 </ThemedText>
// // //               </View>

// // //               <View
// // //                 style={[
// // //                   styles.typeBadge,
// // //                   { backgroundColor: isMakki ? "#E8F2FD" : "#E8F8F0" },
// // //                 ]}
// // //               >
// // //                 <Text
// // //                   style={[
// // //                     styles.typeText,
// // //                     {
// // //                       color: isMakki ? "#4A90E2" : "#2ECC71",
// // //                       fontSize: badgeSize,
// // //                     },
// // //                   ]}
// // //                 >
// // //                   {isMakki
// // //                     ? t("makki").toUpperCase()
// // //                     : t("madani").toUpperCase()}
// // //                 </Text>
// // //               </View>
// // //             </View>
// // //           </View>
// // //           <View
// // //             style={{
// // //               width: 65,
// // //               flexDirection: "column",
// // //               justifyContent: "center",
// // //               alignItems: "center",
// // //               gap: 2,
// // //             }}
// // //           >
// // //             <SuraProgressBadge suraId={item.id} total={item.nbAyat} />
// // //             <DoneToggleButton
// // //               suraId={item.id}
// // //               total={item.nbAyat}
// // //               onPress={() => confirmToggleComplete(item.id, item.nbAyat)}
// // //             />
// // //           </View>
// // //           {/* Arrow */}
// // //           <View
// // //             style={[
// // //               styles.arrowSection,
// // //               isArabic()
// // //                 ? {
// // //                     marginRight: 15,
// // //                   }
// // //                 : {
// // //                     marginLeft: 12,
// // //                   },
// // //             ]}
// // //           >
// // //             <View
// // //               style={[
// // //                 styles.arrowCircle,
// // //                 {
// // //                   backgroundColor: Colors[colorScheme].contrast,
// // //                 },
// // //               ]}
// // //             >
// // //               <Entypo
// // //                 name={isArabic() ? "chevron-small-left" : "chevron-small-right"}
// // //                 size={30}
// // //                 color={Colors[colorScheme].defaultIcon}
// // //               />
// // //             </View>
// // //           </View>
// // //         </View>
// // //       </TouchableOpacity>
// // //     );
// // //   };

// // //   const renderJuzItem = ({ item }: { item: (typeof juzList)[0] }) => {
// // //     const juzNumber = item.juz;
// // //     const [surahName, ayahNumber] = item.label.split(" — ")[1]?.split(" ") ?? [
// // //       "",
// // //       "",
// // //     ];

// // //     return (
// // //       <TouchableOpacity
// // //         style={[
// // //           styles.juzCard,
// // //           {
// // //             backgroundColor: Colors[colorScheme].background,
// // //           },
// // //         ]}
// // //         activeOpacity={0.8}
// // //         onPress={() =>
// // //           router.push({
// // //             pathname: "/knowledge/quran/sura",
// // //             params: { juzId: String(item.juz) },
// // //           })
// // //         }
// // //       >
// // //         <View
// // //           style={[
// // //             styles.juzContent,
// // //             isArabic()
// // //               ? {
// // //                   flexDirection: "row-reverse",
// // //                 }
// // //               : { flexDirection: "row" },
// // //           ]}
// // //         >
// // //           <View style={[styles.juzNameAndNumber, {}]}>
// // //             <ThemedText style={styles.juzNumber}>
// // //               {t("juz")} {juzNumber}
// // //             </ThemedText>
// // //           </View>

// // //           <View style={styles.juzInfo}>
// // //             <ThemedText style={styles.juzSuraName}>
// // //               {item.label.split(" — ")[1] || ""}
// // //             </ThemedText>
// // //           </View>

// // //           <View
// // //             style={[
// // //               styles.arrowSection,
// // //               isArabic()
// // //                 ? {
// // //                     marginRight: 15,
// // //                   }
// // //                 : {
// // //                     marginLeft: 12,
// // //                   },
// // //             ]}
// // //           >
// // //             <View
// // //               style={[
// // //                 styles.arrowCircle,
// // //                 {
// // //                   backgroundColor: Colors[colorScheme].contrast,
// // //                 },
// // //               ]}
// // //             >
// // //               <Entypo
// // //                 name={isArabic() ? "chevron-small-left" : "chevron-small-right"}
// // //                 size={30}
// // //                 color={Colors[colorScheme].defaultIcon}
// // //               />
// // //             </View>
// // //           </View>
// // //         </View>
// // //       </TouchableOpacity>
// // //     );
// // //   };

// // //   if (isLoading) {
// // //     return (
// // //       <ThemedView style={styles.centerContainer}>
// // //         <LoadingIndicator size={"large"} />
// // //       </ThemedView>
// // //     );
// // //   }

// // //   return (
// // //     <ThemedView style={styles.container}>
// // //       <TouchableOpacity
// // //         style={styles.headerCard}
// // //         activeOpacity={lastSuraRow ? 0.85 : 1}
// // //         onPress={() => {
// // //           if (lastSuraRow) {
// // //             router.push({
// // //               pathname: "/knowledge/quran/sura",
// // //               params: { suraId: String(lastSuraRow.id) },
// // //             });
// // //           }
// // //         }}
// // //       >
// // //         <LinearGradient
// // //           colors={
// // //             colorScheme === "dark"
// // //               ? ["#2a3142", "#34495e"]
// // //               : ["#4A90E2", "#6BA3E5"]
// // //           }
// // //           start={{ x: 0, y: 0 }}
// // //           end={{ x: 1, y: 1 }}
// // //           style={styles.headerGradient}
// // //         >
// // //           <View style={styles.headerContent}>
// // //             <View style={styles.headerTextSection}>
// // //               <Text style={styles.lastReadLabel}>
// // //                 {t("lastRead").toUpperCase()}
// // //               </Text>
// // //               <Text
// // //                 style={styles.lastReadSura}
// // //                 numberOfLines={1}
// // //                 ellipsizeMode="tail"
// // //               >
// // //                 {lastSuraTitle}
// // //               </Text>
// // //               {lastSuraRow && (
// // //                 <View style={styles.lastReadMeta}>
// // //                   <Text style={styles.lastReadMetaText}>
// // //                     {t("ayatCount")}: {lastSuraRow.nbAyat}
// // //                   </Text>
// // //                 </View>
// // //               )}
// // //             </View>

// // //             <View style={styles.headerImageSection}>
// // //               <Image
// // //                 source={require("@/assets/images/quranImage2.png")}
// // //                 style={styles.headerImage}
// // //                 contentFit="contain"
// // //               />
// // //               <View style={styles.imageOverlay} />
// // //             </View>
// // //           </View>
// // //         </LinearGradient>
// // //       </TouchableOpacity>

// // //       {/* Tab Selector */}
// // //       <View style={styles.tabContainer}>
// // //         <View
// // //           style={[
// // //             styles.tabBackground,
// // //             {
// // //               backgroundColor: colorScheme === "dark" ? "#34495e" : "#F0F8FF",
// // //             },
// // //           ]}
// // //         >
// // //           <Animated.View
// // //             style={[
// // //               styles.tabIndicator,
// // //               {
// // //                 backgroundColor: colorScheme === "dark" ? "#4A90E2" : "#ffffff",
// // //                 transform: [
// // //                   {
// // //                     translateX: slideAnim.interpolate({
// // //                       inputRange: [0, 1, 2],
// // //                       outputRange: [
// // //                         4,
// // //                         4 + (screenWidth - 32) / 3,
// // //                         4 + (2 * (screenWidth - 32)) / 3,
// // //                       ],
// // //                       extrapolate: "clamp",
// // //                     }),
// // //                   },
// // //                 ],
// // //               },
// // //             ]}
// // //           />
// // //           {/* Sura */}
// // //           <TouchableOpacity
// // //             style={styles.tab}
// // //             onPress={() => setViewMode("sura")}
// // //             activeOpacity={0.7}
// // //           >
// // //             <ThemedText
// // //               style={[
// // //                 styles.tabText,
// // //                 viewMode === "sura" && styles.tabTextActive,
// // //               ]}
// // //             >
// // //               {t("sura")} (114)
// // //             </ThemedText>
// // //           </TouchableOpacity>
// // //           {/* Juz */}

// // //           <TouchableOpacity
// // //             style={styles.tab}
// // //             onPress={() => setViewMode("juz")}
// // //             activeOpacity={0.7}
// // //           >
// // //             <ThemedText
// // //               style={[
// // //                 styles.tabText,
// // //                 viewMode === "juz" && styles.tabTextActive,
// // //               ]}
// // //             >
// // //               {t("juz")} (30)
// // //             </ThemedText>
// // //           </TouchableOpacity>

// // //           {/* Page */}

// // //           <TouchableOpacity
// // //             style={styles.tab}
// // //             onPress={() => setViewMode("page")}
// // //             activeOpacity={0.7}
// // //           >
// // //             <ThemedText
// // //               style={[
// // //                 styles.tabText,
// // //                 viewMode === "page" && styles.tabTextActive,
// // //               ]}
// // //             >
// // //               {t("page")} (604)
// // //             </ThemedText>
// // //           </TouchableOpacity>
// // //         </View>
// // //       </View>

// // //       {/* Content List */}
// // //       {viewMode === "sura" ? (
// // //         <FlashList
// // //           data={suras}
// // //           extraData={[colorScheme, lang]}
// // //           renderItem={renderSuraItem}
// // //           keyExtractor={(item) => item.id.toString()}
// // //           showsVerticalScrollIndicator={false}
// // //           style={{}}
// // //           contentContainerStyle={styles.listContent}
// // //         />
// // //       ) : (
// // //         <FlashList
// // //           data={juzList}
// // //           extraData={[colorScheme, lang]}
// // //           renderItem={renderJuzItem}
// // //           keyExtractor={(item) => item.juz.toString()}
// // //           showsVerticalScrollIndicator={false}
// // //           contentContainerStyle={styles.listContent}
// // //         />
// // //       )}
// // //     </ThemedView>
// // //   );
// // // };

// // // const styles = StyleSheet.create({
// // //   container: {
// // //     flex: 1,
// // //   },

// // //   // Header Styles
// // //   headerCard: {
// // //     marginHorizontal: 16,
// // //     marginTop: 12,
// // //     marginBottom: 16,
// // //     borderRadius: 24,
// // //     overflow: "hidden",
// // //   },

// // //   headerGradient: {
// // //     borderRadius: 24,
// // //   },

// // //   headerContent: {
// // //     flexDirection: "row",
// // //     padding: 24,
// // //     minHeight: 140,
// // //   },

// // //   headerTextSection: {
// // //     flex: 1,
// // //     justifyContent: "center",
// // //     paddingRight: 16,
// // //   },

// // //   lastReadLabel: {
// // //     fontSize: 11,
// // //     fontWeight: "700",
// // //     color: "rgba(255, 255, 255, 0.7)",
// // //     letterSpacing: 1.2,
// // //     marginBottom: 8,
// // //   },

// // //   lastReadSura: {
// // //     fontSize: 24,
// // //     fontWeight: "800",
// // //     color: "#ffffff",
// // //     marginBottom: 12,
// // //     lineHeight: 30,
// // //   },

// // //   lastReadMeta: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //   },

// // //   lastReadMetaText: {
// // //     fontSize: 13,
// // //     color: "rgba(255, 255, 255, 0.8)",
// // //     fontWeight: "600",
// // //   },

// // //   headerImageSection: {
// // //     width: 120,
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //     position: "relative",
// // //   },

// // //   headerImage: {
// // //     width: 100,
// // //     height: 100,
// // //     opacity: 0.9,
// // //   },

// // //   imageOverlay: {
// // //     position: "absolute",
// // //     width: "100%",
// // //     height: "100%",
// // //     backgroundColor: "rgba(255, 255, 255, 0.05)",
// // //     borderRadius: 50,
// // //   },

// // //   tabContainer: {
// // //     marginHorizontal: 16,
// // //     marginBottom: 16,
// // //   },

// // //   tabBackground: {
// // //     flexDirection: "row",
// // //     borderRadius: 16,
// // //     padding: 4,
// // //     position: "relative",
// // //     borderWidth: 0.5,
// // //   },

// // //   tabIndicator: {
// // //     position: "absolute",
// // //     top: 4,
// // //     bottom: 4,
// // //     width: (screenWidth - 32)/3 - 8,
// // //     borderRadius: 12,
// // //     elevation: 2,
// // //     shadowColor: "#000",
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.1,
// // //     shadowRadius: 4,
// // //   },

// // //   tab: {
// // //     flex: 1,
// // //     paddingVertical: 12,
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //     zIndex: 1,
// // //   },

// // //   tabText: {
// // //     fontSize: 15,
// // //     fontWeight: "600",
// // //     opacity: 0.6,
// // //   },

// // //   tabTextActive: {
// // //     opacity: 1,
// // //     fontWeight: "700",
// // //   },

// // //   listContent: {
// // //     paddingBottom: 24,
// // //     paddingHorizontal: 10,
// // //   },

// // //   card: {
// // //     borderBottomWidth: 0.5,
// // //     overflow: "hidden",
// // //     elevation: 2,
// // //     shadowColor: "#000",
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.05,
// // //     shadowRadius: 8,
// // //   },

// // //   cardContent: {
// // //     alignItems: "stretch",
// // //     padding: 10,
// // //   },
// // //   numberSection: {},
// // //   numberBadge: {
// // //     width: 48,
// // //     height: 48,
// // //     borderRadius: 14,
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //   },

// // //   numberText: {
// // //     fontSize: 18,
// // //     fontWeight: "800",
// // //     color: "#ffffff",
// // //   },

// // //   contentSection: {
// // //     flex: 1,
// // //     justifyContent: "center",
// // //   },

// // //   suraName: {
// // //     fontSize: 18,
// // //     fontWeight: "700",
// // //     marginBottom: 8,
// // //     letterSpacing: 0.2,
// // //   },

// // //   suraNameAr: {
// // //     fontSize: 20,
// // //     textAlign: "right",
// // //     fontWeight: "600",
// // //     letterSpacing: 0,
// // //   },

// // //   metaContainer: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     gap: 3,
// // //   },

// // //   metaBadge: {
// // //     paddingHorizontal: 10,
// // //     height: 25,
// // //     borderRadius: 8,
// // //   },

// // //   metaText: {
// // //     fontWeight: "800",
// // //   },

// // //   typeBadge: {
// // //     paddingHorizontal: 10,
// // //     height: 25,
// // //     borderRadius: 8,
// // //     justifyContent: "center",
// // //   },

// // //   typeText: {
// // //     fontWeight: "800",
// // //   },

// // //   arrowSection: {},

// // //   arrowCircle: {
// // //     width: 32,
// // //     height: 32,
// // //     borderRadius: 16,
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //   },

// // //   juzCard: {
// // //     borderBottomWidth: 0.5,
// // //     overflow: "hidden",
// // //     elevation: 2,
// // //     shadowColor: "#000",
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.05,
// // //     shadowRadius: 8,
// // //   },

// // //   juzContent: {
// // //     padding: 15,
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     height: "100%",
// // //   },

// // //   juzNameAndNumber: {
// // //     width: 90,
// // //     alignItems: "center",
// // //     borderWidth: 1,
// // //     padding: 10,
// // //     borderRadius: 10,
// // //   },

// // //   juzNumber: {
// // //     fontSize: 20,
// // //     fontWeight: "700",
// // //     marginBottom: 4,
// // //   },

// // //   juzInfo: {
// // //     flex: 1,
// // //     alignItems: "center",
// // //   },

// // //   juzSuraName: {
// // //     fontSize: 19,
// // //     fontWeight: "500",
// // //     textAlign: "center",
// // //   },

// // //   centerContainer: {
// // //     flex: 1,
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //     paddingVertical: 48,
// // //   },
// // // });

// // // export default SuraList;

// // //! Ohne progress bei juz

// // // import type React from "react";
// // // import {
// // //   View,
// // //   Text,
// // //   FlatList,
// // //   TouchableOpacity,
// // //   StyleSheet,
// // //   useColorScheme,
// // //   Dimensions,
// // //   ScrollView,
// // //   Animated,
// // //   Alert,
// // // } from "react-native";
// // // import { useEffect, useMemo, useState, useRef, useCallback } from "react";
// // // import { useTranslation } from "react-i18next";
// // // import { Colors } from "../constants/Colors";
// // // import Entypo from "@expo/vector-icons/Entypo";
// // // import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
// // // import { whenDatabaseReady } from "@/db";
// // // import { useLanguage } from "@/contexts/LanguageContext";
// // // import {
// // //   Language,
// // //   LanguageCode,
// // //   SuraRowType,
// // //   JuzStartType,
// // // } from "@/constants/Types";
// // // import {
// // //   getSurahList,
// // //   getSurahDisplayName,
// // //   getJuzButtonLabels,
// // //   getPageButtonLabels,
// // // } from "@/db/queries/quran";
// // // import { ThemedView } from "./ThemedView";
// // // import { ThemedText } from "./ThemedText";
// // // import { LoadingIndicator } from "./LoadingIndicator";
// // // import { router } from "expo-router";
// // // import { Image } from "expo-image";
// // // import { useLastSuraStore } from "@/stores/useLastSura";
// // // import { LinearGradient } from "expo-linear-gradient";
// // // import { FlashList } from "@shopify/flash-list";
// // // import { useReadingProgressQuran } from "@/stores/useReadingProgressQuran";
// // // import i18n from "@/utils/i18n";
// // // import { returnSize } from "@/utils/sizes";

// // // const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// // // const { badgeSize } = returnSize(screenWidth, screenHeight);
// // // const SuraProgressBadge: React.FC<{ suraId: number; total?: number }> = ({
// // //   suraId,
// // //   total,
// // // }) => {
// // //   const progress = useReadingProgressQuran((s) => s.progressBySura[suraId]);

// // //   const totalVerses =
// // //     progress?.totalVerses && progress.totalVerses > 0
// // //       ? progress.totalVerses
// // //       : total ?? 0;

// // //   const percent =
// // //     totalVerses > 0 && (progress?.lastVerseNumber ?? 0) > 0
// // //       ? Math.max(
// // //           0,
// // //           Math.min(
// // //             100,
// // //             Math.round(((progress?.lastVerseNumber ?? 0) / totalVerses) * 100)
// // //           )
// // //         )
// // //       : 0;

// // //   const ringColor =
// // //     percent >= 100 ? "#2ECC71" : percent > 0 ? "#4A90E2" : "#C9CDD3";

// // //   return (
// // //     <View
// // //       style={{
// // //         justifyContent: "center",
// // //         alignItems: "center",
// // //         width: 60,
// // //         height: 60,
// // //         borderWidth: 4,
// // //         borderColor: ringColor,
// // //         borderRadius: 99,
// // //       }}
// // //     >
// // //       <ThemedText style={{ fontWeight: "700" }}>{percent}%</ThemedText>
// // //     </View>
// // //   );
// // // };

// // // const SuraList: React.FC = () => {
// // //   const { t } = useTranslation();
// // //   const { language, isArabic } = useLanguage();
// // //   const lang = (language ?? "de") as LanguageCode;

// // //   const [suras, setSuras] = useState<SuraRowType[]>([]);
// // //   const [juzList, setJuzList] = useState<
// // //     Array<{
// // //       juz: number;
// // //       label: string;
// // //       sura: number;
// // //       aya: number;
// // //     }>
// // //   >([]);
// // //   const [pageList, setPageList] = useState<
// // //     Array<{ page: number; label: string; sura: number; aya: number }>
// // //   >([]);
// // //   const [isLoading, setIsLoading] = useState(true);
// // //   const [viewMode, setViewMode] = useState("sura");
// // //   const colorScheme = useColorScheme() || "light";

// // //   // Animation for tab indicator
// // //   const slideAnim = useRef(new Animated.Value(0)).current;

// // //   useEffect(() => {
// // //     let cancelled = false;
// // //     (async () => {
// // //       try {
// // //         setIsLoading(true);
// // //         await whenDatabaseReady();

// // //         // Load both suras and juz data
// // //         const [suraRows, juzLabels, pageLabels] = await Promise.all([
// // //           getSurahList(),
// // //           getJuzButtonLabels(lang as Language),
// // //           getPageButtonLabels(lang as Language),
// // //         ]);

// // //         if (!cancelled) {
// // //           setSuras(suraRows ?? []);
// // //           setJuzList(juzLabels ?? []);
// // //           setPageList(pageLabels ?? []);
// // //         }
// // //       } catch (error) {
// // //         console.error("Failed to load data:", error);
// // //         if (!cancelled) {
// // //           setSuras([]);
// // //           setJuzList([]);
// // //         }
// // //       } finally {
// // //         if (!cancelled) setIsLoading(false);
// // //       }
// // //     })();
// // //     return () => {
// // //       cancelled = true;
// // //     };
// // //   }, [lang]);

// // //   // Animate tab indicator when view mode changes
// // //   useEffect(() => {
// // //     Animated.spring(slideAnim, {
// // //       toValue: viewMode === "sura" ? 0 : viewMode === "juz" ? 1 : 2,
// // //       useNativeDriver: true,
// // //       tension: 50,
// // //       friction: 8,
// // //     }).start();
// // //   }, [viewMode]);

// // //   const getSuraName = (s: SuraRowType) => {
// // //     if (lang === "ar") return s.label ?? s.label_en ?? s.label_de ?? "";
// // //     if (lang === "de") return s.label_de ?? s.label_en ?? s.label ?? "";
// // //     return s.label_en ?? s.label_de ?? s.label ?? "";
// // //   };

// // //   const lastSuraNumber = useLastSuraStore((s) => s.lastSura);

// // //   const lastSuraRow = useMemo(
// // //     () =>
// // //       lastSuraNumber != null
// // //         ? suras.find((s) => s.id === lastSuraNumber) ?? null
// // //         : null,
// // //     [suras, lastSuraNumber]
// // //   );
// // //   const lastSuraTitle = lastSuraRow ? `${getSuraName(lastSuraRow)}` : "—";
// // //   const setTotalVerses = useReadingProgressQuran((s) => s.setTotalVerses);
// // //   const updateBookmarkProgress = useReadingProgressQuran(
// // //     (s) => s.updateBookmark
// // //   );
// // //   const markSuraDone = useCallback(
// // //     (suraId: number, totalVerses: number) => {
// // //       // ensure the store knows the total
// // //       setTotalVerses(suraId, totalVerses);
// // //       // set lastVerseNumber to total and lastIndex to total-1 (0-based)
// // //       updateBookmarkProgress(
// // //         suraId,
// // //         totalVerses,
// // //         Math.max(0, totalVerses - 1),
// // //         lang
// // //       );
// // //     },
// // //     [lang, setTotalVerses, updateBookmarkProgress]
// // //   );

// // //   const DoneToggleButton: React.FC<{
// // //     suraId: number;
// // //     total: number;
// // //     onPress: () => void;
// // //   }> = ({ suraId, total, onPress }) => {
// // //     const { t } = useTranslation();
// // //     const p = useReadingProgressQuran((s) => s.progressBySura[suraId]);
// // //     const totalVerses =
// // //       p?.totalVerses && p.totalVerses > 0 ? p.totalVerses : total;
// // //     const isComplete =
// // //       !!totalVerses && (p?.lastVerseNumber ?? 0) >= totalVerses;

// // //     return (
// // //       <TouchableOpacity onPress={onPress} style={{}}>
// // //         <ThemedText style={{ fontSize: 14 }}>
// // //           {isComplete ? t("remove") : t("done")}
// // //         </ThemedText>
// // //       </TouchableOpacity>
// // //     );
// // //   };

// // //   const confirmToggleComplete = useCallback(
// // //     (suraId: number, fallbackTotal: number) => {
// // //       const { progressBySura } = useReadingProgressQuran.getState();
// // //       const prog = progressBySura[suraId];

// // //       const total =
// // //         prog?.totalVerses && prog.totalVerses > 0
// // //           ? prog.totalVerses
// // //           : fallbackTotal;

// // //       const done = prog?.lastVerseNumber ?? 0;
// // //       const isComplete = !!total && done >= total;

// // //       if (isComplete) {
// // //         // Already 100% → ask to remove progress (undo to 0%)
// // //         Alert.alert(t("confirm"), t("removeProgress"), [
// // //           { text: t("cancel", "Cancel"), style: "cancel" },
// // //           {
// // //             text: t("reset", "Reset"),
// // //             style: "destructive",
// // //             onPress: () => updateBookmarkProgress(suraId, 0, -1, lang),
// // //           },
// // //         ]);
// // //       } else {
// // //         // Not complete → ask to mark as read (set to 100%)
// // //         Alert.alert(t("confirm"), t("markAsRead"), [
// // //           { text: t("cancel", "Cancel"), style: "cancel" },
// // //           {
// // //             text: t("yes", "Yes"),
// // //             onPress: () => markSuraDone(suraId, total || fallbackTotal),
// // //           },
// // //         ]);
// // //       }
// // //     },
// // //     [lang, markSuraDone, updateBookmarkProgress]
// // //   );

// // //   const renderSuraItem = ({ item }: { item: SuraRowType }) => {
// // //     const name = getSuraName(item);
// // //     const isMakki = !!item.makki;

// // //     return (
// // //       <TouchableOpacity
// // //         style={[
// // //           styles.card,
// // //           {
// // //             backgroundColor: Colors[colorScheme].background,
// // //           },
// // //         ]}
// // //         activeOpacity={0.5}
// // //         onPress={() =>
// // //           router.push({
// // //             pathname: "/knowledge/quran/sura",
// // //             params: {
// // //               suraId: item.id.toString(),
// // //             },
// // //           })
// // //         }
// // //       >
// // //         <View
// // //           style={[
// // //             styles.cardContent,
// // //             isArabic()
// // //               ? {
// // //                   flexDirection: "row-reverse",
// // //                 }
// // //               : { flexDirection: "row" },
// // //           ]}
// // //         >
// // //           {/* Number Badge */}
// // //           <View
// // //             style={[
// // //               styles.numberSection,
// // //               isArabic()
// // //                 ? {
// // //                     marginLeft: 25,
// // //                   }
// // //                 : {
// // //                     marginRight: 20,
// // //                   },
// // //             ]}
// // //           >
// // //             <LinearGradient
// // //               colors={isMakki ? ["#4A90E2", "#6BA3E5"] : ["#2ECC71", "#52D681"]}
// // //               style={styles.numberBadge}
// // //             >
// // //               <Text style={styles.numberText}>{item.id}</Text>
// // //             </LinearGradient>
// // //           </View>

// // //           {/* Content Section */}
// // //           <View style={styles.contentSection}>
// // //             <ThemedText
// // //               style={[styles.suraName, isArabic() && styles.suraNameAr]}
// // //             >
// // //               {name}
// // //             </ThemedText>

// // //             <View style={styles.metaContainer}>
// // //               <View
// // //                 style={[
// // //                   styles.metaBadge,
// // //                   {
// // //                     backgroundColor: Colors[colorScheme].contrast,
// // //                   },
// // //                 ]}
// // //               >
// // //                 <ThemedText style={[styles.metaText, { fontSize: badgeSize }]}>
// // //                   {item.nbAyat} {t("ayatCount").toUpperCase()}
// // //                 </ThemedText>
// // //               </View>

// // //               <View
// // //                 style={[
// // //                   styles.typeBadge,
// // //                   { backgroundColor: isMakki ? "#E8F2FD" : "#E8F8F0" },
// // //                 ]}
// // //               >
// // //                 <Text
// // //                   style={[
// // //                     styles.typeText,
// // //                     {
// // //                       color: isMakki ? "#4A90E2" : "#2ECC71",
// // //                       fontSize: badgeSize,
// // //                     },
// // //                   ]}
// // //                 >
// // //                   {isMakki
// // //                     ? t("makki").toUpperCase()
// // //                     : t("madani").toUpperCase()}
// // //                 </Text>
// // //               </View>
// // //             </View>
// // //           </View>
// // //           <View
// // //             style={{
// // //               width: 65,
// // //               flexDirection: "column",
// // //               justifyContent: "center",
// // //               alignItems: "center",
// // //               gap: 2,
// // //             }}
// // //           >
// // //             <SuraProgressBadge suraId={item.id} total={item.nbAyat} />
// // //             <DoneToggleButton
// // //               suraId={item.id}
// // //               total={item.nbAyat}
// // //               onPress={() => confirmToggleComplete(item.id, item.nbAyat)}
// // //             />
// // //           </View>
// // //         </View>
// // //       </TouchableOpacity>
// // //     );
// // //   };

// // //   const renderJuzItem = ({ item }: { item: (typeof juzList)[0] }) => {
// // //     const juzNumber = item.juz;
// // //     const [surahName, ayahNumber] = item.label.split(" — ")[1]?.split(" ") ?? [
// // //       "",
// // //       "",
// // //     ];

// // //     return (
// // //       <TouchableOpacity
// // //         style={[
// // //           styles.juzCard,
// // //           {
// // //             backgroundColor: Colors[colorScheme].background,
// // //           },
// // //         ]}
// // //         activeOpacity={0.5}
// // //         onPress={() =>
// // //           router.push({
// // //             pathname: "/knowledge/quran/sura",
// // //             params: { juzId: String(item.juz) },
// // //           })
// // //         }
// // //       >
// // //         <View
// // //           style={[
// // //             styles.juzContent,
// // //             isArabic()
// // //               ? {
// // //                   flexDirection: "row-reverse",
// // //                 }
// // //               : { flexDirection: "row" },
// // //           ]}
// // //         >
// // //           <View style={{ flexDirection: "column" }}>
// // //             <View style={[styles.juzNameAndNumber, { }]}>
// // //               <ThemedText style={styles.juzNumber}>
// // //                 {t("juz")} {juzNumber}
// // //               </ThemedText>
// // //             </View>
// // //             <View style={[styles.juzInfo, {  }]}>
// // //               <ThemedText style={styles.juzSuraName}>
// // //                 {item.label.split(" — ")[1] || ""}
// // //               </ThemedText>
// // //             </View>
// // //           </View>
// // //           {/* Progress bar */}

// // //         </View>
// // //       </TouchableOpacity>
// // //     );
// // //   };

// // //   const renderPageItem = ({
// // //     item,
// // //   }: {
// // //     item: { page: number; label: string; sura: number; aya: number };
// // //   }) => {
// // //     return (
// // //       <TouchableOpacity
// // //         style={[
// // //           styles.juzCard, // reuse same card style
// // //           { backgroundColor: Colors[colorScheme].background },
// // //         ]}
// // //         activeOpacity={0.8}
// // //         onPress={() =>
// // //           router.push({
// // //             pathname: "/knowledge/quran/sura",
// // //             params: { pageId: String(item.page) }, // your reader should handle pageId
// // //           })
// // //         }
// // //       >
// // //         <View
// // //           style={[
// // //             styles.juzContent,
// // //             isArabic()
// // //               ? { flexDirection: "row-reverse" }
// // //               : { flexDirection: "row" },
// // //           ]}
// // //         >
// // //           <View style={[styles.juzNameAndNumber, {}]}>
// // //             <ThemedText style={styles.juzNumber}>
// // //               {t("page")} {item.page}
// // //             </ThemedText>
// // //           </View>

// // //           <View style={styles.juzInfo}>
// // //             <ThemedText style={styles.juzSuraName}>
// // //               {item.label.split(" — ")[1] || ""}
// // //             </ThemedText>
// // //           </View>
// // //         </View>
// // //       </TouchableOpacity>
// // //     );
// // //   };

// // //   if (isLoading) {
// // //     return (
// // //       <ThemedView style={styles.centerContainer}>
// // //         <LoadingIndicator size={"large"} />
// // //       </ThemedView>
// // //     );
// // //   }

// // //   return (
// // //     <ThemedView style={styles.container}>
// // //       <TouchableOpacity
// // //         style={styles.headerCard}
// // //         activeOpacity={lastSuraRow ? 0.85 : 1}
// // //         onPress={() => {
// // //           if (lastSuraRow) {
// // //             router.push({
// // //               pathname: "/knowledge/quran/sura",
// // //               params: { suraId: String(lastSuraRow.id) },
// // //             });
// // //           }
// // //         }}
// // //       >
// // //         <LinearGradient
// // //           colors={
// // //             colorScheme === "dark"
// // //               ? ["#2a3142", "#34495e"]
// // //               : ["#4A90E2", "#6BA3E5"]
// // //           }
// // //           start={{ x: 0, y: 0 }}
// // //           end={{ x: 1, y: 1 }}
// // //           style={styles.headerGradient}
// // //         >
// // //           <View style={styles.headerContent}>
// // //             <View style={styles.headerTextSection}>
// // //               <Text style={styles.lastReadLabel}>
// // //                 {t("lastRead").toUpperCase()}
// // //               </Text>
// // //               <Text
// // //                 style={styles.lastReadSura}
// // //                 numberOfLines={1}
// // //                 ellipsizeMode="tail"
// // //               >
// // //                 {lastSuraTitle}
// // //               </Text>
// // //               {lastSuraRow && (
// // //                 <View style={styles.lastReadMeta}>
// // //                   <Text style={styles.lastReadMetaText}>
// // //                     {t("ayatCount")}: {lastSuraRow.nbAyat}
// // //                   </Text>
// // //                 </View>
// // //               )}
// // //             </View>

// // //             <View style={styles.headerImageSection}>
// // //               <Image
// // //                 source={require("@/assets/images/quranImage2.png")}
// // //                 style={styles.headerImage}
// // //                 contentFit="contain"
// // //               />
// // //               <View style={styles.imageOverlay} />
// // //             </View>
// // //           </View>
// // //         </LinearGradient>
// // //       </TouchableOpacity>

// // //       {/* Tab Selector */}
// // //       <View style={styles.tabContainer}>
// // //         <View
// // //           style={[
// // //             styles.tabBackground,
// // //             {
// // //               backgroundColor: colorScheme === "dark" ? "#34495e" : "#F0F8FF",
// // //             },
// // //           ]}
// // //         >
// // //           <Animated.View
// // //             style={[
// // //               styles.tabIndicator,
// // //               {
// // //                 backgroundColor: colorScheme === "dark" ? "#4A90E2" : "#ffffff",
// // //                 transform: [
// // //                   {
// // //                     translateX: slideAnim.interpolate({
// // //                       inputRange: [0, 1, 2],
// // //                       outputRange: [
// // //                         4,
// // //                         4 + (screenWidth - 32) / 3,
// // //                         4 + (2 * (screenWidth - 32)) / 3,
// // //                       ],
// // //                       extrapolate: "clamp",
// // //                     }),
// // //                   },
// // //                 ],
// // //               },
// // //             ]}
// // //           />
// // //           {/* Sura */}
// // //           <TouchableOpacity
// // //             style={styles.tab}
// // //             onPress={() => setViewMode("sura")}
// // //             activeOpacity={0.7}
// // //           >
// // //             <ThemedText
// // //               style={[
// // //                 styles.tabText,
// // //                 viewMode === "sura" && styles.tabTextActive,
// // //               ]}
// // //             >
// // //               {t("sura")} (114)
// // //             </ThemedText>
// // //           </TouchableOpacity>
// // //           {/* Juz */}

// // //           <TouchableOpacity
// // //             style={styles.tab}
// // //             onPress={() => setViewMode("juz")}
// // //             activeOpacity={0.7}
// // //           >
// // //             <ThemedText
// // //               style={[
// // //                 styles.tabText,
// // //                 viewMode === "juz" && styles.tabTextActive,
// // //               ]}
// // //             >
// // //               {t("juz")} (30)
// // //             </ThemedText>
// // //           </TouchableOpacity>

// // //           {/* Page */}

// // //           <TouchableOpacity
// // //             style={styles.tab}
// // //             onPress={() => setViewMode("page")}
// // //             activeOpacity={0.7}
// // //           >
// // //             <ThemedText
// // //               style={[
// // //                 styles.tabText,
// // //                 viewMode === "page" && styles.tabTextActive,
// // //               ]}
// // //             >
// // //               {t("page")} ({pageList.length})
// // //             </ThemedText>
// // //           </TouchableOpacity>
// // //         </View>
// // //       </View>

// // //       {/* Content List */}
// // //       {viewMode === "sura" ? (
// // //         <FlashList
// // //           data={suras}
// // //           extraData={[colorScheme, lang]}
// // //           renderItem={renderSuraItem}
// // //           keyExtractor={(item) => item.id.toString()}
// // //           showsVerticalScrollIndicator={false}
// // //           contentContainerStyle={styles.listContent}
// // //         />
// // //       ) : viewMode === "juz" ? (
// // //         <FlashList
// // //           data={juzList}
// // //           extraData={[colorScheme, lang]}
// // //           renderItem={renderJuzItem}
// // //           keyExtractor={(item) => item.juz.toString()}
// // //           showsVerticalScrollIndicator={false}
// // //           contentContainerStyle={styles.listContent}
// // //         />
// // //       ) : (
// // //         <FlashList
// // //           data={pageList}
// // //           extraData={[colorScheme, lang]}
// // //           renderItem={renderPageItem}
// // //           keyExtractor={(item) => item.page.toString()}
// // //           showsVerticalScrollIndicator={false}
// // //           contentContainerStyle={styles.listContent}
// // //         />
// // //       )}
// // //     </ThemedView>
// // //   );
// // // };

// // // const styles = StyleSheet.create({
// // //   container: {
// // //     flex: 1,
// // //   },

// // //   // Header Styles
// // //   headerCard: {
// // //     marginHorizontal: 16,
// // //     marginTop: 12,
// // //     marginBottom: 16,
// // //     borderRadius: 24,
// // //     overflow: "hidden",
// // //   },

// // //   headerGradient: {
// // //     borderRadius: 24,
// // //   },

// // //   headerContent: {
// // //     flexDirection: "row",
// // //     padding: 24,
// // //     minHeight: 140,
// // //   },

// // //   headerTextSection: {
// // //     flex: 1,
// // //     justifyContent: "center",
// // //     paddingRight: 16,
// // //   },

// // //   lastReadLabel: {
// // //     fontSize: 11,
// // //     fontWeight: "700",
// // //     color: "rgba(255, 255, 255, 0.7)",
// // //     letterSpacing: 1.2,
// // //     marginBottom: 8,
// // //   },

// // //   lastReadSura: {
// // //     fontSize: 24,
// // //     fontWeight: "800",
// // //     color: "#ffffff",
// // //     marginBottom: 12,
// // //     lineHeight: 30,
// // //   },

// // //   lastReadMeta: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //   },

// // //   lastReadMetaText: {
// // //     fontSize: 13,
// // //     color: "rgba(255, 255, 255, 0.8)",
// // //     fontWeight: "600",
// // //   },

// // //   headerImageSection: {
// // //     width: 120,
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //     position: "relative",
// // //   },

// // //   headerImage: {
// // //     width: 100,
// // //     height: 100,
// // //     opacity: 0.9,
// // //   },

// // //   imageOverlay: {
// // //     position: "absolute",
// // //     width: "100%",
// // //     height: "100%",
// // //     backgroundColor: "rgba(255, 255, 255, 0.05)",
// // //     borderRadius: 50,
// // //   },

// // //   tabContainer: {
// // //     marginHorizontal: 16,
// // //     marginBottom: 16,
// // //   },

// // //   tabBackground: {
// // //     flexDirection: "row",
// // //     borderRadius: 16,
// // //     padding: 4,
// // //     position: "relative",
// // //     borderWidth: 0.5,
// // //   },

// // //   tabIndicator: {
// // //     position: "absolute",
// // //     top: 4,
// // //     bottom: 4,
// // //     width: (screenWidth - 32) / 3 - 8,
// // //     borderRadius: 12,
// // //     elevation: 2,
// // //     shadowColor: "#000",
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.1,
// // //     shadowRadius: 4,
// // //   },

// // //   tab: {
// // //     flex: 1,
// // //     paddingVertical: 12,
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //     zIndex: 1,
// // //   },

// // //   tabText: {
// // //     fontSize: 15,
// // //     fontWeight: "600",
// // //     opacity: 0.6,
// // //   },

// // //   tabTextActive: {
// // //     opacity: 1,
// // //     fontWeight: "700",
// // //   },

// // //   listContent: {
// // //     paddingBottom: 24,
// // //     paddingHorizontal: 10,
// // //   },

// // //   card: {
// // //     borderBottomWidth: 0.4,
// // //     overflow: "hidden",
// // //     elevation: 2,
// // //     shadowColor: "#000",
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.05,
// // //     shadowRadius: 8,
// // //   },

// // //   cardContent: {
// // //     alignItems: "center",
// // //     padding: 10,
// // //   },
// // //   numberSection: {},
// // //   numberBadge: {
// // //     width: 48,
// // //     height: 48,
// // //     borderRadius: 14,
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //   },

// // //   numberText: {
// // //     fontSize: 18,
// // //     fontWeight: "800",
// // //     color: "#ffffff",
// // //   },

// // //   contentSection: {
// // //     flex: 1,
// // //     justifyContent: "center",
// // //   },

// // //   suraName: {
// // //     fontSize: 20,
// // //     fontWeight: "700",
// // //     marginBottom: 8,
// // //     letterSpacing: 0.2,
// // //   },

// // //   suraNameAr: {
// // //     fontSize: 20,
// // //     textAlign: "right",
// // //     fontWeight: "600",
// // //     letterSpacing: 0,
// // //   },

// // //   metaContainer: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     gap: 10,
// // //   },

// // //   metaBadge: {
// // //     paddingHorizontal: 10,
// // //     height: 25,
// // //     borderRadius: 8,
// // //   },

// // //   metaText: {
// // //     fontWeight: "800",
// // //   },

// // //   typeBadge: {
// // //     paddingHorizontal: 10,
// // //     height: 25,
// // //     borderRadius: 8,
// // //     justifyContent: "center",
// // //   },

// // //   typeText: {
// // //     fontWeight: "800",
// // //   },

// // //   juzCard: {
// // //     borderBottomWidth: 0.5,
// // //     overflow: "hidden",
// // //     elevation: 2,
// // //     shadowColor: "#000",
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.05,
// // //     shadowRadius: 8,
// // //   },

// // //   juzContent: {
// // //     padding: 15,
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     height: "100%",
// // //   },

// // //   juzNameAndNumber: {},

// // //   juzNumber: {
// // //     fontSize: 25,
// // //     lineHeight: 28,
// // //     fontWeight: "500",
// // //   },

// // //   juzInfo: {
// // //     flex: 1,
// // //     alignItems: "center",
// // //   },

// // //   juzSuraName: {
// // //     fontSize: 16,
// // //     fontWeight: "400",
// // //     opacity: 0.8
// // //   },

// // //   centerContainer: {
// // //     flex: 1,
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //     paddingVertical: 48,
// // //   },
// // // });

// // // export default SuraList;

// // //! Ohne JUZ und page progress aber mit verändertem design
// // import type React from "react";
// // import {
// //   View,
// //   Text,
// //   FlatList,
// //   TouchableOpacity,
// //   StyleSheet,
// //   useColorScheme,
// //   Dimensions,
// //   ScrollView,
// //   Animated,
// //   Alert,
// // } from "react-native";
// // import { useEffect, useMemo, useState, useRef, useCallback } from "react";
// // import { useTranslation } from "react-i18next";
// // import { Colors } from "../constants/Colors";
// // import Entypo from "@expo/vector-icons/Entypo";
// // import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
// // import { whenDatabaseReady } from "@/db";
// // import { useLanguage } from "@/contexts/LanguageContext";
// // import {
// //   Language,
// //   LanguageCode,
// //   SuraRowType,
// //   JuzStartType,
// // } from "@/constants/Types";
// // import {
// //   getSurahList,
// //   getSurahDisplayName,
// //   getJuzButtonLabels,
// //   getPageButtonLabels,
// // } from "@/db/queries/quran";
// // import { ThemedView } from "./ThemedView";
// // import { ThemedText } from "./ThemedText";
// // import { LoadingIndicator } from "./LoadingIndicator";
// // import { router } from "expo-router";
// // import { Image } from "expo-image";
// // import { useLastSuraStore } from "@/stores/useLastSura";
// // import { LinearGradient } from "expo-linear-gradient";
// // import { FlashList } from "@shopify/flash-list";
// // import {
// //   useReadingProgressQuran,
// //   useJuzPercent,
// //   usePagePercent,
// // } from "@/stores/useReadingProgressQuran";
// // import i18n from "@/utils/i18n";
// // import { returnSize } from "@/utils/sizes";

// // const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// // const { badgeSize } = returnSize(screenWidth, screenHeight);
// // const SuraProgressBadge: React.FC<{ suraId: number; total?: number }> = ({
// //   suraId,
// //   total,
// // }) => {
// //   const progress = useReadingProgressQuran((s) => s.progressBySura[suraId]);

// //   const totalVerses =
// //     progress?.totalVerses && progress.totalVerses > 0
// //       ? progress.totalVerses
// //       : total ?? 0;

// //   const percent =
// //     totalVerses > 0 && (progress?.lastVerseNumber ?? 0) > 0
// //       ? Math.max(
// //           0,
// //           Math.min(
// //             100,
// //             Math.round(((progress?.lastVerseNumber ?? 0) / totalVerses) * 100)
// //           )
// //         )
// //       : 0;

// //   const ringColor =
// //     percent >= 100 ? "#2ECC71" : percent > 0 ? "#4A90E2" : "#C9CDD3";

// //   return (
// //     <View
// //       style={{
// //         justifyContent: "center",
// //         alignItems: "center",
// //         width: 60,
// //         height: 60,
// //         borderWidth: 4,
// //         borderColor: ringColor,
// //         borderRadius: 99,
// //       }}
// //     >
// //       <ThemedText style={{ fontWeight: "700" }}>{percent}%</ThemedText>
// //     </View>
// //   );
// // };

// // const SuraList: React.FC = () => {
// //   const { t } = useTranslation();
// //   const { language, isArabic } = useLanguage();
// //   const lang = (language ?? "de") as LanguageCode;

// //   const [suras, setSuras] = useState<SuraRowType[]>([]);
// //   const [juzList, setJuzList] = useState<
// //     Array<{
// //       juz: number;
// //       label: string;
// //       sura: number;
// //       aya: number;
// //     }>
// //   >([]);
// //   const [pageList, setPageList] = useState<
// //     Array<{ page: number; label: string; sura: number; aya: number }>
// //   >([]);
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [viewMode, setViewMode] = useState("sura");
// //   const colorScheme = useColorScheme() || "light";

// //   // Animation for tab indicator
// //   const slideAnim = useRef(new Animated.Value(0)).current;

// //   useEffect(() => {
// //     let cancelled = false;
// //     (async () => {
// //       try {
// //         setIsLoading(true);
// //         await whenDatabaseReady();

// //         // Load both suras and juz data
// //         const [suraRows, juzLabels, pageLabels] = await Promise.all([
// //           getSurahList(),
// //           getJuzButtonLabels(lang as Language),
// //           getPageButtonLabels(lang as Language),
// //         ]);

// //         if (!cancelled) {
// //           setSuras(suraRows ?? []);
// //           setJuzList(juzLabels ?? []);
// //           setPageList(pageLabels ?? []);
// //         }
// //       } catch (error) {
// //         console.error("Failed to load data:", error);
// //         if (!cancelled) {
// //           setSuras([]);
// //           setJuzList([]);
// //         }
// //       } finally {
// //         if (!cancelled) setIsLoading(false);
// //       }
// //     })();
// //     return () => {
// //       cancelled = true;
// //     };
// //   }, [lang]);

// //   // Animate tab indicator when view mode changes
// //   useEffect(() => {
// //     Animated.spring(slideAnim, {
// //       toValue: viewMode === "sura" ? 0 : viewMode === "juz" ? 1 : 2,
// //       useNativeDriver: true,
// //       tension: 50,
// //       friction: 8,
// //     }).start();
// //   }, [viewMode]);

// //   const getSuraName = (s: SuraRowType) => {
// //     if (lang === "ar") return s.label ?? s.label_en ?? s.label_de ?? "";
// //     if (lang === "de") return s.label_de ?? s.label_en ?? s.label ?? "";
// //     return s.label_en ?? s.label_de ?? s.label ?? "";
// //   };

// //   const lastSuraNumber = useLastSuraStore((s) => s.lastSura);

// //   const lastSuraRow = useMemo(
// //     () =>
// //       lastSuraNumber != null
// //         ? suras.find((s) => s.id === lastSuraNumber) ?? null
// //         : null,
// //     [suras, lastSuraNumber]
// //   );
// //   const lastSuraTitle = lastSuraRow ? `${getSuraName(lastSuraRow)}` : "—";
// //   const setTotalVerses = useReadingProgressQuran((s) => s.setTotalVerses);
// //   const updateBookmarkProgress = useReadingProgressQuran(
// //     (s) => s.updateBookmark
// //   );
// //   const markSuraDone = useCallback(
// //     (suraId: number, totalVerses: number) => {
// //       // ensure the store knows the total
// //       setTotalVerses(suraId, totalVerses);
// //       // set lastVerseNumber to total and lastIndex to total-1 (0-based)
// //       updateBookmarkProgress(
// //         suraId,
// //         totalVerses,
// //         Math.max(0, totalVerses - 1),
// //         lang
// //       );
// //     },
// //     [lang, setTotalVerses, updateBookmarkProgress]
// //   );

// //   const DoneToggleButton: React.FC<{
// //     suraId: number;
// //     total: number;
// //     onPress: () => void;
// //   }> = ({ suraId, total, onPress }) => {
// //     const { t } = useTranslation();
// //     const p = useReadingProgressQuran((s) => s.progressBySura[suraId]);
// //     const totalVerses =
// //       p?.totalVerses && p.totalVerses > 0 ? p.totalVerses : total;
// //     const isComplete =
// //       !!totalVerses && (p?.lastVerseNumber ?? 0) >= totalVerses;

// //     return (
// //       <TouchableOpacity onPress={onPress} style={{}}>
// //         <ThemedText style={{ fontSize: 14 }}>
// //           {isComplete ? t("remove") : t("done")}
// //         </ThemedText>
// //       </TouchableOpacity>
// //     );
// //   };

// //   const confirmToggleComplete = useCallback(
// //     (suraId: number, fallbackTotal: number) => {
// //       const { progressBySura } = useReadingProgressQuran.getState();
// //       const prog = progressBySura[suraId];

// //       const total =
// //         prog?.totalVerses && prog.totalVerses > 0
// //           ? prog.totalVerses
// //           : fallbackTotal;

// //       const done = prog?.lastVerseNumber ?? 0;
// //       const isComplete = !!total && done >= total;

// //       if (isComplete) {
// //         // Already 100% → ask to remove progress (undo to 0%)
// //         Alert.alert(t("confirm"), t("removeProgress"), [
// //           { text: t("cancel", "Cancel"), style: "cancel" },
// //           {
// //             text: t("reset", "Reset"),
// //             style: "destructive",
// //             onPress: () => updateBookmarkProgress(suraId, 0, -1, lang),
// //           },
// //         ]);
// //       } else {
// //         // Not complete → ask to mark as read (set to 100%)
// //         Alert.alert(t("confirm"), t("markAsRead"), [
// //           { text: t("cancel", "Cancel"), style: "cancel" },
// //           {
// //             text: t("yes", "Yes"),
// //             onPress: () => markSuraDone(suraId, total || fallbackTotal),
// //           },
// //         ]);
// //       }
// //     },
// //     [lang, markSuraDone, updateBookmarkProgress]
// //   );

// //   const renderSuraItem = ({ item }: { item: SuraRowType }) => {
// //     const name = getSuraName(item);
// //     const isMakki = !!item.makki;

// //     return (
// //       <TouchableOpacity
// //         style={[
// //           styles.card,
// //           {
// //             backgroundColor: Colors[colorScheme].background,
// //           },
// //         ]}
// //         activeOpacity={0.5}
// //         onPress={() =>
// //           router.push({
// //             pathname: "/knowledge/quran/sura",
// //             params: {
// //               suraId: item.id.toString(),
// //             },
// //           })
// //         }
// //       >
// //         <View
// //           style={[
// //             styles.cardContent,
// //             isArabic()
// //               ? {
// //                   flexDirection: "row-reverse",
// //                 }
// //               : { flexDirection: "row" },
// //           ]}
// //         >
// //           {/* Number Badge */}
// //           <View
// //             style={[
// //               styles.numberSection,
// //               isArabic()
// //                 ? {
// //                     marginLeft: 25,
// //                   }
// //                 : {
// //                     marginRight: 20,
// //                   },
// //             ]}
// //           >
// //             <LinearGradient
// //               colors={isMakki ? ["#4A90E2", "#6BA3E5"] : ["#2ECC71", "#52D681"]}
// //               style={styles.numberBadge}
// //             >
// //               <Text style={styles.numberText}>{item.id}</Text>
// //             </LinearGradient>
// //           </View>

// //           {/* Content Section */}
// //           <View style={styles.contentSection}>
// //             <ThemedText
// //               style={[styles.suraName, isArabic() && styles.suraNameAr]}
// //             >
// //               {name}
// //             </ThemedText>

// //             <View style={styles.metaContainer}>
// //               <View
// //                 style={[
// //                   styles.metaBadge,
// //                   {
// //                     backgroundColor: Colors[colorScheme].contrast,
// //                   },
// //                 ]}
// //               >
// //                 <ThemedText style={[styles.metaText, { fontSize: badgeSize }]}>
// //                   {item.nbAyat} {t("ayatCount").toUpperCase()}
// //                 </ThemedText>
// //               </View>

// //               <View
// //                 style={[
// //                   styles.typeBadge,
// //                   { backgroundColor: isMakki ? "#E8F2FD" : "#E8F8F0" },
// //                 ]}
// //               >
// //                 <Text
// //                   style={[
// //                     styles.typeText,
// //                     {
// //                       color: isMakki ? "#4A90E2" : "#2ECC71",
// //                       fontSize: badgeSize,
// //                     },
// //                   ]}
// //                 >
// //                   {isMakki
// //                     ? t("makki").toUpperCase()
// //                     : t("madani").toUpperCase()}
// //                 </Text>
// //               </View>
// //             </View>
// //           </View>
// //           <View
// //             style={{
// //               width: 65,
// //               flexDirection: "column",
// //               justifyContent: "center",
// //               alignItems: "center",
// //               gap: 2,
// //             }}
// //           >
// //             <SuraProgressBadge suraId={item.id} total={item.nbAyat} />
// //             <DoneToggleButton
// //               suraId={item.id}
// //               total={item.nbAyat}
// //               onPress={() => confirmToggleComplete(item.id, item.nbAyat)}
// //             />
// //           </View>
// //         </View>
// //       </TouchableOpacity>
// //     );
// //   };

// //   const renderJuzItem = ({ item }: { item: (typeof juzList)[0] }) => {
// //     const juzNumber = item.juz;
// //     const [surahName, ayahNumber] = item.label.split(" — ")[1]?.split(" ") ?? [
// //       "",
// //       "",
// //     ];

// //     return (
// //       <TouchableOpacity
// //         style={[
// //           styles.juzCard,
// //           {
// //             backgroundColor: Colors[colorScheme].background,
// //           },
// //         ]}
// //         activeOpacity={0.5}
// //         onPress={() =>
// //           router.push({
// //             pathname: "/knowledge/quran/sura",
// //             params: { juzId: String(item.juz) },
// //           })
// //         }
// //       >
// //         <View
// //           style={[
// //             styles.juzContent,
// //             isArabic()
// //               ? {
// //                   flexDirection: "row-reverse",
// //                 }
// //               : { flexDirection: "row" },
// //           ]}
// //         >
// //           <View style={{ flexDirection: "column" }}>
// //             <View style={[styles.juzNameAndNumber, {}]}>
// //               <ThemedText style={styles.juzNumber}>
// //                 {t("juz")} {juzNumber}
// //               </ThemedText>
// //             </View>
// //             <View style={[styles.juzInfo, {}]}>
// //               <ThemedText style={styles.juzSuraName}>
// //                 {item.label.split(" — ")[1] || ""}
// //               </ThemedText>
// //             </View>
// //           </View>
// //           {/* Progress bar */}
// //         </View>
// //       </TouchableOpacity>
// //     );
// //   };

// //   const renderPageItem = ({
// //     item,
// //   }: {
// //     item: { page: number; label: string; sura: number; aya: number };
// //   }) => {
// //     return (
// //       <TouchableOpacity
// //         style={[
// //           styles.juzCard, // reuse same card style
// //           { backgroundColor: Colors[colorScheme].background },
// //         ]}
// //         activeOpacity={0.8}
// //         onPress={() =>
// //           router.push({
// //             pathname: "/knowledge/quran/sura",
// //             params: { pageId: String(item.page) }, // your reader should handle pageId
// //           })
// //         }
// //       >
// //         <View
// //           style={[
// //             styles.juzContent,
// //             isArabic()
// //               ? { flexDirection: "row-reverse" }
// //               : { flexDirection: "row" },
// //           ]}
// //         >
// //           <View style={[styles.juzNameAndNumber, {}]}>
// //             <ThemedText style={styles.juzNumber}>
// //               {t("page")} {item.page}
// //             </ThemedText>
// //           </View>

// //           <View style={styles.juzInfo}>
// //             <ThemedText style={styles.juzSuraName}>
// //               {item.label.split(" — ")[1] || ""}
// //             </ThemedText>
// //           </View>
// //         </View>
// //       </TouchableOpacity>
// //     );
// //   };

// //   if (isLoading) {
// //     return (
// //       <ThemedView style={styles.centerContainer}>
// //         <LoadingIndicator size={"large"} />
// //       </ThemedView>
// //     );
// //   }

// //   return (
// //     <ThemedView style={styles.container}>
// //       <TouchableOpacity
// //         style={styles.headerCard}
// //         activeOpacity={lastSuraRow ? 0.85 : 1}
// //         onPress={() => {
// //           if (lastSuraRow) {
// //             router.push({
// //               pathname: "/knowledge/quran/sura",
// //               params: { suraId: String(lastSuraRow.id) },
// //             });
// //           }
// //         }}
// //       >
// //         <LinearGradient
// //           colors={
// //             colorScheme === "dark"
// //               ? ["#2a3142", "#34495e"]
// //               : ["#4A90E2", "#6BA3E5"]
// //           }
// //           start={{ x: 0, y: 0 }}
// //           end={{ x: 1, y: 1 }}
// //           style={styles.headerGradient}
// //         >
// //           <View style={styles.headerContent}>
// //             <View style={styles.headerTextSection}>
// //               <Text style={styles.lastReadLabel}>
// //                 {t("lastRead").toUpperCase()}
// //               </Text>
// //               <Text
// //                 style={styles.lastReadSura}
// //                 numberOfLines={1}
// //                 ellipsizeMode="tail"
// //               >
// //                 {lastSuraTitle}
// //               </Text>
// //               {lastSuraRow && (
// //                 <View style={styles.lastReadMeta}>
// //                   <Text style={styles.lastReadMetaText}>
// //                     {t("ayatCount")}: {lastSuraRow.nbAyat}
// //                   </Text>
// //                 </View>
// //               )}
// //             </View>

// //             <View style={styles.headerImageSection}>
// //               <Image
// //                 source={require("@/assets/images/quranImage2.png")}
// //                 style={styles.headerImage}
// //                 contentFit="contain"
// //               />
// //               <View style={styles.imageOverlay} />
// //             </View>
// //           </View>
// //         </LinearGradient>
// //       </TouchableOpacity>

// //       {/* Tab Selector */}
// //       <View style={styles.tabContainer}>
// //         <View
// //           style={[
// //             styles.tabBackground,
// //             {
// //               backgroundColor: colorScheme === "dark" ? "#34495e" : "#F0F8FF",
// //             },
// //           ]}
// //         >
// //           <Animated.View
// //             style={[
// //               styles.tabIndicator,
// //               {
// //                 backgroundColor: colorScheme === "dark" ? "#4A90E2" : "#ffffff",
// //                 transform: [
// //                   {
// //                     translateX: slideAnim.interpolate({
// //                       inputRange: [0, 1, 2],
// //                       outputRange: [
// //                         4,
// //                         4 + (screenWidth - 32) / 3,
// //                         4 + (2 * (screenWidth - 32)) / 3,
// //                       ],
// //                       extrapolate: "clamp",
// //                     }),
// //                   },
// //                 ],
// //               },
// //             ]}
// //           />
// //           {/* Sura */}
// //           <TouchableOpacity
// //             style={styles.tab}
// //             onPress={() => setViewMode("sura")}
// //             activeOpacity={0.7}
// //           >
// //             <ThemedText
// //               style={[
// //                 styles.tabText,
// //                 viewMode === "sura" && styles.tabTextActive,
// //               ]}
// //             >
// //               {t("sura")} (114)
// //             </ThemedText>
// //           </TouchableOpacity>
// //           {/* Juz */}

// //           <TouchableOpacity
// //             style={styles.tab}
// //             onPress={() => setViewMode("juz")}
// //             activeOpacity={0.7}
// //           >
// //             <ThemedText
// //               style={[
// //                 styles.tabText,
// //                 viewMode === "juz" && styles.tabTextActive,
// //               ]}
// //             >
// //               {t("juz")} (30)
// //             </ThemedText>
// //           </TouchableOpacity>

// //           {/* Page */}

// //           <TouchableOpacity
// //             style={styles.tab}
// //             onPress={() => setViewMode("page")}
// //             activeOpacity={0.7}
// //           >
// //             <ThemedText
// //               style={[
// //                 styles.tabText,
// //                 viewMode === "page" && styles.tabTextActive,
// //               ]}
// //             >
// //               {t("page")} ({pageList.length})
// //             </ThemedText>
// //           </TouchableOpacity>
// //         </View>
// //       </View>

// //       {/* Content List */}
// //       {viewMode === "sura" ? (
// //         <FlashList
// //           data={suras}
// //           extraData={[colorScheme, lang]}
// //           renderItem={renderSuraItem}
// //           keyExtractor={(item) => item.id.toString()}
// //           showsVerticalScrollIndicator={false}
// //           contentContainerStyle={styles.listContent}
// //         />
// //       ) : viewMode === "juz" ? (
// //         <FlashList
// //           data={juzList}
// //           extraData={[colorScheme, lang]}
// //           renderItem={renderJuzItem}
// //           keyExtractor={(item) => item.juz.toString()}
// //           showsVerticalScrollIndicator={false}
// //           contentContainerStyle={styles.listContent}
// //         />
// //       ) : (
// //         <FlashList
// //           data={pageList}
// //           extraData={[colorScheme, lang]}
// //           renderItem={renderPageItem}
// //           keyExtractor={(item) => item.page.toString()}
// //           showsVerticalScrollIndicator={false}
// //           contentContainerStyle={styles.listContent}
// //         />
// //       )}
// //     </ThemedView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //   },

// //   // Header Styles
// //   headerCard: {
// //     marginHorizontal: 16,
// //     marginTop: 12,
// //     marginBottom: 16,
// //     borderRadius: 24,
// //     overflow: "hidden",
// //   },

// //   headerGradient: {
// //     borderRadius: 24,
// //   },

// //   headerContent: {
// //     flexDirection: "row",
// //     padding: 24,
// //     minHeight: 140,
// //   },

// //   headerTextSection: {
// //     flex: 1,
// //     justifyContent: "center",
// //     paddingRight: 16,
// //   },

// //   lastReadLabel: {
// //     fontSize: 11,
// //     fontWeight: "700",
// //     color: "rgba(255, 255, 255, 0.7)",
// //     letterSpacing: 1.2,
// //     marginBottom: 8,
// //   },

// //   lastReadSura: {
// //     fontSize: 24,
// //     fontWeight: "800",
// //     color: "#ffffff",
// //     marginBottom: 12,
// //     lineHeight: 30,
// //   },

// //   lastReadMeta: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //   },

// //   lastReadMetaText: {
// //     fontSize: 13,
// //     color: "rgba(255, 255, 255, 0.8)",
// //     fontWeight: "600",
// //   },

// //   headerImageSection: {
// //     width: 120,
// //     justifyContent: "center",
// //     alignItems: "center",
// //     position: "relative",
// //   },

// //   headerImage: {
// //     width: 100,
// //     height: 100,
// //     opacity: 0.9,
// //   },

// //   imageOverlay: {
// //     position: "absolute",
// //     width: "100%",
// //     height: "100%",
// //     backgroundColor: "rgba(255, 255, 255, 0.05)",
// //     borderRadius: 50,
// //   },

// //   tabContainer: {
// //     marginHorizontal: 16,
// //     marginBottom: 16,
// //   },

// //   tabBackground: {
// //     flexDirection: "row",
// //     borderRadius: 16,
// //     padding: 4,
// //     position: "relative",
// //     borderWidth: 0.5,
// //   },

// //   tabIndicator: {
// //     position: "absolute",
// //     top: 4,
// //     bottom: 4,
// //     width: (screenWidth - 32) / 3 - 8,
// //     borderRadius: 12,
// //     elevation: 2,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //   },

// //   tab: {
// //     flex: 1,
// //     paddingVertical: 12,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     zIndex: 1,
// //   },

// //   tabText: {
// //     fontSize: 15,
// //     fontWeight: "600",
// //     opacity: 0.6,
// //   },

// //   tabTextActive: {
// //     opacity: 1,
// //     fontWeight: "700",
// //   },

// //   listContent: {
// //     paddingBottom: 24,
// //     paddingHorizontal: 10,
// //   },

// //   card: {
// //     borderBottomWidth: 0.4,
// //     overflow: "hidden",
// //     elevation: 2,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.05,
// //     shadowRadius: 8,
// //   },

// //   cardContent: {
// //     alignItems: "center",
// //     padding: 10,
// //   },
// //   numberSection: {},
// //   numberBadge: {
// //     width: 48,
// //     height: 48,
// //     borderRadius: 14,
// //     justifyContent: "center",
// //     alignItems: "center",
// //   },

// //   numberText: {
// //     fontSize: 18,
// //     fontWeight: "800",
// //     color: "#ffffff",
// //   },

// //   contentSection: {
// //     flex: 1,
// //     justifyContent: "center",
// //   },

// //   suraName: {
// //     fontSize: 20,
// //     fontWeight: "700",
// //     marginBottom: 8,
// //     letterSpacing: 0.2,
// //   },

// //   suraNameAr: {
// //     fontSize: 20,
// //     textAlign: "right",
// //     fontWeight: "600",
// //     letterSpacing: 0,
// //   },

// //   metaContainer: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 10,
// //   },

// //   metaBadge: {
// //     paddingHorizontal: 10,
// //     height: 25,
// //     borderRadius: 8,
// //   },

// //   metaText: {
// //     fontWeight: "800",
// //   },

// //   typeBadge: {
// //     paddingHorizontal: 10,
// //     height: 25,
// //     borderRadius: 8,
// //     justifyContent: "center",
// //   },

// //   typeText: {
// //     fontWeight: "800",
// //   },

// //   juzCard: {
// //     borderBottomWidth: 0.5,
// //     overflow: "hidden",
// //     elevation: 2,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.05,
// //     shadowRadius: 8,
// //   },

// //   juzContent: {
// //     padding: 15,
// //     flexDirection: "row",
// //     alignItems: "center",
// //     height: "100%",
// //   },

// //   juzNameAndNumber: {},

// //   juzNumber: {
// //     fontSize: 25,
// //     lineHeight: 28,
// //     fontWeight: "500",
// //   },

// //   juzInfo: {
// //     flex: 1,
// //     alignItems: "center",
// //   },

// //   juzSuraName: {
// //     fontSize: 16,
// //     fontWeight: "400",
// //     opacity: 0.8,
// //   },

// //   centerContainer: {
// //     flex: 1,
// //     justifyContent: "center",
// //     alignItems: "center",
// //     paddingVertical: 48,
// //   },
// // });

// // export default SuraList;

// import type React from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   useColorScheme,
//   Dimensions,
//   Animated,
//   Alert,
// } from "react-native";
// import { useEffect, useMemo, useState, useRef, useCallback } from "react";
// import { useTranslation } from "react-i18next";
// import { Colors } from "../constants/Colors";
// import Entypo from "@expo/vector-icons/Entypo";
// import { whenDatabaseReady } from "@/db";
// import { useLanguage } from "@/contexts/LanguageContext";
// import { Language, LanguageCode, SuraRowType } from "@/constants/Types";
// import {
//   getSurahList,
//   getSurahDisplayName,
//   getJuzButtonLabels,
//   getPageButtonLabels,
//   getJuzVerses,
//   getPageVerses,
// } from "@/db/queries/quran";
// import { ThemedView } from "./ThemedView";
// import { ThemedText } from "./ThemedText";
// import { LoadingIndicator } from "./LoadingIndicator";
// import { router } from "expo-router";
// import { Image } from "expo-image";
// import { useLastSuraStore } from "@/stores/useLastSura";
// import { LinearGradient } from "expo-linear-gradient";
// import { FlashList } from "@shopify/flash-list";
// import {
//   useReadingProgressQuran,
//   useJuzPercent,
//   usePagePercent,
// } from "@/stores/useReadingProgressQuran";
// import { returnSize } from "@/utils/sizes";

// const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
// const { badgeSize } = returnSize(screenWidth, screenHeight);

// /* ------------------------------------------------------------------ */
// /* Small UI helpers                                                    */
// /* ------------------------------------------------------------------ */

// const Bar: React.FC<{ percent: number }> = ({ percent }) => {
//   const cs = useColorScheme() || "light";
//   return (
//     <View
//       style={[
//         styles.progressTrack,
//         {
//           backgroundColor: Colors[cs].contrast,
//           borderColor: Colors[cs].border,
//         },
//       ]}
//     >
//       <View
//         style={[
//           styles.progressFill,
//           {
//             width: `${Math.max(0, Math.min(100, percent))}%`,
//             backgroundColor:
//               percent >= 100 ? "#2ECC71" : percent > 0 ? "#4A90E2" : "#C9CDD3",
//           },
//         ]}
//       />
//       <ThemedText style={styles.progressText}>{percent}%</ThemedText>
//     </View>
//   );
// };

// const JuzProgressPill: React.FC<{ juz: number }> = ({ juz }) => {
//   const percent = useJuzPercent(juz);
//   const seedRef = useRef(false);
//   const setTotalVersesForJuz = useReadingProgressQuran(
//     (s) => s.setTotalVersesForJuz
//   );
//   // Lazy seed total verses for this Juz (only when item is mounted/visible)
//   useEffect(() => {
//     if (seedRef.current) return;
//     seedRef.current = true;
//     (async () => {
//       try {
//         // language doesn't matter for counting; use "ar" for cheap join
//         const verses = await getJuzVerses("ar", juz);
//         setTotalVersesForJuz(juz, verses.length);
//       } catch (e) {
//         // ignore
//       }
//     })();
//   }, [juz, setTotalVersesForJuz]);

//   return <Bar percent={percent} />;
// };

// const PageProgressPill: React.FC<{ page: number }> = ({ page }) => {
//   const percent = usePagePercent(page);
//   const seedRef = useRef(false);
//   const setTotalVersesForPage = useReadingProgressQuran(
//     (s) => s.setTotalVersesForPage
//   );
//   // Lazy seed total verses for this Page (only when item is mounted/visible)
//   useEffect(() => {
//     if (seedRef.current) return;
//     seedRef.current = true;
//     (async () => {
//       try {
//         const verses = await getPageVerses("ar", page);
//         setTotalVersesForPage(page, verses.length);
//       } catch (e) {
//         // ignore
//       }
//     })();
//   }, [page, setTotalVersesForPage]);

//   return <Bar percent={percent} />;
// };

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
//         width: 60,
//         height: 60,
//         borderWidth: 4,
//         borderColor: ringColor,
//         borderRadius: 99,
//       }}
//     >
//       <ThemedText style={{ fontWeight: "700" }}>{percent}%</ThemedText>
//     </View>
//   );
// };

// // Reusable circular ring
// const CircleProgressBadge: React.FC<{ percent: number; size?: number }> = ({
//   percent,
//   size = 60,
// }) => {
//   const clamped = Math.max(0, Math.min(100, Math.round(percent)));
//   const ringColor =
//     clamped >= 100 ? "#2ECC71" : clamped > 0 ? "#4A90E2" : "#C9CDD3";

//   return (
//     <View
//       style={{
//         justifyContent: "center",
//         alignItems: "center",
//         width: size,
//         height: size,
//         borderWidth: 4,
//         borderColor: ringColor,
//         borderRadius: 999,
//       }}
//     >
//       <ThemedText style={{ fontWeight: "700" }}>{clamped}%</ThemedText>
//     </View>
//   );
// };

// // Juz ring — includes lazy seeding of total verses for that juz
// const JuzProgressBadge: React.FC<{ juz: number }> = ({ juz }) => {
//   const percent = useJuzPercent(juz);
//   const seeded = useRef(false);
//   const setTotalVersesForJuz = useReadingProgressQuran(
//     (s) => s.setTotalVersesForJuz
//   );

//   useEffect(() => {
//     if (seeded.current) return;
//     seeded.current = true;
//     (async () => {
//       try {
//         const v = await getJuzVerses("ar", juz); // count only
//         setTotalVersesForJuz(juz, v.length);
//       } catch {}
//     })();
//   }, [juz, setTotalVersesForJuz]);

//   return <CircleProgressBadge percent={percent} />;
// };

// // Page ring — includes lazy seeding of total verses for that page
// const PageProgressBadge: React.FC<{ page: number }> = ({ page }) => {
//   const percent = usePagePercent(page);
//   const seeded = useRef(false);
//   const setTotalVersesForPage = useReadingProgressQuran(
//     (s) => s.setTotalVersesForPage
//   );

//   useEffect(() => {
//     if (seeded.current) return;
//     seeded.current = true;
//     (async () => {
//       try {
//         const v = await getPageVerses("ar", page); // count only
//         setTotalVersesForPage(page, v.length);
//       } catch {}
//     })();
//   }, [page, setTotalVersesForPage]);

//   return <CircleProgressBadge percent={percent} />;
// };

// /* ------------------------------------------------------------------ */
// /* Main component                                                      */
// /* ------------------------------------------------------------------ */

// const SuraList: React.FC = () => {
//   const { t } = useTranslation();
//   const { language, isArabic } = useLanguage();
//   const lang = (language ?? "de") as LanguageCode;

//   const [suras, setSuras] = useState<SuraRowType[]>([]);
//   const [juzList, setJuzList] = useState<
//     Array<{ juz: number; label: string; sura: number; aya: number }>
//   >([]);
//   const [pageList, setPageList] = useState<
//     Array<{ page: number; label: string; sura: number; aya: number }>
//   >([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [viewMode, setViewMode] = useState<"sura" | "juz" | "page">("sura");
//   const colorScheme = useColorScheme() || "light";

//   // Animation for tab indicator
//   const slideAnim = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     let cancelled = false;
//     (async () => {
//       try {
//         setIsLoading(true);
//         await whenDatabaseReady();

//         const [suraRows, juzLabels, pageLabels] = await Promise.all([
//           getSurahList(),
//           getJuzButtonLabels(lang as Language),
//           getPageButtonLabels(lang as Language),
//         ]);

//         if (!cancelled) {
//           setSuras(suraRows ?? []);
//           setJuzList(juzLabels ?? []);
//           setPageList(pageLabels ?? []);
//         }
//       } catch (error) {
//         console.error("Failed to load data:", error);
//         if (!cancelled) {
//           setSuras([]);
//           setJuzList([]);
//           setPageList([]);
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
//       setTotalVerses(suraId, totalVerses);
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
//         Alert.alert(t("confirm"), t("removeProgress"), [
//           { text: t("cancel", "Cancel"), style: "cancel" },
//           {
//             text: t("reset", "Reset"),
//             style: "destructive",
//             onPress: () => updateBookmarkProgress(suraId, 0, -1, lang),
//           },
//         ]);
//       } else {
//         Alert.alert(t("confirm"), t("markAsRead"), [
//           { text: t("cancel", "Cancel"), style: "cancel" },
//           {
//             text: t("yes", "Yes"),
//             onPress: () => markSuraDone(suraId, total || fallbackTotal),
//           },
//         ]);
//       }
//     },
//     [lang, markSuraDone, updateBookmarkProgress, t]
//   );

//   const renderSuraItem = ({ item }: { item: SuraRowType }) => {
//     const name = getSuraName(item);
//     const isMakki = !!item.makki;

//     return (
//       <TouchableOpacity
//         style={[
//           styles.card,
//           { backgroundColor: Colors[colorScheme].background },
//         ]}
//         activeOpacity={0.5}
//         onPress={() =>
//           router.push({
//             pathname: "/knowledge/quran/sura",
//             params: { suraId: item.id.toString() },
//           })
//         }
//       >
//         <View
//           style={[
//             styles.cardContent,
//             isArabic()
//               ? { flexDirection: "row-reverse" }
//               : { flexDirection: "row" },
//           ]}
//         >
//           {/* Number Badge */}
//           <View
//             style={[
//               styles.numberSection,
//               isArabic() ? { marginLeft: 25 } : { marginRight: 20 },
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
//                   { backgroundColor: Colors[colorScheme].contrast },
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

//           {/* Progress + Done */}
//           <View style={styles.rightCol}>
//             <SuraProgressBadge suraId={item.id} total={item.nbAyat} />
//             <DoneToggleButton
//               suraId={item.id}
//               total={item.nbAyat}
//               onPress={() => confirmToggleComplete(item.id, item.nbAyat)}
//             />
//           </View>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   const renderJuzItem = ({ item }: { item: (typeof juzList)[0] }) => {
//     const juzNumber = item.juz;

//     return (
//       <TouchableOpacity
//         style={[
//           styles.juzCard,
//           { backgroundColor: Colors[colorScheme].background },
//         ]}
//         activeOpacity={0.5}
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
//               ? { flexDirection: "row-reverse" }
//               : { flexDirection: "row" },
//           ]}
//         >
//           <View style={{ flex: 1 }}>
//             <ThemedText style={styles.juzNumber}>
//               {t("juz")} {juzNumber}
//             </ThemedText>
//             <ThemedText style={styles.juzSuraName}>
//               {item.label.split(" — ")[1] || ""}
//             </ThemedText>
//           </View>

//           {/* Ring like sura */}
//           <View style={styles.rightCol}>
//             <JuzProgressBadge juz={juzNumber} />
//           </View>

//           <View style={isArabic() ? { marginRight: 12 } : { marginLeft: 12 }}>
//             <View
//               style={[
//                 styles.arrowCircle,
//                 { backgroundColor: Colors[colorScheme].contrast },
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

//   const renderPageItem = ({
//     item,
//   }: {
//     item: { page: number; label: string; sura: number; aya: number };
//   }) => {
//     return (
//       <TouchableOpacity
//         style={[
//           styles.juzCard,
//           { backgroundColor: Colors[colorScheme].background },
//         ]}
//         activeOpacity={0.8}
//         onPress={() =>
//           router.push({
//             pathname: "/knowledge/quran/sura",
//             params: { pageId: String(item.page) },
//           })
//         }
//       >
//         <View
//           style={[
//             styles.juzContent,
//             isArabic()
//               ? { flexDirection: "row-reverse" }
//               : { flexDirection: "row" },
//           ]}
//         >
//           <View style={{ flex: 1 }}>
//             <ThemedText style={styles.juzNumber}>
//               {t("page")} {item.page}
//             </ThemedText>
//             <ThemedText style={styles.juzSuraName}>
//               {item.label.split(" — ")[1] || ""}
//             </ThemedText>
//           </View>

//           {/* Ring like sura */}
//           <View style={styles.rightCol}>
//             <PageProgressBadge page={item.page} />
//           </View>

//           <View style={isArabic() ? { marginRight: 12 } : { marginLeft: 12 }}>
//             <View
//               style={[
//                 styles.arrowCircle,
//                 { backgroundColor: Colors[colorScheme].contrast },
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
//               <View className="imageOverlay" style={styles.imageOverlay} />
//             </View>
//           </View>
//         </LinearGradient>
//       </TouchableOpacity>

//       {/* Tab Selector */}
//       <View style={styles.tabContainer}>
//         <View
//           style={[
//             styles.tabBackground,
//             { backgroundColor: colorScheme === "dark" ? "#34495e" : "#F0F8FF" },
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
//               {t("page")} ({pageList.length})
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
//           contentContainerStyle={styles.listContent}
//         />
//       ) : viewMode === "juz" ? (
//         <FlashList
//           data={juzList}
//           extraData={[colorScheme, lang]}
//           renderItem={renderJuzItem}
//           keyExtractor={(item) => item.juz.toString()}
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={styles.listContent}
//         />
//       ) : (
//         <FlashList
//           data={pageList}
//           extraData={[colorScheme, lang]}
//           renderItem={renderPageItem}
//           keyExtractor={(item) => item.page.toString()}
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={styles.listContent}
//         />
//       )}
//     </ThemedView>
//   );
// };

// /* ------------------------------------------------------------------ */
// /* Styles                                                              */
// /* ------------------------------------------------------------------ */

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
//     width: (screenWidth - 32) / 3 - 8,
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
//     borderBottomWidth: 0.4,
//     overflow: "hidden",
//   },
//   cardContent: {
//     alignItems: "center",
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
//   contentSection: { flex: 1, justifyContent: "center" },
//   suraName: {
//     fontSize: 20,
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

//   metaContainer: { flexDirection: "row", alignItems: "center", gap: 10 },
//   metaBadge: { paddingHorizontal: 10, height: 25, borderRadius: 8 },
//   metaText: { fontWeight: "800" },
//   typeBadge: {
//     paddingHorizontal: 10,
//     height: 25,
//     borderRadius: 8,
//     justifyContent: "center",
//   },
//   typeText: { fontWeight: "800" },

//   rightCol: {
//     width: 70,
//     flexDirection: "column",
//     justifyContent: "center",
//     alignItems: "center",
//     gap: 4,
//   },

//   // Juz/Page cards (reusing styles)
//   juzCard: {
//     borderBottomWidth: 0.5,
//     overflow: "hidden",
//   },
//   juzContent: {
//     padding: 15,
//     flexDirection: "row",
//     alignItems: "center",
//     height: "100%",
//   },
//   juzNameAndNumber: {},
//   juzNumber: { fontSize: 25, lineHeight: 28, fontWeight: "500" },
//   juzInfo: { flex: 0, alignItems: "flex-start" },
//   juzSuraName: { fontSize: 16, fontWeight: "400", opacity: 0.8 },

//   arrowCircle: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   // progress bar styles
//   progressTrack: {
//     position: "relative",
//     height: 12,
//     borderRadius: 8,
//     borderWidth: 0.5,
//     overflow: "hidden",
//   },
//   progressFill: {
//     position: "absolute",
//     top: 0,
//     bottom: 0,
//     left: 0,
//     borderRadius: 8,
//   },
//   progressText: {
//     fontSize: 11,
//     fontWeight: "700",
//     lineHeight: 12,
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
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  Dimensions,
  Animated,
  Alert,
  InteractionManager,
  FlatList,
} from "react-native";
import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Colors } from "../constants/Colors";
import { whenDatabaseReady } from "@/db";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Language,
  LanguageCode,
  SuraRowType,
  QuranVerseType,
} from "@/constants/Types";
import {
  getSurahList,
  getJuzButtonLabels,
  getPageButtonLabels,
  getJuzVerses,
  getPageVerses,
} from "@/db/queries/quran";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { LoadingIndicator } from "./LoadingIndicator";
import { router } from "expo-router";
import { Image } from "expo-image";
import { useLastSuraStore } from "@/stores/useLastSura";
import { LinearGradient } from "expo-linear-gradient";
import { FlashList } from "@shopify/flash-list";
import {
  useReadingProgressQuran,
  useJuzPercent,
  usePagePercent,
} from "@/stores/useReadingProgressQuran";
import { returnSize } from "@/utils/sizes";

// ✅ Shared quran index helpers (centralized caching & indices)
import {
  seedJuzIndex,
  seedPageIndex,
  getJuzCoverageForSura,
  getPageCoverageForSura,
} from "@/utils/quranIndex";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const { badgeSize } = returnSize(screenWidth, screenHeight);

/* ------------------------------------------------------------------ */
/* Optional: pre-seed only the relevant pages for a surah              */
/* ------------------------------------------------------------------ */
async function preseedPagesForSurah(info: SuraRowType, firstBatchSize = 3) {
  if (!info?.startPage || !info?.endPage) return;
  const start = Math.max(1, info.startPage);
  const end = Math.max(start, info.endPage);
  const total = end - start + 1;
  const batch = Math.min(firstBatchSize, total);

  // Quick warmup batch so first bookmark/lookup is instant
  await Promise.all(
    Array.from({ length: batch }, (_, i) => seedPageIndex(start + i))
  );

  // Defer the rest so we don't block interactions
  if (batch < total) {
    InteractionManager.runAfterInteractions(() => {
      (async () => {
        for (let p = start + batch; p <= end; p++) {
          try {
            await seedPageIndex(p);
          } catch {}
        }
      })();
    });
  }
}

/* ------------------------------------------------------------------ */
/* Small UI helpers                                                    */
/* ------------------------------------------------------------------ */

const Bar: React.FC<{ percent: number }> = ({ percent }) => {
  const cs = useColorScheme() || "light";
  return (
    <View
      style={[
        styles.progressTrack,
        {
          backgroundColor: Colors[cs].contrast,
          borderColor: Colors[cs].border,
        },
      ]}
    >
      <View
        style={[
          styles.progressFill,
          {
            width: `${Math.max(0, Math.min(100, percent))}%`,
            backgroundColor:
              percent >= 100 ? "#2ECC71" : percent > 0 ? "#4A90E2" : "#C9CDD3",
          },
        ]}
      />
      <ThemedText style={styles.progressText}>{percent}%</ThemedText>
    </View>
  );
};

const JuzProgressPill: React.FC<{ juz: number }> = ({ juz }) => {
  const percent = useJuzPercent(juz);
  const seededRef = useRef(false);
  const setTotalVersesForJuz = useReadingProgressQuran(
    (s) => s.setTotalVersesForJuz
  );

  useEffect(() => {
    if (seededRef.current) return;
    seededRef.current = true;
    (async () => {
      try {
        const verses = (await getJuzVerses("ar", juz)) ?? [];
        await seedJuzIndex(juz, verses);
        setTotalVersesForJuz(juz, verses.length);
      } catch {}
    })();
  }, [juz, setTotalVersesForJuz]);

  return <Bar percent={percent} />;
};

const PageProgressPill: React.FC<{ page: number }> = ({ page }) => {
  const percent = usePagePercent(page);
  const seededRef = useRef(false);
  const setTotalVersesForPage = useReadingProgressQuran(
    (s) => s.setTotalVersesForPage
  );

  useEffect(() => {
    if (seededRef.current) return;
    seededRef.current = true;
    (async () => {
      try {
        const verses = (await getPageVerses("ar", page)) ?? [];
        await seedPageIndex(page, verses);
        setTotalVersesForPage(page, verses.length);
      } catch {}
    })();
  }, [page, setTotalVersesForPage]);

  return <Bar percent={percent} />;
};

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
        width: 60,
        height: 60,
        borderWidth: 4,
        borderColor: ringColor,
        borderRadius: 99,
      }}
    >
      <ThemedText style={{ fontWeight: "700" }}>{percent}%</ThemedText>
    </View>
  );
};

const CircleProgressBadge: React.FC<{ percent: number; size?: number }> = ({
  percent,
  size = 60,
}) => {
  const clamped = Math.max(0, Math.min(100, Math.round(percent)));
  const ringColor =
    clamped >= 100 ? "#2ECC71" : clamped > 0 ? "#4A90E2" : "#C9CDD3";
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        width: size,
        height: size,
        borderWidth: 4,
        borderColor: ringColor,
        borderRadius: 999,
      }}
    >
      <ThemedText style={{ fontWeight: "700" }}>{clamped}%</ThemedText>
    </View>
  );
};

const JuzProgressBadge: React.FC<{ juz: number }> = ({ juz }) => {
  const percent = useJuzPercent(juz);
  const seeded = useRef(false);
  const setTotalVersesForJuz = useReadingProgressQuran(
    (s) => s.setTotalVersesForJuz
  );
  useEffect(() => {
    if (seeded.current) return;
    seeded.current = true;
    (async () => {
      try {
        const v = (await getJuzVerses("ar", juz)) ?? [];
        await seedJuzIndex(juz, v);
        setTotalVersesForJuz(juz, v.length);
      } catch {}
    })();
  }, [juz, setTotalVersesForJuz]);
  return <CircleProgressBadge percent={percent} />;
};

const PageProgressBadge: React.FC<{ page: number }> = ({ page }) => {
  const percent = usePagePercent(page);
  const seeded = useRef(false);
  const setTotalVersesForPage = useReadingProgressQuran(
    (s) => s.setTotalVersesForPage
  );
  useEffect(() => {
    if (seeded.current) return;
    seeded.current = true;
    (async () => {
      try {
        const v = (await getPageVerses("ar", page)) ?? [];
        await seedPageIndex(page, v);
        setTotalVersesForPage(page, v.length);
      } catch {}
    })();
  }, [page, setTotalVersesForPage]);
  return <CircleProgressBadge percent={percent} />;
};

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */

const SuraList: React.FC = () => {
  const { t } = useTranslation();
  const { language, isArabic } = useLanguage();
  const lang = (language ?? "de") as LanguageCode;

  const [suras, setSuras] = useState<SuraRowType[]>([]);
  const [juzList, setJuzList] = useState<
    Array<{ juz: number; label: string; sura: number; aya: number }>
  >([]);
  const [pageList, setPageList] = useState<
    Array<{ page: number; label: string; sura: number; aya: number }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"sura" | "juz" | "page">("sura");
  const colorScheme = useColorScheme() || "light";

  // Animation for tab indicator
  const slideAnim = useRef(new Animated.Value(0)).current;

  // store actions
  const setTotalVerses = useReadingProgressQuran((s) => s.setTotalVerses);
  const updateBookmarkProgress = useReadingProgressQuran(
    (s) => s.updateBookmark
  );
  const setTotalVersesForJuz = useReadingProgressQuran(
    (s) => s.setTotalVersesForJuz
  );
  const updateJuzBookmark = useReadingProgressQuran((s) => s.updateJuzBookmark);
  const setTotalVersesForPage = useReadingProgressQuran(
    (s) => s.setTotalVersesForPage
  );
  const updatePageBookmark = useReadingProgressQuran(
    (s) => s.updatePageBookmark
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setIsLoading(true);
        await whenDatabaseReady();

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
          setPageList([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [lang]);

  // Warm coverage for the last-read surah after interactions
  const lastSuraNumber = useLastSuraStore((s) => s.lastSura);
  useEffect(() => {
    if (!lastSuraNumber) return;
    InteractionManager.runAfterInteractions(() => {
      getJuzCoverageForSura(lastSuraNumber).catch(() => {});
      getPageCoverageForSura(lastSuraNumber).catch(() => {});
    });
  }, [lastSuraNumber]);

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: viewMode === "sura" ? 0 : viewMode === "juz" ? 1 : 2,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start();
  }, [viewMode]);

  const getSuraName = (s: SuraRowType) => {
    if (lang === "ar") return s.label ?? s.label_en ?? "";
    if (lang === "de") return s.label_en ?? s.label ?? "";
    return s.label_en ?? s.label ?? "";
  };

  const lastSuraRow = useMemo(
    () =>
      lastSuraNumber != null
        ? suras.find((s) => s.id === lastSuraNumber) ?? null
        : null,
    [suras, lastSuraNumber]
  );
  const lastSuraTitle = lastSuraRow ? `${getSuraName(lastSuraRow)}` : "—";

  /* ----------------- Helpers: monotonic bump utilities ----------------- */
  const bumpSuraIfHigher = useCallback(
    (suraId: number, verseNumber: number) => {
      const state = useReadingProgressQuran.getState();
      const prev = state.progressBySura[suraId];
      if ((prev?.lastVerseNumber ?? 0) < verseNumber) {
        updateBookmarkProgress(
          suraId,
          verseNumber,
          Math.max(verseNumber - 1, -1),
          lang
        );
      }
    },
    [lang, updateBookmarkProgress]
  );

  const bumpJuzIfHigher = useCallback(
    (juz: number, uptoIndex1Based: number) => {
      const state = useReadingProgressQuran.getState();
      const prev = state.progressByJuz[juz];
      if ((prev?.lastVerseNumber ?? 0) < uptoIndex1Based) {
        updateJuzBookmark(juz, uptoIndex1Based, uptoIndex1Based - 1, lang);
      }
    },
    [lang, updateJuzBookmark]
  );

  const bumpPageIfHigher = useCallback(
    (page: number, uptoIndex1Based: number) => {
      const state = useReadingProgressQuran.getState();
      const prev = state.progressByPage[page];
      if ((prev?.lastVerseNumber ?? 0) < uptoIndex1Based) {
        updatePageBookmark(page, uptoIndex1Based, uptoIndex1Based - 1, lang);
      }
    },
    [lang, updatePageBookmark]
  );

  /* ----------------- Propagate: Juz/Page -> Surahs ----------------- */
  const propagateJuzToSuras = useCallback(
    async (juz: number) => {
      const verses = ((await getJuzVerses("ar", juz)) ??
        []) as QuranVerseType[];
      await seedJuzIndex(juz, verses);
      const maxBySura = new Map<number, number>();
      for (const v of verses) {
        maxBySura.set(v.sura, Math.max(maxBySura.get(v.sura) ?? 0, v.aya));
      }
      for (const [suraId, maxAya] of maxBySura.entries()) {
        bumpSuraIfHigher(suraId, maxAya);
      }
    },
    [bumpSuraIfHigher]
  );

  const propagatePageToSuras = useCallback(
    async (page: number) => {
      const verses = ((await getPageVerses("ar", page)) ??
        []) as QuranVerseType[];
      await seedPageIndex(page, verses);
      const maxBySura = new Map<number, number>();
      for (const v of verses) {
        maxBySura.set(v.sura, Math.max(maxBySura.get(v.sura) ?? 0, v.aya));
      }
      for (const [suraId, maxAya] of maxBySura.entries()) {
        bumpSuraIfHigher(suraId, maxAya);
      }
    },
    [bumpSuraIfHigher]
  );

  /* ----------------- Propagate: Surah -> Juz & Pages (fast via index) ---- */
  const propagateSuraDoneToJuzAndPages = useCallback(
    async (suraId: number, _totalVerses: number) => {
      const juzCoverage = await getJuzCoverageForSura(suraId);
      for (const { unit: j, idx, total } of juzCoverage) {
        setTotalVersesForJuz(j, total);
        bumpJuzIfHigher(j, idx + 1);
      }

      const pageCoverage = await getPageCoverageForSura(suraId);
      for (const { unit: p, idx, total } of pageCoverage) {
        setTotalVersesForPage(p, total);
        bumpPageIfHigher(p, idx + 1);
      }
    },
    [
      bumpJuzIfHigher,
      bumpPageIfHigher,
      setTotalVersesForJuz,
      setTotalVersesForPage,
    ]
  );

  /* ----------------- SURAH: Done/Reset ----------------- */
  const markSuraDone = useCallback(
    async (suraId: number, totalVerses: number) => {
      setTotalVerses(suraId, totalVerses);
      updateBookmarkProgress(
        suraId,
        totalVerses,
        Math.max(0, totalVerses - 1),
        lang
      );
      await propagateSuraDoneToJuzAndPages(suraId, totalVerses);
    },
    [
      lang,
      setTotalVerses,
      updateBookmarkProgress,
      propagateSuraDoneToJuzAndPages,
    ]
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
        Alert.alert(t("confirm"), t("removeProgress"), [
          { text: t("cancel"), style: "cancel" },
          {
            text: t("reset"),
            style: "destructive",
            onPress: () => updateBookmarkProgress(suraId, 0, -1, lang), // no down-propagation on reset
          },
        ]);
      } else {
        Alert.alert(t("confirm"), t("markAsRead"), [
          { text: t("cancel"), style: "cancel" },
          {
            text: t("yes"),
            onPress: () => markSuraDone(suraId, total || fallbackTotal),
          },
        ]);
      }
    },
    [lang, markSuraDone, updateBookmarkProgress, t]
  );

  /* ----------------- JUZ: Done/Reset + propagate to Suras ----------------- */
  const markJuzDone = useCallback(
    async (juz: number) => {
      const arr = (await getJuzVerses("ar", juz)) ?? [];
      await seedJuzIndex(juz, arr);
      setTotalVersesForJuz(juz, arr.length);
      bumpJuzIfHigher(juz, arr.length);
      await propagateJuzToSuras(juz); // bump affected suras
    },
    [bumpJuzIfHigher, propagateJuzToSuras, setTotalVersesForJuz]
  );

  const DoneToggleButtonJuz: React.FC<{ juz: number; onPress: () => void }> = ({
    juz,
    onPress,
  }) => {
    const { t } = useTranslation();
    const p = useReadingProgressQuran((s) => s.progressByJuz[juz]);
    const totalVerses = p?.totalVerses ?? 0;
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

  const confirmToggleCompleteJuz = useCallback(
    async (juz: number) => {
      const { progressByJuz } = useReadingProgressQuran.getState();
      const prog = progressByJuz[juz];
      const arr = (await getJuzVerses("ar", juz)) ?? [];
      await seedJuzIndex(juz, arr);
      setTotalVersesForJuz(juz, arr.length);
      const total = arr.length;
      const done = prog?.lastVerseNumber ?? 0;
      const isComplete = !!total && done >= total;

      if (isComplete) {
        Alert.alert(t("confirm"), t("removeProgress"), [
          { text: t("cancel"), style: "cancel" },
          {
            text: t("reset"),
            style: "destructive",
            onPress: () => updateJuzBookmark(juz, 0, -1, lang), // no down-propagation on reset
          },
        ]);
      } else {
        Alert.alert(t("confirm"), t("markAsRead"), [
          { text: t("cancel"), style: "cancel" },
          { text: t("yes"), onPress: () => markJuzDone(juz) },
        ]);
      }
    },
    [lang, markJuzDone, setTotalVersesForJuz, updateJuzBookmark, t]
  );

  /* ----------------- PAGE: Done/Reset + propagate to Suras ----------------- */
  const markPageDone = useCallback(
    async (page: number) => {
      const arr = (await getPageVerses("ar", page)) ?? [];
      await seedPageIndex(page, arr);
      setTotalVersesForPage(page, arr.length);
      bumpPageIfHigher(page, arr.length);
      await propagatePageToSuras(page);
    },
    [bumpPageIfHigher, propagatePageToSuras, setTotalVersesForPage]
  );

  const DoneToggleButtonPage: React.FC<{
    page: number;
    onPress: () => void;
  }> = ({ page, onPress }) => {
    const { t } = useTranslation();
    const p = useReadingProgressQuran((s) => s.progressByPage[page]);
    const totalVerses = p?.totalVerses ?? 0;
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

  const confirmToggleCompletePage = useCallback(
    async (page: number) => {
      const { progressByPage } = useReadingProgressQuran.getState();
      const prog = progressByPage[page];
      const arr = (await getPageVerses("ar", page)) ?? [];
      await seedPageIndex(page, arr);
      setTotalVersesForPage(page, arr.length);
      const total = arr.length;
      const done = prog?.lastVerseNumber ?? 0;
      const isComplete = !!total && done >= total;

      if (isComplete) {
        Alert.alert(t("confirm"), t("removeProgress"), [
          { text: t("cancel"), style: "cancel" },
          {
            text: t("reset"),
            style: "destructive",
            onPress: () => updatePageBookmark(page, 0, -1, lang), // no down-propagation on reset
          },
        ]);
      } else {
        Alert.alert(t("confirm"), t("markAsRead"), [
          { text: t("cancel"), style: "cancel" },
          { text: t("yes"), onPress: () => markPageDone(page) },
        ]);
      }
    },
    [lang, markPageDone, setTotalVersesForPage, updatePageBookmark, t]
  );

  /* ----------------- CLEAR ALL per section (active tab) ----------------- */

  const clearAllSuras = useCallback(() => {
    Alert.alert(t("confirm"), t("removeProgress"), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("reset"),
        style: "destructive",
        onPress: () => {
          InteractionManager.runAfterInteractions(() => {
            for (const s of suras) {
              updateBookmarkProgress(s.id, 0, -1, lang);
            }
          });
        },
      },
    ]);
  }, [lang, suras, t, updateBookmarkProgress]);

  const clearAllJuz = useCallback(() => {
    Alert.alert(t("confirm"), t("removeProgress"), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("reset"),
        style: "destructive",
        onPress: () => {
          InteractionManager.runAfterInteractions(() => {
            for (let j = 1; j <= 30; j++) {
              updateJuzBookmark(j, 0, -1, lang);
            }
          });
        },
      },
    ]);
  }, [lang, t, updateJuzBookmark]);

  const clearAllPages = useCallback(() => {
    Alert.alert(t("confirm"), t("removeProgress"), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("reset"),
        style: "destructive",
        onPress: () => {
          const totalPages = pageList.length > 0 ? pageList.length : 604;
          InteractionManager.runAfterInteractions(() => {
            for (let p = 1; p <= totalPages; p++) {
              updatePageBookmark(p, 0, -1, lang);
            }
          });
        },
      },
    ]);
  }, [lang, pageList.length, t, updatePageBookmark]);

  const renderClearAllBar = () => {
    let onPress: () => void = () => {};
    let label = "";
    if (viewMode === "sura") {
      onPress = clearAllSuras;
      label = t("clearAllBookmarksQuran");
    } else if (viewMode === "juz") {
      onPress = clearAllJuz;
      label = t("clearAllBookmarksQuran");
    } else {
      onPress = clearAllPages;
      label = t("clearAllBookmarksQuran");
    }
    return (
      <View style={styles.clearAllRow}>
        <TouchableOpacity onPress={onPress} style={styles.clearAllButton}>
          <Text style={styles.clearAllText}>{label}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  /* ----------------- Item renderers ----------------- */

  const renderSuraItem = ({ item }: { item: SuraRowType }) => {
    const name = getSuraName(item);
    const isMakki = !!item.makki;
    return (
      <TouchableOpacity
        style={[
          styles.card,
          { backgroundColor: Colors[colorScheme].background },
        ]}
        activeOpacity={0.5}
        onPress={() => {
          // Fire-and-forget: preseed relevant pages, then navigate
          preseedPagesForSurah(item).catch(() => {});
          router.push({
            pathname: "/knowledge/quran/sura",
            params: { suraId: item.id.toString() },
          });
        }}
      >
        <View
          style={[
            styles.cardContent,
            isArabic()
              ? { flexDirection: "row-reverse" }
              : { flexDirection: "row" },
          ]}
        >
          <View
            style={[
              styles.numberSection,
              isArabic() ? { marginLeft: 25 } : { marginRight: 20 },
            ]}
          >
            <LinearGradient
              colors={isMakki ? ["#4A90E2", "#6BA3E5"] : ["#2ECC71", "#52D681"]}
              style={styles.numberBadge}
            >
              <Text style={styles.numberText}>{item.id}</Text>
            </LinearGradient>
          </View>

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
                  { backgroundColor: Colors[colorScheme].contrast },
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

          <View style={styles.rightCol}>
            <SuraProgressBadge suraId={item.id} total={item.nbAyat} />
            <DoneToggleButton
              suraId={item.id}
              total={item.nbAyat}
              onPress={() => confirmToggleComplete(item.id, item.nbAyat)}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderJuzItem = ({ item }: { item: (typeof juzList)[0] }) => {
    const juzNumber = item.juz;
    return (
      <TouchableOpacity
        style={[
          styles.juzCard,
          { backgroundColor: Colors[colorScheme].background },
        ]}
        activeOpacity={0.5}
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
              ? { flexDirection: "row-reverse" }
              : { flexDirection: "row" },
          ]}
        >
          <View style={{ flex: 1 }}>
            <ThemedText style={styles.juzNumber}>
              {t("juz")} {juzNumber}
            </ThemedText>
            <ThemedText style={styles.juzSuraName}>
              {item.label.split(" — ")[1] || ""}
            </ThemedText>
          </View>

          <View style={styles.rightCol}>
            <JuzProgressBadge juz={juzNumber} />
            <DoneToggleButtonJuz
              juz={juzNumber}
              onPress={() => confirmToggleCompleteJuz(juzNumber)}
            />
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
          styles.juzCard,
          { backgroundColor: Colors[colorScheme].background },
        ]}
        activeOpacity={0.8}
        onPress={() =>
          router.push({
            pathname: "/knowledge/quran/sura",
            params: { pageId: String(item.page) },
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
          <View style={{ flex: 1 }}>
            <ThemedText style={styles.juzNumber}>
              {t("page")} {item.page}
            </ThemedText>
            <ThemedText style={styles.juzSuraName}>
              {item.label.split(" — ")[1] || ""}
            </ThemedText>
          </View>

          <View style={styles.rightCol}>
            <PageProgressBadge page={item.page} />
            <DoneToggleButtonPage
              page={item.page}
              onPress={() => confirmToggleCompletePage(item.page)}
            />
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
      {/* Header with last-read */}
      <LastReadHeader
        colorScheme={colorScheme as "light" | "dark"}
        lastSuraRow={lastSuraRow}
        lastSuraTitle={lastSuraTitle}
        t={t}
      />

      {/* Tab Selector */}
      <Tabs
        t={t}
        pageCount={pageList.length}
        colorScheme={colorScheme as "light" | "dark"}
        slideAnim={slideAnim}
        setViewMode={setViewMode}
        viewMode={viewMode}
      />

      {/* Clear all for current section */}
      {renderClearAllBar()}

      {/* Content */}
      {viewMode === "sura" ? (
        <FlatList
          data={suras}
          extraData={[colorScheme, lang]}
          renderItem={renderSuraItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      ) : viewMode === "juz" ? (
        <FlatList
          data={juzList}
          extraData={[colorScheme, lang]}
          renderItem={renderJuzItem}
          keyExtractor={(item) => item.juz.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <FlatList
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

/* --------------- small presentational subcomponents ---------------- */

const LastReadHeader: React.FC<{
  colorScheme: "light" | "dark";
  lastSuraRow: SuraRowType | null;
  lastSuraTitle: string;
  t: any;
}> = ({ colorScheme, lastSuraRow, lastSuraTitle, t }) => {
  return (
    <TouchableOpacity
      style={styles.headerCard}
      activeOpacity={lastSuraRow ? 0.85 : 1}
      onPress={() => {
        if (lastSuraRow) {
          // Optional warmup for pages of last-read surah
          preseedPagesForSurah(lastSuraRow).catch(() => {});
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
            <View className="imageOverlay" style={styles.imageOverlay} />
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const Tabs: React.FC<{
  t: any;
  pageCount: number;
  colorScheme: "light" | "dark";
  slideAnim: Animated.Value;
  viewMode: "sura" | "juz" | "page";
  setViewMode: (m: "sura" | "juz" | "page") => void;
}> = ({ t, pageCount, colorScheme, slideAnim, viewMode, setViewMode }) => {
  return (
    <View style={styles.tabContainer}>
      <View
        style={[
          styles.tabBackground,
          { backgroundColor: colorScheme === "dark" ? "#34495e" : "#F0F8FF" },
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
        <TouchableOpacity
          style={styles.tab}
          onPress={() => setViewMode("juz")}
          activeOpacity={0.7}
        >
          <ThemedText
            style={[styles.tabText, viewMode === "juz" && styles.tabTextActive]}
          >
            {t("juz")} (30)
          </ThemedText>
        </TouchableOpacity>
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
            {t("page")} ({pageCount})
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */

const styles = StyleSheet.create({
  container: { flex: 1 },

  headerCard: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 16,
    borderRadius: 24,
    overflow: "hidden",
  },
  headerGradient: { borderRadius: 24 },
  headerContent: { flexDirection: "row", padding: 24, minHeight: 140 },
  headerTextSection: { flex: 1, justifyContent: "center", paddingRight: 16 },
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
  lastReadMeta: { flexDirection: "row", alignItems: "center" },
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
  headerImage: { width: 100, height: 100, opacity: 0.9 },
  imageOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 50,
  },

  tabContainer: { marginHorizontal: 16, marginBottom: 16 },
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
  tabText: { fontSize: 15, fontWeight: "600", opacity: 0.6 },
  tabTextActive: { opacity: 1, fontWeight: "700" },

  /* NEW: Clear All row */
  clearAllRow: {
    marginHorizontal: 16,
    marginBottom: 20,
    alignItems: "flex-end",
  },
  clearAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "rgba(255,0,0,0.06)",
    borderWidth: 0.5,
    borderColor: "rgba(255,0,0,0.25)",
  },
  clearAllText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#c0392b",
  },

  listContent: { paddingBottom: 24, paddingHorizontal: 10 },

  card: { borderBottomWidth: 0.4, overflow: "hidden" },
  cardContent: { alignItems: "center", padding: 10 },
  numberSection: {},
  numberBadge: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  numberText: { fontSize: 18, fontWeight: "800", color: "#ffffff" },
  contentSection: { flex: 1, justifyContent: "center" },
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

  metaContainer: { flexDirection: "row", alignItems: "center", gap: 10 },
  metaBadge: { paddingHorizontal: 10, height: 25, borderRadius: 8 },
  metaText: { fontWeight: "800" },
  typeBadge: {
    paddingHorizontal: 10,
    height: 25,
    borderRadius: 8,
    justifyContent: "center",
  },
  typeText: { fontWeight: "800" },

  rightCol: {
    width: 70,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },

  juzCard: { borderBottomWidth: 0.5, overflow: "hidden" },
  juzContent: {
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  juzNameAndNumber: {},
  juzNumber: { fontSize: 25, lineHeight: 28, fontWeight: "500" },
  juzInfo: { flex: 0, alignItems: "flex-start" },
  juzSuraName: { fontSize: 16, fontWeight: "400", opacity: 0.8 },

  arrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  progressTrack: {
    position: "relative",
    height: 12,
    borderRadius: 8,
    borderWidth: 0.5,
    overflow: "hidden",
  },
  progressFill: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    borderRadius: 8,
  },
  progressText: {
    fontSize: 11,
    fontWeight: "700",
    lineHeight: 12,
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
