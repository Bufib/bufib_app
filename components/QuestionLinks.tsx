import React from "react";
import {
  View,
  StyleSheet,
  useWindowDimensions,
  TouchableOpacity,
  Text,
} from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";
import { useColorScheme } from "react-native";
import LatestQuestions from "@/components/LatestQuestions";
import { ThemedText } from "@/components/ThemedText";
import { questionCategories } from "@/utils/categories";
import { Colors } from "@/constants/Colors";
import { returnSize } from "@/utils/sizes";
import { useTranslation } from "react-i18next";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import { ThemedView } from "./ThemedView";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

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
    <ThemedView style={styles.container}>
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
          {questionCategories.map((category, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                router.push({
                  pathname: "/knowledge/questionCategories",
                  params: {
                    category: category.value,
                    categoryName: category.name,
                  },
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
                pathname: "/knowledge/questionCategories",
                params: { category: "Videos", categoryName: t("videos") },
              });
            }}
            style={[
              styles.element,
              {
                backgroundColor: Colors[colorScheme].contrast,
                width: "100%",
                height: elementSize / 2,
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
                  size={28}
                  color={Colors.universal.questionLinks}
                />
                <ThemedText
                  style={[styles.elementText, { fontSize: fontSize * 1.7 }]}
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
          <ThemedText
            type="titleSmall"
            style={styles.footerHeaderContainerText}
          >
            {t("newQuestions")}
          </ThemedText>
        </View>
        <LatestQuestions />
      </View>
      <TouchableOpacity style={styles.askQuestionButton} onPress={()=> router.push("/(askQuestion)/")}>
        <MaterialCommunityIcons
          name="chat-question-outline"
          size={50}
          color="#fff"
        />
      </TouchableOpacity>
    </ThemedView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    padding: 20,
    gap: 40,
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
    backgroundColor: Colors.universal.questionLinks,
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
  footerHeaderContainerText: {},
  askQuestionButton: {
    position: "absolute",
    bottom: "15%",
    right: "5%",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: 80,
    backgroundColor: Colors.universal.primary,
    borderRadius: 10,
  },
});
