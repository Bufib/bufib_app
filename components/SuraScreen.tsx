// // // import type React from "react";
// // // import {
// // //   View,
// // //   StyleSheet,
// // //   TouchableOpacity,
// // //   useColorScheme,
// // //   Animated,
// // //   Alert,
// // // } from "react-native";
// // // import { useEffect, useMemo, useRef, useState, useCallback } from "react";
// // // import { useLocalSearchParams } from "expo-router";
// // // import { useTranslation } from "react-i18next";
// // // import { SafeAreaView } from "react-native-safe-area-context";
// // // import AntDesign from "@expo/vector-icons/AntDesign";
// // // import { Ionicons } from "@expo/vector-icons";
// // // import { Storage } from "expo-sqlite/kv-store";
// // // import RenderHTML from "react-native-render-html";
// // // import { useWindowDimensions } from "react-native";
// // // import BottomSheet, {
// // //   BottomSheetView,
// // //   BottomSheetBackdrop,
// // //   BottomSheetScrollView,
// // // } from "@gorhom/bottom-sheet";
// // // import { ThemedView } from "@/components/ThemedView";
// // // import { ThemedText } from "@/components/ThemedText";
// // // import { LoadingIndicator } from "@/components/LoadingIndicator";
// // // import HeaderLeftBackButton from "./HeaderLeftBackButton";
// // // import { useLastSuraStore } from "@/stores/useLastSura";

// // // import { Colors } from "@/constants/Colors";
// // // import { useLanguage } from "@/contexts/LanguageContext";
// // // import { SuraRowType, QuranVerseType, LanguageCode } from "@/constants/Types";

// // // import {
// // //   getSurahVerses,
// // //   getSurahDisplayName,
// // //   getSurahInfoByNumber,
// // // } from "@/db/queries/quran";
// // // import { whenDatabaseReady } from "@/db";
// // // import { FlashList } from "@shopify/flash-list";

// // // const HEADER_MAX_HEIGHT = 120;
// // // const HEADER_MIN_HEIGHT = 60;
// // // const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

// // // const SuraScreen: React.FC = () => {
// // //   const { t } = useTranslation();
// // //   const colorScheme = useColorScheme() || "light";
// // //   const { language, isArabic } = useLanguage();
// // //   const lang = (language ?? "de") as LanguageCode;
// // //   const { width } = useWindowDimensions();

// // //   // account for list + card paddings (16 + 16 on both sides)
// // //   const translitContentWidth = Math.max(0, width - 64);
// // //   const { suraId } = useLocalSearchParams<{ suraId: string }>();
// // //   const suraNumber = useMemo(() => Number(suraId ?? 1), [suraId]);

// // //   const [loading, setLoading] = useState(true);
// // //   const [hasTafsir, setHasTafsir] = useState(true);
// // //   const [verses, setVerses] = useState<QuranVerseType[]>([]);
// // //   const [arabicVerses, setArabicVerses] = useState<QuranVerseType[]>([]);
// // //   const [suraInfo, setSuraInfo] = useState<SuraRowType | null>(null);
// // //   const [displayName, setDisplayName] = useState<string>("");
// // //   const [bookmarkedVerses, setBookmarkedVerses] = useState<Set<number>>(
// // //     new Set()
// // //   );
// // //   const [selectedVerse, setSelectedVerse] = useState<QuranVerseType | null>(
// // //     null
// // //   );
// // //   const [selectedArabicVerse, setSelectedArabicVerse] =
// // //     useState<QuranVerseType | null>(null);

// // //   const setLastSura = useLastSuraStore((s) => s.setLastSura);
// // //   useEffect(() => {
// // //     setLastSura(suraNumber);
// // //   }, [suraNumber]);

// // //   // Animation refs
// // //   const scrollY = useRef(new Animated.Value(0)).current;

// // //   // Bottom Sheet ref
// // //   const bottomSheetRef = useRef<BottomSheet>(null);
// // //   const snapPoints = useMemo(() => ["75%"], []);

// // //   useEffect(() => {
// // //     let cancelled = false;
// // //     (async () => {
// // //       try {
// // //         setLoading(true);
// // //         await whenDatabaseReady();

// // //         const [vers, arabicVers, info, name] = await Promise.all([
// // //           getSurahVerses(lang, suraNumber), // includes transliteration (via JOIN)
// // //           getSurahVerses("ar", suraNumber), // Arabic lines
// // //           getSurahInfoByNumber(suraNumber),
// // //           getSurahDisplayName(suraNumber, lang),
// // //         ]);

// // //         const loadedBookmarks = await loadBookmarkedVerses(suraNumber);

// // //         if (!cancelled) {
// // //           setVerses((vers ?? []) as QuranVerseType[]);
// // //           setArabicVerses((arabicVers ?? []) as QuranVerseType[]);
// // //           setSuraInfo(info ?? null);
// // //           setDisplayName(name ?? "");
// // //           setBookmarkedVerses(loadedBookmarks);
// // //         }
// // //       } catch (error) {
// // //         console.error("Failed to load surah:", error);
// // //         if (!cancelled) {
// // //           setVerses([]);
// // //           setArabicVerses([]);
// // //           setSuraInfo(null);
// // //           setDisplayName("");
// // //         }
// // //       } finally {
// // //         if (!cancelled) setLoading(false);
// // //       }
// // //     })();
// // //     return () => {
// // //       cancelled = true;
// // //     };
// // //   }, [lang, suraNumber]);

// // //   // O(1) verse lookup for Arabic lines
// // //   const arabicByAya = useMemo(
// // //     () => new Map(arabicVerses.map((v) => [v.aya, v])),
// // //     [arabicVerses]
// // //   );

// // //   // Handle opening the info bottom sheet
// // //   const handleOpenInfo = useCallback(
// // //     (verse: QuranVerseType, arabicVerse: QuranVerseType | undefined) => {
// // //       setSelectedVerse(verse);
// // //       setSelectedArabicVerse(arabicVerse || null);
// // //       bottomSheetRef.current?.expand();
// // //     },
// // //     []
// // //   );

// // //   // Render backdrop for bottom sheet
// // //   const renderBackdrop = useCallback(
// // //     (props: any) => (
// // //       <BottomSheetBackdrop
// // //         {...props}
// // //         disappearsOnIndex={-1}
// // //         appearsOnIndex={0}
// // //         opacity={0.5}
// // //       />
// // //     ),
// // //     []
// // //   );

// // //   const handleBookmarkVerse = async (verseNumber: number) => {
// // //     try {
// // //       const bookmarksKey = `bookmarks_sura_${suraNumber}`;

// // //       // Tapping the same verse toggles it off
// // //       if (bookmarkedVerses.has(verseNumber)) {
// // //         const newSet = new Set(bookmarkedVerses);
// // //         newSet.delete(verseNumber);
// // //         setBookmarkedVerses(newSet);
// // //         const arr = Array.from(newSet);
// // //         if (arr.length) {
// // //           await Storage.setItemAsync(bookmarksKey, JSON.stringify(arr));
// // //         } else {
// // //           await Storage.removeItemAsync(bookmarksKey);
// // //         }
// // //         await Storage.removeItemAsync(
// // //           `bookmark_s${suraNumber}_v${verseNumber}_${lang}`
// // //         );
// // //         return;
// // //       }
// // //       // Another verse is already bookmarked → ask to replace
// // //       if (bookmarkedVerses.size > 0) {
// // //         const prev = Array.from(bookmarkedVerses)[0];
// // //         Alert.alert(t("confirmBookmarkChange"), t("bookmarkReplaceQuestion"), [
// // //           { text: t("cancel"), style: "cancel" },
// // //           {
// // //             text: t("change"),
// // //             style: "destructive",
// // //             onPress: async () => {
// // //               // remove all previous individual entries
// // //               for (const v of bookmarkedVerses) {
// // //                 await Storage.removeItemAsync(
// // //                   `bookmark_s${suraNumber}_v${v}_${lang}`
// // //                 );
// // //               }
// // //               const newSet = new Set<number>([verseNumber]);
// // //               setBookmarkedVerses(newSet);
// // //               await Storage.setItemAsync(
// // //                 bookmarksKey,
// // //                 JSON.stringify([verseNumber])
// // //               );
// // //               await Storage.setItemAsync(
// // //                 `bookmark_s${suraNumber}_v${verseNumber}_${lang}`,
// // //                 JSON.stringify({
// // //                   suraNumber,
// // //                   verseNumber,
// // //                   language: lang,
// // //                   suraName: displayName,
// // //                   timestamp: Date.now(),
// // //                 })
// // //               );
// // //             },
// // //           },
// // //         ]);
// // //         return;
// // //       }

// // //       // No existing bookmark -> add this one
// // //       const newSet = new Set<number>([verseNumber]);
// // //       setBookmarkedVerses(newSet);
// // //       await Storage.setItemAsync(bookmarksKey, JSON.stringify([verseNumber]));
// // //       await Storage.setItemAsync(
// // //         `bookmark_s${suraNumber}_v${verseNumber}_${lang}`,
// // //         JSON.stringify({
// // //           suraNumber,
// // //           verseNumber,
// // //           language: lang,
// // //           suraName: displayName,
// // //           timestamp: Date.now(),
// // //         })
// // //       );
// // //     } catch (error) {
// // //       console.error("Error handling bookmark:", error);
// // //     }
// // //   };

// // //   const headerHeight = scrollY.interpolate({
// // //     inputRange: [0, HEADER_SCROLL_DISTANCE],
// // //     outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
// // //     extrapolate: "clamp",
// // //   });

// // //   const headerTitleOpacity = scrollY.interpolate({
// // //     inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
// // //     outputRange: [1, 0.5, 0],
// // //     extrapolate: "clamp",
// // //   });

// // //   const headerSubtitleOpacity = scrollY.interpolate({
// // //     inputRange: [0, HEADER_SCROLL_DISTANCE / 3],
// // //     outputRange: [1, 0],
// // //     extrapolate: "clamp",
// // //   });

// // //   const headerTitleScale = scrollY.interpolate({
// // //     inputRange: [0, HEADER_SCROLL_DISTANCE],
// // //     outputRange: [1, 0.8],
// // //     extrapolate: "clamp",
// // //   });

// // //   const badgeOpacity = scrollY.interpolate({
// // //     inputRange: [0, HEADER_SCROLL_DISTANCE / 2],
// // //     outputRange: [1, 0],
// // //     extrapolate: "clamp",
// // //   });

// // //   const AnimatedHeader = () => {
// // //     const isMakki = !!suraInfo?.makki;
// // //     return (
// // //       <Animated.View
// // //         style={[
// // //           styles.headerWrapper,
// // //           {
// // //             height: headerHeight,
// // //             backgroundColor: Colors[colorScheme].background,
// // //           },
// // //         ]}
// // //       >
// // //         <SafeAreaView edges={["top"]} style={styles.headerContainer}>
// // //           <View style={styles.headerContent}>
// // //             <HeaderLeftBackButton />
// // //             <Animated.View
// // //               style={[
// // //                 styles.headerTextContainer,
// // //                 {
// // //                   opacity: headerTitleOpacity,
// // //                   transform: [{ scale: headerTitleScale }],
// // //                 },
// // //               ]}
// // //             >
// // //               <ThemedText
// // //                 type="title"
// // //                 style={[styles.suraName, isArabic() && styles.suraNameAr]}
// // //               >
// // //                 {displayName || suraInfo?.label_en || suraInfo?.label || ""} (
// // //                 {suraNumber})
// // //               </ThemedText>
// // //               <Animated.View style={{ opacity: headerSubtitleOpacity }}>
// // //                 <ThemedText style={styles.subMeta} numberOfLines={1}>
// // //                   {t("ayatCount")}: {suraInfo?.nbAyat ?? "—"} ·{" "}
// // //                   {isMakki ? t("makki") : t("madani")}
// // //                 </ThemedText>
// // //               </Animated.View>
// // //             </Animated.View>
// // //           </View>
// // //         </SafeAreaView>
// // //       </Animated.View>
// // //     );
// // //   };

// // //   const renderVerse = ({ item }: { item: QuranVerseType; index: number }) => {
// // //     const arabicVerse = arabicByAya.get(item.aya);
// // //     const isVerseBookmarked = bookmarkedVerses.has(item.aya);
// // //     const transliterationText = item.transliteration ?? "";

// // //     return (
// // //       <View
// // //         style={[
// // //           styles.verseCard,
// // //           {
// // //             backgroundColor: isVerseBookmarked
// // //               ? Colors.universal.primary
// // //               : Colors[colorScheme].contrast,
// // //           },
// // //         ]}
// // //       >
// // //         <View style={styles.verseHeader}>
// // //           <View style={styles.verseNumberBadge}>
// // //             <ThemedText style={styles.verseNumberText}>{item.aya}</ThemedText>
// // //           </View>

// // //           <View style={styles.actionButtons}>
// // //             <TouchableOpacity
// // //               style={[
// // //                 styles.actionButton,
// // //                 { backgroundColor: Colors[colorScheme].background },
// // //               ]}
// // //             >
// // //               <AntDesign
// // //                 name="playcircleo"
// // //                 size={21}
// // //                 color={Colors[colorScheme].defaultIcon}
// // //               />
// // //             </TouchableOpacity>
// // //             <TouchableOpacity
// // //               style={[
// // //                 styles.actionButton,
// // //                 { backgroundColor: Colors[colorScheme].background },
// // //               ]}
// // //               onPress={() => handleBookmarkVerse(item.aya)}
// // //             >
// // //               <Ionicons
// // //                 name={isVerseBookmarked ? "bookmark" : "bookmark-outline"}
// // //                 size={21}
// // //                 color={
// // //                   isVerseBookmarked
// // //                     ? "#8B5CF6"
// // //                     : Colors[colorScheme].defaultIcon
// // //                 }
// // //               />
// // //             </TouchableOpacity>
// // //             <TouchableOpacity
// // //               style={[
// // //                 styles.actionButton,
// // //                 { backgroundColor: Colors[colorScheme].background },
// // //               ]}
// // //               onPress={() => handleOpenInfo(item, arabicVerse)}
// // //             >
// // //               {hasTafsir && (
// // //                 <Ionicons
// // //                   name="information-circle-outline"
// // //                   size={24}
// // //                   color={Colors[colorScheme].defaultIcon}
// // //                 />
// // //               )}
// // //             </TouchableOpacity>
// // //           </View>
// // //         </View>

// // //         <View style={styles.verseContent}>
// // //           {/* Arabic line */}
// // //           {!!arabicVerse && (
// // //             <ThemedText style={styles.arabicText}>
// // //               {arabicVerse.text}
// // //             </ThemedText>
// // //           )}

// // //           {/* Transliteration */}
// // //           {!!transliterationText && (
// // //             <RenderHTML
// // //               contentWidth={translitContentWidth}
// // //               source={{ html: `<div>${transliterationText}</div>` }}
// // //               // make it look like your old style
// // //               baseStyle={StyleSheet.flatten(styles.arabicTransliterationText)}
// // //               defaultTextProps={{ selectable: true }}
// // //               // safety & tiny tweaks
// // //               ignoredDomTags={["script", "style"]}
// // //               tagsStyles={{
// // //                 u: { textDecorationLine: "underline" },
// // //                 b: { fontWeight: "700" },
// // //                 i: { fontStyle: "italic" },
// // //               }}
// // //             />
// // //           )}
// // //           {/* Translation */}
// // //           <ThemedText style={styles.translationText}>{item.text}</ThemedText>
// // //         </View>
// // //       </View>
// // //     );
// // //   };

// // //   return (
// // //     <ThemedView style={styles.container}>
// // //       <AnimatedHeader />
// // //       {loading ? (
// // //         <View style={styles.loadingWrap}>
// // //           <LoadingIndicator size="large" />
// // //         </View>
// // //       ) : (
// // //         <FlashList
// // //           data={verses}
// // //           extraData={bookmarkedVerses}
// // //           keyExtractor={(v) => `${v.sura}-${v.aya}`}
// // //           renderItem={renderVerse}
// // //           contentContainerStyle={{
// // //             paddingTop: HEADER_MAX_HEIGHT + 10,
// // //             paddingHorizontal: 16,
// // //             paddingBottom: 24,
// // //           }}
// // //           showsVerticalScrollIndicator={false}
// // //           scrollEventThrottle={16}
// // //           estimatedItemSize={188}
// // //           onScroll={Animated.event(
// // //             [{ nativeEvent: { contentOffset: { y: scrollY } } }],
// // //             { useNativeDriver: false }
// // //           )}
// // //           ListEmptyComponent={
// // //             <ThemedText style={styles.emptyText}>{t("noData")}</ThemedText>
// // //           }
// // //         />
// // //       )}

// // //       {/* Bottom Sheet for Verse Info */}
// // //       <BottomSheet
// // //         ref={bottomSheetRef}
// // //         index={-1}
// // //         snapPoints={snapPoints}
// // //         backdropComponent={renderBackdrop}
// // //         enablePanDownToClose={true}
// // //         backgroundStyle={{ backgroundColor: Colors[colorScheme].background }}
// // //         handleIndicatorStyle={{
// // //           backgroundColor: Colors[colorScheme].defaultIcon,
// // //         }}
// // //       >
// // //         <BottomSheetScrollView style={styles.bottomSheetContent}>
// // //           {selectedVerse && (
// // //             <>
// // //               {/* Header */}
// // //               <View style={styles.bottomSheetHeader}>
// // //                 <ThemedText style={styles.bottomSheetTitle}>
// // //                   {displayName} - {t("ayah")} {selectedVerse.aya}
// // //                 </ThemedText>
// // //                 <TouchableOpacity
// // //                   onPress={() => bottomSheetRef.current?.close()}
// // //                   style={styles.closeButton}
// // //                 >
// // //                   <Ionicons
// // //                     name="close-circle"
// // //                     size={28}
// // //                     color={Colors[colorScheme].defaultIcon}
// // //                   />
// // //                 </TouchableOpacity>
// // //               </View>

// // //               {/* Divider */}
// // //               <View
// // //                 style={[
// // //                   styles.divider,
// // //                   { backgroundColor: Colors[colorScheme].border },
// // //                 ]}
// // //               />

// // //               {/* Content */}
// // //               <View style={styles.infoContent}>
// // //                 {/* Arabic Text */}
// // //                 {selectedArabicVerse && (
// // //                   <View style={styles.infoSection}>
// // //                     <ThemedText style={styles.infoLabel}>
// // //                       {t("arabicText")}:
// // //                     </ThemedText>
// // //                     <ThemedText style={styles.infoArabicText}>
// // //                       {selectedArabicVerse.text}
// // //                     </ThemedText>
// // //                   </View>
// // //                 )}

// // //                 {/* Translation */}
// // //                 <View style={styles.infoSection}>
// // //                   <ThemedText style={styles.infoLabel}>
// // //                     {t("translation")}:
// // //                   </ThemedText>
// // //                   <ThemedText style={styles.infoTranslation}>
// // //                     {selectedVerse.text}
// // //                   </ThemedText>
// // //                 </View>

// // //                 {/* Tafsir/Commentary */}
// // //                 <View style={styles.infoSection}>
// // //                   <ThemedText style={styles.infoLabel}>
// // //                     {t("tafsir")}:
// // //                   </ThemedText>
// // //                   <ThemedText style={styles.infoTafsir}>
// // //                     {/* You can replace this with actual Tafsir data from your database */}
// // //                     {t("tafsirPlaceholder") ||
// // //                       "Detailed explanation and commentary for this verse will appear here. This can include historical context, interpretations, and scholarly insights."}
// // //                   </ThemedText>
// // //                 </View>

// // //                 {/* Additional Info */}
// // //                 <View style={styles.infoSection}>
// // //                   <ThemedText style={styles.infoLabel}>
// // //                     {t("additionalInfo")}:
// // //                   </ThemedText>
// // //                   <View style={styles.metaInfo}>
// // //                     <ThemedText style={styles.metaText}>
// // //                       • {t("surahNumber")}: {suraNumber}
// // //                     </ThemedText>
// // //                     <ThemedText style={styles.metaText}>
// // //                       • {t("verseNumber")}: {selectedVerse.aya}
// // //                     </ThemedText>
// // //                     <ThemedText style={styles.metaText}>
// // //                       • {t("revelation")}:{" "}
// // //                       {suraInfo?.makki ? t("makki") : t("madani")}
// // //                     </ThemedText>
// // //                   </View>
// // //                 </View>
// // //               </View>
// // //             </>
// // //           )}
// // //         </BottomSheetScrollView>
// // //       </BottomSheet>
// // //     </ThemedView>
// // //   );
// // // };

// // // async function loadBookmarkedVerses(suraNumber: number): Promise<Set<number>> {
// // //   try {
// // //     const bookmarksKey = `bookmarks_sura_${suraNumber}`;
// // //     const storedBookmarks = await Storage.getItemAsync(bookmarksKey);
// // //     if (storedBookmarks) {
// // //       const arr = JSON.parse(storedBookmarks) as number[];
// // //       return new Set(arr);
// // //     }
// // //   } catch (error) {
// // //     console.error("Error loading bookmarks:", error);
// // //   }
// // //   return new Set();
// // // }

// // // const styles = StyleSheet.create({
// // //   container: { flex: 1 },
// // //   loadingWrap: {
// // //     paddingTop: 32,
// // //     flex: 1,
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //   },
// // //   headerWrapper: {
// // //     position: "absolute",
// // //     top: 0,
// // //     left: 0,
// // //     right: 0,
// // //     zIndex: 1000,
// // //   },
// // //   headerContainer: {
// // //     flex: 1,
// // //     justifyContent: "center",
// // //   },
// // //   headerContent: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     justifyContent: "space-between",
// // //     paddingHorizontal: 15,
// // //   },
// // //   headerTextContainer: {
// // //     flex: 1,
// // //     marginHorizontal: 16,
// // //   },
// // //   suraName: { fontSize: 20, fontWeight: "700" },
// // //   subMeta: {
// // //     fontSize: 14,
// // //     fontWeight: "600",
// // //     color: Colors.universal.grayedOut,
// // //   },
// // //   suraNameAr: { textAlign: "right", fontSize: 24 },

// // //   verseCard: {
// // //     backgroundColor: "#FFFFFF",
// // //     borderRadius: 16,
// // //     marginBottom: 12,
// // //     padding: 16,
// // //     shadowColor: "#000",
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.1,
// // //     shadowRadius: 8,
// // //     elevation: 3,
// // //   },
// // //   verseHeader: {
// // //     flexDirection: "row",
// // //     justifyContent: "space-between",
// // //     alignItems: "center",
// // //     marginBottom: 16,
// // //   },
// // //   verseNumberBadge: {
// // //     width: 40,
// // //     height: 40,
// // //     borderRadius: 20,
// // //     backgroundColor: "#8B5CF6",
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //   },
// // //   verseNumberText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
// // //   actionButtons: { flexDirection: "row", gap: 8 },
// // //   actionButton: {
// // //     width: 36,
// // //     height: 36,
// // //     borderRadius: 18,
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //   },
// // //   verseContent: { gap: 12 },
// // //   arabicText: {
// // //     fontSize: 24,
// // //     lineHeight: 40,
// // //     textAlign: "right",
// // //     fontWeight: "400",
// // //     letterSpacing: 0.5,
// // //   },
// // //   translationText: { fontSize: 16, lineHeight: 24, fontWeight: "500" },
// // //   arabicTransliterationText: {
// // //     fontSize: 15,
// // //     lineHeight: 22,
// // //     fontStyle: "italic",
// // //     fontWeight: "400",
// // //     textAlign: "left",
// // //     color: Colors.universal.grayedOut,
// // //   },
// // //   emptyText: { textAlign: "center", padding: 24 },

// // //   // Bottom Sheet Styles
// // //   bottomSheetContent: {
// // //     flex: 1,
// // //     paddingHorizontal: 20,
// // //   },
// // //   bottomSheetHeader: {
// // //     flexDirection: "row",
// // //     justifyContent: "space-between",
// // //     alignItems: "center",
// // //     paddingVertical: 16,
// // //   },
// // //   bottomSheetTitle: {
// // //     fontSize: 18,
// // //     fontWeight: "700",
// // //     flex: 1,
// // //   },
// // //   closeButton: {
// // //     padding: 4,
// // //   },
// // //   divider: {
// // //     height: 1,
// // //     marginBottom: 16,
// // //   },
// // //   infoContent: {
// // //     paddingBottom: 20,
// // //   },
// // //   infoSection: {
// // //     marginBottom: 20,
// // //   },
// // //   infoLabel: {
// // //     fontSize: 14,
// // //     fontWeight: "600",
// // //     color: Colors.universal.grayedOut,
// // //     marginBottom: 8,
// // //   },
// // //   infoArabicText: {
// // //     fontSize: 22,
// // //     lineHeight: 36,
// // //     textAlign: "right",
// // //     fontWeight: "400",
// // //   },
// // //   infoTranslation: {
// // //     fontSize: 16,
// // //     lineHeight: 24,
// // //   },
// // //   infoTafsir: {
// // //     fontSize: 15,
// // //     lineHeight: 22,
// // //     textAlign: "justify",
// // //   },
// // //   metaInfo: {
// // //     gap: 4,
// // //   },
// // //   metaText: {
// // //     fontSize: 14,
// // //     lineHeight: 20,
// // //   },
// // // });

// // // export default SuraScreen;

// // import type React from "react";
// // import {
// //   View,
// //   StyleSheet,
// //   TouchableOpacity,
// //   useColorScheme,
// //   Animated,
// //   Alert,
// // } from "react-native";
// // import { useEffect, useMemo, useRef, useState, useCallback } from "react";
// // import { useLocalSearchParams } from "expo-router";
// // import { useTranslation } from "react-i18next";
// // import { SafeAreaView } from "react-native-safe-area-context";
// // import AntDesign from "@expo/vector-icons/AntDesign";
// // import { Ionicons } from "@expo/vector-icons";
// // import { Storage } from "expo-sqlite/kv-store";
// // import RenderHTML from "react-native-render-html";
// // import { useWindowDimensions } from "react-native";
// // import BottomSheet, {
// //   BottomSheetView,
// //   BottomSheetBackdrop,
// //   BottomSheetScrollView,
// // } from "@gorhom/bottom-sheet";
// // import { ThemedView } from "@/components/ThemedView";
// // import { ThemedText } from "@/components/ThemedText";
// // import { LoadingIndicator } from "@/components/LoadingIndicator";
// // import HeaderLeftBackButton from "./HeaderLeftBackButton";
// // import { useLastSuraStore } from "@/stores/useLastSura";

// // import { Colors } from "@/constants/Colors";
// // import { useLanguage } from "@/contexts/LanguageContext";
// // import { SuraRowType, QuranVerseType, LanguageCode } from "@/constants/Types";

// // import {
// //   getSurahVerses,
// //   getSurahDisplayName,
// //   getSurahInfoByNumber,
// //   // NEW:
// //   getJuzVerses,
// //   getJuzBounds,
// // } from "@/db/queries/quran";
// // import { whenDatabaseReady } from "@/db";
// // import { FlashList } from "@shopify/flash-list";

// // const HEADER_MAX_HEIGHT = 120;
// // const HEADER_MIN_HEIGHT = 60;
// // const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

// // // helper to key (sura, aya)
// // const vkey = (s: number, a: number) => `${s}:${a}`;

// // const SuraScreen: React.FC = () => {
// //   const { t } = useTranslation();
// //   const colorScheme = useColorScheme() || "light";
// //   const { language, isArabic } = useLanguage();
// //   const lang = (language ?? "de") as LanguageCode;
// //   const { width } = useWindowDimensions();

// //   // account for list + card paddings (16 + 16 on both sides)
// //   const translitContentWidth = Math.max(0, width - 64);

// //   // Accept either suraId (surah mode) or juzId (juz mode)
// //   const { suraId, juzId } = useLocalSearchParams<{
// //     suraId?: string;
// //     juzId?: string;
// //   }>();
// //   const isJuzMode = !!juzId;
// //   const juzNumber = isJuzMode ? Number(juzId) : null;

// //   const suraNumber = useMemo(() => Number(suraId ?? 1), [suraId]);

// //   const [loading, setLoading] = useState(true);
// //   const [hasTafsir, setHasTafsir] = useState(true);
// //   const [verses, setVerses] = useState<QuranVerseType[]>([]);
// //   const [arabicVerses, setArabicVerses] = useState<QuranVerseType[]>([]);
// //   const [suraInfo, setSuraInfo] = useState<SuraRowType | null>(null);

// //   // Header bits
// //   const [displayName, setDisplayName] = useState<string>(""); // Surah title (surah mode)
// //   const [juzHeader, setJuzHeader] = useState<{
// //     title: string;
// //     subtitle?: string;
// //   } | null>(null); // Juz title (juz mode)

// //   // Bookmarks by sura for highlighting in both modes
// //   const [bookmarksBySura, setBookmarksBySura] = useState<
// //     Map<number, Set<number>>
// //   >(new Map());

// //   const [selectedVerse, setSelectedVerse] = useState<QuranVerseType | null>(
// //     null
// //   );
// //   const [selectedArabicVerse, setSelectedArabicVerse] =
// //     useState<QuranVerseType | null>(null);

// //   const setLastSura = useLastSuraStore((s) => s.setLastSura);
// //   useEffect(() => {
// //     // Only set this in surah mode; in juz mode, leave the last sura as-is
// //     if (!isJuzMode) setLastSura(suraNumber);
// //   }, [suraNumber, isJuzMode]);

// //   // Animation refs
// //   const scrollY = useRef(new Animated.Value(0)).current;

// //   // Bottom Sheet ref
// //   const bottomSheetRef = useRef<BottomSheet>(null);
// //   const snapPoints = useMemo(() => ["75%"], []);

// //   useEffect(() => {
// //     let cancelled = false;
// //     (async () => {
// //       try {
// //         setLoading(true);
// //         await whenDatabaseReady();

// //         if (isJuzMode && juzNumber) {
// //           // --- JUZ MODE ---
// //           const [vers, arabicVers] = await Promise.all([
// //             getJuzVerses(lang, juzNumber),
// //             getJuzVerses("ar", juzNumber),
// //           ]);

// //           // Header: "Juz N" + optional "Starts at Surah Aya"
// //           const bounds = await getJuzBounds(juzNumber);
// //           if (bounds) {
// //             const startName =
// //               (await getSurahDisplayName(bounds.startSura, lang)) ??
// //               `Sura ${bounds.startSura}`;
// //             setJuzHeader({
// //               title: `${t("juz") ?? "Juz"} ${juzNumber}`,
// //               subtitle: `${t("startsAt") ?? "Starts at"} ${startName} ${
// //                 bounds.startAya
// //               }`,
// //             });
// //           } else {
// //             setJuzHeader({ title: `${t("juz") ?? "Juz"} ${juzNumber}` });
// //           }

// //           // Load bookmarks for all suras that appear in this juz
// //           const distinctSuras = Array.from(new Set(vers.map((v) => v.sura)));
// //           const map = new Map<number, Set<number>>();
// //           for (const s of distinctSuras) {
// //             map.set(s, await loadBookmarkedVerses(s));
// //           }

// //           if (!cancelled) {
// //             setVerses(vers ?? []);
// //             setArabicVerses(arabicVers ?? []);
// //             setSuraInfo(null);
// //             setDisplayName("");
// //             setBookmarksBySura(map);
// //           }
// //         } else {
// //           // --- SURAH MODE (existing behavior) ---
// //           const [vers, arabicVers, info, name] = await Promise.all([
// //             getSurahVerses(lang, suraNumber), // includes transliteration (via JOIN)
// //             getSurahVerses("ar", suraNumber), // Arabic lines
// //             getSurahInfoByNumber(suraNumber),
// //             getSurahDisplayName(suraNumber, lang),
// //           ]);

// //           const map = new Map<number, Set<number>>();
// //           map.set(suraNumber, await loadBookmarkedVerses(suraNumber));

// //           if (!cancelled) {
// //             setVerses((vers ?? []) as QuranVerseType[]);
// //             setArabicVerses((arabicVers ?? []) as QuranVerseType[]);
// //             setSuraInfo(info ?? null);
// //             setDisplayName(name ?? "");
// //             setJuzHeader(null);
// //             setBookmarksBySura(map);
// //           }
// //         }
// //       } catch (error) {
// //         console.error("Failed to load verses:", error);
// //         if (!cancelled) {
// //           setVerses([]);
// //           setArabicVerses([]);
// //           setSuraInfo(null);
// //           setDisplayName("");
// //           setJuzHeader(null);
// //           setBookmarksBySura(new Map());
// //         }
// //       } finally {
// //         if (!cancelled) setLoading(false);
// //       }
// //     })();
// //     return () => {
// //       cancelled = true;
// //     };
// //   }, [lang, suraNumber, isJuzMode, juzNumber]);

// //   // verse lookup for Arabic lines → needs (sura, aya) in juz mode
// //   const arabicByKey = useMemo(
// //     () => new Map(arabicVerses.map((v) => [vkey(v.sura, v.aya), v])),
// //     [arabicVerses]
// //   );

// //   // Handle opening the info bottom sheet
// //   const handleOpenInfo = useCallback(
// //     (verse: QuranVerseType, arabicVerse: QuranVerseType | undefined) => {
// //       setSelectedVerse(verse);
// //       setSelectedArabicVerse(arabicVerse || null);
// //       bottomSheetRef.current?.expand();
// //     },
// //     []
// //   );

// //   // Render backdrop for bottom sheet
// //   const renderBackdrop = useCallback(
// //     (props: any) => (
// //       <BottomSheetBackdrop
// //         {...props}
// //         disappearsOnIndex={-1}
// //         appearsOnIndex={0}
// //         opacity={0.5}
// //       />
// //     ),
// //     []
// //   );

// //   const handleBookmarkVerse = async (verse: QuranVerseType) => {
// //     try {
// //       const s = verse.sura;
// //       const verseNumber = verse.aya;
// //       const bookmarksKey = `bookmarks_sura_${s}`;

// //       const currentSet = new Set(bookmarksBySura.get(s) ?? new Set<number>());

// //       // Tapping the same verse toggles it off
// //       if (currentSet.has(verseNumber)) {
// //         currentSet.delete(verseNumber);
// //         const newMap = new Map(bookmarksBySura);
// //         newMap.set(s, currentSet);
// //         setBookmarksBySura(newMap);

// //         const arr = Array.from(currentSet);
// //         if (arr.length) {
// //           await Storage.setItemAsync(bookmarksKey, JSON.stringify(arr));
// //         } else {
// //           await Storage.removeItemAsync(bookmarksKey);
// //         }
// //         await Storage.removeItemAsync(`bookmark_s${s}_v${verseNumber}_${lang}`);
// //         return;
// //       }

// //       // Only allow one bookmark per sura (keeps your old behavior)
// //       if (currentSet.size > 0) {
// //         const prev = Array.from(currentSet)[0];
// //         Alert.alert(t("confirmBookmarkChange"), t("bookmarkReplaceQuestion"), [
// //           { text: t("cancel"), style: "cancel" },
// //           {
// //             text: t("change"),
// //             style: "destructive",
// //             onPress: async () => {
// //               await Storage.removeItemAsync(`bookmark_s${s}_v${prev}_${lang}`);

// //               const nextSet = new Set<number>([verseNumber]);
// //               const newMap = new Map(bookmarksBySura);
// //               newMap.set(s, nextSet);
// //               setBookmarksBySura(newMap);

// //               await Storage.setItemAsync(
// //                 bookmarksKey,
// //                 JSON.stringify([verseNumber])
// //               );
// //               await Storage.setItemAsync(
// //                 `bookmark_s${s}_v${verseNumber}_${lang}`,
// //                 JSON.stringify({
// //                   suraNumber: s,
// //                   verseNumber,
// //                   language: lang,
// //                   suraName: (await getSurahDisplayName(s, lang)) ?? `Sura ${s}`,
// //                   timestamp: Date.now(),
// //                 })
// //               );
// //             },
// //           },
// //         ]);
// //         return;
// //       }

// //       // No existing bookmark in this sura -> add this one
// //       const nextSet = new Set<number>([verseNumber]);
// //       const newMap = new Map(bookmarksBySura);
// //       newMap.set(s, nextSet);
// //       setBookmarksBySura(newMap);

// //       await Storage.setItemAsync(bookmarksKey, JSON.stringify([verseNumber]));
// //       await Storage.setItemAsync(
// //         `bookmark_s${s}_v${verseNumber}_${lang}`,
// //         JSON.stringify({
// //           suraNumber: s,
// //           verseNumber,
// //           language: lang,
// //           suraName: (await getSurahDisplayName(s, lang)) ?? `Sura ${s}`,
// //           timestamp: Date.now(),
// //         })
// //       );
// //     } catch (error) {
// //       console.error("Error handling bookmark:", error);
// //     }
// //   };

// //   const headerHeight = scrollY.interpolate({
// //     inputRange: [0, HEADER_SCROLL_DISTANCE],
// //     outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
// //     extrapolate: "clamp",
// //   });

// //   const headerTitleOpacity = scrollY.interpolate({
// //     inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
// //     outputRange: [1, 0.5, 0],
// //     extrapolate: "clamp",
// //   });

// //   const headerSubtitleOpacity = scrollY.interpolate({
// //     inputRange: [0, HEADER_SCROLL_DISTANCE / 3],
// //     outputRange: [1, 0],
// //     extrapolate: "clamp",
// //   });

// //   const headerTitleScale = scrollY.interpolate({
// //     inputRange: [0, HEADER_SCROLL_DISTANCE],
// //     outputRange: [1, 0.8],
// //     extrapolate: "clamp",
// //   });

// //   const AnimatedHeader = () => {
// //     const isMakki = !!suraInfo?.makki;
// //     const showJuz = !!juzHeader;

// //     return (
// //       <Animated.View
// //         style={[
// //           styles.headerWrapper,
// //           {
// //             height: headerHeight,
// //             backgroundColor: Colors[colorScheme].background,
// //           },
// //         ]}
// //       >
// //         <SafeAreaView edges={["top"]} style={styles.headerContainer}>
// //           <View style={styles.headerContent}>
// //             <HeaderLeftBackButton />
// //             <Animated.View
// //               style={[
// //                 styles.headerTextContainer,
// //                 {
// //                   opacity: headerTitleOpacity,
// //                   transform: [{ scale: headerTitleScale }],
// //                 },
// //               ]}
// //             >
// //               {showJuz ? (
// //                 <>
// //                   <ThemedText type="title" style={styles.suraName}>
// //                     {juzHeader?.title}
// //                   </ThemedText>
// //                   {!!juzHeader?.subtitle && (
// //                     <Animated.View style={{ opacity: headerSubtitleOpacity }}>
// //                       <ThemedText style={styles.subMeta} numberOfLines={1}>
// //                         {juzHeader.subtitle}
// //                       </ThemedText>
// //                     </Animated.View>
// //                   )}
// //                 </>
// //               ) : (
// //                 <>
// //                   <ThemedText
// //                     type="title"
// //                     style={[styles.suraName, isArabic() && styles.suraNameAr]}
// //                   >
// //                     {displayName || suraInfo?.label_en || suraInfo?.label || ""}{" "}
// //                     ({suraNumber})
// //                   </ThemedText>
// //                   <Animated.View style={{ opacity: headerSubtitleOpacity }}>
// //                     <ThemedText style={styles.subMeta} numberOfLines={1}>
// //                       {t("ayatCount")}: {suraInfo?.nbAyat ?? "—"} ·{" "}
// //                       {isMakki ? t("makki") : t("madani")}
// //                     </ThemedText>
// //                   </Animated.View>
// //                 </>
// //               )}
// //             </Animated.View>
// //           </View>
// //         </SafeAreaView>
// //       </Animated.View>
// //     );
// //   };

// //   const renderVerse = ({ item }: { item: QuranVerseType; index: number }) => {
// //     const arabicVerse = arabicByKey.get(vkey(item.sura, item.aya));
// //     const isVerseBookmarked =
// //       bookmarksBySura.get(item.sura)?.has(item.aya) ?? false;
// //     const transliterationText = item.transliteration ?? "";

// //     return (
// //       <View
// //         style={[
// //           styles.verseCard,
// //           {
// //             backgroundColor: isVerseBookmarked
// //               ? Colors.universal.primary
// //               : Colors[colorScheme].contrast,
// //           },
// //         ]}
// //       >
// //         <View style={styles.verseHeader}>
// //           <View style={[styles.verseNumberBadge, isJuzMode && { width: 80 }]}>
// //             <ThemedText style={styles.verseNumberText}>
// //               {/* show "sura:aya" in juz mode */}
// //               {isJuzMode ? `${item.sura}:${item.aya}` : item.aya}
// //             </ThemedText>
// //           </View>

// //           <View style={styles.actionButtons}>
// //             <TouchableOpacity
// //               style={[
// //                 styles.actionButton,
// //                 { backgroundColor: Colors[colorScheme].background },
// //               ]}
// //             >
// //               <AntDesign
// //                 name="playcircleo"
// //                 size={21}
// //                 color={Colors[colorScheme].defaultIcon}
// //               />
// //             </TouchableOpacity>
// //             <TouchableOpacity
// //               style={[
// //                 styles.actionButton,
// //                 { backgroundColor: Colors[colorScheme].background },
// //               ]}
// //               onPress={() => handleBookmarkVerse(item)}
// //             >
// //               <Ionicons
// //                 name={isVerseBookmarked ? "bookmark" : "bookmark-outline"}
// //                 size={21}
// //                 color={
// //                   isVerseBookmarked
// //                     ? "#8B5CF6"
// //                     : Colors[colorScheme].defaultIcon
// //                 }
// //               />
// //             </TouchableOpacity>
// //             <TouchableOpacity
// //               style={[
// //                 styles.actionButton,
// //                 { backgroundColor: Colors[colorScheme].background },
// //               ]}
// //               onPress={() => handleOpenInfo(item, arabicVerse ?? undefined)}
// //             >
// //               {hasTafsir && (
// //                 <Ionicons
// //                   name="information-circle-outline"
// //                   size={24}
// //                   color={Colors[colorScheme].defaultIcon}
// //                 />
// //               )}
// //             </TouchableOpacity>
// //           </View>
// //         </View>

// //         <View style={styles.verseContent}>
// //           {/* Arabic line */}
// //           {!!arabicVerse && (
// //             <ThemedText style={styles.arabicText}>
// //               {arabicVerse.text}
// //             </ThemedText>
// //           )}

// //           {/* Transliteration */}
// //           {!!transliterationText && (
// //             <RenderHTML
// //               contentWidth={translitContentWidth}
// //               source={{ html: `<div>${transliterationText}</div>` }}
// //               baseStyle={StyleSheet.flatten(styles.arabicTransliterationText)}
// //               defaultTextProps={{ selectable: true }}
// //               ignoredDomTags={["script", "style"]}
// //               tagsStyles={{
// //                 u: { textDecorationLine: "underline" },
// //                 b: { fontWeight: "700" },
// //                 i: { fontStyle: "italic" },
// //               }}
// //             />
// //           )}
// //           {/* Translation */}
// //           <ThemedText style={styles.translationText}>{item.text}</ThemedText>
// //         </View>
// //       </View>
// //     );
// //   };

// //   return (
// //     <ThemedView style={styles.container}>
// //       <AnimatedHeader />
// //       {loading ? (
// //         <View style={styles.loadingWrap}>
// //           <LoadingIndicator size="large" />
// //         </View>
// //       ) : (
// //         <FlashList
// //           data={verses}
// //           // Make sure list rerenders when bookmarks map changes
// //           extraData={Array.from(bookmarksBySura.entries())}
// //           keyExtractor={(v) => `${v.sura}-${v.aya}`}
// //           renderItem={renderVerse}
// //           contentContainerStyle={{
// //             paddingTop: HEADER_MAX_HEIGHT + 10,
// //             paddingHorizontal: 16,
// //             paddingBottom: 24,
// //           }}
// //           showsVerticalScrollIndicator={false}
// //           scrollEventThrottle={16}
// //           estimatedItemSize={188}
// //           onScroll={Animated.event(
// //             [{ nativeEvent: { contentOffset: { y: scrollY } } }],
// //             { useNativeDriver: false }
// //           )}
// //           ListEmptyComponent={
// //             <ThemedText style={styles.emptyText}>{t("noData")}</ThemedText>
// //           }
// //         />
// //       )}

// //       {/* Bottom Sheet for Verse Info */}
// //       <BottomSheet
// //         ref={bottomSheetRef}
// //         index={-1}
// //         snapPoints={snapPoints}
// //         backdropComponent={renderBackdrop}
// //         enablePanDownToClose={true}
// //         backgroundStyle={{ backgroundColor: Colors[colorScheme].background }}
// //         handleIndicatorStyle={{
// //           backgroundColor: Colors[colorScheme].defaultIcon,
// //         }}
// //       >
// //         <BottomSheetScrollView style={styles.bottomSheetContent}>
// //           {selectedVerse && (
// //             <>
// //               {/* Header */}
// //               <View style={styles.bottomSheetHeader}>
// //                 <ThemedText style={styles.bottomSheetTitle}>
// //                   {juzHeader
// //                     ? `${juzHeader.title} – ${t("ayah")} ${
// //                         selectedVerse.sura
// //                       }:${selectedVerse.aya}`
// //                     : `${displayName} - ${t("ayah")} ${selectedVerse.aya}`}
// //                 </ThemedText>
// //                 <TouchableOpacity
// //                   onPress={() => bottomSheetRef.current?.close()}
// //                   style={styles.closeButton}
// //                 >
// //                   <Ionicons
// //                     name="close-circle"
// //                     size={28}
// //                     color={Colors[colorScheme].defaultIcon}
// //                   />
// //                 </TouchableOpacity>
// //               </View>

// //               {/* Divider */}
// //               <View
// //                 style={[
// //                   styles.divider,
// //                   { backgroundColor: Colors[colorScheme].border },
// //                 ]}
// //               />

// //               {/* Content */}
// //               <View style={styles.infoContent}>
// //                 {/* Arabic Text */}
// //                 {selectedArabicVerse && (
// //                   <View style={styles.infoSection}>
// //                     <ThemedText style={styles.infoLabel}>
// //                       {t("arabicText")}:
// //                     </ThemedText>
// //                     <ThemedText style={styles.infoArabicText}>
// //                       {selectedArabicVerse.text}
// //                     </ThemedText>
// //                   </View>
// //                 )}

// //                 {/* Translation */}
// //                 <View style={styles.infoSection}>
// //                   <ThemedText style={styles.infoLabel}>
// //                     {t("translation")}:
// //                   </ThemedText>
// //                   <ThemedText style={styles.infoTranslation}>
// //                     {selectedVerse.text}
// //                   </ThemedText>
// //                 </View>

// //                 {/* Tafsir/Commentary */}
// //                 <View style={styles.infoSection}>
// //                   <ThemedText style={styles.infoLabel}>
// //                     {t("tafsir")}:
// //                   </ThemedText>
// //                   <ThemedText style={styles.infoTafsir}>
// //                     {t("tafsirPlaceholder") ||
// //                       "Detailed explanation and commentary for this verse will appear here. This can include historical context, interpretations, and scholarly insights."}
// //                   </ThemedText>
// //                 </View>

// //                 {/* Additional Info */}
// //                 <View style={styles.infoSection}>
// //                   <ThemedText style={styles.infoLabel}>
// //                     {t("additionalInfo")}:
// //                   </ThemedText>
// //                   <View style={styles.metaInfo}>
// //                     {!juzHeader && (
// //                       <ThemedText style={styles.metaText}>
// //                         • {t("surahNumber")}: {suraNumber}
// //                       </ThemedText>
// //                     )}
// //                     <ThemedText style={styles.metaText}>
// //                       • {t("verseNumber")}: {selectedVerse.sura}:
// //                       {selectedVerse.aya}
// //                     </ThemedText>
// //                     {!juzHeader && (
// //                       <ThemedText style={styles.metaText}>
// //                         • {t("revelation")}:{" "}
// //                         {suraInfo?.makki ? t("makki") : t("madani")}
// //                       </ThemedText>
// //                     )}
// //                   </View>
// //                 </View>
// //               </View>
// //             </>
// //           )}
// //         </BottomSheetScrollView>
// //       </BottomSheet>
// //     </ThemedView>
// //   );
// // };

// // async function loadBookmarkedVerses(suraNumber: number): Promise<Set<number>> {
// //   try {
// //     const bookmarksKey = `bookmarks_sura_${suraNumber}`;
// //     const storedBookmarks = await Storage.getItemAsync(bookmarksKey);
// //     if (storedBookmarks) {
// //       const arr = JSON.parse(storedBookmarks) as number[];
// //       return new Set(arr);
// //     }
// //   } catch (error) {
// //     console.error("Error loading bookmarks:", error);
// //   }
// //   return new Set();
// // }

// // const styles = StyleSheet.create({
// //   container: { flex: 1 },
// //   loadingWrap: {
// //     paddingTop: 32,
// //     flex: 1,
// //     justifyContent: "center",
// //     alignItems: "center",
// //   },
// //   headerWrapper: {
// //     position: "absolute",
// //     top: 0,
// //     left: 0,
// //     right: 0,
// //     zIndex: 1000,
// //   },
// //   headerContainer: {
// //     flex: 1,
// //     justifyContent: "center",
// //   },
// //   headerContent: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     justifyContent: "space-between",
// //     paddingHorizontal: 15,
// //   },
// //   headerTextContainer: {
// //     flex: 1,
// //     marginHorizontal: 16,
// //   },
// //   suraName: { fontSize: 20, fontWeight: "700" },
// //   subMeta: {
// //     fontSize: 14,
// //     fontWeight: "600",
// //     color: Colors.universal.grayedOut,
// //   },
// //   suraNameAr: { textAlign: "right", fontSize: 24 },

// //   verseCard: {
// //     backgroundColor: "#FFFFFF",
// //     borderRadius: 16,
// //     marginBottom: 12,
// //     padding: 16,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 8,
// //     elevation: 3,
// //   },
// //   verseHeader: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //     marginBottom: 16,
// //   },
// //   verseNumberBadge: {
// //     width: 40,
// //     height: 40,
// //     borderRadius: 20,
// //     backgroundColor: "#8B5CF6",
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },
// //   verseNumberText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
// //   actionButtons: { flexDirection: "row", gap: 8 },
// //   actionButton: {
// //     width: 36,
// //     height: 36,
// //     borderRadius: 18,
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },
// //   verseContent: { gap: 12 },
// //   arabicText: {
// //     fontSize: 24,
// //     lineHeight: 40,
// //     textAlign: "right",
// //     fontWeight: "400",
// //     letterSpacing: 0.5,
// //   },
// //   translationText: { fontSize: 16, lineHeight: 24, fontWeight: "500" },
// //   arabicTransliterationText: {
// //     fontSize: 15,
// //     lineHeight: 22,
// //     fontStyle: "italic",
// //     fontWeight: "400",
// //     textAlign: "left",
// //     color: Colors.universal.grayedOut,
// //   },
// //   emptyText: { textAlign: "center", padding: 24 },

// //   // Bottom Sheet Styles
// //   bottomSheetContent: {
// //     flex: 1,
// //     paddingHorizontal: 20,
// //   },
// //   bottomSheetHeader: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //     paddingVertical: 16,
// //   },
// //   bottomSheetTitle: {
// //     fontSize: 18,
// //     fontWeight: "700",
// //     flex: 1,
// //   },
// //   closeButton: {
// //     padding: 4,
// //   },
// //   divider: {
// //     height: 1,
// //     marginBottom: 16,
// //   },
// //   infoContent: {
// //     paddingBottom: 20,
// //   },
// //   infoSection: {
// //     marginBottom: 20,
// //   },
// //   infoLabel: {
// //     fontSize: 14,
// //     fontWeight: "600",
// //     color: Colors.universal.grayedOut,
// //     marginBottom: 8,
// //   },
// //   infoArabicText: {
// //     fontSize: 22,
// //     lineHeight: 36,
// //     textAlign: "right",
// //     fontWeight: "400",
// //   },
// //   infoTranslation: {
// //     fontSize: 16,
// //     lineHeight: 24,
// //   },
// //   infoTafsir: {
// //     fontSize: 15,
// //     lineHeight: 22,
// //     textAlign: "justify",
// //   },
// //   metaInfo: {
// //     gap: 4,
// //   },
// //   metaText: {
// //     fontSize: 14,
// //     lineHeight: 20,
// //   },
// // });

// // export default SuraScreen;

// import React, {
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
//   useCallback,
// } from "react";
// import {
//   View,
//   StyleSheet,
//   TouchableOpacity,
//   useColorScheme,
//   Animated,
//   Alert,
// } from "react-native";
// import { useLocalSearchParams } from "expo-router";
// import { useTranslation } from "react-i18next";
// import { SafeAreaView } from "react-native-safe-area-context";
// import AntDesign from "@expo/vector-icons/AntDesign";
// import { Ionicons } from "@expo/vector-icons";
// import { Storage } from "expo-sqlite/kv-store";
// import RenderHTML from "react-native-render-html";
// import { useWindowDimensions } from "react-native";
// import BottomSheet, {
//   BottomSheetBackdrop,
//   BottomSheetScrollView,
// } from "@gorhom/bottom-sheet";
// import { ThemedView } from "@/components/ThemedView";
// import { ThemedText } from "@/components/ThemedText";
// import { LoadingIndicator } from "@/components/LoadingIndicator";
// import HeaderLeftBackButton from "./HeaderLeftBackButton";
// import { useLastSuraStore } from "@/stores/useLastSura";

// import { Colors } from "@/constants/Colors";
// import { useLanguage } from "@/contexts/LanguageContext";
// import { SuraRowType, QuranVerseType, LanguageCode } from "@/constants/Types";

// import {
//   getSurahVerses,
//   getSurahDisplayName,
//   getSurahInfoByNumber,
//   getJuzVerses,
//   getJuzBounds,
// } from "@/db/queries/quran";
// import { whenDatabaseReady } from "@/db";
// import { FlashList } from "@shopify/flash-list";
// import { $ZodString } from "zod/v4/core";

// // -----------------------------------------------------------------------------
// // constants / helpers (module scope so they stay referentially stable)
// // -----------------------------------------------------------------------------

// const HEADER_MAX_HEIGHT = 120;
// const HEADER_MIN_HEIGHT = 60;
// const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

// // key for arabic lookup across juz (spans multiple surahs)
// const vkey = (s: number, a: number) => `${s}:${a}`;

// // stable props for RenderHTML to avoid TRenderEngineProvider thrash
// const RENDER_HTML_TAGS_STYLES = Object.freeze({
//   u: { textDecorationLine: "underline" },
//   b: { fontWeight: "700" },
//   i: { fontStyle: "italic" },
// });
// const RENDER_HTML_DEFAULT_TEXT_PROPS = Object.freeze({ selectable: true });
// const RENDER_HTML_IGNORED_TAGS = ["script", "style"] as const;

// const MemoRenderHTML = React.memo(RenderHTML);

// // -----------------------------------------------------------------------------
// // Memoized row component (so we can use useMemo inside list items)
// // -----------------------------------------------------------------------------

// type VerseCardProps = {
//   item: QuranVerseType;
//   arabicVerse?: QuranVerseType;
//   isBookmarked: boolean;
//   isJuzMode: boolean;
//   translitContentWidth: number;
//   colorScheme: NonNullable<ReturnType<typeof useColorScheme>> | "light";
//   hasTafsir: boolean;
//   onBookmark: (verse: QuranVerseType) => void;
//   onOpenInfo: (verse: QuranVerseType, arabicVerse?: QuranVerseType) => void;
//   translitBaseStyle: any;
//   language: string;
// };

// const VerseCard = React.memo(function VerseCard({
//   item,
//   arabicVerse,
//   isBookmarked,
//   isJuzMode,
//   translitContentWidth,
//   colorScheme,
//   hasTafsir,
//   onBookmark,
//   onOpenInfo,
//   translitBaseStyle,
//   language,
// }: VerseCardProps) {
//   const transliterationText = item.transliteration ?? "";

//   // keep source referentially stable unless text changes
//   const source = useMemo(
//     () => ({ html: `<div>${transliterationText}</div>` }),
//     [transliterationText]
//   );

//   return (
//     <View
//       style={[
//         styles.verseCard,
//         {
//           backgroundColor: isBookmarked
//             ? Colors.universal.primary
//             : Colors[colorScheme].contrast,
//         },
//       ]}
//     >
//       <View style={styles.verseHeader}>
//         <View style={[styles.verseNumberBadge, isJuzMode && { width: 80 }]}>
//           <ThemedText style={styles.verseNumberText}>
//             {isJuzMode ? `${item.sura}:${item.aya}` : item.aya}
//           </ThemedText>
//         </View>

//         <View style={styles.actionButtons}>
//           <TouchableOpacity
//             style={[
//               styles.actionButton,
//               { backgroundColor: Colors[colorScheme].background },
//             ]}
//           >
//             <AntDesign
//               name="playcircleo"
//               size={21}
//               color={Colors[colorScheme].defaultIcon}
//             />
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[
//               styles.actionButton,
//               { backgroundColor: Colors[colorScheme].background },
//             ]}
//             onPress={() => onBookmark(item)}
//           >
//             <Ionicons
//               name={isBookmarked ? "bookmark" : "bookmark-outline"}
//               size={21}
//               color={isBookmarked ? "#8B5CF6" : Colors[colorScheme].defaultIcon}
//             />
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[
//               styles.actionButton,
//               { backgroundColor: Colors[colorScheme].background },
//             ]}
//             onPress={() => onOpenInfo(item, arabicVerse ?? undefined)}
//           >
//             {hasTafsir && (
//               <Ionicons
//                 name="information-circle-outline"
//                 size={24}
//                 color={Colors[colorScheme].defaultIcon}
//               />
//             )}
//           </TouchableOpacity>
//         </View>
//       </View>

//       <View style={styles.verseContent}>
//         {!!arabicVerse && (
//           <ThemedText style={styles.arabicText}>{arabicVerse.text}</ThemedText>
//         )}
//         {!!transliterationText && (
//           <MemoRenderHTML
//             contentWidth={translitContentWidth}
//             source={source}
//             baseStyle={translitBaseStyle}
//             defaultTextProps={RENDER_HTML_DEFAULT_TEXT_PROPS}
//             ignoredDomTags={RENDER_HTML_IGNORED_TAGS as any}
//             tagsStyles={RENDER_HTML_TAGS_STYLES as any}
//           />
//         )}
//         {language !== "ar" && (
//           <ThemedText style={styles.translationText}>{item.text}</ThemedText>
//         )}
//       </View>
//     </View>
//   );
// });

// // -----------------------------------------------------------------------------
// // Screen
// // -----------------------------------------------------------------------------

// const SuraScreen: React.FC = () => {
//   const { t } = useTranslation();
//   const colorScheme = useColorScheme() || "light";
//   const { language, isArabic } = useLanguage();
//   const lang = (language ?? "de") as LanguageCode;
//   const { width } = useWindowDimensions();

//   // account for list + card paddings (16 + 16 on both sides)
//   const translitContentWidth = Math.max(0, width - 64);

//   // Accept either suraId (surah mode) or juzId (juz mode)
//   const { suraId, juzId } = useLocalSearchParams<{
//     suraId?: string;
//     juzId?: string;
//   }>();
//   const isJuzMode = !!juzId;
//   const juzNumber = isJuzMode ? Number(juzId) : null;
//   const suraNumber = useMemo(() => Number(suraId ?? 1), [suraId]);

//   const [loading, setLoading] = useState(true);
//   const [hasTafsir] = useState(true);
//   const [verses, setVerses] = useState<QuranVerseType[]>([]);
//   const [arabicVerses, setArabicVerses] = useState<QuranVerseType[]>([]);
//   const [suraInfo, setSuraInfo] = useState<SuraRowType | null>(null);

//   // Header bits
//   const [displayName, setDisplayName] = useState<string>(""); // Surah title (surah mode)
//   const [juzHeader, setJuzHeader] = useState<{
//     title: string;
//     subtitle?: string;
//   } | null>(null); // Juz title (juz mode)

//   // Bookmarks by sura for highlighting in both modes
//   const [bookmarksBySura, setBookmarksBySura] = useState<
//     Map<number, Set<number>>
//   >(new Map());

//   const [selectedVerse, setSelectedVerse] = useState<QuranVerseType | null>(
//     null
//   );
//   const [selectedArabicVerse, setSelectedArabicVerse] =
//     useState<QuranVerseType | null>(null);

//   const setLastSura = useLastSuraStore((s) => s.setLastSura);
//   useEffect(() => {
//     // Only set this in surah mode; in juz mode, leave the last sura as-is
//     if (!isJuzMode) setLastSura(suraNumber);
//   }, [suraNumber, isJuzMode]);

//   // Animation refs
//   const scrollY = useRef(new Animated.Value(0)).current;

//   // Bottom Sheet ref
//   const bottomSheetRef = useRef<BottomSheet>(null);
//   const snapPoints = useMemo(() => ["75%"], []);

//   useEffect(() => {
//     let cancelled = false;
//     (async () => {
//       try {
//         setLoading(true);
//         await whenDatabaseReady();

//         if (isJuzMode && juzNumber) {
//           // --- JUZ MODE ---
//           const [vers, arabicVers] = await Promise.all([
//             getJuzVerses(lang, juzNumber),
//             getJuzVerses("ar", juzNumber),
//           ]);

//           const bounds = await getJuzBounds(juzNumber);
//           if (bounds) {
//             const startName =
//               (await getSurahDisplayName(bounds.startSura, lang)) ??
//               `Sura ${bounds.startSura}`;
//             setJuzHeader({
//               title: `${t("juz") ?? "Juz"} ${juzNumber}`,
//               subtitle: `${t("startsAt") ?? "Starts at"} ${startName} ${
//                 bounds.startAya
//               }`,
//             });
//           } else {
//             setJuzHeader({ title: `${t("juz") ?? "Juz"} ${juzNumber}` });
//           }

//           // Load bookmarks for all suras that appear in this juz
//           const distinctSuras = Array.from(new Set(vers.map((v) => v.sura)));
//           const map = new Map<number, Set<number>>();
//           for (const s of distinctSuras) {
//             map.set(s, await loadBookmarkedVerses(s));
//           }

//           if (!cancelled) {
//             setVerses(vers ?? []);
//             setArabicVerses(arabicVers ?? []);
//             setSuraInfo(null);
//             setDisplayName("");
//             setJuzHeader((prev) => prev); // no-op to keep type happy
//             setBookmarksBySura(map);
//           }
//         } else {
//           // --- SURAH MODE (existing behavior) ---
//           const [vers, arabicVers, info, name] = await Promise.all([
//             getSurahVerses(lang, suraNumber), // includes transliteration (via JOIN)
//             getSurahVerses("ar", suraNumber), // Arabic lines
//             getSurahInfoByNumber(suraNumber),
//             getSurahDisplayName(suraNumber, lang),
//           ]);

//           const map = new Map<number, Set<number>>();
//           map.set(suraNumber, await loadBookmarkedVerses(suraNumber));

//           if (!cancelled) {
//             setVerses((vers ?? []) as QuranVerseType[]);
//             setArabicVerses((arabicVers ?? []) as QuranVerseType[]);
//             setSuraInfo(info ?? null);
//             setDisplayName(name ?? "");
//             setJuzHeader(null);
//             setBookmarksBySura(map);
//           }
//         }
//       } catch (error) {
//         console.error("Failed to load verses:", error);
//         if (!cancelled) {
//           setVerses([]);
//           setArabicVerses([]);
//           setSuraInfo(null);
//           setDisplayName("");
//           setJuzHeader(null);
//           setBookmarksBySura(new Map());
//         }
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     })();
//     return () => {
//       cancelled = true;
//     };
//   }, [lang, suraNumber, isJuzMode, juzNumber]);

//   // verse lookup for Arabic lines → needs (sura, aya) in juz mode
//   const arabicByKey = useMemo(
//     () => new Map(arabicVerses.map((v) => [vkey(v.sura, v.aya), v])),
//     [arabicVerses]
//   );

//   // Handle opening the info bottom sheet
//   const handleOpenInfo = useCallback(
//     (verse: QuranVerseType, arabicVerse: QuranVerseType | undefined) => {
//       setSelectedVerse(verse);
//       setSelectedArabicVerse(arabicVerse || null);
//       bottomSheetRef.current?.expand();
//     },
//     []
//   );

//   const renderBackdrop = useCallback(
//     (props: any) => (
//       <BottomSheetBackdrop
//         {...props}
//         disappearsOnIndex={-1}
//         appearsOnIndex={0}
//         opacity={0.5}
//       />
//     ),
//     []
//   );

//   const handleBookmarkVerse = async (verse: QuranVerseType) => {
//     try {
//       const s = verse.sura;
//       const verseNumber = verse.aya;
//       const bookmarksKey = `bookmarks_sura_${s}`;

//       const currentSet = new Set(bookmarksBySura.get(s) ?? new Set<number>());

//       // Tapping the same verse toggles it off
//       if (currentSet.has(verseNumber)) {
//         currentSet.delete(verseNumber);
//         const newMap = new Map(bookmarksBySura);
//         newMap.set(s, currentSet);
//         setBookmarksBySura(newMap);

//         const arr = Array.from(currentSet);
//         if (arr.length) {
//           await Storage.setItemAsync(bookmarksKey, JSON.stringify(arr));
//         } else {
//           await Storage.removeItemAsync(bookmarksKey);
//         }
//         await Storage.removeItemAsync(`bookmark_s${s}_v${verseNumber}_${lang}`);
//         return;
//       }

//       // Only allow one bookmark per sura (keeps your old behavior)
//       if (currentSet.size > 0) {
//         const prev = Array.from(currentSet)[0];
//         Alert.alert(t("confirmBookmarkChange"), t("bookmarkReplaceQuestion"), [
//           { text: t("cancel"), style: "cancel" },
//           {
//             text: t("change"),
//             style: "destructive",
//             onPress: async () => {
//               await Storage.removeItemAsync(`bookmark_s${s}_v${prev}_${lang}`);

//               const nextSet = new Set<number>([verseNumber]);
//               const newMap = new Map(bookmarksBySura);
//               newMap.set(s, nextSet);
//               setBookmarksBySura(newMap);

//               await Storage.setItemAsync(
//                 bookmarksKey,
//                 JSON.stringify([verseNumber])
//               );
//               await Storage.setItemAsync(
//                 `bookmark_s${s}_v${verseNumber}_${lang}`,
//                 JSON.stringify({
//                   suraNumber: s,
//                   verseNumber,
//                   language: lang,
//                   suraName: (await getSurahDisplayName(s, lang)) ?? `Sura ${s}`,
//                   timestamp: Date.now(),
//                 })
//               );
//             },
//           },
//         ]);
//         return;
//       }

//       // No existing bookmark in this sura -> add this one
//       const nextSet = new Set<number>([verseNumber]);
//       const newMap = new Map(bookmarksBySura);
//       newMap.set(s, nextSet);
//       setBookmarksBySura(newMap);

//       await Storage.setItemAsync(bookmarksKey, JSON.stringify([verseNumber]));
//       await Storage.setItemAsync(
//         `bookmark_s${s}_v${verseNumber}_${lang}`,
//         JSON.stringify({
//           suraNumber: s,
//           verseNumber,
//           language: lang,
//           suraName: (await getSurahDisplayName(s, lang)) ?? `Sura ${s}`,
//           timestamp: Date.now(),
//         })
//       );
//     } catch (error) {
//       console.error("Error handling bookmark:", error);
//     }
//   };

//   const headerHeight = scrollY.interpolate({
//     inputRange: [0, HEADER_SCROLL_DISTANCE],
//     outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
//     extrapolate: "clamp",
//   });

//   const headerTitleOpacity = scrollY.interpolate({
//     inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
//     outputRange: [1, 0.5, 0],
//     extrapolate: "clamp",
//   });

//   const headerSubtitleOpacity = scrollY.interpolate({
//     inputRange: [0, HEADER_SCROLL_DISTANCE / 3],
//     outputRange: [1, 0],
//     extrapolate: "clamp",
//   });

//   const headerTitleScale = scrollY.interpolate({
//     inputRange: [0, HEADER_SCROLL_DISTANCE],
//     outputRange: [1, 0.8],
//     extrapolate: "clamp",
//   });

//   const AnimatedHeader = () => {
//     const isMakki = !!suraInfo?.makki;
//     const showJuz = !!juzHeader;

//     return (
//       <Animated.View
//         style={[
//           styles.headerWrapper,
//           {
//             height: headerHeight,
//             backgroundColor: Colors[colorScheme].background,
//           },
//         ]}
//       >
//         <SafeAreaView edges={["top"]} style={styles.headerContainer}>
//           <View style={styles.headerContent}>
//             <HeaderLeftBackButton />
//             <Animated.View
//               style={[
//                 styles.headerTextContainer,
//                 {
//                   opacity: headerTitleOpacity,
//                   transform: [{ scale: headerTitleScale }],
//                 },
//               ]}
//             >
//               {showJuz ? (
//                 <>
//                   <ThemedText type="title" style={styles.suraName}>
//                     {juzHeader?.title}
//                   </ThemedText>
//                   {!!juzHeader?.subtitle && (
//                     <Animated.View style={{ opacity: headerSubtitleOpacity }}>
//                       <ThemedText style={styles.subMeta} numberOfLines={1}>
//                         {juzHeader.subtitle}
//                       </ThemedText>
//                     </Animated.View>
//                   )}
//                 </>
//               ) : (
//                 <>
//                   <ThemedText
//                     type="title"
//                     style={[styles.suraName, isArabic() && styles.suraNameAr]}
//                   >
//                     {displayName || suraInfo?.label_en || suraInfo?.label || ""}{" "}
//                     ({suraNumber})
//                   </ThemedText>
//                   <Animated.View style={{ opacity: headerSubtitleOpacity }}>
//                     <ThemedText style={styles.subMeta} numberOfLines={1}>
//                       {t("ayatCount")}: {suraInfo?.nbAyat ?? "—"} ·{" "}
//                       {isMakki ? t("makki") : t("madani")}
//                     </ThemedText>
//                   </Animated.View>
//                 </>
//               )}
//             </Animated.View>
//           </View>
//         </SafeAreaView>
//       </Animated.View>
//     );
//   };

//   const renderVerse = useCallback(
//     ({ item }: { item: QuranVerseType; index: number }) => {
//       const arabicVerse = arabicByKey.get(vkey(item.sura, item.aya));
//       const isVerseBookmarked =
//         bookmarksBySura.get(item.sura)?.has(item.aya) ?? false;

//       return (
//         <VerseCard
//           item={item}
//           arabicVerse={arabicVerse}
//           isBookmarked={isVerseBookmarked}
//           isJuzMode={isJuzMode}
//           translitContentWidth={translitContentWidth}
//           translitBaseStyle={styles.arabicTransliterationText}
//           colorScheme={colorScheme}
//           hasTafsir={hasTafsir}
//           onBookmark={handleBookmarkVerse}
//           onOpenInfo={handleOpenInfo}
//           language={lang}
//         />
//       );
//     },
//     [
//       arabicByKey,
//       bookmarksBySura,
//       isJuzMode,
//       translitContentWidth,
//       colorScheme,
//       hasTafsir,
//       handleBookmarkVerse,
//       handleOpenInfo,
//     ]
//   );

//   return (
//     <ThemedView style={styles.container}>
//       <AnimatedHeader />
//       {loading ? (
//         <View style={styles.loadingWrap}>
//           <LoadingIndicator size="large" />
//         </View>
//       ) : (
//         <FlashList
//           data={verses}
//           extraData={Array.from(bookmarksBySura.entries())}
//           keyExtractor={(v) => `${v.sura}-${v.aya}`}
//           renderItem={renderVerse}
//           contentContainerStyle={{
//             paddingTop: HEADER_MAX_HEIGHT + 10,
//             paddingHorizontal: 16,
//             paddingBottom: 24,
//           }}
//           showsVerticalScrollIndicator={false}
//           scrollEventThrottle={16}
//           estimatedItemSize={188}
//           onScroll={Animated.event(
//             [{ nativeEvent: { contentOffset: { y: scrollY } } }],
//             { useNativeDriver: false }
//           )}
//           ListEmptyComponent={
//             <ThemedText style={styles.emptyText}>{t("noData")}</ThemedText>
//           }
//         />
//       )}

//       {/* Bottom Sheet for Verse Info */}
//       <BottomSheet
//         ref={bottomSheetRef}
//         index={-1}
//         snapPoints={snapPoints}
//         backdropComponent={renderBackdrop}
//         enablePanDownToClose={true}
//         backgroundStyle={{ backgroundColor: Colors[colorScheme].background }}
//         handleIndicatorStyle={{
//           backgroundColor: Colors[colorScheme].defaultIcon,
//         }}
//       >
//         <BottomSheetScrollView style={styles.bottomSheetContent}>
//           {selectedVerse && (
//             <>
//               {/* Header */}
//               <View style={styles.bottomSheetHeader}>
//                 <ThemedText style={styles.bottomSheetTitle}>
//                   {juzHeader
//                     ? `${juzHeader.title} – ${t("ayah")} ${
//                         selectedVerse.sura
//                       }:${selectedVerse.aya}`
//                     : `${displayName} - ${t("ayah")} ${selectedVerse.aya}`}
//                 </ThemedText>
//                 <TouchableOpacity
//                   onPress={() => bottomSheetRef.current?.close()}
//                   style={styles.closeButton}
//                 >
//                   <Ionicons
//                     name="close-circle"
//                     size={28}
//                     color={Colors[colorScheme].defaultIcon}
//                   />
//                 </TouchableOpacity>
//               </View>

//               {/* Divider */}
//               <View
//                 style={[
//                   styles.divider,
//                   { backgroundColor: Colors[colorScheme].border },
//                 ]}
//               />

//               {/* Content */}
//               <View style={styles.infoContent}>
//                 {/* Arabic Text */}
//                 {selectedArabicVerse && (
//                   <View style={styles.infoSection}>
//                     <ThemedText style={styles.infoLabel}>
//                       {t("arabicText")}:
//                     </ThemedText>
//                     <ThemedText style={styles.infoArabicText}>
//                       {selectedArabicVerse.text}
//                     </ThemedText>
//                   </View>
//                 )}

//                 {/* Translation */}
//                 {lang !== "ar" && (
//                   <View style={styles.infoSection}>
//                     <ThemedText style={styles.infoLabel}>
//                       {t("translation")}:
//                     </ThemedText>
//                     <ThemedText style={styles.infoTranslation}>
//                       {selectedVerse.text}
//                     </ThemedText>
//                   </View>
//                 )}

//                 {/* Tafsir/Commentary */}
//                 <View style={styles.infoSection}>
//                   <ThemedText style={styles.infoLabel}>
//                     {t("tafsir")}:
//                   </ThemedText>
//                   <ThemedText style={styles.infoTafsir}>
//                     {t("tafsirPlaceholder") ||
//                       "Detailed explanation and commentary for this verse will appear here. This can include historical context, interpretations, and scholarly insights."}
//                   </ThemedText>
//                 </View>

//                 {/* Additional Info */}
//                 <View style={styles.infoSection}>
//                   <ThemedText style={styles.infoLabel}>
//                     {t("additionalInfo")}:
//                   </ThemedText>
//                   <View style={styles.metaInfo}>
//                     {!juzHeader && (
//                       <ThemedText style={styles.metaText}>
//                         • {t("surahNumber")}: {suraNumber}
//                       </ThemedText>
//                     )}
//                     <ThemedText style={styles.metaText}>
//                       • {t("verseNumber")}: {selectedVerse.sura}:
//                       {selectedVerse.aya}
//                     </ThemedText>
//                     {!juzHeader && (
//                       <ThemedText style={styles.metaText}>
//                         • {t("revelation")}:{" "}
//                         {suraInfo?.makki ? t("makki") : t("madani")}
//                       </ThemedText>
//                     )}
//                   </View>
//                 </View>
//               </View>
//             </>
//           )}
//         </BottomSheetScrollView>
//       </BottomSheet>
//     </ThemedView>
//   );
// };

// async function loadBookmarkedVerses(suraNumber: number): Promise<Set<number>> {
//   try {
//     const bookmarksKey = `bookmarks_sura_${suraNumber}`;
//     const storedBookmarks = await Storage.getItemAsync(bookmarksKey);
//     if (storedBookmarks) {
//       const arr = JSON.parse(storedBookmarks) as number[];
//       return new Set(arr);
//     }
//   } catch (error) {
//     console.error("Error loading bookmarks:", error);
//   }
//   return new Set();
// }

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   loadingWrap: {
//     paddingTop: 32,
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   headerWrapper: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     zIndex: 1000,
//   },
//   headerContainer: {
//     flex: 1,
//     justifyContent: "center",
//   },
//   headerContent: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 15,
//   },
//   headerTextContainer: {
//     flex: 1,
//     marginHorizontal: 16,
//   },
//   suraName: { fontSize: 20, fontWeight: "700" },
//   subMeta: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: Colors.universal.grayedOut,
//   },
//   suraNameAr: { textAlign: "right", fontSize: 24 },

//   verseCard: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 16,
//     marginBottom: 12,
//     padding: 16,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   verseHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   verseNumberBadge: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: "#8B5CF6",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   verseNumberText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
//   actionButtons: { flexDirection: "row", gap: 8 },
//   actionButton: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   verseContent: { gap: 12 },
//   arabicText: {
//     fontSize: 24,
//     lineHeight: 40,
//     textAlign: "right",
//     fontWeight: "400",
//     letterSpacing: 0.5,
//   },
//   translationText: { fontSize: 16, lineHeight: 24, fontWeight: "500" },
//   arabicTransliterationText: {
//     fontSize: 15,
//     lineHeight: 22,
//     fontStyle: "italic",
//     fontWeight: "400",
//     textAlign: "left",
//     color: Colors.universal.grayedOut,
//   },
//   emptyText: { textAlign: "center", padding: 24 },

//   // Bottom Sheet Styles
//   bottomSheetContent: {
//     flex: 1,
//     paddingHorizontal: 20,
//   },
//   bottomSheetHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingVertical: 16,
//   },
//   bottomSheetTitle: {
//     fontSize: 18,
//     fontWeight: "700",
//     flex: 1,
//   },
//   closeButton: {
//     padding: 4,
//   },
//   divider: {
//     height: 1,
//     marginBottom: 16,
//   },
//   infoContent: {
//     paddingBottom: 20,
//   },
//   infoSection: {
//     marginBottom: 20,
//   },
//   infoLabel: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: Colors.universal.grayedOut,
//     marginBottom: 8,
//   },
//   infoArabicText: {
//     fontSize: 22,
//     lineHeight: 36,
//     textAlign: "right",
//     fontWeight: "400",
//   },
//   infoTranslation: {
//     fontSize: 16,
//     lineHeight: 24,
//   },
//   infoTafsir: {
//     fontSize: 15,
//     lineHeight: 22,
//     textAlign: "justify",
//   },
//   metaInfo: {
//     gap: 4,
//   },
//   metaText: {
//     fontSize: 14,
//     lineHeight: 20,
//   },
// });

// export default SuraScreen;

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Animated,
  Alert,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Storage } from "expo-sqlite/kv-store";
import { useWindowDimensions } from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { FlashList } from "@shopify/flash-list";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import HeaderLeftBackButton from "./HeaderLeftBackButton";
import VerseCard from "@/components/VerseCard";

import { useLastSuraStore } from "@/stores/useLastSura";
import { Colors } from "@/constants/Colors";
import { useLanguage } from "@/contexts/LanguageContext";
import { SuraRowType, QuranVerseType, LanguageCode } from "@/constants/Types";

import {
  getSurahVerses,
  getSurahDisplayName,
  getSurahInfoByNumber,
  getJuzVerses,
  getJuzBounds,
} from "@/db/queries/quran";
import { whenDatabaseReady } from "@/db";
import FontSizePickerModal from "./FontSizePickerModal";
import { useFontSizeStore } from "@/stores/fontSizeStore";

// constants / helpers
const HEADER_MAX_HEIGHT = 120;
const HEADER_MIN_HEIGHT = 60;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

// key for arabic lookup across juz (spans multiple surahs)
const vkey = (s: number, a: number) => `${s}:${a}`;

const SuraScreen: React.FC = () => {
  const { t } = useTranslation();
  const cs = (useColorScheme() || "light") as "light" | "dark";
  const { language, isArabic } = useLanguage();
  const lang = (language ?? "de") as LanguageCode;
  const { width } = useWindowDimensions();

  // account for list + card paddings (16 + 16 on both sides)
  const translitContentWidth = Math.max(0, width - 64);

  // Accept either suraId (surah mode) or juzId (juz mode)
  const { suraId, juzId } = useLocalSearchParams<{
    suraId?: string;
    juzId?: string;
  }>();
  const isJuzMode = !!juzId;
  const juzNumber = isJuzMode ? Number(juzId) : null;
  const suraNumber = useMemo(() => Number(suraId ?? 1), [suraId]);

  const [loading, setLoading] = useState(true);
  const [hasTafsir] = useState(true);
  const [verses, setVerses] = useState<QuranVerseType[]>([]);
  const [arabicVerses, setArabicVerses] = useState<QuranVerseType[]>([]);
  const [suraInfo, setSuraInfo] = useState<SuraRowType | null>(null);
  const { fontSize, lineHeight } = useFontSizeStore();

  // Header bits
  const [displayName, setDisplayName] = useState<string>(""); // Surah title (surah mode)
  const [juzHeader, setJuzHeader] = useState<{
    title: string;
    subtitle?: string;
  } | null>(null); // Juz title (juz mode)

  // Bookmarks by sura for highlighting in both modes
  const [bookmarksBySura, setBookmarksBySura] = useState<
    Map<number, Set<number>>
  >(new Map());

  const [selectedVerse, setSelectedVerse] = useState<QuranVerseType | null>(
    null
  );
  const [selectedArabicVerse, setSelectedArabicVerse] =
    useState<QuranVerseType | null>(null);

  const setLastSura = useLastSuraStore((s) => s.setLastSura);
  useEffect(() => {
    // Only set this in surah mode; in juz mode, leave the last sura as-is
    if (!isJuzMode) setLastSura(suraNumber);
  }, [suraNumber, isJuzMode]);

  // Animation refs
  const scrollY = useRef(new Animated.Value(0)).current;

  // Bottom Sheet ref
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["75%"], []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        await whenDatabaseReady();

        if (isJuzMode && juzNumber) {
          // --- JUZ MODE ---
          const [vers, arabicVers] = await Promise.all([
            getJuzVerses(lang, juzNumber),
            getJuzVerses("ar", juzNumber),
          ]);

          const bounds = await getJuzBounds(juzNumber);
          if (bounds) {
            const startName =
              (await getSurahDisplayName(bounds.startSura, lang)) ??
              `Sura ${bounds.startSura}`;
            setJuzHeader({
              title: `${t("juz") ?? "Juz"} ${juzNumber}`,
              subtitle: `${t("startsAt") ?? "Starts at"} ${startName} ${
                bounds.startAya
              }`,
            });
          } else {
            setJuzHeader({ title: `${t("juz") ?? "Juz"} ${juzNumber}` });
          }

          // Load bookmarks for all suras that appear in this juz
          const distinctSuras = Array.from(new Set(vers.map((v) => v.sura)));
          const map = new Map<number, Set<number>>();
          for (const s of distinctSuras) {
            map.set(s, await loadBookmarkedVerses(s));
          }

          if (!cancelled) {
            setVerses(vers ?? []);
            setArabicVerses(arabicVers ?? []);
            setSuraInfo(null);
            setDisplayName("");
            setJuzHeader((prev) => prev); // keep type happy
            setBookmarksBySura(map);
          }
        } else {
          // --- SURAH MODE ---
          const [vers, arabicVers, info, name] = await Promise.all([
            getSurahVerses(lang, suraNumber), // includes transliteration (via JOIN)
            getSurahVerses("ar", suraNumber), // Arabic lines
            getSurahInfoByNumber(suraNumber),
            getSurahDisplayName(suraNumber, lang),
          ]);

          const map = new Map<number, Set<number>>();
          map.set(suraNumber, await loadBookmarkedVerses(suraNumber));

          if (!cancelled) {
            setVerses((vers ?? []) as QuranVerseType[]);
            setArabicVerses((arabicVers ?? []) as QuranVerseType[]);
            setSuraInfo(info ?? null);
            setDisplayName(name ?? "");
            setJuzHeader(null);
            setBookmarksBySura(map);
          }
        }
      } catch (error) {
        console.error("Failed to load verses:", error);
        if (!cancelled) {
          setVerses([]);
          setArabicVerses([]);
          setSuraInfo(null);
          setDisplayName("");
          setJuzHeader(null);
          setBookmarksBySura(new Map());
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [lang, suraNumber, isJuzMode, juzNumber]);

  // verse lookup for Arabic lines → needs (sura, aya) in juz mode
  const arabicByKey = useMemo(
    () => new Map(arabicVerses.map((v) => [vkey(v.sura, v.aya), v])),
    [arabicVerses]
  );

  // Handle opening the info bottom sheet
  const handleOpenInfo = useCallback(
    (verse: QuranVerseType, arabicVerse: QuranVerseType | undefined) => {
      setSelectedVerse(verse);
      setSelectedArabicVerse(arabicVerse || null);
      bottomSheetRef.current?.expand();
    },
    []
  );

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );

  const handleBookmarkVerse = async (verse: QuranVerseType) => {
    try {
      const s = verse.sura;
      const verseNumber = verse.aya;
      const bookmarksKey = `bookmarks_sura_${s}`;

      const currentSet = new Set(bookmarksBySura.get(s) ?? new Set<number>());

      // Tapping the same verse toggles it off
      if (currentSet.has(verseNumber)) {
        currentSet.delete(verseNumber);
        const newMap = new Map(bookmarksBySura);
        newMap.set(s, currentSet);
        setBookmarksBySura(newMap);

        const arr = Array.from(currentSet);
        if (arr.length) {
          await Storage.setItemAsync(bookmarksKey, JSON.stringify(arr));
        } else {
          await Storage.removeItemAsync(bookmarksKey);
        }
        await Storage.removeItemAsync(`bookmark_s${s}_v${verseNumber}_${lang}`);
        return;
      }

      // Only allow one bookmark per sura (keeps your old behavior)
      if (currentSet.size > 0) {
        const prev = Array.from(currentSet)[0];
        Alert.alert(t("confirmBookmarkChange"), t("bookmarkReplaceQuestion"), [
          { text: t("cancel"), style: "cancel" },
          {
            text: t("change"),
            style: "destructive",
            onPress: async () => {
              await Storage.removeItemAsync(`bookmark_s${s}_v${prev}_${lang}`);

              const nextSet = new Set<number>([verseNumber]);
              const newMap = new Map(bookmarksBySura);
              newMap.set(s, nextSet);
              setBookmarksBySura(newMap);

              await Storage.setItemAsync(
                bookmarksKey,
                JSON.stringify([verseNumber])
              );
              await Storage.setItemAsync(
                `bookmark_s${s}_v${verseNumber}_${lang}`,
                JSON.stringify({
                  suraNumber: s,
                  verseNumber,
                  language: lang,
                  suraName: (await getSurahDisplayName(s, lang)) ?? `Sura ${s}`,
                  timestamp: Date.now(),
                })
              );
            },
          },
        ]);
        return;
      }

      // No existing bookmark in this sura -> add this one
      const nextSet = new Set<number>([verseNumber]);
      const newMap = new Map(bookmarksBySura);
      newMap.set(s, nextSet);
      setBookmarksBySura(newMap);

      await Storage.setItemAsync(bookmarksKey, JSON.stringify([verseNumber]));
      await Storage.setItemAsync(
        `bookmark_s${s}_v${verseNumber}_${lang}`,
        JSON.stringify({
          suraNumber: s,
          verseNumber,
          language: lang,
          suraName: (await getSurahDisplayName(s, lang)) ?? `Sura ${s}`,
          timestamp: Date.now(),
        })
      );
    } catch (error) {
      console.error("Error handling bookmark:", error);
    }
  };

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: "clamp",
  });

  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.5, 0],
    extrapolate: "clamp",
  });

  const headerSubtitleOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 3],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const headerTitleScale = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.8],
    extrapolate: "clamp",
  });

  const AnimatedHeader = () => {
    const isMakki = !!suraInfo?.makki;
    const showJuz = !!juzHeader;

    const [modalVisible, setModalVisible] = useState(false);
    const colorScheme = useColorScheme() || "light";

    return (
      <Animated.View
        style={[
          styles.headerWrapper,
          {
            height: headerHeight,
            backgroundColor: Colors[cs].background,
          },
        ]}
      >
        <SafeAreaView edges={["top"]} style={styles.headerContainer}>
          <View style={styles.headerContent}>
            <HeaderLeftBackButton />

            <Animated.View
              style={[
                styles.headerTextContainer,
                {
                  opacity: headerTitleOpacity,
                  transform: [{ scale: headerTitleScale }],
                },
              ]}
            >
              {showJuz ? (
                <>
                  <ThemedText style={styles.suraName}>
                    {juzHeader?.title}
                  </ThemedText>
                  {!!juzHeader?.subtitle && (
                    <Animated.View style={{ opacity: headerSubtitleOpacity }}>
                      <ThemedText type="default" style={[styles.subMeta]}>
                        {juzHeader.subtitle}
                      </ThemedText>
                    </Animated.View>
                  )}
                </>
              ) : (
                <>
                  <ThemedText
                    style={[styles.suraName, isArabic() && styles.suraNameAr]}
                  >
                    {displayName || suraInfo?.label_en || suraInfo?.label || ""}{" "}
                    ({suraNumber})
                  </ThemedText>
                  <Animated.View style={{ opacity: headerSubtitleOpacity }}>
                    <ThemedText style={styles.subMeta} type="default">
                      {t("ayatCount")}: {suraInfo?.nbAyat ?? "—"} ·{" "}
                      {isMakki ? t("makki") : t("madani")}
                    </ThemedText>
                  </Animated.View>
                </>
              )}
            </Animated.View>
            <Ionicons
              name="text"
              size={28}
              color={Colors[colorScheme].defaultIcon}
              onPress={() => setModalVisible(true)}
              style={{ marginRight: 15 }}
            />
          </View>
          <FontSizePickerModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
          />
        </SafeAreaView>
      </Animated.View>
    );
  };

  // PLAIN object for RenderHTML baseStyle inside VerseCard
  const translitBaseStyle = useMemo(
    () => StyleSheet.flatten([styles.arabicTransliterationText]),
    []
  );

  const renderVerse = useCallback(
    ({ item }: { item: QuranVerseType; index: number }) => {
      const arabicVerse = arabicByKey.get(vkey(item.sura, item.aya));
      const isVerseBookmarked =
        bookmarksBySura.get(item.sura)?.has(item.aya) ?? false;

      return (
        <VerseCard
          item={item}
          arabicVerse={arabicVerse}
          isBookmarked={isVerseBookmarked}
          isJuzMode={isJuzMode}
          translitContentWidth={translitContentWidth}
          translitBaseStyle={translitBaseStyle}
          hasTafsir={hasTafsir}
          onBookmark={handleBookmarkVerse}
          onOpenInfo={handleOpenInfo}
          language={lang}
        />
      );
    },
    [
      arabicByKey,
      bookmarksBySura,
      isJuzMode,
      translitContentWidth,
      translitBaseStyle,
      cs,
      hasTafsir,
      handleBookmarkVerse,
      handleOpenInfo,
      lang,
    ]
  );

  return (
    <ThemedView style={styles.container}>
      <AnimatedHeader />
      {loading ? (
        <View style={styles.loadingWrap}>
          <LoadingIndicator size="large" />
        </View>
      ) : (
        <FlashList
          data={verses}
          extraData={Array.from(bookmarksBySura.entries())}
          keyExtractor={(v) => `${v.sura}-${v.aya}`}
          renderItem={renderVerse}
          contentContainerStyle={{
            paddingTop: HEADER_MAX_HEIGHT + 10,
            paddingHorizontal: 16,
            paddingBottom: 24,
          }}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          estimatedItemSize={188}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          ListEmptyComponent={
            <ThemedText style={[styles.emptyText, { fontSize: fontSize }]}>
              {t("noData")}
            </ThemedText>
          }
        />
      )}

      {/* Bottom Sheet for Verse Info */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        enablePanDownToClose={true}
        backgroundStyle={{ backgroundColor: Colors[cs].background }}
        handleIndicatorStyle={{
          backgroundColor: Colors[cs].defaultIcon,
        }}
      >
        <BottomSheetScrollView style={styles.bottomSheetContent}>
          {selectedVerse && (
            <>
              {/* Header */}
              <View style={styles.bottomSheetHeader}>
                <ThemedText
                  style={[styles.bottomSheetTitle, { fontSize: fontSize }]}
                >
                  {juzHeader
                    ? `${juzHeader.title} – ${t("ayah")} ${
                        selectedVerse.sura
                      }:${selectedVerse.aya}`
                    : `${displayName} - ${t("ayah")} ${selectedVerse.aya}`}
                </ThemedText>
                <TouchableOpacity
                  onPress={() => bottomSheetRef.current?.close()}
                  style={styles.closeButton}
                >
                  <Ionicons
                    name="close-circle"
                    size={28}
                    color={Colors[cs].defaultIcon}
                  />
                </TouchableOpacity>
              </View>

              {/* Divider */}
              <View
                style={[styles.divider, { backgroundColor: Colors[cs].border }]}
              />

              {/* Content */}
              <View style={styles.infoContent}>
                {/* Arabic Text */}
                {selectedArabicVerse && (
                  <View style={styles.infoSection}>
                    <ThemedText
                      style={[styles.infoLabel, { fontSize: fontSize }]}
                    >
                      {t("arabicText")}:
                    </ThemedText>
                    <ThemedText
                      style={[
                        styles.infoArabicText,
                        {
                          fontSize: fontSize * 1.3,
                          lineHeight: lineHeight * 1.5,
                        },
                      ]}
                    >
                      {selectedArabicVerse.text}
                    </ThemedText>
                  </View>
                )}

                {/* Translation */}
                {lang !== "ar" && (
                  <View style={styles.infoSection}>
                    <ThemedText
                      style={[styles.infoLabel, { fontSize: fontSize }]}
                    >
                      {t("translation")}:
                    </ThemedText>
                    <ThemedText
                      style={[styles.infoTranslation, { fontSize: fontSize }]}
                    >
                      {selectedVerse.text}
                    </ThemedText>
                  </View>
                )}

                {/* Tafsir/Commentary */}
                <View style={styles.infoSection}>
                  <ThemedText
                    style={[styles.infoLabel, { fontSize: fontSize }]}
                  >
                    {t("tafsir")}:
                  </ThemedText>
                  <ThemedText
                    style={[styles.infoTafsir, { fontSize: fontSize }]}
                  >
                    {t("tafsirPlaceholder") ||
                      "Detailed explanation and commentary for this verse will appear here. This can include historical context, interpretations, and scholarly insights."}
                  </ThemedText>
                </View>

                {/* Additional Info */}
                <View style={styles.infoSection}>
                  <ThemedText
                    style={[styles.infoLabel, { fontSize: fontSize }]}
                  >
                    {t("additionalInfo")}:
                  </ThemedText>
                  <View style={styles.metaInfo}>
                    {!juzHeader && (
                      <ThemedText
                        style={[styles.metaText, { fontSize: fontSize }]}
                      >
                        • {t("surahNumber")}: {suraNumber}
                      </ThemedText>
                    )}
                    <ThemedText
                      style={[styles.metaText, { fontSize: fontSize }]}
                    >
                      • {t("verseNumber")}: {selectedVerse.sura}:
                      {selectedVerse.aya}
                    </ThemedText>
                    {!juzHeader && (
                      <ThemedText
                        style={[styles.metaText, { fontSize: fontSize }]}
                      >
                        • {t("revelation")}:{" "}
                        {suraInfo?.makki ? t("makki") : t("madani")}
                      </ThemedText>
                    )}
                  </View>
                </View>
              </View>
            </>
          )}
        </BottomSheetScrollView>
      </BottomSheet>
    </ThemedView>
  );
};

export default SuraScreen;

// -----------------------------------------------------------------------------
// helpers
// -----------------------------------------------------------------------------

async function loadBookmarkedVerses(suraNumber: number): Promise<Set<number>> {
  try {
    const bookmarksKey = `bookmarks_sura_${suraNumber}`;
    const storedBookmarks = await Storage.getItemAsync(bookmarksKey);
    if (storedBookmarks) {
      const arr = JSON.parse(storedBookmarks) as number[];
      return new Set(arr);
    }
  } catch (error) {
    console.error("Error loading bookmarks:", error);
  }
  return new Set();
}

// -----------------------------------------------------------------------------
// styles
// -----------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingWrap: {
    paddingTop: 32,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  headerContainer: {
    flex: 1,
    justifyContent: "center",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  headerTextContainer: {
    flex: 1,
    marginHorizontal: 16,
  },
  suraName: {
    paddingTop: 5,
    fontSize: 30,
    lineHeight: 35,
    fontWeight: "700",
  },

  subMeta: {
    fontWeight: "600",
    color: Colors.universal.grayedOut,
  },
  suraNameAr: {
    textAlign: "right",
    fontSize: 24,
  },
  arabicTransliterationText: {
    fontStyle: "italic",
    fontWeight: "400",
    textAlign: "left",
    color: Colors.universal.grayedOut,
  },
  emptyText: {
    textAlign: "center",
    padding: 24,
  },

  bottomSheetContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  bottomSheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  bottomSheetTitle: {
    fontWeight: "700",
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  divider: {
    height: 1,
    marginBottom: 16,
  },
  infoContent: {
    paddingBottom: 20,
  },
  infoSection: {
    marginBottom: 20,
  },
  infoLabel: {
    fontWeight: "600",
    color: Colors.universal.grayedOut,
    marginBottom: 8,
  },
  infoArabicText: {
    textAlign: "right",
    fontWeight: "400",
  },
  infoTranslation: {},
  infoTafsir: {
    textAlign: "justify",
  },
  metaInfo: {
    gap: 4,
  },
  metaText: {},
});
