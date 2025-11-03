//! Works without clicking button
// // src/components/RenderSearchResults.tsx
// import React, { useCallback, useEffect, useRef, useState } from "react";
// import {
//   ActivityIndicator,
//   FlatList,
//   Keyboard,
//   Pressable,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
//   useColorScheme,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import debounce from "lodash.debounce";

// import { Colors } from "@/constants/Colors";
// import { useLanguage } from "@/contexts/LanguageContext";
// import type {
//   Language,
//   QuestionType,
//   QuranVerseType,
//   PodcastType,
//   NewsArticlesType,
// } from "@/constants/Types";

// import {
//   searchPrayers,
//   searchQuran,
//   searchQuestions,
//   type PagedResult,
// } from "@/db/search";
// import { useSearchPodcasts } from "@/hooks/useSearchPodcasts";
// import { useSearchNewsArticles } from "@/hooks/useSearchNewsArticles";
// import { ThemedText } from "./ThemedText";
// import { ThemedView } from "./ThemedView";
// import { useTranslation } from "react-i18next";
// import { router } from "expo-router";

// type TabType = "quran" | "questions" | "prayers" | "podcasts" | "news";

// type Props = {
//   initialTab?: TabType;
//   onPressQuran?: (v: { sura: number; aya: number }) => void;
//   onPressQuestion?: (v: { id: number }) => void;
//   onPressPrayer?: (v: { id: number }) => void;
//   onPressPodcast?: (v: { id: number }) => void;
//   onPressNews?: (v: { id: number }) => void;
//   pageSize?: number;
// };

// type QuranRow = QuranVerseType & {
//   id?: number;
//   transliteration: string | null;
// };
// type PrayerRow = {
//   id: number;
//   name: string;
//   prayer_text: string | null;
//   category_id: number | null;
// };
// type PodcastRow = PodcastType;
// type NewsRow = NewsArticlesType;
// type ResultRow = QuranRow | QuestionType | PrayerRow | PodcastRow | NewsRow;

// export default function RenderSearchResults({
//   initialTab = "quran",
//   onPressQuran,
//   onPressQuestion,
//   onPressPrayer,
//   onPressPodcast,
//   onPressNews,
//   pageSize = 30,
// }: Props) {
//   const { lang } = useLanguage();
//   const colorScheme = useColorScheme() || "light";
//   const { t } = useTranslation();

//   // ---- i18n key maps ----
//   const TAB_LABEL_KEY: Record<TabType, string> = {
//     quran: "tab_quran",
//     questions: "tab_questions",
//     prayers: "tab_prayers",
//     podcasts: "tab_podcasts",
//     news: "tab_news",
//   };
//   const PLACEHOLDER_KEY: Record<TabType, string> = {
//     quran: "placeholder_quran",
//     questions: "placeholder_questions",
//     prayers: "placeholder_prayers",
//     podcasts: "placeholder_podcasts",
//     news: "placeholder_news",
//   };

//   const [tab, setTab] = useState<TabType>(initialTab);
//   const [query, setQuery] = useState("");
//   const [debouncedTerm, setDebouncedTerm] = useState("");
//   const [rows, setRows] = useState<ResultRow[]>([]);
//   const [total, setTotal] = useState(0);
//   const [nextOffset, setNextOffset] = useState<number | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isLoadingMore, setIsLoadingMore] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const { rtl } = useLanguage();
//   // client-side paging for podcasts/news
//   const [visibleCount, setVisibleCount] = useState(pageSize);

//   // guard against stale responses
//   const reqIdRef = useRef(0);

//   // Debounce input (auto-search; no submit needed)
//   useEffect(() => {
//     const h = setTimeout(() => setDebouncedTerm(query.trim()), 350);
//     return () => clearTimeout(h);
//   }, [query]);

//   const canSearch = debouncedTerm.length > 0;

//   /* ---------- React Query hooks (only enabled on their tab) ---------- */
//   const {
//     data: podcastData = [],
//     isFetching: podcastsFetching,
//     error: podcastErr,
//   } = useSearchPodcasts(tab === "podcasts" ? debouncedTerm : ""); // disabled when not on podcasts tab

//   const {
//     data: newsData = [],
//     isFetching: newsFetching,
//     error: newsErr,
//   } = useSearchNewsArticles(tab === "news" ? debouncedTerm : ""); // disabled when not on news tab

//   /* ------------------------ Local DB search runner ------------------------ */
//   const runLocalSearch = useCallback(
//     async (opts?: { offset?: number; append?: boolean }) => {
//       if (!canSearch) {
//         setRows([]);
//         setTotal(0);
//         setNextOffset(null);
//         setError(null);
//         return;
//       }
//       if (tab === "podcasts" || tab === "news") return;

//       const myId = ++reqIdRef.current;
//       const offset = opts?.offset ?? 0;
//       const append = opts?.append ?? false;

//       try {
//         if (append) setIsLoadingMore(true);
//         else setIsLoading(true);

//         let result:
//           | PagedResult<QuranRow>
//           | PagedResult<QuestionType>
//           | PagedResult<PrayerRow>;

//         if (tab === "quran") {
//           result = await searchQuran(lang as Language, debouncedTerm, {
//             limit: pageSize,
//             offset,
//           });
//         } else if (tab === "questions") {
//           result = await searchQuestions(lang, debouncedTerm, {
//             limit: pageSize,
//             offset,
//           });
//         } else {
//           result = await searchPrayers(lang, debouncedTerm, {
//             limit: pageSize,
//             offset,
//           });
//         }

//         if (myId !== reqIdRef.current) return;

//         setError(null);
//         setTotal(result.total);
//         setNextOffset(result.nextOffset);
//         setRows((prev) => (append ? [...prev, ...result.rows] : result.rows));
//       } catch (e: any) {
//         if (myId !== reqIdRef.current) return;
//         console.warn("Search failed:", e);
//         setError(t("search_failed"));
//         if (!append) {
//           setRows([]);
//           setTotal(0);
//           setNextOffset(null);
//         }
//       } finally {
//         if (myId !== reqIdRef.current) return;
//         setIsLoading(false);
//         setIsLoadingMore(false);
//       }
//     },
//     [tab, lang, pageSize, debouncedTerm, canSearch, t]
//   );

//   /* -------- Single auto-search effect: runs on term/tab/lang changes ------- */
//   useEffect(() => {
//     reqIdRef.current++;
//     setVisibleCount(pageSize);

//     if (!canSearch) {
//       setRows([]);
//       setNextOffset(null);
//       setTotal(0);
//       setError(null);
//       return;
//     }

//     if (tab === "podcasts" || tab === "news") {
//       setError(null); // handled by React Query hooks
//     } else {
//       runLocalSearch();
//     }
//   }, [debouncedTerm, tab, lang, pageSize, canSearch, runLocalSearch]);

//   const loadMore = useCallback(() => {
//     if (!canSearch) return;

//     if (tab === "podcasts") {
//       if (!podcastsFetching && visibleCount < podcastData.length) {
//         setVisibleCount((c) => c + pageSize);
//       }
//       return;
//     }
//     if (tab === "news") {
//       if (!newsFetching && visibleCount < newsData.length) {
//         setVisibleCount((c) => c + pageSize);
//       }
//       return;
//     }

//     if (!isLoading && !isLoadingMore && nextOffset != null) {
//       runLocalSearch({ offset: nextOffset, append: true });
//     }
//   }, [
//     canSearch,
//     tab,
//     podcastsFetching,
//     newsFetching,
//     visibleCount,
//     podcastData.length,
//     newsData.length,
//     pageSize,
//     isLoading,
//     isLoadingMore,
//     nextOffset,
//     runLocalSearch,
//   ]);

//   const onClear = useCallback(() => {
//     setQuery("");
//     setRows([]);
//     setTotal(0);
//     setNextOffset(null);
//     setError(null);
//     setVisibleCount(pageSize);
//   }, [pageSize]);

//   /* ------------------------------ Rendering ------------------------------ */

//   const activeLoading =
//     tab === "podcasts"
//       ? podcastsFetching
//       : tab === "news"
//       ? newsFetching
//       : isLoading || isLoadingMore;

//   const activeError =
//     tab === "podcasts"
//       ? podcastErr?.message ?? null
//       : tab === "news"
//       ? newsErr?.message ?? null
//       : error;

//   const activeTotal =
//     tab === "podcasts"
//       ? canSearch
//         ? podcastData.length
//         : 0
//       : tab === "news"
//       ? canSearch
//         ? newsData.length
//         : 0
//       : total;

//   const activeRows: ResultRow[] =
//     tab === "podcasts"
//       ? (podcastData.slice(0, visibleCount) as ResultRow[])
//       : tab === "news"
//       ? (newsData.slice(0, visibleCount) as ResultRow[])
//       : rows;

//   const placeholder = t(PLACEHOLDER_KEY[tab]);

//   const renderItem = useCallback(
//     ({ item }: { item: ResultRow }) => {
//       if (tab === "quran") {
//         const v = item as QuranRow;
//         return (
//           <Pressable
//             onPress={() => onPressQuran?.({ sura: v.sura, aya: v.aya })}
//             style={({ pressed }) => [
//               styles.row,
//               {
//                 backgroundColor: Colors[colorScheme].contrast,
//                 opacity: pressed ? 0.8 : 1,
//                 borderWidth: 0.2,
//               },
//             ]}
//           >
//             <ThemedText style={styles.rowTitle}>
//               {t("quran_sura_aya", { sura: v.sura, aya: v.aya })}
//             </ThemedText>
//             <ThemedText style={styles.rowSubtitle} numberOfLines={3}>
//               {v.text}
//             </ThemedText>
//             {!!v.transliteration && (
//               <ThemedText style={styles.rowTiny} numberOfLines={2}>
//                 {v.transliteration}
//               </ThemedText>
//             )}
//           </Pressable>
//         );
//       } else if (tab === "questions") {
//         const q = item as QuestionType;
//         return (
//           <Pressable
//             onPress={() => onPressQuestion?.({ id: q.id })}
//             style={({ pressed }) => [
//               styles.row,
//               {
//                 backgroundColor: Colors[colorScheme].contrast,
//                 opacity: pressed ? 0.8 : 1,
//               },
//             ]}
//           >
//             <ThemedText style={styles.rowTitle} numberOfLines={2}>
//               {q.title}
//             </ThemedText>
//             <ThemedText style={styles.rowSubtitle} numberOfLines={3}>
//               {q.question}
//             </ThemedText>
//           </Pressable>
//         );
//       } else if (tab === "prayers") {
//         const p = item as PrayerRow;
//         return (
//           <Pressable
//             onPress={() => onPressPrayer?.({ id: p.id })}
//             style={({ pressed }) => [
//               styles.row,
//               {
//                 backgroundColor: Colors[colorScheme].contrast,
//                 opacity: pressed ? 0.8 : 1,
//               },
//             ]}
//           >
//             <ThemedText style={styles.rowTitle} numberOfLines={2}>
//               {p.name}
//             </ThemedText>
//             {!!p.prayer_text && (
//               <ThemedText
//                 style={[styles.rowSubtitle, rtl && { textAlign: "right" }]}
//                 numberOfLines={3}
//               >
//                 {p.prayer_text}
//               </ThemedText>
//             )}
//           </Pressable>
//         );
//       } else if (tab === "podcasts") {
//         const pc = item as PodcastRow;
//         return (
//           <Pressable
//             onPress={() => onPressPodcast?.({ id: pc.id })}
//             style={({ pressed }) => [
//               styles.row,
//               {
//                 backgroundColor: Colors[colorScheme].contrast,
//                 opacity: pressed ? 0.8 : 1,
//               },
//             ]}
//           >
//             <Text style={styles.rowTitle} numberOfLines={2}>
//               {pc.title}
//             </Text>
//             {!!pc.description && (
//               <Text style={styles.rowSubtitle} numberOfLines={3}>
//                 {pc.description}
//               </Text>
//             )}
//             <Text style={[styles.rowTiny, { marginTop: 6 }]}>
//               {new Date(pc.created_at).toLocaleDateString()}
//             </Text>
//           </Pressable>
//         );
//       } else {
//         const n = item as NewsRow;
//         return (
//           <Pressable
//             onPress={() => onPressNews?.({ id: n.id })}
//             style={({ pressed }) => [
//               styles.row,
//               {
//                 backgroundColor: Colors[colorScheme].contrast,
//                 opacity: pressed ? 0.8 : 1,
//               },
//             ]}
//           >
//             <Text style={styles.rowTitle} numberOfLines={2}>
//               {n.title}
//             </Text>
//             {!!n.content && (
//               <Text style={styles.rowSubtitle} numberOfLines={3}>
//                 {n.content}
//               </Text>
//             )}
//             <Text style={[styles.rowTiny, { marginTop: 6 }]}>
//               {new Date(n.created_at).toLocaleDateString()}
//             </Text>
//           </Pressable>
//         );
//       }
//     },
//     [
//       tab,
//       colorScheme,
//       onPressQuran,
//       onPressQuestion,
//       onPressPrayer,
//       onPressPodcast,
//       onPressNews,
//       t,
//     ]
//   );

//   // robust, UNIQUE keys
//   const hash = (s: string) => {
//     let h = 0;
//     for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
//     return Math.abs(h).toString(36);
//   };

//   const keyExtractor = useCallback(
//     (item: ResultRow, index: number) => {
//       if (tab === "quran") {
//         const v = item as Partial<QuranRow>;
//         if (v?.id != null) return `quran-${v.id}`;
//         const s = (v as any)?.sura;
//         const a = (v as any)?.aya;
//         if (Number.isFinite(s) && Number.isFinite(a)) return `quran-${s}-${a}`;
//         return `quran-fb-${hash(
//           `${(v as any)?.text ?? ""}-${(v as any)?.transliteration ?? ""}`
//         )}-${index}`;
//       } else if (tab === "questions") {
//         const q = item as QuestionType;
//         return q?.id != null
//           ? `question-${q.id}`
//           : `question-${hash(
//               `${q?.title ?? ""}-${q?.created_at ?? ""}`
//             )}-${index}`;
//       } else if (tab === "prayers") {
//         const p = item as PrayerRow;
//         return p?.id != null
//           ? `prayer-${p.id}`
//           : `prayer-${hash(`${p?.name ?? ""}`)}-${index}`;
//       } else if (tab === "podcasts") {
//         const pc = item as PodcastRow;
//         return pc?.id != null
//           ? `podcast-${pc.id}`
//           : `podcast-${hash(
//               `${pc?.title ?? ""}-${pc?.filename ?? ""}`
//             )}-${index}`;
//       } else {
//         const n = item as NewsRow;
//         return n?.id != null
//           ? `news-${n.id}`
//           : `news-${hash(`${n?.title ?? ""}-${n?.created_at ?? ""}`)}-${index}`;
//       }
//     },
//     [tab]
//   );

//   const ListHeader = (
//     <>
//       {/* HORIZONTALLY SCROLLABLE FILTER BAR */}
//       <ScrollView
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         contentContainerStyle={[
//           styles.tabs,
//           { backgroundColor: Colors[colorScheme].background },
//         ]}
//       >
//         {(
//           ["quran", "questions", "prayers", "podcasts", "news"] as TabType[]
//         ).map((tKey) => {
//           const active = tKey === tab;
//           return (
//             <TouchableOpacity
//               key={tKey}
//               onPress={() => {
//                 setTab(tKey);
//                 Keyboard.dismiss();
//               }}
//               style={[
//                 styles.tabBtn,
//                 {
//                   backgroundColor: active
//                     ? Colors.universal.primary
//                     : "transparent",
//                 },
//               ]}
//             >
//               <ThemedText style={styles.tabText}>
//                 {t(TAB_LABEL_KEY[tKey])}
//               </ThemedText>
//             </TouchableOpacity>
//           );
//         })}
//       </ScrollView>

//       {/* SEARCH FIELD (auto-search; no submit needed) */}
//       <View
//         style={[
//           styles.searchBox,
//           { backgroundColor: Colors[colorScheme].contrast },
//         ]}
//       >
//         <TextInput
//           value={query}
//           onChangeText={setQuery}
//           placeholder={t(PLACEHOLDER_KEY[tab])}
//           placeholderTextColor={Colors[colorScheme].text}
//           autoCapitalize="none"
//           autoCorrect={false}
//           returnKeyType="done"
//           style={[styles.input, { color: Colors[colorScheme].text }]}
//         />
//         {query.length > 0 && !activeLoading && (
//           <TouchableOpacity onPress={onClear} style={styles.clearBtn}>
//             <ThemedText style={{ fontSize: 18 }}>×</ThemedText>
//           </TouchableOpacity>
//         )}
//         {activeLoading && <ActivityIndicator style={{ marginLeft: 8 }} />}
//       </View>

//       {/* META LINE */}
//       {canSearch && !activeLoading && !activeError ? (
//         <ThemedText style={styles.meta}>
//           {t("results_count", { count: activeTotal })}
//         </ThemedText>
//       ) : null}
//     </>
//   );

//   const ListEmpty = (
//     <View style={styles.emptyWrap}>
//       {activeLoading ? null : activeError ? (
//         <ThemedText style={styles.emptyText}>{activeError}</ThemedText>
//       ) : (
//         <ThemedText style={styles.emptyText}>{t("noSearchResults")}</ThemedText>
//       )}
//     </View>
//   );

//   return (
//     <SafeAreaView
//       style={{ flex: 1, backgroundColor: Colors[colorScheme].background }}
//       edges={["top", "left", "right"]}
//     >
//       <ThemedView style={styles.container}>
//         <FlatList
//           key={tab} // remount per tab to avoid stale keys
//           data={activeRows}
//           keyExtractor={keyExtractor}
//           renderItem={renderItem}
//           ListHeaderComponent={ListHeader}
//           ListEmptyComponent={ListEmpty}
//           contentContainerStyle={{ paddingBottom: 40, gap: 15 }}
//           keyboardDismissMode="on-drag"
//           keyboardShouldPersistTaps="handled"
//           onEndReachedThreshold={0.4}
//           onEndReached={loadMore}
//           extraData={{
//             debouncedTerm,
//             tab,
//             lang,
//             rowsLen: rows.length,
//             total,
//             isLoading,
//             isLoadingMore,
//           }}
//         />

//         {/* Bottom spinner for local DB paging */}
//         {isLoadingMore &&
//           (tab === "quran" || tab === "questions" || tab === "prayers") && (
//             <View style={styles.moreLoader}>
//               <ActivityIndicator />
//             </View>
//           )}
//       </ThemedView>
//     </SafeAreaView>
//   );
// }

// const RADIUS = 14;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 12,
//   },
//   tabs: {
//     flexDirection: "row",
//     paddingVertical: 4,
//     borderBottomWidth: StyleSheet.hairlineWidth,
//     marginBottom: 10,
//     alignItems: "center",
//   },
//   tabBtn: {
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderRadius: 999,
//     borderWidth: StyleSheet.hairlineWidth,
//     marginRight: 8,
//   },
//   tabText: {
//     fontSize: 14,
//     fontWeight: "600",
//   },
//   searchBox: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 12,
//     borderRadius: RADIUS,
//     borderWidth: StyleSheet.hairlineWidth,
//     height: 44,
//   },
//   input: {
//     flex: 1,
//     fontSize: 16,
//   },
//   clearBtn: {
//     paddingHorizontal: 6,
//     paddingVertical: 4,
//   },
//   meta: {
//     marginTop: 8,
//     marginBottom: 6,
//     fontSize: 12,
//   },
//   row: {
//     padding: 12,
//     borderRadius: RADIUS,
//   },
//   rowTitle: {
//     fontSize: 16,
//     fontWeight: "700",
//     marginBottom: 4,
//   },
//   rowSubtitle: {
//     fontSize: 14,
//     lineHeight: 20,
//   },
//   rowTiny: {
//     fontSize: 12,
//   },

//   emptyWrap: {
//     alignItems: "center",
//     paddingVertical: 40,
//   },
//   emptyText: {
//     fontSize: 14,
//     textAlign: "center",
//     paddingHorizontal: 24,
//   },
//   moreLoader: {
//     position: "absolute",
//     left: 0,
//     right: 0,
//     bottom: 8,
//     alignItems: "center",
//   },
// });

// src/components/RenderSearchResults.tsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import debounce from "lodash.debounce";

import { Colors } from "@/constants/Colors";
import { useLanguage } from "@/contexts/LanguageContext";
import type {
  Language,
  QuestionType,
  QuranVerseType,
  PodcastType,
  NewsArticlesType,
} from "@/constants/Types";

import {
  searchPrayers,
  searchQuran,
  searchQuestions,
  type PagedResult,
} from "@/db/search";
import { useSearchPodcasts } from "@/hooks/useSearchPodcasts";
import { useSearchNewsArticles } from "@/hooks/useSearchNewsArticles";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import HtmlRenderer from "./RenderHTML";

type TabType = "quran" | "questions" | "prayers" | "podcasts" | "news";

type Props = {
  initialTab?: TabType;
  onPressQuran?: (v: { sura: number; aya: number }) => void;
  onPressQuestion?: (v: { id: number }) => void;
  onPressPrayer?: (v: { id: number }) => void;
  onPressPodcast?: (v: { id: number }) => void;
  onPressNews?: (v: { id: number }) => void;
  pageSize?: number;
};

type QuranRow = QuranVerseType & {
  id?: number;
  transliteration: string | null;
};
type PrayerRow = {
  id: number;
  name: string;
  prayer_text: string | null;
  category_id: number | null;
};
type PodcastRow = PodcastType;
type NewsRow = NewsArticlesType;
type ResultRow = QuranRow | QuestionType | PrayerRow | PodcastRow | NewsRow;

export default function RenderSearchResults({
  initialTab = "quran",
  onPressQuran,
  onPressQuestion,
  onPressPrayer,
  onPressPodcast,
  onPressNews,
  pageSize = 30,
}: Props) {
  const { lang } = useLanguage();
  const colorScheme = useColorScheme() || "light";
  const { t } = useTranslation();

  // ---- i18n key maps ----
  const TAB_LABEL_KEY: Record<TabType, string> = {
    quran: "tab_quran",
    questions: "tab_questions",
    prayers: "tab_prayers",
    podcasts: "tab_podcasts",
    news: "tab_news",
  };
  const PLACEHOLDER_KEY: Record<TabType, string> = {
    quran: "placeholder_quran",
    questions: "placeholder_questions",
    prayers: "placeholder_prayers",
    podcasts: "placeholder_podcasts",
    news: "placeholder_news",
  };

  const [tab, setTab] = useState<TabType>(initialTab);
  const [query, setQuery] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [rows, setRows] = useState<ResultRow[]>([]);
  const [total, setTotal] = useState(0);
  const [nextOffset, setNextOffset] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { rtl } = useLanguage();
  const { width } = useWindowDimensions();
  const contentWidth = Math.max(0, width - 64); // Adjust padding as needed
  // client-side paging for podcasts/news
  const [visibleCount, setVisibleCount] = useState(pageSize);

  // guard against stale responses
  const reqIdRef = useRef(0);

  // Debounce input (auto-search; no submit needed)
  useEffect(() => {
    const h = setTimeout(() => setDebouncedTerm(query.trim()), 350);
    return () => clearTimeout(h);
  }, [query]);

  const canSearch = debouncedTerm.length > 0;

  /* ---------- React Query hooks (only enabled on their tab) ---------- */
  const {
    data: podcastData = [],
    isFetching: podcastsFetching,
    error: podcastErr,
  } = useSearchPodcasts(tab === "podcasts" ? debouncedTerm : ""); // disabled when not on podcasts tab

  const {
    data: newsData = [],
    isFetching: newsFetching,
    error: newsErr,
  } = useSearchNewsArticles(tab === "news" ? debouncedTerm : ""); // disabled when not on news tab

  /* ------------------------ Local DB search runner ------------------------ */
  const runLocalSearch = useCallback(
    async (opts?: { offset?: number; append?: boolean }) => {
      if (!canSearch) {
        setRows([]);
        setTotal(0);
        setNextOffset(null);
        setError(null);
        return;
      }
      if (tab === "podcasts" || tab === "news") return;

      const myId = ++reqIdRef.current;
      const offset = opts?.offset ?? 0;
      const append = opts?.append ?? false;

      try {
        if (append) setIsLoadingMore(true);
        else setIsLoading(true);

        let result:
          | PagedResult<QuranRow>
          | PagedResult<QuestionType>
          | PagedResult<PrayerRow>;

        if (tab === "quran") {
          result = await searchQuran(lang as Language, debouncedTerm, {
            limit: pageSize,
            offset,
          });
        } else if (tab === "questions") {
          result = await searchQuestions(lang, debouncedTerm, {
            limit: pageSize,
            offset,
          });
        } else {
          result = await searchPrayers(lang, debouncedTerm, {
            limit: pageSize,
            offset,
          });
        }

        if (myId !== reqIdRef.current) return;

        setError(null);
        setTotal(result.total);
        setNextOffset(result.nextOffset);
        setRows((prev) => (append ? [...prev, ...result.rows] : result.rows));
      } catch (e: any) {
        if (myId !== reqIdRef.current) return;
        console.warn("Search failed:", e);
        setError(t("search_failed"));
        if (!append) {
          setRows([]);
          setTotal(0);
          setNextOffset(null);
        }
      } finally {
        if (myId !== reqIdRef.current) return;
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [tab, lang, pageSize, debouncedTerm, canSearch, t]
  );

  /* -------- Single auto-search effect: runs on term/tab/lang changes ------- */
  useEffect(() => {
    reqIdRef.current++;
    setVisibleCount(pageSize);

    if (!canSearch) {
      setRows([]);
      setNextOffset(null);
      setTotal(0);
      setError(null);
      return;
    }

    if (tab === "podcasts" || tab === "news") {
      setError(null); // handled by React Query hooks
    } else {
      runLocalSearch();
    }
  }, [debouncedTerm, tab, lang, pageSize, canSearch, runLocalSearch]);

  const loadMore = useCallback(() => {
    if (!canSearch) return;

    if (tab === "podcasts") {
      if (!podcastsFetching && visibleCount < podcastData.length) {
        setVisibleCount((c) => c + pageSize);
      }
      return;
    }
    if (tab === "news") {
      if (!newsFetching && visibleCount < newsData.length) {
        setVisibleCount((c) => c + pageSize);
      }
      return;
    }

    if (!isLoading && !isLoadingMore && nextOffset != null) {
      runLocalSearch({ offset: nextOffset, append: true });
    }
  }, [
    canSearch,
    tab,
    podcastsFetching,
    newsFetching,
    visibleCount,
    podcastData.length,
    newsData.length,
    pageSize,
    isLoading,
    isLoadingMore,
    nextOffset,
    runLocalSearch,
  ]);

  const onClear = useCallback(() => {
    setQuery("");
    setRows([]);
    setTotal(0);
    setNextOffset(null);
    setError(null);
    setVisibleCount(pageSize);
  }, [pageSize]);

  /* ------------------------------ Rendering ------------------------------ */

  const activeLoading =
    tab === "podcasts"
      ? podcastsFetching
      : tab === "news"
      ? newsFetching
      : isLoading || isLoadingMore;

  const activeError =
    tab === "podcasts"
      ? podcastErr?.message ?? null
      : tab === "news"
      ? newsErr?.message ?? null
      : error;

  const activeTotal =
    tab === "podcasts"
      ? canSearch
        ? podcastData.length
        : 0
      : tab === "news"
      ? canSearch
        ? newsData.length
        : 0
      : total;

  const activeRows: ResultRow[] =
    tab === "podcasts"
      ? (podcastData.slice(0, visibleCount) as ResultRow[])
      : tab === "news"
      ? (newsData.slice(0, visibleCount) as ResultRow[])
      : rows;

  const placeholder = t(PLACEHOLDER_KEY[tab]);

  const renderItem = useCallback(
    ({ item }: { item: ResultRow }) => {
      if (tab === "quran") {
        const v = item as QuranRow;
        return (
          <Pressable
            onPress={() =>
              onPressQuran
                ? onPressQuran({ sura: v.sura, aya: v.aya })
                : router.push({
                    pathname: "/(displaySura)",
                    params: { suraId: String(v.sura), verseId: v.aya },
                  })
            }
            style={({ pressed }) => [
              styles.row,
              {
                backgroundColor: Colors[colorScheme].contrast,
                opacity: pressed ? 0.8 : 1,
                borderWidth: 0.2,
              },
            ]}
          >
            <ThemedText style={styles.rowTitle}>
              {t("quran_sura_aya", { sura: v.sura, aya: v.aya })}
            </ThemedText>
            <ThemedText style={styles.rowSubtitle} numberOfLines={3}>
              {v.text}
            </ThemedText>
            {/* {!!v.transliteration && (
              <ThemedText style={styles.rowTiny} numberOfLines={2}>
                {v.transliteration}
              </ThemedText>
            )} */}

            {!!v.transliteration && (
              <HtmlRenderer
                html={v.transliteration}
                contentWidth={contentWidth}
              />
            )}
          </Pressable>
        );
      } else if (tab === "questions") {
        const q = item as QuestionType;
        return (
          <Pressable
            onPress={() =>
              onPressQuestion
                ? onPressQuestion({ id: q.id })
                : router.push({
                    pathname: "/(displayQuestion)",
                    params: {
                      category: q.question_category_name,
                      subcategory: q.question_subcategory_name,
                      questionId: q.id.toString(),
                      questionTitle: q.title,
                    },
                  })
            }
            style={({ pressed }) => [
              styles.row,
              {
                backgroundColor: Colors[colorScheme].contrast,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <ThemedText style={styles.rowTitle} numberOfLines={2}>
              {q.title}
            </ThemedText>
            <ThemedText style={styles.rowSubtitle} numberOfLines={3}>
              {q.question}
            </ThemedText>
          </Pressable>
        );
      } else if (tab === "prayers") {
        const p = item as PrayerRow;
        return (
          <Pressable
            onPress={() =>
              onPressPrayer
                ? onPressPrayer({ id: p.id })
                : router.push({
                    pathname: "/(displayPrayer)/prayer",
                    params: { prayer: String(p.id) },
                  })
            }
            style={({ pressed }) => [
              styles.row,
              {
                backgroundColor: Colors[colorScheme].contrast,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <ThemedText style={styles.rowTitle} numberOfLines={2}>
              {p.name}
            </ThemedText>
            {!!p.prayer_text && (
              <ThemedText
                style={[styles.rowSubtitle, rtl && { textAlign: "right" }]}
                numberOfLines={3}
              >
                {p.prayer_text}
              </ThemedText>
            )}
          </Pressable>
        );
      } else if (tab === "podcasts") {
        const pc = item as PodcastRow;
        return (
          <Pressable
            onPress={() =>
              onPressPodcast
                ? onPressPodcast({ id: pc.id })
                : router.push({
                    pathname: "/(podcast)/indexPodcast",
                    params: { podcast: JSON.stringify(pc) },
                  })
            }
            style={({ pressed }) => [
              styles.row,
              {
                backgroundColor: Colors[colorScheme].contrast,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <ThemedText style={styles.rowTitle} numberOfLines={2}>
              {pc.title}
            </ThemedText>
            {!!pc.description && (
              <ThemedText style={styles.rowSubtitle} numberOfLines={3}>
                {pc.description}
              </ThemedText>
            )}
            <ThemedText style={[styles.rowTiny, { marginTop: 6 }]}>
              {new Date(pc.created_at).toLocaleDateString()}
            </ThemedText>
          </Pressable>
        );
      } else {
        const n = item as NewsRow;
        return (
          <Pressable
            onPress={() =>
              onPressNews
                ? onPressNews({ id: n.id })
                : router.push({
                    pathname: "/(newsArticle)",
                    params: { articleId: String(n.id) },
                  })
            }
            style={({ pressed }) => [
              styles.row,
              {
                backgroundColor: Colors[colorScheme].contrast,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <ThemedText style={styles.rowTitle} numberOfLines={2}>
              {n.title}
            </ThemedText>
            {!!n.content && (
              <ThemedText style={styles.rowSubtitle} numberOfLines={3}>
                {n.content}
              </ThemedText>
            )}
            <ThemedText style={[styles.rowTiny, { marginTop: 6 }]}>
              {new Date(n.created_at).toLocaleDateString()}
            </ThemedText>
          </Pressable>
        );
      }
    },
    [
      tab,
      colorScheme,
      onPressQuran,
      onPressQuestion,
      onPressPrayer,
      onPressPodcast,
      onPressNews,
      contentWidth,
      t,
      rtl,
    ]
  );

  // robust, UNIQUE keys
  const hash = (s: string) => {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
    return Math.abs(h).toString(36);
  };

  const keyExtractor = useCallback(
    (item: ResultRow, index: number) => {
      if (tab === "quran") {
        const v = item as Partial<QuranRow>;
        if (v?.id != null) return `quran-${v.id}`;
        const s = (v as any)?.sura;
        const a = (v as any)?.aya;
        if (Number.isFinite(s) && Number.isFinite(a)) return `quran-${s}-${a}`;
        return `quran-fb-${hash(
          `${(v as any)?.text ?? ""}-${(v as any)?.transliteration ?? ""}`
        )}-${index}`;
      } else if (tab === "questions") {
        const q = item as QuestionType;
        return q?.id != null
          ? `question-${q.id}`
          : `question-${hash(
              `${q?.title ?? ""}-${q?.created_at ?? ""}`
            )}-${index}`;
      } else if (tab === "prayers") {
        const p = item as PrayerRow;
        return p?.id != null
          ? `prayer-${p.id}`
          : `prayer-${hash(`${p?.name ?? ""}`)}-${index}`;
      } else if (tab === "podcasts") {
        const pc = item as PodcastRow;
        return pc?.id != null
          ? `podcast-${pc.id}`
          : `podcast-${hash(
              `${pc?.title ?? ""}-${pc?.filename ?? ""}`
            )}-${index}`;
      } else {
        const n = item as NewsRow;
        return n?.id != null
          ? `news-${n.id}`
          : `news-${hash(`${n?.title ?? ""}-${n?.created_at ?? ""}`)}-${index}`;
      }
    },
    [tab]
  );

  const ListHeader = (
    <>
      {/* HORIZONTALLY SCROLLABLE FILTER BAR */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.tabs,
          { backgroundColor: Colors[colorScheme].background },
        ]}
      >
        {(
          ["quran", "questions", "prayers", "podcasts", "news"] as TabType[]
        ).map((tKey) => {
          const active = tKey === tab;
          return (
            <TouchableOpacity
              key={tKey}
              onPress={() => {
                setTab(tKey);
                Keyboard.dismiss();
              }}
              style={[
                styles.tabBtn,
                {
                  backgroundColor: active
                    ? Colors.universal.primary
                    : "transparent",
                },
              ]}
            >
              <ThemedText style={styles.tabText}>
                {t(TAB_LABEL_KEY[tKey])}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* SEARCH FIELD (auto-search; no submit needed) */}
      <View
        style={[
          styles.searchBox,
          { backgroundColor: Colors[colorScheme].contrast },
        ]}
      >
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={t(PLACEHOLDER_KEY[tab])}
          placeholderTextColor={Colors[colorScheme].text}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="done"
          style={[styles.input, { color: Colors[colorScheme].text }]}
        />
        {query.length > 0 && !activeLoading && (
          <TouchableOpacity onPress={onClear} style={styles.clearBtn}>
            <ThemedText style={{ fontSize: 18 }}>×</ThemedText>
          </TouchableOpacity>
        )}
        {activeLoading && <ActivityIndicator style={{ marginLeft: 8 }} />}
      </View>

      {/* META LINE */}
      {canSearch && !activeLoading && !activeError ? (
        <ThemedText style={styles.meta}>
          {t("results_count", { count: activeTotal })}
        </ThemedText>
      ) : null}
    </>
  );

  const ListEmpty = (
    <View style={styles.emptyWrap}>
      {activeLoading ? null : activeError ? (
        <ThemedText style={styles.emptyText}>{activeError}</ThemedText>
      ) : (
        <ThemedText style={styles.emptyText}>{t("noSearchResults")}</ThemedText>
      )}
    </View>
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors[colorScheme].background }}
      edges={["top", "left", "right"]}
    >
      <ThemedView style={styles.container}>
        <FlatList
          key={tab} // remount per tab to avoid stale keys
          data={activeRows}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={ListEmpty}
          contentContainerStyle={{ paddingBottom: 40, gap: 15 }}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          onEndReachedThreshold={0.4}
          onEndReached={loadMore}
          extraData={{
            debouncedTerm,
            tab,
            lang,
            rowsLen: rows.length,
            total,
            isLoading,
            isLoadingMore,
          }}
        />

        {/* Bottom spinner for local DB paging */}
        {isLoadingMore &&
          (tab === "quran" || tab === "questions" || tab === "prayers") && (
            <View style={styles.moreLoader}>
              <ActivityIndicator />
            </View>
          )}
      </ThemedView>
    </SafeAreaView>
  );
}

const RADIUS = 14;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  tabs: {
    flexDirection: "row",
    paddingVertical: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 10,
    alignItems: "center",
  },
  tabBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    marginRight: 8,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderRadius: RADIUS,
    borderWidth: StyleSheet.hairlineWidth,
    height: 44,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  clearBtn: {
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  meta: {
    marginTop: 8,
    marginBottom: 6,
    fontSize: 12,
  },
  row: {
    padding: 12,
    borderRadius: RADIUS,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  rowSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  rowTiny: {
    fontSize: 12,
  },

  emptyWrap: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 24,
  },
  moreLoader: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 8,
    alignItems: "center",
  },
});
