// File: App/screens/Search/index.tsx

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
// Adjust the import paths below to wherever you’ve defined these functions
import { searchQuestions, searchPrayers } from "@/utils/bufibDatabase";

type CombinedResult = {
  id: number;
  type: "question" | "prayer";
  // For questions:
  question?: string;
  title?: string;
  // For prayers:
  name?: string;
  arabic_text?: string;
  // …plus any other fields you care about
};

const SearchScreen = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [results, setResults] = useState<CombinedResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // 1) Perform the actual queries for both questions and prayers
  const performSearch = async (term: string) => {
    if (term.trim().length === 0) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const questionResults = await searchQuestions(term);
      const prayerResults = await searchPrayers(term);

      // 2) Tag each result with a “type” so we know which is which
      const questionsTagged: CombinedResult[] = questionResults.map((q) => ({
        id: q.id,
        type: "question",
        question: q.question,
        title: q.title,
        // …include other question fields if you want
      }));

      const prayersTagged: CombinedResult[] = prayerResults.map((p) => ({
        id: p.id,
        type: "prayer",
        name: p.name,
        arabic_text: p.arabic_text,
        // …include other prayer fields if desired
      }));

      // 3) Merge into one array
      setResults([...questionsTagged, ...prayersTagged]);
    } catch (err) {
      console.error("Error running combined search:", err);
    } finally {
      setLoading(false);
    }
  };

  // 4) Debounce so it doesn’t fire on every keystroke
  const debouncedSearch = useCallback(debounce(performSearch, 300), []);

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm]);

  // 5) Render each item with a little hint (“Question” or “Prayer”)
  const renderItem = ({ item }: { item: CombinedResult }) => {
    return (
      <View style={styles.itemContainer}>
        <Text style={styles.itemType}>
          {item.type === "question" ? "Question" : "Prayer"}
        </Text>
        <Text style={styles.itemText}>
          {item.type === "question"
            ? item.question
            : item.name ?? item.arabic_text}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <TextInput
        style={styles.input}
        placeholder="Search questions & prayers…"
        value={searchTerm}
        onChangeText={setSearchTerm}
        autoCorrect={false}
        autoCapitalize="none"
      />

      {loading && (
        <ActivityIndicator
          style={{ marginVertical: 12 }}
          size="small"
          color="#555"
        />
      )}

      <FlatList
        data={results}
        keyExtractor={(item) => `${item.type}-${item.id}`}
        renderItem={renderItem}
        ListEmptyComponent={
          !loading && searchTerm.length > 0 ? (
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
  },
  itemText: {
    fontSize: 16,
    color: "#222",
  },
  emptyText: {
    textAlign: "center",
    color: "#888",
    marginTop: 20,
  },
});
