// import * as React from "react";
// import { useWindowDimensions, useColorScheme } from "react-native";
// import { TabView, SceneMap, TabBar } from "react-native-tab-view";
// import indexPrayer from "@/app/(tabs)/knowledge/prayers/indexPrayer";
// import indexQuestion from "@/app/(tabs)/knowledge/questions/indexQuestion";
// import indexCalandar from "@/app/(tabs)/knowledge/calendar/indexCalandar";
// import indexQuran from "@/app/(tabs)/knowledge/quran/indexQuran";
// import indexHistory from "@/app/(tabs)/knowledge/history/indexHistory";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { Colors } from "@/constants/Colors";
// import { useLanguage } from "@/contexts/LanguageContext";
// import { useTranslation } from "react-i18next";
// import { Image } from "expo-image";
// const renderScene = SceneMap({
//   questionsScreen: indexQuestion,
//   prayerScreen: indexPrayer,
//   CalandarScreen: indexCalandar,
//   quranScreen: indexQuran,
//   historyScreen: indexHistory,
// });

// export default function TopNavigationKnowledge() {
//   const layout = useWindowDimensions();
//   const [index, setIndex] = React.useState(0);
//   const colorScheme = useColorScheme() || "light";
//   const { t } = useTranslation();

//   const routes = React.useMemo(
//     () => [
//       {
//         key: "questionsScreen",
//         title: t("questionScreenTitle"),
//         icon: require("@/assets/images/qAndAHeaderLogo.png"),
//       },
//       {
//         key: "prayerScreen",
//         title: t("prayerScreenTitle"),
//         icon: require("@/assets/images/qAndAHeaderLogo.png"),
//       },
//       {
//         key: "CalandarScreen",
//         title: t("CalandarScreenTitle"),
//         icon: require("@/assets/images/qAndAHeaderLogo.png"),
//       },
//       {
//         key: "quranScreen",
//         title: t("quranScreen"),
//         icon: require("@/assets/images/qAndAHeaderLogo.png"),
//       },
//       {
//         key: "historyScreen",
//         title: t("historyScreen"),
//         icon: require("@/assets/images/qAndAHeaderLogo.png"),
//       },
//     ],
//     [t]
//   );

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
//         options={{
//           questionsScreen: {
//             icon: ({ route, focused, color }) => (
//               <Image
//                 source={route.icon}
//                 contentFit="contain"
//                 style={{
//                   width: 24,
//                   height: 24,
//                   opacity: focused ? 1 : 0.6,
//                 }}
//               />
//             ),
//           },
//         }}
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
// }

import * as React from "react";
import { useEffect } from "react";
import {
  useWindowDimensions,
  useColorScheme,
  View,
  Animated,
  Easing,
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import indexPrayer from "@/app/(tabs)/knowledge/prayers/indexPrayer";
import indexQuestion from "@/app/(tabs)/knowledge/questions/indexQuestion";
import indexQuran from "@/app/(tabs)/knowledge/quran/indexQuran";
import indexCalandar from "@/app/(tabs)/knowledge/calendar/indexCalendar";
import indexHistory from "@/app/(tabs)/knowledge/history/indexHistory";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "react-i18next";
import { Image } from "expo-image";
import { useRef } from "react";
import i18n from "@/utils/i18n";
import { LanguageCode } from "@/constants/Types";
const renderScene = SceneMap({
  questionsScreen: indexQuestion,
  prayerScreen: indexPrayer,
  calendarScreen: indexCalandar,
  quranScreen: indexQuran,
  historyScreen: indexHistory,
});

export default function TopNavigationKnowledge() {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const colorScheme = useColorScheme() || "light";
  const { lang } = useLanguage();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const routes = React.useMemo(
    () => [
      {
        key: "questionsScreen",
        title: "",
        icon: require("@/assets/images/qAndAHeaderLogo.png"),
      },
      {
        key: "prayerScreen",
        title: "",
        icon: require("@/assets/images/prayersHeaderLogo.png"),
      },
      {
        key: "calendarScreen",
        title: "",
        icon: require("@/assets/images/calendarHeaderLogo.png"),
      },
      {
        key: "quranScreen",
        title: "",
        icon: require("@/assets/images/quranHeaderLogo.png"),
      },
      {
        key: "historyScreen",
        title: "",
        icon: require("@/assets/images/historyHeaderLogo.png"),
      },
    ],
    []
  );

  // // animate opacity on mount
  // useEffect(() => {
  //   const animation = Animated.timing(fadeAnim, {
  //     toValue: 1,
  //     duration: 600,
  //     easing: Easing.out(Easing.cubic),
  //     useNativeDriver: true,
  //   });

  //   animation.start();

  //   return () => {
  //     animation.stop(); // prevent updates after unmount
  //   };
  // }, [fadeAnim]);

  return (
    <Animated.View
      style={[
        { flex: 1 },
        { opacity: fadeAnim, backgroundColor: Colors[colorScheme].background },
      ]}
    >
      <SafeAreaView
        style={[{ backgroundColor: Colors[colorScheme].contrast }]}
        edges={["top"]}
      />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        options={{
          questionsScreen: {
            icon: ({ route, focused, color }) => (
              <Image
                source={route.icon}
                contentFit="contain"
                style={{
                  width: 35,
                  height: 35,
                  opacity: focused ? 1 : 0.6,
                }}
              />
            ),
          },
          prayerScreen: {
            icon: ({ route, focused, color }) => (
              <Image
                source={route.icon}
                contentFit="contain"
                style={{
                  width: 35,
                  height: 35,
                  opacity: focused ? 1 : 0.6,
                }}
              />
            ),
          },
          calendarScreen: {
            icon: ({ route, focused, color }) => (
              <Image
                source={route.icon}
                contentFit="contain"
                style={{
                  width: 35,
                  height: 35,
                  opacity: focused ? 1 : 0.6,
                }}
              />
            ),
          },
          quranScreen: {
            icon: ({ route, focused, color }) => (
              <Image
                source={route.icon}
                contentFit="contain"
                style={{
                  width: 35,
                  height: 35,
                  opacity: focused ? 1 : 0.6,
                }}
              />
            ),
          },
          historyScreen: {
            icon: ({ route, focused, color }) => (
              <Image
                source={route.icon}
                contentFit="contain"
                style={{
                  width: 35,
                  height: 35,
                  opacity: focused ? 1 : 0.6,
                }}
              />
            ),
          },
        }}
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
    </Animated.View>
  );
}
