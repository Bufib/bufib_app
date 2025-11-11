// //! Funktioniert ohne inkrement funktion
// // import React, {
// //   createContext,
// //   useContext,
// //   useEffect,
// //   useState,
// //   ReactNode,
// // } from "react";
// // import { supabase } from "@/utils/supabase";
// // import { InfiniteData, useQueryClient } from "@tanstack/react-query";
// // import Toast from "react-native-toast-message";
// // import { useAuthStore } from "@/stores/authStore";
// // import {
// //   NewsArticlesType,
// //   NewsType,
// //   PodcastType,
// //   SupabaseRealtimeContextType,
// //   VideoCategoryType,
// //   VideoType,
// //   WithLangType,
// // } from "@/constants/Types";
// // import { useLanguage } from "@/contexts/LanguageContext";
// // import { useTranslation } from "react-i18next";

// // const SupabaseRealtimeContext = createContext<SupabaseRealtimeContextType>({
// //   userId: null,
// //   hasNewNewsData: false,
// //   clearNewNewsFlag: () => {},
// // });

// // export const SupabaseRealtimeProvider = ({
// //   children,
// // }: {
// //   children: ReactNode;
// // }) => {
// //   const [userId, setUserId] = useState<string | null>(null);
// //   const [hasNewNewsData, setHasNewNewsData] = useState(false);

// //   const { lang } = useLanguage();

// //   const queryClient = useQueryClient();
// //   const isAdmin = useAuthStore((s) => s.isAdmin);
// //   const setSession = useAuthStore.getState().setSession;
// //   const { t } = useTranslation();

// //   // ---------- Helpers ----------

// //   useEffect(() => {
// //     // When user switches UI language, hide any banner from previous language
// //     setHasNewNewsData(false);
// //   }, [lang]);

// //   const langFromPayload = (payload: any): string | undefined => {
// //     const next = (payload?.new as WithLangType) ?? undefined;
// //     const prev = (payload?.old as WithLangType) ?? undefined;
// //     return (next?.language_code ?? prev?.language_code) || undefined;
// //   };

// //   const invalidateByLang = (baseKey: string, lang?: string) => {
// //     if (lang) {
// //       return queryClient.invalidateQueries({
// //         queryKey: [baseKey, lang],
// //         refetchType: "all",
// //       });
// //     }
// //     return queryClient.invalidateQueries({
// //       queryKey: [baseKey],
// //       refetchType: "all",
// //     });
// //   };

// //   const idsEqual = (a: unknown, b: unknown) =>
// //   a != null && b != null && String(a) === String(b);

// //   // Patch UPDATE for InfiniteData<T[]>; if cache missing OR item not in cached pages, invalidate
// //   const patchInfiniteUpdateWithFallback = async <
// //     T extends { id: number | string }
// //   >(
// //     key: [string, string],
// //     updated: T
// //   ) => {
// //     const cached = queryClient.getQueryData<InfiniteData<T[]>>(key);
// //     if (!cached) {
// //       await queryClient.invalidateQueries({
// //         queryKey: key,
// //         refetchType: "all",
// //       });
// //       return;
// //     }
// //     let found = false;
// //     const pages = cached.pages.map((pg) =>
// //   pg.map((row: any) => {
// //     if (idsEqual(row?.id, (updated as any).id)) {
// //       found = true;
// //       return updated;
// //     }
// //     return row;
// //   })
// // );
// //     if (found) {
// //       queryClient.setQueryData<InfiniteData<T[]>>(key, { ...cached, pages });
// //     } else {
// //       await queryClient.invalidateQueries({
// //         queryKey: key,
// //         refetchType: "all",
// //       });
// //     }
// //   };

// //   // Patch UPDATE for simple array lists; if cache missing or item not present, invalidate
// //   const upsertListUpdateWithFallback = async <
// //     T extends { id: number | string }
// //   >(
// //     key: [string, string],
// //     updated: T
// //   ) => {
// //     const cached = queryClient.getQueryData<T[]>(key);
// //     if (!cached) {
// //       await queryClient.invalidateQueries({
// //         queryKey: key,
// //         refetchType: "all",
// //       });
// //       return;
// //     }
// //     const idx = cached.findIndex((x) => idsEqual(x.id, updated.id));

// //     if (idx === -1) {
// //       await queryClient.invalidateQueries({
// //         queryKey: key,
// //         refetchType: "all",
// //       });
// //       return;
// //     }
// //     const next = cached.slice();
// //     next[idx] = updated;
// //     queryClient.setQueryData<T[]>(key, next);
// //   };

// //   // INSERT helpers (only patch if cache exists; do NOT create new caches)
// //   const prependToInfiniteIfCached = <T,>(key: [string, string], item: T) => {
// //     const existing = queryClient.getQueryData<InfiniteData<T[]>>(key);
// //     if (!existing) return;
// //     queryClient.setQueryData<InfiniteData<T[]>>(key, {
// //       ...existing,
// //       pages: [[item, ...(existing.pages[0] ?? [])], ...existing.pages.slice(1)],
// //     });
// //   };

// //   const upsertListIfCached = <T extends { id: number | string }>(
// //     key: [string, string],
// //     item: T
// //   ) => {
// //     const existing = queryClient.getQueryData<T[]>(key);
// //     if (!existing) return;
// //     const idx = existing.findIndex((x) => idsEqual(x.id, item.id));
// //     if (idx === -1) {
// //       queryClient.setQueryData<T[]>(key, [item, ...existing]);
// //     } else {
// //       const next = existing.slice();
// //       next[idx] = item;
// //       queryClient.setQueryData<T[]>(key, next);
// //     }
// //   };

// //   // ---------- Auth ----------
// //   useEffect(() => {
// //     const init = async () => {
// //       try {
// //         const {
// //           data: { session },
// //         } = await supabase.auth.getSession();
// //         if (session) {
// //           await setSession(session, true);
// //           setUserId(session.user.id);
// //         } else {
// //           setUserId(null);
// //         }
// //       } catch (e) {
// //         console.error("Error fetching user:", e);
// //         setUserId(null);
// //       }
// //     };
// //     init();

// //     const {
// //       data: { subscription },
// //     } = supabase.auth.onAuthStateChange((event, session) => {
// //       if (event === "SIGNED_OUT") {
// //         setUserId(null);
// //         queryClient.removeQueries({ queryKey: ["questionsFromUser"] });
// //       } else if (event === "SIGNED_IN" && session) {
// //         setUserId(session.user.id);
// //       }
// //     });

// //     return () => subscription.unsubscribe();
// //   }, [queryClient, setSession]);

// //   // ---------- User Questions ----------
// //   useEffect(() => {
// //     if (!userId) return;
// //     const user_question_chanel = supabase
// //       .channel("user_questions")
// //       .on(
// //         "postgres_changes",
// //         {
// //           event: "*",
// //           schema: "public",
// //           table: "user_questions",
// //           filter: `user_id=eq.${userId}`,
// //         },
// //         async (payload) => {
// //           if (payload.eventType === "INSERT") {
// //             Toast.show({
// //               type: "success",
// //               text1: t("askQuestionQuestionSendSuccess"),
// //             });
// //           } else if (
// //             payload.eventType === "UPDATE" &&
// //             (payload.new as any)?.status &&
// //             ["Beantwortet", "Abgelehnt"].includes((payload.new as any).status)
// //           ) {
// //             // userQuestionsNewAnswerForQuestions();
// //           }
// //           await queryClient.invalidateQueries({
// //             queryKey: ["questionsFromUser", userId],
// //             refetchType: "all",
// //           });
// //         }
// //       )
// //       .subscribe();

// //     return () => {
// //       supabase.removeChannel(user_question_chanel).catch(console.error);
// //     };
// //   }, [userId, queryClient, lang]);

// //   // ---------- News (INSERT -> banner; UPDATE patch-with-fallback; DELETE invalidate) ----------
// // useEffect(() => {
// //   const newsChannel = supabase
// //     .channel("all_news_changes")
// //     .on(
// //       "postgres_changes",
// //       { event: "*", schema: "public", table: "news" },
// //       async (payload) => {
// //         const { eventType, new: newRec, old: oldRec } = payload;
// //         const recordLang: string | undefined =
// //           (eventType === "DELETE"
// //             ? (oldRec as Partial<NewsType>)?.language_code
// //             : (newRec as NewsType)?.language_code) ?? undefined;

// //         // Show banner only if it concerns the current language (or language unknown)
// //         const bannerRelevant = !recordLang || recordLang === lang;

// //         if (eventType === "INSERT") {
// //           if (!isAdmin && bannerRelevant) {
// //             setHasNewNewsData(true);        // show banner for current language
// //             return;                         // don't mutate cache; user will accept
// //           }
// //           // Admins OR non-current languages: mark that lang stale so it refetches next time
// //           await invalidateByLang("news", recordLang);
// //           return;
// //         }

// //         if (eventType === "UPDATE") {
// //           const updated = newRec as NewsType;
// //           if (recordLang) {
// //             // Patch if cached, else invalidate that language only
// //             await patchInfiniteUpdateWithFallback<NewsType>(
// //               ["news", recordLang],
// //               updated
// //             );
// //           } else {
// //             // Unknown language: invalidate all news caches
// //             await invalidateByLang("news");
// //           }
// //           return;
// //         }

// //         if (eventType === "DELETE") {
// //           // Mark that language stale (or all if unknown)
// //           await invalidateByLang("news", recordLang);
// //           return;
// //         }
// //       }
// //     )
// //     .subscribe();

// //   return () => {
// //     void supabase.removeChannel(newsChannel);
// //   };
// // }, [queryClient, isAdmin, lang]);

// //   // ---------- News Articles (InfiniteData) ----------
// //   useEffect(() => {
// //     const ch = supabase
// //       .channel("all_news_articles_changes")
// //       .on(
// //         "postgres_changes",
// //         { event: "*", schema: "public", table: "news_articles" },
// //         async (payload) => {
// //           const lang = langFromPayload(payload);
// //           const key = lang
// //             ? (["newsArticles", lang] as [string, string])
// //             : undefined;

// //           if (payload.eventType === "INSERT") {
// //             if (key)
// //               prependToInfiniteIfCached<NewsArticlesType>(
// //                 key,
// //                 payload.new as NewsArticlesType
// //               );
// //             return;
// //           }

// //           if (payload.eventType === "UPDATE") {
// //             if (key) {
// //               await patchInfiniteUpdateWithFallback<NewsArticlesType>(
// //                 key,
// //                 payload.new as NewsArticlesType
// //               );
// //             } else {
// //               // Missing language_code -> invalidate all articles
// //               await invalidateByLang("newsArticles");
// //             }
// //             return;
// //           }

// //           if (payload.eventType === "DELETE") {
// //             await invalidateByLang("newsArticles", lang);
// //             return;
// //           }
// //         }
// //       )
// //       .subscribe();

// //     return () => {
// //       supabase.removeChannel(ch).catch(console.error);
// //     };
// //   }, [queryClient]);

// //   // ---------- Podcasts (InfiniteData) ----------
// //   useEffect(() => {
// //     const ch = supabase
// //       .channel("all_podcasts_changes")
// //       .on(
// //         "postgres_changes",
// //         { event: "*", schema: "public", table: "podcasts" },
// //         async (payload) => {
// //           const lang = langFromPayload(payload);
// //           const key = lang
// //             ? (["podcasts", lang] as [string, string])
// //             : undefined;

// //           if (payload.eventType === "INSERT") {
// //             if (key)
// //               prependToInfiniteIfCached<PodcastType>(
// //                 key,
// //                 payload.new as PodcastType
// //               );
// //             return;
// //           }

// //           if (payload.eventType === "UPDATE") {
// //             if (key) {
// //               await patchInfiniteUpdateWithFallback<PodcastType>(
// //                 key,
// //                 payload.new as PodcastType
// //               );
// //             } else {
// //               // Missing language_code -> invalidate all podcasts
// //               await invalidateByLang("podcasts");
// //             }
// //             return;
// //           }

// //           if (payload.eventType === "DELETE") {
// //             await invalidateByLang("podcasts", lang);
// //             return;
// //           }
// //         }
// //       )
// //       .subscribe();

// //     return () => {
// //       supabase.removeChannel(ch).catch(console.error);
// //     };
// //   }, [queryClient]);

// //   // ---------- Videos (simple array) ----------
// //   useEffect(() => {
// //     const ch = supabase
// //       .channel("all_videos_changes")
// //       .on(
// //         "postgres_changes",
// //         { event: "*", schema: "public", table: "videos" },
// //         async (payload) => {
// //           const lang = langFromPayload(payload);
// //           const key = lang ? (["videos", lang] as [string, string]) : undefined;

// //           if (payload.eventType === "INSERT") {
// //             if (key)
// //               upsertListIfCached<VideoType>(key, payload.new as VideoType);
// //             return;
// //           }

// //           if (payload.eventType === "UPDATE") {
// //             if (key) {
// //               await upsertListUpdateWithFallback<VideoType>(
// //                 key,
// //                 payload.new as VideoType
// //               );
// //             } else {
// //               // Missing language_code -> invalidate all videos
// //               await invalidateByLang("videos");
// //             }
// //             return;
// //           }

// //           if (payload.eventType === "DELETE") {
// //             await invalidateByLang("videos", lang);
// //             return;
// //           }
// //         }
// //       )
// //       .subscribe();

// //     return () => {
// //       supabase.removeChannel(ch).catch(console.error);
// //     };
// //   }, [queryClient]);

// //   // ---------- Video Categories (simple array) ----------
// //   useEffect(() => {
// //     const ch = supabase
// //       .channel("all_video_categories_changes")
// //       .on(
// //         "postgres_changes",
// //         { event: "*", schema: "public", table: "video_categories" },
// //         async (payload) => {
// //           const lang = langFromPayload(payload);
// //           const key = lang
// //             ? (["video_categories", lang] as [string, string])
// //             : undefined;

// //           if (payload.eventType === "INSERT") {
// //             if (key)
// //               upsertListIfCached<VideoCategoryType>(
// //                 key,
// //                 payload.new as VideoCategoryType
// //               );
// //             return;
// //           }

// //           if (payload.eventType === "UPDATE") {
// //             if (key) {
// //               await upsertListUpdateWithFallback<VideoCategoryType>(
// //                 key,
// //                 payload.new as VideoCategoryType
// //               );
// //             } else {
// //               // Missing language_code -> invalidate all categories
// //               await invalidateByLang("video_categories");
// //             }
// //             return;
// //           }

// //           if (payload.eventType === "DELETE") {
// //             await invalidateByLang("video_categories", lang);
// //             return;
// //           }
// //         }
// //       )
// //       .subscribe();

// //     return () => {
// //       supabase.removeChannel(ch).catch(console.error);
// //     };
// //   }, [queryClient]);

// //   const clearNewNewsFlag = () => setHasNewNewsData(false);

// //   return (
// //     <SupabaseRealtimeContext.Provider
// //       value={{ userId, hasNewNewsData, clearNewNewsFlag }}
// //     >
// //       {children}
// //     </SupabaseRealtimeContext.Provider>
// //   );
// // };

// // export const useSupabaseRealtime = () => useContext(SupabaseRealtimeContext);

// //! Last that worked
// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   ReactNode,
// } from "react";
// import { supabase } from "@/utils/supabase";
// import { InfiniteData, useQueryClient } from "@tanstack/react-query";
// import Toast from "react-native-toast-message";
// import { useAuthStore } from "@/stores/authStore";
// import {
//   NewsArticlesType,
//   NewsType,
//   PodcastType,
//   SupabaseRealtimeContextType,
//   VideoCategoryType,
//   VideoType,
//   WithLangType,
// } from "@/constants/Types";
// import { useLanguage } from "@/contexts/LanguageContext";
// import { useTranslation } from "react-i18next";
// import { useDataVersionStore } from "@/stores/dataVersionStore"; // NEW

// const SupabaseRealtimeContext = createContext<SupabaseRealtimeContextType>({
//   userId: null,
//   hasNewNewsData: false,
//   clearNewNewsFlag: () => {},
// });

// export const SupabaseRealtimeProvider = ({
//   children,
// }: {
//   children: ReactNode;
// }) => {
//   const [userId, setUserId] = useState<string | null>(null);
//   const [hasNewNewsData, setHasNewNewsData] = useState(false);

//   const { lang } = useLanguage();

//   const queryClient = useQueryClient();
//   const isAdmin = useAuthStore((s) => s.isAdmin);
//   const setSession = useAuthStore.getState().setSession;
//   const { t } = useTranslation();

//   // NEW: stable references to incrementers (no effect deps needed)
//   const incrementNewsArticleVersion =
//     useDataVersionStore.getState().incrementNewsArticleVersion;
//   const incrementPodcastVersion =
//     useDataVersionStore.getState().incrementPodcastVersion;
//   const incrementVideoVersion =
//     useDataVersionStore.getState().incrementVideoVersion;

//   // ---------- Helpers ----------

//   useEffect(() => {
//     // When user switches UI language, hide any banner from previous language
//     setHasNewNewsData(false);
//   }, [lang]);

//   const langFromPayload = (payload: any): string | undefined => {
//     const next = (payload?.new as WithLangType) ?? undefined;
//     const prev = (payload?.old as WithLangType) ?? undefined;
//     return (next?.language_code ?? prev?.language_code) || undefined;
//   };

//   const invalidateByLang = (baseKey: string, lang?: string) => {
//     if (lang) {
//       return queryClient.invalidateQueries({
//         queryKey: [baseKey, lang],
//         refetchType: "all",
//       });
//     }
//     return queryClient.invalidateQueries({
//       queryKey: [baseKey],
//       refetchType: "all",
//     });
//   };

//   const idsEqual = (a: unknown, b: unknown) =>
//     a != null && b != null && String(a) === String(b);

//   // Patch UPDATE for InfiniteData<T[]>; if cache missing OR item not in cached pages, invalidate
//   const patchInfiniteUpdateWithFallback = async <
//     T extends { id: number | string }
//   >(
//     key: [string, string],
//     updated: T
//   ) => {
//     const cached = queryClient.getQueryData<InfiniteData<T[]>>(key);
//     if (!cached) {
//       await queryClient.invalidateQueries({
//         queryKey: key,
//         refetchType: "all",
//       });
//       return;
//     }
//     let found = false;
//     const pages = cached.pages.map((pg) =>
//       pg.map((row: any) => {
//         if (idsEqual(row?.id, (updated as any).id)) {
//           found = true;
//           return updated;
//         }
//         return row;
//       })
//     );
//     if (found) {
//       queryClient.setQueryData<InfiniteData<T[]>>(key, { ...cached, pages });
//     } else {
//       await queryClient.invalidateQueries({
//         queryKey: key,
//         refetchType: "all",
//       });
//     }
//   };

//   // Patch UPDATE for simple array lists; if cache missing or item not present, invalidate
//   const upsertListUpdateWithFallback = async <
//     T extends { id: number | string }
//   >(
//     key: [string, string],
//     updated: T
//   ) => {
//     const cached = queryClient.getQueryData<T[]>(key);
//     if (!cached) {
//       await queryClient.invalidateQueries({
//         queryKey: key,
//         refetchType: "all",
//       });
//       return;
//     }
//     const idx = cached.findIndex((x) => idsEqual(x.id, updated.id));

//     if (idx === -1) {
//       await queryClient.invalidateQueries({
//         queryKey: key,
//         refetchType: "all",
//       });
//       return;
//     }
//     const next = cached.slice();
//     next[idx] = updated;
//     queryClient.setQueryData<T[]>(key, next);
//   };

//   // INSERT helpers (only patch if cache exists; do NOT create new caches)
//   const prependToInfiniteIfCached = <T,>(key: [string, string], item: T) => {
//     const existing = queryClient.getQueryData<InfiniteData<T[]>>(key);
//     if (!existing) return;
//     queryClient.setQueryData<InfiniteData<T[]>>(key, {
//       ...existing,
//       pages: [[item, ...(existing.pages[0] ?? [])], ...existing.pages.slice(1)],
//     });
//   };

//   const upsertListIfCached = <T extends { id: number | string }>(
//     key: [string, string],
//     item: T
//   ) => {
//     const existing = queryClient.getQueryData<T[]>(key);
//     if (!existing) return;
//     const idx = existing.findIndex((x) => idsEqual(x.id, item.id));
//     if (idx === -1) {
//       queryClient.setQueryData<T[]>(key, [item, ...existing]);
//     } else {
//       const next = existing.slice();
//       next[idx] = item;
//       queryClient.setQueryData<T[]>(key, next);
//     }
//   };

//   // ---------- Auth ----------
//   useEffect(() => {
//     const init = async () => {
//       try {
//         const {
//           data: { session },
//         } = await supabase.auth.getSession();
//         if (session) {
//           await setSession(session, true);
//           setUserId(session.user.id);
//         } else {
//           setUserId(null);
//         }
//       } catch (e) {
//         console.error("Error fetching user:", e);
//         setUserId(null);
//       }
//     };
//     init();

//     const {
//       data: { subscription },
//     } = supabase.auth.onAuthStateChange((event, session) => {
//       if (event === "SIGNED_OUT") {
//         setUserId(null);
//         queryClient.removeQueries({ queryKey: ["questionsFromUser"] });
//       } else if (event === "SIGNED_IN" && session) {
//         setUserId(session.user.id);
//       }
//     });

//     return () => subscription.unsubscribe();
//   }, [queryClient, setSession]);

//   // ---------- User Questions ----------
//   useEffect(() => {
//     if (!userId) return;
//     const user_question_chanel = supabase
//       .channel("user_questions")
//       .on(
//         "postgres_changes",
//         {
//           event: "*",
//           schema: "public",
//           table: "user_questions",
//           filter: `user_id=eq.${userId}`,
//         },
//         async (payload) => {
//           if (payload.eventType === "INSERT") {
//             Toast.show({
//               type: "success",
//               text1: t("askQuestionQuestionSendSuccess"),
//             });
//           } else if (
//             payload.eventType === "UPDATE" &&
//             (payload.new as any)?.status &&
//             ["Beantwortet", "Abgelehnt"].includes((payload.new as any).status)
//           ) {
//             // userQuestionsNewAnswerForQuestions();
//           }
//           await queryClient.invalidateQueries({
//             queryKey: ["questionsFromUser", userId],
//             refetchType: "all",
//           });
//         }
//       )
//       .subscribe();

//     return () => {
//       supabase.removeChannel(user_question_chanel).catch(console.error);
//     };
//   }, [userId, queryClient, lang]);

//   // ---------- News (INSERT -> banner; UPDATE patch-with-fallback; DELETE invalidate) ----------
//   useEffect(() => {
//     const newsChannel = supabase
//       .channel("all_news_changes")
//       .on(
//         "postgres_changes",
//         { event: "*", schema: "public", table: "news" },
//         async (payload) => {
//           const { eventType, new: newRec, old: oldRec } = payload;
//           const recordLang: string | undefined =
//             (eventType === "DELETE"
//               ? (oldRec as Partial<NewsType>)?.language_code
//               : (newRec as NewsType)?.language_code) ?? undefined;

//           // Show banner only if it concerns the current language (or language unknown)
//           const bannerRelevant = !recordLang || recordLang === lang;

//           if (eventType === "INSERT") {
//             if (!isAdmin && bannerRelevant) {
//               setHasNewNewsData(true); // show banner for current language
//               return; // don't mutate cache; user will accept
//             }
//             // Admins OR non-current languages: mark that lang stale so it refetches next time
//             await invalidateByLang("news", recordLang);
//             return;
//           }

//           if (eventType === "UPDATE") {
//             const updated = newRec as NewsType;
//             if (recordLang) {
//               // Patch if cached, else invalidate that language only
//               await patchInfiniteUpdateWithFallback<NewsType>(
//                 ["news", recordLang],
//                 updated
//               );
//             } else {
//               // Unknown language: invalidate all news caches
//               await invalidateByLang("news");
//             }
//             return;
//           }

//           if (eventType === "DELETE") {
//             // Mark that language stale (or all if unknown)
//             await invalidateByLang("news", recordLang);
//             return;
//           }
//         }
//       )
//       .subscribe();

//     return () => {
//       void supabase.removeChannel(newsChannel);
//     };
//   }, [queryClient, isAdmin, lang]);

//   // ---------- News Articles (InfiniteData) ----------
//   useEffect(() => {
//     const ch = supabase
//       .channel("all_news_articles_changes")
//       .on(
//         "postgres_changes",
//         { event: "*", schema: "public", table: "news_articles" },
//         async (payload) => {
//           const lang = langFromPayload(payload);
//           const key = lang
//             ? (["newsArticles", lang] as [string, string])
//             : undefined;

//           if (payload.eventType === "INSERT") {
//             if (key)
//               prependToInfiniteIfCached<NewsArticlesType>(
//                 key,
//                 payload.new as NewsArticlesType
//               );
//             incrementNewsArticleVersion(); // NEW
//             return;
//           }

//           if (payload.eventType === "UPDATE") {
//             if (key) {
//               await patchInfiniteUpdateWithFallback<NewsArticlesType>(
//                 key,
//                 payload.new as NewsArticlesType
//               );
//             } else {
//               // Missing language_code -> invalidate all articles
//               await invalidateByLang("newsArticles");
//             }
//             incrementNewsArticleVersion(); // NEW
//             return;
//           }

//           if (payload.eventType === "DELETE") {
//             await invalidateByLang("newsArticles", lang);
//             incrementNewsArticleVersion(); // NEW
//             return;
//           }
//         }
//       )
//       .subscribe();

//     return () => {
//       supabase.removeChannel(ch).catch(console.error);
//     };
//   }, [queryClient]);

//   // ---------- Podcasts (InfiniteData) ----------
//   useEffect(() => {
//     const ch = supabase
//       .channel("all_podcasts_changes")
//       .on(
//         "postgres_changes",
//         { event: "*", schema: "public", table: "podcasts" },
//         async (payload) => {
//           const lang = langFromPayload(payload);
//           const key = lang
//             ? (["podcasts", lang] as [string, string])
//             : undefined;

//           if (payload.eventType === "INSERT") {
//             if (key)
//               prependToInfiniteIfCached<PodcastType>(
//                 key,
//                 payload.new as PodcastType
//               );
//             incrementPodcastVersion(); // NEW
//             return;
//           }

//           if (payload.eventType === "UPDATE") {
//             if (key) {
//               await patchInfiniteUpdateWithFallback<PodcastType>(
//                 key,
//                 payload.new as PodcastType
//               );
//             } else {
//               // Missing language_code -> invalidate all podcasts
//               await invalidateByLang("podcasts");
//             }
//             incrementPodcastVersion(); // NEW
//             return;
//           }

//           if (payload.eventType === "DELETE") {
//             await invalidateByLang("podcasts", lang);
//             incrementPodcastVersion(); // NEW
//             return;
//           }
//         }
//       )
//       .subscribe();

//     return () => {
//       supabase.removeChannel(ch).catch(console.error);
//     };
//   }, [queryClient]);

//   // ---------- Videos (simple array) ----------
//   useEffect(() => {
//     const ch = supabase
//       .channel("all_videos_changes")
//       .on(
//         "postgres_changes",
//         { event: "*", schema: "public", table: "videos" },
//         async (payload) => {
//           const lang = langFromPayload(payload);
//           const key = lang ? (["videos", lang] as [string, string]) : undefined;

//           if (payload.eventType === "INSERT") {
//             if (key)
//               upsertListIfCached<VideoType>(key, payload.new as VideoType);
//             incrementVideoVersion(); // NEW
//             return;
//           }

//           if (payload.eventType === "UPDATE") {
//             if (key) {
//               await upsertListUpdateWithFallback<VideoType>(
//                 key,
//                 payload.new as VideoType
//               );
//             } else {
//               // Missing language_code -> invalidate all videos
//               await invalidateByLang("videos");
//             }
//             incrementVideoVersion(); // NEW
//             return;
//           }

//           if (payload.eventType === "DELETE") {
//             await invalidateByLang("videos", lang);
//             incrementVideoVersion(); // NEW
//             return;
//           }
//         }
//       )
//       .subscribe();

//     return () => {
//       supabase.removeChannel(ch).catch(console.error);
//     };
//   }, [queryClient]);

//   // ---------- Video Categories (simple array) ----------
//   useEffect(() => {
//     const ch = supabase
//       .channel("all_video_categories_changes")
//       .on(
//         "postgres_changes",
//         { event: "*", schema: "public", table: "video_categories" },
//         async (payload) => {
//           const lang = langFromPayload(payload);
//           const key = lang
//             ? (["video_categories", lang] as [string, string])
//             : undefined;

//           if (payload.eventType === "INSERT") {
//             if (key)
//               upsertListIfCached<VideoCategoryType>(
//                 key,
//                 payload.new as VideoCategoryType
//               );
//             incrementVideoVersion(); // NEW (use shared videoVersion)
//             return;
//           }

//           if (payload.eventType === "UPDATE") {
//             if (key) {
//               await upsertListUpdateWithFallback<VideoCategoryType>(
//                 key,
//                 payload.new as VideoCategoryType
//               );
//             } else {
//               // Missing language_code -> invalidate all categories
//               await invalidateByLang("video_categories");
//             }
//             incrementVideoVersion(); // NEW
//             return;
//           }

//           if (payload.eventType === "DELETE") {
//             await invalidateByLang("video_categories", lang);
//             incrementVideoVersion(); // NEW
//             return;
//           }
//         }
//       )
//       .subscribe();

//     return () => {
//       supabase.removeChannel(ch).catch(console.error);
//     };
//   }, [queryClient]);

//   const clearNewNewsFlag = () => setHasNewNewsData(false);

//   return (
//     <SupabaseRealtimeContext.Provider
//       value={{ userId, hasNewNewsData, clearNewNewsFlag }}
//     >
//       {children}
//     </SupabaseRealtimeContext.Provider>
//   );
// };

// export const useSupabaseRealtime = () => useContext(SupabaseRealtimeContext);

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { supabase } from "@/utils/supabase";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { useAuthStore } from "@/stores/authStore";
import {
  NewsArticlesType,
  NewsType,
  PodcastType,
  QuestionsFromUserType,
  SupabaseRealtimeContextType,
  VideoCategoryType,
  VideoType,
  WithLangType,
} from "@/constants/Types";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "react-i18next";
import { useDataVersionStore } from "@/stores/dataVersionStore"; // NEW
import { userQuestionsNewAnswerForQuestions } from "@/constants/messages";
import { router } from "expo-router";

const SupabaseRealtimeContext = createContext<SupabaseRealtimeContextType>({
  userId: null,
  hasNewNewsData: false,
  clearNewNewsFlag: () => {},
});

export const SupabaseRealtimeProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [hasNewNewsData, setHasNewNewsData] = useState(false);
  const { lang } = useLanguage();
  const queryClient = useQueryClient();
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const session = useAuthStore((state) => state.session);
  const { t } = useTranslation();
  const userId = session?.user?.id ?? null;
  // NEW: stable references to incrementers (no effect deps needed)
  const incrementNewsArticleVersion =
    useDataVersionStore.getState().incrementNewsArticleVersion;
  const incrementPodcastVersion =
    useDataVersionStore.getState().incrementPodcastVersion;
  const incrementVideoVersion =
    useDataVersionStore.getState().incrementVideoVersion;
  const incrementUserQuestionVersion =
    useDataVersionStore.getState().incrementUserQuestionVersion;

  // ---------- Helpers ----------

  useEffect(() => {
    // When user switches UI language, hide any banner from previous language
    setHasNewNewsData(false);
  }, [lang]);

  const langFromPayload = (payload: any): string | undefined => {
    const next = (payload?.new as WithLangType) ?? undefined;
    const prev = (payload?.old as WithLangType) ?? undefined;
    return (next?.language_code ?? prev?.language_code) || undefined;
  };

  // const invalidateByLang = (baseKey: string, lang?: string) => {
  //   if (lang) {
  //     return queryClient.invalidateQueries({
  //       queryKey: [baseKey, lang],
  //       refetchType: "all",
  //     });
  //   }
  //   return queryClient.invalidateQueries({
  //     queryKey: [baseKey],
  //     refetchType: "all",
  //   });
  // };

  const invalidateByLang = useCallback(
    (baseKey: string, lang?: string) => {
      if (lang) {
        return queryClient.invalidateQueries({
          queryKey: [baseKey, lang],
          refetchType: "all",
        });
      }
      return queryClient.invalidateQueries({
        queryKey: [baseKey],
        refetchType: "all",
      });
    },
    [queryClient]
  );

  const idsEqual = (a: unknown, b: unknown) =>
    a != null && b != null && String(a) === String(b);

  // Patch UPDATE for InfiniteData<T[]>; if cache missing OR item not in cached pages, invalidate
  // const patchInfiniteUpdateWithFallback = async <
  //   T extends { id: number | string }
  // >(
  //   key: [string, string],
  //   updated: T
  // ) => {
  //   const cached = queryClient.getQueryData<InfiniteData<T[]>>(key);
  //   if (!cached) {
  //     await queryClient.invalidateQueries({
  //       queryKey: key,
  //       refetchType: "all",
  //     });
  //     return;
  //   }
  //   let found = false;
  //   const pages = cached.pages.map((pg) =>
  //     pg.map((row: any) => {
  //       if (idsEqual(row?.id, (updated as any).id)) {
  //         found = true;
  //         return updated;
  //       }
  //       return row;
  //     })
  //   );
  //   if (found) {
  //     queryClient.setQueryData<InfiniteData<T[]>>(key, { ...cached, pages });
  //   } else {
  //     await queryClient.invalidateQueries({
  //       queryKey: key,
  //       refetchType: "all",
  //     });
  //   }
  // };

  const patchInfiniteUpdateWithFallback = useCallback(
    async <T extends { id: number | string }>(
      key: [string, string],
      updated: T
    ) => {
      const cached = queryClient.getQueryData<InfiniteData<T[]>>(key);
      if (!cached) {
        await queryClient.invalidateQueries({
          queryKey: key,
          refetchType: "all",
        });
        return;
      }
      let found = false;
      const pages = cached.pages.map((pg) =>
        pg.map((row: any) => {
          if (idsEqual(row?.id, (updated as any).id)) {
            found = true;
            return updated;
          }
          return row;
        })
      );
      if (found) {
        queryClient.setQueryData<InfiniteData<T[]>>(key, { ...cached, pages });
      } else {
        await queryClient.invalidateQueries({
          queryKey: key,
          refetchType: "all",
        });
      }
    },
    [queryClient]
  );

  // Patch UPDATE for simple array lists; if cache missing or item not present, invalidate
  // const upsertListUpdateWithFallback = async <
  //   T extends { id: number | string }
  // >(
  //   key: [string, string],
  //   updated: T
  // ) => {
  //   const cached = queryClient.getQueryData<T[]>(key);
  //   if (!cached) {
  //     await queryClient.invalidateQueries({
  //       queryKey: key,
  //       refetchType: "all",
  //     });
  //     return;
  //   }
  //   const idx = cached.findIndex((x) => idsEqual(x.id, updated.id));

  //   if (idx === -1) {
  //     await queryClient.invalidateQueries({
  //       queryKey: key,
  //       refetchType: "all",
  //     });
  //     return;
  //   }
  //   const next = cached.slice();
  //   next[idx] = updated;
  //   queryClient.setQueryData<T[]>(key, next);
  // };

  const upsertListUpdateWithFallback = useCallback(
    async <T extends { id: number | string }>(
      key: [string, string],
      updated: T
    ) => {
      const cached = queryClient.getQueryData<T[]>(key);
      if (!cached) {
        await queryClient.invalidateQueries({
          queryKey: key,
          refetchType: "all",
        });
        return;
      }
      const idx = cached.findIndex((x) => idsEqual(x.id, updated.id));
      if (idx === -1) {
        await queryClient.invalidateQueries({
          queryKey: key,
          refetchType: "all",
        });
        return;
      }
      const next = cached.slice();
      next[idx] = updated;
      queryClient.setQueryData<T[]>(key, next);
    },
    [queryClient]
  );

  // // INSERT helpers (only patch if cache exists; do NOT create new caches)
  // const prependToInfiniteIfCached = <T,>(key: [string, string], item: T) => {
  //   const existing = queryClient.getQueryData<InfiniteData<T[]>>(key);
  //   if (!existing) return;
  //   queryClient.setQueryData<InfiniteData<T[]>>(key, {
  //     ...existing,
  //     pages: [[item, ...(existing.pages[0] ?? [])], ...existing.pages.slice(1)],
  //   });
  // };

  const prependToInfiniteIfCached = useCallback(
    <T,>(key: [string, string], item: T) => {
      const existing = queryClient.getQueryData<InfiniteData<T[]>>(key);
      if (!existing) return;

      queryClient.setQueryData<InfiniteData<T[]>>(key, {
        ...existing,
        pages: [
          [item, ...(existing.pages[0] ?? [])],
          ...existing.pages.slice(1),
        ],
      });
    },
    [queryClient]
  );

  // const upsertListIfCached = <T extends { id: number | string }>(
  //   key: [string, string],
  //   item: T
  // ) => {
  //   const existing = queryClient.getQueryData<T[]>(key);
  //   if (!existing) return;
  //   const idx = existing.findIndex((x) => idsEqual(x.id, item.id));
  //   if (idx === -1) {
  //     queryClient.setQueryData<T[]>(key, [item, ...existing]);
  //   } else {
  //     const next = existing.slice();
  //     next[idx] = item;
  //     queryClient.setQueryData<T[]>(key, next);
  //   }
  // };

  // ✅ Wrap in useCallback with queryClient dependency
  const upsertListIfCached = useCallback(
    <T extends { id: number | string }>(key: [string, string], item: T) => {
      const existing = queryClient.getQueryData<T[]>(key);
      if (!existing) return;
      const idx = existing.findIndex((x) => idsEqual(x.id, item.id));
      if (idx === -1) {
        queryClient.setQueryData<T[]>(key, [item, ...existing]);
      } else {
        const next = existing.slice();
        next[idx] = item;
        queryClient.setQueryData<T[]>(key, next);
      }
    },
    [queryClient]
  );

  // ---------- User Questions ----------
  useEffect(() => {
    if (!userId) return;

    const user_question_chanel = supabase
      .channel("user_questions")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_questions",
          filter: `user_id=eq.${userId}`,
        },
        async (payload) => {
          console.log(payload);

          const key: [string, string] = ["questionsFromUser", userId];

          if (payload.eventType === "INSERT") {
            upsertListIfCached(key, payload.new as QuestionsFromUserType);

            Toast.show({
              type: "success",
              text1: t("askQuestionQuestionSendSuccess"),
            });
            incrementUserQuestionVersion();
            return;
          }

          if (payload.eventType === "UPDATE") {
            // ✅ Same as Videos - patch or fallback invalidate
            await upsertListUpdateWithFallback(
              key,
              payload.new as QuestionsFromUserType
            );

            if (
              (payload.new as any)?.status &&
              ["Beantwortet", "Abgelehnt"].includes((payload.new as any).status)
            ) {
              userQuestionsNewAnswerForQuestions();
            }
            incrementUserQuestionVersion();
            return;
          }

          if (payload.eventType === "DELETE") {
            await queryClient.invalidateQueries({
              queryKey: ["questionsFromUser", userId],
              refetchType: "all",
            });
            incrementUserQuestionVersion();
            router.push("/home")
            return;
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(user_question_chanel).catch(console.error);
    };
  }, [
    userId,
    incrementUserQuestionVersion,
    queryClient,
    upsertListIfCached,
    t,
    upsertListUpdateWithFallback,
  ]);
  // ---------- News (INSERT -> banner; UPDATE patch-with-fallback; DELETE invalidate) ----------
  useEffect(() => {
    const newsChannel = supabase
      .channel("all_news_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "news" },
        async (payload) => {
          const { eventType, new: newRec, old: oldRec } = payload;
          const recordLang: string | undefined =
            (eventType === "DELETE"
              ? (oldRec as Partial<NewsType>)?.language_code
              : (newRec as NewsType)?.language_code) ?? undefined;

          // Show banner only if it concerns the current language (or language unknown)
          const bannerRelevant = !recordLang || recordLang === lang;

          if (eventType === "INSERT") {
            if (!isAdmin && bannerRelevant) {
              setHasNewNewsData(true); // show banner for current language
              return; // don't mutate cache; user will accept
            }
            // Admins OR non-current languages: mark that lang stale so it refetches next time
            await invalidateByLang("news", recordLang);
            return;
          }

          if (eventType === "UPDATE") {
            const updated = newRec as NewsType;
            if (recordLang) {
              // Patch if cached, else invalidate that language only
              await patchInfiniteUpdateWithFallback<NewsType>(
                ["news", recordLang],
                updated
              );
            } else {
              // Unknown language: invalidate all news caches
              await invalidateByLang("news");
            }
            return;
          }

          if (eventType === "DELETE") {
            // Mark that language stale (or all if unknown)
            await invalidateByLang("news", recordLang);
            return;
          }
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(newsChannel);
    };
  }, [
    queryClient,
    isAdmin,
    lang,
    invalidateByLang,
    patchInfiniteUpdateWithFallback,
  ]);

  // ---------- News Articles (InfiniteData) ----------
  useEffect(() => {
    const ch = supabase
      .channel("all_news_articles_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "news_articles" },
        async (payload) => {
          const lang = langFromPayload(payload);
          const key = lang
            ? (["newsArticles", lang] as [string, string])
            : undefined;

          if (payload.eventType === "INSERT") {
            if (key)
              prependToInfiniteIfCached<NewsArticlesType>(
                key,
                payload.new as NewsArticlesType
              );
            incrementNewsArticleVersion(); // NEW
            return;
          }

          if (payload.eventType === "UPDATE") {
            if (key) {
              await patchInfiniteUpdateWithFallback<NewsArticlesType>(
                key,
                payload.new as NewsArticlesType
              );
            } else {
              // Missing language_code -> invalidate all articles
              await invalidateByLang("newsArticles");
            }
            incrementNewsArticleVersion(); // NEW
            return;
          }

          if (payload.eventType === "DELETE") {
            await invalidateByLang("newsArticles", lang);
            incrementNewsArticleVersion(); // NEW
            return;
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ch).catch(console.error);
    };
  }, [
    queryClient,
    incrementNewsArticleVersion,
    invalidateByLang,
    patchInfiniteUpdateWithFallback,
    prependToInfiniteIfCached,
  ]);

  // ---------- Podcasts (InfiniteData) ----------
  useEffect(() => {
    const ch = supabase
      .channel("all_podcasts_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "podcasts" },
        async (payload) => {
          const lang = langFromPayload(payload);
          const key = lang
            ? (["podcasts", lang] as [string, string])
            : undefined;

          if (payload.eventType === "INSERT") {
            if (key)
              prependToInfiniteIfCached<PodcastType>(
                key,
                payload.new as PodcastType
              );
            incrementPodcastVersion(); // NEW
            return;
          }

          if (payload.eventType === "UPDATE") {
            if (key) {
              await patchInfiniteUpdateWithFallback<PodcastType>(
                key,
                payload.new as PodcastType
              );
            } else {
              // Missing language_code -> invalidate all podcasts
              await invalidateByLang("podcasts");
            }
            incrementPodcastVersion(); // NEW
            return;
          }

          if (payload.eventType === "DELETE") {
            await invalidateByLang("podcasts", lang);
            incrementPodcastVersion(); // NEW
            return;
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ch).catch(console.error);
    };
  }, [
    queryClient,
    incrementPodcastVersion,
    invalidateByLang,
    patchInfiniteUpdateWithFallback,
    prependToInfiniteIfCached,
  ]);

  // ---------- Videos (simple array) ----------
  useEffect(() => {
    const ch = supabase
      .channel("all_videos_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "videos" },
        async (payload) => {
          const lang = langFromPayload(payload);
          const key = lang ? (["videos", lang] as [string, string]) : undefined;

          if (payload.eventType === "INSERT") {
            if (key)
              upsertListIfCached<VideoType>(key, payload.new as VideoType);
            incrementVideoVersion(); // NEW
            return;
          }

          if (payload.eventType === "UPDATE") {
            if (key) {
              await upsertListUpdateWithFallback<VideoType>(
                key,
                payload.new as VideoType
              );
            } else {
              // Missing language_code -> invalidate all videos
              await invalidateByLang("videos");
            }
            incrementVideoVersion(); // NEW
            return;
          }

          if (payload.eventType === "DELETE") {
            await invalidateByLang("videos", lang);
            incrementVideoVersion(); // NEW
            return;
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ch).catch(console.error);
    };
  }, [
    queryClient,
    incrementVideoVersion,
    invalidateByLang,
    upsertListIfCached,
    upsertListUpdateWithFallback,
  ]);

  // ---------- Video Categories (simple array) ----------
  useEffect(() => {
    const ch = supabase
      .channel("all_video_categories_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "video_categories" },
        async (payload) => {
          const lang = langFromPayload(payload);
          const key = lang
            ? (["video_categories", lang] as [string, string])
            : undefined;

          if (payload.eventType === "INSERT") {
            if (key)
              upsertListIfCached<VideoCategoryType>(
                key,
                payload.new as VideoCategoryType
              );
            incrementVideoVersion(); // NEW (use shared videoVersion)
            return;
          }

          if (payload.eventType === "UPDATE") {
            if (key) {
              await upsertListUpdateWithFallback<VideoCategoryType>(
                key,
                payload.new as VideoCategoryType
              );
            } else {
              // Missing language_code -> invalidate all categories
              await invalidateByLang("video_categories");
            }
            incrementVideoVersion(); // NEW
            return;
          }

          if (payload.eventType === "DELETE") {
            await invalidateByLang("video_categories", lang);
            incrementVideoVersion(); // NEW
            return;
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ch).catch(console.error);
    };
  }, [
    queryClient,
    incrementVideoVersion,
    invalidateByLang,
    upsertListIfCached,
    upsertListUpdateWithFallback,
  ]);

  const clearNewNewsFlag = () => setHasNewNewsData(false);

  return (
    <SupabaseRealtimeContext.Provider
      value={{ userId, hasNewNewsData, clearNewNewsFlag }}
    >
      {children}
    </SupabaseRealtimeContext.Provider>
  );
};

export const useSupabaseRealtime = () => useContext(SupabaseRealtimeContext);
