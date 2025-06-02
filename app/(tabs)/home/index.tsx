import React from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  useColorScheme,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import NewsArticlePreviewCard from "@/components/NewsArticlePreviewCard";
import { ThemedText } from "@/components/ThemedText";
import { useNewsArticles } from "@/hooks/useNewsArticles";
import { NewsArticlesType, NewsType, PodcastType } from "@/constants/Types";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import RetryButton from "@/components/RetryButton";
import { Colors } from "@/constants/Colors";
import handleOpenExternalUrl from "@/utils/handleOpenExternalUrl";
import { router } from "expo-router";
import { useNews } from "@/hooks/useNews";
import { PodcastPreviewCard } from "@/components/PodcastPreviewCard";
import { usePodcasts } from "@/hooks/usePodcasts";
import { useLanguage } from "@/contexts/LanguageContext";
import { NewsItem } from "@/components/NewsItem";
import { ThemedView } from "@/components/ThemedView";

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const { t } = useTranslation();
  const { language } = useLanguage();

  const {
    data: newsArticlesData,
    isLoading: newsArticlesIsLoading,
    isError: newsArticlesIsError,
    error: newsArticlesError,
    fetchNextPage: newsArticlesFetchNextPage,
    hasNextPage: newsArticlesHasNextPage,
    isFetchingNextPage: newsArticlesIsFetchingNextPage,
  } = useNewsArticles(language);

  const {
    data: newsData,
    isLoading: newsIsLoading,
    isError: newsIsError,
    error: newsError,
    fetchNextPage: newsfetchNextPage,
    hasNextPage: newHasNextPage,
    isFetchingNextPage: newsIsFetchingNextPage,
  } = useNews(language);

  const {
    data: podcastPages,
    isLoading: podcastsLoading,
    isError: podcastsError,
    error: podcastsErrorObj,
    fetchNextPage: podcastsFetchNextPage,
    hasNextPage: podcastsHasNextPage,
    isFetchingNextPage: podcastsIsFetchingNextPage,
  } = usePodcasts(language);

  // flatten paginated data
  const articles: NewsArticlesType[] = newsArticlesData?.pages.flat() ?? [];
  const news: NewsType[] = newsData?.pages.flat() ?? [];
  const podcasts: PodcastType[] = podcastPages?.pages.flat() ?? [];

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme].background },
      ]}
      edges={["top"]}
    >
      <ScrollView
        style={[
          styles.scrollStyles,
          { backgroundColor: Colors[colorScheme].background },
        ]}
        contentContainerStyle={styles.scrollContent}
      >
        {/* //!----------- News articles ----------- */}

        {articles.length > 0 && (
          <View style={styles.newsArticleContainer}>
            <ThemedText type="titleSmall">{t("newsArticlesTitle")}</ThemedText>

            {newsArticlesIsLoading && (
              <LoadingIndicator style={{ marginVertical: 20 }} size="large" />
            )}

            {newsArticlesIsError && (
              <View style={styles.errorContainer}>
                <Text
                  style={[
                    styles.errorText,
                    { color: Colors[colorScheme].error },
                  ]}
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
                      item.is_external_link
                        ? handleOpenExternalUrl(item.external_link_url || "")
                        : router.push({
                            pathname: "/(newsArticle)",
                            params: {
                              articleId: item.id,
                            },
                          })
                    }
                  >
                    <NewsArticlePreviewCard
                      title={item.title}
                      is_external_link={item.is_external_link}
                      created_at={item.created_at}
                    />
                  </TouchableOpacity>
                )}
                showsHorizontalScrollIndicator={false}
                onEndReached={() => {
                  if (
                    newsArticlesHasNextPage &&
                    !newsArticlesIsFetchingNextPage
                  ) {
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
        )}

        {/* //!-------- Podcasts Section -------- */}

        {podcasts.length > 0 && (
          <View style={styles.podcastContainer}>
            <ThemedText type="titleSmall">{t("podcastsTitle")}</ThemedText>

            {podcastsLoading && (
              <LoadingIndicator style={{ marginVertical: 20 }} size="large" />
            )}

            {podcastsError && (
              <View style={styles.errorContainer}>
                <Text
                  style={[
                    styles.errorText,
                    { color: Colors[colorScheme].error },
                  ]}
                >
                  {podcastsErrorObj?.message ?? t("errorLoadingData")}
                </Text>
                <RetryButton onPress={() => podcastsFetchNextPage()} />
              </View>
            )}

            {!podcastsLoading && !podcastsError && (
              <FlatList
                horizontal
                contentContainerStyle={styles.flatListContentContainer}
                data={podcasts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: "/home/podcast",
                        params: {
                          podcast: JSON.stringify(item),
                        },
                      })
                    }
                  >
                    <PodcastPreviewCard podcast={item} />
                  </TouchableOpacity>
                )}
                showsVerticalScrollIndicator={false}
                onEndReached={() => {
                  if (podcastsHasNextPage && !podcastsIsFetchingNextPage) {
                    podcastsFetchNextPage();
                  }
                }}
                onEndReachedThreshold={0.5}
                ListFooterComponent={() =>
                  podcastsIsFetchingNextPage ? (
                    <LoadingIndicator size="small" />
                  ) : null
                }
              />
            )}
          </View>
        )}

        {/* //!----------- News ----------- */}
        <View style={styles.newsContainer}>
          <ThemedText type="titleSmall">{t("newsTitle")}</ThemedText>
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

          {news.length === 0 && (
            <ThemedView style={styles.newsEmptyContainer}>
              <ThemedText style={styles.newsEmptyText} type="subtitle">
                {t("newsEmpty")}
              </ThemedText>
            </ThemedView>
          )}

          {!newsIsLoading && !newsIsError && (
            <View style={styles.flatListContentContainer}>
              {/* Render each item */}
              {news.map((item, index) => (
                <NewsItem
                  key={item.id.toString()}
                  id={item.id}
                  language_code={item.language_code}
                  is_pinned={item.is_pinned}
                  title={item.title}
                  content={item.content}
                  created_at={item.created_at}
                />
              ))}

              {/* Trigger next-page fetch when the user scrolls near the bottom */}
              <View
                onLayout={({ nativeEvent }) => {
                  const { height } = nativeEvent.layout;

                  if (newHasNextPage && !newsIsFetchingNextPage) {
                    newsfetchNextPage();
                  }
                }}
              />

              {newsIsFetchingNextPage && <LoadingIndicator size="small" />}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollStyles: {
    padding: 15,
  },
  scrollContent: {
    gap: 20,
  },
  newsArticleContainer: {
    flex: 1,
    gap: 10,
  },
  newsEmptyContainer: {
    flex: 1,
    justifyContent: "center",
    marginTop: 20,
  },
  newsEmptyText: {
    textAlign: "center",
  },
  errorContainer: {
    alignItems: "center",
    gap: 10,
  },
  errorText: {
    fontSize: 20,
  },
  flatListContentContainer: {
    gap: 20,
  },
  podcastContainer: {
    flex: 1,
    gap: 10,
  },
  newsContainer: {
    flex: 1,
    gap: 10,
  },
});
