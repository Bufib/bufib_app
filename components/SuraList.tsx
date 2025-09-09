// import type React from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   StyleSheet,
//   useColorScheme,
//   Dimensions,
// } from "react-native";
// import { useEffect, useMemo, useState } from "react";
// import { useTranslation } from "react-i18next";
// import { Colors } from "../constants/Colors";
// import Entypo from "@expo/vector-icons/Entypo";
// import { whenDatabaseReady } from "@/db";
// import { useLanguage } from "@/contexts/LanguageContext";
// import { Language, LanguageCode, SuraRowType } from "@/constants/Types";
// import { getSurahList } from "@/db/queries/quran";
// import { ThemedView } from "./ThemedView";
// import { ThemedText } from "./ThemedText";
// import { LoadingIndicator } from "./LoadingIndicator";
// import { router } from "expo-router";
// import { Image } from "expo-image";
// import { Color } from "@cloudinary/url-gen/qualifiers";
// import { useLastSuraStore } from "@/stores/useLastSura";
// import { LinearGradient } from "expo-linear-gradient";
// import { FlashList } from "@shopify/flash-list";

// const { width: screenWidth } = Dimensions.get("window");

// const SuraList: React.FC = () => {
//   const { t } = useTranslation();
//   const { language, isArabic } = useLanguage();
//   const lang = (language ?? "de") as LanguageCode;

//   const [suras, setSuras] = useState<SuraRowType[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const colorScheme = useColorScheme() || "light";

//   useEffect(() => {
//     let cancelled = false;
//     (async () => {
//       try {
//         setIsLoading(true);
//         await whenDatabaseReady();
//         const rows = await getSurahList();
//         if (!cancelled) setSuras(rows ?? []);
//       } catch (error) {
//         console.error("Failed to load suras:", error);
//         if (!cancelled) setSuras([]);
//       } finally {
//         if (!cancelled) setIsLoading(false);
//       }
//     })();
//     return () => {
//       cancelled = true;
//     };
//   }, [lang]);

//   const getSuraName = (s: SuraRowType) => {
//     if (lang === "ar") return s.label ?? s.label_en ?? s.label_de ?? "";
//     if (lang === "de") return s.label_de ?? s.label_en ?? s.label ?? "";
//     return s.label_en ?? s.label_de ?? s.label ?? "";
//   };

//   const lastSuraNumber = useLastSuraStore((s) => s.lastSura);

//   const lastSuraRow = useMemo(
//     () =>
//       lastSuraNumber != null
//         ? suras.find((s) => s.id === lastSuraNumber) ?? null
//         : null,
//     [suras, lastSuraNumber]
//   );
//   const lastSuraTitle = lastSuraRow ? `${getSuraName(lastSuraRow)}` : "—";

//   const renderSuraItem = ({ item }: { item: SuraRowType }) => {
//     const name = getSuraName(item);
//     const isMakki = !!item.makki;

//     if (isLoading) {
//       return (
//         <ThemedView style={styles.centerContainer}>
//           <LoadingIndicator size={"large"} />
//         </ThemedView>
//       );
//     }

//     return (
//       <TouchableOpacity
//         style={[
//           styles.card,
//           {
//             backgroundColor: Colors[colorScheme].contrast,
//           },
//         ]}
//         activeOpacity={0.8}
//         onPress={() =>
//           router.push({
//             pathname: "/knowledge/quran/sura",
//             params: {
//               suraId: item.id.toString(),
//             },
//           })
//         }
//       >
//         <View style={styles.cardContent}>
//           {/* Number Badge */}
//           <View style={styles.numberSection}>
//             <LinearGradient
//               colors={isMakki ? ["#4A90E2", "#6BA3E5"] : ["#2ECC71", "#52D681"]}
//               style={styles.numberBadge}
//             >
//               <Text style={styles.numberText}>{item.id}</Text>
//             </LinearGradient>
//           </View>

//           {/* Content Section */}
//           <View style={styles.contentSection}>
//             <ThemedText
//               style={[styles.suraName, lang === "ar" && styles.suraNameAr]}
//             >
//               {name}
//             </ThemedText>

//             <View style={styles.metaContainer}>
//               <View
//                 style={[
//                   styles.metaBadge,
//                   {
//                     backgroundColor: Colors[colorScheme].contrast,
//                   },
//                 ]}
//               >
//                 <ThemedText style={[styles.metaText]}>
//                   {item.nbAyat} {t("ayatCount")}
//                 </ThemedText>
//               </View>

//               <View
//                 style={[
//                   styles.typeBadge,
//                   { backgroundColor: isMakki ? "#E8F2FD" : "#E8F8F0" },
//                 ]}
//               >
//                 <Text
//                   style={[
//                     styles.typeText,
//                     { color: isMakki ? "#4A90E2" : "#2ECC71" },
//                   ]}
//                 >
//                   {isMakki ? t("makki") : t("madani")}
//                 </Text>
//               </View>
//             </View>
//           </View>

//           {/* Arrow */}
//           <View style={styles.arrowSection}>
//             <View
//               style={[
//                 styles.arrowCircle,
//                 {
//                   backgroundColor:
//                     colorScheme === "dark" ? "#2a3142" : "#f7f9fc",
//                 },
//               ]}
//             >
//               <Entypo
//                 name={isArabic() ? "chevron-small-left" : "chevron-small-right"}
//                 size={24}
//                 color={Colors[colorScheme].defaultIcon}
//               />
//             </View>
//           </View>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <ThemedView style={styles.container}>
//       {/* Modern Header */}
//       <TouchableOpacity
//         style={styles.headerCard}
//         activeOpacity={lastSuraRow ? 0.85 : 1}
//         onPress={() => {
//           if (lastSuraRow) {
//             router.push({
//               pathname: "/knowledge/quran/sura",
//               params: { suraId: String(lastSuraRow.id) },
//             });
//           }
//         }}
//       >
//         <LinearGradient
//           colors={
//             colorScheme === "dark"
//               ? ["#2a3142", "#1a1f2e"]
//               : ["#4A90E2", "#6BA3E5"]
//           }
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 1 }}
//           style={styles.headerGradient}
//         >
//           <View style={styles.headerContent}>
//             <View style={styles.headerTextSection}>
//               <Text style={styles.lastReadLabel}>
//                 {t("lastRead").toUpperCase()}
//               </Text>
//               <Text style={styles.lastReadSura}>{lastSuraTitle}</Text>
//               {lastSuraRow && (
//                 <View style={styles.lastReadMeta}>
//                   <Text style={styles.lastReadMetaText}>
//                     {t("ayatCount")}: {lastSuraRow.nbAyat}
//                   </Text>
//                 </View>
//               )}
//             </View>

//             <View style={styles.headerImageSection}>
//               <Image
//                 source={require("@/assets/images/quranImage2.png")}
//                 style={styles.headerImage}
//                 contentFit="contain"
//               />
//               {/* Decorative overlay */}
//               <View style={styles.imageOverlay} />
//             </View>
//           </View>
//         </LinearGradient>
//       </TouchableOpacity>

//       {/* Sura List */}
//       <FlashList
//         data={suras}
//         renderItem={renderSuraItem}
//         keyExtractor={(item) => item.id.toString()}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.listContent}
//         estimatedItemSize={111}
//         ListEmptyComponent={
//           <ThemedView style={styles.centerContainer}>
//             <ThemedText style={styles.emptyText}>{t("noData")}</ThemedText>
//           </ThemedView>
//         }
//       />
//     </ThemedView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },

//   // Header Styles
//   headerCard: {
//     marginHorizontal: 16,
//     marginTop: 12,
//     marginBottom: 20,
//     borderRadius: 24,
//     overflow: "hidden",
//     elevation: 8,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.15,
//     shadowRadius: 12,
//     borderWidth: 1,
//   },

//   headerGradient: {
//     borderRadius: 24,
//   },

//   headerContent: {
//     flexDirection: "row",
//     padding: 24,
//     minHeight: 140,
//   },

//   headerTextSection: {
//     flex: 1,
//     justifyContent: "center",
//     paddingRight: 16,
//   },

//   lastReadLabel: {
//     fontSize: 11,
//     fontWeight: "700",
//     color: "rgba(255, 255, 255, 0.7)",
//     letterSpacing: 1.2,
//     marginBottom: 8,
//   },

//   lastReadSura: {
//     fontSize: 24,
//     fontWeight: "800",
//     color: "#ffffff",
//     marginBottom: 12,
//     lineHeight: 30,
//   },

//   lastReadMeta: {
//     flexDirection: "row",
//     alignItems: "center",
//   },

//   lastReadMetaText: {
//     fontSize: 13,
//     color: "rgba(255, 255, 255, 0.8)",
//     fontWeight: "600",
//   },

//   headerImageSection: {
//     width: 120,
//     justifyContent: "center",
//     alignItems: "center",
//     position: "relative",
//   },

//   headerImage: {
//     width: 100,
//     height: 100,
//     opacity: 0.9,
//   },

//   imageOverlay: {
//     position: "absolute",
//     width: "100%",
//     height: "100%",
//     backgroundColor: "rgba(255, 255, 255, 0.05)",
//     borderRadius: 50,
//   },

//   // List Styles
//   listContent: {
//     paddingHorizontal: 16,
//     paddingBottom: 24,
//   },

//   // Card Styles
//   card: {
//     borderRadius: 16,
//     marginBottom: 12,
//     borderWidth: 1,
//     overflow: "hidden",
//     elevation: 2,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//   },

//   cardContent: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 16,
//   },

//   numberSection: {
//     marginRight: 16,
//   },

//   numberBadge: {
//     width: 48,
//     height: 48,
//     borderRadius: 14,
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   numberText: {
//     fontSize: 18,
//     fontWeight: "800",
//     color: "#ffffff",
//   },

//   contentSection: {
//     flex: 1,
//   },

//   suraName: {
//     fontSize: 17,
//     fontWeight: "700",
//     marginBottom: 8,
//     letterSpacing: 0.2,
//   },

//   suraNameAr: {
//     fontSize: 19,
//     textAlign: "right",
//     fontWeight: "600",
//   },

//   metaContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//   },

//   metaBadge: {
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderRadius: 8,
//   },

//   metaText: {
//     fontSize: 12,
//     fontWeight: "600",
//   },

//   typeBadge: {
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderRadius: 8,
//   },

//   typeText: {
//     fontSize: 12,
//     fontWeight: "700",
//   },

//   arrowSection: {
//     marginLeft: 12,
//   },

//   arrowCircle: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   // Utility Styles
//   centerContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingVertical: 48,
//   },

//   emptyText: {
//     fontSize: 16,
//     opacity: 0.6,
//   },
// });

// export default SuraList;

import type React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  Dimensions,
  ScrollView,
  Animated,
} from "react-native";
import { useEffect, useMemo, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Colors } from "../constants/Colors";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { whenDatabaseReady } from "@/db";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Language,
  LanguageCode,
  SuraRowType,
  JuzStartType,
} from "@/constants/Types";
import {
  getSurahList,
  getAllJuzStarts,
  getSurahDisplayName,
  getJuzButtonLabels,
} from "@/db/queries/quran";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { LoadingIndicator } from "./LoadingIndicator";
import { router } from "expo-router";
import { Image } from "expo-image";
import { useLastSuraStore } from "@/stores/useLastSura";
import { LinearGradient } from "expo-linear-gradient";
import { FlashList } from "@shopify/flash-list";

const { width: screenWidth } = Dimensions.get("window");

const QuranNavigation: React.FC = () => {
  const { t } = useTranslation();
  const { language, isArabic } = useLanguage();
  const lang = (language ?? "de") as LanguageCode;

  const [suras, setSuras] = useState<SuraRowType[]>([]);
  const [juzList, setJuzList] = useState<
    Array<{
      juz: number;
      label: string;
      sura: number;
      aya: number;
    }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("sura");
  const colorScheme = useColorScheme() || "light";

  // Animation for tab indicator
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setIsLoading(true);
        await whenDatabaseReady();

        // Load both suras and juz data
        const [suraRows, juzLabels] = await Promise.all([
          getSurahList(),
          getJuzButtonLabels(lang as Language),
        ]);

        if (!cancelled) {
          setSuras(suraRows ?? []);
          setJuzList(juzLabels ?? []);
        }
      } catch (error) {
        console.error("Failed to load data:", error);
        if (!cancelled) {
          setSuras([]);
          setJuzList([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [lang]);

  // Animate tab indicator when view mode changes
  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: viewMode === "sura" ? 0 : 1,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start();
  }, [viewMode]);

  const getSuraName = (s: SuraRowType) => {
    if (lang === "ar") return s.label ?? s.label_en ?? s.label_de ?? "";
    if (lang === "de") return s.label_de ?? s.label_en ?? s.label ?? "";
    return s.label_en ?? s.label_de ?? s.label ?? "";
  };

  const lastSuraNumber = useLastSuraStore((s) => s.lastSura);

  const lastSuraRow = useMemo(
    () =>
      lastSuraNumber != null
        ? suras.find((s) => s.id === lastSuraNumber) ?? null
        : null,
    [suras, lastSuraNumber]
  );
  const lastSuraTitle = lastSuraRow ? `${getSuraName(lastSuraRow)}` : "—";

  const renderSuraItem = ({ item }: { item: SuraRowType }) => {
    const name = getSuraName(item);
    const isMakki = !!item.makki;

    return (
      <TouchableOpacity
        style={[
          styles.card,
          {
            backgroundColor: Colors[colorScheme].contrast
          },
        ]}
        activeOpacity={0.8}
        onPress={() =>
          router.push({
            pathname: "/knowledge/quran/sura",
            params: {
              suraId: item.id.toString(),
            },
          })
        }
      >
        <View style={styles.cardContent}>
          {/* Number Badge */}
          <View style={styles.numberSection}>
            <LinearGradient
              colors={isMakki ? ["#4A90E2", "#6BA3E5"] : ["#2ECC71", "#52D681"]}
              style={styles.numberBadge}
            >
              <Text style={styles.numberText}>{item.id}</Text>
            </LinearGradient>
          </View>

          {/* Content Section */}
          <View style={styles.contentSection}>
            <ThemedText
              style={[styles.suraName, lang === "ar" && styles.suraNameAr]}
            >
              {name}
            </ThemedText>

            <View style={styles.metaContainer}>
              <View
                style={[
                  styles.metaBadge,
                  {
                    backgroundColor:
                      colorScheme === "dark" ? "#2a3142" : "#f3f4f6",
                  },
                ]}
              >
                <ThemedText style={[styles.metaText]}>
                  {item.nbAyat} {t("ayatCount")}
                </ThemedText>
              </View>

              <View
                style={[
                  styles.typeBadge,
                  { backgroundColor: isMakki ? "#E8F2FD" : "#E8F8F0" },
                ]}
              >
                <Text
                  style={[
                    styles.typeText,
                    { color: isMakki ? "#4A90E2" : "#2ECC71" },
                  ]}
                >
                  {isMakki ? t("makki") : t("madani")}
                </Text>
              </View>
            </View>
          </View>

          {/* Arrow */}
          <View style={styles.arrowSection}>
            <View
              style={[
                styles.arrowCircle,
                {
                  backgroundColor:
                    colorScheme === "dark" ? "#2a3142" : "#f7f9fc",
                },
              ]}
            >
              <Entypo
                name={isArabic() ? "chevron-small-left" : "chevron-small-right"}
                size={24}
                color={Colors[colorScheme].defaultIcon}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderJuzItem = ({ item }: { item: (typeof juzList)[0] }) => {
    const juzNumber = item.juz;
    const [surahName, ayahNumber] = item.label.split(" — ")[1]?.split(" ") ?? [
      "",
      "",
    ];

    return (
      <TouchableOpacity
        style={[
          styles.juzCard,
          {
            backgroundColor: Colors[colorScheme].contrast
          },
        ]}
        activeOpacity={0.8}
        onPress={() =>
          router.push({
            pathname: "/knowledge/quran/sura",
            params: { juzId: String(item.juz) },
          })
        }
      >
        <LinearGradient
          colors={["#ACE1AF", "#50C878"]}
          style={styles.juzGradientBg}
        >
          <View style={styles.juzPattern}></View>
        </LinearGradient>

        <View style={styles.juzContent}>
          <View style={styles.juzHeader}>
            <ThemedText style={styles.juzNumber}>
              {t("juz")} {juzNumber}
            </ThemedText>
            <View style={styles.juzDivider} />
          </View>

          <View style={styles.juzInfo}>
            <ThemedText style={styles.juzSuraName}>
              {item.label.split(" — ")[1] || ""}
            </ThemedText>
          </View>

          <View style={styles.juzArrow}>
            <Entypo
              name={isArabic() ? "chevron-small-left" : "chevron-small-right"}
              size={20}
              color="#000"
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <LoadingIndicator size={"large"} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {/* Modern Header */}
      <TouchableOpacity
        style={styles.headerCard}
        activeOpacity={lastSuraRow ? 0.85 : 1}
        onPress={() => {
          if (lastSuraRow) {
            router.push({
              pathname: "/knowledge/quran/sura",
              params: { suraId: String(lastSuraRow.id) },
            });
          }
        }}
      >
        <LinearGradient
          colors={
            colorScheme === "dark"
              ? ["#2a3142", "#1a1f2e"]
              : ["#4A90E2", "#6BA3E5"]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerTextSection}>
              <Text style={styles.lastReadLabel}>
                {t("lastRead").toUpperCase()}
              </Text>
              <Text style={styles.lastReadSura}>{lastSuraTitle}</Text>
              {lastSuraRow && (
                <View style={styles.lastReadMeta}>
                  <Text style={styles.lastReadMetaText}>
                    {t("ayatCount")}: {lastSuraRow.nbAyat}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.headerImageSection}>
              <Image
                source={require("@/assets/images/quranImage2.png")}
                style={styles.headerImage}
                contentFit="contain"
              />
              <View style={styles.imageOverlay} />
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <View
          style={[
            styles.tabBackground,
            {
              backgroundColor: colorScheme === "dark" ? "#1a1f2e" : "#f3f4f6",
            },
          ]}
        >
          <Animated.View
            style={[
              styles.tabIndicator,
              {
                backgroundColor: colorScheme === "dark" ? "#4A90E2" : "#ffffff",
                transform: [
                  {
                    translateX: slideAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [4, (screenWidth - 32) / 2 - 4],
                    }),
                  },
                ],
              },
            ]}
          />

          <TouchableOpacity
            style={styles.tab}
            onPress={() => setViewMode("sura")}
            activeOpacity={0.7}
          >
            <ThemedText
              style={[
                styles.tabText,
                viewMode === "sura" && styles.tabTextActive,
              ]}
            >
              {t("sura")} (114)
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tab}
            onPress={() => setViewMode("juz")}
            activeOpacity={0.7}
          >
            <ThemedText
              style={[
                styles.tabText,
                viewMode === "juz" && styles.tabTextActive,
              ]}
            >
              {t("juz")} (30)
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content List */}
      {viewMode === "sura" ? (
        <FlashList
          data={suras}
          renderItem={renderSuraItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          estimatedItemSize={111}
        />
      ) : (
        <FlashList
          data={juzList}
          renderItem={renderJuzItem}
          keyExtractor={(item) => item.juz.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          estimatedItemSize={100}
        />
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Header Styles
  headerCard: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 16,
    borderRadius: 24,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },

  headerGradient: {
    borderRadius: 24,
  },

  headerContent: {
    flexDirection: "row",
    padding: 24,
    minHeight: 140,
  },

  headerTextSection: {
    flex: 1,
    justifyContent: "center",
    paddingRight: 16,
  },

  lastReadLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "rgba(255, 255, 255, 0.7)",
    letterSpacing: 1.2,
    marginBottom: 8,
  },

  lastReadSura: {
    fontSize: 24,
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: 12,
    lineHeight: 30,
  },

  lastReadMeta: {
    flexDirection: "row",
    alignItems: "center",
  },

  lastReadMetaText: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "600",
  },

  headerImageSection: {
    width: 120,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  headerImage: {
    width: 100,
    height: 100,
    opacity: 0.9,
  },

  imageOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 50,
  },

  // Tab Styles
  tabContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },

  tabBackground: {
    flexDirection: "row",
    borderRadius: 16,
    padding: 4,
    position: "relative",
  },

  tabIndicator: {
    position: "absolute",
    top: 4,
    bottom: 4,
    width: (screenWidth - 40) / 2,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },

  tabText: {
    fontSize: 15,
    fontWeight: "600",
    opacity: 0.6,
  },

  tabTextActive: {
    opacity: 1,
    fontWeight: "700",
  },

  // List Styles
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },

  // Sura Card Styles
  card: {
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },

  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },

  numberSection: {
    marginRight: 16,
  },

  numberBadge: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  numberText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#ffffff",
  },

  contentSection: {
    flex: 1,
  },

  suraName: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 8,
    letterSpacing: 0.2,
  },

  suraNameAr: {
    fontSize: 19,
    textAlign: "right",
    fontWeight: "600",
  },

  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  metaBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },

  metaText: {
    fontSize: 12,
    fontWeight: "600",
  },

  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },

  typeText: {
    fontSize: 12,
    fontWeight: "700",
  },

  arrowSection: {
    marginLeft: 12,
  },

  arrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  // Juz Card Styles
  juzCard: {
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    height: 100,
  },

  juzGradientBg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  juzPattern: {
    position: "absolute",
    right: 20,
    top: "50%",
    marginTop: -16,
  },

  juzContent: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    height: "100%",
  },

  juzHeader: {
    flex: 1,
  },

  juzNumber: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 4,
  },

  juzDivider: {
    width: 40,
    height: 3,
    backgroundColor: "#000",
    borderRadius: 2,
    marginTop: 8,
  },

  juzInfo: {
    flex: 1,
    alignItems: "center",
  },

  juzSuraName: {
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },

  juzArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },

  // Utility Styles
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 48,
  },
});

export default QuranNavigation;
