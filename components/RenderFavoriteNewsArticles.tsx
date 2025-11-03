// import {
//   StyleSheet,
//   View,
//   ScrollView,
//   useColorScheme,
//   TouchableOpacity,
//   Text,
//   FlatList,
//   Platform,
// } from "react-native";
// import React, { useEffect, useState, useCallback } from "react";
// import { getFavoriteNewsArticle } from "@/utils/favorites";
// import { useNewsArticles } from "@/hooks/useNewsArticles";
// import { Colors } from "@/constants/Colors";
// import { ThemedText } from "@/components/ThemedText";
// import { LanguageCode, NewsArticlesType } from "@/constants/Types";
// import Entypo from "@expo/vector-icons/Entypo";
// import { router } from "expo-router";
// import { useRefreshFavorites } from "@/stores/refreshFavoriteStore";
// import { useTranslation } from "react-i18next";
// import { useLanguage } from "@/contexts/LanguageContext";
// import { ThemedView } from "./ThemedView";
// import { formatDate } from "@/utils/formatDate";
// import { LoadingIndicator } from "./LoadingIndicator";

// const RenderFavoriteNewsArticles = () => {
//   const [articles, setArticles] = useState<NewsArticlesType[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const { lang, rtl } = useLanguage();
//   const { t } = useTranslation();
//   const { fetchNewsArticleById } = useNewsArticles(lang);
//   const colorScheme = useColorScheme() || "light";
//   const { favoritesRefreshed } = useRefreshFavorites();

//   const loadFavorites = useCallback(async () => {
//     console.log(
//       "FavoriteNewsArticles: Reloading favorites due to trigger change or mount."
//     );
//     try {
//       setIsLoading(true);
//       const ids = (await getFavoriteNewsArticle()) || [];
//       // setArticleIds(ids); // You might not need to store ids in state separately
//       const fetched = await Promise.all(
//         ids.map((id) => fetchNewsArticleById(id))
//       );
//       setArticles(fetched.filter((a): a is NewsArticlesType => !!a));
//       setError(null);
//     } catch (err) {
//       console.error("Error in loadFavorites:", err);
//       setError("Could not load favorite articles.");
//       setArticles([]);
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     loadFavorites();
//   }, [favoritesRefreshed, loadFavorites]);
//   if (isLoading) {
//     return (
//       <ThemedView style={styles.centered}>
//         <LoadingIndicator size="large" />
//       </ThemedView>
//     );
//   }

//   if (error) {
//     return (
//       <ThemedView style={styles.centered}>
//         <ThemedText style={styles.errorText}>{error}</ThemedText>
//       </ThemedView>
//     );
//   }

//   if (articles.length === 0) {
//     return (
//       <ThemedView style={styles.centeredContainer}>
//         <ThemedText style={styles.emptyText}>{t("noFavorites")}</ThemedText>
//       </ThemedView>
//     );
//   }

//   return (
//     <ThemedView style={styles.container}>
//       <FlatList
//         data={articles}
//         extraData={favoritesRefreshed}
//         keyExtractor={(item) => item.id.toString()}
//         style={styles.listStyle}
//         contentContainerStyle={styles.flatListContent}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             style={[
//               styles.itemContainer,
//               {
//                 backgroundColor: Colors[colorScheme].contrast,
//                 flexDirection: rtl ? "row-reverse" : "row",
//               },
//             ]}
//             onPress={() => {
//               router.push({
//                 pathname: "/(newsArticle)",
//                 params: { articleId: item.id.toString() },
//               });
//             }}
//           >
//             <View style={{ flex: 1, gap: 40 }}>
//               <ThemedText style={styles.itemTitle}>{item.title}</ThemedText>

//               <ThemedText style={styles.itemDate}>
//                 {formatDate(item.created_at)}
//               </ThemedText>
//             </View>
//             <View>
//               <Entypo
//                 name="chevron-thin-right"
//                 size={24}
//                 color={colorScheme === "dark" ? "#fff" : "#000"}
//                 style={{ marginTop: -15 }}
//               />
//             </View>
//           </TouchableOpacity>
//         )}
//       />
//     </ThemedView>
//   );
// };

// export default RenderFavoriteNewsArticles;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   centered: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 15,
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

//   itemContainer: {
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: 15,
//     borderColor: "#ccc",
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
//   flatListContent: {
//     paddingTop: 15,
//     gap: 20,
//     paddingBottom: 24,
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

// src/components/NewsFavoritesScreen.tsx

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
import { NewsArticlesType } from "@/constants/Types";
import { getFavoriteNewsArticle } from "@/utils/favorites"; // per-language version
import { useLanguage } from "@/contexts/LanguageContext";
import { useRefreshFavorites } from "@/stores/refreshFavoriteStore";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { Colors } from "@/constants/Colors";
import Entypo from "@expo/vector-icons/Entypo";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { formatDate } from "@/utils/formatDate";
import { useDataVersionStore } from "@/stores/dataVersionStore";

export default function NewsFavoritesScreen() {
  const { lang, rtl } = useLanguage();
  const { favoritesRefreshed } = useRefreshFavorites();
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";
  const newsArticleVersion = useDataVersionStore((s) => s.newsArticleVersion);

  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const favKey = useMemo(() => favoriteIds.join(","), [favoriteIds]);
  console.log(newsArticleVersion)
  // Load favorite IDs from storage (scoped by language)
  useEffect(() => {
    (async () => {
      const ids = await getFavoriteNewsArticle(lang);
      setFavoriteIds(ids);
    })();
  }, [lang, favoritesRefreshed, newsArticleVersion]);

  // Fetch favorite news in one query
  const {
    data: favoriteNews = [],
    isLoading,
    isError,
  } = useQuery({
   queryKey: ["favorite-news", lang, favKey, newsArticleVersion],
    enabled: favoriteIds.length > 0,
    queryFn: async (): Promise<NewsArticlesType[]> => {
      const ids = favoriteIds.map(Number);
      const { data, error } = await supabase
        .from("news_articles")
        .select("*")
        .eq("language_code", lang) // keep language scope consistent
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

  const listExtraData = React.useMemo(
    () => `${lang}|${newsArticleVersion}|${colorScheme}`,
    [lang, newsArticleVersion, colorScheme]
  );
  
  if (isLoading && favoriteIds.length > 0) {
    return (
      <ThemedView style={styles.centered}>
        <LoadingIndicator size="large" />
      </ThemedView>
    );
  }

  if (isError) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText style={styles.errorText}>
          {t("errorLoadingData")}
        </ThemedText>
      </ThemedView>
    );
  }

  if (favoriteIds.length === 0 || favoriteNews.length === 0) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText style={styles.emptyText}>{t("noFavorites")}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={favoriteNews}
        extraData={listExtraData}
        keyExtractor={(item) => String(item.id)}
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
                pathname: "/(newsArticle)",
                params: { articleId: String(item.id) },
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
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
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
