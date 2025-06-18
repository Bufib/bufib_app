import React from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Pressable,
  useColorScheme,
  TouchableOpacity,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";

import { useFetchVideoCategories } from "@/hooks/useFetchVideoCategories";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { useLanguage } from "@/contexts/LanguageContext";
import HeaderLeftBackButton from "@/components/HeaderLeftBackButton";
import { useTranslation } from "react-i18next";

export default function RenderQuestionVideosCategories() {
  const colorScheme = useColorScheme() || "light";
  const router = useRouter();
  const { language } = useLanguage();
  const { categories, isLoading, error } = useFetchVideoCategories(
    language || "de"
  );
  const { t } = useTranslation();
  if (isLoading) {
    return (
      <ThemedView style={styles.centeredContainer}>
        <LoadingIndicator size={"large"} />
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.centeredContainer}>
        <ThemedText
          style={{ color: Colors[colorScheme].error }}
          type="subtitle"
        >
          {error.message}
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          headerLeft: () => <HeaderLeftBackButton />,
          headerTitle: t("videos"),
        }}
      />
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        style={ { backgroundColor: Colors[colorScheme].background }} 
        contentContainerStyle={styles.flatListStyle}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/knowledge/questionVideos",
                params: { categoryName: item.video_category },
              })
            }
          >
            <ThemedView
              style={[
                styles.item,
                { backgroundColor: Colors[colorScheme].contrast },
              ]} // Apply contrast style from theme
            >
              <View style={styles.questionContainer}>
                <ThemedText style={styles.titleText}>
                  {item.video_category}
                </ThemedText>
              </View>
              <Entypo
                name="chevron-thin-right"
                size={24}
                color={colorScheme === "dark" ? "#fff" : "#000"} // Dynamic icon color based on theme
              />
            </ThemedView>
          </TouchableOpacity>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  flatListStyle: {
    paddingTop: 10,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    marginBottom: 15,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
  },
  questionContainer: {
    flex: 1,
    marginRight: 10,
    gap: 2,
  },
  titleText: {
    fontSize: 18,
    textAlign: "left",
    fontWeight: "500",
  },
});
