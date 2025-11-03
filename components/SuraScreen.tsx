//! Last that worked
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
// } from "react-native";
// import { router, useLocalSearchParams } from "expo-router";
// import { useTranslation } from "react-i18next";
// import { AntDesign, Ionicons } from "@expo/vector-icons";
// import { useWindowDimensions } from "react-native";
// import BottomSheet, {
//   BottomSheetBackdrop,
//   BottomSheetScrollView,
// } from "@gorhom/bottom-sheet";
// import { FlatList } from "react-native-gesture-handler";
// import { ThemedView } from "@/components/ThemedView";
// import { ThemedText } from "@/components/ThemedText";
// import { LoadingIndicator } from "@/components/LoadingIndicator";
// import VerseCard from "@/components/VerseCard";
// import { useLastSuraStore } from "@/stores/useLastSura";
// import { Colors } from "@/constants/Colors";
// import { useLanguage } from "@/contexts/LanguageContext";
// import { QuranVerseType, LanguageCode } from "@/constants/Types";
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

// const SuraScreen: React.FC = () => {
//   const colorScheme = useColorScheme() || "light";
//   const { lang, rtl } = useLanguage();

//   const { width } = useWindowDimensions();
//   const { t } = useTranslation();
//   const { suraId, juzId, pageId } = useLocalSearchParams<{
//     suraId?: string;
//     juzId?: string;
//     pageId?: string;
//   }>();

//   const [hasTafsir, setHasTafsir] = useState(true);
//   const { fontSize, lineHeight } = useFontSizeStore();
//   const [nextPage, setNextPage] = useState<number | null>(null);
//   const [prevPage, setPrevPage] = useState<number | null>(null);
//   const [jumping, setJumping] = useState(false);

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

//   const setLastSura = useLastSuraStore((s) => s.setLastSura);

//   useEffect(() => {
//     if (!isJuzMode && !isPageMode) setLastSura(suraNumber);
//   }, [suraNumber, isJuzMode, isPageMode, setLastSura]);

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
//   const shouldShowBasmala = (v: QuranVerseType, index: number) => {
//     if (v.sura === 1 || v.sura === 9) return false;
//     // Aggregates: show when a new sura starts
//     if (isJuzMode || isPageMode) return v.aya === 1;
//     // Sura mode: show once before first verse
//     return index === 0;
//   };

//   const renderVerse = useCallback(
//     ({ item, index }: { item: QuranVerseType; index: number }) => {
//       const arabicVerse = arabicByKey.get(vkey(item.sura, item.aya));
//       const isVerseBookmarked =
//         bookmarksBySura.get(item.sura)?.has(item.aya) ?? false;

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
//           extraData={listExtraData}
//           keyExtractor={(v) => `${v.sura}-${v.aya}`}
//           renderItem={renderVerse}
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
//           contentContainerStyle={{}}
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
//     paddingVertical: 12,
//     justifyContent: "space-between",
//     alignItems: "center",
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
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useWindowDimensions } from "react-native";
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
import { QuranVerseType, LanguageCode } from "@/constants/Types";
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

const SuraScreen: React.FC = () => {
  const colorScheme = useColorScheme() || "light";
  const { lang, rtl } = useLanguage();

  const { width } = useWindowDimensions();
  const { t } = useTranslation();
  const { suraId, juzId, pageId, verseId } = useLocalSearchParams<{
    suraId?: string;
    juzId?: string;
    pageId?: string;
    verseId?: string;
  }>();

  const [hasTafsir, setHasTafsir] = useState(true);
  const { fontSize, lineHeight } = useFontSizeStore();
  const [nextPage, setNextPage] = useState<number | null>(null);
  const [prevPage, setPrevPage] = useState<number | null>(null);
  const [jumping, setJumping] = useState(false);

  const isPageMode = !!pageId;
  const isJuzMode = !!juzId && !isPageMode;
  const juzNumber = isJuzMode ? Number(juzId) : null;
  const pageNumber = isPageMode ? Number(pageId) : null;
  const suraNumber = useMemo(() => Number(suraId ?? 1), [suraId]);
  const [scrollY, setScrollY] = useState(0);
  const flatListRef = useRef<FlatList<QuranVerseType>>(null);
  const [showArrow, setShowArrow] = useState(false);
  const showArrowRef = useRef(false);

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

  const translitContentWidth = Math.max(0, width - 64);
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

  const setLastSura = useLastSuraStore((s) => s.setLastSura); // you already have this
  const firstSura = verses?.[0]?.sura;

  useEffect(() => {
    if (firstSura) setLastSura(firstSura); // ✅ initial set for sura/juz/page modes
  }, [firstSura, setLastSura]);

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 60 }).current;

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: Array<{ item: QuranVerseType }> }) => {
      const top = viewableItems?.[0]?.item;
      if (top) {
        // avoid redundant writes
        useLastSuraStore.setState((prev) =>
          prev.lastSura === top.sura ? prev : { lastSura: top.sura }
        );
      }
    }
  ).current;

  const bmSig = useMemo(() => {
    let acc = bookmarksBySura.size;
    for (const set of bookmarksBySura.values()) acc += set.size;
    return acc;
  }, [bookmarksBySura]);

  const listExtraData = useMemo(
    () => ({ quranDataVersion, bmSig }),
    [quranDataVersion, bmSig]
  );

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

  // Add this useEffect after your other useEffects in SuraScreen component

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

    return () => clearTimeout(timer); // ← ADD THIS (cleanup)
  }, [verseId, loading, verses]); // ← ADD THIS (dependencies)

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
  const shouldShowBasmala = (v: QuranVerseType, index: number) => {
    if (v.sura === 1 || v.sura === 9) return false;
    // Aggregates: show when a new sura starts
    if (isJuzMode || isPageMode) return v.aya === 1;
    // Sura mode: show once before first verse
    return index === 0;
  };

  const renderVerse = useCallback(
    ({ item, index }: { item: QuranVerseType; index: number }) => {
      const arabicVerse = arabicByKey.get(vkey(item.sura, item.aya));
      const isVerseBookmarked =
        bookmarksBySura.get(item.sura)?.has(item.aya) ?? false;

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
            translitContentWidth={translitContentWidth}
            translitBaseStyle={translitBaseStyle}
            hasTafsir={hasTafsir}
            onBookmark={(v) => handleBookmarkVerse(v, index)}
            onOpenInfo={handleOpenInfo}
            language={lang}
          />
        </>
      );
    },
    [
      arabicByKey,
      bookmarksBySura,
      isJuzMode,
      isPageMode,
      translitContentWidth,
      translitBaseStyle,
      hasTafsir,
      handleBookmarkVerse,
      handleOpenInfo,
      lang,
    ]
  );

  return (
    <ThemedView style={styles.container}>
      {loading ? (
        <View style={styles.loadingWrap}>
          <LoadingIndicator size="large" />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={verses}
          onScroll={handleScroll}
          extraData={listExtraData}
          keyExtractor={(v) => `${v.sura}-${v.aya}`}
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
            />
          }
          stickyHeaderIndices={[0]}
          stickyHeaderHiddenOnScroll
          contentContainerStyle={{}}
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
                    name="close-circle"
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
    </ThemedView>
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
    paddingVertical: 12,
    justifyContent: "space-between",
    alignItems: "center",
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
});
