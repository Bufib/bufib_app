import { StyleSheet, View, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { Collapsible } from "@/components/Collapsible";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { CoustomTheme } from "@/utils/coustomTheme";
import { useColorScheme } from "react-native";
import { getQuestion, getRelatedQuestions } from "@/db/queries/questions";
import { useState, useEffect } from "react";
import { useFontSizeStore } from "@/stores/fontSizeStore";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as Clipboard from "expo-clipboard";
import Feather from "@expo/vector-icons/Feather";
import Markdown from "react-native-markdown-display";
import { NoInternet } from "./NoInternet";
import { LanguageCode, QuestionType } from "@/constants/Types";
import { useTranslation } from "react-i18next";
import { Colors } from "@/constants/Colors";
import { useLanguage } from "@/contexts/LanguageContext";
import i18n from "@/utils/i18n";
import { router } from "expo-router";
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
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [isLoadingRelated, setIsLoadingRelated] = useState(true);
  const [question, setQuestion] = useState<QuestionType | null>(null);
  const [relatedQuestions, setRelatedQuestions] = useState<
    QuestionType[] | null
  >(null);
  const { fontSize, lineHeight } = useFontSizeStore();
  const colorScheme = useColorScheme() || "light";
  const [hasCopiedSingleAnswer, setHasCopiedSingleAnswer] = useState(false);
  const [hasCopiedKhamenei, setHasCopiedKhamenei] = useState(false);
  const [hasCopiedSistani, setHasCopiedSistani] = useState(false);
  const { t } = useTranslation();
  const { language } = useLanguage();
  const lang = (language ?? "de") as LanguageCode;

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!category || !subcategory) {
        setQuestion(null);
        return;
      }
      try {
        setIsLoadingQuestions(true);
        console.log(category, subcategory, questionId);

        const q = await getQuestion(category, subcategory, questionId, lang);
        if (!cancelled) setQuestion(q ?? null);
      } catch (err) {
        console.error("Error loading question:", err);
        if (!cancelled) setQuestion(null);
      } finally {
        if (!cancelled) setIsLoadingQuestions(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [category, subcategory, questionId, i18n.language]);

  // 2) Load related questions
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setIsLoadingRelated(true);
        const rel = await getRelatedQuestions(questionId, lang);
        if (!cancelled) setRelatedQuestions(rel ?? null);
      } catch (err) {
        console.error("Error loading related questions:", err);
        if (!cancelled) setRelatedQuestions(null);
      } finally {
        if (!cancelled) setIsLoadingRelated(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [questionId, i18n.language]);

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
    <View
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme].background },
      ]}
    >
      <ScrollView
        style={[styles.scrollViewStyles, themeStyles.defaultBackgorundColor]}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.questionContainer, themeStyles.contrast]}>
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
                  {question?.answer || t("loading")}
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
                    {question?.answer_khamenei || t("loading")}
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
                        copyToClipboardMarja(
                          question?.answer_sistani,
                          "sistani"
                        );
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
                    {question?.answer_sistani || t("loading")}
                  </Markdown>
                </View>
              </Collapsible>
            </>
          )}
        </View>
        {relatedQuestions && relatedQuestions?.length > 0 && (
          <View style={{ gap: 10, marginTop: 20 }}>
            <ThemedText type="subtitle" style={{ marginLeft: 15 }}>
              {t("relatedQuestions")}
            </ThemedText>
            <ScrollView
              style={{ flex: 1, flexDirection: "row" }}
              contentContainerStyle={{
                paddingHorizontal: 16,
                gap: 10,
                flexGrow: 1,
              }}
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              {relatedQuestions.map((related, index) => (
                <TouchableOpacity
                  style={styles.relatedQuestion}
                  key={index.toString()}
                  onPress={() => {
                    console.log(
                      category,
                      subcategory,
                      related.id.toString(),
                      related.title
                    );
                    router.push({
                      pathname: "/(displayQuestion)",
                      params: {
                        category: related.question_category_name,
                        subcategory: related.question_subcategory_name,
                        questionId: related.id.toString(),
                        questionTitle: related.title,
                      },
                    });
                  }}
                >
                  <ThemedText
                    style={{ fontSize: 18, fontWeight: "500" }}
                    numberOfLines={6}
                    ellipsizeMode="tail"
                  >
                    {related.question}
                  </ThemedText>

                  <ThemedText
                    style={{
                      fontSize: 16,
                      fontWeight: "400",
                      alignSelf: "flex-end",
                    }}
                  >
                    {index + 1}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default RenderQuestion;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewStyles: {
    flex: 1,
  },
  scrollViewContent: {
    gap: 20,
    paddingBottom: 50,
  },

  questionContainer: {
    padding: 15,
    margin: 15,
    borderWidth: 1,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
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
    borderWidth: 1,
    borderRadius: 7,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
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

  relatedQuestion: {
    width: 150,
    height: 200,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    justifyContent: "space-between",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});
