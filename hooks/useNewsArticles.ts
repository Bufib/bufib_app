// import { useEffect } from "react";
// import { useLanguage } from "@/contexts/LanguageContext";
// import { supabase } from "@/utils/supabase";
// import { NewsArticlesType } from "@/constants/Types";
// import { mapLanguageToTable } from "@/utils/mapLanguageToTable";
// import { useQuery, useQueryClient } from "@tanstack/react-query";

// export function useNewsArticles() {
//   const { language } = useLanguage();
//   const lang = language ?? "de";
//   const tableName = mapLanguageToTable[lang];
//   const queryClient = useQueryClient();
//   const queryKey = ["newsArticles", lang];

//   // base query
//   const query = useQuery<NewsArticlesType[], Error>({
//     queryKey,
//     enabled: Boolean(language),
//     staleTime: 5 * 60 * 1000,
//     retry: 1,
//     queryFn: async () => {
//       const titleCol = tableName.title;
//       const contentCol = tableName.content;
//       const selectCols = `
//         id,
//         created_at,
//         ${titleCol},
//         ${contentCol},
//         external_link
//       `;
//       const { data, error } = await supabase
//         .from("news_articles")
//         .select(selectCols);

//       if (error) throw error;
//       return (data ?? []).map((row: any) => ({
//         id: row.id,
//         createdAt: row.created_at,
//         title: row[titleCol] ?? "",
//         content: row[contentCol] ?? "",
//         externalLink: row.external_link,
//       }));
//     },
//   });

//   // real-time subscription
//   useEffect(() => {
//     if (!language) return;

//     const channel = supabase
//       .channel(`news_articles_${lang}`)
//       .on(
//         "postgres_changes",
//         { event: "*", schema: "public", table: "news_articles" },
//         (payload) => {
//           const { eventType, new: newRec, old: oldRec } = payload;

//           queryClient.setQueryData<NewsArticlesType[]>(queryKey, (old) => {
//             if (!old) return old;

//             // Always normalize the ID to a number
//             const makeMapped = (row: any): NewsArticlesType => ({
//               id: Number(row.id),
//               createdAt: row.created_at,
//               title: row[tableName.title] ?? "",
//               content: row[tableName.content] ?? "",
//               externalLink: row.external_link,
//             });

//             switch (eventType) {
//               case "INSERT": {
//                 const mapped = makeMapped(newRec!);
//                 return [mapped, ...old];
//               }
//               case "UPDATE": {
//                 const mapped = makeMapped(newRec!);
//                 return old.map((item) =>
//                   item.id === mapped.id ? mapped : item
//                 );
//               }
//               case "DELETE": {
//                 const mapped = makeMapped(oldRec!);
//                 return old.filter((item) => item.id !== mapped.id);
//               }
//               default:
//                 return old;
//             }
//           });
//         }
//       )
//       .subscribe();

//     return () => {
//       supabase.removeChannel(channel);
//     };
//   }, [language, lang, queryClient, queryKey, tableName]);

//   return query;
// }

import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/utils/supabase";
import { NewsArticlesType } from "@/constants/Types";
import { mapLanguageToTable } from "@/utils/mapLanguageToTable";
import {
  useInfiniteQuery,
  useQueryClient,
  InfiniteData,
} from "@tanstack/react-query";

const PAGE_SIZE = 5;

export function useNewsArticles() {
  const { language } = useLanguage();
  const lang = language ?? "de";
  const tableName = mapLanguageToTable[lang];
  const queryClient = useQueryClient();
  const queryKey = ["newsArticles", lang];

  const selectCols = `
    id,
    created_at,
    ${tableName.title},
    ${tableName.content},
    external_link
  `;

  // 1️⃣ Infinite query for pagination
  const infiniteQuery = useInfiniteQuery<NewsArticlesType[], Error>({
    queryKey,
    enabled: Boolean(language),
    staleTime: 5 * 60 * 1000,
    retry: 1,
    initialPageParam: 0,
    queryFn: async ({ pageParam = 0 }) => {
      const from = pageParam * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const { data, error } = await supabase
        .from("news_articles")
        .select(selectCols)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;
      return (data ?? []).map((row: any) => ({
        id: Number(row.id),
        createdAt: row.created_at,
        title: row[tableName.title] ?? "",
        content: row[tableName.content] ?? "",
        externalLink: row.external_link,
      }));
    },

    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === PAGE_SIZE ? allPages.length : undefined,
  });

  // 2️⃣ Real-time subscription that updates the infinite cache
  useEffect(() => {
    if (!language) return;

    const channel = supabase
      .channel(`news_articles_${lang}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "news_articles" },
        (payload) => {
          const { eventType, new: newRec, old: oldRec } = payload;

          queryClient.setQueryData<InfiniteData<NewsArticlesType[]>>(
            queryKey,
            (oldData) => {
              if (!oldData) return oldData;

              // helper to map a raw row to your type
              const mapRow = (row: any): NewsArticlesType => ({
                id: Number(row.id),
                createdAt: row.created_at,
                title: row[tableName.title] ?? "",
                content: row[tableName.content] ?? "",
                externalLink: row.external_link,
              });

              // update pages array
              const newPages = oldData.pages.map((page) => {
                switch (eventType) {
                  case "UPDATE": {
                    const updated = mapRow(newRec!);
                    return page.map((item) =>
                      item.id === updated.id ? updated : item
                    );
                  }
                  case "DELETE": {
                    const deleted = mapRow(oldRec!);
                    return page.filter((item) => item.id !== deleted.id);
                  }
                  default:
                    return page;
                }
              });

              if (eventType === "INSERT") {
                // prepend new item into first page
                const inserted = mapRow(newRec!);
                newPages[0] = [inserted, ...newPages[0]];
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
  }, [language, lang, queryClient, queryKey, tableName]);

  return infiniteQuery;
}
