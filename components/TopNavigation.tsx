import * as React from "react";
import { useWindowDimensions, useColorScheme } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import indexPrayer from "@/app/(tabs)/knowledge/(prayers)/indexPrayer";
import indexQuestion from "@/app/(tabs)/knowledge/(questions)/indexQuestion";
import i18n from "@/utils/i18n";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "react-i18next";
const renderScene = SceneMap({
  questionsScreen: indexQuestion,
  prayerScreen: indexPrayer,
});

export default function TopNavigation() {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const colorScheme = useColorScheme() || "light";
  const { t } = useTranslation();

  const routes = React.useMemo(
    () => [
      { key: "questionsScreen", title: t("questionScreenTitle") },
      { key: "prayerScreen", title: t("prayerScreenTitle") },
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
