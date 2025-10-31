import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase"; // Your Supabase client
import { NewsArticlesType } from "@/constants/Types"; // Your NewsArticle type
import { useLanguage } from "@/contexts/LanguageContext"; // Your language context hook

/**
 * Custom hook to search news articles by a search term in the current language.
 *
 * @param searchTerm The term to search for in news articles.
 * @returns The result object from TanStack Query's useQuery.
 */

export function useSearchNewsArticles(searchTerm: string) {
  const { lang } = useLanguage();

  return useQuery<NewsArticlesType[], Error>({
    // Query key: Uniquely identifies this search query.
    queryKey: ["search", "newsArticles", searchTerm, lang],

    // Query function: Fetches the search results.
    queryFn: async () => {
      const trimmedSearchTerm = searchTerm.trim();
      if (!trimmedSearchTerm) {
        return []; // No search term, return empty results
      }

      const columnsToSearch = ["title", "content"];

      const orConditions = columnsToSearch
        .map((column) => `${column}.ilike.%${trimmedSearchTerm}%`)
        .join(",");

      const { data, error } = await supabase
        .from("news_articles")
        .select("*")
        .eq("language_code", lang)
        .or(orConditions)
        .order("created_at", { ascending: false });
      if (error) {
        console.error("Error searching news articles:", error);
        throw error;
      }

      return data ?? []; // Return fetched data or an empty array
    },

    // Options:
    // `enabled`: The query will only run if searchTerm (trimmed) is not empty and language is available.
    enabled: !!searchTerm.trim() && Boolean(lang),
    retry: 3,
    staleTime: 12 * 60 * 60 * 1000, // 12 hours
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7 days
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
}
