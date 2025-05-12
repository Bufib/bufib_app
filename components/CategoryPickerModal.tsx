

import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import BottomSheet, { BottomSheetView, BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import WheelColorPicker from "react-native-wheel-color-picker";

import { useTranslation } from "react-i18next";
import {
  getCategories,
  createCategory,
  Category,
} from "../utils/favoriteCategories";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (category: Category) => void;
}

const CategoryPickerBottomSheet: React.FC<Props> = ({
  visible,
  onClose,
  onSelect,
}) => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const [color, setColor] = useState<string>("#3498db");
  const [creating, setCreating] = useState(false);
  const sheetRef = useRef<BottomSheet>(null);
  const insets = useSafeAreaInsets();

  // Two snap points: half-screen and nearly full
  const snapPoints = useMemo(() => ["50%", "90%"], []);

  // Control bottom sheet open/close
  useEffect(() => {
    if (visible) {
      sheetRef.current?.snapToIndex(1);
    } else {
      sheetRef.current?.close();
    }
  }, [visible]);

  // Fetch categories when opened
  useEffect(() => {
    if (visible) {
      getCategories()
        .then(setCategories)
        .catch((err) => {
          console.error("Failed to load categories:", err);
          Alert.alert(t("toast.error"), t("FavoriteCategories.loadFailed"));
        });
    }
  }, [visible, t]);

  const handleCreate = async () => {
    const name = categoryName.trim();
    if (!name) {
      Alert.alert(t("toast.error"), t("FavoriteCategories.nameRequired"));
      return;
    }
    const exists = categories.some(
      (cat) => cat.name.trim().toLowerCase() === name.toLowerCase()
    );
    if (exists) {
      Alert.alert(t("toast.error"), t("FavoriteCategories.nameExists"));
      return;
    }

    setCreating(true);
    try {
      const newCat = await createCategory(name, color);
      onSelect(newCat);
      sheetRef.current?.close();
      onClose();
    } catch (err) {
      console.error("Error creating category:", err);
      Alert.alert(t("toast.error"), t("FavoriteCategories.createFailed"));
    } finally {
      setCreating(false);
    }
  };

  const renderCategory = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={styles.row}
      onPress={() => {
        onSelect(item);
        sheetRef.current?.close();
        onClose();
      }}
    >
      <View style={[styles.dot, { backgroundColor: item.color }]} />
      <Text style={styles.categoryText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      onClose={() => onClose()}
    >
      <BottomSheetView style={[styles.container, { paddingBottom: insets.bottom }]}>  
        <Text style={styles.title}>
          {t("FavoriteCategories.selectCategory")}
        </Text>

        <BottomSheetFlatList
          data={categories}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCategory}
          contentContainerStyle={styles.listContainer}
        />

        <View style={styles.divider} />

        <Text style={styles.subtitle}>
          {t("FavoriteCategories.newCategory")}
        </Text>
        <TextInput
          placeholder={t("FavoriteCategories.namePlaceholder")}
          value={categoryName}
          onChangeText={setCategoryName}
          style={styles.input}
        />

        <Text style={styles.subtitle}>{t("FavoriteCategories.pickColor")}</Text>
        <View style={styles.pickerContainer}>
          <WheelColorPicker
            color={color}
            onColorChangeComplete={setColor}
            thumbSize={20}
            sliderSize={20}
            noSnap
            row={false}
            swatches
            swatchesLast
            swatchesOnly={false}
          />
        </View>

        <TouchableOpacity
          onPress={handleCreate}
          disabled={creating}
          style={[styles.button, creating && styles.buttonDisabled]}
        >
          {creating ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>
              {t("FavoriteCategories.createButton")}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            sheetRef.current?.close();
            onClose();
          }}
          style={styles.cancel}
        >
          <Text style={styles.cancelText}>{t("cancel")}</Text>
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default CategoryPickerBottomSheet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
  },
  listContainer: {
    paddingBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 12,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 16,
  },
  pickerContainer: {
    height: 300,
    marginBottom: 20,
    alignItems: "center",
  },
  button: {
    backgroundColor: "#2196F3",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  cancel: {
    alignItems: "center",
    paddingVertical: 10,
  },
  cancelText: {
    color: "#888",
    fontSize: 14,
  },
});
