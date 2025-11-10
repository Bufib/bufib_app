//! Last worked
// import React, { useMemo } from "react";
// import {
//   View,
//   TouchableOpacity,
//   StyleSheet,
//   useColorScheme,
// } from "react-native";
// import AntDesign from "@expo/vector-icons/AntDesign";
// import { Ionicons } from "@expo/vector-icons";
// import RenderHTML from "react-native-render-html";
// import { ThemedText } from "@/components/ThemedText";
// import { Colors } from "@/constants/Colors";
// import { QuranVerseType } from "@/constants/Types";
// import { useFontSizeStore } from "@/stores/fontSizeStore";
// import { useTranslation } from "react-i18next";
// import { useLanguage } from "@/contexts/LanguageContext";
// import type { MixedStyleDeclaration } from "react-native-render-html";

// // For RenderHTML
// const TAGS_STYLES = Object.freeze({
//   u: { textDecorationLine: "underline" as const },
//   b: { fontWeight: "700" as const },
//   i: { fontStyle: "italic" as const },
// });
// const DEFAULT_TEXT_PROPS = Object.freeze({ selectable: true });
// const IGNORED_TAGS = ["script", "style"] as const;

// export type VerseCardProps = {
//   item: QuranVerseType;
//   arabicVerse?: QuranVerseType;
//   isBookmarked: boolean;
//   isJuzMode: boolean;
//   translitContentWidth: number;
//   hasTafsir: boolean;
//   onBookmark: (verse: QuranVerseType) => void;
//   onOpenInfo: (verse: QuranVerseType, arabicVerse?: QuranVerseType) => void;
//   /** Must be a plain object (not from StyleSheet.create). */
//   translitBaseStyle: object;
//   language: string;
//   isPlaying?: boolean;
//   onPlayAudio?: () => void;
//   onPickReciter?: () => void
// };

// function VerseCard({
//   item,
//   arabicVerse,
//   isBookmarked,
//   isJuzMode,
//   translitContentWidth,
//   hasTafsir,
//   onBookmark,
//   onOpenInfo,
//   translitBaseStyle,
//   language,
//   isPlaying,
//   onPlayAudio,
//   onPickReciter
// }: VerseCardProps) {
//   const transliterationText = item.transliteration ?? "";

//   const source = useMemo(
//     () => ({ html: `<div>${transliterationText}</div>` }),
//     [transliterationText]
//   );
//   const colorScheme = useColorScheme() || "light";
//   const { fontSize, lineHeight } = useFontSizeStore();
//   const { rtl } = useLanguage();

//   const renderHtmlBaseStyle = useMemo<MixedStyleDeclaration>(
//     () => ({
//       fontStyle: "italic",
//       fontWeight: "400",
//       textAlign: "left",
//       color: Colors.universal.grayedOut,
//       fontSize: fontSize * 1,
//     }),
//     [fontSize, colorScheme]
//   );

//   return (
//     <View
//       style={[
//         styles.card,
//         {
//           backgroundColor: isBookmarked ? colorScheme === "dark" ? "#1B4332"  :"#A5D6A7" : Colors[colorScheme].contrast,
//           marginHorizontal: 10,
//           marginTop: 10,
//         },
//       ]}
//     >
//       <View style={styles.header}>
//         <View style={[styles.badge, isJuzMode && { width: 80 }]}>
//           <ThemedText style={styles.badgeText}>
//             {isJuzMode ? `${item.sura}:${item.aya}` : item.aya}
//           </ThemedText>
//         </View>

//         <View style={styles.actions}>
//           {onPlayAudio && (
//             <TouchableOpacity
//               style={[
//                 styles.actionBtn,
//                 { backgroundColor: Colors[colorScheme].background, paddingLeft: 3 },
//               ]}
//               onPress={onPlayAudio}
//               onLongPress={onPickReciter}
//             >
//               <Ionicons
//                 name={"play-outline"}
//                 size={21}
//                 color={Colors[colorScheme].defaultIcon}
//               />
//             </TouchableOpacity>
//           )}

//           <TouchableOpacity
//             style={[
//               styles.actionBtn,
//               { backgroundColor: Colors[colorScheme].background },
//             ]}
//             onPress={() => onBookmark(item)}
//           >
//             <Ionicons
//               name={isBookmarked ? "bookmark" : "bookmark-outline"}
//               size={21}
//               color={isBookmarked ? Colors.universal.primary : Colors[colorScheme].defaultIcon}
//             />
//           </TouchableOpacity>

//           {hasTafsir && (
//             <TouchableOpacity
//               style={[
//                 styles.actionBtn,
//                 { backgroundColor: Colors[colorScheme].background },
//               ]}
//               onPress={() => onOpenInfo(item, arabicVerse ?? undefined)}
//             >
//               <Ionicons
//                 name="information-circle-outline"
//                 size={24}
//                 color={Colors[colorScheme].defaultIcon}
//               />
//             </TouchableOpacity>
//           )}
//         </View>
//       </View>

//       <View style={styles.content}>
//         {!!arabicVerse && (
//           <ThemedText
//             style={[
//               styles.arabic,
//               rtl
//                 ? { fontSize: fontSize * 1.8, lineHeight: lineHeight * 2.3 }
//                 : { fontSize: fontSize * 1.5, lineHeight: lineHeight * 2 },
//             ]}
//           >
//             {arabicVerse.text}
//           </ThemedText>
//         )}

//         {!!transliterationText && (
//           <RenderHTML
//             contentWidth={translitContentWidth}
//             source={source}
//             baseStyle={renderHtmlBaseStyle}
//             defaultTextProps={DEFAULT_TEXT_PROPS}
//             ignoredDomTags={IGNORED_TAGS as any}
//             tagsStyles={TAGS_STYLES as any}
//           />
//         )}

//         {language !== "ar" && (
//           <ThemedText
//             style={[
//               styles.translation,
//               { fontSize: fontSize * 1.1, lineHeight: lineHeight * 1.1 },
//             ]}
//           >
//             {item.text}
//           </ThemedText>
//         )}
//       </View>
//     </View>
//   );
// }

// export default React.memo(VerseCard);

// const styles = StyleSheet.create({
//   card: {
//     borderRadius: 16,
//     marginBottom: 12,
//     padding: 16,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   badge: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: Colors.universal.primary,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   badgeText: {
//     color: "#FFFFFF",
//     fontSize: 16,
//     fontWeight: "700",
//   },
//   actions: {
//     flexDirection: "row",
//     gap: 8,
//   },
//   actionBtn: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   audioButton: {
//     padding: 4,
//   },
//   content: {
//     gap: 20,
//   },
//   arabic: {
//     textAlign: "right",
//     fontWeight: "400",
//     letterSpacing: 0,
//   },
//   translation: {
//     fontWeight: "500",
//   },
// });

// components/VerseCard.tsx

import React, { useMemo, useState } from "react";
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
import { useLanguage } from "@/contexts/LanguageContext";
import type { MixedStyleDeclaration } from "react-native-render-html";

const TAGS_STYLES = Object.freeze({
  u: { textDecorationLine: "underline" as const },
  b: { fontWeight: "700" as const },
  i: { fontStyle: "italic" as const },
});
const DEFAULT_TEXT_PROPS = Object.freeze({ selectable: true });
const IGNORED_TAGS = ["script", "style"] as const;

const CARD_MARGIN_HORIZONTAL = 10;
const CARD_PADDING = 16;

export type VerseCardProps = {
  item: QuranVerseType;
  arabicVerse?: QuranVerseType;
  isBookmarked: boolean;
  isJuzMode: boolean;
  hasTafsir: boolean;
  onBookmark: (verse: QuranVerseType) => void;
  onOpenInfo: (verse: QuranVerseType, arabicVerse?: QuranVerseType) => void;
  /** Must be a plain object (not from StyleSheet.create). */
  translitBaseStyle: object;
  language: string;
  isPlaying?: boolean;
  onPlayAudio?: () => void;
  onPickReciter?: () => void;
};

function VerseCard({
  item,
  arabicVerse,
  isBookmarked,
  isJuzMode,
  hasTafsir,
  onBookmark,
  onOpenInfo,
  translitBaseStyle,
  language,
  isPlaying,
  onPlayAudio,
  onPickReciter,
}: VerseCardProps) {
  const transliterationText = item.transliteration ?? "";
  const colorScheme = useColorScheme() || "light";
  const { fontSize, lineHeight } = useFontSizeStore();
  const { rtl } = useLanguage();

  // Actual inner width for RenderHTML (measured from layout)
  const [htmlWidth, setHtmlWidth] = useState(0);

  const source = useMemo(
    () => ({ html: `<div>${transliterationText}</div>` }),
    [transliterationText]
  );

  const renderHtmlBaseStyle = useMemo<MixedStyleDeclaration>(
    () => ({
      ...translitBaseStyle,
      fontSize: fontSize * 1,
      color: (translitBaseStyle as any)?.color ?? Colors.universal.grayedOut,
    }),
    [fontSize, translitBaseStyle]
  );

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isBookmarked
            ? colorScheme === "dark"
              ? "#1B4332"
              : "#A5D6A7"
            : Colors[colorScheme].contrast,
          marginHorizontal: CARD_MARGIN_HORIZONTAL,
          marginTop: 10,
        },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.badge, isJuzMode && { width: 80 }]}>
          <ThemedText style={styles.badgeText}>
            {isJuzMode ? `${item.sura}:${item.aya}` : item.aya}
          </ThemedText>
        </View>

        <View style={styles.actions}>
          {onPlayAudio && (
            <TouchableOpacity
              style={[
                styles.actionBtn,
                {
                  backgroundColor: Colors[colorScheme].background,
                  paddingLeft: 3,
                },
              ]}
              onPress={onPlayAudio}
              onLongPress={onPickReciter}
            >
              <Ionicons
                name={isPlaying ? "pause-outline" : "play-outline"}
                size={21}
                color={Colors[colorScheme].defaultIcon}
              />
            </TouchableOpacity>
          )}

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
              color={
                isBookmarked
                  ? Colors.universal.primary
                  : Colors[colorScheme].defaultIcon
              }
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

      {/* Content */}
      <View style={styles.content}>
        {!!arabicVerse && (
          <ThemedText
            style={[
              styles.arabic,
              rtl
                ? { fontSize: fontSize * 1.8, lineHeight: lineHeight * 2.3,  }
                : { fontSize: fontSize * 1.5, lineHeight: lineHeight * 2 },
            ]}
          >
            {arabicVerse.text}
          </ThemedText>
        )}

        {!!transliterationText && (
          <View
            style={{ width: "90%" }}
            onLayout={(e) => {
              const w = e.nativeEvent.layout.width;
              if (w > 0 && w !== htmlWidth) setHtmlWidth(w);
            }}
          >
            {htmlWidth > 0 && (
              <RenderHTML
                contentWidth={htmlWidth}
                source={source}
                baseStyle={renderHtmlBaseStyle}
                defaultTextProps={DEFAULT_TEXT_PROPS}
                ignoredDomTags={IGNORED_TAGS as any}
                tagsStyles={TAGS_STYLES as any}
              />
            )}
          </View>
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
    padding: CARD_PADDING,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: "visible", // avoid accidental clipping
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
    backgroundColor: Colors.universal.primary,
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
    letterSpacing: 0,
  },
  translation: {
    fontWeight: "500",
  },
});
