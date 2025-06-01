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
  const { language } = useLanguage();
  const lang = language ?? "de"; // Default to 'de' if no language is set in context

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
    enabled: !!searchTerm.trim() && Boolean(language),

    // `placeholderData`: Keeps previous results visible while new ones are loading.
    // Useful for a smoother UX when the search term changes.
    placeholderData: (previousData) => previousData,

    staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes.
    // gcTime: 10 * 60 * 1000, // Optional: How long unused data remains in cache
    retry: 1, // Retry failed requests once.
  });
}
