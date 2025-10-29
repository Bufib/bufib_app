import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useLanguage } from "@/contexts/LanguageContext";
import handleOpenExternalUrl from "@/utils/handleOpenExternalUrl";
import Feather from "@expo/vector-icons/Feather";
import React from "react";
import { Pressable, StyleSheet, useColorScheme } from "react-native";
import handleOpenInternallUrl from "../utils/handleOpenInternalUrl";

type RenderLinkNewsItemProps = {
  url: string;
  index: number;
  isExternal: boolean;
};

const RenderLinkNewsItem = ({
  url,
  index,
  isExternal,
}: RenderLinkNewsItemProps) => {
  const colorScheme = useColorScheme();
  const { rtl } = useLanguage();
  return (
    <Pressable
      key={index}
      style={({ pressed }) => [
        styles.linkButton,
        pressed && styles.linkButtonPressed,
      ]}
      onPress={() =>
        isExternal ? handleOpenExternalUrl(url) : handleOpenInternallUrl(url)
      }
    >
      <Feather
        name={isExternal ? "external-link" : "link"}
        size={14}
        color={colorScheme === "dark" ? "#fff" : "#000"}
        style={{ paddingRight: 5 }}
      />
      <ThemedText
        style={[styles.linkText, { textAlign: rtl ? "right" : "left" }]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {url}
      </ThemedText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  linkButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 6,
  },
  linkButtonPressed: {
    opacity: 0.5,
  },
  linkText: {
    fontSize: 14,
    color: Colors.universal.link,
    flexShrink: 1,
  },
});

export default RenderLinkNewsItem;
