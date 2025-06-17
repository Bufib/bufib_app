import { Colors } from "@/constants/Colors";
import { NewsArticlesType } from "@/constants/Types";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNewsArticles } from "@/hooks/useNewsArticles";
import { useFontSizeStore } from "@/stores/fontSizeStore";
import { useRefreshFavorites } from "@/stores/refreshFavoriteStore";
import {
  isNewsArticleFavorited,
  toggleNewsArticleFavorite,
} from "@/utils/favorites";
import { formattedDate } from "@/utils/formate";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import Markdown from "react-native-markdown-display";
import { SafeAreaView } from "react-native-safe-area-context";
import FontSizePickerModal from "./FontSizePickerModal";
import HeaderLeftBackButton from "./HeaderLeftBackButton";
import { LoadingIndicator } from "./LoadingIndicator";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

export default function NewsArticleDetailScreen({
  articleId,
}: {
  articleId: number;
}) {
  const { fontSize, lineHeight } = useFontSizeStore();
  const colorScheme = useColorScheme() ?? "light";
  const { t } = useTranslation();
  const [article, setArticle] = useState<NewsArticlesType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFontSizePickerModal, setShowFontSizePickerModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const { triggerRefreshFavorites } = useRefreshFavorites();
  const { language, isArabic } = useLanguage();
  const { fetchNewsArticleById } = useNewsArticles(language || "de");

  const scrollViewRef = useRef<ScrollView>(null);
  const handleScroll = (event: any) => {
    setScrollY(event.nativeEvent.contentOffset.y);
  };
  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  useEffect(() => {
    if (!articleId) {
      setError(t("errorLoadingArticle"));
      setIsLoading(false);
      return;
    }

    const loadArticle = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedArticle = await fetchNewsArticleById(articleId);
        if (fetchedArticle) {
          setArticle(fetchedArticle);
        } else {
          setError(t("errorLoadingArticle"));
        }
      } catch (error: any) {
        console.error("Error loading news article:", error);
        setError(error.message || t("errorLoadingArticle"));
      } finally {
        setIsLoading(false);
      }
    };

    loadArticle();
  }, [articleId]);

  useEffect(() => {
    (async () => {
      try {
        setIsFavorite(await isNewsArticleFavorited(articleId));
      } catch {
        console.log("error");
      }
    })();
  }, [articleId]);

  const onPressToggle = useCallback(async () => {
    if (!articleId) return;

    try {
      const newFavStatus = await toggleNewsArticleFavorite(articleId);
      setIsFavorite(newFavStatus);
      triggerRefreshFavorites();
    } catch (error) {
      console.log(error);
    }
  }, [articleId, triggerRefreshFavorites]);

  if (isLoading) {
    return (
      <ThemedView style={[styles.container]}>
        <View style={styles.loadingContainer}>
          <View
            style={[
              styles.loadingCard,
              { backgroundColor: Colors[colorScheme].background },
            ]}
          >
            <LoadingIndicator size="large" />
          </View>
        </View>
      </ThemedView>
    );
  }

  if (error || !article) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: Colors[colorScheme].background },
        ]}
      >
        <View style={styles.errorContainer}>
          <Ionicons
            name="newspaper-outline"
            size={80}
            color={Colors[colorScheme].defaultIcon}
          />
          <Text
            style={[styles.errorTitle, { color: Colors[colorScheme].text }]}
          >
            {t("error")}
          </Text>
          <Text
            style={[
              styles.errorSubtitle,
              { color: Colors[colorScheme].defaultIcon },
            ]}
          >
            {t("errorLoadingArticle")}
          </Text>
          <Text
            style={[
              styles.errorSubtitle,
              { color: Colors[colorScheme].defaultIcon },
            ]}
          >
            {error}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme].background },
      ]}
      edges={["top"]}
    >
      <ScrollView
        style={styles.scrollView}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        ref={scrollViewRef}
      >
        <View style={styles.heroSection}>
          <View style={[styles.header]}>
            <HeaderLeftBackButton />
            <Text
              style={[
                styles.headerText,
                {
                  backgroundColor: Colors.universal.third,
                },
              ]}
            >
              {t("newsArticleScreenTitle").toUpperCase()}
            </Text>
          </View>

          {/* Main Title */}
          <Text style={[styles.heroTitle, { color: Colors[colorScheme].text }]}>
            {article.title}
          </Text>

          {/* Article Meta */}
          <View style={styles.articleMeta}>
            <View style={styles.metaLeft}>
              <View
                style={[
                  styles.authorAvatar,
                  {
                    backgroundColor: Colors[colorScheme].contrast,
                    borderColor: Colors[colorScheme].border,
                  },
                ]}
              >
                {article.scholar_type === 1 ? (
                  <Image
                    source={require("@/assets/images/1.png")}
                    style={{ width: 50, height: 50, margin: 10 }}
                    contentFit="fill"
                  />
                ) : article.scholar_type === 2 ? (
                  <Image
                    source={require("@/assets/images/2.png")}
                    style={{ width: 50, height: 50, margin: 10 }}
                  />
                ) : (
                  <Image
                    source={require("@/assets/images/3.png")}
                    style={{ width: 70, height: 70, margin: 0 }}
                  />
                )}
              </View>
              <View>
                <Text
                  style={[
                    styles.authorName,
                    { color: Colors[colorScheme].text },
                  ]}
                >
                  {article.author}
                </Text>
                <Text
                  style={[
                    styles.publishDate,
                    { color: Colors.universal.grayedOut },
                  ]}
                >
                  {formattedDate(article.created_at)}
                </Text>
              </View>
            </View>

            <View style={styles.metaRight}>
              <View style={styles.readTime}>
                <Ionicons
                  name="time-outline"
                  size={16}
                  color={Colors[colorScheme].defaultIcon}
                />
                <Text
                  style={[
                    styles.readTimeText,
                    { color: Colors[colorScheme].defaultIcon },
                  ]}
                >
                  {article.read_time} min
                </Text>
              </View>
            </View>
          </View>

          {/* Action Bar */}
          <View style={styles.actionBar}>
            <Pressable
              style={[
                styles.actionButton,
                {
                  backgroundColor: Colors[colorScheme].contrast,
                  borderColor: Colors[colorScheme].border,
                },
              ]}
              onPress={() => setShowFontSizePickerModal(true)}
            >
              <Ionicons
                name="text"
                size={22}
                color={Colors[colorScheme].defaultIcon}
              />
            </Pressable>
            <Pressable
              style={[
                styles.actionButton,
                {
                  backgroundColor: Colors[colorScheme].contrast,
                  borderColor: Colors[colorScheme].border,
                },
              ]}
              onPress={onPressToggle}
            >
              <AntDesign
                name={isFavorite ? "star" : "staro"}
                size={25}
                color={
                  isFavorite
                    ? Colors.universal.favorite
                    : Colors[colorScheme].defaultIcon
                }
              />
            </Pressable>
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          {/* Reading Progress Bar */}
          <View
            style={[
              styles.progressBar,
              { backgroundColor: Colors[colorScheme].border },
            ]}
          >
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: Colors.universal.third,
                  width: `${Math.min((scrollY / 1000) * 100, 100)}%`,
                },
              ]}
            />
          </View>

          {/* Article Content */}
          <View style={styles.articleContent}>
            <Markdown
              style={{
                body: {
                  color: Colors[colorScheme].text,
                  fontSize: fontSize,
                  lineHeight: lineHeight * 1.6,
                  fontFamily: "System",
                },
                heading1: {
                  color: Colors[colorScheme].text,
                  fontSize: fontSize * 1.8,
                  fontWeight: "800",
                  marginBottom: 20,
                  marginTop: 32,
                  letterSpacing: -0.5,
                },
                heading2: {
                  color: Colors[colorScheme].text,
                  fontSize: fontSize * 1.5,
                  fontWeight: "700",
                  marginBottom: 16,
                  marginTop: 28,
                  letterSpacing: -0.3,
                },
                paragraph: {
                  color: Colors[colorScheme].text,
                  fontSize: fontSize,
                  lineHeight: lineHeight * 1.6,
                  marginBottom: 20,
                },
                strong: {
                  color: Colors[colorScheme].text,
                  fontWeight: "700",
                },
                em: {
                  color: Colors[colorScheme].defaultIcon,
                  fontStyle: "italic",
                },
                link: {
                  color: Colors[colorScheme].tint,
                  textDecorationLine: "underline",
                },
                blockquote: {
                  backgroundColor: "transparent",
                  borderLeftColor: Colors[colorScheme].tint,
                  borderLeftWidth: 4,
                  paddingLeft: 20,
                  paddingVertical: 16,
                  marginVertical: 24,
                  fontStyle: "italic",
                },
                code_inline: {
                  backgroundColor: Colors[colorScheme].tint + "15",
                  color: Colors[colorScheme].tint,
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  borderRadius: 4,
                  fontSize: fontSize * 0.9,
                },
              }}
            >
              {article.content}
            </Markdown>
          </View>
          {article.source && (
            <View
              style={[
                styles.footerContainer,
                {
                  borderColor: Colors[colorScheme].border,
                  alignItems: isArabic() ? "flex-end" : "flex-start",
                },
              ]}
            >
              <ThemedText
                style={{
                  fontWeight: "600",
                  fontSize: fontSize,
                  marginBottom: 5,
                }}
              >
                {t("source")}
              </ThemedText>
              <Markdown
                style={{
                  body: {
                    color: Colors[colorScheme].text,
                    fontSize: 14,
                    fontFamily: "System",
                  },
                  paragraph: {
                    color: Colors[colorScheme].text,
                    fontSize: 14,
                    textAlign: "justify",
                  },
                  strong: {
                    color: Colors[colorScheme].text,
                    fontWeight: "700",
                    fontSize: 14,
                  },
                  em: {
                    color: Colors[colorScheme].defaultIcon,
                    fontStyle: "italic",
                    fontSize: 14,
                  },
                  link: {
                    color: Colors[colorScheme].tint,
                    textDecorationLine: "underline",
                    fontSize: 14,
                  },
                  blockquote: {
                    backgroundColor: "transparent",
                    borderLeftColor: Colors[colorScheme].tint,
                    borderLeftWidth: 4,
                    paddingLeft: 20,
                    paddingVertical: 16,
                    marginVertical: 24,
                    fontStyle: "italic",
                    fontSize: 14,
                  },
                  code_inline: {
                    backgroundColor: Colors[colorScheme].tint + "15",
                    color: Colors[colorScheme].tint,
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    borderRadius: 4,
                    fontSize: 14,
                  },
                }}
              >
                {article.source}
              </Markdown>
            </View>
          )}
        </View>
      </ScrollView>

      <FontSizePickerModal
        visible={showFontSizePickerModal}
        onClose={() => setShowFontSizePickerModal(false)}
      />
      {scrollY > 200 && (
        <TouchableOpacity style={styles.arrowUp} onPress={scrollToTop}>
          <AntDesign name="arrowup" size={30} color={Colors.universal.third} />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollView: {
    flex: 1,
  },
  heroSection: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerText: {
    color: "white",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "900",
    lineHeight: 40,
    marginBottom: 24,
    letterSpacing: -0.8,
  },
  articleMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  metaLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  authorAvatar: {
    borderWidth: 1,
    borderRadius: 99,
    justifyContent: "center",
    alignItems: "center",
  },
  authorName: {
    fontSize: 16,
    fontWeight: "600",
  },
  publishDate: {
    fontSize: 14,
    marginTop: 2,
  },
  metaRight: {},
  readTime: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  readTimeText: {
    fontSize: 14,
    fontWeight: "500",
  },
  actionBar: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 0.5,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "600",
  },
  contentSection: {
    flex: 1,
  },
  progressBar: {
    height: 3,
    marginHorizontal: 24,
    borderRadius: 2,
    marginBottom: 32,
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  articleContent: {
    paddingHorizontal: 30,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  loadingCard: {
    alignItems: "center",
    gap: 20,
    padding: 40,
    borderRadius: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "500",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 8,
  },
  errorSubtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  footerContainer: {
    flexDirection: "column",
    borderTopWidth: 0.5,
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  arrowUp: {
    position: "absolute",
    bottom: "60%",
    right: "3%",
    borderWidth: 2.5,
    borderRadius: 99,
    padding: 5,
    borderColor: Colors.universal.third,
  },
});
