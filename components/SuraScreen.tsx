import type React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Animated,
  Alert,
} from "react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Ionicons } from "@expo/vector-icons";
import { Storage } from "expo-sqlite/kv-store";
import RenderHTML from "react-native-render-html";
import { useWindowDimensions } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import HeaderLeftBackButton from "./HeaderLeftBackButton";
import { useLastSuraStore } from "@/stores/useLastSura";

import { Colors } from "@/constants/Colors";
import { useLanguage } from "@/contexts/LanguageContext";
import { SuraRowType, QuranVerseType, LanguageCode } from "@/constants/Types";

import {
  getSurahVerses,
  getSurahDisplayName,
  getSurahInfoByNumber,
} from "@/db/queries/quran";
import { whenDatabaseReady } from "@/db";

const HEADER_MAX_HEIGHT = 120;
const HEADER_MIN_HEIGHT = 60;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const SuraScreen: React.FC = () => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";
  const { language, isArabic } = useLanguage();
  const lang = (language ?? "de") as LanguageCode;
  const { width } = useWindowDimensions();

  // account for list + card paddings (16 + 16 on both sides)
  const translitContentWidth = Math.max(0, width - 64);
  const { suraId } = useLocalSearchParams<{ suraId: string }>();
  const suraNumber = useMemo(() => Number(suraId ?? 1), [suraId]);

  const [loading, setLoading] = useState(true);
  const [verses, setVerses] = useState<QuranVerseType[]>([]);
  const [arabicVerses, setArabicVerses] = useState<QuranVerseType[]>([]);
  const [suraInfo, setSuraInfo] = useState<SuraRowType | null>(null);
  const [displayName, setDisplayName] = useState<string>("");
  const [bookmarkedVerses, setBookmarkedVerses] = useState<Set<number>>(
    new Set()
  );

  const setLastSura = useLastSuraStore((s) => s.setLastSura);
  useEffect(() => {
    setLastSura(suraNumber);
  }, [suraNumber]);

  // Animation refs
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        await whenDatabaseReady();

        const [vers, arabicVers, info, name] = await Promise.all([
          getSurahVerses(lang, suraNumber), // includes transliteration (via JOIN)
          getSurahVerses("ar", suraNumber), // Arabic lines
          getSurahInfoByNumber(suraNumber),
          getSurahDisplayName(suraNumber, lang),
        ]);

        const loadedBookmarks = await loadBookmarkedVerses(suraNumber);

        if (!cancelled) {
          setVerses((vers ?? []) as QuranVerseType[]);
          setArabicVerses((arabicVers ?? []) as QuranVerseType[]);
          setSuraInfo(info ?? null);
          setDisplayName(name ?? "");
          setBookmarkedVerses(loadedBookmarks);
        }
      } catch (error) {
        console.error("Failed to load surah:", error);
        if (!cancelled) {
          setVerses([]);
          setArabicVerses([]);
          setSuraInfo(null);
          setDisplayName("");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [lang, suraNumber]);

  // O(1) verse lookup for Arabic lines
  const arabicByAya = useMemo(
    () => new Map(arabicVerses.map((v) => [v.aya, v])),
    [arabicVerses]
  );

  const handleBookmarkVerse = async (verseNumber: number) => {
    try {
      const bookmarksKey = `bookmarks_sura_${suraNumber}`;

      // Tapping the same verse toggles it off
      if (bookmarkedVerses.has(verseNumber)) {
        const newSet = new Set(bookmarkedVerses);
        newSet.delete(verseNumber);
        setBookmarkedVerses(newSet);
        const arr = Array.from(newSet);
        if (arr.length) {
          await Storage.setItemAsync(bookmarksKey, JSON.stringify(arr));
        } else {
          await Storage.removeItemAsync(bookmarksKey);
        }
        await Storage.removeItemAsync(
          `bookmark_s${suraNumber}_v${verseNumber}_${lang}`
        );
        return;
      }
      // Another verse is already bookmarked → ask to replace
      if (bookmarkedVerses.size > 0) {
        const prev = Array.from(bookmarkedVerses)[0];
        Alert.alert(t("confirmBookmarkChange"), t("bookmarkReplaceQuestion"), [
          { text: t("cancel"), style: "cancel" },
          {
            text: "Ersetzen",
            style: "destructive",
            onPress: async () => {
              // remove all previous individual entries
              for (const v of bookmarkedVerses) {
                await Storage.removeItemAsync(
                  `bookmark_s${suraNumber}_v${v}_${lang}`
                );
              }
              const newSet = new Set<number>([verseNumber]);
              setBookmarkedVerses(newSet);
              await Storage.setItemAsync(
                bookmarksKey,
                JSON.stringify([verseNumber])
              );
              await Storage.setItemAsync(
                `bookmark_s${suraNumber}_v${verseNumber}_${lang}`,
                JSON.stringify({
                  suraNumber,
                  verseNumber,
                  language: lang,
                  suraName: displayName,
                  timestamp: Date.now(),
                })
              );
            },
          },
        ]);
        return;
      }

      // No existing bookmark → add this one
      const newSet = new Set<number>([verseNumber]);
      setBookmarkedVerses(newSet);
      await Storage.setItemAsync(bookmarksKey, JSON.stringify([verseNumber]));
      await Storage.setItemAsync(
        `bookmark_s${suraNumber}_v${verseNumber}_${lang}`,
        JSON.stringify({
          suraNumber,
          verseNumber,
          language: lang,
          suraName: displayName,
          timestamp: Date.now(),
        })
      );
    } catch (error) {
      console.error("Error handling bookmark:", error);
    }
  };

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: "clamp",
  });

  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.5, 0],
    extrapolate: "clamp",
  });

  const headerSubtitleOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 3],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const headerTitleScale = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.8],
    extrapolate: "clamp",
  });

  const badgeOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const AnimatedHeader = () => {
    const isMakki = !!suraInfo?.makki;
    return (
      <Animated.View
        style={[
          styles.headerWrapper,
          {
            height: headerHeight,
            backgroundColor: Colors[colorScheme].background,
          },
        ]}
      >
        <SafeAreaView edges={["top"]} style={styles.headerContainer}>
          <View style={styles.headerContent}>
            <HeaderLeftBackButton />
            <Animated.View
              style={[
                styles.headerTextContainer,
                {
                  opacity: headerTitleOpacity,
                  transform: [{ scale: headerTitleScale }],
                },
              ]}
            >
              <ThemedText
                type="title"
                style={[styles.suraName, isArabic() && styles.suraNameAr]}
                numberOfLines={1}
              >
                {displayName || suraInfo?.label_en || suraInfo?.label || ""}
              </ThemedText>
              <Animated.View style={{ opacity: headerSubtitleOpacity }}>
                <ThemedText style={styles.subMeta} numberOfLines={1}>
                  {t("ayatCount")}: {suraInfo?.nbAyat ?? "—"} ·{" "}
                  {isMakki ? t("makki") : t("madani")}
                </ThemedText>
              </Animated.View>
            </Animated.View>
            <Animated.View
              style={[
                styles.idBadge,
                {
                  backgroundColor: Colors[colorScheme].contrast,
                  borderColor: Colors[colorScheme].border,
                  opacity: badgeOpacity,
                },
              ]}
            >
              <ThemedText style={styles.idBadgeText}>{suraNumber}</ThemedText>
            </Animated.View>
          </View>
        </SafeAreaView>
      </Animated.View>
    );
  };

  const renderVerse = ({ item }: { item: QuranVerseType; index: number }) => {
    const arabicVerse = arabicByAya.get(item.aya);
    const isVerseBookmarked = bookmarkedVerses.has(item.aya);
    const transliterationText = item.transliteration ?? "";

    return (
      <View
        style={[
          styles.verseCard,
          {
            backgroundColor: isVerseBookmarked
              ? Colors.universal.primary
              : Colors[colorScheme].contrast,
          },
        ]}
      >
        <View style={styles.verseHeader}>
          <View style={styles.verseNumberBadge}>
            <ThemedText style={styles.verseNumberText}>{item.aya}</ThemedText>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[
                styles.actionButton,
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
                styles.actionButton,
                { backgroundColor: Colors[colorScheme].background },
              ]}
              onPress={() => handleBookmarkVerse(item.aya)}
            >
              <Ionicons
                name={isVerseBookmarked ? "bookmark" : "bookmark-outline"}
                size={21}
                color={
                  isVerseBookmarked
                    ? "#8B5CF6"
                    : Colors[colorScheme].defaultIcon
                }
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: Colors[colorScheme].background },
              ]}
            >
              <Ionicons
                name="information-circle-outline"
                size={24}
                color={Colors[colorScheme].defaultIcon}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.verseContent}>
          {/* Arabic line */}
          {!!arabicVerse && (
            <ThemedText style={styles.arabicText}>
              {arabicVerse.text}
            </ThemedText>
          )}

          {/* Transliteration */}
          {!!transliterationText && (
            <RenderHTML
              contentWidth={translitContentWidth}
              source={{ html: `<div>${transliterationText}</div>` }}
              // make it look like your old style
              baseStyle={StyleSheet.flatten(styles.arabicTransliterationText)}
              defaultTextProps={{ selectable: true }}
              // safety & tiny tweaks
              ignoredDomTags={["script", "style"]}
              tagsStyles={{
                u: { textDecorationLine: "underline" },
                b: { fontWeight: "700" },
                i: { fontStyle: "italic" },
              }}
            />
          )}
          {/* Translation */}
          <ThemedText style={styles.translationText}>{item.text}</ThemedText>
        </View>
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <AnimatedHeader />
      {loading ? (
        <View style={styles.loadingWrap}>
          <LoadingIndicator size="large" />
        </View>
      ) : (
        <Animated.FlatList
          data={verses}
          keyExtractor={(v) => `${v.sura}-${v.aya}`}
          renderItem={renderVerse}
          contentContainerStyle={[
            styles.listContent,
            { paddingTop: HEADER_MAX_HEIGHT + 10 },
          ]}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          ListEmptyComponent={
            <ThemedText style={styles.emptyText}>{t("noData")}</ThemedText>
          }
        />
      )}
    </ThemedView>
  );
};

async function loadBookmarkedVerses(suraNumber: number): Promise<Set<number>> {
  try {
    const bookmarksKey = `bookmarks_sura_${suraNumber}`;
    const storedBookmarks = await Storage.getItemAsync(bookmarksKey);
    if (storedBookmarks) {
      const arr = JSON.parse(storedBookmarks) as number[];
      return new Set(arr);
    }
  } catch (error) {
    console.error("Error loading bookmarks:", error);
  }
  return new Set();
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingWrap: {
    paddingTop: 32,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: { paddingHorizontal: 16, paddingBottom: 24 },
  headerWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  headerContainer: { flex: 1, justifyContent: "center" },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  headerTextContainer: { flex: 1, marginHorizontal: 16, gap: 5 },
  suraName: { fontSize: 20, fontWeight: "700" },
  subMeta: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.universal.grayedOut,
  },
  suraNameAr: { textAlign: "right", fontSize: 24 },
  idBadge: {
    minWidth: 44,
    height: 44,
    paddingHorizontal: 10,
    borderRadius: 22,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  idBadgeText: { fontSize: 16, fontWeight: "800" },
  verseCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  verseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  verseNumberBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#8B5CF6",
    alignItems: "center",
    justifyContent: "center",
  },
  verseNumberText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  actionButtons: { flexDirection: "row", gap: 8 },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  verseContent: { gap: 12 },
  arabicText: {
    fontSize: 24,
    lineHeight: 40,
    textAlign: "right",
    fontWeight: "400",
    letterSpacing: 0.5,
  },
  translationText: { fontSize: 16, lineHeight: 24, fontWeight: "500" },
  arabicTransliterationText: {
    fontSize: 15,
    lineHeight: 22,
    fontStyle: "italic",
    fontWeight: "400",
    textAlign: "left", // keeps it visually paired with the translation
    color: Colors.universal.grayedOut,
  },
  emptyText: { textAlign: "center", padding: 24 },
});

export default SuraScreen;
