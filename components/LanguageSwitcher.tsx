import React from "react";
import {
  View,
  Pressable,
  Text,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { useLanguage } from "@/contexts/LanguageContext";
import { Colors } from "@/constants/Colors";
import { returnSize } from "@/utils/sizes";
import { ThemedText } from "./ThemedText";
import { useTranslation } from "react-i18next";
/**
 * A small UI widget with three buttons (“Deutsch” / “English” / “العربية”) that uses
 * LanguageContext to switch the app’s i18n language and persist it.
 */
export function LanguageSwitcher() {
  const { language, setAppLanguage, ready: langReady } = useLanguage();
  const { width, height } = useWindowDimensions();
  const { isLarge, isMedium } = returnSize(width, height);
  const { t } = useTranslation();
  const { isArabic } = useLanguage();
  const rtl = isArabic();
  const selectDeutsch = () => {
    if (langReady && language !== "de") {
      setAppLanguage("de");
    }
  };

  const selectEnglish = () => {
    if (langReady && language !== "en") {
      setAppLanguage("en");
    }
  };

  const selectArabic = () => {
    if (langReady && language !== "ar") {
      setAppLanguage("ar");
    }
  };

  return (
    <View style={[styles.container, rtl && styles.rtlContainer]}>
      <View style={rtl && styles.rtlTextContainer}>
        <ThemedText style={[styles.title, rtl && styles.rtlText]}>
          {t("language")}
        </ThemedText>
        <ThemedText style={[styles.subtitle, rtl && styles.rtlText]}>
          {t("selectAppLanguage")}
        </ThemedText>
      </View>
      <View style={[styles.buttons, rtl && styles.rtlButtons]}>
        <Pressable
          onPress={selectDeutsch}
          style={({ pressed }) => [
            styles.button,
            language === "de" && styles.buttonActive,
            { opacity: pressed ? 0.8 : 1, paddingHorizontal: isLarge ? 12 : 7 },
            rtl && { marginLeft: 0, marginRight: 8 },
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              language === "de" && styles.buttonTextActive,
            ]}
          >
            {t("deutsch")}
          </Text>
        </Pressable>
        <Pressable
          onPress={selectEnglish}
          style={({ pressed }) => [
            styles.button,
            language === "en" && styles.buttonActive,
            { opacity: pressed ? 0.8 : 1, paddingHorizontal: isLarge ? 12 : 7 },
            rtl && { marginLeft: 0, marginRight: 8 },
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              language === "en" && styles.buttonTextActive,
            ]}
          >
            {t("english")}
          </Text>
        </Pressable>
        <Pressable
          onPress={selectArabic}
          style={({ pressed }) => [
            styles.button,
            language === "ar" && styles.buttonActive,
            { opacity: pressed ? 0.8 : 1, paddingHorizontal: isLarge ? 12 : 7 },
            rtl && { marginLeft: 0, marginRight: 8 },
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              language === "ar" && styles.buttonTextActive,
            ]}
          >
            {t("arabic")}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.6,
  },
  buttons: {
    flexDirection: "row",
  },
  button: {
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.universal.link,
    marginLeft: 8,
  },
  buttonActive: {
    backgroundColor: Colors.universal.link,
  },
  buttonText: {
    fontSize: 14,
    color: Colors.universal.link,
  },
  buttonTextActive: {
    color: "#fff",
  },
  rtlContainer: {
    flexDirection: "row-reverse",
  },
  rtlTextContainer: {},
  rtlText: {
    textAlign: "right",
  },
  rtlButtons: {
    flexDirection: "row-reverse",
  },
});
