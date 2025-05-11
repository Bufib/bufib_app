// import { useEffect } from "react";
// import { useLanguage } from "@/contexts/LanguageContext";
// import { supabase } from "@/utils/supabase";
// import { NewsArticlesType } from "@/constants/Types";
// import {
//   useInfiniteQuery,
//   useQueryClient,
//   InfiniteData,
// } from "@tanstack/react-query";

// const PAGE_SIZE = 1;

// export function useNewsArticles() {
//   const { language } = useLanguage();
//   const lang = language ?? "DE";
//   const queryClient = useQueryClient();
//   const queryKey = ["newsArticles", lang];

//   const selectCols = `
//     id,
//     created_at,
//     title,
//     content,
//     is_external_link,
//     external_link_url
//   `;

//   // 1️⃣ Infinite query for pagination, now filtering on language_code
//   const infiniteQuery = useInfiniteQuery<NewsArticlesType[], Error>({
//     queryKey,
//     enabled: Boolean(language),
//     staleTime: 5 * 60 * 1000,
//     retry: 1,
//     initialPageParam: 0,
//     queryFn: async ({ pageParam = 0 }: { pageParam: any }) => {
//       const from = pageParam * PAGE_SIZE;
//       const to = from + PAGE_SIZE - 1;

//       const { data, error } = await supabase
//         .from("news_articles")
//         .select(selectCols)
//         .eq("language_code", lang)
//         .order("created_at", { ascending: false })
//         .range(from, to);

//       if (error) throw error;
//       return (data ?? []).map((row: any) => ({
//         id: Number(row.id),
//         createdAt: row.created_at,
//         title: row.title ?? "",
//         content: row.content ?? "",
//         isExternalLink: row.is_external_link,
//         externalLink: row.external_link_url,
//         languageCode: row.language_code,
//       }));
//     },
//     getNextPageParam: (lastPage, allPages) =>
//       lastPage.length === PAGE_SIZE ? allPages.length : undefined,
//   });

//   // 2️⃣ Real-time subscription (scoped to this language)
//   useEffect(() => {
//     if (!language) return;

//     const channel = supabase
//       .channel(`news_articles_${lang}`)
//       .on(
//         "postgres_changes",
//         {
//           event: "*",
//           schema: "public",
//           table: "news_articles",
//           filter: `language_code=eq.${lang}`,
//         },
//         (payload) => {
//           const { eventType, new: newRec, old: oldRec } = payload;

//           queryClient.setQueryData<InfiniteData<NewsArticlesType[]>>(
//             queryKey,
//             (oldData) => {
//               if (!oldData) return oldData;

//               const mapRow = (row: any): NewsArticlesType => ({
//                 id: Number(row.id),
//                 createdAt: row.created_at,
//                 title: row.title ?? "",
//                 content: row.content ?? "",
//                 isExternalLink: row.is_external_link,
//                 externalLink: row.external_link_url,
//                 languageCode: row.language_code,
//               });

//               const newPages = oldData.pages.map((page) => {
//                 switch (eventType) {
//                   case "UPDATE": {
//                     const updated = mapRow(newRec!);
//                     return page.map((item) =>
//                       item.id === updated.id ? updated : item
//                     );
//                   }
//                   case "DELETE": {
//                     const deleted = mapRow(oldRec!);
//                     return page.filter((item) => item.id !== deleted.id);
//                   }
//                   default:
//                     return page;
//                 }
//               });

//               if (eventType === "INSERT") {
//                 const inserted = mapRow(newRec!);
//                 newPages[0] = [inserted, ...newPages[0]];
//               }

//               return { ...oldData, pages: newPages };
//             }
//           );
//         }
//       )
//       .subscribe();

//     return () => {
//       supabase.removeChannel(channel);
//     };
//   }, [language, lang, queryClient, queryKey]);

//   return infiniteQuery;
// }

import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/utils/supabase";
import { NewsArticlesType } from "@/constants/Types";
import {
  useInfiniteQuery,
  useQueryClient,
  InfiniteData,
} from "@tanstack/react-query";

const PAGE_SIZE = 1;

export function useNewsArticles() {
  const { language } = useLanguage();
  const lang = language ?? "de";
  const queryClient = useQueryClient();
  const queryKey = ["newsArticles", lang];

  const selectCols = `
    id,
    created_at,
    title,
    content,
    is_external_link,
    external_link_url,
    language_code,
    read_time
  `; // Added language_code to selectCols for single article fetch

  const infiniteQuery = useInfiniteQuery<NewsArticlesType[], Error>({
    queryKey,
    enabled: Boolean(language),
    staleTime: 5 * 60 * 1000,
    retry: 1,
    initialPageParam: 0,
    queryFn: async ({ pageParam = 0 }: { pageParam: any }) => {
      const from = pageParam * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const { data, error } = await supabase
        .from("news_articles")
        .select(selectCols)
        .eq("language_code", lang)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;
      return data ?? [];
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === PAGE_SIZE ? allPages.length : undefined,
  });

  useEffect(() => {
    if (!language) return;

    const channel = supabase
      .channel(`news_articles_${lang}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "news_articles",
          filter: `language_code=eq.${lang}`,
        },
        (payload) => {
          const { eventType, new: newRec, old: oldRec } = payload;

          queryClient.setQueryData<InfiniteData<NewsArticlesType[]>>(
            queryKey,
            (oldData) => {
              if (!oldData) return oldData;

              const newPages = oldData.pages.map((page) => {
                switch (eventType) {
                  case "UPDATE":
                    return page.map((item) =>
                      item.id === newRec!.id
                        ? (newRec as NewsArticlesType)
                        : item
                    );
                  case "DELETE":
                    return page.filter((item) => item.id !== oldRec!.id);
                  default:
                    return page;
                }
              });

              if (eventType === "INSERT") {
                const inserted = newRec as NewsArticlesType;
                if (newPages.length > 0) {
                  newPages[0] = [inserted, ...newPages[0]];
                } else {
                  newPages.push([inserted]);
                }
              }

              return { ...oldData, pages: newPages };
            }
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [language, lang, queryClient, queryKey]);

  // Function to fetch a single news article by ID
  const fetchNewsArticleById = async (
    id: number
  ): Promise<NewsArticlesType | null> => {
    // Attempt to find the article in the existing cache first
    const cachedData =
      queryClient.getQueryData<InfiniteData<NewsArticlesType[]>>(queryKey);
    if (cachedData) {
      for (const page of cachedData.pages) {
        const foundArticle = page.find((article) => article.id === id);
        if (foundArticle) {
          return foundArticle;
        }
      }
    }

    // If not in cache, fetch from Supabase
    const { data, error } = await supabase
      .from("news_articles")
      .select(selectCols)
      .eq("id", id)
      .single(); // .single() is important for fetching one record

    if (error) {
      console.error("Error fetching single news article:", error);
      throw error; // Or handle error as you see fit
    }

    if (!data) {
      return null; // Or handle not found case
    }

    return data as NewsArticlesType;
  };

  return { ...infiniteQuery, fetchNewsArticleById };
}
