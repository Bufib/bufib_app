import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { EvilIcons } from "@expo/vector-icons";
import { DaySelector } from "./DaySelector";
import { TodoList } from "./ToDoList";
import { WeeklyTodosType, TodoItemType } from "@/constants/Types";
import { getFullDayName } from "@/utils/dayNames";
import { Colors } from "@/constants/Colors";
import { useTranslation } from "react-i18next";
import type { WeeklyCalendarSectionType } from "@/constants/Types";

export const WeeklyCalendarSection: React.FC<
  WeeklyCalendarSectionType & {
    todosByDay: WeeklyTodosType;
    loading: boolean;
    onToggleTodo: (day: number, id: number) => void;
  }
> = ({
  selectedDay,
  currentDayIndex,
  onSelectDay,
  onShowAddModal,
  onShowDeleteModal,
  onUndoAll,
  todosByDay,
  loading,
  onToggleTodo,
}) => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";

  const handleUndo = () => {
    if (selectedDay !== null) {
      onUndoAll(selectedDay);
    }
  };

  return (
    <View style={styles.calendarSection}>
      {/* Header */}
      <View style={[styles.calendarHeader]}>
        <ThemedText style={[styles.sectionTitle]}>
          {t("weeklyToDo")}{" "}
        </ThemedText>
        <TouchableOpacity
          style={[
            styles.addButton,
            {
              backgroundColor:
                colorScheme === "dark"
                  ? Colors.universal.primary
                  : Colors.universal.secondary,
            },
            selectedDay === null && { opacity: 0.5 },
          ]}
          onPress={onShowAddModal}
          disabled={selectedDay === null}
        >
          <ThemedText style={styles.addButtonText}>
            {" "}
            {t("addWeekly")}{" "}
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* Day Selector */}
      <DaySelector
        selectedDay={selectedDay}
        currentDayIndex={currentDayIndex}
        onSelectDay={onSelectDay}
      />

      {/* Selected Day Heading */}
      {selectedDay !== null && (
        <ThemedView style={[styles.weekPlanerContainer]}>
          <ThemedText style={styles.selectedDayTitle}>
            {getFullDayName(selectedDay)}
          </ThemedText>
          <TouchableOpacity onPress={handleUndo}>
            <View style={{ flexDirection: "row", gap: 5 }}>
              <ThemedText style={{ fontSize: 12 }}>{t("undo")}</ThemedText>
              <EvilIcons
                name="undo"
                size={30}
                color={colorScheme === "dark" ? "#ffffff" : "#000000"}
              />
            </View>
          </TouchableOpacity>
        </ThemedView>
      )}
      {/* Todo List Area */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={colorScheme === "dark" ? "#fff" : "#000"}
          />
        </View>
      ) : selectedDay !== null ? (
        <TodoList
          todos={todosByDay[selectedDay] ?? []}
          dayIndex={selectedDay}
          onToggleTodo={onToggleTodo}
          onShowDeleteModal={onShowDeleteModal}
          onShowAddModal={onShowAddModal}
        />
      ) : (
        <View style={styles.loadingContainer}>
          <ThemedText>
            {t("selectDayPrompt") || "Wähle einen Tag aus"}
          </ThemedText>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  calendarSection: {
  },

  loadingContainer: {
    minHeight: 200,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 30,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  addButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  weekPlanerContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    marginTop: 16,
    marginBottom: 12,
  },
  selectedDayTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
});
