import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  StyleSheet,
  ColorSchemeName,
  TouchableOpacity,
  useWindowDimensions,
  Animated,
  Easing,
} from "react-native";
import { router } from "expo-router";
import { useColorScheme } from "react-native";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import { prayerCategories, tasbihCategory } from "@/utils/categories";
import { useWeeklyTodos } from "@/hooks/useWeeklyTodos";
import { getFullDayName } from "@/utils/dayNames";
import { WeeklyCalendarSection } from "@/components/WeeklyCalendarSection";
import { AddTodoModal } from "@/components/AddTodoModal";
import { DeleteTodoModal } from "@/components/DeleteTodoModal";
import { ThemedView } from "./ThemedView";
import { returnSize } from "@/utils/sizes";
import { Colors } from "@/constants/Colors";
import { Image } from "expo-image";
import { ThemedText } from "./ThemedText";
import { AntDesign } from "@expo/vector-icons";
import { PrayerQuestionLinksType, TodoToDeleteType } from "@/constants/Types";
import { useScreenFadeIn } from "@/hooks/useScreenFadeIn";

const PrayerLinks = () => {
  const colorScheme: ColorSchemeName = useColorScheme() || "light";
  const { t } = useTranslation();
  const { lang, rtl } = useLanguage();

  const {
    todosByDay,
    loading,
    toggleTodo,
    addTodo,
    deleteTodo,
    undoAllForDay,
  } = useWeeklyTodos();

  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [addModalVisible, setAddModalVisible] = useState<boolean>(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [todoToDelete, setTodoToDelete] = useState<TodoToDeleteType>({
    dayIndex: null,
    todoId: null,
  });
  const { fadeAnim, onLayout } = useScreenFadeIn(800);

  // fade-in animation value

  // --- Effects ---
  const getCurrentDayIndex = useCallback((): number => {
    const day = new Date().getDay();
    return day === 0 ? 6 : day - 1; // Mon-Sun (0-6)
  }, []);

  useEffect(() => {
    setSelectedDay(getCurrentDayIndex());
  }, [getCurrentDayIndex]);

  // --- Handlers ---
  const handleAddTodoConfirmed = useCallback(
    (text: string): void => {
      if (selectedDay !== null) {
        addTodo(selectedDay, text);
      }
      setAddModalVisible(false); // Close modal after adding
    },
    [addTodo, selectedDay]
  );

  const showDeleteConfirmation = useCallback(
    (dayIndex: number, todoId: number): void => {
      setTodoToDelete({ dayIndex, todoId });
      setDeleteModalVisible(true);
    },
    []
  );

  const handleConfirmDelete = useCallback((): void => {
    const { dayIndex, todoId } = todoToDelete;
    if (dayIndex !== null && todoId !== null) {
      deleteTodo(dayIndex, todoId);
    }
    setDeleteModalVisible(false);
    setTodoToDelete({ dayIndex: null, todoId: null });
  }, [deleteTodo, todoToDelete]);

  const cancelDelete = useCallback((): void => {
    setDeleteModalVisible(false);
    setTodoToDelete({ dayIndex: null, todoId: null });
  }, []);

  const handleCategoryPress = useCallback(
    (prayerLink: PrayerQuestionLinksType) => {
      router.push(
        prayerLink.value === "Tasbih"
          ? {
              pathname: "/knowledge/prayers/tasbih",
            }
          : prayerLink.value === "Names"
          ? {
              pathname: "/knowledge/prayers/names",
              params: { prayerLink: prayerLink.value },
            }
          : {
              pathname: "/knowledge/prayers/prayerCategory",
              params: { prayerCategory: prayerLink.value },
            }
      );
    },
    []
  );

  const handleSelectDay = useCallback((dayIndex: number): void => {
    setSelectedDay(dayIndex);
  }, []);

  const { width, height } = useWindowDimensions();

  const { elementSize, fontSize, iconSize, imageSize, gap } = returnSize(
    width,
    height
  );

  return (
    <Animated.View
      onLayout={onLayout}
      style={[
        styles.container,
        { opacity: fadeAnim, backgroundColor: Colors[colorScheme].background },
      ]}
    >
      <View style={styles.categoriesContainer}>
        <View style={styles.categories}>
          {prayerCategories.map((category, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                handleCategoryPress(category);
              }}
              style={[
                styles.element,
                {
                  backgroundColor: Colors[colorScheme].contrast,
                  width: elementSize,
                  height: elementSize,
                },
              ]}
            >
              <View
                style={[
                  styles.categoryButtonContainer,
                  { gap: iconSize / 10 - 1 },
                ]}
              >
                <View
                  style={[
                    styles.iconContainer,
                    { width: iconSize, height: iconSize },
                  ]}
                >
                  <Image
                    style={[styles.elementIcon, { width: iconSize }]}
                    source={category.image}
                    contentFit="contain"
                  />
                </View>
                <View>
                  <ThemedText
                    style={[styles.elementText, { fontSize: fontSize }]}
                  >
                    {t(category.name)}
                  </ThemedText>
                </View>
              </View>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            onPress={() => {
              handleCategoryPress(tasbihCategory[0]);
            }}
            style={[
              styles.element,
              {
                backgroundColor: Colors[colorScheme].contrast,
                width: "96%",
                height: elementSize / 2,
              },
            ]}
          >
            <View
              style={[
                styles.categoryButtonContainer,
                { gap: iconSize / 10 - 1 },
              ]}
            >
              <View style={styles.tasbihContainer}>
                <Image
                  style={[styles.elementIcon, { width: iconSize / 1.2 }]}
                  source={require("@/assets/images/tasbih.png")}
                  contentFit="contain"
                />
                <ThemedText
                  style={[styles.elementText, { fontSize: fontSize * 1.7 }]}
                >
                  {t("tasbih")}
                </ThemedText>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <WeeklyCalendarSection
        todosByDay={todosByDay}
        loading={loading}
        onToggleTodo={toggleTodo}
        onUndoAll={undoAllForDay}
        onShowAddModal={() => setAddModalVisible(true)}
        onShowDeleteModal={showDeleteConfirmation}
        selectedDay={selectedDay}
        currentDayIndex={getCurrentDayIndex()}
        onSelectDay={handleSelectDay}
      />

      {selectedDay !== null && (
        <>
          <AddTodoModal
            visible={addModalVisible}
            onClose={() => setAddModalVisible(false)}
            onAdd={handleAddTodoConfirmed}
            selectedDayName={getFullDayName(selectedDay)}
          />
          <DeleteTodoModal
            visible={deleteModalVisible}
            onClose={cancelDelete}
            onConfirmDelete={handleConfirmDelete}
          />
        </>
      )}
    </Animated.View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    gap: 20,
    paddingTop: 10,
    paddingBottom: 4,
  },
  categoriesContainer: {
    flexDirection: "row",
  },

  categories: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 15,
    paddingHorizontal: 10,
  },

  element: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 13,

    // iOS Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,

    // Android Shadow
    elevation: 5,
  },

  categoryButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
  },

  iconContainer: {
    borderRadius: 90,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.universal.prayerLinks,
  },
  tasbihContainer: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },

  elementIcon: {
    height: "auto",
    aspectRatio: 1.5,
    alignSelf: "center",
  },
  elementText: {
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default PrayerLinks;
