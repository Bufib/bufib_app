import { LoadingIndicator } from "@/components/LoadingIndicator";
import NewsArticlePreviewCard from "@/components/NewsArticlePreviewCard";
import { NewsItem } from "@/components/NewsItem";
import PodcastPreviewCard from "@/components/PodcastPreviewCard";
import RetryButton from "@/components/RetryButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { NewsArticlesType, NewsType, PodcastType } from "@/constants/Types";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNews } from "@/hooks/useNews";
import { useNewsArticles } from "@/hooks/useNewsArticles";
import { usePodcasts } from "@/hooks/usePodcasts";
import { useAuthStore } from "@/stores/authStore";
import handleOpenExternalUrl from "@/utils/handleOpenExternalUrl";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const { t } = useTranslation();
  const { language } = useLanguage();
  const isAdmin = useAuthStore((state) => state.isAdmin);

  const {
    data: newsArticlesData,
    isLoading: newsArticlesIsLoading,
    isError: newsArticlesIsError,
    error: newsArticlesError,
    fetchNextPage: newsArticlesFetchNextPage,
    hasNextPage: newsArticlesHasNextPage,
    isFetchingNextPage: newsArticlesIsFetchingNextPage,
  } = useNewsArticles(language || "de");

  const {
    data: newsData,
    isLoading: newsIsLoading,
    isError: newsIsError,
    error: newsError,
    fetchNextPage: newsfetchNextPage,
    hasNextPage: newHasNextPage,
    isFetchingNextPage: newsIsFetchingNextPage,
  } = useNews(language || "de");

  const {
    data: podcastPages,
    isLoading: podcastsLoading,
    isError: podcastsError,
    error: podcastsErrorObj,
    fetchNextPage: podcastsFetchNextPage,
    hasNextPage: podcastsHasNextPage,
    isFetchingNextPage: podcastsIsFetchingNextPage,
  } = usePodcasts(language || "de");

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
            <ThemedText type="titleSmall" style={styles.titleShadow}>
              {t("newsArticlesTitle")}
            </ThemedText>

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
            <ThemedText type="titleSmall" style={styles.titleShadow}>
              {t("podcastsTitle")}
            </ThemedText>

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
                        pathname: "/(podcast)",
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
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <ThemedText
              type="titleSmall"
              style={[{ color: Colors.universal.third }, styles.titleShadow]}
            >
              {t("newsTitle")}
            </ThemedText>
            {isAdmin && (
              <Ionicons
                name="add-circle-outline"
                size={35}
                color={colorScheme === "dark" ? "#fff" : "#000"}
                style={{ color: Colors[colorScheme].defaultIcon }}
                onPress={() => router.push("/(addNews)/")}
              />
            )}
          </View>
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
                  images_url={item.images_url}
                  internal_urls={item.internal_urls}
                  external_urls={item.external_urls}
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
    gap: 40,
  },
  newsArticleContainer: {
    flex: 1,
    gap: 15,
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
    gap: 10,
  },
  podcastContainer: {
    flex: 1,
    gap: 15,
  },
  newsContainer: {
    flex: 1,
    gap: 15,
  },
  titleShadow: {
    ...Platform.select({
      ios: {
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 5,
      },
    }),
  },
});
