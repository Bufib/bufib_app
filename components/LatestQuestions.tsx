import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  FlatList,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import { router } from "expo-router";
import { getLatestQuestions } from "@/db/queries/questions";
import { LanguageCode, QuestionType } from "@/constants/Types";
import { CoustomTheme } from "@/utils/coustomTheme";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { useDatabaseSync } from "@/hooks/useDatabaseSync";
import { LoadingIndicator } from "./LoadingIndicator";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "react-i18next";
import { runDatabaseSync } from "@/db/runDatabaseSync";
import { useDataVersionStore } from "@/stores/dataVersionStore";

const LatestQuestions: React.FC = () => {
  //State & Hooks
  const [latestQuestions, setLatestQuestions] = useState<QuestionType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { lang } = useLanguage();
  const themeStyles = CoustomTheme();
  const colorScheme = useColorScheme();
  const { t } = useTranslation();
  const questionsVersion = useDataVersionStore((s) => s.questionsVersion);

  useEffect(() => {
    const loadLatestQuestions = async () => {
      setIsLoading(true);
      try {
        const questions = await getLatestQuestions(lang);
        setLatestQuestions(questions);
      } catch (error) {
        console.error("Error loading latest questions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLatestQuestions();
  }, [lang, questionsVersion]);

  // loading
  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <LoadingIndicator />
      </ThemedView>
    );
  }

  // Child Component: Renders a Single Question Row
  const QuestionItem: React.FC<{
    item: QuestionType;
    onPress: () => void;
  }> = ({ item, onPress }) => (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.questionItem,
        themeStyles.contrast,
        pressed && {
          ...styles.pressed,
          backgroundColor: colorScheme === "dark" ? "#242c40" : "#E8E8E8",
        },
      ]}
    >
      <View style={styles.questionContent}>
        <ThemedText style={styles.questionPreview} numberOfLines={2}>
          {item.question}
        </ThemedText>
        <View style={styles.categoryContainer}>
          <ThemedText style={styles.categoryText}>
            {item.question_category_name} {" > "}{" "}
            {item.question_subcategory_name}
          </ThemedText>
        </View>
      </View>
    </Pressable>
  );

  //Render Item Function
  const renderItem = ({ item }: { item: QuestionType }) => (
    <QuestionItem
      item={item}
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
    />
  );

  //Main Render: FlatList of Latest Questions
  return (
    <FlatList
      data={latestQuestions}
      extraData={questionsVersion}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      style={styles.list}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    marginTop: 20,
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    flex: 1,
    paddingHorizontal: 5,
  },
  listContent: {
    marginTop: 15,
    gap: 12,
  },
  questionItem: {
    borderRadius: 7,
    padding: 16,
    // iOS Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    // Android Shadow
    elevation: 5,
  },
  pressed: {
    top: 2,
    // iOS Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    // Android Shadow
    elevation: 5,
  },
  questionContent: {
    gap: 8,
  },
  questionPreview: {
    fontSize: 14,
  },
  categoryContainer: {},
  categoryText: {
    fontSize: 12,
    color: "#888",
  },
});

export default LatestQuestions;
