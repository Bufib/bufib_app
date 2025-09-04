// import React, { useState, useRef } from "react";
// import {
//   StyleSheet,
//   SectionList,
//   View,
//   useColorScheme,
//   SectionListData,
//   SectionListRenderItemInfo,
//   ImageBackground,
//   ViewToken,
//   TouchableOpacity,
// } from "react-native";
// import { ThemedView } from "./ThemedView";
// import { ThemedText } from "./ThemedText";
// import { Colors } from "@/constants/Colors";
// import { ChapterSectionType, LevelType } from "@/constants/Types";

// const HistoryScreen: React.FC = () => {
//   const scheme = (useColorScheme() ?? "light") as "light" | "dark";
//   const [currentSection, setCurrentSection] = useState<string>("Propheten");

//   // Define background images for each section
//   const backgroundImages: { [key: string]: any } = {
//     Propheten: require("@/assets/images/prophets.png"),
//     "Ahlul-Bayt": require("@/assets/images/quran.png"),
//     Ashura: require("@/assets/images/quran.png"),
//   };

//   const sections: ChapterSectionType[] = [
//     {
//       title: "Propheten",
//       data: [
//         "Adam (s.)",
//         "Nuh (s.)",
//         "Ibrahim (s.)",
//         "Lut (s.)",
//         "Ismail (s.)",
//         "Yaqub (s.)",
//         "Yusuf (s.)",
//         "Ayyub (s.)",
//         "Musa (s.)",
//         "Harun (s.)",
//         "Dawud (s.)",
//         "Sulayman (s.)",
//         "Yunus (s.)",
//         "Zakariya (s.)",
//         "Yahya (s.)",
//         "Isa (s.)",
//         "Muhammad (s.)",
//       ],
//     },
//     {
//       title: "Ahlul-Bayt",
//       data: ["Ali", "Fatima", "Hassan", "Hussein", "Zainab", "Abbas", "Sajjad"],
//     },
//     {
//       title: "Ashura",
//       data: [
//         "Day 1",
//         "Day 2",
//         "Day 3",
//         "Day 4",
//         "Day 5",
//         "Day 6",
//         "Day 7",
//         "Day 8",
//         "Day 9",
//         "Day 10",
//       ],
//     },
//   ];

//   // Handle viewable items change to detect current section
//   const onViewableItemsChanged = useRef(
//     ({ viewableItems }: { viewableItems: ViewToken[] }) => {
//       if (viewableItems.length > 0) {
//         // Find the section of the first viewable item
//         const firstViewableItem = viewableItems[0];
//         if (firstViewableItem.section && firstViewableItem.section.title) {
//           setCurrentSection(firstViewableItem.section.title);
//         }
//       }
//     }
//   ).current;

//   const viewabilityConfig = useRef({
//     viewAreaCoveragePercentThreshold: 50, // Item is considered viewable if 50% is visible
//   }).current;

//   const renderSectionHeader = ({
//     section,
//   }: {
//     section: SectionListData<LevelType, ChapterSectionType>;
//   }) => (
//     <View
//       style={[
//         styles.sectionHeader,
//         { backgroundColor: Colors[scheme].contrast },
//       ]}
//     >
//       <ThemedText style={styles.sectionTitle}>{section.title}</ThemedText>
//     </View>
//   );

//   const renderLevel = ({
//     item,
//     index,
//     section,
//   }: SectionListRenderItemInfo<LevelType, ChapterSectionType>) => (
//     <TouchableOpacity
//       style={[
//         styles.levelContainer,
//         index % 2 === 0
//           ? { alignSelf: "flex-start" }
//           : { alignSelf: "flex-end" },
//       ]}
//     >
//       <ThemedText style={styles.levelNumber}>{index + 1}</ThemedText>
//       <ThemedText style={styles.levelName}>{item}</ThemedText>
//     </TouchableOpacity>
//   );

//   return (
//     <ThemedView style={styles.container}>
//       <ImageBackground
//         style={styles.containerBackground}
//         source={backgroundImages[currentSection]}
//         blurRadius={0}
//         resizeMode="cover"
//       >
//         <SectionList<LevelType, ChapterSectionType>
//           sections={sections}
//           keyExtractor={(item: LevelType, index: number) => `${item}-${index}`}
//           renderItem={renderLevel}
//           renderSectionHeader={renderSectionHeader}
//           contentContainerStyle={styles.listContent}
//           stickySectionHeadersEnabled
//           showsVerticalScrollIndicator={false}
//           ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
//           SectionSeparatorComponent={() => <View style={{ height: 10 }} />}
//           onViewableItemsChanged={onViewableItemsChanged}
//           viewabilityConfig={viewabilityConfig}
//         />
//       </ImageBackground>
//     </ThemedView>
//   );
// };

// export default HistoryScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   containerBackground: {
//     flex: 1,
//   },
//   listContent: {
//     paddingHorizontal: 16,
//     paddingBottom: 20,
//   },
//   sectionHeader: {
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     marginHorizontal: -16,
//     marginBottom: 20,
//     marginTop: 10,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: "700",
//   },
//   levelContainer: {
//     width: 150,
//     height: 150,
//     borderWidth: 2,
//     borderRadius: 75,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#228B22",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 11 },
//     shadowOpacity: 0.5,
//     shadowRadius: 6,
//     // Android elevation
//     elevation: 5,
//   },
//   levelNumber: {
//     fontSize: 24,
//     fontWeight: "600",
//     marginBottom: 8,
//   },
//   levelName: {
//     fontSize: 16,
//     fontWeight: "500",
//     textAlign: "center",
//   },
// });


import React, { useState, useRef } from "react";
import {
  StyleSheet,
  SectionList,
  View,
  useColorScheme,
  SectionListData,
  SectionListRenderItemInfo,
  ImageBackground,
  ViewToken,
  TouchableOpacity,
  Alert,
} from "react-native";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { Colors } from "@/constants/Colors";
import { ChapterSectionType, LevelType } from "@/constants/Types";
import { useLevelProgressStore } from "@/stores/levelProgressStore";

const HistoryScreen: React.FC = () => {
  const scheme = (useColorScheme() ?? "light") as "light" | "dark";
  const [currentSection, setCurrentSection] = useState<string>("Propheten");

  // Get store methods
  const store = useLevelProgressStore();

  // Define background images for each section
  const backgroundImages: { [key: string]: any } = {
    Propheten: require("@/assets/images/prophets.png"),
    "Ahlul-Bayt": require("@/assets/images/ahlulBayt.jpeg"),
    Ashura: require("@/assets/images/quran.png"),
  };

  const sections: ChapterSectionType[] = [
    {
      title: "Propheten",
      data: [
        "Adam (s.)",
        "Nuh (s.)",
        "Ibrahim (s.)",
        "Lut (s.)",
        "Ismail (s.)",
        "Yaqub (s.)",
        "Yusuf (s.)",
        "Ayyub (s.)",
        "Musa (s.)",
        "Harun (s.)",
        "Dawud (s.)",
        "Sulayman (s.)",
        "Yunus (s.)",
        "Zakariya (s.)",
        "Yahya (s.)",
        "Isa (s.)",
        "Muhammad (s.)",
      ],
    },
    {
      title: "Ahlul-Bayt",
      data: ["Ali", "Fatima", "Hassan", "Hussein", "Zainab", "Abbas", "Sajjad"],
    },
    {
      title: "Ashura",
      data: [
        "Day 1",
        "Day 2",
        "Day 3",
        "Day 4",
        "Day 5",
        "Day 6",
        "Day 7",
        "Day 8",
        "Day 9",
        "Day 10",
      ],
    },
  ];

  // Handle viewable items change to detect current section
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        const firstViewableItem = viewableItems[0];
        if (firstViewableItem.section && firstViewableItem.section.title) {
          setCurrentSection(firstViewableItem.section.title);
        }
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  // Handle level press - navigate to content
  const handleLevelPress = (
    sectionTitle: string,
    levelIndex: number,
    levelName: string
  ) => {
    const status = store.getLevelStatus(sectionTitle, levelIndex);

    if (status === "locked") {
      Alert.alert(
        "Level Locked",
        "Complete the previous levels to unlock this one.",
        [{ text: "OK" }]
      );
      return;
    }

    // For active and completed levels, navigate to content
    console.log(
      `Navigating to: ${sectionTitle} - ${levelName} (Level ${levelIndex + 1})`
    );

    // TODO: Replace with actual navigation
    // navigation.navigate('LevelScreen', {
    //   sectionTitle,
    //   levelIndex,
    //   levelName,
    //   isCompleted: status === 'completed'
    // });

    // For demo purposes, show alert
    const message =
      status === "completed"
        ? `Opening "${levelName}"\n\nYou can review this content anytime.`
        : `Opening "${levelName}"\n\nComplete this to unlock the next level.`;

    Alert.alert("Navigate to Level", message);
  };

  // Function to complete a level (call this from your level content screen)
  const completeLevel = (sectionTitle: string, levelIndex: number) => {
    store.markLevelComplete(sectionTitle, levelIndex);
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

  const renderSectionHeader = ({
    section,
  }: {
    section: SectionListData<LevelType, ChapterSectionType>;
  }) => {
    const sectionProgress = store.getSectionProgress(
      section.title,
      section.data.length
    );

    return (
      <View
        style={[
          styles.sectionHeader,
          { backgroundColor: Colors[scheme].contrast },
        ]}
      >
        <View style={styles.sectionHeaderContent}>
          <ThemedText style={styles.sectionTitle}>{section.title}</ThemedText>
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
  }: SectionListRenderItemInfo<LevelType, ChapterSectionType>) => {
    const status = store.getLevelStatus(section.title, index);
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
        onPress={() => handleLevelPress(section.title, index, item)}
        activeOpacity={isClickable ? 0.7 : 1}
        disabled={!isClickable}
      >
        {/* Level number */}
        <ThemedText style={[styles.levelNumber, { color: styling.textColor }]}>
          {index + 1}
        </ThemedText>

        {/* Level name */}
        <ThemedText style={[styles.levelName, { color: styling.textColor }]}>
          {item}
        </ThemedText>

        {/* Status indicator */}
        <View style={styles.statusIndicator}>
          {status === "completed" && (
            <ThemedText style={styles.statusIcon}>✓</ThemedText>
          )}
          {status === "active" && (
            <ThemedText style={styles.statusIcon}>▶</ThemedText>
          )}
          {status === "locked" && (
            <ThemedText style={[styles.statusIcon, { color: "#999" }]}>
              🔒
            </ThemedText>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ImageBackground
        style={styles.containerBackground}
        source={backgroundImages[currentSection]}
        blurRadius={0}
        resizeMode="cover"
      >
        <SectionList<LevelType, ChapterSectionType>
          sections={sections}
          keyExtractor={(item: LevelType, index: number) => `${item}-${index}`}
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
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  overallProgressText: {
    fontSize: 16,
    fontWeight: "600",
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
    fontSize: 28,
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
