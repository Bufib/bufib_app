import NewsArticle from "@/components/NewsArticle";
import { View, StyleSheet, Text } from "react-native";

export default function HomeScreen() {
  const testData = ["Hallo", "Test", "Test2"];
  return (
    <View style={styles.container}>
      <View style={styles.newsArticleContainer}>
        {testData.map((data, index) => (
          <NewsArticle key={index} title={data} />
        ))}
      </View>
      <View style={styles.newsContainer}>
        <Text>Hallo</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  newsArticleContainer: {
    flex: 1,
  },
  newsContainer: {
    flex: 1,
  },
});
