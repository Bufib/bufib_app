import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Animated,
  Platform,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { PrayerCategoryType, PrayerWithCategory } from "@/constants/Types";
import {
  getChildCategories,
  getPrayersForCategory,
  getCategoryByTitle,
  getAllPrayersForArabic,
} from "@/utils/bufibDatabase";
import { CoustomTheme } from "@/utils/coustomTheme";
import { useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import * as Haptics from "expo-haptics";
import { Stack } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";

// Icons for different categories
const categoryIcons: { [key: string]: string } = {
  dua: "heart-outline",
  ziyarat: "compass-outline",
  salat: "people-outline",
  munajat: "book-outline",
  tasibeh: "star-outline",
  default: "leaf-outline",
};

export default function CategoryScreen() {
  const { prayerCategory } = useLocalSearchParams<{ prayerCategory: string }>();
  const colorScheme = useColorScheme() || "light";
  const themeStyles = CoustomTheme();
  const { t } = useTranslation();
  const { language, isArabic } = useLanguage();

  const [childCategories, setChildCategories] = useState<PrayerCategoryType[]>(
    []
  );
  const [allPrayers, setAllPrayers] = useState<PrayerWithCategory[]>([]);
  const [filteredPrayers, setFilteredPrayers] = useState<PrayerWithCategory[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [currentCategory, setCurrentCategory] =
    useState<PrayerCategoryType | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] =
    useState<PrayerCategoryType | null>(null);

  // Helper function to get icon for category
  const getCategoryIcon = (name: string): string => {
    const lowercaseName = name.toLowerCase();
    for (const key in categoryIcons) {
      if (lowercaseName.includes(key)) {
        return categoryIcons[key];
      }
    }
    return categoryIcons.default;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setSelectedSubcategory(null);

        // Fetch prayerCategory by title
        const categoryData = await getCategoryByTitle(prayerCategory);
        if (!categoryData) {
          console.error("prayerCategory not found");
          return;
        }
        setCurrentCategory(categoryData);

        // Fetch subcategories using the parent category ID
        const categoryRows = await getChildCategories(categoryData.id);
        setChildCategories(categoryRows);

        // Fetch prayers depending on language
        if (language === "ar") {
          const prayerRows = await getAllPrayersForArabic(categoryData.id);
          setAllPrayers(prayerRows);
          setFilteredPrayers(prayerRows);
        } else {
          const prayerRows = await getPrayersForCategory(
            categoryData.id,
            language || "de"
          );
          setAllPrayers(prayerRows);
          setFilteredPrayers(prayerRows);
        }

        // Fade in animation
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }).start();
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [prayerCategory, language]);

  // Handle subcategory selection
  const handleSubcategoryPress = async (cat: PrayerCategoryType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (selectedSubcategory?.id === cat.id) {
      setSelectedSubcategory(null);
      setFilteredPrayers(allPrayers);
      return;
    }

    setSelectedSubcategory(cat);
    try {
      const subcategoryPrayers = await getPrayersForCategory(
        cat.id,
        language.toUpperCase()
      );
      setFilteredPrayers(subcategoryPrayers);
    } catch {
      const filtered = allPrayers.filter(
        (prayer) => prayer.category_id === cat.id
      );
      setFilteredPrayers(filtered.length ? filtered : allPrayers);
    }
  };

  const handlePrayerPress = (prayer: PrayerWithCategory) => {
    console.log("Press");
    router.push({
      pathname: "/(displayPrayer)/[prayer]",
      params: { prayer: prayer.id.toString() },
    });
  };

  if (loading) {
    return (
      <View
        style={[styles.loaderContainer, themeStyles.defaultBackgorundColor]}
      >
        <ActivityIndicator
          size="large"
          color={colorScheme === "dark" ? "#fff" : "#000"}
        />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, themeStyles.defaultBackgorundColor]}
    >
      <Stack.Screen
        options={{ title: prayerCategory, headerBackTitle: t("back") }}
      />

      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        style={{ opacity: fadeAnim }}
      >
        {/* Header */}
        <View style={styles.headerContainer}>
          <View
            style={[
              styles.headerIcon,
              {
                borderColor: Colors[colorScheme].border,
                backgroundColor: Colors[colorScheme].contrast,
              },
            ]}
          >
            <Ionicons
              name={getCategoryIcon(prayerCategory)}
              size={24}
              color={Colors.universal.primary}
            />
          </View>
          <ThemedText
            style={[styles.header, isArabic() && { textAlign: "right" }]}
          >
            {prayerCategory} ({allPrayers.length})
          </ThemedText>
        </View>

        {/* Subcategories */}
        {childCategories.length > 0 && (
          <View style={styles.sectionContainer}>
            <View
              style={[
                styles.sectionHeaderRow,
                isArabic() && { flexDirection: "row-reverse" },
              ]}
            >
              <ThemedText
                style={[
                  styles.sectionTitle,
                  isArabic() && { textAlign: "right" },
                ]}
              >
                {t("categories")}
              </ThemedText>
              {selectedSubcategory && (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedSubcategory(null);
                    setFilteredPrayers(allPrayers);
                  }}
                  style={styles.showAllButton}
                >
                  <ThemedText style={{ fontWeight: 500 }}>
                    {t("showAll")}
                  </ThemedText>
                </TouchableOpacity>
              )}
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipContainer}
            >
              {childCategories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: Colors[colorScheme].contrast,
                      borderColor: Colors[colorScheme].border,
                    },
                    selectedSubcategory?.id === cat.id && {
                      backgroundColor: Colors.universal.primary,
                      borderWidth: 1,
                      borderColor: Colors[colorScheme].border,
                    },
                  ]}
                  onPress={() => handleSubcategoryPress(cat)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selectedSubcategory?.id === cat.id
                        ? { color: "#fff", fontWeight: "600" }
                        : { color: colorScheme === "dark" ? "#fff" : "#000" },
                    ]}
                  >
                    {cat.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Prayers */}
        <View style={styles.sectionContainer}>
          <View
            style={[
              styles.sectionHeaderRow,
              isArabic() && { flexDirection: "row-reverse" },
            ]}
          >
            <ThemedText
              style={[
                styles.sectionTitle,
                isArabic() && { textAlign: "right" },
              ]}
            >
              {selectedSubcategory && ` • ${selectedSubcategory.title}`}
            </ThemedText>
          </View>

          {filteredPrayers.length > 0 ? (
            <View style={styles.prayerList}>
              {filteredPrayers.map((prayer) => (
                <TouchableOpacity
                  key={prayer.id}
                  style={[
                    styles.prayerCard,
                    { backgroundColor: Colors[colorScheme].contrast },
                  ]}
                  onPress={() => handlePrayerPress(prayer)}
                >
                  <View style={styles.prayerHeader}>
                    <View style={styles.prayerTitleContainer}>
                      <ThemedText
                        style={[
                          styles.prayerTitle,
                          isArabic() && { textAlign: "right" },
                        ]}
                        numberOfLines={1}
                      >
                        {prayer.name}
                      </ThemedText>
                    </View>
                  </View>
                  {prayer.prayer_text && (
                    <Text
                      style={[
                        styles.prayerText,
                        { color: Colors.universal.grayedOut },
                        isArabic() && { textAlign: "right" },
                      ]}
                      numberOfLines={2}
                    >
                      {prayer.prayer_text.trim()}
                    </Text>
                  )}
                  <View
                    style={[
                      styles.prayerFooter,
                      isArabic() ? { flexDirection: "row-reverse" } : {},
                    ]}
                  >
                    <Text
                      style={[
                        styles.readMore,
                        { color: Colors.universal.primary },
                      ]}
                    >
                      {t("readMore")}
                    </Text>
                    <Ionicons
                      name={isArabic() ? "chevron-back" : "chevron-forward"}
                      size={16}
                      color={Colors.universal.primary}
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons
                name="search-outline"
                size={36}
                color={colorScheme === "dark" ? "#64748b" : "#94a3b8"}
                style={styles.emptyStateIcon}
              />
              <Text
                style={[
                  styles.emptyStateText,
                  { color: colorScheme === "dark" ? "#94a3b8" : "#64748b" },
                  isArabic() && { textAlign: "right" },
                ]}
              >
                {t("noPrayer")}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setSelectedSubcategory(null);
                  setFilteredPrayers(allPrayers);
                }}
                style={[
                  styles.resetButton,
                  {
                    backgroundColor:
                      colorScheme === "dark" ? "#2d3748" : "#f1f5f9",
                  },
                ]}
              >
                <Text
                  style={{
                    color: colorScheme === "dark" ? "#90cdf4" : "#3b82f6",
                    fontWeight: "500",
                  }}
                >
                  {t("showAll")}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 30 },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },

  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    paddingVertical: 6,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
    borderWidth: 1,
  },
  header: { fontSize: 24, fontWeight: "700" },

  sectionContainer: { marginBottom: 24 },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: { fontSize: 18, fontWeight: "600" },
  showAllButton: { paddingVertical: 4, paddingHorizontal: 10 },

  chipContainer: { flexDirection: "row", paddingBottom: 8, paddingTop: 4 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 50,
    marginRight: 10,
    marginBottom: 8,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: { elevation: 1 },
    }),
  },
  chipText: { fontSize: 14, fontWeight: "500" },

  prayerList: { gap: 16 },
  prayerCard: {
    borderRadius: 12,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: { elevation: 2 },
    }),
  },
  prayerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  prayerTitleContainer: {
    flex: 1,
  },
  prayerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  prayerText: {
    fontSize: 15,
    marginBottom: 18,
  },
  prayerFooter: {
    flexDirection: "row",
    alignItems: "center",
  },
  readMore: {
    fontSize: 14,
    fontWeight: "600",
    marginRight: 1,
  },

  emptyState: {
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  emptyStateIcon: {
    marginBottom: 12,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },
  resetButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 50,
  },
});
