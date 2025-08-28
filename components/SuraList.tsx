import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ⬇️ Adjust these imports to your project structure
// The types and DB helpers come from the code you provided.
import { Language, SuraRowType } from "@/constants/Types";
import { getSurahList } from "@/db/queries/quran";

/**
 * Modern, stylish Expo/React Native component to display the list of Quran surahs.
 * - Localized titles (ar/de/en)
 * - Fast in-memory search
 * - Pull-to-refresh
 * - Makki/Madani + ayah count chips
 * - Tactile press feedback
 */
export type SuraListProps = {
  language?: Language; // default: "ar"
  enableSearch?: boolean; // default: true
  onSelect?: (sura: SuraRowType) => void; // e.g., navigate to a Surah screen
  header?: React.ReactNode; // optional custom header above the search bar
  style?: any;
};

const SEARCH_PLACEHOLDER: Record<Language, string> = {
  ar: "ابحث عن سورة…",
  de: "Suche nach einer Sure…",
  en: "Search a surah…",
};

export default function SuraList({
  language = "ar",
  enableSearch = true,
  onSelect,
  header,
  style,
}: SuraListProps) {
  const colorScheme = useColorScheme() || "light";
  const insets = useSafeAreaInsets();

  const [allSuras, setAllSuras] = useState<SuraRowType[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getSurahList();
      setAllSuras(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const data = await getSurahList();
      setAllSuras(data);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allSuras;
    return allSuras.filter((s) => {
      const ar = s.label?.toLowerCase() ?? "";
      const en = s.label_en?.toLowerCase() ?? "";
      const de = s.label_de?.toLowerCase() ?? "";
      const num = String(s.orderId);
      return (
        ar.includes(q) || en.includes(q) || de.includes(q) || num.includes(q)
      );
    });
  }, [allSuras, search]);

  const cardBg = colorScheme === "dark" ? "#111318" : "#ffffff";
  const pageBg = colorScheme === "dark" ? "#0A0A0B" : "#F7F7FA";
  const border = colorScheme === "dark" ? "#1D1F26" : "#E8E8EF";
  const textPri = colorScheme === "dark" ? "#F2F3F5" : "#14151A";
  const textSec = colorScheme === "dark" ? "#AEB2BB" : "#5A5F6B";
  const accent = colorScheme === "dark" ? "#8BC6FF" : "#1D64DB";

  const renderItem: ListRenderItem<SuraRowType> = ({ item }) => {
    const isMakki = item.makki === 1;
    const placeLabel = isMakki ? "Makki" : "Madani";

    const localizedName = (() => {
      if (language === "de") return item.label_de || item.label;
      if (language === "en") return item.label_en || item.label;
      return item.label; // ar
    })();

    return (
      <Pressable
        onPress={() => onSelect?.(item)}
        android_ripple={{ color: colorScheme === "dark" ? "#1E2230" : "#E6ECFF" }}
        style={({ pressed }) => [
          styles.card,
          {
            backgroundColor: cardBg,
            borderColor: border,
            opacity: pressed ? 0.96 : 1,
          },
        ]}
      >
        <View style={styles.row}>
          <View style={[styles.number, { borderColor: border, backgroundColor: pageBg }]}>
            <Text style={[styles.numberText, { color: accent }]}>{item.orderId}</Text>
          </View>

          <View style={styles.info}>
            <Text numberOfLines={1} style={[styles.title, { color: textPri }]}>
              {localizedName}
            </Text>
            {language !== "ar" && (
              <Text numberOfLines={1} style={[styles.subtitle, { color: textSec }]}>
                {item.label}
              </Text>
            )}

            <View style={styles.chipsRow}>
              <Chip
                text={`${item.nbAyat} ayat`}
                icon={<MaterialCommunityIcons name="book-open-variant" size={14} color={textSec} />}
                bg={colorScheme === "dark" ? "#151820" : "#F2F4FA"}
                fg={textSec}
              />
              <Chip
                text={placeLabel}
                icon={<Ionicons name={isMakki ? "moon" : "sunny"} size={14} color={textSec} />}
                bg={colorScheme === "dark" ? "#151820" : "#F2F4FA"}
                fg={textSec}
              />
              {typeof item.ruku === "number" && (
                <Chip
                  text={`Ruku ${item.ruku}`}
                  icon={<MaterialCommunityIcons name="bookmark-outline" size={14} color={textSec} />}
                  bg={colorScheme === "dark" ? "#151820" : "#F2F4FA"}
                  fg={textSec}
                />
              )}
            </View>
          </View>

          <Ionicons
            name="chevron-forward"
            size={18}
            color={colorScheme === "dark" ? "#9AA2B1" : "#9AA2B1"}
            style={{ alignSelf: "center" }}
          />
        </View>
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: pageBg, paddingTop: Math.max(insets.top - 6, 8) }, style]}>
      {header}

      {enableSearch && (
        <View style={[styles.searchBox, { borderColor: border, backgroundColor: colorScheme === "dark" ? "#0F1116" : "#FFFFFF" }]}> 
          <Ionicons name="search" size={18} color={textSec} style={{ marginRight: 8 }} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder={SEARCH_PLACEHOLDER[language]}
            placeholderTextColor={textSec}
            style={[styles.searchInput, { color: textPri }]}
            autoCorrect={false}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch("")}> 
              <Ionicons name="close-circle" size={18} color={textSec} />
            </Pressable>
          )}
        </View>
      )}

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="small" color={accent} />
          <Text style={{ marginTop: 8, color: textSec }}>Loading surahs…</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: insets.bottom + 24, paddingTop: 4 }}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={accent} />}
          ListEmptyComponent={() => (
            <View style={{ alignItems: "center", padding: 24 }}>
              <Ionicons name="search" size={28} color={textSec} />
              <Text style={{ marginTop: 8, color: textSec, textAlign: "center" }}>
                No results. Try a different query.
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

function Chip({ icon, text, bg, fg }: { icon: React.ReactNode; text: string; bg: string; fg: string }) {
  return (
    <View style={[styles.chip, { backgroundColor: bg, borderColor: bg }]}> 
      {icon}
      <Text style={[styles.chipText, { color: fg }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: Platform.select({ ios: 10, android: 6, default: 8 }),
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: Platform.select({ ios: 4, android: 2, default: 4 }),
  },
  loadingWrap: {
    alignItems: "center",
    paddingVertical: 24,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  number: {
    width: 42,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  numberText: {
    fontSize: 16,
    fontWeight: "700",
  },
  info: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  chipsRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "600",
  },
});

/**
 * ---------------------------------------------
 * Example usage (Expo Router) — put in a screen
 * ---------------------------------------------
 *
 * import { useRouter } from "expo-router";
 * 
 * export default function QuranIndexScreen() {
 *   const router = useRouter();
 *   return (
 *     <SuraList
 *       language="de"
 *       onSelect={(s) => router.push(`/quran/${s.orderId}`)}
 *     />
 *   );
 * }
 */
