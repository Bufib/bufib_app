import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { CalendarType } from "@/constants/Types";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "react-i18next";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { Colors } from "@/constants/Colors";
import { getAllCalendarEvents } from "@/db/queries/calendar";

const RenderCalendar: React.FC = () => {
  const [filter, setFilter] = useState<"all" | "major" | "minor">("all");
  const [events, setEvents] = useState<CalendarType[]>([]);
  const { language } = useLanguage();
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";
  // ─── load + parse once (or when language changes) ───
  useEffect(() => {
    (async () => {
      const data = await getAllCalendarEvents(language || "de");
      if (data) {
        setEvents(
          data.map((r) => ({
            ...r,
            gregorian_date: new Date(r.gregorian_date),
            created_at: new Date(r.created_at),
          }))
        );
      }
    })().catch(console.log);
  }, [language]);

  // ─── helper ───
  const getDaysUntil = (d: Date) =>
    Math.ceil((d.getTime() - Date.now()) / 86_400_000);

  // ─── expensive work memoised ───
  const displayEvents = useMemo(() => {
    const todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);

    // filter
    const initial =
      filter === "all" ? events : events.filter((e) => e.type === filter);

    // sort
    const sorted = [...initial].sort(
      (a, b) => a.gregorian_date.getTime() - b.gregorian_date.getTime()
    );

    // rotate so today / next on top
    const pivot = sorted.findIndex((e) => e.gregorian_date >= todayMidnight);
    return pivot > 0
      ? [...sorted.slice(pivot), ...sorted.slice(0, pivot)]
      : sorted;
  }, [events, filter]);

  // ─── UI helpers ───
  const FilterButton: React.FC<{
    labelKey: string;
    value: "all" | "major" | "minor";
  }> = ({ labelKey, value }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        filter === value && styles.filterButtonActive,
        { borderColor: Colors[colorScheme].border },
      ]}
      onPress={() => setFilter(value)}
    >
      <Text
        style={[
          styles.filterButtonText,
          filter === value && styles.filterButtonTextActive,
        ]}
      >
        {t(labelKey)}
      </Text>
    </TouchableOpacity>
  );

  // ─── card (memoised) ───
  const EventCard = React.memo(({ event }: { event: CalendarType }) => {
    const days = getDaysUntil(event.gregorian_date);
    const isPast = days < 0;
    const isToday = days === 0;
    const isUpcoming = days > 0 && days <= 30;
    const status: "today" | "upcoming" | "past" = isToday
      ? "today"
      : isUpcoming
      ? "upcoming"
      : "past";

    const cardStyle = [
      styles.card,
      isToday
        ? styles.cardToday
        : isUpcoming
        ? styles.cardUpcoming
        : isPast
        ? styles.cardPast
        : null,
    ];

    return (
      <View
        style={[cardStyle, { backgroundColor: Colors[colorScheme].contrast }]}
      >
        <View style={styles.cardContent}>
          <View style={styles.cardMain}>
            {/* title row */}
            <View style={styles.titleRow}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Badge type={event.type as "major" | "minor"} />
            </View>

            <Text style={styles.description}>{event.description}</Text>

            {/* dates */}
            <View style={styles.datesContainer}>
              <DateRow icon="calendar" text={event.islamic_date} bold />
              <DateRow
                icon="location"
                text={event.gregorian_date.toLocaleDateString(
                  language ?? "en",
                  {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              />
            </View>

            {!isPast && (
              <View style={styles.countdownRow}>
                <Ionicons name="time" size={16} color="#f59e0b" />
                <Text style={styles.countdownText}>
                  {isToday
                    ? t("countdownToday")
                    : t("countdownDaysToGo", { count: days })}
                </Text>
              </View>
            )}
          </View>

          <StatusIndicator status={status} />
        </View>
      </View>
    );
  });

  // sub-helpers inside the component scope so they see styles
  const Badge: React.FC<{ type: "major" | "minor" }> = ({ type }) => (
    <View
      style={[
        styles.badge,
        type === "major" ? styles.badgeMajor : styles.badgeMinor,
      ]}
    >
      <Ionicons
        name={type === "major" ? "star" : "moon"}
        size={12}
        color={type === "major" ? "#fff" : "#6b7280"}
        style={styles.badgeIcon}
      />
      <Text
        style={[
          styles.badgeText,
          type === "major" ? styles.badgeTextMajor : styles.badgeTextMinor,
        ]}
      >
        {type === "major" ? t("filterMajor") : t("filterMinor")}
      </Text>
    </View>
  );

  const StatusIndicator: React.FC<{
    status: "today" | "upcoming" | "past";
  }> = ({ status }) => {
    const color =
      status === "today"
        ? "#10b981"
        : status === "upcoming"
        ? "#f59e0b"
        : "#d1d5db";
    return (
      <View style={[styles.statusIndicator, { backgroundColor: color }]} />
    );
  };

  const DateRow = ({
    icon,
    text,
    bold = false,
  }: {
    icon: string;
    text: string;
    bold?: boolean;
  }) => (
    <View style={styles.dateRow}>
      <Ionicons name={icon as any} size={16} color="#6b7280" />
      <Text style={bold ? styles.islamicDate : styles.gregorianDate}>
        {text}
      </Text>
    </View>
  );

  // ─── render ───
  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <Ionicons name="moon" size={24} color="#059669" />
          <ThemedText style={styles.title}>{t("calendarTitle")}</ThemedText>
        </View>
        <ThemedText style={styles.subtitle}>
          {t("calendarYearRange", { range: "1445–1446" })}
        </ThemedText>
      </View>

      {/* Filters */}
      <View style={styles.filterContainer}>
        <FilterButton labelKey="filterAll" value="all" />
        <FilterButton labelKey="filterMajor" value="major" />
        <FilterButton labelKey="filterMinor" value="minor" />
      </View>

      {/* FlashList */}
      <FlashList
        data={displayEvents}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <EventCard event={item} />}
        estimatedItemSize={160}
        ListFooterComponent={<Legend />}
      />
    </ThemedView>
  );

  // ─── footer legend ───
  function Legend() {
    return (
      <View style={styles.legend}>
        <Text style={styles.legendTitle}>{t("legendHeader")}</Text>
        <View style={styles.legendGrid}>
          <LegendDot color="#10b981" label={t("legendToday")} />
          <LegendDot color="#f59e0b" label={t("legendUpcoming")} />
          <LegendIcon icon="star" label={t("legendMajorEvent")} />
          <LegendIcon icon="moon" label={t("legendMinorEvent")} />
        </View>
      </View>
    );
  }
};

export default RenderCalendar;

// ─── small legend helpers ───
const LegendDot = ({ color, label }: { color: string; label: string }) => (
  <View style={styles.legendItem}>
    <View style={[styles.legendDot, { backgroundColor: color }]} />
    <Text style={styles.legendText}>{label}</Text>
  </View>
);
const LegendIcon = ({ icon, label }: { icon: any; label: string }) => (
  <View style={styles.legendItem}>
    <Ionicons name={icon} size={12} color="#6b7280" />
    <Text style={styles.legendText}>{label}</Text>
  </View>
);

// ─── styles (unchanged) ───
const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  header: {
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  headerTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#ffffff",
  },
  filterButtonActive: {
    backgroundColor: "#1f2937",
    borderColor: "#1f2937",
  },
  filterButtonText: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  filterButtonTextActive: { color: "#ffffff" },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardToday: {
    borderWidth: 2,
    borderColor: "#10b981",
    backgroundColor: "#ecfdf5",
  },
  cardUpcoming: { borderColor: "#fef3c7", backgroundColor: "#fffbeb" },
  cardPast: { opacity: 0.6 },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardMain: { flex: 1, gap: 8 },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 8,
  },
  eventTitle: { fontSize: 16, fontWeight: "600", color: "#1f2937", flex: 1 },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  badgeMajor: { backgroundColor: "#1f2937" },
  badgeMinor: { backgroundColor: "#f3f4f6" },
  badgeIcon: { marginRight: 2 },
  badgeText: { fontSize: 12, fontWeight: "500" },
  badgeTextMajor: { color: "#ffffff" },
  badgeTextMinor: { color: "#6b7280" },
  description: { fontSize: 14, color: "#6b7280", lineHeight: 20 },
  datesContainer: { gap: 4 },
  dateRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  countdownRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  countdownText: { fontSize: 14, fontWeight: "500", color: "#d97706" },
  islamicDate: { fontSize: 14, fontWeight: "500", color: "#1f2937" },
  gregorianDate: { fontSize: 14, color: "#6b7280" },
  statusIndicator: { width: 12, height: 12, borderRadius: 6, marginLeft: 8 },
  legend: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    marginBottom: 20,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1f2937",
    marginBottom: 8,
  },
  legendGrid: { flexDirection: "row", flexWrap: "wrap", gap: 16 },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    minWidth: "45%",
  },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 12, color: "#6b7280" },
});
