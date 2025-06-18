import React, { useState, useLayoutEffect } from "react";
import {
  View,
  Pressable,
  StyleSheet,
  FlatList,
  useColorScheme,
  Platform,
} from "react-native";
import { CoustomTheme } from "@/utils/coustomTheme";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Entypo from "@expo/vector-icons/Entypo";
import { router } from "expo-router";
import { getFavoriteQuestions } from "@/utils/bufibDatabase";
import { useRefreshFavorites } from "@/stores/refreshFavoriteStore";
import { QuestionType } from "@/constants/Types";
import { useTranslation } from "react-i18next";
import { LoadingIndicator } from "./LoadingIndicator";

function RenderFavoriteQuestions() {
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();
  const themeStyle = CoustomTheme();
  const colorScheme = useColorScheme();
  const { refreshTriggerFavorites } = useRefreshFavorites();

  useLayoutEffect(() => {
    let isMounted = true;
    const loadQuestions = async () => {
      try {
        setIsLoading(true);
        const favs = await getFavoriteQuestions();
        if (isMounted) {
          if (favs) {
            setQuestions(favs);
            setError(null);
          } else {
            setQuestions([]);
            setError("Fehler beim Laden deiner Favoriten!");
          }
        }
      } catch (err) {
        console.error("Error loading favorite questions:", err);
        if (isMounted) {
          setQuestions([]);
          setError("Fehler beim Laden deiner Favoriten!");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadQuestions();
    return () => {
      isMounted = false;
    };
  }, [refreshTriggerFavorites]);

  if (error && !isLoading && questions.length === 0) {
    return (
      <ThemedView style={styles.centeredContainer}>
        <ThemedText>{error}</ThemedText>
      </ThemedView>
    );
  }

  if (isLoading) {
    return (
      <ThemedView style={styles.centeredContainer}>
        <LoadingIndicator size="large" />
      </ThemedView>
    );
  }

  if (questions.length === 0 && !isLoading && !error) {
    return (
      <ThemedView style={styles.centeredContainer}>
        <ThemedText style={styles.emptyText}>{t("noFavorites")}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, themeStyle.defaultBackgorundColor]}>
      <FlatList
        data={questions}
        extraData={refreshTriggerFavorites}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        style={themeStyle.defaultBackgorundColor}
        contentContainerStyle={styles.flatListStyle}
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/(displayQuestion)",
                params: {
                  category: item.question_category_name,
                  subcategory: item.question_subcategory_name,
                  questionId: item.id.toString(),
                  questionTitle: item.title,
                },
              })
            }
          >
            <ThemedView style={[styles.item, themeStyle.contrast]}>
              <View style={styles.questionContainer}>
                <ThemedText style={styles.titleText}>{item.title}</ThemedText>
                <ThemedText style={styles.questionText} numberOfLines={2}>
                  {item.question}
                </ThemedText>
              </View>
              <Entypo
                name="chevron-thin-right"
                size={24}
                color={colorScheme === "dark" ? "#fff" : "#000"}
              />
            </ThemedView>
          </Pressable>
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
    paddingHorizontal: 20,
  },
  flatListStyle: {
    paddingTop: 15,
    gap: 20,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 10,
    ...Platform.select({
      ios: {
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  questionContainer: {
    flex: 1,
    marginRight: 10,
    gap: 4,
  },
  titleText: {
    fontSize: 18,
    textAlign: "left",
    fontWeight: "500",
  },
  questionText: {
    fontSize: 16,
    textAlign: "left",
    color: "#666",
  },
  emptyText: {
    textAlign: "center",
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 22,
  },
});

export default RenderFavoriteQuestions;
