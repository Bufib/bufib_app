// src/components/NewsArticle.tsx
import { StyleSheet, View, Text } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useGradient } from "../hooks/useGradient";
import { NewsArticlesPreviewType } from "@/constants/Types";
import { useTranslation } from "react-i18next";
import { Colors } from "@/constants/Colors";
import { useLanguage } from "@/contexts/LanguageContext";
import Feather from "@expo/vector-icons/Feather";
import { formatDate } from "@/utils/formatDate";
const NewsArticlePreviewCard = ({
  title,
  is_external_link,
  created_at,
}: NewsArticlesPreviewType) => {
  // Use the custom hook to handle all gradient logic
  const { gradientColors } = useGradient();
  const { t } = useTranslation();
  const { language, isArabic } = useLanguage();
  const formatedDate = formatDate(created_at)
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
              alignSelf: isArabic() ? "flex-start" : "flex-end",
            },
          ]}
        >
          <Feather
            name="external-link"
            size={27}
            color={Colors.universal.externalLinkIcon}
          />
        </View>
      )}
      <Text
        style={[styles.newsTitle, { textAlign: isArabic() ? "right" : "left" }]}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {title}
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

export default NewsArticlePreviewCard;

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    gap: 20,
    height: 150,
    width: 300,
    padding: 15,
    borderWidth: 1,
    borderRadius: 15,
  },
  externalLinkBadge: {},
  externalLinkBadgeText: {
    fontSize: 12,
    fontWeight: 600,
  },
  newsTitle: {
    fontSize: 20,
  },
  createdAt: {
  }
});
