import type React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Colors } from "../constants/Colors";
import Entypo from "@expo/vector-icons/Entypo";
import { whenDatabaseReady } from "@/db";
import { useLanguage } from "@/contexts/LanguageContext";
import { Language, SuraRowType } from "@/constants/Types";
import { getSurahList } from "@/db/queries/quran";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { LoadingIndicator } from "./LoadingIndicator";
import { router } from "expo-router";

const SuraList: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const lang = useMemo(
    () => (language || "en").split("-")[0] as Language,
    [language]
  );

  const [suras, setSuras] = useState<SuraRowType[]>([]);
  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme() || "light";

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        await whenDatabaseReady();
        const rows = await getSurahList();
        if (!cancelled) setSuras(rows ?? []);
      } catch (e) {
        console.error("Failed to load suras:", e);
        if (!cancelled) setSuras([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [lang]);

  const getSuraName = (s: SuraRowType) => {
    if (lang === "ar") return s.label ?? s.label_en ?? s.label_de ?? "";
    if (lang === "de") return s.label_de ?? s.label_en ?? s.label ?? "";
    return s.label_en ?? s.label_de ?? s.label ?? "";
  };

  const renderSuraItem = ({ item }: { item: SuraRowType }) => {
    const name = getSuraName(item);
    const isMakki = !!item.makki;

    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: Colors[colorScheme].contrast }]}
        activeOpacity={0.7}
        onPress={() =>
          router.push({
            pathname: "./knowledge/(quran)/sura",
            params: {
              suraId: item.id.toString(),
            },
          })
        }
      >
        <View style={styles.cardHeader}>
          <View
            style={[
              styles.badge,
              {
                borderColor: isMakki ? "#00a8ff" : "#44bd32",
              },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                {
                  color: isMakki ? "#00a8ff" : "#44bd32",
                },
              ]}
            >
              {item.id}
            </Text>
          </View>

          <View style={styles.titleBlock}>
            <ThemedText
              style={[styles.suraTitle, lang === "ar" && styles.suraTitleAr]}
            >
              {name}
            </ThemedText>

            <View style={styles.metaRow}>
              <View style={styles.chip}>
                <ThemedText style={styles.chipText}>
                  {t("ayatCount")}: {item.nbAyat ?? "—"}
                </ThemedText>
              </View>
              <View
                style={[
                  styles.tag,
                  {
                    backgroundColor: isMakki ? "#00a8ff" : "#44bd32",
                  },
                ]}
              >
                <Text style={[styles.tagText]}>
                  {isMakki ? t("makki") : t("madani")}
                </Text>
              </View>
            </View>
          </View>

          <Entypo
            name="chevron-small-right"
            size={24}
            color={Colors[colorScheme].defaultIcon}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ThemedView style={styles.container}>
      {loading ? (
        <View style={styles.loadingWrap}>
          <LoadingIndicator size={"large"} />
        </View>
      ) : (
        <FlatList
          data={suras}
          style={{ marginTop: 10 }}
          renderItem={renderSuraItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <ThemedText style={styles.emptyText}>{t("noData")}</ThemedText>
          }
        />
      )}
    </ThemedView>
  );
};

const CARD_RADIUS = 16;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Header
  headerWrap: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "500",
  },
  legendRow: {
    flexDirection: "row",
    gap: 16,
    marginTop: 12,
    alignItems: "center",
  },
  legendItem: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    fontWeight: "600",
  },

  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },

  loadingWrap: {
    paddingTop: 32,
  },

  // Card
  card: {
    backgroundColor: Colors.light.contrast,
    borderRadius: CARD_RADIUS,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  badge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  badgeText: {
    fontSize: 16,
    fontWeight: "800",
  },

  titleBlock: {
    flex: 1,
    minWidth: 0,
  },
  suraTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 8,
  },
  suraTitleAr: {
    textAlign: "right",
    fontSize: 20,
    letterSpacing: 0.2,
  },

  metaRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    flexWrap: "wrap",
  },

  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.2,
  },

  tag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.3,
    color: "#fff",
  },

  chevron: {
    marginLeft: 8,
    fontSize: 24,
    fontWeight: "600",
  },

  divider: {
    height: 1,
    marginVertical: 12,
    borderRadius: 1,
  },

  statsRow: {
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "space-between",
  },
  statBox: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  statSeparator: {
    width: 8,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 2,
    letterSpacing: 0.2,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "800",
  },

  emptyText: {
    textAlign: "center",
    padding: 24,
  },
});

export default SuraList;
