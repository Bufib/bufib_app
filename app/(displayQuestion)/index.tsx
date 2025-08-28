// import { View, StyleSheet, useColorScheme } from "react-native";
// import React, { useCallback, useEffect, useState } from "react";
// import { useLocalSearchParams } from "expo-router";
// import { Stack } from "expo-router";
// import RenderQuestion from "@/components/RenderQuestion";
// import { Colors } from "@/constants/Colors";
// import Ionicons from "@expo/vector-icons/Ionicons";
// import { removeFavoriteToast, addFavoriteToast } from "@/constants/messages";
// import { useRefreshFavorites } from "@/stores/refreshFavoriteStore";
// import FontSizePickerModal from "@/components/FontSizePickerModal";
// import { router } from "expo-router";
// import AntDesign from "@expo/vector-icons/AntDesign";
// import { toggleQuestionFavorite } from "@/utils/bufibDatabase";
// import { useAtom } from "jotai";

// export default function index() {
//   const { category, subcategory, questionId, questionTitle } =
//     useLocalSearchParams<{
//       category: string;
//       subcategory: string;
//       questionId: string;
//       questionTitle: string;
//     }>();
//   const [isFavorite, setIsFavorite] = useState(false);
//   const { triggerRefreshFavorites } = useRefreshFavorites();
//   const colorScheme = useColorScheme() || "light";
//   const [modalVisible, setModalVisible] = useState(false);

//   // ★ toggle handler updates local state
//   const onPressToggle = useCallback(async () => {
//     if (!questionId) return;

//     try {
//       const newFavStatus = await toggleQuestionFavorite(parseInt(questionId));
//       setIsFavorite(newFavStatus);
//     } catch (error) {
//       console.log(error);
//     }
//   }, [questionId]);

//   // // Check if question is favorite
//   // useEffect(() => {
//   //   const checkIfFavorite = async () => {
//   //     try {
//   //       // Ensure `questionId` is a valid number before processing
//   //       const id = parseInt(questionId, 10);
//   //       if (!isNaN(id)) {
//   //         const result = await isQuestionInFavorite(id);
//   //         console.log(result);
//   //         setIsFavorite(result);
//   //       } else {
//   //         console.error("Invalid questionId:", questionId);
//   //       }
//   //     } catch (error) {
//   //       console.error("Error checking favorite status:", error);
//   //     }
//   //   };

//   //   checkIfFavorite();
//   // }, [questionId]);

//   // const handleAddFavorite = async () => {
//   //   try {
//   //     const id = parseInt(questionId, 10);
//   //     if (!isNaN(id)) {
//   //       await addQuestionToFavorite(id);
//   //       setIsFavorite(true);
//   //       addFavoriteToast();
//   //       triggerRefreshFavorites();
//   //     }
//   //   } catch (error) {
//   //     console.error("Error adding question to favorites:", error);
//   //   }
//   // };

//   // const handleRemoveFavorite = async () => {
//   //   try {
//   //     const id = parseInt(questionId, 10);
//   //     if (!isNaN(id)) {
//   //       await removeQuestionFromFavorite(id);
//   //       setIsFavorite(false);
//   //       removeFavoriteToast();
//   //       triggerRefreshFavorites();
//   //     }
//   //   } catch (error) {
//   //     console.error("Error removing question from favorites:", error);
//   //   }
//   // };

//   return (
//     <View style={styles.container}>
//       <Stack.Screen
//         options={{
//           title: questionTitle,

//           headerRight: () => (
//             <View style={styles.headerRightContainer}>
//               <Ionicons
//                 name="text"
//                 size={25}
//                 color={colorScheme === "dark" ? "#fff" : "#000"}
//                 onPress={() => setModalVisible(true)} // Open modal
//               />
//               {isFavorite ? (
//                 <AntDesign
//                   name="star"
//                   size={32}
//                   color={Colors.universal.favorite}
//                   onPress={() => onPressToggle()}
//                 />
//               ) : (
//                 <AntDesign
//                   name="staro"
//                   size={32}
//                   color={Colors[colorScheme].defaultIcon}
//                   onPress={() => onPressToggle()}
//                 />
//               )}
//             </View>
//           ),
//           headerLeft: () => {
//             return (
//               <Ionicons
//                 name="chevron-back-outline"
//                 size={30}
//                 color={colorScheme === "dark" ? "#d0d0c0" : "#000"}
//                 style={{ marginLeft: -16 }}
//                 onPress={() => router.back()}
//               />
//             );
//           },
//         }}
//       />

//       <RenderQuestion
//         category={category}
//         subcategory={subcategory}
//         questionId={parseInt(questionId, 10)}
//       />
//       <FontSizePickerModal
//         visible={modalVisible}
//         onClose={() => setModalVisible(false)}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   headerRightContainer: {
//     flexDirection: "row",
//     flexWrap: "nowrap",
//     alignItems: "center",
//     gap: 10,
//   },
//   noInternet: {
//     padding: 15,
//   },
//   noInternetText: {
//     textAlign: "center",
//     fontSize: 16,
//     fontWeight: "700",
//   },
// });

import {
  View,
  StyleSheet,
  useColorScheme,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { useLocalSearchParams } from "expo-router";
import { Stack } from "expo-router";
import RenderQuestion from "@/components/RenderQuestion";
import { Colors } from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { removeFavoriteToast, addFavoriteToast } from "@/constants/messages";
import { useRefreshFavorites } from "@/stores/refreshFavoriteStore";
import FontSizePickerModal from "@/components/FontSizePickerModal";
import { router } from "expo-router";
import {
  isQuestionInFavorite,
  toggleQuestionFavorite,
} from "../../db/queries/questions";

export default function Question() {
  const { category, subcategory, questionId, questionTitle } =
    useLocalSearchParams<{
      category: string;
      subcategory: string;
      questionId: string;
      questionTitle: string;
    }>();

  const parsedId = parseInt(questionId ?? "", 10);
  const [isFavorite, setIsFavorite] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const colorScheme = useColorScheme() || "light";
  const { triggerRefreshFavorites } = useRefreshFavorites();

  // 1) On mount, check if this question is already favorited.
  // Check if question is favorite
  useEffect(() => {
    const checkIfFavorite = async () => {
      try {
        // Ensure `questionId` is a valid number before processing
        const id = parseInt(questionId, 10);
        if (!isNaN(id)) {
          const result = await isQuestionInFavorite(id);
          console.log(result);
          setIsFavorite(result);
        } else {
          console.error("Invalid questionId:", questionId);
        }
      } catch (error) {
        console.error("Error checking favorite status:", error);
      }
    };

    checkIfFavorite();
  }, [questionId]);

  // 2) Toggle handler: update state based on result of toggleQuestionFavorite.
  const onPressToggle = useCallback(async () => {
    if (isNaN(parsedId)) {
      return;
    }
    // Optionally, you could show a brief loading indicator here.
    try {
      const newFavStatus = await toggleQuestionFavorite(parsedId);
      setIsFavorite(newFavStatus);
      if (newFavStatus) {
        addFavoriteToast();
      } else {
        removeFavoriteToast();
      }
      triggerRefreshFavorites();
    } catch (error) {
      console.log("Error toggling favorite:", error);
    }
  }, [parsedId, triggerRefreshFavorites]);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: questionTitle,

          headerRight: () => {
            return (
              <View style={styles.headerRightContainer}>
                <Ionicons
                  name="text"
                  size={25}
                  color={colorScheme === "dark" ? "#fff" : "#000"}
                  onPress={() => setModalVisible(true)}
                />
                {isFavorite ? (
                  <AntDesign
                    name="star"
                    size={32}
                    color={Colors.universal.favorite}
                    onPress={onPressToggle}
                  />
                ) : (
                  <AntDesign
                    name="staro"
                    size={32}
                    color={Colors[colorScheme].defaultIcon}
                    onPress={onPressToggle}
                  />
                )}
              </View>
            );
          },

          headerLeft: () => (
            <Ionicons
              name="chevron-back-outline"
              size={30}
              color={colorScheme === "dark" ? "#d0d0c0" : "#000"}
              style={{ marginLeft: -16 }}
              onPress={() => router.back()}
            />
          ),
        }}
      />

      <RenderQuestion
        category={category}
        subcategory={subcategory}
        questionId={parsedId}
      />
      <FontSizePickerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRightContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginRight: 10,
  },
});
