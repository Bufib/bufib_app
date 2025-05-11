import React from "react";
import {
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { ThemedText } from "./ThemedText";
import { getDayNames } from "@/utils/dayNames";
import i18n from "@/utils/i18n";
import { useTranslation } from "react-i18next";

interface DaySelectorProps {
  selectedDay: number | null;
  currentDayIndex: number;
  onSelectDay: (dayIndex: number) => void;
}

export const DaySelector: React.FC<DaySelectorProps> = ({
  selectedDay,
  currentDayIndex,
  onSelectDay,
}) => {
  const dayNames = getDayNames();
  console.log(dayNames);
  const colorScheme = useColorScheme() || "light";
 
  const { t } = useTranslation();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.daysContainer}
    >
      {dayNames.map((day, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.dayButton,
            selectedDay === index && styles.selectedDayButton,
            { backgroundColor: colorScheme === "dark" ? "#333" : "#f0f0f0" },
            selectedDay === index && {
              backgroundColor: colorScheme === "dark" ? "#555" : "#e0e0e0",
            },
          ]}
          onPress={() => onSelectDay(index)}
        >
          <ThemedText
            style={[
              styles.dayButtonText,
              selectedDay === index && styles.selectedDayText,
              currentDayIndex === index && styles.currentDayText,
            ]}
          >
            {day}
          </ThemedText>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  daysContainer: {
    flexDirection: "row",
    paddingBottom: 10,
    gap: 10,
  },
  dayButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    minWidth: 60,
    alignItems: "center",
  },
  selectedDayButton: {
    borderWidth: 2,
    borderColor: "#4CAF50",
  },
  dayButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  selectedDayText: {
    fontWeight: "700",
  },
  currentDayText: {
    color: "#4CAF50",
  },
});
