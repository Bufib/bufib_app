import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
  useColorScheme,
} from "react-native";
import { useTranslation } from "react-i18next";

import {
  getFavoritePrayerFolders,
  getFavoritePrayersForFolder,
} from "@/utils/bufibDatabase";
import { FavoritePrayerFolderType, PrayerType } from "@/constants/Types";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { LoadingIndicator } from "./LoadingIndicator";

const FavoritePrayersScreen: React.FC = () => {
  const { t } = useTranslation();

  const [folders, setFolders] = useState<FavoritePrayerFolderType[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [prayers, setPrayers] = useState<PrayerType[]>([]);
  const [isLoadingFolders, setIsLoadingFolders] = useState(false);
  const [isLoadingPrayers, setIsLoadingPrayers] = useState(false);
  const colorScheme = useColorScheme() || "light";
  // Load all favorite folders on mount
  useEffect(() => {
    (async () => {
      setIsLoadingFolders(true);
      try {
        const arr = await getFavoritePrayerFolders();
        setFolders(arr);
        if (arr.length > 0) {
          setSelectedFolder(arr[0].name);
        }
      } catch (err) {
        console.error("Failed to load favorite folders:", err);
        Alert.alert(t("toast.error"), t("FavoriteCategories.loadFailed"));
      } finally {
        setIsLoadingFolders(false);
      }
    })();
  }, [t]);

  // When selectedFolder changes, load prayers for it
  useEffect(() => {
    if (!selectedFolder) {
      setPrayers([]);
      return;
    }
    (async () => {
      setIsLoadingPrayers(true);
      try {
        const ps = await getFavoritePrayersForFolder(selectedFolder);
        setPrayers(ps);
      } catch (err) {
        console.error("Failed to load prayers for folder:", err);
        Alert.alert(t("toast.error"), t("FavoriteCategories.loadFailed"));
      } finally {
        setIsLoadingPrayers(false);
      }
    })();
  }, [selectedFolder, t]);

  // Render one folder “pill”
  const renderFolderPill = (folder: FavoritePrayerFolderType) => {
    const isActive = folder.name === selectedFolder;
    return (
      <TouchableOpacity
        key={folder.name}
        style={[
          styles.folderPill,
          { backgroundColor: folder.color },
          isActive && {
            opacity: 1,
            borderWidth: 2,
            borderColor: Colors[colorScheme].border,
          },
        ]}
        onPress={() => setSelectedFolder(folder.name)}
      >
        <ThemedText
          style={[
            styles.folderPillText,
            isActive && styles.folderPillTextActive,
          ]}
        >
          {folder.name} ({folder.prayerCount})
        </ThemedText>
      </TouchableOpacity>
    );
  };

  // Render one prayer card
  const renderPrayerCard = ({ item }: { item: PrayerType }) => (
    <TouchableOpacity
      style={[
        styles.prayerCard,
        { backgroundColor: Colors[colorScheme].contrast },
      ]}
      onPress={() => {
        router.push({
          pathname: "/(displayPrayer)/[prayer]",
          params: { prayer: item.id.toString() },
        });
      }}
    >
      <ThemedText style={styles.prayerName}>{item.name}</ThemedText>
      {item.arabic_title ? (
        <ThemedText style={styles.prayerArabicTitle}>
          {item.arabic_title}
        </ThemedText>
      ) : null}
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      {/* Folder pills in a horizontal ScrollView */}
      <View style={styles.pillContainer}>
        {isLoadingFolders ? (
          <LoadingIndicator size={"small"} />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {folders.map(renderFolderPill)}
          </ScrollView>
        )}
      </View>

      {/* Prayer list for the selected folder */}
      <View style={styles.prayerListContainer}>
        {isLoadingPrayers ? (
          <ActivityIndicator
            size="large"
            color="#555"
            style={{ marginTop: 20 }}
          />
        ) : prayers.length === 0 ? (
          <ThemedText style={styles.noPrayersText}>
            {t(
              "FavoriteCategories.noPrayersInFolder",
              "No prayers in this folder."
            )}
          </ThemedText>
        ) : (
          <FlatList
            data={prayers}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderPrayerCard}
            contentContainerStyle={styles.prayerList}
          />
        )}
      </View>
    </ThemedView>
  );
};

export default FavoritePrayersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    gap: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "700",
    marginHorizontal: 16,
    marginVertical: 12,
  },
  pillContainer: {
    paddingLeft: 16,
  },
  folderPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    opacity: 0.8,
  },
  folderPillActive: {},
  folderPillText: {
    fontSize: 14,
    color: "white",
    fontWeight: "600",
  },
  folderPillTextActive: {
    color: "#FFF",
  },
  prayerListContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  prayerList: {
    paddingVertical: 8,
  },
  prayerCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    // Elevation for Android
    elevation: 2,
  },
  prayerName: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  prayerArabicTitle: {
    fontSize: 14,
    fontStyle: "italic",
  },
  noPrayersText: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 16,
  },
});
