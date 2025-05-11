import React from "react";
import { StyleSheet, Text, View, useColorScheme } from "react-native";
import { NewsCardType } from "@/constants/Types";
import { formattedDate, formattedTime } from "@/utils/formate";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "./ThemedText";
import { useLanguage } from "@/contexts/LanguageContext";

const NewsCard: React.FC<NewsCardType> = ({ title, content, created_at }) => {
  const colorScheme = useColorScheme() || "light";
  const { language } = useLanguage();
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: Colors[colorScheme].contrast,
          shadowColor: Colors[colorScheme].shadow,
          borderColor: Colors[colorScheme].border,
        },
      ]}
    >
      <ThemedText
        style={[
          styles.title,
          {
            textAlign: language === "ar" ? "right" : "left",
          },
        ]}
        type="title"
      >
        {title}
      </ThemedText>
      <ThemedText
        style={[
          styles.content,
          {
            textAlign: language === "ar" ? "right" : "left",
          },
        ]}
        type="default"
      >
        {content}
      </ThemedText>
      <ThemedText
        style={[
          styles.date,
          {
            color: Colors.universal.grayedOut,
            textAlign: language === "ar" ? "left" : "right",
          },
        ]}
      >
        {formattedDate(created_at)} · {formattedTime(created_at)}
      </ThemedText>
    </View>
  );
};

export default NewsCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: "column",
    gap: 10,
    borderWidth: 0.2,
    borderRadius: 10,
    padding: 15,
    paddingTop: 20,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  title: {},
  content: {},
  date: {
    fontSize: 12,
  },
});
