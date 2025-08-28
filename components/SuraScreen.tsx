import type React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { useEffect, useMemo, useState } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { useTranslation } from "react-i18next";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { Colors } from "@/constants/Colors";

import { whenDatabaseReady } from "@/db";
import { useLanguage } from "@/contexts/LanguageContext";
import { Language, SuraRowType, QuranVerseType } from "@/constants/Types";
import {
  getSurahVerses,
  getSurahDisplayName,
  getSurahInfoByNumber,
} from "@/db/queries/quran";

type VerseRow = QuranVerseType & { transliteration?: string | null };

const SuraScreen: React.FC = () => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";
  const { language } = useLanguage();
  const lang = useMemo(
    () => (language || "en").split("-")[0] as Language,
    [language]
  );

  const { suraId } = useLocalSearchParams<{ suraId: string }>();
  const suraNumber = useMemo(() => Number(suraId ?? 1), [suraId]);

  const [loading, setLoading] = useState(true);
  const [verses, setVerses] = useState<VerseRow[]>([]);
  const [info, setInfo] = useState<SuraRowType | null>(null);
  const [displayName, setDisplayName] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        await whenDatabaseReady();

        const [v, i, name] = await Promise.all([
          getSurahVerses(lang, suraNumber),
          getSurahInfoByNumber(suraNumber),
          getSurahDisplayName(suraNumber, lang),
        ]);

        if (!cancelled) {
          setVerses((v ?? []) as VerseRow[]);
          setInfo(i ?? null);
          setDisplayName(name ?? "");
        }
      } catch (e) {
        console.error("Failed to load surah:", e);
        if (!cancelled) {
          setVerses([]);
          setInfo(null);
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

  const Header = () => {
    const isMakki = !!info?.makki;

    return (
      <View style={styles.headerWrap}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <Text
              style={[
                styles.backGlyph,
                { color: Colors[colorScheme].defaultIcon },
              ]}
            >
              ‹
            </Text>
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text
              style={[
                styles.suraName,
                lang === "ar" && styles.suraNameAr,
                { color: Colors.universal.secondary },
              ]}
              numberOfLines={1}
            >
              {displayName || info?.label_en || info?.label || ""}
            </Text>
            <Text style={styles.subMeta} numberOfLines={1}>
              {t("ayatCount")}: {info?.nbAyat ?? "—"} ·{" "}
              {isMakki ? t("makki") : t("madani")}
            </Text>
          </View>

          <View style={styles.idBadge}>
            <Text style={styles.idBadgeText}>{suraNumber}</Text>
          </View>
        </View>

        {/* soft accent bar */}
        <View
          style={[
            styles.accentBar,
            { backgroundColor: isMakki ? "#00a8ff20" : "#44bd3220" },
          ]}
        />
      </View>
    );
  };

  const renderVerse = ({ item }: { item: VerseRow }) => {
    const isArabic = lang === "ar";
    const accent = info?.makki ? "#00a8ff" : "#44bd32";

    return (
      <View
        style={[styles.verseRow, { borderColor: Colors[colorScheme].border }]}
      >
        <View style={[styles.ayaPill, { borderColor: accent }]}>
          <Text style={[styles.ayaPillText, { color: accent }]}>
            {item.aya}
          </Text>
        </View>

        <View style={styles.verseBody}>
          <Text
            style={[
              styles.verseText,
              isArabic && styles.verseTextAr,
              { color: Colors[colorScheme].text },
            ]}
          >
            {item.text}
          </Text>

          {/* transliteration only for English if present */}
          {lang === "en" && !!(item as any)?.transliteration && (
            <Text
              style={[styles.translit, { color: Colors.universal.grayedOut }]}
            >
              {(item as any).transliteration}
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      {loading ? (
        <View style={styles.loadingWrap}>
          <LoadingIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={verses}
          keyExtractor={(v) => `${v.sura}-${v.aya}`}
          ListHeaderComponent={Header}
          renderItem={renderVerse}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <ThemedText style={styles.emptyText}>{t("noData")}</ThemedText>
          }
        />
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },

  loadingWrap: { paddingTop: 32 },

  listContent: {
    paddingHorizontal: 14,
    paddingBottom: 24,
  },

  // Header
  headerWrap: {
    paddingTop: 10,
    paddingBottom: 6,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    gap: 10,
  },
  backBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 10,
  },
  backGlyph: { fontSize: 26, fontWeight: "700" },
  headerCenter: { flex: 1, minWidth: 0 },
  suraName: {
    fontSize: 22,
    fontWeight: "800",
  },
  suraNameAr: {
    textAlign: "right",
    fontSize: 24,
    letterSpacing: 0.2,
  },
  subMeta: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: "700",
    color: "#6F7A94",
  },
  idBadge: {
    minWidth: 44,
    height: 44,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#A7B0C8",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  idBadgeText: { fontSize: 16, fontWeight: "900", color: "#5B657F" },
  accentBar: {
    height: 8,
    marginTop: 10,
    marginHorizontal: 12,
    borderRadius: 999,
  },

  // Verse row
  verseRow: {
    flexDirection: "row",
    gap: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  ayaPill: {
    minWidth: 36,
    height: 36,
    borderRadius: 9,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  ayaPillText: { fontSize: 14, fontWeight: "900" },

  verseBody: { flex: 1, minWidth: 0 },
  verseText: {
    fontSize: 16,
    lineHeight: 26,
    fontWeight: "600",
  },
  verseTextAr: {
    textAlign: "right",
    fontSize: 20,
    lineHeight: 36,
    letterSpacing: 0.2,
  },
  translit: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "700",
  },

  emptyText: { textAlign: "center", padding: 24 },
});

export default SuraScreen;

