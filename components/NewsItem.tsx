import RenderLinkNewsItem from "@/components/RenderLinkNewsItem";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { NewsType } from "@/constants/Types";
import { useLanguage } from "@/contexts/LanguageContext";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Image } from "expo-image";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { useAuthStore } from "../stores/authStore";
import { formatDate } from "../utils/formatDate";
import NewsMenu from "./NewsMenu";

const screenWidth = Dimensions.get("window").width;
const imageHeight = screenWidth * 1.2;

export const NewsItem = ({
  id,
  title,
  content,
  created_at,
  images_url,
  internal_urls,
  external_urls,
  is_pinned,
  language_code,
}: NewsType) => {
  const colorScheme = useColorScheme() || "light";
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const [currentPage, setCurrentPage] = useState(0);
  const flatListRef = useRef<FlatList<string>>(null);
  const { isArabic } = useLanguage();
  const handleScrollEnd = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const pageIndex = Math.round(offsetX / screenWidth);
    setCurrentPage(pageIndex);
  };

  const handleDotPress = (index: number) => {
    flatListRef.current?.scrollToOffset({
      offset: index * screenWidth,
      animated: true,
    });
    setCurrentPage(index);
  };

  return (
    <View
      style={[
        styles.newsItem,
        {
          backgroundColor: Colors[colorScheme].contrast,
          shadowColor: Colors[colorScheme].border,
        },
      ]}
    >
      {is_pinned && (
        <AntDesign
          name="pushpin"
          size={24}
          color={colorScheme === "dark" ? "#2ea853" : "#057958"}
          style={styles.pinIconStyle}
        />
      )}

      {isAdmin && (
        <ThemedView style={styles.newsMenu}>
          <NewsMenu id={id} is_pinned={is_pinned || false} />
        </ThemedView>
      )}
      {title && title.trim() !== "" && (
        <ThemedText
          style={[
            styles.newsTitle,
            { textAlign: isArabic() ? "right" : "left" },
          ]}
          type="defaultSemiBold"
        >
          {title}
        </ThemedText>
      )}
      {content && content.trim() !== "" && (
        <ThemedText
          style={[
            styles.newsContent,
            { textAlign: isArabic() ? "right" : "left" },
          ]}
        >
          {content}
        </ThemedText>
      )}

      {external_urls && external_urls.length > 0 && (
        <ThemedView style={styles.linksContainer}>
          {external_urls.map((url, index) => (
            <RenderLinkNewsItem
              key={`external-url-${index}-${url}`}
              url={url}
              index={index}
              isExternal={true}
            />
          ))}
        </ThemedView>
      )}

      {internal_urls && internal_urls.length > 0 && (
        <ThemedView style={styles.linksContainer}>
          {internal_urls.map((url, index) => (
            <RenderLinkNewsItem
              key={`internal-url-${index}-${url}`}
              url={url}
              index={index}
              isExternal={false}
            />
          ))}
        </ThemedView>
      )}
      {images_url && images_url.length > 0 && (
        <View>
          <FlatList
            ref={flatListRef}
            data={images_url}
            horizontal
            pagingEnabled
            snapToInterval={screenWidth} // Ensure snapping aligns with image width
            snapToAlignment="center"
            decelerationRate="fast"
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleScrollEnd}
            keyExtractor={(item, index) => `${item}-${index}`}
            renderItem={({ item }) => (
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: item }}
                  style={styles.image}
                  contentFit="cover"
                  allowDownscaling={true}
                />
              </View>
            )}
          />
          {/* Dots Pagination */}
          <View style={styles.dotsContainer}>
            {images_url.map((_, index) => (
              <Pressable key={index} onPress={() => handleDotPress(index)}>
                <View
                  style={[
                    styles.dot,
                    currentPage === index
                      ? styles.activeDot
                      : styles.inactiveDot,
                  ]}
                />
              </Pressable>
            ))}
          </View>
        </View>
      )}

      <ThemedText
        style={[styles.newsDate, { textAlign: isArabic() ? "left" : "right" }]}
      >
        {formatDate(created_at)}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  newsItem: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  pinIconStyle: {
    flex: 1,
    alignSelf: "flex-end",
    transform: [{ rotateY: "180deg" }],
  },
  newsMenu: {
    backgroundColor: "transparent",
    flex: 1,
    alignSelf: "flex-end",
  },
  newsTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  newsContent: {
    fontSize: 18,
  },
  linksContainer: {
    backgroundColor: "transparent",
  },
  image: {
    width: screenWidth,
    height: imageHeight,
    borderRadius: 10,
  },
  imageContainer: {
    width: screenWidth,
    height: imageHeight,
    justifyContent: "center",
    alignItems: "center",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#000",
  },
  inactiveDot: {
    backgroundColor: "#A4B0BD",
  },
  newsDate: {
    fontSize: 14,
    color: Colors.universal.grayedOut,
  },
});
