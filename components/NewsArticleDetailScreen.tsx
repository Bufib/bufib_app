import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import Markdown from "react-native-markdown-display";
import {  Stack } from "expo-router";
import { useFontSizeStore } from "@/stores/fontSizeStore";
import { useNewsArticles } from "@/hooks/useNewsArticles";
import { NewsArticlesType } from "@/constants/Types";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { ThemedView } from "./ThemedView";

export default function NewsArticleDetailScreen({
  articleId,
}: {
  articleId?: string;
}) {
  const { fetchNewsArticleById } = useNewsArticles();
  const { fontSize, lineHeight } = useFontSizeStore();
  const colorScheme = useColorScheme() ?? "light";

  const [article, setArticle] = useState<NewsArticlesType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!articleId) {
      setError("Article ID is missing.");
      setIsLoading(false);
      return;
    }

    const loadArticle = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedArticle = await fetchNewsArticleById(parseInt(articleId));
        if (fetchedArticle) {
          setArticle(fetchedArticle);
        } else {
          setError("Article not found.");
        }
      } catch (e: any) {
        console.error("Error loading news article:", e);
        setError(e.message || "Failed to load the article.");
      } finally {
        setIsLoading(false);
      }
    };

    loadArticle();
  }, [articleId, fetchNewsArticleById]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Loading article...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Stack.Screen options={{ title: "Error" }} />
        <Text style={[styles.errorText, { color: Colors[colorScheme].error }]}>
          Error: {error}
        </Text>
      </View>
    );
  }

  if (!article) {
    return (
      <View style={styles.centered}>
        <Text>No article data found.</Text>
      </View>
    );
  }

  <Stack.Screen options={{ title: article.title || "Article" }} />;

  return (
    <ScrollView
      style={styles.scrollViewStyles}
      contentContainerStyle={styles.scrollViewContent}
      showsVerticalScrollIndicator={true}
    >
      <View style={styles.contentContainer}>
        <ThemedText type="title" style={styles.titleText}>
          {article.title}
        </ThemedText>
        <Markdown
          style={{
            body: {
              color: Colors[colorScheme].text,
              fontSize: fontSize,
              lineHeight: lineHeight,
            },
          }}
        >
          {article.content}
        </Markdown>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
  scrollViewStyles: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 50,
  },
  contentContainer: {
    padding: 15,
  },
  titleText: {
    marginBottom: 15,
  },
});
