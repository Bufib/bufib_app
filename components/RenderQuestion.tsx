import { StyleSheet, View, ScrollView } from "react-native";
import React from "react";
import { Collapsible } from "@/components/Collapsible";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { CoustomTheme } from "@/utils/coustomTheme";
import { useColorScheme } from "react-native";
import { getQuestion } from "@/app/db/queries/questions";
import { useState, useEffect } from "react";
import { useFontSizeStore } from "@/stores/fontSizeStore";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as Clipboard from "expo-clipboard";
import Feather from "@expo/vector-icons/Feather";
import Markdown from "react-native-markdown-display";
import { NoInternet } from "./NoInternet";
import { QuestionType } from "@/constants/Types";
import { useTranslation } from "react-i18next";
type RenderQuestionProps = {
  category: string;
  subcategory: string;
  questionId: number;
};

const RenderQuestion = ({
  category,
  subcategory,
  questionId,
}: RenderQuestionProps) => {
  const themeStyles = CoustomTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [question, setQuestion] = useState<QuestionType | null>(null);
  const { fontSize, lineHeight } = useFontSizeStore();
  const colorScheme = useColorScheme();
  const [hasCopiedSingleAnswer, setHasCopiedSingleAnswer] = useState(false);
  const [hasCopiedKhamenei, setHasCopiedKhamenei] = useState(false);
  const [hasCopiedSistani, setHasCopiedSistani] = useState(false);
  const { t } = useTranslation();
  useEffect(() => {
    const loadQuestion = async () => {
      try {
        setIsLoading(true);
        if (!category || !subcategory) {
          console.log("Missing category or subcategory");
          return;
        }
        const question = await getQuestion(category, subcategory, questionId);

        if (question) {
          setQuestion(question);
        } else {
          console.log("Invalid data format received");
          setQuestion(null);
        }
      } catch (error) {
        console.error("Error loading question:", error);
        setQuestion(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestion();
  }, [category, subcategory]);

  const copyToClipboardMarja = async (
    answer: string | undefined,
    marja: string
  ) => {
    if (answer) {
      if (marja === "khamenei") {
        await Clipboard.setStringAsync(
          `Gemäß der Ansicht von Sayid Khamenei: ${answer}`
        );
      } else {
        await Clipboard.setStringAsync(
          `Gemäß der Ansicht von Sayid Sistani: ${answer}`
        );
      }
    } else {
      console.warn("No text to copy");
    }
  };

  const copyToClipboardSingleAnswer = async (answer: string | undefined) => {
    if (answer) {
      await Clipboard.setStringAsync(answer);
    } else {
      console.warn("No text to copy");
    }
  };

  const copyIconChangeMarja = (marja: string) => {
    if (marja === "khamenei") {
      setHasCopiedKhamenei(true);
      setTimeout(() => {
        setHasCopiedKhamenei(false);
      }, 1000);
    } else {
      setHasCopiedSistani(true);
      setTimeout(() => {
        setHasCopiedSistani(false);
      }, 1000);
    }
  };

  const copyIconChangeSingleAnswer = () => {
    setHasCopiedSingleAnswer(true);
    setTimeout(() => {
      setHasCopiedSingleAnswer(false);
    }, 1000);
  };
  return (
    <ScrollView
      style={[styles.scrollViewStyles, themeStyles.defaultBackgorundColor]}
      contentContainerStyle={styles.scrollViewContent}
      showsVerticalScrollIndicator={false}
    >
      <NoInternet showUI={true} showToast={false} />
      <View
        style={[
          styles.questionContainer,
          themeStyles.contrast,
          {
            // iOS Shadow
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 }, // X: 0, Y: 2
            shadowOpacity: 0.2,
            shadowRadius: 4,
            // Android Shadow
            elevation: 5, // Adjust for stronger or softer shadow
            backgroundColor: colorScheme === "dark" ? "#34495e" : "#fff",
          },
        ]}
      >
        <ThemedText style={[styles.questionText, { fontSize, lineHeight }]}>
          {question?.question}
        </ThemedText>
      </View>

      <View style={styles.answerContainer}>
        {question?.answer ? (
          <ThemedView style={[styles.singleAnswer, themeStyles.contrast]}>
            <View style={styles.textIconContainer}>
              {hasCopiedSingleAnswer ? (
                <View style={styles.hasCopiedContainer}>
                  <Feather
                    name="check"
                    size={24}
                    color={colorScheme === "dark" ? "#fff" : "#000"}
                  />
                  <ThemedText>{t("copied")}</ThemedText>
                </View>
              ) : (
                <AntDesign
                  name="copy1"
                  size={24}
                  color={colorScheme === "dark" ? "#fff" : "#000"}
                  style={styles.copyIcon}
                  onPress={() => {
                    copyToClipboardSingleAnswer(question?.answer);
                    copyIconChangeSingleAnswer();
                  }}
                />
              )}
              <Markdown
                style={{
                  body: {
                    ...themeStyles.text,
                    fontSize: fontSize,
                    lineHeight: lineHeight,
                  },
                }}
              >
                {question?.answer || "Antwort wird geladen"}
              </Markdown>
            </View>
          </ThemedView>
        ) : (
          <>
            <Collapsible title="Sayid al-Khamenei" marja="khamenei">
              <View style={styles.textIconContainer}>
                {hasCopiedKhamenei ? (
                  <View style={styles.hasCopiedContainer}>
                    <Feather
                      name="check"
                      size={24}
                      color={colorScheme === "dark" ? "#fff" : "#000"}
                    />
                    <ThemedText>{t("copied")}</ThemedText>
                  </View>
                ) : (
                  <AntDesign
                    name="copy1"
                    size={24}
                    color={colorScheme === "dark" ? "#fff" : "#000"}
                    style={styles.copyIcon}
                    onPress={() => {
                      copyToClipboardMarja(
                        question?.answer_khamenei,
                        "khamenei"
                      );
                      copyIconChangeMarja("khamenei");
                    }}
                  />
                )}
                <Markdown
                  style={{
                    body: {
                      ...themeStyles.text,
                      fontSize: fontSize,
                      lineHeight: lineHeight,
                    },
                  }}
                >
                  {question?.answer_khamenei || "Antwort wird geladen"}
                </Markdown>
              </View>
            </Collapsible>

            <Collapsible title="Sayid as-Sistani" marja="sistani">
              <View style={styles.textIconContainer}>
                {hasCopiedSistani ? (
                  <View style={styles.hasCopiedContainer}>
                    <Feather
                      name="check"
                      size={24}
                      color={colorScheme === "dark" ? "#fff" : "#000"}
                    />
                    <ThemedText>{t("copied")}</ThemedText>
                  </View>
                ) : (
                  <AntDesign
                    name="copy1"
                    size={24}
                    color={colorScheme === "dark" ? "#fff" : "#000"}
                    style={styles.copyIcon}
                    onPress={() => {
                      copyToClipboardMarja(question?.answer_sistani, "sistani");
                      copyIconChangeMarja("sistani");
                    }}
                  />
                )}
                <Markdown
                  style={{
                    body: {
                      ...themeStyles.text,
                      fontSize: fontSize,
                      lineHeight: lineHeight,
                    },
                  }}
                >
                  {question?.answer_sistani || "Antwort wird geladen"}
                </Markdown>
              </View>
            </Collapsible>
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default RenderQuestion;

const styles = StyleSheet.create({
  scrollViewStyles: {
    flex: 1,
  },
  scrollViewContent: {
    gap: 20,
    paddingBottom: 50,
  },

  questionContainer: {
    padding: 15,
    margin: 10,
    borderRadius: 8,
  },
  answerContainer: {
    flexDirection: "column",
    flex: 3,
    gap: 30,
    marginHorizontal: 10,
    backgroundColor: "transparent",
  },
  singleAnswer: {
    marginHorizontal: 5,
    padding: 12,
    borderWidth: 0.5,
    borderRadius: 7,
  },
  questionText: {
    textAlign: "center",
  },
  answerText: {},
  textIconContainer: {
    flexDirection: "column",
  },
  hasCopiedContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 7,
    backgroundColor: "transparent",
  },
  copyIcon: {
    alignSelf: "flex-end",
  },
});
