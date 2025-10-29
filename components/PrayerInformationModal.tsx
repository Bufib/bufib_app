import React, { forwardRef, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import AntDesign from "@expo/vector-icons/AntDesign";
import Markdown from "react-native-markdown-display";
import { Colors } from "@/constants/Colors";
import type { LanguageCode, PrayerInformationModalPropsType } from "@/constants/Types";



const PrayerInformationModal = forwardRef<BottomSheet, PrayerInformationModalPropsType>(
  (
    {
      prayer,
      language,
      rtl,
      colorScheme,
      fontSize,
      lineHeight,
      snapPoints = ["70%"],
      onChange,
      onRequestClose,
    },
    ref
  ) => {
    const intro = useMemo(
      () =>
        prayer?.translations.find((t) => t.language_code === language)
          ?.translated_introduction || "",
      [prayer, language]
    );

    const handleClose = () => {
      if (onRequestClose) onRequestClose();
      // if parent didn't pass a closer, try closing the sheet via ref
      const anyRef = ref as React.RefObject<BottomSheet> | null;
      anyRef?.current?.close?.();
    };

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        onChange={onChange}
        backgroundStyle={{ backgroundColor: Colors[colorScheme].background }}
      >
        <AntDesign
          name="close-circle"
          size={24}
          color={Colors[colorScheme].defaultIcon}
          onPress={handleClose}
          style={
            rtl
              ? { alignSelf: "flex-start", marginLeft: 15, marginBottom: 5 }
              : { alignSelf: "flex-end", marginRight: 15, marginBottom: 5 }
          }
        />

        <BottomSheetView
          style={[
            styles.bottomSheet,
            rtl ? { flexDirection: "row-reverse" } : { flexDirection: "row" },
          ]}
        >
          {!!intro && (
            <Markdown
              style={{
                body: {
                  fontSize,
                  lineHeight,
                  color: Colors[colorScheme].text,
                },
              }}
            >
              {intro}
            </Markdown>
          )}
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

export default PrayerInformationModal;

const styles = StyleSheet.create({
  bottomSheet: {
    alignItems: "center",
    gap: 10,
    padding: 20,
    justifyContent: "center",
  },
});
