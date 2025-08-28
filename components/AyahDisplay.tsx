import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native"
import type { QuranDisplayData, Language } from "@/types/quran"

interface AyahDisplayProps {
  data: QuranDisplayData | null
  language: Language
  loading: boolean
}

export function AyahDisplay({ data, language, loading }: AyahDisplayProps) {
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={styles.loadingText}>Loading Ayahs...</Text>
      </View>
    )
  }

  if (!data) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>No data available</Text>
      </View>
    )
  }

  const isArabic = language === "ar"
  const showTransliteration = language === "en"

  const getMarkerForAyah = (ayahNumber: number) => {
    const markers = []

    if (data.markers.hizb?.some((h) => h.aya === ayahNumber)) {
      markers.push("حزب")
    }
    if (data.markers.juz?.some((j) => j.aya === ayahNumber)) {
      const juz = data.markers.juz.find((j) => j.aya === ayahNumber)
      markers.push(`جزء ${juz?.page || ""}`)
    }
    if (data.markers.ruku?.some((r) => r.aya === ayahNumber)) {
      markers.push("ركوع")
    }
    if (data.markers.sajda?.some((s) => s.aya === ayahNumber)) {
      markers.push("سجدة")
    }

    return markers
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Sura Header */}
      <View style={styles.suraHeader}>
        <Text style={styles.suraTitle}>{data.sura.label_en || data.sura.label}</Text>
        <Text style={styles.suraArabicTitle}>{data.sura.label}</Text>
        <Text style={styles.suraInfo}>
          {data.sura.nbAyat} آيات • {data.sura.makki ? "مكية" : "مدنية"}
        </Text>
      </View>

      {/* Bismillah for all suras except At-Tawbah (9) */}
      {data.sura.id !== 9 && (
        <View style={styles.bismillahContainer}>
          <Text style={styles.bismillah}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</Text>
        </View>
      )}

      {/* Ayahs */}
      <View style={styles.ayahsContainer}>
        {data.ayahs.map((ayah) => {
          const markers = getMarkerForAyah(ayah.aya)

          return (
            <View key={ayah.id} style={styles.ayahContainer}>
              {/* Markers */}
              {markers.length > 0 && (
                <View style={styles.markersContainer}>
                  {markers.map((marker, index) => (
                    <View key={index} style={styles.marker}>
                      <Text style={styles.markerText}>{marker}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Ayah Text */}
              <View style={styles.ayahContent}>
                <Text style={[styles.ayahText, isArabic && styles.arabicText]}>
                  {ayah.text}
                  {isArabic && <Text style={styles.ayahNumber}> ﴿{ayah.aya}﴾</Text>}
                </Text>

                {/* Transliteration for English */}
                {showTransliteration && ayah.transliteration && (
                  <Text style={styles.transliteration}>{ayah.transliteration}</Text>
                )}

                {/* Ayah number for non-Arabic */}
                {!isArabic && <Text style={styles.ayahNumberWestern}>({ayah.aya})</Text>}
              </View>
            </View>
          )
        })}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666666",
  },
  errorText: {
    fontSize: 16,
    color: "#D32F2F",
    textAlign: "center",
  },
  suraHeader: {
    backgroundColor: "#2E7D32",
    padding: 24,
    alignItems: "center",
  },
  suraTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  suraArabicTitle: {
    fontSize: 20,
    color: "#FFFFFF",
    marginBottom: 8,
    textAlign: "center",
  },
  suraInfo: {
    fontSize: 14,
    color: "#E8F5E8",
  },
  bismillahContainer: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    alignItems: "center",
    marginBottom: 8,
  },
  bismillah: {
    fontSize: 20,
    color: "#2E7D32",
    textAlign: "center",
    lineHeight: 32,
  },
  ayahsContainer: {
    padding: 16,
  },
  ayahContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
  },
  markersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 12,
    paddingBottom: 0,
  },
  marker: {
    backgroundColor: "#E8F5E8",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  markerText: {
    fontSize: 12,
    color: "#2E7D32",
    fontWeight: "500",
  },
  ayahContent: {
    padding: 16,
  },
  ayahText: {
    fontSize: 18,
    lineHeight: 32,
    color: "#1B1B1B",
    textAlign: "left",
  },
  arabicText: {
    fontSize: 22,
    lineHeight: 40,
    textAlign: "right",
    fontFamily: "System", // Use system Arabic font
  },
  ayahNumber: {
    color: "#2E7D32",
    fontWeight: "bold",
  },
  ayahNumberWestern: {
    fontSize: 14,
    color: "#2E7D32",
    fontWeight: "bold",
    marginTop: 8,
    textAlign: "right",
  },
  transliteration: {
    fontSize: 16,
    color: "#666666",
    fontStyle: "italic",
    marginTop: 8,
    lineHeight: 24,
  },
})
