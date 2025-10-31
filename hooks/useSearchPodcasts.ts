import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";
import { PodcastType } from "@/constants/Types";
import { useLanguage } from "@/contexts/LanguageContext";

export function useSearchPodcasts(searchTerm: string) {
  const { lang } = useLanguage();

  return useQuery<PodcastType[], Error>({
    // 1) Query key: Includes the search term for effective caching and refetching.
    queryKey: ["search", "podcasts", searchTerm],

    // 2) Query function: Executes the asynchronous data fetching.
    queryFn: async () => {
      if (!searchTerm.trim()) {
        return [];
      }

      // 3) Supabase query: Searches for the searchTerm in the 'title' or 'description'
      //    fields of the 'episodes' table.
      const { data, error } = await supabase
        .from("podcasts")
        .select("*")
        .eq("language_code", lang)
        .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase query error:", error);
        throw error; // Propagates the error to TanStack Query
      }
      return data ?? []; // Returns the fetched data or an empty array if data is null/undefined.
    },

    enabled: !!searchTerm.trim(),
    placeholderData: (previousData) => previousData,
    retry: 3,
    staleTime: 12 * 60 * 60 * 1000, // 12 hours
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7 days
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
}
