// import * as React from "react";
// import {
//   View,
//   useWindowDimensions,
//   StyleSheet,
//   Text,
//   useColorScheme,
// } from "react-native";
// import { TabView, SceneMap } from "react-native-tab-view";
// import prayers from "@/app/(tabs)/knowledge/(routes)/prayers";
// import questions from "@/app/(tabs)/knowledge/(routes)/questions";
// import i18n from "@/utils/i18n";
// import { SafeAreaView } from "react-native-safe-area-context";
// import AntDesign from "@expo/vector-icons/AntDesign";
// const renderScene = SceneMap({
//   questionsScreen: questions,
//   prayerScreen: prayers,
// });

// const routes = [
//   { key: "questionsScreen", title: i18n.t("questionScreenTitle") },
//   { key: "prayerScreen", title: i18n.t("prayerScreenTitle") },
// ];

// export default function TopNavigation() {
//   const layout = useWindowDimensions();
//   const [index, setIndex] = React.useState(0);
//   const colorScheme = useColorScheme() || "light";
//   return (
//     <SafeAreaView style={styles.container} edges={["top"]}>
//       <View style={styles.headerIconContainer}>
//         <AntDesign
//           name="search1"
//           size={24}
//           color={colorScheme === "dark" ? "#fff" : "#000"}
//           style={{ alignSelf: "flex-end", marginRight: 20 }}
//         />
//       </View>

//       <TabView
//         navigationState={{ index, routes }}
//         renderScene={renderScene}
//         onIndexChange={setIndex}
//         initialLayout={{ width: layout.width }}
//       />
//     </SafeAreaView>
//   );
// }
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   headerIconContainer: {
//     marginBottom: 30,
//   },
// });

import * as React from "react";
import {
  View,
  useWindowDimensions,
  StyleSheet,
  Text,
  useColorScheme,
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view"; // Import TabBar
import prayers from "@/app/(tabs)/knowledge/(routes)/prayers";
import questions from "@/app/(tabs)/knowledge/(routes)/questions";
import i18n from "@/utils/i18n";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Colors } from "@/constants/Colors";

const renderScene = SceneMap({
  questionsScreen: questions,
  prayerScreen: prayers,
});

const routes = [
  { key: "questionsScreen", title: i18n.t("questionScreenTitle") },
  { key: "prayerScreen", title: i18n.t("prayerScreenTitle") },
];

export default function TopNavigation() {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const colorScheme = useColorScheme() || "light";

  return (
    <>
      <SafeAreaView
        style={[{ backgroundColor: Colors[colorScheme].contrast }]}
        edges={["top"]}
      >
        <View style={styles.headerIconContainer}>
          <AntDesign
            name="search1"
            size={24}
            color={colorScheme === "dark" ? "#fff" : "#000"}
            style={{ alignSelf: "flex-end", marginRight: 20 }}
          />
        </View>
      </SafeAreaView>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            style={{ backgroundColor: Colors[colorScheme].contrast }} // Style for the tab bar background
            indicatorStyle={{
              backgroundColor: Colors[colorScheme].indicatorColor,
            }} // Style for the indicator
            activeColor={Colors[colorScheme].activeLabelColor}
            inactiveColor={Colors[colorScheme].inactiveLabelColor}
          />
        )}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "green",
    gap: 15,
  },
  headerIconContainer: {},
});
