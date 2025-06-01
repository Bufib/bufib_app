// import React, { useState, useEffect, useCallback } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   FlatList,
//   StyleSheet,
//   ActivityIndicator,
// } from "react-native";
// import debounce from "lodash.debounce";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { searchQuestions, searchPrayers } from "@/utils/bufibDatabase";
// import { useSearchPodcasts } from "@/hooks/useSearchPodcasts";
// import { PodcastType } from "@/constants/Types";

// type CombinedResult = {
//   id: string;
//   type: "question" | "prayer" | "podcast";
//   question?: string;
//   title?: string;
//   name?: string;
//   arabic_text?: string;
//   podcastEpisodeTitle?: string;
//   podcastEpisodeDescription?: string;
// };

// const SearchScreen = () => {
//   const [searchTerm, setSearchTerm] = useState<string>("");
//   const [questionAndPrayerResults, setQuestionAndPrayerResults] = useState<
//     CombinedResult[]
//   >([]);
//   const [combinedDisplayResults, setCombinedDisplayResults] = useState<
//     CombinedResult[]
//   >([]);
//   const [manualLoading, setManualLoading] = useState<boolean>(false);

//   const podcastQuery = useSearchPodcasts(searchTerm);

//   const performManualSearch = async (term: string) => {
//     if (term.trim().length === 0) {
//       setQuestionAndPrayerResults([]);
//       return;
//     }

//     setManualLoading(true);
//     try {
//       const questionResults = await searchQuestions(term);
//       const prayerResults = await searchPrayers(term);

//       const questionsTagged: CombinedResult[] = questionResults.map(
//         (q: any) => ({
//           id: `question-${q.id}`,
//           type: "question",
//           question: q.question,
//           title: q.title,
//         })
//       );

//       const prayersTagged: CombinedResult[] = prayerResults.map((p: any) => ({
//         id: `prayer-${p.id}`,
//         type: "prayer",
//         name: p.name,
//         arabic_text: p.arabic_text,
//       }));

//       setQuestionAndPrayerResults([...questionsTagged, ...prayersTagged]);
//     } catch (err) {
//       console.error("Error running combined manual search:", err);
//       setQuestionAndPrayerResults([]);
//     } finally {
//       setManualLoading(false);
//     }
//   };

//   const debouncedManualSearch = useCallback(
//     debounce(performManualSearch, 300),
//     []
//   );

//   useEffect(() => {
//     if (searchTerm.trim().length > 0) {
//       debouncedManualSearch(searchTerm);
//     } else {
//       setQuestionAndPrayerResults([]);
//       // podcastQuery will also return empty/initialData due to `enabled` flag
//     }
//     return () => {
//       debouncedManualSearch.cancel();
//     };
//   }, [searchTerm, debouncedManualSearch]);

//   useEffect(() => {
//     const podcastsData = podcastQuery.data || [];
//     const podcastsTagged: CombinedResult[] = podcastsData.map(
//       (p: PodcastType) => ({
//         id: `podcast-${p.id}`,
//         type: "podcast",
//         podcastEpisodeTitle: p.title,
//         podcastEpisodeDescription: p.description,
//       })
//     );

//     if (searchTerm.trim().length === 0) {
//       setCombinedDisplayResults([]);
//     } else {
//       setCombinedDisplayResults([
//         ...questionAndPrayerResults,
//         ...podcastsTagged,
//       ]);
//     }
//   }, [searchTerm, questionAndPrayerResults, podcastQuery.data]);

//   const isLoading = manualLoading || podcastQuery.isFetching;

//   const renderItem = ({ item }: { item: CombinedResult }) => {
//     let itemTextContent = "";
//     let itemTypeText = "";

//     switch (item.type) {
//       case "question":
//         itemTypeText = "Question";
//         itemTextContent = item.question || item.title || "";
//         break;
//       case "prayer":
//         itemTypeText = "Prayer";
//         itemTextContent = item.name || item.arabic_text || "";
//         break;
//       case "podcast":
//         itemTypeText = "Podcast Episode";
//         itemTextContent = item.podcastEpisodeTitle || "";
//         break;
//       default:
//         itemTextContent = "";
//     }

//     return (
//       <View style={styles.itemContainer}>
//         <Text style={styles.itemType}>{itemTypeText}</Text>
//         <Text style={styles.itemText}>{itemTextContent}</Text>
//         {item.type === "podcast" && item.podcastEpisodeDescription && (
//           <Text style={styles.itemDescription}>
//             {item.podcastEpisodeDescription}
//           </Text>
//         )}
//       </View>
//     );
//   };

//   return (
//     <SafeAreaView style={styles.container} edges={["top"]}>
//       <TextInput
//         style={styles.input}
//         placeholder="Search questions, prayers & podcasts…"
//         value={searchTerm}
//         onChangeText={setSearchTerm}
//         autoCorrect={false}
//         autoCapitalize="none"
//       />

//       {isLoading && (
//         <ActivityIndicator
//           style={{ marginVertical: 12 }}
//           size="small"
//           color="#555"
//         />
//       )}

//       <FlatList
//         data={combinedDisplayResults}
//         keyExtractor={(item) => item.id}
//         renderItem={renderItem}
//         ListEmptyComponent={
//           !isLoading && searchTerm.trim().length > 0 ? (
//             <Text style={styles.emptyText}>No results found.</Text>
//           ) : null
//         }
//         keyboardShouldPersistTaps="handled"
//       />
//     </SafeAreaView>
//   );
// };

// export default SearchScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: "#fff",
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     fontSize: 16,
//     marginBottom: 12,
//   },
//   itemContainer: {
//     marginBottom: 16,
//     padding: 10,
//     backgroundColor: "#f9f9f9",
//     borderRadius: 6,
//   },
//   itemType: {
//     fontSize: 12,
//     color: "#777",
//     marginBottom: 4,
//     fontWeight: "bold",
//   },
//   itemText: {
//     fontSize: 16,
//     color: "#222",
//   },
//   itemDescription: {
//     fontSize: 14,
//     color: "#555",
//     marginTop: 4,
//   },
//   emptyText: {
//     textAlign: "center",
//     color: "#888",
//     marginTop: 20,
//   },
// });

import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import debounce from "lodash.debounce";
import { SafeAreaView } from "react-native-safe-area-context";
import { searchQuestions, searchPrayers } from "@/utils/bufibDatabase";
import { useSearchPodcasts } from "@/hooks/useSearchPodcasts";
import { useSearchNewsArticles } from "@/hooks/useSearchNewsArticles"; // Added
import { PodcastType, NewsArticlesType } from "@/constants/Types"; // Added NewsArticlesType

type CombinedResult = {
  id: string;
  type: "question" | "prayer" | "podcast" | "newsArticle"; // Added newsArticle
  question?: string;
  title?: string;
  name?: string;
  arabic_text?: string;
  podcastEpisodeTitle?: string;
  podcastEpisodeDescription?: string;
  newsTitle?: string; // Added
  newsSnippet?: string; // Added
};

const SearchScreen = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [questionAndPrayerResults, setQuestionAndPrayerResults] = useState<
    CombinedResult[]
  >([]);
  const [combinedDisplayResults, setCombinedDisplayResults] = useState<
    CombinedResult[]
  >([]);
  const [manualLoading, setManualLoading] = useState<boolean>(false);

  const podcastQuery = useSearchPodcasts(searchTerm);
  const newsArticleSearchQuery = useSearchNewsArticles(searchTerm); // Added

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
        (q: any) => ({
          id: `question-${q.id}`,
          type: "question",
          question: q.question,
          title: q.title,
        })
      );

      const prayersTagged: CombinedResult[] = prayerResults.map((p: any) => ({
        id: `prayer-${p.id}`,
        type: "prayer",
        name: p.name,
        arabic_text: p.arabic_text,
      }));

      setQuestionAndPrayerResults([...questionsTagged, ...prayersTagged]);
    } catch (err) {
      console.error("Error running combined manual search:", err);
      setQuestionAndPrayerResults([]);
    } finally {
      setManualLoading(false);
    }
  };

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
        id: `podcast-${p.id}`,
        type: "podcast",
        podcastEpisodeTitle: p.title,
        podcastEpisodeDescription: p.description,
      })
    );

    const newsArticlesData = newsArticleSearchQuery.data || [];
    const newsArticlesTagged: CombinedResult[] = newsArticlesData.map(
      (na: NewsArticlesType) => ({
        id: `news-${na.id}`,
        type: "newsArticle",
        newsTitle: na.title,
        newsSnippet: na.title || (na.content ? na.content.substring(0, 100) + '...' : undefined),
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
      newsArticleSearchQuery.data // Added
  ]);

  const isLoading = manualLoading || podcastQuery.isFetching || newsArticleSearchQuery.isFetching; // Added

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
      case "newsArticle": // Added
        itemTypeText = "News Article";
        itemTextContent = item.newsTitle || "";
        break;
      default:
        itemTextContent = "";
    }

    return (
      <View style={styles.itemContainer}>
        <Text style={styles.itemType}>{itemTypeText}</Text>
        <Text style={styles.itemText}>{itemTextContent}</Text>
        {item.type === "podcast" && item.podcastEpisodeDescription && (
          <Text style={styles.itemDescription}>
            {item.podcastEpisodeDescription}
          </Text>
        )}
        {item.type === "newsArticle" && item.newsSnippet && ( // Added
          <Text style={styles.itemDescription}>
            {item.newsSnippet}
          </Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <TextInput
        style={styles.input}
        placeholder="Search questions, prayers, podcasts & news…" // Updated placeholder
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
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          !isLoading && searchTerm.trim().length > 0 ? (
            <Text style={styles.emptyText}>No results found.</Text>
          ) : null
        }
        keyboardShouldPersistTaps="handled"
      />
    </SafeAreaView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    marginBottom: 12,
  },
  itemContainer: {
    marginBottom: 16,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 6,
  },
  itemType: {
    fontSize: 12,
    color: "#777",
    marginBottom: 4,
    fontWeight: "bold",
  },
  itemText: {
    fontSize: 16,
    color: "#222",
  },
  itemDescription: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  emptyText: {
    textAlign: "center",
    color: "#888",
    marginTop: 20,
  },
});
