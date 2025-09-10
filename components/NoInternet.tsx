import { StyleSheet, useColorScheme } from "react-native";
import React from "react";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { noInternetBody, noInternetHeader } from "@/constants/messages";
import { Colors } from "@/constants/Colors";
import { useConnectionStatus } from "@/hooks/useConnectionStatus";
import { useEffect } from "react";
import Toast from "react-native-toast-message";
import { useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
interface NoInternetProps {
  showUI?: boolean;
  showToast?: boolean;
}

export const NoInternet = ({
  showUI = false,
  showToast = false,
}: NoInternetProps) => {
  const hasInternet = useConnectionStatus();
  const prevConnected = useRef(true);
  const colorScheme = useColorScheme() || "light";
  const { t } = useTranslation();

  useEffect(() => {
    if (showToast && prevConnected.current !== hasInternet) {
      Toast.show({
        type: hasInternet ? "success" : "error",
        text1: hasInternet ? t("internetBackTitle") : t("noInternetTitle"),
        text2: hasInternet ? "" : t("noInternetMessage"),
      });
      prevConnected.current = hasInternet;
    }
  }, [hasInternet, showToast]);

  if (!showUI || hasInternet) return null;

  return (
    <SafeAreaView
      edges={["top"]}
      style={[
        styles.noInternet,
        { backgroundColor: Colors[colorScheme].background },
      ]}
    >
      <ThemedText style={styles.noInternetText}>
        {noInternetHeader}
        {"\n"}
        {noInternetBody}
      </ThemedText>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  noInternet: {
    padding: 15,
  },
  noInternetText: {
    textAlign: "center",
    color: Colors.universal.error,
    fontSize: 16,
    fontWeight: "700",
  },
});
