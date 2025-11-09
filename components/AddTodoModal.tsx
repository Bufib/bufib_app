// // import React, { useEffect, useState } from "react";
// // import {
// //   View,
// //   Modal,
// //   TextInput,
// //   TouchableOpacity,
// //   StyleSheet,
// //   TouchableWithoutFeedback,
// //   Keyboard,
// //   KeyboardAvoidingView,
// //   Platform,
// //   useColorScheme,
// // } from "react-native";
// // import { ThemedText } from "./ThemedText";
// // import { Feather, Ionicons } from "@expo/vector-icons";
// // import { useTranslation } from "react-i18next";
// // import { useLanguage } from "@/contexts/LanguageContext";
// // import { AddTodoModalType } from "@/constants/Types";
// // import { Colors } from "@/constants/Colors";

// // export const AddTodoModal: React.FC<AddTodoModalType> = ({
// //   visible,
// //   onClose,
// //   onAdd,
// //   selectedDayName,
// // }) => {
// //   const [newTodo, setNewTodo] = useState<string>("");
// //   const colorScheme = useColorScheme() || "light";
// //   const { t } = useTranslation();
// //   const { rtl } = useLanguage();
// //   // Clear out the input:
// //   useEffect(() => {
// //     if (visible) {
// //       setNewTodo("");
// //     }
// //   }, [visible]);

// //   const handleAddPress = () => {
// //     if (newTodo.trim()) {
// //       onAdd(newTodo.trim());
// //       setNewTodo("");
// //       onClose();
// //     }
// //   };

// //   const handleClose = () => {
// //     setNewTodo("");
// //     onClose();
// //   };

// //   return (
// //     <Modal
// //       visible={visible}
// //       transparent={true}
// //       animationType="slide"
// //       onRequestClose={handleClose}
// //     >
// //       <KeyboardAvoidingView
// //         style={{ flex: 1 }}
// //         behavior={Platform.OS === "ios" ? "padding" : "height"}
// //       >
// //         <TouchableWithoutFeedback
// //           style={{ flex: 1 }}
// //           onPress={() => Keyboard.dismiss()}
// //         >
// //           <View style={styles.modalOverlay}>
// //             <View
// //               style={[
// //                 styles.modalContent,
// //                 { backgroundColor: colorScheme === "dark" ? "#222" : "#fff" },
// //               ]}
// //             >
// //               <View style={styles.modalHeader}>
// //                 <ThemedText style={styles.modalTitle}>
// //                   {t("addForDay")} {selectedDayName}
// //                 </ThemedText>
// //                 <View
// //                   style={{
// //                     flexDirection: "row",
// //                     alignItems: "center",
// //                     gap: 10,
// //                   }}
// //                 >
// //                   <Feather
// //                     name="search"
// //                     size={24}
// //                     color={Colors[colorScheme].defaultIcon}
// //                   />
// //                   <TouchableOpacity
// //                     style={styles.closeButton}
// //                     onPress={handleClose}
// //                   >
// //                     <Ionicons
// //                       name="close"
// //                       size={24}
// //                       color={Colors[colorScheme].defaultIcon}
// //                     />
// //                   </TouchableOpacity>
// //                 </View>
// //               </View>
// //               <TextInput
// //                 style={[
// //                   styles.modalInput,
// //                   {
// //                     color: colorScheme === "dark" ? "#fff" : "#000",
// //                     backgroundColor:
// //                       colorScheme === "dark" ? "#333" : "#f5f5f5",
// //                     textAlign: rtl ? "right" : "left",
// //                   },
// //                 ]}
// //                 value={newTodo}
// //                 onChangeText={setNewTodo}
// //                 placeholder={t("enterPrayer")}
// //                 placeholderTextColor={colorScheme === "dark" ? "#999" : "#999"}
// //                 multiline={true}
// //               />
// //               <View style={[styles.modalButtonsContainer]}>
// //                 <TouchableOpacity
// //                   style={[
// //                     styles.modalButton,
// //                     styles.cancelButton,
// //                     {
// //                       backgroundColor:
// //                         colorScheme === "dark" ? "#333" : "#f0f0f0",
// //                     },
// //                   ]}
// //                   onPress={handleClose}
// //                 >
// //                   <ThemedText style={styles.modalButtonText}>
// //                     {t("cancel")}
// //                   </ThemedText>
// //                 </TouchableOpacity>
// //                 <TouchableOpacity
// //                   style={[
// //                     styles.modalButton,
// //                     styles.addModalButton,
// //                     { backgroundColor: "#4CAF50" },
// //                   ]}
// //                   onPress={handleAddPress}
// //                 >
// //                   <ThemedText
// //                     style={[styles.modalButtonText, { color: "#fff" }]}
// //                   >
// //                     {t("add")}
// //                   </ThemedText>
// //                 </TouchableOpacity>
// //               </View>
// //             </View>
// //           </View>
// //         </TouchableWithoutFeedback>
// //       </KeyboardAvoidingView>
// //     </Modal>
// //   );
// // };

// // // Add relevant styles from HomeScreen
// // const styles = StyleSheet.create({
// //   modalOverlay: {
// //     flex: 1,
// //     backgroundColor: "rgba(0,0,0,0.5)",
// //     justifyContent: "flex-end",
// //   },
// //   modalContent: {
// //     borderTopLeftRadius: 20,
// //     borderTopRightRadius: 20,
// //     padding: 20,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: -2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 5,
// //     elevation: 5,
// //   },
// //   modalHeader: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //     marginBottom: 16,
// //   },
// //   modalTitle: {
// //     fontSize: 18,
// //     fontWeight: "600",
// //   },
// //   closeButton: {
// //     padding: 4,
// //   },
// //   modalInput: {
// //     borderRadius: 10,
// //     padding: 12,
// //     minHeight: 100,
// //     maxHeight: 200,
// //     fontSize: 16,
// //     marginBottom: 16,
// //   },
// //   modalButtonsContainer: {
// //     flexDirection: "row", // Handled by prop
// //     justifyContent: "space-between",
// //     gap: 10,
// //   },
// //   modalButton: {
// //     flex: 1,
// //     borderRadius: 10,
// //     paddingVertical: 12,
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },
// //   cancelButton: {
// //     opacity: 0.8,
// //   },
// //   addModalButton: {},
// //   modalButtonText: {
// //     fontSize: 16,
// //     fontWeight: "600",
// //   },
// // });

// //! Last that worked
// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Modal,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   TouchableWithoutFeedback,
//   Keyboard,
//   KeyboardAvoidingView,
//   Platform,
//   useColorScheme,
// } from "react-native";
// import { ThemedText } from "./ThemedText";
// import { Feather, Ionicons } from "@expo/vector-icons";
// import { useTranslation } from "react-i18next";
// import { useLanguage } from "@/contexts/LanguageContext";
// import { AddTodoModalType } from "@/constants/Types";
// import { Colors } from "@/constants/Colors";
// import { LoadingIndicator } from "./LoadingIndicator";

// export const AddTodoModal: React.FC<AddTodoModalType> = ({
//   visible,
//   onClose,
//   onAdd,
//   selectedDayName,
// }) => {
//   const [newTodo, setNewTodo] = useState<string>("");
//   const colorScheme = useColorScheme() || "light";
//   const { t } = useTranslation();
//   const { rtl } = useLanguage();
//   const [searchVisible, setSearchVisible] = useState(false);
//   // Clear out the input:
//   useEffect(() => {
//     if (visible) {
//       setNewTodo("");
//     }
//   }, [visible]);

//   const handleAddPress = () => {
//     if (newTodo.trim()) {
//       onAdd(newTodo.trim());
//       setNewTodo("");
//       onClose();
//     }
//   };

//   const handleClose = () => {
//     setNewTodo("");
//     onClose();
//   };

//   return (
//     <Modal
//       visible={visible}
//       transparent={true}
//       animationType="slide"
//       onRequestClose={handleClose}
//     >
//       <KeyboardAvoidingView
//         style={{ flex: 1 }}
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//       >
//         <TouchableWithoutFeedback
//           style={{ flex: 1 }}
//           onPress={() => Keyboard.dismiss()}
//         >
//           <View style={styles.modalOverlay}>
//             <View
//               style={[
//                 styles.modalContent,
//                 { backgroundColor: colorScheme === "dark" ? "#222" : "#fff" },
//               ]}
//             >
//               <View style={styles.modalHeader}>
//                 <ThemedText style={styles.modalTitle}>
//                   {t("addForDay")} {selectedDayName}
//                 </ThemedText>
//                 <View
//                   style={{
//                     flexDirection: "row",
//                     alignItems: "center",
//                     gap: 10,
//                   }}
//                 >
//                   {searchVisible ? (
//                     <View
//                       style={[
//                         styles.searchBox,
//                         { backgroundColor: Colors[colorScheme].contrast },
//                       ]}
//                     >
//                       <TextInput
//                         placeholder={t("search")}
//                         placeholderTextColor={Colors[colorScheme].text}
//                         autoCapitalize="none"
//                         autoCorrect={false}
//                         returnKeyType="done"
//                         style={[
//                           styles.input,
//                           { color: Colors[colorScheme].text },
//                         ]}
//                       />
//                       {/* {query.length > 0 && !activeLoading && (
//                               <TouchableOpacity onPress={onClear} style={styles.clearBtn}>
//                                 <ThemedText style={{ fontSize: 18 }}>×</ThemedText>
//                               </TouchableOpacity>
//                             )}
//                             {activeLoading && <LoadingIndicator style={{ marginLeft: 8 }} />} */}
//                     </View>
//                   ) : null}
//                   <Feather
//                     name="search"
//                     size={24}
//                     color={Colors[colorScheme].defaultIcon}
//                     onPress={() => setSearchVisible(true)}
//                   />
//                   <TouchableOpacity
//                     style={styles.closeButton}
//                     onPress={handleClose}
//                   >
//                     <Ionicons
//                       name="close"
//                       size={24}
//                       color={Colors[colorScheme].defaultIcon}
//                     />
//                   </TouchableOpacity>
//                 </View>
//               </View>
//               <TextInput
//                 style={[
//                   styles.modalInput,
//                   {
//                     color: colorScheme === "dark" ? "#fff" : "#000",
//                     backgroundColor:
//                       colorScheme === "dark" ? "#333" : "#f5f5f5",
//                     textAlign: rtl ? "right" : "left",
//                   },
//                 ]}
//                 value={newTodo}
//                 onChangeText={setNewTodo}
//                 placeholder={t("enterPrayer")}
//                 placeholderTextColor={colorScheme === "dark" ? "#999" : "#999"}
//                 multiline={true}
//               />
//               <View style={[styles.modalButtonsContainer]}>
//                 <TouchableOpacity
//                   style={[
//                     styles.modalButton,
//                     styles.cancelButton,
//                     {
//                       backgroundColor:
//                         colorScheme === "dark" ? "#333" : "#f0f0f0",
//                     },
//                   ]}
//                   onPress={handleClose}
//                 >
//                   <ThemedText style={styles.modalButtonText}>
//                     {t("cancel")}
//                   </ThemedText>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={[
//                     styles.modalButton,
//                     styles.addModalButton,
//                     { backgroundColor: "#4CAF50" },
//                   ]}
//                   onPress={handleAddPress}
//                 >
//                   <ThemedText
//                     style={[styles.modalButtonText, { color: "#fff" }]}
//                   >
//                     {t("add")}
//                   </ThemedText>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         </TouchableWithoutFeedback>
//       </KeyboardAvoidingView>
//     </Modal>
//   );
// };

// // Add relevant styles from HomeScreen
// const styles = StyleSheet.create({
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     justifyContent: "flex-end",
//   },
//   modalContent: {
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     padding: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: -2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 5,
//   },
//   modalHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: "600",
//   },
//   closeButton: {
//     padding: 4,
//   },
//   modalInput: {
//     borderRadius: 10,
//     padding: 12,
//     minHeight: 100,
//     maxHeight: 200,
//     fontSize: 16,
//     marginBottom: 16,
//   },
//   modalButtonsContainer: {
//     flexDirection: "row", // Handled by prop
//     justifyContent: "space-between",
//     gap: 10,
//   },
//   modalButton: {
//     flex: 1,
//     borderRadius: 10,
//     paddingVertical: 12,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   cancelButton: {
//     opacity: 0.8,
//   },
//   addModalButton: {},
//   modalButtonText: {
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   searchBox: {
//     flexDirection: "row",
//     paddingHorizontal: 5,
//     borderRadius: 10,
//     borderWidth: StyleSheet.hairlineWidth,
//   },
//   input: {
//     fontSize: 16,
//   },
//   clearBtn: {
//     paddingHorizontal: 6,
//     paddingVertical: 4,
//   },
// });

// AddTodoModal.tsx
import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
} from "react";
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
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  AddTodoModalType,
  QuestionType,
  PrayerWithCategory,
  QuranVerseType,
  Language,
} from "@/constants/Types";
import { Colors } from "@/constants/Colors";
import {
  searchQuestions,
  searchPrayers,
  searchQuran,
  searchQuranLabels,
} from "@/db/search";
import RenderLink from "./RenderLink";

type InternalLinkType = "questionLink" | "prayerLink" | "quranLink";
type SearchFilter = "prayers" | "quran" | "questions";

interface SearchResult {
  id: string;
  label: string;
  type: InternalLinkType;
  identifier: string; // passed into handleOpenInternallUrl
  meta?: string;
}

/** Encode as "type:identifier" for internal URLs. */
const encodeInternalUrl = (
  type: InternalLinkType,
  identifier: string
): string => `${type}:${identifier}`;

const debounceFn = <F extends (...args: any[]) => void>(
  fn: F,
  delay: number
): ((...args: Parameters<F>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<F>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
};

export const AddTodoModal: React.FC<AddTodoModalType> = ({
  visible,
  onClose,
  onAdd,
  selectedDayName,
}) => {
  const [newTodo, setNewTodo] = useState("");
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [internalUrls, setInternalUrls] = useState<string[]>([]);
  const [filter, setFilter] = useState<SearchFilter>("prayers");

  const colorScheme = useColorScheme() || "light";
  const { t } = useTranslation();
  const { rtl, lang } = useLanguage();

  const requestIdRef = useRef(0);

  /* ------------ helpers ------------ */

  const resetState = () => {
    setNewTodo("");
    setSearchExpanded(false);
    setSearchQuery("");
    setResults([]);
    setInternalUrls([]);
    setLoading(false);
    setFilter("prayers");
    requestIdRef.current = 0;
  };

  // Reset when modal opens
  useEffect(() => {
    if (visible) resetState();
  }, [visible]);

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleAddPress = () => {
    const text = newTodo.trim();
    if (!text && internalUrls.length === 0) return;
    onAdd(text, internalUrls);
    handleClose();
  };

  const handleOpenSearch = () => {
    setSearchExpanded(true);
    setSearchQuery("");
    setResults([]);
    setLoading(false);
    setFilter("prayers");
  };

  const handleCloseSearch = () => {
    setSearchExpanded(false);
    setSearchQuery("");
    setResults([]);
    setLoading(false);
    setFilter("prayers");
  };

  /* ------------ search (per filter) ------------ */

  const runSearch = useCallback(
    async (term: string) => {
      const q = term.trim();
      const currentId = ++requestIdRef.current;

      if (q.length < 2) {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        let merged: SearchResult[] = [];

        if (filter === "questions") {
          const res = await searchQuestions(lang, q, { limit: 12 });
          if (currentId !== requestIdRef.current) return;

          merged = (res.rows as QuestionType[]).map((qItem) => ({
            id: `question-${qItem.id}`,
            label: qItem.title,
            type: "questionLink",
            identifier: String(qItem.id), // ✅ use numeric id (as string) for internal URL
            meta: t("question") || "Question",
          }));
        } else if (filter === "prayers") {
          const res = await searchPrayers(lang, q, { limit: 12 });
          if (currentId !== requestIdRef.current) return;

          merged = (res.rows as PrayerWithCategory[]).map((p) => ({
            id: `prayer-${p.id}`,
            label: p.name,
            type: "prayerLink",
            identifier: String(p.id), // ✅ ID-based, matches prayerLink:<id>
            meta: t("prayer") || "Prayer",
          }));
        } else if (filter === "quran") {
          const res = await searchQuranLabels(lang, q, { limit: 20 });
          if (currentId !== requestIdRef.current) return;

          merged = res.rows.map((sura) => ({
            id: `quran-${sura.sura}`,
            // e.g. "Al-Fātiha" or fallback "Qur'an 1"
            label: sura.label || `${t("quran") || "Qur'an"} ${sura.sura}`,
            type: "quranLink",
            identifier: sura.identifier, // ✅ already "<sura>:1" from searchQuranLabels
            meta: `${t("quran") || "Qur'an"} ${sura.sura}`,
          }));
        }

        setResults(merged);
      } catch (error) {
        if (currentId === requestIdRef.current) {
          console.error("AddTodoModal search error:", error);
          setResults([]);
        }
      } finally {
        if (currentId === requestIdRef.current) {
          setLoading(false);
        }
      }
    },
    [filter, lang, t]
  );

  const debouncedSearch = useMemo(
    () =>
      debounceFn((q: string) => {
        runSearch(q);
      }, 250),
    [runSearch]
  );

  // Re-run search when query or filter changes (while overlay is open)
  useEffect(() => {
    if (!searchExpanded) return;
    debouncedSearch(searchQuery);
  }, [searchQuery, searchExpanded, debouncedSearch, filter]);

  /* ------------ add/remove link from search result ------------ */

  const handleSelectResult = (item: SearchResult) => {
    const url = encodeInternalUrl(item.type, item.identifier);
    setInternalUrls((prev) => (prev.includes(url) ? prev : [...prev, url]));
  };

  const handleRemoveLink = (urlToRemove: string) => {
    setInternalUrls((prev) => prev.filter((u) => u !== urlToRemove));
  };

  /* ------------ render ------------ */

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <ThemedView style={styles.modalContent}>
              {/* Header */}
              <View style={styles.modalHeader}>
                <ThemedText style={styles.modalTitle}>
                  {t("addForDay")} {selectedDayName}
                </ThemedText>

                <View style={styles.headerRight}>
                  <TouchableOpacity
                    onPress={handleOpenSearch}
                    style={styles.iconButton}
                  >
                    <Feather
                      name="search"
                      size={22}
                      color={Colors[colorScheme].defaultIcon}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={handleClose}
                  >
                    <Ionicons
                      name="close"
                      size={24}
                      color={Colors[colorScheme].defaultIcon}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Search overlay */}
              {searchExpanded && (
                <ThemedView style={styles.searchOverlay}>
                  <View style={styles.searchOverlayHeader}>
                    <TouchableOpacity
                      onPress={handleCloseSearch}
                      style={styles.backBtn}
                    >
                      <Ionicons
                        name="chevron-back"
                        size={22}
                        color={Colors[colorScheme].defaultIcon}
                      />
                    </TouchableOpacity>
                    <ThemedText style={styles.searchTitle}>
                      {t("search")}
                    </ThemedText>
                  </View>

                  {/* Filter chips */}
                  <View style={styles.filterRow}>
                    {(
                      [
                        { key: "prayers", label: t("tab_prayers") },
                        { key: "quran", label: t("tab_quran") },
                        { key: "questions", label: t("tab_questions") },
                      ] as { key: SearchFilter; label: string }[]
                    ).map((f) => {
                      const active = f.key === filter;
                      return (
                        <TouchableOpacity
                          key={f.key}
                          onPress={() => setFilter(f.key)}
                          style={[
                            styles.filterChip,
                            active && styles.filterChipActive,
                          ]}
                        >
                          <ThemedText
                            style={[
                              styles.filterChipText,
                              active && styles.filterChipTextActive,
                            ]}
                          >
                            {f.label}
                          </ThemedText>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {/* Search input */}
                  <View style={styles.searchOverlayInputWrapper}>
                    <Ionicons
                      name="search"
                      size={18}
                      color={Colors[colorScheme].defaultIcon}
                      style={{ marginRight: 6 }}
                    />
                    <TextInput
                      placeholder={t("search")}
                      placeholderTextColor={
                        colorScheme === "dark" ? "#888" : "#888"
                      }
                      autoCapitalize="none"
                      autoCorrect={false}
                      returnKeyType="search"
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      style={[
                        styles.searchOverlayInput,
                        {
                          color: colorScheme === "dark" ? "#fff" : "#000",
                          textAlign: rtl ? "right" : "left",
                        },
                      ]}
                    />
                    {searchQuery.length > 0 && (
                      <TouchableOpacity onPress={() => setSearchQuery("")}>
                        <Ionicons
                          name="close-circle"
                          size={18}
                          color={Colors[colorScheme].defaultIcon}
                        />
                      </TouchableOpacity>
                    )}
                  </View>

                  {loading && (
                    <View style={styles.loadingRow}>
                      <ActivityIndicator />
                    </View>
                  )}

                  <FlatList
                    data={results}
                    keyExtractor={(item) => item.id}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={styles.resultsContainer}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.resultItem}
                        onPress={() => handleSelectResult(item)}
                      >
                        <ThemedText style={styles.resultLabel}>
                          {item.label}
                        </ThemedText>
                        {item.meta && (
                          <ThemedText style={styles.resultMeta}>
                            {item.meta}
                          </ThemedText>
                        )}
                      </TouchableOpacity>
                    )}
                    ListEmptyComponent={
                      !loading && searchQuery.length >= 2 ? (
                        <ThemedText style={styles.noResultText}>
                          {t("noSearchResults")}
                        </ThemedText>
                      ) : null
                    }
                  />
                </ThemedView>
              )}

              {/* Text input */}
              <ThemedView style={styles.inputWrapper}>
                <TextInput
                  style={[
                    styles.modalInput,
                    {
                      color: colorScheme === "dark" ? "#fff" : "#000",
                      textAlign: rtl ? "right" : "left",
                    },
                  ]}
                  value={newTodo}
                  onChangeText={setNewTodo}
                  placeholder={t("enterPrayer")}
                  placeholderTextColor={
                    colorScheme === "dark" ? "#999" : "#999"
                  }
                  multiline
                />
              </ThemedView>

              {/* Selected links */}
              {internalUrls.length > 0 && (
                <ThemedView style={styles.linksContainer}>
                  {internalUrls.map((url, index) => (
                    <View
                      key={`internal-url-${index}-${url}`}
                      style={styles.linkRow}
                    >
                      <RenderLink url={url} index={index} isExternal={false} />
                      <TouchableOpacity
                        onPress={() => handleRemoveLink(url)}
                        style={styles.removeLinkButton}
                      >
                        <Ionicons
                          name="close"
                          size={14}
                          color={colorScheme === "dark" ? "#fff" : "#000"}
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                </ThemedView>
              )}

              {/* Buttons */}
              <View style={styles.modalButtonsContainer}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={handleClose}
                >
                  <ThemedText style={styles.modalButtonText}>
                    {t("cancel")}
                  </ThemedText>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.addModalButton]}
                  onPress={handleAddPress}
                >
                  <ThemedText
                    style={[styles.modalButtonText, { color: "#fff" }]}
                  >
                    {t("add")}
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </ThemedView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

/* ------------ styles ------------ */

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    maxHeight: "85%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  headerRight: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginLeft: 10,
    gap: 8,
  },
  iconButton: {
    padding: 4,
  },
  closeButton: {
    padding: 4,
  },

  searchOverlay: {
    marginBottom: 12,
    padding: 10,
    borderRadius: 14,
  },
  searchOverlayHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  backBtn: {
    paddingRight: 4,
    paddingVertical: 2,
    marginRight: 4,
  },
  searchTitle: {
    fontSize: 16,
    fontWeight: "600",
  },

  filterRow: {
    flexDirection: "row",
    marginBottom: 6,
    gap: 6,
    flexWrap: "wrap",
  },
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(150,150,150,0.6)",
  },
  filterChipActive: {
    backgroundColor: Colors.universal.primary,
    borderColor: Colors.universal.primary,
  },
  filterChipText: {
    fontSize: 12,
  },
  filterChipTextActive: {
    color: "#fff",
    fontWeight: "600",
  },

  searchOverlayInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 10,
    marginBottom: 6,
    gap: 4,
  },
  searchOverlayInput: {
    flex: 1,
    fontSize: 15,
  },
  loadingRow: {
    paddingVertical: 4,
  },
  resultsContainer: {
    paddingVertical: 4,
  },
  resultItem: {
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 8,
  },
  resultLabel: {
    fontSize: 15,
  },
  resultMeta: {
    fontSize: 12,
    opacity: 0.6,
  },
  noResultText: {
    textAlign: "center",
    paddingVertical: 10,
    fontSize: 14,
    opacity: 0.7,
  },

  inputWrapper: {
    borderRadius: 10,
    marginBottom: 10,
  },
  modalInput: {
    borderRadius: 10,
    padding: 12,
    minHeight: 80,
    maxHeight: 200,
    fontSize: 16,
  },

  linksContainer: {
    marginBottom: 14,
    gap: 6,
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  removeLinkButton: {
    padding: 4,
    marginLeft: 4,
  },

  modalButtonsContainer: {
    flexDirection: "row",
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
    backgroundColor: "rgba(160,160,160,0.15)",
  },
  addModalButton: {
    backgroundColor: "#4CAF50",
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default AddTodoModal;
