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
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import {
  getFavoritePrayerFolders,
  getFavoritePrayersForFolder,
} from "@/utils/bufibDatabase";
import { FavoritePrayerFolderType, PrayerType } from "@/constants/Types";
import { router } from "expo-router";

const FavoritePrayersScreen: React.FC = () => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const [folders, setFolders] = useState<FavoritePrayerFolderType[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [prayers, setPrayers] = useState<PrayerType[]>([]);
  const [isLoadingFolders, setIsLoadingFolders] = useState(false);
  const [isLoadingPrayers, setIsLoadingPrayers] = useState(false);

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
          isActive && styles.folderPillActive,
        ]}
        onPress={() => setSelectedFolder(folder.name)}
      >
        <Text
          style={[
            styles.folderPillText,
            isActive && styles.folderPillTextActive,
          ]}
        >
          {folder.name} ({folder.prayerCount})
        </Text>
      </TouchableOpacity>
    );
  };

  // Render one prayer card
  const renderPrayerCard = ({ item }: { item: PrayerType }) => (
    <TouchableOpacity
      style={styles.prayerCard}
      onPress={() => {
        router.push({
          pathname: "/(displayPrayer)/[prayer]",
          params: { prayer: item.id.toString() },
        });
      }}
    >
      <Text style={styles.prayerName}>{item.name}</Text>
      {item.arabic_title ? (
        <Text style={styles.prayerArabicTitle}>{item.arabic_title}</Text>
      ) : null}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.headerText}>
        {t("FavoriteCategories.title", "Favorite Prayers")}
      </Text>

      {/* Folder pills in a horizontal ScrollView */}
      <View style={styles.pillContainer}>
        {isLoadingFolders ? (
          <ActivityIndicator size="small" color="#555" />
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
          <Text style={styles.noPrayersText}>
            {t(
              "FavoriteCategories.noPrayersInFolder",
              "No prayers in this folder."
            )}
          </Text>
        ) : (
          <FlatList
            data={prayers}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderPrayerCard}
            contentContainerStyle={styles.prayerList}
          />
        )}
      </View>
    </View>
  );
};

export default FavoritePrayersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "700",
    marginHorizontal: 16,
    marginVertical: 12,
  },
  pillContainer: {
    height: 50,
    marginVertical: 8,
    paddingLeft: 16,
  },
  folderPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    opacity: 0.8,
  },
  folderPillActive: {
    opacity: 1,
    borderWidth: 2,
    borderColor: "#333",
  },
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
    backgroundColor: "white",
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
    color: "#333",
  },
  prayerArabicTitle: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#666",
  },
  noPrayersText: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 16,
    color: "#888",
  },
});
