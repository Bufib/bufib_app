// src/components/PodcastPreviewCard.tsx
import { StyleSheet, Text } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useGradient } from "../hooks/useGradient";
import { PodcastType } from "@/constants/Types";
import { useLanguage } from "@/contexts/LanguageContext";
import { PodcastProps } from "@/constants/Types";
import { formatDate } from "@/utils/formatDate";

export const PodcastPreviewCard: React.FC<PodcastProps> = ({ podcast }) => {
  const { gradientColors } = useGradient();
  const { language, isArabic } = useLanguage();
  const formatedDate = formatDate(podcast.created_at);

  return (
    <LinearGradient
      style={styles.container}
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text
        style={[
          styles.title,
          { textAlign: language === "ar" ? "right" : "left" },
        ]}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {podcast.title}
      </Text>
      <Text
        style={[styles.createdAt, { textAlign: isArabic() ? "left" : "right" }]}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {formatedDate}
      </Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    gap: 20,
    height: 250,
    width: 200,
    padding: 15,
    borderWidth: 1,
    borderRadius: 15,
  },
  title: {
    fontSize: 20,
  },
  createdAt: {},
});
