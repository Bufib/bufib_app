// import { useState, useEffect } from "react";
// import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
// import { supabase } from "@/utils/supabase";
// import { useSupabaseRealtime } from "@/components/SupabaseRealtimeProvider";

// export type NewsItemType = {
//   id: number;
//   created_at: string;
//   title?: string;
//   body_text?: string;
//   image_url?: string[];
//   external_url?: string[];
//   internal_url?: string[];
//   is_pinned?: boolean;
// };

// const PAGE_SIZE = 10; // Number of items per page

// export const useFetchNews = () => {
//   const queryClient = useQueryClient();
//   const { hasNewNewsData, clearNewNewsFlag } = useSupabaseRealtime();
//   const [showUpdateButton, setShowUpdateButton] = useState(false);
//   const [isRefreshing, setIsRefreshing] = useState(false);

//   // Update button visibility based on new data flag from context
//   useEffect(() => {
//     setShowUpdateButton(hasNewNewsData);
//   }, [hasNewNewsData]);

//   const {
//     data,
//     fetchNextPage,
//     hasNextPage,
//     isFetching,
//     isFetchingNextPage,
//     refetch,
//     isRefetching,
//     isLoading,
//     isError,
//     error,
//   } = useInfiniteQuery<NewsItemType[], Error>({
//     queryKey: ["news"],
//     queryFn: async ({ pageParam = 0 }) => {
//       const { data, error } = await supabase
//         .from("news")
//         .select("*")
//         .order("is_pinned", { ascending: false })
//         .order("created_at", { ascending: false })
//         .range(pageParam * PAGE_SIZE, (pageParam + 1) * PAGE_SIZE - 1);

//       if (error) throw error;
//       return data as NewsItemType[];
//     },
//     initialPageParam: 0,
//     getNextPageParam: (lastPage, allPages) => {
//       // If the last page is empty or less than PAGE_SIZE, there are no more pages.
//       if (!lastPage || lastPage.length === 0 || lastPage.length < PAGE_SIZE) {
//         return undefined;
//       }
//       // Otherwise, use the current number of pages as the next page parameter.
//       return allPages.length;
//     },
//     maxPages: 4,
//     staleTime: 0, 
//     gcTime: 86400000, // 1 day
//     refetchOnMount: true,
//     refetchOnWindowFocus: true,
//     refetchOnReconnect: true,
//   });

//   /**
//    * Handle pull-to-refresh
//    */
//   //! might be not needed
//   const handlePullToRefresh = async () => {
//     setIsRefreshing(true);
//     try {
//       await refetch();
//       clearNewNewsFlag();
//       setShowUpdateButton(false);
//     } finally {
//       setIsRefreshing(false);
//     }
//   };

//   /**
//    * Handle refresh when new data is available (via update button)
//    */
//   const handleRefresh = async () => {
//     if (hasNewNewsData) {
//       // Fetch new data from the server and integrate it into the cache
//       await queryClient.invalidateQueries({
//         queryKey: ["news"],
//         refetchType: "all",
//       });
//       clearNewNewsFlag(); // Reset the "new data" flag
//       setShowUpdateButton(false); // Hide the banner
//     }
//   };

//   /**
//    * Handle infinite scroll with debouncing
//    */
//   const handleLoadMore = async () => {
//     if (!isFetchingNextPage && hasNextPage) {
//       await fetchNextPage();
//     }
//   };

//   /**
//    * Flatten and deduplicate news items
//    */
//   const allNews: NewsItemType[] =
//     data?.pages
//       .flatMap((page) => page)
//       .reduce<NewsItemType[]>((unique, item) => {
//         if (!unique.some((existing) => existing.id === item.id)) {
//           unique.push(item);
//         }
//         return unique;
//       }, []) ?? [];

//   return {
//     allNews,
//     hasNextPage,
//     isFetching,
//     isFetchingNextPage,
//     isRefetching,
//     isError,
//     error,
//     isLoading,
//     showUpdateButton,
//     hasNewNewsData,
//     isRefreshing,
//     fetchNextPage: handleLoadMore,
//     handleRefresh,
//     handlePullToRefresh,
//   };
// };
