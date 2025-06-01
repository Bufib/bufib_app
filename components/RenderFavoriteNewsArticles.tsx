// import {
//   StyleSheet,
//   View,
//   ScrollView,
//   useColorScheme,
//   TouchableOpacity,
//   Text,
// } from "react-native";
// import React, { useEffect, useState } from "react";
// import { getFavoriteNewsArticle } from "@/utils/favorites";
// import { useNewsArticles } from "@/hooks/useNewsArticles"; // wherever you put your hook
// import { Colors } from "@/constants/Colors";
// import { ThemedText } from "@/components/ThemedText";
// import { NewsArticlesType } from "@/constants/Types";
// import Entypo from "@expo/vector-icons/Entypo";
// import { router } from "expo-router";
// import { useAtom } from 'jotai';
// const FavoriteNewsArticles = () => {
//   const [articleIds, setArticleIds] = useState<number[]>([]);
//   const [articles, setArticles] = useState<NewsArticlesType[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const { fetchNewsArticleById } = useNewsArticles();
//   const colorScheme = useColorScheme() || "light";

//   useEffect(() => {
//     const loadFavorites = async () => {
//       try {
//         setIsLoading(true);
//         const ids = (await getFavoriteNewsArticle()) || [];
//         setArticleIds(ids);
//         const fetched = await Promise.all(
//           ids.map((id) => fetchNewsArticleById(id))
//         );
//         // filter out any nulls
//         setArticles(fetched.filter((a): a is NewsArticlesType => !!a));
//         setError(null);
//       } catch (err) {
//         console.error(err);
//         setError("Could not load favorite articles.");
//         setArticles([]);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadFavorites();
//   }, []);

//   if (isLoading) {
//     return (
//       <View style={styles.container}>
//         <Text>Loading favorites…</Text>
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.container}>
//         <Text>{error}</Text>
//       </View>
//     );
//   }

//   return (
//     <ScrollView
//       style={[
//         styles.scrollView,
//         { backgroundColor: Colors[colorScheme].background },
//       ]}
//       contentContainerStyle={styles.scrollContent}
//     >
//       {articles.length > 0 ? (
//         articles.map((article) => (
//           <TouchableOpacity
//             key={article.id}
//             style={[
//               styles.item,
//               {
//                 backgroundColor: Colors[colorScheme].contrast,
//                 borderColor: Colors[colorScheme].border,
//               },
//             ]}
//             onPress={() => {
//               router.push({
//                 pathname: "/(newsArticle)",
//                 params: {
//                   articleId: article.id.toString(),
//                 },
//               });
//             }}
//           >
//             <ThemedText style={styles.title}>{article.title}</ThemedText>
//             <Entypo
//               name="chevron-thin-right"
//               size={24}
//               color={Colors[colorScheme].defaultIcon}
//             />
//           </TouchableOpacity>
//         ))
//       ) : (
//         <Text>No favorite articles yet.</Text>
//       )}
//     </ScrollView>
//   );
// };

// export default FavoriteNewsArticles;

// const styles = StyleSheet.create({
//   scrollView: {
//     flex: 1,
//     paddingTop: 10,
//   },
//   scrollContent: {
//     gap: 10,
//   },
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//   },
//   item: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     borderTopWidth: 0.5,
//     borderBottomWidth: 0.5,
//     padding: 15,
//     borderRadius: 4,
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: "400",
//   },
// });

import {
    StyleSheet,
    View,
    ScrollView,
    useColorScheme,
    TouchableOpacity,
    Text,
  } from "react-native";
  import React, { useEffect, useState, useCallback } from "react";
  import { getFavoriteNewsArticle } from "@/utils/favorites";
  import { useNewsArticles } from "@/hooks/useNewsArticles";
  import { Colors } from "@/constants/Colors";
  import { ThemedText } from "@/components/ThemedText";
  import { NewsArticlesType } from "@/constants/Types";
  import Entypo from "@expo/vector-icons/Entypo";
  import { router } from "expo-router";
  import { useRefreshFavorites } from "@/stores/refreshFavoriteStore";
  
  const RenderFavoriteNewsArticles = () => {
    const [articles, setArticles] = useState<NewsArticlesType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { fetchNewsArticleById } = useNewsArticles();
    const colorScheme = useColorScheme() || "light";
    const { refreshTriggerFavorites } = useRefreshFavorites();
  
    
    const loadFavorites = useCallback(async () => {
      console.log(
        "FavoriteNewsArticles: Reloading favorites due to trigger change or mount."
      );
      try {
        setIsLoading(true);
        const ids = (await getFavoriteNewsArticle()) || [];
        // setArticleIds(ids); // You might not need to store ids in state separately
        const fetched = await Promise.all(
          ids.map((id) => fetchNewsArticleById(id))
        );
        setArticles(fetched.filter((a): a is NewsArticlesType => !!a));
        setError(null);
      } catch (err) {
        console.error("Error in loadFavorites:", err);
        setError("Could not load favorite articles.");
        setArticles([]);
      } finally {
        setIsLoading(false);
      }
    }, []);
  
    useEffect(() => {
      loadFavorites();
    }, [refreshTriggerFavorites, loadFavorites]);
  
    if (isLoading) {
      return (
        <View style={styles.container}>
          <ThemedText>Loading favorites…</ThemedText>
        </View>
      );
    }
  
    if (error) {
      return (
        <View style={styles.container}>
          <ThemedText>{error}</ThemedText>
        </View>
      );
    }
  
    return (
      <ScrollView
        style={[
          styles.scrollView,
          { backgroundColor: Colors[colorScheme].background },
        ]}
        contentContainerStyle={styles.scrollContent}
      >
        {articles.length > 0 ? (
          articles.map((article) => (
            <TouchableOpacity
              key={article.id}
              style={[
                styles.item,
                {
                  backgroundColor: Colors[colorScheme].contrast,
                  borderColor: Colors[colorScheme].border,
                },
              ]}
              onPress={() => {
                router.push({
                  pathname: "/(newsArticle)", // Ensure this route exists and is configured
                  params: {
                    articleId: article.id.toString(),
                  },
                });
              }}
            >
              <ThemedText style={styles.title}>{article.title}</ThemedText>
              <Entypo
                name="chevron-thin-right"
                size={24}
                color={Colors[colorScheme].defaultIcon}
              />
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.container}>
            <ThemedText>No favorite articles yet.</ThemedText>
          </View>
        )}
      </ScrollView>
    );
  };
  
  export default RenderFavoriteNewsArticles;
  
  const styles = StyleSheet.create({
    scrollView: {
      flex: 1,
      paddingTop: 10,
    },
    scrollContent: {
      gap: 10,
      paddingBottom: 20, // Added padding for better scroll
    },
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    item: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderTopWidth: 0.5,
      borderBottomWidth: 0.5,
      padding: 15,
      borderRadius: 4,
    },
    title: {
      fontSize: 16,
      fontWeight: "400",
      flex: 1,
      marginRight: 10,
    },
  });
  