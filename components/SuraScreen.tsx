// //! Best
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
//   NativeSyntheticEvent,
//   NativeScrollEvent,
//   FlatList,
//   Alert,
// } from "react-native";
// import { router, useLocalSearchParams } from "expo-router";
// import { useTranslation } from "react-i18next";
// import { AntDesign, Ionicons } from "@expo/vector-icons";
// import { useWindowDimensions } from "react-native";
// import BottomSheet, {
//   BottomSheetBackdrop,
//   BottomSheetScrollView,
// } from "@gorhom/bottom-sheet";
// import { ThemedView } from "@/components/ThemedView";
// import { ThemedText } from "@/components/ThemedText";
// import { LoadingIndicator } from "@/components/LoadingIndicator";
// import VerseCard from "@/components/VerseCard";
// import { useLastSuraStore } from "@/stores/useLastSura";
// import { Colors } from "@/constants/Colors";
// import { useLanguage } from "@/contexts/LanguageContext";
// import { QuranVerseType, LanguageCode, SuraRowType } from "@/constants/Types";
// import { getPageStart } from "@/db/queries/quran";
// import { useReadingProgressQuran } from "@/stores/useReadingProgressQuran";
// import { useFontSizeStore } from "@/stores/fontSizeStore";
// import { seedPageIndex } from "@/utils/quranIndex";
// import { StickyHeaderQuran } from "./StickyHeaderQuran";
// import { useSuraData } from "@/hooks/useSuraData";
// import { useBookmarks } from "@/hooks/useBookmarks";
// import { vkey } from "@/stores/suraStore";
// import BasmalaRow from "./BasmalaRow";
// import ArrowUp from "./ArrowUp";
// import { useDataVersionStore } from "@/stores/dataVersionStore";
// import { useQuranAudio } from "@/hooks/useQuranAudio";
// import { RECITERS, type ReciterId } from "@/hooks/useQuranAudio";

// const SuraScreen: React.FC = () => {
//   const colorScheme = useColorScheme() || "light";
//   const { lang, rtl } = useLanguage();

//   const { width } = useWindowDimensions();
//   const { t } = useTranslation();
//   const { suraId, juzId, pageId, verseId } = useLocalSearchParams<{
//     suraId?: string;
//     juzId?: string;
//     pageId?: string;
//     verseId?: string;
//   }>();

//   const [hasTafsir, setHasTafsir] = useState(true);
//   const { fontSize, lineHeight } = useFontSizeStore();
//   const [nextPage, setNextPage] = useState<number | null>(null);
//   const [prevPage, setPrevPage] = useState<number | null>(null);
//   const [jumping, setJumping] = useState(false);
//   const [reciter, setReciter] = useState<ReciterId>("alafasy");
//   const [pendingPlay, setPendingPlay] = useState<{
//     v: QuranVerseType;
//     i: number;
//   } | null>(null);

//   const isPageMode = !!pageId;
//   const isJuzMode = !!juzId && !isPageMode;
//   const juzNumber = isJuzMode ? Number(juzId) : null;
//   const pageNumber = isPageMode ? Number(pageId) : null;
//   const suraNumber = useMemo(() => Number(suraId ?? 1), [suraId]);
//   const [scrollY, setScrollY] = useState(0);
//   const flatListRef = useRef<FlatList<QuranVerseType>>(null);
//   const [showArrow, setShowArrow] = useState(false);
//   const showArrowRef = useRef(false);

//   const quranDataVersion = useDataVersionStore((s) => s.quranDataVersion);

//   const handleScroll = useCallback(
//     (e: NativeSyntheticEvent<NativeScrollEvent>) => {
//       const y = e.nativeEvent.contentOffset.y;
//       // hysteresis to avoid flicker near the threshold
//       const THRESH = 200;
//       const HYST = 16;
//       const next = showArrowRef.current ? y > THRESH - HYST : y > THRESH + HYST;
//       if (next !== showArrowRef.current) {
//         showArrowRef.current = next;
//         setShowArrow(next);
//       }
//     },
//     []
//   );

//   const scrollToTop = () => {
//     flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
//   };

//   const translitContentWidth = Math.max(0, width - 64);
//   const [selectedVerse, setSelectedVerse] = useState<QuranVerseType | null>(
//     null
//   );
//   const [selectedArabicVerse, setSelectedArabicVerse] =
//     useState<QuranVerseType | null>(null);

//   const bottomSheetRef = useRef<BottomSheet>(null);
//   const snapPoints = useMemo(() => ["75%"], []);

//   const setTotalVerses = useReadingProgressQuran((s) => s.setTotalVerses);
//   const setTotalVersesForJuz = useReadingProgressQuran(
//     (s) => s.setTotalVersesForJuz
//   );
//   const setTotalVersesForPage = useReadingProgressQuran(
//     (s) => s.setTotalVersesForPage
//   );

//   // Use custom hooks
//   const {
//     loading,
//     verses,
//     arabicVerses,
//     suraInfo,
//     displayName,
//     juzHeader,
//     bookmarksBySura,
//     setBookmarksBySura,
//   } = useSuraData({
//     lang,
//     suraNumber,
//     isJuzMode,
//     juzNumber,
//     isPageMode,
//     pageNumber,
//     setTotalVerses,
//     setTotalVersesForJuz,
//     setTotalVersesForPage,
//     quranDataVersion,
//   });

//   // Inside SuraScreen component, after your other hooks:
//   const { toggleVerse, isVersePlaying } = useQuranAudio(verses, {
//     getTitleFor: (v) =>
//       isJuzMode
//         ? `${juzHeader?.title ?? "Juz"} • ${v.sura}:${v.aya}`
//         : `${displayName ?? `Sura ${suraNumber}`} • ${v.aya}`,
//     reciter,
//   });

//   const openReciterPicker = useCallback(
//     (v: QuranVerseType, i: number) => {
//       const reciterOptions = (Object.keys(RECITERS) as ReciterId[]).map(
//         (id) => ({
//           text: `${RECITERS[id].label}${id === reciter ? " ✓" : ""}`,
//           onPress: () => {
//             if (id !== reciter) {
//               setReciter(id);
//               // Schedule play AFTER state update
//               setPendingPlay({ v, i });
//             } else {
//               // Same reciter, just play immediately
//               toggleVerse(v, i);
//             }
//           },
//         })
//       );

//       Alert.alert(
//         t("chooseReciter"),
//         undefined,
//         [
//           ...reciterOptions,
//           {
//             text: t?.("cancel") ?? "Cancel",
//             style: "cancel",
//           },
//         ],
//         { cancelable: true }
//       );
//     },
//     [reciter, toggleVerse, t]
//   );

//   const setLastSura = useLastSuraStore((s) => s.setLastSura);
//   const firstSura = verses?.[0]?.sura;

//   useEffect(() => {
//     if (firstSura) setLastSura(firstSura);
//   }, [firstSura, setLastSura]);

//   const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 60 }).current;

//   const onViewableItemsChanged = useRef(
//     ({ viewableItems }: { viewableItems: Array<{ item: QuranVerseType }> }) => {
//       const top = viewableItems?.[0]?.item;
//       if (top) {
//         // avoid redundant writes
//         useLastSuraStore.setState((prev) =>
//           prev.lastSura === top.sura ? prev : { lastSura: top.sura }
//         );
//       }
//     }
//   ).current;

//   // Handle pending play after reciter state update
//   // useEffect(() => {
//   //   if (!pendingPlay) return;

//   //! Here
//   //   // Now the component has re-rendered with the new reciter value
//   //   // The toggleVerse callback will use the updated reciter
//   //   const timer = setTimeout(() => {
//   //     toggleVerse(pendingPlay.v, pendingPlay.i);
//   //     setPendingPlay(null);
//   //   }, 50);

//   //   return () => clearTimeout(timer);
//   // }, [pendingPlay, toggleVerse]);

//   useEffect(() => {
//     if (!pendingPlay) return;

//     // No timeout needed - React batches updates
//     toggleVerse(pendingPlay.v, pendingPlay.i);
//     setPendingPlay(null);
//   }, [pendingPlay, toggleVerse]);

//   const bmSig = useMemo(() => {
//     let acc = bookmarksBySura.size;
//     for (const set of bookmarksBySura.values()) acc += set.size;
//     return acc;
//   }, [bookmarksBySura]);

//   const listExtraData = useMemo(
//     () => ({ quranDataVersion, bmSig }),
//     [quranDataVersion, bmSig]
//   );

//   const { handleBookmarkVerse } = useBookmarks({
//     lang,
//     bookmarksBySura,
//     setBookmarksBySura,
//   });

//   // Page navigation logic (kept in main component)
//   useEffect(() => {
//     let cancelled = false;

//     (async () => {
//       if (!isPageMode || !pageNumber) {
//         if (!cancelled) {
//           setNextPage(null);
//           setPrevPage(null);
//         }
//         return;
//       }

//       try {
//         const next = await getPageStart(pageNumber + 1);
//         if (!cancelled) setNextPage(next ? pageNumber + 1 : null);

//         let prev: number | null = null;
//         if (pageNumber > 1) {
//           const prevStart = await getPageStart(pageNumber - 1);
//           prev = prevStart ? pageNumber - 1 : null;
//         }
//         if (!cancelled) setPrevPage(prev);
//       } catch {
//         if (!cancelled) {
//           setNextPage(null);
//           setPrevPage(null);
//         }
//       }
//     })();

//     return () => {
//       cancelled = true;
//     };
//   }, [isPageMode, pageNumber, quranDataVersion]);

//   useEffect(() => {
//     if (!verseId || loading || !verses.length) return;

//     const targetAya = Number(verseId);
//     if (isNaN(targetAya)) return;

//     const targetIndex = verses.findIndex((v) => v.aya === targetAya);
//     if (targetIndex === -1) return;

//     const timer = setTimeout(() => {
//       flatListRef.current?.scrollToIndex({
//         index: targetIndex,
//         animated: true,
//         viewPosition: 0.2,
//       });
//     }, 300);

//     return () => clearTimeout(timer);
//   }, [verseId, loading, verses]);

//   const arabicByKey = useMemo(
//     () => new Map(arabicVerses.map((v) => [vkey(v.sura, v.aya), v])),
//     [arabicVerses]
//   );

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

//   const handleGoToNextPage = useCallback(async () => {
//     if (!nextPage || jumping) return;
//     try {
//       setJumping(true);
//       try {
//         await seedPageIndex(nextPage);
//       } catch {}
//       router.setParams({ pageId: String(nextPage) });
//     } finally {
//       setJumping(false);
//     }
//   }, [nextPage, jumping]);

//   const handleGoToPrevPage = useCallback(async () => {
//     if (!prevPage || jumping) return;
//     try {
//       setJumping(true);
//       try {
//         await seedPageIndex(prevPage);
//       } catch {}
//       router.setParams({ pageId: String(prevPage) });
//     } finally {
//       setJumping(false);
//     }
//   }, [prevPage, jumping]);

//   const translitBaseStyle = useMemo(
//     () => StyleSheet.flatten([styles.arabicTransliterationText]),
//     []
//   );

//   // Helper: should we show basmala before this row?
//   const shouldShowBasmala = useCallback(
//     (v: QuranVerseType, index: number) => {
//       if (v.sura === 1 || v.sura === 9) return false;
//       if (isJuzMode || isPageMode) return v.aya === 1;
//       return index === 0;
//     },
//     [isJuzMode, isPageMode]
//   );

//   const renderVerse = useCallback(
//     ({ item, index }: { item: QuranVerseType; index: number }) => {
//       const arabicVerse = arabicByKey.get(vkey(item.sura, item.aya));
//       const isVerseBookmarked =
//         bookmarksBySura.get(item.sura)?.has(item.aya) ?? false;
//       const isCurrentlyPlaying = isVersePlaying(item);

//       return (
//         <>
//           {shouldShowBasmala(item, index) && (
//             <BasmalaRow
//               fontSize={fontSize}
//               lineHeight={lineHeight}
//               lang={lang}
//               rtl={rtl}
//               t={t}
//             />
//           )}
//           <VerseCard
//             item={item}
//             arabicVerse={arabicVerse}
//             isBookmarked={isVerseBookmarked}
//             isJuzMode={isJuzMode || isPageMode}
//             translitContentWidth={translitContentWidth}
//             translitBaseStyle={translitBaseStyle}
//             hasTafsir={hasTafsir}
//             onBookmark={(v) => handleBookmarkVerse(v, index)}
//             onOpenInfo={handleOpenInfo}
//             language={lang}
//             isPlaying={isCurrentlyPlaying}
//             onPlayAudio={() => toggleVerse(item, index)}
//             onPickReciter={() => openReciterPicker(item, index)}
//           />
//         </>
//       );
//     },
//     [
//       arabicByKey,
//       bookmarksBySura,
//       isJuzMode,
//       isPageMode,
//       translitContentWidth,
//       translitBaseStyle,
//       hasTafsir,
//       handleBookmarkVerse,
//       handleOpenInfo,
//       lang,
//       isVersePlaying,
//       toggleVerse,
//       openReciterPicker,
//       fontSize,
//       lineHeight,
//       rtl,
//       t,
//       shouldShowBasmala,
//     ]
//   );

//   return (
//     <ThemedView style={styles.container}>
//       {loading ? (
//         <View style={styles.loadingWrap}>
//           <LoadingIndicator size="large" />
//         </View>
//       ) : (
//         <FlatList
//           ref={flatListRef}
//           data={verses}
//           onScroll={handleScroll}
//           // extraData={listExtraData}
//           keyExtractor={(v) => `${v.sura}-${v.aya}`}
//           bounces={false}
//           renderItem={renderVerse}
//           onViewableItemsChanged={onViewableItemsChanged}
//           onScrollToIndexFailed={(info) => {
//             // Retry after a short delay
//             setTimeout(() => {
//               flatListRef.current?.scrollToIndex({
//                 index: info.index,
//                 animated: true,
//                 viewPosition: 0.2,
//               });
//             }, 500);
//           }}
//           viewabilityConfig={viewabilityConfig}
//           ListHeaderComponent={
//             <StickyHeaderQuran
//               suraNumber={suraNumber}
//               suraInfo={suraInfo}
//               displayName={displayName}
//               juzHeader={juzHeader}
//             />
//           }
//           stickyHeaderIndices={[0]}
//           stickyHeaderHiddenOnScroll
//           contentContainerStyle={{paddingBottom: 30}}
//           ListHeaderComponentStyle={{}}
//           showsVerticalScrollIndicator={false}
//           scrollEventThrottle={16}
//           ListEmptyComponent={
//             <ThemedText style={[styles.emptyText, { fontSize: fontSize }]}>
//               {t("noData")}
//             </ThemedText>
//           }
//           ListFooterComponent={
//             isPageMode && !loading ? (
//               <View
//                 style={[
//                   styles.footerContainer,
//                   prevPage
//                     ? { justifyContent: "space-between" }
//                     : { justifyContent: "flex-end" },
//                 ]}
//               >
//                 {prevPage ? (
//                   <TouchableOpacity
//                     onPress={handleGoToPrevPage}
//                     disabled={jumping}
//                     style={[styles.fabPrev, jumping && { opacity: 0.6 }]}
//                   >
//                     <Ionicons
//                       name="arrow-back-circle"
//                       size={36}
//                       color={Colors[colorScheme].defaultIcon}
//                     />
//                   </TouchableOpacity>
//                 ) : null}

//                 {nextPage ? (
//                   <TouchableOpacity
//                     onPress={handleGoToNextPage}
//                     disabled={jumping}
//                     style={[styles.fabNext, jumping && { opacity: 0.6 }]}
//                   >
//                     <Ionicons
//                       name="arrow-forward-circle"
//                       size={36}
//                       color={Colors[colorScheme].defaultIcon}
//                     />
//                   </TouchableOpacity>
//                 ) : null}
//               </View>
//             ) : null
//           }
//         />
//       )}

//       {showArrow && <ArrowUp scrollToTop={scrollToTop} />}

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
//               <View style={styles.bottomSheetHeader}>
//                 <ThemedText
//                   style={[styles.bottomSheetTitle, { fontSize: fontSize }]}
//                 >
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

//               <View
//                 style={[
//                   styles.divider,
//                   { backgroundColor: Colors[colorScheme].border },
//                 ]}
//               />

//               <View style={styles.infoContent}>
//                 {selectedArabicVerse && (
//                   <View style={styles.infoSection}>
//                     <ThemedText
//                       style={[styles.infoLabel, { fontSize: fontSize }]}
//                     >
//                       {t("arabicText")}:
//                     </ThemedText>
//                     <ThemedText
//                       style={[
//                         styles.infoArabicText,
//                         {
//                           fontSize: fontSize * 1.3,
//                           lineHeight: lineHeight * 1.5,
//                         },
//                       ]}
//                     >
//                       {selectedArabicVerse.text}
//                     </ThemedText>
//                   </View>
//                 )}

//                 {lang !== "ar" && (
//                   <View style={styles.infoSection}>
//                     <ThemedText
//                       style={[styles.infoLabel, { fontSize: fontSize }]}
//                     >
//                       {t("translation")}:
//                     </ThemedText>
//                     <ThemedText
//                       style={[styles.infoTranslation, { fontSize: fontSize }]}
//                     >
//                       {selectedVerse.text}
//                     </ThemedText>
//                   </View>
//                 )}

//                 <View style={styles.infoSection}>
//                   <ThemedText
//                     style={[styles.infoLabel, { fontSize: fontSize }]}
//                   >
//                     {t("tafsir")}:
//                   </ThemedText>
//                   <ThemedText
//                     style={[styles.infoTafsir, { fontSize: fontSize }]}
//                   >
//                     {t("tafsirPlaceholder") ||
//                       "Detailed explanation and commentary for this verse will appear here."}
//                   </ThemedText>
//                 </View>

//                 <View style={styles.infoSection}>
//                   <ThemedText
//                     style={[styles.infoLabel, { fontSize: fontSize }]}
//                   >
//                     {t("additionalInfo")}:
//                   </ThemedText>
//                   <View style={styles.metaInfo}>
//                     {!juzHeader && (
//                       <ThemedText
//                         style={[styles.metaText, { fontSize: fontSize }]}
//                       >
//                         • {t("surahNumber")}: {suraNumber}
//                       </ThemedText>
//                     )}
//                     <ThemedText
//                       style={[styles.metaText, { fontSize: fontSize }]}
//                     >
//                       • {t("verseNumber")}: {selectedVerse.sura}:
//                       {selectedVerse.aya}
//                     </ThemedText>
//                     {!juzHeader && (
//                       <ThemedText
//                         style={[styles.metaText, { fontSize: fontSize }]}
//                       >
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

// export default SuraScreen;

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   loadingWrap: {
//     paddingTop: 32,
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   arabicTransliterationText: {
//     fontStyle: "italic",
//     fontWeight: "400",
//     textAlign: "left",
//     color: Colors.universal.grayedOut,
//   },
//   emptyText: {
//     textAlign: "center",
//     padding: 24,
//   },
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
//     fontWeight: "600",
//     color: Colors.universal.grayedOut,
//     marginBottom: 8,
//   },
//   infoArabicText: {
//     textAlign: "right",
//     fontWeight: "400",
//   },
//   infoTranslation: {},
//   infoTafsir: {
//     textAlign: "justify",
//   },
//   metaInfo: {
//     gap: 4,
//   },
//   metaText: {},
//   footerContainer: {
//     flexDirection: "row",
//     paddingHorizontal: 16,
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingBottom: 40,
//   },
//   fabNext: {
//     height: 56,
//     width: 56,
//     borderRadius: 28,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "rgba(0,0,0,0.08)",
//     shadowColor: "#000",
//     shadowOpacity: 0.2,
//     shadowRadius: 6,
//     shadowOffset: { width: 0, height: 3 },
//     elevation: 4,
//     zIndex: 2000,
//   },
//   fabPrev: {
//     height: 56,
//     width: 56,
//     borderRadius: 28,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "rgba(0,0,0,0.08)",
//     shadowColor: "#000",
//     shadowOpacity: 0.2,
//     shadowRadius: 6,
//     shadowOffset: { width: 0, height: 3 },
//     elevation: 4,
//     zIndex: 2000,
//   },
//   arrowUp: {
//     position: "absolute",
//     bottom: "60%",
//     right: "3%",
//     borderWidth: 2.5,
//     borderRadius: 99,
//     padding: 5,
//     backgroundColor: Colors.universal.primary,
//     borderColor: Colors.universal.primary,
//   },
// });

//! Best with differen alert
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
  NativeSyntheticEvent,
  NativeScrollEvent,
  FlatList,
  Modal,
  Animated,
  Text,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import VerseCard from "@/components/VerseCard";
import { useLastSuraStore } from "@/stores/useLastSura";
import { Colors } from "@/constants/Colors";
import { useLanguage } from "@/contexts/LanguageContext";
import { QuranVerseType } from "@/constants/Types";
import { getPageStart } from "@/db/queries/quran";
import { useReadingProgressQuran } from "@/stores/useReadingProgressQuran";
import { useFontSizeStore } from "@/stores/fontSizeStore";
import { seedPageIndex } from "@/utils/quranIndex";
import { StickyHeaderQuran } from "./StickyHeaderQuran";
import { useSuraData } from "@/hooks/useSuraData";
import { useBookmarks } from "@/hooks/useBookmarks";
import { vkey } from "@/stores/suraStore";
import BasmalaRow from "./BasmalaRow";
import ArrowUp from "./ArrowUp";
import { useDataVersionStore } from "@/stores/dataVersionStore";
import { useQuranAudio } from "@/hooks/useQuranAudio";
import { RECITERS, type ReciterId } from "@/hooks/useQuranAudio";
import { useScreenFadeIn } from "@/hooks/useScreenFadeIn";

const SuraScreen: React.FC = () => {
  const colorScheme = useColorScheme() || "light";
  const { lang, rtl } = useLanguage();

  const { t } = useTranslation();
  const { suraId, juzId, pageId, verseId } = useLocalSearchParams<{
    suraId?: string;
    juzId?: string;
    pageId?: string;
    verseId?: string;
  }>();

  const hasTafsir = true;
  const { fontSize, lineHeight } = useFontSizeStore();
  const [nextPage, setNextPage] = useState<number | null>(null);
  const [prevPage, setPrevPage] = useState<number | null>(null);
  const [jumping, setJumping] = useState(false);
  const [reciter, setReciter] = useState<ReciterId>("alafasy");
  const [pendingPlay, setPendingPlay] = useState<{
    v: QuranVerseType;
    i: number;
  } | null>(null);

  const [reciterPicker, setReciterPicker] = useState<{
    visible: boolean;
    verse: QuranVerseType | null;
    index: number;
  }>({
    visible: false,
    verse: null,
    index: -1,
  });
  const isPageMode = !!pageId;
  const isJuzMode = !!juzId && !isPageMode;
  const juzNumber = isJuzMode ? Number(juzId) : null;
  const pageNumber = isPageMode ? Number(pageId) : null;
  const suraNumber = useMemo(() => Number(suraId ?? 1), [suraId]);
  const flatListRef = useRef<FlatList<QuranVerseType>>(null);
  const [showArrow, setShowArrow] = useState(false);
  const showArrowRef = useRef(false);
  const { fadeAnim, onLayout } = useScreenFadeIn(800);

  const quranDataVersion = useDataVersionStore((s) => s.quranDataVersion);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const y = e.nativeEvent.contentOffset.y;
      // hysteresis to avoid flicker near the threshold
      const THRESH = 200;
      const HYST = 16;
      const next = showArrowRef.current ? y > THRESH - HYST : y > THRESH + HYST;
      if (next !== showArrowRef.current) {
        showArrowRef.current = next;
        setShowArrow(next);
      }
    },
    []
  );

  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const [selectedVerse, setSelectedVerse] = useState<QuranVerseType | null>(
    null
  );
  const [selectedArabicVerse, setSelectedArabicVerse] =
    useState<QuranVerseType | null>(null);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["75%"], []);

  const setTotalVerses = useReadingProgressQuran((s) => s.setTotalVerses);
  const setTotalVersesForJuz = useReadingProgressQuran(
    (s) => s.setTotalVersesForJuz
  );
  const setTotalVersesForPage = useReadingProgressQuran(
    (s) => s.setTotalVersesForPage
  );

  // Use custom hooks
  const {
    loading,
    verses,
    arabicVerses,
    suraInfo,
    displayName,
    juzHeader,
    bookmarksBySura,
    setBookmarksBySura,
  } = useSuraData({
    lang,
    suraNumber,
    isJuzMode,
    juzNumber,
    isPageMode,
    pageNumber,
    setTotalVerses,
    setTotalVersesForJuz,
    setTotalVersesForPage,
    quranDataVersion,
  });

  // Inside SuraScreen component, after your other hooks:
  const { toggleVerse, isVersePlaying } = useQuranAudio(verses, {
    getTitleFor: (v) =>
      isJuzMode
        ? `${juzHeader?.title ?? "Juz"} • ${v.sura}:${v.aya}`
        : `${displayName ?? `Sura ${suraNumber}`} • ${v.aya}`,
    reciter,
  });

  const openReciterPicker = useCallback((v: QuranVerseType, i: number) => {
    setReciterPicker({
      visible: true,
      verse: v,
      index: i,
    });
  }, []);

  const handleSelectReciter = useCallback(
    (id: ReciterId) => {
      if (!reciterPicker.verse) {
        setReciterPicker({ visible: false, verse: null, index: -1 });
        return;
      }

      const verse = reciterPicker.verse;
      const index = reciterPicker.index;

      if (id !== reciter) {
        setReciter(id);
        setPendingPlay({ v: verse, i: index });
      } else {
        toggleVerse(verse, index);
      }

      setReciterPicker({ visible: false, verse: null, index: -1 });
    },
    [reciterPicker, reciter, toggleVerse]
  );

  const handleCloseReciterPicker = useCallback(() => {
    setReciterPicker({ visible: false, verse: null, index: -1 });
  }, []);

  const setLastSura = useLastSuraStore((s) => s.setLastSura);
  const firstSura = verses?.[0]?.sura;

  useEffect(() => {
    if (firstSura) setLastSura(firstSura);
  }, [firstSura, setLastSura]);

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 60 }).current;

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: { item: QuranVerseType }[] }) => {
      const top = viewableItems?.[0]?.item;
      if (top) {
        // avoid redundant writes
        useLastSuraStore.setState((prev) =>
          prev.lastSura === top.sura ? prev : { lastSura: top.sura }
        );
      }
    }
  ).current;

  // Handle pending play after reciter state update
  // useEffect(() => {
  //   if (!pendingPlay) return;

  //! Here
  //   // Now the component has re-rendered with the new reciter value
  //   // The toggleVerse callback will use the updated reciter
  //   const timer = setTimeout(() => {
  //     toggleVerse(pendingPlay.v, pendingPlay.i);
  //     setPendingPlay(null);
  //   }, 50);

  //   return () => clearTimeout(timer);
  // }, [pendingPlay, toggleVerse]);

  useEffect(() => {
    if (!pendingPlay) return;

    // No timeout needed - React batches updates
    toggleVerse(pendingPlay.v, pendingPlay.i);
    setPendingPlay(null);
  }, [pendingPlay, toggleVerse]);

  // const bmSig = useMemo(() => {
  //   let acc = bookmarksBySura.size;
  //   for (const set of bookmarksBySura.values()) acc += set.size;
  //   return acc;
  // }, [bookmarksBySura]);

  // const listExtraData = useMemo(
  //   () => ({ quranDataVersion, bmSig }),
  //   [quranDataVersion, bmSig]
  // );

  const { handleBookmarkVerse } = useBookmarks({
    lang,
    bookmarksBySura,
    setBookmarksBySura,
  });

  // Page navigation logic (kept in main component)
  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!isPageMode || !pageNumber) {
        if (!cancelled) {
          setNextPage(null);
          setPrevPage(null);
        }
        return;
      }

      try {
        const next = await getPageStart(pageNumber + 1);
        if (!cancelled) setNextPage(next ? pageNumber + 1 : null);

        let prev: number | null = null;
        if (pageNumber > 1) {
          const prevStart = await getPageStart(pageNumber - 1);
          prev = prevStart ? pageNumber - 1 : null;
        }
        if (!cancelled) setPrevPage(prev);
      } catch {
        if (!cancelled) {
          setNextPage(null);
          setPrevPage(null);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isPageMode, pageNumber, quranDataVersion]);

  useEffect(() => {
    if (!verseId || loading || !verses.length) return;

    const targetAya = Number(verseId);
    if (isNaN(targetAya)) return;

    const targetIndex = verses.findIndex((v) => v.aya === targetAya);
    if (targetIndex === -1) return;

    const timer = setTimeout(() => {
      flatListRef.current?.scrollToIndex({
        index: targetIndex,
        animated: true,
        viewPosition: 0.2,
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [verseId, loading, verses]);

  const arabicByKey = useMemo(
    () => new Map(arabicVerses.map((v) => [vkey(v.sura, v.aya), v])),
    [arabicVerses]
  );

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

  const handleGoToNextPage = useCallback(async () => {
    if (!nextPage || jumping) return;
    try {
      setJumping(true);
      try {
        await seedPageIndex(nextPage);
      } catch {}
      router.setParams({ pageId: String(nextPage) });
    } finally {
      setJumping(false);
    }
  }, [nextPage, jumping]);

  const handleGoToPrevPage = useCallback(async () => {
    if (!prevPage || jumping) return;
    try {
      setJumping(true);
      try {
        await seedPageIndex(prevPage);
      } catch {}
      router.setParams({ pageId: String(prevPage) });
    } finally {
      setJumping(false);
    }
  }, [prevPage, jumping]);

  const translitBaseStyle = useMemo(
    () => StyleSheet.flatten([styles.arabicTransliterationText]),
    []
  );

  // Helper: should we show basmala before this row?
  const shouldShowBasmala = useCallback(
    (v: QuranVerseType, index: number) => {
      if (v.sura === 1 || v.sura === 9) return false;
      if (isJuzMode || isPageMode) return v.aya === 1;
      return index === 0;
    },
    [isJuzMode, isPageMode]
  );

  const renderVerse = useCallback(
    ({ item, index }: { item: QuranVerseType; index: number }) => {
      const arabicVerse = arabicByKey.get(vkey(item.sura, item.aya));
      const isVerseBookmarked =
        bookmarksBySura.get(item.sura)?.has(item.aya) ?? false;
      const isCurrentlyPlaying = isVersePlaying(item);

      return (
        <>
          {shouldShowBasmala(item, index) && (
            <BasmalaRow
              fontSize={fontSize}
              lineHeight={lineHeight}
              lang={lang}
              rtl={rtl}
              t={t}
            />
          )}
          <VerseCard
            item={item}
            arabicVerse={arabicVerse}
            isBookmarked={isVerseBookmarked}
            isJuzMode={isJuzMode || isPageMode}
            translitBaseStyle={translitBaseStyle}
            hasTafsir={hasTafsir}
            onBookmark={(v) => handleBookmarkVerse(v, index)}
            onOpenInfo={handleOpenInfo}
            language={lang}
            isPlaying={isCurrentlyPlaying}
            onPlayAudio={() => toggleVerse(item, index)}
            onPickReciter={() => openReciterPicker(item, index)}
          />
        </>
      );
    },
    [
      arabicByKey,
      bookmarksBySura,
      isJuzMode,
      isPageMode,
      translitBaseStyle,
      hasTafsir,
      handleBookmarkVerse,
      handleOpenInfo,
      lang,
      isVersePlaying,
      toggleVerse,
      openReciterPicker,
      fontSize,
      lineHeight,
      rtl,
      t,
      shouldShowBasmala,
    ]
  );

  return (
    <Animated.View
      onLayout={onLayout}
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme].background, opacity: fadeAnim },
      ]}
    >
      {loading ? (
        <View style={styles.loadingWrap}>
          <LoadingIndicator size="large" />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={verses}
          onScroll={handleScroll}
          // extraData={listExtraData}
          keyExtractor={(v) => `${v.sura}-${v.aya}`}
          bounces={false}
          overScrollMode="never"
          alwaysBounceVertical={false}
          renderItem={renderVerse}
          onViewableItemsChanged={onViewableItemsChanged}
          onScrollToIndexFailed={(info) => {
            // Retry after a short delay
            setTimeout(() => {
              flatListRef.current?.scrollToIndex({
                index: info.index,
                animated: true,
                viewPosition: 0.2,
              });
            }, 500);
          }}
          viewabilityConfig={viewabilityConfig}
          ListHeaderComponent={
            <StickyHeaderQuran
              suraNumber={suraNumber}
              suraInfo={suraInfo}
              displayName={displayName}
              juzHeader={juzHeader}
              juzNumber={juzNumber} // Add this
              pageNumber={pageNumber}
            />
          }
          stickyHeaderIndices={[0]}
          stickyHeaderHiddenOnScroll
          contentContainerStyle={{ paddingBottom: 30 }}
          ListHeaderComponentStyle={{}}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          ListEmptyComponent={
            <ThemedText style={[styles.emptyText, { fontSize: fontSize }]}>
              {t("noData")}
            </ThemedText>
          }
          ListFooterComponent={
            isPageMode && !loading ? (
              <View
                style={[
                  styles.footerContainer,
                  prevPage
                    ? { justifyContent: "space-between" }
                    : { justifyContent: "flex-end" },
                ]}
              >
                {prevPage ? (
                  <TouchableOpacity
                    onPress={handleGoToPrevPage}
                    disabled={jumping}
                    style={[styles.fabPrev, jumping && { opacity: 0.6 }]}
                  >
                    <Ionicons
                      name="arrow-back-circle"
                      size={36}
                      color={Colors[colorScheme].defaultIcon}
                    />
                  </TouchableOpacity>
                ) : null}

                {nextPage ? (
                  <TouchableOpacity
                    onPress={handleGoToNextPage}
                    disabled={jumping}
                    style={[styles.fabNext, jumping && { opacity: 0.6 }]}
                  >
                    <Ionicons
                      name="arrow-forward-circle"
                      size={36}
                      color={Colors[colorScheme].defaultIcon}
                    />
                  </TouchableOpacity>
                ) : null}
              </View>
            ) : null
          }
        />
      )}

      {showArrow && <ArrowUp scrollToTop={scrollToTop} />}

      {/* Bottom Sheet for Verse Info */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        enablePanDownToClose={true}
        backgroundStyle={{ backgroundColor: Colors[colorScheme].background }}
        handleIndicatorStyle={{
          backgroundColor: Colors[colorScheme].defaultIcon,
        }}
      >
        <BottomSheetScrollView style={styles.bottomSheetContent}>
          {selectedVerse && (
            <>
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
                    name="close-circle-outline"
                    size={28}
                    color={Colors[colorScheme].defaultIcon}
                  />
                </TouchableOpacity>
              </View>

              <View
                style={[
                  styles.divider,
                  { backgroundColor: Colors[colorScheme].border },
                ]}
              />

              <View style={styles.infoContent}>
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
                      "Detailed explanation and commentary for this verse will appear here."}
                  </ThemedText>
                </View>

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

      {/* Reciter Picker - Custom iOS-like dialog */}
      <Modal
        visible={reciterPicker.visible}
        transparent
        animationType="fade"
        onRequestClose={handleCloseReciterPicker}
      >
        <ThemedView style={styles.reciterBackdrop}>
          <TouchableOpacity
            style={styles.reciterBackdropTouchable}
            activeOpacity={1}
            onPress={handleCloseReciterPicker}
          />
          <ThemedView
            style={[
              styles.reciterCard,
              { borderColor: Colors[colorScheme].border },
            ]}
          >
            <ThemedText style={styles.reciterTitle}>
              {t("chooseReciter")}
            </ThemedText>

            <View style={styles.reciterList}>
              {(Object.keys(RECITERS) as ReciterId[]).map((id) => (
                <TouchableOpacity
                  key={id}
                  style={[
                    styles.reciterOption,
                    { borderColor: Colors[colorScheme].border },
                  ]}
                  onPress={() => handleSelectReciter(id)}
                >
                  <Text
                    style={[
                      styles.reciterOptionText,
                      id === reciter && styles.reciterOptionTextActive,
                    ]}
                  >
                    {RECITERS[id].label}
                    {id === reciter ? " ✓" : ""}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[
                styles.reciterCancelButton,
                { backgroundColor: Colors[colorScheme].contrast },
              ]}
              onPress={handleCloseReciterPicker}
            >
              <ThemedText style={styles.reciterCancelText}>
                {t("cancel")}
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </Modal>
    </Animated.View>
  );
};

export default SuraScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingWrap: {
    paddingTop: 32,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  footerContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 40,
  },
  fabNext: {
    height: 56,
    width: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.08)",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    zIndex: 2000,
  },
  fabPrev: {
    height: 56,
    width: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.08)",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    zIndex: 2000,
  },
  arrowUp: {
    position: "absolute",
    bottom: "60%",
    right: "3%",
    borderWidth: 2.5,
    borderRadius: 99,
    padding: 5,
    backgroundColor: Colors.universal.primary,
    borderColor: Colors.universal.primary,
  },
  reciterBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  reciterBackdropTouchable: {
    ...StyleSheet.absoluteFillObject,
  },
  reciterCard: {
    width: "82%",
    borderRadius: 18,
    paddingTop: 14,
    paddingBottom: 8,
    paddingHorizontal: 14,
    alignItems: "stretch",
    borderWidth: 1,
  },
  reciterTitle: {
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 10,
  },
  reciterList: {
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 8,
  },
  reciterOption: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 0.2,
  },
  reciterOptionText: {
    fontSize: 16,
    lineHeight: 35,
    textAlign: "center",
    color: Colors.universal.link,
  },
  reciterOptionTextActive: {
    fontWeight: "600",
  },
  reciterCancelButton: {
    marginTop: 4,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.06)",
    marginBottom: 5,
  },
  reciterCancelText: {
    fontSize: 16,
    textAlign: "center",
  },
});
