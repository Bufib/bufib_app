// // ! Orginal das funktioniert
// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   ReactNode,
// } from "react";
// import { supabase } from "@/utils/supabase";
// import { InfiniteData, useQueryClient } from "@tanstack/react-query";
// import { userQuestionsNewAnswerForQuestions } from "@/constants/messages";
// import { useAuthStore } from "@/stores/authStore";
// import Toast from "react-native-toast-message";
// import {
//   NewsArticlesType,
//   NewsType,
//   PodcastType,
//   SupabaseRealtimeContextType,
//   VideoCategoryType,
//   VideoType,
// } from "@/constants/Types";
// import { useLanguage } from "@/contexts/LanguageContext";
// import { useTranslation } from "react-i18next";

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
//   const [hasNewNewsArticlesData, setHasNewNewsArticlesData] = useState(false);
//   const [hasNewPodcastsData, setHasNewPodcastsData] = useState(false);

//   // Pull the current UI language from your LanguageContext:
//   const { language } = useLanguage();

//   const queryClient = useQueryClient();
//   const isAdmin = useAuthStore((state) => state.isAdmin);
//   const setSession = useAuthStore.getState().setSession;
//   const clearNewNewsFlag = () => setHasNewNewsData(false);
//   const {t} = useTranslation();
//   /**
//    * Auth state management
//    */
//   useEffect(() => {
//     const getCurrentUser = async () => {
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
//       } catch (error) {
//         console.error("Error fetching user:", error);
//         setUserId(null);
//       }
//     };

//     getCurrentUser();

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
//   }, [queryClient]);

//   /**
//    * User questions subscription
//    */
//   useEffect(() => {
//     if (!userId) return;

//     const userQuestionsChannel = supabase
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
//             payload.new.status &&
//             ["Beantwortet", "Abgelehnt"].includes(payload.new.status)
//           ) {
//             userQuestionsNewAnswerForQuestions();
//           }

//           await queryClient.invalidateQueries({
//             queryKey: ["questionsFromUser", userId],
//             refetchType: "all",
//           });
//         }
//       )
//       .subscribe();

//     return () => {
//       userQuestionsChannel.unsubscribe();
//     };
//   }, [userId, queryClient]);

//   /**
//    * News subscription
//    * - On DELETE: invalidateQueries({ queryKey: […] })
//    * - On INSERT/UPDATE: patch the existing cache pages directly
//   //  */

//   /**
//    * News subscription - INSERT shows button, UPDATE/DELETE refresh immediately
//    */
//   useEffect(() => {
//     const newsChannel = supabase
//       .channel("all_news_changes")
//       .on(
//         "postgres_changes",
//         {
//           event: "*",
//           schema: "public",
//           table: "news",
//         },
//         async (payload) => {
//           const { eventType, new: newRec, old: oldRec } = payload;

//           // Get the language of the changed record
//           let recordLang: string | undefined;
//           if (eventType === "INSERT" || eventType === "UPDATE") {
//             recordLang = (newRec as NewsType)?.language_code;
//           } else if (eventType === "DELETE") {
//             recordLang = (oldRec as Partial<NewsType>)?.language_code;
//           }

//           // Only process if the change is for the current language
//           if (recordLang === language) {
//             console.log(
//               `News change detected for language ${recordLang}:`,
//               eventType
//             );

//             if (eventType === "INSERT") {
//               // For INSERT: Just show the button, don't refresh
//               if (!isAdmin) {
//                 setHasNewNewsData(true);
//               } else {
//                 // Admins see changes immediately
//                 await queryClient.invalidateQueries({
//                   queryKey: ["news", recordLang],
//                   refetchType: "all",
//                 });
//               }
//             } else if (eventType === "UPDATE") {
//               // For UPDATE: Update the specific item in cache
//               const updated = newRec as NewsType;
//               queryClient.setQueryData<InfiniteData<NewsType[]> | undefined>(
//                 ["news", recordLang],
//                 (oldData) => {
//                   if (!oldData) return oldData;
//                   const newPages = oldData.pages.map((page) =>
//                     page.map((item) =>
//                       item.id === updated.id ? updated : item
//                     )
//                   );
//                   return { ...oldData, pages: newPages };
//                 }
//               );
//               // Clear the flag if it was set
//               setHasNewNewsData(false);
//             } else if (eventType === "DELETE") {
//               // For DELETE: Remove the item from cache immediately
//               const deletedId = (oldRec as Partial<NewsType>)?.id;
//               if (deletedId) {
//                 queryClient.setQueryData<InfiniteData<NewsType[]> | undefined>(
//                   ["news", recordLang],
//                   (oldData) => {
//                     if (!oldData) return oldData;
//                     const newPages = oldData.pages.map((page) =>
//                       page.filter((item) => item.id !== deletedId)
//                     );
//                     return { ...oldData, pages: newPages };
//                   }
//                 );
//                 // Clear the flag if it was set
//                 setHasNewNewsData(false);
//               }
//             }
//           }
//         }
//       )
//       .subscribe((status, err) => {
//         if (err) {
//           console.error(`Error subscribing to all_news_changes channel:`, err);
//         }
//         console.log(`Subscribed to all_news_changes with status: ${status}`);
//       });

//     return () => {
//       supabase
//         .removeChannel(newsChannel)
//         .catch((err) => console.error("Error removing news channel", err));
//     };
//   }, [queryClient, isAdmin, language]);

//   /**
//    * News Articles subscription
//    * - On DELETE: invalidateQueries({ queryKey: […] })
//    * - On INSERT/UPDATE: patch existing pages directly
//    */
//   useEffect(() => {
//     const newsArticlesChannel = supabase
//       .channel("all_news_articles_changes")
//       .on(
//         "postgres_changes",
//         {
//           event: "*",
//           schema: "public",
//           table: "news_articles",
//         },
//         (payload) => {
//           const { eventType, new: newRec, old: oldRec } = payload;
//           let recordLang: string | undefined;

//           if (eventType === "INSERT" || eventType === "UPDATE") {
//             recordLang = (newRec as NewsArticlesType)?.language_code;
//           } else if (eventType === "DELETE") {
//             recordLang = (oldRec as Partial<NewsArticlesType>)?.language_code;
//             if (!recordLang && oldRec?.id) {
//               console.warn(
//                 `NewsArticle DELETE: language_code missing for id ${oldRec.id}. Invalidating entire "newsArticles" cache.`
//               );
//               queryClient.invalidateQueries({ queryKey: ["newsArticles"] });
//               return;
//             }

//             if (recordLang) {
//               queryClient.invalidateQueries({
//                 queryKey: ["newsArticles", recordLang],
//               });
//             }
//             return;
//           }

//           if (!recordLang) {
//             console.warn(
//               "NewsArticle event without determinable language_code. Skipping cache update.",
//               payload
//             );
//             return;
//           }

//           const queryKeyForNewsArticles: [string, string] = [
//             "newsArticles",
//             recordLang,
//           ];

//           if (eventType === "INSERT" && newRec) {
//             const inserted = newRec as NewsArticlesType;
//             queryClient.setQueryData<
//               InfiniteData<NewsArticlesType[]> | undefined
//             >(queryKeyForNewsArticles, (oldData) => {
//               if (!oldData) return oldData;
//               const firstPage = oldData.pages[0] || [];
//               return {
//                 ...oldData,
//                 pages: [[inserted, ...firstPage], ...oldData.pages.slice(1)],
//               };
//             });
//             if (!isAdmin) setHasNewNewsArticlesData(true);
//             return;
//           }

//           if (eventType === "UPDATE" && newRec) {
//             const updated = newRec as NewsArticlesType;
//             queryClient.setQueryData<
//               InfiniteData<NewsArticlesType[]> | undefined
//             >(queryKeyForNewsArticles, (oldData) => {
//               if (!oldData) return oldData;
//               const newPages = oldData.pages.map((page) =>
//                 page.map((item) => (item.id === updated.id ? updated : item))
//               );
//               return { ...oldData, pages: newPages };
//             });
//             if (!isAdmin) setHasNewNewsArticlesData(true);
//             return;
//           }
//         }
//       )

//       .subscribe((status, err) => {
//         if (err) {
//           console.error(
//             `Error subscribing to all_news_articles_changes channel:`,
//             err
//           );
//         }
//         console.log(
//           `Subscribed to all_news_articles_changes with status: ${status}`
//         );
//       });

//     return () => {
//       supabase
//         .removeChannel(newsArticlesChannel)
//         .catch((err) =>
//           console.error("Error removing news_articles channel", err)
//         );
//     };
//   }, [queryClient, isAdmin]);

//   /**
//    * Videos subscription
//    * - On INSERT: prepend the new video
//    * - On UPDATE: replace the matching video
//    * - On DELETE: remove the matching video
//    */
//   useEffect(() => {
//     const videosChannel = supabase
//       .channel("all_videos_changes")
//       .on(
//         "postgres_changes",
//         {
//           event: "*",
//           schema: "public",
//           table: "videos",
//         },
//         (payload) => {
//           const { eventType, new: newRec, old: oldRec } = payload;

//           // Determine which language cache to update
//           const recordLang =
//             eventType === "DELETE"
//               ? (oldRec as Partial<VideoType>)?.language_code
//               : (newRec as VideoType)?.language_code;

//           if (!recordLang) return;

//           const queryKey: [string, string] = ["videos", recordLang];

//           queryClient.setQueryData<VideoType[] | undefined>(
//             queryKey,
//             (oldList) => {
//               if (!oldList) return oldList;

//               switch (eventType) {
//                 case "INSERT": {
//                   const inserted = newRec as VideoType;
//                   // avoid dupes
//                   if (!oldList.find((v) => v.id === inserted.id)) {
//                     return [inserted, ...oldList];
//                   }
//                   return oldList;
//                 }
//                 case "UPDATE": {
//                   const updated = newRec as VideoType;
//                   return oldList.map((v) =>
//                     v.id === updated.id ? updated : v
//                   );
//                 }
//                 case "DELETE": {
//                   const deletedId = (oldRec as Partial<VideoType>)?.id;
//                   return oldList.filter((v) => v.id !== deletedId);
//                 }
//                 default:
//                   return oldList;
//               }
//             }
//           );
//         }
//       )
//       .subscribe((status, err) => {
//         if (err) console.error("Videos channel error:", err);
//       });

//     return () => {
//       supabase.removeChannel(videosChannel).catch(console.error);
//     };
//   }, [queryClient]);

//   /**
//    * Video Categories subscription
//    * - On INSERT: prepend the new category
//    * - On UPDATE: replace the matching category
//    * - On DELETE: remove the matching category
//    */
//   useEffect(() => {
//     const videoCategoriesChannel = supabase
//       .channel("all_video_categories_changes")
//       .on(
//         "postgres_changes",
//         {
//           event: "*",
//           schema: "public",
//           table: "video_categories", // Target the video_categories table
//         },
//         (payload) => {
//           const { eventType, new: newRec, old: oldRec } = payload;

//           // Determine which language cache to update based on the payload's language_code
//           const recordLang =
//             eventType === "DELETE"
//               ? (oldRec as Partial<VideoCategoryType>)?.language_code
//               : (newRec as VideoCategoryType)?.language_code;

//           if (!recordLang) {
//             console.warn(
//               "VideoCategory event without determinable language_code. Skipping cache update.",
//               payload
//             );
//             return;
//           }

//           const queryKey: [string, string] = ["video_categories", recordLang];

//           queryClient.setQueryData<VideoCategoryType[] | undefined>(
//             queryKey,
//             (oldList) => {
//               if (!oldList) return oldList; // If no data exists, return as is

//               switch (eventType) {
//                 case "INSERT": {
//                   const inserted = newRec as VideoCategoryType;
//                   // Prevent duplicates if the item is already in the list
//                   if (!oldList.find((c) => c.id === inserted.id)) {
//                     return [inserted, ...oldList]; // Prepend new category
//                   }
//                   return oldList;
//                 }
//                 case "UPDATE": {
//                   const updated = newRec as VideoCategoryType;
//                   // Replace the updated category in the list
//                   return oldList.map((c) =>
//                     c.id === updated.id ? updated : c
//                   );
//                 }
//                 case "DELETE": {
//                   const deletedId = (oldRec as Partial<VideoCategoryType>)?.id;
//                   // Remove the deleted category from the list
//                   return oldList.filter((c) => c.id !== deletedId);
//                 }
//                 default:
//                   return oldList;
//               }
//             }
//           );
//         }
//       )
//       .subscribe((status, err) => {
//         if (err) console.error("Video Categories channel error:", err);
//         console.log(`Subscribed to video_categories with status: ${status}`);
//       });

//     return () => {
//       // Unsubscribe from the channel when the component unmounts
//       supabase.removeChannel(videoCategoriesChannel).catch(console.error);
//     };
//   }, [queryClient]); // Dependency array: Re-run effect if queryClient changes

//   /**
//    * Podcasts subscription
//    * - On DELETE: invalidateQueries({ queryKey: […] })
//    * - On INSERT/UPDATE: patch existing pages directly
//    */
//   useEffect(() => {
//     const podcastsChannel = supabase
//       .channel("all_podcasts_changes")
//       .on(
//         "postgres_changes",
//         {
//           event: "*",
//           schema: "public",
//           table: "podcasts",
//         },
//         (payload) => {
//           const { eventType, new: newRec, old: oldRec } = payload;
//           let recordLang: string | undefined;

//           if (eventType === "INSERT" || eventType === "UPDATE") {
//             recordLang = (newRec as PodcastType)?.language_code;
//           } else if (eventType === "DELETE") {
//             recordLang = (oldRec as Partial<PodcastType>)?.language_code;
//             if (!recordLang && oldRec?.id) {
//               console.warn(
//                 `Podcast DELETE: language_code missing for id ${oldRec.id}. Invalidating entire "podcasts" cache.`
//               );
//               queryClient.invalidateQueries({ queryKey: ["podcasts"] });
//               return;
//             }

//             if (recordLang) {
//               queryClient.invalidateQueries({
//                 queryKey: ["podcasts", recordLang],
//               });
//             }
//             return;
//           }

//           if (!recordLang) {
//             console.warn(
//               "Podcast event without determinable language_code. Skipping cache update.",
//               payload
//             );
//             return;
//           }

//           const queryKeyForPodcasts: [string, string] = [
//             "podcasts",
//             recordLang,
//           ];

//           if (eventType === "INSERT" && newRec) {
//             const inserted = newRec as PodcastType;
//             queryClient.setQueryData<InfiniteData<PodcastType[]> | undefined>(
//               queryKeyForPodcasts,
//               (oldData) => {
//                 if (!oldData) return oldData;
//                 const firstPage = oldData.pages[0] || [];
//                 return {
//                   ...oldData,
//                   pages: [[inserted, ...firstPage], ...oldData.pages.slice(1)],
//                 };
//               }
//             );
//             if (!isAdmin) setHasNewPodcastsData(true);
//             return;
//           }

//           if (eventType === "UPDATE" && newRec) {
//             const updated = newRec as PodcastType;
//             queryClient.setQueryData<InfiniteData<PodcastType[]> | undefined>(
//               queryKeyForPodcasts,
//               (oldData) => {
//                 if (!oldData) return oldData;
//                 const newPages = oldData.pages.map((page) =>
//                   page.map((item) => (item.id === updated.id ? updated : item))
//                 );
//                 return { ...oldData, pages: newPages };
//               }
//             );
//             if (!isAdmin) setHasNewPodcastsData(true);
//             return;
//           }
//         }
//       )
//       .subscribe((status, err) => {
//         if (err) {
//           console.error(
//             `Error subscribing to all_podcasts_changes channel:`,
//             err
//           );
//         }
//         console.log(
//           `Subscribed to all_podcasts_changes with status: ${status}`
//         );
//       });

//     return () => {
//       supabase
//         .removeChannel(podcastsChannel)
//         .catch((err) => console.error("Error removing podcasts channel", err));
//     };
//   }, [queryClient, isAdmin]);

//   return (
//     <SupabaseRealtimeContext.Provider
//       value={{
//         userId,
//         hasNewNewsData,
//         clearNewNewsFlag,
//       }}
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
} from "react";
import { supabase } from "@/utils/supabase";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { useAuthStore } from "@/stores/authStore";
import {
  NewsArticlesType,
  NewsType,
  PodcastType,
  SupabaseRealtimeContextType,
  VideoCategoryType,
  VideoType,
  WithLangType,
} from "@/constants/Types";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "react-i18next";

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
  const [userId, setUserId] = useState<string | null>(null);
  const [hasNewNewsData, setHasNewNewsData] = useState(false);

  const { lang } = useLanguage();

  const queryClient = useQueryClient();
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const setSession = useAuthStore.getState().setSession;
  const { t } = useTranslation();

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

  const invalidateByLang = (baseKey: string, lang?: string) => {
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
  };


  const idsEqual = (a: unknown, b: unknown) =>
  a != null && b != null && String(a) === String(b);


  // Patch UPDATE for InfiniteData<T[]>; if cache missing OR item not in cached pages, invalidate
  const patchInfiniteUpdateWithFallback = async <
    T extends { id: number | string }
  >(
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
  };

  // Patch UPDATE for simple array lists; if cache missing or item not present, invalidate
  const upsertListUpdateWithFallback = async <
    T extends { id: number | string }
  >(
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
  };

  // INSERT helpers (only patch if cache exists; do NOT create new caches)
  const prependToInfiniteIfCached = <T,>(key: [string, string], item: T) => {
    const existing = queryClient.getQueryData<InfiniteData<T[]>>(key);
    if (!existing) return;
    queryClient.setQueryData<InfiniteData<T[]>>(key, {
      ...existing,
      pages: [[item, ...(existing.pages[0] ?? [])], ...existing.pages.slice(1)],
    });
  };

  const upsertListIfCached = <T extends { id: number | string }>(
    key: [string, string],
    item: T
  ) => {
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
  };

  // ---------- Auth ----------
  useEffect(() => {
    const init = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session) {
          await setSession(session, true);
          setUserId(session.user.id);
        } else {
          setUserId(null);
        }
      } catch (e) {
        console.error("Error fetching user:", e);
        setUserId(null);
      }
    };
    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        setUserId(null);
        queryClient.removeQueries({ queryKey: ["questionsFromUser"] });
      } else if (event === "SIGNED_IN" && session) {
        setUserId(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [queryClient, setSession]);

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
          if (payload.eventType === "INSERT") {
            Toast.show({
              type: "success",
              text1: t("askQuestionQuestionSendSuccess"),
            });
          } else if (
            payload.eventType === "UPDATE" &&
            (payload.new as any)?.status &&
            ["Beantwortet", "Abgelehnt"].includes((payload.new as any).status)
          ) {
            // userQuestionsNewAnswerForQuestions();
          }
          await queryClient.invalidateQueries({
            queryKey: ["questionsFromUser", userId],
            refetchType: "all",
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(user_question_chanel).catch(console.error);
    };
  }, [userId, queryClient, lang]);

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
            setHasNewNewsData(true);        // show banner for current language
            return;                         // don't mutate cache; user will accept
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
}, [queryClient, isAdmin, lang]);


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
            return;
          }

          if (payload.eventType === "DELETE") {
            await invalidateByLang("newsArticles", lang);
            return;
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ch).catch(console.error);
    };
  }, [queryClient]);

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
            return;
          }

          if (payload.eventType === "DELETE") {
            await invalidateByLang("podcasts", lang);
            return;
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ch).catch(console.error);
    };
  }, [queryClient]);

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
            return;
          }

          if (payload.eventType === "DELETE") {
            await invalidateByLang("videos", lang);
            return;
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ch).catch(console.error);
    };
  }, [queryClient]);

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
            return;
          }

          if (payload.eventType === "DELETE") {
            await invalidateByLang("video_categories", lang);
            return;
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ch).catch(console.error);
    };
  }, [queryClient]);

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
