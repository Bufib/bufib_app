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
import i18n from "@/utils/i18n";
import { returnSize } from "@/utils/sizes";
import { ThemedText } from "./ThemedText";
/**
 * A small UI widget with three buttons (“Deutsch” / “English” / “العربية”) that uses
 * LanguageContext to switch the app’s i18n language and persist it.
 */
export function LanguageSwitcher() {
  const { language, setAppLanguage, ready: langReady } = useLanguage();
  const { width, height } = useWindowDimensions();
  const { isLarge, isMedium } = returnSize(width, height);
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
    <View style={styles.container}>
      <View>
        <ThemedText style={styles.title}>Sprache</ThemedText>
        <ThemedText style={styles.subtitle}>App-Sprache wählen</ThemedText>
      </View>
      <View style={styles.buttons}>
        <Pressable
          onPress={selectDeutsch}
          style={({ pressed }) => [
            styles.button,
            language === "de" && styles.buttonActive,
            { opacity: pressed ? 0.8 : 1, paddingHorizontal: isLarge ? 12 : 7 },
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              language === "de" && styles.buttonTextActive,
            ]}
          >
            Deutsch
          </Text>
        </Pressable>

        <Pressable
          onPress={selectEnglish}
          style={({ pressed }) => [
            styles.button,
            language === "en" && styles.buttonActive,
            { opacity: pressed ? 0.8 : 1, paddingHorizontal: isLarge ? 12 : 7 },
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              language === "en" && styles.buttonTextActive,
            ]}
          >
            English
          </Text>
        </Pressable>

        <Pressable
          onPress={selectArabic}
          style={({ pressed }) => [
            styles.button,
            language === "ar" && styles.buttonActive,
            { opacity: pressed ? 0.8 : 1, paddingHorizontal: isLarge ? 12 : 7 },
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              language === "ar" && styles.buttonTextActive,
            ]}
          >
            العربية
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
});
