import { StyleSheet, View } from "react-native";
import React from "react";
import { ThemedText } from "./ThemedText";
import { Colors } from "@/constants/Colors";

const BasmalaRow = ({
  fontSize,
  lineHeight,
  rtl,
  lang,
  t,
}: {
  fontSize: number;
  lineHeight: number;
  rtl: boolean;
  lang: string;
  t: (language: string) => string;
}) => {
  return (
    <View style={styles.basmalaWrap}>
      <ThemedText
        style={[
          styles.basmalaArabic,
          {
            fontSize: fontSize * 1.2,
            lineHeight: lineHeight * (rtl ? 1.4 : 1.25),
          },
        ]}
      >
        بِسْمِ ٱللّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
      </ThemedText>

      {lang !== "ar" && (
        <ThemedText style={styles.basmalaTranslation}>
          {t("basmala")}
        </ThemedText>
      )}
    </View>
  );
};

export default BasmalaRow;

const styles = StyleSheet.create({
  basmalaWrap: {
    marginTop: 10,
    marginHorizontal: 10,
    paddingVertical: 8,
    alignItems: "center",
  },
  basmalaArabic: {
    textAlign: "center",
    fontWeight: "600",
  },
  basmalaTranslation: {
    marginTop: 4,
    textAlign: "center",
    color: Colors.universal.grayedOut,
    fontWeight: "500",
  },
});
