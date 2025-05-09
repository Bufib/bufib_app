// src/components/NewsArticle.tsx
import { StyleSheet, View, Text } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useGradient } from "../hooks/useGradient";
import { NewsArticlePreviewType } from "@/constants/Types";

const NewsArticle = ({ title }: NewsArticlePreviewType) => {
  // Use the custom hook to handle all gradient logic
  const { gradientColors } = useGradient();

  return (
    <View style={styles.container}>
      <LinearGradient
        style={styles.linearGradient}
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.newsTitle}>{title}</Text>
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
    flex: 1,
  },
  newsTitle: {},
});
