import React from "react";
import {
  StyleSheet,
  SectionList,
  View,
  useColorScheme,
  SectionListData,
  SectionListRenderItemInfo,
  ImageBackground,
} from "react-native";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { Colors } from "@/constants/Colors";
import { ChapterSectionType, LevelType } from "@/constants/Types";

const HistoryScreen: React.FC = () => {
  const scheme = (useColorScheme() ?? "light") as "light" | "dark";

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

  const renderSectionHeader = ({
    section,
  }: {
    section: SectionListData<LevelType, ChapterSectionType>;
  }) => (
    <View
      style={[
        styles.sectionHeader,
        { backgroundColor: Colors[scheme].contrast },
      ]}
    >
      <ThemedText style={styles.sectionTitle}>{section.title}</ThemedText>
    </View>
  );

  const renderLevel = ({
    item,
    index,
    section,
  }: SectionListRenderItemInfo<LevelType, ChapterSectionType>) => (
    <ThemedView
      style={[
        styles.levelContainer,
        index % 2 === 0
          ? { alignSelf: "flex-start" }
          : { alignSelf: "flex-end" },
      ]}
    >
      {/* If duplicates are possible, prefer index+1 instead of indexOf */}
      <ThemedText style={styles.levelNumber}>{index + 1}</ThemedText>
      <ThemedText style={styles.levelName}>{item}</ThemedText>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      <SectionList<LevelType, ChapterSectionType>
        sections={sections}
        keyExtractor={(item: LevelType, index: number) => `${item}-${index}`}
        renderItem={renderLevel}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={styles.listContent}
        stickySectionHeadersEnabled
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        SectionSeparatorComponent={() => <View style={{ height: 10 }} />}
      />
    </ThemedView>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  sectionHeader: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: -16, // Extend to screen edges
    marginBottom: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
  },
  levelContainer: {
    width: 150,
    height: 150,
    borderWidth: 2,
    borderRadius: 75,
    justifyContent: "center",
    alignItems: "center",
  },
  levelNumber: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 8,
  },
  levelName: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
});
