// src/screens/HomeScreen.tsx
import React from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  ActivityIndicator,
  Button,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import NewsArticle from "@/components/NewsArticle";
import { ThemedText } from "@/components/ThemedText";
import { useNewsArticles } from "@/hooks/useNewsArticles";
import { NewsArticlesType } from "@/constants/Types";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import RetryButton from "@/components/RetryButton";
import { Colors } from "@/constants/Colors";

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const { t } = useTranslation();
  const {
    data: articles = [],
    isLoading,
    isError,
    refetch,
  } = useNewsArticles();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.newsArticleContainer}>
        <ThemedText type="title">{t("newsArticles")}</ThemedText>

        {isLoading && (
          <LoadingIndicator style={{ marginVertical: 20 }} size="large" />
        )}

        {!isError && (
          <View style={styles.errorContainer}>
            <Text
              style={[styles.errorText, { color: Colors[colorScheme].error }]}
            >
              {t("errorLoadingData")}
            </Text>
            <RetryButton onPress={() => refetch()} />
          </View>
        )}

        {!isLoading && !isError && (
          <FlatList
            horizontal
            data={articles}
            keyExtractor={(item: NewsArticlesType) => item.id.toString()}
            renderItem={({ item }: { item: NewsArticlesType }) => (
              <NewsArticle
                title={item.title}
                externalLink={item.externalLink}
              />
            )}
            showsHorizontalScrollIndicator={false}
          />
        )}
      </View>

      <View style={styles.newsContainer}>
        <Text>{t("welcomeMessage")}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  newsArticleContainer: {
    flex: 1,
    gap: 10,
  },
  errorContainer: {
    alignItems: "center",
    gap: 10,
  },
  errorText: {
    fontSize: 20,
  },
  newsContainer: {
    flex: 1,
    marginTop: 20,
  },
});
