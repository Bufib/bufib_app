import React, { useEffect, useState } from "react";
import { StyleSheet, useColorScheme, View, SectionList } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import CalendarLegend from "./CalendarLegend";
import { useLanguage } from "@/contexts/LanguageContext";
import { CalendarSectionType, CalendarType } from "@/constants/Types";
import { useTranslation } from "react-i18next";
import {
  getAllCalendarDates,
  getCalendarLegendTypeNames,
} from "@/db/queries/calendar";
import { CALENDARPALLETTE, Colors } from "@/constants/Colors";
import { LoadingIndicator } from "./LoadingIndicator";
import { useDataVersionStore } from "@/stores/dataVersionStore";

const RenderCalendar: React.FC = () => {
  const colorScheme = useColorScheme() || "light";
  const { lang } = useLanguage();
  const { t } = useTranslation();
  const [events, setEvents] = useState<CalendarType[]>([]);
  const [legendNames, setLegendNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState<CalendarSectionType[]>([]);
  const [nextUpcomingDiff, setNextUpcomingDiff] = useState<number | null>(null);
  const calendarVersion = useDataVersionStore((s) => s.calendarVersion);

  // Fetch calendar data and legend names
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const [ev, names] = await Promise.all([
          getAllCalendarDates(lang),
          getCalendarLegendTypeNames(lang),
        ]);
        if (!cancelled) {
          setEvents(ev ?? []);
          setLegendNames(names ?? []);
        }
      } catch (e) {
        if (!cancelled) {
          setEvents([]);
          setLegendNames([]);
        }
        console.warn("Calendar load failed:", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [calendarVersion, lang]);

  // Map legend names to colors
  const legendColorMap = Object.fromEntries(
    legendNames.map((n, i) => [
      n,
      CALENDARPALLETTE[i % CALENDARPALLETTE.length],
    ])
  );

  // Day-precision date helpers
  const startOfDay = (d: Date) => {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  };
  const parseItemDate = (s: string) => startOfDay(new Date(s));
  const todayStart = startOfDay(new Date());

  const dayDiffFromToday = (dateStr: string) =>
    Math.round(
      (parseItemDate(dateStr).getTime() - todayStart.getTime()) / 86400000
    );

  // Calculate the next upcoming event (smallest positive diff)
  useEffect(() => {
    let minPos: number | null = null;
    for (const e of events) {
      const d = dayDiffFromToday(e.gregorian_date);
      if (d > 0 && (minPos === null || d < minPos)) minPos = d;
    }
    setNextUpcomingDiff(minPos);
  }, [events]);

  // Group events by month/year
  useEffect(() => {
    const map = new Map<string, CalendarType[]>();
    for (const item of events) {
      const d = new Date(item.gregorian_date);
      const key = d.toLocaleDateString(lang, {
        month: "long",
        year: "numeric",
      });
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    }
    const grouped = Array.from(map.entries()).map(([title, data]) => ({
      title,
      data: data.sort((a, b) => (a.gregorian_date < b.gregorian_date ? -1 : 1)),
    }));
    setSections(grouped);
  }, [events, lang]);

  // Render section header with divider lines
  const renderSectionHeader = ({
    section,
  }: {
    section: CalendarSectionType;
  }) => (
    <View style={styles.sectionHeaderRow}>
      <View
        style={[
          styles.sectionDivider,
          { backgroundColor: Colors[colorScheme].devider },
        ]}
      />
      <ThemedText style={styles.sectionTitle}>{section.title}</ThemedText>
      <View
        style={[
          styles.sectionDivider,
          { backgroundColor: Colors[colorScheme].devider },
        ]}
      />
    </View>
  );

  // Render individual calendar event card
  const renderItem = ({ item }: { item: CalendarType }) => {
    const badgeColor = legendColorMap[item.legend_type] ?? "#999";
    const diff = dayDiffFromToday(item.gregorian_date);

    const isToday = diff === 0;
    const isOld = diff < 0;
    const isNext = nextUpcomingDiff !== null && diff === nextUpcomingDiff;

    const statusLabel = isToday
      ? t("legendToday")
      : isNext
      ? t("legendNext")
      : "";

    // Modern glassmorphic highlight with gradient accents
    const highlightStyles = isToday
      ? {
          backgroundColor:
            colorScheme === "dark"
              ? "rgba(251, 146, 60, 0.6)"
              : "rgba(251, 146, 60, 0.2)",
          borderLeftWidth: 4,
          borderLeftColor: "#FB923C",
        }
      : isNext
      ? {
          backgroundColor:
            colorScheme === "dark"
              ? "rgba(6, 182, 212, 0.20)"
              : "rgba(34, 211, 238, 0.15)",
          borderLeftWidth: 4,
          borderLeftColor: "#06B6D4",
        }
      : isOld
      ? {
          // For OUTDATED/PAST events:
          backgroundColor: colorScheme === "dark" ? "#6f767aff" : "#F1F5F9",
          borderWidth: 1,
          borderColor: colorScheme === "dark" ? "#6f767aff" : "#bcc3cbff",
          borderLeftWidth: 4,
          borderLeftColor: colorScheme === "dark" ? "#505456ff" : "#9CA3AF", // Darker gray for light mode
        }
      : {};

    return (
      <View
        style={[
          styles.card,
          {
            backgroundColor: Colors[colorScheme].contrast,
          },
          highlightStyles,
        ]}
      >
        {/* Accent dot indicator */}
        <View style={[styles.accentDot, { backgroundColor: badgeColor }]} />

        {/* Header: dates side by side */}
        <View style={styles.cardHeader}>
          <View style={styles.dateContainer}>
            {/* Gregorian date with modern styling */}
            <View style={styles.gregorianContainer}>
              <ThemedText style={styles.dayNumber}>
                {new Date(item.gregorian_date).getDate()}
              </ThemedText>
              <View style={styles.monthYearContainer}>
                <ThemedText style={styles.monthText}>
                  {new Date(item.gregorian_date)
                    .toLocaleDateString(lang, {
                      month: "short",
                    })
                    .toUpperCase()}
                </ThemedText>
                <ThemedText style={styles.yearText}>
                  {new Date(item.gregorian_date).getFullYear()}
                </ThemedText>
              </View>
            </View>

            {/* Islamic date with subtle styling */}
            <View style={styles.islamicContainer}>
              <ThemedText style={styles.islamicDate}>
                {item.islamic_date}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Title with better typography */}
        <ThemedText style={styles.title}>{item.title}</ThemedText>

        {/* Description with improved readability */}
        {!!item.description && (
          <ThemedText style={styles.desc}>{item.description}</ThemedText>
        )}

        {/* Modern status badge with gradient background */}
        {!!statusLabel && (
          <View style={styles.statusBadgeContainer}>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: isToday ? "#FB923C" : "#06B6D4",
                },
              ]}
            >
              <ThemedText style={styles.statusBadgeText}>
                {statusLabel}
              </ThemedText>
            </View>
          </View>
        )}
      </View>
    );
  };

  // Loading state
  if (loading) {
    return (
      <ThemedView style={styles.loadingWrap}>
        <LoadingIndicator size="large" />
        <ThemedText style={styles.loadingText}>{t("loading")}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => String(item.id)}
      stickySectionHeadersEnabled={false}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View style={styles.legendWrap}>
          <CalendarLegend />
        </View>
      }
      renderSectionHeader={renderSectionHeader}
      renderItem={renderItem}
      contentContainerStyle={styles.listContent}
      ListEmptyComponent={
        <View style={styles.emptyWrap}>
          <ThemedText style={styles.emptyText}>{t("noData")}</ThemedText>
        </View>
      }
    />
  );
};

export default RenderCalendar;

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  legendWrap: {
    paddingTop: 20,
    paddingBottom: 24,
  },

  // Modern section header with centered title
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 12,
  },
  sectionDivider: {
    flex: 1,
    height: 1,
    opacity: 0.5,
  },
  sectionTitle: {
    paddingHorizontal: 16,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    opacity: 0.7,
  },

  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    overflow: "hidden",
    position: "relative",
  },

  // Subtle accent dot in top right
  accentDot: {
    position: "absolute",
    top: 16,
    right: 16,
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
    zIndex: 99,
  },

  // Card header with improved layout
  cardHeader: {
    marginBottom: 16,
    marginTop: 10,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },

  // Modern Gregorian date display
  gregorianContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dayNumber: {
    fontSize: 36,
    fontWeight: "800",
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  monthYearContainer: {
    flexDirection: "column",
  },
  monthText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.8,
    opacity: 0.7,
  },
  yearText: {
    fontSize: 12,
    fontWeight: "500",
    opacity: 0.5,
  },

  // Elegant Islamic date display
  islamicContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  islamicDate: {
    fontSize: 14,
    fontWeight: "600",
    fontStyle: "italic",
    opacity: 0.6,
  },

  // Modern status badge with clean design
  statusBadgeContainer: {
    marginTop: 16,
    alignItems: "flex-start",
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: "#ffffff",
  },

  // Improved typography for title and description
  title: {
    fontSize: 17,
    fontWeight: "700",
    lineHeight: 24,
    letterSpacing: -0.2,
    marginBottom: 8,
  },
  desc: {
    fontSize: 14,
    lineHeight: 22,
    opacity: 0.7,
    letterSpacing: 0.1,
  },

  // Loading and empty states
  loadingWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 16,
    opacity: 0.6,
    fontSize: 14,
  },

  emptyWrap: {
    paddingTop: 80,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 15,
    fontStyle: "italic",
    opacity: 0.5,
  },
});
