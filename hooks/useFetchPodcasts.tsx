// import {
//   useInfiniteQuery,
//   useMutation,
//   useQueryClient,
// } from "@tanstack/react-query";
// import { supabase } from "@/utils/supabase";
// import * as FileSystem from "expo-file-system";
// import { useEffect } from "react";
// import { PodcastType } from "@/constants/Types";

// // --- PODCAST LIST PAGINATION & REAL-TIME SUBSCRIPTION ---
// const PAGE_SIZE = 3;

// export function usePodcasts(language: string) {
//   const qc = useQueryClient();

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
//     getNextPageParam: (lastPage, all) =>
//       lastPage.length === PAGE_SIZE ? all.length * PAGE_SIZE : undefined,
//     initialPageParam: 0,
//     staleTime: 5 * 60 * 1000,
//   });

//   useEffect(() => {
//     const channel = supabase
//       .channel(`podcasts_${language}`)
//       .on(
//         "postgres_changes",
//         {
//           event: "INSERT",
//           schema: "public",
//           table: "podcasts",
//           filter: `language_code=eq.${language}`,
//         },
//         ({ new: item }) => {
//           qc.setQueryData<{ pages: PodcastType[][]; pageParams: number[] }>(
//             ["podcasts", language],
//             (old) => {
//               if (!old) return old!;
//               const [first, ...rest] = old.pages;
//               return {
//                 pageParams: old.pageParams,
//                 pages: [[item as PodcastType, ...first], ...rest],
//               };
//             }
//           );
//         }
//       )
//       .on(
//         "postgres_changes",
//         {
//           event: "UPDATE",
//           schema: "public",
//           table: "podcasts",
//           filter: `language_code=eq.${language}`,
//         },
//         ({ new: upd }) => {
//           qc.setQueryData<{ pages: PodcastType[][]; pageParams: number[] }>(
//             ["podcasts", language],
//             (old) => {
//               if (!old) return old!;
//               return {
//                 pageParams: old.pageParams,
//                 pages: old.pages.map((page) =>
//                   page.map((p) =>
//                     p.id === (upd as PodcastType).id ? (upd as PodcastType) : p
//                   )
//                 ),
//               };
//             }
//           );
//         }
//       )
//       .on(
//         "postgres_changes",
//         {
//           event: "DELETE",
//           schema: "public",
//           table: "podcasts",
//           filter: `language_code=eq.${language}`,
//         },
//         ({ old: del }) => {
//           qc.setQueryData<{ pages: PodcastType[][]; pageParams: number[] }>(
//             ["podcasts", language],
//             (old) => {
//               if (!old) return old!;
//               return {
//                 pageParams: old.pageParams,
//                 pages: old.pages.map((page) =>
//                   page.filter((p) => p.id !== (del as PodcastType).id)
//                 ),
//               };
//             }
//           );
//         }
//       )
//       .subscribe();

//     return () => {
//       supabase.removeChannel(channel);
//     };
//   }, [language, qc]);

//   return infiniteQuery;
// }

// // --- CACHE CLEANUP & DOWNLOAD HELPERS ---
// const CACHE_MAX_AGE_DAYS = 7;
// const CACHE_MAX_FILES = 20;

// async function cleanupCache(): Promise<void> {
//   const dir = FileSystem.cacheDirectory!;
//   const names = await FileSystem.readDirectoryAsync(dir);
//   const infos: { uri: string; mtime: number }[] = [];

//   await Promise.all(
//     names.map(async (name) => {
//       const uri = dir + name;
//       const info = await FileSystem.getInfoAsync(uri, { size: true });
//       if (info.exists && info.modificationTime)
//         infos.push({ uri, mtime: info.modificationTime * 1000 });
//     })
//   );

//   const cutoff = Date.now() - CACHE_MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
//   // delete old
//   await Promise.all(
//     infos
//       .filter((f) => f.mtime < cutoff)
//       .map((f) => FileSystem.deleteAsync(f.uri, { idempotent: true }))
//   );
//   // keep newest
//   const sorted = infos.sort((a, b) => b.mtime - a.mtime).map((f) => f.uri);
//   await Promise.all(
//     sorted
//       .slice(CACHE_MAX_FILES)
//       .map((uri) => FileSystem.deleteAsync(uri, { idempotent: true }))
//   );
// }

// /**
//  * Downloads either:
//  * - a full HTTP(S) URL, or
//  * - a private file under your `sound/podcasts/...` path
//  */
// async function downloadToCache(
//   source: string,
//   onProgress?: (frac: number) => void
// ): Promise<string> {
//   let downloadUrl: string;
//   let filename: string;

//   // PUBLIC URL?
//   if (/^https?:\/\//.test(source)) {
//     downloadUrl = source;
//     filename = source.split("/").pop()!.split("?")[0];
//   } else {
//     // PRIVATE storage: bucket = "sound", key = source (e.g. "podcasts/foo.mp3")
//     filename = source.split("/").pop()!;
//     const { data, error } = await supabase.storage
//       .from("sounds")
//       .createSignedUrl(source, 60 * 60);
//     if (error) throw error;
//     downloadUrl = data.signedUrl;
//   }

//   const localUri = FileSystem.cacheDirectory + filename;
//   const info = await FileSystem.getInfoAsync(localUri);
//   if (info.exists) return localUri;

//   // download (resumable) with one retry on expired URL
//   for (let attempt = 0; attempt < 2; attempt++) {
//     try {
//       const task = FileSystem.createDownloadResumable(
//         downloadUrl,
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
//       if (
//         attempt === 0 &&
//         !/^https?:\/\//.test(source) &&
//         err?.status === 403
//       ) {
//         // refresh signed URL once
//         const { data, error } = await supabase.storage
//           .from("sound")
//           .createSignedUrl(source, 60 * 60);
//         if (error) throw error;
//         downloadUrl = data.signedUrl;
//         continue;
//       }
//       throw err;
//     }
//   }

//   throw new Error("Failed to download after retry");
// }

// // --- DOWNLOAD MUTATION HOOK ---
// export function useDownloadPodcastSound() {
//   const qc = useQueryClient();

//   return useMutation<
//     string, // TData: localUri
//     Error, // TError
//     { soundPath: string; onProgress?: (n: number) => void }
//   >({
//     mutationFn: ({ soundPath, onProgress }) =>
//       downloadToCache(soundPath, onProgress),
//     onMutate: ({ soundPath }) => {
//       qc.setQueryData(["download", soundPath], { status: "loading" });
//     },
//     onError: (err, { soundPath }) => {
//       qc.setQueryData(["download", soundPath], { status: "error", error: err });
//     },
//     onSuccess: (uri, { soundPath }) => {
//       qc.setQueryData(["download", soundPath], { status: "done", uri });
//     },
//     retry: 1,
//   });
// }

// import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { supabase } from "@/utils/supabase";
// import * as FileSystem from "expo-file-system";
// import { useEffect, useCallback } from "react";
// import { PodcastType } from "@/constants/Types";

// // --- CONFIGURATION ---
// const PAGE_SIZE = 3;
// const CACHE_MAX_AGE_DAYS = 7;
// const CACHE_MAX_FILES = 20;

// /**
//  * Remove cached files older than CACHE_MAX_AGE_DAYS or exceeding CACHE_MAX_FILES.
//  */
// async function cleanupCache(): Promise<void> {
//   const dir = FileSystem.cacheDirectory!;
//   const names = await FileSystem.readDirectoryAsync(dir);
//   const infos: { uri: string; mtime: number }[] = [];

//   await Promise.all(
//     names.map(async (name) => {
//       const uri = dir + name;
//       const info = await FileSystem.getInfoAsync(uri, { size: true });
//       if (info.exists && info.modificationTime) {
//         infos.push({ uri, mtime: info.modificationTime * 1000 });
//       }
//     })
//   );

//   const cutoff = Date.now() - CACHE_MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
//   // delete old files
//   await Promise.all(
//     infos
//       .filter((f) => f.mtime < cutoff)
//       .map((f) => FileSystem.deleteAsync(f.uri, { idempotent: true }))
//   );
//   // keep newest CACHE_MAX_FILES
//   const sorted = infos.sort((a, b) => b.mtime - a.mtime).map((f) => f.uri);
//   await Promise.all(
//     sorted
//       .slice(CACHE_MAX_FILES)
//       .map((uri) => FileSystem.deleteAsync(uri, { idempotent: true }))
//   );
// }

// /**
//  * Download a public URL or private storage file into cache, returning the local URI.
//  */
// async function downloadToCache(
//   source: string,
//   onProgress?: (frac: number) => void
// ): Promise<string> {
//   let downloadUrl: string;
//   const filename = source.split("/").pop()!.split("?")[0];

//   if (/^https?:\/\//.test(source)) {
//     // public
//     downloadUrl = source;
//   } else {
//     // private storage bucket "sounds"
//     const { data, error } = await supabase.storage
//       .from("sounds")
//       .createSignedUrl(source, 60 * 60);
//     if (error) throw error;
//     downloadUrl = data.signedUrl;
//   }

//   const localUri = FileSystem.cacheDirectory + filename;
//   const info = await FileSystem.getInfoAsync(localUri);
//   if (info.exists) {
//     return localUri;
//   }

//   // attempt download with one retry for refreshed signed URL
//   let currentUrl = downloadUrl;
//   for (let attempt = 0; attempt < 2; attempt++) {
//     try {
//       const task = FileSystem.createDownloadResumable(
//         currentUrl,
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
//       // on 403 or expired, refresh once
//       if (
//         attempt === 0 &&
//         !/^https?:\/\//.test(source) &&
//         err?.status === 403
//       ) {
//         const { data, error } = await supabase.storage
//           .from("sounds")
//           .createSignedUrl(source, 60 * 60);
//         if (error) throw error;
//         currentUrl = data.signedUrl;
//         continue;
//       }
//       throw err;
//     }
//   }
//   throw new Error("Failed to download after retry");
// }

// export function usePodcasts(language: string) {
//   const qc = useQueryClient();

//   // --- 1) Infinite paginated list ---
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
//     staleTime: 5 * 60 * 1000,
//   });

//   // --- 2) Real-time subscription updates ---
//   useEffect(() => {
//     const channel = supabase
//       .channel(`podcasts_${language}`)
//       .on(
//         "postgres_changes",
//         { event: "INSERT", schema: "public", table: "podcasts", filter: `language_code=eq.${language}` },
//         ({ new: item }) => {
//           qc.setQueryData<{ pages: PodcastType[][]; pageParams: number[] }>(
//             ["podcasts", language],
//             (old) => {
//               if (!old) return old!;
//               const [first, ...rest] = old.pages;
//               return {
//                 pageParams: old.pageParams,
//                 pages: [[item as PodcastType, ...first], ...rest],
//               };
//             }
//           );
//         }
//       )
//       .on(
//         "postgres_changes",
//         { event: "UPDATE", schema: "public", table: "podcasts", filter: `language_code=eq.${language}` },
//         ({ new: upd }) => {
//           qc.setQueryData<{ pages: PodcastType[][]; pageParams: number[] }>(
//             ["podcasts", language],
//             (old) => {
//               if (!old) return old!;
//               return {
//                 pageParams: old.pageParams,
//                 pages: old.pages.map((page) =>
//                   page.map((p) =>
//                     p.id === (upd as PodcastType).id ? (upd as PodcastType) : p
//                   )
//                 ),
//               };
//             }
//           );
//         }
//       )
//       .on(
//         "postgres_changes",
//         { event: "DELETE", schema: "public", table: "podcasts", filter: `language_code=eq.${language}` },
//         ({ old: del }) => {
//           qc.setQueryData<{ pages: PodcastType[][]; pageParams: number[] }>(
//             ["podcasts", language],
//             (old) => {
//               if (!old) return old!;
//               return {
//                 pageParams: old.pageParams,
//                 pages: old.pages.map((page) =>
//                   page.filter((p) => p.id !== (del as PodcastType).id)
//                 ),
//               };
//             }
//           );
//         }
//       )
//       .subscribe();

//     return () => supabase.removeChannel(channel);
//   }, [language, qc]);

//   // --- 3) Stream signed URL mutation ---
//   const streamMutation = useMutation<string, Error, string>({
//     mutationFn: async (soundPath: string) => {
//       const { data, error } = await supabase.storage
//         .from("sounds")
//         .createSignedUrl(soundPath, 60 * 60);
//         console.log(data)

//       if (error) throw error;
//       return data.signedUrl;
//     },
//   });

//   // --- 4) Download-to-cache mutation ---
//   const downloadMutation = useMutation<
//     string,
//     Error,
//     { soundPath: string; onProgress?: (frac: number) => void }
//   >({
//     mutationFn: ({ soundPath, onProgress }) =>
//       downloadToCache(soundPath, onProgress),
//     onMutate: ({ soundPath }) => {
//       qc.setQueryData(["download", soundPath], { status: "loading" });
//     },
//     onError: (err, { soundPath }) => {
//       qc.setQueryData(["download", soundPath], { status: "error", error: err });
//     },
//     onSuccess: (uri, { soundPath }) => {
//       qc.setQueryData(["download", soundPath], { status: "done", uri });
//     },
//     retry: 1,
//   });

//   return {
//     ...infiniteQuery,
//     /**
//      * Stream an episode by path → Promise<signedUrl>
//      */
//     stream: useCallback(
//       (soundPath: string) => streamMutation.mutateAsync(soundPath),
//       [streamMutation]
//     ),
//     /**
//      * Download an episode by path with progress → Promise<localUri>
//      */
//     download: downloadMutation,
//   };
// }

import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  InfiniteData, // Import type for better queryClient updates
} from "@tanstack/react-query";
import { supabase } from "@/utils/supabase"; // Ensure this points to your initialized Supabase client
import * as FileSystem from "expo-file-system";
import { useEffect, useCallback } from "react";
import { PodcastType } from "@/constants/Types"; // Ensure this type matches your podcast structure
import { Platform } from "react-native"; // Used for cache directory

// --- CONFIGURATION ---
const PAGE_SIZE = 3;
const CACHE_MAX_AGE_DAYS = 7;
const CACHE_MAX_FILES = 20;
const BUCKET_NAME = "sounds"; // Define your bucket name here

// --- HELPER FUNCTIONS ---

/**
 * Provides the correct cache directory path based on platform.
 */
function getCacheDirectory(): string {
  // Ensure cacheDirectory is not null - add trailing slash if needed
  const cacheDir = FileSystem.cacheDirectory;
  if (!cacheDir) {
    // Fallback or error handling if cache directory isn't available
    console.error("Cache directory is not available.");
    // Return a default path or throw an error depending on requirements
    // Using documentDirectory as a fallback, might not be ideal for cache.
    return FileSystem.documentDirectory + "audioCache/";
  }
  // Ensure it ends with a slash
  return cacheDir.endsWith("/") ? cacheDir : cacheDir + "/";
}

/**
 * Remove cached files older than CACHE_MAX_AGE_DAYS or exceeding CACHE_MAX_FILES.
 */
async function cleanupCache(): Promise<void> {
  try {
    const dirUri = getCacheDirectory();
    // Ensure the directory exists before trying to read it
    const dirInfo = await FileSystem.getInfoAsync(dirUri);
    if (!dirInfo.exists) {
      console.log("Cache directory does not exist, skipping cleanup.");
      return;
    }

    const names = await FileSystem.readDirectoryAsync(dirUri);
    const infos: { uri: string; mtime: number }[] = [];

    await Promise.all(
      names.map(async (name) => {
        const fileUri = dirUri + name;
        try {
          const info = await FileSystem.getInfoAsync(fileUri, { size: true });
          // Ensure it's a file and has modification time
          if (info.exists && !info.isDirectory && info.modificationTime) {
            infos.push({ uri: fileUri, mtime: info.modificationTime * 1000 });
          }
        } catch (fileInfoError) {
          console.warn(
            `Could not get info for cache file: ${name}`,
            fileInfoError
          );
        }
      })
    );

    const cutoff = Date.now() - CACHE_MAX_AGE_DAYS * 24 * 60 * 60 * 1000;

    // Delete old files
    const oldFiles = infos.filter((f) => f.mtime < cutoff);
    await Promise.all(
      oldFiles.map((f) => {
        // console.log(`Deleting old cache file: ${f.uri}`);
        return FileSystem.deleteAsync(f.uri, { idempotent: true });
      })
    );

    // Keep newest CACHE_MAX_FILES if exceeding limit
    if (infos.length > CACHE_MAX_FILES) {
      const sortedUris = infos
        .sort((a, b) => b.mtime - a.mtime)
        .map((f) => f.uri);
      const filesToDelete = sortedUris.slice(CACHE_MAX_FILES);
      await Promise.all(
        filesToDelete.map((uri) => {
          // console.log(`Deleting excess cache file: ${uri}`);
          return FileSystem.deleteAsync(uri, { idempotent: true });
        })
      );
    }
  } catch (error) {
    console.warn("Error during cache cleanup:", error);
  }
}

/**
 * Download a storage file (public or private path) or a direct public URL into cache,
 * returning the local file URI.
 * @param source - Either a path within the Supabase bucket (e.g., 'podcasts/audio.mp3') or a full public URL.
 * @param onProgress - Optional callback for download progress (0 to 1).
 * @returns Promise resolving to the local file URI.
 */
async function downloadToCache(
  source: string,
  onProgress?: (frac: number) => void
): Promise<string> {
  let downloadUrl: string;
  // Extract filename robustly from path or URL
  const filename =
    source.substring(source.lastIndexOf("/") + 1).split("?")[0] ||
    `download_${Date.now()}`;
  const localUri = getCacheDirectory() + filename;

  // 1. Check if file already exists in cache
  const info = await FileSystem.getInfoAsync(localUri);
  if (info.exists) {
    console.log(`File found in cache: ${localUri}`);
    // Optional: Update modification time if needed for cache cleanup logic
    // await FileSystem.moveAsync({ from: localUri, to: localUri });
    return localUri;
  }

  // 2. Determine the download URL (Public URL, Signed URL, or existing HTTP URL)
  if (/^https?:\/\//.test(source)) {
    // It's already a full URL
    console.log("Source is a direct URL:", source);
    downloadUrl = source;
  } else {
    // It's a path within the bucket. Assume it might be private first for max compatibility,
    // or check if it's public if you have that logic. Let's stick to signing for paths.
    console.log(`Generating signed URL for download: ${source}`);
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(source, 60 * 60); // 1 hour expiry for download link
    if (error) {
      console.error(`Error creating signed URL for ${source}:`, error);
      throw error;
    }
    downloadUrl = data.signedUrl;
    console.log(`Signed URL generated: ${downloadUrl}`);
  }

  // 3. Attempt download with retry for signed URL refresh
  let currentUrl = downloadUrl;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      console.log(`Attempting download from ${currentUrl} to ${localUri}`);
      const task = FileSystem.createDownloadResumable(
        currentUrl,
        localUri,
        {}, // Options object (e.g., headers if needed)
        ({ totalBytesWritten, totalBytesExpectedToWrite }) => {
          if (
            onProgress &&
            totalBytesExpectedToWrite > 0 &&
            totalBytesExpectedToWrite >= totalBytesWritten
          ) {
            onProgress(totalBytesWritten / totalBytesExpectedToWrite);
          }
        }
      );
      const result = await task.downloadAsync();
      if (!result || !result.uri) {
        throw new Error(`Download failed, result URI is missing.`);
      }
      console.log(
        `Download successful: ${result.uri}, Status: ${result.status}`
      );
      // Run cleanup asynchronously, don't wait for it
      cleanupCache().catch(console.warn);
      return result.uri;
    } catch (err: any) {
      console.error(`Download attempt ${attempt + 1} failed:`, err);
      // Check if it's a potentially expired signed URL (e.g., 403 Forbidden) and if it's not a direct URL source
      const isSignedUrlAttempt = !/^https?:\/\//.test(source);
      // Expo FileSystem often wraps errors, check message or potentially status if available directly
      const isLikelyExpired =
        err.message?.includes("403") ||
        err.message?.includes("Forbidden") ||
        err?.status === 403;

      if (attempt === 0 && isSignedUrlAttempt && isLikelyExpired) {
        console.log("Signed URL might be expired, attempting refresh...");
        try {
          const { data, error: refreshError } = await supabase.storage
            .from(BUCKET_NAME)
            .createSignedUrl(source, 60 * 60); // Get a fresh URL
          if (refreshError) {
            console.error("Error refreshing signed URL:", refreshError);
            throw refreshError; // Throw refresh error if it fails
          }
          currentUrl = data.signedUrl;
          console.log("Retrying download with refreshed signed URL.");
          continue; // Go to the next attempt
        } catch (refreshError) {
          throw err; // If refresh fails, throw the original download error
        }
      }
      // If it's not an error type we handle with retry, or if it's the last attempt, throw.
      throw err;
    }
  }
  // Should not be reached if download or retry logic is correct, but satisfies TypeScript
  throw new Error("Download failed after multiple attempts.");
}

// --- THE HOOK ---

export function usePodcasts(language: string) {
  const qc = useQueryClient();

  // --- 1) Infinite paginated list ---
  const infiniteQuery = useInfiniteQuery<
    PodcastType[],
    Error,
    InfiniteData<PodcastType[]>,
    [_string: string, _string1: string],
    number
  >({
    // Add Key type and PageParam type
    queryKey: ["podcasts", language],
    queryFn: async ({ pageParam = 0 }) => {
      console.log(`Workspaceing podcasts page: ${pageParam / PAGE_SIZE}`);
      const { data, error, count } = await supabase
        .from("podcasts")
        .select("*", { count: "exact" }) // Request count for potential total calculation
        .eq("language_code", language)
        .order("id", { ascending: false }) // Or created_at, etc.
        .range(pageParam, pageParam + PAGE_SIZE - 1);

      if (error) {
        console.error("Error fetching podcasts:", error);
        throw error;
      }
      console.log(
        `Workspaceed ${data?.length} podcasts. Total count: ${count}`
      );
      return data || []; // Return empty array if data is null
    },
    getNextPageParam: (lastPage, allPages) => {
      // Calculate the total number of items fetched so far
      const fetchedItemsCount = allPages.reduce(
        (acc, page) => acc + page.length,
        0
      );
      // If the last page was full, there might be more data
      return lastPage.length === PAGE_SIZE ? fetchedItemsCount : undefined;
    },
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // --- 2) Real-time subscription updates ---
  useEffect(() => {
    const channel = supabase
      .channel(`podcasts_${language}`)
      .on<PodcastType>( // Use generic type for better type safety
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "podcasts",
          filter: `language_code=eq.${language}`,
        },
        (payload) => {
          console.log("Realtime INSERT:", payload.new);
          qc.setQueryData<InfiniteData<PodcastType[]>>( // Use InfiniteData type
            ["podcasts", language],
            (oldData) => {
              if (!oldData) return oldData;
              // Create a new pages array to avoid mutation
              const newPages = oldData.pages.map((p) => [...p]); // Shallow copy pages
              // Add the new item to the beginning of the first page
              if (newPages.length > 0) {
                newPages[0] = [payload.new, ...newPages[0]];
              } else {
                newPages.push([payload.new]); // Handle case where there were no pages
              }
              return {
                ...oldData,
                pages: newPages,
              };
            }
          );
        }
      )
      .on<PodcastType>(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "podcasts",
          filter: `language_code=eq.${language}`,
        },
        (payload) => {
          console.log("Realtime UPDATE:", payload.new);
          qc.setQueryData<InfiniteData<PodcastType[]>>(
            ["podcasts", language],
            (oldData) => {
              if (!oldData) return oldData;
              return {
                ...oldData,
                pages: oldData.pages.map((page) =>
                  page.map(
                    (p) => (p.id === payload.new.id ? payload.new : p) // Replace updated item
                  )
                ),
              };
            }
          );
        }
      )
      .on<PodcastType>(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "podcasts",
          // Supabase types expect 'old' in the payload for DELETE
          filter: `language_code=eq.${language}`,
        },
        (payload) => {
          // Note: Payload for DELETE contains `old`, not `new`
          const deletedItemId = (payload.old as PodcastType)?.id;
          if (!deletedItemId) return; // Should have id in 'old' record
          console.log("Realtime DELETE:", deletedItemId);

          qc.setQueryData<InfiniteData<PodcastType[]>>(
            ["podcasts", language],
            (oldData) => {
              if (!oldData) return oldData;
              return {
                ...oldData,
                pages: oldData.pages.map(
                  (page) => page.filter((p) => p.id !== deletedItemId) // Filter out deleted item
                ),
              };
            }
          );
        }
      )
      .subscribe((status, err) => {
        if (status === "SUBSCRIBED") {
          console.log(`Realtime channel subscribed for language: ${language}`);
        }
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          console.error(
            `Realtime channel error for language ${language}:`,
            status,
            err
          );
        }
      });

    // Cleanup function
    return () => {
      console.log(`Removing realtime channel for language: ${language}`);
      supabase
        .removeChannel(channel)
        .catch((error) => console.error("Error removing channel:", error));
    };
  }, [language, qc]); // Dependency array includes language and queryClient

  // --- 3) Get Public URL for Streaming ---
  // Assumes files intended for streaming are publicly accessible in the bucket.
  const getPublicStreamUrl = useCallback((soundPath: string): string => {
    console.log(`Generating public stream URL for: ${soundPath}`);
    if (!soundPath) {
      console.warn("getPublicStreamUrl called with empty soundPath.");
      return "";
    }
    try {
      const { data } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(soundPath);

      if (!data?.publicUrl) {
        console.error(
          `Could not get public URL for path: ${soundPath}. Check if the file exists and the bucket/path is public.`
        );
        return "";
      }
      console.log(`Public URL generated: ${data.publicUrl}`);
      return data.publicUrl;
    } catch (error) {
      console.error(`Error generating public URL for ${soundPath}:`, error);
      return "";
    }
  }, []); // No dependencies needed as supabase client & BUCKET_NAME are stable/constant

  // --- 4) Download-to-cache mutation ---
  const downloadMutation = useMutation<
    string, // Returns local URI string
    Error, // Error type
    { soundPath: string; onProgress?: (frac: number) => void } // Input variables
  >({
    mutationFn: async ({ soundPath, onProgress }) => {
      if (!soundPath)
        throw new Error("Download mutation requires a soundPath.");
      // Use the downloadToCache helper function
      return downloadToCache(soundPath, onProgress);
    },
    onMutate: ({ soundPath }) => {
      // Optional: Set initial cache state (e.g., pending download)
      qc.setQueryData(["download", soundPath], {
        status: "loading",
        progress: 0,
      });
    },
    onError: (error, variables) => {
      console.error(`Error downloading ${variables.soundPath}:`, error);
      // Update cache state to reflect error
      qc.setQueryData(["download", variables.soundPath], {
        status: "error",
        error: error.message,
      });
    },
    onSuccess: (localUri, variables) => {
      console.log(
        `Successfully downloaded ${variables.soundPath} to ${localUri}`
      );
      // Update cache state with final URI
      qc.setQueryData(["download", variables.soundPath], {
        status: "done",
        uri: localUri,
      });
      // Optional: You could potentially invalidate or update podcast list data if needed
    },
    // Removed retry from mutation itself, as downloadToCache handles retry internally
    // retry: 1,
  });

  // --- RETURN VALUE ---
  return {
    // Spread all properties from the infiniteQuery result
    ...infiniteQuery,

    /**
     * Gets the public streaming URL for an episode by its path in the bucket.
     * Assumes the file is publicly accessible. Use this URL with expo-av.
     * @param soundPath - The path within the bucket (e.g., 'podcasts/audio.mp3').
     * @returns The public URL string, or empty string on error.
     */
    stream: getPublicStreamUrl,

    /**
     * Initiates a download of an episode to the local cache.
     * Use the `useMutation` properties (`mutate`, `mutateAsync`, `status`, `error`, `data`)
     * to control and track the download.
     * The actual local URI will be in `downloadMutation.data` upon success.
     * Progress can be monitored via the `onProgress` callback.
     * QueryClient data for `["download", soundPath]` can also be used to track status/URI.
     */
    download: downloadMutation,
  };
}
