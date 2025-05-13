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
      .select("*")
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
