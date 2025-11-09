// // // // // import React, { useEffect, useState } from "react";
// // // // // import {
// // // // //   View,
// // // // //   Modal,
// // // // //   TextInput,
// // // // //   TouchableOpacity,
// // // // //   StyleSheet,
// // // // //   TouchableWithoutFeedback,
// // // // //   Keyboard,
// // // // //   KeyboardAvoidingView,
// // // // //   Platform,
// // // // //   useColorScheme,
// // // // // } from "react-native";
// // // // // import { ThemedText } from "./ThemedText";
// // // // // import { Feather, Ionicons } from "@expo/vector-icons";
// // // // // import { useTranslation } from "react-i18next";
// // // // // import { useLanguage } from "@/contexts/LanguageContext";
// // // // // import { AddTodoModalType } from "@/constants/Types";
// // // // // import { Colors } from "@/constants/Colors";

// // // // // export const AddTodoModal: React.FC<AddTodoModalType> = ({
// // // // //   visible,
// // // // //   onClose,
// // // // //   onAdd,
// // // // //   selectedDayName,
// // // // // }) => {
// // // // //   const [newTodo, setNewTodo] = useState<string>("");
// // // // //   const colorScheme = useColorScheme() || "light";
// // // // //   const { t } = useTranslation();
// // // // //   const { rtl } = useLanguage();
// // // // //   // Clear out the input:
// // // // //   useEffect(() => {
// // // // //     if (visible) {
// // // // //       setNewTodo("");
// // // // //     }
// // // // //   }, [visible]);

// // // // //   const handleAddPress = () => {
// // // // //     if (newTodo.trim()) {
// // // // //       onAdd(newTodo.trim());
// // // // //       setNewTodo("");
// // // // //       onClose();
// // // // //     }
// // // // //   };

// // // // //   const handleClose = () => {
// // // // //     setNewTodo("");
// // // // //     onClose();
// // // // //   };

// // // // //   return (
// // // // //     <Modal
// // // // //       visible={visible}
// // // // //       transparent={true}
// // // // //       animationType="slide"
// // // // //       onRequestClose={handleClose}
// // // // //     >
// // // // //       <KeyboardAvoidingView
// // // // //         style={{ flex: 1 }}
// // // // //         behavior={Platform.OS === "ios" ? "padding" : "height"}
// // // // //       >
// // // // //         <TouchableWithoutFeedback
// // // // //           style={{ flex: 1 }}
// // // // //           onPress={() => Keyboard.dismiss()}
// // // // //         >
// // // // //           <View style={styles.modalOverlay}>
// // // // //             <View
// // // // //               style={[
// // // // //                 styles.modalContent,
// // // // //                 { backgroundColor: colorScheme === "dark" ? "#222" : "#fff" },
// // // // //               ]}
// // // // //             >
// // // // //               <View style={styles.modalHeader}>
// // // // //                 <ThemedText style={styles.modalTitle}>
// // // // //                   {t("addForDay")} {selectedDayName}
// // // // //                 </ThemedText>
// // // // //                 <View
// // // // //                   style={{
// // // // //                     flexDirection: "row",
// // // // //                     alignItems: "center",
// // // // //                     gap: 10,
// // // // //                   }}
// // // // //                 >
// // // // //                   <Feather
// // // // //                     name="search"
// // // // //                     size={24}
// // // // //                     color={Colors[colorScheme].defaultIcon}
// // // // //                   />
// // // // //                   <TouchableOpacity
// // // // //                     style={styles.closeButton}
// // // // //                     onPress={handleClose}
// // // // //                   >
// // // // //                     <Ionicons
// // // // //                       name="close"
// // // // //                       size={24}
// // // // //                       color={Colors[colorScheme].defaultIcon}
// // // // //                     />
// // // // //                   </TouchableOpacity>
// // // // //                 </View>
// // // // //               </View>
// // // // //               <TextInput
// // // // //                 style={[
// // // // //                   styles.modalInput,
// // // // //                   {
// // // // //                     color: colorScheme === "dark" ? "#fff" : "#000",
// // // // //                     backgroundColor:
// // // // //                       colorScheme === "dark" ? "#333" : "#f5f5f5",
// // // // //                     textAlign: rtl ? "right" : "left",
// // // // //                   },
// // // // //                 ]}
// // // // //                 value={newTodo}
// // // // //                 onChangeText={setNewTodo}
// // // // //                 placeholder={t("enterPrayer")}
// // // // //                 placeholderTextColor={colorScheme === "dark" ? "#999" : "#999"}
// // // // //                 multiline={true}
// // // // //               />
// // // // //               <View style={[styles.modalButtonsContainer]}>
// // // // //                 <TouchableOpacity
// // // // //                   style={[
// // // // //                     styles.modalButton,
// // // // //                     styles.cancelButton,
// // // // //                     {
// // // // //                       backgroundColor:
// // // // //                         colorScheme === "dark" ? "#333" : "#f0f0f0",
// // // // //                     },
// // // // //                   ]}
// // // // //                   onPress={handleClose}
// // // // //                 >
// // // // //                   <ThemedText style={styles.modalButtonText}>
// // // // //                     {t("cancel")}
// // // // //                   </ThemedText>
// // // // //                 </TouchableOpacity>
// // // // //                 <TouchableOpacity
// // // // //                   style={[
// // // // //                     styles.modalButton,
// // // // //                     styles.addModalButton,
// // // // //                     { backgroundColor: "#4CAF50" },
// // // // //                   ]}
// // // // //                   onPress={handleAddPress}
// // // // //                 >
// // // // //                   <ThemedText
// // // // //                     style={[styles.modalButtonText, { color: "#fff" }]}
// // // // //                   >
// // // // //                     {t("add")}
// // // // //                   </ThemedText>
// // // // //                 </TouchableOpacity>
// // // // //               </View>
// // // // //             </View>
// // // // //           </View>
// // // // //         </TouchableWithoutFeedback>
// // // // //       </KeyboardAvoidingView>
// // // // //     </Modal>
// // // // //   );
// // // // // };

// // // // // // Add relevant styles from HomeScreen
// // // // // const styles = StyleSheet.create({
// // // // //   modalOverlay: {
// // // // //     flex: 1,
// // // // //     backgroundColor: "rgba(0,0,0,0.5)",
// // // // //     justifyContent: "flex-end",
// // // // //   },
// // // // //   modalContent: {
// // // // //     borderTopLeftRadius: 20,
// // // // //     borderTopRightRadius: 20,
// // // // //     padding: 20,
// // // // //     shadowColor: "#000",
// // // // //     shadowOffset: { width: 0, height: -2 },
// // // // //     shadowOpacity: 0.1,
// // // // //     shadowRadius: 5,
// // // // //     elevation: 5,
// // // // //   },
// // // // //   modalHeader: {
// // // // //     flexDirection: "row",
// // // // //     justifyContent: "space-between",
// // // // //     alignItems: "center",
// // // // //     marginBottom: 16,
// // // // //   },
// // // // //   modalTitle: {
// // // // //     fontSize: 18,
// // // // //     fontWeight: "600",
// // // // //   },
// // // // //   closeButton: {
// // // // //     padding: 4,
// // // // //   },
// // // // //   modalInput: {
// // // // //     borderRadius: 10,
// // // // //     padding: 12,
// // // // //     minHeight: 100,
// // // // //     maxHeight: 200,
// // // // //     fontSize: 16,
// // // // //     marginBottom: 16,
// // // // //   },
// // // // //   modalButtonsContainer: {
// // // // //     flexDirection: "row", // Handled by prop
// // // // //     justifyContent: "space-between",
// // // // //     gap: 10,
// // // // //   },
// // // // //   modalButton: {
// // // // //     flex: 1,
// // // // //     borderRadius: 10,
// // // // //     paddingVertical: 12,
// // // // //     alignItems: "center",
// // // // //     justifyContent: "center",
// // // // //   },
// // // // //   cancelButton: {
// // // // //     opacity: 0.8,
// // // // //   },
// // // // //   addModalButton: {},
// // // // //   modalButtonText: {
// // // // //     fontSize: 16,
// // // // //     fontWeight: "600",
// // // // //   },
// // // // // });

// // // // //! Last that worked
// // // // import React, { useEffect, useState } from "react";
// // // // import {
// // // //   View,
// // // //   Modal,
// // // //   TextInput,
// // // //   TouchableOpacity,
// // // //   StyleSheet,
// // // //   TouchableWithoutFeedback,
// // // //   Keyboard,
// // // //   KeyboardAvoidingView,
// // // //   Platform,
// // // //   useColorScheme,
// // // // } from "react-native";
// // // // import { ThemedText } from "./ThemedText";
// // // // import { Feather, Ionicons } from "@expo/vector-icons";
// // // // import { useTranslation } from "react-i18next";
// // // // import { useLanguage } from "@/contexts/LanguageContext";
// // // // import { AddTodoModalType } from "@/constants/Types";
// // // // import { Colors } from "@/constants/Colors";
// // // // import { LoadingIndicator } from "./LoadingIndicator";

// // // // export const AddTodoModal: React.FC<AddTodoModalType> = ({
// // // //   visible,
// // // //   onClose,
// // // //   onAdd,
// // // //   selectedDayName,
// // // // }) => {
// // // //   const [newTodo, setNewTodo] = useState<string>("");
// // // //   const colorScheme = useColorScheme() || "light";
// // // //   const { t } = useTranslation();
// // // //   const { rtl } = useLanguage();
// // // //   const [searchVisible, setSearchVisible] = useState(false);
// // // //   // Clear out the input:
// // // //   useEffect(() => {
// // // //     if (visible) {
// // // //       setNewTodo("");
// // // //     }
// // // //   }, [visible]);

// // // //   const handleAddPress = () => {
// // // //     if (newTodo.trim()) {
// // // //       onAdd(newTodo.trim());
// // // //       setNewTodo("");
// // // //       onClose();
// // // //     }
// // // //   };

// // // //   const handleClose = () => {
// // // //     setNewTodo("");
// // // //     onClose();
// // // //   };

// // // //   return (
// // // //     <Modal
// // // //       visible={visible}
// // // //       transparent={true}
// // // //       animationType="slide"
// // // //       onRequestClose={handleClose}
// // // //     >
// // // //       <KeyboardAvoidingView
// // // //         style={{ flex: 1 }}
// // // //         behavior={Platform.OS === "ios" ? "padding" : "height"}
// // // //       >
// // // //         <TouchableWithoutFeedback
// // // //           style={{ flex: 1 }}
// // // //           onPress={() => Keyboard.dismiss()}
// // // //         >
// // // //           <View style={styles.modalOverlay}>
// // // //             <View
// // // //               style={[
// // // //                 styles.modalContent,
// // // //                 { backgroundColor: colorScheme === "dark" ? "#222" : "#fff" },
// // // //               ]}
// // // //             >
// // // //               <View style={styles.modalHeader}>
// // // //                 <ThemedText style={styles.modalTitle}>
// // // //                   {t("addForDay")} {selectedDayName}
// // // //                 </ThemedText>
// // // //                 <View
// // // //                   style={{
// // // //                     flexDirection: "row",
// // // //                     alignItems: "center",
// // // //                     gap: 10,
// // // //                   }}
// // // //                 >
// // // //                   {searchVisible ? (
// // // //                     <View
// // // //                       style={[
// // // //                         styles.searchBox,
// // // //                         { backgroundColor: Colors[colorScheme].contrast },
// // // //                       ]}
// // // //                     >
// // // //                       <TextInput
// // // //                         placeholder={t("search")}
// // // //                         placeholderTextColor={Colors[colorScheme].text}
// // // //                         autoCapitalize="none"
// // // //                         autoCorrect={false}
// // // //                         returnKeyType="done"
// // // //                         style={[
// // // //                           styles.input,
// // // //                           { color: Colors[colorScheme].text },
// // // //                         ]}
// // // //                       />
// // // //                       {/* {query.length > 0 && !activeLoading && (
// // // //                               <TouchableOpacity onPress={onClear} style={styles.clearBtn}>
// // // //                                 <ThemedText style={{ fontSize: 18 }}>×</ThemedText>
// // // //                               </TouchableOpacity>
// // // //                             )}
// // // //                             {activeLoading && <LoadingIndicator style={{ marginLeft: 8 }} />} */}
// // // //                     </View>
// // // //                   ) : null}
// // // //                   <Feather
// // // //                     name="search"
// // // //                     size={24}
// // // //                     color={Colors[colorScheme].defaultIcon}
// // // //                     onPress={() => setSearchVisible(true)}
// // // //                   />
// // // //                   <TouchableOpacity
// // // //                     style={styles.closeButton}
// // // //                     onPress={handleClose}
// // // //                   >
// // // //                     <Ionicons
// // // //                       name="close"
// // // //                       size={24}
// // // //                       color={Colors[colorScheme].defaultIcon}
// // // //                     />
// // // //                   </TouchableOpacity>
// // // //                 </View>
// // // //               </View>
// // // //               <TextInput
// // // //                 style={[
// // // //                   styles.modalInput,
// // // //                   {
// // // //                     color: colorScheme === "dark" ? "#fff" : "#000",
// // // //                     backgroundColor:
// // // //                       colorScheme === "dark" ? "#333" : "#f5f5f5",
// // // //                     textAlign: rtl ? "right" : "left",
// // // //                   },
// // // //                 ]}
// // // //                 value={newTodo}
// // // //                 onChangeText={setNewTodo}
// // // //                 placeholder={t("enterPrayer")}
// // // //                 placeholderTextColor={colorScheme === "dark" ? "#999" : "#999"}
// // // //                 multiline={true}
// // // //               />
// // // //               <View style={[styles.modalButtonsContainer]}>
// // // //                 <TouchableOpacity
// // // //                   style={[
// // // //                     styles.modalButton,
// // // //                     styles.cancelButton,
// // // //                     {
// // // //                       backgroundColor:
// // // //                         colorScheme === "dark" ? "#333" : "#f0f0f0",
// // // //                     },
// // // //                   ]}
// // // //                   onPress={handleClose}
// // // //                 >
// // // //                   <ThemedText style={styles.modalButtonText}>
// // // //                     {t("cancel")}
// // // //                   </ThemedText>
// // // //                 </TouchableOpacity>
// // // //                 <TouchableOpacity
// // // //                   style={[
// // // //                     styles.modalButton,
// // // //                     styles.addModalButton,
// // // //                     { backgroundColor: "#4CAF50" },
// // // //                   ]}
// // // //                   onPress={handleAddPress}
// // // //                 >
// // // //                   <ThemedText
// // // //                     style={[styles.modalButtonText, { color: "#fff" }]}
// // // //                   >
// // // //                     {t("add")}
// // // //                   </ThemedText>
// // // //                 </TouchableOpacity>
// // // //               </View>
// // // //             </View>
// // // //           </View>
// // // //         </TouchableWithoutFeedback>
// // // //       </KeyboardAvoidingView>
// // // //     </Modal>
// // // //   );
// // // // };

// // // // // Add relevant styles from HomeScreen
// // // // const styles = StyleSheet.create({
// // // //   modalOverlay: {
// // // //     flex: 1,
// // // //     backgroundColor: "rgba(0,0,0,0.5)",
// // // //     justifyContent: "flex-end",
// // // //   },
// // // //   modalContent: {
// // // //     borderTopLeftRadius: 20,
// // // //     borderTopRightRadius: 20,
// // // //     padding: 20,
// // // //     shadowColor: "#000",
// // // //     shadowOffset: { width: 0, height: -2 },
// // // //     shadowOpacity: 0.1,
// // // //     shadowRadius: 5,
// // // //     elevation: 5,
// // // //   },
// // // //   modalHeader: {
// // // //     flexDirection: "row",
// // // //     justifyContent: "space-between",
// // // //     alignItems: "center",
// // // //     marginBottom: 16,
// // // //   },
// // // //   modalTitle: {
// // // //     fontSize: 18,
// // // //     fontWeight: "600",
// // // //   },
// // // //   closeButton: {
// // // //     padding: 4,
// // // //   },
// // // //   modalInput: {
// // // //     borderRadius: 10,
// // // //     padding: 12,
// // // //     minHeight: 100,
// // // //     maxHeight: 200,
// // // //     fontSize: 16,
// // // //     marginBottom: 16,
// // // //   },
// // // //   modalButtonsContainer: {
// // // //     flexDirection: "row", // Handled by prop
// // // //     justifyContent: "space-between",
// // // //     gap: 10,
// // // //   },
// // // //   modalButton: {
// // // //     flex: 1,
// // // //     borderRadius: 10,
// // // //     paddingVertical: 12,
// // // //     alignItems: "center",
// // // //     justifyContent: "center",
// // // //   },
// // // //   cancelButton: {
// // // //     opacity: 0.8,
// // // //   },
// // // //   addModalButton: {},
// // // //   modalButtonText: {
// // // //     fontSize: 16,
// // // //     fontWeight: "600",
// // // //   },
// // // //   searchBox: {
// // // //     flexDirection: "row",
// // // //     paddingHorizontal: 5,
// // // //     borderRadius: 10,
// // // //     borderWidth: StyleSheet.hairlineWidth,
// // // //   },
// // // //   input: {
// // // //     fontSize: 16,
// // // //   },
// // // //   clearBtn: {
// // // //     paddingHorizontal: 6,
// // // //     paddingVertical: 4,
// // // //   },
// // // // });
// // // // src/components/AddTodoModal.tsx

// // // //! Last that worked
// // // import React, {
// // //   useEffect,
// // //   useState,
// // //   useMemo,
// // //   useRef,
// // //   useCallback,
// // // } from "react";
// // // import {
// // //   View,
// // //   Modal,
// // //   TextInput,
// // //   TouchableOpacity,
// // //   StyleSheet,
// // //   TouchableWithoutFeedback,
// // //   Keyboard,
// // //   KeyboardAvoidingView,
// // //   Platform,
// // //   useColorScheme,
// // //   FlatList,
// // //   ActivityIndicator,
// // // } from "react-native";
// // // import { Feather, Ionicons } from "@expo/vector-icons";
// // // import { useTranslation } from "react-i18next";

// // // import { ThemedText } from "./ThemedText";
// // // import { ThemedView } from "./ThemedView";
// // // import { useLanguage } from "@/contexts/LanguageContext";
// // // import {
// // //   AddTodoModalType,
// // //   QuestionType,
// // //   PrayerWithCategory,
// // //   Language,
// // //   InternalLinkType,
// // //   SearchResult,
// // // } from "@/constants/Types";
// // // import { Colors } from "@/constants/Colors";
// // // import { searchQuestions, searchPrayers, searchQuranLabels } from "@/db/search";
// // // import RenderLink from "./RenderLink";
// // // type SearchFilter = "prayers" | "quran" | "questions";

// // // /** Encode as "type:identifier" for internal URLs. */
// // // const encodeInternalUrl = (
// // //   type: InternalLinkType,
// // //   identifier: string
// // // ): string => `${type}:${identifier}`;

// // // /* ------------ debounce helper with cleanup ------------ */

// // // type Debounced<F extends (...args: any[]) => void> = ((
// // //   ...args: Parameters<F>
// // // ) => void) & { cancel: () => void };

// // // const debounceFn = <F extends (...args: any[]) => void>(
// // //   fn: F,
// // //   delay: number
// // // ): Debounced<F> => {
// // //   let timeout: ReturnType<typeof setTimeout> | null = null;

// // //   const debounced = (...args: Parameters<F>) => {
// // //     if (timeout) clearTimeout(timeout);
// // //     timeout = setTimeout(() => {
// // //       fn(...args);
// // //     }, delay);
// // //   };

// // //   debounced.cancel = () => {
// // //     if (timeout) {
// // //       clearTimeout(timeout);
// // //       timeout = null;
// // //     }
// // //   };

// // //   return debounced as Debounced<F>;
// // // };

// // // export const AddTodoModal: React.FC<AddTodoModalType> = ({
// // //   visible,
// // //   onClose,
// // //   onAdd,
// // //   selectedDayName,
// // // }) => {
// // //   const [newTodo, setNewTodo] = useState("");
// // //   const [searchExpanded, setSearchExpanded] = useState(false);
// // //   const [searchQuery, setSearchQuery] = useState("");
// // //   const [results, setResults] = useState<SearchResult[]>([]);
// // //   const [loading, setLoading] = useState(false);
// // //   const [internalUrls, setInternalUrls] = useState<string[]>([]);
// // //   const [filter, setFilter] = useState<SearchFilter>("prayers");

// // //   const colorScheme = useColorScheme() || "light";
// // //   const { t } = useTranslation();
// // //   const { rtl, lang } = useLanguage();

// // //   // used to ignore stale async responses
// // //   const requestIdRef = useRef(0);

// // //   /* ------------ helpers ------------ */

// // //   const resetState = () => {
// // //     setNewTodo("");
// // //     setSearchExpanded(false);
// // //     setSearchQuery("");
// // //     setResults([]);
// // //     setInternalUrls([]);
// // //     setLoading(false);
// // //     setFilter("prayers");
// // //     requestIdRef.current = 0;
// // //   };

// // //   // Reset when modal opens
// // //   useEffect(() => {
// // //     if (visible) resetState();
// // //   }, [visible]);

// // //   const handleClose = () => {
// // //     resetState();
// // //     onClose();
// // //   };

// // //   const handleAddPress = () => {
// // //     const text = newTodo.trim();
// // //     if (!text && internalUrls.length === 0) return;
// // //     onAdd(text, internalUrls);
// // //     handleClose();
// // //   };

// // //   const handleOpenSearch = () => {
// // //     setSearchExpanded(true);
// // //     setSearchQuery("");
// // //     setResults([]);
// // //     setLoading(false);
// // //     setFilter("prayers");
// // //   };

// // //   const handleCloseSearch = () => {
// // //     setSearchExpanded(false);
// // //     setSearchQuery("");
// // //     setResults([]);
// // //     setLoading(false);
// // //     setFilter("prayers");
// // //   };

// // //   /* ------------ search (per filter) ------------ */

// // //   const runSearch = useCallback(
// // //     async (term: string) => {
// // //       const q = term.trim();
// // //       const currentId = ++requestIdRef.current;

// // //       if (q.length < 2) {
// // //         if (currentId === requestIdRef.current) {
// // //           setResults([]);
// // //           setLoading(false);
// // //         }
// // //         return;
// // //       }

// // //       setLoading(true);

// // //       try {
// // //         let merged: SearchResult[] = [];

// // //         if (filter === "questions") {
// // //           const res = await searchQuestions(lang, q, { limit: 12 });
// // //           if (currentId !== requestIdRef.current) return;

// // //           merged = (res.rows as QuestionType[]).map((qItem) => ({
// // //             id: `question-${qItem.id}`,
// // //             label: qItem.title,
// // //             type: "questionLink",
// // //             identifier: String(qItem.id),
// // //             meta: t("question") || "Question",
// // //           }));
// // //         } else if (filter === "prayers") {
// // //           const res = await searchPrayers(lang, q, { limit: 12 });
// // //           if (currentId !== requestIdRef.current) return;

// // //           merged = (res.rows as PrayerWithCategory[]).map((p) => ({
// // //             id: `prayer-${p.id}`,
// // //             label: p.name,
// // //             type: "prayerLink",
// // //             identifier: String(p.id),
// // //             meta: t("prayer") || "Prayer",
// // //           }));
// // //         } else if (filter === "quran") {
// // //           const res = await searchQuranLabels(lang as Language, q, {
// // //             limit: 20,
// // //           });
// // //           if (currentId !== requestIdRef.current) return;

// // //           merged = res.rows.map((sura) => ({
// // //             id: `quran-${sura.sura}`,
// // //             label: sura.label || `${t("quran") || "Qur'an"} ${sura.sura}`,
// // //             type: "quranLink",
// // //             identifier: sura.identifier, // "<sura>:1"
// // //             meta: `${t("quran") || "Qur'an"} ${sura.sura}`,
// // //           }));
// // //         }

// // //         setResults(merged);
// // //       } catch (error) {
// // //         if (currentId === requestIdRef.current) {
// // //           console.error("AddTodoModal search error:", error);
// // //           setResults([]);
// // //         }
// // //       } finally {
// // //         if (currentId === requestIdRef.current) {
// // //           setLoading(false);
// // //         }
// // //       }
// // //     },
// // //     [filter, lang, t]
// // //   );

// // //   const debouncedSearch = useMemo(
// // //     () => debounceFn((q: string) => runSearch(q), 250),
// // //     [runSearch]
// // //   );

// // //   // Re-run search when query, filter, or expanded state changes
// // //   useEffect(() => {
// // //     if (!searchExpanded) return;
// // //     debouncedSearch(searchQuery);
// // //   }, [searchQuery, searchExpanded, filter, debouncedSearch]);

// // //   // Cleanup pending timeout on unmount / re-create
// // //   useEffect(() => {
// // //     return () => {
// // //       debouncedSearch.cancel();
// // //     };
// // //   }, [debouncedSearch]);

// // //   /* ------------ add/remove link from search result ------------ */

// // //   const handleSelectResult = (item: SearchResult) => {
// // //     const url = encodeInternalUrl(item.type, item.identifier);
// // //     setInternalUrls((prev) => (prev.includes(url) ? prev : [...prev, url]));
// // //     handleCloseSearch();
// // //   };

// // //   const handleRemoveLink = (urlToRemove: string) => {
// // //     setInternalUrls((prev) => prev.filter((u) => u !== urlToRemove));
// // //   };

// // //   /* ------------ render ------------ */

// // //   return (
// // //     <Modal
// // //       visible={visible}
// // //       transparent
// // //       animationType="slide"
// // //       onRequestClose={handleClose}
// // //     >
// // //       <KeyboardAvoidingView
// // //         style={{ flex: 1 }}
// // //         behavior={Platform.OS === "ios" ? "padding" : "height"}
// // //       >
// // //         <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
// // //           <View style={styles.modalOverlay}>
// // //             <ThemedView style={styles.modalContent}>
// // //               {/* Header */}
// // //               <View style={styles.modalHeader}>
// // //                 <ThemedText style={styles.modalTitle}>
// // //                   {t("addForDay")} {selectedDayName}
// // //                 </ThemedText>

// // //                 <View style={styles.headerRight}>
// // //                   <TouchableOpacity
// // //                     onPress={handleOpenSearch}
// // //                     style={styles.iconButton}
// // //                   >
// // //                     <Feather
// // //                       name="search"
// // //                       size={22}
// // //                       color={Colors[colorScheme].defaultIcon}
// // //                     />
// // //                   </TouchableOpacity>

// // //                   <TouchableOpacity
// // //                     style={styles.closeButton}
// // //                     onPress={handleClose}
// // //                   >
// // //                     <Ionicons
// // //                       name="close"
// // //                       size={24}
// // //                       color={Colors[colorScheme].defaultIcon}
// // //                     />
// // //                   </TouchableOpacity>
// // //                 </View>
// // //               </View>

// // //               {/* Minimal Search Overlay */}
// // //               {searchExpanded && (
// // //                 <View style={styles.searchOverlay}>
// // //                   {/* Simple Header */}
// // //                   <View style={styles.searchHeader}>
// // //                     <TouchableOpacity
// // //                       onPress={handleCloseSearch}
// // //                       style={styles.backButton}
// // //                     >
// // //                       <Ionicons
// // //                         name="arrow-back"
// // //                         size={22}
// // //                         color={Colors[colorScheme].defaultIcon}
// // //                       />
// // //                     </TouchableOpacity>

// // //                     {/* Clean Filter Tabs */}
// // //                     <View style={styles.filterTabs}>
// // //                       {(
// // //                         [
// // //                           { key: "prayers", label: t("tab_prayers") },
// // //                           { key: "quran", label: t("tab_quran") },
// // //                           { key: "questions", label: t("tab_questions") },
// // //                         ] as { key: SearchFilter; label: string }[]
// // //                       ).map((f) => {
// // //                         const active = f.key === filter;
// // //                         return (
// // //                           <TouchableOpacity
// // //                             key={f.key}
// // //                             onPress={() => setFilter(f.key)}
// // //                             style={[
// // //                               styles.filterTab,
// // //                               active && {
// // //                                 borderBottomColor: Colors.universal.primary,
// // //                               },
// // //                             ]}
// // //                           >
// // //                             <ThemedText
// // //                               style={[
// // //                                 styles.filterTabText,
// // //                                 {
// // //                                   color: active
// // //                                     ? Colors.universal.primary
// // //                                     : Colors[colorScheme].defaultIcon,
// // //                                   opacity: active ? 1 : 0.6,
// // //                                 },
// // //                               ]}
// // //                             >
// // //                               {f.label}
// // //                             </ThemedText>
// // //                           </TouchableOpacity>
// // //                         );
// // //                       })}
// // //                     </View>
// // //                   </View>

// // //                   {/* Clean Search Input */}
// // //                   <View
// // //                     style={[
// // //                       styles.searchInputWrapper,
// // //                       {
// // //                         borderBottomColor: searchQuery.length > 0
// // //                           ? Colors.universal.primary
// // //                           : colorScheme === "dark"
// // //                           ? "rgba(255,255,255,0.1)"
// // //                           : "rgba(0,0,0,0.1)",
// // //                       },
// // //                     ]}
// // //                   >
// // //                     <Feather
// // //                       name="search"
// // //                       size={18}
// // //                       color={Colors[colorScheme].defaultIcon}
// // //                       style={{ opacity: 0.4 }}
// // //                     />
// // //                     <TextInput
// // //                       placeholder={t("search")}
// // //                       placeholderTextColor={colorScheme === "dark" ? "#666" : "#999"}
// // //                       autoCapitalize="none"
// // //                       autoCorrect={false}
// // //                       returnKeyType="search"
// // //                       value={searchQuery}
// // //                       onChangeText={setSearchQuery}
// // //                       style={[
// // //                         styles.searchInput,
// // //                         {
// // //                           color: Colors[colorScheme].defaultIcon,
// // //                           textAlign: rtl ? "right" : "left",
// // //                         },
// // //                       ]}
// // //                     />
// // //                     {searchQuery.length > 0 && (
// // //                       <TouchableOpacity onPress={() => setSearchQuery("")}>
// // //                         <Ionicons
// // //                           name="close-circle"
// // //                           size={18}
// // //                           color={Colors[colorScheme].defaultIcon}
// // //                           style={{ opacity: 0.4 }}
// // //                         />
// // //                       </TouchableOpacity>
// // //                     )}
// // //                   </View>

// // //                   {loading && (
// // //                     <View style={styles.loadingWrapper}>
// // //                       <ActivityIndicator size="small" color={Colors.universal.primary} />
// // //                     </View>
// // //                   )}

// // //                   {/* Clean Results List */}
// // //                   <FlatList
// // //                     data={results}
// // //                     keyExtractor={(item) => item.id}
// // //                     keyboardShouldPersistTaps="handled"
// // //                     contentContainerStyle={styles.resultsWrapper}
// // //                     renderItem={({ item }) => (
// // //                       <TouchableOpacity
// // //                         style={styles.resultItem}
// // //                         onPress={() => handleSelectResult(item)}
// // //                       >
// // //                         <View style={styles.resultText}>
// // //                           <ThemedText style={styles.resultLabel}>
// // //                             {item.label}
// // //                           </ThemedText>
// // //                           {item.meta && (
// // //                             <ThemedText
// // //                               style={[
// // //                                 styles.resultMeta,
// // //                                 { color: Colors.universal.primary },
// // //                               ]}
// // //                             >
// // //                               {item.meta}
// // //                             </ThemedText>
// // //                           )}
// // //                         </View>
// // //                         <Feather
// // //                           name="plus"
// // //                           size={18}
// // //                           color={Colors.universal.primary}
// // //                         />
// // //                       </TouchableOpacity>
// // //                     )}
// // //                     ListEmptyComponent={
// // //                       !loading && searchQuery.length >= 2 ? (
// // //                         <View style={styles.emptyState}>
// // //                           <ThemedText style={styles.emptyText}>
// // //                             {t("noSearchResults")}
// // //                           </ThemedText>
// // //                         </View>
// // //                       ) : null
// // //                     }
// // //                   />
// // //                 </View>
// // //               )}

// // //               {/* Text input */}
// // //               <ThemedView style={styles.inputWrapper}>
// // //                 <TextInput
// // //                   style={[
// // //                     styles.modalInput,
// // //                     {
// // //                       color: colorScheme === "dark" ? "#fff" : "#000",
// // //                       textAlign: rtl ? "right" : "left",
// // //                       backgroundColor: Colors[colorScheme].contrast,
// // //                     },
// // //                   ]}
// // //                   value={newTodo}
// // //                   onChangeText={setNewTodo}
// // //                   placeholder={t("enterTodo")}
// // //                   placeholderTextColor={
// // //                     colorScheme === "dark" ? "#999" : "#999"
// // //                   }
// // //                   multiline
// // //                 />
// // //               </ThemedView>

// // //               {/* Selected links */}
// // //               {internalUrls.length > 0 && (
// // //                 <ThemedView style={styles.linksContainer}>
// // //                   {internalUrls.map((url, index) => (
// // //                     <View
// // //                       key={`internal-url-${index}-${url}`}
// // //                       style={styles.linkRow}
// // //                     >
// // //                       <RenderLink url={url} index={index} isExternal={false} />
// // //                       <TouchableOpacity
// // //                         onPress={() => handleRemoveLink(url)}
// // //                         style={styles.removeLinkButton}
// // //                       >
// // //                         <Ionicons
// // //                           name="close"
// // //                           size={14}
// // //                           color={colorScheme === "dark" ? "#fff" : "#000"}
// // //                         />
// // //                       </TouchableOpacity>
// // //                     </View>
// // //                   ))}
// // //                 </ThemedView>
// // //               )}

// // //               {/* Buttons */}
// // //               <View style={styles.modalButtonsContainer}>
// // //                 <TouchableOpacity
// // //                   style={[styles.modalButton, styles.cancelButton]}
// // //                   onPress={handleClose}
// // //                 >
// // //                   <ThemedText style={styles.modalButtonText}>
// // //                     {t("cancel")}
// // //                   </ThemedText>
// // //                 </TouchableOpacity>

// // //                 <TouchableOpacity
// // //                   style={[styles.modalButton, styles.addModalButton]}
// // //                   onPress={handleAddPress}
// // //                 >
// // //                   <ThemedText
// // //                     style={[styles.modalButtonText, { color: "#fff" }]}
// // //                   >
// // //                     {t("add")}
// // //                   </ThemedText>
// // //                 </TouchableOpacity>
// // //               </View>
// // //             </ThemedView>
// // //           </View>
// // //         </TouchableWithoutFeedback>
// // //       </KeyboardAvoidingView>
// // //     </Modal>
// // //   );
// // // };

// // // /* ------------ styles ------------ */

// // // const styles = StyleSheet.create({
// // //   modalOverlay: {
// // //     flex: 1,
// // //     backgroundColor: "rgba(0,0,0,0.5)",
// // //     justifyContent: "flex-end",
// // //   },
// // //   modalContent: {
// // //     maxHeight: "85%",
// // //     borderTopLeftRadius: 20,
// // //     borderTopRightRadius: 20,
// // //     padding: 20,
// // //     overflow: "hidden",
// // //   },
// // //   modalHeader: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     marginBottom: 12,
// // //   },
// // //   modalTitle: {
// // //     fontSize: 18,
// // //     fontWeight: "600",
// // //   },
// // //   headerRight: {
// // //     flex: 1,
// // //     flexDirection: "row",
// // //     justifyContent: "flex-end",
// // //     alignItems: "center",
// // //     marginLeft: 10,
// // //     gap: 8,
// // //   },
// // //   iconButton: {
// // //     padding: 4,
// // //   },
// // //   closeButton: {
// // //     padding: 4,
// // //   },

// // //   // Minimal Search Overlay
// // //   searchOverlay: {
// // //     marginBottom: 12,
// // //   },
// // //   searchHeader: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     marginBottom: 16,
// // //     gap: 12,
// // //   },
// // //   backButton: {
// // //     padding: 4,
// // //   },
// // //   filterTabs: {
// // //     flexDirection: "row",
// // //     flex: 1,
// // //     gap: 4,
// // //   },
// // //   filterTab: {
// // //     flex: 1,
// // //     paddingVertical: 8,
// // //     alignItems: "center",
// // //     borderBottomWidth: 2,
// // //     borderBottomColor: "transparent",
// // //   },
// // //   filterTabText: {
// // //     fontSize: 13,
// // //     fontWeight: "500",
// // //   },

// // //   // Clean Search Input
// // //   searchInputWrapper: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     paddingVertical: 12,
// // //     paddingHorizontal: 4,
// // //     marginBottom: 12,
// // //     gap: 10,
// // //     borderBottomWidth: 1,
// // //   },
// // //   searchInput: {
// // //     flex: 1,
// // //     fontSize: 15,
// // //     padding: 0,
// // //   },

// // //   // Loading
// // //   loadingWrapper: {
// // //     paddingVertical: 12,
// // //     alignItems: "center",
// // //   },

// // //   // Results
// // //   resultsWrapper: {
// // //     paddingVertical: 4,
// // //   },
// // //   resultItem: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     justifyContent: "space-between",
// // //     paddingVertical: 12,
// // //     paddingHorizontal: 4,
// // //     gap: 12,
// // //   },
// // //   resultText: {
// // //     flex: 1,
// // //     gap: 4,
// // //   },
// // //   resultLabel: {
// // //     fontSize: 15,
// // //     lineHeight: 20,
// // //   },
// // //   resultMeta: {
// // //     fontSize: 12,
// // //     opacity: 0.8,
// // //   },

// // //   // Empty State
// // //   emptyState: {
// // //     paddingVertical: 32,
// // //     alignItems: "center",
// // //   },
// // //   emptyText: {
// // //     fontSize: 14,
// // //     opacity: 0.5,
// // //   },

// // //   inputWrapper: {
// // //     borderRadius: 10,
// // //     marginBottom: 10,
// // //   },
// // //   modalInput: {
// // //     borderRadius: 10,
// // //     padding: 12,
// // //     minHeight: 80,
// // //     maxHeight: 200,
// // //     fontSize: 16,
// // //     marginBottom: 10,
// // //   },

// // //   linksContainer: {
// // //     marginBottom: 14,
// // //     gap: 6,
// // //   },
// // //   linkRow: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //   },
// // //   removeLinkButton: {
// // //     padding: 4,
// // //     marginLeft: 4,
// // //   },

// // //   modalButtonsContainer: {
// // //     flexDirection: "row",
// // //     justifyContent: "space-between",
// // //     gap: 10,
// // //   },
// // //   modalButton: {
// // //     flex: 1,
// // //     borderRadius: 10,
// // //     paddingVertical: 12,
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //   },
// // //   cancelButton: {
// // //     backgroundColor: "rgba(160,160,160,0.15)",
// // //   },
// // //   addModalButton: {
// // //     backgroundColor: "#4CAF50",
// // //   },
// // //   modalButtonText: {
// // //     fontSize: 16,
// // //     fontWeight: "600",
// // //   },
// // // });

// // // export default AddTodoModal;

// // // //! Alt

// // // //   return (
// // // //     <Modal
// // // //       visible={visible}
// // // //       transparent
// // // //       animationType="slide"
// // // //       onRequestClose={handleClose}
// // // //     >
// // // //       <KeyboardAvoidingView
// // // //         style={{ flex: 1 }}
// // // //         behavior={Platform.OS === "ios" ? "padding" : "height"}
// // // //       >
// // // //         <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
// // // //           <View style={styles.modalOverlay}>
// // // //             <ThemedView style={styles.modalContent}>
// // // //               {/* Header */}
// // // //               <View style={styles.modalHeader}>
// // // //                 <ThemedText style={styles.modalTitle}>
// // // //                   {t("addForDay")} {selectedDayName}
// // // //                 </ThemedText>

// // // //                 <View style={styles.headerRight}>
// // // //                   {!searchExpanded ? (
// // // //                     <TouchableOpacity
// // // //                       onPress={handleOpenSearch}
// // // //                       style={styles.iconButton}
// // // //                     >
// // // //                       <Feather
// // // //                         name="search"
// // // //                         size={22}
// // // //                         color={Colors[colorScheme].defaultIcon}
// // // //                       />
// // // //                     </TouchableOpacity>
// // // //                   ) : null}

// // // //                   <TouchableOpacity
// // // //                     style={styles.closeButton}
// // // //                     onPress={handleClose}
// // // //                   >
// // // //                     <Ionicons
// // // //                       name="close"
// // // //                       size={24}
// // // //                       color={Colors[colorScheme].defaultIcon}
// // // //                     />
// // // //                   </TouchableOpacity>
// // // //                 </View>
// // // //               </View>

// // // //               {/* Search overlay */}
// // // //               {searchExpanded && (
// // // //                 <View
// // // //                   style={[
// // // //                     styles.searchOverlay,
// // // //                     { borderColor: Colors[colorScheme].border },
// // // //                   ]}
// // // //                 >
// // // //                   <View style={styles.searchOverlayHeader}></View>

// // // //                   {/* Filter chips */}
// // // //                   <View style={[styles.filterRow]}>
// // // //                     <TouchableOpacity
// // // //                       onPress={handleCloseSearch}
// // // //                       style={styles.backBtn}
// // // //                     >
// // // //                       <Ionicons
// // // //                         name="chevron-back"
// // // //                         size={22}
// // // //                         color={Colors[colorScheme].defaultIcon}
// // // //                       />
// // // //                     </TouchableOpacity>
// // // //                     {(
// // // //                       [
// // // //                         { key: "prayers", label: t("tab_prayers") },
// // // //                         { key: "quran", label: t("tab_quran") },
// // // //                         { key: "questions", label: t("tab_questions") },
// // // //                       ] as { key: SearchFilter; label: string }[]
// // // //                     ).map((f) => {
// // // //                       const active = f.key === filter;
// // // //                       return (
// // // //                         <TouchableOpacity
// // // //                           key={f.key}
// // // //                           onPress={() => setFilter(f.key)}
// // // //                           style={[
// // // //                             styles.filterChip,
// // // //                             active && styles.filterChipActive,
// // // //                           ]}
// // // //                         >
// // // //                           <ThemedText
// // // //                             style={[
// // // //                               styles.filterChipText,
// // // //                               active && styles.filterChipTextActive,
// // // //                             ]}
// // // //                           >
// // // //                             {f.label}
// // // //                           </ThemedText>
// // // //                         </TouchableOpacity>
// // // //                       );
// // // //                     })}
// // // //                   </View>

// // // //                   {/* Search input */}
// // // //                   <View style={styles.searchOverlayInputWrapper}>
// // // //                     <TextInput
// // // //                       placeholder={t("search")}
// // // //                       placeholderTextColor={
// // // //                         colorScheme === "dark" ? "#999" : "#999"
// // // //                       }
// // // //                       autoCapitalize="none"
// // // //                       autoCorrect={false}
// // // //                       returnKeyType="search"
// // // //                       value={searchQuery}
// // // //                       onChangeText={setSearchQuery}
// // // //                       style={[
// // // //                         styles.searchOverlayInput,
// // // //                         {
// // // //                           backgroundColor: Colors[colorScheme].contrast,
// // // //                           padding: 8,
// // // //                           borderRadius: 8,
// // // //                           textAlign: rtl ? "right" : "left",
// // // //                         },
// // // //                       ]}
// // // //                     />
// // // //                     {searchQuery.length > 0 && (
// // // //                       <TouchableOpacity onPress={() => setSearchQuery("")}>
// // // //                         <Ionicons
// // // //                           name="close-circle"
// // // //                           size={18}
// // // //                           color={Colors[colorScheme].defaultIcon}
// // // //                         />
// // // //                       </TouchableOpacity>
// // // //                     )}
// // // //                   </View>

// // // //                   {loading && (
// // // //                     <View style={styles.loadingRow}>
// // // //                       <ActivityIndicator />
// // // //                     </View>
// // // //                   )}

// // // //                   <FlatList
// // // //                     data={results}
// // // //                     keyExtractor={(item) => item.id}
// // // //                     keyboardShouldPersistTaps="handled"
// // // //                     contentContainerStyle={styles.resultsContainer}
// // // //                     renderItem={({ item }) => (
// // // //                       <TouchableOpacity
// // // //                         style={styles.resultItem}
// // // //                         onPress={() => handleSelectResult(item)}
// // // //                       >
// // // //                         <ThemedText style={styles.resultLabel}>
// // // //                           {item.label}
// // // //                         </ThemedText>
// // // //                         {item.meta && (
// // // //                           <ThemedText style={styles.resultMeta}>
// // // //                             {item.meta}
// // // //                           </ThemedText>
// // // //                         )}
// // // //                       </TouchableOpacity>
// // // //                     )}
// // // //                     ListEmptyComponent={
// // // //                       !loading && searchQuery.length >= 2 ? (
// // // //                         <ThemedText style={styles.noResultText}>
// // // //                           {t("noSearchResults")}
// // // //                         </ThemedText>
// // // //                       ) : null
// // // //                     }
// // // //                   />
// // // //                 </View>
// // // //               )}

// // // //               {/* Text input */}
// // // //               <ThemedView style={styles.inputWrapper}>
// // // //                 <TextInput
// // // //                   style={[
// // // //                     styles.modalInput,
// // // //                     {
// // // //                       color: colorScheme === "dark" ? "#fff" : "#000",
// // // //                       textAlign: rtl ? "right" : "left",
// // // //                       backgroundColor: Colors[colorScheme].contrast,
// // // //                     },
// // // //                   ]}
// // // //                   value={newTodo}
// // // //                   onChangeText={setNewTodo}
// // // //                   placeholder={t("enterTodo")}
// // // //                   placeholderTextColor={
// // // //                     colorScheme === "dark" ? "#999" : "#999"
// // // //                   }
// // // //                   multiline
// // // //                 />
// // // //               </ThemedView>

// // // //               {/* Selected links */}
// // // //               {internalUrls.length > 0 && (
// // // //                 <ThemedView style={styles.linksContainer}>
// // // //                   {internalUrls.map((url, index) => (
// // // //                     <View
// // // //                       key={`internal-url-${index}-${url}`}
// // // //                       style={styles.linkRow}
// // // //                     >
// // // //                       <RenderLink url={url} index={index} isExternal={false} />
// // // //                       <TouchableOpacity
// // // //                         onPress={() => handleRemoveLink(url)}
// // // //                         style={styles.removeLinkButton}
// // // //                       >
// // // //                         <Ionicons
// // // //                           name="close"
// // // //                           size={14}
// // // //                           color={colorScheme === "dark" ? "#fff" : "#000"}
// // // //                         />
// // // //                       </TouchableOpacity>
// // // //                     </View>
// // // //                   ))}
// // // //                 </ThemedView>
// // // //               )}

// // // //               {/* Buttons */}
// // // //               <View style={styles.modalButtonsContainer}>
// // // //                 <TouchableOpacity
// // // //                   style={[styles.modalButton, styles.cancelButton]}
// // // //                   onPress={handleClose}
// // // //                 >
// // // //                   <ThemedText style={styles.modalButtonText}>
// // // //                     {t("cancel")}
// // // //                   </ThemedText>
// // // //                 </TouchableOpacity>

// // // //                 <TouchableOpacity
// // // //                   style={[styles.modalButton, styles.addModalButton]}
// // // //                   onPress={handleAddPress}
// // // //                 >
// // // //                   <ThemedText
// // // //                     style={[styles.modalButtonText, { color: "#fff" }]}
// // // //                   >
// // // //                     {t("add")}
// // // //                   </ThemedText>
// // // //                 </TouchableOpacity>
// // // //               </View>
// // // //             </ThemedView>
// // // //           </View>
// // // //         </TouchableWithoutFeedback>
// // // //       </KeyboardAvoidingView>
// // // //     </Modal>
// // // //   );
// // // // };

// // // // /* ------------ styles ------------ */

// // // // const styles = StyleSheet.create({
// // // //   modalOverlay: {
// // // //     flex: 1,
// // // //     backgroundColor: "rgba(0,0,0,0.5)",
// // // //     justifyContent: "flex-end",
// // // //   },
// // // //   modalContent: {
// // // //     maxHeight: "85%",
// // // //     borderTopLeftRadius: 20,
// // // //     borderTopRightRadius: 20,
// // // //     padding: 20,
// // // //     overflow: "hidden",
// // // //   },
// // // //   modalHeader: {
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     marginBottom: 12,
// // // //   },
// // // //   modalTitle: {
// // // //     fontSize: 18,
// // // //     fontWeight: "600",
// // // //   },
// // // //   headerRight: {
// // // //     flex: 1,
// // // //     flexDirection: "row",
// // // //     justifyContent: "flex-end",
// // // //     alignItems: "center",
// // // //     marginLeft: 10,
// // // //     gap: 8,
// // // //   },
// // // //   iconButton: {
// // // //     padding: 4,
// // // //   },
// // // //   closeButton: {
// // // //     padding: 4,
// // // //   },

// // // //   searchOverlay: {
// // // //     marginBottom: 12,
// // // //     borderRadius: 14,
// // // //     borderBottomWidth: 0.5,
// // // //   },
// // // //   searchOverlayHeader: {
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     marginBottom: 6,
// // // //   },
// // // //   backBtn: {
// // // //     paddingRight: 4,
// // // //     paddingVertical: 2,
// // // //     marginRight: 4,
// // // //   },
// // // //   searchTitle: {
// // // //     fontSize: 16,
// // // //     fontWeight: "600",
// // // //   },

// // // //   filterRow: {
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     marginBottom: 6,
// // // //     gap: 6,
// // // //     flexWrap: "wrap",
// // // //   },
// // // //   filterChip: {
// // // //     paddingHorizontal: 10,
// // // //     paddingVertical: 4,
// // // //     borderRadius: 999,
// // // //     borderWidth: StyleSheet.hairlineWidth,
// // // //     borderColor: "rgba(150,150,150,0.6)",
// // // //   },
// // // //   filterChipActive: {
// // // //     backgroundColor: Colors.universal.primary,
// // // //     borderColor: Colors.universal.primary,
// // // //   },
// // // //   filterChipText: {
// // // //     fontSize: 12,
// // // //   },
// // // //   filterChipTextActive: {
// // // //     color: "#fff",
// // // //     fontWeight: "600",
// // // //   },

// // // //   searchOverlayInputWrapper: {
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     paddingVertical: 6,
// // // //     borderRadius: 10,
// // // //     marginBottom: 6,
// // // //     gap: 4,
// // // //   },
// // // //   searchOverlayInput: {
// // // //     flex: 1,
// // // //     fontSize: 15,
// // // //   },
// // // //   loadingRow: {
// // // //     paddingVertical: 4,
// // // //   },
// // // //   resultsContainer: {
// // // //     paddingVertical: 4,
// // // //   },
// // // //   resultItem: {
// // // //     paddingVertical: 8,
// // // //     paddingHorizontal: 6,
// // // //     borderRadius: 8,
// // // //   },
// // // //   resultLabel: {
// // // //     fontSize: 15,
// // // //   },
// // // //   resultMeta: {
// // // //     fontSize: 12,
// // // //     opacity: 0.6,
// // // //   },
// // // //   noResultText: {
// // // //     textAlign: "center",
// // // //     paddingVertical: 10,
// // // //     fontSize: 14,
// // // //     opacity: 0.7,
// // // //   },

// // // //   inputWrapper: {
// // // //     borderRadius: 10,
// // // //     marginBottom: 10,
// // // //   },
// // // //   modalInput: {
// // // //     borderRadius: 10,
// // // //     padding: 12,
// // // //     minHeight: 80,
// // // //     maxHeight: 200,
// // // //     fontSize: 16,
// // // //     marginBottom: 10,
// // // //   },

// // // //   linksContainer: {
// // // //     marginBottom: 14,
// // // //     gap: 6,
// // // //   },
// // // //   linkRow: {
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //   },
// // // //   removeLinkButton: {
// // // //     padding: 4,
// // // //     marginLeft: 4,
// // // //   },

// // // //   modalButtonsContainer: {
// // // //     flexDirection: "row",
// // // //     justifyContent: "space-between",
// // // //     gap: 10,
// // // //   },
// // // //   modalButton: {
// // // //     flex: 1,
// // // //     borderRadius: 10,
// // // //     paddingVertical: 12,
// // // //     alignItems: "center",
// // // //     justifyContent: "center",
// // // //   },
// // // //   cancelButton: {
// // // //     backgroundColor: "rgba(160,160,160,0.15)",
// // // //   },
// // // //   addModalButton: {
// // // //     backgroundColor: "#4CAF50",
// // // //   },
// // // //   modalButtonText: {
// // // //     fontSize: 16,
// // // //     fontWeight: "600",
// // // //   },
// // // // });

// // // // export default AddTodoModal;

// // //! New worked
// // import React, {
// //   useEffect,
// //   useState,
// //   useMemo,
// //   useRef,
// //   useCallback,
// // } from "react";
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
// //   FlatList,
// //   ActivityIndicator,
// // } from "react-native";
// // import { Feather, Ionicons } from "@expo/vector-icons";
// // import { useTranslation } from "react-i18next";

// // import { ThemedText } from "./ThemedText";
// // import { ThemedView } from "./ThemedView";
// // import { useLanguage } from "@/contexts/LanguageContext";
// // import {
// //   AddTodoModalType,
// //   QuestionType,
// //   PrayerWithCategory,
// //   Language,
// //   InternalLinkType,
// //   SearchResult,
// // } from "@/constants/Types";
// // import { Colors } from "@/constants/Colors";
// // import { searchQuestions, searchPrayers, searchQuranLabels } from "@/db/search";
// // import RenderLink from "./RenderLink";

// // type SearchFilter = "prayers" | "quran" | "questions";

// // /** Encode as "type:identifier" for internal URLs. */
// // const encodeInternalUrl = (
// //   type: InternalLinkType,
// //   identifier: string
// // ): string => `${type}:${identifier}`;

// // /* ------------ debounce helper with cleanup ------------ */

// // type Debounced<F extends (...args: any[]) => void> = ((
// //   ...args: Parameters<F>
// // ) => void) & { cancel: () => void };

// // const debounceFn = <F extends (...args: any[]) => void>(
// //   fn: F,
// //   delay: number
// // ): Debounced<F> => {
// //   let timeout: ReturnType<typeof setTimeout> | null = null;

// //   const debounced = (...args: Parameters<F>) => {
// //     if (timeout) clearTimeout(timeout);
// //     timeout = setTimeout(() => {
// //       fn(...args);
// //     }, delay);
// //   };

// //   debounced.cancel = () => {
// //     if (timeout) {
// //       clearTimeout(timeout);
// //       timeout = null;
// //     }
// //   };

// //   return debounced as Debounced<F>;
// // };

// // export const AddTodoModal: React.FC<AddTodoModalType> = ({
// //   visible,
// //   onClose,
// //   onAdd,
// //   selectedDayName,
// // }) => {
// //   const [newTodo, setNewTodo] = useState("");
// //   const [cursorPosition, setCursorPosition] = useState(0);
// //   const [searchExpanded, setSearchExpanded] = useState(false);
// //   const [searchQuery, setSearchQuery] = useState("");
// //   const [results, setResults] = useState<SearchResult[]>([]);
// //   const [loading, setLoading] = useState(false);
// //   const [internalUrls, setInternalUrls] = useState<string[]>([]);
// //   const [filter, setFilter] = useState<SearchFilter>("prayers");

// //   const colorScheme = useColorScheme() || "light";
// //   const { t } = useTranslation();
// //   const { rtl, lang } = useLanguage();

// //   // TextInput ref for managing focus
// //   const textInputRef = useRef<TextInput>(null);
// //   // used to ignore stale async responses
// //   const requestIdRef = useRef(0);

// //   /* ------------ helpers ------------ */

// //   const resetState = () => {
// //     setNewTodo("");
// //     setCursorPosition(0);
// //     setSearchExpanded(false);
// //     setSearchQuery("");
// //     setResults([]);
// //     setInternalUrls([]);
// //     setLoading(false);
// //     setFilter("prayers");
// //     requestIdRef.current = 0;
// //   };

// //   // Reset when modal opens
// //   useEffect(() => {
// //     if (visible) resetState();
// //   }, [visible]);

// //   const handleClose = () => {
// //     resetState();
// //     onClose();
// //   };

// //   const handleAddPress = () => {
// //     const text = newTodo.trim();
// //     if (!text && internalUrls.length === 0) return;
// //     onAdd(text, internalUrls);
// //     handleClose();
// //   };

// //   const handleOpenSearch = () => {
// //     setSearchExpanded(true);
// //     setSearchQuery("");
// //     setResults([]);
// //     setLoading(false);
// //     setFilter("prayers");
// //   };

// //   const handleCloseSearch = () => {
// //     setSearchExpanded(false);
// //     setSearchQuery("");
// //     setResults([]);
// //     setLoading(false);
// //     setFilter("prayers");
// //     // Return focus to text input
// //     textInputRef.current?.focus();
// //   };

// //   /* ------------ search (per filter) ------------ */

// //   const runSearch = useCallback(
// //     async (term: string) => {
// //       const q = term.trim();
// //       const currentId = ++requestIdRef.current;

// //       if (q.length < 2) {
// //         if (currentId === requestIdRef.current) {
// //           setResults([]);
// //           setLoading(false);
// //         }
// //         return;
// //       }

// //       setLoading(true);

// //       try {
// //         let merged: SearchResult[] = [];

// //         if (filter === "questions") {
// //           const res = await searchQuestions(lang, q, { limit: 12 });
// //           if (currentId !== requestIdRef.current) return;

// //           merged = (res.rows as QuestionType[]).map((qItem) => ({
// //             id: `question-${qItem.id}`,
// //             label: qItem.title,
// //             type: "questionLink",
// //             identifier: String(qItem.id),
// //             meta: t("question") || "Question",
// //           }));
// //         } else if (filter === "prayers") {
// //           const res = await searchPrayers(lang, q, { limit: 12 });
// //           if (currentId !== requestIdRef.current) return;

// //           merged = (res.rows as PrayerWithCategory[]).map((p) => ({
// //             id: `prayer-${p.id}`,
// //             label: p.name,
// //             type: "prayerLink",
// //             identifier: String(p.id),
// //             meta: t("prayer") || "Prayer",
// //           }));
// //         } else if (filter === "quran") {
// //           const res = await searchQuranLabels(lang as Language, q, {
// //             limit: 20,
// //           });
// //           if (currentId !== requestIdRef.current) return;

// //           merged = res.rows.map((sura) => ({
// //             id: `quran-${sura.sura}`,
// //             label: sura.label || `${t("quran") || "Qur'an"} ${sura.sura}`,
// //             type: "quranLink",
// //             identifier: sura.identifier, // "<sura>:1"
// //             meta: `${t("quran") || "Qur'an"} ${sura.sura}`,
// //           }));
// //         }

// //         setResults(merged);
// //       } catch (error) {
// //         if (currentId === requestIdRef.current) {
// //           console.error("AddTodoModal search error:", error);
// //           setResults([]);
// //         }
// //       } finally {
// //         if (currentId === requestIdRef.current) {
// //           setLoading(false);
// //         }
// //       }
// //     },
// //     [filter, lang, t]
// //   );

// //   const debouncedSearch = useMemo(
// //     () => debounceFn((q: string) => runSearch(q), 250),
// //     [runSearch]
// //   );

// //   // Re-run search when query, filter, or expanded state changes
// //   useEffect(() => {
// //     if (!searchExpanded) return;
// //     debouncedSearch(searchQuery);
// //   }, [searchQuery, searchExpanded, filter, debouncedSearch]);

// //   // Cleanup pending timeout on unmount / re-create
// //   useEffect(() => {
// //     return () => {
// //       debouncedSearch.cancel();
// //     };
// //   }, [debouncedSearch]);

// //   /* ------------ add link inline at cursor position ------------ */

// //   const handleSelectResult = (item: SearchResult) => {
// //     const url = encodeInternalUrl(item.type, item.identifier);

// //     // Add URL to array
// //     const newIndex = internalUrls.length;
// //     setInternalUrls((prev) => [...prev, url]);

// //     // Insert placeholder at cursor position
// //     const placeholder = `{{link:${newIndex}}}`;
// //     const before = newTodo.slice(0, cursorPosition);
// //     const after = newTodo.slice(cursorPosition);
// //     const newText = before + placeholder + after;

// //     setNewTodo(newText);

// //     // Update cursor position to after the placeholder
// //     const newCursorPos = cursorPosition + placeholder.length;
// //     setCursorPosition(newCursorPos);

// //     handleCloseSearch();

// //     // Set cursor position after state updates
// //     setTimeout(() => {
// //       textInputRef.current?.setNativeProps({
// //         selection: { start: newCursorPos, end: newCursorPos },
// //       });
// //     }, 50);
// //   };

// //   /* ------------ handle text input changes ------------ */

// //   const handleTextChange = (text: string) => {
// //     setNewTodo(text);
// //   };

// //   const handleSelectionChange = (event: any) => {
// //     const { start } = event.nativeEvent.selection;
// //     setCursorPosition(start);
// //   };

// //   /* ------------ render ------------ */

// //   return (
// //     <Modal
// //       visible={visible}
// //       transparent
// //       animationType="slide"
// //       onRequestClose={handleClose}
// //     >
// //       <KeyboardAvoidingView
// //         style={{ flex: 1 }}
// //         behavior={Platform.OS === "ios" ? "padding" : "height"}
// //       >
// //         <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
// //           <View style={styles.modalOverlay}>
// //             <ThemedView style={styles.modalContent}>
// //               {/* Header */}
// //               <View style={styles.modalHeader}>
// //                 <ThemedText style={styles.modalTitle}>
// //                   {t("addForDay")} {selectedDayName}
// //                 </ThemedText>

// //                 <View style={styles.headerRight}>
// //                   <TouchableOpacity
// //                     onPress={handleOpenSearch}
// //                     style={styles.iconButton}
// //                   >
// //                     <Feather
// //                       name="search"
// //                       size={22}
// //                       color={Colors[colorScheme].defaultIcon}
// //                     />
// //                   </TouchableOpacity>

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

// //               {/* Minimal Search Overlay */}
// //               {searchExpanded && (
// //                 <View style={styles.searchOverlay}>
// //                   {/* Simple Header */}
// //                   <View style={styles.searchHeader}>
// //                     <TouchableOpacity
// //                       onPress={handleCloseSearch}
// //                       style={styles.backButton}
// //                     >
// //                       <Ionicons
// //                         name="arrow-back"
// //                         size={22}
// //                         color={Colors[colorScheme].defaultIcon}
// //                       />
// //                     </TouchableOpacity>

// //                     {/* Clean Filter Tabs */}
// //                     <View style={styles.filterTabs}>
// //                       {(
// //                         [
// //                           { key: "prayers", label: t("tab_prayers") },
// //                           { key: "quran", label: t("tab_quran") },
// //                           { key: "questions", label: t("tab_questions") },
// //                         ] as { key: SearchFilter; label: string }[]
// //                       ).map((f) => {
// //                         const active = f.key === filter;
// //                         return (
// //                           <TouchableOpacity
// //                             key={f.key}
// //                             onPress={() => setFilter(f.key)}
// //                             style={[
// //                               styles.filterTab,
// //                               active && {
// //                                 borderBottomColor: Colors.universal.primary,
// //                               },
// //                             ]}
// //                           >
// //                             <ThemedText
// //                               style={[
// //                                 styles.filterTabText,
// //                                 {
// //                                   color: active
// //                                     ? Colors.universal.primary
// //                                     : Colors[colorScheme].defaultIcon,
// //                                   opacity: active ? 1 : 0.6,
// //                                 },
// //                               ]}
// //                             >
// //                               {f.label}
// //                             </ThemedText>
// //                           </TouchableOpacity>
// //                         );
// //                       })}
// //                     </View>
// //                   </View>

// //                   {/* Clean Search Input */}
// //                   <View
// //                     style={[
// //                       styles.searchInputWrapper,
// //                       {
// //                         borderBottomColor:
// //                           searchQuery.length > 0
// //                             ? Colors.universal.primary
// //                             : colorScheme === "dark"
// //                             ? "rgba(255,255,255,0.1)"
// //                             : "rgba(0,0,0,0.1)",
// //                       },
// //                     ]}
// //                   >
// //                     <Feather
// //                       name="search"
// //                       size={18}
// //                       color={Colors[colorScheme].defaultIcon}
// //                       style={{ opacity: 0.4 }}
// //                     />
// //                     <TextInput
// //                       placeholder={t("search")}
// //                       placeholderTextColor={
// //                         colorScheme === "dark" ? "#666" : "#999"
// //                       }
// //                       autoCapitalize="none"
// //                       autoCorrect={false}
// //                       autoFocus
// //                       returnKeyType="search"
// //                       value={searchQuery}
// //                       onChangeText={setSearchQuery}
// //                       style={[
// //                         styles.searchInput,
// //                         {
// //                           color: Colors[colorScheme].defaultIcon,
// //                           textAlign: rtl ? "right" : "left",
// //                         },
// //                       ]}
// //                     />
// //                     {searchQuery.length > 0 && (
// //                       <TouchableOpacity onPress={() => setSearchQuery("")}>
// //                         <Ionicons
// //                           name="close-circle"
// //                           size={18}
// //                           color={Colors[colorScheme].defaultIcon}
// //                           style={{ opacity: 0.4 }}
// //                         />
// //                       </TouchableOpacity>
// //                     )}
// //                   </View>

// //                   {loading && (
// //                     <View style={styles.loadingWrapper}>
// //                       <ActivityIndicator
// //                         size="small"
// //                         color={Colors.universal.primary}
// //                       />
// //                     </View>
// //                   )}

// //                   {/* Clean Results List */}
// //                   <FlatList
// //                     data={results}
// //                     keyExtractor={(item) => item.id}
// //                     keyboardShouldPersistTaps="handled"
// //                     contentContainerStyle={styles.resultsWrapper}
// //                     renderItem={({ item }) => (
// //                       <TouchableOpacity
// //                         style={styles.resultItem}
// //                         onPress={() => handleSelectResult(item)}
// //                       >
// //                         <View style={styles.resultText}>
// //                           <ThemedText style={styles.resultLabel}>
// //                             {item.label}
// //                           </ThemedText>
// //                           {item.meta && (
// //                             <ThemedText
// //                               style={[
// //                                 styles.resultMeta,
// //                                 { color: Colors.universal.primary },
// //                               ]}
// //                             >
// //                               {item.meta}
// //                             </ThemedText>
// //                           )}
// //                         </View>
// //                         <Feather
// //                           name="plus"
// //                           size={18}
// //                           color={Colors.universal.primary}
// //                         />
// //                       </TouchableOpacity>
// //                     )}
// //                     ListEmptyComponent={
// //                       !loading && searchQuery.length >= 2 ? (
// //                         <View style={styles.emptyState}>
// //                           <ThemedText style={styles.emptyText}>
// //                             {t("noSearchResults")}
// //                           </ThemedText>
// //                         </View>
// //                       ) : null
// //                     }
// //                   />
// //                 </View>
// //               )}

// //               {/* Text input */}
// //               <ThemedView style={styles.inputWrapper}>
// //                 <TextInput
// //                   ref={textInputRef}
// //                   style={[
// //                     styles.modalInput,
// //                     {
// //                       color: colorScheme === "dark" ? "#fff" : "#000",
// //                       textAlign: rtl ? "right" : "left",
// //                       backgroundColor: Colors[colorScheme].contrast,
// //                     },
// //                   ]}
// //                   value={newTodo}
// //                   onChangeText={handleTextChange}
// //                   onSelectionChange={handleSelectionChange}
// //                   placeholder={t("enterTodo")}
// //                   placeholderTextColor={
// //                     colorScheme === "dark" ? "#999" : "#999"
// //                   }
// //                   multiline
// //                   autoFocus={!searchExpanded}
// //                 />
// //               </ThemedView>

// //               {/* Hint text when links are added */}
// //               {internalUrls.length > 0 && (
// //                 <ThemedText style={styles.hintText}>
// //                   {t("linksAddedInline") ||
// //                     `${internalUrls.length} link(s) added to text`}
// //                 </ThemedText>
// //               )}

// //               {/* Buttons */}
// //               <View style={styles.modalButtonsContainer}>
// //                 <TouchableOpacity
// //                   style={[styles.modalButton, styles.cancelButton]}
// //                   onPress={handleClose}
// //                 >
// //                   <ThemedText style={styles.modalButtonText}>
// //                     {t("cancel")}
// //                   </ThemedText>
// //                 </TouchableOpacity>

// //                 <TouchableOpacity
// //                   style={[styles.modalButton, styles.addModalButton]}
// //                   onPress={handleAddPress}
// //                 >
// //                   <ThemedText
// //                     style={[styles.modalButtonText, { color: "#fff" }]}
// //                   >
// //                     {t("add")}
// //                   </ThemedText>
// //                 </TouchableOpacity>
// //               </View>
// //             </ThemedView>
// //           </View>
// //         </TouchableWithoutFeedback>
// //       </KeyboardAvoidingView>
// //     </Modal>
// //   );
// // };

// // /* ------------ styles ------------ */

// // const styles = StyleSheet.create({
// //   modalOverlay: {
// //     flex: 1,
// //     backgroundColor: "rgba(0,0,0,0.5)",
// //     justifyContent: "flex-end",
// //   },
// //   modalContent: {
// //     maxHeight: "85%",
// //     borderTopLeftRadius: 20,
// //     borderTopRightRadius: 20,
// //     padding: 20,
// //     overflow: "hidden",
// //   },
// //   modalHeader: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     marginBottom: 12,
// //   },
// //   modalTitle: {
// //     fontSize: 18,
// //     fontWeight: "600",
// //   },
// //   headerRight: {
// //     flex: 1,
// //     flexDirection: "row",
// //     justifyContent: "flex-end",
// //     alignItems: "center",
// //     marginLeft: 10,
// //     gap: 8,
// //   },
// //   iconButton: {
// //     padding: 4,
// //   },
// //   closeButton: {
// //     padding: 4,
// //   },

// //   // Minimal Search Overlay
// //   searchOverlay: {
// //     marginBottom: 12,
// //   },
// //   searchHeader: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     marginBottom: 16,
// //     gap: 12,
// //   },
// //   backButton: {
// //     padding: 4,
// //   },
// //   filterTabs: {
// //     flexDirection: "row",
// //     flex: 1,
// //     gap: 4,
// //   },
// //   filterTab: {
// //     flex: 1,
// //     paddingVertical: 8,
// //     alignItems: "center",
// //     borderBottomWidth: 2,
// //     borderBottomColor: "transparent",
// //   },
// //   filterTabText: {
// //     fontSize: 13,
// //     fontWeight: "500",
// //   },

// //   // Clean Search Input
// //   searchInputWrapper: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     paddingVertical: 12,
// //     paddingHorizontal: 4,
// //     marginBottom: 12,
// //     gap: 10,
// //     borderBottomWidth: 1,
// //   },
// //   searchInput: {
// //     flex: 1,
// //     fontSize: 15,
// //     padding: 0,
// //   },

// //   // Loading
// //   loadingWrapper: {
// //     paddingVertical: 12,
// //     alignItems: "center",
// //   },

// //   // Results
// //   resultsWrapper: {
// //     paddingVertical: 4,
// //   },
// //   resultItem: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     justifyContent: "space-between",
// //     paddingVertical: 12,
// //     paddingHorizontal: 4,
// //     gap: 12,
// //   },
// //   resultText: {
// //     flex: 1,
// //     gap: 4,
// //   },
// //   resultLabel: {
// //     fontSize: 15,
// //     lineHeight: 20,
// //   },
// //   resultMeta: {
// //     fontSize: 12,
// //     opacity: 0.8,
// //   },

// //   // Empty State
// //   emptyState: {
// //     paddingVertical: 32,
// //     alignItems: "center",
// //   },
// //   emptyText: {
// //     fontSize: 14,
// //     opacity: 0.5,
// //   },

// //   inputWrapper: {
// //     borderRadius: 10,
// //     marginBottom: 10,
// //   },
// //   modalInput: {
// //     borderRadius: 10,
// //     padding: 12,
// //     minHeight: 80,
// //     maxHeight: 200,
// //     fontSize: 16,
// //     marginBottom: 10,
// //   },

// //   hintText: {
// //     fontSize: 12,
// //     opacity: 0.6,
// //     marginBottom: 14,
// //     textAlign: "center",
// //   },

// //   modalButtonsContainer: {
// //     flexDirection: "row",
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
// //     backgroundColor: "rgba(160,160,160,0.15)",
// //   },
// //   addModalButton: {
// //     backgroundColor: "#4CAF50",
// //   },
// //   modalButtonText: {
// //     fontSize: 16,
// //     fontWeight: "600",
// //   },
// // });

// //! Last worked
// // export default AddTodoModal;
// import React, {
//   useEffect,
//   useState,
//   useMemo,
//   useRef,
//   useCallback,
// } from "react";
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
//   FlatList,
//   ActivityIndicator,
// } from "react-native";
// import { Feather, Ionicons } from "@expo/vector-icons";
// import { useTranslation } from "react-i18next";
// import { ThemedText } from "./ThemedText";
// import { ThemedView } from "./ThemedView";
// import { useLanguage } from "@/contexts/LanguageContext";
// import {
//   AddTodoModalType,
//   QuestionType,
//   PrayerWithCategory,
//   Language,
//   InternalLinkType,
//   SearchResult,
// } from "@/constants/Types";
// import { Colors } from "@/constants/Colors";
// import { searchQuestions, searchPrayers, searchQuranLabels } from "@/db/search";
// import { LoadingIndicator } from "./LoadingIndicator";
// import { useSafeAreaInsets } from "react-native-safe-area-context";

// type SearchFilter = "prayers" | "quran" | "questions";

// /** Encode as "type:identifier" for internal URLs. */
// const encodeInternalUrl = (
//   type: InternalLinkType,
//   identifier: string
// ): string => `${type}:${identifier}`;

// /* ------------ debounce helper with cleanup ------------ */

// type Debounced<F extends (...args: any[]) => void> = ((
//   ...args: Parameters<F>
// ) => void) & { cancel: () => void };

// const debounceFn = <F extends (...args: any[]) => void>(
//   fn: F,
//   delay: number
// ): Debounced<F> => {
//   let timeout: ReturnType<typeof setTimeout> | null = null;

//   const debounced = (...args: Parameters<F>) => {
//     if (timeout) clearTimeout(timeout);
//     timeout = setTimeout(() => {
//       fn(...args);
//     }, delay);
//   };

//   debounced.cancel = () => {
//     if (timeout) {
//       clearTimeout(timeout);
//       timeout = null;
//     }
//   };

//   return debounced as Debounced<F>;
// };

// export const AddTodoModal: React.FC<AddTodoModalType> = ({
//   visible,
//   onClose,
//   onAdd,
//   selectedDayName,
// }) => {
//   const [newTodo, setNewTodo] = useState("");
//   const [cursorPosition, setCursorPosition] = useState(0);
//   const [searchExpanded, setSearchExpanded] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [results, setResults] = useState<SearchResult[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [internalUrls, setInternalUrls] = useState<string[]>([]);
//   const [filter, setFilter] = useState<SearchFilter>("prayers");
//   const insets = useSafeAreaInsets();

//   const colorScheme = useColorScheme() || "light";
//   const { t } = useTranslation();
//   const { rtl, lang } = useLanguage();

//   // TextInput ref for managing focus
//   const textInputRef = useRef<TextInput>(null);
//   // used to ignore stale async responses
//   const requestIdRef = useRef(0);

//   /* ------------ helpers ------------ */

//   const resetState = () => {
//     setNewTodo("");
//     setCursorPosition(0);
//     setSearchExpanded(false);
//     setSearchQuery("");
//     setResults([]);
//     setInternalUrls([]);
//     setLoading(false);
//     setFilter("prayers");
//     requestIdRef.current = 0;
//   };

//   // Reset when modal opens
//   useEffect(() => {
//     if (visible) resetState();
//   }, [visible]);

//   const handleClose = () => {
//     resetState();
//     onClose();
//   };

//   const handleAddPress = () => {
//     const text = newTodo.trim();
//     if (!text && internalUrls.length === 0) return;
//     onAdd(text, internalUrls);
//     handleClose();
//   };

//   const handleOpenSearch = () => {
//     setSearchExpanded(true);
//     setSearchQuery("");
//     setResults([]);
//     setLoading(false);
//     setFilter("prayers");
//   };

//   const handleCloseSearch = () => {
//     setSearchExpanded(false);
//     setSearchQuery("");
//     setResults([]);
//     setLoading(false);
//     setFilter("prayers");
//     // Return focus to text input
//     textInputRef.current?.focus();
//   };

//   /* ------------ search (per filter) ------------ */

//   const runSearch = useCallback(
//     async (term: string) => {
//       const q = term.trim();
//       const currentId = ++requestIdRef.current;

//       if (q.length < 0) {
//         if (currentId === requestIdRef.current) {
//           setResults([]);
//           setLoading(false);
//         }
//         return;
//       }

//       setLoading(true);

//       try {
//         let merged: SearchResult[] = [];

//         if (filter === "questions") {
//           const res = await searchQuestions(lang, q, { limit: 12 });
//           if (currentId !== requestIdRef.current) return;

//           merged = (res.rows as QuestionType[]).map((qItem) => ({
//             id: `question-${qItem.id}`,
//             label: qItem.title,
//             type: "questionLink",
//             identifier: String(qItem.id),
//             meta: t("question") || "Question",
//           }));
//         } else if (filter === "prayers") {
//           const res = await searchPrayers(lang, q, { limit: 12 });
//           if (currentId !== requestIdRef.current) return;

//           merged = (res.rows as PrayerWithCategory[]).map((p) => ({
//             id: `prayer-${p.id}`,
//             label: p.name,
//             type: "prayerLink",
//             identifier: String(p.id),
//             meta: t("prayer") || "Prayer",
//           }));
//         } else if (filter === "quran") {
//           const res = await searchQuranLabels(lang as Language, q, {
//             limit: 20,
//           });
//           if (currentId !== requestIdRef.current) return;

//           merged = res.rows.map((sura) => ({
//             id: `quran-${sura.sura}`,
//             label: sura.label || `${t("quran") || "Qur'an"} ${sura.sura}`,
//             type: "quranLink",
//             identifier: sura.identifier, // "<sura>:1"
//             meta: `${t("quran") || "Qur'an"} ${sura.sura}`,
//           }));
//         }

//         setResults(merged);
//       } catch (error) {
//         if (currentId === requestIdRef.current) {
//           console.error("AddTodoModal search error:", error);
//           setResults([]);
//         }
//       } finally {
//         if (currentId === requestIdRef.current) {
//           setLoading(false);
//         }
//       }
//     },
//     [filter, lang, t]
//   );

//   const debouncedSearch = useMemo(
//     () => debounceFn((q: string) => runSearch(q), 250),
//     [runSearch]
//   );

//   // Re-run search when query, filter, or expanded state changes
//   useEffect(() => {
//     if (!searchExpanded) return;
//     debouncedSearch(searchQuery);
//   }, [searchQuery, searchExpanded, filter, debouncedSearch]);

//   // Cleanup pending timeout on unmount / re-create
//   useEffect(() => {
//     return () => {
//       debouncedSearch.cancel();
//     };
//   }, [debouncedSearch]);

//   /* ------------ add link inline at cursor position ------------ */

//   const handleSelectResult = (item: SearchResult) => {
//     const url = encodeInternalUrl(item.type, item.identifier);

//     // Add URL to array
//     setInternalUrls((prev) => [...prev, url]);

//     // Insert placeholder with actual name
//     const placeholder = `{{${item.label}}}`;
//     const before = newTodo.slice(0, cursorPosition);
//     const after = newTodo.slice(cursorPosition);
//     const newText = before + placeholder + after;

//     setNewTodo(newText);

//     // Update cursor position to after the placeholder
//     const newCursorPos = cursorPosition + placeholder.length;
//     setCursorPosition(newCursorPos);

//     handleCloseSearch();

//     // Set cursor position after state updates
//     setTimeout(() => {
//       textInputRef.current?.setNativeProps({
//         selection: { start: newCursorPos, end: newCursorPos },
//       });
//     }, 50);
//   };

//   /* ------------ handle text input changes ------------ */

//   const handleTextChange = (text: string) => {
//     setNewTodo(text);
//   };

//   const handleSelectionChange = (event: any) => {
//     const { start } = event.nativeEvent.selection;
//     setCursorPosition(start);
//   };

//   /* ------------ render ------------ */

//   return (
//     <Modal
//       visible={visible}
//       transparent
//       animationType="slide"
//       onRequestClose={handleClose}
//     >
//       <KeyboardAvoidingView
//         style={{ flex: 1 }}
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//       >
//         <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//           <View style={styles.modalOverlay}>
//             <ThemedView style={styles.modalContent}>
//               {/* Header */}
//               <View style={styles.modalHeader}>
//                 <ThemedText style={styles.modalTitle}>
//                   {t("addForDay")} {selectedDayName}
//                 </ThemedText>

//                 <View style={styles.headerRight}>
//                   <TouchableOpacity
//                     onPress={handleOpenSearch}
//                     style={styles.iconButton}
//                   >
//                     <Feather
//                       name="search"
//                       size={22}
//                       color={Colors[colorScheme].defaultIcon}
//                     />
//                   </TouchableOpacity>

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

//               {/* Minimal Search Overlay */}
//               {searchExpanded && (
//                 <View style={styles.searchOverlay}>
//                   {/* Simple Header */}
//                   <View style={styles.searchHeader}>
//                     <TouchableOpacity
//                       onPress={handleCloseSearch}
//                       style={styles.backButton}
//                     >
//                       <Ionicons
//                         name="arrow-back"
//                         size={22}
//                         color={Colors[colorScheme].defaultIcon}
//                       />
//                     </TouchableOpacity>

//                     {/* Clean Filter Tabs */}
//                     <View style={styles.filterTabs}>
//                       {(
//                         [
//                           { key: "prayers", label: t("tab_prayers") },
//                           { key: "quran", label: t("tab_quran") },
//                           { key: "questions", label: t("tab_questions") },
//                         ] as { key: SearchFilter; label: string }[]
//                       ).map((f) => {
//                         const active = f.key === filter;
//                         return (
//                           <TouchableOpacity
//                             key={f.key}
//                             onPress={() => setFilter(f.key)}
//                             style={[
//                               styles.filterTab,
//                               active && {
//                                 borderBottomColor: Colors.universal.primary,
//                               },
//                             ]}
//                           >
//                             <ThemedText
//                               style={[
//                                 styles.filterTabText,
//                                 {
//                                   color: active
//                                     ? Colors.universal.primary
//                                     : Colors[colorScheme].defaultIcon,
//                                   opacity: active ? 1 : 0.6,
//                                 },
//                               ]}
//                             >
//                               {f.label}
//                             </ThemedText>
//                           </TouchableOpacity>
//                         );
//                       })}
//                     </View>
//                   </View>

//                   {/* Clean Search Input */}
//                   <View
//                     style={[
//                       styles.searchInputWrapper,
//                       {
//                         borderBottomColor:
//                           searchQuery.length > 0
//                             ? Colors.universal.primary
//                             : colorScheme === "dark"
//                             ? "rgba(255,255,255,0.1)"
//                             : "rgba(0,0,0,0.1)",
//                       },
//                     ]}
//                   >
//                     <Feather
//                       name="search"
//                       size={18}
//                       color={Colors[colorScheme].defaultIcon}
//                       style={{ opacity: 0.4 }}
//                     />
//                     <TextInput
//                       placeholder={t("search")}
//                       placeholderTextColor={
//                         colorScheme === "dark" ? "#666" : "#999"
//                       }
//                       autoCapitalize="none"
//                       autoCorrect={false}
//                       autoFocus
//                       returnKeyType="search"
//                       value={searchQuery}
//                       onChangeText={setSearchQuery}
//                       style={[
//                         styles.searchInput,
//                         {
//                           color: Colors[colorScheme].defaultIcon,
//                           textAlign: rtl ? "right" : "left",
//                         },
//                       ]}
//                     />
//                     {searchQuery.length > 0 && (
//                       <TouchableOpacity onPress={() => setSearchQuery("")}>
//                         <Ionicons
//                           name="close-circle"
//                           size={18}
//                           color={Colors[colorScheme].defaultIcon}
//                           style={{ opacity: 0.4 }}
//                         />
//                       </TouchableOpacity>
//                     )}
//                   </View>

//                   {loading && (
//                     <View style={styles.loadingWrapper}>
//                       <LoadingIndicator size={"small"} />
//                     </View>
//                   )}

//                   {/* Clean Results List */}
//                   <FlatList
//                     data={results}
//                     keyExtractor={(item) => item.id}
//                     keyboardShouldPersistTaps="handled"
//                     contentContainerStyle={[styles.resultsWrapper]}
//                     renderItem={({ item }) => (
//                       <TouchableOpacity
//                         style={styles.resultItem}
//                         onPress={() => handleSelectResult(item)}
//                       >
//                         <View style={styles.resultText}>
//                           <ThemedText style={styles.resultLabel}>
//                             {item.label}
//                           </ThemedText>
//                           {item.meta && (
//                             <ThemedText
//                               style={[
//                                 styles.resultMeta,
//                                 { color: Colors.universal.primary },
//                               ]}
//                             >
//                               {item.meta}
//                             </ThemedText>
//                           )}
//                         </View>
//                         <Feather
//                           name="plus"
//                           size={18}
//                           color={Colors.universal.primary}
//                         />
//                       </TouchableOpacity>
//                     )}
//                     ListEmptyComponent={
//                       !loading && searchQuery.length > 0 ? (
//                         <View style={styles.emptyState}>
//                           <ThemedText style={styles.emptyText}>
//                             {t("noSearchResults")}
//                           </ThemedText>
//                         </View>
//                       ) : null
//                     }
//                   />
//                 </View>
//               )}

//               {/* Text input */}
//               <ThemedView style={styles.inputWrapper}>
//                 <TextInput
//                   ref={textInputRef}
//                   style={[
//                     styles.modalInput,
//                     {
//                       color: colorScheme === "dark" ? "#fff" : "#000",
//                       textAlign: rtl ? "right" : "left",
//                       backgroundColor: Colors[colorScheme].contrast,
//                     },
//                   ]}
//                   value={newTodo}
//                   onChangeText={handleTextChange}
//                   onSelectionChange={handleSelectionChange}
//                   placeholder={t("enterTodo")}
//                   placeholderTextColor={
//                     colorScheme === "dark" ? "#999" : "#999"
//                   }
//                   multiline
//                   autoFocus={!searchExpanded}
//                 />
//               </ThemedView>

//               {/* Hint text when links are added */}
//               {internalUrls.length > 0 && (
//                 <ThemedText style={styles.hintText}>
//                   {internalUrls.length}{" "}
//                   {internalUrls.length === 1
//                     ? t("link") || "link"
//                     : t("links") || "links"}{" "}
//                   {t("added") || "added"}
//                 </ThemedText>
//               )}

//               {/* Buttons */}
//               <View style={styles.modalButtonsContainer}>
//                 <TouchableOpacity
//                   style={[styles.modalButton, styles.cancelButton]}
//                   onPress={handleClose}
//                 >
//                   <ThemedText style={styles.modalButtonText}>
//                     {t("cancel")}
//                   </ThemedText>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   style={[styles.modalButton, styles.addModalButton]}
//                   onPress={handleAddPress}
//                 >
//                   <ThemedText
//                     style={[styles.modalButtonText, { color: "#fff" }]}
//                   >
//                     {t("add")}
//                   </ThemedText>
//                 </TouchableOpacity>
//               </View>
//             </ThemedView>
//           </View>
//         </TouchableWithoutFeedback>
//       </KeyboardAvoidingView>
//     </Modal>
//   );
// };

// /* ------------ styles ------------ */

// const styles = StyleSheet.create({
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     justifyContent: "flex-end",
//   },
//   modalContent: {
//     maxHeight: "85%",
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     padding: 20,
//     overflow: "hidden",
//   },
//   modalHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: "600",
//   },
//   headerRight: {
//     flex: 1,
//     flexDirection: "row",
//     justifyContent: "flex-end",
//     alignItems: "center",
//     marginLeft: 10,
//     gap: 8,
//   },
//   iconButton: {
//     padding: 4,
//   },
//   closeButton: {
//     padding: 4,
//   },

//   // Minimal Search Overlay
//   searchOverlay: {
//     marginBottom: 12,

//   },
//   searchHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 16,
//     gap: 12,
//   },
//   backButton: {
//     padding: 4,
//   },
//   filterTabs: {
//     flexDirection: "row",
//     flex: 1,
//     gap: 4,
//   },
//   filterTab: {
//     flex: 1,
//     paddingVertical: 8,
//     alignItems: "center",
//     borderBottomWidth: 2,
//     borderBottomColor: "transparent",
//   },
//   filterTabText: {
//     fontSize: 13,
//     fontWeight: "500",
//   },

//   // Clean Search Input
//   searchInputWrapper: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 12,
//     paddingHorizontal: 4,
//     marginBottom: 12,
//     gap: 10,
//     borderBottomWidth: 1,
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 15,
//     padding: 0,
//   },

//   // Loading
//   loadingWrapper: {
//     paddingVertical: 12,
//     alignItems: "center",
//   },

//   // Results
//   resultsWrapper: {
//     paddingVertical: 4,
//   },
//   resultItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingVertical: 12,
//     paddingHorizontal: 4,
//     gap: 12,
//   },
//   resultText: {
//     flex: 1,
//     gap: 4,
//   },
//   resultLabel: {
//     fontSize: 15,
//     lineHeight: 20,
//   },
//   resultMeta: {
//     fontSize: 12,
//     opacity: 0.8,
//   },

//   // Empty State
//   emptyState: {
//     paddingVertical: 32,
//     alignItems: "center",
//   },
//   emptyText: {
//     fontSize: 14,
//     opacity: 0.5,
//   },

//   inputWrapper: {
//     borderRadius: 10,
//     marginBottom: 10,
//   },
//   modalInput: {
//     borderRadius: 10,
//     padding: 12,
//     minHeight: 80,
//     maxHeight: 200,
//     fontSize: 16,
//     marginBottom: 10,
//   },

//   hintText: {
//     fontSize: 12,
//     opacity: 0.6,
//     marginBottom: 14,
//     textAlign: "center",
//   },

//   modalButtonsContainer: {
//     flexDirection: "row",
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
//     backgroundColor: "rgba(160,160,160,0.15)",
//   },
//   addModalButton: {
//     backgroundColor: "#4CAF50",
//   },
//   modalButtonText: {
//     fontSize: 16,
//     fontWeight: "600",
//   },
// });

// export default AddTodoModal;

//! Last worked
// export default AddTodoModal;
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
  Language,
  InternalLinkType,
  SearchResult,
} from "@/constants/Types";
import { Colors } from "@/constants/Colors";
import { searchQuestions, searchPrayers, searchQuranLabels } from "@/db/search";
import { LoadingIndicator } from "./LoadingIndicator";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type SearchFilter = "prayers" | "quran" | "questions";

/** Encode as "type:identifier" for internal URLs. */
const encodeInternalUrl = (
  type: InternalLinkType,
  identifier: string
): string => `${type}:${identifier}`;

/* ------------ debounce helper with cleanup ------------ */

type Debounced<F extends (...args: any[]) => void> = ((
  ...args: Parameters<F>
) => void) & { cancel: () => void };

const debounceFn = <F extends (...args: any[]) => void>(
  fn: F,
  delay: number
): Debounced<F> => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: Parameters<F>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn(...args);
    }, delay);
  };

  debounced.cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return debounced as Debounced<F>;
};

export const AddTodoModal: React.FC<AddTodoModalType> = ({
  visible,
  onClose,
  onAdd,
  selectedDayName,
}) => {
  const [newTodo, setNewTodo] = useState("");
  const [cursorPosition, setCursorPosition] = useState(0);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [internalUrls, setInternalUrls] = useState<string[]>([]);
  const [filter, setFilter] = useState<SearchFilter>("prayers");
  const insets = useSafeAreaInsets();

  const colorScheme = useColorScheme() || "light";
  const { t } = useTranslation();
  const { rtl, lang } = useLanguage();

  // TextInput ref for managing focus
  const textInputRef = useRef<TextInput>(null);
  // used to ignore stale async responses
  const requestIdRef = useRef(0);

  /* ------------ helpers ------------ */

  const resetState = () => {
    setNewTodo("");
    setCursorPosition(0);
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
    // Return focus to text input
    textInputRef.current?.focus();
  };

  /* ------------ search (per filter) ------------ */

  const runSearch = useCallback(
    async (term: string) => {
      const q = term.trim();
      const currentId = ++requestIdRef.current;

      if (q.length < 0) {
        if (currentId === requestIdRef.current) {
          setResults([]);
          setLoading(false);
        }
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
            identifier: String(qItem.id),
            meta: t("question") || "Question",
          }));
        } else if (filter === "prayers") {
          const res = await searchPrayers(lang, q, { limit: 12 });
          if (currentId !== requestIdRef.current) return;

          merged = (res.rows as PrayerWithCategory[]).map((p) => ({
            id: `prayer-${p.id}`,
            label: p.name,
            type: "prayerLink",
            identifier: String(p.id),
            meta: t("prayer") || "Prayer",
          }));
        } else if (filter === "quran") {
          const res = await searchQuranLabels(lang as Language, q, {
            limit: 20,
          });
          if (currentId !== requestIdRef.current) return;

          merged = res.rows.map((sura) => ({
            id: `quran-${sura.sura}`,
            label: sura.label || `${t("quran") || "Qur'an"} ${sura.sura}`,
            type: "quranLink",
            identifier: sura.identifier, // "<sura>:1"
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
    () => debounceFn((q: string) => runSearch(q), 250),
    [runSearch]
  );

  // Re-run search when query, filter, or expanded state changes
  useEffect(() => {
    if (!searchExpanded) return;
    debouncedSearch(searchQuery);
  }, [searchQuery, searchExpanded, filter, debouncedSearch]);

  // Cleanup pending timeout on unmount / re-create
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  /* ------------ add link inline at cursor position ------------ */

  const handleSelectResult = (item: SearchResult) => {
    const url = encodeInternalUrl(item.type, item.identifier);

    // Add URL to array
    setInternalUrls((prev) => [...prev, url]);

    // Insert placeholder with actual name
    const placeholder = `{{${item.label}}}`;
    const before = newTodo.slice(0, cursorPosition);
    const after = newTodo.slice(cursorPosition);
    const newText = before + placeholder + after;

    setNewTodo(newText);

    // Update cursor position to after the placeholder
    const newCursorPos = cursorPosition + placeholder.length;
    setCursorPosition(newCursorPos);

    handleCloseSearch();

    // Set cursor position after state updates
    setTimeout(() => {
      textInputRef.current?.setNativeProps({
        selection: { start: newCursorPos, end: newCursorPos },
      });
    }, 50);
  };

  /* ------------ handle text input changes ------------ */

  const handleTextChange = (text: string) => {
    setNewTodo(text);
  };

  const handleSelectionChange = (event: any) => {
    const { start } = event.nativeEvent.selection;
    setCursorPosition(start);
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

              {/* Minimal Search Overlay */}
              {searchExpanded && (
                <View style={styles.searchOverlay}>
                  {/* Simple Header */}
                  <View style={styles.searchHeader}>
                    <TouchableOpacity
                      onPress={handleCloseSearch}
                      style={styles.backButton}
                    >
                      <Ionicons
                        name="arrow-back"
                        size={22}
                        color={Colors[colorScheme].defaultIcon}
                      />
                    </TouchableOpacity>

                    {/* Clean Filter Tabs */}
                    <View style={styles.filterTabs}>
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
                              styles.filterTab,
                              active && {
                                borderBottomColor: Colors.universal.primary,
                              },
                            ]}
                          >
                            <ThemedText
                              style={[
                                styles.filterTabText,
                                {
                                  color: active
                                    ? Colors.universal.primary
                                    : Colors[colorScheme].defaultIcon,
                                  opacity: active ? 1 : 0.6,
                                },
                              ]}
                            >
                              {f.label}
                            </ThemedText>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>

                  {/* Clean Search Input */}
                  <View
                    style={[
                      styles.searchInputWrapper,
                      {
                        borderBottomColor:
                          searchQuery.length > 0
                            ? Colors.universal.primary
                            : colorScheme === "dark"
                            ? "rgba(255,255,255,0.1)"
                            : "rgba(0,0,0,0.1)",
                      },
                    ]}
                  >
                    <Feather
                      name="search"
                      size={18}
                      color={Colors[colorScheme].defaultIcon}
                      style={{ opacity: 0.4 }}
                    />
                    <TextInput
                      placeholder={t("search")}
                      placeholderTextColor={
                        colorScheme === "dark" ? "#666" : "#999"
                      }
                      autoCapitalize="none"
                      autoCorrect={false}
                      autoFocus
                      returnKeyType="search"
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      style={[
                        styles.searchInput,
                        {
                          color: Colors[colorScheme].defaultIcon,
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
                          style={{ opacity: 0.4 }}
                        />
                      </TouchableOpacity>
                    )}
                  </View>

                  {loading && (
                    <View style={styles.loadingWrapper}>
                      <LoadingIndicator size={"small"} />
                    </View>
                  )}

                  {/* Clean Results List */}

                  <FlatList
                    data={results}
                    keyExtractor={(item) => item.id}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={true}
                    nestedScrollEnabled={true} // Important for nested scrolling
                    contentContainerStyle={[styles.resultsWrapper]}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.resultItem}
                        onPress={() => handleSelectResult(item)}
                      >
                        <View style={styles.resultText}>
                          <ThemedText style={styles.resultLabel}>
                            {item.label}
                          </ThemedText>
                          {item.meta && (
                            <ThemedText
                              style={[
                                styles.resultMeta,
                                { color: Colors.universal.primary },
                              ]}
                            >
                              {item.meta}
                            </ThemedText>
                          )}
                        </View>
                        <Feather
                          name="plus"
                          size={18}
                          color={Colors.universal.primary}
                        />
                      </TouchableOpacity>
                    )}
                    ListEmptyComponent={
                      !loading && searchQuery.length > 0 ? (
                        <View style={styles.emptyState}>
                          <ThemedText style={styles.emptyText}>
                            {t("noSearchResults")}
                          </ThemedText>
                        </View>
                      ) : null
                    }
                  />
                </View>
              )}

              {/* Text input */}
              <ThemedView style={styles.inputWrapper}>
                <TextInput
                  ref={textInputRef}
                  style={[
                    styles.modalInput,
                    {
                      color: colorScheme === "dark" ? "#fff" : "#000",
                      textAlign: rtl ? "right" : "left",
                      backgroundColor: Colors[colorScheme].contrast,
                    },
                  ]}
                  value={newTodo}
                  onChangeText={handleTextChange}
                  onSelectionChange={handleSelectionChange}
                  placeholder={t("enterTodo")}
                  placeholderTextColor={
                    colorScheme === "dark" ? "#999" : "#999"
                  }
                  multiline
                  autoFocus={!searchExpanded}
                />
              </ThemedView>

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

  // Minimal Search Overlay
  searchOverlay: {
    marginBottom: 12,
    maxHeight: 500, // Fi
  },
  searchHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  filterTabs: {
    flexDirection: "row",
    flex: 1,
    gap: 4,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: "500",
  },

  // Clean Search Input
  searchInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 4,
    marginBottom: 12,
    gap: 10,
    borderBottomWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    padding: 0,
  },

  // Loading
  loadingWrapper: {
    paddingVertical: 12,
    alignItems: "center",
  },

  // Results
  resultsWrapper: {
    paddingVertical: 4,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 4,
    gap: 12,
  },
  resultText: {
    flex: 1,
    gap: 4,
  },
  resultLabel: {
    fontSize: 15,
    lineHeight: 20,
  },
  resultMeta: {
    fontSize: 12,
    opacity: 0.8,
  },

  // Empty State
  emptyState: {
    paddingVertical: 32,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    opacity: 0.5,
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
    marginBottom: 10,
  },

  hintText: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 14,
    textAlign: "center",
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
