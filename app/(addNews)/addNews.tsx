import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Switch,
  Image,
  Pressable,
  ScrollView,
  useColorScheme,
} from "react-native";
import { Controller } from "react-hook-form";
import { ThemedText } from "@/components/ThemedText";
import { CoustomTheme } from "@/utils/coustomTheme";
import { Colors } from "@/constants/Colors";
import { TitleSearchInput } from "@/components/TitleSearch";
import { useAddNews } from "@/hooks/useAddNews";
import { ThemedView } from "@/components/ThemedView";
import { NoInternet } from "@/components/NoInternet";
import { useConnectionStatus } from "@/hooks/useConnectionStatus";

export default function AddNews() {
  const {
    control,
    handleSubmit,
    selectedImages,
    uploading,
    pickImages,
    removeImage,
    onSubmit,
  } = useAddNews();

  const themeStyles = CoustomTheme();
  const hasInternet = useConnectionStatus();
  const colorScheme = useColorScheme() || "light";
  const renderForm = () => (
    <ThemedView>
      <NoInternet showToast={false} showUI={true} />
      <View style={[styles.card, themeStyles.contrast]}>
        {/* Title Input */}
        <ThemedText style={styles.label}>Title</ThemedText>
        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[styles.input, themeStyles.text]}
              onChangeText={onChange}
              value={value}
              placeholder="Gib einen Titel ein"
              placeholderTextColor="#888"
            />
          )}
        />

        {/* Body Input */}
        <ThemedText style={styles.label}>Nachricht</ThemedText>
        <Controller
          control={control}
          name="body_text"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[styles.input, styles.textArea, themeStyles.text]}
              onChangeText={onChange}
              value={value}
              placeholder="Gib eine Nachricht ein"
              multiline
              placeholderTextColor="#888"
            />
          )}
        />

        {/* External URL Input */}
        <ThemedText style={styles.label}>Externe URL</ThemedText>
        <Controller
          control={control}
          name="external_url"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[styles.input, themeStyles.text]}
              onChangeText={onChange}
              value={value}
              placeholder="Gib eine vollständinge URL (mit http...) ein"
              placeholderTextColor="#888"
            />
          )}
        />

        {/* Title Search Input */}
        <ThemedText style={styles.label}>Verlinke eine Frage</ThemedText>
        <Controller
          control={control}
          name="internal_url"
          render={({ field: { onChange, value } }) => (
            <TitleSearchInput
              value={value || ""}
              onChangeText={onChange}
              themeStyles={themeStyles}
            />
          )}
        />

        {/* Pinned Switch */}
        <ThemedText style={styles.label}>Nachricht fixieren?</ThemedText>
        <Controller
          control={control}
          name="is_pinned"
          render={({ field: { onChange, value } }) => (
            <Switch onValueChange={onChange} value={value} />
          )}
        />
      </View>

      {/* Pick Image Button */}
      <Pressable style={styles.pickImageButton} onPress={pickImages}>
        <Text style={styles.imagePickerText}>
          {selectedImages.length ? "Mehr Bilder auswählen" : "Bilder hochladen"}
        </Text>
      </Pressable>

      {/* Submit Button */}
      <Pressable
        style={[
          styles.submitButton,
          (uploading || !hasInternet) && styles.disabled,
        ]}
        onPress={handleSubmit(onSubmit)}
        disabled={uploading || !hasInternet}
      >
        <Text style={styles.submitButtonText}>
          {uploading ? "Wird hochgeladen..." : "Hochladen"}
        </Text>
      </Pressable>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollStyles}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Render the entire Form */}
        {renderForm()}

        {/* Now show images in a horizontal row (if any) */}
        {!!selectedImages.length && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.imageRow}
            style={styles.scrollViewStyle}
          >
            {selectedImages.map((item) => (
              <View key={item.uri} style={styles.imageContainer}>
                <Image source={{ uri: item.uri }} style={styles.imagePreview} />
                <Pressable
                  style={[
                    styles.removeButton,
                    { backgroundColor: Colors[colorScheme].error },
                  ]}
                  onPress={() => removeImage(item.uri)}
                >
                  <Text style={styles.removeButtonText}>Entfernen</Text>
                </Pressable>
              </View>
            ))}
          </ScrollView>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
  },
  scrollStyles: {},

  scrollContent: {
    padding: 10,
    paddingBottom: 40,
  },
  card: {
    borderRadius: 12,
    padding: 20,
    gap: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
  },
  textArea: {
    textAlignVertical: "top",
    height: 200,
  },
  pickImageButton: {
    padding: 15,
    borderRadius: 12,
    backgroundColor: Colors.universal.primary,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  imagePickerText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  submitButton: {
    padding: 15,
    borderRadius: 12,
    backgroundColor: Colors.universal.primary,
    alignItems: "center",
  },
  disabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  /* Horizontal Images Row */
  imageRow: {
    paddingRight: 20,
  },
  scrollViewStyle: {
    marginTop: 20,
    marginBottom: 20,
  },
  imageContainer: {
    marginRight: 15,
    alignItems: "center",
  },
  imagePreview: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginBottom: 8,
  },
  removeButton: {
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  removeButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});
