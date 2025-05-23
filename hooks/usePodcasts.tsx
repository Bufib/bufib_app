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
