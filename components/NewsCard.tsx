import React from "react";
import { StyleSheet, Text, View, useColorScheme } from "react-native";
import { NewsCardType } from "@/constants/Types";
import { formattedDate, formattedTime } from "@/utils/formate";

const NewsCard: React.FC<NewsCardType> = ({ title, content, createdAt }) => {
  const isDark = useColorScheme() === "dark";

  return (
    <View style={[styles.card, isDark && styles.cardDark]}>
      <Text
        style={[styles.title, isDark && styles.titleDark]}
        numberOfLines={2}
      >
        {title}
      </Text>
      <Text
        style={[styles.content, isDark && styles.contentDark]}
        numberOfLines={4}
      >
        {content}
      </Text>
      <Text style={[styles.date, isDark && styles.dateDark]}>
        {formattedDate(createdAt)} · {formattedTime(createdAt)}
      </Text>
    </View>
  );
};

export default NewsCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  cardDark: { backgroundColor: "#1E1E1E" },
  title: { fontSize: 18, fontWeight: "700", color: "#222", marginBottom: 8 },
  titleDark: { color: "#EEE" },
  content: { fontSize: 14, color: "#444", marginBottom: 12 },
  contentDark: { color: "#CCC" },
  date: { fontSize: 12, color: "#888", textAlign: "right" },
  dateDark: { color: "#AAA" },
});
