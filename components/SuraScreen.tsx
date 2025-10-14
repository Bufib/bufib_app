// ! Mit vorne und zurück aber header nicht sicher bei hochscrollen
// // import React, {
// //   useEffect,
// //   useMemo,
// //   useRef,
// //   useState,
// //   useCallback,
// // } from "react";
// // import {
// //   View,
// //   StyleSheet,
// //   TouchableOpacity,
// //   useColorScheme,
// //   Animated,
// //   Alert,
// //   InteractionManager, // ✅ added
// // } from "react-native";
// // import { router, useLocalSearchParams } from "expo-router";
// // import { useTranslation } from "react-i18next";
// // import { SafeAreaView } from "react-native-safe-area-context";
// // import { Ionicons } from "@expo/vector-icons";
// // import { Storage } from "expo-sqlite/kv-store";
// // import { useWindowDimensions } from "react-native";
// // import BottomSheet, {
// //   BottomSheetBackdrop,
// //   BottomSheetScrollView,
// // } from "@gorhom/bottom-sheet";
// // import { FlashList } from "@shopify/flash-list";
// // import { ThemedView } from "@/components/ThemedView";
// // import { ThemedText } from "@/components/ThemedText";
// // import { LoadingIndicator } from "@/components/LoadingIndicator";
// // import HeaderLeftBackButton from "./HeaderLeftBackButton";
// // import VerseCard from "@/components/VerseCard";

// // import { useLastSuraStore } from "@/stores/useLastSura";
// // import { Colors } from "@/constants/Colors";
// // import { useLanguage } from "@/contexts/LanguageContext";
// // import { SuraRowType, QuranVerseType, LanguageCode } from "@/constants/Types";

// // import {
// //   getSurahVerses,
// //   getSurahDisplayName,
// //   getSurahInfoByNumber,
// //   getJuzVerses,
// //   getJuzBounds,
// //   getPageVerses,
// //   getPageBounds,
// //   getPageStart,
// // } from "@/db/queries/quran";
// // import { whenDatabaseReady } from "@/db";
// // import FontSizePickerModal from "./FontSizePickerModal";
// // import { useReadingProgressQuran } from "@/stores/useReadingProgressQuran";
// // import { useFontSizeStore } from "@/stores/fontSizeStore";

// // // 🔹 index helpers
// // import {
// //   seedJuzIndex,
// //   seedPageIndex,
// //   getJuzPosForVerse,
// //   getPagePosForVerse,
// //   getJuzCoverageForSura, // ✅ added (bonus pre-seed for juz coverage)
// // } from "@/utils/quranIndex";

// // // constants / helpers
// // const HEADER_MAX_HEIGHT = 120;
// // const HEADER_MIN_HEIGHT = 60;
// // const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

// // // key for arabic lookup across juz/page (spans multiple surahs)
// // const vkey = (s: number, a: number) => `${s}:${a}`;

// // /* ------------------------------------------------------------------ */
// // /* ✅ NEW: Pre-seed only the relevant pages for the current sūrah      */
// // /* ------------------------------------------------------------------ */
// // async function preseedPagesForSurah(info: SuraRowType, firstBatchSize = 3) {
// //   if (!info?.startPage || !info?.endPage) return;

// //   const start = Math.max(1, info.startPage);
// //   const end = Math.max(start, info.endPage);

// //   const total = end - start + 1;
// //   const batch = Math.min(firstBatchSize, total);

// //   // Seed a small batch immediately to make first bookmark instant
// //   await Promise.all(
// //     Array.from({ length: batch }, (_, i) => seedPageIndex(start + i))
// //   );

// //   // Defer the rest so we don't block UI interactions/scroll
// //   if (batch < total) {
// //     InteractionManager.runAfterInteractions(() => {
// //       (async () => {
// //         for (let p = start + batch; p <= end; p++) {
// //           try {
// //             await seedPageIndex(p);
// //           } catch {}
// //         }
// //       })();
// //     });
// //   }
// // }

// // const SuraScreen: React.FC = () => {
// //   const { t } = useTranslation();
// //   const cs = (useColorScheme() || "light") as "light" | "dark";
// //   const { language, isArabic } = useLanguage();
// //   const lang = (language ?? "de") as LanguageCode;
// //   const { width } = useWindowDimensions();

// //   // account for list + card paddings (16 + 16 on both sides)
// //   const translitContentWidth = Math.max(0, width - 64);

// //   // Accept suraId (surah mode) or juzId (juz mode) or pageId (page mode)
// //   const { suraId, juzId, pageId } = useLocalSearchParams<{
// //     suraId?: string;
// //     juzId?: string;
// //     pageId?: string;
// //   }>();
// //   const isPageMode = !!pageId;
// //   const isJuzMode = !!juzId && !isPageMode;
// //   const juzNumber = isJuzMode ? Number(juzId) : null;
// //   const pageNumber = isPageMode ? Number(pageId) : null;
// //   const suraNumber = useMemo(() => Number(suraId ?? 1), [suraId]);

// //   const [loading, setLoading] = useState(true);
// //   const [hasTafsir] = useState(true);
// //   const [verses, setVerses] = useState<QuranVerseType[]>([]);
// //   const [arabicVerses, setArabicVerses] = useState<QuranVerseType[]>([]);
// //   const [suraInfo, setSuraInfo] = useState<SuraRowType | null>(null);
// //   const { fontSize, lineHeight } = useFontSizeStore();
// //   const [nextPage, setNextPage] = useState<number | null>(null);
// //   const [prevPage, setPrevPage] = useState<number | null>(null);
// //   const [jumping, setJumping] = useState(false);

// //   // Header bits
// //   const [displayName, setDisplayName] = useState<string>(""); // Surah title (surah mode)
// //   const [juzHeader, setJuzHeader] = useState<{
// //     title: string;
// //     subtitle?: string;
// //   } | null>(null); // Reused for Juz and Page titles

// //   // Bookmarks by sura for highlighting in all modes
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
// //     // Only set this in surah mode; in juz/page mode, leave the last sura as-is
// //     if (!isJuzMode && !isPageMode) setLastSura(suraNumber);
// //   }, [suraNumber, isJuzMode, isPageMode, setLastSura]);

// //   // Animation refs
// //   const scrollY = useRef(new Animated.Value(0)).current;

// //   // Bottom Sheet ref
// //   const bottomSheetRef = useRef<BottomSheet>(null);
// //   const snapPoints = useMemo(() => ["75%"], []);

// //   // progress actions
// //   const setTotalVerses = useReadingProgressQuran((s) => s.setTotalVerses);
// //   const updateBookmarkProgress = useReadingProgressQuran(
// //     (s) => s.updateBookmark
// //   );
// //   const setTotalVersesForJuz = useReadingProgressQuran(
// //     (s) => s.setTotalVersesForJuz
// //   );
// //   const updateJuzBookmark = useReadingProgressQuran((s) => s.updateJuzBookmark);
// //   const setTotalVersesForPage = useReadingProgressQuran(
// //     (s) => s.setTotalVersesForPage
// //   );
// //   const updatePageBookmark = useReadingProgressQuran(
// //     (s) => s.updatePageBookmark
// //   );

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
// //           setTotalVersesForJuz(juzNumber, vers.length);

// //           // Seed quranIndex for this juz so we can map any verse → (idx,total)
// //           seedJuzIndex(juzNumber, vers);

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
// //             setJuzHeader((prev) => prev);
// //             setBookmarksBySura(map);
// //           }
// //         } else if (isPageMode && pageNumber) {
// //           // --- PAGE MODE ---
// //           const [vers, arabicVers] = await Promise.all([
// //             getPageVerses(lang, pageNumber),
// //             getPageVerses("ar", pageNumber),
// //           ]);
// //           setTotalVersesForPage(pageNumber, vers.length);

// //           // Seed quranIndex for this page so we can map any verse → (idx,total)
// //           seedPageIndex(pageNumber, vers);

// //           const bounds = await getPageBounds(pageNumber);
// //           if (bounds) {
// //             const startName =
// //               (await getSurahDisplayName(bounds.startSura, lang)) ??
// //               `Sura ${bounds.startSura}`;
// //             setJuzHeader({
// //               title: `${t("page") ?? "Page"} ${pageNumber}`,
// //               subtitle: `${t("startsAt") ?? "Starts at"} ${startName} ${
// //                 bounds.startAya
// //               }`,
// //             });
// //           } else {
// //             setJuzHeader({ title: `${t("page") ?? "Page"} ${pageNumber}` });
// //           }

// //           const distinctSuras = Array.from(
// //             new Set((vers ?? []).map((v) => v.sura))
// //           );
// //           const map = new Map<number, Set<number>>();
// //           for (const s of distinctSuras) {
// //             map.set(s, await loadBookmarkedVerses(s));
// //           }

// //           if (!cancelled) {
// //             setVerses((vers ?? []) as QuranVerseType[]);
// //             setArabicVerses((arabicVers ?? []) as QuranVerseType[]);
// //             setSuraInfo(null);
// //             setDisplayName("");
// //             setJuzHeader((prev) => prev);
// //             setBookmarksBySura(map);
// //           }
// //         } else {
// //           // --- SURAH MODE ---
// //           const [vers, arabicVers, info, name] = await Promise.all([
// //             getSurahVerses(lang, suraNumber),
// //             getSurahVerses("ar", suraNumber),
// //             getSurahInfoByNumber(suraNumber),
// //             getSurahDisplayName(suraNumber, lang),
// //           ]);
// //           const totalVerses = info?.nbAyat ?? vers?.length ?? 0;

// //           setTotalVerses(suraNumber, totalVerses);

// //           // ✅ Pre-seed only the pages that can contain this sūrah (fast path)
// //           try {
// //             await preseedPagesForSurah(info!);
// //           } catch {}

// //           // ✅ Bonus: pre-seed juz coverage for this sūrah after interactions
// //           InteractionManager.runAfterInteractions(() => {
// //             getJuzCoverageForSura(suraNumber).catch(() => {});
// //           });

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
// //   }, [
// //     lang,
// //     suraNumber,
// //     isJuzMode,
// //     juzNumber,
// //     isPageMode,
// //     pageNumber,
// //     setTotalVerses,
// //     setTotalVersesForJuz,
// //     setTotalVersesForPage,
// //     t,
// //   ]);

// //   useEffect(() => {
// //     let cancelled = false;

// //     (async () => {
// //       // Only relevant in Page mode
// //       if (!isPageMode || !pageNumber) {
// //         if (!cancelled) {
// //           setNextPage(null);
// //           setPrevPage(null); // ← NEW
// //         }
// //         return;
// //       }

// //       try {
// //         // NEXT
// //         const next = await getPageStart(pageNumber + 1);
// //         if (!cancelled) setNextPage(next ? pageNumber + 1 : null);

// //         // PREV (only if > 1)
// //         let prev: number | null = null;
// //         if (pageNumber > 1) {
// //           const prevStart = await getPageStart(pageNumber - 1);
// //           prev = prevStart ? pageNumber - 1 : null;
// //         }
// //         if (!cancelled) setPrevPage(prev); // ← NEW
// //       } catch {
// //         if (!cancelled) {
// //           setNextPage(null);
// //           setPrevPage(null); // ← NEW
// //         }
// //       }
// //     })();

// //     return () => {
// //       cancelled = true;
// //     };
// //   }, [isPageMode, pageNumber]);

// //   // verse lookup for Arabic lines → needs (sura, aya) in juz/page mode
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

// //   const handleGoToNextPage = useCallback(async () => {
// //     if (!nextPage || jumping) return;
// //     try {
// //       setJumping(true);

// //       // Optional: pre-seed index for instant bookmark/progress mapping
// //       try {
// //         await seedPageIndex(nextPage);
// //       } catch {}

// //       // Fast param update keeps you on the same screen and re-triggers your effect
// //       router.setParams({ pageId: String(nextPage) });

// //       // If your route requires a different path, use:
// //       // router.replace({ pathname: "/quran/[pageId]", params: { pageId: String(nextPage) } });
// //     } finally {
// //       setJumping(false);
// //     }
// //   }, [nextPage, jumping]);

// //   const handleGoToPrevPage = useCallback(async () => {
// //     if (!prevPage || jumping) return;
// //     try {
// //       setJumping(true);
// //       try {
// //         await seedPageIndex(prevPage);
// //       } catch {}
// //       router.setParams({ pageId: String(prevPage) });
// //       // or router.replace({ pathname: "/quran/[pageId]", params: { pageId: String(prevPage) } });
// //     } finally {
// //       setJumping(false);
// //     }
// //   }, [prevPage, jumping]);

// //   /* ------------------------------------------------------------------ */
// //   /* ✅ UPDATED: Aggregates (juz/page) are bump-only (no regress/reset)  */
// //   /* ------------------------------------------------------------------ */
// //   const propagateToAggregates = useCallback(
// //     async (
// //       sura: number,
// //       aya: number,
// //       _listIndex: number,
// //       language: LanguageCode
// //     ) => {
// //       try {
// //         const st = useReadingProgressQuran.getState();

// //         // JUZ
// //         const jpos = await getJuzPosForVerse(sura, aya);
// //         if (jpos) {
// //           const prev = st.progressByJuz[jpos.unit]?.lastVerseNumber ?? 0;
// //           const next = jpos.idx + 1;
// //           if (next > prev) {
// //             setTotalVersesForJuz(jpos.unit, jpos.total);
// //             updateJuzBookmark(jpos.unit, next, jpos.idx, language);
// //           }
// //         }

// //         // PAGE
// //         const ppos = await getPagePosForVerse(sura, aya);
// //         if (ppos) {
// //           const prev = st.progressByPage[ppos.unit]?.lastVerseNumber ?? 0;
// //           const next = ppos.idx + 1;
// //           if (next > prev) {
// //             setTotalVersesForPage(ppos.unit, ppos.total);
// //             updatePageBookmark(ppos.unit, next, ppos.idx, language);
// //           }
// //         }
// //       } catch (e) {
// //         console.warn("propagateToAggregates error", e);
// //       }
// //     },
// //     [
// //       setTotalVersesForJuz,
// //       updateJuzBookmark,
// //       setTotalVersesForPage,
// //       updatePageBookmark,
// //     ]
// //   );

// //   // Bookmark handler
// //   const handleBookmarkVerse = useCallback(
// //     async (verse: QuranVerseType, index: number) => {
// //       try {
// //         const s = verse.sura;
// //         const verseNumber = verse.aya; // 1-based
// //         const bookmarksKey = `bookmarks_sura_${s}`; // stores [verseNumber]
// //         const detailKey = (n: number) => `bookmark_s${s}_v${n}_${lang}`; // detail (with index, etc.)

// //         const currentSet = new Set(bookmarksBySura.get(s) ?? new Set<number>());

// //         const writeBookmark = async (n: number) => {
// //           // 1) local highlight state (single bookmark per surah)
// //           const nextSet = new Set<number>([n]);
// //           const nextMap = new Map(bookmarksBySura);
// //           nextMap.set(s, nextSet);
// //           setBookmarksBySura(nextMap);

// //           // 2) storage
// //           await Storage.setItemAsync(bookmarksKey, JSON.stringify([n]));
// //           await Storage.setItemAsync(
// //             detailKey(n),
// //             JSON.stringify({
// //               suraNumber: s,
// //               verseNumber: n,
// //               index, // 0-based list index
// //               language: lang,
// //               suraName: (await getSurahDisplayName(s, lang)) ?? `Sura ${s}`,
// //               timestamp: Date.now(),
// //             })
// //           );

// //           // 3) SURAH progress (exact set)
// //           updateBookmarkProgress(s, n, index, lang);

// //           // 4) Aggregates bump-only (no regress)
// //           await propagateToAggregates(s, n, index, lang);
// //         };

// //         // --- Toggle OFF if tapping the same verse ---
// //         if (currentSet.has(verseNumber)) {
// //           currentSet.delete(verseNumber);

// //           const nextMap = new Map(bookmarksBySura);
// //           nextMap.set(s, currentSet);
// //           setBookmarksBySura(nextMap);

// //           const arr = Array.from(currentSet);
// //           if (arr.length) {
// //             await Storage.setItemAsync(bookmarksKey, JSON.stringify(arr));
// //           } else {
// //             await Storage.removeItemAsync(bookmarksKey);
// //           }
// //           await Storage.removeItemAsync(detailKey(verseNumber));

// //           // ✅ Reset SURAH progress only. Do NOT reset Juz/Page here.
// //           updateBookmarkProgress(s, 0, -1, lang);

// //           return;
// //         }

// //         // --- Replace existing (single bookmark per sūrah) ---
// //         if (currentSet.size > 0) {
// //           const prev = Array.from(currentSet)[0];
// //           Alert.alert(
// //             t("confirmBookmarkChange"),
// //             t("bookmarkReplaceQuestion"),
// //             [
// //               { text: t("cancel"), style: "cancel" },
// //               {
// //                 text: t("replace"),
// //                 style: "destructive",
// //                 onPress: async () => {
// //                   try {
// //                     await Storage.removeItemAsync(detailKey(prev));
// //                     // No aggregate reset; we only bump forward on the new bookmark
// //                     await writeBookmark(verseNumber);
// //                   } catch (e) {
// //                     console.error("Bookmark replace failed", e);
// //                   }
// //                 },
// //               },
// //             ]
// //           );
// //           return;
// //         }

// //         // --- First bookmark for this sūrah ---
// //         await writeBookmark(verseNumber);
// //       } catch (error) {
// //         console.error("Error handling bookmark:", error);
// //       }
// //     },
// //     [
// //       bookmarksBySura,
// //       lang,
// //       setBookmarksBySura,
// //       updateBookmarkProgress,
// //       propagateToAggregates,
// //       t,
// //     ]
// //   );

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
// //     const showJuzOrPage = !!juzHeader;

// //     const [modalVisible, setModalVisible] = useState(false);
// //     const colorScheme = useColorScheme() || "light";

// //     return (
// //       <Animated.View
// //         style={[
// //           styles.headerWrapper,
// //           {
// //             height: headerHeight,
// //             backgroundColor: Colors[cs].background,
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
// //               {showJuzOrPage ? (
// //                 <>
// //                   <ThemedText style={styles.suraName}>
// //                     {juzHeader?.title}
// //                   </ThemedText>
// //                   {!!juzHeader?.subtitle && (
// //                     <Animated.View style={{ opacity: headerSubtitleOpacity }}>
// //                       <ThemedText type="default" style={[styles.subMeta]}>
// //                         {juzHeader.subtitle}
// //                       </ThemedText>
// //                     </Animated.View>
// //                   )}
// //                 </>
// //               ) : (
// //                 <>
// //                   <ThemedText
// //                     style={[styles.suraName, isArabic() && styles.suraNameAr]}
// //                   >
// //                     {displayName || suraInfo?.label_en || suraInfo?.label || ""}{" "}
// //                     ({suraNumber})
// //                   </ThemedText>
// //                   <Animated.View style={{ opacity: headerSubtitleOpacity }}>
// //                     <ThemedText style={styles.subMeta}>
// //                       {t("ayatCount")}: {suraInfo?.nbAyat ?? "—"} ·{" "}
// //                       {isMakki ? t("makki") : t("madani")}
// //                     </ThemedText>
// //                   </Animated.View>
// //                 </>
// //               )}
// //             </Animated.View>
// //             <Ionicons
// //               name="text"
// //               size={28}
// //               color={Colors[colorScheme].defaultIcon}
// //               onPress={() => setModalVisible(true)}
// //               style={{ marginRight: 15 }}
// //             />
// //           </View>
// //           <FontSizePickerModal
// //             visible={modalVisible}
// //             onClose={() => setModalVisible(false)}
// //           />
// //         </SafeAreaView>
// //       </Animated.View>
// //     );
// //   };

// //   // PLAIN object for RenderHTML baseStyle inside VerseCard
// //   const translitBaseStyle = useMemo(
// //     () => StyleSheet.flatten([styles.arabicTransliterationText]),
// //     []
// //   );

// //   const renderVerse = useCallback(
// //     ({ item, index }: { item: QuranVerseType; index: number }) => {
// //       const arabicVerse = arabicByKey.get(vkey(item.sura, item.aya));
// //       const isVerseBookmarked =
// //         bookmarksBySura.get(item.sura)?.has(item.aya) ?? false;

// //       return (
// //         <VerseCard
// //           item={item}
// //           arabicVerse={arabicVerse}
// //           isBookmarked={isVerseBookmarked}
// //           isJuzMode={isJuzMode || isPageMode}
// //           translitContentWidth={translitContentWidth}
// //           translitBaseStyle={translitBaseStyle}
// //           hasTafsir={hasTafsir}
// //           onBookmark={(v) => handleBookmarkVerse(v, index)} // pass list index
// //           onOpenInfo={handleOpenInfo}
// //           language={lang}
// //         />
// //       );
// //     },
// //     [
// //       arabicByKey,
// //       bookmarksBySura,
// //       isJuzMode,
// //       isPageMode,
// //       translitContentWidth,
// //       translitBaseStyle,
// //       hasTafsir,
// //       handleBookmarkVerse,
// //       handleOpenInfo,
// //       lang,
// //     ]
// //   );

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
// //           onScroll={Animated.event(
// //             [{ nativeEvent: { contentOffset: { y: scrollY } } }],
// //             { useNativeDriver: false }
// //           )}
// //           ListEmptyComponent={
// //             <ThemedText style={[styles.emptyText, { fontSize: fontSize }]}>
// //               {t("noData")}
// //             </ThemedText>
// //           }
// //           ListFooterComponent={
// //             isPageMode && !loading ? (
// //               <View
// //                 style={[
// //                   styles.footerContainer,
// //                   prevPage
// //                     ? { justifyContent: "space-between" }
// //                     : { justifyContent: "flex-end" },
// //                 ]}
// //               >
// //                 {prevPage ? (
// //                   <TouchableOpacity
// //                     onPress={handleGoToPrevPage}
// //                     disabled={jumping}
// //                     style={[styles.fabPrev, jumping && { opacity: 0.6 }]}
// //                   >
// //                     <Ionicons
// //                       name="arrow-back-circle"
// //                       size={36}
// //                       color={Colors[cs].defaultIcon}
// //                     />
// //                   </TouchableOpacity>
// //                 ) : null}

// //                 {nextPage ? (
// //                   <TouchableOpacity
// //                     onPress={handleGoToNextPage}
// //                     disabled={jumping}
// //                     style={[styles.fabNext, jumping && { opacity: 0.6 }]}
// //                   >
// //                     <Ionicons
// //                       name="arrow-forward-circle"
// //                       size={36}
// //                       color={Colors[cs].defaultIcon}
// //                     />
// //                   </TouchableOpacity>
// //                 ) : null}
// //               </View>
// //             ) : null
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
// //         backgroundStyle={{ backgroundColor: Colors[cs].background }}
// //         handleIndicatorStyle={{
// //           backgroundColor: Colors[cs].defaultIcon,
// //         }}
// //       >
// //         <BottomSheetScrollView style={styles.bottomSheetContent}>
// //           {selectedVerse && (
// //             <>
// //               {/* Header */}
// //               <View style={styles.bottomSheetHeader}>
// //                 <ThemedText
// //                   style={[styles.bottomSheetTitle, { fontSize: fontSize }]}
// //                 >
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
// //                     color={Colors[cs].defaultIcon}
// //                   />
// //                 </TouchableOpacity>
// //               </View>

// //               {/* Divider */}
// //               <View
// //                 style={[styles.divider, { backgroundColor: Colors[cs].border }]}
// //               />

// //               {/* Content */}
// //               <View style={styles.infoContent}>
// //                 {/* Arabic Text */}
// //                 {selectedArabicVerse && (
// //                   <View style={styles.infoSection}>
// //                     <ThemedText
// //                       style={[styles.infoLabel, { fontSize: fontSize }]}
// //                     >
// //                       {t("arabicText")}:
// //                     </ThemedText>
// //                     <ThemedText
// //                       style={[
// //                         styles.infoArabicText,
// //                         {
// //                           fontSize: fontSize * 1.3,
// //                           lineHeight: lineHeight * 1.5,
// //                         },
// //                       ]}
// //                     >
// //                       {selectedArabicVerse.text}
// //                     </ThemedText>
// //                   </View>
// //                 )}

// //                 {/* Translation */}
// //                 {lang !== "ar" && (
// //                   <View style={styles.infoSection}>
// //                     <ThemedText
// //                       style={[styles.infoLabel, { fontSize: fontSize }]}
// //                     >
// //                       {t("translation")}:
// //                     </ThemedText>
// //                     <ThemedText
// //                       style={[styles.infoTranslation, { fontSize: fontSize }]}
// //                     >
// //                       {selectedVerse.text}
// //                     </ThemedText>
// //                   </View>
// //                 )}

// //                 {/* Tafsir/Commentary */}
// //                 <View style={styles.infoSection}>
// //                   <ThemedText
// //                     style={[styles.infoLabel, { fontSize: fontSize }]}
// //                   >
// //                     {t("tafsir")}:
// //                   </ThemedText>
// //                   <ThemedText
// //                     style={[styles.infoTafsir, { fontSize: fontSize }]}
// //                   >
// //                     {t("tafsirPlaceholder") ||
// //                       "Detailed explanation and commentary for this verse will appear here. This can include historical context, interpretations, and scholarly insights."}
// //                   </ThemedText>
// //                 </View>

// //                 {/* Additional Info */}
// //                 <View style={styles.infoSection}>
// //                   <ThemedText
// //                     style={[styles.infoLabel, { fontSize: fontSize }]}
// //                   >
// //                     {t("additionalInfo")}:
// //                   </ThemedText>
// //                   <View style={styles.metaInfo}>
// //                     {!juzHeader && (
// //                       <ThemedText
// //                         style={[styles.metaText, { fontSize: fontSize }]}
// //                       >
// //                         • {t("surahNumber")}: {suraNumber}
// //                       </ThemedText>
// //                     )}
// //                     <ThemedText
// //                       style={[styles.metaText, { fontSize: fontSize }]}
// //                     >
// //                       • {t("verseNumber")}: {selectedVerse.sura}:
// //                       {selectedVerse.aya}
// //                     </ThemedText>
// //                     {!juzHeader && (
// //                       <ThemedText
// //                         style={[styles.metaText, { fontSize: fontSize }]}
// //                       >
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

// // export default SuraScreen;

// // // -----------------------------------------------------------------------------
// // // helpers
// // // -----------------------------------------------------------------------------

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

// // // -----------------------------------------------------------------------------
// // // styles
// // // -----------------------------------------------------------------------------

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
// //     marginTop: 15,
// //   },
// //   headerTextContainer: {
// //     flex: 1,
// //     marginHorizontal: 16,
// //   },
// //   suraName: {
// //     fontSize: 25,
// //     fontWeight: "700",
// //     lineHeight: 35,
// //   },
// //   suraNameAr: {
// //     fontSize: 25,
// //     textAlign: "right",
// //     lineHeight: 35,
// //   },
// //   subMeta: {
// //     fontWeight: "600",
// //     fontSize: 16,
// //     lineHeight: 35,
// //     color: Colors.universal.grayedOut,
// //     marginBottom: 10,
// //     marginTop: -5,
// //   },

// //   arabicTransliterationText: {
// //     fontStyle: "italic",
// //     fontWeight: "400",
// //     textAlign: "left",
// //     color: Colors.universal.grayedOut,
// //   },
// //   emptyText: {
// //     textAlign: "center",
// //     padding: 24,
// //   },

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
// //     fontWeight: "600",
// //     color: Colors.universal.grayedOut,
// //     marginBottom: 8,
// //   },
// //   infoArabicText: {
// //     textAlign: "right",
// //     fontWeight: "400",
// //   },
// //   infoTranslation: {},
// //   infoTafsir: {
// //     textAlign: "justify",
// //   },
// //   metaInfo: {
// //     gap: 4,
// //   },
// //   metaText: {},
// //   footerContainer: {
// //     flexDirection: "row",
// //     paddingHorizontal: 16,
// //     paddingVertical: 12,
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //   },
// //   endOfContentText: {
// //     fontSize: 14,
// //     color: Colors.universal.grayedOut,
// //     fontStyle: "italic",
// //   },
// //   fabNext: {
// //     height: 56,
// //     width: 56,
// //     borderRadius: 28,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     backgroundColor: "rgba(0,0,0,0.08)",
// //     shadowColor: "#000",
// //     shadowOpacity: 0.2,
// //     shadowRadius: 6,
// //     shadowOffset: { width: 0, height: 3 },
// //     elevation: 4,
// //     zIndex: 2000,
// //   },
// //   fabPrev: {
// //     height: 56,
// //     width: 56,
// //     borderRadius: 28,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     backgroundColor: "rgba(0,0,0,0.08)",
// //     shadowColor: "#000",
// //     shadowOpacity: 0.2,
// //     shadowRadius: 6,
// //     shadowOffset: { width: 0, height: 3 },
// //     elevation: 4,
// //     zIndex: 2000,
// //   },
// // });

//! Mit header before outsoruce
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
//   Alert,
//   InteractionManager,
//   Text,
// } from "react-native";
// import { router, useLocalSearchParams } from "expo-router";
// import { useTranslation } from "react-i18next";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { Ionicons } from "@expo/vector-icons";
// import { Storage } from "expo-sqlite/kv-store";
// import { useWindowDimensions } from "react-native";
// import BottomSheet, {
//   BottomSheetBackdrop,
//   BottomSheetScrollView,
// } from "@gorhom/bottom-sheet";
// import { ThemedView } from "@/components/ThemedView";
// import { ThemedText } from "@/components/ThemedText";
// import { LoadingIndicator } from "@/components/LoadingIndicator";
// import HeaderLeftBackButton from "./HeaderLeftBackButton";
// import VerseCard from "@/components/VerseCard";
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
//   getPageVerses,
//   getPageBounds,
//   getPageStart,
// } from "@/db/queries/quran";
// import { whenDatabaseReady } from "@/db";
// import FontSizePickerModal from "./FontSizePickerModal";
// import { useReadingProgressQuran } from "@/stores/useReadingProgressQuran";
// import { useFontSizeStore } from "@/stores/fontSizeStore";
// import {
//   seedJuzIndex,
//   seedPageIndex,
//   getJuzPosForVerse,
//   getPagePosForVerse,
//   getJuzCoverageForSura,
// } from "@/utils/quranIndex";
// import { FlatList } from "react-native-gesture-handler";
// import { LinearGradient } from "expo-linear-gradient";

// // key for arabic lookup across juz/page (spans multiple surahs)
// const vkey = (s: number, a: number) => `${s}:${a}`;

// // Pre-seed only the relevant pages for the current sūrah to see bookmark quick
// async function preseedPagesForSurah(info: SuraRowType, firstBatchSize = 3) {
//   if (!info?.startPage || !info?.endPage) return;

//   const start = Math.max(1, info.startPage);
//   const end = Math.max(start, info.endPage);

//   const total = end - start + 1;
//   const batch = Math.min(firstBatchSize, total);

//   // Seed a small batch immediately to make first bookmark instant
//   await Promise.all(
//     Array.from({ length: batch }, (_, i) => seedPageIndex(start + i))
//   );

//   // Defer the rest so we don't block UI interactions/scroll
//   if (batch < total) {
//     InteractionManager.runAfterInteractions(() => {
//       (async () => {
//         for (let p = start + batch; p <= end; p++) {
//           try {
//             await seedPageIndex(p);
//           } catch {}
//         }
//       })();
//     });
//   }
// }

// const SuraScreen: React.FC = () => {
//   const colorScheme = useColorScheme() || "light";
//   const { language, isArabic } = useLanguage();
//   const lang = (language ?? "de") as LanguageCode;
//   const { width } = useWindowDimensions();
//   const { t } = useTranslation();
//   const { suraId, juzId, pageId } = useLocalSearchParams<{
//     suraId?: string;
//     juzId?: string;
//     pageId?: string;
//   }>();

//   const [loading, setLoading] = useState(true);
//   const [hasTafsir] = useState(true);
//   const [verses, setVerses] = useState<QuranVerseType[]>([]);
//   const [arabicVerses, setArabicVerses] = useState<QuranVerseType[]>([]);
//   const [suraInfo, setSuraInfo] = useState<SuraRowType | null>(null);
//   const { fontSize, lineHeight } = useFontSizeStore();
//   const [nextPage, setNextPage] = useState<number | null>(null);
//   const [prevPage, setPrevPage] = useState<number | null>(null);
//   const [jumping, setJumping] = useState(false);

//   const isPageMode = !!pageId;
//   const isJuzMode = !!juzId && !isPageMode;
//   const juzNumber = isJuzMode ? Number(juzId) : null;
//   const pageNumber = isPageMode ? Number(pageId) : null;
//   const suraNumber = useMemo(() => Number(suraId ?? 1), [suraId]);

//   // account for list + card paddings (16 + 16 on both sides)
//   const translitContentWidth = Math.max(0, width - 64);

//   // Header bits
//   const [displayName, setDisplayName] = useState<string>(""); // Surah title (surah mode)
//   const [juzHeader, setJuzHeader] = useState<{
//     title: string;
//     subtitle?: string;
//   } | null>(null); // Reused for Juz and Page titles

//   // Bookmarks by sura for highlighting in all modes
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
//     // Only set this in surah mode; in juz/page mode, leave the last sura as-is
//     if (!isJuzMode && !isPageMode) setLastSura(suraNumber);
//   }, [suraNumber, isJuzMode, isPageMode, setLastSura]);

//   // Bottom Sheet ref
//   const bottomSheetRef = useRef<BottomSheet>(null);
//   const snapPoints = useMemo(() => ["75%"], []);

//   // progress actions
//   const setTotalVerses = useReadingProgressQuran((s) => s.setTotalVerses);
//   const updateBookmarkProgress = useReadingProgressQuran(
//     (s) => s.updateBookmark
//   );
//   const setTotalVersesForJuz = useReadingProgressQuran(
//     (s) => s.setTotalVersesForJuz
//   );
//   const updateJuzBookmark = useReadingProgressQuran((s) => s.updateJuzBookmark);
//   const setTotalVersesForPage = useReadingProgressQuran(
//     (s) => s.setTotalVersesForPage
//   );
//   const updatePageBookmark = useReadingProgressQuran(
//     (s) => s.updatePageBookmark
//   );

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
//           setTotalVersesForJuz(juzNumber, vers.length);

//           // Seed quranIndex for this juz so we can map any verse → (idx,total)
//           seedJuzIndex(juzNumber, vers);

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
//             setJuzHeader((prev) => prev);
//             setBookmarksBySura(map);
//           }
//         } else if (isPageMode && pageNumber) {
//           // --- PAGE MODE ---
//           const [vers, arabicVers] = await Promise.all([
//             getPageVerses(lang, pageNumber),
//             getPageVerses("ar", pageNumber),
//           ]);
//           setTotalVersesForPage(pageNumber, vers.length);

//           // Seed quranIndex for this page so we can map any verse → (idx,total)
//           seedPageIndex(pageNumber, vers);

//           const bounds = await getPageBounds(pageNumber);
//           if (bounds) {
//             const startName =
//               (await getSurahDisplayName(bounds.startSura, lang)) ??
//               `Sura ${bounds.startSura}`;
//             setJuzHeader({
//               title: `${t("page") ?? "Page"} ${pageNumber}`,
//               subtitle: `${t("startsAt") ?? "Starts at"} ${startName} ${
//                 bounds.startAya
//               }`,
//             });
//           } else {
//             setJuzHeader({ title: `${t("page") ?? "Page"} ${pageNumber}` });
//           }

//           const distinctSuras = Array.from(
//             new Set((vers ?? []).map((v) => v.sura))
//           );
//           const map = new Map<number, Set<number>>();
//           for (const s of distinctSuras) {
//             map.set(s, await loadBookmarkedVerses(s));
//           }

//           if (!cancelled) {
//             setVerses((vers ?? []) as QuranVerseType[]);
//             setArabicVerses((arabicVers ?? []) as QuranVerseType[]);
//             setSuraInfo(null);
//             setDisplayName("");
//             setJuzHeader((prev) => prev);
//             setBookmarksBySura(map);
//           }
//         } else {
//           // --- SURAH MODE ---
//           const [vers, arabicVers, info, name] = await Promise.all([
//             getSurahVerses(lang, suraNumber),
//             getSurahVerses("ar", suraNumber),
//             getSurahInfoByNumber(suraNumber),
//             getSurahDisplayName(suraNumber, lang),
//           ]);
//           const totalVerses = info?.nbAyat ?? vers?.length ?? 0;

//           setTotalVerses(suraNumber, totalVerses);

//           // Pre-seed only the pages that can contain this sūrah (fast path)
//           try {
//             await preseedPagesForSurah(info!);
//           } catch {}

//           // Pre-seed juz coverage for this sūrah after interactions
//           InteractionManager.runAfterInteractions(() => {
//             getJuzCoverageForSura(suraNumber).catch(() => {});
//           });

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
//   }, [
//     lang,
//     suraNumber,
//     isJuzMode,
//     juzNumber,
//     isPageMode,
//     pageNumber,
//     setTotalVerses,
//     setTotalVersesForJuz,
//     setTotalVersesForPage,
//     t,
//   ]);

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
//   }, [isPageMode, pageNumber]);

//   // vVrse lookup for Arabic lines → needs (sura, aya) in juz/page mode
//   const arabicByKey = useMemo(
//     () => new Map(arabicVerses.map((v) => [vkey(v.sura, v.aya), v])),
//     [arabicVerses]
//   );

//   //Opening info bottom sheet
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

//       // Fast param update keeps you on the same screen and re-triggers your effect
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

//   // Aggregates (juz/page) are bump-only (no regress/reset)

//   const propagateToAggregates = useCallback(
//     async (
//       sura: number,
//       aya: number,
//       _listIndex: number,
//       language: LanguageCode
//     ) => {
//       try {
//         const st = useReadingProgressQuran.getState();

//         // JUZ
//         const jpos = await getJuzPosForVerse(sura, aya);
//         if (jpos) {
//           const prev = st.progressByJuz[jpos.unit]?.lastVerseNumber ?? 0;
//           const next = jpos.idx + 1;
//           if (next > prev) {
//             setTotalVersesForJuz(jpos.unit, jpos.total);
//             updateJuzBookmark(jpos.unit, next, jpos.idx, language);
//           }
//         }

//         // PAGE
//         const ppos = await getPagePosForVerse(sura, aya);
//         if (ppos) {
//           const prev = st.progressByPage[ppos.unit]?.lastVerseNumber ?? 0;
//           const next = ppos.idx + 1;
//           if (next > prev) {
//             setTotalVersesForPage(ppos.unit, ppos.total);
//             updatePageBookmark(ppos.unit, next, ppos.idx, language);
//           }
//         }
//       } catch (e) {
//         console.warn("propagateToAggregates error", e);
//       }
//     },
//     [
//       setTotalVersesForJuz,
//       updateJuzBookmark,
//       setTotalVersesForPage,
//       updatePageBookmark,
//     ]
//   );

//   // Bookmark handler
//   const handleBookmarkVerse = useCallback(
//     async (verse: QuranVerseType, index: number) => {
//       try {
//         const s = verse.sura;
//         const verseNumber = verse.aya; // 1-based
//         const bookmarksKey = `bookmarks_sura_${s}`; // stores [verseNumber]
//         const detailKey = (n: number) => `bookmark_s${s}_v${n}_${lang}`; // detail (with index, etc.)

//         const currentSet = new Set(bookmarksBySura.get(s) ?? new Set<number>());

//         const writeBookmark = async (n: number) => {
//           const nextSet = new Set<number>([n]);
//           const nextMap = new Map(bookmarksBySura);
//           nextMap.set(s, nextSet);
//           setBookmarksBySura(nextMap);

//           await Storage.setItemAsync(bookmarksKey, JSON.stringify([n]));
//           await Storage.setItemAsync(
//             detailKey(n),
//             JSON.stringify({
//               suraNumber: s,
//               verseNumber: n,
//               index, // 0-based list index
//               language: lang,
//               suraName: (await getSurahDisplayName(s, lang)) ?? `Sura ${s}`,
//               timestamp: Date.now(),
//             })
//           );

//           // 3) SURAH progress (exact set)
//           updateBookmarkProgress(s, n, index, lang);

//           // 4) Aggregates bump-only (no regress)
//           await propagateToAggregates(s, n, index, lang);
//         };

//         //  Toggle OFF if tapping the same verse
//         if (currentSet.has(verseNumber)) {
//           currentSet.delete(verseNumber);

//           const nextMap = new Map(bookmarksBySura);
//           nextMap.set(s, currentSet);
//           setBookmarksBySura(nextMap);

//           const arr = Array.from(currentSet);
//           if (arr.length) {
//             await Storage.setItemAsync(bookmarksKey, JSON.stringify(arr));
//           } else {
//             await Storage.removeItemAsync(bookmarksKey);
//           }
//           await Storage.removeItemAsync(detailKey(verseNumber));

//           // Reset SURAH progress only. Do NOT reset Juz/Page here.
//           updateBookmarkProgress(s, 0, -1, lang);

//           return;
//         }

//         //  Replace existing (single bookmark per sūrah)
//         if (currentSet.size > 0) {
//           const prev = Array.from(currentSet)[0];
//           Alert.alert(
//             t("confirmBookmarkChange"),
//             t("bookmarkReplaceQuestion"),
//             [
//               { text: t("cancel"), style: "cancel" },
//               {
//                 text: t("replace"),
//                 style: "destructive",
//                 onPress: async () => {
//                   try {
//                     await Storage.removeItemAsync(detailKey(prev));
//                     // No aggregate reset; we only bump forward on the new bookmark
//                     await writeBookmark(verseNumber);
//                   } catch (e) {
//                     console.error("Bookmark replace failed", e);
//                   }
//                 },
//               },
//             ]
//           );
//           return;
//         }

//         //  First bookmark for this sūrah
//         await writeBookmark(verseNumber);
//       } catch (error) {
//         console.error("Error handling bookmark:", error);
//       }
//     },
//     [
//       bookmarksBySura,
//       lang,
//       setBookmarksBySura,
//       updateBookmarkProgress,
//       propagateToAggregates,
//     ]
//   );

//   const StickyHeader = () => {
//     const isMakki = !!suraInfo?.makki;
//     const showJuzOrPage = !!juzHeader;
//     const [modalVisible, setModalVisible] = useState(false);
//     const colorScheme = useColorScheme() || "light";

//     return (
//       <SafeAreaView
//         edges={["top"]}
//         style={[
//           {
//             flex: 1,
//             backgroundColor: "transparent",
//           },
//         ]}
//       >
//         <View
//           style={[
//             styles.headerWrapper,
//             {
//               backgroundColor: "transparent",
//             },
//           ]}
//         >
//           <View style={styles.headerContent}>
//             <View
//               style={{ flexDirection: "row", flex: 1, alignItems: "center" }}
//             >
//               <HeaderLeftBackButton
//                 style={{
//                   color: "#000",
//                 }}
//               />
//               <View style={styles.headerTextContainer}>
//                 {showJuzOrPage ? (
//                   <>
//                     <Text style={styles.suraName}>{juzHeader?.title}</Text>
//                     {!!juzHeader?.subtitle && (
//                       <Text style={[styles.subMeta]}>{juzHeader.subtitle}</Text>
//                     )}
//                   </>
//                 ) : (
//                   <>
//                     <Text
//                       style={[styles.suraName, isArabic() && styles.suraNameAr]}
//                     >
//                       {displayName ||
//                         suraInfo?.label_en ||
//                         suraInfo?.label ||
//                         ""}{" "}
//                       ({suraNumber})
//                     </Text>
//                     <ThemedText style={styles.subMeta}>
//                       {t("ayatCount")}: {suraInfo?.nbAyat ?? "—"} ·{" "}
//                       {isMakki ? t("makki") : t("madani")}
//                     </ThemedText>
//                   </>
//                 )}
//               </View>
//             </View>
//             <Ionicons
//               name="text"
//               size={28}
//               color={Colors[colorScheme].defaultIcon}
//               onPress={() => setModalVisible(true)}
//               style={{ marginRight: 15 }}
//             />
//           </View>
//           <FontSizePickerModal
//             visible={modalVisible}
//             onClose={() => setModalVisible(false)}
//           />
//         </View>
//       </SafeAreaView>
//     );
//   };

//   // PLAIN object for RenderHTML baseStyle inside VerseCard
//   const translitBaseStyle = useMemo(
//     () => StyleSheet.flatten([styles.arabicTransliterationText]),
//     []
//   );

//   const renderVerse = useCallback(
//     ({ item, index }: { item: QuranVerseType; index: number }) => {
//       const arabicVerse = arabicByKey.get(vkey(item.sura, item.aya));
//       const isVerseBookmarked =
//         bookmarksBySura.get(item.sura)?.has(item.aya) ?? false;

//       return (
//         <VerseCard
//           item={item}
//           arabicVerse={arabicVerse}
//           isBookmarked={isVerseBookmarked}
//           isJuzMode={isJuzMode || isPageMode}
//           translitContentWidth={translitContentWidth}
//           translitBaseStyle={translitBaseStyle}
//           hasTafsir={hasTafsir}
//           onBookmark={(v) => handleBookmarkVerse(v, index)}
//           onOpenInfo={handleOpenInfo}
//           language={lang}
//         />
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
//           data={verses}
//           bounces={false}
//           extraData={Array.from(bookmarksBySura.entries())}
//           keyExtractor={(v) => `${v.sura}-${v.aya}`}
//           renderItem={renderVerse}
//           ListHeaderComponent={<StickyHeader />}
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

//                 {/* Translation */}
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

//                 {/* Tafsir/Commentary */}
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
//                       "Detailed explanation and commentary for this verse will appear here. This can include historical context, interpretations, and scholarly insights."}
//                   </ThemedText>
//                 </View>

//                 {/* Additional Info */}
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
//     flex: 1,
//     paddingLeft: 10,
//   },
//   headerContent: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: 10,
//   },
//   headerTextContainer: {
//     marginLeft: 10,
//   },
//   suraName: {
//     fontSize: 20,
//     fontWeight: "700",
//     lineHeight: 24,
//     color: "#000",
//   },
//   suraNameAr: {
//     fontSize: 20,
//     textAlign: "right",
//     lineHeight: 24,
//     color: "#000",
//   },
//   subMeta: {
//     fontWeight: "600",
//     fontSize: 14,
//     lineHeight: 18,
//     color: "#000",
//     marginTop: 2,
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
//   endOfContentText: {
//     fontSize: 14,
//     color: Colors.universal.grayedOut,
//     fontStyle: "italic",
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
// });

// index.tsx

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
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useWindowDimensions } from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { FlatList } from "react-native-gesture-handler";
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
import { StickyHeader } from "./StickyHeader";
import { useSuraData } from "@/hooks/useSuraData";
import { useBookmarks } from "@/hooks/useBookmarks";
import { vkey } from "@/stores/suraStore";

const SuraScreen: React.FC = () => {
  const colorScheme = useColorScheme() || "light";
  const { language, isArabic } = useLanguage();
  const rtl = isArabic();

  const lang = (language ?? "de") as LanguageCode;
  const { width } = useWindowDimensions();
  const { t } = useTranslation();
  const { suraId, juzId, pageId } = useLocalSearchParams<{
    suraId?: string;
    juzId?: string;
    pageId?: string;
  }>();

  const [hasTafsir] = useState(true);
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

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    setScrollY(contentOffset.y);
  };

  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const translitContentWidth = Math.max(0, width - 64);
  const [selectedVerse, setSelectedVerse] = useState<QuranVerseType | null>(
    null
  );
  const [selectedArabicVerse, setSelectedArabicVerse] =
    useState<QuranVerseType | null>(null);

  const setLastSura = useLastSuraStore((s) => s.setLastSura);

  useEffect(() => {
    if (!isJuzMode && !isPageMode) setLastSura(suraNumber);
  }, [suraNumber, isJuzMode, isPageMode, setLastSura]);

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
  });

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
  }, [isPageMode, pageNumber]);

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

  const renderVerse = useCallback(
    ({ item, index }: { item: QuranVerseType; index: number }) => {
      const arabicVerse = arabicByKey.get(vkey(item.sura, item.aya));
      const isVerseBookmarked =
        bookmarksBySura.get(item.sura)?.has(item.aya) ?? false;

      return (
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
          bounces={false}
          onScroll={handleScroll}
          extraData={Array.from(bookmarksBySura.entries())}
          keyExtractor={(v) => `${v.sura}-${v.aya}`}
          renderItem={renderVerse}
          ListHeaderComponent={
            <StickyHeader
              suraNumber={suraNumber}
              suraInfo={suraInfo}
              displayName={displayName}
              juzHeader={juzHeader}
              isArabic={isArabic}
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

      {scrollY > 200 && (
        <TouchableOpacity style={styles.arrowUp} onPress={scrollToTop}>
          <AntDesign name="up" size={28} color="white" />
        </TouchableOpacity>
      )}

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
