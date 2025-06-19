import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { fetchCalendarEventsByLanguage } from "@/utils/bufibDatabase";
import type { calendarType } from "@/constants/Types";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "react-i18next";

// ────────────────────────────────────────────────────────────
//  Calendar component
// ────────────────────────────────────────────────────────────
const RenderCalendar: React.FC = () => {
  const [filter, setFilter] = useState<"all" | "major" | "minor">("all");
  const [events, setEvents] = useState<calendarType[]>([]);
  const { language } = useLanguage();
  const {t} = useTranslation()
  /** 1. On mount + whenever language changes, load data. */
  useEffect(() => {
    (async () => {
      try {
        /** fetch raw rows (dates are ISO strings) */
        const data = await fetchCalendarEventsByLanguage(language ?? "de");
        if (data) {
          const parsed = data.map((r) => ({
            ...r,
            gregorian_date: new Date(r.gregorian_date),
            created_at: new Date(r.created_at),
          }));
          setEvents(parsed);
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, [language]);

  /** 2. Utility: days until */
  const getDaysUntil = (dt: Date) =>
    Math.ceil((dt.getTime() - Date.now()) / 86_400_000); // 1000*60*60*24

  /** 3-a. Filter by major/minor/all */
  const filtered = events.filter((e) =>
    filter === "all" ? true : e.type === filter
  );

  /** 3-b. Sort chronologically */
  const chronSorted = [...filtered].sort(
    (a, b) => a.gregorian_date.getTime() - b.gregorian_date.getTime()
  );

  /** 3-c. Bring TODAY (or next upcoming) to the top of the array */
  const bringNextToTop = <T extends { gregorian_date: Date }>(
    arr: T[]
  ): T[] => {
    const todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);
    const pivot = arr.findIndex((e) => e.gregorian_date >= todayMidnight);
    return pivot > 0 ? [...arr.slice(pivot), ...arr.slice(0, pivot)] : arr;
  };

  const displayEvents = bringNextToTop(chronSorted);

  // ────────── UI helpers (unchanged) ──────────
  const FilterButton: React.FC<{
    title: string;
    isActive: boolean;
    onPress: () => void;
  }> = ({ title, isActive, onPress }) => (
    <TouchableOpacity
      style={[styles.filterButton, isActive && styles.filterButtonActive]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.filterButtonText,
          isActive && styles.filterButtonTextActive,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

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
        {type}
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

  // ────────── Render ──────────
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ecfdf5" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <Ionicons name="moon" size={24} color="#059669" />
          <Text style={styles.title}>Islamic Calendar</Text>
        </View>
        <Text style={styles.subtitle}>1445–1446 AH</Text>
      </View>

      {/* Filters */}
      <View style={styles.filterContainer}>
        <FilterButton
          title="All Events"
          isActive={filter === "all"}
          onPress={() => setFilter("all")}
        />
        <FilterButton
          title="Major"
          isActive={filter === "major"}
          onPress={() => setFilter("major")}
        />
        <FilterButton
          title="Minor"
          isActive={filter === "minor"}
          onPress={() => setFilter("minor")}
        />
      </View>

      {/* Events */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {displayEvents.map((event) => {
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
            <View key={event.id} style={cardStyle}>
              <View style={styles.cardContent}>
                <View style={styles.cardMain}>
                  {/* Title & Badge */}
                  <View style={styles.titleRow}>
                    <Text style={styles.eventTitle}>{event.title}</Text>
                    <Badge type={event.type as "major" | "minor"} />
                  </View>

                  {/* Description */}
                  <Text style={styles.description}>{event.description}</Text>

                  {/* Dates */}
                  <View style={styles.datesContainer}>
                    <View style={styles.dateRow}>
                      <Ionicons name="calendar" size={16} color="#059669" />
                      <Text style={styles.islamicDate}>
                        {event.islamic_date}
                      </Text>
                    </View>
                    <View style={styles.dateRow}>
                      <Ionicons name="location" size={16} color="#6b7280" />
                      <Text style={styles.gregorianDate}>
                        {event.gregorian_date.toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </Text>
                    </View>
                  </View>

                  {!isPast && (
                    <View style={styles.countdownRow}>
                      <Ionicons name="time" size={16} color="#f59e0b" />
                      <Text style={styles.countdownText}>
                        {isToday ? "Today!" : `${days} days to go`}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Status Dot */}
                <StatusIndicator status={status} />
              </View>
            </View>
          );
        })}

        {/* Legend */}
        <View style={styles.legend}>
          <Text style={styles.legendTitle}>Legend:</Text>
          <View style={styles.legendGrid}>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: "#10b981" }]}
              />
              <Text style={styles.legendText}>Today</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: "#f59e0b" }]}
              />
              <Text style={styles.legendText}>Upcoming</Text>
            </View>
            <View style={styles.legendItem}>
              <Ionicons name="star" size={12} color="#6b7280" />
              <Text style={styles.legendText}>Major Event</Text>
            </View>
            <View style={styles.legendItem}>
              <Ionicons name="moon" size={12} color="#6b7280" />
              <Text style={styles.legendText}>Minor Event</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default RenderCalendar;

// ────────────────────────────────────────────────────────────
//  Styles (unchanged from your original)
// ────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0fdf4" },
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
  title: { fontSize: 24, fontWeight: "bold", color: "#1f2937" },
  subtitle: { fontSize: 14, color: "#6b7280" },
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
  filterButtonActive: { backgroundColor: "#1f2937", borderColor: "#1f2937" },
  filterButtonText: { fontSize: 14, color: "#6b7280", fontWeight: "500" },
  filterButtonTextActive: { color: "#ffffff" },
  scrollView: { flex: 1, paddingHorizontal: 16 },
  card: {
    backgroundColor: "#ffffff",
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

// (styles unchanged from your original)

// import React, { useState } from 'react';
// import {
//   SafeAreaView,
//   StatusBar,
//   StyleSheet,
// } from 'react-native';
// import SuraList from './SuraList';
// import SuraDetail from './SuraDetails';
// import VerseText from './SuraDetails';
// import VerseExplanation from './VerseExplaination';
// import { suras } from '@/utils/suraData';

// const RenderCalender = () => {
//   const [currentView, setCurrentView] = useState('list'); // 'list', 'detail', 'verses', 'explanation'
//   const [selectedSura, setSelectedSura] = useState(null);
//   const [selectedVerse, setSelectedVerse] = useState(null);

//   const handleSuraSelect = (sura) => {
//     setSelectedSura(sura);
//     setCurrentView('detail');
//   };

//   const handleShowVerses = () => {
//     setCurrentView('verses');
//   };

//   const handleVerseSelect = (verse) => {
//     setSelectedVerse(verse);
//     setCurrentView('explanation');
//   };

//   const handleBackToList = () => {
//     setCurrentView('list');
//     setSelectedSura(null);
//   };

//   const handleBackToDetail = () => {
//     setCurrentView('detail');
//     setSelectedVerse(null);
//   };

//   const handleBackToVerses = () => {
//     setCurrentView('verses');
//     setSelectedVerse(null);
//   };

//   const renderCurrentView = () => {
//     switch (currentView) {
//       case 'list':
//         return (
//           <SuraList
//             suras={suras}
//             onSuraSelect={handleSuraSelect}
//           />
//         );
//       case 'detail':
//         return (
//           <SuraDetail
//             sura={selectedSura}
//             onBack={handleBackToList}
//             onShowVerses={handleShowVerses}
//           />
//         );
//       case 'verses':
//         return (
//           <VerseText
//             sura={selectedSura}
//             onBack={handleBackToDetail}
//             onVerseSelect={handleVerseSelect}
//           />
//         );
//       case 'explanation':
//         return (
//           <VerseExplanation
//             sura={selectedSura}
//             verse={selectedVerse}
//             onBack={handleBackToVerses}
//           />
//         );
//       default:
//         return (
//           <SuraList
//             suras={suras}
//             onSuraSelect={handleSuraSelect}
//           />
//         );
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="#065f46" />
//       {renderCurrentView()}
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f0fdf4',
//   },
// });

// export default RenderCalender;
