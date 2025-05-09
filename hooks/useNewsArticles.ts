// import { useLanguage } from "@/contexts/LanguageContext";
// import { supabase } from "@/utils/supabase";
// import { NewsArticlesType } from "@/constants/Types";
// import { mapLanguageToTable } from "@/utils/mapLanguageToTable";
// import { useQuery } from "@tanstack/react-query";

// export function useNewsArticles() {
//   const { language } = useLanguage();
//   const lang = language ?? "de";
//   const tableName = mapLanguageToTable[lang];

//   return useQuery<NewsArticlesType[], Error>({
//     queryKey: ["newsArticles", lang],
//     // Query runs only once language is known
//     enabled: Boolean(language),

//     // How fresh data stays before becoming stale
//     staleTime: 5 * 60 * 1000, // 5 minutes

//     // Retry failed fetches once
//     retry: 1,

//     // Fetch function
//     queryFn: async () => {
//       const titleCol = `${tableName.title}`;
//       const contentCol = `${tableName.content}`;

//       const selectDataFromSupabaseTable = `
//         id,
//         created_at,
//         ${titleCol},
//         ${contentCol},
//         external_link
//       `;

//       try {
//         const { data, error } = await supabase
//           .from("news_articles")
//           .select(selectDataFromSupabaseTable);

//         if (error) throw error;

//         return (data ?? []).map((row: any) => ({
//           id: row.id,
//           createdAt: row.created_at,
//           title: row[titleCol] ?? "",
//           content: row[contentCol] ?? "",
//           externalLink: row.external_link,
//         }));
//       } catch (err) {

//         console.error("Failed to fetch news articles:", err);
//         return [];
//       }
//     },
//   });
// }

import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/utils/supabase";
import { NewsArticlesType } from "@/constants/Types";
import { mapLanguageToTable } from "@/utils/mapLanguageToTable";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export function useNewsArticles() {
  const { language } = useLanguage();
  const lang = language ?? "de";
  const tableName = mapLanguageToTable[lang];
  const queryClient = useQueryClient();
  const queryKey = ["newsArticles", lang];

  // base query
  const query = useQuery<NewsArticlesType[], Error>({
    queryKey,
    enabled: Boolean(language),
    staleTime: 5 * 60 * 1000,
    retry: 1,
    queryFn: async () => {
      const titleCol = tableName.title;
      const contentCol = tableName.content;
      const selectCols = `
        id,
        created_at,
        ${titleCol},
        ${contentCol},
        external_link
      `;
      const { data, error } = await supabase
        .from("news_articles")
        .select(selectCols);

      if (error) throw error;
      return (data ?? []).map((row: any) => ({
        id: row.id,
        createdAt: row.created_at,
        title: row[titleCol] ?? "",
        content: row[contentCol] ?? "",
        externalLink: row.external_link,
      }));
    },
  });

  // real-time subscription
  useEffect(() => {
    if (!language) return;

    const channel = supabase
      .channel(`news_articles_${lang}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "news_articles" },
        (payload) => {
          const { eventType, new: newRec, old: oldRec } = payload;

          queryClient.setQueryData<NewsArticlesType[]>(queryKey, (old) => {
            if (!old) return old;

            // Always normalize the ID to a number
            const makeMapped = (row: any): NewsArticlesType => ({
              id: Number(row.id),
              createdAt: row.created_at,
              title: row[tableName.title] ?? "",
              content: row[tableName.content] ?? "",
              externalLink: row.external_link,
            });

            switch (eventType) {
              case "INSERT": {
                const mapped = makeMapped(newRec!);
                return [mapped, ...old];
              }
              case "UPDATE": {
                const mapped = makeMapped(newRec!);
                return old.map((item) =>
                  item.id === mapped.id ? mapped : item
                );
              }
              case "DELETE": {
                const mapped = makeMapped(oldRec!);
                return old.filter((item) => item.id !== mapped.id);
              }
              default:
                return old;
            }
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [language, lang, queryClient, queryKey, tableName]);

  return query;
}
