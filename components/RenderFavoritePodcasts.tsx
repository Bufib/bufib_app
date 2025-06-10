import React, { useEffect, useState, useMemo, useLayoutEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { usePodcasts } from "@/hooks/usePodcasts"; // adjust the import path as needed
import { getFavoritePodcasts } from "@/utils/favorites";
import { PodcastType } from "@/constants/Types";
import { router, useFocusEffect } from "expo-router";
import { useRefreshFavorites } from "@/stores/refreshFavoriteStore";
import { useLanguage } from "@/contexts/LanguageContext";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { useTranslation } from "react-i18next";

const RenderFavoritePodcasts = () => {
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const {
    data: infiniteData,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
  } = usePodcasts();

  const { refreshTriggerFavorites, triggerRefreshFavorites } =
    useRefreshFavorites();

  const { t } = useTranslation();
  // 1) Load favorite IDs from AsyncStorage on mount
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const ids = await getFavoritePodcasts();
        setFavoriteIds(ids);
      } catch (error) {
        console.error("Error loading favorite podcasts:", error);
      }
    };
    loadFavorites();
  }, [refreshTriggerFavorites]);

  // 2) Flatten all loaded pages into a single array of PodcastType
  const allEpisodes = useMemo<PodcastType[]>(() => {
    if (!infiniteData || !infiniteData.pages) return [];
    return infiniteData.pages.flat();
  }, [infiniteData]);

  // 3) Filter to only those episodes whose ID is in favoriteIds
  const favoriteEpisodes = useMemo<PodcastType[]>(() => {
    if (allEpisodes.length === 0 || favoriteIds.length === 0) return [];
    const idSet = new Set(favoriteIds);
    return allEpisodes.filter((ep) => idSet.has(ep.id));
  }, [allEpisodes, favoriteIds]);

  // If still loading the first page of episodes, show a spinner
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // If there was an error fetching episodes at all
  if (isError) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText style={styles.errorText}>
          Failed to load episodes.
        </ThemedText>
      </ThemedView>
    );
  }

  // 4) If there are no favorites (or none of the favorites have been loaded yet), show placeholder
  if (favoriteIds.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.emptyText}>{t("noFavorites")}</ThemedText>
      </ThemedView>
    );
  }

  // 5) Otherwise, render the list of favorite episodes
  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={favoriteEpisodes}
        extraData={[favoriteIds, refreshTriggerFavorites]}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => {
              router.push({
                pathname: "/home/podcast",
                params: {
                  podcast: JSON.stringify(item),
                },
              });
            }}
          >
            <ThemedText style={styles.itemTitle}>{item.title}</ThemedText>
            <ThemedText style={styles.itemDate}>
              Published: {new Date(item.published_at).toLocaleDateString()}
            </ThemedText>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
      />
    </ThemedView>
  );
};

export default RenderFavoritePodcasts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
  listContent: {
    paddingBottom: 24,
  },
  itemContainer: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#ccc",
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  itemDate: {
    fontSize: 14,
    color: "#444",
    marginTop: 4,
  },
  loadMoreContainer: {
    paddingVertical: 12,
    alignItems: "center",
  },
  loadMoreText: {
    fontSize: 16,
    color: "#007AFF",
  },
});
