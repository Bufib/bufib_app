import React, { useEffect, useState } from "react";
import {
  View,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
} from "react-native";
import { ThemedText } from "./ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import { AddTodoModalType } from "@/constants/Types";

export const AddTodoModal: React.FC<AddTodoModalType> = ({
  visible,
  onClose,
  onAdd,
  selectedDayName,
}) => {
  const [newTodo, setNewTodo] = useState<string>("");
  const colorScheme = useColorScheme() || "light";
  const { t } = useTranslation();
  const { rtl } = useLanguage();
  // Clear out the input:
  useEffect(() => {
    if (visible) {
      setNewTodo("");
    }
  }, [visible]);

  const handleAddPress = () => {
    if (newTodo.trim()) {
      onAdd(newTodo.trim());
      setNewTodo("");
      onClose();
    }
  };

  const handleClose = () => {
    setNewTodo("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback
          style={{ flex: 1 }}
          onPress={() => Keyboard.dismiss()}
        >
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.modalContent,
                { backgroundColor: colorScheme === "dark" ? "#222" : "#fff" },
              ]}
            >
              <View style={styles.modalHeader}>
                <ThemedText style={styles.modalTitle}>
                  {t("addForDay")} {selectedDayName}
                </ThemedText>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={handleClose}
                >
                  <Ionicons
                    name="close"
                    size={24}
                    color={colorScheme === "dark" ? "#fff" : "#000"}
                  />
                </TouchableOpacity>
              </View>
              <TextInput
                style={[
                  styles.modalInput,
                  {
                    color: colorScheme === "dark" ? "#fff" : "#000",
                    backgroundColor:
                      colorScheme === "dark" ? "#333" : "#f5f5f5",
                    textAlign: rtl ? "right" : "left",
                  },
                ]}
                value={newTodo}
                onChangeText={setNewTodo}
                placeholder={t("enterPrayer")}
                placeholderTextColor={colorScheme === "dark" ? "#999" : "#999"}
                multiline={true}
              />
              <View style={[styles.modalButtonsContainer]}>
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    styles.cancelButton,
                    {
                      backgroundColor:
                        colorScheme === "dark" ? "#333" : "#f0f0f0",
                    },
                  ]}
                  onPress={handleClose}
                >
                  <ThemedText style={styles.modalButtonText}>
                    {t("cancel")}
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    styles.addModalButton,
                    { backgroundColor: "#4CAF50" },
                  ]}
                  onPress={handleAddPress}
                >
                  <ThemedText
                    style={[styles.modalButtonText, { color: "#fff" }]}
                  >
                    {t("add")}
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// Add relevant styles from HomeScreen
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  closeButton: {
    padding: 4,
  },
  modalInput: {
    borderRadius: 10,
    padding: 12,
    minHeight: 100,
    maxHeight: 200,
    fontSize: 16,
    marginBottom: 16,
  },
  modalButtonsContainer: {
    flexDirection: "row", // Handled by prop
    justifyContent: "space-between",
    gap: 10,
  },
  modalButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    opacity: 0.8,
  },
  addModalButton: {},
  modalButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
