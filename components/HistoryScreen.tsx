// // // import React, { useRef, useState } from "react";
// // // import { StyleSheet, View, FlatList } from "react-native";
// // // import { ThemedView } from "./ThemedView";
// // // import { ThemedText } from "./ThemedText";

// // // const HistoryScreen = () => {
// // //   const chapters = ["Propheten", "Ahlul-Bayt", "Ashura"];
// // //   const levels = ["Adam", "Moses", "Jesus"];

// // //   const [page, setPage] = useState(0);
// // //   const [listHeight, setListHeight] = useState(0);

// // //   // Update page as soon as a page is >60% visible
// // //   const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 60 }).current;
// // //   const onViewableItemsChanged = useRef(
// // //     ({ viewableItems }: { viewableItems: any }) => {
// // //       if (viewableItems?.length && viewableItems[0].index != null) {
// // //         setPage(viewableItems[0].index);
// // //       }
// // //     }
// // //   ).current;

// // //   return (
// // //     <ThemedView style={styles.container}>
// // //       <View style={styles.header}>
// // //         <ThemedText style={styles.headerText}>
// // //           Kapitel {page + 1} von {chapters.length}: {chapters[page]}
// // //         </ThemedText>
// // //       </View>

// // //       <FlatList
// // //         data={chapters}
// // //         keyExtractor={(item) => item}
// // //         pagingEnabled
// // //         decelerationRate="fast"
// // //         snapToInterval={listHeight || undefined}
// // //         snapToAlignment="start"
// // //         showsVerticalScrollIndicator={false}
// // //         scrollEventThrottle={16}
// // //         onLayout={(e) => setListHeight(e.nativeEvent.layout.height)}
// // //         viewabilityConfig={viewabilityConfig}
// // //         onViewableItemsChanged={onViewableItemsChanged}
// // //         removeClippedSubviews
// // //         getItemLayout={(_, index) => {
// // //           const len = listHeight || 0;
// // //           return { length: len, offset: len * index, index };
// // //         }}
// // //         renderItem={({ item: chapter }) => (
// // //           <ThemedView style={[styles.page, { height: listHeight || "100%" }]}>
// // //             <View style={styles.pagesContainer}>
// // //               {levels.map((level, index) => (
// // //                 <ThemedView
// // //                   key={`${chapter}-${level}-${index}`}
// // //                   style={[
// // //                     styles.levelContainer,
// // //                     index % 2 === 0
// // //                       ? { alignSelf: "flex-start" }
// // //                       : { alignSelf: "flex-end" },
// // //                   ]}
// // //                 >
// // //                   <ThemedText style={styles.levelName}>{level}</ThemedText>
// // //                 </ThemedView>
// // //               ))}
// // //             </View>
// // //           </ThemedView>
// // //         )}
// // //       />
// // //     </ThemedView>
// // //   );
// // // };

// // // export default HistoryScreen;

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //   },
// //   header: {
// //     paddingHorizontal: 16,
// //     paddingTop: 16,
// //     paddingBottom: 8,
// //   },
// //   headerText: {
// //     fontSize: 25,
// //     fontWeight: "700",
// //   },
// //   page: {
// //     paddingHorizontal: 16,
// //     paddingTop: 8,
// //   },
// //   scrollContainer: {
// //     flex: 1,
// //   },
// //   scrollContent: {
// //     paddingBottom: 20, // Add padding at the bottom
// //   },
// //   levelContainer: {
// //     width: 150,
// //     height: 150,
// //     borderWidth: 2,
// //     borderRadius: 75, // Half of width/height for perfect circle
// //     justifyContent: "center",
// //     alignItems: "center",
// //     backgroundColor: "rgba(0,0,0,0.05)", // Optional: subtle background
// //   },
// //   levelNumber: {
// //     fontSize: 24,
// //     fontWeight: "600",
// //     marginBottom: 8,
// //   },
// //   levelName: {
// //     fontSize: 16,
// //     fontWeight: "500",
// //     textAlign: "center",
// //   },
// // });

// import React from "react";
// import { StyleSheet, FlatList, View } from "react-native";
// import { ThemedView } from "./ThemedView";
// import { ThemedText } from "./ThemedText";

// const HistoryScreen = () => {
//   // Flatten data for FlatList with type indicators
//   const data = [
//     { type: 'header', title: 'Propheten', id: 'header-1' },
//     { type: 'level', name: 'Adam', chapter: 'Propheten', index: 0, id: 'propheten-0' },
//     { type: 'level', name: 'Noah', chapter: 'Propheten', index: 1, id: 'propheten-1' },
//     { type: 'level', name: 'Abraham', chapter: 'Propheten', index: 2, id: 'propheten-2' },
//     { type: 'level', name: 'Moses', chapter: 'Propheten', index: 3, id: 'propheten-3' },
//     { type: 'level', name: 'Jesus', chapter: 'Propheten', index: 4, id: 'propheten-4' },
//     { type: 'level', name: 'Muhammad', chapter: 'Propheten', index: 5, id: 'propheten-5' },

//     { type: 'header', title: 'Ahlul-Bayt', id: 'header-2' },
//     { type: 'level', name: 'Ali', chapter: 'Ahlul-Bayt', index: 0, id: 'ahlul-0' },
//     { type: 'level', name: 'Fatima', chapter: 'Ahlul-Bayt', index: 1, id: 'ahlul-1' },
//     { type: 'level', name: 'Hassan', chapter: 'Ahlul-Bayt', index: 2, id: 'ahlul-2' },
//     { type: 'level', name: 'Hussein', chapter: 'Ahlul-Bayt', index: 3, id: 'ahlul-3' },

//     { type: 'header', title: 'Ashura', id: 'header-3' },
//     { type: 'level', name: 'Day 1', chapter: 'Ashura', index: 0, id: 'ashura-0' },
//     { type: 'level', name: 'Day 2', chapter: 'Ashura', index: 1, id: 'ashura-1' },
//     { type: 'level', name: 'Day 3', chapter: 'Ashura', index: 2, id: 'ashura-2' },
//     { type: 'level', name: 'Day 4', chapter: 'Ashura', index: 3, id: 'ashura-3' },
//     { type: 'level', name: 'Day 5', chapter: 'Ashura', index: 4, id: 'ashura-4' },
//   ];

//   const renderItem = ({ item }) => {
//     if (item.type === 'header') {
//       return (
//         <View style={styles.sectionHeader}>
//           <ThemedText style={styles.sectionTitle}>{item.title}</ThemedText>
//         </View>
//       );
//     }

//     return (
//       <ThemedView
//         style={[
//           styles.levelContainer,
//           item.index % 2 === 0
//             ? { alignSelf: "flex-start" }
//             : { alignSelf: "flex-end" },
//           { marginBottom: 20 }
//         ]}
//       >
//         <ThemedText style={styles.levelNumber}>
//           {item.index + 1}
//         </ThemedText>
//         <ThemedText style={styles.levelName}>{item.name}</ThemedText>
//       </ThemedView>
//     );
//   };

//   return (
//     <ThemedView style={styles.container}>
//       <FlatList
//         data={data}
//         keyExtractor={(item) => item.id}
//         renderItem={renderItem}
//         contentContainerStyle={styles.listContent}
//         showsVerticalScrollIndicator={false}
//       />
//     </ThemedView>
//   );
// };

// export default HistoryScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   listContent: {
//     paddingHorizontal: 16,
//     paddingTop: 16,
//     paddingBottom: 20,
//   },
//   sectionHeader: {
//     marginHorizontal: -16, // Extend to screen edges
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     backgroundColor: '#f5f5f5',
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
//     backgroundColor: 'rgba(0,0,0,0.05)',
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

import React from "react";
import { StyleSheet, SectionList, View } from "react-native";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";

const HistoryScreen = () => {
  // Data structured for SectionList - easily expandable
  const sections = [
    {
      title: "Propheten",
      data: [
        "Adam",
        "Noah",
        "Abraham",
        "Moses",
        "Jesus",
        "Muhammad",
        "David",
        "Solomon",
        "Joseph",
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

  const renderSectionHeader = ({ section }) => (
    <View style={styles.sectionHeader}>
      <ThemedText style={styles.sectionTitle}>{section.title}</ThemedText>
    </View>
  );

  const renderLevel = ({ item, index, section }) => (
    <ThemedView
      style={[
        styles.levelContainer,
        index % 2 === 0
          ? { alignSelf: "flex-start" }
          : { alignSelf: "flex-end" },
      ]}
    >
      <ThemedText style={styles.levelNumber}>
        {section.data.indexOf(item) + 1}
      </ThemedText>
      <ThemedText style={styles.levelName}>{item}</ThemedText>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => item + index}
        renderItem={renderLevel}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={styles.listContent}
        stickySectionHeadersEnabled={true} // Makes headers stick to top while scrolling
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
    backgroundColor: "#f5f5f5", // Adjust based on your theme
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
    backgroundColor: "rgba(0,0,0,0.05)",
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
