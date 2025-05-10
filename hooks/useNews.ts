import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/utils/supabase";
import { News } from "@/constants/Types";
import { mapLanguageToTable } from "@/utils/mapLanguageToTable";
import {
  useInfiniteQuery,
  useQueryClient,
  InfiniteData,
} from "@tanstack/react-query";

const PAGE_SIZE = 1;

/**
 * Fetch and subscribe to paginated news items from the `news` table,
 * selecting the correct title/content columns based on the current language.
 */
export function useNews() {
  const { language } = useLanguage();
  const lang: string = language ?? "de";
  const tableName = mapLanguageToTable[lang];
  const queryClient = useQueryClient();
  const queryKey = ["news", lang] as const;

  const selectCols = `
    id,
    created_at,
    images_url,
    ${tableName.title},
    ${tableName.content},
    external_url,
    internal_url
  `;

  const infiniteQuery = useInfiniteQuery<News[], Error>({
    queryKey,
    enabled: Boolean(language),
    staleTime: 5 * 60 * 1000,
    retry: 1,
    initialPageParam: 0,

    queryFn: async ({ pageParam = 0 }) => {
      const from = pageParam * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const { data, error } = await supabase
        .from("news")
        .select(selectCols)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;

      return (data ?? []).map((row: any) => ({
        id: Number(row.id),
        createdAt: row.created_at,
        title: row.title ?? "",
        content: row.content ?? "",
        imagesUrl: row.images_url ?? [],
        externalUrls: row.external_urls ?? [],
        internalUrls: row.internal_urls ?? [],
      }));
    },

    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === PAGE_SIZE ? allPages.length : undefined,
  });

  useEffect(() => {
    if (!language) return;

    const channel = supabase
      .channel(`news_${lang}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "news" },
        (payload) => {
          const { eventType, new: newRec, old: oldRec } = payload;

          queryClient.setQueryData<InfiniteData<News[]>>(
            queryKey,
            (oldData) => {
              if (!oldData) return oldData;

              const mapRow = (row: any): News => ({
                id: Number(row.id),
                createdAt: row.created_at,
                title: row[tableName.title] ?? "",
                content: row[tableName.content] ?? "",
                imagesUrl: row.images_url ?? [],
                externalUrls: row.external_urls ?? [],
                internalUrls: row.internal_urls ?? [],
              });

              const newPages = oldData.pages.map((page) => {
                switch (eventType) {
                  case "INSERT": {
                    // prepend into first page
                    const inserted = mapRow(newRec!);
                    return [inserted, ...page];
                  }
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
