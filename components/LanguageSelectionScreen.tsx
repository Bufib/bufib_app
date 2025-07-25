// src/screens/LanguageSelection.tsx
import React from "react";
import { View, Button, StyleSheet, Text, Pressable } from "react-native";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import { ThemedText } from "./ThemedText";
import { Colors } from "@/constants/Colors";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "de", label: "Deutsch" },
  { code: "ar", label: "العربية" },
];

export default function LanguageSelection() {
  const { t } = useTranslation();
  const { setAppLanguage } = useLanguage();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("chooseLanguage")}</Text>
      {LANGUAGES.map(({ code, label }) => (
        <View key={code} style={styles.button}>
          <Pressable onPress={() => setAppLanguage(code)}>
            <ThemedText style={{ fontSize: 18, color: Colors.universal.link }}>
              {label}
            </ThemedText>
          </Pressable>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: "center",
  },
  button: {
    marginVertical: 8,
    alignItems: "center"
  },
});
