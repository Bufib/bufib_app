// import type React from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   useColorScheme,
// } from "react-native";
// import { useEffect, useMemo, useState } from "react";
// import { useLocalSearchParams, router } from "expo-router";
// import { useTranslation } from "react-i18next";

// import { ThemedView } from "@/components/ThemedView";
// import { ThemedText } from "@/components/ThemedText";
// import { LoadingIndicator } from "@/components/LoadingIndicator";
// import { Colors } from "@/constants/Colors";

// import { whenDatabaseReady } from "@/db";
// import { useLanguage } from "@/contexts/LanguageContext";
// import { SuraRowType, QuranVerseType, LanguageCode } from "@/constants/Types";
// import {
//   getSurahVerses,
//   getSurahDisplayName,
//   getSurahInfoByNumber,
// } from "@/db/queries/quran";
// import { SafeAreaView } from "react-native-safe-area-context";
// import HeaderLeftBackButton from "./HeaderLeftBackButton";

// const SuraScreen = () => {
//   const { t } = useTranslation();
//   const colorScheme = useColorScheme() || "light";
//   const { language, isArabic } = useLanguage();
//   const lang = (language ?? "de") as LanguageCode;

//   const { suraId } = useLocalSearchParams<{ suraId: string }>();
//   const suraNumber = useMemo(() => Number(suraId ?? 1), [suraId]);

//   const [loading, setLoading] = useState(true);
//   const [verses, setVerses] = useState<QuranVerseType[]>([]);
//   const [suraInfo, setSuraInfo] = useState<SuraRowType | null>(null);
//   const [displayName, setDisplayName] = useState<string>("");

//   useEffect(() => {
//     let cancelled = false;
//     (async () => {
//       try {
//         setLoading(true);
//         const [vers, info, name] = await Promise.all([
//           getSurahVerses(lang, suraNumber),
//           getSurahInfoByNumber(suraNumber),
//           getSurahDisplayName(suraNumber, lang),
//         ]);

//         if (!cancelled) {
//           setVerses((vers ?? []) as QuranVerseType[]);
//           setSuraInfo(info ?? null);
//           setDisplayName(name ?? "");
//         }
//       } catch (error) {
//         console.error("Failed to load surah:", error);
//         if (!cancelled) {
//           setVerses([]);
//           setSuraInfo(null);
//           setDisplayName("");
//         }
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     })();
//     return () => {
//       cancelled = true;
//     };
//   }, [lang, suraNumber]);

//   const Header = () => {
//     const isMakki = !!suraInfo?.makki;

//     return (
//       <SafeAreaView edges={["top"]} style={styles.headerContainer}>
//         <View style={styles.headerContent}>
//           <HeaderLeftBackButton />
//           <View style={styles.headerTextContainer}>
//             <ThemedText
//               type="title"
//               style={[styles.suraName, isArabic() && styles.suraNameAr]}
//             >
//               {displayName || suraInfo?.label_en || suraInfo?.label || ""}
//             </ThemedText>
//             <Text style={styles.subMeta} numberOfLines={1}>
//               {t("ayatCount")}: {suraInfo?.nbAyat ?? "—"} ·{" "}
//               {isMakki ? t("makki") : t("madani")}
//             </Text>
//           </View>

//           <View style={styles.idBadge}>
//             <Text style={styles.idBadgeText}>{suraNumber}</Text>
//           </View>
//         </View>
//       </SafeAreaView>
//     );
//   };

//   const renderVerse = ({ item }: { item: QuranVerseType }) => {
//     const accent = suraInfo?.makki ? "#00a8ff" : "#44bd32";

//     return (
//       <View
//         style={[styles.verseRow, { borderColor: Colors[colorScheme].border }]}
//       >
//         <View style={[styles.ayaPill, { borderColor: accent }]}>
//           <Text style={[styles.ayaPillText, { color: accent }]}>
//             {item.aya}
//           </Text>
//         </View>

//         <View style={styles.verseBody}>
//           <Text
//             style={[
//               styles.verseText,
//               isArabic() && styles.verseTextAr,
//               { color: Colors[colorScheme].text },
//             ]}
//           >
//             {item.text}
//           </Text>

//           {/* transliteration only for English if present */}
//           {language === "en" && !!(item as any)?.transliteration && (
//             <Text
//               style={[styles.translit, { color: Colors.universal.grayedOut }]}
//             >
//               {(item as any).transliteration}
//             </Text>
//           )}
//         </View>
//       </View>
//     );
//   };

//   return (
//     <ThemedView style={styles.container}>
//       {loading ? (
//         <View style={styles.loadingWrap}>
//           <LoadingIndicator size="large" />
//         </View>
//       ) : (
//         <FlatList
//           data={verses}
//           keyExtractor={(v) => `${v.sura}-${v.aya}`}
//           ListHeaderComponent={Header}
//           renderItem={renderVerse}
//           contentContainerStyle={styles.listContent}
//           showsVerticalScrollIndicator={false}
//           ListEmptyComponent={
//             <ThemedText style={styles.emptyText}>{t("noData")}</ThemedText>
//           }
//         />
//       )}
//     </ThemedView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//   },

//   loadingWrap: { paddingTop: 32 },

//   listContent: {
//     paddingHorizontal: 14,
//     paddingBottom: 24,
//   },
//   headerContainer: {
//     flex: 1,
//   },
//   headerContent: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 15,
//     marginBottom: 20,
//   },
//   headerTextContainer: {
//   },

//   backBtn: {
//     paddingHorizontal: 8,
//     paddingVertical: 6,
//     borderRadius: 10,
//   },
//   backGlyph: {
//     fontSize: 26,
//     fontWeight: "700",
//     backgroundColor: "green",
//   },
//   suraName: {},
//   suraNameAr: {
//     textAlign: "right",
//   },
//   subMeta: {
//     marginTop: 2,
//     fontSize: 12,
//     fontWeight: "700",
//     color: "#6F7A94",
//   },
//   idBadge: {
//     minWidth: 44,
//     height: 44,
//     paddingHorizontal: 10,
//     borderRadius: 12,
//     borderWidth: 2,
//     borderColor: "#A7B0C8",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#FFFFFF",
//   },
//   idBadgeText: { fontSize: 16, fontWeight: "900", color: "#5B657F" },
//   accentBar: {
//     height: 8,
//     marginTop: 10,
//     marginHorizontal: 12,
//     borderRadius: 999,
//   },

//   // Verse row
//   verseRow: {
//     flexDirection: "row",
//     gap: 10,
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//   },
//   ayaPill: {
//     minWidth: 36,
//     height: 36,
//     borderRadius: 9,
//     borderWidth: 2,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#FFFFFF",
//   },
//   ayaPillText: { fontSize: 14, fontWeight: "900" },

//   verseBody: { flex: 1, minWidth: 0 },
//   verseText: {
//     fontSize: 16,
//     lineHeight: 26,
//     fontWeight: "600",
//   },
//   verseTextAr: {
//     textAlign: "right",
//     fontSize: 20,
//     lineHeight: 36,
//     letterSpacing: 0.2,
//   },
//   translit: {
//     marginTop: 6,
//     fontSize: 12,
//     fontWeight: "700",
//   },

//   emptyText: { textAlign: "center", padding: 24 },
// });

// export default SuraScreen;





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
import Feather from "@expo/vector-icons/Feather";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { Colors } from "@/constants/Colors";

import { whenDatabaseReady } from "@/db";
import { useLanguage } from "@/contexts/LanguageContext";
import { SuraRowType, QuranVerseType, LanguageCode } from "@/constants/Types";
import {
  getSurahVerses,
  getSurahDisplayName,
  getSurahInfoByNumber,
} from "@/db/queries/quran";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderLeftBackButton from "./HeaderLeftBackButton";
import { color } from "@cloudinary/url-gen/qualifiers/background";

const SuraScreen = () => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";
  const { language, isArabic } = useLanguage();
  const lang = (language ?? "de") as LanguageCode;

  const { suraId } = useLocalSearchParams<{ suraId: string }>();
  const suraNumber = useMemo(() => Number(suraId ?? 1), [suraId]);

  const [loading, setLoading] = useState(true);
  const [verses, setVerses] = useState<QuranVerseType[]>([]);
  const [arabicVerses, setArabicVerses] = useState<QuranVerseType[]>([]);
  const [suraInfo, setSuraInfo] = useState<SuraRowType | null>(null);
  const [displayName, setDisplayName] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const [vers, arabicVers, info, name] = await Promise.all([
          getSurahVerses(lang, suraNumber),
          getSurahVerses("ar", suraNumber),
          getSurahInfoByNumber(suraNumber),
          getSurahDisplayName(suraNumber, lang),
        ]);

        if (!cancelled) {
          setVerses((vers ?? []) as QuranVerseType[]);
          setArabicVerses((arabicVers ?? []) as QuranVerseType[]);
          setSuraInfo(info ?? null);
          setDisplayName(name ?? "");
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

  const Header = () => {
    const isMakki = !!suraInfo?.makki;

    return (
      <SafeAreaView edges={["top"]} style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <HeaderLeftBackButton />
          <View style={styles.headerTextContainer}>
            <ThemedText
              type="title"
              style={[styles.suraName, isArabic() && styles.suraNameAr]}
            >
              {displayName || suraInfo?.label_en || suraInfo?.label || ""}
            </ThemedText>
            <ThemedText style={styles.subMeta} numberOfLines={1}>
              {t("ayatCount")}: {suraInfo?.nbAyat ?? "—"} ·{" "}
              {isMakki ? t("makki") : t("madani")}
            </ThemedText>
          </View>
          <View
            style={[
              styles.idBadge,
              {
                backgroundColor: Colors[colorScheme].contrast,
                borderColor: Colors[colorScheme].border,
              },
            ]}
          >
            <ThemedText style={styles.idBadgeText}>{suraNumber}</ThemedText>
          </View>
        </View>
      </SafeAreaView>
    );
  };

  const renderVerse = ({
    item,
    index,
  }: {
    item: QuranVerseType;
    index: number;
  }) => {
    // Find corresponding Arabic verse
    const arabicVerse = arabicVerses.find((v) => v.aya === item.aya);

    return (
      <View
        style={[
          styles.verseCard,
          { backgroundColor: Colors[colorScheme].contrast },
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
              <ThemedText style={styles.actionButtonText}>▶</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: Colors[colorScheme].background },
              ]}
            >
              <Feather
                name="bookmark"
                size={20.5}
                color={Colors[colorScheme].defaultIcon}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.verseContent}>
          {/* Arabic text */}
          {arabicVerse && (
            <ThemedText style={styles.arabicText}>
              {arabicVerse.text}
            </ThemedText>
          )}

          {/* Translation */}
          <ThemedText style={styles.translationText}>{item.text}</ThemedText>

          {/* Transliteration for English */}
          {language === "en" && !!(item as any)?.transliteration && (
            <ThemedText style={styles.transliterationText}>
              {(item as any).transliteration}
            </ThemedText>
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
  container: {
    flex: 1,
  },

  loadingWrap: {
    paddingTop: 32,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },

  headerContainer: {},

  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    marginBottom: 20,
  },

  headerTextContainer: {
    flex: 1,
    marginHorizontal: 16,
    gap: 5,
  },

  suraName: {},
  subMeta: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.universal.grayedOut,
  },
  suraNameAr: {
    textAlign: "right",
    fontSize: 24,
  },

  idBadge: {
    minWidth: 44,
    height: 44,
    paddingHorizontal: 10,
    borderRadius: 22,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },

  idBadgeText: {
    fontSize: 16,
    fontWeight: "800",
  },

  verseCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
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

  verseNumberText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },

  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  actionButtonText: {
    fontSize: 14,
  },

  verseContent: {
    gap: 12,
  },

  arabicText: {
    fontSize: 24,
    lineHeight: 40,
    textAlign: "right",
    fontWeight: "400",
    letterSpacing: 0.5,
  },

  translationText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500",
  },

  transliterationText: {
    fontSize: 14,
    lineHeight: 20,
    fontStyle: "italic",
    fontWeight: "400",
  },

  emptyText: {
    textAlign: "center",
    padding: 24,
  },
});

export default SuraScreen;

