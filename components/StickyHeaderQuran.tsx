import React, { useState } from "react";
import { View, Text, StyleSheet, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";
import { ThemedText } from "@/components/ThemedText";
import HeaderLeftBackButton from "./HeaderLeftBackButton";
import FontSizePickerModal from "./FontSizePickerModal";
import { Colors } from "@/constants/Colors";
import { StickyHeaderQuranPropsType } from "@/constants/Types";
import { useLanguage } from "@/contexts/LanguageContext";
import { useDataVersionStore } from "@/stores/dataVersionStore";

export const StickyHeaderQuran: React.FC<StickyHeaderQuranPropsType> = ({
  suraNumber,
  suraInfo,
  displayName,
  juzHeader,
}) => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";
  const [modalVisible, setModalVisible] = useState(false);
  const isMakki = !!suraInfo?.makki;
  const showJuzOrPage = !!juzHeader;
  const { rtl } = useLanguage();

  return (
    <LinearGradient
      colors={["#3bc963", "#2ea853", "#228a3f"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientContainer}
    >
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <View style={styles.headerWrapper}>
          <View style={styles.headerContent}>
            <View
              style={{ flexDirection: "row", flex: 1, alignItems: "center" }}
            >
              <HeaderLeftBackButton
                style={{
                  color: "#FFFFFF",
                }}
              />
              <View style={styles.headerTextContainer}>
                {showJuzOrPage ? (
                  <>
                    <Text style={styles.suraName}>{juzHeader?.title}</Text>
                    {!!juzHeader?.subtitle && (
                      <Text style={styles.subMeta}>{juzHeader.subtitle}</Text>
                    )}
                  </>
                ) : (
                  <>
                    <Text style={[styles.suraName, rtl && styles.suraNameAr]}>
                      {displayName ||
                        suraInfo?.label_en ||
                        suraInfo?.label ||
                        ""}{" "}
                      ({suraNumber})
                    </Text>
                    <Text style={styles.subMeta}>
                      {t("ayatCount")}: {suraInfo?.nbAyat ?? "—"} ·{" "}
                      {isMakki ? t("makki") : t("madani")}
                    </Text>
                  </>
                )}
              </View>
            </View>
            <Ionicons
              name="text"
              size={28}
              color="#FFFFFF"
              onPress={() => setModalVisible(true)}
              style={{ marginRight: 15 }}
            />
          </View>
          <FontSizePickerModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    width: "100%",
  },
  safeArea: {
    flex: 1,
  },
  headerWrapper: {
    flex: 1,
    paddingLeft: 10,
    paddingBottom: 12,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  headerTextContainer: {
    marginLeft: 10,
  },
  suraName: {
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 24,
    color: "#FFFFFF",
  },
  suraNameAr: {
    fontSize: 20,
    textAlign: "right",
    lineHeight: 24,
    color: "#FFFFFF",
  },
  subMeta: {
    fontWeight: "600",
    fontSize: 14,
    lineHeight: 18,
    color: "#F0FDFA",
    marginTop: 2,
  },
});
