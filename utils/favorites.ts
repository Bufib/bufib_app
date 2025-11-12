// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useTranslation } from "react-i18next";
// import Toast from "react-native-toast-message";
// import i18n from "./i18n";
// const NEWS_KEY = "favorite_newsarticles";
// const PODCAST_KEY = "favorite_podcasts";

// async function getIds(key: string): Promise<number[]> {
//   try {
//     const json = await AsyncStorage.getItem(key);
//     return json ? JSON.parse(json) : [];
//   } catch (e) {
//     console.error("Failed to get IDs from AsyncStorage", e);
//     return [];
//   }
// }

// async function setIds(key: string, ids: number[]): Promise<void> {
//   try {
//     await AsyncStorage.setItem(key, JSON.stringify(ids));
//   } catch (e) {
//     console.error("Failed to set IDs in AsyncStorage", e);
//   }
// }

// // News Articles
// export async function isNewsArticleFavorited(id: number): Promise<boolean> {
//   const ids = await getIds(NEWS_KEY);
//   return ids.includes(id);
// }

// // CORRECTED: toggleNewsArticleFavorite does NOT use useAtom
// export async function toggleNewsArticleFavorite(id: number): Promise<boolean> {
//   const ids = await getIds(NEWS_KEY);
//   const index = ids.indexOf(id);
//   let favorited: boolean;
//   let newIds: number[];

//   if (index >= 0) {
//     newIds = ids.filter((x) => x !== id);
//     favorited = false;
//     Toast.show({
//       type: "error",
//       text1: i18n.t("removedFromFavorites"),
//     });
//   } else {
//     newIds = [...ids, id];
//     favorited = true;
//     Toast.show({
//       type: "success",
//       text1: i18n.t("addedToFavorites"),
//     });
//   }
//   await setIds(NEWS_KEY, newIds);
//   return favorited;
// }

// export async function getFavoriteNewsArticle(): Promise<number[]> {
//   return getIds(NEWS_KEY);
// }

// // Podcasts
// export async function isPodcastFavorited(id: number): Promise<boolean> {
//   const ids = await getIds(PODCAST_KEY);
//   return ids.includes(id);
// }

// export async function togglePodcastFavorite(id: number): Promise<boolean> {
//   const ids = await getIds(PODCAST_KEY);
//   const index = ids.indexOf(id);
//   let favorited: boolean;
//   let newIds: number[];

//   if (index >= 0) {
//     newIds = ids.filter((x) => x !== id);
//     favorited = false;
//     Toast.show({
//       type: "error",
//       text1: i18n.t("removedFromFavorites"),
//     });
//   } else {
//     newIds = [...ids, id];
//     favorited = true;
//     Toast.show({
//       type: "success",
//       text1: i18n.t("addedToFavorites"),
//     });
//   }
//   await setIds(PODCAST_KEY, newIds);
//   return favorited;
// }

// export async function getFavoritePodcasts(): Promise<number[]> {
//   return getIds(PODCAST_KEY);
// }

// utils/favorites.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addFavoriteToast, removeFavoriteToast } from "@/constants/messages";

/**
 * Per-language favorites storage for news & podcasts.
 * Keys look like:
 *   favorite_newsarticles:<lang>
 *   favorite_podcasts:<lang>
 */

const NEWS_PREFIX = "favorite_newsarticles";
const PODCAST_PREFIX = "favorite_podcasts";

const keyFor = (prefix: string, lang?: string | null) =>
  `${prefix}:${(lang ?? "default").toLowerCase()}`;

const normalizeIds = (arr: unknown[]): number[] =>
  Array.from(new Set(arr.map((x) => Number(x)))).filter(Number.isFinite);

async function readIds(
  prefix: string,
  lang?: string | null
): Promise<number[]> {
  try {
    const raw = await AsyncStorage.getItem(keyFor(prefix, lang));
    if (!raw) return [];
    return normalizeIds(JSON.parse(raw));
  } catch (e) {
    console.error("[favorites] readIds error", e);
    return [];
  }
}

async function writeIds(
  prefix: string,
  lang: string | null | undefined,
  ids: number[]
): Promise<void> {
  try {
    await AsyncStorage.setItem(
      keyFor(prefix, lang),
      JSON.stringify(normalizeIds(ids))
    );
  } catch (e) {
    console.error("[favorites] writeIds error", e);
  }
}

async function toggleGeneric(
  prefix: string,
  id: number,
  lang?: string | null
): Promise<boolean> {
  const ids = await readIds(prefix, lang);
  const nId = Number(id);
  const exists = ids.includes(nId);
  const next = exists ? ids.filter((x) => x !== nId) : [...ids, nId];
  await writeIds(prefix, lang, next);
  const existsToast = () => {
    return exists ? removeFavoriteToast() : addFavoriteToast();
  };
  existsToast();
  return !exists; // new favorited state
}

async function hasGeneric(
  prefix: string,
  id: number,
  lang?: string | null
): Promise<boolean> {
  const ids = await readIds(prefix, lang);
  return ids.includes(Number(id));
}

/* ----------------- NEWS ----------------- */

export async function getFavoriteNewsArticle(
  lang?: string | null
): Promise<number[]> {
  return readIds(NEWS_PREFIX, lang);
}

export async function isNewsArticleFavorited(
  id: number,
  lang?: string | null
): Promise<boolean> {
  return hasGeneric(NEWS_PREFIX, id, lang);
}

export async function toggleNewsArticleFavorite(
  id: number,
  lang: string | null
): Promise<boolean> {
  return toggleGeneric(NEWS_PREFIX, id, lang);
}

/* --------------- PODCASTS --------------- */

export async function getFavoritePodcasts(
  lang?: string | null
): Promise<number[]> {
  return readIds(PODCAST_PREFIX, lang);
}

export async function isPodcastFavorited(
  id: number,
  lang?: string | null
): Promise<boolean> {
  return hasGeneric(PODCAST_PREFIX, id, lang);
}

export async function togglePodcastFavorite(
  id: number,
  lang: string | null
): Promise<boolean> {
  return toggleGeneric(PODCAST_PREFIX, id, lang);
}
