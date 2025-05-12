import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { getPrayerWithTranslations } from "@/utils/bufibDatabase";
import { useLanguage } from "@/contexts/LanguageContext";
import { PrayerType, PrayerWithTranslationType } from "@/constants/Types";

// Composite type: prayer record + its translations
type PrayerWithTranslations = PrayerType & {
  translations: PrayerWithTranslationType[];
};

interface RenderPrayerProps {
  prayerID: number;
}

const RenderPrayer: React.FC<RenderPrayerProps> = ({ prayerID }) => {
  const [prayer, setPrayer] = useState<PrayerWithTranslations | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { language } = useLanguage();

  useEffect(() => {
    const loadPrayer = async () => {
      try {
        const data = await getPrayerWithTranslations(prayerID);
        setPrayer(data as PrayerWithTranslations);
      } catch (error) {
        console.error("Error fetching prayer:", error);
      } finally {
        setLoading(false);
      }
    };
    loadPrayer();
  }, [prayerID]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!prayer) {
    return (
      <View style={styles.container}>
        <Text>No prayer found.</Text>
      </View>
    );
  }

  const currentTranslation = prayer.translations.find(
    (t) => t.language_code === language
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Arabic Text */}
      {prayer.arabic_text && (
        <Text style={styles.arabic}>{prayer.arabic_text}</Text>
      )}

      {/* Transliteration */}
      {prayer.transliteration_text && (
        <Text style={styles.transliteration}>
          {prayer.transliteration_text}
        </Text>
      )}

      {/* Translation */}
      {currentTranslation?.translated_text && (
        <View style={styles.translationBlock}>
          <Text style={styles.translationLabel}>
            {currentTranslation.language_code.toUpperCase()}
          </Text>
          <Text style={styles.translationText}>
            {currentTranslation.translated_text}
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  arabic: {
    textAlign: "right",
    fontSize: 24,
    marginBottom: 16,
  },
  transliteration: {
    fontSize: 18,
    fontStyle: "italic",
    marginBottom: 16,
  },
  translationBlock: {
    marginTop: 16,
  },
  translationLabel: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  translationText: {
    fontSize: 16,
  },
});

export default RenderPrayer;
