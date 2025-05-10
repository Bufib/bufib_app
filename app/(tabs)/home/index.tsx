import React from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  useColorScheme,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import NewsArticlePreviewCard from "@/components/NewsArticlePreviewCard";
import { ThemedText } from "@/components/ThemedText";
import { useNewsArticles } from "@/hooks/useNewsArticles";
import { NewsArticlesType } from "@/constants/Types";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import RetryButton from "@/components/RetryButton";
import { Colors } from "@/constants/Colors";
import handleOpenExternalUrl from "@/utils/handleExternalLink";
import { router } from "expo-router";
import { useNews } from "@/hooks/useNews";

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const { t } = useTranslation();

  const {
    data: newsArticlesData,
    isLoading: newsArticlesIsLoading,
    isError: newsArticlesIsError,
    error: newsArticlesError,
    fetchNextPage: newsArticlesFetchNextPage,
    hasNextPage: newsArticlesHasNextPage,
    isFetchingNextPage: newsArticlesIsFetchingNextPage,
  } = useNewsArticles();

  const {
    data: newsData,
    isLoading: newsIsLoading,
    isError: newsIsError,
    error: newsError,
    fetchNextPage: newsfetchNextPage,
    hasNextPage: newHasNextPage,
    isFetchingNextPage: newsIsFetchingNextPage,
  } = useNews();
  // flatten paginated data
  const articles: NewsArticlesType[] = newsArticlesData?.pages.flat() ?? [];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.newsArticleContainer}>
        <ThemedText type="title">{t("newsArticles")}</ThemedText>

        {newsArticlesIsLoading && (
          <LoadingIndicator style={{ marginVertical: 20 }} size="large" />
        )}

        {newsArticlesIsError && (
          <View style={styles.errorContainer}>
            <Text
              style={[styles.errorText, { color: Colors[colorScheme].error }]}
            >
              {newsArticlesError?.message ?? t("errorLoadingData")}
            </Text>
            <RetryButton onPress={() => newsArticlesFetchNextPage()} />
          </View>
        )}

        {!newsArticlesIsLoading && !newsArticlesIsError && (
          <FlatList
            horizontal
            contentContainerStyle={styles.flatListContentContainer}
            data={articles}
            keyExtractor={(item: NewsArticlesType) => item.id.toString()}
            renderItem={({ item }: { item: NewsArticlesType }) => (
              <TouchableOpacity
                onPress={() =>
                  item.isExternalLink
                    ? handleOpenExternalUrl(item.externalLink || "")
                    : router.push({
                        pathname: "/(tabs)/home/newsArticle",
                        params: {
                          id: item.id,
                        },
                      })
                }
              >
                <NewsArticlePreviewCard
                  title={item.title}
                  isExternalLink={item.isExternalLink}
                />
              </TouchableOpacity>
            )}
            showsHorizontalScrollIndicator={false}
            onEndReached={() => {
              if (newsArticlesHasNextPage && !newsArticlesIsFetchingNextPage) {
                newsArticlesFetchNextPage();
              }
            }}
            onEndReachedThreshold={0.5}
            ListFooterComponent={() =>
              newsArticlesIsFetchingNextPage ? (
                <LoadingIndicator size="small" />
              ) : null
            }
          />
        )}
      </View>

      <View style={styles.newsContainer}>
        {newsIsLoading && (
          <LoadingIndicator style={{ marginVertical: 20 }} size="large" />
        )}

        {newsIsError && (
          <View style={styles.errorContainer}>
            <Text
              style={[styles.errorText, { color: Colors[colorScheme].error }]}
            >
              {newsError?.message ?? t("errorLoadingData")}
            </Text>
            <RetryButton onPress={() => newsfetchNextPage()} />
          </View>
        )}

        {!newsIsLoading && !newsIsError && (
          <FlatList
            horizontal
            contentContainerStyle={styles.flatListContentContainer}
            data={articles}
            keyExtractor={(item: NewsArticlesType) => item.id.toString()}
            renderItem={({ item }: { item: NewsArticlesType }) => (
              <NewsArticlePreviewCard
                title={item.title}
                isExternalLink={item.isExternalLink}
              />
            )}
            showsHorizontalScrollIndicator={false}
            onEndReached={() => {
              if (newHasNextPage && !newsArticlesIsFetchingNextPage) {
                newsfetchNextPage();
              }
            }}
            onEndReachedThreshold={0.5}
            ListFooterComponent={() =>
              newsIsFetchingNextPage ? <LoadingIndicator size="small" /> : null
            }
          />
        )}
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
  flatListContentContainer: {
    gap: 10,
  },
  newsContainer: {
    flex: 1,
    marginTop: 20,
  },
});
