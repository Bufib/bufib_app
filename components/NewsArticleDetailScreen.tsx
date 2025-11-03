// // // // // // import { Colors } from "@/constants/Colors";
// // // // // // import { NewsArticlesType } from "@/constants/Types";
// // // // // // import { useLanguage } from "@/contexts/LanguageContext";
// // // // // // import { useNewsArticles } from "@/hooks/useNewsArticles";
// // // // // // import { useFontSizeStore } from "@/stores/fontSizeStore";
// // // // // // import { useRefreshFavorites } from "@/stores/refreshFavoriteStore";
// // // // // // import {
// // // // // //   isNewsArticleFavorited,
// // // // // //   toggleNewsArticleFavorite,
// // // // // // } from "@/utils/favorites";
// // // // // // import { formattedDate } from "@/utils/formate";
// // // // // // import AntDesign from "@expo/vector-icons/AntDesign";
// // // // // // import Ionicons from "@expo/vector-icons/Ionicons";
// // // // // // import { Image } from "expo-image";
// // // // // // import React, { useCallback, useEffect, useRef, useState } from "react";
// // // // // // import { useTranslation } from "react-i18next";
// // // // // // import {
// // // // // //   Pressable,
// // // // // //   ScrollView,
// // // // // //   StyleSheet,
// // // // // //   Text,
// // // // // //   TouchableOpacity,
// // // // // //   useColorScheme,
// // // // // //   View,
// // // // // // } from "react-native";
// // // // // // import Markdown from "react-native-markdown-display";
// // // // // // import { SafeAreaView } from "react-native-safe-area-context";
// // // // // // import FontSizePickerModal from "./FontSizePickerModal";
// // // // // // import HeaderLeftBackButton from "./HeaderLeftBackButton";
// // // // // // import { LoadingIndicator } from "./LoadingIndicator";
// // // // // // import { ThemedText } from "./ThemedText";
// // // // // // import { ThemedView } from "./ThemedView";

// // // // // // export default function NewsArticleDetailScreen({
// // // // // //   articleId,
// // // // // // }: {
// // // // // //   articleId: number;
// // // // // // }) {
// // // // // //   const { fontSize, lineHeight } = useFontSizeStore();
// // // // // //   const colorScheme = useColorScheme() ?? "light";
// // // // // //   const { t } = useTranslation();
// // // // // //   const [article, setArticle] = useState<NewsArticlesType | null>(null);
// // // // // //   const [isLoading, setIsLoading] = useState(true);
// // // // // //   const [error, setError] = useState<string | null>(null);
// // // // // //   const [showFontSizePickerModal, setShowFontSizePickerModal] = useState(false);
// // // // // //   const [isFavorite, setIsFavorite] = useState(false);
// // // // // //   const [scrollY, setScrollY] = useState(0);
// // // // // //   const { triggerRefreshFavorites } = useRefreshFavorites();
// // // // // //   const { language, isArabic } = useLanguage();
// // // // // //   const { fetchNewsArticleById } = useNewsArticles(lang);

// // // // // //   const scrollViewRef = useRef<ScrollView>(null);
// // // // // //   const handleScroll = (event: any) => {
// // // // // //     setScrollY(event.nativeEvent.contentOffset.y);
// // // // // //   };
// // // // // //   const scrollToTop = () => {
// // // // // //     scrollViewRef.current?.scrollTo({ y: 0, animated: true });
// // // // // //   };

// // // // // //   useEffect(() => {
// // // // // //     if (!articleId) {
// // // // // //       setError(t("errorLoadingArticle"));
// // // // // //       setIsLoading(false);
// // // // // //       return;
// // // // // //     }

// // // // // //     const loadArticle = async () => {
// // // // // //       setIsLoading(true);
// // // // // //       setError(null);
// // // // // //       try {
// // // // // //         const fetchedArticle = await fetchNewsArticleById(articleId);
// // // // // //         if (fetchedArticle) {
// // // // // //           setArticle(fetchedArticle);
// // // // // //         } else {
// // // // // //           setError(t("errorLoadingArticle"));
// // // // // //         }
// // // // // //       } catch (error: any) {
// // // // // //         console.error("Error loading news article:", error);
// // // // // //         setError(error.message || t("errorLoadingArticle"));
// // // // // //       } finally {
// // // // // //         setIsLoading(false);
// // // // // //       }
// // // // // //     };

// // // // // //     loadArticle();
// // // // // //   }, [articleId]);

// // // // // //   useEffect(() => {
// // // // // //     (async () => {
// // // // // //       try {
// // // // // //         setIsFavorite(await isNewsArticleFavorited(articleId));
// // // // // //       } catch {
// // // // // //         console.log("error");
// // // // // //       }
// // // // // //     })();
// // // // // //   }, [articleId]);

// // // // // //   const onPressToggle = useCallback(async () => {
// // // // // //     if (!articleId) return;

// // // // // //     try {
// // // // // //       const newFavStatus = await toggleNewsArticleFavorite(articleId);
// // // // // //       setIsFavorite(newFavStatus);
// // // // // //       triggerRefreshFavorites();
// // // // // //     } catch (error) {
// // // // // //       console.log(error);
// // // // // //     }
// // // // // //   }, [articleId, triggerRefreshFavorites]);

// // // // // //   if (isLoading) {
// // // // // //     return (
// // // // // //       <ThemedView style={[styles.container]}>
// // // // // //         <View style={styles.loadingContainer}>
// // // // // //           <View
// // // // // //             style={[
// // // // // //               styles.loadingCard,
// // // // // //               { backgroundColor: Colors[colorScheme].background },
// // // // // //             ]}
// // // // // //           >
// // // // // //             <LoadingIndicator size="large" />
// // // // // //           </View>
// // // // // //         </View>
// // // // // //       </ThemedView>
// // // // // //     );
// // // // // //   }

// // // // // //   if (error || !article) {
// // // // // //     return (
// // // // // //       <View
// // // // // //         style={[
// // // // // //           styles.container,
// // // // // //           { backgroundColor: Colors[colorScheme].background },
// // // // // //         ]}
// // // // // //       >
// // // // // //         <View style={styles.errorContainer}>
// // // // // //           <Ionicons
// // // // // //             name="newspaper-outline"
// // // // // //             size={80}
// // // // // //             color={Colors[colorScheme].defaultIcon}
// // // // // //           />
// // // // // //           <Text
// // // // // //             style={[styles.errorTitle, { color: Colors[colorScheme].text }]}
// // // // // //           >
// // // // // //             {t("error")}
// // // // // //           </Text>
// // // // // //           <Text
// // // // // //             style={[
// // // // // //               styles.errorSubtitle,
// // // // // //               { color: Colors[colorScheme].defaultIcon },
// // // // // //             ]}
// // // // // //           >
// // // // // //             {t("errorLoadingArticle")}
// // // // // //           </Text>
// // // // // //           <Text
// // // // // //             style={[
// // // // // //               styles.errorSubtitle,
// // // // // //               { color: Colors[colorScheme].defaultIcon },
// // // // // //             ]}
// // // // // //           >
// // // // // //             {error}
// // // // // //           </Text>
// // // // // //         </View>
// // // // // //       </View>
// // // // // //     );
// // // // // //   }

// // // // // //   return (
// // // // // //     <SafeAreaView
// // // // // //       style={[
// // // // // //         styles.container,
// // // // // //         { backgroundColor: Colors[colorScheme].background },
// // // // // //       ]}
// // // // // //       edges={["top"]}
// // // // // //     >
// // // // // //       <ScrollView
// // // // // //         style={styles.scrollView}
// // // // // //         onScroll={handleScroll}
// // // // // //         scrollEventThrottle={16}
// // // // // //         showsVerticalScrollIndicator={true}
// // // // // //         ref={scrollViewRef}
// // // // // //       >
// // // // // //         <View style={styles.heroSection}>
// // // // // //           <View style={[styles.header]}>
// // // // // //             <HeaderLeftBackButton />
// // // // // //             <Text
// // // // // //               style={[
// // // // // //                 styles.headerText,
// // // // // //                 {
// // // // // //                   backgroundColor: Colors.universal.third,
// // // // // //                 },
// // // // // //               ]}
// // // // // //             >
// // // // // //               {t("newsArticleScreenTitle").toUpperCase()}
// // // // // //             </Text>
// // // // // //           </View>

// // // // // //           {/* Main Title */}
// // // // // //           <Text style={[styles.heroTitle, { color: Colors[colorScheme].text }]}>
// // // // // //             {article.title}
// // // // // //           </Text>

// // // // // //           {/* Article Meta */}
// // // // // //           <View style={styles.articleMeta}>
// // // // // //             <View style={styles.metaLeft}>
// // // // // //               <View
// // // // // //                 style={[
// // // // // //                   styles.authorAvatar,
// // // // // //                   {
// // // // // //                     backgroundColor: Colors[colorScheme].contrast,
// // // // // //                     borderColor: Colors[colorScheme].border,
// // // // // //                   },
// // // // // //                 ]}
// // // // // //               >
// // // // // //                 {article.scholar_type === 1 ? (
// // // // // //                   <Image
// // // // // //                     source={require("@/assets/images/1.png")}
// // // // // //                     style={{ width: 50, height: 50, margin: 10 }}
// // // // // //                     contentFit="fill"
// // // // // //                   />
// // // // // //                 ) : article.scholar_type === 2 ? (
// // // // // //                   <Image
// // // // // //                     source={require("@/assets/images/2.png")}
// // // // // //                     style={{ width: 50, height: 50, margin: 10 }}
// // // // // //                   />
// // // // // //                 ) : (
// // // // // //                   <Image
// // // // // //                     source={require("@/assets/images/3.png")}
// // // // // //                     style={{ width: 70, height: 70, margin: 0 }}
// // // // // //                   />
// // // // // //                 )}
// // // // // //               </View>
// // // // // //               <View>
// // // // // //                 <Text
// // // // // //                   style={[
// // // // // //                     styles.authorName,
// // // // // //                     { color: Colors[colorScheme].text },
// // // // // //                   ]}
// // // // // //                 >
// // // // // //                   {article.author}
// // // // // //                 </Text>
// // // // // //                 <Text
// // // // // //                   style={[
// // // // // //                     styles.publishDate,
// // // // // //                     { color: Colors.universal.grayedOut },
// // // // // //                   ]}
// // // // // //                 >
// // // // // //                   {formattedDate(article.created_at)}
// // // // // //                 </Text>
// // // // // //               </View>
// // // // // //             </View>

// // // // // //             <View style={styles.metaRight}>
// // // // // //               <View style={styles.readTime}>
// // // // // //                 <Ionicons
// // // // // //                   name="time-outline"
// // // // // //                   size={16}
// // // // // //                   color={Colors[colorScheme].defaultIcon}
// // // // // //                 />
// // // // // //                 <Text
// // // // // //                   style={[
// // // // // //                     styles.readTimeText,
// // // // // //                     { color: Colors[colorScheme].defaultIcon },
// // // // // //                   ]}
// // // // // //                 >
// // // // // //                   {article.read_time} min
// // // // // //                 </Text>
// // // // // //               </View>
// // // // // //             </View>
// // // // // //           </View>

// // // // // //           {/* Action Bar */}
// // // // // //           <View style={styles.actionBar}>
// // // // // //             <Pressable
// // // // // //               style={[
// // // // // //                 styles.actionButton,
// // // // // //                 {
// // // // // //                   backgroundColor: Colors[colorScheme].contrast,
// // // // // //                   borderColor: Colors[colorScheme].border,
// // // // // //                 },
// // // // // //               ]}
// // // // // //               onPress={() => setShowFontSizePickerModal(true)}
// // // // // //             >
// // // // // //               <Ionicons
// // // // // //                 name="text"
// // // // // //                 size={22}
// // // // // //                 color={Colors[colorScheme].defaultIcon}
// // // // // //               />
// // // // // //             </Pressable>
// // // // // //             <Pressable
// // // // // //               style={[
// // // // // //                 styles.actionButton,
// // // // // //                 {
// // // // // //                   backgroundColor: Colors[colorScheme].contrast,
// // // // // //                   borderColor: Colors[colorScheme].border,
// // // // // //                 },
// // // // // //               ]}
// // // // // //               onPress={onPressToggle}
// // // // // //             >
// // // // // //               <AntDesign
// // // // // //                 name={isFavorite ? "star" : "staro"}
// // // // // //                 size={25}
// // // // // //                 color={
// // // // // //                   isFavorite
// // // // // //                     ? Colors.universal.favorite
// // // // // //                     : Colors[colorScheme].defaultIcon
// // // // // //                 }
// // // // // //               />
// // // // // //             </Pressable>
// // // // // //           </View>
// // // // // //         </View>

// // // // // //         {/* Content Section */}
// // // // // //         <View style={styles.contentSection}>
// // // // // //           {/* Reading Progress Bar */}
// // // // // //           <View
// // // // // //             style={[
// // // // // //               styles.progressBar,
// // // // // //               { backgroundColor: Colors[colorScheme].border },
// // // // // //             ]}
// // // // // //           >
// // // // // //             <View
// // // // // //               style={[
// // // // // //                 styles.progressFill,
// // // // // //                 {
// // // // // //                   backgroundColor: Colors.universal.third,
// // // // // //                 },
// // // // // //               ]}
// // // // // //             />
// // // // // //           </View>

// // // // // //           {/* Article Content */}
// // // // // //           <View style={styles.articleContent}>
// // // // // //             <Markdown
// // // // // //               style={{
// // // // // //                 body: {
// // // // // //                   color: Colors[colorScheme].text,
// // // // // //                   fontSize: fontSize,
// // // // // //                   lineHeight: lineHeight * 1.6,
// // // // // //                   fontFamily: "System",
// // // // // //                 },
// // // // // //                 heading1: {
// // // // // //                   color: Colors[colorScheme].text,
// // // // // //                   fontSize: fontSize * 1.8,
// // // // // //                   fontWeight: "800",
// // // // // //                   marginBottom: 20,
// // // // // //                   marginTop: 32,
// // // // // //                   letterSpacing: -0.5,
// // // // // //                 },
// // // // // //                 heading2: {
// // // // // //                   color: Colors[colorScheme].text,
// // // // // //                   fontSize: fontSize * 1.5,
// // // // // //                   fontWeight: "700",
// // // // // //                   marginBottom: 16,
// // // // // //                   marginTop: 28,
// // // // // //                   letterSpacing: -0.3,
// // // // // //                 },
// // // // // //                 paragraph: {
// // // // // //                   color: Colors[colorScheme].text,
// // // // // //                   fontSize: fontSize,
// // // // // //                   lineHeight: lineHeight * 1.6,
// // // // // //                   marginBottom: 20,
// // // // // //                 },
// // // // // //                 strong: {
// // // // // //                   color: Colors[colorScheme].text,
// // // // // //                   fontWeight: "700",
// // // // // //                 },
// // // // // //                 em: {
// // // // // //                   color: Colors[colorScheme].defaultIcon,
// // // // // //                   fontStyle: "italic",
// // // // // //                 },
// // // // // //                 link: {
// // // // // //                   color: Colors[colorScheme].tint,
// // // // // //                   textDecorationLine: "underline",
// // // // // //                 },
// // // // // //                 blockquote: {
// // // // // //                   backgroundColor: "transparent",
// // // // // //                   borderLeftColor: Colors[colorScheme].tint,
// // // // // //                   borderLeftWidth: 4,
// // // // // //                   paddingLeft: 20,
// // // // // //                   paddingVertical: 16,
// // // // // //                   marginVertical: 24,
// // // // // //                   fontStyle: "italic",
// // // // // //                 },
// // // // // //                 code_inline: {
// // // // // //                   backgroundColor: Colors[colorScheme].tint + "15",
// // // // // //                   color: Colors[colorScheme].tint,
// // // // // //                   paddingHorizontal: 6,
// // // // // //                   paddingVertical: 2,
// // // // // //                   borderRadius: 4,
// // // // // //                   fontSize: fontSize * 0.9,
// // // // // //                 },
// // // // // //               }}
// // // // // //             >
// // // // // //               {article.content}
// // // // // //             </Markdown>
// // // // // //           </View>
// // // // // //           {article.source && (
// // // // // //             <View
// // // // // //               style={[
// // // // // //                 styles.footerContainer,
// // // // // //                 {
// // // // // //                   borderColor: Colors[colorScheme].border,
// // // // // //                   alignItems: isArabic() ? "flex-end" : "flex-start",
// // // // // //                 },
// // // // // //               ]}
// // // // // //             >
// // // // // //               <ThemedText
// // // // // //                 style={{
// // // // // //                   fontWeight: "600",
// // // // // //                   fontSize: fontSize,
// // // // // //                   marginBottom: 5,
// // // // // //                 }}
// // // // // //               >
// // // // // //                 {t("source")}
// // // // // //               </ThemedText>
// // // // // //               <Markdown
// // // // // //                 style={{
// // // // // //                   body: {
// // // // // //                     color: Colors[colorScheme].text,
// // // // // //                     fontSize: 14,
// // // // // //                     fontFamily: "System",
// // // // // //                   },
// // // // // //                   paragraph: {
// // // // // //                     color: Colors[colorScheme].text,
// // // // // //                     fontSize: 14,
// // // // // //                     textAlign: "justify",
// // // // // //                   },
// // // // // //                   strong: {
// // // // // //                     color: Colors[colorScheme].text,
// // // // // //                     fontWeight: "700",
// // // // // //                     fontSize: 14,
// // // // // //                   },
// // // // // //                   em: {
// // // // // //                     color: Colors[colorScheme].defaultIcon,
// // // // // //                     fontStyle: "italic",
// // // // // //                     fontSize: 14,
// // // // // //                   },
// // // // // //                   link: {
// // // // // //                     color: Colors[colorScheme].tint,
// // // // // //                     textDecorationLine: "underline",
// // // // // //                     fontSize: 14,
// // // // // //                   },
// // // // // //                   blockquote: {
// // // // // //                     backgroundColor: "transparent",
// // // // // //                     borderLeftColor: Colors[colorScheme].tint,
// // // // // //                     borderLeftWidth: 4,
// // // // // //                     paddingLeft: 20,
// // // // // //                     paddingVertical: 16,
// // // // // //                     marginVertical: 24,
// // // // // //                     fontStyle: "italic",
// // // // // //                     fontSize: 14,
// // // // // //                   },
// // // // // //                   code_inline: {
// // // // // //                     backgroundColor: Colors[colorScheme].tint + "15",
// // // // // //                     color: Colors[colorScheme].tint,
// // // // // //                     paddingHorizontal: 6,
// // // // // //                     paddingVertical: 2,
// // // // // //                     borderRadius: 4,
// // // // // //                     fontSize: 14,
// // // // // //                   },
// // // // // //                 }}
// // // // // //               >
// // // // // //                 {article.source}
// // // // // //               </Markdown>
// // // // // //             </View>
// // // // // //           )}
// // // // // //         </View>
// // // // // //       </ScrollView>

// // // // // //       <FontSizePickerModal
// // // // // //         visible={showFontSizePickerModal}
// // // // // //         onClose={() => setShowFontSizePickerModal(false)}
// // // // // //       />
// // // // // //       {scrollY > 200 && (
// // // // // //         <TouchableOpacity style={styles.arrowUp} onPress={scrollToTop}>
// // // // // //             <AntDesign name="up" size={28} color="white" />
// // // // // //         </TouchableOpacity>
// // // // // //       )}
// // // // // //     </SafeAreaView>
// // // // // //   );
// // // // // // }

// // // // // // const styles = StyleSheet.create({
// // // // // //   container: {
// // // // // //     flex: 1,
// // // // // //   },

// // // // // //   scrollView: {
// // // // // //     flex: 1,
// // // // // //   },
// // // // // //   heroSection: {
// // // // // //     paddingHorizontal: 24,
// // // // // //     paddingBottom: 32,
// // // // // //     paddingTop: 10,
// // // // // //   },
// // // // // //   header: {
// // // // // //     flexDirection: "row",
// // // // // //     alignItems: "center",
// // // // // //     justifyContent: "space-between",
// // // // // //     marginBottom: 20,
// // // // // //   },
// // // // // //   headerText: {
// // // // // //     color: "white",
// // // // // //     fontSize: 12,
// // // // // //     fontWeight: "700",
// // // // // //     letterSpacing: 1,
// // // // // //     paddingHorizontal: 12,
// // // // // //     paddingVertical: 6,
// // // // // //     borderRadius: 16,
// // // // // //   },
// // // // // //   heroTitle: {
// // // // // //     fontSize: 32,
// // // // // //     fontWeight: "900",
// // // // // //     lineHeight: 40,
// // // // // //     marginBottom: 24,
// // // // // //     letterSpacing: -0.8,
// // // // // //   },
// // // // // //   articleMeta: {
// // // // // //     flexDirection: "row",
// // // // // //     justifyContent: "space-between",
// // // // // //     alignItems: "center",
// // // // // //     marginBottom: 32,
// // // // // //   },
// // // // // //   metaLeft: {
// // // // // //     flexDirection: "row",
// // // // // //     alignItems: "center",
// // // // // //     gap: 12,
// // // // // //   },
// // // // // //   authorAvatar: {
// // // // // //     borderWidth: 1,
// // // // // //     borderRadius: 99,
// // // // // //     justifyContent: "center",
// // // // // //     alignItems: "center",
// // // // // //   },
// // // // // //   authorName: {
// // // // // //     fontSize: 16,
// // // // // //     fontWeight: "600",
// // // // // //   },
// // // // // //   publishDate: {
// // // // // //     fontSize: 14,
// // // // // //     marginTop: 2,
// // // // // //   },
// // // // // //   metaRight: {},
// // // // // //   readTime: {
// // // // // //     flexDirection: "row",
// // // // // //     alignItems: "center",
// // // // // //     gap: 4,
// // // // // //   },
// // // // // //   readTimeText: {
// // // // // //     fontSize: 14,
// // // // // //     fontWeight: "500",
// // // // // //   },
// // // // // //   actionBar: {
// // // // // //     flexDirection: "row",
// // // // // //     gap: 12,
// // // // // //   },
// // // // // //   actionButton: {
// // // // // //     flex: 1,
// // // // // //     flexDirection: "row",
// // // // // //     alignItems: "center",
// // // // // //     justifyContent: "center",
// // // // // //     gap: 8,
// // // // // //     paddingVertical: 12,
// // // // // //     borderRadius: 24,
// // // // // //     borderWidth: 0.5,
// // // // // //   },
// // // // // //   actionText: {
// // // // // //     fontSize: 14,
// // // // // //     fontWeight: "600",
// // // // // //   },
// // // // // //   contentSection: {
// // // // // //     flex: 1,
// // // // // //   },
// // // // // //   progressBar: {
// // // // // //     height: 3,
// // // // // //     marginHorizontal: 24,
// // // // // //     borderRadius: 2,
// // // // // //     marginBottom: 32,
// // // // // //   },
// // // // // //   progressFill: {
// // // // // //     height: "100%",
// // // // // //     borderRadius: 2,
// // // // // //   },
// // // // // //   articleContent: {
// // // // // //     paddingHorizontal: 30,
// // // // // //   },

// // // // // //   loadingContainer: {
// // // // // //     flex: 1,
// // // // // //     justifyContent: "center",
// // // // // //     alignItems: "center",
// // // // // //     padding: 40,
// // // // // //   },
// // // // // //   loadingCard: {
// // // // // //     alignItems: "center",
// // // // // //     gap: 20,
// // // // // //     padding: 40,
// // // // // //     borderRadius: 20,
// // // // // //     shadowOffset: { width: 0, height: 4 },
// // // // // //     shadowOpacity: 0.1,
// // // // // //     shadowRadius: 12,
// // // // // //     elevation: 4,
// // // // // //   },
// // // // // //   loadingText: {
// // // // // //     fontSize: 16,
// // // // // //     fontWeight: "500",
// // // // // //   },
// // // // // //   errorContainer: {
// // // // // //     flex: 1,
// // // // // //     justifyContent: "center",
// // // // // //     alignItems: "center",
// // // // // //     padding: 40,
// // // // // //   },
// // // // // //   errorTitle: {
// // // // // //     fontSize: 24,
// // // // // //     fontWeight: "700",
// // // // // //     marginTop: 20,
// // // // // //     marginBottom: 8,
// // // // // //   },
// // // // // //   errorSubtitle: {
// // // // // //     fontSize: 16,
// // // // // //     textAlign: "center",
// // // // // //     lineHeight: 24,
// // // // // //   },
// // // // // //   footerContainer: {
// // // // // //     flexDirection: "column",
// // // // // //     borderTopWidth: 0.5,
// // // // // //     paddingTop: 20,
// // // // // //     paddingBottom: 40,
// // // // // //     paddingHorizontal: 24,
// // // // // //   },
// // // // // //   arrowUp: {
// // // // // //     position: "absolute",
// // // // // //     bottom: "60%",
// // // // // //     right: "3%",
// // // // // //     borderWidth: 2.5,
// // // // // //     borderRadius: 99,
// // // // // //     padding: 5,
// // // // // //     backgroundColor: Colors.universal.primary,
// // // // // //     borderColor: Colors.universal.primary,
// // // // // //   },
// // // // // // });

// // // // // // ! Ohne lesezeichen
// // // // // // import { Colors } from "@/constants/Colors";
// // // // // // import { NewsArticlesType } from "@/constants/Types";
// // // // // // import { useLanguage } from "@/contexts/LanguageContext";
// // // // // // import { useNewsArticles } from "@/hooks/useNewsArticles";
// // // // // // import { useFontSizeStore } from "@/stores/fontSizeStore";
// // // // // // import { useRefreshFavorites } from "@/stores/refreshFavoriteStore";
// // // // // // import {
// // // // // //   isNewsArticleFavorited,
// // // // // //   toggleNewsArticleFavorite,
// // // // // // } from "@/utils/favorites";
// // // // // // import { formattedDate } from "@/utils/formate";
// // // // // // import AntDesign from "@expo/vector-icons/AntDesign";
// // // // // // import Ionicons from "@expo/vector-icons/Ionicons";
// // // // // // import { Image } from "expo-image";
// // // // // // import React, { useCallback, useEffect, useRef, useState } from "react";
// // // // // // import { useTranslation } from "react-i18next";
// // // // // // import {
// // // // // //   Pressable,
// // // // // //   StyleSheet,
// // // // // //   Text,
// // // // // //   TouchableOpacity,
// // // // // //   useColorScheme,
// // // // // //   View,
// // // // // //   FlatList,
// // // // // //   ListRenderItemInfo,
// // // // // //   NativeSyntheticEvent,
// // // // // //   NativeScrollEvent,
// // // // // // } from "react-native";
// // // // // // import Markdown from "react-native-markdown-display";
// // // // // // import { SafeAreaView } from "react-native-safe-area-context";
// // // // // // import FontSizePickerModal from "./FontSizePickerModal";
// // // // // // import HeaderLeftBackButton from "./HeaderLeftBackButton";
// // // // // // import { LoadingIndicator } from "./LoadingIndicator";
// // // // // // import { ThemedText } from "./ThemedText";
// // // // // // import { ThemedView } from "./ThemedView";

// // // // // // type Row = { key: "content" };

// // // // // // export default function NewsArticleDetailScreen({
// // // // // //   articleId,
// // // // // // }: {
// // // // // //   articleId: number;
// // // // // // }) {
// // // // // //   const { fontSize, lineHeight } = useFontSizeStore();
// // // // // //   const colorScheme = useColorScheme() ?? "light";
// // // // // //   const { t } = useTranslation();
// // // // // //   const [article, setArticle] = useState<NewsArticlesType | null>(null);
// // // // // //   const [isLoading, setIsLoading] = useState(true);
// // // // // //   const [error, setError] = useState<string | null>(null);
// // // // // //   const [showFontSizePickerModal, setShowFontSizePickerModal] = useState(false);
// // // // // //   const [isFavorite, setIsFavorite] = useState(false);
// // // // // //   const [scrollY, setScrollY] = useState(0);
// // // // // //   const [progress, setProgress] = useState(0); // 0..1 reading progress
// // // // // //   const { triggerRefreshFavorites } = useRefreshFavorites();
// // // // // //   const { language, isArabic } = useLanguage();
// // // // // //   const { fetchNewsArticleById } = useNewsArticles(language || "de");

// // // // // //   const flatListRef = useRef<FlatList<Row>>(null);

// // // // // //   const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
// // // // // //     const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
// // // // // //     setScrollY(contentOffset.y);
// // // // // //     const total = Math.max(1, contentSize.height - layoutMeasurement.height);
// // // // // //     const p = Math.min(1, Math.max(0, contentOffset.y / total));
// // // // // //     setProgress(p);
// // // // // //   };

// // // // // //   const scrollToTop = () => {
// // // // // //     flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
// // // // // //   };

// // // // // //   useEffect(() => {
// // // // // //     if (!articleId) {
// // // // // //       setError(t("errorLoadingArticle"));
// // // // // //       setIsLoading(false);
// // // // // //       return;
// // // // // //     }
// // // // // //     (async () => {
// // // // // //       setIsLoading(true);
// // // // // //       setError(null);
// // // // // //       try {
// // // // // //         const fetchedArticle = await fetchNewsArticleById(articleId);
// // // // // //         if (fetchedArticle) setArticle(fetchedArticle);
// // // // // //         else setError(t("errorLoadingArticle"));
// // // // // //       } catch (err: any) {
// // // // // //         console.error("Error loading news article:", err);
// // // // // //         setError(err?.message || t("errorLoadingArticle"));
// // // // // //       } finally {
// // // // // //         setIsLoading(false);
// // // // // //       }
// // // // // //     })();
// // // // // //   }, [articleId]);

// // // // // //   useEffect(() => {
// // // // // //     (async () => {
// // // // // //       try {
// // // // // //         setIsFavorite(await isNewsArticleFavorited(articleId));
// // // // // //       } catch {
// // // // // //         // ignore
// // // // // //       }
// // // // // //     })();
// // // // // //   }, [articleId]);

// // // // // //   const onPressToggle = useCallback(async () => {
// // // // // //     if (!articleId) return;
// // // // // //     try {
// // // // // //       const newFavStatus = await toggleNewsArticleFavorite(articleId);
// // // // // //       setIsFavorite(newFavStatus);
// // // // // //       triggerRefreshFavorites();
// // // // // //     } catch (error) {
// // // // // //       console.log(error);
// // // // // //     }
// // // // // //   }, [articleId, triggerRefreshFavorites]);

// // // // // //   if (isLoading) {
// // // // // //     return (
// // // // // //       <ThemedView style={[styles.container]}>
// // // // // //         <View style={styles.loadingContainer}>
// // // // // //           <View
// // // // // //             style={[
// // // // // //               styles.loadingCard,
// // // // // //               { backgroundColor: Colors[colorScheme].background },
// // // // // //             ]}
// // // // // //           >
// // // // // //             <LoadingIndicator size="large" />
// // // // // //           </View>
// // // // // //         </View>
// // // // // //       </ThemedView>
// // // // // //     );
// // // // // //   }

// // // // // //   if (error || !article) {
// // // // // //     return (
// // // // // //       <View
// // // // // //         style={[
// // // // // //           styles.container,
// // // // // //           { backgroundColor: Colors[colorScheme].background },
// // // // // //         ]}
// // // // // //       >
// // // // // //         <View style={styles.errorContainer}>
// // // // // //           <Ionicons
// // // // // //             name="newspaper-outline"
// // // // // //             size={80}
// // // // // //             color={Colors[colorScheme].defaultIcon}
// // // // // //           />
// // // // // //           <Text
// // // // // //             style={[styles.errorTitle, { color: Colors[colorScheme].text }]}
// // // // // //           >
// // // // // //             {t("error")}
// // // // // //           </Text>
// // // // // //           <Text
// // // // // //             style={[
// // // // // //               styles.errorSubtitle,
// // // // // //               { color: Colors[colorScheme].defaultIcon },
// // // // // //             ]}
// // // // // //           >
// // // // // //             {t("errorLoadingArticle")}
// // // // // //           </Text>
// // // // // //           <Text
// // // // // //             style={[
// // // // // //               styles.errorSubtitle,
// // // // // //               { color: Colors[colorScheme].defaultIcon },
// // // // // //             ]}
// // // // // //           >
// // // // // //             {error}
// // // // // //           </Text>
// // // // // //         </View>
// // // // // //       </View>
// // // // // //     );
// // // // // //   }

// // // // // //   const header = (
// // // // // //     <View style={styles.heroSection}>
// // // // // //       <View style={[styles.header]}>
// // // // // //         <HeaderLeftBackButton />
// // // // // //         <Text
// // // // // //           style={[
// // // // // //             styles.headerText,
// // // // // //             {
// // // // // //               backgroundColor: Colors.universal.third,
// // // // // //             },
// // // // // //           ]}
// // // // // //         >
// // // // // //           {t("newsArticleScreenTitle").toUpperCase()}
// // // // // //         </Text>
// // // // // //       </View>

// // // // // //       {/* Main Title */}
// // // // // //       <Text style={[styles.heroTitle, { color: Colors[colorScheme].text }]}>
// // // // // //         {article.title}
// // // // // //       </Text>

// // // // // //       {/* Article Meta */}
// // // // // //       <View style={styles.articleMeta}>
// // // // // //         <View style={styles.metaLeft}>
// // // // // //           <View
// // // // // //             style={[
// // // // // //               styles.authorAvatar,
// // // // // //               {
// // // // // //                 backgroundColor: Colors[colorScheme].contrast,
// // // // // //                 borderColor: Colors[colorScheme].border,
// // // // // //               },
// // // // // //             ]}
// // // // // //           >
// // // // // //             {article.scholar_type === 1 ? (
// // // // // //               <Image
// // // // // //                 source={require("@/assets/images/1.png")}
// // // // // //                 style={{ width: 50, height: 50, margin: 10 }}
// // // // // //                 contentFit="fill"
// // // // // //               />
// // // // // //             ) : article.scholar_type === 2 ? (
// // // // // //               <Image
// // // // // //                 source={require("@/assets/images/2.png")}
// // // // // //                 style={{ width: 50, height: 50, margin: 10 }}
// // // // // //               />
// // // // // //             ) : (
// // // // // //               <Image
// // // // // //                 source={require("@/assets/images/3.png")}
// // // // // //                 style={{ width: 70, height: 70, margin: 0 }}
// // // // // //               />
// // // // // //             )}
// // // // // //           </View>
// // // // // //           <View>
// // // // // //             <Text
// // // // // //               style={[styles.authorName, { color: Colors[colorScheme].text }]}
// // // // // //             >
// // // // // //               {article.author}
// // // // // //             </Text>
// // // // // //             <Text
// // // // // //               style={[
// // // // // //                 styles.publishDate,
// // // // // //                 { color: Colors.universal.grayedOut },
// // // // // //               ]}
// // // // // //             >
// // // // // //               {formattedDate(article.created_at)}
// // // // // //             </Text>
// // // // // //           </View>
// // // // // //         </View>

// // // // // //         <View style={styles.metaRight}>
// // // // // //           <View style={styles.readTime}>
// // // // // //             <Ionicons
// // // // // //               name="time-outline"
// // // // // //               size={16}
// // // // // //               color={Colors[colorScheme].defaultIcon}
// // // // // //             />
// // // // // //             <Text
// // // // // //               style={[
// // // // // //                 styles.readTimeText,
// // // // // //                 { color: Colors[colorScheme].defaultIcon },
// // // // // //               ]}
// // // // // //             >
// // // // // //               {article.read_time} min
// // // // // //             </Text>
// // // // // //           </View>
// // // // // //         </View>
// // // // // //       </View>

// // // // // //       {/* Action Bar */}
// // // // // //       <View style={styles.actionBar}>
// // // // // //         <Pressable
// // // // // //           style={[
// // // // // //             styles.actionButton,
// // // // // //             {
// // // // // //               backgroundColor: Colors[colorScheme].contrast,
// // // // // //               borderColor: Colors[colorScheme].border,
// // // // // //             },
// // // // // //           ]}
// // // // // //           onPress={() => setShowFontSizePickerModal(true)}
// // // // // //         >
// // // // // //           <Ionicons
// // // // // //             name="text"
// // // // // //             size={22}
// // // // // //             color={Colors[colorScheme].defaultIcon}
// // // // // //           />
// // // // // //         </Pressable>
// // // // // //         <Pressable
// // // // // //           style={[
// // // // // //             styles.actionButton,
// // // // // //             {
// // // // // //               backgroundColor: Colors[colorScheme].contrast,
// // // // // //               borderColor: Colors[colorScheme].border,
// // // // // //             },
// // // // // //           ]}
// // // // // //           onPress={onPressToggle}
// // // // // //         >
// // // // // //           <Ionicons
// // // // // //             name={isFavorite ? "star" : "star-outline"}
// // // // // //             size={25}
// // // // // //             color={
// // // // // //               isFavorite
// // // // // //                 ? Colors.universal.favorite
// // // // // //                 : Colors[colorScheme].defaultIcon
// // // // // //             }
// // // // // //           />
// // // // // //         </Pressable>
// // // // // //       </View>

// // // // // //       {/* Reading Progress Bar */}
// // // // // //       <View
// // // // // //         style={[
// // // // // //           styles.progressBar,
// // // // // //           { backgroundColor: Colors[colorScheme].border },
// // // // // //         ]}
// // // // // //       >
// // // // // //         <View
// // // // // //           style={[
// // // // // //             styles.progressFill,
// // // // // //             {
// // // // // //               backgroundColor: Colors.universal.third,
// // // // // //             },
// // // // // //           ]}
// // // // // //         />
// // // // // //       </View>
// // // // // //     </View>
// // // // // //   );

// // // // // //   const data: Row[] = [{ key: "content" }];

// // // // // //   const renderItem = ({ item }: ListRenderItemInfo<Row>) => {
// // // // // //     return (
// // // // // //       <View style={styles.contentSection}>
// // // // // //         {/* Article Content */}
// // // // // //         <View style={styles.articleContent}>
// // // // // //           <Markdown
// // // // // //             style={{
// // // // // //               body: {
// // // // // //                 color: Colors[colorScheme].text,
// // // // // //                 fontSize: fontSize,
// // // // // //                 lineHeight: lineHeight * 1.6,
// // // // // //                 fontFamily: "System",
// // // // // //               },
// // // // // //               heading1: {
// // // // // //                 color: Colors[colorScheme].text,
// // // // // //                 fontSize: fontSize * 1.8,
// // // // // //                 fontWeight: "800",
// // // // // //                 marginBottom: 20,
// // // // // //                 marginTop: 32,
// // // // // //                 letterSpacing: -0.5,
// // // // // //               },
// // // // // //               heading2: {
// // // // // //                 color: Colors[colorScheme].text,
// // // // // //                 fontSize: fontSize * 1.5,
// // // // // //                 fontWeight: "700",
// // // // // //                 marginBottom: 16,
// // // // // //                 marginTop: 28,
// // // // // //                 letterSpacing: -0.3,
// // // // // //               },
// // // // // //               paragraph: {
// // // // // //                 color: Colors[colorScheme].text,
// // // // // //                 fontSize: fontSize,
// // // // // //                 lineHeight: lineHeight * 1.6,
// // // // // //                 marginBottom: 20,
// // // // // //               },
// // // // // //               strong: {
// // // // // //                 color: Colors[colorScheme].text,
// // // // // //                 fontWeight: "700",
// // // // // //               },
// // // // // //               em: {
// // // // // //                 color: Colors[colorScheme].defaultIcon,
// // // // // //                 fontStyle: "italic",
// // // // // //               },
// // // // // //               link: {
// // // // // //                 color: Colors[colorScheme].tint,
// // // // // //                 textDecorationLine: "underline",
// // // // // //               },
// // // // // //               blockquote: {
// // // // // //                 backgroundColor: "transparent",
// // // // // //                 borderLeftColor: Colors[colorScheme].tint,
// // // // // //                 borderLeftWidth: 4,
// // // // // //                 paddingLeft: 20,
// // // // // //                 paddingVertical: 16,
// // // // // //                 marginVertical: 24,
// // // // // //                 fontStyle: "italic",
// // // // // //               },
// // // // // //               code_inline: {
// // // // // //                 backgroundColor: Colors[colorScheme].tint + "15",
// // // // // //                 color: Colors[colorScheme].tint,
// // // // // //                 paddingHorizontal: 6,
// // // // // //                 paddingVertical: 2,
// // // // // //                 borderRadius: 4,
// // // // // //                 fontSize: fontSize * 0.9,
// // // // // //               },
// // // // // //             }}
// // // // // //           >
// // // // // //             {article.content}
// // // // // //           </Markdown>
// // // // // //         </View>

// // // // // //         {article.source && (
// // // // // //           <View
// // // // // //             style={[
// // // // // //               styles.footerContainer,
// // // // // //               {
// // // // // //                 borderColor: Colors[colorScheme].border,
// // // // // //                 alignItems: isArabic() ? "flex-end" : "flex-start",
// // // // // //               },
// // // // // //             ]}
// // // // // //           >
// // // // // //             <ThemedText
// // // // // //               style={{
// // // // // //                 fontWeight: "600",
// // // // // //                 fontSize: fontSize,
// // // // // //                 marginBottom: 5,
// // // // // //               }}
// // // // // //             >
// // // // // //               {t("source")}
// // // // // //             </ThemedText>
// // // // // //             <Markdown
// // // // // //               style={{
// // // // // //                 body: {
// // // // // //                   color: Colors[colorScheme].text,
// // // // // //                   fontSize: 14,
// // // // // //                   fontFamily: "System",
// // // // // //                 },
// // // // // //                 paragraph: {
// // // // // //                   color: Colors[colorScheme].text,
// // // // // //                   fontSize: 14,
// // // // // //                   textAlign: "justify",
// // // // // //                 },
// // // // // //                 strong: {
// // // // // //                   color: Colors[colorScheme].text,
// // // // // //                   fontWeight: "700",
// // // // // //                   fontSize: 14,
// // // // // //                 },
// // // // // //                 em: {
// // // // // //                   color: Colors[colorScheme].defaultIcon,
// // // // // //                   fontStyle: "italic",
// // // // // //                   fontSize: 14,
// // // // // //                 },
// // // // // //                 link: {
// // // // // //                   color: Colors[colorScheme].tint,
// // // // // //                   textDecorationLine: "underline",
// // // // // //                   fontSize: 14,
// // // // // //                 },
// // // // // //                 blockquote: {
// // // // // //                   backgroundColor: "transparent",
// // // // // //                   borderLeftColor: Colors[colorScheme].tint,
// // // // // //                   borderLeftWidth: 4,
// // // // // //                   paddingLeft: 20,
// // // // // //                   paddingVertical: 16,
// // // // // //                   marginVertical: 24,
// // // // // //                   fontStyle: "italic",
// // // // // //                   fontSize: 14,
// // // // // //                 },
// // // // // //                 code_inline: {
// // // // // //                   backgroundColor: Colors[colorScheme].tint + "15",
// // // // // //                   color: Colors[colorScheme].tint,
// // // // // //                   paddingHorizontal: 6,
// // // // // //                   paddingVertical: 2,
// // // // // //                   borderRadius: 4,
// // // // // //                   fontSize: 14,
// // // // // //                 },
// // // // // //               }}
// // // // // //             >
// // // // // //               {article.source}
// // // // // //             </Markdown>
// // // // // //           </View>
// // // // // //         )}
// // // // // //       </View>
// // // // // //     );
// // // // // //   };

// // // // // //   return (
// // // // // //     <SafeAreaView
// // // // // //       style={[
// // // // // //         styles.container,
// // // // // //         { backgroundColor: Colors[colorScheme].background },
// // // // // //       ]}
// // // // // //       edges={["top"]}
// // // // // //     >
// // // // // //       <FlatList
// // // // // //         ref={flatListRef}
// // // // // //         data={data}
// // // // // //         keyExtractor={(item) => item.key}
// // // // // //         renderItem={renderItem}
// // // // // //         ListHeaderComponent={header}
// // // // // //         onScroll={handleScroll}
// // // // // //         scrollEventThrottle={16}
// // // // // //         showsVerticalScrollIndicator
// // // // // //         // perf knobs (tweak to taste)
// // // // // //         initialNumToRender={1}
// // // // // //         windowSize={5}
// // // // // //         removeClippedSubviews
// // // // // //       />

// // // // // //       <FontSizePickerModal
// // // // // //         visible={showFontSizePickerModal}
// // // // // //         onClose={() => setShowFontSizePickerModal(false)}
// // // // // //       />

// // // // // //       {scrollY > 200 && (
// // // // // //         <TouchableOpacity style={styles.arrowUp} onPress={scrollToTop}>
// // // // // //           <AntDesign name="up" size={28} color="white" />
// // // // // //         </TouchableOpacity>
// // // // // //       )}
// // // // // //     </SafeAreaView>
// // // // // //   );
// // // // // // }

// // // // // // const styles = StyleSheet.create({
// // // // // //   container: { flex: 1 },
// // // // // //   heroSection: {
// // // // // //     paddingHorizontal: 24,
// // // // // //     paddingBottom: 3,
// // // // // //     paddingTop: 10,
// // // // // //   },
// // // // // //   header: {
// // // // // //     flexDirection: "row",
// // // // // //     alignItems: "center",
// // // // // //     justifyContent: "space-between",
// // // // // //     marginBottom: 20,
// // // // // //   },
// // // // // //   headerText: {
// // // // // //     color: "white",
// // // // // //     fontSize: 12,
// // // // // //     fontWeight: "700",
// // // // // //     letterSpacing: 1,
// // // // // //     paddingHorizontal: 12,
// // // // // //     paddingVertical: 6,
// // // // // //     borderRadius: 16,
// // // // // //   },
// // // // // //   heroTitle: {
// // // // // //     fontSize: 32,
// // // // // //     fontWeight: "900",
// // // // // //     lineHeight: 40,
// // // // // //     marginBottom: 24,
// // // // // //     letterSpacing: -0.8,
// // // // // //   },
// // // // // //   articleMeta: {
// // // // // //     flexDirection: "row",
// // // // // //     justifyContent: "space-between",
// // // // // //     alignItems: "center",
// // // // // //     marginBottom: 32,
// // // // // //   },
// // // // // //   metaLeft: {
// // // // // //     flexDirection: "row",
// // // // // //     alignItems: "center",
// // // // // //     gap: 12,
// // // // // //   },
// // // // // //   authorAvatar: {
// // // // // //     borderWidth: 1,
// // // // // //     borderRadius: 99,
// // // // // //     justifyContent: "center",
// // // // // //     alignItems: "center",
// // // // // //   },
// // // // // //   authorName: { fontSize: 16, fontWeight: "600" },
// // // // // //   publishDate: { fontSize: 14, marginTop: 2 },
// // // // // //   metaRight: {},
// // // // // //   readTime: { flexDirection: "row", alignItems: "center", gap: 4 },
// // // // // //   readTimeText: { fontSize: 14, fontWeight: "500" },
// // // // // //   actionBar: { flexDirection: "row", gap: 12 },
// // // // // //   actionButton: {
// // // // // //     flex: 1,
// // // // // //     flexDirection: "row",
// // // // // //     alignItems: "center",
// // // // // //     justifyContent: "center",
// // // // // //     gap: 8,
// // // // // //     paddingVertical: 12,
// // // // // //     borderRadius: 24,
// // // // // //     borderWidth: 0.5,
// // // // // //   },
// // // // // //   contentSection: { flex: 1 },
// // // // // //   progressBar: {
// // // // // //     height: 3,
// // // // // //     marginHorizontal: 24,
// // // // // //     borderRadius: 2,
// // // // // //     marginTop: 24,
// // // // // //   },
// // // // // //   progressFill: { height: "100%", borderRadius: 2 },
// // // // // //   articleContent: { paddingHorizontal: 30 },

// // // // // //   loadingContainer: {
// // // // // //     flex: 1,
// // // // // //     justifyContent: "center",
// // // // // //     alignItems: "center",
// // // // // //     padding: 40,
// // // // // //   },
// // // // // //   loadingCard: {
// // // // // //     alignItems: "center",
// // // // // //     gap: 20,
// // // // // //     padding: 40,
// // // // // //     borderRadius: 20,
// // // // // //     shadowOffset: { width: 0, height: 4 },
// // // // // //     shadowOpacity: 0.1,
// // // // // //     shadowRadius: 12,
// // // // // //     elevation: 4,
// // // // // //   },
// // // // // //   errorContainer: {
// // // // // //     flex: 1,
// // // // // //     justifyContent: "center",
// // // // // //     alignItems: "center",
// // // // // //     padding: 40,
// // // // // //   },
// // // // // //   errorTitle: {
// // // // // //     fontSize: 24,
// // // // // //     fontWeight: "700",
// // // // // //     marginTop: 20,
// // // // // //     marginBottom: 8,
// // // // // //   },
// // // // // //   errorSubtitle: { fontSize: 16, textAlign: "center", lineHeight: 24 },
// // // // // //   footerContainer: {
// // // // // //     flexDirection: "column",
// // // // // //     borderTopWidth: 0.5,
// // // // // //     paddingTop: 20,
// // // // // //     paddingBottom: 40,
// // // // // //     paddingHorizontal: 24,
// // // // // //   },
// // // // // //   arrowUp: {
// // // // // //     position: "absolute",
// // // // // //     bottom: "60%",
// // // // // //     right: "3%",
// // // // // //     borderWidth: 2.5,
// // // // // //     borderRadius: 99,
// // // // // //     padding: 5,
// // // // // //     backgroundColor: Colors.universal.primary,
// // // // // //     borderColor: Colors.universal.primary,
// // // // // //   },
// // // // // // });

// // // // // // ! Mit lesezeichen zeit rechts
// // // // // import { Colors } from "@/constants/Colors";
// // // // // import { LanguageCode, NewsArticlesType } from "@/constants/Types";
// // // // // import { useLanguage } from "@/contexts/LanguageContext";
// // // // // import { useNewsArticles } from "@/hooks/useNewsArticles";
// // // // // import { useFontSizeStore } from "@/stores/fontSizeStore";
// // // // // import { useRefreshFavorites } from "@/stores/refreshFavoriteStore";
// // // // // import {
// // // // //   isNewsArticleFavorited,
// // // // //   toggleNewsArticleFavorite,
// // // // // } from "@/utils/favorites";
// // // // // import { formattedDate } from "@/utils/formate";
// // // // // import AntDesign from "@expo/vector-icons/AntDesign";
// // // // // import Ionicons from "@expo/vector-icons/Ionicons";
// // // // // import AsyncStorage from "@react-native-async-storage/async-storage";
// // // // // import { Image } from "expo-image";
// // // // // import React, {
// // // // //   useCallback,
// // // // //   useEffect,
// // // // //   useMemo,
// // // // //   useRef,
// // // // //   useState,
// // // // // } from "react";
// // // // // import { useTranslation } from "react-i18next";
// // // // // import {
// // // // //   Pressable,
// // // // //   StyleSheet,
// // // // //   Text,
// // // // //   TouchableOpacity,
// // // // //   useColorScheme,
// // // // //   View,
// // // // //   FlatList,
// // // // //   ListRenderItemInfo,
// // // // //   NativeSyntheticEvent,
// // // // //   NativeScrollEvent,
// // // // //   Alert,
// // // // //   type GestureResponderEvent,
// // // // // } from "react-native";
// // // // // import Markdown from "react-native-markdown-display";
// // // // // import { SafeAreaView } from "react-native-safe-area-context";
// // // // // import FontSizePickerModal from "./FontSizePickerModal";
// // // // // import HeaderLeftBackButton from "./HeaderLeftBackButton";
// // // // // import { LoadingIndicator } from "./LoadingIndicator";
// // // // // import { ThemedText } from "./ThemedText";
// // // // // import { ThemedView } from "./ThemedView";
// // // // // import i18n from "@/utils/i18n";

// // // // // type Row = { key: "content" };
// // // // // type SavedBookmark = { ratio: number; addedAt: number };

// // // // // export default function NewsArticleDetailScreen({
// // // // //   articleId,
// // // // // }: {
// // // // //   articleId: number;
// // // // // }) {
// // // // //   const { fontSize, lineHeight } = useFontSizeStore();
// // // // //   const colorScheme = useColorScheme() ?? "light";
// // // // //   const { t } = useTranslation();
// // // // //   const [article, setArticle] = useState<NewsArticlesType | null>(null);
// // // // //   const [isLoading, setIsLoading] = useState(true);
// // // // //   const [error, setError] = useState<string | null>(null);

// // // // //   const [showFontSizePickerModal, setShowFontSizePickerModal] = useState(false);
// // // // //   const [isFavorite, setIsFavorite] = useState(false);

// // // // //   // scroll/progress
// // // // //   const [scrollY, setScrollY] = useState(0);
// // // // //   const [progress, setProgress] = useState(0);

// // // // //   // layout + coords conversion
// // // // //   const containerRef = useRef<View>(null);
// // // // //   const [containerTop, setContainerTop] = useState(0);
// // // // //   const [containerLeft, setContainerLeft] = useState(0);
// // // // //   const [contentHeight, setContentHeight] = useState(0);
// // // // //   const [headerHeight, setHeaderHeight] = useState(0);

// // // // //   // overlay position (in content coords)
// // // // //   const [overlayContentY, setOverlayContentY] = useState<number | null>(null);

// // // // //   // persisted bookmark ratio (excludes header)
// // // // //   const [bookmarkRatio, setBookmarkRatio] = useState<number | null>(null);

// // // // //   const { triggerRefreshFavorites } = useRefreshFavorites();
// // // // //   const { language, isArabic } = useLanguage();
// // // // //   const lang = (language ?? "de") as LanguageCode;
// // // // //   const { fetchNewsArticleById } = useNewsArticles(language || "de");
// // // // //   const bookmarkKey = (articleId: number) =>
// // // // //     `bookmark:newsArticle:${articleId}:${language}`;

// // // // //   const flatListRef = useRef<FlatList<Row>>(null);

// // // // //   const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
// // // // //   const effectiveScrollableHeight = useMemo(
// // // // //     () => Math.max(1, contentHeight - headerHeight),
// // // // //     [contentHeight, headerHeight]
// // // // //   );

// // // // //   const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
// // // // //     const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
// // // // //     setScrollY(contentOffset.y);

// // // // //     const total = Math.max(1, contentSize.height - layoutMeasurement.height);
// // // // //     setProgress(clamp01(contentOffset.y / total));
// // // // //   };

// // // // //   const scrollToTop = () => {
// // // // //     flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
// // // // //   };

// // // // //   // Load article
// // // // //   useEffect(() => {
// // // // //     if (!articleId) {
// // // // //       setError(t("errorLoadingArticle"));
// // // // //       setIsLoading(false);
// // // // //       return;
// // // // //     }
// // // // //     (async () => {
// // // // //       setIsLoading(true);
// // // // //       setError(null);
// // // // //       try {
// // // // //         const fetchedArticle = await fetchNewsArticleById(articleId);
// // // // //         if (fetchedArticle) setArticle(fetchedArticle);
// // // // //         else setError(t("errorLoadingArticle"));
// // // // //       } catch (err: any) {
// // // // //         console.error("Error loading news article:", err);
// // // // //         setError(err?.message || t("errorLoadingArticle"));
// // // // //       } finally {
// // // // //         setIsLoading(false);
// // // // //       }
// // // // //     })();
// // // // //   }, [articleId]);

// // // // //   // Favorite state
// // // // //   useEffect(() => {
// // // // //     (async () => {
// // // // //       try {
// // // // //         setIsFavorite(await isNewsArticleFavorited(articleId));
// // // // //       } catch {
// // // // //         // ignore
// // // // //       }
// // // // //     })();
// // // // //   }, [articleId]);

// // // // //   // Measure container for page->local conversion
// // // // //   const handleContainerLayout = () => {
// // // // //     containerRef.current?.measureInWindow?.((x, y) => {
// // // // //       setContainerLeft(x ?? 0);
// // // // //       setContainerTop(y ?? 0);
// // // // //     });
// // // // //   };

// // // // //   // Load bookmark
// // // // //   useEffect(() => {
// // // // //     (async () => {
// // // // //       try {
// // // // //         const raw = await AsyncStorage.getItem(bookmarkKey(articleId));
// // // // //         if (!raw) return;
// // // // //         const saved: SavedBookmark = JSON.parse(raw);
// // // // //         if (typeof saved?.ratio === "number") {
// // // // //           setBookmarkRatio(clamp01(saved.ratio));
// // // // //         }
// // // // //       } catch (e) {
// // // // //         console.log("Failed to load bookmark", e);
// // // // //       }
// // // // //     })();
// // // // //   }, [articleId]);

// // // // //   // Recompute overlay Y from ratio when sizes/ratio change
// // // // //   useEffect(() => {
// // // // //     if (bookmarkRatio == null) return;
// // // // //     const y = headerHeight + bookmarkRatio * effectiveScrollableHeight;
// // // // //     setOverlayContentY(y);
// // // // //   }, [bookmarkRatio, headerHeight, effectiveScrollableHeight]);

// // // // //   const saveBookmark = useCallback(
// // // // //     async (contentY: number) => {
// // // // //       const ratio = clamp01(
// // // // //         (contentY - headerHeight) / effectiveScrollableHeight
// // // // //       );
// // // // //       setBookmarkRatio(ratio);
// // // // //       setOverlayContentY(contentY);
// // // // //       try {
// // // // //         const payload: SavedBookmark = { ratio, addedAt: Date.now() };
// // // // //         await AsyncStorage.setItem(
// // // // //           bookmarkKey(articleId),
// // // // //           JSON.stringify(payload)
// // // // //         );
// // // // //       } catch (e) {
// // // // //         console.log("Failed to save bookmark", e);
// // // // //       }
// // // // //     },
// // // // //     [articleId, headerHeight, effectiveScrollableHeight]
// // // // //   );

// // // // //   const clearBookmark = useCallback(() => {
// // // // //     Alert.alert(
// // // // //       t("remove", "Remove"),
// // // // //       t("bookmarkRemove", "Remove this bookmark?"),
// // // // //       [
// // // // //         { text: t("cancel", "Cancel"), style: "cancel" },
// // // // //         {
// // // // //           text: t("remove", "Remove"),
// // // // //           style: "destructive",
// // // // //           onPress: async () => {
// // // // //             try {
// // // // //               setBookmarkRatio(null);
// // // // //               setOverlayContentY(null);
// // // // //               await AsyncStorage.removeItem(bookmarkKey(articleId));
// // // // //             } catch (e) {
// // // // //               console.log("Failed to clear bookmark", e);
// // // // //             }
// // // // //           },
// // // // //         },
// // // // //       ],
// // // // //       { cancelable: true }
// // // // //     );
// // // // //   }, [articleId, t]);

// // // // //   const jumpToBookmark = useCallback(() => {
// // // // //     if (overlayContentY == null) return;
// // // // //     const target = Math.max(overlayContentY - 200, 0);
// // // // //     flatListRef.current?.scrollToOffset({ offset: target, animated: true });
// // // // //   }, [overlayContentY]);

// // // // //   // CONFIRM before replacing
// // // // //   const handleLongPress = useCallback(
// // // // //     (e: GestureResponderEvent) => {
// // // // //       const { pageY } = e.nativeEvent as any;
// // // // //       const contentY = pageY - containerTop + scrollY;

// // // // //       if (bookmarkRatio != null) {
// // // // //         Alert.alert(
// // // // //           t("replace"),
// // // // //           t("bookmarkReplaceQuestion"),
// // // // //           [
// // // // //             { text: t("cancel"), style: "cancel" },
// // // // //             {
// // // // //               text: t("replace", "Replace"),
// // // // //               style: "destructive",
// // // // //               onPress: () => saveBookmark(contentY),
// // // // //             },
// // // // //           ],
// // // // //           { cancelable: true }
// // // // //         );
// // // // //         return;
// // // // //       }
// // // // //       // No previous bookmark
// // // // //       saveBookmark(contentY);
// // // // //     },
// // // // //     [bookmarkRatio, containerTop, scrollY, saveBookmark, t]
// // // // //   );

// // // // //   const { isArabic: isArabicFn } = useLanguage();

// // // // //   if (isLoading) {
// // // // //     return (
// // // // //       <ThemedView style={[styles.container]}>
// // // // //         <View style={styles.loadingContainer}>
// // // // //           <View
// // // // //             style={[
// // // // //               styles.loadingCard,
// // // // //               { backgroundColor: Colors[colorScheme].background },
// // // // //             ]}
// // // // //           >
// // // // //             <LoadingIndicator size="large" />
// // // // //           </View>
// // // // //         </View>
// // // // //       </ThemedView>
// // // // //     );
// // // // //   }

// // // // //   if (error || !article) {
// // // // //     return (
// // // // //       <View
// // // // //         style={[
// // // // //           styles.container,
// // // // //           { backgroundColor: Colors[colorScheme].background },
// // // // //         ]}
// // // // //       >
// // // // //         <View style={styles.errorContainer}>
// // // // //           <Ionicons
// // // // //             name="newspaper-outline"
// // // // //             size={80}
// // // // //             color={Colors[colorScheme].defaultIcon}
// // // // //           />
// // // // //         </View>
// // // // //         <Text style={[styles.errorTitle, { color: Colors[colorScheme].text }]}>
// // // // //           {t("error")}
// // // // //         </Text>
// // // // //         <Text
// // // // //           style={[
// // // // //             styles.errorSubtitle,
// // // // //             { color: Colors[colorScheme].defaultIcon },
// // // // //           ]}
// // // // //         >
// // // // //           {t("errorLoadingArticle")}
// // // // //         </Text>
// // // // //         <Text
// // // // //           style={[
// // // // //             styles.errorSubtitle,
// // // // //             { color: Colors[colorScheme].defaultIcon },
// // // // //           ]}
// // // // //         >
// // // // //           {error}
// // // // //         </Text>
// // // // //       </View>
// // // // //     );
// // // // //   }

// // // // //   const header = (
// // // // //     <View
// // // // //       style={styles.heroSection}
// // // // //       onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
// // // // //     >
// // // // //       <View style={[styles.header]}>
// // // // //         <HeaderLeftBackButton />
// // // // //         <Text
// // // // //           style={[
// // // // //             styles.headerText,
// // // // //             {
// // // // //               backgroundColor: Colors.universal.third,
// // // // //             },
// // // // //           ]}
// // // // //         >
// // // // //           {t("newsArticleScreenTitle").toUpperCase()}
// // // // //         </Text>
// // // // //       </View>

// // // // //       <Text style={[styles.heroTitle, { color: Colors[colorScheme].text }]}>
// // // // //         {article.title}
// // // // //       </Text>

// // // // //       <View style={styles.articleMeta}>
// // // // //         <View style={styles.metaLeft}>
// // // // //           <View
// // // // //             style={[
// // // // //               styles.authorAvatar,
// // // // //               {
// // // // //                 backgroundColor: Colors[colorScheme].contrast,
// // // // //                 borderColor: Colors[colorScheme].border,
// // // // //               },
// // // // //             ]}
// // // // //           >
// // // // //             {article.scholar_type === 1 ? (
// // // // //               <Image
// // // // //                 source={require("@/assets/images/1.png")}
// // // // //                 style={{ width: 50, height: 50, margin: 10 }}
// // // // //                 contentFit="fill"
// // // // //               />
// // // // //             ) : article.scholar_type === 2 ? (
// // // // //               <Image
// // // // //                 source={require("@/assets/images/2.png")}
// // // // //                 style={{ width: 50, height: 50, margin: 10 }}
// // // // //               />
// // // // //             ) : (
// // // // //               <Image
// // // // //                 source={require("@/assets/images/3.png")}
// // // // //                 style={{ width: 70, height: 70, margin: 0 }}
// // // // //               />
// // // // //             )}
// // // // //           </View>
// // // // //           <View>
// // // // //             <Text
// // // // //               style={[styles.authorName, { color: Colors[colorScheme].text }]}
// // // // //             >
// // // // //               {article.author}
// // // // //             </Text>
// // // // //             <Text
// // // // //               style={[
// // // // //                 styles.publishDate,
// // // // //                 { color: Colors.universal.grayedOut },
// // // // //               ]}
// // // // //             >
// // // // //               {formattedDate(article.created_at)}
// // // // //             </Text>
// // // // //           </View>
// // // // //         </View>

// // // // //         <View style={styles.metaRight}>
// // // // //           <View style={styles.readTime}>
// // // // //             <Ionicons
// // // // //               name="time-outline"
// // // // //               size={16}
// // // // //               color={Colors[colorScheme].defaultIcon}
// // // // //             />
// // // // //             <Text
// // // // //               style={[
// // // // //                 styles.readTimeText,
// // // // //                 { color: Colors[colorScheme].defaultIcon },
// // // // //               ]}
// // // // //             >
// // // // //               {article.read_time} min
// // // // //             </Text>
// // // // //           </View>
// // // // //         </View>
// // // // //       </View>

// // // // //       <View
// // // // //         style={[
// // // // //           styles.progressBar,
// // // // //           { backgroundColor: Colors[colorScheme].border },
// // // // //         ]}
// // // // //       ></View>
// // // // //     </View>
// // // // //   );

// // // // //   const data: Row[] = [{ key: "content" }];

// // // // //   const renderItem = ({ item }: ListRenderItemInfo<Row>) => {
// // // // //     return (
// // // // //       <Pressable
// // // // //         style={styles.contentSection}
// // // // //         delayLongPress={350}
// // // // //         onLongPress={handleLongPress}
// // // // //       >
// // // // //         <View style={styles.articleContent}>
// // // // //           <Markdown
// // // // //             style={{
// // // // //               body: {
// // // // //                 color: Colors[colorScheme].text,
// // // // //                 fontSize: fontSize,
// // // // //                 lineHeight: lineHeight * 1.6,
// // // // //                 fontFamily: "System",
// // // // //               },
// // // // //               heading1: {
// // // // //                 color: Colors[colorScheme].text,
// // // // //                 fontSize: fontSize * 1.8,
// // // // //                 fontWeight: "800",
// // // // //                 marginBottom: 20,
// // // // //                 marginTop: 32,
// // // // //                 letterSpacing: -0.5,
// // // // //               },
// // // // //               heading2: {
// // // // //                 color: Colors[colorScheme].text,
// // // // //                 fontSize: fontSize * 1.5,
// // // // //                 fontWeight: "700",
// // // // //                 marginBottom: 16,
// // // // //                 marginTop: 28,
// // // // //                 letterSpacing: -0.3,
// // // // //               },
// // // // //               paragraph: {
// // // // //                 color: Colors[colorScheme].text,
// // // // //                 fontSize: fontSize,
// // // // //                 lineHeight: lineHeight * 1.6,
// // // // //                 marginBottom: 20,
// // // // //               },
// // // // //               strong: { color: Colors[colorScheme].text, fontWeight: "700" },
// // // // //               em: {
// // // // //                 color: Colors[colorScheme].defaultIcon,
// // // // //                 fontStyle: "italic",
// // // // //               },
// // // // //               link: {
// // // // //                 color: Colors[colorScheme].tint,
// // // // //                 textDecorationLine: "underline",
// // // // //               },
// // // // //               blockquote: {
// // // // //                 backgroundColor: "transparent",
// // // // //                 borderLeftColor: Colors[colorScheme].tint,
// // // // //                 borderLeftWidth: 4,
// // // // //                 paddingLeft: 20,
// // // // //                 paddingVertical: 16,
// // // // //                 marginVertical: 24,
// // // // //                 fontStyle: "italic",
// // // // //               },
// // // // //               code_inline: {
// // // // //                 backgroundColor: Colors[colorScheme].tint + "15",
// // // // //                 color: Colors[colorScheme].tint,
// // // // //                 paddingHorizontal: 6,
// // // // //                 paddingVertical: 2,
// // // // //                 borderRadius: 4,
// // // // //                 fontSize: fontSize * 0.9,
// // // // //               },
// // // // //             }}
// // // // //           >
// // // // //             {article.content}
// // // // //           </Markdown>
// // // // //         </View>

// // // // //         {article.source && (
// // // // //           <View
// // // // //             style={[
// // // // //               styles.footerContainer,
// // // // //               {
// // // // //                 borderColor: Colors[colorScheme].border,
// // // // //                 alignItems: isArabicFn() ? "flex-end" : "flex-start",
// // // // //               },
// // // // //             ]}
// // // // //           >
// // // // //             <ThemedText
// // // // //               style={{ fontWeight: "600", fontSize: fontSize, marginBottom: 5 }}
// // // // //             >
// // // // //               {t("source")}
// // // // //             </ThemedText>
// // // // //             <Markdown
// // // // //               style={{
// // // // //                 body: {
// // // // //                   color: Colors[colorScheme].text,
// // // // //                   fontSize: 14,
// // // // //                   fontFamily: "System",
// // // // //                 },
// // // // //                 paragraph: {
// // // // //                   color: Colors[colorScheme].text,
// // // // //                   fontSize: 14,
// // // // //                   textAlign: "justify",
// // // // //                 },
// // // // //                 strong: {
// // // // //                   color: Colors[colorScheme].text,
// // // // //                   fontWeight: "700",
// // // // //                   fontSize: 14,
// // // // //                 },
// // // // //                 em: {
// // // // //                   color: Colors[colorScheme].defaultIcon,
// // // // //                   fontStyle: "italic",
// // // // //                   fontSize: 14,
// // // // //                 },
// // // // //                 link: {
// // // // //                   color: Colors[colorScheme].tint,
// // // // //                   textDecorationLine: "underline",
// // // // //                   fontSize: 14,
// // // // //                 },
// // // // //                 blockquote: {
// // // // //                   backgroundColor: "transparent",
// // // // //                   borderLeftColor: Colors[colorScheme].tint,
// // // // //                   borderLeftWidth: 4,
// // // // //                   paddingLeft: 20,
// // // // //                   paddingVertical: 16,
// // // // //                   marginVertical: 24,
// // // // //                   fontStyle: "italic",
// // // // //                   fontSize: 14,
// // // // //                 },
// // // // //                 code_inline: {
// // // // //                   backgroundColor: Colors[colorScheme].tint + "15",
// // // // //                   color: Colors[colorScheme].tint,
// // // // //                   paddingHorizontal: 6,
// // // // //                   paddingVertical: 2,
// // // // //                   borderRadius: 4,
// // // // //                   fontSize: 14,
// // // // //                 },
// // // // //               }}
// // // // //             >
// // // // //               {article.source}
// // // // //             </Markdown>
// // // // //           </View>
// // // // //         )}
// // // // //       </Pressable>
// // // // //     );
// // // // //   };

// // // // //   return (
// // // // //     <SafeAreaView
// // // // //       ref={containerRef}
// // // // //       onLayout={handleContainerLayout}
// // // // //       style={[
// // // // //         styles.container,
// // // // //         { backgroundColor: Colors[colorScheme].background },
// // // // //       ]}
// // // // //       edges={["top"]}
// // // // //     >
// // // // //       <FlatList
// // // // //         ref={flatListRef}
// // // // //         data={data}
// // // // //         keyExtractor={(item) => item.key}
// // // // //         renderItem={renderItem}
// // // // //         ListHeaderComponent={header}
// // // // //         onScroll={handleScroll}
// // // // //         scrollEventThrottle={16}
// // // // //         showsVerticalScrollIndicator
// // // // //         onContentSizeChange={(_, h) => setContentHeight(h)}
// // // // //         initialNumToRender={1}
// // // // //         windowSize={5}
// // // // //         removeClippedSubviews
// // // // //       />

// // // // //       {/* Overlay */}
// // // // //       <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
// // // // //         {overlayContentY !== null && (
// // // // //           <>
// // // // //             <View
// // // // //               pointerEvents="none"
// // // // //               style={[
// // // // //                 styles.bookmarkLine,
// // // // //                 {
// // // // //                   top: overlayContentY - scrollY,
// // // // //                   backgroundColor: Colors.universal.third,
// // // // //                 },
// // // // //               ]}
// // // // //             />
// // // // //             <View
// // // // //               style={[
// // // // //                 styles.bookmarkChipWrap,
// // // // //                 { top: overlayContentY - scrollY - 14 },
// // // // //               ]}
// // // // //             >
// // // // //               <View
// // // // //                 style={[
// // // // //                   styles.bookmarkChip,
// // // // //                   {
// // // // //                     backgroundColor: Colors.universal.third,
// // // // //                     borderColor: Colors[colorScheme].background,
// // // // //                   },
// // // // //                 ]}
// // // // //               >
// // // // //                 <Ionicons name="bookmark" size={12} color="#fff" />
// // // // //                 <Text style={styles.bookmarkChipText}>{t("bookmark")}</Text>

// // // // //                 <TouchableOpacity
// // // // //                   onPress={clearBookmark}
// // // // //                   style={styles.bookmarkChipBtn}
// // // // //                 >
// // // // //                   <Ionicons name="close" size={14} color="#fff" />
// // // // //                 </TouchableOpacity>
// // // // //               </View>
// // // // //             </View>
// // // // //           </>
// // // // //         )}
// // // // //       </View>

// // // // //       <FontSizePickerModal
// // // // //         visible={showFontSizePickerModal}
// // // // //         onClose={() => setShowFontSizePickerModal(false)}
// // // // //       />

// // // // //       {bookmarkRatio != null && (
// // // // //         <TouchableOpacity style={styles.jumpBtn} onPress={jumpToBookmark}>
// // // // //           <Ionicons name="flag" size={22} color="#fff" />
// // // // //         </TouchableOpacity>
// // // // //       )}

// // // // //       {scrollY > 200 && (
// // // // //         <TouchableOpacity style={styles.arrowUp} onPress={scrollToTop}>
// // // // //           <AntDesign name="up" size={28} color="white" />
// // // // //         </TouchableOpacity>
// // // // //       )}
// // // // //     </SafeAreaView>
// // // // //   );
// // // // // }

// // // // // const styles = StyleSheet.create({
// // // // //   container: { flex: 1 },

// // // // //   heroSection: {
// // // // //     paddingHorizontal: 24,
// // // // //     paddingBottom: 3,
// // // // //     paddingTop: 10,
// // // // //   },
// // // // //   header: {
// // // // //     flexDirection: "row",
// // // // //     alignItems: "center",
// // // // //     justifyContent: "space-between",
// // // // //     marginBottom: 20,
// // // // //   },
// // // // //   headerText: {
// // // // //     color: "white",
// // // // //     fontSize: 12,
// // // // //     fontWeight: "700",
// // // // //     letterSpacing: 1,
// // // // //     paddingHorizontal: 12,
// // // // //     paddingVertical: 6,
// // // // //     borderRadius: 16,
// // // // //   },
// // // // //   heroTitle: {
// // // // //     fontSize: 32,
// // // // //     fontWeight: "900",
// // // // //     lineHeight: 40,
// // // // //     marginBottom: 24,
// // // // //     letterSpacing: -0.8,
// // // // //   },
// // // // //   articleMeta: {
// // // // //     flexDirection: "row",
// // // // //     justifyContent: "space-between",
// // // // //     alignItems: "center",
// // // // //     marginBottom: 32,
// // // // //   },
// // // // //   metaLeft: {
// // // // //     flexDirection: "row",
// // // // //     alignItems: "center",
// // // // //     gap: 12,
// // // // //   },
// // // // //   authorAvatar: {
// // // // //     borderWidth: 1,
// // // // //     borderRadius: 99,
// // // // //     justifyContent: "center",
// // // // //     alignItems: "center",
// // // // //   },
// // // // //   authorName: { fontSize: 16, fontWeight: "600" },
// // // // //   publishDate: { fontSize: 14, marginTop: 2 },
// // // // //   metaRight: {},
// // // // //   readTime: {
// // // // //     flexDirection: "row",
// // // // //     alignItems: "center",
// // // // //     gap: 4,
// // // // //     marginRight: 5,
// // // // //   },
// // // // //   readTimeText: { fontSize: 14, fontWeight: "500" },

// // // // //   actionBar: { flexDirection: "row", gap: 12 },
// // // // //   actionButton: {
// // // // //     flex: 1,
// // // // //     flexDirection: "row",
// // // // //     alignItems: "center",
// // // // //     justifyContent: "center",
// // // // //     gap: 8,
// // // // //     paddingVertical: 12,
// // // // //     borderRadius: 24,
// // // // //     borderWidth: 0.5,
// // // // //   },

// // // // //   contentSection: { flex: 1 },

// // // // //   progressBar: {
// // // // //     height: 2,
// // // // //     marginHorizontal: 15,
// // // // //     borderRadius: 2,
// // // // //     marginTop: 15,
// // // // //     overflow: "hidden",
// // // // //   },
// // // // //   progressFill: { height: "100%", borderRadius: 2 },

// // // // //   articleContent: { paddingHorizontal: 30 },

// // // // //   loadingContainer: {
// // // // //     flex: 1,
// // // // //     justifyContent: "center",
// // // // //     alignItems: "center",
// // // // //     padding: 40,
// // // // //   },
// // // // //   loadingCard: {
// // // // //     alignItems: "center",
// // // // //     gap: 20,
// // // // //     padding: 40,
// // // // //     borderRadius: 20,
// // // // //     shadowOffset: { width: 0, height: 4 },
// // // // //     shadowOpacity: 0.1,
// // // // //     shadowRadius: 12,
// // // // //     elevation: 4,
// // // // //   },
// // // // //   errorContainer: {
// // // // //     justifyContent: "center",
// // // // //     alignItems: "center",
// // // // //     padding: 40,
// // // // //   },
// // // // //   errorTitle: {
// // // // //     fontSize: 24,
// // // // //     fontWeight: "700",
// // // // //     marginTop: 20,
// // // // //     marginBottom: 8,
// // // // //     textAlign: "center",
// // // // //   },
// // // // //   errorSubtitle: { fontSize: 16, textAlign: "center", lineHeight: 24 },

// // // // //   footerContainer: {
// // // // //     flexDirection: "column",
// // // // //     borderTopWidth: 0.5,
// // // // //     paddingTop: 20,
// // // // //     paddingBottom: 40,
// // // // //     paddingHorizontal: 24,
// // // // //   },

// // // // //   // Bookmark overlay
// // // // //   bookmarkLine: {
// // // // //     position: "absolute",
// // // // //     left: 0,
// // // // //     right: 0,
// // // // //     height: 2,
// // // // //     opacity: 0.9,
// // // // //   },
// // // // //   bookmarkChipWrap: {
// // // // //     position: "absolute",
// // // // //     right: 10,
// // // // //   },
// // // // //   bookmarkChip: {
// // // // //     flexDirection: "row",
// // // // //     alignItems: "center",
// // // // //     gap: 6,
// // // // //     paddingHorizontal: 10,
// // // // //     paddingVertical: 6,
// // // // //     borderRadius: 16,
// // // // //     borderWidth: 1,
// // // // //     shadowColor: "#000",
// // // // //     shadowOpacity: 0.1,
// // // // //     shadowOffset: { width: 0, height: 2 },
// // // // //     shadowRadius: 4,
// // // // //     elevation: 2,
// // // // //   },
// // // // //   bookmarkChipText: {
// // // // //     color: "#fff",
// // // // //     fontSize: 12,
// // // // //     fontWeight: "700",
// // // // //   },
// // // // //   bookmarkChipBtn: {
// // // // //     paddingHorizontal: 4,
// // // // //     paddingVertical: 2,
// // // // //   },

// // // // //   // Quick jump floating button
// // // // //   jumpBtn: {
// // // // //     position: "absolute",
// // // // //     bottom: 28,
// // // // //     right: 24,
// // // // //     width: 48,
// // // // //     height: 48,
// // // // //     borderRadius: 24,
// // // // //     alignItems: "center",
// // // // //     justifyContent: "center",
// // // // //     backgroundColor: Colors.universal.third,
// // // // //     shadowColor: "#000",
// // // // //     shadowOpacity: 0.2,
// // // // //     shadowOffset: { width: 0, height: 3 },
// // // // //     shadowRadius: 6,
// // // // //     elevation: 4,
// // // // //   },

// // // // //   arrowUp: {
// // // // //     position: "absolute",
// // // // //     bottom: "60%",
// // // // //     right: "3%",
// // // // //     borderWidth: 2.5,
// // // // //     borderRadius: 99,
// // // // //     padding: 5,
// // // // //     backgroundColor: Colors.universal.primary,
// // // // //     borderColor: Colors.universal.primary,
// // // // //   },
// // // // // });

// // // // // ! Mit lesezeichen zeit unten und viel Ram verbrauch
// // // // import { Colors } from "@/constants/Colors";
// // // // import { LanguageCode, NewsArticlesType } from "@/constants/Types";
// // // // import { useLanguage } from "@/contexts/LanguageContext";
// // // // import { useNewsArticles } from "@/hooks/useNewsArticles";
// // // // import { useFontSizeStore } from "@/stores/fontSizeStore";
// // // // import { useRefreshFavorites } from "@/stores/refreshFavoriteStore";
// // // // import {
// // // //   isNewsArticleFavorited,
// // // //   toggleNewsArticleFavorite,
// // // // } from "@/utils/favorites";
// // // // import { formattedDate } from "@/utils/formate";
// // // // import AntDesign from "@expo/vector-icons/AntDesign";
// // // // import Ionicons from "@expo/vector-icons/Ionicons";
// // // // import AsyncStorage from "@react-native-async-storage/async-storage";
// // // // import { Image } from "expo-image";
// // // // import React, {
// // // //   useCallback,
// // // //   useEffect,
// // // //   useMemo,
// // // //   useRef,
// // // //   useState,
// // // // } from "react";
// // // // import { useTranslation } from "react-i18next";
// // // // import {
// // // //   Pressable,
// // // //   StyleSheet,
// // // //   Text,
// // // //   TouchableOpacity,
// // // //   useColorScheme,
// // // //   View,
// // // //   FlatList,
// // // //   ListRenderItemInfo,
// // // //   NativeSyntheticEvent,
// // // //   NativeScrollEvent,
// // // //   Alert,
// // // //   type GestureResponderEvent,
// // // // } from "react-native";
// // // // import Markdown from "react-native-markdown-display";
// // // // import { SafeAreaView } from "react-native-safe-area-context";
// // // // import FontSizePickerModal from "./FontSizePickerModal";
// // // // import HeaderLeftBackButton from "./HeaderLeftBackButton";
// // // // import { LoadingIndicator } from "./LoadingIndicator";
// // // // import { ThemedText } from "./ThemedText";
// // // // import { ThemedView } from "./ThemedView";
// // // // import i18n from "@/utils/i18n";
// // // // import ArrowUp from "./ArrowUp";

// // // // type Row = { key: "content" };
// // // // type SavedBookmark = { ratio: number; addedAt: number };

// // // // export default function NewsArticleDetailScreen({
// // // //   articleId,
// // // // }: {
// // // //   articleId: number;
// // // // }) {
// // // //   const { fontSize, lineHeight } = useFontSizeStore();
// // // //   const colorScheme = useColorScheme() ?? "light";
// // // //   const { t } = useTranslation();
// // // //   const [article, setArticle] = useState<NewsArticlesType | null>(null);
// // // //   const [isLoading, setIsLoading] = useState(true);
// // // //   const [error, setError] = useState<string | null>(null);

// // // //   const [showFontSizePickerModal, setShowFontSizePickerModal] = useState(false);
// // // //   const [isFavorite, setIsFavorite] = useState(false);

// // // //   // scroll/progress
// // // //   const [scrollY, setScrollY] = useState(0);
// // // //   const [progress, setProgress] = useState(0);

// // // //   // layout + coords conversion
// // // //   const containerRef = useRef<View>(null);
// // // //   const [containerTop, setContainerTop] = useState(0);
// // // //   const [containerLeft, setContainerLeft] = useState(0);
// // // //   const [contentHeight, setContentHeight] = useState(0);
// // // //   const [headerHeight, setHeaderHeight] = useState(0);

// // // //   // overlay position (in content coords)
// // // //   const [overlayContentY, setOverlayContentY] = useState<number | null>(null);

// // // //   // persisted bookmark ratio (excludes header)
// // // //   const [bookmarkRatio, setBookmarkRatio] = useState<number | null>(null);

// // // //   const { triggerRefreshFavorites } = useRefreshFavorites();
// // // //   const { language, isArabic } = useLanguage();
// // // //   const rtl = isArabic();
// // // //   const lang = (language ?? "de") as LanguageCode;
// // // //   const { fetchNewsArticleById } = useNewsArticles(lang);
// // // //   const bookmarkKey = (articleId: number) =>
// // // //     `bookmark:newsArticle:${articleId}:${lang}`;

// // // //   const flatListRef = useRef<FlatList<Row>>(null);

// // // //   const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
// // // //   const effectiveScrollableHeight = useMemo(
// // // //     () => Math.max(1, contentHeight - headerHeight),
// // // //     [contentHeight, headerHeight]
// // // //   );

// // // //   const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
// // // //     const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
// // // //     setScrollY(contentOffset.y);

// // // //     const total = Math.max(1, contentSize.height - layoutMeasurement.height);
// // // //     setProgress(clamp01(contentOffset.y / total));
// // // //   };

// // // //   const scrollToTop = () => {
// // // //     flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
// // // //   };

// // // //   // Load article
// // // //   useEffect(() => {
// // // //     if (!articleId) {
// // // //       setError(t("errorLoadingArticle"));
// // // //       setIsLoading(false);
// // // //       return;
// // // //     }
// // // //     (async () => {
// // // //       setIsLoading(true);
// // // //       setError(null);
// // // //       try {
// // // //         const fetchedArticle = await fetchNewsArticleById(articleId);
// // // //         if (fetchedArticle) setArticle(fetchedArticle);
// // // //         else setError(t("errorLoadingArticle"));
// // // //       } catch (err: any) {
// // // //         console.error("Error loading news article:", err);
// // // //         setError(err?.message || t("errorLoadingArticle"));
// // // //       } finally {
// // // //         setIsLoading(false);
// // // //       }
// // // //     })();
// // // //   }, [articleId]);

// // // //   // Favorite state
// // // //   useEffect(() => {
// // // //     (async () => {
// // // //       try {
// // // //         setIsFavorite(await isNewsArticleFavorited(articleId));
// // // //       } catch {
// // // //         // ignore
// // // //       }
// // // //     })();
// // // //   }, [articleId]);

// // // //   // Measure container for page->local conversion
// // // //   const handleContainerLayout = () => {
// // // //     containerRef.current?.measureInWindow?.((x, y) => {
// // // //       setContainerLeft(x ?? 0);
// // // //       setContainerTop(y ?? 0);
// // // //     });
// // // //   };

// // // //   // Load bookmark
// // // //   useEffect(() => {
// // // //     (async () => {
// // // //       try {
// // // //         const raw = await AsyncStorage.getItem(bookmarkKey(articleId));
// // // //         if (!raw) return;
// // // //         const saved: SavedBookmark = JSON.parse(raw);
// // // //         if (typeof saved?.ratio === "number") {
// // // //           setBookmarkRatio(clamp01(saved.ratio));
// // // //         }
// // // //       } catch (e) {
// // // //         console.log("Failed to load bookmark", e);
// // // //       }
// // // //     })();
// // // //   }, [articleId]);

// // // //   // Recompute overlay Y from ratio when sizes/ratio change
// // // //   useEffect(() => {
// // // //     if (bookmarkRatio == null) return;
// // // //     const y = headerHeight + bookmarkRatio * effectiveScrollableHeight;
// // // //     setOverlayContentY(y);
// // // //   }, [bookmarkRatio, headerHeight, effectiveScrollableHeight]);

// // // //   const saveBookmark = useCallback(
// // // //     async (contentY: number) => {
// // // //       const ratio = clamp01(
// // // //         (contentY - headerHeight) / effectiveScrollableHeight
// // // //       );
// // // //       setBookmarkRatio(ratio);
// // // //       setOverlayContentY(contentY);
// // // //       try {
// // // //         const payload: SavedBookmark = { ratio, addedAt: Date.now() };
// // // //         await AsyncStorage.setItem(
// // // //           bookmarkKey(articleId),
// // // //           JSON.stringify(payload)
// // // //         );
// // // //       } catch (e) {
// // // //         console.log("Failed to save bookmark", e);
// // // //       }
// // // //     },
// // // //     [articleId, headerHeight, effectiveScrollableHeight]
// // // //   );

// // // //   const clearBookmark = useCallback(() => {
// // // //     Alert.alert(
// // // //       t("remove", "Remove"),
// // // //       t("bookmarkRemove", "Remove this bookmark?"),
// // // //       [
// // // //         { text: t("cancel", "Cancel"), style: "cancel" },
// // // //         {
// // // //           text: t("remove", "Remove"),
// // // //           style: "destructive",
// // // //           onPress: async () => {
// // // //             try {
// // // //               setBookmarkRatio(null);
// // // //               setOverlayContentY(null);
// // // //               await AsyncStorage.removeItem(bookmarkKey(articleId));
// // // //             } catch (e) {
// // // //               console.log("Failed to clear bookmark", e);
// // // //             }
// // // //           },
// // // //         },
// // // //       ],
// // // //       { cancelable: true }
// // // //     );
// // // //   }, [articleId, t]);

// // // //   const jumpToBookmark = useCallback(() => {
// // // //     if (overlayContentY == null) return;
// // // //     const target = Math.max(overlayContentY - 200, 0);
// // // //     flatListRef.current?.scrollToOffset({ offset: target, animated: true });
// // // //   }, [overlayContentY]);

// // // //   // CONFIRM before replacing
// // // //   const handleLongPress = useCallback(
// // // //     (e: GestureResponderEvent) => {
// // // //       const { pageY } = e.nativeEvent as any;
// // // //       const contentY = pageY - containerTop + scrollY;

// // // //       if (bookmarkRatio != null) {
// // // //         Alert.alert(
// // // //           t("replace"),
// // // //           t("bookmarkReplaceQuestion"),
// // // //           [
// // // //             { text: t("cancel"), style: "cancel" },
// // // //             {
// // // //               text: t("replace", "Replace"),
// // // //               style: "destructive",
// // // //               onPress: () => saveBookmark(contentY),
// // // //             },
// // // //           ],
// // // //           { cancelable: true }
// // // //         );
// // // //         return;
// // // //       }
// // // //       // No previous bookmark
// // // //       saveBookmark(contentY);
// // // //     },
// // // //     [bookmarkRatio, containerTop, scrollY, saveBookmark, t]
// // // //   );

// // // //   const { isArabic: isArabicFn } = useLanguage();
// // // //   const rtlFN = isArabicFn();
// // // //   if (isLoading) {
// // // //     return (
// // // //       <ThemedView style={[styles.container]}>
// // // //         <View style={styles.loadingContainer}>
// // // //           <View
// // // //             style={[
// // // //               styles.loadingCard,
// // // //               { backgroundColor: Colors[colorScheme].background },
// // // //             ]}
// // // //           >
// // // //             <LoadingIndicator size="large" />
// // // //           </View>
// // // //         </View>
// // // //       </ThemedView>
// // // //     );
// // // //   }

// // // //   if (error || !article) {
// // // //     return (
// // // //       <View
// // // //         style={[
// // // //           styles.container,
// // // //           { backgroundColor: Colors[colorScheme].background },
// // // //         ]}
// // // //       >
// // // //         <View style={styles.errorContainer}>
// // // //           <Ionicons
// // // //             name="newspaper-outline"
// // // //             size={80}
// // // //             color={Colors[colorScheme].defaultIcon}
// // // //           />
// // // //         </View>
// // // //         <Text style={[styles.errorTitle, { color: Colors[colorScheme].text }]}>
// // // //           {t("error")}
// // // //         </Text>
// // // //         <Text
// // // //           style={[
// // // //             styles.errorSubtitle,
// // // //             { color: Colors[colorScheme].defaultIcon },
// // // //           ]}
// // // //         >
// // // //           {t("errorLoadingArticle")}
// // // //         </Text>
// // // //         <Text
// // // //           style={[
// // // //             styles.errorSubtitle,
// // // //             { color: Colors[colorScheme].defaultIcon },
// // // //           ]}
// // // //         >
// // // //           {error}
// // // //         </Text>
// // // //       </View>
// // // //     );
// // // //   }

// // // //   const header = (
// // // //     <View
// // // //       style={styles.heroSection}
// // // //       onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
// // // //     >
// // // //       <View style={[styles.header]}>
// // // //         <HeaderLeftBackButton />
// // // //         <Text
// // // //           style={[
// // // //             styles.headerText,
// // // //             {
// // // //               backgroundColor: Colors.universal.third,
// // // //             },
// // // //           ]}
// // // //         >
// // // //           {t("newsArticleScreenTitle").toUpperCase()}
// // // //         </Text>
// // // //       </View>

// // // //       <Text style={[styles.heroTitle, { color: Colors[colorScheme].text }]}>
// // // //         {article.title}
// // // //       </Text>

// // // //       <View style={styles.articleMetaContainer}>
// // // //         <View style={styles.articleMetaSupcontainer}>
// // // //           <View
// // // //             style={[
// // // //               styles.authorAvatar,
// // // //               {
// // // //                 backgroundColor: Colors[colorScheme].contrast,
// // // //                 borderColor: Colors[colorScheme].border,
// // // //               },
// // // //             ]}
// // // //           >
// // // //             {article.scholar_type === 1 ? (
// // // //               <Image
// // // //                 source={require("@/assets/images/1.png")}
// // // //                 style={{ width: 50, height: 50, margin: 10 }}
// // // //                 contentFit="fill"
// // // //               />
// // // //             ) : article.scholar_type === 2 ? (
// // // //               <Image
// // // //                 source={require("@/assets/images/2.png")}
// // // //                 style={{ width: 50, height: 50, margin: 10 }}
// // // //               />
// // // //             ) : article.scholar_type === 3 ? (
// // // //               <Image
// // // //                 source={require("@/assets/images/3.png")}
// // // //                 style={{ width: 70, height: 70, margin: 0 }}
// // // //               />
// // // //             ) : null}
// // // //           </View>
// // // //           <View style={styles.nameDateTime}>
// // // //             <Text
// // // //               style={[styles.authorName, { color: Colors[colorScheme].text }]}
// // // //             >
// // // //               {article.author}
// // // //             </Text>
// // // //             <View style={styles.nameDateTimeSubcontainer}>
// // // //               <Text
// // // //                 style={[
// // // //                   styles.publishDate,
// // // //                   { color: Colors.universal.grayedOut },
// // // //                 ]}
// // // //               >
// // // //                 {formattedDate(article.created_at)}
// // // //               </Text>
// // // //               <View style={styles.readTime}>
// // // //                 <Ionicons
// // // //                   name="time-outline"
// // // //                   size={16}
// // // //                   color={Colors[colorScheme].defaultIcon}
// // // //                 />
// // // //                 <Text
// // // //                   style={[
// // // //                     styles.readTimeText,
// // // //                     { color: Colors[colorScheme].defaultIcon },
// // // //                   ]}
// // // //                 >
// // // //                   {article.read_time} min
// // // //                 </Text>
// // // //               </View>
// // // //             </View>
// // // //           </View>
// // // //         </View>
// // // //       </View>
// // // //       <View
// // // //         style={[
// // // //           styles.progressBar,
// // // //           { backgroundColor: Colors[colorScheme].border },
// // // //         ]}
// // // //       ></View>
// // // //     </View>
// // // //   );

// // // //   const data: Row[] = [{ key: "content" }];

// // // //   const renderItem = ({ item }: ListRenderItemInfo<Row>) => {
// // // //     return (
// // // //       <Pressable
// // // //         style={styles.contentSection}
// // // //         delayLongPress={350}
// // // //         onLongPress={handleLongPress}
// // // //       >
// // // //         <View style={styles.articleContent}>
// // // //           <Markdown
// // // //             style={{
// // // //               body: {
// // // //                 color: Colors[colorScheme].text,
// // // //                 fontSize: fontSize,
// // // //                 lineHeight: lineHeight * 1.6,
// // // //                 fontFamily: "System",
// // // //               },
// // // //               heading1: {
// // // //                 color: Colors[colorScheme].text,
// // // //                 fontSize: fontSize * 1.8,
// // // //                 fontWeight: "800",
// // // //                 marginBottom: 20,
// // // //                 marginTop: 32,
// // // //                 letterSpacing: -0.5,
// // // //               },
// // // //               heading2: {
// // // //                 color: Colors[colorScheme].text,
// // // //                 fontSize: fontSize * 1.5,
// // // //                 fontWeight: "700",
// // // //                 marginBottom: 16,
// // // //                 marginTop: 28,
// // // //                 letterSpacing: -0.3,
// // // //               },
// // // //               paragraph: {
// // // //                 color: Colors[colorScheme].text,
// // // //                 fontSize: fontSize,
// // // //                 lineHeight: lineHeight * 1.6,
// // // //                 marginBottom: 20,
// // // //               },
// // // //               strong: { color: Colors[colorScheme].text, fontWeight: "700" },
// // // //               em: {
// // // //                 color: Colors[colorScheme].defaultIcon,
// // // //                 fontStyle: "italic",
// // // //               },
// // // //               link: {
// // // //                 color: Colors[colorScheme].tint,
// // // //                 textDecorationLine: "underline",
// // // //               },
// // // //               blockquote: {
// // // //                 backgroundColor: "transparent",
// // // //                 borderLeftColor: Colors[colorScheme].tint,
// // // //                 borderLeftWidth: 4,
// // // //                 paddingLeft: 20,
// // // //                 paddingVertical: 16,
// // // //                 marginVertical: 24,
// // // //                 fontStyle: "italic",
// // // //               },
// // // //               code_inline: {
// // // //                 backgroundColor: Colors[colorScheme].tint + "15",
// // // //                 color: Colors[colorScheme].tint,
// // // //                 paddingHorizontal: 6,
// // // //                 paddingVertical: 2,
// // // //                 borderRadius: 4,
// // // //                 fontSize: fontSize * 0.9,
// // // //               },
// // // //             }}
// // // //           >
// // // //             {article.content}
// // // //           </Markdown>
// // // //         </View>

// // // //         {article.source && (
// // // //           <View
// // // //             style={[
// // // //               styles.footerContainer,
// // // //               {
// // // //                 borderColor: Colors[colorScheme].border,
// // // //                 alignItems: rtlFN ? "flex-end" : "flex-start",
// // // //               },
// // // //             ]}
// // // //           >
// // // //             <ThemedText
// // // //               style={{ fontWeight: "600", fontSize: fontSize, marginBottom: 5 }}
// // // //             >
// // // //               {t("source")}
// // // //             </ThemedText>
// // // //             <Markdown
// // // //               style={{
// // // //                 body: {
// // // //                   color: Colors[colorScheme].text,
// // // //                   fontSize: 14,
// // // //                   fontFamily: "System",
// // // //                 },
// // // //                 paragraph: {
// // // //                   color: Colors[colorScheme].text,
// // // //                   fontSize: 14,
// // // //                   textAlign: "justify",
// // // //                 },
// // // //                 strong: {
// // // //                   color: Colors[colorScheme].text,
// // // //                   fontWeight: "700",
// // // //                   fontSize: 14,
// // // //                 },
// // // //                 em: {
// // // //                   color: Colors[colorScheme].defaultIcon,
// // // //                   fontStyle: "italic",
// // // //                   fontSize: 14,
// // // //                 },
// // // //                 link: {
// // // //                   color: Colors[colorScheme].tint,
// // // //                   textDecorationLine: "underline",
// // // //                   fontSize: 14,
// // // //                 },
// // // //                 blockquote: {
// // // //                   backgroundColor: "transparent",
// // // //                   borderLeftColor: Colors[colorScheme].tint,
// // // //                   borderLeftWidth: 4,
// // // //                   paddingLeft: 20,
// // // //                   paddingVertical: 16,
// // // //                   marginVertical: 24,
// // // //                   fontStyle: "italic",
// // // //                   fontSize: 14,
// // // //                 },
// // // //                 code_inline: {
// // // //                   backgroundColor: Colors[colorScheme].tint + "15",
// // // //                   color: Colors[colorScheme].tint,
// // // //                   paddingHorizontal: 6,
// // // //                   paddingVertical: 2,
// // // //                   borderRadius: 4,
// // // //                   fontSize: 14,
// // // //                 },
// // // //               }}
// // // //             >
// // // //               {article.source}
// // // //             </Markdown>
// // // //           </View>
// // // //         )}
// // // //       </Pressable>
// // // //     );
// // // //   };

// // // //   return (
// // // //     <SafeAreaView
// // // //       ref={containerRef}
// // // //       onLayout={handleContainerLayout}
// // // //       style={[
// // // //         styles.container,
// // // //         { backgroundColor: Colors[colorScheme].background },
// // // //       ]}
// // // //       edges={["top"]}
// // // //     >
// // // //       <FlatList
// // // //         ref={flatListRef}
// // // //         data={data}
// // // //         keyExtractor={(item) => item.key}
// // // //         renderItem={renderItem}
// // // //         ListHeaderComponent={header}
// // // //         onScroll={handleScroll}
// // // //         scrollEventThrottle={16}
// // // //         showsVerticalScrollIndicator
// // // //         onContentSizeChange={(_, h) => setContentHeight(h)}
// // // //         initialNumToRender={1}
// // // //         windowSize={5}
// // // //         removeClippedSubviews
// // // //       />

// // // //       {/* Overlay */}
// // // //       <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
// // // //         {overlayContentY !== null && (
// // // //           <>
// // // //             <View
// // // //               pointerEvents="none"
// // // //               style={[
// // // //                 styles.bookmarkLine,
// // // //                 {
// // // //                   top: overlayContentY - scrollY,
// // // //                   backgroundColor: Colors.universal.third,
// // // //                 },
// // // //               ]}
// // // //             />
// // // //             <View
// // // //               style={[
// // // //                 styles.bookmarkChipWrap,
// // // //                 { top: overlayContentY - scrollY - 14 },
// // // //               ]}
// // // //             >
// // // //               <View
// // // //                 style={[
// // // //                   styles.bookmarkChip,
// // // //                   {
// // // //                     backgroundColor: Colors.universal.third,
// // // //                     borderColor: Colors[colorScheme].background,
// // // //                   },
// // // //                 ]}
// // // //               >
// // // //                 <Ionicons name="bookmark" size={12} color="#fff" />
// // // //                 <Text style={styles.bookmarkChipText}>{t("bookmark")}</Text>

// // // //                 <TouchableOpacity
// // // //                   onPress={clearBookmark}
// // // //                   style={styles.bookmarkChipBtn}
// // // //                 >
// // // //                   <Ionicons name="close" size={14} color="#fff" />
// // // //                 </TouchableOpacity>
// // // //               </View>
// // // //             </View>
// // // //           </>
// // // //         )}
// // // //       </View>

// // // //       <FontSizePickerModal
// // // //         visible={showFontSizePickerModal}
// // // //         onClose={() => setShowFontSizePickerModal(false)}
// // // //       />

// // // //       {bookmarkRatio != null && (
// // // //         <TouchableOpacity style={styles.jumpBtn} onPress={jumpToBookmark}>
// // // //           <Ionicons name="flag" size={22} color="#fff" />
// // // //         </TouchableOpacity>
// // // //       )}

// // // //       {scrollY > 200 && <ArrowUp scrollToTop={scrollToTop} />}
// // // //     </SafeAreaView>
// // // //   );
// // // // }

// // // // const styles = StyleSheet.create({
// // // //   container: { flex: 1 },

// // // //   heroSection: {
// // // //     paddingHorizontal: 24,
// // // //     paddingBottom: 3,
// // // //     paddingTop: 10,
// // // //   },
// // // //   header: {
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     justifyContent: "space-between",
// // // //     marginBottom: 20,
// // // //   },
// // // //   headerText: {
// // // //     color: "white",
// // // //     fontSize: 12,
// // // //     fontWeight: "700",
// // // //     letterSpacing: 1,
// // // //     paddingHorizontal: 12,
// // // //     paddingVertical: 6,
// // // //     borderRadius: 16,
// // // //   },
// // // //   heroTitle: {
// // // //     fontSize: 32,
// // // //     fontWeight: "900",
// // // //     lineHeight: 40,
// // // //     marginBottom: 24,
// // // //     letterSpacing: -0.8,
// // // //   },
// // // //   articleMetaContainer: {
// // // //     flexDirection: "column",
// // // //     marginBottom: 32,
// // // //   },
// // // //   articleMetaSupcontainer: {
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     gap: 12,
// // // //   },
// // // //   nameDateTime: {
// // // //     flexDirection: "column",
// // // //     gap: 2,
// // // //   },
// // // //   nameDateTimeSubcontainer: {
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     gap: 15,
// // // //   },
// // // //   authorAvatar: {
// // // //     borderWidth: 1,
// // // //     borderRadius: 99,
// // // //     justifyContent: "center",
// // // //     alignItems: "center",
// // // //   },
// // // //   authorName: {
// // // //     fontSize: 16,
// // // //     fontWeight: "600",
// // // //   },
// // // //   publishDate: {
// // // //     fontSize: 14,
// // // //     marginTop: 5,
// // // //   },
// // // //   metaRight: {},
// // // //   readTime: {
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     gap: 4,
// // // //     marginRight: 5,
// // // //     marginTop: 5,
// // // //   },
// // // //   readTimeText: {
// // // //     fontSize: 14,
// // // //     fontWeight: "500",
// // // //   },

// // // //   actionBar: {
// // // //     flexDirection: "row",
// // // //     gap: 12,
// // // //   },
// // // //   actionButton: {
// // // //     flex: 1,
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     justifyContent: "center",
// // // //     gap: 8,
// // // //     paddingVertical: 12,
// // // //     borderRadius: 24,
// // // //     borderWidth: 0.5,
// // // //   },

// // // //   contentSection: { flex: 1 },

// // // //   progressBar: {
// // // //     height: 2,
// // // //     marginHorizontal: 15,
// // // //     borderRadius: 2,
// // // //     marginTop: 15,
// // // //     overflow: "hidden",
// // // //   },
// // // //   progressFill: { height: "100%", borderRadius: 2 },

// // // //   articleContent: { paddingHorizontal: 30 },

// // // //   loadingContainer: {
// // // //     flex: 1,
// // // //     justifyContent: "center",
// // // //     alignItems: "center",
// // // //     padding: 40,
// // // //   },
// // // //   loadingCard: {
// // // //     alignItems: "center",
// // // //     gap: 20,
// // // //     padding: 40,
// // // //     borderRadius: 20,
// // // //     shadowOffset: { width: 0, height: 4 },
// // // //     shadowOpacity: 0.1,
// // // //     shadowRadius: 12,
// // // //     elevation: 4,
// // // //   },
// // // //   errorContainer: {
// // // //     justifyContent: "center",
// // // //     alignItems: "center",
// // // //     padding: 40,
// // // //   },
// // // //   errorTitle: {
// // // //     fontSize: 24,
// // // //     fontWeight: "700",
// // // //     marginTop: 20,
// // // //     marginBottom: 8,
// // // //     textAlign: "center",
// // // //   },
// // // //   errorSubtitle: { fontSize: 16, textAlign: "center", lineHeight: 24 },

// // // //   footerContainer: {
// // // //     flexDirection: "column",
// // // //     borderTopWidth: 0.5,
// // // //     paddingTop: 20,
// // // //     paddingBottom: 40,
// // // //     paddingHorizontal: 24,
// // // //   },

// // // //   // Bookmark overlay
// // // //   bookmarkLine: {
// // // //     position: "absolute",
// // // //     left: 0,
// // // //     right: 0,
// // // //     height: 2,
// // // //     opacity: 0.9,
// // // //   },
// // // //   bookmarkChipWrap: {
// // // //     position: "absolute",
// // // //     right: 10,
// // // //   },
// // // //   bookmarkChip: {
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     gap: 6,
// // // //     paddingHorizontal: 10,
// // // //     paddingVertical: 6,
// // // //     borderRadius: 16,
// // // //     borderWidth: 1,
// // // //     shadowColor: "#000",
// // // //     shadowOpacity: 0.1,
// // // //     shadowOffset: { width: 0, height: 2 },
// // // //     shadowRadius: 4,
// // // //     elevation: 2,
// // // //   },
// // // //   bookmarkChipText: {
// // // //     color: "#fff",
// // // //     fontSize: 12,
// // // //     fontWeight: "700",
// // // //   },
// // // //   bookmarkChipBtn: {
// // // //     paddingHorizontal: 4,
// // // //     paddingVertical: 2,
// // // //   },

// // // //   // Quick jump floating button
// // // //   jumpBtn: {
// // // //     position: "absolute",
// // // //     bottom: 28,
// // // //     right: 24,
// // // //     width: 48,
// // // //     height: 48,
// // // //     borderRadius: 24,
// // // //     alignItems: "center",
// // // //     justifyContent: "center",
// // // //     backgroundColor: Colors.universal.third,
// // // //     shadowColor: "#000",
// // // //     shadowOpacity: 0.2,
// // // //     shadowOffset: { width: 0, height: 3 },
// // // //     shadowRadius: 6,
// // // //     elevation: 4,
// // // //   },

// // // //   arrowUp: {
// // // //     position: "absolute",
// // // //     bottom: "60%",
// // // //     right: "3%",
// // // //     borderWidth: 2.5,
// // // //     borderRadius: 99,
// // // //     padding: 5,
// // // //     backgroundColor: Colors.universal.primary,
// // // //     borderColor: Colors.universal.primary,
// // // //   },
// // // // });

// // // //! With moving flag

// // // import { Colors } from "@/constants/Colors";
// // // import { LanguageCode, NewsArticlesType } from "@/constants/Types";
// // // import { useLanguage } from "@/contexts/LanguageContext";
// // // import { useNewsArticles } from "@/hooks/useNewsArticles";
// // // import { useFontSizeStore } from "@/stores/fontSizeStore";
// // // import { useRefreshFavorites } from "@/stores/refreshFavoriteStore";
// // // import {
// // //   isNewsArticleFavorited,
// // //   toggleNewsArticleFavorite,
// // // } from "@/utils/favorites";
// // // import { formattedDate } from "@/utils/formate";
// // // import Ionicons from "@expo/vector-icons/Ionicons";
// // // import AsyncStorage from "@react-native-async-storage/async-storage";
// // // import { Image } from "expo-image";
// // // import React, {
// // //   useCallback,
// // //   useEffect,
// // //   useMemo,
// // //   useRef,
// // //   useState,
// // // } from "react";
// // // import { useTranslation } from "react-i18next";
// // // import {
// // //   Pressable,
// // //   StyleSheet,
// // //   Text,
// // //   TouchableOpacity,
// // //   useColorScheme,
// // //   View,
// // //   FlatList,
// // //   ListRenderItemInfo,
// // //   NativeSyntheticEvent,
// // //   NativeScrollEvent,
// // //   Alert,
// // //   Linking,
// // //   type GestureResponderEvent,
// // // } from "react-native";
// // // import Markdown from "react-native-markdown-display";
// // // import { SafeAreaView } from "react-native-safe-area-context";
// // // import FontSizePickerModal from "./FontSizePickerModal";
// // // import HeaderLeftBackButton from "./HeaderLeftBackButton";
// // // import { LoadingIndicator } from "./LoadingIndicator";
// // // import { ThemedText } from "./ThemedText";
// // // import { ThemedView } from "./ThemedView";
// // // import ArrowUp from "./ArrowUp";

// // // type Row = { key: "content" };
// // // type SavedBookmark = { ratio: number; addedAt: number };

// // // export default function NewsArticleDetailScreen({
// // //   articleId,
// // // }: {
// // //   articleId: number;
// // // }) {
// // //   const { fontSize, lineHeight } = useFontSizeStore();
// // //   const colorScheme = useColorScheme() ?? "light";
// // //   const { t } = useTranslation();

// // //   const [article, setArticle] = useState<NewsArticlesType | null>(null);
// // //   const [isLoading, setIsLoading] = useState(true);
// // //   const [error, setError] = useState<string | null>(null);

// // //   const [showFontSizePickerModal, setShowFontSizePickerModal] = useState(false);
// // //   const [isFavorite, setIsFavorite] = useState(false);

// // //   // scroll/progress (throttled)
// // //   const [scrollY, setScrollY] = useState(0);
// // //   const lastTickRef = useRef(0);

// // //   // layout + coords conversion
// // //   const containerRef = useRef<View>(null);
// // //   const [containerTop, setContainerTop] = useState(0);
// // //   const [containerLeft, setContainerLeft] = useState(0);
// // //   const [contentHeight, setContentHeight] = useState(0);
// // //   const [headerHeight, setHeaderHeight] = useState(0);

// // //   // overlay position (in content coords)
// // //   const [overlayContentY, setOverlayContentY] = useState<number | null>(null);

// // //   // persisted bookmark ratio (excludes header)
// // //   const [bookmarkRatio, setBookmarkRatio] = useState<number | null>(null);

// // //   const { triggerRefreshFavorites } = useRefreshFavorites();
// // //   const { lang, rtl } = useLanguage();
// // //   const { fetchNewsArticleById } = useNewsArticles(lang);
// // //   const bookmarkKey = (id: number) => `bookmark:newsArticle:${id}:${lang}`;

// // //   const flatListRef = useRef<FlatList<Row>>(null);

// // //   const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
// // //   const effectiveScrollableHeight = useMemo(
// // //     () => Math.max(1, contentHeight - headerHeight),
// // //     [contentHeight, headerHeight]
// // //   );

// // //   const handleScroll = useCallback(
// // //     (e: NativeSyntheticEvent<NativeScrollEvent>) => {
// // //       const now = Date.now();
// // //       if (now - lastTickRef.current < 120) return;
// // //       lastTickRef.current = now;
// // //       const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
// // //       setScrollY(contentOffset.y);
// // //     },
// // //     []
// // //   );

// // //   const scrollToTop = useCallback(() => {
// // //     flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
// // //   }, []);

// // //   // Load article
// // //   useEffect(() => {
// // //     let alive = true;
// // //     (async () => {
// // //       if (!articleId) {
// // //         if (alive) {
// // //           setError(t("errorLoadingArticle"));
// // //           setIsLoading(false);
// // //         }
// // //         return;
// // //       }
// // //       setIsLoading(true);
// // //       setError(null);
// // //       try {
// // //         const fetchedArticle = await fetchNewsArticleById(articleId);
// // //         if (!alive) return;
// // //         if (fetchedArticle) setArticle(fetchedArticle);
// // //         else setError(t("errorLoadingArticle"));
// // //       } catch (err: any) {
// // //         console.error("Error loading news article:", err);
// // //         if (alive) setError(err?.message || t("errorLoadingArticle"));
// // //       } finally {
// // //         if (alive) setIsLoading(false);
// // //       }
// // //     })();
// // //     return () => {
// // //       alive = false;
// // //     };
// // //   }, [articleId, lang]);

// // //   // Favorite state
// // //   useEffect(() => {
// // //     (async () => {
// // //       try {
// // //         setIsFavorite(await isNewsArticleFavorited(articleId));
// // //       } catch {
// // //         // ignore
// // //       }
// // //     })();
// // //   }, [articleId]);

// // //   // Measure container for page->local conversion
// // //   const handleContainerLayout = useCallback(() => {
// // //     containerRef.current?.measureInWindow?.((x, y) => {
// // //       setContainerLeft(x ?? 0);
// // //       setContainerTop(y ?? 0);
// // //     });
// // //   }, []);

// // //   // Load bookmark
// // //   useEffect(() => {
// // //     (async () => {
// // //       try {
// // //         const raw = await AsyncStorage.getItem(bookmarkKey(articleId));
// // //         if (!raw) return;
// // //         const saved: SavedBookmark = JSON.parse(raw);
// // //         if (typeof saved?.ratio === "number") {
// // //           setBookmarkRatio(clamp01(saved.ratio));
// // //         }
// // //       } catch (e) {
// // //         console.log("Failed to load bookmark", e);
// // //       }
// // //     })();
// // //   }, [articleId, lang]);

// // //   // Recompute overlay Y from ratio when sizes/ratio change
// // //   useEffect(() => {
// // //     if (bookmarkRatio == null) return;
// // //     const y = headerHeight + bookmarkRatio * effectiveScrollableHeight;
// // //     setOverlayContentY(y);
// // //   }, [bookmarkRatio, headerHeight, effectiveScrollableHeight]);

// // //   const saveBookmark = useCallback(
// // //     async (contentY: number) => {
// // //       const ratio = clamp01(
// // //         (contentY - headerHeight) / effectiveScrollableHeight
// // //       );
// // //       setBookmarkRatio(ratio);
// // //       setOverlayContentY(contentY);
// // //       try {
// // //         const payload: SavedBookmark = { ratio, addedAt: Date.now() };
// // //         await AsyncStorage.setItem(
// // //           bookmarkKey(articleId),
// // //           JSON.stringify(payload)
// // //         );
// // //       } catch (e) {
// // //         console.log("Failed to save bookmark", e);
// // //       }
// // //     },
// // //     [articleId, headerHeight, effectiveScrollableHeight, lang]
// // //   );

// // //   const clearBookmark = useCallback(() => {
// // //     Alert.alert(
// // //       t("remove", "Remove"),
// // //       t("bookmarkRemove", "Remove this bookmark?"),
// // //       [
// // //         { text: t("cancel", "Cancel"), style: "cancel" },
// // //         {
// // //           text: t("remove", "Remove"),
// // //           style: "destructive",
// // //           onPress: async () => {
// // //             try {
// // //               setBookmarkRatio(null);
// // //               setOverlayContentY(null);
// // //               await AsyncStorage.removeItem(bookmarkKey(articleId));
// // //             } catch (e) {
// // //               console.log("Failed to clear bookmark", e);
// // //             }
// // //           },
// // //         },
// // //       ],
// // //       { cancelable: true }
// // //     );
// // //   }, [articleId, lang]);

// // //   const jumpToBookmark = useCallback(() => {
// // //     if (overlayContentY == null) return;
// // //     const target = Math.max(overlayContentY - 200, 0);
// // //     flatListRef.current?.scrollToOffset({ offset: target, animated: true });
// // //   }, [overlayContentY]);

// // //   const handleLongPress = useCallback(
// // //     (e: GestureResponderEvent) => {
// // //       const { pageY } = e.nativeEvent as any;
// // //       const contentY = pageY - containerTop + scrollY;

// // //       if (bookmarkRatio != null) {
// // //         Alert.alert(
// // //           t("replace"),
// // //           t("bookmarkReplaceQuestion"),
// // //           [
// // //             { text: t("cancel"), style: "cancel" },
// // //             {
// // //               text: t("replace", "Replace"),
// // //               style: "destructive",
// // //               onPress: () => saveBookmark(contentY),
// // //             },
// // //           ],
// // //           { cancelable: true }
// // //         );
// // //         return;
// // //       }
// // //       // No previous bookmark
// // //       saveBookmark(contentY);
// // //     },
// // //     [bookmarkRatio, containerTop, scrollY, saveBookmark, lang]
// // //   );

// // //   // ---------- MEMOIZED MARKDOWN RULES (since your Markdown doesn't support `style`) ----------
// // //   const mdRules = useMemo(() => {
// // //     return {
// // //       paragraph: (node: any, children: any) => (
// // //         <Text
// // //           key={node?.key}
// // //           style={{
// // //             color: Colors[colorScheme].text,
// // //             fontSize: fontSize,
// // //             lineHeight: lineHeight * 1.6,
// // //             marginBottom: 20,
// // //             fontFamily: "System",
// // //           }}
// // //         >
// // //           {children}
// // //         </Text>
// // //       ),
// // //       heading1: (node: any, children: any) => (
// // //         <Text
// // //           key={node?.key}
// // //           style={{
// // //             color: Colors[colorScheme].text,
// // //             fontSize: fontSize * 1.8,
// // //             fontWeight: "800",
// // //             marginBottom: 20,
// // //             marginTop: 32,
// // //             letterSpacing: -0.5,
// // //           }}
// // //         >
// // //           {children}
// // //         </Text>
// // //       ),
// // //       heading2: (node: any, children: any) => (
// // //         <Text
// // //           key={node?.key}
// // //           style={{
// // //             color: Colors[colorScheme].text,
// // //             fontSize: fontSize * 1.5,
// // //             fontWeight: "700",
// // //             marginBottom: 16,
// // //             marginTop: 28,
// // //             letterSpacing: -0.3,
// // //           }}
// // //         >
// // //           {children}
// // //         </Text>
// // //       ),
// // //       em: (node: any, children: any) => (
// // //         <Text
// // //           key={node?.key}
// // //           style={{
// // //             color: Colors[colorScheme].defaultIcon,
// // //             fontStyle: "italic",
// // //           }}
// // //         >
// // //           {children}
// // //         </Text>
// // //       ),
// // //       strong: (node: any, children: any) => (
// // //         <Text
// // //           key={node?.key}
// // //           style={{ color: Colors[colorScheme].text, fontWeight: "700" }}
// // //         >
// // //           {children}
// // //         </Text>
// // //       ),
// // //       link: (node: any, children: any) => (
// // //         <Text
// // //           key={node?.key}
// // //           style={{
// // //             color: Colors[colorScheme].tint,
// // //             textDecorationLine: "underline",
// // //           }}
// // //           onPress={() =>
// // //             node?.attributes?.href && Linking.openURL(node.attributes.href)
// // //           }
// // //           suppressHighlighting
// // //         >
// // //           {children}
// // //         </Text>
// // //       ),
// // //       blockquote: (node: any, children: any) => (
// // //         <View
// // //           key={node?.key}
// // //           style={{
// // //             backgroundColor: "transparent",
// // //             borderLeftColor: Colors[colorScheme].tint,
// // //             borderLeftWidth: 4,
// // //             paddingLeft: 20,
// // //             paddingVertical: 16,
// // //             marginVertical: 24,
// // //           }}
// // //         >
// // //           <Text
// // //             style={{ color: Colors[colorScheme].text, fontStyle: "italic" }}
// // //           >
// // //             {children}
// // //           </Text>
// // //         </View>
// // //       ),
// // //       image: (node: any) => {
// // //         const uri = node?.attributes?.src;
// // //         if (!uri) return null;
// // //         return (
// // //           <Image
// // //             key={node.key}
// // //             source={{ uri }}
// // //             style={{ width: "100%", height: 200, marginVertical: 12 }}
// // //             contentFit="cover"
// // //             transition={100}
// // //           />
// // //         );
// // //       },
// // //       code_inline: (node: any) => (
// // //         <Text
// // //           key={node?.key}
// // //           style={{
// // //             backgroundColor: Colors[colorScheme].tint + "15",
// // //             color: Colors[colorScheme].tint,
// // //             paddingHorizontal: 6,
// // //             paddingVertical: 2,
// // //             borderRadius: 4,
// // //             fontSize: fontSize * 0.9,
// // //           }}
// // //         >
// // //           {node?.content}
// // //         </Text>
// // //       ),
// // //     };
// // //   }, [colorScheme, fontSize, lineHeight]);
// // //   // ------------------------------------------------------------------------------------------

// // //   // renderItem MUST be defined before any early return (hook)
// // //   const renderItem = useCallback(
// // //     ({ item }: ListRenderItemInfo<Row>) => {
// // //       if (!article) return null; // safe guard if somehow called early
// // //       return (
// // //         <Pressable
// // //           style={styles.contentSection}
// // //           delayLongPress={350}
// // //           onLongPress={handleLongPress}
// // //         >
// // //           <View style={styles.articleContent}>
// // //             <Markdown rules={mdRules}>{article.content}</Markdown>
// // //           </View>

// // //           {!!article.source && (
// // //             <View
// // //               style={[
// // //                 styles.footerContainer,
// // //                 {
// // //                   borderColor: Colors[colorScheme].border,
// // //                   alignItems: rtl ? "flex-end" : "flex-start",
// // //                 },
// // //               ]}
// // //             >
// // //               <ThemedText
// // //                 style={{
// // //                   fontWeight: "600",
// // //                   fontSize: fontSize,
// // //                   marginBottom: 5,
// // //                 }}
// // //               >
// // //                 {t("source")}
// // //               </ThemedText>
// // //               <Markdown
// // //                 rules={{
// // //                   paragraph: (node: any, children: any) => (
// // //                     <Text
// // //                       key={node?.key}
// // //                       style={{
// // //                         color: Colors[colorScheme].text,
// // //                         fontSize: 14,
// // //                         textAlign: "justify",
// // //                       }}
// // //                     >
// // //                       {children}
// // //                     </Text>
// // //                   ),
// // //                   link: (node: any, children: any) => (
// // //                     <Text
// // //                       key={node?.key}
// // //                       style={{
// // //                         color: Colors[colorScheme].tint,
// // //                         textDecorationLine: "underline",
// // //                         fontSize: 14,
// // //                       }}
// // //                       onPress={() =>
// // //                         node?.attributes?.href &&
// // //                         Linking.openURL(node.attributes.href)
// // //                       }
// // //                       suppressHighlighting
// // //                     >
// // //                       {children}
// // //                     </Text>
// // //                   ),
// // //                 }}
// // //               >
// // //                 {article.source}
// // //               </Markdown>
// // //             </View>
// // //           )}
// // //         </Pressable>
// // //       );
// // //     },
// // //     [article, colorScheme, fontSize, handleLongPress, mdRules, lang]
// // //   );

// // //   // ===== Early returns AFTER all hooks =====
// // //   if (isLoading) {
// // //     return (
// // //       <ThemedView style={[styles.container]}>
// // //         <View style={styles.loadingContainer}>
// // //           <View
// // //             style={[
// // //               styles.loadingCard,
// // //               { backgroundColor: Colors[colorScheme].background },
// // //             ]}
// // //           >
// // //             <LoadingIndicator size="large" />
// // //           </View>
// // //         </View>
// // //       </ThemedView>
// // //     );
// // //   }

// // //   if (error || !article) {
// // //     return (
// // //       <View
// // //         style={[
// // //           styles.container,
// // //           { backgroundColor: Colors[colorScheme].background },
// // //         ]}
// // //       >
// // //         <View style={styles.errorContainer}>
// // //           <Ionicons
// // //             name="newspaper-outline"
// // //             size={80}
// // //             color={Colors[colorScheme].defaultIcon}
// // //           />
// // //         </View>
// // //         <Text style={[styles.errorTitle, { color: Colors[colorScheme].text }]}>
// // //           {t("error")}
// // //         </Text>
// // //         <Text
// // //           style={[
// // //             styles.errorSubtitle,
// // //             { color: Colors[colorScheme].defaultIcon },
// // //           ]}
// // //         >
// // //           {t("errorLoadingArticle")}
// // //         </Text>
// // //         <Text
// // //           style={[
// // //             styles.errorSubtitle,
// // //             { color: Colors[colorScheme].defaultIcon },
// // //           ]}
// // //         >
// // //           {error}
// // //         </Text>
// // //       </View>
// // //     );
// // //   }

// // //   // header can be built here (no hooks)
// // //   const header = (
// // //     <View
// // //       style={styles.heroSection}
// // //       onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
// // //     >
// // //       <View style={[styles.header]}>
// // //         <HeaderLeftBackButton />
// // //         <Text
// // //           style={[
// // //             styles.headerText,
// // //             {
// // //               backgroundColor: Colors.universal.third,
// // //             },
// // //           ]}
// // //         >
// // //           {t("newsArticleScreenTitle").toUpperCase()}
// // //         </Text>
// // //       </View>

// // //       <Text style={[styles.heroTitle, { color: Colors[colorScheme].text }]}>
// // //         {article.title}
// // //       </Text>

// // //       <View style={styles.articleMetaContainer}>
// // //         <View style={styles.articleMetaSupcontainer}>
// // //           <View
// // //             style={[
// // //               styles.authorAvatar,
// // //               {
// // //                 backgroundColor: Colors[colorScheme].contrast,
// // //                 borderColor: Colors[colorScheme].border,
// // //               },
// // //             ]}
// // //           >
// // //             {article.scholar_type === 1 ? (
// // //               <Image
// // //                 source={require("@/assets/images/1.png")}
// // //                 style={{ width: 50, height: 50, margin: 10 }}
// // //                 contentFit="fill"
// // //               />
// // //             ) : article.scholar_type === 2 ? (
// // //               <Image
// // //                 source={require("@/assets/images/2.png")}
// // //                 style={{ width: 50, height: 50, margin: 10 }}
// // //               />
// // //             ) : article.scholar_type === 3 ? (
// // //               <Image
// // //                 source={require("@/assets/images/3.png")}
// // //                 style={{ width: 70, height: 70, margin: 0 }}
// // //               />
// // //             ) : null}
// // //           </View>
// // //           <View style={styles.nameDateTime}>
// // //             <Text
// // //               style={[styles.authorName, { color: Colors[colorScheme].text }]}
// // //             >
// // //               {article.author}
// // //             </Text>
// // //             <View style={styles.nameDateTimeSubcontainer}>
// // //               <Text
// // //                 style={[
// // //                   styles.publishDate,
// // //                   { color: Colors.universal.grayedOut },
// // //                 ]}
// // //               >
// // //                 {formattedDate(article.created_at)}
// // //               </Text>
// // //               <View style={styles.readTime}>
// // //                 <Ionicons
// // //                   name="time-outline"
// // //                   size={16}
// // //                   color={Colors[colorScheme].defaultIcon}
// // //                 />
// // //                 <Text
// // //                   style={[
// // //                     styles.readTimeText,
// // //                     { color: Colors[colorScheme].defaultIcon },
// // //                   ]}
// // //                 >
// // //                   {article.read_time} min
// // //                 </Text>
// // //               </View>
// // //             </View>
// // //           </View>
// // //         </View>
// // //       </View>

// // //       {/* Border */}
// // //       <View
// // //         style={[styles.border, { backgroundColor: Colors[colorScheme].border }]}
// // //       >
// // //         <View
// // //           style={[
// // //             styles.borderFill,
// // //             {
// // //               width: "100%",
// // //               backgroundColor: Colors[colorScheme].tint,
// // //             },
// // //           ]}
// // //         />
// // //       </View>
// // //     </View>
// // //   );

// // //   const data: Row[] = [{ key: "content" }];

// // //   return (
// // //     <SafeAreaView
// // //       ref={containerRef}
// // //       onLayout={handleContainerLayout}
// // //       style={[
// // //         styles.container,
// // //         { backgroundColor: Colors[colorScheme].background },
// // //       ]}
// // //       edges={["top"]}
// // //     >
// // //       <FlatList
// // //         ref={flatListRef}
// // //         data={data}
// // //         keyExtractor={(item) => item.key}
// // //         renderItem={renderItem}
// // //         ListHeaderComponent={header}
// // //         onScroll={handleScroll}
// // //         scrollEventThrottle={16}
// // //         showsVerticalScrollIndicator
// // //         onContentSizeChange={(_, h) => setContentHeight(h)}
// // //         initialNumToRender={1}
// // //         maxToRenderPerBatch={1}
// // //         windowSize={3}
// // //         // removeClippedSubviews intentionally disabled to avoid overlay glitches/churn
// // //       />

// // //       {/* Overlay */}
// // //       <View pointerEvents="box-none" style={StyleSheet.absoluteFillObject}>
// // //         {overlayContentY !== null && (
// // //           <>
// // //             <View
// // //               pointerEvents="none"
// // //               style={[
// // //                 styles.bookmarkLine,
// // //                 {
// // //                   top: overlayContentY - scrollY,
// // //                   backgroundColor: Colors.universal.third,
// // //                 },
// // //               ]}
// // //             />
// // //             <View
// // //               style={[
// // //                 styles.bookmarkChipWrap,
// // //                 { top: overlayContentY - scrollY - 14 },
// // //               ]}
// // //             >
// // //               <View
// // //                 style={[
// // //                   styles.bookmarkChip,
// // //                   {
// // //                     backgroundColor: Colors.universal.third,
// // //                     borderColor: Colors[colorScheme].background,
// // //                   },
// // //                 ]}
// // //               >
// // //                 <Ionicons name="bookmark" size={12} color="#fff" />
// // //                 <Text style={styles.bookmarkChipText}>{t("bookmark")}</Text>

// // //                 <TouchableOpacity
// // //                   onPress={clearBookmark}
// // //                   style={styles.bookmarkChipBtn}
// // //                 >
// // //                   <Ionicons name="close" size={14} color="#fff" />
// // //                 </TouchableOpacity>
// // //               </View>
// // //             </View>
// // //           </>
// // //         )}
// // //       </View>

// // //       <FontSizePickerModal
// // //         visible={showFontSizePickerModal}
// // //         onClose={() => setShowFontSizePickerModal(false)}
// // //       />

// // //       {bookmarkRatio != null && (
// // //         <TouchableOpacity style={styles.jumpBtn} onPress={jumpToBookmark}>
// // //           <Ionicons name="flag" size={22} color="#fff" />
// // //         </TouchableOpacity>
// // //       )}

// // //       {scrollY > 200 && <ArrowUp scrollToTop={scrollToTop} />}
// // //     </SafeAreaView>
// // //   );
// // // }

// // // const styles = StyleSheet.create({
// // //   container: { flex: 1 },

// // //   heroSection: {
// // //     paddingHorizontal: 24,
// // //     paddingBottom: 3,
// // //     paddingTop: 10,
// // //   },
// // //   header: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     justifyContent: "space-between",
// // //     marginBottom: 20,
// // //   },
// // //   headerText: {
// // //     color: "white",
// // //     fontSize: 12,
// // //     fontWeight: "700",
// // //     letterSpacing: 1,
// // //     paddingHorizontal: 12,
// // //     paddingVertical: 6,
// // //     borderRadius: 16,
// // //   },
// // //   heroTitle: {
// // //     fontSize: 32,
// // //     fontWeight: "900",
// // //     lineHeight: 40,
// // //     marginBottom: 24,
// // //     letterSpacing: -0.8,
// // //   },
// // //   articleMetaContainer: {
// // //     flexDirection: "column",
// // //     marginBottom: 32,
// // //   },
// // //   articleMetaSupcontainer: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     gap: 12,
// // //   },
// // //   nameDateTime: {
// // //     flexDirection: "column",
// // //     gap: 2,
// // //   },
// // //   nameDateTimeSubcontainer: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     gap: 15,
// // //   },
// // //   authorAvatar: {
// // //     borderWidth: 1,
// // //     borderRadius: 99,
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //   },
// // //   authorName: {
// // //     fontSize: 16,
// // //     fontWeight: "600",
// // //   },
// // //   publishDate: {
// // //     fontSize: 14,
// // //     marginTop: 5,
// // //   },
// // //   metaRight: {},
// // //   readTime: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     gap: 4,
// // //     marginRight: 5,
// // //     marginTop: 5,
// // //   },
// // //   readTimeText: {
// // //     fontSize: 14,
// // //     fontWeight: "500",
// // //   },

// // //   actionBar: {
// // //     flexDirection: "row",
// // //     gap: 12,
// // //   },
// // //   actionButton: {
// // //     flex: 1,
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //     gap: 8,
// // //     paddingVertical: 12,
// // //     borderRadius: 24,
// // //     borderWidth: 0.5,
// // //   },

// // //   contentSection: { flex: 1 },

// // //   border: {
// // //     height: 2,
// // //     marginHorizontal: 15,
// // //     borderRadius: 2,
// // //     marginTop: 15,
// // //     overflow: "hidden",
// // //   },
// // //   borderFill: { height: "100%", borderRadius: 2 },

// // //   articleContent: { paddingHorizontal: 30 },

// // //   loadingContainer: {
// // //     flex: 1,
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //     padding: 40,
// // //   },
// // //   loadingCard: {
// // //     alignItems: "center",
// // //     gap: 20,
// // //     padding: 40,
// // //     borderRadius: 20,
// // //     shadowOffset: { width: 0, height: 4 },
// // //     shadowOpacity: 0.1,
// // //     shadowRadius: 12,
// // //     elevation: 4,
// // //   },
// // //   errorContainer: {
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //     padding: 40,
// // //   },
// // //   errorTitle: {
// // //     fontSize: 24,
// // //     fontWeight: "700",
// // //     marginTop: 20,
// // //     marginBottom: 8,
// // //     textAlign: "center",
// // //   },
// // //   errorSubtitle: { fontSize: 16, textAlign: "center", lineHeight: 24 },

// // //   footerContainer: {
// // //     flexDirection: "column",
// // //     borderTopWidth: 0.5,
// // //     paddingTop: 20,
// // //     paddingBottom: 40,
// // //     paddingHorizontal: 24,
// // //   },

// // //   // Bookmark overlay
// // //   bookmarkLine: {
// // //     position: "absolute",
// // //     left: 0,
// // //     right: 0,
// // //     height: 2,
// // //     opacity: 0.9,
// // //   },
// // //   bookmarkChipWrap: {
// // //     position: "absolute",
// // //     right: 10,
// // //   },
// // //   bookmarkChip: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     gap: 6,
// // //     paddingHorizontal: 10,
// // //     paddingVertical: 6,
// // //     borderRadius: 16,
// // //     borderWidth: 1,
// // //     shadowColor: "#000",
// // //     shadowOpacity: 0.1,
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowRadius: 4,
// // //     elevation: 2,
// // //   },
// // //   bookmarkChipText: {
// // //     color: "#fff",
// // //     fontSize: 12,
// // //     fontWeight: "700",
// // //   },
// // //   bookmarkChipBtn: {
// // //     paddingHorizontal: 4,
// // //     paddingVertical: 2,
// // //   },

// // //   // Quick jump floating button
// // //   jumpBtn: {
// // //     position: "absolute",
// // //     bottom: 28,
// // //     right: 24,
// // //     width: 48,
// // //     height: 48,
// // //     borderRadius: 24,
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //     backgroundColor: Colors.universal.third,
// // //     shadowColor: "#000",
// // //     shadowOpacity: 0.2,
// // //     shadowOffset: { width: 0, height: 3 },
// // //     shadowRadius: 6,
// // //     elevation: 4,
// // //   },

// // //   arrowUp: {
// // //     position: "absolute",
// // //     bottom: "60%",
// // //     right: "3%",
// // //     borderWidth: 2.5,
// // //     borderRadius: 99,
// // //     padding: 5,
// // //     backgroundColor: Colors.universal.primary,
// // //     borderColor: Colors.universal.primary,
// // //   },
// // // });

// // //! Works and doenst move
// // import { Colors } from "@/constants/Colors";
// // import { NewsArticlesType } from "@/constants/Types";
// // import { useLanguage } from "@/contexts/LanguageContext";
// // import { useNewsArticles } from "@/hooks/useNewsArticles";
// // import { useFontSizeStore } from "@/stores/fontSizeStore";
// // import { formattedDate } from "@/utils/formate";
// // import Ionicons from "@expo/vector-icons/Ionicons";
// // import AsyncStorage from "@react-native-async-storage/async-storage";
// // import { Image } from "expo-image";
// // import React, {
// //   useCallback,
// //   useEffect,
// //   useMemo,
// //   useRef,
// //   useState,
// // } from "react";
// // import { useTranslation } from "react-i18next";
// // import {
// //   Pressable,
// //   StyleSheet,
// //   Text,
// //   TouchableOpacity,
// //   useColorScheme,
// //   View,
// //   FlatList,
// //   ListRenderItemInfo,
// //   Alert,
// //   Linking,
// //   type GestureResponderEvent,
// // } from "react-native";
// // import Markdown from "react-native-markdown-display";
// // import { SafeAreaView } from "react-native-safe-area-context";
// // import FontSizePickerModal from "./FontSizePickerModal";
// // import HeaderLeftBackButton from "./HeaderLeftBackButton";
// // import { LoadingIndicator } from "./LoadingIndicator";
// // import { ThemedText } from "./ThemedText";
// // import { ThemedView } from "./ThemedView";
// // import ArrowUp from "./ArrowUp";

// // type Row = { key: "content" };
// // type SavedBookmark = { offsetY: number; addedAt: number };

// // export default function NewsArticleDetailScreen({
// //   articleId,
// // }: {
// //   articleId: number;
// // }) {
// //   const { fontSize, lineHeight } = useFontSizeStore();
// //   const colorScheme = useColorScheme() ?? "light";
// //   const { t } = useTranslation();

// //   const [article, setArticle] = useState<NewsArticlesType | null>(null);
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);

// //   const [showFontSizePickerModal, setShowFontSizePickerModal] = useState(false);
// //   const [isFavorite, setIsFavorite] = useState(false); // keep if you use favorites elsewhere

// //   // simple scroll + absolute bookmark
// //   const [scrollY, setScrollY] = useState(0);
// //   const [bookmarkOffsetY, setBookmarkOffsetY] = useState<number | null>(null);

// //   // container top for converting pageY -> local Y
// //   const containerRef = useRef<View>(null);
// //   const [containerTop, setContainerTop] = useState(0);

// //   const { lang, rtl } = useLanguage();
// //   const { fetchNewsArticleById } = useNewsArticles(lang);
// //   const bookmarkKey = (id: number) => `bookmark:newsArticle:${id}:${lang}`;

// //   const flatListRef = useRef<FlatList<Row>>(null);

// //   const handleScroll = useCallback((e: any) => {
// //     setScrollY(e.nativeEvent.contentOffset.y);
// //   }, []);

// //   const scrollToTop = useCallback(() => {
// //     flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
// //   }, []);

// //   // Load article
// //   useEffect(() => {
// //     let alive = true;
// //     (async () => {
// //       if (!articleId) {
// //         if (alive) {
// //           setError(t("errorLoadingArticle"));
// //           setIsLoading(false);
// //         }
// //         return;
// //       }
// //       setIsLoading(true);
// //       setError(null);
// //       try {
// //         const fetchedArticle = await fetchNewsArticleById(articleId);
// //         if (!alive) return;
// //         if (fetchedArticle) setArticle(fetchedArticle);
// //         else setError(t("errorLoadingArticle"));
// //       } catch (err: any) {
// //         console.error("Error loading news article:", err);
// //         if (alive) setError(err?.message || t("errorLoadingArticle"));
// //       } finally {
// //         if (alive) setIsLoading(false);
// //       }
// //     })();
// //     return () => {
// //       alive = false;
// //     };
// //   }, [articleId, lang]);

// //   // Favorite state (optional)
// //   useEffect(() => {
// //     (async () => {
// //       try {
// //         // If you track favorites, set the flag here. Otherwise remove this effect.
// //         // setIsFavorite(await isNewsArticleFavorited(articleId));
// //       } catch {
// //         // ignore
// //       }
// //     })();
// //   }, [articleId]);

// //   // Measure container for page->local conversion
// //   const handleContainerLayout = useCallback(() => {
// //     containerRef.current?.measureInWindow?.((_, y) => {
// //       setContainerTop(y ?? 0);
// //     });
// //   }, []);

// //   // Load bookmark
// //   useEffect(() => {
// //     (async () => {
// //       try {
// //         const raw = await AsyncStorage.getItem(bookmarkKey(articleId));
// //         if (!raw) return;
// //         const saved: SavedBookmark = JSON.parse(raw);
// //         if (typeof saved?.offsetY === "number") {
// //           setBookmarkOffsetY(saved.offsetY);
// //         }
// //       } catch (e) {
// //         console.log("Failed to load bookmark", e);
// //       }
// //     })();
// //   }, [articleId, lang]);

// //   const saveBookmark = useCallback(
// //     async (offsetY: number) => {
// //       setBookmarkOffsetY(offsetY);
// //       try {
// //         const payload: SavedBookmark = { offsetY, addedAt: Date.now() };
// //         await AsyncStorage.setItem(
// //           bookmarkKey(articleId),
// //           JSON.stringify(payload)
// //         );
// //       } catch (e) {
// //         console.log("Failed to save bookmark", e);
// //       }
// //     },
// //     [articleId, lang]
// //   );

// //   const clearBookmark = useCallback(() => {
// //     Alert.alert(
// //       t("remove", "Remove"),
// //       t("bookmarkRemove", "Remove this bookmark?"),
// //       [
// //         { text: t("cancel", "Cancel"), style: "cancel" },
// //         {
// //           text: t("remove", "Remove"),
// //           style: "destructive",
// //           onPress: async () => {
// //             try {
// //               setBookmarkOffsetY(null);
// //               await AsyncStorage.removeItem(bookmarkKey(articleId));
// //             } catch (e) {
// //               console.log("Failed to clear bookmark", e);
// //             }
// //           },
// //         },
// //       ],
// //       { cancelable: true }
// //     );
// //   }, [articleId, lang]);

// //   const jumpToBookmark = useCallback(() => {
// //     if (bookmarkOffsetY == null) return;
// //     const target = Math.max(bookmarkOffsetY - 200, 0);
// //     flatListRef.current?.scrollToOffset({ offset: target, animated: true });
// //   }, [bookmarkOffsetY]);

// //   const handleLongPress = useCallback(
// //     (e: GestureResponderEvent) => {
// //       const { pageY } = e.nativeEvent as any;
// //       const offsetY = scrollY + (pageY - containerTop);

// //       if (bookmarkOffsetY != null) {
// //         Alert.alert(
// //           t("replace"),
// //           t("bookmarkReplaceQuestion"),
// //           [
// //             { text: t("cancel"), style: "cancel" },
// //             {
// //               text: t("replace", "Replace"),
// //               style: "destructive",
// //               onPress: () => saveBookmark(offsetY),
// //             },
// //           ],
// //           { cancelable: true }
// //         );
// //         return;
// //       }
// //       saveBookmark(offsetY);
// //     },
// //     [bookmarkOffsetY, containerTop, scrollY, saveBookmark, lang]
// //   );

// //   // ---------- Markdown rules ----------
// //   const mdRules = useMemo(() => {
// //     return {
// //       paragraph: (node: any, children: any) => (
// //         <Text
// //           key={node?.key}
// //           style={{
// //             color: Colors[colorScheme].text,
// //             fontSize: fontSize,
// //             lineHeight: lineHeight * 1.6,
// //             marginBottom: 20,
// //             fontFamily: "System",
// //           }}
// //         >
// //           {children}
// //         </Text>
// //       ),
// //       heading1: (node: any, children: any) => (
// //         <Text
// //           key={node?.key}
// //           style={{
// //             color: Colors[colorScheme].text,
// //             fontSize: fontSize * 1.8,
// //             fontWeight: "800",
// //             marginBottom: 20,
// //             marginTop: 32,
// //             letterSpacing: -0.5,
// //           }}
// //         >
// //           {children}
// //         </Text>
// //       ),

// //       heading2: (node: any, children: any) => (
// //         <Text
// //           key={node?.key}
// //           style={{
// //             color: Colors[colorScheme].text,
// //             fontSize: fontSize * 1.5,
// //             fontWeight: "700",
// //             marginBottom: 16,
// //             marginTop: 28,
// //             letterSpacing: -0.3,
// //           }}
// //         >
// //           {children}
// //         </Text>
// //       ),
// //       em: (node: any, children: any) => (
// //         <Text
// //           key={node?.key}
// //           style={{
// //             color: Colors[colorScheme].defaultIcon,
// //             fontStyle: "italic",
// //           }}
// //         >
// //           {children}
// //         </Text>
// //       ),
// //       strong: (node: any, children: any) => (
// //         <Text
// //           key={node?.key}
// //           style={{ color: Colors[colorScheme].text, fontWeight: "700" }}
// //         >
// //           {children}
// //         </Text>
// //       ),
// //       link: (node: any, children: any) => (
// //         <Text
// //           key={node?.key}
// //           style={{
// //             color: Colors[colorScheme].tint,
// //             textDecorationLine: "underline",
// //           }}
// //           onPress={() =>
// //             node?.attributes?.href && Linking.openURL(node.attributes.href)
// //           }
// //           suppressHighlighting
// //         >
// //           {children}
// //         </Text>
// //       ),
// //       blockquote: (node: any, children: any) => (
// //         <View
// //           key={node?.key}
// //           style={{
// //             backgroundColor: "transparent",
// //             borderLeftColor: Colors[colorScheme].tint,
// //             borderLeftWidth: 4,
// //             paddingLeft: 20,
// //             paddingVertical: 16,
// //             marginVertical: 24,
// //           }}
// //         >
// //           <Text
// //             style={{ color: Colors[colorScheme].text, fontStyle: "italic" }}
// //           >
// //             {children}
// //           </Text>
// //         </View>
// //       ),
// //       image: (node: any) => {
// //         const uri = node?.attributes?.src;
// //         if (!uri) return null;
// //         return (
// //           <Image
// //             key={node.key}
// //             source={{ uri }}
// //             style={{ width: "100%", height: 200, marginVertical: 12 }}
// //             contentFit="cover"
// //             transition={100}
// //           />
// //         );
// //       },
// //       code_inline: (node: any) => (
// //         <Text
// //           key={node?.key}
// //           style={{
// //             backgroundColor: Colors[colorScheme].tint + "15",
// //             color: Colors[colorScheme].tint,
// //             paddingHorizontal: 6,
// //             paddingVertical: 2,
// //             borderRadius: 4,
// //             fontSize: fontSize * 0.9,
// //           }}
// //         >
// //           {node?.content}
// //         </Text>
// //       ),
// //     };
// //   }, [colorScheme, fontSize, lineHeight]);
// //   // ------------------------------------

// //   // renderItem
// //   const renderItem = useCallback(
// //     ({ item }: ListRenderItemInfo<Row>) => {
// //       if (!article) return null;
// //       return (
// //         <Pressable
// //           style={styles.contentSection}
// //           delayLongPress={350}
// //           onLongPress={handleLongPress}
// //         >
// //           <View style={styles.articleContent}>
// //             <Markdown rules={mdRules}>{article.content}</Markdown>
// //           </View>

// //           {!!article.source && (
// //             <View
// //               style={[
// //                 styles.footerContainer,
// //                 {
// //                   borderColor: Colors[colorScheme].border,
// //                   alignItems: rtl ? "flex-end" : "flex-start",
// //                 },
// //               ]}
// //             >
// //               <ThemedText
// //                 style={{
// //                   fontWeight: "600",
// //                   fontSize: fontSize,
// //                   marginBottom: 5,
// //                 }}
// //               >
// //                 {t("source")}
// //               </ThemedText>
// //               <Markdown
// //                 rules={{
// //                   paragraph: (node: any, children: any) => (
// //                     <Text
// //                       key={node?.key}
// //                       style={{
// //                         color: Colors[colorScheme].text,
// //                         fontSize: 14,
// //                         textAlign: "justify",
// //                       }}
// //                     >
// //                       {children}
// //                     </Text>
// //                   ),
// //                   link: (node: any, children: any) => (
// //                     <Text
// //                       key={node?.key}
// //                       style={{
// //                         color: Colors[colorScheme].tint,
// //                         textDecorationLine: "underline",
// //                         fontSize: 14,
// //                       }}
// //                       onPress={() =>
// //                         node?.attributes?.href &&
// //                         Linking.openURL(node.attributes.href)
// //                       }
// //                       suppressHighlighting
// //                     >
// //                       {children}
// //                     </Text>
// //                   ),
// //                 }}
// //               >
// //                 {article.source}
// //               </Markdown>
// //             </View>
// //           )}
// //         </Pressable>
// //       );
// //     },
// //     [article, colorScheme, fontSize, handleLongPress, mdRules, rtl, t]
// //   );

// //   // ===== Early returns AFTER all hooks =====
// //   if (isLoading) {
// //     return (
// //       <ThemedView style={[styles.container]}>
// //         <View style={styles.loadingContainer}>
// //           <View
// //             style={[
// //               styles.loadingCard,
// //               { backgroundColor: Colors[colorScheme].background },
// //             ]}
// //           >
// //             <LoadingIndicator size="large" />
// //           </View>
// //         </View>
// //       </ThemedView>
// //     );
// //   }

// //   if (error || !article) {
// //     return (
// //       <View
// //         style={[
// //           styles.container,
// //           { backgroundColor: Colors[colorScheme].background },
// //         ]}
// //       >
// //         <View className="errorContainer" style={styles.errorContainer}>
// //           <Ionicons
// //             name="newspaper-outline"
// //             size={80}
// //             color={Colors[colorScheme].defaultIcon}
// //           />
// //         </View>
// //         <Text style={[styles.errorTitle, { color: Colors[colorScheme].text }]}>
// //           {t("error")}
// //         </Text>
// //         <Text
// //           style={[
// //             styles.errorSubtitle,
// //             { color: Colors[colorScheme].defaultIcon },
// //           ]}
// //         >
// //           {t("errorLoadingArticle")}
// //         </Text>
// //         {!!error && (
// //           <Text
// //             style={[
// //               styles.errorSubtitle,
// //               { color: Colors[colorScheme].defaultIcon },
// //             ]}
// //           >
// //             {error}
// //           </Text>
// //         )}
// //       </View>
// //     );
// //   }

// //   // header
// //   const header = (
// //     <View style={styles.heroSection}>
// //       <View style={[styles.header]}>
// //         <HeaderLeftBackButton />
// //         <Text
// //           style={[
// //             styles.headerText,
// //             {
// //               backgroundColor: Colors.universal.third,
// //             },
// //           ]}
// //         >
// //           {t("newsArticleScreenTitle").toUpperCase()}
// //         </Text>
// //       </View>

// //       <Text style={[styles.heroTitle, { color: Colors[colorScheme].text }]}>
// //         {article.title}
// //       </Text>

// //       <View style={styles.articleMetaContainer}>
// //         <View style={styles.articleMetaSupcontainer}>
// //           <View
// //             style={[
// //               styles.authorAvatar,
// //               {
// //                 backgroundColor: Colors[colorScheme].contrast,
// //                 borderColor: Colors[colorScheme].border,
// //               },
// //             ]}
// //           >
// //             {article.scholar_type === 1 ? (
// //               <Image
// //                 source={require("@/assets/images/1.png")}
// //                 style={{ width: 50, height: 50, margin: 10 }}
// //                 contentFit="fill"
// //               />
// //             ) : article.scholar_type === 2 ? (
// //               <Image
// //                 source={require("@/assets/images/2.png")}
// //                 style={{ width: 50, height: 50, margin: 10 }}
// //               />
// //             ) : article.scholar_type === 3 ? (
// //               <Image
// //                 source={require("@/assets/images/3.png")}
// //                 style={{ width: 70, height: 70, margin: 0 }}
// //               />
// //             ) : null}
// //           </View>
// //           <View style={styles.nameDateTime}>
// //             <Text
// //               style={[styles.authorName, { color: Colors[colorScheme].text }]}
// //             >
// //               {article.author}
// //             </Text>
// //             <View style={styles.nameDateTimeSubcontainer}>
// //               <Text
// //                 style={[
// //                   styles.publishDate,
// //                   { color: Colors.universal.grayedOut },
// //                 ]}
// //               >
// //                 {formattedDate(article.created_at)}
// //               </Text>
// //               <View style={styles.readTime}>
// //                 <Ionicons
// //                   name="time-outline"
// //                   size={16}
// //                   color={Colors[colorScheme].defaultIcon}
// //                 />
// //                 <Text
// //                   style={[
// //                     styles.readTimeText,
// //                     { color: Colors[colorScheme].defaultIcon },
// //                   ]}
// //                 >
// //                   {article.read_time} min
// //                 </Text>
// //               </View>
// //             </View>
// //           </View>
// //         </View>
// //       </View>

// //       {/* Border */}
// //       <View
// //         style={[styles.border, { backgroundColor: Colors[colorScheme].border }]}
// //       >
// //         <View
// //           style={[
// //             styles.borderFill,
// //             {
// //               width: "100%",
// //               backgroundColor: Colors[colorScheme].tint,
// //             },
// //           ]}
// //         />
// //       </View>
// //     </View>
// //   );

// //   const data: Row[] = [{ key: "content" }];

// //   return (
// //     <SafeAreaView
// //       ref={containerRef}
// //       onLayout={handleContainerLayout}
// //       style={[
// //         styles.container,
// //         { backgroundColor: Colors[colorScheme].background },
// //       ]}
// //       edges={["top"]}
// //     >
// //       <FlatList
// //         ref={flatListRef}
// //         data={data}
// //         keyExtractor={(item) => item.key}
// //         renderItem={renderItem}
// //         ListHeaderComponent={header}
// //         onScroll={handleScroll}
// //         scrollEventThrottle={16}
// //         showsVerticalScrollIndicator
// //         initialNumToRender={1}
// //         maxToRenderPerBatch={1}
// //         windowSize={3}
// //       />

// //       {/* Overlay: renders at (savedOffset - currentScroll) */}
// //       <View pointerEvents="box-none" style={StyleSheet.absoluteFillObject}>
// //         {bookmarkOffsetY !== null && (
// //           <>
// //             <View
// //               pointerEvents="none"
// //               style={[
// //                 styles.bookmarkLine,
// //                 {
// //                   top: bookmarkOffsetY - scrollY,
// //                   backgroundColor: Colors.universal.third,
// //                 },
// //               ]}
// //             />
// //             <View
// //               style={[
// //                 styles.bookmarkChipWrap,
// //                 { top: bookmarkOffsetY - scrollY - 14 },
// //               ]}
// //             >
// //               <View
// //                 style={[
// //                   styles.bookmarkChip,
// //                   {
// //                     backgroundColor: Colors.universal.third,
// //                     borderColor: Colors[colorScheme].background,
// //                   },
// //                 ]}
// //               >
// //                 <Ionicons name="bookmark" size={12} color="#fff" />
// //                 <Text style={styles.bookmarkChipText}>{t("bookmark")}</Text>

// //                 <TouchableOpacity
// //                   onPress={clearBookmark}
// //                   style={styles.bookmarkChipBtn}
// //                 >
// //                   <Ionicons name="close" size={14} color="#fff" />
// //                 </TouchableOpacity>
// //               </View>
// //             </View>
// //           </>
// //         )}
// //       </View>

// //       <FontSizePickerModal
// //         visible={showFontSizePickerModal}
// //         onClose={() => setShowFontSizePickerModal(false)}
// //       />

// //       {bookmarkOffsetY != null && (
// //         <TouchableOpacity style={styles.jumpBtn} onPress={jumpToBookmark}>
// //           <Ionicons name="flag" size={22} color="#fff" />
// //         </TouchableOpacity>
// //       )}

// //       {scrollY > 200 && <ArrowUp scrollToTop={scrollToTop} />}
// //     </SafeAreaView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: { flex: 1 },

// //   heroSection: {
// //     paddingHorizontal: 24,
// //     paddingBottom: 3,
// //     paddingTop: 10,
// //   },
// //   header: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     justifyContent: "space-between",
// //     marginBottom: 20,
// //   },
// //   headerText: {
// //     color: "white",
// //     fontSize: 12,
// //     fontWeight: "700",
// //     letterSpacing: 1,
// //     paddingHorizontal: 12,
// //     paddingVertical: 6,
// //     borderRadius: 16,
// //   },
// //   heroTitle: {
// //     fontSize: 32,
// //     fontWeight: "900",
// //     lineHeight: 40,
// //     marginBottom: 24,
// //     letterSpacing: -0.8,
// //   },
// //   articleMetaContainer: {
// //     flexDirection: "column",
// //     marginBottom: 32,
// //   },
// //   articleMetaSupcontainer: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 12,
// //   },
// //   nameDateTime: {
// //     flexDirection: "column",
// //     gap: 2,
// //   },
// //   nameDateTimeSubcontainer: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 15,
// //   },
// //   authorAvatar: {
// //     borderWidth: 1,
// //     borderRadius: 99,
// //     justifyContent: "center",
// //     alignItems: "center",
// //   },
// //   authorName: {
// //     fontSize: 16,
// //     fontWeight: "600",
// //   },
// //   publishDate: {
// //     fontSize: 14,
// //     marginTop: 5,
// //   },
// //   readTime: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 4,
// //     marginRight: 5,
// //     marginTop: 5,
// //   },
// //   readTimeText: {
// //     fontSize: 14,
// //     fontWeight: "500",
// //   },

// //   contentSection: { flex: 1 },

// //   border: {
// //     height: 2,
// //     marginHorizontal: 15,
// //     borderRadius: 2,
// //     marginTop: 15,
// //     overflow: "hidden",
// //   },
// //   borderFill: { height: "100%", borderRadius: 2 },

// //   articleContent: { paddingHorizontal: 30 },

// //   loadingContainer: {
// //     flex: 1,
// //     justifyContent: "center",
// //     alignItems: "center",
// //     padding: 40,
// //   },
// //   loadingCard: {
// //     alignItems: "center",
// //     gap: 20,
// //     padding: 40,
// //     borderRadius: 20,
// //     shadowOffset: { width: 0, height: 4 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 12,
// //     elevation: 4,
// //   },
// //   errorContainer: {
// //     justifyContent: "center",
// //     alignItems: "center",
// //     padding: 40,
// //   },
// //   errorTitle: {
// //     fontSize: 24,
// //     fontWeight: "700",
// //     marginTop: 20,
// //     marginBottom: 8,
// //     textAlign: "center",
// //   },
// //   errorSubtitle: { fontSize: 16, textAlign: "center", lineHeight: 24 },

// //   footerContainer: {
// //     flexDirection: "column",
// //     borderTopWidth: 0.5,
// //     paddingTop: 20,
// //     paddingBottom: 40,
// //     paddingHorizontal: 24,
// //   },

// //   // Bookmark overlay
// //   bookmarkLine: {
// //     position: "absolute",
// //     left: 0,
// //     right: 0,
// //     height: 2,
// //     opacity: 0.9,
// //   },
// //   bookmarkChipWrap: {
// //     position: "absolute",
// //     right: 10,
// //   },
// //   bookmarkChip: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 6,
// //     paddingHorizontal: 10,
// //     paddingVertical: 6,
// //     borderRadius: 16,
// //     borderWidth: 1,
// //     shadowColor: "#000",
// //     shadowOpacity: 0.1,
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowRadius: 4,
// //     elevation: 2,
// //   },
// //   bookmarkChipText: {
// //     color: "#fff",
// //     fontSize: 12,
// //     fontWeight: "700",
// //   },
// //   bookmarkChipBtn: {
// //     paddingHorizontal: 4,
// //     paddingVertical: 2,
// //   },

// //   // Quick jump floating button
// //   jumpBtn: {
// //     position: "absolute",
// //     bottom: 28,
// //     right: 24,
// //     width: 48,
// //     height: 48,
// //     borderRadius: 24,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     backgroundColor: Colors.universal.third,
// //     shadowColor: "#000",
// //     shadowOpacity: 0.2,
// //     shadowOffset: { width: 0, height: 3 },
// //     shadowRadius: 6,
// //     elevation: 4,
// //   },
// // });

// //! Better performance withput fontsize and favorites

// import { Colors } from "@/constants/Colors";
// import { NewsArticlesType } from "@/constants/Types";
// import { useLanguage } from "@/contexts/LanguageContext";
// import { useNewsArticles } from "@/hooks/useNewsArticles";
// import { useFontSizeStore } from "@/stores/fontSizeStore";
// import { formattedDate } from "@/utils/formate";
// import Ionicons from "@expo/vector-icons/Ionicons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Image } from "expo-image";
// import React, {
//   useCallback,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from "react";
// import { useTranslation } from "react-i18next";
// import {
//   Pressable,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   useColorScheme,
//   View,
//   Linking,
//   type GestureResponderEvent,
//   Animated,
//   Alert,
// } from "react-native";
// import Markdown from "react-native-markdown-display";
// import { SafeAreaView } from "react-native-safe-area-context";
// import FontSizePickerModal from "./FontSizePickerModal";
// import HeaderLeftBackButton from "./HeaderLeftBackButton";
// import { LoadingIndicator } from "./LoadingIndicator";
// import { ThemedText } from "./ThemedText";
// import { ThemedView } from "./ThemedView";
// import ArrowUp from "./ArrowUp";
// import { useRefreshFavorites } from "@/stores/refreshFavoriteStore";
// import {
//   isNewsArticleFavorited,
//   toggleNewsArticleFavorite,
// } from "@/utils/favorites";

// type Row = { key: "content" };
// type SavedBookmark = { offsetY: number; addedAt: number };

// export default function NewsArticleDetailScreen({
//   articleId,
// }: {
//   articleId: number;
// }) {
//   const { fontSize, lineHeight } = useFontSizeStore();
//   const colorScheme = useColorScheme() ?? "light";
//   const { t } = useTranslation();
//   const { lang, rtl } = useLanguage();
//   const { fetchNewsArticleById } = useNewsArticles(lang);
//   const { triggerRefreshFavorites } = useRefreshFavorites();
//   const [article, setArticle] = useState<NewsArticlesType | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [isFavorite, setIsFavorite] = useState(false);

//   // Absolute bookmark offset (content coords)
//   const [bookmarkOffsetY, setBookmarkOffsetY] = useState<number | null>(null);

//   // For converting pageY to local content Y
//   const containerRef = useRef<View>(null);
//   const [containerTop, setContainerTop] = useState(0);

//   // Scroll handling (native, no re-renders)
//   const flatListRef = useRef<Animated.FlatList<Row>>(null);
//   const scrollYAV = useRef(new Animated.Value(0)).current;
//   const bookmarkOffsetAV = useRef(new Animated.Value(0)).current;
//   const neg14AV = useRef(new Animated.Value(-14)).current;
//   const lastScrollYRef = useRef(0);

//   const [showArrowUp, setShowArrowUp] = useState(false);
//   const showArrowUpRef = useRef(false);

//   const bookmarkKey = (id: number) => `bookmark:newsArticle:${id}:${lang}`;

//   useEffect(() => {
//     const id = scrollYAV.addListener(({ value }) => {
//       lastScrollYRef.current = value;
//       const show = value > 200;
//       if (show !== showArrowUpRef.current) {
//         showArrowUpRef.current = show;
//         setShowArrowUp(show);
//       }
//     });
//     return () => {
//       scrollYAV.removeListener(id);
//     };
//   }, [scrollYAV]);

//   useEffect(() => {
//     bookmarkOffsetAV.setValue(bookmarkOffsetY ?? 0);
//   }, [bookmarkOffsetY, bookmarkOffsetAV]);

//   const handleContainerLayout = useCallback(() => {
//     containerRef.current?.measureInWindow?.((_, y) => setContainerTop(y ?? 0));
//   }, []);

//   useEffect(() => {
//     let alive = true;
//     (async () => {
//       if (!articleId) {
//         if (alive) {
//           setError(t("errorLoadingArticle"));
//           setIsLoading(false);
//         }
//         return;
//       }
//       setIsLoading(true);
//       setError(null);
//       try {
//         const fetched = await fetchNewsArticleById(articleId);
//         if (!alive) return;
//         if (fetched) setArticle(fetched);
//         else setError(t("errorLoadingArticle"));
//       } catch (err: any) {
//         console.error("Error loading news article:", err);
//         if (alive) setError(err?.message || t("errorLoadingArticle"));
//       } finally {
//         if (alive) setIsLoading(false);
//       }
//     })();
//     return () => {
//       alive = false;
//     };
//   }, [articleId, lang]);

//   useEffect(() => {
//     (async () => {
//       try {
//         const raw = await AsyncStorage.getItem(bookmarkKey(articleId));
//         if (!raw) return;
//         const saved: SavedBookmark = JSON.parse(raw);
//         if (typeof saved?.offsetY === "number")
//           setBookmarkOffsetY(saved.offsetY);
//       } catch (e) {
//         console.log("Failed to load bookmark", e);
//       }
//     })();
//   }, [articleId, lang]);

//   const saveBookmark = useCallback(
//     async (offsetY: number) => {
//       setBookmarkOffsetY(offsetY);
//       try {
//         const payload: SavedBookmark = { offsetY, addedAt: Date.now() };
//         await AsyncStorage.setItem(
//           bookmarkKey(articleId),
//           JSON.stringify(payload)
//         );
//       } catch (e) {
//         console.log("Failed to save bookmark", e);
//       }
//     },
//     [articleId, lang]
//   );

//   const clearBookmark = useCallback(() => {
//     Alert.alert(
//       t("remove", "Remove"),
//       t("bookmarkRemove", "Remove this bookmark?"),
//       [
//         { text: t("cancel", "Cancel"), style: "cancel" },
//         {
//           text: t("remove", "Remove"),
//           style: "destructive",
//           onPress: async () => {
//             try {
//               setBookmarkOffsetY(null);
//               await AsyncStorage.removeItem(bookmarkKey(articleId));
//             } catch (e) {
//               console.log("Failed to clear bookmark", e);
//             }
//           },
//         },
//       ],
//       { cancelable: true }
//     );
//   }, [articleId, lang]);

//   const jumpToBookmark = useCallback(() => {
//     if (bookmarkOffsetY == null) return;
//     const target = Math.max(bookmarkOffsetY - 200, 0);
//     flatListRef.current?.scrollToOffset({ offset: target, animated: true });
//   }, [bookmarkOffsetY]);

//   const handleLongPress = useCallback(
//     (e: GestureResponderEvent) => {
//       const { pageY } = e.nativeEvent as any;
//       const offsetY = lastScrollYRef.current + (pageY - containerTop);

//       if (bookmarkOffsetY != null) {
//         Alert.alert(
//           t("replace"),
//           t("bookmarkReplaceQuestion"),
//           [
//             { text: t("cancel"), style: "cancel" },
//             {
//               text: t("replace", "Replace"),
//               style: "destructive",
//               onPress: () => saveBookmark(offsetY),
//             },
//           ],
//           { cancelable: true }
//         );
//         return;
//       }
//       saveBookmark(offsetY);
//     },
//     [bookmarkOffsetY, containerTop, saveBookmark, t]
//   );

//   useEffect(() => {
//     (async () => {
//       try {
//         setIsFavorite(await isNewsArticleFavorited(articleId));
//       } catch {
//         console.log("error");
//       }
//     })();
//   }, [articleId]);

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

//   const mdRules = useMemo(() => {
//     return {
//       paragraph: (node: any, children: any) => (
//         <Text
//           key={node?.key}
//           style={{
//             color: Colors[colorScheme].text,
//             fontSize,
//             lineHeight: lineHeight * 1.6,
//             marginBottom: 20,
//             fontFamily: "System",
//           }}
//         >
//           {children}
//         </Text>
//       ),
//       heading1: (node: any, children: any) => (
//         <Text
//           key={node?.key}
//           style={{
//             color: Colors[colorScheme].text,
//             fontSize: fontSize * 1.8,
//             fontWeight: "800",
//             marginBottom: 20,
//             marginTop: 32,
//             letterSpacing: -0.5,
//           }}
//         >
//           {children}
//         </Text>
//       ),
//       heading2: (node: any, children: any) => (
//         <Text
//           key={node?.key}
//           style={{
//             color: Colors[colorScheme].text,
//             fontSize: fontSize * 1.5,
//             fontWeight: "700",
//             marginBottom: 16,
//             marginTop: 28,
//             letterSpacing: -0.3,
//           }}
//         >
//           {children}
//         </Text>
//       ),
//       em: (node: any, children: any) => (
//         <Text
//           key={node?.key}
//           style={{
//             color: Colors[colorScheme].defaultIcon,
//             fontStyle: "italic",
//           }}
//         >
//           {children}
//         </Text>
//       ),
//       strong: (node: any, children: any) => (
//         <Text
//           key={node?.key}
//           style={{ color: Colors[colorScheme].text, fontWeight: "700" }}
//         >
//           {children}
//         </Text>
//       ),
//       link: (node: any, children: any) => (
//         <Text
//           key={node?.key}
//           style={{
//             color: Colors[colorScheme].tint,
//             textDecorationLine: "underline",
//           }}
//           onPress={() =>
//             node?.attributes?.href && Linking.openURL(node.attributes.href)
//           }
//           suppressHighlighting
//         >
//           {children}
//         </Text>
//       ),
//       blockquote: (node: any, children: any) => (
//         <View
//           key={node?.key}
//           style={{
//             backgroundColor: "transparent",
//             borderLeftColor: Colors[colorScheme].tint,
//             borderLeftWidth: 4,
//             paddingLeft: 20,
//             paddingVertical: 16,
//             marginVertical: 24,
//           }}
//         >
//           <Text
//             style={{ color: Colors[colorScheme].text, fontStyle: "italic" }}
//           >
//             {children}
//           </Text>
//         </View>
//       ),
//       image: (node: any) => {
//         const uri = node?.attributes?.src;
//         if (!uri) return null;
//         return (
//           <Image
//             key={node.key}
//             source={{ uri }}
//             recyclingKey={uri}
//             cachePolicy="disk"
//             style={{ width: "100%", height: 200, marginVertical: 12 }}
//             contentFit="cover"
//             transition={0}
//           />
//         );
//       },
//       code_inline: (node: any) => (
//         <Text
//           key={node?.key}
//           style={{
//             backgroundColor: Colors[colorScheme].tint + "15",
//             color: Colors[colorScheme].tint,
//             paddingHorizontal: 6,
//             paddingVertical: 2,
//             borderRadius: 4,
//             fontSize: fontSize * 0.9,
//           }}
//         >
//           {node?.content}
//         </Text>
//       ),
//     };
//   }, [colorScheme, fontSize, lineHeight]);

//   const renderItem = useCallback(
//     ({ item }: { item: Row }) => {
//       if (!article) return null;
//       return (
//         <Pressable
//           style={styles.contentSection}
//           delayLongPress={350}
//           onLongPress={handleLongPress}
//         >
//           <View style={styles.articleContent}>
//             <Markdown rules={mdRules}>{article.content}</Markdown>
//           </View>

//           {!!article.source && (
//             <View
//               style={[
//                 styles.footerContainer,
//                 {
//                   borderColor: Colors[colorScheme].border,
//                   alignItems: rtl ? "flex-end" : "flex-start",
//                 },
//               ]}
//             >
//               <ThemedText
//                 style={{ fontWeight: "600", fontSize, marginBottom: 5 }}
//               >
//                 {t("source")}
//               </ThemedText>
//               <Markdown
//                 rules={{
//                   paragraph: (node: any, children: any) => (
//                     <Text
//                       key={node?.key}
//                       style={{
//                         color: Colors[colorScheme].text,
//                         fontSize: 14,
//                         textAlign: "justify",
//                       }}
//                     >
//                       {children}
//                     </Text>
//                   ),
//                   link: (node: any, children: any) => (
//                     <Text
//                       key={node?.key}
//                       style={{
//                         color: Colors[colorScheme].tint,
//                         textDecorationLine: "underline",
//                         fontSize: 14,
//                       }}
//                       onPress={() =>
//                         node?.attributes?.href &&
//                         Linking.openURL(node.attributes.href)
//                       }
//                       suppressHighlighting
//                     >
//                       {children}
//                     </Text>
//                   ),
//                 }}
//               >
//                 {article.source}
//               </Markdown>
//             </View>
//           )}
//         </Pressable>
//       );
//     },
//     [article, colorScheme, fontSize, handleLongPress, mdRules, rtl, t]
//   );

//   if (isLoading) {
//     return (
//       <ThemedView style={[styles.container]}>
//         <View style={styles.loadingContainer}>
//           <View
//             style={[
//               styles.loadingCard,
//               { backgroundColor: Colors[colorScheme].background },
//             ]}
//           >
//             <LoadingIndicator size="large" />
//           </View>
//         </View>
//       </ThemedView>
//     );
//   }

//   if (error || !article) {
//     return (
//       <View
//         style={[
//           styles.container,
//           { backgroundColor: Colors[colorScheme].background },
//         ]}
//       >
//         <View style={styles.errorContainer}>
//           <Ionicons
//             name="newspaper-outline"
//             size={80}
//             color={Colors[colorScheme].defaultIcon}
//           />
//         </View>
//         <Text style={[styles.errorTitle, { color: Colors[colorScheme].text }]}>
//           {t("error")}
//         </Text>
//         <Text
//           style={[
//             styles.errorSubtitle,
//             { color: Colors[colorScheme].defaultIcon },
//           ]}
//         >
//           {t("errorLoadingArticle")}
//         </Text>
//         {!!error && (
//           <Text
//             style={[
//               styles.errorSubtitle,
//               { color: Colors[colorScheme].defaultIcon },
//             ]}
//           >
//             {error}
//           </Text>
//         )}
//       </View>
//     );
//   }

//   const header = (
//     <View style={styles.heroSection}>
//       <View style={styles.header}>
//         <HeaderLeftBackButton />
//         <Text
//           style={[
//             styles.headerText,
//             { backgroundColor: Colors.universal.third },
//           ]}
//         >
//           {t("newsArticleScreenTitle").toUpperCase()}
//         </Text>
//       </View>

//       <Text style={[styles.heroTitle, { color: Colors[colorScheme].text }]}>
//         {article.title}
//       </Text>
//       <View style={styles.articleMetaContainer}>
//         <View style={styles.articleMetaSupcontainer}>
//           <View
//             style={[
//               styles.authorAvatar,
//               {
//                 backgroundColor: Colors[colorScheme].contrast,
//                 borderColor: Colors[colorScheme].border,
//               },
//             ]}
//           >
//             {article.scholar_type === 1 ? (
//               <Image
//                 source={require("@/assets/images/1.png")}
//                 style={{ width: 50, height: 50, margin: 10 }}
//                 contentFit="fill"
//               />
//             ) : article.scholar_type === 2 ? (
//               <Image
//                 source={require("@/assets/images/2.png")}
//                 style={{ width: 50, height: 50, margin: 10 }}
//               />
//             ) : article.scholar_type === 3 ? (
//               <Image
//                 source={require("@/assets/images/3.png")}
//                 style={{ width: 70, height: 70, margin: 0 }}
//               />
//             ) : null}
//           </View>
//           <View style={styles.nameDateTime}>
//             <Text
//               style={[styles.authorName, { color: Colors[colorScheme].text }]}
//             >
//               {article.author}
//             </Text>
//             <View style={styles.nameDateTimeSubcontainer}>
//               <Text
//                 style={[
//                   styles.publishDate,
//                   { color: Colors.universal.grayedOut },
//                 ]}
//               >
//                 {formattedDate(article.created_at)}
//               </Text>
//               <View style={styles.readTime}>
//                 <Ionicons
//                   name="time-outline"
//                   size={16}
//                   color={Colors[colorScheme].defaultIcon}
//                 />
//                 <Text
//                   style={[
//                     styles.readTimeText,
//                     { color: Colors[colorScheme].defaultIcon },
//                   ]}
//                 >
//                   {article.read_time} min
//                 </Text>
//               </View>
//             </View>
//           </View>
//         </View>

//       </View>
//       <View
//         style={[styles.border, { backgroundColor: Colors[colorScheme].border }]}
//       >
//         <View
//           style={[
//             styles.borderFill,
//             { width: "100%", backgroundColor: Colors[colorScheme].tint },
//           ]}
//         />
//       </View>

//     </View>
//   );

//   const data: Row[] = [{ key: "content" }];

//   // translateY = bookmarkOffset - scrollY
//   const translateY = Animated.add(
//     bookmarkOffsetAV,
//     Animated.multiply(scrollYAV, -1)
//   );
//   const chipTranslateY = Animated.add(translateY, neg14AV);

//   return (
//     <SafeAreaView
//       ref={containerRef}
//       onLayout={handleContainerLayout}
//       style={[
//         styles.container,
//         { backgroundColor: Colors[colorScheme].background },
//       ]}
//       edges={["top"]}
//     >
//       <Animated.FlatList<Row>
//         ref={flatListRef}
//         data={data}
//         keyExtractor={(item) => item.key}
//         renderItem={renderItem}
//         ListHeaderComponent={header}
//         onScroll={Animated.event(
//           [{ nativeEvent: { contentOffset: { y: scrollYAV } } }],
//           {
//             useNativeDriver: true,
//           }
//         )}
//         scrollEventThrottle={16}
//         showsVerticalScrollIndicator
//         initialNumToRender={1}
//         maxToRenderPerBatch={1}
//         windowSize={3}
//       />

//       {/* Overlay (native-thread transform; no re-renders on scroll) */}
//       {bookmarkOffsetY !== null && (
//         <View pointerEvents="box-none" style={StyleSheet.absoluteFillObject}>
//           <Animated.View
//             pointerEvents="none"
//             style={[
//               styles.bookmarkLine,
//               { backgroundColor: Colors.universal.third },
//               { transform: [{ translateY }] },
//             ]}
//           />
//           <Animated.View
//             style={[
//               styles.bookmarkChipWrap,
//               { transform: [{ translateY: chipTranslateY }] },
//             ]}
//           >
//             <View
//               style={[
//                 styles.bookmarkChip,
//                 {
//                   backgroundColor: Colors.universal.third,
//                   borderColor: Colors[colorScheme].background,
//                 },
//               ]}
//             >
//               <Ionicons name="bookmark" size={12} color="#fff" />
//               <Text style={styles.bookmarkChipText}>{t("bookmark")}</Text>
//               <TouchableOpacity
//                 onPress={clearBookmark}
//                 style={styles.bookmarkChipBtn}
//               >
//                 <Ionicons name="close" size={14} color="#fff" />
//               </TouchableOpacity>
//             </View>
//           </Animated.View>
//         </View>
//       )}

//       <FontSizePickerModal visible={false} onClose={() => {}} />

//       {bookmarkOffsetY != null && (
//         <TouchableOpacity style={styles.jumpBtn} onPress={jumpToBookmark}>
//           <Ionicons name="flag" size={22} color="#fff" />
//         </TouchableOpacity>
//       )}

//       {showArrowUp && (
//         <ArrowUp
//           scrollToTop={() =>
//             flatListRef.current?.scrollToOffset({ offset: 0, animated: true })
//           }
//         />
//       )}
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1 },

//   heroSection: {
//     paddingHorizontal: 24,
//     paddingBottom: 3,
//     paddingTop: 10,
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: 20,
//   },
//   headerText: {
//     color: "white",
//     fontSize: 12,
//     fontWeight: "700",
//     letterSpacing: 1,
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 16,
//   },
//   heroTitle: {
//     fontSize: 32,
//     fontWeight: "900",
//     lineHeight: 40,
//     marginBottom: 24,
//     letterSpacing: -0.8,
//   },
//   articleMetaContainer: {
//     flexDirection: "column",
//     marginBottom: 32,
//   },
//   articleMetaSupcontainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 12,
//   },
//   nameDateTime: {
//     flexDirection: "column",
//     gap: 2,
//   },
//   nameDateTimeSubcontainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 15,
//   },
//   authorAvatar: {
//     borderWidth: 1,
//     borderRadius: 99,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   authorName: {
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   publishDate: {
//     fontSize: 14,
//     marginTop: 5,
//   },
//   metaRight: {},
//   readTime: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 4,
//     marginRight: 5,
//     marginTop: 5,
//   },
//   readTimeText: {
//     fontSize: 14,
//     fontWeight: "500",
//   },

//   contentSection: { flex: 1 },

//   border: {
//     height: 2,
//     marginHorizontal: 15,
//     borderRadius: 2,
//     marginTop: 15,
//     overflow: "hidden",
//   },
//   borderFill: { height: "100%", borderRadius: 2 },

//   articleContent: { paddingHorizontal: 30 },

//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 40,
//   },
//   loadingCard: {
//     alignItems: "center",
//     gap: 20,
//     padding: 40,
//     borderRadius: 20,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 12,
//     elevation: 4,
//   },
//   errorContainer: {
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 40,
//   },
//   errorTitle: {
//     fontSize: 24,
//     fontWeight: "700",
//     marginTop: 20,
//     marginBottom: 8,
//     textAlign: "center",
//   },
//   errorSubtitle: { fontSize: 16, textAlign: "center", lineHeight: 24 },

//   footerContainer: {
//     flexDirection: "column",
//     borderTopWidth: 0.5,
//     paddingTop: 20,
//     paddingBottom: 40,
//     paddingHorizontal: 24,
//   },

//   // Bookmark overlay (absolute, top=0 then animated translateY)
//   bookmarkLine: {
//     position: "absolute",
//     left: 0,
//     right: 0,
//     top: 0,
//     height: 2,
//     opacity: 0.9,
//   },
//   bookmarkChipWrap: {
//     position: "absolute",
//     right: 10,
//     top: 0,
//   },
//   bookmarkChip: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 16,
//     borderWidth: 1,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   bookmarkChipText: {
//     color: "#fff",
//     fontSize: 12,
//     fontWeight: "700",
//   },
//   bookmarkChipBtn: {
//     paddingHorizontal: 4,
//     paddingVertical: 2,
//   },

//   // Quick jump floating button
//   jumpBtn: {
//     position: "absolute",
//     bottom: 28,
//     right: 24,
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: Colors.universal.third,
//     shadowColor: "#000",
//     shadowOpacity: 0.2,
//     shadowOffset: { width: 0, height: 3 },
//     shadowRadius: 6,
//     elevation: 4,
//   },
// });

import { Colors } from "@/constants/Colors";
import { NewsArticlesType } from "@/constants/Types";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNewsArticles } from "@/hooks/useNewsArticles";
import { useFontSizeStore } from "@/stores/fontSizeStore";
import { formattedDate } from "@/utils/formate";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  Linking,
  type GestureResponderEvent,
  Animated,
  Alert,
} from "react-native";
import Markdown from "react-native-markdown-display";
import { SafeAreaView } from "react-native-safe-area-context";
import FontSizePickerModal from "./FontSizePickerModal";
import HeaderLeftBackButton from "./HeaderLeftBackButton";
import { LoadingIndicator } from "./LoadingIndicator";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import ArrowUp from "./ArrowUp";
import { useRefreshFavorites } from "@/stores/refreshFavoriteStore";
import {
  isNewsArticleFavorited,
  toggleNewsArticleFavorite,
} from "@/utils/favorites";

type Row = { key: "content" };
type SavedBookmark = { offsetY: number; addedAt: number };

export default function NewsArticleDetailScreen({
  articleId,
}: {
  articleId: number;
}) {
  const { fontSize, lineHeight } = useFontSizeStore();
  const colorScheme = useColorScheme() ?? "light";
  const { t } = useTranslation();
  const { lang, rtl } = useLanguage();
  const { fetchNewsArticleById } = useNewsArticles(lang);
  const { triggerRefreshFavorites } = useRefreshFavorites();

  const [article, setArticle] = useState<NewsArticlesType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Favorite state + toggle
  const [isFavorite, setIsFavorite] = useState(false);
  const onPressToggle = useCallback(async () => {
    if (!articleId) return;
    try {
      const newFavStatus = await toggleNewsArticleFavorite(articleId, lang);
      setIsFavorite(newFavStatus);
      triggerRefreshFavorites();
    } catch (e) {
      console.log(e);
    }
  }, [articleId, triggerRefreshFavorites]);

  // Font-size modal visibility
  const [fontModalVisible, setFontModalVisible] = useState(false);

  // Absolute bookmark offset (content coords)
  const [bookmarkOffsetY, setBookmarkOffsetY] = useState<number | null>(null);

  // For converting pageY to local content Y
  const containerRef = useRef<View>(null);
  const [containerTop, setContainerTop] = useState(0);

  // Scroll handling (native, no re-renders)
  const flatListRef = useRef<Animated.FlatList<Row>>(null);
  const scrollYAV = useRef(new Animated.Value(0)).current;
  const bookmarkOffsetAV = useRef(new Animated.Value(0)).current;
  const neg14AV = useRef(new Animated.Value(-14)).current;
  const lastScrollYRef = useRef(0);

  const [showArrowUp, setShowArrowUp] = useState(false);
  const showArrowUpRef = useRef(false);

  const bookmarkKey = (id: number) => `bookmark:newsArticle:${id}:${lang}`;

  useEffect(() => {
    const id = scrollYAV.addListener(({ value }) => {
      lastScrollYRef.current = value;
      const show = value > 200;
      if (show !== showArrowUpRef.current) {
        showArrowUpRef.current = show;
        setShowArrowUp(show);
      }
    });
    return () => {
      scrollYAV.removeListener(id);
    };
  }, [scrollYAV]);

  useEffect(() => {
    bookmarkOffsetAV.setValue(bookmarkOffsetY ?? 0);
  }, [bookmarkOffsetY, bookmarkOffsetAV]);

  const handleContainerLayout = useCallback(() => {
    containerRef.current?.measureInWindow?.((_, y) => setContainerTop(y ?? 0));
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!articleId) {
        if (alive) {
          setError(t("errorLoadingArticle"));
          setIsLoading(false);
        }
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const fetched = await fetchNewsArticleById(articleId);
        if (!alive) return;
        if (fetched) setArticle(fetched);
        else setError(t("errorLoadingArticle"));
      } catch (err: any) {
        console.error("Error loading news article:", err);
        if (alive) setError(err?.message || t("errorLoadingArticle"));
      } finally {
        if (alive) setIsLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [articleId, lang]);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(bookmarkKey(articleId));
        if (!raw) return;
        const saved: SavedBookmark = JSON.parse(raw);
        if (typeof saved?.offsetY === "number")
          setBookmarkOffsetY(saved.offsetY);
      } catch (e) {
        console.log("Failed to load bookmark", e);
      }
    })();
  }, [articleId, lang]);

  const saveBookmark = useCallback(
    async (offsetY: number) => {
      setBookmarkOffsetY(offsetY);
      try {
        const payload: SavedBookmark = { offsetY, addedAt: Date.now() };
        await AsyncStorage.setItem(
          bookmarkKey(articleId),
          JSON.stringify(payload)
        );
      } catch (e) {
        console.log("Failed to save bookmark", e);
      }
    },
    [articleId, lang]
  );

  const clearBookmark = useCallback(() => {
    Alert.alert(
      t("remove", "Remove"),
      t("bookmarkRemove", "Remove this bookmark?"),
      [
        { text: t("cancel", "Cancel"), style: "cancel" },
        {
          text: t("remove", "Remove"),
          style: "destructive",
          onPress: async () => {
            try {
              setBookmarkOffsetY(null);
              await AsyncStorage.removeItem(bookmarkKey(articleId));
            } catch (e) {
              console.log("Failed to clear bookmark", e);
            }
          },
        },
      ],
      { cancelable: true }
    );
  }, [articleId, lang, t]);

  const jumpToBookmark = useCallback(() => {
    if (bookmarkOffsetY == null) return;
    const target = Math.max(bookmarkOffsetY - 200, 0);
    flatListRef.current?.scrollToOffset({ offset: target, animated: true });
  }, [bookmarkOffsetY]);

  // Initialize favorite status on mount/article change
  useEffect(() => {
    (async () => {
      try {
        setIsFavorite(await isNewsArticleFavorited(articleId));
      } catch {
        console.log("error");
      }
    })();
  }, [articleId]);

  // Long press to set bookmark
  const handleLongPress = useCallback(
    (e: GestureResponderEvent) => {
      const { pageY } = e.nativeEvent as any;
      const offsetY = lastScrollYRef.current + (pageY - containerTop);

      if (bookmarkOffsetY != null) {
        Alert.alert(
          t("replace"),
          t("bookmarkReplaceQuestion"),
          [
            { text: t("cancel"), style: "cancel" },
            {
              text: t("replace", "Replace"),
              style: "destructive",
              onPress: () => saveBookmark(offsetY),
            },
          ],
          { cancelable: true }
        );
        return;
      }
      saveBookmark(offsetY);
    },
    [bookmarkOffsetY, containerTop, saveBookmark, t]
  );

  const mdRules = useMemo(() => {
    return {
      paragraph: (node: any, children: any) => (
        <Text
          key={node?.key}
          style={{
            color: Colors[colorScheme].text,
            fontSize,
            lineHeight: lineHeight * 1.6,
            marginBottom: 20,
            fontFamily: "System",
          }}
        >
          {children}
        </Text>
      ),
      heading1: (node: any, children: any) => (
        <Text
          key={node?.key}
          style={{
            color: Colors[colorScheme].text,
            fontSize: fontSize * 1.8,
            fontWeight: "800",
            marginBottom: 20,
            marginTop: 32,
            letterSpacing: -0.5,
          }}
        >
          {children}
        </Text>
      ),
      heading2: (node: any, children: any) => (
        <Text
          key={node?.key}
          style={{
            color: Colors[colorScheme].text,
            fontSize: fontSize * 1.5,
            fontWeight: "700",
            marginBottom: 16,
            marginTop: 28,
            letterSpacing: -0.3,
          }}
        >
          {children}
        </Text>
      ),
      em: (node: any, children: any) => (
        <Text
          key={node?.key}
          style={{
            color: Colors[colorScheme].defaultIcon,
            fontStyle: "italic",
          }}
        >
          {children}
        </Text>
      ),
      strong: (node: any, children: any) => (
        <Text
          key={node?.key}
          style={{ color: Colors[colorScheme].text, fontWeight: "700" }}
        >
          {children}
        </Text>
      ),
      link: (node: any, children: any) => (
        <Text
          key={node?.key}
          style={{
            color: Colors[colorScheme].tint,
            textDecorationLine: "underline",
          }}
          onPress={() =>
            node?.attributes?.href && Linking.openURL(node.attributes.href)
          }
          suppressHighlighting
        >
          {children}
        </Text>
      ),
      blockquote: (node: any, children: any) => (
        <View
          key={node?.key}
          style={{
            backgroundColor: "transparent",
            borderLeftColor: Colors[colorScheme].tint,
            borderLeftWidth: 4,
            paddingLeft: 20,
            paddingVertical: 16,
            marginVertical: 24,
          }}
        >
          <Text
            style={{ color: Colors[colorScheme].text, fontStyle: "italic" }}
          >
            {children}
          </Text>
        </View>
      ),
      image: (node: any) => {
        const uri = node?.attributes?.src;
        if (!uri) return null;
        return (
          <Image
            key={node.key}
            source={{ uri }}
            recyclingKey={uri}
            cachePolicy="disk"
            style={{ width: "100%", height: 200, marginVertical: 12 }}
            contentFit="cover"
            transition={0}
          />
        );
      },
      code_inline: (node: any) => (
        <Text
          key={node?.key}
          style={{
            backgroundColor: Colors[colorScheme].tint + "15",
            color: Colors[colorScheme].tint,
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 4,
            fontSize: fontSize * 0.9,
          }}
        >
          {node?.content}
        </Text>
      ),
    };
  }, [colorScheme, fontSize, lineHeight]);

  const renderItem = useCallback(
    ({ item }: { item: Row }) => {
      if (!article) return null;
      return (
        <Pressable
          style={styles.contentSection}
          delayLongPress={350}
          onLongPress={handleLongPress}
        >
          <View style={styles.articleContent}>
            <Markdown rules={mdRules}>{article.content}</Markdown>
          </View>

          {!!article.source && (
            <View
              style={[
                styles.footerContainer,
                {
                  borderColor: Colors[colorScheme].border,
                  alignItems: rtl ? "flex-end" : "flex-start",
                },
              ]}
            >
              <ThemedText
                style={{ fontWeight: "600", fontSize, marginBottom: 5 }}
              >
                {t("source")}
              </ThemedText>
              <Markdown
                rules={{
                  paragraph: (node: any, children: any) => (
                    <Text
                      key={node?.key}
                      style={{
                        color: Colors[colorScheme].text,
                        fontSize: 14,
                        textAlign: "justify",
                      }}
                    >
                      {children}
                    </Text>
                  ),
                  link: (node: any, children: any) => (
                    <Text
                      key={node?.key}
                      style={{
                        color: Colors[colorScheme].tint,
                        textDecorationLine: "underline",
                        fontSize: 14,
                      }}
                      onPress={() =>
                        node?.attributes?.href &&
                        Linking.openURL(node.attributes.href)
                      }
                      suppressHighlighting
                    >
                      {children}
                    </Text>
                  ),
                }}
              >
                {article.source}
              </Markdown>
            </View>
          )}
        </Pressable>
      );
    },
    [article, colorScheme, fontSize, mdRules, lang]
  );

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
      <ThemedView
        style={[
          {
            flex: 1,
            backgroundColor: Colors[colorScheme].background,
            justifyContent: "center",
          },
        ]}
      >
        <View style={styles.errorContainer}>
          <Ionicons
            name="newspaper-outline"
            size={80}
            color={Colors[colorScheme].defaultIcon}
          />
        </View>
        <Text style={[styles.errorTitle, { color: Colors[colorScheme].text }]}>
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
        {!!error && (
          <Text
            style={[
              styles.errorSubtitle,
              { color: Colors[colorScheme].defaultIcon },
            ]}
          >
            {error}
          </Text>
        )}
      </ThemedView>
    );
  }

  const header = (
    <View style={styles.heroSection}>
      <View style={styles.header}>
        <HeaderLeftBackButton />
        <Text
          style={[
            styles.headerText,
            { backgroundColor: Colors.universal.third },
          ]}
        >
          {t("newsArticleScreenTitle").toUpperCase()}
        </Text>
      </View>

      <Text style={[styles.heroTitle, { color: Colors[colorScheme].text }]}>
        {article.title}
      </Text>

      <View style={styles.articleMetaContainer}>
        <View style={styles.articleMetaSupcontainer}>
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
            ) : article.scholar_type === 3 ? (
              <Image
                source={require("@/assets/images/3.png")}
                style={{ width: 70, height: 70, margin: 0 }}
              />
            ) : null}
          </View>

          <View style={styles.nameDateTime}>
            <Text
              style={[styles.authorName, { color: Colors[colorScheme].text }]}
            >
              {article.author}
            </Text>
            <View style={styles.nameDateTimeSubcontainer}>
              <Text
                style={[
                  styles.publishDate,
                  { color: Colors.universal.grayedOut },
                ]}
              >
                {formattedDate(article.created_at)}
              </Text>
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

            {/* ACTIONS: Favorite + Font size */}
            <View style={[styles.actionsRow]}>
              <TouchableOpacity
                onPress={() => setFontModalVisible(true)}
                accessibilityRole="button"
                accessibilityLabel={t("changeFontSize")}
                style={[styles.actionBtn, {}]}
              >
                <ThemedText type="subtitle" style={[styles.actionBtnText, {}]}>
                  Aa
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onPressToggle}
                accessibilityRole="button"
                accessibilityLabel={
                  isFavorite ? t("removeFromFavorites") : t("addToFavorites")
                }
                style={[styles.actionBtn, {}]}
              >
                <Ionicons
                  name={isFavorite ? "star" : "star-outline"}
                  size={25}
                  color={
                    isFavorite
                      ? Colors.universal.favorite
                      : Colors[colorScheme].defaultIcon
                  }
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      <View
        style={[styles.border, { backgroundColor: Colors[colorScheme].border }]}
      >
        <View
          style={[
            styles.borderFill,
            { width: "100%", backgroundColor: Colors[colorScheme].tint },
          ]}
        />
      </View>
    </View>
  );

  const data: Row[] = [{ key: "content" }];

  // translateY = bookmarkOffset - scrollY
  const translateY = Animated.add(
    bookmarkOffsetAV,
    Animated.multiply(scrollYAV, -1)
  );
  const chipTranslateY = Animated.add(translateY, neg14AV);

  return (
    <SafeAreaView
      ref={containerRef}
      onLayout={handleContainerLayout}
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme].background },
      ]}
      edges={["top"]}
    >
      <Animated.FlatList<Row>
        ref={flatListRef}
        data={data}
        keyExtractor={(item) => item.key}
        renderItem={renderItem}
        ListHeaderComponent={header}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollYAV } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        windowSize={3}
      />

      {/* Bookmark overlay (no re-renders on scroll) */}
      {bookmarkOffsetY !== null && (
        <View pointerEvents="box-none" style={StyleSheet.absoluteFillObject}>
          <Animated.View
            pointerEvents="none"
            style={[
              styles.bookmarkLine,
              { backgroundColor: Colors.universal.third },
              { transform: [{ translateY }] },
            ]}
          />
          <Animated.View
            style={[
              styles.bookmarkChipWrap,
              { transform: [{ translateY: chipTranslateY }] },
            ]}
          >
            <View
              style={[
                styles.bookmarkChip,
                {
                  backgroundColor: Colors.universal.third,
                  borderColor: Colors[colorScheme].background,
                },
              ]}
            >
              <Ionicons name="bookmark" size={12} color="#fff" />
              <Text style={styles.bookmarkChipText}>{t("bookmark")}</Text>
              <TouchableOpacity
                onPress={clearBookmark}
                style={styles.bookmarkChipBtn}
              >
                <Ionicons name="close" size={14} color="#fff" />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      )}

      {/* Font-size picker modal */}
      <FontSizePickerModal
        visible={fontModalVisible}
        onClose={() => setFontModalVisible(false)}
      />

      {bookmarkOffsetY != null && (
        <TouchableOpacity style={styles.jumpBtn} onPress={jumpToBookmark}>
          <Ionicons name="flag" size={22} color="#fff" />
        </TouchableOpacity>
      )}

      {showArrowUp && (
        <ArrowUp
          scrollToTop={() =>
            flatListRef.current?.scrollToOffset({ offset: 0, animated: true })
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  heroSection: {
    paddingHorizontal: 24,
    paddingBottom: 3,
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
  articleMetaContainer: {
    flexDirection: "column",
    marginBottom: 32,
  },
  articleMetaSupcontainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  nameDateTime: {
    flexDirection: "column",
    gap: 2,
    flex: 1,
  },
  nameDateTimeSubcontainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
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
    marginTop: 5,
  },
  readTime: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginRight: 5,
    marginTop: 5,
  },
  readTimeText: {
    fontSize: 14,
    fontWeight: "500",
  },

  // NEW: actions
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 8,
    gap: 10,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  actionBtnText: {
    fontSize: 26,
    fontWeight: "600",
  },

  contentSection: { flex: 1 },

  border: {
    height: 2,
    marginHorizontal: 15,
    borderRadius: 2,
    marginTop: 15,
    overflow: "hidden",
  },
  borderFill: { height: "100%", borderRadius: 2 },

  articleContent: { paddingHorizontal: 30 },

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
  errorContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 8,
    textAlign: "center",
  },
  errorSubtitle: { fontSize: 16, textAlign: "center", lineHeight: 24 },

  footerContainer: {
    flexDirection: "column",
    borderTopWidth: 0.5,
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },

  // Bookmark overlay
  bookmarkLine: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 2,
    opacity: 0.9,
  },
  bookmarkChipWrap: {
    position: "absolute",
    right: 10,
    top: 0,
  },
  bookmarkChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  bookmarkChipText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  bookmarkChipBtn: {
    paddingHorizontal: 4,
    paddingVertical: 2,
  },

  // Quick jump floating button
  jumpBtn: {
    position: "absolute",
    bottom: 28,
    right: 24,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.universal.third,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
  },
});
