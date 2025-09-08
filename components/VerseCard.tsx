// components/VerseCard.tsx
import React, { useMemo } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Ionicons } from "@expo/vector-icons";
import RenderHTML from "react-native-render-html";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { QuranVerseType } from "@/constants/Types";
import { useFontSizeStore } from "@/stores/fontSizeStore";

// --- keep these as plain objects (NOT from StyleSheet.create) for RenderHTML ---
const TAGS_STYLES = Object.freeze({
  u: { textDecorationLine: "underline" as const },
  b: { fontWeight: "700" as const },
  i: { fontStyle: "italic" as const },
});
const DEFAULT_TEXT_PROPS = Object.freeze({ selectable: true });
const IGNORED_TAGS = ["script", "style"] as const;

export type VerseCardProps = {
  item: QuranVerseType;
  arabicVerse?: QuranVerseType;
  isBookmarked: boolean;
  isJuzMode: boolean;
  translitContentWidth: number;
  hasTafsir: boolean;
  onBookmark: (verse: QuranVerseType) => void;
  onOpenInfo: (verse: QuranVerseType, arabicVerse?: QuranVerseType) => void;
  /** Must be a plain object (not from StyleSheet.create). */
  translitBaseStyle: object;
  language: string;
};

function VerseCard({
  item,
  arabicVerse,
  isBookmarked,
  isJuzMode,
  translitContentWidth,
  hasTafsir,
  onBookmark,
  onOpenInfo,
  translitBaseStyle,
  language,
}: VerseCardProps) {
  const transliterationText = item.transliteration ?? "";

  const source = useMemo(
    () => ({ html: `<div>${transliterationText}</div>` }),
    [transliterationText]
  );
  const colorScheme = useColorScheme() || "light";
  const { fontSize, lineHeight } = useFontSizeStore();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isBookmarked
            ? Colors.universal.primary
            : Colors[colorScheme].contrast,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={[styles.badge, isJuzMode && { width: 80 }]}>
          <ThemedText style={styles.badgeText}>
            {isJuzMode ? `${item.sura}:${item.aya}` : item.aya}
          </ThemedText>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[
              styles.actionBtn,
              { backgroundColor: Colors[colorScheme].background },
            ]}
          >
            <AntDesign
              name="playcircleo"
              size={21}
              color={Colors[colorScheme].defaultIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionBtn,
              { backgroundColor: Colors[colorScheme].background },
            ]}
            onPress={() => onBookmark(item)}
          >
            <Ionicons
              name={isBookmarked ? "bookmark" : "bookmark-outline"}
              size={21}
              color={isBookmarked ? "#8B5CF6" : Colors[colorScheme].defaultIcon}
            />
          </TouchableOpacity>

          {hasTafsir && (
            <TouchableOpacity
              style={[
                styles.actionBtn,
                { backgroundColor: Colors[colorScheme].background },
              ]}
              onPress={() => onOpenInfo(item, arabicVerse ?? undefined)}
            >
              <Ionicons
                name="information-circle-outline"
                size={24}
                color={Colors[colorScheme].defaultIcon}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.content}>
        {!!arabicVerse && (
          <ThemedText
            style={[
              styles.arabic,
              { fontSize: fontSize * 1.7, lineHeight: lineHeight * 2 },
            ]}
          >
            {arabicVerse.text}
          </ThemedText>
        )}

        {!!transliterationText && (
          <RenderHTML
            contentWidth={translitContentWidth}
            source={source}
            // baseStyle={translitBaseStyle}
            baseStyle={{
              fontStyle: "italic",
              fontWeight: "400",
              textAlign: "left",
              color: Colors.universal.grayedOut,
              fontSize: fontSize * 1,
            }}
            defaultTextProps={DEFAULT_TEXT_PROPS}
            ignoredDomTags={IGNORED_TAGS as any}
            tagsStyles={TAGS_STYLES as any}
          />
        )}

        {language !== "ar" && (
          <ThemedText
            style={[
              styles.translation,
              { fontSize: fontSize * 1.1, lineHeight: lineHeight * 1.1 },
            ]}
          >
            {item.text}
          </ThemedText>
        )}
      </View>
    </View>
  );
}

export default React.memo(VerseCard);

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    marginBottom: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
 
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  badge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#8B5CF6",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    gap: 20,
  },
  arabic: {
    textAlign: "right",
    fontWeight: "400",
    letterSpacing: 0.5,
  },
  translation: {
    fontWeight: "500",
  },
});
