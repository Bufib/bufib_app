import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/utils/supabase";
import { NewsArticlesType } from "@/constants/Types";
import { mapLanguageToTable } from "@/utils/mapLanguageToTable";
import { useQuery } from "@tanstack/react-query";

export function useNewsArticles() {
  const { language } = useLanguage();
  const lang = language ?? "de";
  const tableName = mapLanguageToTable[lang];

  return useQuery<NewsArticlesType[], Error>({
    queryKey: ["newsArticles", lang],
    // Query runs only once language is known
    enabled: Boolean(language),

    // How fresh data stays before becoming stale
    staleTime: 5 * 60 * 1000, // 5 minutes

    // Retry failed fetches once
    retry: 1,

    // Fetch function
    queryFn: async () => {
      const titleCol = `${tableName.title}`;
      const contentCol = `${tableName.content}`;

      const selectDataFromSupabaseTable = `
        id,
        created_at,
        ${titleCol},
        ${contentCol},
        external_link
      `;

      try {
        const { data, error } = await supabase
          .from("news_articles")
          .select(selectDataFromSupabaseTable);

        if (error) throw error;

        return (data ?? []).map((row: any) => ({
          id: row.id,
          createdAt: row.created_at,
          title: row[titleCol] ?? "",
          content: row[contentCol] ?? "",
          externalLink: row.external_link,
        }));
      } catch (err) {
        //!
        console.error("Failed to fetch news articles:", err);
        return [];
      }
    },
  });
}
