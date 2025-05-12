//! Fine
// import {
//   useInfiniteQuery,
//   useMutation,
//   useQueryClient,
//   InfiniteData, // Import type for better queryClient updates
// } from "@tanstack/react-query";
// import { supabase } from "@/utils/supabase"; // Ensure this points to your initialized Supabase client
// import * as FileSystem from "expo-file-system";
// import { useEffect, useCallback } from "react";
// import { PodcastType } from "@/constants/Types"; // Ensure this type matches your podcast structure
// import { Platform } from "react-native"; // Used for cache directory

// // --- CONFIGURATION ---
// const PAGE_SIZE = 3;
// const CACHE_MAX_AGE_DAYS = 7;
// const CACHE_MAX_FILES = 20;
// const BUCKET_NAME = "sounds"; // Define your bucket name here

// // --- HELPER FUNCTIONS ---

// /**
//  * Provides the correct cache directory path based on platform.
//  */
// function getCacheDirectory(): string {
//   // Ensure cacheDirectory is not null - add trailing slash if needed
//   const cacheDir = FileSystem.cacheDirectory;
//   if (!cacheDir) {
//     // Fallback or error handling if cache directory isn't available
//     console.error("Cache directory is not available.");
//     // Return a default path or throw an error depending on requirements
//     // Using documentDirectory as a fallback, might not be ideal for cache.
//     return FileSystem.documentDirectory + "audioCache/";
//   }
//   // Ensure it ends with a slash
//   return cacheDir.endsWith("/") ? cacheDir : cacheDir + "/";
// }

// /**
//  * Remove cached files older than CACHE_MAX_AGE_DAYS or exceeding CACHE_MAX_FILES.
//  */
// async function cleanupCache(): Promise<void> {
//   try {
//     const dirUri = getCacheDirectory();
//     // Ensure the directory exists before trying to read it
//     const dirInfo = await FileSystem.getInfoAsync(dirUri);
//     if (!dirInfo.exists) {
//       console.log("Cache directory does not exist, skipping cleanup.");
//       return;
//     }

//     const names = await FileSystem.readDirectoryAsync(dirUri);
//     const infos: { uri: string; mtime: number }[] = [];

//     await Promise.all(
//       names.map(async (name) => {
//         const fileUri = dirUri + name;
//         try {
//           const info = await FileSystem.getInfoAsync(fileUri, { size: true });
//           // Ensure it's a file and has modification time
//           if (info.exists && !info.isDirectory && info.modificationTime) {
//             infos.push({ uri: fileUri, mtime: info.modificationTime * 1000 });
//           }
//         } catch (fileInfoError) {
//           console.warn(
//             `Could not get info for cache file: ${name}`,
//             fileInfoError
//           );
//         }
//       })
//     );

//     const cutoff = Date.now() - CACHE_MAX_AGE_DAYS * 24 * 60 * 60 * 1000;

//     // Delete old files
//     const oldFiles = infos.filter((f) => f.mtime < cutoff);
//     await Promise.all(
//       oldFiles.map((f) => {
//         // console.log(`Deleting old cache file: ${f.uri}`);
//         return FileSystem.deleteAsync(f.uri, { idempotent: true });
//       })
//     );

//     // Keep newest CACHE_MAX_FILES if exceeding limit
//     if (infos.length > CACHE_MAX_FILES) {
//       const sortedUris = infos
//         .sort((a, b) => b.mtime - a.mtime)
//         .map((f) => f.uri);
//       const filesToDelete = sortedUris.slice(CACHE_MAX_FILES);
//       await Promise.all(
//         filesToDelete.map((uri) => {
//           // console.log(`Deleting excess cache file: ${uri}`);
//           return FileSystem.deleteAsync(uri, { idempotent: true });
//         })
//       );
//     }
//   } catch (error) {
//     console.warn("Error during cache cleanup:", error);
//   }
// }

// /**
//  * Download a storage file (public or private path) or a direct public URL into cache,
//  * returning the local file URI.
//  * @param source - Either a path within the Supabase bucket (e.g., 'podcasts/audio.mp3') or a full public URL.
//  * @param onProgress - Optional callback for download progress (0 to 1).
//  * @returns Promise resolving to the local file URI.
//  */
// async function downloadToCache(
//   source: string,
//   onProgress?: (frac: number) => void
// ): Promise<string> {
//   let downloadUrl: string;
//   // Extract filename robustly from path or URL
//   const filename =
//     source.substring(source.lastIndexOf("/") + 1).split("?")[0] ||
//     `download_${Date.now()}`;
//   const localUri = getCacheDirectory() + filename;

//   // 1. Check if file already exists in cache
//   const info = await FileSystem.getInfoAsync(localUri);
//   if (info.exists) {
//     console.log(`File found in cache: ${localUri}`);
//     // Optional: Update modification time if needed for cache cleanup logic
//     // await FileSystem.moveAsync({ from: localUri, to: localUri });
//     return localUri;
//   }

//   // 2. Determine the download URL (Public URL, Signed URL, or existing HTTP URL)
//   if (/^https?:\/\//.test(source)) {
//     // It's already a full URL
//     console.log("Source is a direct URL:", source);
//     downloadUrl = source;
//   } else {
//     // It's a path within the bucket. Assume it might be private first for max compatibility,
//     // or check if it's public if you have that logic. Let's stick to signing for paths.
//     console.log(`Generating signed URL for download: ${source}`);
//     const { data, error } = await supabase.storage
//       .from(BUCKET_NAME)
//       .createSignedUrl(source, 60 * 60); // 1 hour expiry for download link
//     if (error) {
//       console.error(`Error creating signed URL for ${source}:`, error);
//       throw error;
//     }
//     downloadUrl = data.signedUrl;
//     console.log(`Signed URL generated: ${downloadUrl}`);
//   }

//   // 3. Attempt download with retry for signed URL refresh
//   let currentUrl = downloadUrl;
//   for (let attempt = 0; attempt < 2; attempt++) {
//     try {
//       console.log(`Attempting download from ${currentUrl} to ${localUri}`);
//       const task = FileSystem.createDownloadResumable(
//         currentUrl,
//         localUri,
//         {}, // Options object (e.g., headers if needed)
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
//       if (!result || !result.uri) {
//         throw new Error(`Download failed, result URI is missing.`);
//       }
//       console.log(
//         `Download successful: ${result.uri}, Status: ${result.status}`
//       );
//       // Run cleanup asynchronously, don't wait for it
//       cleanupCache().catch(console.warn);
//       return result.uri;
//     } catch (err: any) {
//       console.error(`Download attempt ${attempt + 1} failed:`, err);
//       // Check if it's a potentially expired signed URL (e.g., 403 Forbidden) and if it's not a direct URL source
//       const isSignedUrlAttempt = !/^https?:\/\//.test(source);
//       // Expo FileSystem often wraps errors, check message or potentially status if available directly
//       const isLikelyExpired =
//         err.message?.includes("403") ||
//         err.message?.includes("Forbidden") ||
//         err?.status === 403;

//       if (attempt === 0 && isSignedUrlAttempt && isLikelyExpired) {
//         console.log("Signed URL might be expired, attempting refresh...");
//         try {
//           const { data, error: refreshError } = await supabase.storage
//             .from(BUCKET_NAME)
//             .createSignedUrl(source, 60 * 60); // Get a fresh URL
//           if (refreshError) {
//             console.error("Error refreshing signed URL:", refreshError);
//             throw refreshError; // Throw refresh error if it fails
//           }
//           currentUrl = data.signedUrl;
//           console.log("Retrying download with refreshed signed URL.");
//           continue; // Go to the next attempt
//         } catch (refreshError) {
//           throw err; // If refresh fails, throw the original download error
//         }
//       }
//       // If it's not an error type we handle with retry, or if it's the last attempt, throw.
//       throw err;
//     }
//   }
//   // Should not be reached if download or retry logic is correct, but satisfies TypeScript
//   throw new Error("Download failed after multiple attempts.");
// }

// // --- THE HOOK ---

// export function usePodcasts(language: string) {
//   const qc = useQueryClient();

//   // --- 1) Infinite paginated list ---
//   const infiniteQuery = useInfiniteQuery<
//     PodcastType[],
//     Error,
//     InfiniteData<PodcastType[]>,
//     [_string: string, _string1: string],
//     number
//   >({
//     // Add Key type and PageParam type
//     queryKey: ["podcasts", language],
//     queryFn: async ({ pageParam = 0 }) => {
//       console.log(`Workspaceing podcasts page: ${pageParam / PAGE_SIZE}`);
//       const { data, error, count } = await supabase
//         .from("podcasts")
//         .select("*", { count: "exact" }) // Request count for potential total calculation
//         .eq("language_code", language)
//         .order("id", { ascending: false }) // Or created_at, etc.
//         .range(pageParam, pageParam + PAGE_SIZE - 1);

//       if (error) {
//         console.error("Error fetching podcasts:", error);
//         throw error;
//       }
//       console.log(
//         `Workspaceed ${data?.length} podcasts. Total count: ${count}`
//       );
//       return data || []; // Return empty array if data is null
//     },
//     getNextPageParam: (lastPage, allPages) => {
//       // Calculate the total number of items fetched so far
//       const fetchedItemsCount = allPages.reduce(
//         (acc, page) => acc + page.length,
//         0
//       );
//       // If the last page was full, there might be more data
//       return lastPage.length === PAGE_SIZE ? fetchedItemsCount : undefined;
//     },
//     initialPageParam: 0,
//     staleTime: 5 * 60 * 1000, // 5 minutes
//   });

//   // --- 2) Real-time subscription updates ---
//   useEffect(() => {
//     const channel = supabase
//       .channel(`podcasts_${language}`)
//       .on<PodcastType>( // Use generic type for better type safety
//         "postgres_changes",
//         {
//           event: "INSERT",
//           schema: "public",
//           table: "podcasts",
//           filter: `language_code=eq.${language}`,
//         },
//         (payload) => {
//           console.log("Realtime INSERT:", payload.new);
//           qc.setQueryData<InfiniteData<PodcastType[]>>( // Use InfiniteData type
//             ["podcasts", language],
//             (oldData) => {
//               if (!oldData) return oldData;
//               // Create a new pages array to avoid mutation
//               const newPages = oldData.pages.map((p) => [...p]); // Shallow copy pages
//               // Add the new item to the beginning of the first page
//               if (newPages.length > 0) {
//                 newPages[0] = [payload.new, ...newPages[0]];
//               } else {
//                 newPages.push([payload.new]); // Handle case where there were no pages
//               }
//               return {
//                 ...oldData,
//                 pages: newPages,
//               };
//             }
//           );
//         }
//       )
//       .on<PodcastType>(
//         "postgres_changes",
//         {
//           event: "UPDATE",
//           schema: "public",
//           table: "podcasts",
//           filter: `language_code=eq.${language}`,
//         },
//         (payload) => {
//           console.log("Realtime UPDATE:", payload.new);
//           qc.setQueryData<InfiniteData<PodcastType[]>>(
//             ["podcasts", language],
//             (oldData) => {
//               if (!oldData) return oldData;
//               return {
//                 ...oldData,
//                 pages: oldData.pages.map((page) =>
//                   page.map(
//                     (p) => (p.id === payload.new.id ? payload.new : p) // Replace updated item
//                   )
//                 ),
//               };
//             }
//           );
//         }
//       )
//       .on<PodcastType>(
//         "postgres_changes",
//         {
//           event: "DELETE",
//           schema: "public",
//           table: "podcasts",
//           // Supabase types expect 'old' in the payload for DELETE
//           filter: `language_code=eq.${language}`,
//         },
//         (payload) => {
//           // Note: Payload for DELETE contains `old`, not `new`
//           const deletedItemId = (payload.old as PodcastType)?.id;
//           if (!deletedItemId) return; // Should have id in 'old' record
//           console.log("Realtime DELETE:", deletedItemId);

//           qc.setQueryData<InfiniteData<PodcastType[]>>(
//             ["podcasts", language],
//             (oldData) => {
//               if (!oldData) return oldData;
//               return {
//                 ...oldData,
//                 pages: oldData.pages.map(
//                   (page) => page.filter((p) => p.id !== deletedItemId) // Filter out deleted item
//                 ),
//               };
//             }
//           );
//         }
//       )
//       .subscribe((status, err) => {
//         if (status === "SUBSCRIBED") {
//           console.log(`Realtime channel subscribed for language: ${language}`);
//         }
//         if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
//           console.error(
//             `Realtime channel error for language ${language}:`,
//             status,
//             err
//           );
//         }
//       });

//     // Cleanup function
//     return () => {
//       console.log(`Removing realtime channel for language: ${language}`);
//       supabase
//         .removeChannel(channel)
//         .catch((error) => console.error("Error removing channel:", error));
//     };
//   }, [language, qc]); // Dependency array includes language and queryClient

//   // --- 3) Get Public URL for Streaming ---
//   // Assumes files intended for streaming are publicly accessible in the bucket.
//   const getPublicStreamUrl = useCallback((soundPath: string): string => {
//     console.log(`Generating public stream URL for: ${soundPath}`);
//     if (!soundPath) {
//       console.warn("getPublicStreamUrl called with empty soundPath.");
//       return "";
//     }
//     try {
//       const { data } = supabase.storage
//         .from(BUCKET_NAME)
//         .getPublicUrl(soundPath);

//       if (!data?.publicUrl) {
//         console.error(
//           `Could not get public URL for path: ${soundPath}. Check if the file exists and the bucket/path is public.`
//         );
//         return "";
//       }
//       console.log(`Public URL generated: ${data.publicUrl}`);
//       return data.publicUrl;
//     } catch (error) {
//       console.error(`Error generating public URL for ${soundPath}:`, error);
//       return "";
//     }
//   }, []); // No dependencies needed as supabase client & BUCKET_NAME are stable/constant

//   // --- 4) Download-to-cache mutation ---
//   const downloadMutation = useMutation<
//     string, // Returns local URI string
//     Error, // Error type
//     { soundPath: string; onProgress?: (frac: number) => void } // Input variables
//   >({
//     mutationFn: async ({ soundPath, onProgress }) => {
//       if (!soundPath)
//         throw new Error("Download mutation requires a soundPath.");
//       // Use the downloadToCache helper function
//       return downloadToCache(soundPath, onProgress);
//     },
//     onMutate: ({ soundPath }) => {
//       // Optional: Set initial cache state (e.g., pending download)
//       qc.setQueryData(["download", soundPath], {
//         status: "loading",
//         progress: 0,
//       });
//     },
//     onError: (error, variables) => {
//       console.error(`Error downloading ${variables.soundPath}:`, error);
//       // Update cache state to reflect error
//       qc.setQueryData(["download", variables.soundPath], {
//         status: "error",
//         error: error.message,
//       });
//     },
//     onSuccess: (localUri, variables) => {
//       console.log(
//         `Successfully downloaded ${variables.soundPath} to ${localUri}`
//       );
//       // Update cache state with final URI
//       qc.setQueryData(["download", variables.soundPath], {
//         status: "done",
//         uri: localUri,
//       });
//       // Optional: You could potentially invalidate or update podcast list data if needed
//     },
//     // Removed retry from mutation itself, as downloadToCache handles retry internally
//     // retry: 1,
//   });

//   // --- RETURN VALUE ---
//   return {
//     // Spread all properties from the infiniteQuery result
//     ...infiniteQuery,

//     /**
//      * Gets the public streaming URL for an episode by its path in the bucket.
//      * Assumes the file is publicly accessible. Use this URL with expo-av.
//      * @param soundPath - The path within the bucket (e.g., 'podcasts/audio.mp3').
//      * @returns The public URL string, or empty string on error.
//      */
//     stream: getPublicStreamUrl,

//     /**
//      * Initiates a download of an episode to the local cache.
//      * Use the `useMutation` properties (`mutate`, `mutateAsync`, `status`, `error`, `data`)
//      * to control and track the download.
//      * The actual local URI will be in `downloadMutation.data` upon success.
//      * Progress can be monitored via the `onProgress` callback.
//      * QueryClient data for `["download", soundPath]` can also be used to track status/URI.
//      */
//     download: downloadMutation,
//   };
// }


//! With chatGPT considerations
// import {
//   useInfiniteQuery,
//   useMutation,
//   useQueryClient,
//   InfiniteData,
//   QueryKey, // Import QueryKey
// } from "@tanstack/react-query";
// import { supabase } from "@/utils/supabase"; // Ensure this points to your initialized Supabase client
// import * as FileSystem from "expo-file-system";
// import { useEffect, useCallback, useRef } from "react"; // Import useRef
// import { PodcastType } from "@/constants/Types"; // Ensure this type matches your podcast structure
// import { Platform } from "react-native"; // Used for cache directory

// // --- CONFIGURATION ---
// const PAGE_SIZE = 3;
// const CACHE_MAX_AGE_DAYS = 7;
// const CACHE_MAX_FILES = 20;
// const BUCKET_NAME = "sounds"; // Define your bucket name here

// // --- TYPE DEFINITIONS ---
// // Improvement: Typed query key
// type PodcastsQueryKey = ["podcasts", string];

// // --- HELPER FUNCTIONS ---

// // Flag to prevent concurrent cleanup runs
// let isCleaningCache = false;

// function getCacheDirectory(): string {
//   const cacheDir = FileSystem.cacheDirectory;
//   if (!cacheDir) {
//     console.error("Cache directory is not available.");
//     return (FileSystem.documentDirectory ?? "") + "audioCache/"; // Provide a fallback
//   }
//   return cacheDir.endsWith("/") ? cacheDir : cacheDir + "/";
// }

// async function cleanupCache(): Promise<void> {
//   // Improvement: Prevent concurrent cleanup
//   if (isCleaningCache) {
//     console.log("Cache cleanup already in progress, skipping.");
//     return;
//   }
//   isCleaningCache = true;
//   console.log("Starting cache cleanup...");

//   try {
//     const dirUri = getCacheDirectory();
//     const dirInfo = await FileSystem.getInfoAsync(dirUri);
//     if (!dirInfo.exists || !dirInfo.isDirectory) {
//       console.log(
//         "Cache directory does not exist or is not a directory, skipping cleanup."
//       );
//       isCleaningCache = false; // Reset flag
//       return;
//     }

//     const names = await FileSystem.readDirectoryAsync(dirUri);
//     const audioExtensions = [".mp3"]; // Add relevant extensions
//     const audioFileNames = names.filter((name) =>
//       audioExtensions.some((ext) => name.toLowerCase().endsWith(ext))
//     );
//     const infos: { uri: string; mtime: number }[] = [];

//     await Promise.all(
//       audioFileNames.map(async (name) => {
//         const fileUri = dirUri + name;
//         try {
//           // Optimization: Check if it's likely an audio file if needed (e.g., by extension)
//           const info = await FileSystem.getInfoAsync(fileUri, { size: true });
//           // Ensure it's a file and has modification time
//           if (info.exists && !info.isDirectory && info.modificationTime) {
//             infos.push({ uri: fileUri, mtime: info.modificationTime * 1000 });
//           }
//         } catch (fileInfoError) {
//           // Avoid logging excessive warnings for files that might be gone
//           // console.warn(`Could not get info for cache file: ${name}`, fileInfoError);
//         }
//       })
//     );

//     const cutoff = Date.now() - CACHE_MAX_AGE_DAYS * 24 * 60 * 60 * 1000;

//     // Delete old files
//     const oldFiles = infos.filter((f) => f.mtime < cutoff);
//     if (oldFiles.length > 0) {
//       console.log(`Deleting ${oldFiles.length} old cache files...`);
//       await Promise.all(
//         oldFiles.map((f) => FileSystem.deleteAsync(f.uri, { idempotent: true }))
//       );
//     }

//     // Keep newest CACHE_MAX_FILES if exceeding limit
//     const filesOverLimit = infos.length - oldFiles.length - CACHE_MAX_FILES;
//     if (filesOverLimit > 0) {
//       // Sort remaining files by modification time (newest first)
//       const remainingFiles = infos
//         .filter((f) => f.mtime >= cutoff) // Exclude already deleted old files
//         .sort((a, b) => b.mtime - a.mtime);

//       const filesToDelete = remainingFiles.slice(CACHE_MAX_FILES); // Get the oldest ones beyond the limit
//       if (filesToDelete.length > 0) {
//         console.log(
//           `Deleting ${filesToDelete.length} excess cache files (over limit)...`
//         );
//         await Promise.all(
//           filesToDelete.map((f) =>
//             FileSystem.deleteAsync(f.uri, { idempotent: true })
//           )
//         );
//       }
//     }
//     console.log("Cache cleanup finished.");
//   } catch (error) {
//     console.warn("Error during cache cleanup:", error);
//   } finally {
//     isCleaningCache = false; // Always reset flag
//   }
// }

// async function downloadToCache(
//   source: string,
//   onProgress?: (frac: number) => void
// ): Promise<string> {
//   let downloadUrl: string;
//   const filename =
//     source.substring(source.lastIndexOf("/") + 1).split("?")[0] ||
//     `download_${Date.now()}`;
//   const localUri = getCacheDirectory() + filename;

//   const info = await FileSystem.getInfoAsync(localUri).catch(() => null); // Handle potential error if dir doesn't exist yet
//   if (info?.exists) {
//     console.log(`File found in cache: ${localUri}`);
//     return localUri;
//   }

//   if (/^https?:\/\//.test(source)) {
//     downloadUrl = source;
//   } else {
//     // Assume it's a path needing signing (or could add public check here if needed)
//     console.log(`Generating signed URL for download path: ${source}`);
//     const { data, error } = await supabase.storage
//       .from(BUCKET_NAME)
//       .createSignedUrl(source, 60 * 60);
//     if (error) {
//       console.error(`Error creating signed URL for ${source}:`, error);
//       throw error; // Re-throw the Supabase error
//     }
//     if (!data?.signedUrl) {
//       throw new Error("Failed to get signed URL from Supabase.");
//     }
//     downloadUrl = data.signedUrl;
//   }

//   let currentUrl = downloadUrl;
//   for (let attempt = 0; attempt < 2; attempt++) {
//     try {
//       const task = FileSystem.createDownloadResumable(
//         currentUrl,
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
//         throw new Error("Download failed, result URI missing.");
//       }

//       console.log(`Download successful: ${result.uri}`);
//       // Trigger cleanup but don't wait for it
//       cleanupCache().catch(console.warn);
//       return result.uri;
//     } catch (err: any) {
//       console.error(
//         `Download attempt ${attempt + 1} failed for ${source}:`,
//         err
//       );
//       const isSignedUrlAttempt = !/^https?:\/\//.test(source);
//       const isLikelyExpired =
//         err.message?.includes("403") || err.status === 403;

//       if (attempt === 0 && isSignedUrlAttempt && isLikelyExpired) {
//         console.log("Attempting signed URL refresh...");
//         try {
//           const { data, error: refreshError } = await supabase.storage
//             .from(BUCKET_NAME)
//             .createSignedUrl(source, 60 * 60);
//           if (refreshError) throw refreshError; // Throw if refresh fails
//           if (!data?.signedUrl)
//             throw new Error("Refreshed signed URL is missing.");
//           currentUrl = data.signedUrl;
//           console.log("Retrying download with refreshed URL.");
//           continue; // Next attempt
//         } catch (refreshErr) {
//           console.error("Signed URL refresh failed:", refreshErr);
//           throw err; // Throw original download error if refresh fails
//         }
//       }
//       // If not handled by retry logic, throw the error from this attempt
//       throw err;
//     }
//   }
//   // Should only be reached if both attempts fail
//   throw new Error(`Download failed for ${source} after multiple attempts.`);
// }

// // --- THE HOOK ---

// export function usePodcasts(language: string) {
//   const qc = useQueryClient();
//   // Ref to track if initial cleanup has run
//   const didInitialCleanup = useRef(false);

//   // Improvement: Run cleanup when hook mounts for the first time
//   useEffect(() => {
//     if (!didInitialCleanup.current) {
//       console.log("Running initial cache cleanup on hook mount...");
//       cleanupCache().catch(console.warn);
//       didInitialCleanup.current = true;
//     }
//   }, []); // Empty dependency array ensures it runs only once on mount

//   // --- 1) Infinite paginated list ---
//   const queryKey: PodcastsQueryKey = ["podcasts", language]; // Use typed key
//   const infiniteQuery = useInfiniteQuery<
//     PodcastType[],
//     Error,
//     InfiniteData<PodcastType[]>,
//     PodcastsQueryKey, // Use typed key here
//     number
//   >({
//     queryKey: queryKey, // Use the defined key variable
//     queryFn: async ({ pageParam = 0 }) => {
//       // console.log(`Fetching podcasts page: ${pageParam / PAGE_SIZE}`);
//       const { data, error, count } = await supabase
//         .from("podcasts")
//         .select("*", { count: "exact" })
//         .eq("language_code", language)
//         .order("id", { ascending: false })
//         .range(pageParam, pageParam + PAGE_SIZE - 1);

//       if (error) {
//         console.error("Error fetching podcasts:", error);
//         throw error;
//       }
//       // console.log(`Fetched ${data?.length} podcasts. Total count: ${count}`);
//       return data || [];
//     },
//     getNextPageParam: (lastPage, allPages) => {
//       const fetchedItemsCount = allPages.reduce(
//         (acc, page) => acc + page.length,
//         0
//       );
//       return lastPage.length === PAGE_SIZE ? fetchedItemsCount : undefined;
//     },
//     initialPageParam: 0,
//     staleTime: 5 * 60 * 1000, // 5 minutes
//     // Consider adding cacheTime if needed:
//     // cacheTime: 1000 * 60 * 60 * 24, // e.g., 24 hours
//   });

//   // --- 2) Real-time subscription updates ---
//   useEffect(() => {
//     // console.log(`Setting up Supabase channel: podcasts_${language}`);
//     const channel = supabase
//       .channel(`podcasts_${language}`)
//       .on<PodcastType>(
//         "postgres_changes",
//         {
//           event: "INSERT",
//           schema: "public",
//           table: "podcasts",
//           filter: `language_code=eq.${language}`,
//         },
//         (payload) => {
//           console.log("Realtime INSERT received");
//           qc.setQueryData<InfiniteData<PodcastType[]>>(queryKey, (oldData) => {
//             if (!oldData?.pages) return oldData;
//             const newPages = oldData.pages.map((p) => [...p]);
//             if (newPages.length > 0) {
//               newPages[0] = [payload.new, ...newPages[0]];
//             } else {
//               newPages.push([payload.new]);
//             }
//             return { ...oldData, pages: newPages };
//           });
//         }
//       )
//       .on<PodcastType>(
//         "postgres_changes",
//         {
//           event: "UPDATE",
//           schema: "public",
//           table: "podcasts",
//           filter: `language_code=eq.${language}`,
//         },
//         (payload) => {
//           console.log("Realtime UPDATE received");
//           qc.setQueryData<InfiniteData<PodcastType[]>>(queryKey, (oldData) => {
//             if (!oldData?.pages) return oldData;
//             return {
//               ...oldData,
//               pages: oldData.pages.map((page) =>
//                 page.map((p) => (p.id === payload.new.id ? payload.new : p))
//               ),
//             };
//           });
//         }
//       )
//       .on<PodcastType>(
//         "postgres_changes",
//         {
//           event: "DELETE",
//           schema: "public",
//           table: "podcasts",
//           filter: `language_code=eq.${language}`,
//         },
//         (payload) => {
//           const deletedItemId = (payload.old as PodcastType)?.id;
//           if (!deletedItemId) return;
//           console.log("Realtime DELETE received");
//           qc.setQueryData<InfiniteData<PodcastType[]>>(queryKey, (oldData) => {
//             if (!oldData?.pages) return oldData;
//             return {
//               ...oldData,
//               pages: oldData.pages.map((page) =>
//                 page.filter((p) => p.id !== deletedItemId)
//               ),
//             };
//           });
//         }
//       )
//       .subscribe((status, err) => {
//         if (status === "SUBSCRIBED") {
//           console.log(`Realtime channel subscribed: ${channel.topic}`);
//         }
//         if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
//           console.error(
//             `Realtime channel error: ${channel.topic}`,
//             status,
//             err
//           );
//         }
//         // Add handling for other statuses if needed (e.g., 'CLOSED')
//       });

//     return () => {
//       console.log(`Removing Supabase channel: ${channel.topic}`);
//       supabase
//         .removeChannel(channel)
//         .catch((error) => console.error("Error removing channel:", error));
//     };
//     // Ensure qc and queryKey are stable or correctly included if they can change
//   }, [language, qc]); // queryKey depends on language, qc is generally stable

//   // --- 3) Get Public URL for Streaming ---
//   const getPublicStreamUrl = useCallback((soundPath: string): string => {
//     // console.log(`Generating public stream URL for: ${soundPath}`);
//     if (!soundPath) {
//       console.warn("getPublicStreamUrl called with empty soundPath.");
//       return "";
//     }
//     // Handle potential full URLs passed in (workaround for existing data)
//     if (/^https?:\/\//.test(soundPath)) {
//       console.warn(
//         "getPublicStreamUrl received a full URL, returning directly:",
//         soundPath
//       );
//       return soundPath;
//     }
//     try {
//       const { data } = supabase.storage
//         .from(BUCKET_NAME)
//         .getPublicUrl(soundPath);

//       if (!data?.publicUrl) {
//         console.error(`Could not get public URL for path: ${soundPath}.`);
//         return "";
//       }
//       // console.log(`Public URL generated: ${data.publicUrl}`);
//       return data.publicUrl;
//     } catch (error) {
//       console.error(`Error generating public URL for ${soundPath}:`, error);
//       return "";
//     }
//   }, []); // Depends only on BUCKET_NAME and supabase client (assumed stable)

//   // --- 4) Download-to-cache mutation ---
//   const downloadMutation = useMutation<
//     string,
//     Error,
//     { soundPath: string; onProgress?: (frac: number) => void }
//   >({
//     mutationFn: ({ soundPath, onProgress }) => {
//       if (!soundPath)
//         throw new Error("Download mutation requires a soundPath.");
//       return downloadToCache(soundPath, onProgress);
//     },
//     onMutate: ({ soundPath }) => {
//       qc.setQueryData(["download", soundPath], {
//         status: "loading",
//         progress: 0,
//       });
//     },
//     onError: (error, variables) => {
//       // Improvement: Log the specific error
//       console.error(
//         `Error downloading ${variables.soundPath}:`,
//         error.message,
//         error
//       );
//       qc.setQueryData(["download", variables.soundPath], {
//         status: "error",
//         error: error.message,
//       });
//     },
//     onSuccess: (localUri, variables) => {
//       // console.log(`Successfully downloaded ${variables.soundPath} to ${localUri}`);
//       qc.setQueryData(["download", variables.soundPath], {
//         status: "done",
//         uri: localUri,
//       });
//     },
//   });

//   // --- RETURN VALUE ---
//   return {
//     ...infiniteQuery, // Includes data, fetchNextPage, isLoading, error etc. for the list
//     stream: getPublicStreamUrl,
//     download: downloadMutation, // The mutation object itself { mutate, mutateAsync, status, error, data }
//   };
// }

//! Moved cleanCach to app mount
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  InfiniteData,
  QueryKey, // Import QueryKey
} from "@tanstack/react-query";
import { supabase } from "@/utils/supabase"; // Ensure this points to your initialized Supabase client
import * as FileSystem from "expo-file-system";
import { useEffect, useCallback, useRef } from "react"; // Import useRef
import { PodcastType } from "@/constants/Types"; // Ensure this type matches your podcast structure
import { Platform } from "react-native"; // Used for cache directory

// --- CONFIGURATION ---
const PAGE_SIZE = 3;
const CACHE_MAX_AGE_DAYS = 7;
const CACHE_MAX_FILES = 20;
const BUCKET_NAME = "sounds"; // Define your bucket name here

// --- TYPE DEFINITIONS ---
// Improvement: Typed query key
type PodcastsQueryKey = ["podcasts", string];

// --- HELPER FUNCTIONS ---

// Flag to prevent concurrent cleanup runs
let isCleaningCache = false;

function getCacheDirectory(): string {
  const cacheDir = FileSystem.cacheDirectory;
  if (!cacheDir) {
    console.error("Cache directory is not available.");
    return (FileSystem.documentDirectory ?? "") + "audioCache/"; // Provide a fallback
  }
  return cacheDir.endsWith("/") ? cacheDir : cacheDir + "/";
}

export async function cleanupCache(): Promise<void> {
  // Improvement: Prevent concurrent cleanup
  if (isCleaningCache) {
    console.log("Cache cleanup already in progress, skipping.");
    return;
  }
  isCleaningCache = true;
  console.log("Starting cache cleanup...");

  try {
    const dirUri = getCacheDirectory();
    const dirInfo = await FileSystem.getInfoAsync(dirUri);
    if (!dirInfo.exists || !dirInfo.isDirectory) {
      console.log(
        "Cache directory does not exist or is not a directory, skipping cleanup."
      );
      isCleaningCache = false; // Reset flag
      return;
    }

    const names = await FileSystem.readDirectoryAsync(dirUri);
    const audioExtensions = [".mp3"]; // Add relevant extensions
    const audioFileNames = names.filter((name) =>
      audioExtensions.some((ext) => name.toLowerCase().endsWith(ext))
    );
    const infos: { uri: string; mtime: number }[] = [];

    await Promise.all(
      audioFileNames.map(async (name) => {
        const fileUri = dirUri + name;
        try {
          // Optimization: Check if it's likely an audio file if needed (e.g., by extension)
          const info = await FileSystem.getInfoAsync(fileUri, { size: true });
          // Ensure it's a file and has modification time
          if (info.exists && !info.isDirectory && info.modificationTime) {
            infos.push({ uri: fileUri, mtime: info.modificationTime * 1000 });
          }
        } catch (fileInfoError) {
          // Avoid logging excessive warnings for files that might be gone
          // console.warn(`Could not get info for cache file: ${name}`, fileInfoError);
        }
      })
    );

    const cutoff = Date.now() - CACHE_MAX_AGE_DAYS * 24 * 60 * 60 * 1000;

    // Delete old files
    const oldFiles = infos.filter((f) => f.mtime < cutoff);
    if (oldFiles.length > 0) {
      console.log(`Deleting ${oldFiles.length} old cache files...`);
      await Promise.all(
        oldFiles.map((f) => FileSystem.deleteAsync(f.uri, { idempotent: true }))
      );
    }

    // Keep newest CACHE_MAX_FILES if exceeding limit
    const filesOverLimit = infos.length - oldFiles.length - CACHE_MAX_FILES;
    if (filesOverLimit > 0) {
      // Sort remaining files by modification time (newest first)
      const remainingFiles = infos
        .filter((f) => f.mtime >= cutoff) // Exclude already deleted old files
        .sort((a, b) => b.mtime - a.mtime);

      const filesToDelete = remainingFiles.slice(CACHE_MAX_FILES); // Get the oldest ones beyond the limit
      if (filesToDelete.length > 0) {
        console.log(
          `Deleting ${filesToDelete.length} excess cache files (over limit)...`
        );
        await Promise.all(
          filesToDelete.map((f) =>
            FileSystem.deleteAsync(f.uri, { idempotent: true })
          )
        );
      }
    }
    console.log("Cache cleanup finished.");
  } catch (error) {
    console.warn("Error during cache cleanup:", error);
  } finally {
    isCleaningCache = false; // Always reset flag
  }
}

async function downloadToCache(
  source: string,
  onProgress?: (frac: number) => void
): Promise<string> {
  let downloadUrl: string;
  const filename =
    source.substring(source.lastIndexOf("/") + 1).split("?")[0] ||
    `download_${Date.now()}`;
  const localUri = getCacheDirectory() + filename;

  const info = await FileSystem.getInfoAsync(localUri).catch(() => null); // Handle potential error if dir doesn't exist yet
  if (info?.exists) {
    console.log(`File found in cache: ${localUri}`);
    return localUri;
  }

  if (/^https?:\/\//.test(source)) {
    downloadUrl = source;
  } else {
    // Assume it's a path needing signing (or could add public check here if needed)
    console.log(`Generating signed URL for download path: ${source}`);
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(source, 60 * 60);
    if (error) {
      console.error(`Error creating signed URL for ${source}:`, error);
      throw error; // Re-throw the Supabase error
    }
    if (!data?.signedUrl) {
      throw new Error("Failed to get signed URL from Supabase.");
    }
    downloadUrl = data.signedUrl;
  }

  let currentUrl = downloadUrl;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const task = FileSystem.createDownloadResumable(
        currentUrl,
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
        throw new Error("Download failed, result URI missing.");
      }

      console.log(`Download successful: ${result.uri}`);
      // Trigger cleanup but don't wait for it
      cleanupCache().catch(console.warn);
      return result.uri;
    } catch (err: any) {
      console.error(
        `Download attempt ${attempt + 1} failed for ${source}:`,
        err
      );
      const isSignedUrlAttempt = !/^https?:\/\//.test(source);
      const isLikelyExpired =
        err.message?.includes("403") || err.status === 403;

      if (attempt === 0 && isSignedUrlAttempt && isLikelyExpired) {
        console.log("Attempting signed URL refresh...");
        try {
          const { data, error: refreshError } = await supabase.storage
            .from(BUCKET_NAME)
            .createSignedUrl(source, 60 * 60);
          if (refreshError) throw refreshError; // Throw if refresh fails
          if (!data?.signedUrl)
            throw new Error("Refreshed signed URL is missing.");
          currentUrl = data.signedUrl;
          console.log("Retrying download with refreshed URL.");
          continue; // Next attempt
        } catch (refreshErr) {
          console.error("Signed URL refresh failed:", refreshErr);
          throw err; // Throw original download error if refresh fails
        }
      }
      // If not handled by retry logic, throw the error from this attempt
      throw err;
    }
  }
  // Should only be reached if both attempts fail
  throw new Error(`Download failed for ${source} after multiple attempts.`);
}

// --- THE HOOK ---

export function usePodcasts(language: string) {
  const qc = useQueryClient();
  // Ref to track if initial cleanup has run
  const didInitialCleanup = useRef(false);

  // // Improvement: Run cleanup when hook mounts for the first time
  // useEffect(() => {
  //   if (!didInitialCleanup.current) {
  //     console.log("Running initial cache cleanup on hook mount...");
  //     cleanupCache().catch(console.warn);
  //     didInitialCleanup.current = true;
  //   }
  // }, []); // Empty dependency array ensures it runs only once on mount

  // --- 1) Infinite paginated list ---
  const queryKey: PodcastsQueryKey = ["podcasts", language]; // Use typed key
  const infiniteQuery = useInfiniteQuery<
    PodcastType[],
    Error,
    InfiniteData<PodcastType[]>,
    PodcastsQueryKey, // Use typed key here
    number
  >({
    queryKey: queryKey, // Use the defined key variable
    queryFn: async ({ pageParam = 0 }) => {
      // console.log(`Fetching podcasts page: ${pageParam / PAGE_SIZE}`);
      const { data, error, count } = await supabase
        .from("podcasts")
        .select("*", { count: "exact" })
        .eq("language_code", language)
        .order("id", { ascending: false })
        .range(pageParam, pageParam + PAGE_SIZE - 1);

      if (error) {
        console.error("Error fetching podcasts:", error);
        throw error;
      }
      // console.log(`Fetched ${data?.length} podcasts. Total count: ${count}`);
      return data || [];
    },
    getNextPageParam: (lastPage, allPages) => {
      const fetchedItemsCount = allPages.reduce(
        (acc, page) => acc + page.length,
        0
      );
      return lastPage.length === PAGE_SIZE ? fetchedItemsCount : undefined;
    },
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    // Consider adding cacheTime if needed:
    // cacheTime: 1000 * 60 * 60 * 24, // e.g., 24 hours
  });

  // --- 2) Real-time subscription updates ---
  useEffect(() => {
    // console.log(`Setting up Supabase channel: podcasts_${language}`);
    const channel = supabase
      .channel(`podcasts_${language}`)
      .on<PodcastType>(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "podcasts",
          filter: `language_code=eq.${language}`,
        },
        (payload) => {
          console.log("Realtime INSERT received");
          qc.setQueryData<InfiniteData<PodcastType[]>>(queryKey, (oldData) => {
            if (!oldData?.pages) return oldData;
            const newPages = oldData.pages.map((p) => [...p]);
            if (newPages.length > 0) {
              newPages[0] = [payload.new, ...newPages[0]];
            } else {
              newPages.push([payload.new]);
            }
            return { ...oldData, pages: newPages };
          });
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
          console.log("Realtime UPDATE received");
          qc.setQueryData<InfiniteData<PodcastType[]>>(queryKey, (oldData) => {
            if (!oldData?.pages) return oldData;
            return {
              ...oldData,
              pages: oldData.pages.map((page) =>
                page.map((p) => (p.id === payload.new.id ? payload.new : p))
              ),
            };
          });
        }
      )
      .on<PodcastType>(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "podcasts",
          filter: `language_code=eq.${language}`,
        },
        (payload) => {
          const deletedItemId = (payload.old as PodcastType)?.id;
          if (!deletedItemId) return;
          console.log("Realtime DELETE received");
          qc.setQueryData<InfiniteData<PodcastType[]>>(queryKey, (oldData) => {
            if (!oldData?.pages) return oldData;
            return {
              ...oldData,
              pages: oldData.pages.map((page) =>
                page.filter((p) => p.id !== deletedItemId)
              ),
            };
          });
        }
      )
      .subscribe((status, err) => {
        if (status === "SUBSCRIBED") {
          console.log(`Realtime channel subscribed: ${channel.topic}`);
        }
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          console.error(
            `Realtime channel error: ${channel.topic}`,
            status,
            err
          );
        }
        // Add handling for other statuses if needed (e.g., 'CLOSED')
      });

    return () => {
      console.log(`Removing Supabase channel: ${channel.topic}`);
      supabase
        .removeChannel(channel)
        .catch((error) => console.error("Error removing channel:", error));
    };
    // Ensure qc and queryKey are stable or correctly included if they can change
  }, [language, qc]); // queryKey depends on language, qc is generally stable

  // --- 3) Get Public URL for Streaming ---
  const getPublicStreamUrl = useCallback((soundPath: string): string => {
    // console.log(`Generating public stream URL for: ${soundPath}`);
    if (!soundPath) {
      console.warn("getPublicStreamUrl called with empty soundPath.");
      return "";
    }
    // Handle potential full URLs passed in (workaround for existing data)
    if (/^https?:\/\//.test(soundPath)) {
      console.warn(
        "getPublicStreamUrl received a full URL, returning directly:",
        soundPath
      );
      return soundPath;
    }
    try {
      const { data } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(soundPath);

      if (!data?.publicUrl) {
        console.error(`Could not get public URL for path: ${soundPath}.`);
        return "";
      }
      // console.log(`Public URL generated: ${data.publicUrl}`);
      return data.publicUrl;
    } catch (error) {
      console.error(`Error generating public URL for ${soundPath}:`, error);
      return "";
    }
  }, []); // Depends only on BUCKET_NAME and supabase client (assumed stable)

  // --- 4) Download-to-cache mutation ---
  const downloadMutation = useMutation<
    string,
    Error,
    { soundPath: string; onProgress?: (frac: number) => void }
  >({
    mutationFn: ({ soundPath, onProgress }) => {
      if (!soundPath)
        throw new Error("Download mutation requires a soundPath.");
      return downloadToCache(soundPath, onProgress);
    },
    onMutate: ({ soundPath }) => {
      qc.setQueryData(["download", soundPath], {
        status: "loading",
        progress: 0,
      });
    },
    onError: (error, variables) => {
      // Improvement: Log the specific error
      console.error(
        `Error downloading ${variables.soundPath}:`,
        error.message,
        error
      );
      qc.setQueryData(["download", variables.soundPath], {
        status: "error",
        error: error.message,
      });
    },
    onSuccess: (localUri, variables) => {
      // console.log(`Successfully downloaded ${variables.soundPath} to ${localUri}`);
      qc.setQueryData(["download", variables.soundPath], {
        status: "done",
        uri: localUri,
      });
    },
  });

  // --- RETURN VALUE ---
  return {
    ...infiniteQuery, // Includes data, fetchNextPage, isLoading, error etc. for the list
    stream: getPublicStreamUrl,
    download: downloadMutation, // The mutation object itself { mutate, mutateAsync, status, error, data }
  };
}
