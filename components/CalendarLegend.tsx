import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  useColorScheme,
  ViewStyle,
  View,
} from "react-native";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { CALENDARPALLETTE, Colors } from "@/constants/Colors";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageCode } from "@/constants/Types";
import { getCalendarLegendTypeNames } from "@/db/queries/calendar";
import { LoadingIndicator } from "./LoadingIndicator";
import { useTranslation } from "react-i18next";
import { useCalendarVersionStore } from "@/stores/calandarVersionStore";

const CalendarLegend = ({ style }: { style?: ViewStyle }) => {
  const colorScheme = useColorScheme() || "light";
  const { language } = useLanguage();
  const lang = (language ?? "de") as LanguageCode;
  const [legendNames, setLegendNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const calendarVersion = useCalendarVersionStore(
    (state) => state.calendarVersion
  );

  const localDate = new Date()
    .toLocaleDateString(lang, {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    .toLowerCase();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const names = await getCalendarLegendTypeNames(lang);
        if (!cancelled) setLegendNames(names);
      } catch (e) {
        if (!cancelled) setLegendNames([]);
        console.warn("Legend load failed:", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [lang, calendarVersion]);

  const getItemColor = (index: number) => {
    return CALENDARPALLETTE[index % CALENDARPALLETTE.length];
  };

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <LoadingIndicator size={"large"} />
      </ThemedView>
    );
  }

  if (!legendNames.length) {
    return (
      <ThemedView style={[styles.container, style]}>
        <ThemedText style={styles.emptyText}>{t("noData")}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <View
      style={[
        styles.container,
        style,
        { backgroundColor: Colors[colorScheme].contrast },
      ]}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <ThemedText style={[styles.title, {}]}>{t("legend")}</ThemedText>
        <ThemedText style={[styles.title, {}]}>{localDate}</ThemedText>
      </View>

      <FlatList
        data={legendNames}
        extraData={[lang, calendarVersion]}
        keyExtractor={(name) => `${lang}:${name.trim().toLowerCase()}`}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        style={{ gap: 20 }}
        renderItem={({ item, index }) => (
          <View style={styles.legendItem}>
            <View
              style={[
                styles.colorIndicator,
                { backgroundColor: getItemColor(index) },
              ]}
            />
            <ThemedText style={[styles.legendText]}>{item}</ThemedText>
          </View>
        )}
      />
    </View>
  );
};

export default CalendarLegend;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    padding: 15,
    borderRadius: 8,
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 12,
  },
  listContent: {
    gap: 20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  colorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  legendText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 21,
  },
  emptyText: {
    fontSize: 13,
    fontStyle: "italic",
    opacity: 0.6,
  },
});
