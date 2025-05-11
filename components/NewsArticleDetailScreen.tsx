import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  useColorScheme,
} from "react-native";
import Markdown from "react-native-markdown-display";
import { Stack } from "expo-router";
import { useFontSizeStore } from "@/stores/fontSizeStore";
import { useNewsArticles } from "@/hooks/useNewsArticles";
import { NewsArticlesType } from "@/constants/Types";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { ThemedView } from "./ThemedView";
import { useTranslation } from "react-i18next";
import { LoadingIndicator } from "./LoadingIndicator";
import Ionicons from "@expo/vector-icons/Ionicons";
import { formattedDate } from "@/utils/formate";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontSizePickerModal from "./FontSizePickerModal";
export default function NewsArticleDetailScreen({
  articleId,
}: {
  articleId?: string;
}) {
  const { fetchNewsArticleById } = useNewsArticles();
  const { fontSize, lineHeight } = useFontSizeStore();
  const colorScheme = useColorScheme() ?? "light";
  const { t } = useTranslation();
  const [article, setArticle] = useState<NewsArticlesType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFontSizePickerModal, setShowFontSizePickerModal] = useState(false);
  useEffect(() => {
    if (!articleId) {
      setError(t("errorLoadingArticle"));
      setIsLoading(false);
      return;
    }

    const loadArticle = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedArticle = await fetchNewsArticleById(parseInt(articleId));
        if (fetchedArticle) {
          setArticle(fetchedArticle);
        } else {
          setError(t("errorLoadingArticle"));
        }
      } catch (error: any) {
        console.error("Error loading news article:", error);
        setError(error.message || t("errorLoadingArticle"));
      } finally {
        setIsLoading(false);
      }
    };

    loadArticle();
  }, [articleId]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <LoadingIndicator size={"large"} />
      </View>
    );
  }

  if (error || !article) {
    return (
      <View style={styles.centered}>
        <Stack.Screen options={{ title: "Error" }} />
        <ThemedText
          type="subtitle"
          style={[styles.errorText, { color: Colors[colorScheme].error }]}
        >
          {t("errorLoadingArticle")}
        </ThemedText>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: article.title,
        }}
      />
      <ScrollView
        style={[
          styles.scrollViewStyles,
          {
            backgroundColor: Colors[colorScheme].background,
          },
        ]}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={true}
      >
        <View
          style={[
            styles.titleContainer,
            {
              backgroundColor: Colors[colorScheme].contrast,
              borderColor: Colors[colorScheme].border,
            },
          ]}
        >
          <View
            style={{ flexDirection: "row", gap: 10, alignSelf: "flex-end" }}
          >
            <Ionicons
              name="text"
              size={30}
              color={colorScheme === "dark" ? "#fff" : "#000"}
              onPress={() => setShowFontSizePickerModal(true)}
            />
            <AntDesign
              name="star"
              size={30}
              color={colorScheme === "dark" ? "#fff" : "#000"}
            />
          </View>
          <ThemedText type="title" style={styles.titleText}>
            {article.title}
          </ThemedText>
          <View style={styles.titleIconContainer}>
            <View style={styles.titleIconText}>
              <Ionicons
                name="calendar-number-sharp"
                size={24}
                color={colorScheme === "dark" ? "#fff" : "#000"}
              />
              <ThemedText>{formattedDate(article.created_at)}</ThemedText>
            </View>
            <View style={styles.titleIconText}>
              <AntDesign
                name="clockcircleo"
                size={24}
                color={colorScheme === "dark" ? "#fff" : "#000"}
              />
              <ThemedText>{article.read_time} min</ThemedText>
            </View>
          </View>
        </View>
        <View style={styles.contentContainer}>
          <Markdown
            style={{
              body: {
                color: Colors[colorScheme].text,
                fontSize: fontSize,
                lineHeight: lineHeight,
              },
            }}
          >
            {article.content}
          </Markdown>
        </View>
      </ScrollView>
      <FontSizePickerModal
        visible={showFontSizePickerModal}
        onClose={() => setShowFontSizePickerModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewStyles: {},
  scrollViewContent: {},
  titleContainer: {
    flexDirection: "column",
    gap: 10,
    padding: 20,
    paddingTop: 20,
    borderBottomWidth: 1,
  },
  titleIconContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 20,
  },
  titleIconText: {
    flexDirection: "row",
    gap: 10,
  },

  titleText: {
    textAlign: "center",
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    textAlign: "center",
  },
});
