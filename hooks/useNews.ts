import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/utils/supabase";
import { NewsType } from "@/constants/Types";
import {
  useInfiniteQuery,
  useQueryClient,
  InfiniteData,
} from "@tanstack/react-query";

const PAGE_SIZE = 10; // adjust as needed

export function useNews() {
  const { language } = useLanguage();
  const lang = language ?? "de";
  const queryClient = useQueryClient();
  const queryKey = ["news", lang];

  const infiniteQuery = useInfiniteQuery<NewsType[], Error>({
    queryKey,
    enabled: Boolean(language),
    staleTime: 5 * 60 * 1000,
    retry: 1,
    initialPageParam: 0,

    // tell TS that pageParam is a number
    queryFn: async ({ pageParam = 0 }: { pageParam: any }) => {
      const from = pageParam * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const { data, error } = await supabase
        .from("news")
        .select("*")
        .eq("language_code", lang)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;

      return data ?? [];
    },

    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === PAGE_SIZE ? allPages.length : undefined,
  });

  return infiniteQuery;
}
