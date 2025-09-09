// import React, { useEffect, useState } from "react";
// import { StyleSheet, useColorScheme, View, SectionList } from "react-native";
// import { ThemedView } from "@/components/ThemedView";
// import { ThemedText } from "@/components/ThemedText";
// import CalendarLegend from "./CalendarLegend";
// import { useLanguage } from "@/contexts/LanguageContext";
// import { CalendarType, LanguageCode } from "@/constants/Types";
// import { useTranslation } from "react-i18next";
// import {
//   getAllCalendarDates,
//   getCalendarLegendTypeNames,
// } from "@/db/queries/calendar";
// import { CALENDARPALLETTE, Colors } from "@/constants/Colors";
// import { LoadingIndicator } from "./LoadingIndicator";

// type Section = { title: string; data: CalendarType[] };

// const RenderCalendar: React.FC = () => {
//   const colorScheme = useColorScheme() || "light";
//   const { language } = useLanguage();
//   const lang = (language ?? "de") as LanguageCode;
//   const { t } = useTranslation();

//   const [events, setEvents] = useState<CalendarType[]>([]);
//   const [legendNames, setLegendNames] = useState<string[]>([]);
//   const [loading, setLoading] = useState(false);

//   const [sections, setSections] = useState<Section[]>([]);
//   const [minUpcomingWithin3, setMinUpcomingWithin3] = useState<number | null>(
//     null
//   );

//   useEffect(() => {
//     let cancelled = false;
//     (async () => {
//       try {
//         setLoading(true);
//         const [ev, names] = await Promise.all([
//           getAllCalendarDates(lang),
//           getCalendarLegendTypeNames(lang),
//         ]);
//         if (!cancelled) {
//           setEvents(ev ?? []);
//           setLegendNames(names ?? []);
//         }
//       } catch (e) {
//         if (!cancelled) {
//           setEvents([]);
//           setLegendNames([]);
//         }
//         console.warn("Calendar load failed:", e);
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     })();
//     return () => {
//       cancelled = true;
//     };
//   }, [lang]);

//   // Colors mapped to legend names (recomputed each render; cheap)
//   const legendColorMap = Object.fromEntries(
//     legendNames.map((n, i) => [
//       n,
//       CALENDARPALLETTE[i % CALENDARPALLETTE.length],
//     ])
//   );

//   // Helpers for date comparisons (local, day-precision)
//   const startOfDay = (d: Date) => {
//     const x = new Date(d);
//     x.setHours(0, 0, 0, 0);
//     return x;
//   };
//   const parseItemDate = (s: string) => startOfDay(new Date(s));
//   const todayStart = startOfDay(new Date());

//   const dayDiffFromToday = (dateStr: string) =>
//     Math.round(
//       (parseItemDate(dateStr).getTime() - todayStart.getTime()) / 86400000
//     );

//   // Compute "Next" chip target (min upcoming within 3 days) whenever events change
//   useEffect(() => {
//     const hasToday = events.some(
//       (e) => dayDiffFromToday(e.gregorian_date) === 0
//     );
//     if (hasToday) {
//       setMinUpcomingWithin3(null);
//       return;
//     }
//     let min: number | null = null;
//     for (const e of events) {
//       const d = dayDiffFromToday(e.gregorian_date);
//       if (d > 0 && d <= 3) {
//         if (min === null || d < min) min = d;
//       }
//     }
//     setMinUpcomingWithin3(min);
//   }, [events, lang]);

//   // Group by month/year whenever events or language change
//   useEffect(() => {
//     const map = new Map<string, CalendarType[]>();
//     for (const item of events) {
//       const d = new Date(item.gregorian_date);
//       const key = d.toLocaleDateString(lang, {
//         month: "long",
//         year: "numeric",
//       });
//       if (!map.has(key)) map.set(key, []);
//       map.get(key)!.push(item);
//     }
//     const grouped = Array.from(map.entries()).map(([title, data]) => ({
//       title,
//       data: data.sort((a, b) => (a.gregorian_date < b.gregorian_date ? -1 : 1)),
//     }));
//     setSections(grouped);
//   }, [events, lang]);

//   const renderSectionHeader = ({ section }: { section: Section }) => (
//     <View style={styles.sectionHeaderRow}>
//       <View
//         style={[
//           styles.sectionDivider,
//           { backgroundColor: Colors[colorScheme].devider },
//         ]}
//       />
//       <ThemedText style={styles.sectionTitle}>{section.title}</ThemedText>
//       <View
//         style={[
//           styles.sectionDivider,
//           { backgroundColor: Colors[colorScheme].devider },
//         ]}
//       />
//     </View>
//   );

//   const renderItem = ({ item }: { item: CalendarType }) => {
//     const badgeColor = legendColorMap[item.legend_type] ?? "#999";
//     const diff = dayDiffFromToday(item.gregorian_date);

//     let statusLabel = "";
//     if (diff === 0) statusLabel = t("legendToday");
//     else if (minUpcomingWithin3 !== null && diff === minUpcomingWithin3)
//       statusLabel = t("legendNext");
//     return (
//       <View
//         style={[
//           styles.card,
//           {
//             backgroundColor: Colors[colorScheme].contrast,
//             borderColor: badgeColor,
//           },
//         ]}
//       >
//         {/* Header: dates + badges */}
//         <View style={styles.cardHeader}>
//           <View style={styles.datesWrap}>
//             <ThemedText style={styles.gregorianDate}>
//               {new Date(item.gregorian_date).toLocaleDateString(lang, {
//                 day: "numeric",
//                 month: "short",
//                 year: "numeric",
//               })}
//             </ThemedText>
//             <ThemedText style={styles.islamicDate}>
//               {item.islamic_date}
//             </ThemedText>
//           </View>

//           <View style={styles.badges}>
//             <View style={[styles.badgeDot, { backgroundColor: badgeColor }]} />
//           </View>
//         </View>

//         {/* Title */}
//         <ThemedText style={styles.title}>{item.title}</ThemedText>

//         {/* Description */}
//         {!!item.description && (
//           <ThemedText style={styles.desc}>{item.description}</ThemedText>
//         )}

//         {statusLabel && (
//           <View
//             style={[
//               styles.statusChip,
//               {
//                 borderColor: statusLabel === "Today" ? "#2ecc71" : "#f39c12",
//                 backgroundColor:
//                   (statusLabel === "Today" ? "#2ecc71" : "#f39c12") + "22",
//               },
//             ]}
//           >
//             <ThemedText style={styles.statusText}>{statusLabel}</ThemedText>
//           </View>
//         )}
//       </View>
//     );
//   };

//   if (loading) {
//     return (
//       <ThemedView style={styles.loadingWrap}>
//         <LoadingIndicator size="large" />
//         <ThemedText style={styles.loadingText}>{t("loading")}</ThemedText>
//       </ThemedView>
//     );
//   }

//   return (
//     <SectionList
//       sections={sections}
//       keyExtractor={(item) => String(item.id)}
//       stickySectionHeadersEnabled={false}
//       ListHeaderComponent={
//         <View style={styles.legendWrap}>
//           <CalendarLegend />
//         </View>
//       }
//       renderSectionHeader={renderSectionHeader}
//       renderItem={renderItem}
//       contentContainerStyle={styles.listContent}
//       ListEmptyComponent={
//         <View style={styles.emptyWrap}>
//           <ThemedText style={styles.emptyText}>{t("noData")}</ThemedText>
//         </View>
//       }
//     />
//   );
// };

// export default RenderCalendar;

// const styles = StyleSheet.create({
//   listContent: { paddingHorizontal: 20, paddingBottom: 32 },
//   legendWrap: { paddingTop: 20, paddingBottom: 26 },

//   sectionHeaderRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 12,
//     marginTop: 14,
//   },
//   sectionDivider: { flex: 1, height: 1 },
//   sectionTitle: {
//     paddingHorizontal: 12,
//     fontSize: 14,
//     fontWeight: "600",
//     letterSpacing: 0.5,
//     textTransform: "uppercase",
//   },

//   card: {
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 12,
//     borderWidth: 3,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.08,
//     shadowRadius: 8,
//     elevation: 3,
//   },

//   cardHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     marginBottom: 10,
//   },
//   datesWrap: { flex: 1 },

//   badges: { flexDirection: "column", alignItems: "center", gap: 8 },

//   gregorianDate: { fontSize: 15, fontWeight: "600", marginBottom: 2 },
//   islamicDate: { fontSize: 13, fontWeight: "400", fontStyle: "italic" },

//   statusChip: {
//     justifyContent: "center",
//     alignItems: "center",
//     alignSelf: "flex-end",
//     width: 80,
//     height: 35,
//     borderRadius: 999,
//     borderWidth: 1,
//   },
//   statusText: { fontSize: 11, fontWeight: "600" },

//   badgeDot: { width: 15, height: 15, borderRadius: 99 },

//   title: { fontSize: 18, fontWeight: "600", lineHeight: 24 },
//   desc: { fontSize: 14, lineHeight: 20, marginTop: 8 },

//   loadingWrap: { flex: 1, alignItems: "center", justifyContent: "center" },
//   loadingText: { marginTop: 10, opacity: 0.6 },

//   emptyWrap: { paddingTop: 60, alignItems: "center" },
//   emptyText: { fontSize: 16, fontStyle: "italic" },
// });

import React, { useEffect, useState } from "react";
import { StyleSheet, useColorScheme, View, SectionList } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import CalendarLegend from "./CalendarLegend";
import { useLanguage } from "@/contexts/LanguageContext";
import { CalendarType, LanguageCode } from "@/constants/Types";
import { useTranslation } from "react-i18next";
import {
  getAllCalendarDates,
  getCalendarLegendTypeNames,
} from "@/db/queries/calendar";
import { CALENDARPALLETTE, Colors } from "@/constants/Colors";
import { LoadingIndicator } from "./LoadingIndicator";

type Section = { title: string; data: CalendarType[] };

const RenderCalendar: React.FC = () => {
  const colorScheme = useColorScheme() || "light";
  const { language } = useLanguage();
  const lang = (language ?? "de") as LanguageCode;
  const { t } = useTranslation();

  const [events, setEvents] = useState<CalendarType[]>([]);
  const [legendNames, setLegendNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);
  const [nextUpcomingDiff, setNextUpcomingDiff] = useState<number | null>(null);

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
  }, [lang]);

  const legendColorMap = Object.fromEntries(
    legendNames.map((n, i) => [
      n,
      CALENDARPALLETTE[i % CALENDARPALLETTE.length],
    ])
  );

  // Day-precision helpers
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

  // Find the single next upcoming event (smallest positive diff), regardless of how far away it is.
  useEffect(() => {
    let minPos: number | null = null;
    for (const e of events) {
      const d = dayDiffFromToday(e.gregorian_date);
      if (d > 0 && (minPos === null || d < minPos)) minPos = d;
    }
    setNextUpcomingDiff(minPos);
  }, [events]);

  // Group by month/year
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

  const renderSectionHeader = ({ section }: { section: Section }) => (
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

  const renderItem = ({ item }: { item: CalendarType }) => {
    const badgeColor = legendColorMap[item.legend_type] ?? "#999";
    const diff = dayDiffFromToday(item.gregorian_date);

    const isToday = diff === 0;
    const isNext = nextUpcomingDiff !== null && diff === nextUpcomingDiff;

    const statusLabel = isToday
      ? t("legendToday")
      : isNext
      ? t("legendNext")
      : "";

    // Subtle highlight: stronger border + soft tinted bg + a bit more shadow
    const highlightStyles = isToday
      ? {
          backgroundColor: colorScheme === "dark" ? "#00563B" : "#ACE1AF",
          shadowOpacity: 0.18,
          shadowRadius: 14,
          elevation: 6,
        }
      : isNext
      ? {
          backgroundColor: colorScheme === "dark" ? "#B8860B" : "#FCF75E",
          shadowOpacity: 0.16,
          shadowRadius: 12,
          elevation: 5,
        }
      : {};

    return (
      <View
        style={[
          styles.card,
          {
            backgroundColor: Colors[colorScheme].contrast,
            borderColor: badgeColor,
          },
          highlightStyles,
        ]}
      >
        {/* Header: dates + legend dot */}
        <View style={styles.cardHeader}>
          <View style={styles.datesWrap}>
            <ThemedText style={styles.gregorianDate}>
              {new Date(item.gregorian_date).toLocaleDateString(lang, {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </ThemedText>
            <ThemedText style={styles.islamicDate}>
              {item.islamic_date}
            </ThemedText>
          </View>
          <View style={styles.badges}>
            <View style={[styles.badgeDot, { backgroundColor: badgeColor }]} />
          </View>
        </View>

        {/* Title */}
        <ThemedText style={styles.title}>{item.title}</ThemedText>

        {/* Description */}
        {!!item.description && (
          <ThemedText style={styles.desc}>{item.description}</ThemedText>
        )}

        {!!statusLabel && (
          <View
            style={[
              styles.statusChip,
              {
                borderColor: isToday ? "#2ecc71" : "#f39c12",
                backgroundColor: (isToday ? "#2ecc71" : "#f39c12") + "22",
              },
            ]}
          >
            <ThemedText style={styles.statusText}>{statusLabel}</ThemedText>
          </View>
        )}
      </View>
    );
  };

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
      extraData={lang}
      keyExtractor={(item) => `${lang}-${item.id}`}
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
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 10,
  },
  legendWrap: {
    paddingTop: 20,
    paddingBottom: 26,
  },

  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionDivider: {
    flex: 1,
    height: 1,
  },
  sectionTitle: {
    paddingHorizontal: 12,
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 3,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  datesWrap: {
    flex: 1,
  },

  badges: {
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  },

  gregorianDate: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 2,
  },
  islamicDate: {
    fontSize: 13,
    fontWeight: "400",
    fontStyle: "italic",
  },

  statusChip: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
    paddingHorizontal: 14,
    height: 30,
    borderRadius: 999,
    borderWidth: 1,
    marginTop: 10,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.4,
  },

  badgeDot: {
    width: 15,
    height: 15,
    borderRadius: 99,
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 24,
  },
  desc: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },

  loadingWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 10,
    opacity: 0.6,
  },

  emptyWrap: {
    paddingTop: 60,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    fontStyle: "italic",
  },
});
