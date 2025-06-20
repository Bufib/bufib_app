import React from "react";
import NewsArticleDetailScreen from "@/components/NewsArticleDetailScreen";
import { useLocalSearchParams } from "expo-router";

const newsArticle = () => {
  const { articleId } = useLocalSearchParams<{ articleId: string }>();
  if (!articleId) return null;
  return <NewsArticleDetailScreen articleId={parseInt(articleId)} />;
};

export default newsArticle;
