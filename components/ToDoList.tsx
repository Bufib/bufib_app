// src/components/TodoList.tsx
import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  ScrollView,
} from "react-native";
import { ThemedText } from "./ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { TodoListType } from "@/constants/Types";
import { useTranslation } from "react-i18next";
import { Colors } from "@/constants/Colors";
import { useLanguage } from "@/contexts/LanguageContext";

export const TodoList = ({
  todos,
  dayIndex,
  onToggleTodo,
  onShowDeleteModal,
  onShowAddModal,
}: TodoListType) => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";

  const { language } = useLanguage();

  const isRTL = language === "ar";

  if (!todos || todos.length === 0) {
    return (
      <View style={styles.emptyDayContainer}>
        <Ionicons
          name="calendar-outline"
          size={40}
          color={colorScheme === "dark" ? "#666" : "#999"}
          style={styles.emptyDayIcon}
        />
        <ThemedText style={styles.emptyDayText}>
          {t("noPrayersForDay")}
        </ThemedText>
        <TouchableOpacity
          style={[
            styles.emptyDayAddButton,
            { backgroundColor: colorScheme === "dark" ? "#333" : "#f0f0f0" },
          ]}
          onPress={onShowAddModal}
        >
          <ThemedText style={styles.emptyDayAddText}>
            {t("addWeekly")}
          </ThemedText>
        </TouchableOpacity>
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
            styles.todoItem,
            {
              backgroundColor: Colors[colorScheme].contrast,
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.checkboxContainer,
              isRTL ? { marginLeft: 12 } : { marginRight: 12 },
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
  scrollStyle: {},
  scrollContent: {
    gap: 10,
  },

  todoItem: {
    flexDirection: "row",
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
    alignItems: "center",
    justifyContent: "center",
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
  emptyDayContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
    minHeight: 200,
  },
  emptyDayIcon: {
    marginBottom: 16,
  },
  emptyDayText: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 16,
    textAlign: "center",
  },
  emptyDayAddButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  emptyDayAddText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
