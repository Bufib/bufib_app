import React, { useEffect, useState } from "react";
import { Modal, StyleSheet, Pressable } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { useFontSizeStore } from "@/stores/fontSizeStore";
import i18n from "@/utils/i18n";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "react-i18next";

interface FontSizePickerModalProps {
  visible: boolean;
  onClose: () => void;
}

const FontSizePickerModal: React.FC<FontSizePickerModalProps> = ({
  visible,
  onClose,
}) => {
  const colorScheme = useColorScheme() || "light";
  const { fontSize, lineHeight, setFontSize, setLineHeight } =
    useFontSizeStore(); 
    
  const { t } = useTranslation();
  const fontSizeOptions = [
    { label: t("small"), fontSize: 16, lineHeight: 28 },
    { label: t("medium"), fontSize: 18, lineHeight: 35 },
    { label: t("large"), fontSize: 22, lineHeight: 40 },
  ];

  const [pickerValue, setPickerValue] = useState(
    fontSizeOptions.find((option) => option.fontSize === fontSize)?.label
  );

  useEffect(() => {
    if (visible) {
      // Sync picker value with Zustand state
      const selectedOption = fontSizeOptions.find(
        (option) => option.fontSize === fontSize
      );
      setPickerValue(selectedOption?.label || "Mittel");
    }
  }, [visible, fontSize]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      {/* Modal Background */}
      <Pressable style={styles.modalContainer} onPress={onClose}>
        {/* Modal Content */}
        <Pressable
          style={[
            styles.pickerContainer,
            {
              borderColor: Colors[colorScheme].border,
              backgroundColor: Colors[colorScheme].contrast,
            },
          ]}
          onPress={() => {}}
        >
          <Picker
            selectedValue={pickerValue}
            onValueChange={(itemValue) => {
              setPickerValue(itemValue);

              const selectedOption = fontSizeOptions.find(
                (option) => option.label === itemValue
              );

              if (selectedOption) {
                setFontSize(selectedOption.fontSize);
                setLineHeight(selectedOption.lineHeight);
              }

              // Dismiss the picker modal
              onClose();
            }}
          >
            {fontSizeOptions.map((option) => (
              <Picker.Item
                key={option.label}
                label={option.label}
                value={option.label}
                color={Colors[colorScheme].text}
              />
            ))}
          </Picker>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  pickerContainer: {
    width: 300,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    borderWidth: 1,
  },
});

export default FontSizePickerModal;
