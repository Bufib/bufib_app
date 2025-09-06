import * as React from "react";
import { useWindowDimensions, useColorScheme } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import indexPrayer from "@/app/(tabs)/knowledge/prayers/indexPrayer";
import indexQuestion from "@/app/(tabs)/knowledge/questions/indexQuestion";
import indexCalender from "@/app/(tabs)/knowledge/calendar/indexCalender";
import indexQuran from "@/app/(tabs)/knowledge/quran/indexQuran";
import indexHistory from "@/app/(tabs)/knowledge/history/indexHistory";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "react-i18next";
const renderScene = SceneMap({
  questionsScreen: indexQuestion,
  prayerScreen: indexPrayer,
  calenderScreen: indexCalender,
  quranScreen: indexQuran,
  historyScreen: indexHistory,
});

export default function TopNavigationKnowledge() {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const colorScheme = useColorScheme() || "light";
  const { t } = useTranslation();

  const routes = React.useMemo(
    () => [
      { key: "questionsScreen", title: t("questionScreenTitle") },
      { key: "prayerScreen", title: t("prayerScreenTitle") },
      { key: "calenderScreen", title: t("calenderScreenTitle") },
      { key: "quranScreen", title: t("quranScreen") },
      { key: "historyScreen", title: t("historyScreen") },
    ],
    [t]
  );

  return (
    <>
      <SafeAreaView
        style={[{ backgroundColor: Colors[colorScheme].contrast }]}
        edges={["top"]}
      />
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
