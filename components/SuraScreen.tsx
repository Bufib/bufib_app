import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Animated,
  Alert,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Storage } from "expo-sqlite/kv-store";
import { useWindowDimensions } from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { FlashList } from "@shopify/flash-list";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import HeaderLeftBackButton from "./HeaderLeftBackButton";
import VerseCard from "@/components/VerseCard";

import { useLastSuraStore } from "@/stores/useLastSura";
import { Colors } from "@/constants/Colors";
import { useLanguage } from "@/contexts/LanguageContext";
import { SuraRowType, QuranVerseType, LanguageCode } from "@/constants/Types";

import {
  getSurahVerses,
  getSurahDisplayName,
  getSurahInfoByNumber,
  getJuzVerses,
  getJuzBounds,
} from "@/db/queries/quran";
import { whenDatabaseReady } from "@/db";
import FontSizePickerModal from "./FontSizePickerModal";
import { useFontSizeStore } from "@/stores/fontSizeStore";

// constants / helpers
const HEADER_MAX_HEIGHT = 120;
const HEADER_MIN_HEIGHT = 60;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

// key for arabic lookup across juz (spans multiple surahs)
const vkey = (s: number, a: number) => `${s}:${a}`;

const SuraScreen: React.FC = () => {
  const { t } = useTranslation();
  const cs = (useColorScheme() || "light") as "light" | "dark";
  const { language, isArabic } = useLanguage();
  const lang = (language ?? "de") as LanguageCode;
  const { width } = useWindowDimensions();

  // account for list + card paddings (16 + 16 on both sides)
  const translitContentWidth = Math.max(0, width - 64);

  // Accept either suraId (surah mode) or juzId (juz mode)
  const { suraId, juzId } = useLocalSearchParams<{
    suraId?: string;
    juzId?: string;
  }>();
  const isJuzMode = !!juzId;
  const juzNumber = isJuzMode ? Number(juzId) : null;
  const suraNumber = useMemo(() => Number(suraId ?? 1), [suraId]);

  const [loading, setLoading] = useState(true);
  const [hasTafsir] = useState(true);
  const [verses, setVerses] = useState<QuranVerseType[]>([]);
  const [arabicVerses, setArabicVerses] = useState<QuranVerseType[]>([]);
  const [suraInfo, setSuraInfo] = useState<SuraRowType | null>(null);
  const { fontSize, lineHeight } = useFontSizeStore();

  // Header bits
  const [displayName, setDisplayName] = useState<string>(""); // Surah title (surah mode)
  const [juzHeader, setJuzHeader] = useState<{
    title: string;
    subtitle?: string;
  } | null>(null); // Juz title (juz mode)

  // Bookmarks by sura for highlighting in both modes
  const [bookmarksBySura, setBookmarksBySura] = useState<
    Map<number, Set<number>>
  >(new Map());

  const [selectedVerse, setSelectedVerse] = useState<QuranVerseType | null>(
    null
  );
  const [selectedArabicVerse, setSelectedArabicVerse] =
    useState<QuranVerseType | null>(null);

  const setLastSura = useLastSuraStore((s) => s.setLastSura);
  useEffect(() => {
    // Only set this in surah mode; in juz mode, leave the last sura as-is
    if (!isJuzMode) setLastSura(suraNumber);
  }, [suraNumber, isJuzMode]);

  // Animation refs
  const scrollY = useRef(new Animated.Value(0)).current;

  // Bottom Sheet ref
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["75%"], []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        await whenDatabaseReady();

        if (isJuzMode && juzNumber) {
          // --- JUZ MODE ---
          const [vers, arabicVers] = await Promise.all([
            getJuzVerses(lang, juzNumber),
            getJuzVerses("ar", juzNumber),
          ]);

          const bounds = await getJuzBounds(juzNumber);
          if (bounds) {
            const startName =
              (await getSurahDisplayName(bounds.startSura, lang)) ??
              `Sura ${bounds.startSura}`;
            setJuzHeader({
              title: `${t("juz") ?? "Juz"} ${juzNumber}`,
              subtitle: `${t("startsAt") ?? "Starts at"} ${startName} ${
                bounds.startAya
              }`,
            });
          } else {
            setJuzHeader({ title: `${t("juz") ?? "Juz"} ${juzNumber}` });
          }

          // Load bookmarks for all suras that appear in this juz
          const distinctSuras = Array.from(new Set(vers.map((v) => v.sura)));
          const map = new Map<number, Set<number>>();
          for (const s of distinctSuras) {
            map.set(s, await loadBookmarkedVerses(s));
          }

          if (!cancelled) {
            setVerses(vers ?? []);
            setArabicVerses(arabicVers ?? []);
            setSuraInfo(null);
            setDisplayName("");
            setJuzHeader((prev) => prev); // keep type happy
            setBookmarksBySura(map);
          }
        } else {
          // --- SURAH MODE ---
          const [vers, arabicVers, info, name] = await Promise.all([
            getSurahVerses(lang, suraNumber), // includes transliteration (via JOIN)
            getSurahVerses("ar", suraNumber), // Arabic lines
            getSurahInfoByNumber(suraNumber),
            getSurahDisplayName(suraNumber, lang),
          ]);

          const map = new Map<number, Set<number>>();
          map.set(suraNumber, await loadBookmarkedVerses(suraNumber));

          if (!cancelled) {
            setVerses((vers ?? []) as QuranVerseType[]);
            setArabicVerses((arabicVers ?? []) as QuranVerseType[]);
            setSuraInfo(info ?? null);
            setDisplayName(name ?? "");
            setJuzHeader(null);
            setBookmarksBySura(map);
          }
        }
      } catch (error) {
        console.error("Failed to load verses:", error);
        if (!cancelled) {
          setVerses([]);
          setArabicVerses([]);
          setSuraInfo(null);
          setDisplayName("");
          setJuzHeader(null);
          setBookmarksBySura(new Map());
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [lang, suraNumber, isJuzMode, juzNumber]);

  // verse lookup for Arabic lines → needs (sura, aya) in juz mode
  const arabicByKey = useMemo(
    () => new Map(arabicVerses.map((v) => [vkey(v.sura, v.aya), v])),
    [arabicVerses]
  );

  // Handle opening the info bottom sheet
  const handleOpenInfo = useCallback(
    (verse: QuranVerseType, arabicVerse: QuranVerseType | undefined) => {
      setSelectedVerse(verse);
      setSelectedArabicVerse(arabicVerse || null);
      bottomSheetRef.current?.expand();
    },
    []
  );

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );

  const handleBookmarkVerse = async (verse: QuranVerseType) => {
    try {
      const s = verse.sura;
      const verseNumber = verse.aya;
      const bookmarksKey = `bookmarks_sura_${s}`;

      const currentSet = new Set(bookmarksBySura.get(s) ?? new Set<number>());

      // Tapping the same verse toggles it off
      if (currentSet.has(verseNumber)) {
        currentSet.delete(verseNumber);
        const newMap = new Map(bookmarksBySura);
        newMap.set(s, currentSet);
        setBookmarksBySura(newMap);

        const arr = Array.from(currentSet);
        if (arr.length) {
          await Storage.setItemAsync(bookmarksKey, JSON.stringify(arr));
        } else {
          await Storage.removeItemAsync(bookmarksKey);
        }
        await Storage.removeItemAsync(`bookmark_s${s}_v${verseNumber}_${lang}`);
        return;
      }

      // Only allow one bookmark per sura (keeps your old behavior)
      if (currentSet.size > 0) {
        const prev = Array.from(currentSet)[0];
        Alert.alert(t("confirmBookmarkChange"), t("bookmarkReplaceQuestion"), [
          { text: t("cancel"), style: "cancel" },
          {
            text: t("change"),
            style: "destructive",
            onPress: async () => {
              await Storage.removeItemAsync(`bookmark_s${s}_v${prev}_${lang}`);

              const nextSet = new Set<number>([verseNumber]);
              const newMap = new Map(bookmarksBySura);
              newMap.set(s, nextSet);
              setBookmarksBySura(newMap);

              await Storage.setItemAsync(
                bookmarksKey,
                JSON.stringify([verseNumber])
              );
              await Storage.setItemAsync(
                `bookmark_s${s}_v${verseNumber}_${lang}`,
                JSON.stringify({
                  suraNumber: s,
                  verseNumber,
                  language: lang,
                  suraName: (await getSurahDisplayName(s, lang)) ?? `Sura ${s}`,
                  timestamp: Date.now(),
                })
              );
            },
          },
        ]);
        return;
      }

      // No existing bookmark in this sura -> add this one
      const nextSet = new Set<number>([verseNumber]);
      const newMap = new Map(bookmarksBySura);
      newMap.set(s, nextSet);
      setBookmarksBySura(newMap);

      await Storage.setItemAsync(bookmarksKey, JSON.stringify([verseNumber]));
      await Storage.setItemAsync(
        `bookmark_s${s}_v${verseNumber}_${lang}`,
        JSON.stringify({
          suraNumber: s,
          verseNumber,
          language: lang,
          suraName: (await getSurahDisplayName(s, lang)) ?? `Sura ${s}`,
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

  const AnimatedHeader = () => {
    const isMakki = !!suraInfo?.makki;
    const showJuz = !!juzHeader;

    const [modalVisible, setModalVisible] = useState(false);
    const colorScheme = useColorScheme() || "light";

    return (
      <Animated.View
        style={[
          styles.headerWrapper,
          {
            height: headerHeight,
            backgroundColor: Colors[cs].background,
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
              {showJuz ? (
                <>
                  <ThemedText style={styles.suraName}>
                    {juzHeader?.title}
                  </ThemedText>
                  {!!juzHeader?.subtitle && (
                    <Animated.View style={{ opacity: headerSubtitleOpacity }}>
                      <ThemedText type="default" style={[styles.subMeta]}>
                        {juzHeader.subtitle}
                      </ThemedText>
                    </Animated.View>
                  )}
                </>
              ) : (
                <>
                  <ThemedText
                    style={[styles.suraName, isArabic() && styles.suraNameAr]}
                  >
                    {displayName || suraInfo?.label_en || suraInfo?.label || ""}{" "}
                    ({suraNumber})
                  </ThemedText>
                  <Animated.View style={{ opacity: headerSubtitleOpacity }}>
                    <ThemedText style={styles.subMeta}>
                      {t("ayatCount")}: {suraInfo?.nbAyat ?? "—"} ·{" "}
                      {isMakki ? t("makki") : t("madani")}
                    </ThemedText>
                  </Animated.View>
                </>
              )}
            </Animated.View>
            <Ionicons
              name="text"
              size={28}
              color={Colors[colorScheme].defaultIcon}
              onPress={() => setModalVisible(true)}
              style={{ marginRight: 15 }}
            />
          </View>
          <FontSizePickerModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
          />
        </SafeAreaView>
      </Animated.View>
    );
  };

  // PLAIN object for RenderHTML baseStyle inside VerseCard
  const translitBaseStyle = useMemo(
    () => StyleSheet.flatten([styles.arabicTransliterationText]),
    []
  );

  const renderVerse = useCallback(
    ({ item }: { item: QuranVerseType; index: number }) => {
      const arabicVerse = arabicByKey.get(vkey(item.sura, item.aya));
      const isVerseBookmarked =
        bookmarksBySura.get(item.sura)?.has(item.aya) ?? false;

      return (
        <VerseCard
          item={item}
          arabicVerse={arabicVerse}
          isBookmarked={isVerseBookmarked}
          isJuzMode={isJuzMode}
          translitContentWidth={translitContentWidth}
          translitBaseStyle={translitBaseStyle}
          hasTafsir={hasTafsir}
          onBookmark={handleBookmarkVerse}
          onOpenInfo={handleOpenInfo}
          language={lang}
        />
      );
    },
    [
      arabicByKey,
      bookmarksBySura,
      isJuzMode,
      translitContentWidth,
      translitBaseStyle,
      cs,
      hasTafsir,
      handleBookmarkVerse,
      handleOpenInfo,
      lang,
    ]
  );

  return (
    <ThemedView style={styles.container}>
      <AnimatedHeader />
      {loading ? (
        <View style={styles.loadingWrap}>
          <LoadingIndicator size="large" />
        </View>
      ) : (
        <FlashList
          data={verses}
          extraData={Array.from(bookmarksBySura.entries())}
          keyExtractor={(v) => `${v.sura}-${v.aya}`}
          renderItem={renderVerse}
          contentContainerStyle={{
            paddingTop: HEADER_MAX_HEIGHT + 10,
            paddingHorizontal: 16,
            paddingBottom: 24,
          }}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          ListEmptyComponent={
            <ThemedText style={[styles.emptyText, { fontSize: fontSize }]}>
              {t("noData")}
            </ThemedText>
          }
        />
      )}

      {/* Bottom Sheet for Verse Info */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        enablePanDownToClose={true}
        backgroundStyle={{ backgroundColor: Colors[cs].background }}
        handleIndicatorStyle={{
          backgroundColor: Colors[cs].defaultIcon,
        }}
      >
        <BottomSheetScrollView style={styles.bottomSheetContent}>
          {selectedVerse && (
            <>
              {/* Header */}
              <View style={styles.bottomSheetHeader}>
                <ThemedText
                  style={[styles.bottomSheetTitle, { fontSize: fontSize }]}
                >
                  {juzHeader
                    ? `${juzHeader.title} – ${t("ayah")} ${
                        selectedVerse.sura
                      }:${selectedVerse.aya}`
                    : `${displayName} - ${t("ayah")} ${selectedVerse.aya}`}
                </ThemedText>
                <TouchableOpacity
                  onPress={() => bottomSheetRef.current?.close()}
                  style={styles.closeButton}
                >
                  <Ionicons
                    name="close-circle"
                    size={28}
                    color={Colors[cs].defaultIcon}
                  />
                </TouchableOpacity>
              </View>

              {/* Divider */}
              <View
                style={[styles.divider, { backgroundColor: Colors[cs].border }]}
              />

              {/* Content */}
              <View style={styles.infoContent}>
                {/* Arabic Text */}
                {selectedArabicVerse && (
                  <View style={styles.infoSection}>
                    <ThemedText
                      style={[styles.infoLabel, { fontSize: fontSize }]}
                    >
                      {t("arabicText")}:
                    </ThemedText>
                    <ThemedText
                      style={[
                        styles.infoArabicText,
                        {
                          fontSize: fontSize * 1.3,
                          lineHeight: lineHeight * 1.5,
                        },
                      ]}
                    >
                      {selectedArabicVerse.text}
                    </ThemedText>
                  </View>
                )}

                {/* Translation */}
                {lang !== "ar" && (
                  <View style={styles.infoSection}>
                    <ThemedText
                      style={[styles.infoLabel, { fontSize: fontSize }]}
                    >
                      {t("translation")}:
                    </ThemedText>
                    <ThemedText
                      style={[styles.infoTranslation, { fontSize: fontSize }]}
                    >
                      {selectedVerse.text}
                    </ThemedText>
                  </View>
                )}

                {/* Tafsir/Commentary */}
                <View style={styles.infoSection}>
                  <ThemedText
                    style={[styles.infoLabel, { fontSize: fontSize }]}
                  >
                    {t("tafsir")}:
                  </ThemedText>
                  <ThemedText
                    style={[styles.infoTafsir, { fontSize: fontSize }]}
                  >
                    {t("tafsirPlaceholder") ||
                      "Detailed explanation and commentary for this verse will appear here. This can include historical context, interpretations, and scholarly insights."}
                  </ThemedText>
                </View>

                {/* Additional Info */}
                <View style={styles.infoSection}>
                  <ThemedText
                    style={[styles.infoLabel, { fontSize: fontSize }]}
                  >
                    {t("additionalInfo")}:
                  </ThemedText>
                  <View style={styles.metaInfo}>
                    {!juzHeader && (
                      <ThemedText
                        style={[styles.metaText, { fontSize: fontSize }]}
                      >
                        • {t("surahNumber")}: {suraNumber}
                      </ThemedText>
                    )}
                    <ThemedText
                      style={[styles.metaText, { fontSize: fontSize }]}
                    >
                      • {t("verseNumber")}: {selectedVerse.sura}:
                      {selectedVerse.aya}
                    </ThemedText>
                    {!juzHeader && (
                      <ThemedText
                        style={[styles.metaText, { fontSize: fontSize }]}
                      >
                        • {t("revelation")}:{" "}
                        {suraInfo?.makki ? t("makki") : t("madani")}
                      </ThemedText>
                    )}
                  </View>
                </View>
              </View>
            </>
          )}
        </BottomSheetScrollView>
      </BottomSheet>
    </ThemedView>
  );
};

export default SuraScreen;

// -----------------------------------------------------------------------------
// helpers
// -----------------------------------------------------------------------------

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

// -----------------------------------------------------------------------------
// styles
// -----------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingWrap: {
    paddingTop: 32,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  headerContainer: {
    flex: 1,
    justifyContent: "center",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    marginTop: 15,
  },
  headerTextContainer: {
    flex: 1,
    marginHorizontal: 16,
  },
  suraName: {
    fontSize: 25,
    fontWeight: "700",
    lineHeight: 35,
  },
  suraNameAr: {
    fontSize: 25,
    textAlign: "right",
    lineHeight: 35,
  },
  subMeta: {
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 35,
    color: Colors.universal.grayedOut,
    marginBottom: 10,
    marginTop: -5
  },

  arabicTransliterationText: {
    fontStyle: "italic",
    fontWeight: "400",
    textAlign: "left",
    color: Colors.universal.grayedOut,
  },
  emptyText: {
    textAlign: "center",
    padding: 24,
  },

  bottomSheetContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  bottomSheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  bottomSheetTitle: {
    fontWeight: "700",
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  divider: {
    height: 1,
    marginBottom: 16,
  },
  infoContent: {
    paddingBottom: 20,
  },
  infoSection: {
    marginBottom: 20,
  },
  infoLabel: {
    fontWeight: "600",
    color: Colors.universal.grayedOut,
    marginBottom: 8,
  },
  infoArabicText: {
    textAlign: "right",
    fontWeight: "400",
  },
  infoTranslation: {},
  infoTafsir: {
    textAlign: "justify",
  },
  metaInfo: {
    gap: 4,
  },
  metaText: {},
});
