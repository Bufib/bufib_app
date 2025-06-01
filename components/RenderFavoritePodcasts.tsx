import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import { getFavoritePodcasts } from "@/utils/favorites";

const RenderFavoritePodcasts = () => {
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  useEffect(() => {
    // Load all stored favorite podcast IDs when this component mounts
    const loadFavorites = async () => {
      try {
        const ids = await getFavoritePodcasts();
        setFavoriteIds(ids);
      } catch (error) {
        console.error("Error loading favorite podcasts:", error);
      }
    };

    loadFavorites();
  }, []);

  // If there are no favorites, show a placeholder message
  if (favoriteIds.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>You have no favorite podcasts yet.</Text>
      </View>
    );
  }

  // Otherwise, render a FlatList of podcast IDs
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Favorite Podcasts</Text>
      <FlatList
        data={favoriteIds}
        keyExtractor={(item) => item.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>Podcast ID: {item}</Text>
            {/* 
              If you have a way to fetch podcast metadata (e.g. title, image) by ID,
              you could swap this out for a custom component that fetches and displays details.
            */}
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

export default RenderFavoritePodcasts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
  listContent: {
    paddingBottom: 24,
  },
  itemContainer: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#ccc",
  },
  itemText: {
    fontSize: 16,
  },
});
