import {
  StyleSheet,
  View,
  ScrollView,
  useColorScheme,
  TouchableOpacity,
  Text,
  FlatList,
  Platform,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { getFavoriteNewsArticle } from "@/utils/favorites";
import { useNewsArticles } from "@/hooks/useNewsArticles";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import { NewsArticlesType } from "@/constants/Types";
import Entypo from "@expo/vector-icons/Entypo";
import { router } from "expo-router";
import { useRefreshFavorites } from "@/stores/refreshFavoriteStore";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import { ThemedView } from "./ThemedView";
import { formatDate } from "@/utils/formatDate";
import { LoadingIndicator } from "./LoadingIndicator";

const RenderFavoriteNewsArticles = () => {
  const [articles, setArticles] = useState<NewsArticlesType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language, isArabic } = useLanguage();
  const { t } = useTranslation();
  const { fetchNewsArticleById } = useNewsArticles(language);
  const colorScheme = useColorScheme() || "light";
  const { refreshTriggerFavorites } = useRefreshFavorites();

  const loadFavorites = useCallback(async () => {
    console.log(
      "FavoriteNewsArticles: Reloading favorites due to trigger change or mount."
    );
    try {
      setIsLoading(true);
      const ids = (await getFavoriteNewsArticle()) || [];
      // setArticleIds(ids); // You might not need to store ids in state separately
      const fetched = await Promise.all(
        ids.map((id) => fetchNewsArticleById(id))
      );
      setArticles(fetched.filter((a): a is NewsArticlesType => !!a));
      setError(null);
    } catch (err) {
      console.error("Error in loadFavorites:", err);
      setError("Could not load favorite articles.");
      setArticles([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFavorites();
  }, [refreshTriggerFavorites, loadFavorites]);
  if (isLoading) {
    return (
      <ThemedView style={styles.centered}>
        <LoadingIndicator size="large" />
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText style={styles.errorText}>{error}</ThemedText>
      </ThemedView>
    );
  }

  if (articles.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.emptyText}>{t("noFavorites")}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={articles}
        extraData={refreshTriggerFavorites}
        keyExtractor={(item) => item.id.toString()}
        style={styles.listStyle}
        renderItem={({ item }) => (
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
                pathname: "/(newsArticle)",
                params: { articleId: item.id.toString() },
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
        )}
        contentContainerStyle={styles.listContent}
      />
    </ThemedView>
  );
};

export default RenderFavoriteNewsArticles;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
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
  listStyle: {
    padding: 15,
  },
  listContent: {
    paddingBottom: 24,
  },
  itemContainer: {
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
