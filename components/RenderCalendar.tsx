// //! Last worked
// // import React, { useCallback, useEffect, useState } from "react";
// // import {
// //   StyleSheet,
// //   useColorScheme,
// //   View,
// //   SectionList,
// //   TouchableOpacity,
// // } from "react-native";
// // import { ThemedView } from "@/components/ThemedView";
// // import { ThemedText } from "@/components/ThemedText";
// // import CalendarLegend from "./CalendarLegend";
// // import { useLanguage } from "@/contexts/LanguageContext";
// // import { CalendarSectionType, CalendarType } from "@/constants/Types";
// // import { useTranslation } from "react-i18next";
// // import {
// //   getAllCalendarDates,
// //   getCalendarLegendColorById,
// // } from "@/db/queries/calendar";
// // import { Colors } from "@/constants/Colors";
// // import { LoadingIndicator } from "./LoadingIndicator";
// // import { useDataVersionStore } from "@/stores/dataVersionStore";
// // import { Entypo } from "@expo/vector-icons";

// // const RenderCalendar: React.FC = () => {
// //   const colorScheme = useColorScheme() || "light";
// //   const { lang } = useLanguage();
// //   const { t } = useTranslation();
// //   const [events, setEvents] = useState<CalendarType[]>([]);
// //   const [legendColorMap, setLegendColorMap] = useState<Record<number, string>>(
// //     {}
// //   ); // ← Geändert
// //   const [loading, setLoading] = useState(false);
// //   const [sections, setSections] = useState<CalendarSectionType[]>([]);
// //   const [nextUpcomingDiff, setNextUpcomingDiff] = useState<number | null>(null);
// //   const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
// //     new Set()
// //   );
// //   const calendarVersion = useDataVersionStore((s) => s.calendarVersion);

// //   // Fetch calendar data
// //   useEffect(() => {
// //     let cancelled = false;
// //     (async () => {
// //       try {
// //         setLoading(true);
// //         const [ev, colorMap] = await Promise.all([
// //           getAllCalendarDates(lang),
// //           getCalendarLegendColorById(lang), // ← Neue Query
// //         ]);
// //         if (!cancelled) {
// //           setEvents(ev ?? []);
// //           setLegendColorMap(colorMap); // ← Direkt setzen
// //         }
// //       } catch (e) {
// //         if (!cancelled) {
// //           setEvents([]);
// //           setLegendColorMap({});
// //         }
// //         console.warn("Calendar load failed:", e);
// //       } finally {
// //         if (!cancelled) setLoading(false);
// //       }
// //     })();
// //     return () => {
// //       cancelled = true;
// //     };
// //   }, [calendarVersion, lang]);
// //   // Day-precision date helpers
// //   const startOfDay = (d: Date) => {
// //     const x = new Date(d);
// //     x.setHours(0, 0, 0, 0);
// //     return x;
// //   };
// //   const parseItemDate = useCallback((s: string) => {
// //     const [year, month, day] = s.split("-").map(Number);
// //     return new Date(year, month - 1, day);
// //   }, []);

// //   const todayStart = startOfDay(new Date());

// //   const dayDiffFromToday = useCallback(
// //     (dateStr: string) =>
// //       Math.round(
// //         (parseItemDate(dateStr).getTime() - todayStart.getTime()) / 86400000
// //       ),
// //     [parseItemDate, todayStart]
// //   );

// //   // Calculate the next upcoming event (smallest positive diff)
// //   useEffect(() => {
// //     let minPos: number | null = null;
// //     for (const e of events) {
// //       const d = dayDiffFromToday(e.gregorian_date);
// //       if (d > 0 && (minPos === null || d < minPos)) minPos = d;
// //     }
// //     setNextUpcomingDiff(minPos);
// //   }, [events, dayDiffFromToday]);

// //   // Group events by month/year and auto-collapse all non-current months
// //   useEffect(() => {
// //     const now = new Date();
// //     const currentMonthIndex = now.getFullYear() * 12 + now.getMonth();

// //     const map = new Map<string, { data: CalendarType[]; monthIndex: number }>();

// //     for (const item of events) {
// //       const d = new Date(item.gregorian_date);
// //       const monthIndex = d.getFullYear() * 12 + d.getMonth();
// //       const key = d.toLocaleDateString(lang, {
// //         month: "long",
// //         year: "numeric",
// //       });

// //       const existing = map.get(key);
// //       if (existing) {
// //         existing.data.push(item);
// //       } else {
// //         map.set(key, { data: [item], monthIndex });
// //       }
// //     }

// //     const initialCollapsed = new Set<string>();

// //     const grouped: CalendarSectionType[] = Array.from(map.entries()).map(
// //       ([title, { data, monthIndex }]) => {
// //         // ✅ collapse all months that are not the current month
// //         if (monthIndex !== currentMonthIndex) {
// //           initialCollapsed.add(title);
// //         }
// //         return {
// //           title,
// //           data: data.sort((a, b) =>
// //             a.gregorian_date < b.gregorian_date ? -1 : 1
// //           ),
// //         };
// //       }
// //     );

// //     setSections(grouped);

// //     setCollapsedSections((prev) => {
// //       if (prev.size === 0) {
// //         return initialCollapsed;
// //       }
// //       const merged = new Set(prev);
// //       initialCollapsed.forEach((title) => merged.add(title));
// //       return merged;
// //     });
// //   }, [events, lang]);

// //   // Toggle collapse state for a section
// //   const toggleSection = (sectionTitle: string) => {
// //     setCollapsedSections((prev) => {
// //       const newSet = new Set(prev);
// //       if (newSet.has(sectionTitle)) {
// //         newSet.delete(sectionTitle);
// //       } else {
// //         newSet.add(sectionTitle);
// //       }
// //       return newSet;
// //     });
// //   };

// //   // Render section header with divider lines
// //   const renderSectionHeader = ({
// //     section,
// //   }: {
// //     section: CalendarSectionType;
// //   }) => {
// //     const isCollapsed = collapsedSections.has(section.title);

// //     return (
// //       <TouchableOpacity
// //         onPress={() => toggleSection(section.title)}
// //         activeOpacity={0.7}
// //       >
// //         <View style={styles.sectionHeaderRow}>
// //           <Entypo
// //             name={isCollapsed ? "chevron-right" : "chevron-down"}
// //             size={26}
// //             color={Colors[colorScheme].text}
// //             style={styles.chevronIcon}
// //           />

// //           <View
// //             style={[
// //               styles.sectionDivider,
// //               { backgroundColor: Colors[colorScheme].devider },
// //             ]}
// //           />
// //           <ThemedText style={styles.sectionTitle}>{section.title}</ThemedText>
// //           <View
// //             style={[
// //               styles.sectionDivider,
// //               { backgroundColor: Colors[colorScheme].devider },
// //             ]}
// //           />
// //         </View>
// //       </TouchableOpacity>
// //     );
// //   };

// //   // Render individual calendar event card
// //   const renderItem = ({
// //     item,
// //     section,
// //   }: {
// //     item: CalendarType;
// //     section: CalendarSectionType;
// //   }) => {
// //     // Don't render if section is collapsed
// //     if (collapsedSections.has(section.title)) {
// //       return null;
// //     }

// //     const badgeColor = legendColorMap[item.legend_type] ?? "#999";
// //     const diff = dayDiffFromToday(item.gregorian_date);

// //     const isToday = diff === 0;
// //     const isOld = diff < 0;
// //     const isNext = nextUpcomingDiff !== null && diff === nextUpcomingDiff;

// //     const statusLabel = isToday
// //       ? t("legendToday")
// //       : isNext
// //       ? t("legendNext")
// //       : "";

// //     // Modern glassmorphic highlight with gradient accents
// //     const highlightStyles = isToday
// //       ? {
// //           backgroundColor:
// //             colorScheme === "dark"
// //               ? "rgba(251, 146, 60, 0.6)"
// //               : "rgba(251, 146, 60, 0.2)",
// //           borderLeftWidth: 4,
// //           borderLeftColor: badgeColor,
// //         }
// //       : isNext
// //       ? {
// //           backgroundColor:
// //             colorScheme === "dark"
// //               ? "rgba(6, 182, 212, 0.20)"
// //               : "rgba(34, 211, 238, 0.15)",
// //           borderLeftWidth: 4,
// //           borderLeftColor: badgeColor,
// //         }
// //       : isOld
// //       ? {
// //           // For OUTDATED/PAST events:
// //           backgroundColor: colorScheme === "dark" ? "#6f767aff" : "#F1F5F9",
// //           borderWidth: 1,
// //           borderColor: colorScheme === "dark" ? "#6f767aff" : "#bcc3cbff",
// //           borderLeftWidth: 4,
// //           borderLeftColor: colorScheme === "dark" ? "#505456ff" : "#9CA3AF",
// //         }
// //       : {
// //           borderLeftWidth: 4,
// //           borderLeftColor: badgeColor,
// //         };
// //     return (
// //       <View
// //         style={[
// //           styles.card,
// //           {
// //             backgroundColor: Colors[colorScheme].contrast,
// //           },
// //           highlightStyles,
// //         ]}
// //       >
// //         {/* Accent dot indicator */}
// //         <View style={[styles.accentDot, { backgroundColor: badgeColor }]} />
// //         {/* Header: dates side by side */}
// //         <View style={styles.cardHeader}>
// //           <View style={styles.dateContainer}>
// //             {/* Gregorian date with modern styling */}

// //             <View style={styles.gregorianContainer}>
// //               <ThemedText style={styles.dayNumber}>
// //                 {new Date(item.gregorian_date).getDate()}
// //               </ThemedText>
// //               <View style={styles.monthYearContainer}>
// //                 <ThemedText style={styles.monthText}>
// //                   {new Date(item.gregorian_date)
// //                     .toLocaleDateString(lang, {
// //                       month: "short",
// //                     })
// //                     .toUpperCase()}
// //                 </ThemedText>
// //                 <ThemedText style={styles.yearText}>
// //                   {new Date(item.gregorian_date).getFullYear()}
// //                 </ThemedText>
// //               </View>
// //             </View>

// //             {/* Islamic date with subtle styling */}
// //             <View style={styles.islamicContainer}>
// //               <ThemedText style={styles.islamicDate}>
// //                 {item.islamic_date}
// //               </ThemedText>
// //             </View>
// //           </View>
// //         </View>

// //         {/* Title with better typography */}
// //         <ThemedText style={styles.title}>{item.title}</ThemedText>

// //         {/* Description with improved readability */}
// //         {!!item.description && (
// //           <ThemedText style={styles.desc}>{item.description}</ThemedText>
// //         )}

// //         {/* Modern status badge with gradient background */}
// //         {!!statusLabel && (
// //           <View style={styles.statusBadgeContainer}>
// //             <View
// //               style={[
// //                 styles.statusBadge,
// //                 {
// //                   backgroundColor: isToday ? "#FB923C" : "#06B6D4",
// //                 },
// //               ]}
// //             >
// //               <ThemedText style={styles.statusBadgeText}>
// //                 {statusLabel}
// //               </ThemedText>
// //             </View>
// //           </View>
// //         )}
// //       </View>
// //     );
// //   };

// //   // Loading state
// //   if (loading) {
// //     return (
// //       <ThemedView style={styles.loadingWrap}>
// //         <LoadingIndicator size="large" />
// //         <ThemedText style={styles.loadingText}>{t("loading")}</ThemedText>
// //       </ThemedView>
// //     );
// //   }

// //   return (
// //     <SectionList
// //       sections={sections}
// //       keyExtractor={(item) => String(item.id)}
// //       stickySectionHeadersEnabled={false}
// //       showsVerticalScrollIndicator={false}
// //       ListHeaderComponent={
// //         <View style={styles.legendWrap}>
// //           <CalendarLegend />
// //         </View>
// //       }
// //       renderSectionHeader={renderSectionHeader}
// //       renderItem={renderItem}
// //       contentContainerStyle={styles.listContent}
// //       ListEmptyComponent={
// //         <View style={styles.emptyWrap}>
// //           <ThemedText style={styles.emptyText}>{t("noData")}</ThemedText>
// //         </View>
// //       }
// //     />
// //   );
// // };

// // export default RenderCalendar;

// // const styles = StyleSheet.create({
// //   listContent: {
// //     paddingHorizontal: 16,
// //     paddingBottom: 32,
// //   },
// //   legendWrap: {
// //     paddingTop: 20,
// //     paddingBottom: 24,
// //   },

// //   // Modern section header with centered title
// //   sectionHeaderRow: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     justifyContent: "center",
// //     marginBottom: 20,
// //     marginTop: 12,
// //   },
// //   chevronIcon: {
// //     marginRight: 8,
// //   },
// //   sectionDivider: {
// //     flex: 1,
// //     height: 1,
// //     opacity: 0.5,
// //   },
// //   sectionTitle: {
// //     paddingHorizontal: 16,
// //     fontSize: 13,
// //     fontWeight: "700",
// //     letterSpacing: 1.2,
// //     textTransform: "uppercase",
// //     opacity: 0.7,
// //   },

// //   card: {
// //     borderRadius: 16,
// //     padding: 20,
// //     marginBottom: 16,
// //     shadowColor: "#000",
// //     shadowOffset: {
// //       width: 0,
// //       height: 4,
// //     },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 12,
// //     elevation: 4,
// //     overflow: "hidden",
// //     position: "relative",
// //   },

// //   // Subtle accent dot in top right
// //   accentDot: {
// //     position: "absolute",
// //     top: 16,
// //     right: 16,
// //     width: 16,
// //     height: 16,
// //     borderRadius: 4,
// //     shadowColor: "#000",
// //     shadowOffset: {
// //       width: 0,
// //       height: 4,
// //     },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 12,
// //     elevation: 4,
// //     zIndex: 99,
// //   },

// //   // Card header with improved layout
// //   cardHeader: {
// //     marginBottom: 16,
// //     marginTop: 10,
// //   },
// //   dateContainer: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 16,
// //   },

// //   // Modern Gregorian date display
// //   gregorianContainer: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 12,
// //   },
// //   dayNumber: {
// //     fontSize: 36,
// //     fontWeight: "800",
// //     lineHeight: 40,
// //     letterSpacing: -0.5,
// //   },
// //   monthYearContainer: {
// //     flexDirection: "column",
// //   },
// //   monthText: {
// //     fontSize: 12,
// //     fontWeight: "700",
// //     letterSpacing: 0.8,
// //     opacity: 0.7,
// //   },
// //   yearText: {
// //     fontSize: 12,
// //     fontWeight: "500",
// //     opacity: 0.5,
// //   },

// //   // Elegant Islamic date display
// //   islamicContainer: {
// //     flex: 1,
// //     alignItems: "flex-end",
// //   },
// //   islamicDate: {
// //     fontSize: 14,
// //     fontWeight: "600",
// //     fontStyle: "italic",
// //     opacity: 0.6,
// //   },

// //   // Modern status badge with clean design
// //   statusBadgeContainer: {
// //     marginTop: 16,
// //     alignItems: "flex-start",
// //   },
// //   statusBadge: {
// //     paddingHorizontal: 16,
// //     paddingVertical: 6,
// //     borderRadius: 20,
// //     shadowColor: "#000",
// //     shadowOffset: {
// //       width: 0,
// //       height: 2,
// //     },
// //     shadowOpacity: 0.15,
// //     shadowRadius: 4,
// //     elevation: 3,
// //   },
// //   statusBadgeText: {
// //     fontSize: 11,
// //     fontWeight: "800",
// //     letterSpacing: 0.8,
// //     textTransform: "uppercase",
// //     color: "#ffffff",
// //   },

// //   // Improved typography for title and description
// //   title: {
// //     fontSize: 17,
// //     fontWeight: "700",
// //     lineHeight: 24,
// //     letterSpacing: -0.2,
// //     marginBottom: 8,
// //   },
// //   desc: {
// //     fontSize: 14,
// //     lineHeight: 22,
// //     opacity: 0.7,
// //     letterSpacing: 0.1,
// //   },

// //   // Loading and empty states
// //   loadingWrap: {
// //     flex: 1,
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },
// //   loadingText: {
// //     marginTop: 16,
// //     opacity: 0.6,
// //     fontSize: 14,
// //   },

// //   emptyWrap: {
// //     paddingTop: 80,
// //     alignItems: "center",
// //   },
// //   emptyText: {
// //     fontSize: 15,
// //     fontStyle: "italic",
// //     opacity: 0.5,
// //   },
// // });

// // components/RenderCalendar.tsx

// import React, { useCallback, useEffect, useMemo, useState, memo } from "react";
// import {
//   StyleSheet,
//   useColorScheme,
//   View,
//   SectionList,
//   TouchableOpacity,
// } from "react-native";
// import { ThemedView } from "@/components/ThemedView";
// import { ThemedText } from "@/components/ThemedText";
// import CalendarLegend from "./CalendarLegend";
// import CalendarEventCard from "./CalendarEventCard";
// import { useLanguage } from "@/contexts/LanguageContext";
// import { CalendarSectionType, CalendarType } from "@/constants/Types";
// import { useTranslation } from "react-i18next";
// import {
//   getAllCalendarDates,
//   getCalendarLegendColorById,
// } from "@/db/queries/calendar";
// import { Colors } from "@/constants/Colors";
// import { LoadingIndicator } from "./LoadingIndicator";
// import { useDataVersionStore } from "@/stores/dataVersionStore";
// import { Entypo } from "@expo/vector-icons";

// // Memoized section header component
// const SectionHeader = memo(function SectionHeader({
//   title,
//   isCollapsed,
//   onToggle,
//   colorScheme,
// }: {
//   title: string;
//   isCollapsed: boolean;
//   onToggle: () => void;
//   colorScheme: "light" | "dark";
// }) {
//   return (
//     <TouchableOpacity onPress={onToggle} activeOpacity={0.7}>
//       <View style={styles.sectionHeaderRow}>
//         <Entypo
//           name={isCollapsed ? "chevron-right" : "chevron-down"}
//           size={26}
//           color={Colors[colorScheme].text}
//           style={styles.chevronIcon}
//         />
//         <View
//           style={[
//             styles.sectionDivider,
//             { backgroundColor: Colors[colorScheme].devider },
//           ]}
//         />
//         <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
//         <View
//           style={[
//             styles.sectionDivider,
//             { backgroundColor: Colors[colorScheme].devider },
//           ]}
//         />
//       </View>
//     </TouchableOpacity>
//   );
// });

// // Memoized list header
// const ListHeader = memo(function ListHeader() {
//   return (
//     <View style={styles.legendWrap}>
//       <CalendarLegend />
//     </View>
//   );
// });

// // Memoized empty component
// const EmptyComponent = memo(function EmptyComponent({ t }: { t: (key: string) => string }) {
//   return (
//     <View style={styles.emptyWrap}>
//       <ThemedText style={styles.emptyText}>{t("noData")}</ThemedText>
//     </View>
//   );
// });

// const RenderCalendar: React.FC = () => {
//   const colorScheme = useColorScheme() || "light";
//   const { lang } = useLanguage();
//   const { t } = useTranslation();

//   const [events, setEvents] = useState<CalendarType[]>([]);
//   const [legendColorMap, setLegendColorMap] = useState<Record<number, string>>({});
//   const [loading, setLoading] = useState(false);
//   const [sections, setSections] = useState<CalendarSectionType[]>([]);
//   const [nextUpcomingDiff, setNextUpcomingDiff] = useState<number | null>(null);
//   const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());

//   const calendarVersion = useDataVersionStore((s) => s.calendarVersion);

//   // Fetch calendar data
//   useEffect(() => {
//     let cancelled = false;
//     (async () => {
//       try {
//         setLoading(true);
//         const [ev, colorMap] = await Promise.all([
//           getAllCalendarDates(lang),
//           getCalendarLegendColorById(lang),
//         ]);
//         if (!cancelled) {
//           setEvents(ev ?? []);
//           setLegendColorMap(colorMap);
//         }
//       } catch (e) {
//         if (!cancelled) {
//           setEvents([]);
//           setLegendColorMap({});
//         }
//         console.warn("Calendar load failed:", e);
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     })();
//     return () => {
//       cancelled = true;
//     };
//   }, [calendarVersion, lang]);

//   // ✅ Original date logic preserved exactly
//   const startOfDay = useCallback((d: Date) => {
//     const x = new Date(d);
//     x.setHours(0, 0, 0, 0);
//     return x;
//   }, []);

//   const parseItemDate = useCallback((s: string) => {
//     const [year, month, day] = s.split("-").map(Number);
//     return new Date(year, month - 1, day);
//   }, []);

//   // ✅ Fresh todayStart on each relevant render
//   const todayStart = useMemo(() => startOfDay(new Date()), [startOfDay]);

//   const dayDiffFromToday = useCallback(
//     (dateStr: string) =>
//       Math.round(
//         (parseItemDate(dateStr).getTime() - todayStart.getTime()) / 86400000
//       ),
//     [parseItemDate, todayStart]
//   );

//   // Calculate the next upcoming event
//   useEffect(() => {
//     let minPos: number | null = null;
//     for (const e of events) {
//       const d = dayDiffFromToday(e.gregorian_date);
//       if (d > 0 && (minPos === null || d < minPos)) minPos = d;
//     }
//     setNextUpcomingDiff(minPos);
//   }, [events, dayDiffFromToday]);

//   // Group events by month/year and auto-collapse non-current months
//   useEffect(() => {
//     const now = new Date();
//     const currentMonthIndex = now.getFullYear() * 12 + now.getMonth();

//     const map = new Map<string, { data: CalendarType[]; monthIndex: number }>();

//     for (const item of events) {
//       const d = new Date(item.gregorian_date);
//       const monthIndex = d.getFullYear() * 12 + d.getMonth();
//       const key = d.toLocaleDateString(lang, {
//         month: "long",
//         year: "numeric",
//       });

//       const existing = map.get(key);
//       if (existing) {
//         existing.data.push(item);
//       } else {
//         map.set(key, { data: [item], monthIndex });
//       }
//     }

//     const initialCollapsed = new Set<string>();

//     const grouped: CalendarSectionType[] = Array.from(map.entries()).map(
//       ([title, { data, monthIndex }]) => {
//         if (monthIndex !== currentMonthIndex) {
//           initialCollapsed.add(title);
//         }
//         return {
//           title,
//           data: data.sort((a, b) =>
//             a.gregorian_date < b.gregorian_date ? -1 : 1
//           ),
//         };
//       }
//     );

//     setSections(grouped);

//     setCollapsedSections((prev) => {
//       if (prev.size === 0) {
//         return initialCollapsed;
//       }
//       const merged = new Set(prev);
//       initialCollapsed.forEach((title) => merged.add(title));
//       return merged;
//     });
//   }, [events, lang]);

//   // Toggle section collapse
//   const toggleSection = useCallback((sectionTitle: string) => {
//     setCollapsedSections((prev) => {
//       const newSet = new Set(prev);
//       if (newSet.has(sectionTitle)) {
//         newSet.delete(sectionTitle);
//       } else {
//         newSet.add(sectionTitle);
//       }
//       return newSet;
//     });
//   }, []);

//   // ✅ Memoized section header renderer
//   const renderSectionHeader = useCallback(
//     ({ section }: { section: CalendarSectionType }) => {
//       const isCollapsed = collapsedSections.has(section.title);

//       return (
//         <SectionHeader
//           title={section.title}
//           isCollapsed={isCollapsed}
//           onToggle={() => toggleSection(section.title)}
//           colorScheme={colorScheme}
//         />
//       );
//     },
//     [collapsedSections, colorScheme, toggleSection]
//   );

//   // ✅ Memoized item renderer - passes pre-computed values to memoized card
//   const renderItem = useCallback(
//     ({
//       item,
//       section,
//     }: {
//       item: CalendarType;
//       section: CalendarSectionType;
//     }) => {
//       // Don't render if section is collapsed
//       if (collapsedSections.has(section.title)) {
//         return null;
//       }

//       const badgeColor = legendColorMap[item.legend_type] ?? "#999";
//       const diff = dayDiffFromToday(item.gregorian_date);
//       const isNext = nextUpcomingDiff !== null && diff === nextUpcomingDiff;

//       return (
//         <CalendarEventCard
//           item={item}
//           badgeColor={badgeColor}
//           diff={diff}
//           isNext={isNext}
//           lang={lang}
//           t={t}
//         />
//       );
//     },
//     [collapsedSections, legendColorMap, dayDiffFromToday, nextUpcomingDiff, lang, t]
//   );

//   // ✅ Stable key extractor
//   const keyExtractor = useCallback((item: CalendarType) => String(item.id), []);

//   // ✅ Memoized empty component
//   const listEmptyComponent = useMemo(
//     () => <EmptyComponent t={t} />,
//     [t]
//   );

//   // ✅ Memoized header component
//   const listHeaderComponent = useMemo(() => <ListHeader />, []);

//   // Loading state
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
//       keyExtractor={keyExtractor}
//       stickySectionHeadersEnabled={false}
//       showsVerticalScrollIndicator={false}
//       ListHeaderComponent={listHeaderComponent}
//       renderSectionHeader={renderSectionHeader}
//       renderItem={renderItem}
//       contentContainerStyle={styles.listContent}
//       ListEmptyComponent={listEmptyComponent}
//       // ✅ Performance optimizations
//       initialNumToRender={10}
//       maxToRenderPerBatch={8}
//       windowSize={5}
//       removeClippedSubviews={true}
//       updateCellsBatchingPeriod={50}
//     />
//   );
// };

// export default RenderCalendar;

// const styles = StyleSheet.create({
//   listContent: {
//     paddingHorizontal: 16,
//     paddingBottom: 32,
//   },
//   legendWrap: {
//     paddingTop: 20,
//     paddingBottom: 24,
//   },
//   sectionHeaderRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 20,
//     marginTop: 12,
//   },
//   chevronIcon: {
//     marginRight: 8,
//   },
//   sectionDivider: {
//     flex: 1,
//     height: 1,
//     opacity: 0.5,
//   },
//   sectionTitle: {
//     paddingHorizontal: 16,
//     fontSize: 13,
//     fontWeight: "700",
//     letterSpacing: 1.2,
//     textTransform: "uppercase",
//     opacity: 0.7,
//   },
//   loadingWrap: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   loadingText: {
//     marginTop: 16,
//     opacity: 0.6,
//     fontSize: 14,
//   },
//   emptyWrap: {
//     paddingTop: 80,
//     alignItems: "center",
//   },
//   emptyText: {
//     fontSize: 15,
//     fontStyle: "italic",
//     opacity: 0.5,
//   },
// });

// components/RenderCalendar.tsx
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
  memo,
} from "react";
import {
  StyleSheet,
  useColorScheme,
  View,
  SectionList,
  TouchableOpacity,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import CalendarLegend from "./CalendarLegend";
import CalendarEventCard from "./CalendarEventCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { CalendarSectionType, CalendarType } from "@/constants/Types";
import { useTranslation } from "react-i18next";
import {
  getAllCalendarDates,
  getCalendarLegendColorById,
} from "@/db/queries/calendar";
import { Colors } from "@/constants/Colors";
import { LoadingIndicator } from "./LoadingIndicator";
import { useDataVersionStore } from "@/stores/dataVersionStore";
import { Entypo } from "@expo/vector-icons";

// Memoized section header component
const SectionHeader = memo(function SectionHeader({
  title,
  isCollapsed,
  onToggle,
  colorScheme,
}: {
  title: string;
  isCollapsed: boolean;
  onToggle: () => void;
  colorScheme: "light" | "dark";
}) {
  return (
    <TouchableOpacity onPress={onToggle} activeOpacity={0.7}>
      <View style={styles.sectionHeaderRow}>
        <Entypo
          name={isCollapsed ? "chevron-right" : "chevron-down"}
          size={26}
          color={Colors[colorScheme].text}
          style={styles.chevronIcon}
        />
        <View
          style={[
            styles.sectionDivider,
            { backgroundColor: Colors[colorScheme].devider },
          ]}
        />
        <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
        <View
          style={[
            styles.sectionDivider,
            { backgroundColor: Colors[colorScheme].devider },
          ]}
        />
      </View>
    </TouchableOpacity>
  );
});

// Memoized list header
const ListHeader = memo(function ListHeader() {
  return (
    <View style={styles.legendWrap}>
      <CalendarLegend />
    </View>
  );
});

// Memoized empty component
const EmptyComponent = memo(function EmptyComponent({
  t,
}: {
  t: (key: string) => string;
}) {
  return (
    <View style={styles.emptyWrap}>
      <ThemedText style={styles.emptyText}>{t("noData")}</ThemedText>
    </View>
  );
});

const RenderCalendar: React.FC = () => {
  const colorScheme = useColorScheme() || "light";
  const { lang } = useLanguage();
  const { t } = useTranslation();

  // ✅ Refs for auto-scroll
  const sectionListRef =
    useRef<SectionList<CalendarType, CalendarSectionType>>(null);
  const hasScrolledRef = useRef(false);
  const scrollAttemptsRef = useRef(0);

  const [events, setEvents] = useState<CalendarType[]>([]);
  const [legendColorMap, setLegendColorMap] = useState<Record<number, string>>(
    {}
  );
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState<CalendarSectionType[]>([]);
  const [nextUpcomingDiff, setNextUpcomingDiff] = useState<number | null>(null);
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
    new Set()
  );

  const calendarVersion = useDataVersionStore((s) => s.calendarVersion);

  // Fetch calendar data
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const [ev, colorMap] = await Promise.all([
          getAllCalendarDates(lang),
          getCalendarLegendColorById(lang),
        ]);
        if (!cancelled) {
          setEvents(ev ?? []);
          setLegendColorMap(colorMap);
        }
      } catch (e) {
        if (!cancelled) {
          setEvents([]);
          setLegendColorMap({});
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

  // ✅ Original date logic preserved exactly
  const startOfDay = useCallback((d: Date) => {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  }, []);

  const parseItemDate = useCallback((s: string) => {
    const [year, month, day] = s.split("-").map(Number);
    return new Date(year, month - 1, day);
  }, []);

  // ✅ Fresh todayStart on each relevant render
  const todayStart = useMemo(() => startOfDay(new Date()), [startOfDay]);

  const dayDiffFromToday = useCallback(
    (dateStr: string) =>
      Math.round(
        (parseItemDate(dateStr).getTime() - todayStart.getTime()) / 86400000
      ),
    [parseItemDate, todayStart]
  );

  // Calculate the next upcoming event
  useEffect(() => {
    let minPos: number | null = null;
    for (const e of events) {
      const d = dayDiffFromToday(e.gregorian_date);
      if (d > 0 && (minPos === null || d < minPos)) minPos = d;
    }
    setNextUpcomingDiff(minPos);
  }, [events, dayDiffFromToday]);

  // Group events by month/year and auto-collapse non-current months
  useEffect(() => {
    const now = new Date();
    const currentMonthIndex = now.getFullYear() * 12 + now.getMonth();

    const map = new Map<string, { data: CalendarType[]; monthIndex: number }>();

    for (const item of events) {
      const d = new Date(item.gregorian_date);
      const monthIndex = d.getFullYear() * 12 + d.getMonth();
      const key = d.toLocaleDateString(lang, {
        month: "long",
        year: "numeric",
      });

      const existing = map.get(key);
      if (existing) {
        existing.data.push(item);
      } else {
        map.set(key, { data: [item], monthIndex });
      }
    }

    const initialCollapsed = new Set<string>();

    const grouped: CalendarSectionType[] = Array.from(map.entries()).map(
      ([title, { data, monthIndex }]) => {
        if (monthIndex !== currentMonthIndex) {
          initialCollapsed.add(title);
        }
        return {
          title,
          data: data.sort((a, b) =>
            a.gregorian_date < b.gregorian_date ? -1 : 1
          ),
        };
      }
    );

    setSections(grouped);

    setCollapsedSections((prev) => {
      if (prev.size === 0) {
        return initialCollapsed;
      }
      const merged = new Set(prev);
      initialCollapsed.forEach((title) => merged.add(title));
      return merged;
    });
  }, [events, lang]);

  // ✅ Find target event (today or next upcoming)
  const findTargetEvent = useCallback((): {
    sectionIndex: number;
    itemIndex: number;
    sectionTitle: string;
  } | null => {
    if (!sections.length) return null;

    // First pass: find today's event
    for (let si = 0; si < sections.length; si++) {
      const section = sections[si];
      for (let ii = 0; ii < section.data.length; ii++) {
        const item = section.data[ii];
        const diff = dayDiffFromToday(item.gregorian_date);
        if (diff === 0) {
          return {
            sectionIndex: si,
            itemIndex: ii,
            sectionTitle: section.title,
          };
        }
      }
    }

    // Second pass: find next upcoming event (first future event)
    for (let si = 0; si < sections.length; si++) {
      const section = sections[si];
      for (let ii = 0; ii < section.data.length; ii++) {
        const item = section.data[ii];
        const diff = dayDiffFromToday(item.gregorian_date);
        if (diff > 0) {
          return {
            sectionIndex: si,
            itemIndex: ii,
            sectionTitle: section.title,
          };
        }
      }
    }

    // Fallback: last event in last section (all past)
    const lastSI = sections.length - 1;
    const lastSection = sections[lastSI];
    if (lastSection && lastSection.data.length > 0) {
      return {
        sectionIndex: lastSI,
        itemIndex: lastSection.data.length - 1,
        sectionTitle: lastSection.title,
      };
    }

    return null;
  }, [sections, dayDiffFromToday]);

  // ✅ Scroll to target
  const scrollToTarget = useCallback(
    (target: ReturnType<typeof findTargetEvent>) => {
      if (!target || !sectionListRef.current) return;

      // Expand target section if collapsed
      setCollapsedSections((prev) => {
        if (prev.has(target.sectionTitle)) {
          const newSet = new Set(prev);
          newSet.delete(target.sectionTitle);
          return newSet;
        }
        return prev;
      });

      // Delay to allow section expansion to render
      setTimeout(() => {
        try {
          sectionListRef.current?.scrollToLocation({
            sectionIndex: target.sectionIndex,
            itemIndex: target.itemIndex,
            viewPosition: 0.15,
            animated: true,
          });
        } catch (error) {
          console.warn("Scroll attempt failed:", error);
        }
      }, 250);
    },
    []
  );

  // ✅ Auto-scroll on initial load
  useEffect(() => {
    if (loading || !sections.length || hasScrolledRef.current) return;

    const target = findTargetEvent();
    if (!target) return;

    // Delay to ensure list is fully rendered
    const timer = setTimeout(() => {
      scrollToTarget(target);
      hasScrolledRef.current = true;
    }, 400);

    return () => clearTimeout(timer);
  }, [loading, sections, findTargetEvent, scrollToTarget]);

  // ✅ Reset scroll flag when data changes
  useEffect(() => {
    hasScrolledRef.current = false;
    scrollAttemptsRef.current = 0;
  }, [calendarVersion, lang]);

  // ✅ Handle scroll failures (for variable height items)
  const handleScrollToIndexFailed = useCallback(
    (info: {
      index: number;
      highestMeasuredFrameIndex: number;
      averageItemLength: number;
    }) => {
      scrollAttemptsRef.current += 1;

      // Limit retry attempts
      if (scrollAttemptsRef.current > 5) {
        console.warn("Max scroll attempts reached");
        return;
      }

      const target = findTargetEvent();
      if (!target) return;

      const waitTime = 100 * scrollAttemptsRef.current;

      setTimeout(() => {
        // First scroll to highest measured position
        try {
          sectionListRef.current?.scrollToLocation({
            sectionIndex: target.sectionIndex,
            itemIndex: Math.min(
              target.itemIndex,
              info.highestMeasuredFrameIndex
            ),
            viewPosition: 0,
            animated: false,
          });
        } catch {}

        // Then retry actual target
        setTimeout(() => {
          try {
            sectionListRef.current?.scrollToLocation({
              sectionIndex: target.sectionIndex,
              itemIndex: target.itemIndex,
              viewPosition: 0.15,
              animated: true,
            });
          } catch {}
        }, 150);
      }, waitTime);
    },
    [findTargetEvent]
  );

  // Toggle section collapse
  const toggleSection = useCallback((sectionTitle: string) => {
    setCollapsedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionTitle)) {
        newSet.delete(sectionTitle);
      } else {
        newSet.add(sectionTitle);
      }
      return newSet;
    });
  }, []);

  // ✅ Memoized section header renderer
  const renderSectionHeader = useCallback(
    ({ section }: { section: CalendarSectionType }) => {
      const isCollapsed = collapsedSections.has(section.title);

      return (
        <SectionHeader
          title={section.title}
          isCollapsed={isCollapsed}
          onToggle={() => toggleSection(section.title)}
          colorScheme={colorScheme}
        />
      );
    },
    [collapsedSections, colorScheme, toggleSection]
  );

  // ✅ Memoized item renderer
  const renderItem = useCallback(
    ({
      item,
      section,
    }: {
      item: CalendarType;
      section: CalendarSectionType;
    }) => {
      // Don't render if section is collapsed
      if (collapsedSections.has(section.title)) {
        return null;
      }

      const badgeColor = legendColorMap[item.legend_type] ?? "#999";
      const diff = dayDiffFromToday(item.gregorian_date);
      const isNext = nextUpcomingDiff !== null && diff === nextUpcomingDiff;

      return (
        <CalendarEventCard
          item={item}
          badgeColor={badgeColor}
          diff={diff}
          isNext={isNext}
          lang={lang}
          t={t}
        />
      );
    },
    [
      collapsedSections,
      legendColorMap,
      dayDiffFromToday,
      nextUpcomingDiff,
      lang,
      t,
    ]
  );

  // ✅ Stable key extractor
  const keyExtractor = useCallback((item: CalendarType) => String(item.id), []);

  // ✅ Memoized empty component
  const listEmptyComponent = useMemo(() => <EmptyComponent t={t} />, [t]);

  // ✅ Memoized header component
  const listHeaderComponent = useMemo(() => <ListHeader />, []);

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
    <SectionList<CalendarType, CalendarSectionType>
      ref={sectionListRef}
      sections={sections}
      keyExtractor={keyExtractor}
      stickySectionHeadersEnabled={false}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={listHeaderComponent}
      renderSectionHeader={renderSectionHeader}
      renderItem={renderItem}
      contentContainerStyle={styles.listContent}
      ListEmptyComponent={listEmptyComponent}
      onScrollToIndexFailed={handleScrollToIndexFailed}
      // ✅ Performance optimizations
      initialNumToRender={15}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
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
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    marginTop: 12,
  },
  chevronIcon: {
    marginRight: 8,
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
