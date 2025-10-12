import React, { useEffect, useState, useMemo, useLayoutEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  useColorScheme,
  Platform,
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
import { Colors } from "@/constants/Colors";
import { Entypo } from "@expo/vector-icons";
import { formatDate } from "@/utils/formatDate";
import { LoadingIndicator } from "./LoadingIndicator";

const RenderFavoritePodcasts = () => {
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const { language, isArabic } = useLanguage();
  const {
    data: infiniteData,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
  } = usePodcasts(language || "de");

  const { refreshTriggerFavorites, triggerRefreshFavorites } =
    useRefreshFavorites();
  const colorScheme = useColorScheme() || "light";
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
      <ThemedView style={styles.centeredContainer}>
        <LoadingIndicator size="large" />
      </ThemedView>
    );
  }

  // If there was an error fetching episodes at all
  if (isError) {
    return (
      <ThemedView style={styles.centeredContainer}>
        <ThemedText style={styles.errorText}>{t("error")}</ThemedText>
      </ThemedView>
    );
  }

  // 4) If there are no favorites (or none of the favorites have been loaded yet), show placeholder
  if (favoriteIds.length === 0) {
    return (
      <ThemedView style={styles.centeredContainer}>
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
        style={styles.listStyle}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              style={[
                styles.itemContainer,
                {
                  backgroundColor: Colors[colorScheme].contrast,
                  flexDirection: isArabic() ? "row-reverse" : "row",
                },
              ]}
              onPress={() => {
                router.push({
                  pathname: "/(podcast)/indexPodcast",
                  params: {
                    podcast: JSON.stringify(item),
                  },
                });
              }}
            >
              <View style={{ flex: 1, gap: 40 }}>
                <ThemedText style={styles.itemTitle}>{item.title}</ThemedText>
                <ThemedText style={styles.itemDate}>
                  {formatDate(item.created_at)}
                </ThemedText>
              </View>

              <View>
                <Entypo
                  name="chevron-thin-right"
                  size={24}
                  color={colorScheme === "dark" ? "#fff" : "#000"}
                  style={{ marginTop: -15 }}
                />
              </View>
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={styles.listContent}
      />
    </ThemedView>
  );
};

export default RenderFavoritePodcasts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    
  },
  emptyText: {
    textAlign: "center",
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 22,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
  listStyle: {
    padding: 15,
  },
  listContent: {
    paddingBottom: 24,
    gap: 15

  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderColor: "#ccc",
    borderRadius: 8,
    ...Platform.select({
      ios: {
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  itemDate: {
    fontSize: 14,
    alignSelf: "flex-end",
    color: Colors.universal.grayedOut,
  },
});
