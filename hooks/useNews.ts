// import { useEffect } from "react";
// import { useLanguage } from "@/contexts/LanguageContext";
// import { supabase } from "@/utils/supabase";
// import { NewsType } from "@/constants/Types";
// import {
//   useInfiniteQuery,
//   useQueryClient,
//   InfiniteData,
// } from "@tanstack/react-query";

// const PAGE_SIZE = 10; // adjust as needed

// export function useNews(language: string) {
//   const queryClient = useQueryClient();
//   const queryKey = ["news", language];

//   const infiniteQuery = useInfiniteQuery<NewsType[], Error>({
//     queryKey,
//     enabled: Boolean(language),
//     staleTime: 5 * 60 * 1000,
//     retry: 1,
//     initialPageParam: 0,

//     // tell TS that pageParam is a number
//     queryFn: async ({ pageParam = 0 }: { pageParam: any }) => {
//       const from = pageParam * PAGE_SIZE;
//       const to = from + PAGE_SIZE - 1;

//       const { data, error } = await supabase
//         .from("news")
//         .select("*")
//         .eq("language_code", language)
//         .order("is_pinned", { ascending: false })
//         .order("created_at", { ascending: false })
//         .range(from, to);

//       if (error) throw error;

//       return data ?? [];
//     },

//     getNextPageParam: (lastPage, allPages) =>
//       lastPage.length === PAGE_SIZE ? allPages.length : undefined,
//   });

//   return infiniteQuery;
// }

import { useState, useEffect } from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";
import { useSupabaseRealtime } from "@/components/SupabaseRealtimeProvider";
import { NewsType } from "@/constants/Types";

const PAGE_SIZE = 10;

export function useNews(language: string) {
  const queryClient = useQueryClient();
  const { hasNewNewsData, clearNewNewsFlag } = useSupabaseRealtime();

  const [showUpdateButton, setShowUpdateButton] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Toggle the “new data” banner
  useEffect(() => {
    setShowUpdateButton(hasNewNewsData);
  }, [hasNewNewsData]);

  const infiniteQuery = useInfiniteQuery<NewsType[], Error>({
    queryKey: ["news", language],
    enabled: Boolean(language),
    staleTime: 5 * 60 * 1000,
    retry: 1,
    // start at page 0
    initialPageParam: 0,

    queryFn: async ({ pageParam = 0 }: { pageParam: any }) => {
      const from = pageParam * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const { data, error } = await supabase
        .from("news")
        .select("*")
        .eq("language_code", language)
        .order("is_pinned", { ascending: false })
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;
      return data ?? [];
    },

    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === PAGE_SIZE ? allPages.length : undefined,
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    refetch,
    isRefetching,
    isLoading,
    isError,
    error,
  } = infiniteQuery;

  /** Pull-to-refresh handler */
  const handlePullToRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      clearNewNewsFlag();
      setShowUpdateButton(false);
    } finally {
      setIsRefreshing(false);
    }
  };

  /** When user taps “New items available” */
  const handleRefresh = async () => {
    if (!hasNewNewsData) return;
    await queryClient.invalidateQueries({
      queryKey: ["news", language],
      refetchType: "all",
    });
    clearNewNewsFlag();
    setShowUpdateButton(false);
  };

  /** Infinite-scroll “load more” handler */
  const handleLoadMore = async () => {
    if (hasNextPage && !isFetchingNextPage) {
      await fetchNextPage();
    }
  };

  /** Flatten & de-duplicate pages */
  const allNews: NewsType[] =
    data?.pages
      .flatMap((page) => page)
      .reduce<NewsType[]>((acc, item) => {
        if (!acc.some((n) => n.id === item.id)) acc.push(item);
        return acc;
      }, []) ?? [];

  return {
    // react-query output
    ...infiniteQuery,

    // our extras
    allNews,
    showUpdateButton,
    isRefreshing,
    handlePullToRefresh,
    handleRefresh,
    handleLoadMore,
  };
}
