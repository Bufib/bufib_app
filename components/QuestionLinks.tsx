import React from "react";
import {
  View,
  StyleSheet,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";
import { useColorScheme } from "react-native";
import LatestQuestions from "@/components/LatestQuestions";
import { ThemedText } from "@/components/ThemedText";
import { categories } from "@/utils/categories";
import { Colors } from "@/constants/Colors";
import { returnSize } from "@/utils/sizes";
import { useTranslation } from "react-i18next";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function QuestionLinks() {
  const { width, height } = useWindowDimensions();
  const { t } = useTranslation();
  // Dynamically calculate the size of each element based on screen width
  const { elementSize, fontSize, iconSize, imageSize, gap } = returnSize(
    width,
    height
  );

  const colorScheme = useColorScheme() || "light";

  return (
    <View style={styles.container}>
      <View style={styles.categoriesContainer}>
        <View style={styles.categoriesHeaderContainer}>
          <ThemedText style={[styles.categoriesContainerText]}>
            {t("categories")} (7)
          </ThemedText>
          <AntDesign
            name="search1"
            size={30}
            color="black"
            style={{ marginRight: 6 }}
          />
        </View>
        <View style={styles.categories}>
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                router.push({
                  pathname: "/(tabs)/knowledge/(questions)/categories",
                  params: { category: category.value, categoryName: category.name },
                });
              }}
              style={[
                styles.element,
                {
                  backgroundColor: Colors[colorScheme].contrast,
                  width: elementSize,
                  height: elementSize,
                },
              ]}
            >
              <View
                style={[
                  styles.categoryButtonContainer,
                  { gap: iconSize / 10 - 1 },
                ]}
              >
                <View
                  style={[
                    styles.iconContainer,
                    { width: iconSize, height: iconSize },
                  ]}
                >
                  <Image
                    style={[styles.elementIcon, { width: iconSize }]}
                    source={category.image}
                    contentFit="contain"
                  />
                </View>
                <View>
                  <ThemedText
                    style={[styles.elementText, { fontSize: fontSize }]}
                  >
                    {category.name}
                  </ThemedText>
                </View>
              </View>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            onPress={() => {
              router.push({
                pathname: "/(tabs)/knowledge/(questions)/categories",
                params: { category: "Videos", categoryName: t("videos") },
              });
            }}
            style={[
              styles.element,
              {
                backgroundColor: Colors[colorScheme].contrast,
                width: "100%",
                height: elementSize / 1.5,
              },
            ]}
          >
            <View
              style={[
                styles.categoryButtonContainer,
                { gap: iconSize / 10 - 1 },
              ]}
            >
              <View style={styles.videoTextContainer}>
                <Entypo
                  name="folder-video"
                  size={33}
                  color={Colors.universal.questionLinksIcon}
                />
                <ThemedText
                  style={[styles.elementText, { fontSize: fontSize * 1.8 }]}
                >
                  {t("videos")}
                </ThemedText>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footerContainer}>
        <View style={styles.footerHeaderContainer}>
          <ThemedText style={[styles.footerHeaderContainerText]}>
            {t("newQuestions")}
          </ThemedText>
        </View>
        <LatestQuestions />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    margin: 20,
    gap: 30,
  },

  categoriesContainer: {
    flexDirection: "column",
    marginTop: 10,
  },
  categoriesHeaderContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  categoriesContainerText: {
    fontSize: 25,
    fontWeight: "500",
  },
  categories: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 20,
  },

  imageHeader: {
    height: "auto",
    aspectRatio: 2,
  },
  flatListContent: {
    gap: 7,
    paddingRight: 15,
    paddingLeft: 15,
    paddingVertical: 10,
  },
  flatListStyles: {},

  element: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 13,

    // iOS Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,

    // Android Shadow
    elevation: 5,
  },

  categoryPressed: {
    top: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,

    // Android Shadow
    elevation: 5,
  },
  categoryButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
  },

  iconContainer: {
    borderRadius: 90,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.universal.questionLinksIcon,
  },
  videoTextContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },

  elementIcon: {
    height: "auto",
    aspectRatio: 1.5,
    alignSelf: "center",
  },
  elementText: {
    fontWeight: "bold",
    textAlign: "center",
  },
  footerContainer: {
    flex: 1,
  },
  footerHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerHeaderContainerText: {
    fontSize: 25,
    fontWeight: "500",
  },
});
