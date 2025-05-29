import * as React from "react";
import { useWindowDimensions, useColorScheme } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import FavoriteNewsArticles from "@/app/(tabs)/favorites/favoriteNewsArticles";
import FavoritePrayers from "@/app/(tabs)/favorites/favoritePrayers";
import FavoriteQuestions from "@/app/(tabs)/favorites/favoriteQuestions";
import FavoritePodcasts from "@/app/(tabs)/favorites/favoritePodcasts";
import i18n from "@/utils/i18n";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "react-i18next";
const renderScene = SceneMap({
  favoriteNewsArticles: FavoriteNewsArticles,
  favoritePrayers: FavoritePrayers,
  favoriteQuestions: FavoriteQuestions,
  favoritesPodcasts: FavoritePodcasts,
});

export default function TopNavigationFavorites() {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const colorScheme = useColorScheme() || "light";
  const { t } = useTranslation();

  const routes = React.useMemo(
    () => [
      { key: "favoriteNewsArticles", title: t("newsArticleScreenTitle") },
      { key: "favoritePrayers", title: t("prayerScreenTitle") },
      { key: "favoriteQuestions", title: t("questionScreenTitle") },
      { key: "favoritesPodcasts", title: t("podcastScreenTitle") },
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
