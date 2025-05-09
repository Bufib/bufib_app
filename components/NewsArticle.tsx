// src/components/NewsArticle.tsx
import { StyleSheet, View, Text } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useGradient } from "../hooks/useGradient";
import { NewsArticlesPreviewType } from "@/constants/Types";
import { useTranslation } from "react-i18next";
import { Colors } from "@/constants/Colors";

const NewsArticle = ({ title, externalLink }: NewsArticlesPreviewType) => {
  // Use the custom hook to handle all gradient logic
  const { gradientColors } = useGradient();
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <LinearGradient
        style={styles.linearGradient}
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {externalLink && (
          <View style={styles.externalLinkBadge}>
            <Text style={styles.externalLinkBadgeText}>
              {t("externalLink")}
            </Text>
          </View>
        )}
        <Text style={styles.newsTitle} numberOfLines={2} ellipsizeMode="tail">
          {title}
        </Text>
      </LinearGradient>
    </View>
  );
};

export default NewsArticle;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  linearGradient: {
    justifyContent: "flex-start",
    gap: 20,
    width: 300,
    height: 150,
    padding: 15,
    borderRadius: 15,
  },
  externalLinkBadge: {
    alignSelf: "flex-end",
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
