// //! Cloudinary
// import React from "react";
// import { StyleSheet, useColorScheme, FlatList } from "react-native";
// import { ThemedView } from "@/components/ThemedView";
// import { ThemedText } from "@/components/ThemedText";
// import { AdvancedVideo } from "cloudinary-react-native";
// import { VideoView } from "expo-video"; // keep to ensure expo-video is bundled
// import { cld } from "@/utils/cloudinary"; // use Cloudinary client (Option B)
// import { Colors } from "@/constants/Colors";
// import { Stack, useLocalSearchParams } from "expo-router";
// import { useVideos } from "@/hooks/useVideos";
// import { useLanguage } from "@/contexts/LanguageContext";
// import { LoadingIndicator } from "@/components/LoadingIndicator";
// import { Collapsible } from "@/components/Collapsible";
// import { useTranslation } from "react-i18next";
// import HeaderLeftBackButton from "./HeaderLeftBackButton";

// export default function RenderQuestionVideos() {
//   const { categoryName } = useLocalSearchParams<{ categoryName: string }>();
//   const colorScheme = useColorScheme() || "light";
//   const theme = Colors[colorScheme];
//   const { language } = useLanguage();
//   const { t } = useTranslation();
//   const { videosByCategory, isLoading, error } = useVideos(language || "de");
//   const videosForCategory = videosByCategory[categoryName] || [];

//   // make sure expo-video is included in Metro bundle (prevents “unknown module 33xx” edge cases)
//   console.log("expo-video ready:", !!VideoView);

//   if (isLoading) {
//     return (
//       <ThemedView style={styles.centeredContainer}>
//         <LoadingIndicator size="large" />
//       </ThemedView>
//     );
//   }

//   if (error) {
//     return (
//       <ThemedView style={styles.centeredContainer}>
//         <ThemedText style={{ color: theme.error }} type="subtitle">
//           {t("error")} {error.message}
//         </ThemedText>
//       </ThemedView>
//     );
//   }

//   if (!videosForCategory.length) {
//     return (
//       <ThemedView style={styles.centeredContainer}>
//         <ThemedText type="subtitle">{t("noVideoFound")}</ThemedText>
//       </ThemedView>
//     );
//   }

//   return (
//     <ThemedView
//       style={[
//         styles.container,
//         { backgroundColor: Colors[colorScheme].background },
//       ]}
//     >
//       <Stack.Screen
//         options={{
//           headerTitle: categoryName,
//           headerLeft: () => <HeaderLeftBackButton />,
//         }}
//       />

//       <FlatList
//         data={videosForCategory}
//         keyExtractor={(item) => item.id.toString()}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.listContainer}
//         renderItem={({ item }) => {
//           // Build a Cloudinary Video object from the public_id
//           const cldVid = cld.video(item.public_id);

//           return (
//             <Collapsible title={item.title} marja={undefined}>
//               <AdvancedVideo
//                 cldVideo={cldVid}
//                 videoStyle={styles.video}
//                 // Optional analytics — keep or remove as you wish:
//                 enableAnalytics
//                 autoTrackAnalytics
//                 analyticsOptions={{
//                   customData: { category: categoryName },
//                   videoPlayerType: "expo-video",
//                   videoPlayerVersion: "latest",
//                 }}
//               />
//             </Collapsible>
//           );
//         }}
//       />
//     </ThemedView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16 },
//   centeredContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   listContainer: { paddingBottom: 20 },
//   video: { width: "100%", height: 250, backgroundColor: "#000" },
// });



//! Expo videos
import React, { useEffect } from "react";
import { StyleSheet, useColorScheme, FlatList, View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { VideoView, useVideoPlayer } from "expo-video";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { Collapsible } from "@/components/Collapsible";
import HeaderLeftBackButton from "./HeaderLeftBackButton";
import { CLOUD_NAME } from "@/utils/cloudinary";
import { Colors } from "@/constants/Colors";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "react-i18next";
import { useVideos } from "@/hooks/useVideos";
import { hlsUrl } from "@/utils/cloudinary";
export default function RenderQuestionVideos() {
  const { categoryName } = useLocalSearchParams<{ categoryName: string }>();
  const scheme = useColorScheme() || "light";
  const theme = Colors[scheme];
  const { language } = useLanguage();
  const { t } = useTranslation();

  const { data, isLoading, error } = useVideos(language || "de");
  // your hook also exposes derived maps; but we can filter here if needed:
  const videosForCategory =
    (data ?? []).filter((v: any) => v.video_category === categoryName) ?? [];

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
        keyExtractor={(item: any) => String(item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <Collapsible title={item.title} marja={undefined}>
            <VideoPlayer publicId={item.public_id} title={item.title} />
          </Collapsible>
        )}
      />
    </ThemedView>
  );
}

function VideoPlayer({
  publicId,
  title,
}: {
  publicId: string;
  title?: string;
}) {
  // uses your helper → adaptive HLS (sp_auto)
  const url = hlsUrl(publicId);

  const player = useVideoPlayer(url, (p) => {
    p.loop = false;
    p.play(); // enable if you want autoplay when opened
  });

  //! Fix that works but looks strange but not needed
  // // Pause when the screen loses focus (before unmount), avoids calling into a freed native object
  // const { useFocusEffect } = require("@react-navigation/native");
  // useFocusEffect(
  //   React.useCallback(() => {
  //     return () => {
  //       try {
  //         player?.pause();
  //       } catch {}
  //     };
  //   }, [player])
  // );

  return (
    <View style={styles.videoContainer}>
      <VideoView
        style={styles.video}
        player={player}
        nativeControls
        contentFit="contain"
        allowsFullscreen
        allowsPictureInPicture
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: { paddingBottom: 20 },
  videoContainer: {
    width: "100%",
    height: 250,
    backgroundColor: "#000",
    borderRadius: 8,
    overflow: "hidden",
  },
  video: { flex: 1 },
});
