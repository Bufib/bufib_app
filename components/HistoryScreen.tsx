// // import React, { useState, useRef } from "react";
// // import {
// //   StyleSheet,
// //   SectionList,
// //   View,
// //   useColorScheme,
// //   SectionListData,
// //   SectionListRenderItemInfo,
// //   ImageBackground,
// //   ViewToken,
// //   TouchableOpacity,
// //   Alert,
// // } from "react-native";
// // import { ThemedView } from "./ThemedView";
// // import { ThemedText } from "./ThemedText";
// // import { Colors } from "@/constants/Colors";
// // import { ChapterSectionType, LevelType } from "@/constants/Types";
// // import { useLevelProgressStore } from "@/stores/levelProgressStore";
// // import { router } from "expo-router";

// // const HistoryScreen: React.FC = () => {
// //   const scheme = (useColorScheme() ?? "light") as "light" | "dark";
// //   const [currentSection, setCurrentSection] = useState<string>("Propheten");

// //   // Get store methods
// //   const store = useLevelProgressStore();

// //   // Define background images for each section
// //   const backgroundImages: { [key: string]: any } = {
// //     Propheten: require("@/assets/images/prophets.png"),
// //     "Ahlul-Bayt": require("@/assets/images/ahlulBayt.jpeg"),
// //     Ashura: require("@/assets/images/quran.png"),
// //   };

// //   const sections: ChapterSectionType[] = [
// //     {
// //       title: "Prophets",
// //       data: [
// //         "Adam (s.)",
// //         "Nuh (s.)",
// //         "Ibrahim (s.)",
// //         "Lut (s.)",
// //         "Ismail (s.)",
// //         "Yaqub (s.)",
// //         "Yusuf (s.)",
// //         "Ayyub (s.)",
// //         "Musa (s.)",
// //         "Harun (s.)",
// //         "Dawud (s.)",
// //         "Sulayman (s.)",
// //         "Yunus (s.)",
// //         "Zakariya (s.)",
// //         "Yahya (s.)",
// //         "Isa (s.)",
// //         "Muhammad (s.)",
// //       ],
// //     },
// //     {
// //       title: "Ahlul-Bayt",
// //       data: ["Ali", "Fatima", "Hassan", "Hussein", "Zainab", "Abbas", "Sajjad"],
// //     },
// //     {
// //       title: "Ashura",
// //       data: [
// //         "Day 1",
// //         "Day 2",
// //         "Day 3",
// //         "Day 4",
// //         "Day 5",
// //         "Day 6",
// //         "Day 7",
// //         "Day 8",
// //         "Day 9",
// //         "Day 10",
// //       ],
// //     },
// //   ];

// //   // Handle viewable items change to detect current section
// //   const onViewableItemsChanged = useRef(
// //     ({ viewableItems }: { viewableItems: ViewToken[] }) => {
// //       if (viewableItems.length > 0) {
// //         const firstViewableItem = viewableItems[0];
// //         if (firstViewableItem.section && firstViewableItem.section.title) {
// //           setCurrentSection(firstViewableItem.section.title);
// //         }
// //       }
// //     }
// //   ).current;

// //   const viewabilityConfig = useRef({
// //     viewAreaCoveragePercentThreshold: 50,
// //   }).current;

// //   // Handle level press - navigate to content
// //   const handleLevelPress = (
// //     sectionTitle: string,
// //     levelIndex: number,
// //     levelName: string
// //   ) => {
// //     const status = store.getLevelStatus(sectionTitle, levelIndex);
// //     const route = "";
// //     if (status === "locked") {
// //       Alert.alert(
// //         "Level Locked",
// //         "Complete the previous levels to unlock this one.",
// //         [{ text: "OK" }]
// //       );
// //       return;
// //     } else {
// //       router.push("../knowledge/history/prophets/adam/");
// //     }
// //   };

// //   // Function to complete a level (call this from your level content screen)
// //   const completeLevel = (sectionTitle: string, levelIndex: number) => {
// //     store.markLevelComplete(sectionTitle, levelIndex);
// //   };

// //   // Get level styling based on status
// //   const getLevelStyling = (status: "locked" | "active" | "completed") => {
// //     switch (status) {
// //       case "completed":
// //         return {
// //           backgroundColor: "#4169E1", // Blue
// //           opacity: 1,
// //           textColor: "white",
// //           borderColor: "#4169E1",
// //         };
// //       case "active":
// //         return {
// //           backgroundColor: "#228B22", // Green
// //           opacity: 1,
// //           textColor: "white",
// //           borderColor: "#228B22",
// //         };
// //       case "locked":
// //       default:
// //         return {
// //           backgroundColor: "#808080", // Gray
// //           opacity: 0.6,
// //           textColor: "#C0C0C0",
// //           borderColor: "#606060",
// //         };
// //     }
// //   };

// //   const renderSectionHeader = ({
// //     section,
// //   }: {
// //     section: SectionListData<LevelType, ChapterSectionType>;
// //   }) => {
// //     const sectionProgress = store.getSectionProgress(
// //       section.title,
// //       section.data.length
// //     );

// //     return (
// //       <View
// //         style={[
// //           styles.sectionHeader,
// //           { backgroundColor: Colors[scheme].contrast },
// //         ]}
// //       >
// //         <View style={styles.sectionHeaderContent}>
// //           <ThemedText style={styles.sectionTitle}>{section.title}</ThemedText>
// //           <View style={styles.progressInfo}>
// //             <ThemedText style={styles.progressText}>
// //               {sectionProgress.completed}/{sectionProgress.total}
// //             </ThemedText>
// //             <ThemedText style={styles.progressPercentage}>
// //               {sectionProgress.percentage}%
// //             </ThemedText>
// //           </View>
// //         </View>

// //         {/* Progress bar */}
// //         <View style={styles.progressBarContainer}>
// //           <View
// //             style={[
// //               styles.progressBar,
// //               { width: `${sectionProgress.percentage}%` },
// //             ]}
// //           />
// //         </View>
// //       </View>
// //     );
// //   };

// //   const renderLevel = ({
// //     item,
// //     index,
// //     section,
// //   }: SectionListRenderItemInfo<LevelType, ChapterSectionType>) => {
// //     const status = store.getLevelStatus(section.title, index);
// //     const styling = getLevelStyling(status);
// //     const isClickable = status === "active" || status === "completed";

// //     return (
// //       <TouchableOpacity
// //         style={[
// //           styles.levelContainer,
// //           {
// //             backgroundColor: styling.backgroundColor,
// //             opacity: styling.opacity,
// //             borderColor: styling.borderColor,
// //             alignSelf: index % 2 === 0 ? "flex-start" : "flex-end",
// //           },
// //         ]}
// //         onPress={() => handleLevelPress(section.title, index, item)}
// //         activeOpacity={isClickable ? 0.7 : 1}
// //         disabled={!isClickable}
// //       >
// //         {/* Level number */}
// //         <ThemedText style={[styles.levelNumber, { color: styling.textColor }]}>
// //           {index + 1}
// //         </ThemedText>

// //         {/* Level name */}
// //         <ThemedText style={[styles.levelName, { color: styling.textColor }]}>
// //           {item}
// //         </ThemedText>

// //         {/* Status indicator */}
// //         <View style={styles.statusIndicator}>
// //           {status === "completed" && (
// //             <ThemedText style={styles.statusIcon}>✓</ThemedText>
// //           )}
// //           {status === "active" && (
// //             <ThemedText style={styles.statusIcon}>▶</ThemedText>
// //           )}
// //           {status === "locked" && (
// //             <ThemedText style={[styles.statusIcon, { color: "#999" }]}>
// //               🔒
// //             </ThemedText>
// //           )}
// //         </View>
// //       </TouchableOpacity>
// //     );
// //   };

// //   return (
// //     <ThemedView style={styles.container}>
// //       <ImageBackground
// //         style={styles.containerBackground}
// //         source={backgroundImages[currentSection]}
// //         blurRadius={0}
// //         resizeMode="cover"
// //       >
// //         <SectionList<LevelType, ChapterSectionType>
// //           sections={sections}
// //           keyExtractor={(item: LevelType, index: number) => `${item}-${index}`}
// //           renderItem={renderLevel}
// //           renderSectionHeader={renderSectionHeader}
// //           contentContainerStyle={styles.listContent}
// //           stickySectionHeadersEnabled
// //           showsVerticalScrollIndicator={false}
// //           ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
// //           SectionSeparatorComponent={() => <View style={{ height: 15 }} />}
// //           onViewableItemsChanged={onViewableItemsChanged}
// //           viewabilityConfig={viewabilityConfig}
// //         />
// //       </ImageBackground>
// //     </ThemedView>
// //   );
// // };

// // export default HistoryScreen;

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //   },
// //   containerBackground: {
// //     flex: 1,
// //   },
// //   overallProgressContainer: {
// //     paddingVertical: 12,
// //     paddingHorizontal: 16,
// //     marginBottom: 8,
// //   },
// //   overallProgressText: {
// //     fontSize: 16,
// //     fontWeight: "600",
// //     textAlign: "center",
// //   },
// //   listContent: {
// //     paddingHorizontal: 16,
// //     paddingBottom: 20,
// //   },
// //   sectionHeader: {
// //     paddingVertical: 12,
// //     paddingHorizontal: 16,
// //     marginHorizontal: -16,
// //     marginBottom: 20,
// //     marginTop: 10,
// //     borderRadius: 8,
// //   },
// //   sectionHeaderContent: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //     marginBottom: 10,
// //   },
// //   sectionTitle: {
// //     fontSize: 24,
// //     fontWeight: "700",
// //   },
// //   progressInfo: {
// //     alignItems: "flex-end",
// //   },
// //   progressText: {
// //     fontSize: 14,
// //     fontWeight: "500",
// //     opacity: 0.8,
// //   },
// //   progressPercentage: {
// //     fontSize: 16,
// //     fontWeight: "700",
// //     color: "#FFD700",
// //   },
// //   progressBarContainer: {
// //     height: 6,
// //     backgroundColor: "rgba(255, 255, 255, 0.2)",
// //     borderRadius: 3,
// //     overflow: "hidden",
// //   },
// //   progressBar: {
// //     height: "100%",
// //     backgroundColor: "#FFD700",
// //     borderRadius: 3,
// //   },
// //   levelContainer: {
// //     width: 150,
// //     height: 150,
// //     borderWidth: 3,
// //     borderRadius: 75,
// //     justifyContent: "center",
// //     alignItems: "center",
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 8 },
// //     shadowOpacity: 0.4,
// //     shadowRadius: 6,
// //     elevation: 8,
// //     position: "relative",
// //   },
// //   levelNumber: {
// //     fontSize: 28,
// //     fontWeight: "700",
// //     marginBottom: 4,
// //   },
// //   levelName: {
// //     fontSize: 15,
// //     fontWeight: "600",
// //     textAlign: "center",
// //     paddingHorizontal: 8,
// //   },
// //   statusIndicator: {
// //     position: "absolute",
// //     top: 8,
// //     right: 8,
// //     backgroundColor: "rgba(0, 0, 0, 0.3)",
// //     borderRadius: 15,
// //     width: 30,
// //     height: 30,
// //     justifyContent: "center",
// //     alignItems: "center",
// //   },
// //   statusIcon: {
// //     fontSize: 16,
// //     fontWeight: "bold",
// //     color: "white",
// //   },
// // });

import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  SectionList,
  View,
  useColorScheme,
  ImageBackground,
  ViewToken,
  TouchableOpacity,
  Alert,
} from "react-native";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { Colors } from "@/constants/Colors";
import { useLevelProgressStore } from "@/stores/levelProgressStore";
import { router } from "expo-router";
import { SECTIONS_DATA, getLevelOrder } from "@/data/historyData";
import { SectionType, ProphetType, LanguageCode } from "@/constants/Types";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Feather } from "@expo/vector-icons";

const HistoryScreen: React.FC = () => {
  const scheme = (useColorScheme() ?? "light") as "light" | "dark";
  const [currentSection, setCurrentSection] = useState<string>("prophets");
  const { t } = useTranslation();
  const { language } = useLanguage();
  const lang = (language ?? "de") as LanguageCode;
  const colorScheme = useColorScheme() || "light";
  // Get store methods
  const store = useLevelProgressStore();
  const setCurrentLanguage = store.setCurrentLanguage;

  // Update store language when i18n language changes
  useEffect(() => {
    setCurrentLanguage(lang);
  }, [lang, setCurrentLanguage]);

  // Handle viewable items change to detect current section
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        const firstViewableItem = viewableItems[0];
        if (firstViewableItem.section && firstViewableItem.section.id) {
          setCurrentSection(firstViewableItem.section.id);
        }
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  // Handle level press - navigate to content
  const handleLevelPress = (sectionId: string, levelId: string, route: any) => {
    const levelOrder = getLevelOrder(sectionId);
    const status = store.getLevelStatus(lang, sectionId, levelId, levelOrder);

    if (status === "locked") {
      Alert.alert(
        t("alerts.levelLocked.title") || "Level Locked",
        t("alerts.levelLocked.message") ||
          "Complete the previous levels to unlock this one.",
        [{ text: t("common.ok") || "OK" }]
      );
      return;
    } else {
      // Navigate to the level and pass language info if needed
      router.push({
        pathname: route,
        params: { language: language, levelId, sectionId },
      });
    }
  };

  // Function to complete a level (call this from your level content screen)
  const completeLevel = (sectionId: string, levelId: string) => {
    store.markLevelComplete(lang, sectionId, levelId);
  };

  // Get level styling based on status
  const getLevelStyling = (status: "locked" | "active" | "completed") => {
    switch (status) {
      case "completed":
        return {
          backgroundColor: "#4169E1", // Blue
          opacity: 1,
          textColor: "white",
          borderColor: "#4169E1",
        };
      case "active":
        return {
          backgroundColor: "#228B22", // Green
          opacity: 1,
          textColor: "white",
          borderColor: "#228B22",
        };
      case "locked":
      default:
        return {
          backgroundColor: "#808080", // Gray
          opacity: 0.6,
          textColor: "#C0C0C0",
          borderColor: "#606060",
        };
    }
  };

  const renderSectionHeader = ({ section }: { section: SectionType }) => {
    // Get level IDs for progress calculation
    const levelIds = section.levels.map((level) => level.id);
    const sectionProgress = store.getSectionProgress(
      lang,
      section.id,
      levelIds
    );

    return (
      <View
        style={[
          styles.sectionHeader,
          { backgroundColor: Colors[scheme].contrast },
        ]}
      >
        <View style={styles.sectionHeaderContent}>
          <ThemedText style={styles.sectionTitle}>
            {t(`${section.titleKey}`)}
          </ThemedText>
          <View style={styles.progressInfo}>
            <ThemedText style={styles.progressText}>
              {sectionProgress.completed}/{sectionProgress.total}
            </ThemedText>
            <ThemedText style={styles.progressPercentage}>
              {sectionProgress.percentage}%
            </ThemedText>
          </View>
        </View>

        {/* Progress bar */}
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              { width: `${sectionProgress.percentage}%` },
            ]}
          />
        </View>
      </View>
    );
  };

  const renderLevel = ({
    item,
    index,
    section,
  }: {
    item: ProphetType;
    index: number;
    section: SectionType;
  }) => {
    const levelOrder = getLevelOrder(section.id);
    const status = store.getLevelStatus(lang, section.id, item.id, levelOrder);
    const styling = getLevelStyling(status);
    const isClickable = status === "active" || status === "completed";

    return (
      <TouchableOpacity
        style={[
          styles.levelContainer,
          {
            backgroundColor: styling.backgroundColor,
            opacity: styling.opacity,
            borderColor: styling.borderColor,
            alignSelf: index % 2 === 0 ? "flex-start" : "flex-end",
          },
        ]}
        onPress={() => handleLevelPress(section.id, item.id, item.route)}
        activeOpacity={isClickable ? 0.7 : 1}
        disabled={!isClickable}
      >
        {/* Level number */}
        <ThemedText
          type="title"
          style={[styles.levelNumber, { color: styling.textColor }]}
        >
          {index + 1}
        </ThemedText>

        {/* Level name - translated from nameKey */}
        <ThemedText style={[styles.levelName, { color: styling.textColor }]}>
          {t(`${item.nameKey}`)}
        </ThemedText>

        {/* Status indicator */}

        {(status === "completed" || status === "locked") && (
          <View style={styles.statusIndicator}>
            {status === "completed" ? (
              <Ionicons
                name="checkmark"
                size={24}
                color={Colors[colorScheme].defaultIcon}
              />
            ) : (
              <Feather
                name="lock"
                size={24}
                color="#999" // gray lock
              />
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // Get current section for background image
  const currentSectionData = SECTIONS_DATA.find((s) => s.id === currentSection);
  const sectionsForList = SECTIONS_DATA.map((section) => ({
    ...section,
    data: section.levels, // SectionList expects 'data' not 'levels'
  }));

  // Calculate overall progress for current language
  const overallProgress = store.getTotalProgress(
    lang,
    SECTIONS_DATA.map((section) => ({
      id: section.id,
      levelIds: section.levels.map((level) => level.id),
    }))
  );

  return (
    <ThemedView style={styles.container}>
      <ImageBackground
        style={styles.containerBackground}
        source={currentSectionData?.backgroundImage}
        blurRadius={0}
        resizeMode="cover"
      >
        <SectionList
          sections={sectionsForList}
          keyExtractor={(item) => item.id}
          renderItem={renderLevel}
          renderSectionHeader={renderSectionHeader}
          contentContainerStyle={styles.listContent}
          stickySectionHeadersEnabled
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
          SectionSeparatorComponent={() => <View style={{ height: 15 }} />}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
        />
      </ImageBackground>
    </ThemedView>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerBackground: {
    flex: 1,
  },
  overallProgressContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 10,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  overallProgressTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
    marginBottom: 4,
  },
  overallProgressText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFD700",
    textAlign: "center",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  sectionHeader: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: -16,
    marginBottom: 20,
    marginTop: 10,
    borderRadius: 8,
    position: "relative",
  },
  sectionHeaderContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
  },
  progressInfo: {
    alignItems: "flex-end",
  },
  progressText: {
    fontSize: 14,
    fontWeight: "500",
    opacity: 0.8,
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFD700",
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#FFD700",
    borderRadius: 3,
  },

  levelContainer: {
    width: 150,
    height: 150,
    borderWidth: 3,
    borderRadius: 75,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
    position: "relative",
  },
  levelNumber: {
    fontWeight: "700",
    marginBottom: 4,
  },
  levelName: {
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
    paddingHorizontal: 8,
  },
  statusIndicator: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  statusIcon: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
});
