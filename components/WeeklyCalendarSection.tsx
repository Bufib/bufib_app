import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  useColorScheme,
  useWindowDimensions,
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
import { returnSize } from "@/utils/sizes";
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
  const { width, height } = useWindowDimensions();
  const { isLarge, isMedium } = returnSize(width, height);
  const handleUndo = () => {
    if (selectedDay !== null) {
      onUndoAll(selectedDay);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.calendarHeader]}>
        <View style={styles.calendarHeaderContainer}>
          <AntDesign
            name="calendar"
            size={isLarge ? 45 : isMedium ? 40 : 35}
            color="#f5f6fa"
            style={{
              backgroundColor: Colors.universal.primary,
              borderRadius: 10,
              padding: 5,
              paddingBottom: 7,
            }}
          />
          <View style={[styles.calendarTextContainer]}>
            <ThemedText
              style={[
                styles.calendarTextTitle,
                { fontSize: isLarge ? 20 : isMedium ? 16 : 14 },
              ]}
            >
              {t("weeklyToDoTitle")}
            </ThemedText>
            <ThemedText
              style={[
                styles.calendarTextSubtitle,
                { fontSize: isLarge ? 16 : isMedium ? 14 : 12 },
              ]}
            >
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
            name="plus-circle"
            size={isLarge ? 35 : isMedium ? 30 : 25}
            color={Colors[colorScheme].defaultIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Day Selector */}
      <View style={{ flex: 0 }}>
        <DaySelector
          selectedDay={selectedDay}
          currentDayIndex={currentDayIndex}
          onSelectDay={onSelectDay}
        />
      </View>

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
                <ThemedText style={{ fontSize: 12, color: Colors.universal.primary }}>{t("undo")}</ThemedText>
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
  calendarHeaderContainer: {
    flexDirection: "row",
    gap: 15,
    marginLeft: 13,
  },
  calendarTextContainer: {
    flexDirection: "column",
    gap: 1,
    justifyContent: "center",
  },
  calendarTextTitle: {
    fontWeight: "600",
  },
  calendarTextSubtitle: {},
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
