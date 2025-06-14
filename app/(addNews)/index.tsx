// import { Pressable, StyleSheet, useColorScheme, View } from "react-native";
// import React from "react";
// import { TabView, SceneMap, TabBar } from "react-native-tab-view";
// import AddPushMessages from "./addPushMessages";
// import AddNews from "./addNews";
// import { useWindowDimensions } from "react-native";
// import { useState } from "react";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { CoustomTheme } from "@/utils/coustomTheme";
// import { Colors } from "@/constants/Colors";
// import { AntDesign } from "@expo/vector-icons";

// const Index = () => {
//   const renderScene = SceneMap({
//     addNews: AddNews,
//     addPush: AddPushMessages,
//   });

//   const routes = [
//     { key: "addNews", title: "Neue Nachricht" },
//     { key: "addPush", title: "Push-Benachrichtigung" },
//   ];

//   const layout = useWindowDimensions();
//   const [index, setIndex] = useState(0);
//   const themeStyles = CoustomTheme();
//   const colorScheme = useColorScheme() || "light";
//   return (
//     <>
//       <SafeAreaView
//         style={[{ backgroundColor: Colors[colorScheme].contrast }]}
//         edges={["top"]}
//       />

//       <TabView
//         navigationState={{ index, routes }}
//         renderScene={renderScene}
//         onIndexChange={setIndex}
//         initialLayout={{ width: layout.width }}
//         style={{ borderTopRightRadius: 2, borderTopLeftRadius: 2 }}
//         renderTabBar={(props) => (
//           <TabBar
//             {...props}
//             style={{ backgroundColor: Colors[colorScheme].contrast }} // Style for the tab bar background
//             indicatorStyle={{
//               backgroundColor: Colors[colorScheme].indicatorColor,
//             }} // Style for the indicator
//             activeColor={Colors[colorScheme].activeLabelColor}
//             inactiveColor={Colors[colorScheme].inactiveLabelColor}
//           />
//         )}
//       />
//     </>
//   );
// };

// export default Index;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   header: {
//     height: 50,
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 10,
//     backgroundColor: "transparent",
//   },
// });

import React, { useState } from "react";
import { StyleSheet, useColorScheme, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";

import AddPushMessages from "./addPushMessages";
import AddNews from "./addNews";
import { CoustomTheme } from "@/utils/coustomTheme";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

export default function Index() {
  const router = useRouter();
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const colorScheme = useColorScheme() || "light";
  const themeStyles = CoustomTheme();

  const routes = [
    { key: "addNews", title: "Neue Nachricht" },
    { key: "addPush", title: "Push-Benachrichtigung" },
  ];
  const renderScene = SceneMap({
    addNews: AddNews,
    addPush: AddPushMessages,
  });

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: Colors[colorScheme].contrast },
      ]}
      edges={["top", "left", "right"]}
    >
      {/* Back button INSIDE the SafeAreaView */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.replace("/home/")}
          style={styles.backButton}
        >
          <Ionicons
            name="chevron-back-outline"
            size={30}
            style={{ marginLeft: -16 }}
            onPress={() => router.back()}
            color={colorScheme === "dark" ? "#d0d0c0" : "#000"}
          />
        </Pressable>
      </View>

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        style={styles.tabView}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            style={[styles.tabBar, themeStyles.contrast]}
            indicatorStyle={{
              backgroundColor: Colors[colorScheme].indicatorColor,
            }}
            activeColor={Colors[colorScheme].activeLabelColor}
            inactiveColor={Colors[colorScheme].inactiveLabelColor}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    height: 50,
  },
  backButton: {
    padding: 8,
  },
  tabView: {
    flex: 1,
  },
  tabBar: {
    backgroundColor: "transparent",
  },
});
