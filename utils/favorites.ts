import AsyncStorage from "@react-native-async-storage/async-storage";

const NEWS_KEY = "favorite_newsarticles";
const PODCAST_KEY = "favorite_podcasts";


async function getIds(key: string): Promise<number[]> {
  const json = await AsyncStorage.getItem(key);
  return json ? JSON.parse(json) : [];
}

async function setIds(key: string, ids: number[]) {
  await AsyncStorage.setItem(key, JSON.stringify(ids));
}

// News Articles
export async function isNewsArticleFavorited(id: number): Promise<boolean> {
  const ids = await getIds(NEWS_KEY);
  return ids.includes(id);
}
export async function toggleNewsArticleFavorite(id: number): Promise<boolean> {
  const ids = await getIds(NEWS_KEY);
  const index = ids.indexOf(id);
  let favorited: boolean;
  let newIds: number[];

  if (index >= 0) {
    // remove
    newIds = ids.filter((x) => x !== id);
    favorited = false;
  } else {
    // add
    newIds = [...ids, id];
    favorited = true;
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
    // remove
    newIds = ids.filter((x) => x !== id);
    favorited = false;
  } else {
    // add
    newIds = [...ids, id];
    favorited = true;
  }

  await setIds(PODCAST_KEY, newIds);
  return favorited;
}

export async function getFavoritePodcasts(): Promise<number[]> {
  return getIds(PODCAST_KEY);
}
