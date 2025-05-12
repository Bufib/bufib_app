import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  ColorSchemeName,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { router } from "expo-router";
import { useColorScheme } from "react-native";
import { CoustomTheme } from "../utils/coustomTheme";
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
import i18n from "@/utils/i18n";
import { prayerQuestionLinksType, TodoToDeleteType } from "@/constants/Types";

const PrayerLinks = () => {
  const colorScheme: ColorSchemeName = useColorScheme() || "light";
  const { t } = useTranslation();
  const { language } = useLanguage();

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

  // const handleUndoAll = useCallback(
  //   (dayIndex: number): void => {
  //     // The check for null selectedDay happens inside WeeklyCalendarSection now
  //     // or keep it here if needed: if (selectedDay !== null && dayIndex === selectedDay) { ... }
  //     undoAllForDay(dayIndex);
  //   },
  //   [undoAllForDay]
  // );

  const handleCategoryPress = useCallback(
    (prayerLink: prayerQuestionLinksType) => {
      router.push(
        prayerLink.value === "Tasbih"
          ? {
              pathname: "/(tabs)/knowledge/(prayers)/tasbih",
              params: { prayerLink: prayerLink.value },
            }
          : prayerLink.value === "Names"
          ? {
              pathname: "/(tabs)/knowledge/(prayers)/names",
              params: { prayerLink: prayerLink.value },
            }
          : {
              pathname: "/[prayer]",
              params: { prayer: prayerLink.value },
            }
      );
    },
    []
  );

  const handleSelectDay = useCallback((dayIndex: number): void => {
    setSelectedDay(dayIndex);
  }, []);

  const isRTL = language === "ar";
  const flexDirection = isRTL
    ? { flexDirection: "row-reverse" as const }
    : { flexDirection: "row" as const };
  const { width, height } = useWindowDimensions();

  const { elementSize, fontSize, iconSize, imageSize, gap } = returnSize(
    width,
    height
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.categoriesContainer}>
        <View style={styles.categoriesHeaderContainer}>
          <ThemedText style={[styles.categoriesContainerText]}>
            {t("categories")} (7)
          </ThemedText>
          <AntDesign
            name="search1"
            size={30}
            color="black"
            style={{ marginRight: 6 }}
          />
        </View>
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
                    {category.name}
                  </ThemedText>
                </View>
              </View>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            onPress={() => {
              handleCategoryPress(tasbihCategory);
            }}
            style={[
              styles.element,
              {
                backgroundColor: Colors[colorScheme].contrast,
                width: "100%",
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
      <View style={styles.todoListContainer}>
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
      </View>
      {/* Render Modals */}
      {selectedDay !== null && ( // Only render Add modal if a day is potentially selected
        <AddTodoModal
          visible={addModalVisible}
          onClose={() => setAddModalVisible(false)}
          onAdd={handleAddTodoConfirmed}
          selectedDayName={getFullDayName(selectedDay)}
        />
      )}

      <DeleteTodoModal
        visible={deleteModalVisible}
        onClose={cancelDelete}
        onConfirmDelete={handleConfirmDelete}
      />
    </ThemedView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    padding: 20,
    gap: 25,
  },

  categoriesContainer: {
    flexDirection: "column",
    marginTop: 10,
  },
  categoriesHeaderContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  categoriesContainerText: {
    fontSize: 25,
    fontWeight: "500",
  },
  categories: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 20,
  },

  imageHeader: {
    height: "auto",
    aspectRatio: 2,
  },
  flatListContent: {
    gap: 7,
    paddingRight: 15,
    paddingLeft: 15,
    paddingVertical: 10,
  },
  flatListStyles: {},

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
  todoListContainer: {},
});

export default PrayerLinks;
