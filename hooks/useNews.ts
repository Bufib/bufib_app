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

  const selectCols = `
    id,
    created_at,
    title,
    content,
    external_urls,
    internal_urls,
    images_url
  `;

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

  // real-time subscription for this language
  useEffect(() => {
    if (!language) return;

    const channel = supabase
      .channel(`news_${lang}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "news",
          filter: `language_code=eq.${lang}`,
        },
        (payload) => {
          const { eventType, new: newRec, old: oldRec } = payload;

          queryClient.setQueryData<InfiniteData<NewsType[]>>(
            queryKey,
            (oldData) => {
              if (!oldData) return oldData;

              const pages = oldData.pages.map((page) => {
                switch (eventType) {
                  case "UPDATE":
                    return page.map((item) =>
                      item.id === newRec!.id ? (newRec as NewsType) : item
                    );
                  case "DELETE":
                    return page.filter((item) => item.id !== oldRec!.id);
                  default:
                    return page;
                }
              });

              // insert at front on INSERT
              if (eventType === "INSERT") {
                pages[0] = [newRec as NewsType, ...pages[0]];
              }

              return { ...oldData, pages };
            }
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [language, lang, queryClient, queryKey]);

  return infiniteQuery;
}
