import {
  StyleSheet,
  View,
  ScrollView,
  useColorScheme,
  TouchableOpacity,
  Text,
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
      <ThemedView style={styles.container}>
        <ThemedText>Loading favorites…</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>{error}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView
      style={[
        styles.scrollView,
        { backgroundColor: Colors[colorScheme].background },
      ]}
      contentContainerStyle={styles.scrollContent}
    >
      {articles.length > 0 ? (
        articles.map((article) => (
          <TouchableOpacity
            key={article.id}
            style={[
              styles.item,
              {
                backgroundColor: Colors[colorScheme].contrast,
                borderColor: Colors[colorScheme].border,
                alignItems: isArabic() ? "flex-end" : "flex-start",
              },
            ]}
            onPress={() => {
              router.push({
                pathname: "/(newsArticle)",
                params: {
                  articleId: article.id.toString(),
                },
              });
            }}
          >
            <ThemedText style={styles.title}>{article.title}</ThemedText>
            <ThemedText
              style={{
                alignSelf: isArabic() ? "flex-start" : "flex-end",
                color: Colors.universal.grayedOut,
              }}
            >
              {formatDate(article.created_at)}
            </ThemedText>
          </TouchableOpacity>
        ))
      ) : (
        <ThemedView style={styles.container}>
          <ThemedText>{t("noFavorites")}</ThemedText>
        </ThemedView>
      )}
    </ScrollView>
  );
};

export default RenderFavoriteNewsArticles;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    paddingTop: 10,
  },
  scrollContent: {
    gap: 10,
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  item: {
    flexDirection: "column",
    justifyContent: "space-between",
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    padding: 15,
    borderRadius: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "400",
    flex: 1,
    marginRight: 10,
  },
  createdAt: {},
});
