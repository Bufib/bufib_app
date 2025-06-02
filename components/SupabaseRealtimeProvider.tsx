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
// import { NewsArticlesType, NewsType, PodcastType } from "@/constants/Types";
// import { useTranslation } from "react-i18next";
// import { useLanguage } from "@/contexts/LanguageContext";

// type SupabaseRealtimeContextType = {
//   userId: string | null;
//   hasNewNewsData: boolean;
//   clearNewNewsFlag: () => void;
// };

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
//   const { language } = useLanguage();
//   const queryClient = useQueryClient();

//   const isAdmin = useAuthStore((state) => state.isAdmin);
//   const setSession = useAuthStore.getState().setSession;
//   const clearNewNewsFlag = () => setHasNewNewsData(false);

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
//       .channel(`user_questions`)
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
//               text1: "Deine Frage wurde erfolgreich abgeschickt!",
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
//    * News subscription - MOVED HERE
//    * This subscription listens to all news changes and updates the
//    * language-specific TanStack Query cache.
//    */
//   useEffect(() => {
//     const newsChannel = supabase
//       .channel("all_news_changes") // Listen to a general channel for all news
//       .on(
//         "postgres_changes",
//         {
//           event: "*", // Listen to all events: INSERT, UPDATE, DELETE
//           schema: "public",
//           table: "news",
//           // No language filter here, we'll process based on payload's language_code
//         },
//         (payload) => {
//           const { eventType, new: newRec, old: oldRec } = payload;

//           // Determine the language code from the payload
//           let recordLang: string | undefined;
//           if (eventType === "INSERT" || eventType === "UPDATE") {
//             recordLang = (newRec as NewsType)?.language_code;
//           } else if (eventType === "DELETE") {
//             // For DELETE, Supabase often puts the old record's data in `old`
//             // and `new` might be minimal or just the ID.
//             // We need to ensure `oldRec` has `language_code`.
//             // Your RLS policies for "news" table must allow read access to `oldRec` data for this to work.
//             console.log(payload)
//             recordLang = (oldRec as Partial<NewsType>)?.language_code;

//             // If language_code is not in oldRec for DELETE (e.g. due to RLS or minimal payload)
//             // then we cannot target the specific language cache and might have to invalidate more broadly or skip.
//             // This is a potential edge case to consider based on your Supabase setup.
//             if (!recordLang && oldRec?.id) {
//               console.warn(
//                 `News DELETE: language_code missing from old record for id ${oldRec.id}. Cannot perform targeted cache update.`
//               );
//               // Fallback: invalidate all news queries if necessary, though less ideal.
//               // queryClient.invalidateQueries({ queryKey: ["news"] });
//               // Or, if this is problematic, you might have to accept that deletes
//               // without language_code in oldRec won't be optimistically handled here.
//               return;
//             }
//           }

//           if (!recordLang) {
//             console.warn(
//               "News event without determinable language_code. Skipping cache update.",
//               payload
//             );
//             return;
//           }

//           const queryKeyForNews = ["news", recordLang];

//           queryClient.setQueryData<InfiniteData<NewsType[]>>(
//             queryKeyForNews,
//             (oldData) => {
//               if (!oldData) return oldData;

//               let pages = oldData.pages.map((page) => [...page]); // Create shallow copies for mutation

//               switch (eventType) {
//                 case "INSERT":
//                   if (newRec) {
//                     const inserted = newRec as NewsType;
//                     // Check if item already exists (e.g. due to rapid events or optimistic updates elsewhere)
//                     const itemExists = pages.some((p) =>
//                       p.some((item) => item.id === inserted.id)
//                     );
//                     if (!itemExists) {
//                       if (pages.length > 0) {
//                         pages[0] = [inserted, ...pages[0]];
//                       } else {
//                         pages.push([inserted]); // Handle case where pages array was empty
//                       }
//                     }
//                   }

//                   break;
//                 case "UPDATE":
//                   pages = pages.map((page) =>
//                     page.map((item) =>
//                       item.id === (newRec as NewsType)!.id
//                         ? (newRec as NewsType)
//                         : item
//                     )
//                   );
//                   break;
//                 case "DELETE":
//                   // Ensure oldRec has 'id' and is correctly typed
//                   const idToDelete = (oldRec as Partial<NewsType>)?.id;
//                   if (idToDelete) {
//                     pages = pages.map((page) =>
//                       page.filter((item) => item.id !== idToDelete)
//                     );
//                   }
//                   break;
//                 default:
//                   return oldData; // Should not happen with event: "*"
//               }
//               return { ...oldData, pages };
//             }
//           );

//           // Handle the hasNewNewsData flag for non-admins
//           if (!isAdmin) {
//             setHasNewNewsData(true);
//           } else {
//             // For admins, the data is updated optimistically above.
//             // If you still wanted to trigger a refetch for admins for some reason:
//             // queryClient.invalidateQueries({ queryKey: queryKeyForNews });
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
//         .catch((err) => console.error("Error removing podcasts_channel", err));
//     };
//   }, [queryClient, isAdmin]); // isAdmin is used for the hasNewNewsData flag logic

//   /**
//    * News Articles subscription (for 'news_articles' table) - NEW
//    */
//   useEffect(() => {
//     const newsArticlesChannel = supabase
//       .channel("all_news_articles_changes") // Unique channel name
//       .on(
//         "postgres_changes",
//         {
//           event: "*", // Listen to all events
//           schema: "public",
//           table: "news_articles",
//           // No language filter here, will process based on payload's language_code
//         },
//         (payload) => {
//           const { eventType, new: newRec, old: oldRec } = payload;

//           let recordLang: string | undefined;
//           // Ensure your NewsArticlesType has language_code
//           if (eventType === "INSERT" || eventType === "UPDATE") {
//             recordLang = (newRec as NewsArticlesType)?.language_code;
//           } else if (eventType === "DELETE") {
//             recordLang = (oldRec as Partial<NewsArticlesType>)?.language_code;
//             if (!recordLang && oldRec?.id) {
//               console.warn(
//                 `NewsArticle DELETE: language_code missing from old record for id ${oldRec.id}. Cannot perform targeted cache update.`
//               );
//               return;
//             }
//           }

//           if (!recordLang) {
//             console.warn(
//               "NewsArticle event without determinable language_code. Skipping cache update.",
//               payload
//             );
//             return;
//           }

//           const queryKeyForNewsArticles = ["newsArticles", recordLang];

//           queryClient.setQueryData<InfiniteData<NewsArticlesType[]>>(
//             queryKeyForNewsArticles,
//             (oldData) => {
//               if (!oldData) return oldData;

//               // Create shallow copies for mutation safety
//               let pages = oldData.pages.map((page) => [...page]);

//               switch (eventType) {
//                 case "INSERT":
//                   if (newRec) {
//                     const inserted = newRec as NewsArticlesType;
//                     // Check if item already exists (e.g. due to rapid events or optimistic updates elsewhere)
//                     const itemExists = pages.some((p) =>
//                       p.some((item) => item.id === inserted.id)
//                     );
//                     if (!itemExists) {
//                       if (pages.length > 0) {
//                         pages[0] = [inserted, ...pages[0]];
//                       } else {
//                         pages.push([inserted]); // Handle case where pages array was empty
//                       }
//                     }
//                   }
//                   break;
//                 case "UPDATE":
//                   if (newRec) {
//                     const updated = newRec as NewsArticlesType;
//                     pages = pages.map((page) =>
//                       page.map((item) =>
//                         item.id === updated.id ? updated : item
//                       )
//                     );
//                   }
//                   break;
//                 case "DELETE":
//                   const idToDelete = (oldRec as Partial<NewsArticlesType>)?.id;
//                   if (idToDelete) {
//                     pages = pages.map((page) =>
//                       page.filter((item) => item.id !== idToDelete)
//                     );
//                   }
//                   break;
//                 default:
//                   return oldData;
//               }
//               return { ...oldData, pages };
//             }
//           );

//           // Handle the hasNewNewsArticlesData flag for non-admins
//           if (!isAdmin) {
//             setHasNewNewsArticlesData(true);
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
//         .catch((err) => console.error("Error removing podcasts_channel", err));
//     };
//   }, [queryClient, isAdmin]); // isAdmin used for the flag logic

//   /**
//    * Podcasts subscription - NEWLY ADDED
//    */
//   useEffect(() => {
//     const podcastsChannel = supabase
//       .channel("all_podcasts_changes") // General channel for all podcast changes
//       .on(
//         "postgres_changes",
//         {
//           event: "*", // Listen to INSERT, UPDATE, DELETE
//           schema: "public",
//           table: "podcasts",
//           // No language filter here, will process based on payload's language_code
//         },
//         (payload) => {
//           const { eventType, new: newRec, old: oldRec } = payload;

//           let recordLang: string | undefined;
//           // Assuming PodcastType includes language_code
//           if (eventType === "INSERT" || eventType === "UPDATE") {
//             recordLang = (newRec as PodcastType)?.language_code;
//           } else if (eventType === "DELETE") {
//             recordLang = (oldRec as Partial<PodcastType>)?.language_code;
//             if (!recordLang && oldRec?.id) {
//               console.warn(
//                 `Podcast DELETE: language_code missing from old record for id ${oldRec.id}. Cannot perform targeted cache update.`
//               );
//               // Fallback: consider broader invalidation if this is critical
//               // queryClient.invalidateQueries({ queryKey: ["podcasts"] });
//               return;
//             }
//           }

//           if (!recordLang) {
//             console.warn(
//               "Podcast event without determinable language_code. Skipping cache update.",
//               payload
//             );
//             return;
//           }

//           const queryKeyForPodcasts: ["podcasts", string] = [
//             "podcasts",
//             recordLang,
//           ];

//           queryClient.setQueryData<InfiniteData<PodcastType[]>>(
//             queryKeyForPodcasts,
//             (oldData) => {
//               if (!oldData) return oldData; // No existing cache for this language

//               // Create shallow copies for mutation safety
//               let pages = oldData.pages.map((page) => [...page]);

//               switch (eventType) {
//                 case "INSERT":
//                   if (newRec) {
//                     const inserted = newRec as PodcastType;
//                     // Check if item already exists
//                     const itemExists = pages.some((p) =>
//                       p.some((item) => item.id === inserted.id)
//                     );
//                     if (!itemExists) {
//                       if (pages.length > 0) {
//                         // Add to the beginning of the first page
//                         pages[0] = [inserted, ...pages[0]];
//                       } else {
//                         // Handle case where pages array was empty
//                         pages.push([inserted]);
//                       }
//                     }
//                   }
//                   break;
//                 case "UPDATE":
//                   if (newRec) {
//                     const updated = newRec as PodcastType;
//                     pages = pages.map((page) =>
//                       page.map((item) =>
//                         item.id === updated.id ? updated : item
//                       )
//                     );
//                   }
//                   break;
//                 case "DELETE":
//                   const idToDelete = (oldRec as Partial<PodcastType>)?.id;
//                   if (idToDelete) {
//                     pages = pages.map((page) =>
//                       page.filter((item) => item.id !== idToDelete)
//                     );
//                   }
//                   break;
//                 default:
//                   return oldData; // Should not happen with event: "*"
//               }
//               return { ...oldData, pages };
//             }
//           );

//           // Handle the hasNewPodcastsData flag for non-admins
//           if (!isAdmin) {
//             setHasNewPodcastsData(true);
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
//         .catch((err) => console.error("Error removing podcasts_channel", err));
//     };
//   }, [queryClient, isAdmin]); // isAdmin is used for the hasNewPodcastsData flag logic

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
import { userQuestionsNewAnswerForQuestions } from "@/constants/messages";
import { useAuthStore } from "@/stores/authStore";
import Toast from "react-native-toast-message";
import { NewsArticlesType, NewsType, PodcastType } from "@/constants/Types";
import { useLanguage } from "@/contexts/LanguageContext";

type SupabaseRealtimeContextType = {
  userId: string | null;
  hasNewNewsData: boolean;
  clearNewNewsFlag: () => void;
};

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
  const [hasNewNewsArticlesData, setHasNewNewsArticlesData] = useState(false);
  const [hasNewPodcastsData, setHasNewPodcastsData] = useState(false);

  // Pull the current UI language from your LanguageContext:
  const { language } = useLanguage();

  const queryClient = useQueryClient();
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const setSession = useAuthStore.getState().setSession;
  const clearNewNewsFlag = () => setHasNewNewsData(false);

  /**
   * Auth state management
   */
  useEffect(() => {
    const getCurrentUser = async () => {
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
      } catch (error) {
        console.error("Error fetching user:", error);
        setUserId(null);
      }
    };

    getCurrentUser();

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
  }, [queryClient]);

  /**
   * User questions subscription
   */
  useEffect(() => {
    if (!userId) return;

    const userQuestionsChannel = supabase
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
              text1: "Deine Frage wurde erfolgreich abgeschickt!",
            });
          } else if (
            payload.eventType === "UPDATE" &&
            payload.new.status &&
            ["Beantwortet", "Abgelehnt"].includes(payload.new.status)
          ) {
            userQuestionsNewAnswerForQuestions();
          }

          await queryClient.invalidateQueries({
            queryKey: ["questionsFromUser", userId],
            refetchType: "all",
          });
        }
      )
      .subscribe();

    return () => {
      userQuestionsChannel.unsubscribe();
    };
  }, [userId, queryClient]);

  /**
   * News subscription
   * - On DELETE: invalidateQueries({ queryKey: […] })
   * - On INSERT/UPDATE: patch the existing cache pages directly
   */
  useEffect(() => {
    const newsChannel = supabase
      .channel("all_news_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "news",
        },
        (payload) => {
          const { eventType, new: newRec, old: oldRec } = payload;
          let recordLang: string | undefined;

          if (eventType === "INSERT" || eventType === "UPDATE") {
            recordLang = (newRec as NewsType)?.language_code;
          } else if (eventType === "DELETE") {
            recordLang = (oldRec as Partial<NewsType>)?.language_code;

            if (!recordLang && oldRec?.id) {
              console.warn(
                `News DELETE: language_code missing for id ${oldRec.id}. Invalidating entire "news" cache.`
              );
              queryClient.invalidateQueries({ queryKey: ["news"] });
              return;
            }

            // If we have a valid recordLang, only invalidate that language's cache:
            if (recordLang) {
              queryClient.invalidateQueries({ queryKey: ["news", recordLang] });
            }
            return;
          }

          // If neither INSERT nor UPDATE, and no recordLang found, bail out:
          if (!recordLang) {
            console.warn(
              "News event without determinable language_code. Skipping cache update.",
              payload
            );
            return;
          }

          const queryKeyForNews: [string, string] = ["news", recordLang];

          if (eventType === "INSERT" && newRec) {
            const inserted = newRec as NewsType;
            queryClient.setQueryData<InfiniteData<NewsType[]> | undefined>(
              queryKeyForNews,
              (oldData) => {
                if (!oldData) return oldData;
                const firstPage = oldData.pages[0] || [];
                return {
                  ...oldData,
                  pages: [[inserted, ...firstPage], ...oldData.pages.slice(1)],
                };
              }
            );
            if (!isAdmin) setHasNewNewsData(true);
            return;
          }

          if (eventType === "UPDATE" && newRec) {
            const updated = newRec as NewsType;
            queryClient.setQueryData<InfiniteData<NewsType[]> | undefined>(
              queryKeyForNews,
              (oldData) => {
                if (!oldData) return oldData;
                const newPages = oldData.pages.map((page) =>
                  page.map((item) => (item.id === updated.id ? updated : item))
                );
                return { ...oldData, pages: newPages };
              }
            );
            if (!isAdmin) setHasNewNewsData(true);
            return;
          }
        }
      )
      .subscribe((status, err) => {
        if (err) {
          console.error(`Error subscribing to all_news_changes channel:`, err);
        }
        console.log(`Subscribed to all_news_changes with status: ${status}`);
      });

    return () => {
      supabase
        .removeChannel(newsChannel)
        .catch((err) => console.error("Error removing news channel", err));
    };
  }, [queryClient, isAdmin]);

  /**
   * News Articles subscription
   * - On DELETE: invalidateQueries({ queryKey: […] })
   * - On INSERT/UPDATE: patch existing pages directly
   */
  useEffect(() => {
    const newsArticlesChannel = supabase
      .channel("all_news_articles_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "news_articles",
        },
        (payload) => {
          const { eventType, new: newRec, old: oldRec } = payload;
          let recordLang: string | undefined;

          if (eventType === "INSERT" || eventType === "UPDATE") {
            recordLang = (newRec as NewsArticlesType)?.language_code;
          } else if (eventType === "DELETE") {
            recordLang = (oldRec as Partial<NewsArticlesType>)?.language_code;
            if (!recordLang && oldRec?.id) {
              console.warn(
                `NewsArticle DELETE: language_code missing for id ${oldRec.id}. Invalidating entire "newsArticles" cache.`
              );
              queryClient.invalidateQueries({ queryKey: ["newsArticles"] });
              return;
            }

            if (recordLang) {
              queryClient.invalidateQueries({
                queryKey: ["newsArticles", recordLang],
              });
            }
            return;
          }

          if (!recordLang) {
            console.warn(
              "NewsArticle event without determinable language_code. Skipping cache update.",
              payload
            );
            return;
          }

          const queryKeyForNewsArticles: [string, string] = [
            "newsArticles",
            recordLang,
          ];

          if (eventType === "INSERT" && newRec) {
            const inserted = newRec as NewsArticlesType;
            queryClient.setQueryData<InfiniteData<NewsArticlesType[]> | undefined>(
              queryKeyForNewsArticles,
              (oldData) => {
                if (!oldData) return oldData;
                const firstPage = oldData.pages[0] || [];
                return {
                  ...oldData,
                  pages: [[inserted, ...firstPage], ...oldData.pages.slice(1)],
                };
              }
            );
            if (!isAdmin) setHasNewNewsArticlesData(true);
            return;
          }

          if (eventType === "UPDATE" && newRec) {
            const updated = newRec as NewsArticlesType;
            queryClient.setQueryData<InfiniteData<NewsArticlesType[]> | undefined>(
              queryKeyForNewsArticles,
              (oldData) => {
                if (!oldData) return oldData;
                const newPages = oldData.pages.map((page) =>
                  page.map((item) => (item.id === updated.id ? updated : item))
                );
                return { ...oldData, pages: newPages };
              }
            );
            if (!isAdmin) setHasNewNewsArticlesData(true);
            return;
          }
        }
      )
      .subscribe((status, err) => {
        if (err) {
          console.error(
            `Error subscribing to all_news_articles_changes channel:`,
            err
          );
        }
        console.log(
          `Subscribed to all_news_articles_changes with status: ${status}`
        );
      });

    return () => {
      supabase
        .removeChannel(newsArticlesChannel)
        .catch((err) =>
          console.error("Error removing news_articles channel", err)
        );
    };
  }, [queryClient, isAdmin]);

  /**
   * Podcasts subscription
   * - On DELETE: invalidateQueries({ queryKey: […] })
   * - On INSERT/UPDATE: patch existing pages directly
   */
  useEffect(() => {
    const podcastsChannel = supabase
      .channel("all_podcasts_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "podcasts",
        },
        (payload) => {
          const { eventType, new: newRec, old: oldRec } = payload;
          let recordLang: string | undefined;

          if (eventType === "INSERT" || eventType === "UPDATE") {
            recordLang = (newRec as PodcastType)?.language_code;
          } else if (eventType === "DELETE") {
            recordLang = (oldRec as Partial<PodcastType>)?.language_code;
            if (!recordLang && oldRec?.id) {
              console.warn(
                `Podcast DELETE: language_code missing for id ${oldRec.id}. Invalidating entire "podcasts" cache.`
              );
              queryClient.invalidateQueries({ queryKey: ["podcasts"] });
              return;
            }

            if (recordLang) {
              queryClient.invalidateQueries({
                queryKey: ["podcasts", recordLang],
              });
            }
            return;
          }

          if (!recordLang) {
            console.warn(
              "Podcast event without determinable language_code. Skipping cache update.",
              payload
            );
            return;
          }

          const queryKeyForPodcasts: [string, string] = [
            "podcasts",
            recordLang,
          ];

          if (eventType === "INSERT" && newRec) {
            const inserted = newRec as PodcastType;
            queryClient.setQueryData<InfiniteData<PodcastType[]> | undefined>(
              queryKeyForPodcasts,
              (oldData) => {
                if (!oldData) return oldData;
                const firstPage = oldData.pages[0] || [];
                return {
                  ...oldData,
                  pages: [[inserted, ...firstPage], ...oldData.pages.slice(1)],
                };
              }
            );
            if (!isAdmin) setHasNewPodcastsData(true);
            return;
          }

          if (eventType === "UPDATE" && newRec) {
            const updated = newRec as PodcastType;
            queryClient.setQueryData<InfiniteData<PodcastType[]> | undefined>(
              queryKeyForPodcasts,
              (oldData) => {
                if (!oldData) return oldData;
                const newPages = oldData.pages.map((page) =>
                  page.map((item) => (item.id === updated.id ? updated : item))
                );
                return { ...oldData, pages: newPages };
              }
            );
            if (!isAdmin) setHasNewPodcastsData(true);
            return;
          }
        }
      )
      .subscribe((status, err) => {
        if (err) {
          console.error(
            `Error subscribing to all_podcasts_changes channel:`,
            err
          );
        }
        console.log(
          `Subscribed to all_podcasts_changes with status: ${status}`
        );
      });

    return () => {
      supabase
        .removeChannel(podcastsChannel)
        .catch((err) => console.error("Error removing podcasts channel", err));
    };
  }, [queryClient, isAdmin]);

  return (
    <SupabaseRealtimeContext.Provider
      value={{
        userId,
        hasNewNewsData,
        clearNewNewsFlag,
      }}
    >
      {children}
    </SupabaseRealtimeContext.Provider>
  );
};

export const useSupabaseRealtime = () => useContext(SupabaseRealtimeContext);
