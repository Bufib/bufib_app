// src/hooks/useFetchVideoCategories.ts
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";
import { VideoCategoryType } from "@/constants/Types";

/**
 * Custom hook to fetch video categories from Supabase,
 * filtered by a specific language code.
 *
 * @param languageCode The language code to filter categories by (e.g., 'en', 'es').
 * This parameter is now mandatory.
 */
export function useFetchVideoCategories(languageCode: string) {
  // languageCode is no longer optional
  const query = useQuery<VideoCategoryType[], Error>({
    queryKey: ["video_categories", languageCode],

    queryFn: async () => {
      // Apply the language code filter, as it's now always provided
      const { data, error } = await supabase
        .from("video_categories")
        .select("*")
        .eq("language_code", languageCode) // languageCode is guaranteed to be present
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching video categories:", error); // Log the error for debugging
        throw error;
      }
      return data ?? [];
    },

    staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes
    retry: 1, // Retry failed queries once
    // The query will always be enabled since languageCode is now mandatory
    enabled: !!languageCode, // Ensures the query runs only when languageCode is a non-empty string
  });

  const categories = query.data ?? [];

  return {
    ...query,
    categories,
  };
}
