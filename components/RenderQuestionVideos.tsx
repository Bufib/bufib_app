// import React from "react";
// import { StyleSheet, View, useColorScheme, FlatList } from "react-native";
// import { ThemedView } from "@/components/ThemedView";
// import { ThemedText } from "@/components/ThemedText";
// import { AdvancedVideo } from "cloudinary-react-native";
// import { CLOUD_NAME } from "@/utils/cloudinary";
// import { Colors } from "@/constants/Colors"; // Corrected import syntax
// import { useLocalSearchParams } from "expo-router";
// import { useVideos } from "@/hooks/useVideos"; // Import useVideos hook
// import { useLanguage } from "@/contexts/LanguageContext"; // Import useLanguage hook
// import { LoadingIndicator } from "@/components/LoadingIndicator"; // Import LoadingIndicator

// export default function RenderQuestionVideos() {
//   // Get categoryId (which is actually the video_category string) and name from the navigation parameters
//   const { categoryName } = useLocalSearchParams<{ categoryName: string }>();

//   const colorScheme = useColorScheme() || "light";
//   const theme = Colors[colorScheme];
//   const { language } = useLanguage(); // Get the current language

//   // Use the useVideos hook to fetch videos based on the current language
//   const { videosByCategory, isLoading, error } = useVideos(language);

//   // Filter videos for the specific category using the string categoryName directly
//   // Assuming video.video_category in your VideoType is the string category name
//   const videosForCategory = videosByCategory[categoryName] || []; // Filter videos based on the string categoryId

//   if (isLoading) {
//     return (
//       <ThemedView style={styles.centeredContainer}>
//         <LoadingIndicator size={"large"} />
//       </ThemedView>
//     );
//   }

//   if (error) {
//     return (
//       <ThemedView style={styles.centeredContainer}>
//         <ThemedText style={{ color: theme.error }} type="subtitle">
//           Error loading videos: {error.message}
//         </ThemedText>
//       </ThemedView>
//     );
//   }

//   if (!videosForCategory || videosForCategory.length === 0) {
//     return (
//       <ThemedView style={styles.centeredContainer}>
//         <ThemedText type="subtitle">
//           No videos found for this category.
//         </ThemedText>
//       </ThemedView>
//     );
//   }

//   return (
//     <ThemedView
//       style={[styles.container, { backgroundColor: theme.background }]}
//     >
//       <FlatList
//         data={videosForCategory}
//         keyExtractor={(item) => item.id.toString()}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.flatListContentContainer}
//         renderItem={({ item }) => {
//           // Construct the video URL using the video's public_id
//           const videoUrl = `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/sp_auto/${item.public_id}.m3u8`;
//           return (
//             <View
//               style={[
//                 styles.card,
//                 { backgroundColor: theme.contrast, shadowColor: theme.shadow },
//               ]}
//             >
//               <ThemedText style={styles.videoTitle}>{item.title}</ThemedText>
//               <AdvancedVideo videoUrl={videoUrl} videoStyle={styles.video} />
//             </View>
//           );
//         }}
//       />
//     </ThemedView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//   },
//   centeredContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   flatListContentContainer: {
//     paddingBottom: 20, // Add some padding at the bottom of the list
//   },
//   categoryTitle: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 20,
//     textAlign: "center",
//   },
//   card: {
//     borderRadius: 12,
//     overflow: "hidden",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//     marginBottom: 20, // Space between video cards
//   },
//   video: {
//     width: "100%",
//     height: 250, // Increased height for better viewing
//     backgroundColor: "#000",
//   },
//   videoTitle: {
//     fontSize: 20,
//     fontWeight: "600",
//     padding: 10,
//   },
//   videoDescription: {
//     fontSize: 16,
//     padding: 10,
//     paddingTop: 0,
//   },
// });

import React from "react";
import { StyleSheet, useColorScheme, FlatList } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { AdvancedVideo } from "cloudinary-react-native";
import { CLOUD_NAME } from "@/utils/cloudinary";
import { Colors } from "@/constants/Colors";
import { Stack, useLocalSearchParams } from "expo-router";
import { useVideos } from "@/hooks/useVideos";
import { useLanguage } from "@/contexts/LanguageContext";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { Collapsible } from "@/components/Collapsible";
import { useTranslation } from "react-i18next";
import HeaderLeftBackButton from "./HeaderLeftBackButton";

export default function RenderQuestionVideos() {
  const { categoryName } = useLocalSearchParams<{ categoryName: string }>();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const { language } = useLanguage();
  const { t } = useTranslation();
  const { videosByCategory, isLoading, error } = useVideos(language);
  const videosForCategory = videosByCategory[categoryName] || [];

  if (isLoading) {
    return (
      <ThemedView style={styles.centeredContainer}>
        <LoadingIndicator size="large" />
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.centeredContainer}>
        <ThemedText style={{ color: theme.error }} type="subtitle">
          {t("error")} {error.message}
        </ThemedText>
      </ThemedView>
    );
  }

  if (!videosForCategory.length) {
    return (
      <ThemedView style={styles.centeredContainer}>
        <ThemedText type="subtitle">{t("noVideoFound")}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <Stack.Screen
        options={{
          headerTitle: categoryName,
          headerLeft: () => <HeaderLeftBackButton />,
        }}
      />
      <FlatList
        data={videosForCategory}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => {
          const videoUrl = `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/sp_auto/${item.public_id}.m3u8`;
          return (
            <Collapsible title={item.title} marja={undefined}>
              <AdvancedVideo videoUrl={videoUrl} videoStyle={styles.video} />
            </Collapsible>
          );
        }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    paddingBottom: 20,
  },
  video: {
    width: "100%",
    height: 250,
    backgroundColor: "#000",
  },
});
