

import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";
import * as FileSystem from "expo-file-system";
import { useEffect } from "react";
import { PodcastType } from "@/constants/Types";

// Number of items per page
const PAGE_SIZE = 3;

// Fetch podcast metadata (minus audio) for a given language, paginated.

export function usePodcasts(language: string) {
  const queryClient = useQueryClient();

  const infiniteQuery = useInfiniteQuery({
    queryKey: ["podcasts", language],
    queryFn: async ({ pageParam = 0 }) => {
      const start = pageParam;
      const end = pageParam + PAGE_SIZE - 1;

      const { data, error } = await supabase
        .from("podcasts")
        .select("*")
        .eq("language_code", language)
        .order("id", { ascending: false })
        .range(start, end);

      if (error) throw error;
      return data!;
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === PAGE_SIZE ? allPages.length * PAGE_SIZE : undefined,
    // Provide the initial pageParam to satisfy TypeScript signature
    initialPageParam: 0,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  // Subscribe to realtime inserts in this language
  useEffect(() => {
    const channel = supabase
      .channel(`podcasts_${language}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "podcasts",
          filter: `language_code=eq.${language}`,
        },
        (payload) => {
          const newItem = payload.new as PodcastType;

          queryClient.setQueryData(["podcasts", language], (old: any) => {
            if (!old) return old;

            // Prepend the new item to the first page
            const updatedPages = old.pages.map(
              (page: PodcastType[], idx: number) =>
                idx === 0 ? [newItem, ...page] : page
            );

            return {
              pageParams: old.pageParams,
              pages: updatedPages,
            };
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [language, queryClient]);

  return infiniteQuery;
}

// Download a podcast sound file from Supabase storage into local FS.

async function downloadToLocal(soundPath: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from("podcasts")
    .createSignedUrl(soundPath, 60 * 60); // 1h expiry

  if (error) throw error;

  const filename = soundPath.split("/").pop()!;
  const localUri = FileSystem.documentDirectory + filename;
  const { uri, status } = await FileSystem.downloadAsync(
    data.signedUrl,
    localUri
  );

  if (status !== 200) {
    throw new Error(`Download failed: HTTP ${status}`);
  }
  return uri;
}

// Mutation hook to download audio on demand.

export function useDownloadPodcastSound() {
  return useMutation({
    mutationFn: downloadToLocal,
  });
}
