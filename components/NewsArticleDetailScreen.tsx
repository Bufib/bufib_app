// import { ThemedText } from "@/components/ThemedText";
// import { Colors } from "@/constants/Colors";
// import { NewsArticlesType } from "@/constants/Types";
// import { useNewsArticles } from "@/hooks/useNewsArticles";
// import { useFontSizeStore } from "@/stores/fontSizeStore";
// import { formattedDate } from "@/utils/formate";
// import AntDesign from "@expo/vector-icons/AntDesign";
// import Ionicons from "@expo/vector-icons/Ionicons";
// import { Stack } from "expo-router";
// import React, { useCallback, useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";
// import { ScrollView, StyleSheet, useColorScheme, View } from "react-native";
// import Markdown from "react-native-markdown-display";
// import { LoadingIndicator } from "./LoadingIndicator";

// import { useLanguage } from "@/contexts/LanguageContext";
// import { useRefreshFavorites } from "@/stores/refreshFavoriteStore";
// import { } from "@/utils/bufibDatabase";
// import {
//   isNewsArticleFavorited,
//   toggleNewsArticleFavorite,
// } from "@/utils/favorites";
// import FontSizePickerModal from "./FontSizePickerModal";
// import { ThemedView } from "./ThemedView";
// export default function NewsArticleDetailScreen({
//   articleId,
// }: {
//   articleId: number;
// }) {
//   const { fontSize, lineHeight } = useFontSizeStore();
//   const colorScheme = useColorScheme() ?? "light";
//   const { t } = useTranslation();
//   const [article, setArticle] = useState<NewsArticlesType | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [showFontSizePickerModal, setShowFontSizePickerModal] = useState(false);
//   const [isFavorite, setIsFavorite] = useState(false);
//   const { triggerRefreshFavorites } = useRefreshFavorites();
//   const { language, isArabic } = useLanguage();
//   const { fetchNewsArticleById } = useNewsArticles(language);

//   useEffect(() => {
//     if (!articleId) {
//       setError(t("errorLoadingArticle"));
//       setIsLoading(false);
//       return;
//     }

//     const loadArticle = async () => {
//       setIsLoading(true);
//       setError(null);
//       try {
//         const fetchedArticle = await fetchNewsArticleById(articleId);
//         if (fetchedArticle) {
//           setArticle(fetchedArticle);
//         } else {
//           setError(t("errorLoadingArticle"));
//         }
//       } catch (error: any) {
//         console.error("Error loading news article:", error);
//         setError(error.message || t("errorLoadingArticle"));
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadArticle();
//   }, [articleId]);

//   // load favorite state
//   useEffect(() => {
//     (async () => {
//       try {
//         setIsFavorite(await isNewsArticleFavorited(articleId));
//       } catch {
//         console.log("error");
//       }
//     })();
//   }, [articleId]);

//   // ★ toggle handler updates local state
//   const onPressToggle = useCallback(async () => {
//     if (!articleId) return;

//     try {
//       const newFavStatus = await toggleNewsArticleFavorite(articleId);
//       setIsFavorite(newFavStatus);
//       triggerRefreshFavorites();
//     } catch (error) {
//       console.log(error);
//     }
//   }, [articleId, triggerRefreshFavorites]);

//   if (isLoading) {
//     return (
//       <ThemedView style={styles.centered}>
//         <LoadingIndicator size={"large"} />
//       </ThemedView>
//     );
//   }

//   if (error || !article) {
//     return (
//       <ThemedView style={styles.centered}>
//         <Stack.Screen options={{ title: "Error" }} />
//         <ThemedText
//           type="subtitle"
//           style={[styles.errorText, { color: Colors[colorScheme].error }]}
//         >
//           {t("errorLoadingArticle")}
//         </ThemedText>
//       </ThemedView>
//     );
//   }
//   return (
//     <View style={styles.container}>
//       <Stack.Screen
//         options={{
//           title: article.title,
//         }}
//       />
//       <ScrollView
//         style={[
//           styles.scrollViewStyles,
//           {
//             backgroundColor: Colors[colorScheme].background,
//           },
//         ]}
//         contentContainerStyle={styles.scrollViewContent}
//         showsVerticalScrollIndicator={true}
//       >
//         <View
//           style={[
//             styles.titleContainer,
//             {
//               backgroundColor: Colors[colorScheme].contrast,
//               borderColor: Colors[colorScheme].border,
//             },
//           ]}
//         >
//           <View
//             style={{ flexDirection: "row", gap: 10, alignSelf: "flex-end" }}
//           >
//             <Ionicons
//               name="text"
//               size={30}
//               color={Colors[colorScheme].defaultIcon}
//               onPress={() => setShowFontSizePickerModal(true)}
//             />
//             {isFavorite ? (
//               <AntDesign
//                 name="star"
//                 size={31}
//                 color={Colors.universal.favorite}
//                 onPress={() => onPressToggle()}
//               />
//             ) : (
//               <AntDesign
//                 name="staro"
//                 size={31}
//                 color={Colors[colorScheme].defaultIcon}
//                 onPress={() => onPressToggle()}
//               />
//             )}
//           </View>
//           <ThemedText type="title" style={styles.titleText}>
//             {article.title}
//           </ThemedText>
//           <View style={styles.titleIconContainer}>
//             <View style={styles.titleIconText}>
//               <Ionicons
//                 name="calendar-number-sharp"
//                 size={24}
//                 color={Colors.universal.third}
//               />
//               <ThemedText>{formattedDate(article.created_at)}</ThemedText>
//             </View>
//             <View style={styles.titleIconText}>
//               <AntDesign
//                 name="clockcircleo"
//                 size={24}
//                 color={Colors.universal.third}
//               />
//               <ThemedText>{article.read_time} min</ThemedText>
//             </View>
//           </View>
//         </View>
//         <View style={styles.contentContainer}>
//           <Markdown
//             style={{
//               body: {
//                 color: Colors[colorScheme].text,
//                 fontSize: fontSize,
//                 lineHeight: lineHeight,
//               },
//             }}
//           >
//             {article.content}
//           </Markdown>
//         </View>
//       </ScrollView>
//       <FontSizePickerModal
//         visible={showFontSizePickerModal}
//         onClose={() => setShowFontSizePickerModal(false)}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   scrollViewStyles: {},
//   scrollViewContent: {},
//   titleContainer: {
//     flexDirection: "column",
//     gap: 10,
//     padding: 20,
//     paddingTop: 20,
//     borderBottomWidth: 1,
//   },
//   titleIconContainer: {
//     flexDirection: "row",
//     justifyContent: "space-evenly",
//     marginTop: 20,
//   },
//   titleIconText: {
//     flexDirection: "row",
//     gap: 10,
//   },

//   titleText: {
//     textAlign: "center",
//   },
//   contentContainer: {
//     flex: 1,
//     padding: 20,
//   },
//   centered: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//   },
//   errorText: {
//     textAlign: "center",
//   },
// });


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
import { Stack } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dimensions,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import Markdown from "react-native-markdown-display";
import FontSizePickerModal from "./FontSizePickerModal";
import { LoadingIndicator } from "./LoadingIndicator";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

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
  const { fetchNewsArticleById } = useNewsArticles(language);

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

  const handleScroll = (event) => {
    setScrollY(event.nativeEvent.contentOffset.y);
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
        <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.loadingContainer}>
          <View style={[styles.loadingCard, { backgroundColor: Colors[colorScheme].background }]}>
            <LoadingIndicator size="large" />
            <Text style={[styles.loadingText, { color: Colors[colorScheme].text }]}>
              Loading article...
            </Text>
          </View>
        </View>
      </View>
    );
  }

  if (error || !article) {
    return (
      <View style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
        <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.errorContainer}>
          <Ionicons name="newspaper-outline" size={80} color={Colors[colorScheme].tabIconDefault} />
          <Text style={[styles.errorTitle, { color: Colors[colorScheme].text }]}>
            Article Not Found
          </Text>
          <Text style={[styles.errorSubtitle, { color: Colors[colorScheme].tabIconDefault }]}>
            {t("errorLoadingArticle")}
          </Text>
        </View>
      </View>
    );
  }

  const headerOpacity = Math.min(scrollY / 200, 1);

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Floating Header */}
      <View 
        style={[
          styles.floatingHeader,
          {
            backgroundColor: Colors[colorScheme].background + 'F0',
            opacity: headerOpacity,
          },
        ]}
      >
        <Pressable 
          style={styles.backButton}
          onPress={() => {/* Add navigation back logic */}}
        >
          <Ionicons name="arrow-back" size={24} color={Colors[colorScheme].text} />
        </Pressable>
        <Text 
          style={[styles.floatingTitle, { color: Colors[colorScheme].text }]}
          numberOfLines={1}
        >
          {article.title}
        </Text>
        <View style={styles.headerActions}>
          <Pressable 
            style={[styles.headerActionBtn, { backgroundColor: Colors[colorScheme].tint + '20' }]}
            onPress={() => setShowFontSizePickerModal(true)}
          >
            <Ionicons name="text" size={18} color={Colors[colorScheme].tint} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          {/* Category Badge */}
          <View style={[styles.categoryBadge, { backgroundColor: Colors[colorScheme].tint }]}>
            <Text style={styles.categoryText}>NEWS</Text>
          </View>

          {/* Main Title */}
          <Text style={[styles.heroTitle, { color: Colors[colorScheme].text }]}>
            {article.title}
          </Text>

          {/* Article Meta */}
          <View style={styles.articleMeta}>
            <View style={styles.metaLeft}>
              <View style={[styles.authorAvatar, { backgroundColor: Colors[colorScheme].tint }]}>
                <Ionicons name="person" size={16} color="white" />
              </View>
              <View>
                <Text style={[styles.authorName, { color: Colors[colorScheme].text }]}>
                  News Editor
                </Text>
                <Text style={[styles.publishDate, { color: Colors[colorScheme].tabIconDefault }]}>
                  {formattedDate(article.created_at)}
                </Text>
              </View>
            </View>
            
            <View style={styles.metaRight}>
              <View style={styles.readTime}>
                <Ionicons name="time-outline" size={16} color={Colors[colorScheme].tabIconDefault} />
                <Text style={[styles.readTimeText, { color: Colors[colorScheme].tabIconDefault }]}>
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
                { backgroundColor: isFavorite ? Colors.universal.favorite + '20' : Colors[colorScheme].background }
              ]}
              onPress={onPressToggle}
            >
              <AntDesign 
                name={isFavorite ? "star" : "staro"} 
                size={20} 
                color={isFavorite ? Colors.universal.favorite : Colors[colorScheme].tabIconDefault} 
              />
              <Text style={[
                styles.actionText, 
                { color: isFavorite ? Colors.universal.favorite : Colors[colorScheme].tabIconDefault }
              ]}>
                {isFavorite ? 'Saved' : 'Save'}
              </Text>
            </Pressable>

            <Pressable 
              style={[styles.actionButton, { backgroundColor: Colors[colorScheme].background }]}
              onPress={() => {/* Add share logic */}}
            >
              <Ionicons name="share-outline" size={20} color={Colors[colorScheme].tabIconDefault} />
              <Text style={[styles.actionText, { color: Colors[colorScheme].tabIconDefault }]}>
                Share
              </Text>
            </Pressable>

            <Pressable 
              style={[styles.actionButton, { backgroundColor: Colors[colorScheme].background }]}
              onPress={() => setShowFontSizePickerModal(true)}
            >
              <Ionicons name="text" size={20} color={Colors[colorScheme].tabIconDefault} />
              <Text style={[styles.actionText, { color: Colors[colorScheme].tabIconDefault }]}>
                Font
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          {/* Reading Progress Bar */}
          <View style={[styles.progressBar, { backgroundColor: Colors[colorScheme].border }]}>
            <View 
              style={[
                styles.progressFill,
                { 
                  backgroundColor: Colors[colorScheme].tint,
                  width: `${Math.min((scrollY / 1000) * 100, 100)}%`
                }
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
                  fontFamily: 'System',
                },
                heading1: {
                  color: Colors[colorScheme].text,
                  fontSize: fontSize * 1.8,
                  fontWeight: '800',
                  marginBottom: 20,
                  marginTop: 32,
                  letterSpacing: -0.5,
                },
                heading2: {
                  color: Colors[colorScheme].text,
                  fontSize: fontSize * 1.5,
                  fontWeight: '700',
                  marginBottom: 16,
                  marginTop: 28,
                  letterSpacing: -0.3,
                },
                paragraph: {
                  color: Colors[colorScheme].text,
                  fontSize: fontSize,
                  lineHeight: lineHeight * 1.6,
                  marginBottom: 20,
                  textAlign: 'justify',
                },
                strong: {
                  color: Colors[colorScheme].text,
                  fontWeight: '700',
                },
                em: {
                  color: Colors[colorScheme].tabIconDefault,
                  fontStyle: 'italic',
                },
                link: {
                  color: Colors[colorScheme].tint,
                  textDecorationLine: 'underline',
                },
                blockquote: {
                  backgroundColor: 'transparent',
                  borderLeftColor: Colors[colorScheme].tint,
                  borderLeftWidth: 4,
                  paddingLeft: 20,
                  paddingVertical: 16,
                  marginVertical: 24,
                  fontStyle: 'italic',
                },
                code_inline: {
                  backgroundColor: Colors[colorScheme].tint + '15',
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

          {/* Article Footer */}
          <View style={[styles.articleFooter, { borderTopColor: Colors[colorScheme].border }]}>
            <Text style={[styles.footerText, { color: Colors[colorScheme].tabIconDefault }]}>
              Published on {formattedDate(article.created_at)}
            </Text>
            <View style={styles.footerActions}>
              <Pressable style={styles.footerAction} onPress={onPressToggle}>
                <AntDesign 
                  name={isFavorite ? "star" : "staro"} 
                  size={24} 
                  color={isFavorite ? Colors.universal.favorite : Colors[colorScheme].tabIconDefault} 
                />
              </Pressable>
              <Pressable style={styles.footerAction}>
                <Ionicons name="share-outline" size={24} color={Colors[colorScheme].tabIconDefault} />
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>

      <FontSizePickerModal
        visible={showFontSizePickerModal}
        onClose={() => setShowFontSizePickerModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  floatingHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 12,
    zIndex: 1000,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 12,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    paddingHorizontal: 24,
    paddingTop: 120,
    paddingBottom: 32,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 20,
  },
  categoryText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '900',
    lineHeight: 40,
    marginBottom: 24,
    letterSpacing: -0.8,
  },
  articleMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  metaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authorName: {
    fontSize: 14,
    fontWeight: '600',
  },
  publishDate: {
    fontSize: 12,
    marginTop: 2,
  },
  metaRight: {},
  readTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  readTimeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  actionBar: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
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
    height: '100%',
    borderRadius: 2,
  },
  articleContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  articleFooter: {
    marginHorizontal: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  footerText: {
    fontSize: 14,
  },
  footerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  footerAction: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingCard: {
    alignItems: 'center',
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
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 8,
  },
  errorSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});