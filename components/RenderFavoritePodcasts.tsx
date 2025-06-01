// import React, { useEffect, useState } from "react";
// import { StyleSheet, Text, View, FlatList } from "react-native";
// import { getFavoritePodcasts } from "@/utils/favorites";

// const RenderFavoritePodcasts = () => {
//   const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

//   useEffect(() => {
//     // Load all stored favorite podcast IDs when this component mounts
//     const loadFavorites = async () => {
//       try {
//         const ids = await getFavoritePodcasts();
//         setFavoriteIds(ids);
//       } catch (error) {
//         console.error("Error loading favorite podcasts:", error);
//       }
//     };

//     loadFavorites();
//   }, []);

//   // If there are no favorites, show a placeholder message
//   if (favoriteIds.length === 0) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.emptyText}>You have no favorite podcasts yet.</Text>
//       </View>
//     );
//   }

//   // Otherwise, render a FlatList of podcast IDs
//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Your Favorite Podcasts</Text>
//       <FlatList
//         data={favoriteIds}
//         keyExtractor={(item) => item.toString()}
//         renderItem={({ item }) => (
//           <View style={styles.itemContainer}>
//             <Text style={styles.itemText}>{item}</Text>
//             {/*
//               If you have a way to fetch podcast metadata (e.g. title, image) by ID,
//               you could swap this out for a custom component that fetches and displays details.
//             */}
//           </View>
//         )}
//         contentContainerStyle={styles.listContent}
//       />
//     </View>
//   );
// };

// export default RenderFavoritePodcasts;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//   },
//   header: {
//     fontSize: 20,
//     fontWeight: "600",
//     marginBottom: 12,
//   },
//   emptyText: {
//     fontSize: 16,
//     color: "#666",
//   },
//   listContent: {
//     paddingBottom: 24,
//   },
//   itemContainer: {
//     paddingVertical: 12,
//     borderBottomWidth: StyleSheet.hairlineWidth,
//     borderColor: "#ccc",
//   },
//   itemText: {
//     fontSize: 16,
//   },
// });

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
      <View style={styles.centered}>
        <Text style={styles.errorText}>Failed to load episodes.</Text>
      </View>
    );
  }

  // 4) If there are no favorites (or none of the favorites have been loaded yet), show placeholder
  if (favoriteIds.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>You have no favorite podcasts yet.</Text>
      </View>
    );
  }

  // 5) If we have favorite IDs but none of them appear in the loaded pages yet,
  //    prompt the user or trigger loading more pages until we either find them or run out.
  if (favoriteIds.length > 0 && favoriteEpisodes.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>
          We found your favorite IDs, but none are loaded yet.{"\n"}
          {hasNextPage ? (
            <Text style={styles.loadMoreText} onPress={() => fetchNextPage()}>
              Tap to load more episodes…
            </Text>
          ) : (
            "No more pages to load."
          )}
        </Text>
      </View>
    );
  }

  // 6) Otherwise, render the list of favorite episodes
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Favorite Podcasts</Text>
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
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemDate}>
              Published: {new Date(item.published_at).toLocaleDateString()}
            </Text>
            {/* If you want to enable “play from cache” or “download,” you can also show a button here that calls usePodcasts().download.mutate({ filename: item.filename }) */}
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
      />
      {hasNextPage && (
        <View style={styles.loadMoreContainer}>
          <Text style={styles.loadMoreText} onPress={() => fetchNextPage()}>
            Load more…
          </Text>
        </View>
      )}
    </View>
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
