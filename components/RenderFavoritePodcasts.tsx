// import React, { useEffect, useState, useMemo } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   FlatList,
//   ActivityIndicator,
//   TouchableOpacity,
//   useColorScheme,
//   Platform,
// } from "react-native";
// import { usePodcasts } from "@/hooks/usePodcasts";
// import { getFavoritePodcasts } from "@/utils/favorites";
// import { LanguageCode, PodcastType } from "@/constants/Types";
// import { router, useFocusEffect } from "expo-router";
// import { useRefreshFavorites } from "@/stores/refreshFavoriteStore";
// import { useLanguage } from "@/contexts/LanguageContext";
// import { ThemedView } from "./ThemedView";
// import { ThemedText } from "./ThemedText";
// import { useTranslation } from "react-i18next";
// import { Colors } from "@/constants/Colors";
// import { Entypo } from "@expo/vector-icons";
// import { formatDate } from "@/utils/formatDate";
// import { LoadingIndicator } from "./LoadingIndicator";

// const RenderFavoritePodcasts = () => {
//   const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
//   const { lang, rtl } = useLanguage();
//   const [error, setError] = useState<string | null>(null);
//   const [pagesRequested, setPagesRequested] = useState(0);
//   const {
//     data: infiniteData,
//     isLoading,
//     isError,
//     hasNextPage,
//     isFetchingNextPage,
//     fetchNextPage,
//   } = usePodcasts(lang);

//   const { favoritesRefreshed, triggerRefreshFavorites } =
//     useRefreshFavorites();
//   const colorScheme = useColorScheme() || "light";
//   const { t } = useTranslation();
//   // 1) Load favorite IDs from AsyncStorage on mount
//   useEffect(() => {
//     const loadFavorites = async () => {
//       try {
//         const ids = await getFavoritePodcasts();
//         setFavoriteIds(ids);
//       } catch (error) {
//         console.error("Error loading favorite podcasts:", error);
//       }
//     };
//     loadFavorites();
//   }, [favoritesRefreshed, lang]);

//   // 2) Flatten all loaded pages into a single array of PodcastType
//   const allEpisodes = useMemo<PodcastType[]>(() => {
//     if (!infiniteData || !infiniteData.pages) return [];
//     return infiniteData.pages.flat();
//   }, [infiniteData, lang]);

//   // 3) Filter to only those episodes whose ID is in favoriteIds
//   const favoriteEpisodes = useMemo(() => {
//     if (!allEpisodes.length || !favoriteIds.length) return [];
//     const idSet = new Set(favoriteIds.map(Number)); // normalize
//     return allEpisodes.filter((ep) => idSet.has(Number(ep.id)));
//   }, [allEpisodes, favoriteIds, lang]);

//   const listExtraData = useMemo(
//     () => ({ favKey: favoriteIds.join(","), bump: favoritesRefreshed }),
//     [favoriteIds, favoritesRefreshed, lang]
//   );

//   useEffect(() => {
//     setPagesRequested(0);
//   }, [lang, favoritesRefreshed]);

//   useEffect(() => {
//     const needMore =
//       favoriteIds.length > 0 &&
//       favoriteEpisodes.length < favoriteIds.length &&
//       hasNextPage &&
//       !isFetchingNextPage &&
//       pagesRequested < 3; // small safety cap

//     if (needMore) {
//       setPagesRequested((p) => p + 1);
//       fetchNextPage();
//     }
//   }, [
//     favoriteIds,
//     favoriteEpisodes.length,
//     hasNextPage,
//     isFetchingNextPage,
//     fetchNextPage,
//     pagesRequested,
//     lang,
//   ]);

//   // If still loading the first page of episodes, show a spinner
//   if (isLoading) {
//     return (
//       <ThemedView style={styles.centeredContainer}>
//         <LoadingIndicator size="large" />
//       </ThemedView>
//     );
//   }

//   // If there was an error fetching episodes at all
//   if (isError) {
//     return (
//       <ThemedView style={styles.centeredContainer}>
//         <ThemedText style={styles.errorText}>{t("error")}</ThemedText>
//       </ThemedView>
//     );
//   }

//   // 4) If there are no favorites
//   if (favoriteIds.length === 0) {
//     return (
//       <ThemedView style={styles.centeredContainer}>
//         <ThemedText style={styles.emptyText}>{t("noFavorites")}</ThemedText>
//       </ThemedView>
//     );
//   }

//   // 5) Otherwise, render the list of favorite episodes
//   return (
//     <ThemedView style={styles.container}>
//       <FlatList
//         data={favoriteEpisodes}
//         extraData={listExtraData}
//         keyExtractor={(item) => item.id.toString()}
//         style={styles.listStyle}
//         renderItem={({ item }) => {
//           return (
//             <TouchableOpacity
//               style={[
//                 styles.itemContainer,
//                 {
//                   backgroundColor: Colors[colorScheme].contrast,
//                   flexDirection: rtl ? "row-reverse" : "row",
//                 },
//               ]}
//               onPress={() => {
//                 router.push({
//                   pathname: "/(podcast)/indexPodcast",
//                   params: {
//                     podcast: JSON.stringify(item),
//                   },
//                 });
//               }}
//             >
//               <View style={{ flex: 1, gap: 40 }}>
//                 <ThemedText style={styles.itemTitle}>{item.title}</ThemedText>
//                 <ThemedText style={styles.itemDate}>
//                   {formatDate(item.created_at)}
//                 </ThemedText>
//               </View>

//               <View>
//                 <Entypo
//                   name="chevron-thin-right"
//                   size={24}
//                   color={colorScheme === "dark" ? "#fff" : "#000"}
//                   style={{ marginTop: -15 }}
//                 />
//               </View>
//             </TouchableOpacity>
//           );
//         }}
//         contentContainerStyle={styles.flatListContent}
//       />
//     </ThemedView>
//   );
// };

// export default RenderFavoritePodcasts;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },

//   centeredContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 20,
//   },
//   emptyText: {
//     textAlign: "center",
//     fontWeight: "500",
//     fontSize: 16,
//     lineHeight: 22,
//   },
//   errorText: {
//     fontSize: 16,
//     color: "red",
//     textAlign: "center",
//   },
//   listStyle: {
//     padding: 15,
//   },
//   flatListContent: {
//     paddingTop: 15,
//     gap: 20,
//     paddingBottom: 24,
//   },
//   itemContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: 15,
//     borderRadius: 8,
//     ...Platform.select({
//       ios: {
//         shadowOffset: {
//           width: 0,
//           height: 2,
//         },
//         shadowOpacity: 0.1,
//         shadowRadius: 2,
//       },
//       android: {
//         elevation: 5,
//       },
//     }),
//   },
//   itemTitle: {
//     fontSize: 16,
//     fontWeight: "500",
//   },
//   itemDate: {
//     fontSize: 14,
//     alignSelf: "flex-end",
//     color: Colors.universal.grayedOut,
//   },
// });

// src/components/PodcastFavoritesScreen.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";
import { PodcastType } from "@/constants/Types";
import { getFavoritePodcasts } from "@/utils/favorites"; // <-- per-language version
import { useLanguage } from "@/contexts/LanguageContext";
import { useRefreshFavorites } from "@/stores/refreshFavoriteStore";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { Colors } from "@/constants/Colors";
import { Entypo } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { formatDate } from "@/utils/formatDate";

export default function RenderFavoritePodcasts() {
  const { lang, rtl } = useLanguage();
  const { favoritesRefreshed } = useRefreshFavorites(); // triggers when user toggles a favorite elsewhere
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";

  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const favKey = useMemo(() => favoriteIds.join(","), [favoriteIds]);

  // Load favorite IDs from storage (scoped per language)
  useEffect(() => {
    (async () => {
      const ids = await getFavoritePodcasts(lang);
      setFavoriteIds(ids);
    })();
  }, [lang, favoritesRefreshed]);

  // Fetch favorite episodes by ID directly (no pagination dance)
  const {
    data: favoriteEpisodes = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["favorite-episodes", lang, favKey],
    enabled: favoriteIds.length > 0,
    queryFn: async (): Promise<PodcastType[]> => {
      const ids = favoriteIds.map(Number);
      const { data, error } = await supabase
        .from("podcasts")
        .select("*")
        .eq("language_code", lang)
        .in("id", ids)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    retry: 3,
    staleTime: 12 * 60 * 60 * 1000, // 12 hours
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7 days
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    
  });

  // Pull-to-refresh (optional but handy)
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    // Reload IDs in case user changed favorites while this screen was open
    const ids = await getFavoritePodcasts(lang);
    setFavoriteIds(ids);
    await refetch();
    setRefreshing(false);
  };

  // Loading first data
  if (isLoading && favoriteIds.length > 0) {
    return (
      <ThemedView style={styles.centeredContainer}>
        <LoadingIndicator size="large" />
      </ThemedView>
    );
  }

  // Error state
  if (isError) {
    return (
      <ThemedView style={styles.centeredContainer}>
        <ThemedText style={styles.errorText}>{t("error")}</ThemedText>
      </ThemedView>
    );
  }

  // No favorites stored (or none returned)
  if (favoriteIds.length === 0 || favoriteEpisodes.length === 0) {
    return (
      <ThemedView style={styles.centeredContainer}>
        <ThemedText style={styles.emptyText}>{t("noFavorites")}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={favoriteEpisodes}
        keyExtractor={(item) => String(item.id)}
        refreshing={refreshing || isFetching}
        onRefresh={onRefresh}
        contentContainerStyle={styles.flatListContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.itemContainer,
              {
                backgroundColor: Colors[colorScheme].contrast,
                flexDirection: rtl ? "row-reverse" : "row",
              },
            ]}
            onPress={() =>
              router.push({
                pathname: "/(podcast)/indexPodcast",
                params: { podcast: JSON.stringify(item) },
              })
            }
          >
            <View style={{ flex: 1, gap: 40 }}>
              <ThemedText style={styles.itemTitle}>{item.title}</ThemedText>
              <ThemedText style={styles.itemDate}>
                {formatDate(item.created_at)}
              </ThemedText>
            </View>
            <Entypo
              name="chevron-thin-right"
              size={24}
              color={colorScheme === "dark" ? "#fff" : "#000"}
              style={{ marginTop: -15 }}
            />
          </TouchableOpacity>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  flatListContent: {
    paddingTop: 15,
    gap: 20,
    paddingBottom: 24,
    paddingHorizontal: 15,
  },
  itemContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderRadius: 8,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: { elevation: 5 },
    }),
  },
  itemTitle: { fontSize: 16, fontWeight: "500" },
  itemDate: {
    fontSize: 14,
    alignSelf: "flex-end",
    color: Colors.universal.grayedOut,
  },
  emptyText: {
    textAlign: "center",
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 22,
  },
  errorText: { fontSize: 16, color: "red", textAlign: "center" },
});
