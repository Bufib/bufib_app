import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  useColorScheme,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getFavoriteNewsArticle } from "@/utils/favorites";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
const FavoriteNewsArticles = () => {
  const [articleIds, setArticleIds] = useState<number[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const colorscheme = useColorScheme() || "light";

  useEffect(() => {
    const fetchFavoriteIds = async () => {
      try {
        setIsLoading(true);
        const ids = await getFavoriteNewsArticle();
        if (Array.isArray(ids)) {
          setArticleIds(ids);
        } else {
          setArticleIds([]);
        }
        setError(null);
      } catch (err) {
        setError("Failed to load favorite articles.");
        setArticleIds([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavoriteIds();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading favorite articles...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[
        styles.scrollViewStyles,
        { backgroundColor: Colors[colorscheme].background },
      ]}
      contentContainerStyle={styles.scrollViewContent}
    >
      {articleIds && articleIds.length > 0 ? (
        articleIds.map((id) => (
          <TouchableOpacity key={id.toString()} style={[styles.item, {backgroundColor: Colors[colorscheme].contrast, borderColor: Colors[colorscheme].border}]}>
            <ThemedText style={styles.itemText}>ID: {id}</ThemedText>
          </TouchableOpacity>
        ))
      ) : (
        <Text>No favorite articles yet.</Text>
      )}
    </ScrollView>
  );
};

export default FavoriteNewsArticles;

const styles = StyleSheet.create({
  scrollViewStyles: {
    flex: 1,
    paddingTop: 10
  },
  scrollViewContent: {
    gap: 10,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
  },
  item: {
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    padding: 15
  },
  itemText: {
  },
});
