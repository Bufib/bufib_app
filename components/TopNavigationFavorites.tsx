import * as React from "react";
import { useRef, useEffect } from "react";
import {
  useWindowDimensions,
  useColorScheme,
  Animated,
  Easing,
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import FavoriteNewsArticles from "@/app/(tabs)/favorites/favoriteNewsArticles";
import FavoritePrayers from "@/app/(tabs)/favorites/favoritePrayers";
import FavoriteQuestions from "@/app/(tabs)/favorites/favoriteQuestions";
import FavoritePodcasts from "@/app/(tabs)/favorites/favoritePodcasts";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { Image } from "expo-image";
import { useScreenFadeIn } from "@/hooks/useScreenFadeIn";

const renderScene = SceneMap({
  favoriteNewsArticles: FavoriteNewsArticles,
  favoritePrayers: FavoritePrayers,
  favoriteQuestions: FavoriteQuestions,
  favoritePodcasts: FavoritePodcasts,
});

export default function TopNavigationFavorites() {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const colorScheme = useColorScheme() || "light";
  const { fadeAnim, onLayout } = useScreenFadeIn(800);

  const routes = React.useMemo(
    () => [
      {
        key: "favoriteNewsArticles",
        // title: t("newsArticleScreenTitle"),
        title: "",
        icon: require("@/assets/images/newsArticleHeaderLogo.png"),
      },
      {
        key: "favoritePodcasts",
        // title: t("podcastScreenTitle"),
        title: "",
        icon: require("@/assets/images/podcastHeaderLogo2.png"),
      },
      {
        key: "favoritePrayers",
        // title: t("prayerScreenTitle"),
        title: "",
        icon: require("@/assets/images/prayersHeaderLogo.png"),
      },
      {
        key: "favoriteQuestions",
        // title: t("questionScreenTitle"),
        title: "",
        icon: require("@/assets/images/qAndAHeaderLogo.png"),
      },
    ],
    []
  );

  return (
    <>
      <Animated.View
        onLayout={onLayout}
        style={[
          {
            flex: 1,
            opacity: fadeAnim,
            backgroundColor: Colors[colorScheme].background,
          },
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
            favoriteNewsArticles: {
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
            favoritePodcasts: {
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
            favoriteQuestions: {
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
            favoritePrayers: {
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
    </>
  );
}
