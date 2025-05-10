import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Linking,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";

export interface NewsArticleCardProps {
  title: string;
  content: string;
  externalLink?: string;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  contentStyle?: StyleProp<TextStyle>;
}

const NewsArticleCard: React.FC<NewsArticleCardProps> = ({
  title,
  content,
  externalLink,
  style,
  titleStyle,
  contentStyle,
}) => {
  const scheme = useColorScheme() ?? "light";
  const theme = Colors[scheme];

  const handlePress = () => {
    if (externalLink) {
      Linking.openURL(externalLink).catch((err) =>
        console.error("Failed to open link:", err)
      );
    }
  };

  return (
    <ThemedView style={styles.card}>
      <Text style={[styles.title, { color: theme.text }, titleStyle]}>
        {title}
      </Text>
      <ThemedText style={styles.content}>{content}</ThemedText>
    </ThemedView>
  );
};

export default NewsArticleCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },
});
