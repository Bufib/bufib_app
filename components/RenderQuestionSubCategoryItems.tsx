import { useEffect, useState } from "react";
import {
  View,
  Pressable,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { CoustomTheme } from "@/utils/coustomTheme";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Entypo from "@expo/vector-icons/Entypo";
import { useColorScheme } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { getQuestionsForSubcategory } from "@/db/queries/questions";
import { LanguageCode, QuestionType } from "@/constants/Types";
import { Colors } from "@/constants/Colors";
import { useLanguage } from "@/contexts/LanguageContext";
import { LoadingIndicator } from "./LoadingIndicator";
import { useTranslation } from "react-i18next";

function RenderQuestionSubCategoryItems() {
  const { category, subcategory } = useLocalSearchParams<{
    category: string;
    subcategory: string;
  }>();
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const themeStyle = CoustomTheme();
  const colorScheme = useColorScheme() || "light";
  const { lang } = useLanguage();
  const {t} = useTranslation()

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setIsLoading(true);
        const questions = await getQuestionsForSubcategory(
          category,
          subcategory,
          lang
        );

        if (questions) {
          setQuestions(questions);
          setError(null);
        } else {
          console.log("Fehler in RenderQuestionSubCategoryItems");
          setQuestions([]);
          setError("Fragen konnten nicht geladen werden!");
        }
      } catch (error) {
        console.log("Fehler in RenderQuestionSubCategoryItems " + error);
        setQuestions([]);
        setError("Fragen konnten nicht geladen werden!");
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, [category, subcategory, lang]);

  //  Display error state
  if (error && !isLoading && questions.length === 0) {
    return (
      <ThemedView style={styles.centeredContainer}>
        <ThemedText
          style={{ color: Colors[colorScheme].error }}
          type="subtitle"
        >
          {error}
        </ThemedText>
      </ThemedView>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <View style={styles.centeredContainer}>
       <LoadingIndicator size={"large"}/>
      </View>
    );
  }

  // Main render with questions
  return (
    <View style={[styles.container, themeStyle.defaultBackgorundColor]}>
      <FlatList
        data={questions}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        style={themeStyle.defaultBackgorundColor}
        contentContainerStyle={styles.flatListStyle}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/(displayQuestion)",
                params: {
                  category,
                  subcategory,
                  questionId: item.id.toString(),
                  questionTitle: item.title,
                },
              })
            }
          >
            <ThemedView style={[styles.item, themeStyle.contrast]}>
              <View style={styles.questionContainer}>
                <ThemedText style={styles.titleText}>{item.title}</ThemedText>
                <ThemedText style={styles.questionText} numberOfLines={1}>
                  {item.question}
                </ThemedText>
              </View>
              <Entypo
                name="chevron-thin-right"
                size={24}
                color={colorScheme === "dark" ? "#fff" : "#000"}
              />
            </ThemedView>
          </TouchableOpacity>
        )}
      />
    </View>
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
  error: {},
  flatListStyle: {
    paddingTop: 10,
    gap: 15,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    marginHorizontal: 10,
    borderWidth: 0.3,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
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
  questionText: {
    fontSize: 16,
    textAlign: "left",
  },
});

export default RenderQuestionSubCategoryItems;
