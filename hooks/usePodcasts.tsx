// import {
//   useInfiniteQuery,
//   useMutation,
//   useQueryClient,
//   InfiniteData,
//   QueryKey,
// } from "@tanstack/react-query";
// import * as FileSystem from "expo-file-system";
// import { useEffect, useCallback, useRef } from "react";
// import { supabase } from "@/utils/supabase"; // Your initialized Supabase client (only for fetching metadata)
// import { PodcastType } from "@/constants/Types"; // Make sure this matches the `episodes` schema
// import { Platform } from "react-native";

// // --- CONFIGURATION ---
// const PAGE_SIZE = 3;
// const CACHE_MAX_AGE_DAYS = 7;
// const CACHE_MAX_FILES = 20;

// // --- HELPER FUNCTIONS ---

// // Prevent concurrent cleanups
// let isCleaningCache = false;

// /**
//  * Returns a valid cache directory on both iOS/Android (Expo).
//  * Falls back to documentDirectory if cacheDirectory is not available.
//  */
// function getCacheDirectory(): string {
//   const cacheDir = FileSystem.cacheDirectory;
//   if (!cacheDir) {
//     console.error(
//       "Cache directory is not available; using documentDirectory instead."
//     );
//     return (FileSystem.documentDirectory ?? "") + "audioCache/";
//   }
//   return cacheDir.endsWith("/") ? cacheDir : cacheDir + "/";
// }

// /**
//  * Deletes old or over-limit files in the cache directory.
//  * - Any file older than CACHE_MAX_AGE_DAYS is removed.
//  * - If more than CACHE_MAX_FILES remain, the oldest beyond that limit are removed.
//  */
// export async function cleanupCache(): Promise<void> {
//   if (isCleaningCache) {
//     console.log("Cache cleanup already in progress; skipping.");
//     return;
//   }
//   isCleaningCache = true;
//   console.log("Starting cache cleanup...");

//   try {
//     const dirUri = getCacheDirectory();
//     const dirInfo = await FileSystem.getInfoAsync(dirUri);
//     if (!dirInfo.exists || !dirInfo.isDirectory) {
//       console.log(
//         "Cache directory does not exist or is not a directory; skipping cleanup."
//       );
//       isCleaningCache = false;
//       return;
//     }

//     const allNames = await FileSystem.readDirectoryAsync(dirUri);
//     const audioExtensions = [".mp3"]; // Only clean files ending in .mp3
//     const audioFileNames = allNames.filter((name) =>
//       audioExtensions.some((ext) => name.toLowerCase().endsWith(ext))
//     );

//     const infos: { uri: string; mtime: number }[] = [];
//     await Promise.all(
//       audioFileNames.map(async (name) => {
//         const fileUri = dirUri + name;
//         try {
//           const info = await FileSystem.getInfoAsync(fileUri, { size: true });
//           // `modificationTime` is in seconds; multiply by 1_000 for ms.
//           if (info.exists && !info.isDirectory && info.modificationTime) {
//             infos.push({ uri: fileUri, mtime: info.modificationTime * 1000 });
//           }
//         } catch {
//           // If the file vanished between readDirectoryAsync and getInfoAsync, ignore.
//         }
//       })
//     );

//     const cutoff = Date.now() - CACHE_MAX_AGE_DAYS * 24 * 60 * 60 * 1000;

//     // 1) Delete files older than cutoff
//     const oldFiles = infos.filter((f) => f.mtime < cutoff);
//     if (oldFiles.length > 0) {
//       console.log(`Deleting ${oldFiles.length} old cache files...`);
//       await Promise.all(
//         oldFiles.map((f) => FileSystem.deleteAsync(f.uri, { idempotent: true }))
//       );
//     }

//     // 2) Enforce maximum file count
//     const stillValid = infos.filter((f) => f.mtime >= cutoff);
//     const excessCount = stillValid.length - CACHE_MAX_FILES;
//     if (excessCount > 0) {
//       // Sort by newest first, then remove the oldest beyond the top CACHE_MAX_FILES
//       const sortedByNewest = stillValid.sort((a, b) => b.mtime - a.mtime);
//       const toDelete = sortedByNewest.slice(CACHE_MAX_FILES);
//       console.log(
//         `Deleting ${toDelete.length} excess cache files (over limit)...`
//       );
//       await Promise.all(
//         toDelete.map((f) => FileSystem.deleteAsync(f.uri, { idempotent: true }))
//       );
//     }

//     console.log("Cache cleanup finished.");
//   } catch (err) {
//     console.warn("Error during cache cleanup:", err);
//   } finally {
//     isCleaningCache = false;
//   }
// }

// /**
//  * Downloads an MP3 from your Cloudflare Pages CDN into the local cache folder.
//  * - `filename` should be something like "episode-123.mp3" (no leading slash).
//  * - Internally, it builds the URL: https://podcast-files.pages.dev/<filename>
//  * - If the file already exists locally, returns the local path immediately.
//  * - Otherwise, it runs a resumable download and writes to cache.
//  */
// async function downloadToCache(
//   filename: string,
//   onProgress?: (fraction: number) => void
// ): Promise<string> {
//   if (!filename) {
//     throw new Error("downloadToCache requires a non-empty filename.");
//   }

//   // Build the public URL pointing to Cloudflare Pages
//   const downloadUrl = `https://podcast-files.pages.dev/${filename}`;

//   // Local path where we store the file
//   const localUri = getCacheDirectory() + filename;

//   // If it already exists, return it immediately
//   const info = await FileSystem.getInfoAsync(localUri).catch(() => null);
//   if (info?.exists) {
//     console.log(`File already cached: ${localUri}`);
//     return localUri;
//   }

//   // Otherwise, start a resumable download
//   let lastError: any = null;
//   for (let attempt = 0; attempt < 2; attempt++) {
//     try {
//       const task = FileSystem.createDownloadResumable(
//         downloadUrl,
//         localUri,
//         {},
//         ({ totalBytesWritten, totalBytesExpectedToWrite }) => {
//           if (
//             onProgress &&
//             totalBytesExpectedToWrite > 0 &&
//             totalBytesExpectedToWrite >= totalBytesWritten
//           ) {
//             onProgress(totalBytesWritten / totalBytesExpectedToWrite);
//           }
//         }
//       );
//       const result = await task.downloadAsync();
//       if (!result?.uri) {
//         throw new Error("Download failed, no result URI returned.");
//       }
//       console.log(`Downloaded ${filename} → ${result.uri}`);
//       // Trigger cache cleanup (fire & forget)
//       cleanupCache().catch(console.warn);
//       return result.uri;
//     } catch (err: any) {
//       lastError = err;
//       console.error(
//         `Download attempt ${attempt + 1} for ${filename} failed:`,
//         err
//       );

//       // On the first attempt, we might retry once (in case of a transient network error).
//       if (attempt === 0) {
//         console.log("Retrying download once more...");
//         continue;
//       } else {
//         break;
//       }
//     }
//   }

//   throw new Error(
//     `Failed to download "${filename}" after multiple attempts: ${
//       lastError?.message || lastError
//     }`
//   );
// }

// export function usePodcasts() {
//   const qc = useQueryClient();
//   const didInitialCleanup = useRef(false);

//   // --- 1) Infinite paginated list from `episodes` table ---
//   // “PodcastType” should match your Supabase `episodes` row shape:
//   // { id, title, filename, description, published_at, created_at, … }
//   const queryKey: QueryKey = ["episodes"];

//   const infiniteQuery = useInfiniteQuery<
//     PodcastType[], // data page type
//     Error,
//     InfiniteData<PodcastType[]>,
//     QueryKey,
//     number
//   >({
//     queryKey,
//     queryFn: async ({ pageParam = 0 }) => {
//       // Fetch a page of size PAGE_SIZE, ordered by published_at DESC
//       const { data, error, count } = await supabase
//         .from("episodes")
//         .select("*", { count: "exact" })
//         .order("published_at", { ascending: false })
//         .range(pageParam, pageParam + PAGE_SIZE - 1);

//       if (error) {
//         console.error("Error fetching episodes:", error);
//         throw error;
//       }
//       return data || [];
//     },
//     getNextPageParam: (lastPage, allPages) => {
//       const fetchedSoFar = allPages.reduce((acc, page) => acc + page.length, 0);
//       // If we got a full PAGE_SIZE, there might be more
//       return lastPage.length === PAGE_SIZE ? fetchedSoFar : undefined;
//     },
//     initialPageParam: 0,
//     staleTime: 5 * 60 * 1000, // 5 minutes
//     // you can also set cacheTime if desired, e.g. cacheTime: 24h
//   });

//   // --- 2) Ensure we run one cleanup on mount (optional) ---
//   useEffect(() => {
//     if (!didInitialCleanup.current) {
//       cleanupCache().catch(console.warn);
//       didInitialCleanup.current = true;
//     }
//   }, []);

//   // --- 3) Public stream URL generator ---
//   // Given a “filename” (e.g. "episode-123.mp3"), we return:
//   //    https://podcast-files.pages.dev/episode-123.mp3
//   const getPublicStreamUrl = useCallback((filename: string): string => {
//     if (!filename) {
//       console.warn("getPublicStreamUrl called with empty filename.");
//       return "";
//     }
//     // If they accidentally passed a full URL (incl. “http://…”), return it directly
//     if (/^https?:\/\//.test(filename)) {
//       return filename;
//     }
//     return `https://podcast-files.pages.dev/${filename}`;
//   }, []);

//   // --- 4) Download‐to‐cache mutation ---
//   const downloadMutation = useMutation<
//     string, // on success, we return localUri (string)
//     Error,
//     { filename: string; onProgress?: (frac: number) => void }
//   >({
//     mutationFn: ({ filename, onProgress }) => {
//       if (!filename) throw new Error("download requires a filename");
//       return downloadToCache(filename, onProgress);
//     },
//     onMutate: ({ filename }) => {
//       qc.setQueryData(["download", filename], {
//         status: "loading",
//         progress: 0,
//       });
//     },
//     onError: (error, variables) => {
//       console.error(`Error downloading ${variables.filename}:`, error);
//       qc.setQueryData(["download", variables.filename], {
//         status: "error",
//         error: error.message,
//       });
//     },
//     onSuccess: (localUri, variables) => {
//       qc.setQueryData(["download", variables.filename], {
//         status: "done",
//         uri: localUri,
//       });
//     },
//   });

//   // --- 5) Check if a file is already cached locally ---
//   const getCachedUri = useCallback(
//     async (filename: string): Promise<string | null> => {
//       if (!filename) return null;
//       // We store under <cacheDir>/<filename>
//       const localUri = getCacheDirectory() + filename;
//       const info = await FileSystem.getInfoAsync(localUri);
//       return info.exists ? localUri : null;
//     },
//     []
//   );

//   // --- RETURN EVERYTHING THE CONSUMER NEEDS ---
//   return {
//     ...infiniteQuery, // pages of episodes
//     stream: getPublicStreamUrl, // fn to get a streaming URL
//     download: downloadMutation, // mutation to download into cache
//     getCachedUri, // helper to see if it’s already downloaded
//   };
// }


import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  InfiniteData,
  QueryKey,
} from "@tanstack/react-query";
import * as FileSystem from "expo-file-system";
import { useEffect, useCallback, useRef } from "react";
import { supabase } from "@/utils/supabase"; // Your initialized Supabase client (only for fetching metadata)
import { PodcastType } from "@/constants/Types"; // Make sure this matches the `episodes` schema
import { Platform } from "react-native";

// --- CONFIGURATION ---
const PAGE_SIZE = 3;
const CACHE_MAX_AGE_DAYS = 7;
const CACHE_MAX_FILES = 20;

// --- HELPER FUNCTIONS ---

// Prevent concurrent cleanups
let isCleaningCache = false;

/**
 * Returns a valid cache directory on both iOS/Android (Expo).
 * Falls back to documentDirectory if cacheDirectory is not available.
 */
function getCacheDirectory(): string {
  const cacheDir = FileSystem.cacheDirectory;
  if (!cacheDir) {
    console.error(
      "Cache directory is not available; using documentDirectory instead."
    );
    return (FileSystem.documentDirectory ?? "") + "audioCache/";
  }
  return cacheDir.endsWith("/") ? cacheDir : cacheDir + "/";
}

/**
 * Deletes old or over-limit files in the cache directory.
 * - Any file older than CACHE_MAX_AGE_DAYS is removed.
 * - If more than CACHE_MAX_FILES remain, the oldest beyond that limit are removed.
 */
export async function cleanupCache(): Promise<void> {
  if (isCleaningCache) {
    console.log("Cache cleanup already in progress; skipping.");
    return;
  }
  isCleaningCache = true;
  console.log("Starting cache cleanup...");

  try {
    const dirUri = getCacheDirectory();
    const dirInfo = await FileSystem.getInfoAsync(dirUri);
    if (!dirInfo.exists || !dirInfo.isDirectory) {
      console.log(
        "Cache directory does not exist or is not a directory; skipping cleanup."
      );
      isCleaningCache = false;
      return;
    }

    const allNames = await FileSystem.readDirectoryAsync(dirUri);
    const audioExtensions = [".mp3"]; // Only clean files ending in .mp3
    const audioFileNames = allNames.filter((name) =>
      audioExtensions.some((ext) => name.toLowerCase().endsWith(ext))
    );

    const infos: { uri: string; mtime: number }[] = [];
    await Promise.all(
      audioFileNames.map(async (name) => {
        const fileUri = dirUri + name;
        try {
          const info = await FileSystem.getInfoAsync(fileUri, { size: true });
          // `modificationTime` is in seconds; multiply by 1_000 for ms.
          if (info.exists && !info.isDirectory && info.modificationTime) {
            infos.push({ uri: fileUri, mtime: info.modificationTime * 1000 });
          }
        } catch {
          // If the file vanished between readDirectoryAsync and getInfoAsync, ignore.
        }
      })
    );

    const cutoff = Date.now() - CACHE_MAX_AGE_DAYS * 24 * 60 * 60 * 1000;

    // 1) Delete files older than cutoff
    const oldFiles = infos.filter((f) => f.mtime < cutoff);
    if (oldFiles.length > 0) {
      console.log(`Deleting ${oldFiles.length} old cache files...`);
      await Promise.all(
        oldFiles.map((f) => FileSystem.deleteAsync(f.uri, { idempotent: true }))
      );
    }

    // 2) Enforce maximum file count
    const stillValid = infos.filter((f) => f.mtime >= cutoff);
    const excessCount = stillValid.length - CACHE_MAX_FILES;
    if (excessCount > 0) {
      // Sort by newest first, then remove the oldest beyond the top CACHE_MAX_FILES
      const sortedByNewest = stillValid.sort((a, b) => b.mtime - a.mtime);
      const toDelete = sortedByNewest.slice(CACHE_MAX_FILES);
      console.log(
        `Deleting ${toDelete.length} excess cache files (over limit)...`
      );
      await Promise.all(
        toDelete.map((f) => FileSystem.deleteAsync(f.uri, { idempotent: true }))
      );
    }

    console.log("Cache cleanup finished.");
  } catch (err) {
    console.warn("Error during cache cleanup:", err);
  } finally {
    isCleaningCache = false;
  }
}

/**
 * Downloads an MP3 from your Cloudflare Pages CDN into the local cache folder.
 * - `filename` should be something like "episode-123.mp3" (no leading slash).
 * - Internally, it builds the URL: https://podcast-files.pages.dev/<filename>
 * - If the file already exists locally, returns the local path immediately.
 * - Otherwise, it runs a resumable download and writes to cache.
 */
async function downloadToCache(
  filename: string,
  onProgress?: (fraction: number) => void
): Promise<string> {
  if (!filename) {
    throw new Error("downloadToCache requires a non-empty filename.");
  }

  // Build the public URL pointing to Cloudflare Pages
  const downloadUrl = `https://podcast-files.pages.dev/${filename}`;

  // Local path where we store the file
  const localUri = getCacheDirectory() + filename;

  // If it already exists, return it immediately
  const info = await FileSystem.getInfoAsync(localUri).catch(() => null);
  if (info?.exists) {
    console.log(`File already cached: ${localUri}`);
    return localUri;
  }

  // Otherwise, start a resumable download
  let lastError: any = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const task = FileSystem.createDownloadResumable(
        downloadUrl,
        localUri,
        {},
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
      if (!result?.uri) {
        throw new Error("Download failed, no result URI returned.");
      }
      console.log(`Downloaded ${filename} → ${result.uri}`);
      // Trigger cache cleanup (fire & forget)
      cleanupCache().catch(console.warn);
      return result.uri;
    } catch (err: any) {
      lastError = err;
      console.error(
        `Download attempt ${attempt + 1} for ${filename} failed:`,
        err
      );

      // On the first attempt, retry once
      if (attempt === 0) {
        console.log("Retrying download once more...");
        continue;
      } else {
        break;
      }
    }
  }

  throw new Error(
    `Failed to download "${filename}" after multiple attempts: ${
      lastError?.message || lastError
    }`
  );
}

export function usePodcasts() {
  const qc = useQueryClient();
  const didInitialCleanup = useRef(false);

  // --- 1) Infinite paginated list from `episodes` table ---
  // “PodcastType” should match your Supabase `episodes` row shape:
  // { id, title, filename, description, published_at, created_at, … }
  const queryKey: QueryKey = ["episodes"];

  const infiniteQuery = useInfiniteQuery<
    PodcastType[], // data page type
    Error,
    InfiniteData<PodcastType[]>,
    QueryKey,
    number
  >({
    queryKey,
    queryFn: async ({ pageParam = 0 }) => {
      // Fetch a page of size PAGE_SIZE, ordered by published_at DESC
      const { data, error, count } = await supabase
        .from("episodes")
        .select("*", { count: "exact" })
        .order("published_at", { ascending: false })
        .range(pageParam, pageParam + PAGE_SIZE - 1);

      if (error) {
        console.error("Error fetching episodes:", error);
        throw error;
      }
      return data || [];
    },
    getNextPageParam: (lastPage, allPages) => {
      const fetchedSoFar = allPages.reduce((acc, page) => acc + page.length, 0);
      // If we got a full PAGE_SIZE, there might be more
      return lastPage.length === PAGE_SIZE ? fetchedSoFar : undefined;
    },
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    // you can also set cacheTime if desired, e.g. cacheTime: 24h
  });

  // --- 2) Run one cleanup on mount (optional) ---
  useEffect(() => {
    if (!didInitialCleanup.current) {
      cleanupCache().catch(console.warn);
      didInitialCleanup.current = true;
    }
  }, []);

  // --- 3) Download‐to‐cache mutation (no streaming) ---
  const downloadMutation = useMutation<
    string, // on success, we return localUri (string)
    Error,
    { filename: string; onProgress?: (frac: number) => void }
  >({
    mutationFn: ({ filename, onProgress }) => {
      if (!filename) throw new Error("download requires a filename");
      return downloadToCache(filename, onProgress);
    },
    onMutate: ({ filename }) => {
      qc.setQueryData(["download", filename], {
        status: "loading",
        progress: 0,
      });
    },
    onError: (error, variables) => {
      console.error(`Error downloading ${variables.filename}:`, error);
      qc.setQueryData(["download", variables.filename], {
        status: "error",
        error: error.message,
      });
    },
    onSuccess: (localUri, variables) => {
      qc.setQueryData(["download", variables.filename], {
        status: "done",
        uri: localUri,
      });
    },
  });

  // --- 4) Check if a file is already cached locally ---
  const getCachedUri = useCallback(
    async (filename: string): Promise<string | null> => {
      if (!filename) return null;
      // We store under <cacheDir>/<filename>
      const localUri = getCacheDirectory() + filename;
      const info = await FileSystem.getInfoAsync(localUri);
      return info.exists ? localUri : null;
    },
    []
  );

  // --- RETURN EVERYTHING THE CONSUMER NEEDS (no streaming) ---
  return {
    ...infiniteQuery, // pages of episodes
    download: downloadMutation, // mutation to download into cache
    getCachedUri, // helper to see if it’s already downloaded
  };
}
