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
import { WeeklyTodosType } from "@/constants/Types";
import { getFullDayName } from "@/utils/dayNames";
import { Colors } from "@/constants/Colors";
import { useTranslation } from "react-i18next";
import type { WeeklyCalendarSectionType } from "@/constants/Types";
import AntDesign from "@expo/vector-icons/AntDesign";
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
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.calendarHeader]}>
        <View style={styles.calenderHeaderContainer}>
          <AntDesign
            name="calendar"
            size={45}
            color="#f5f6fa"
            style={{
              backgroundColor: Colors.universal.primary,
              borderRadius: 10,
              padding: 5,
              paddingBottom: 7,
            }}
          />
          <View style={[styles.calenderTextContainer]}>
            <ThemedText style={[styles.calenderTextTitle]}>
              {t("weeklyToDoTitle")}
            </ThemedText>
            <ThemedText style={[styles.calenderTextSubtitle]}>
              {t("weeklyToDoSubtitle")}
            </ThemedText>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.addButton, selectedDay === null && { opacity: 0.5 }]}
          onPress={onShowAddModal}
          disabled={selectedDay === null}
        >
          <AntDesign
            name="pluscircleo"
            size={35}
            color={Colors[colorScheme].defaultIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Day Selector */}
      <DaySelector
        selectedDay={selectedDay}
        currentDayIndex={currentDayIndex}
        onSelectDay={onSelectDay}
      />

      {/* Todo List Area */}
      {loading || selectedDay === null ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={colorScheme === "dark" ? "#fff" : "#000"}
          />
        </View>
      ) : (
        <>
          <ThemedView style={[styles.fulldayNameContainer]}>
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

          <View style={{ flex: 1 }}>
            <TodoList
              todos={todosByDay[selectedDay] ?? []}
              dayIndex={selectedDay}
              onToggleTodo={onToggleTodo}
              onShowDeleteModal={onShowDeleteModal}
              onShowAddModal={onShowAddModal}
            />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  calendarHeader: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  calenderHeaderContainer: {
    flexDirection: "row",
    gap: 15,
    marginLeft: 13,
  },
  calenderTextContainer: {
    flexDirection: "column",
    gap: 1,
    justifyContent: "center",
  },
  calenderTextTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  calenderTextSubtitle: {
    fontSize: 14,
  },
  addButton: {
    paddingRight: 15,
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: "700",
  },
  fulldayNameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    marginTop: 10,
    marginBottom: 12,
  },
  selectedDayTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: {
    minHeight: 200,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 30,
  },
  todoListContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    marginTop: -10,
  },
});
