import { NoInternet } from "@/components/NoInternet";
import RenderLinkNewsItem from "@/components/RenderLinkNewsItem";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { QuestionsFromUserType } from "@/constants/Types";
import { useLanguage } from "@/contexts/LanguageContext";
import { useConnectionStatus } from "@/hooks/useConnectionStatus";
import { useFetchUserQuestions } from "@/hooks/useFetchUserQuestions";
import { useAuthStore } from "@/stores/authStore";
import { CoustomTheme } from "@/utils/coustomTheme";
import getStatusColor from "@/utils/getStatusColor";
import { supabase } from "@/utils/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "expo-sqlite/kv-store";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
export default function QuestionDetailScreen() {
  const { questionId } = useLocalSearchParams();
  const queryClient = useQueryClient();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const session = useAuthStore.getState().session;
  const userId = session?.user?.id ?? null;
  const themeStyles = CoustomTheme();
  const hasInternet = useConnectionStatus();
  const colorScheme = useColorScheme() || "light";
  const { t } = useTranslation();
  const { isArabic } = useLanguage();
  const rtl = isArabic()
  // 4. If user is not logged in, redirect to login
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/(auth)/login");
    }
  }, [isLoggedIn, session]);

  const cachedQuestions = queryClient.getQueryData<QuestionsFromUserType[]>([
    "questionsFromUser",
    userId,
  ]);

  const { data: questions, isRefetching, refetch } = useFetchUserQuestions();

  // 6. Find the specific question in the cached array
  const question = cachedQuestions?.find(
    (q) => String(q.id) === String(questionId)
  );

  // Check if user has already read this question and update Supabase
  useEffect(() => {
    const checkIfHasRead = async () => {
      if (!questionId || !question || !question.answer) {
        return;
      }

      try {
        // Load the stored list (or empty array) of already read answer IDs
        const stored = await AsyncStorage.getItem("hasReadAnswers");
        const ids = stored ? JSON.parse(stored) : [];

        // Check if the current questionId is already in the list
        if (!ids.includes(questionId)) {
          // If not in the list, add it and update local storage
          const updated = [...ids, questionId];
          await AsyncStorage.setItem("hasReadAnswers", JSON.stringify(updated));

          // Now, update the Supabase row to mark it as read
          try {
            const { error } = await supabase
              .from("user_questions")
              .update({
                has_read_answer: true,
                has_read_at: new Date().toISOString(),
              }) // Use .update() instead of .insert()
              .eq("id", questionId); // Specify the row to update by its ID

            if (error) {
              console.error(
                "Error updating has_read_answer in Supabase:",
                error.message
              );
            } else {
              console.log(`Question ${questionId} marked as read in Supabase.`);
            }
          } catch (error) {
            console.error("Supabase update failed:", error);
          }
        } else {
          console.log(`Question ${questionId} already marked as read.`);
        }
      } catch (err) {
        console.error("Error accessing read-answers storage:", err);
      }
    };

    if (question) {
      checkIfHasRead();
    }
  }, [questionId, question, userId, queryClient]);

  // Helper function to format the read time
  // Helper function to format the read time as a countdown
  const formatReadTime = (timestamp: any) => {
    if (!timestamp) {
      return "Not read yet"; // Return a default message if no timestamp
    }

    const readDate = new Date(timestamp);
    const now = new Date();

    // Define the duration for the countdown (e.g., 14 days)
    const countdownDurationDays = 14;

    // Calculate the expiry date by adding the duration to the read date
    const expiryDate = new Date(
      readDate.getTime() + countdownDurationDays * 24 * 60 * 60 * 1000
    );

    // Calculate the difference between now and the expiry date in milliseconds
    const diffMs = expiryDate.getTime() - now.getTime();

    // Convert milliseconds to days (using Math.ceil to round up for "still N days left")
    const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    // Format the actual read time (e.g., "June 16, 2025, 10:30 AM") for context if needed
    const actualDateTime = readDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    if (daysLeft > 0) {
      return t("still_days_left", {
        count: daysLeft,
        s: daysLeft > 1 ? t("day_plural") : t("day_singular"),
        e: daysLeft > 1 ? t("day_plural") : t("day_singular"),
      });
    } else if (daysLeft === 0) {
      // If less than a day but not yet negative (i.e., today is the expiry day)
      return t("expires_today"); // Use translation key directly
    } else {
      // If daysLeft is negative, it means the period has expired
      const daysOverdue = Math.abs(daysLeft); // Get positive value for overdue days
      return t("expired_days_ago", {
        count: daysOverdue,
        s: daysOverdue > 1 ? t("day_plural") : t("day_singular"),
        e: daysLeft > 1 ? t("day_plural") : t("day_singular"),
        dateTime: actualDateTime,
      });
    }
  };

  // 7. Fallback if the question is not in the cache
  if (!question) {
    return (
      <ThemedView style={styles.notFound}>
        <ThemedText
          style={[styles.notFoundText, { color: Colors[colorScheme].error }]}
          type="subtitle"
        >
          Fragen wurden nicht gefunden!
        </ThemedText>
      </ThemedView>
    );
  }

  // 8. Render
  return (
    <ScrollView
      contentContainerStyle={styles.contentContainerScrollView}
      style={[styles.container, themeStyles.defaultBackgorundColor]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={() => {
            // If user is offline show a message
            if (!hasInternet) {
              Toast.show({
                type: "error",
                text1: "Es bestehte keine Internetverbindung!",
              });
              return;
            }
            refetch();
          }}
        />
      }
    >
      <NoInternet showUI={true} showToast={false} />
      <ThemedView style={[styles.header, themeStyles.borderColor]}>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(question.status) },
          ]}
        >
          <Text style={styles.statusText}>{question.status}</Text>
        </View>
        <ThemedText style={styles.title} type="title">
          {question.title}
        </ThemedText>
        <ThemedText
          style={{
            color: Colors.universal.grayedOut,
            alignSelf: rtl ? "flex-start" : "flex-end",
          }}
        >
          {formatReadTime(question.has_read_at)}
        </ThemedText>
      </ThemedView>

      <View style={styles.chatContainer}>
        <View style={styles.questionBubble}>
          <Text style={[styles.bubbleText, styles.informationText]}>
            Marja: {question.marja}
          </Text>
          <Text style={[styles.bubbleText, styles.informationText]}>
            Geschlecht: {question.gender}
          </Text>
          <Text style={[styles.bubbleText, styles.informationText]}>
            Alter: {question.age}
          </Text>
          {/* Spacer */}
          <View style={{ marginBottom: 10 }}></View>
          <Text style={styles.bubbleText}>{question.question}</Text>
        </View>

        {question.answer &&
        (question.status === "Beantwortet" ||
          question.status === "Abgelehnt") ? (
          <View style={styles.answerBubble}>
            <Text style={styles.bubbleText}>{question.answer}</Text>
            <ThemedView style={styles.linksContainer}>
              {question.internal_url &&
                question.internal_url.length > 0 &&
                question.internal_url.map((url, index) => (
                  <RenderLinkNewsItem
                    key={`internal-url-${index}-${url}`}
                    url={url}
                    index={index}
                    isExternal={false}
                  />
                ))}
              {question.external_url &&
                question.external_url.length > 0 &&
                question.external_url.map((url, index) => (
                  <RenderLinkNewsItem
                    key={`external-url-${index}-${url}`}
                    url={url}
                    index={index}
                    isExternal={true}
                  />
                ))}
            </ThemedView>
          </View>
        ) : (
          <View style={styles.waitingContainer}>
            <ThemedText style={styles.waitingText}>
              Beantwortung steht noch aus.
            </ThemedText>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainerScrollView: {},
  notFound: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  notFoundText: {},
  header: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 20,
    padding: 16,
    borderBottomWidth: 1.5,
  },
  title: {},
  readAtText: {},
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
  statusBadge: {
    alignSelf: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },

  chatContainer: {
    flex: 1,
    padding: 16,
  },
  questionBubble: {
    backgroundColor: Colors.universal.chatBubbleQuestion,
    padding: 16,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    maxWidth: "80%",
    alignSelf: "flex-start",
    marginBottom: 16,
  },
  answerBubble: {
    backgroundColor: Colors.universal.chatBubbleAnswer,
    padding: 16,
    borderRadius: 16,
    borderBottomRightRadius: 4,
    maxWidth: "80%",
    alignSelf: "flex-end",
    marginBottom: 16,
  },
  bubbleText: {
    fontSize: 16,
    lineHeight: 24,
  },
  linksContainer: {
    backgroundColor: "transparent",
  },
  informationText: {
    fontWeight: "bold",
  },

  waitingContainer: {
    padding: 16,
    alignItems: "center",
  },
  waitingText: {
    fontStyle: "italic",
  },
});
