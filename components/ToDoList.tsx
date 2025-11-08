// src/components/TodoList.tsx
import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { ThemedText } from "./ThemedText";
import { EvilIcons, Ionicons } from "@expo/vector-icons";
import { TodoListType } from "@/constants/Types";
import { useTranslation } from "react-i18next";
import { Colors } from "@/constants/Colors";
import { useLanguage } from "@/contexts/LanguageContext";
import { returnSize } from "@/utils/sizes";

export const TodoList = ({
  todos,
  dayIndex,
  onToggleTodo,
  onShowDeleteModal,
  onShowAddModal,
}: TodoListType) => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";
  const { rtl } = useLanguage();
  const { width, height } = useWindowDimensions();
  const { emptyIconSize, emptyTextSize, emptyGap } = returnSize(width, height);

  if (!todos || todos.length === 0) {
    return (
      <View
        style={[
          styles.emptyPrayerForDay,

          rtl
            ? {
                flexDirection: "row-reverse",
              }
            : {
                flexDirection: "row",
              },
        ]}
      >
        <Ionicons
          name="calendar-outline"
          size={emptyIconSize}
          color={colorScheme === "dark" ? "#666" : "#999"}
          style={styles.emptyDayIcon}
        />

        <ThemedText
          style={[
            styles.emptyDayText,
            { fontSize: emptyTextSize, marginBottom: emptyGap },
          ]}
        >
          {t("noPlansForToday")}{" "}
          <ThemedText
            onPress={onShowAddModal}
            style={[
              styles.addButton,
              { color: Colors[colorScheme].text, fontWeight: 600 },
            ]}
          >
            {t("addWeekly")}
          </ThemedText>
        </ThemedText>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      style={styles.scrollStyle}
    >
      {todos.map((todo) => (
        <View
          key={todo.id}
          style={[
            rtl
              ? {
                  flexDirection: "row-reverse",
                }
              : {
                  flexDirection: "row",
                },
            styles.todoItem,
            {
              backgroundColor: Colors[colorScheme].contrast,
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.checkboxContainer,
              rtl ? { marginLeft: 12 } : { marginRight: 10 },
            ]}
            onPress={() => onToggleTodo(dayIndex, todo.id)}
          >
            <View
              style={[
                styles.checkbox,
                todo.completed && styles.checkboxCompleted,
                { borderColor: colorScheme === "dark" ? "#666" : "#999" },
                todo.completed && {
                  backgroundColor: colorScheme === "dark" ? "#666" : "#999",
                  borderColor: colorScheme === "dark" ? "#666" : "#999",
                },
              ]}
            >
              {todo.completed && (
                <Ionicons name="checkmark" size={16} color="#fff" />
              )}
            </View>
          </TouchableOpacity>
          <ThemedText
            style={[
              styles.todoText,
              rtl
                ? {
                    textAlign: "right",
                  }
                : {
                    textAlign: "left",
                  },
              todo.completed && styles.todoTextCompleted,
            ]}
          >
            {todo.text}
          </ThemedText>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => onShowDeleteModal(dayIndex, todo.id)}
          >
            <Ionicons
              name="close-circle-outline"
              size={22}
              color={colorScheme === "dark" ? "#999" : "#777"}
            />
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollStyle: {
    flex: 1,
    marginHorizontal: 10,
  },
  scrollContent: {
    gap: 5,
  },
  todoItem: {
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  checkboxContainer: {},
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
  },
  checkboxCompleted: {},
  todoText: {
    flex: 1,
    fontSize: 15,
  },
  todoTextCompleted: {
    textDecorationLine: "line-through",
    opacity: 0.6,
  },
  deleteButton: {
    padding: 4,
  },
  emptyPrayerForDay: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 10,
  },
  emptyDayText: {
    opacity: 0.8,
    flexWrap: "wrap",
    lineHeight: 25,
  },
  addButton: {
    fontSize: 18,
  },
  inlineAddChip: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    fontSize: 14,
    fontWeight: "600",
    overflow: "hidden", // helps the rounded bg render nicely
  },
  emptyDayIcon: {},

  emptyDayAddButton: {
    borderRadius: 20,
  },
  emptyDayAddText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
