// import {
//   useInfiniteQuery,
//   useMutation,
//   useQueryClient,
// } from "@tanstack/react-query";
// import { supabase } from "@/utils/supabase";
// import * as FileSystem from "expo-file-system";
// import { useEffect } from "react";
// import { PodcastType } from "@/constants/Types";

// // --- PAGINATION FOR METADATA ---
// const PAGE_SIZE = 3;
// export function usePodcasts(language: string) {
//   const queryClient = useQueryClient();
//   const infiniteQuery = useInfiniteQuery<PodcastType[], Error>({
//     queryKey: ["podcasts", language],
//     queryFn: async ({ pageParam = 0 }) => {
//       const { data, error } = await supabase
//         .from("podcasts")
//         .select("*")
//         .eq("language_code", language)
//         .order("id", { ascending: false })
//         .range(pageParam, pageParam + PAGE_SIZE - 1);
//       if (error) throw error;
//       return data!;
//     },
//     getNextPageParam: (lastPage, allPages) =>
//       lastPage.length === PAGE_SIZE ? allPages.length * PAGE_SIZE : undefined,
//     initialPageParam: 0,
//     staleTime: 1000 * 60 * 5,
//   });

//   useEffect(() => {
//     const channel = supabase
//       .channel(`podcasts_${language}`)
//       // INSERT
//       .on(
//         "postgres_changes",
//         {
//           event: "INSERT",
//           schema: "public",
//           table: "podcasts",
//           filter: `language_code=eq.${language}`,
//         },
//         ({ new: newItem }) => {
//           queryClient.setQueryData<{
//             pages: PodcastType[][];
//             pageParams: number[];
//           }>(["podcasts", language], (old) => {
//             if (!old) return old!;
//             const [firstPage, ...rest] = old.pages;
//             return {
//               pageParams: old.pageParams,
//               pages: [[newItem as PodcastType, ...firstPage], ...rest],
//             };
//           });
//         }
//       )
//       // UPDATE
//       .on(
//         "postgres_changes",
//         {
//           event: "UPDATE",
//           schema: "public",
//           table: "podcasts",
//           filter: `language_code=eq.${language}`,
//         },
//         ({ new: updatedItem }) => {
//           queryClient.setQueryData<{
//             pages: PodcastType[][];
//             pageParams: number[];
//           }>(["podcasts", language], (old) => {
//             if (!old) return old!;
//             return {
//               pageParams: old.pageParams,
//               pages: old.pages.map((page) =>
//                 page.map((p) =>
//                   p.id === (updatedItem as PodcastType).id
//                     ? (updatedItem as PodcastType)
//                     : p
//                 )
//               ),
//             };
//           });
//         }
//       )
//       // DELETE
//       .on(
//         "postgres_changes",
//         {
//           event: "DELETE",
//           schema: "public",
//           table: "podcasts",
//           filter: `language_code=eq.${language}`,
//         },
//         ({ old: deletedItem }) => {
//           queryClient.setQueryData<{
//             pages: PodcastType[][];
//             pageParams: number[];
//           }>(["podcasts", language], (old) => {
//             if (!old) return old!;
//             return {
//               pageParams: old.pageParams,
//               pages: old.pages.map((page) =>
//                 page.filter((p) => p.id !== (deletedItem as PodcastType).id)
//               ),
//             };
//           });
//         }
//       )
//       .subscribe();

//     return () => void supabase.removeChannel(channel);
//   }, [language, queryClient]);

//   return infiniteQuery;
// }

// // --- CACHE CLEANUP & DOWNLOAD LOGIC ---
// const CACHE_MAX_AGE_DAYS = 7;
// const CACHE_MAX_FILES = 20;

// async function cleanupCache(): Promise<void> {
//   const dir = FileSystem.cacheDirectory!;
//   const names = await FileSystem.readDirectoryAsync(dir);
//   const infos: Array<{ uri: string; mtime: number }> = [];

//   await Promise.all(
//     names.map(async (name) => {
//       const uri = dir + name;
//       const info = await FileSystem.getInfoAsync(uri, { size: true });
//       if (info.exists && info.modificationTime) {
//         infos.push({ uri, mtime: info.modificationTime * 1000 });
//       }
//     })
//   );

//   const now = Date.now();
//   const cutoff = now - CACHE_MAX_AGE_DAYS * 24 * 60 * 60 * 1000;

//   // Delete old
//   await Promise.all(
//     infos
//       .filter((f) => f.mtime < cutoff)
//       .map((f) => FileSystem.deleteAsync(f.uri, { idempotent: true }))
//   );

//   // Keep only the newest CACHE_MAX_FILES
//   const sorted = infos.sort((a, b) => b.mtime - a.mtime).map((f) => f.uri);
//   const toDelete = sorted.slice(CACHE_MAX_FILES);
//   await Promise.all(
//     toDelete.map((uri) => FileSystem.deleteAsync(uri, { idempotent: true }))
//   );
// }

// async function downloadToCache(
//   soundPath: string,
//   onProgress?: (fraction: number) => void
// ): Promise<string> {

//   const filename = soundPath.split("/").pop()!;
//   const localUri = FileSystem.cacheDirectory + filename;

//   // 1) Skip if already there
//   const info = await FileSystem.getInfoAsync(localUri);
//   if (info.exists) return localUri;

//   // 2) Try download (with one retry on 403)
//   for (let attempt = 0; attempt < 2; attempt++) {
//     const { data, error } = await supabase.storage
//       .from("sounds")
//       .createSignedUrl(soundPath, 60 * 60);
//     if (error) throw error;

//     try {
//       const task = FileSystem.createDownloadResumable(
//         data.signedUrl,
//         localUri,
//         {},
//         ({ totalBytesWritten, totalBytesExpectedToWrite }) => {
//           if (onProgress && totalBytesExpectedToWrite > 0) {
//             onProgress(totalBytesWritten / totalBytesExpectedToWrite);
//           }
//         }
//       );
//       const { uri } = await task.downloadAsync();
//       cleanupCache().catch(console.warn);
//       return uri;
//     } catch (err: any) {
//       if (err?.status === 403 && attempt === 0) continue;
//       throw err;
//     }
//   }

//   throw new Error("Failed to download podcast after retrying");
// }

// // --- DOWNLOAD MUTATION HOOK (single-object overload) ---
// export function useDownloadPodcastSound() {
//   const queryClient = useQueryClient();

//   return useMutation<
//     string, // TData: the local URI
//     Error, // TError
//     {
//       // TVariables
//       soundPath: string;
//       onProgress?: (fraction: number) => void;
//     }
//   >({
//     mutationFn: (vars) => downloadToCache(vars.soundPath, vars.onProgress),
//     onMutate: (vars) => {
//       queryClient.setQueryData(["download", vars.soundPath], {
//         status: "loading",
//       });
//     },
//     onError: (err, vars) => {
//       queryClient.setQueryData(["download", vars.soundPath], {
//         status: "error",
//         error: err,
//       });
//     },
//     onSuccess: (uri, vars) => {
//       queryClient.setQueryData(["download", vars.soundPath], {
//         status: "done",
//         uri,
//       });
//     },
//     retry: 1,
//   });
// }
// hooks/useFetchPodcasts.ts

import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";
import * as FileSystem from "expo-file-system";
import { useEffect } from "react";
import { PodcastType } from "@/constants/Types";

// --- PODCAST LIST PAGINATION & REAL-TIME SUBSCRIPTION ---
const PAGE_SIZE = 3;

export function usePodcasts(language: string) {
  const qc = useQueryClient();

  const infiniteQuery = useInfiniteQuery<PodcastType[], Error>({
    queryKey: ["podcasts", language],
    queryFn: async ({ pageParam = 0 }) => {
      const { data, error } = await supabase
        .from("podcasts")
        .select("*")
        .eq("language_code", language)
        .order("id", { ascending: false })
        .range(pageParam, pageParam + PAGE_SIZE - 1);
      if (error) throw error;
      return data!;
    },
    getNextPageParam: (lastPage, all) =>
      lastPage.length === PAGE_SIZE ? all.length * PAGE_SIZE : undefined,
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
  });

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
        ({ new: item }) => {
          qc.setQueryData<{ pages: PodcastType[][]; pageParams: number[] }>(
            ["podcasts", language],
            (old) => {
              if (!old) return old!;
              const [first, ...rest] = old.pages;
              return {
                pageParams: old.pageParams,
                pages: [[item as PodcastType, ...first], ...rest],
              };
            }
          );
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "podcasts",
          filter: `language_code=eq.${language}`,
        },
        ({ new: upd }) => {
          qc.setQueryData<{ pages: PodcastType[][]; pageParams: number[] }>(
            ["podcasts", language],
            (old) => {
              if (!old) return old!;
              return {
                pageParams: old.pageParams,
                pages: old.pages.map((page) =>
                  page.map((p) =>
                    p.id === (upd as PodcastType).id ? (upd as PodcastType) : p
                  )
                ),
              };
            }
          );
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "podcasts",
          filter: `language_code=eq.${language}`,
        },
        ({ old: del }) => {
          qc.setQueryData<{ pages: PodcastType[][]; pageParams: number[] }>(
            ["podcasts", language],
            (old) => {
              if (!old) return old!;
              return {
                pageParams: old.pageParams,
                pages: old.pages.map((page) =>
                  page.filter((p) => p.id !== (del as PodcastType).id)
                ),
              };
            }
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [language, qc]);

  return infiniteQuery;
}

// --- CACHE CLEANUP & DOWNLOAD HELPERS ---
const CACHE_MAX_AGE_DAYS = 7;
const CACHE_MAX_FILES = 20;

async function cleanupCache(): Promise<void> {
  const dir = FileSystem.cacheDirectory!;
  const names = await FileSystem.readDirectoryAsync(dir);
  const infos: { uri: string; mtime: number }[] = [];

  await Promise.all(
    names.map(async (name) => {
      const uri = dir + name;
      const info = await FileSystem.getInfoAsync(uri, { size: true });
      if (info.exists && info.modificationTime)
        infos.push({ uri, mtime: info.modificationTime * 1000 });
    })
  );

  const cutoff = Date.now() - CACHE_MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
  // delete old
  await Promise.all(
    infos
      .filter((f) => f.mtime < cutoff)
      .map((f) => FileSystem.deleteAsync(f.uri, { idempotent: true }))
  );
  // keep newest
  const sorted = infos.sort((a, b) => b.mtime - a.mtime).map((f) => f.uri);
  await Promise.all(
    sorted
      .slice(CACHE_MAX_FILES)
      .map((uri) => FileSystem.deleteAsync(uri, { idempotent: true }))
  );
}

/**
 * Downloads either:
 * - a full HTTP(S) URL, or
 * - a private file under your `sound/podcasts/...` path
 */
async function downloadToCache(
  source: string,
  onProgress?: (frac: number) => void
): Promise<string> {
  let downloadUrl: string;
  let filename: string;

  // PUBLIC URL?
  if (/^https?:\/\//.test(source)) {
    downloadUrl = source;
    filename = source.split("/").pop()!.split("?")[0];
  } else {
    // PRIVATE storage: bucket = "sound", key = source (e.g. "podcasts/foo.mp3")
    filename = source.split("/").pop()!;
    const { data, error } = await supabase.storage
      .from("sound")
      .createSignedUrl(source, 60 * 60);
    if (error) throw error;
    downloadUrl = data.signedUrl;
  }

  const localUri = FileSystem.cacheDirectory + filename;
  const info = await FileSystem.getInfoAsync(localUri);
  if (info.exists) return localUri;

  // download (resumable) with one retry on expired URL
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const task = FileSystem.createDownloadResumable(
        downloadUrl,
        localUri,
        {},
        ({ totalBytesWritten, totalBytesExpectedToWrite }) => {
          if (onProgress && totalBytesExpectedToWrite > 0) {
            onProgress(totalBytesWritten / totalBytesExpectedToWrite);
          }
        }
      );
      const { uri } = await task.downloadAsync();
      cleanupCache().catch(console.warn);
      return uri;
    } catch (err: any) {
      if (
        attempt === 0 &&
        !/^https?:\/\//.test(source) &&
        err?.status === 403
      ) {
        // refresh signed URL once
        const { data, error } = await supabase.storage
          .from("sound")
          .createSignedUrl(source, 60 * 60);
        if (error) throw error;
        downloadUrl = data.signedUrl;
        continue;
      }
      throw err;
    }
  }

  throw new Error("Failed to download after retry");
}

// --- DOWNLOAD MUTATION HOOK ---
export function useDownloadPodcastSound() {
  const qc = useQueryClient();

  return useMutation<
    string, // TData: localUri
    Error, // TError
    { soundPath: string; onProgress?: (n: number) => void }
  >({
    mutationFn: ({ soundPath, onProgress }) =>
      downloadToCache(soundPath, onProgress),
    onMutate: ({ soundPath }) => {
      qc.setQueryData(["download", soundPath], { status: "loading" });
    },
    onError: (err, { soundPath }) => {
      qc.setQueryData(["download", soundPath], { status: "error", error: err });
    },
    onSuccess: (uri, { soundPath }) => {
      qc.setQueryData(["download", soundPath], { status: "done", uri });
    },
    retry: 1,
  });
}
