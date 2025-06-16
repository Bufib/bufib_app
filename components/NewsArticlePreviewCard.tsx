// // src/components/NewsArticle.tsx
// import { Colors } from "@/constants/Colors";
// import { NewsArticlesPreviewType } from "@/constants/Types";
// import { useLanguage } from "@/contexts/LanguageContext";
// import { formatDate } from "@/utils/formatDate";
// import Feather from "@expo/vector-icons/Feather";
// import { LinearGradient } from "expo-linear-gradient";
// import React from "react";
// import { useTranslation } from "react-i18next";
// import { StyleSheet, Text, View } from "react-native";
// import { useGradient } from "../hooks/useGradient";
// const NewsArticlePreviewCard = ({
//   title,
//   is_external_link,
//   created_at,
// }: NewsArticlesPreviewType) => {
//   // Use the custom hook to handle all gradient logic
//   const { gradientColors } = useGradient();
//   const { t } = useTranslation();
//   const { language, isArabic } = useLanguage();
//   const formatedDate = formatDate(created_at)
//   return (
//     <LinearGradient style={styles.container} colors={gradientColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
//       {is_external_link && (
//         <View
//           style={[
//             styles.externalLinkBadge,
//             {
//               alignSelf: isArabic() ? "flex-start" : "flex-end",
//             },
//           ]}
//         >
//           <Feather
//             name="external-link"
//             size={27}
//             color={Colors.universal.externalLinkIcon}
//           />
//         </View>
//       )}
//       <Text
//         style={[styles.newsTitle, { textAlign: isArabic() ? "right" : "left" }]}
//         numberOfLines={2}
//         ellipsizeMode="tail"
//       >
//         {title}
//       </Text>
//       <Text
//         style={[styles.createdAt, { textAlign: isArabic() ? "left" : "right" }]}
//         numberOfLines={2}
//         ellipsizeMode="tail"
//       >
//         {formatedDate}
//       </Text>
//     </LinearGradient>
//   );
// };

// export default NewsArticlePreviewCard;

// const styles = StyleSheet.create({
//   container: {
//     justifyContent: "space-between",
//     gap: 20,
//     height: 150,
//     width: 300,
//     padding: 15,
//     borderWidth: 1,
//     borderRadius: 15,
//   },
//   externalLinkBadge: {},
//   externalLinkBadgeText: {
//     fontSize: 12,
//     fontWeight: 600,
//   },
//   newsTitle: {
//     fontSize: 20,
//   },
//   createdAt: {
//   }
// });

"use client";
import type { NewsArticlesPreviewType } from "@/constants/Types";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatDate } from "@/utils/formatDate";
import Feather from "@expo/vector-icons/Feather";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { useGradient } from "../hooks/useGradient";

const NewsArticlePreviewCard = ({
  title,
  is_external_link,
  created_at,
}: NewsArticlesPreviewType) => {
  const { gradientColors } = useGradient();
  const { t } = useTranslation();
  const { language, isArabic } = useLanguage();
  const formatedDate = formatDate(created_at);

  return (
    <View style={styles.cardWrapper}>
      <LinearGradient
        style={styles.container}
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Overlay for better text readability */}
        <View style={styles.overlay} />

        {/* Header with external link badge */}
        <View style={styles.header}>
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
                size={20}
                color="rgba(255, 255, 255, 0.9)"
              />
            </View>
          )}
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text
            style={[
              styles.newsTitle,
              { textAlign: isArabic() ? "right" : "left" },
            ]}
            numberOfLines={3}
            ellipsizeMode="tail"
          >
            {title}
          </Text>
        </View>

        {/* Footer with date */}
        <View style={styles.footer}>
          <Text
            style={[
              styles.createdAt,
              { textAlign: isArabic() ? "left" : "right" },
            ]}
          >
            {formatedDate}
          </Text>
        </View>

        {/* Decorative elements */}
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />
      </LinearGradient>
    </View>
  );
};

export default NewsArticlePreviewCard;

const styles = StyleSheet.create({
  cardWrapper: {},
  container: {
    height: 180,
    width: 320,
    borderRadius: 24,
    padding: 20,
    position: "relative",
    overflow: "hidden",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 8,
    zIndex: 2,
  },
  externalLinkBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    padding: 8,
    backdropFilter: "blur(10px)",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    zIndex: 2,
  },
  newsTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#FFFFFF",
    lineHeight: 28,
    letterSpacing: -0.5,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
  footer: {
    zIndex: 2,
  },
  createdAt: {
    fontSize: 12,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.8)",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  decorativeCircle1: {
    position: "absolute",
    top: -30,
    right: -30,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    zIndex: 1,
  },
  decorativeCircle2: {
    position: "absolute",
    bottom: -20,
    left: -20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    zIndex: 1,
  },
});
