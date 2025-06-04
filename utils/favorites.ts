import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";
import i18n from "./i18n";
const NEWS_KEY = "favorite_newsarticles";
const PODCAST_KEY = "favorite_podcasts";

async function getIds(key: string): Promise<number[]> {
  try {
    const json = await AsyncStorage.getItem(key);
    return json ? JSON.parse(json) : [];
  } catch (e) {
    console.error("Failed to get IDs from AsyncStorage", e);
    return [];
  }
}

async function setIds(key: string, ids: number[]): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(ids));
  } catch (e) {
    console.error("Failed to set IDs in AsyncStorage", e);
  }
}

// News Articles
export async function isNewsArticleFavorited(id: number): Promise<boolean> {
  const ids = await getIds(NEWS_KEY);
  return ids.includes(id);
}

// CORRECTED: toggleNewsArticleFavorite does NOT use useAtom
export async function toggleNewsArticleFavorite(id: number): Promise<boolean> {
  const ids = await getIds(NEWS_KEY);
  const index = ids.indexOf(id);
  let favorited: boolean;
  let newIds: number[];

  if (index >= 0) {
    newIds = ids.filter((x) => x !== id);
    favorited = false;
    Toast.show({
      type: "error",
      text1: i18n.t("removedFromFavorites"),
    });
  } else {
    newIds = [...ids, id];
    favorited = true;
    Toast.show({
      type: "success",
      text1: i18n.t("addedToFavorites"),
    });
  }
  await setIds(NEWS_KEY, newIds);
  return favorited;
}

export async function getFavoriteNewsArticle(): Promise<number[]> {
  return getIds(NEWS_KEY);
}

// Podcasts
export async function isPodcastFavorited(id: number): Promise<boolean> {
  const ids = await getIds(PODCAST_KEY);
  return ids.includes(id);
}

export async function togglePodcastFavorite(id: number): Promise<boolean> {
  const ids = await getIds(PODCAST_KEY);
  const index = ids.indexOf(id);
  let favorited: boolean;
  let newIds: number[];

  if (index >= 0) {
    newIds = ids.filter((x) => x !== id);
    favorited = false;
    Toast.show({
      type: "error",
      text1: i18n.t("removedFromFavorites"),
    });
  } else {
    newIds = [...ids, id];
    favorited = true;
    Toast.show({
      type: "success",
      text1: i18n.t("addedToFavorites"),
    });
  }
  await setIds(PODCAST_KEY, newIds);
  return favorited;
}

export async function getFavoritePodcasts(): Promise<number[]> {
  return getIds(PODCAST_KEY);
}
