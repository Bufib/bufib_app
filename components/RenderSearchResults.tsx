import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  useColorScheme,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import debounce from "lodash.debounce";
import { SafeAreaView } from "react-native-safe-area-context";
import { searchQuestions, searchPrayers } from "@/utils/bufibDatabase";
import { useSearchPodcasts } from "@/hooks/useSearchPodcasts";
import { useSearchNewsArticles } from "@/hooks/useSearchNewsArticles";
import {
  PodcastType,
  NewsArticlesType,
  CombinedResult,
  PrayerType,
  QuestionType,
} from "@/constants/Types";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "./ThemedText";
import { AntDesign, Entypo, FontAwesome5 } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";

const SearchScreen = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [questionAndPrayerResults, setQuestionAndPrayerResults] = useState<
    CombinedResult[]
  >([]);
  const [combinedDisplayResults, setCombinedDisplayResults] = useState<
    CombinedResult[]
  >([]);
  const [manualLoading, setManualLoading] = useState<boolean>(false);
  const colorScheme = useColorScheme() || "light";
  const podcastQuery = useSearchPodcasts(searchTerm);
  const newsArticleSearchQuery = useSearchNewsArticles(searchTerm); // Added
  const { t } = useTranslation();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const performManualSearch = async (term: string) => {
    if (term.trim().length === 0) {
      setQuestionAndPrayerResults([]);
      return;
    }

    setManualLoading(true);
    try {
      const questionResults = await searchQuestions(term);
      const prayerResults = await searchPrayers(term);

      const questionsTagged: CombinedResult[] = questionResults.map(
        (q: QuestionType) => ({
          renderId: `question-${q.id}`,
          type: "question",
          questionId: q.id,
          question: q.question,
          title: q.title,
          question_category_name: q.question_category_name,
          question_subcategory_name: q.question_subcategory_name,
        })
      );

      const prayersTagged: CombinedResult[] = prayerResults.map(
        (p: PrayerType) => ({
          renderId: `prayer-${p.id}`,
          prayerId: p.id,
          type: "prayer",
          name: p.name,
          arabic_text: p.arabic_text,
        })
      );

      setQuestionAndPrayerResults([...questionsTagged, ...prayersTagged]);
    } catch (err) {
      console.error("Error running combined manual search:", err);
      setQuestionAndPrayerResults([]);
    } finally {
      setManualLoading(false);
    }
  };

  // animate opacity on mount
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  const debouncedManualSearch = useCallback(
    debounce(performManualSearch, 300),
    []
  );

  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      debouncedManualSearch(searchTerm);
    } else {
      setQuestionAndPrayerResults([]);
    }
    return () => {
      debouncedManualSearch.cancel();
    };
  }, [searchTerm, debouncedManualSearch]);

  useEffect(() => {
    const podcastsData = podcastQuery.data || [];
    const podcastsTagged: CombinedResult[] = podcastsData.map(
      (p: PodcastType) => ({
        renderId: `podcast-${p.id}`,
        podcastId: p.id,
        type: "podcast",
        podcastEpisodeTitle: p.title,
        podcastEpisodeDescription: p.description,
        podcast: p,
      })
    );

    const newsArticlesData = newsArticleSearchQuery.data || [];
    const newsArticlesTagged: CombinedResult[] = newsArticlesData.map(
      (na: NewsArticlesType) => ({
        renderId: `newsArticle-${na.id}`,
        newsArticleId: na.id,
        type: "newsArticle",
        newsTitle: na.title,
        newsSnippet:
          na.title ||
          (na.content ? na.content.substring(0, 100) + "..." : undefined),
      })
    );

    if (searchTerm.trim().length === 0) {
      setCombinedDisplayResults([]);
    } else {
      setCombinedDisplayResults([
        ...questionAndPrayerResults,
        ...podcastsTagged,
        ...newsArticlesTagged, // Added
      ]);
    }
  }, [
    searchTerm,
    questionAndPrayerResults,
    podcastQuery.data,
    newsArticleSearchQuery.data, // Added
  ]);

  const isLoading =
    manualLoading ||
    podcastQuery.isFetching ||
    newsArticleSearchQuery.isFetching; // Added

  const renderItem = ({ item }: { item: CombinedResult }) => {
    let itemTextContent = "";
    let itemTypeText = "";

    switch (item.type) {
      case "question":
        itemTypeText = "Question";
        itemTextContent = item.question || item.title || "";
        break;
      case "prayer":
        itemTypeText = "Prayer";
        itemTextContent = item.name || item.arabic_text || "";
        break;
      case "podcast":
        itemTypeText = "Podcast Episode";
        itemTextContent = item.podcastEpisodeTitle || "";
        break;
      case "newsArticle":
        itemTypeText = "News Article";
        itemTextContent = item.newsTitle || "";
        break;
      default:
        itemTextContent = "";
    }

    return (
      <TouchableOpacity
        style={[
          styles.itemContainer,
          { backgroundColor: Colors[colorScheme].contrast },
        ]}
        onPress={() => {
          if (item.type === "question") {
            router.push({
              pathname: "/(displayQuestion)",
              params: {
                category: item.question_category_name,
                subcategory: item.question_subcategory_name,
                questionId: item.questionId,
                questionTitle: item.title,
              },
            });
          } else if (item.type === "prayer") {
            router.push({
              pathname: "/[prayer]",
              params: { prayer: item.prayerId.toString() },
            });
          } else if (item.type === "podcast") {
            router.push({
              pathname: "/(podcast)",
              params: { podcast: JSON.stringify(item.podcast) },
            });
          } else if (item.type === "newsArticle") {
            router.push({
              pathname: "/(newsArticle)",
              params: { articleId: item.newsArticleId },
            });
          }
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingRight: 5,
            marginBottom: 5,
          }}
        >
          <ThemedText
            style={[
              styles.itemType,
              { color: Colors[colorScheme].itemTypeColor },
            ]}
          >
            {itemTypeText}
          </ThemedText>
          {itemTypeText === "Question" ? (
            <AntDesign
              name="search1"
              size={24}
              color={Colors[colorScheme].defaultIcon}
            />
          ) : itemTypeText === "Prayer" ? (
            <Entypo
              name="open-book"
              size={24}
              color={Colors[colorScheme].defaultIcon}
            />
          ) : itemTypeText === "Podcast Episode" ? (
            <FontAwesome5
              name="headphones"
              size={24}
              color={Colors[colorScheme].defaultIcon}
            />
          ) : (
            <Entypo
              name="news"
              size={24}
              color={Colors[colorScheme].defaultIcon}
            />
          )}
        </View>

        <ThemedText style={styles.itemText}>{itemTextContent}</ThemedText>
        {item.type === "podcast" && item.podcastEpisodeDescription && (
          <ThemedText style={styles.itemDescription}>
            {item.podcastEpisodeDescription}
          </ThemedText>
        )}
        {item.type === "newsArticle" &&
          item.newsSnippet && ( // Added
            <ThemedText style={styles.itemDescription}>
              {item.newsSnippet}
            </ThemedText>
          )}
      </TouchableOpacity>
    );
  };

  return (
    <Animated.View
      style={{
        flex: 1,
        opacity: fadeAnim,
      }}
    >
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: Colors[colorScheme].background },
        ]}
        edges={["top"]}
      >
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: Colors[colorScheme].contrast,
              color: Colors[colorScheme].text,
            },
          ]}
          placeholder={t("searchPlaceholder")}
          value={searchTerm}
          onChangeText={setSearchTerm}
          autoCorrect={false}
          autoCapitalize="none"
        />

        {isLoading && (
          <ActivityIndicator
            style={{ marginVertical: 12 }}
            size="small"
            color="#555"
          />
        )}

        <FlatList
          data={combinedDisplayResults}
          keyExtractor={(item, index) => item.renderId}
          renderItem={renderItem}
          ListEmptyComponent={
            !isLoading && searchTerm.trim().length > 0 ? (
              <ThemedText style={styles.emptyText}>
                {t("noSearchResults")}
              </ThemedText>
            ) : null
          }
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </Animated.View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    gap: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    marginBottom: 12,
  },
  itemContainer: {
    marginBottom: 16,
    padding: 10,
    borderRadius: 10,
  },
  itemType: {
    fontSize: 12,
    marginBottom: 4,
    fontWeight: "bold",
  },
  itemText: {
    fontSize: 16,
  },
  itemDescription: {
    fontSize: 14,
    marginTop: 4,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
  },
});
