// src/components/NewsArticle.tsx
import { StyleSheet, View, Text } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useGradient } from "../hooks/useGradient";
import { NewsArticlesPreviewType } from "@/constants/Types";
import { useTranslation } from "react-i18next";
import { Colors } from "@/constants/Colors";
import { useLanguage } from "@/contexts/LanguageContext";

const NewsArticlePreviewCard = ({
  title,
  is_external_link,
}: NewsArticlesPreviewType) => {
  // Use the custom hook to handle all gradient logic
  const { gradientColors } = useGradient();
  const { t } = useTranslation();
  const { language } = useLanguage();
  return (
    <LinearGradient
      style={styles.container}
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {is_external_link && (
        <View
          style={[
            styles.externalLinkBadge,
            {
              alignSelf: language === "ar" ? "flex-start" : "flex-end",
            },
          ]}
        >
          <Text style={styles.externalLinkBadgeText}>
            {t("isExternalLink")}
          </Text>
        </View>
      )}
      <Text
        style={[
          styles.newsTitle,
          { textAlign: language === "ar" ? "right" : "left" },
        ]}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {title}
      </Text>
    </LinearGradient>
  );
};

export default NewsArticlePreviewCard;

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    gap: 20,
    height: 150,
    width: 300,
    padding: 15,
    borderWidth: 1,
    borderRadius: 15,
  },
  externalLinkBadge: {
    borderWidth: 1.5,
    borderRadius: 10,
    padding: 5,
    backgroundColor: Colors.universal.primary,
  },
  externalLinkBadgeText: {
    fontSize: 12,
    fontWeight: 600,
  },
  newsTitle: {
    fontSize: 20,
  },
});
