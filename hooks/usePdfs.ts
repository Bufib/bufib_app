// import { PdfType } from "@/constants/Types";
// import { supabase } from "@/utils/supabase";
// import {
//   InfiniteData,
//   QueryKey,
//   useInfiniteQuery,
//   useMutation,
//   useQueryClient,
// } from "@tanstack/react-query";
// import * as FileSystem from "expo-file-system/legacy";
// import { useCallback, useEffect } from "react";

// // --- CONFIGURATION ---
// const PAGE_SIZE = 10;
// const CACHE_MAX_AGE_DAYS = 30; // PDFs can stay longer than audio
// const CACHE_MAX_FILES = 50; // PDFs are reference material, keep more

// // --- STORAGE CONFIG ---
// const STORAGE_BUCKET = "pdfs";
// const STORAGE_PATH = "pdfs"; // Internal folder in bucket
// const USE_SIGNED_URLS = false;

// // --- URL HELPERS ---

// /**
//  * Build the object path inside the bucket.
//  * This keeps you safe if one day you accidentally store "pdfs/myfile.pdf"
//  * instead of just "myfile.pdf" in the DB.
//  */
// function buildStoragePath(filename: string): string {
//   return filename.includes("/") ? filename : `${STORAGE_PATH}/${filename}`;
// }

// function publicUrlFor(filename: string): string {
//   const path = buildStoragePath(filename);
//   const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
//   return data.publicUrl;
// }

// async function signedUrlFor(
//   filename: string,
//   expiresInSeconds = 60 * 60 * 4
// ): Promise<string> {
//   const path = buildStoragePath(filename);
//   const { data, error } = await supabase.storage
//     .from(STORAGE_BUCKET)
//     .createSignedUrl(path, expiresInSeconds);

//   if (error || !data?.signedUrl)
//     throw error ?? new Error("Could not create signed URL");
//   return data.signedUrl;
// }

// async function urlFor(filename: string): Promise<string> {
//   return USE_SIGNED_URLS ? signedUrlFor(filename) : publicUrlFor(filename);
// }

// // Export for external use if needed (e.g. direct streaming in a viewer)
// export const remotePdfUrlFor = (filename: string) => publicUrlFor(filename);

// // --- CACHE (PER-LANGUAGE) ---

// const sanitize = (s: string) => s.replace(/[\\/]/g, "_");
// const LANG_DEFAULT = "default";
// const cleaningLanguages = new Set<string>();

// function getRootCacheDir(): string {
//   const base = FileSystem.cacheDirectory ?? FileSystem.documentDirectory ?? "";
//   return base.endsWith("/") ? base : base + "/";
// }

// function getCacheDirectory(language?: string): string {
//   const lang = (language || LANG_DEFAULT).toLowerCase();
//   return `${getRootCacheDir()}pdfCache/${lang}/`;
// }

// async function ensureLangDir(language?: string) {
//   await FileSystem.makeDirectoryAsync(getCacheDirectory(language), {
//     intermediates: true,
//   }).catch(() => {});
// }

// /**
//  * Deletes old or over-limit PDFs in the language-specific cache directory.
//  */
// export async function cleanupPdfCache(language?: string): Promise<void> {
//   const lang = (language || LANG_DEFAULT).toLowerCase();
//   if (cleaningLanguages.has(lang)) {
//     return;
//   }
//   cleaningLanguages.add(lang);

//   try {
//     const dirUri = getCacheDirectory(lang);
//     const dirInfo = await FileSystem.getInfoAsync(dirUri);
//     if (!dirInfo.exists || !dirInfo.isDirectory) {
//       return;
//     }

//     const allNames = await FileSystem.readDirectoryAsync(dirUri);
//     const pdfFileNames = allNames.filter((name) =>
//       name.toLowerCase().endsWith(".pdf")
//     );

//     const infos: { uri: string; mtime: number }[] = [];
//     await Promise.all(
//       pdfFileNames.map(async (name) => {
//         const fileUri = dirUri + name;
//         try {
//           const info = await FileSystem.getInfoAsync(fileUri);
//           if (info.exists && !info.isDirectory && info.modificationTime) {
//             infos.push({ uri: fileUri, mtime: info.modificationTime * 1000 });
//           }
//         } catch {
//           // ignore file errors
//         }
//       })
//     );

//     const cutoff = Date.now() - CACHE_MAX_AGE_DAYS * 24 * 60 * 60 * 1000;

//     // Delete old files
//     const oldFiles = infos.filter((f) => f.mtime < cutoff);
//     if (oldFiles.length > 0) {
//       await Promise.all(
//         oldFiles.map((f) => FileSystem.deleteAsync(f.uri, { idempotent: true }))
//       );
//     }

//     // Enforce maximum file count
//     const stillValid = infos.filter((f) => f.mtime >= cutoff);
//     const excessCount = stillValid.length - CACHE_MAX_FILES;
//     if (excessCount > 0) {
//       const sortedByNewest = stillValid.sort((a, b) => b.mtime - a.mtime);
//       const toDelete = sortedByNewest.slice(CACHE_MAX_FILES);
//       await Promise.all(
//         toDelete.map((f) => FileSystem.deleteAsync(f.uri, { idempotent: true }))
//       );
//     }
//   } catch (err) {
//     console.warn(`[PDF cache cleanup error]`, err);
//   } finally {
//     cleaningLanguages.delete(lang);
//   }
// }

// /**
//  * Downloads a PDF from Supabase Storage into the language-scoped cache folder.
//  */
// async function downloadToCache(
//   filename: string,
//   language?: string,
//   onProgress?: (fraction: number) => void
// ): Promise<string> {
//   if (!filename)
//     throw new Error("downloadToCache requires a non-empty filename.");

//   await ensureLangDir(language);
//   const cacheDir = getCacheDirectory(language);
//   const localUri = cacheDir + sanitize(filename);

//   // Return if already cached
//   const info = await FileSystem.getInfoAsync(localUri).catch(() => null);
//   if (info?.exists) return localUri;

//   const downloadUrl = await urlFor(filename);

//   // Retry logic for downloads
//   let lastError: any = null;
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
//       const result = await task.downloadAsync();
//       const status = (result as any)?.status ?? 200;
//       if (!result?.uri || status < 200 || status >= 300) {
//         await FileSystem.deleteAsync(localUri, { idempotent: true }).catch(
//           () => {}
//         );
//         throw new Error(`Download failed (HTTP ${status})`);
//       }
//       cleanupPdfCache(language).catch(console.warn);
//       return result.uri;
//     } catch (err) {
//       lastError = err;
//       if (attempt === 0) continue;
//       break;
//     }
//   }
//   throw new Error(
//     `Failed to download "${filename}": ${lastError?.message || lastError}`
//   );
// }

// // --- HOOK ---

// export function usePdfs(language: string) {
//   const qc = useQueryClient();

//   useEffect(() => {
//     if (!language) return;
//     ensureLangDir(language).catch(() => {});
//   }, [language]);

//   const queryKey: QueryKey = ["pdfs", language];

//   const infiniteQuery = useInfiniteQuery<
//     PdfType[],
//     Error,
//     InfiniteData<PdfType[]>,
//     QueryKey,
//     number
//   >({
//     queryKey,
//     queryFn: async ({ pageParam = 0 }) => {
//       const { data, error } = await supabase
//         .from("pdfs")
//         .select("*")
//         .eq("language_code", language)
//         .order("created_at", { ascending: false })
//         .range(pageParam, pageParam + PAGE_SIZE - 1);

//       if (error) {
//         console.error("Error fetching PDFs:", error);
//         throw error;
//       }
//       return data ?? [];
//     },
//     getNextPageParam: (lastPage, allPages) => {
//       const fetchedSoFar = allPages.reduce((acc, page) => acc + page.length, 0);
//       return lastPage.length === PAGE_SIZE ? fetchedSoFar : undefined;
//     },
//     initialPageParam: 0,
//     enabled: Boolean(language),
//     retry: 3,
//     staleTime: 24 * 60 * 60 * 1000, // 24 hours
//     gcTime: 7 * 24 * 60 * 60 * 1000,
//     refetchOnMount: "always",
//     refetchOnWindowFocus: false,
//     refetchOnReconnect: true,
//   });

//   const download = useMutation<
//     string,
//     Error,
//     { filename: string; onProgress?: (frac: number) => void }
//   >({
//     mutationFn: ({ filename, onProgress }) => {
//       if (!filename) throw new Error("download requires a filename");
//       return downloadToCache(filename, language, onProgress);
//     },
//     onMutate: ({ filename }) => {
//       qc.setQueryData(["pdfDownload", language, filename], {
//         status: "loading",
//         progress: 0,
//       });
//     },
//     onError: (error, variables) => {
//       console.error(`Error downloading ${variables.filename}:`, error);
//       qc.setQueryData(["pdfDownload", language, variables.filename], {
//         status: "error",
//         error: error.message,
//       });
//     },
//     onSuccess: (localUri, variables) => {
//       qc.setQueryData(["pdfDownload", language, variables.filename], {
//         status: "done",
//         uri: localUri,
//       });
//     },
//   });

//   const getCachedUri = useCallback(
//     async (filename: string): Promise<string | null> => {
//       if (!filename) return null;
//       const localUri = getCacheDirectory(language) + sanitize(filename);
//       const info = await FileSystem.getInfoAsync(localUri);
//       return info.exists ? localUri : null;
//     },
//     [language]
//   );

//   const deleteCached = useCallback(
//     async (filename: string): Promise<void> => {
//       if (!filename) return;
//       const localUri = getCacheDirectory(language) + sanitize(filename);
//       await FileSystem.deleteAsync(localUri, { idempotent: true }).catch(
//         () => {}
//       );
//       qc.setQueryData(["pdfDownload", language, filename], null);
//     },
//     [language, qc]
//   );

//   return {
//     ...infiniteQuery,
//     download,
//     getCachedUri,
//     deleteCached,
//   };
// }


// hooks/usePdfs.ts
import { PdfType } from "@/constants/Types";
import { supabase } from "@/utils/supabase";
import {
  InfiniteData,
  QueryKey,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import * as FileSystem from "expo-file-system/legacy";
import { useCallback, useEffect } from "react";

// --- CONFIGURATION ---
const PAGE_SIZE = 10;
const CACHE_MAX_AGE_DAYS = 30; // PDFs can stay longer than audio
const CACHE_MAX_FILES = 50; // PDFs are reference material, keep more

// --- STORAGE CONFIG ---
const STORAGE_BUCKET = "pdfs";
const STORAGE_PATH = "pdfs"; // Internal folder in bucket
const USE_SIGNED_URLS = false;

// --- URL HELPERS ---

/**
 * Build the object path inside the bucket.
 * This keeps you safe if one day you accidentally store "pdfs/myfile.pdf"
 * instead of just "myfile.pdf" in the DB.
 */
function buildStoragePath(filename: string): string {
  return filename.includes("/") ? filename : `${STORAGE_PATH}/${filename}`;
}

function publicUrlFor(filename: string): string {
  const path = buildStoragePath(filename);
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

async function signedUrlFor(
  filename: string,
  expiresInSeconds = 60 * 60 * 4
): Promise<string> {
  const path = buildStoragePath(filename);
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .createSignedUrl(path, expiresInSeconds);

  if (error || !data?.signedUrl) {
    throw error ?? new Error("Could not create signed URL");
  }
  return data.signedUrl;
}

async function urlFor(filename: string): Promise<string> {
  return USE_SIGNED_URLS ? signedUrlFor(filename) : publicUrlFor(filename);
}

// Export for external use if needed (e.g. direct streaming in a viewer)
export const remotePdfUrlFor = (filename: string) => publicUrlFor(filename);

// --- CACHE (PER-LANGUAGE) ---

const sanitize = (s: string) => s.replace(/[\\/]/g, "_");
const LANG_DEFAULT = "default";
const cleaningLanguages = new Set<string>();

function getRootCacheDir(): string {
  const base = FileSystem.cacheDirectory ?? FileSystem.documentDirectory ?? "";
  return base.endsWith("/") ? base : base + "/";
}

function getCacheDirectory(language?: string): string {
  const lang = (language || LANG_DEFAULT).toLowerCase();
  return `${getRootCacheDir()}pdfCache/${lang}/`;
}

async function ensureLangDir(language?: string) {
  await FileSystem.makeDirectoryAsync(getCacheDirectory(language), {
    intermediates: true,
  }).catch(() => {});
}

/**
 * Deletes old or over-limit PDFs in the language-specific cache directory.
 */
export async function cleanupPdfCache(language?: string): Promise<void> {
  const lang = (language || LANG_DEFAULT).toLowerCase();
  if (cleaningLanguages.has(lang)) {
    return;
  }
  cleaningLanguages.add(lang);

  try {
    const dirUri = getCacheDirectory(lang);
    const dirInfo = await FileSystem.getInfoAsync(dirUri);
    if (!dirInfo.exists || !dirInfo.isDirectory) {
      return;
    }

    const allNames = await FileSystem.readDirectoryAsync(dirUri);
    const pdfFileNames = allNames.filter((name) =>
      name.toLowerCase().endsWith(".pdf")
    );

    const infos: { uri: string; mtime: number }[] = [];
    await Promise.all(
      pdfFileNames.map(async (name) => {
        const fileUri = dirUri + name;
        try {
          const info = await FileSystem.getInfoAsync(fileUri);
          if (info.exists && !info.isDirectory && info.modificationTime) {
            infos.push({ uri: fileUri, mtime: info.modificationTime * 1000 });
          }
        } catch {
          // ignore file errors
        }
      })
    );

    const cutoff = Date.now() - CACHE_MAX_AGE_DAYS * 24 * 60 * 60 * 1000;

    // Delete old files
    const oldFiles = infos.filter((f) => f.mtime < cutoff);
    if (oldFiles.length > 0) {
      await Promise.all(
        oldFiles.map((f) => FileSystem.deleteAsync(f.uri, { idempotent: true }))
      );
    }

    // Enforce maximum file count
    const stillValid = infos.filter((f) => f.mtime >= cutoff);
    const excessCount = stillValid.length - CACHE_MAX_FILES;
    if (excessCount > 0) {
      const sortedByNewest = stillValid.sort((a, b) => b.mtime - a.mtime);
      const toDelete = sortedByNewest.slice(CACHE_MAX_FILES);
      await Promise.all(
        toDelete.map((f) => FileSystem.deleteAsync(f.uri, { idempotent: true }))
      );
    }
  } catch (err) {
    console.warn(`[PDF cache cleanup error]`, err);
  } finally {
    cleaningLanguages.delete(lang);
  }
}

/**
 * Downloads a PDF from Supabase Storage into the language-scoped cache folder.
 */
async function downloadToCache(
  filename: string,
  language?: string,
  onProgress?: (fraction: number) => void
): Promise<string> {
  if (!filename) {
    throw new Error("downloadToCache requires a non-empty filename.");
  }

  await ensureLangDir(language);
  const cacheDir = getCacheDirectory(language);
  const localUri = cacheDir + sanitize(filename);

  // Return if already cached
  const info = await FileSystem.getInfoAsync(localUri).catch(() => null);
  if (info?.exists) return localUri;

  const downloadUrl = await urlFor(filename);

  // Retry logic for downloads
  let lastError: any = null;
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
      const result = await task.downloadAsync();
      const status = (result as any)?.status ?? 200;

      if (!result?.uri || status < 200 || status >= 300) {
        await FileSystem.deleteAsync(localUri, { idempotent: true }).catch(
          () => {}
        );
        throw new Error(`Download failed (HTTP ${status})`);
      }

      cleanupPdfCache(language).catch(console.warn);
      return result.uri;
    } catch (err) {
      lastError = err;
      if (attempt === 0) continue;
      break;
    }
  }

  throw new Error(
    `Failed to download "${filename}": ${lastError?.message || lastError}`
  );
}

// --- HOOK ---

export function usePdfs(language: string) {
  const queryClient = useQueryClient();

  // Ensure language cache directory exists
  useEffect(() => {
    if (!language) return;
    ensureLangDir(language).catch(() => {});
  }, [language]);

  const queryKey: QueryKey = ["pdfs", language];

  const infiniteQuery = useInfiniteQuery<
    PdfType[],
    Error,
    InfiniteData<PdfType[]>,
    QueryKey,
    number
  >({
    queryKey,
    queryFn: async ({ pageParam = 0 }) => {
      const { data, error } = await supabase
        .from("pdfs")
        .select("*")
        .eq("language_code", language)
        .order("created_at", { ascending: false })
        .range(pageParam, pageParam + PAGE_SIZE - 1);

      if (error) {
        console.error("Error fetching PDFs:", error);
        throw error;
      }
      return data ?? [];
    },
    getNextPageParam: (lastPage, allPages) => {
      const fetchedSoFar = allPages.reduce((acc, page) => acc + page.length, 0);
      return lastPage.length === PAGE_SIZE ? fetchedSoFar : undefined;
    },
    initialPageParam: 0,
    enabled: Boolean(language),
    retry: 3,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 7 * 24 * 60 * 60 * 1000,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });

  const downloadMutation = useMutation<
    string,
    Error,
    { filename: string; onProgress?: (frac: number) => void }
  >({
    mutationFn: ({ filename, onProgress }) => {
      if (!filename) throw new Error("download requires a filename");
      return downloadToCache(filename, language, onProgress);
    },
    onMutate: ({ filename }) => {
      queryClient.setQueryData(["pdfDownload", language, filename], {
        status: "loading",
        progress: 0,
      });
    },
    onError: (error, variables) => {
      console.error(`Error downloading ${variables.filename}:`, error);
      queryClient.setQueryData(
        ["pdfDownload", language, variables.filename],
        {
          status: "error",
          error: error.message,
        }
      );
    },
    onSuccess: (localUri, variables) => {
      queryClient.setQueryData(
        ["pdfDownload", language, variables.filename],
        {
          status: "done",
          uri: localUri,
        }
      );
    },
  });

  // Stable function for effects/components
  const { mutateAsync: downloadPdf, ...downloadState } = downloadMutation;

  const getCachedUri = useCallback(
    async (filename: string): Promise<string | null> => {
      if (!filename) return null;
      const localUri = getCacheDirectory(language) + sanitize(filename);
      const info = await FileSystem.getInfoAsync(localUri);
      return info.exists ? localUri : null;
    },
    [language]
  );

  const deleteCached = useCallback(
    async (filename: string): Promise<void> => {
      if (!filename) return;
      const localUri = getCacheDirectory(language) + sanitize(filename);
      await FileSystem.deleteAsync(localUri, { idempotent: true }).catch(
        () => {}
      );
      queryClient.setQueryData(["pdfDownload", language, filename], null);
    },
    [language, queryClient]
  );

  return {
    ...infiniteQuery,
    // stable download function for your useEffect
    downloadPdf,
    // optional: state of the mutation if you need it
    downloadState,
    getCachedUri,
    deleteCached,
  };
}
