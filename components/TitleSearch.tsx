//! Last worked

import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  TextInput,
  FlatList,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { searchQuestionsByTitle } from "@/db/queries/questions";
import Feather from "@expo/vector-icons/Feather";
import { Colors } from "@/constants/Colors";
import { useLanguage } from "@/contexts/LanguageContext";

interface TitleSearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  style?: any;
  themeStyles: any;
}

interface SelectedItem {
  title: string;
  category_name: string;
  subcategory_name: string;
}

const DEBOUNCE_DELAY = 300;

export const TitleSearchInput = ({
  value,
  onChangeText,
  style,
  themeStyles,
}: TitleSearchInputProps) => {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<SelectedItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const colorScheme = useColorScheme();
  const { lang } = useLanguage();

  useEffect(() => {
    if (!value) {
      setSelectedItems([]);
      return;
    }

    const titles = value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    setSelectedItems(
      titles.map((title) => ({
        title,
        category_name: "",
        subcategory_name: "",
      }))
    );
  }, [value]);

  const searchTitles = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const results = await searchQuestionsByTitle(query, lang);
      const formattedResults = results.map((item: any) => ({
        title: item.title,
        category_name: item.category_name,
        subcategory_name: item.subcategory_name,
      }));
      setSearchResults(formattedResults);
    } catch (error) {
      console.error("Error searching titles:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, [lang]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchTitles(searchText);
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timeoutId);
  }, [searchText, searchTitles]);

  const handleSelectSuggestion = (selectedItem: SelectedItem) => {
    if (selectedItems.some((item) => item.title === selectedItem.title)) {
      return;
    }

    const newSelected = [...selectedItems, selectedItem];
    setSelectedItems(newSelected);
    const csv = newSelected.map((item) => item.title).join(", ");
    onChangeText(csv);
    setSearchText("");
    setModalVisible(false);
  };

  const handleDeleteItem = (itemToDelete: SelectedItem) => {
    const newSelected = selectedItems.filter(
      (item) => item.title !== itemToDelete.title
    );
    setSelectedItems(newSelected);
    const csv = newSelected.map((item) => item.title).join(", ");
    onChangeText(csv);
  };

  const renderSelectedItem = ({ item }: { item: SelectedItem }) => (
    <View style={[styles.selectedItemContainer, themeStyles.contrast]}>
      <View style={styles.selectedItemContent}>
        <ThemedText style={styles.titleText}>{item.title}</ThemedText>
        {Boolean(item.category_name) && (
          <ThemedText style={styles.categoryText}>
            {item.category_name} {">"} {item.subcategory_name}
          </ThemedText>
        )}
      </View>
      <Pressable
        onPress={() => handleDeleteItem(item)}
        style={styles.deleteButton}
      >
        <Feather
          name="trash-2"
          size={24}
          color={colorScheme === "dark" ? "#fff" : "#000"}
        />
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => setModalVisible(true)}
        style={[styles.input, style]}
      >
        <ThemedText style={themeStyles.text}>
          {selectedItems.length > 0
            ? selectedItems.map((item) => item.title).join(", ")
            : "Wähle die Fragen aus"}
        </ThemedText>
      </Pressable>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, themeStyles.contrast]}>
            <TextInput
              style={[styles.input, themeStyles.text]}
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Suche nach einem Title"
              placeholderTextColor={Colors.universal.grayedOut}
            />
            {loading && (
              <ActivityIndicator
                size="small"
                color={Colors.universal.grayedOut}
              />
            )}
            {!loading && searchResults.length > 0 && (
              <FlatList
                data={searchResults}
                keyExtractor={(item) => item.title}
                renderItem={({ item }) => (
                  <Pressable
                    style={styles.suggestionItem}
                    onPress={() => handleSelectSuggestion(item)}
                  >
                    <ThemedText style={styles.titleText}>
                      {item.title}
                    </ThemedText>
                    {Boolean(item.category_name) && (
                      <ThemedText style={styles.categoryText}>
                        {item.category_name} {">"} {item.subcategory_name}
                      </ThemedText>
                    )}
                  </Pressable>
                )}
                keyboardShouldPersistTaps="handled"
              />
            )}
            {!loading && searchText && searchResults.length === 0 && (
              <ThemedText style={styles.noResults}>
                No matching titles found
              </ThemedText>
            )}
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <ThemedText style={{ color: Colors.universal.link }}>
                Schließen
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {selectedItems.length > 0 && (
        <View style={styles.selectedItemsList}>
          {selectedItems.map((item) => (
            <View key={item.title}>{renderSelectedItem({ item })}</View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    zIndex: 1,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    maxHeight: "80%",
    borderRadius: 8,
    padding: 16,
    backgroundColor: "#fff",
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  titleText: {
    fontSize: 16,
  },
  categoryText: {
    fontSize: 12,
    color: "#666",
  },
  noResults: {
    padding: 12,
    textAlign: "center",
    color: Colors.universal.grayedOut,
  },
  closeButton: {
    marginTop: 16,
    padding: 12,
    alignItems: "center",
  },
  selectedItemsList: {
    marginTop: 20,
  },
  selectedItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 8,
  },
  selectedItemContent: {
    flex: 1,
  },
  deleteButton: {
    padding: 8,
  },
});
