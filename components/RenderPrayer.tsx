// //! Funktioniert
// import React, {
//   useState,
//   useLayoutEffect,
//   useEffect,
//   useMemo,
//   useRef,
//   useCallback,
// } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ActivityIndicator,
//   StyleSheet,
//   Platform,
//   ScrollView,
//   useColorScheme,
//   Alert,
//   TextStyle,
//   NativeSyntheticEvent,
//   NativeScrollEvent,
//   Keyboard,
// } from "react-native";
// import { getPrayerWithTranslations } from "@/db/queries/prayers";
// import {
//   LanguageCode,
//   PrayerType,
//   PrayerWithTranslationType,
// } from "@/constants/Types";
// import { useLanguage } from "@/contexts/LanguageContext";
// import { ThemedView } from "./ThemedView";
// import { ThemedText } from "./ThemedText";
// import { Colors } from "@/constants/Colors";
// import AntDesign from "@expo/vector-icons/AntDesign";
// import Ionicons from "@expo/vector-icons/Ionicons";
// import Octicons from "@expo/vector-icons/Octicons";
// import Markdown, { RenderRules } from "react-native-markdown-display";
// import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
// import { FlashList } from "@shopify/flash-list";
// import { Stack } from "expo-router";
// import FontSizePickerModal from "./FontSizePickerModal";
// import { useFontSizeStore } from "@/stores/fontSizeStore";
// import FavoritePrayerPickerModal from "./FavoritePrayerPickerModal";
// import { LoadingIndicator } from "./LoadingIndicator";
// import {
//   SafeAreaView,
//   useSafeAreaInsets,
// } from "react-native-safe-area-context";
// import HeaderLeftBackButton from "./HeaderLeftBackButton";
// import { useTranslation } from "react-i18next";
// import ArrowUp from "./ArrowUp";
// import { FlatList } from "react-native-gesture-handler";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import PrayerInformationModal from "./PrayerInformationModal";
// import { useDataVersionStore } from "@/stores/dataVersionStore";

// type PrayerWithTranslations = PrayerType & {
//   translations: PrayerWithTranslationType[];
// };

// const SCROLL_UP_THRESH = 120;
// const SCROLL_UP_HYST = 16;

// //! With key which seems to be wrong
// // const markdownRules = (
// //   customFontSize: number,
// //   textColor: string,
// //   index: number
// // ): RenderRules => ({
// //   code_inline: (_node, _children, _parent, styles) => (
// //     <Text
// //       key={index}
// //       style={{
// //         fontSize: customFontSize,
// //         ...(styles.text as TextStyle),
// //         color: textColor,
// //       }}
// //     >
// //       {_node.content}
// //     </Text>
// //   ),
// // });

// //! Without
// const markdownRules = (
//   customFontSize: number,
//   textColor: string
// ): RenderRules => ({
//   code_inline: (_node, _children, _parent, styles) => (
//     <Text
//       style={{
//         fontSize: customFontSize,
//         ...(styles.text as TextStyle),
//         color: textColor,
//       }}
//     >
//       {_node.content}
//     </Text>
//   ),
// });

// const RenderPrayer = ({ prayerID }: { prayerID: number }) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [prayer, setPrayer] = useState<PrayerWithTranslations | null>(null);
//   const [selectTranslations, setSelectTranslations] = useState<
//     Record<string, boolean>
//   >({});
//   // Removed isFavorite state
//   const [bookmark, setBookmark] = useState<number | null>(null);
//   // Removed pickerVisible state

//   const colorScheme = useColorScheme() || "light";
//   const { t } = useTranslation();
//   const { lang, rtl } = useLanguage();
//   const flashListRef = useRef<any>(null);
//   const bottomSheetRef = useRef<BottomSheet>(null);
//   const snapPoints = useMemo(() => ["70%"], []);
//   const { fontSize, lineHeight } = useFontSizeStore();
//   const [fontSizeModalVisible, setFontSizeModalVisible] = useState(false);
//   const [pickerVisible, setPickerVisible] = useState(false);
//   const insets = useSafeAreaInsets();
//   const [showScrollUp, setShowScrollUp] = useState(false);
//   const showUpRef = useRef(false);
//   const prayersVersion = useDataVersionStore((s) => s.prayersVersion);

//   const listExtraData = useMemo(
//     () => ({
//       prayersVersion,
//       bookmark,
//       // stringify because the object identity of selectTranslations changes;
//       // this only changes when its contents change
//       selectTranslationsKey: JSON.stringify(selectTranslations),
//     }),
//     [prayersVersion, bookmark, selectTranslations]
//   );

//   // Fetch prayer on mount (removed favorite check)
//   useEffect(() => {
//     let alive = true;
//     (async () => {
//       try {
//         setIsLoading(true);
//         const data = await getPrayerWithTranslations(prayerID);
//         if (alive) setPrayer(data as PrayerWithTranslations);
//       } catch (e) {
//         console.error(e);
//       } finally {
//         if (alive) setIsLoading(false);
//       }
//     })();
//     return () => {
//       alive = false;
//     };
//   }, [prayerID, prayersVersion]);

//   // Init translation toggles
//   useEffect(() => {
//     if (!prayer) return;
//     const initial: Record<string, boolean> = {};
//     prayer.translations.forEach((t) => {
//       initial[t.language_code] = t.language_code === lang;
//     });
//     setSelectTranslations(initial);
//   }, [prayer, lang]);

//   // Load bookmark
//   useEffect(() => {
//     let canceled = false;
//     (async () => {
//       try {
//         const raw = await AsyncStorage.getItem(`Bookmark-${prayerID}`);
//         if (canceled) return;

//         const n = raw != null ? Number.parseInt(raw, 10) : NaN;
//         setBookmark(Number.isFinite(n) ? n : null);
//       } catch (e) {
//         if (!canceled) setBookmark(null);
//       }
//     })();

//     return () => {
//       canceled = true;
//     };
//   }, [prayerID, prayersVersion]);

//   const processLines = (text?: string) =>
//     text
//       ? text
//           .split("\n")
//           .filter((l) => l.trim())
//           .map((l) => ({
//             text: l.replace(/@/g, "").trim(),
//             hasAt: l.includes("@"),
//           }))
//       : [];

//   const formatted = useMemo(() => {
//     if (!prayer) return null;
//     const arabicLines = processLines(prayer.arabic_text);
//     const translitLines = processLines(prayer.transliteration_text);
//     const translations = prayer.translations.map((t) => ({
//       code: t.language_code,
//       lines: processLines(t.translated_text),
//     }));
//     return { arabicLines, translitLines, translations };
//   }, [prayer]);

//   const indices = useMemo(() => {
//     if (!formatted) return [];
//     const max =
//       Math.max(
//         formatted.arabicLines.length,
//         formatted.translitLines.length,
//         ...formatted.translations.map((tr) => tr.lines.length)
//       ) || 0;
//     return Array.from({ length: max }, (_, i) => i);
//   }, [formatted]);

//   const notesForLang = useMemo(() => {
//     if (!prayer) return "";
//     if (lang == "ar") return prayer.arabic_notes || "";
//     const tr = prayer.translations.find((t) => t.language_code === lang);
//     return tr?.translated_notes || "";
//   }, [prayer, lang]);

//   const scrollToTop = useCallback(() => {
//     flashListRef.current?.scrollToOffset({ offset: 0, animated: true });
//   }, []);

//   const handleBookmark = useCallback(
//     (index: number) => {
//       if (bookmark === index) {
//         AsyncStorage.removeItem(`Bookmark-${prayerID}`);
//         setBookmark(null);
//       } else if (bookmark) {
//         Alert.alert(t("confirmBookmarkChange"), t("bookmarkReplaceQuestion"), [
//           {
//             text: t("replace"),
//             onPress: () => {
//               AsyncStorage.setItem(`Bookmark-${prayerID}`, String(index));
//               setBookmark(index);
//             },
//           },
//           { text: t("cancel"), style: "cancel" },
//         ]);
//       } else {
//         AsyncStorage.setItem(`Bookmark-${prayerID}`, String(index));
//         setBookmark(index);
//       }
//     },
//     [bookmark, prayerID, lang]
//   );

//   const handleSheetChanges = useCallback((index: number) => {
//     /* no-op */
//   }, []);

//   const handleScroll = useCallback(
//     (e: NativeSyntheticEvent<NativeScrollEvent>) => {
//       const y = e.nativeEvent.contentOffset.y;
//       // Hysteresis avoids flicker near the boundary
//       const next = showUpRef.current
//         ? y > SCROLL_UP_THRESH - SCROLL_UP_HYST
//         : y > SCROLL_UP_THRESH + SCROLL_UP_HYST;
//       if (next !== showUpRef.current) {
//         showUpRef.current = next;
//         setShowScrollUp(next);
//       }
//     },
//     []
//   );

//   const closeSheet = () => {
//     Keyboard.dismiss();
//     bottomSheetRef.current?.close();
//   };

//   if (isLoading) {
//     return (
//       <ThemedView style={styles.loadingContainer}>
//         <LoadingIndicator size={"large"} />
//       </ThemedView>
//     );
//   }
//   if (!prayer && !isLoading) {
//     return (
//       <ThemedView style={styles.container}>
//         <ThemedText>{t("noData")}</ThemedText>
//       </ThemedView>
//     );
//   }

//   return (
//     <ThemedView style={[styles.container]}>
//       {/* Content */}
//       <FlatList
//         ref={flashListRef}
//         scrollEventThrottle={16}
//         onScroll={handleScroll}
//         keyExtractor={(i) => i.toString()}
//         data={indices}
//         stickyHeaderIndices={[0]}
//         stickyHeaderHiddenOnScroll
//         extraData={listExtraData}
//         ListHeaderComponent={
//           <View
//             style={[
//               styles.header,
//               {
//                 backgroundColor: Colors[colorScheme].prayerHeaderBackground,
//                 paddingTop: insets.top,
//                 paddingRight: insets.right,
//                 paddingLeft: insets.left,
//                 marginBottom: 20,
//               },
//             ]}
//           >
//             <View style={[styles.headerContent]}>
//               <HeaderLeftBackButton color="#fff" style={{ marginLeft: 5 }} />

//               <View style={{ paddingHorizontal: 20 }}>
//                 <View style={[styles.titleContainer]}>
//                   <ThemedText
//                     style={[
//                       styles.title,
//                       { fontSize: fontSize, color: "#fff" },
//                     ]}
//                   >
//                     {prayer?.name} ({indices.length} {t("lines")})
//                   </ThemedText>
//                   <ThemedText
//                     style={[
//                       styles.arabicTitle,
//                       { fontSize: fontSize, color: "#fff", textAlign: "right" },
//                     ]}
//                   >
//                     {prayer?.arabic_title}
//                   </ThemedText>
//                 </View>
//               </View>
//               <View style={styles.headerControls}>
//                 <TouchableOpacity onPress={() => setFontSizeModalVisible(true)}>
//                   <Ionicons name="text" size={28} color="#fff" />
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   onPress={() => bottomSheetRef.current?.expand()}
//                 >
//                   <Ionicons
//                     name="information-circle-outline"
//                     size={32}
//                     color="#fff"
//                   />
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={() => setPickerVisible(true)}>
//                   <AntDesign name="folder-add" size={25} color="#fff" />
//                 </TouchableOpacity>
//               </View>
//             </View>

//             {/* Language Toggle */}
//             <View style={[styles.languageSelectContainer, {}]}>
//               <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//                 {prayer?.translations.map((tr) => (
//                   <TouchableOpacity
//                     key={tr.language_code}
//                     style={[
//                       styles.languageButton,
//                       selectTranslations[tr.language_code]
//                         ? {
//                             backgroundColor:
//                               Colors[colorScheme].prayerButtonBackgroundActive,
//                           }
//                         : {
//                             backgroundColor:
//                               colorScheme === "dark"
//                                 ? "rgba(96, 96, 96, 0.2)"
//                                 : "rgba(0, 0, 0, 0.05)",
//                           },
//                     ]}
//                     onPress={() =>
//                       setSelectTranslations((prev) => ({
//                         ...prev,
//                         [tr.language_code]: !prev[tr.language_code],
//                       }))
//                     }
//                   >
//                     <Text
//                       style={[
//                         styles.languageButtonText,

//                         {
//                           color: "#000",
//                         },
//                       ]}
//                     >
//                       {tr.language_code.toUpperCase()}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </ScrollView>
//             </View>
//           </View>
//         }
//         renderItem={({ item: index }) => {
//           const arabic = formatted?.arabicLines[index];
//           const translit = formatted?.translitLines[index];
//           const activeTranslations = formatted?.translations.filter(
//             (tr) => selectTranslations[tr.code]
//           );
//           const hasNote =
//             arabic?.hasAt ||
//             activeTranslations?.some((tr) => tr.lines[index]?.hasAt);
//           return (
//             <View
//               key={index}
//               style={[
//                 styles.prayerSegment,
//                 { backgroundColor: Colors[colorScheme].contrast },
//                 hasNote && {
//                   backgroundColor: Colors.universal.primary,
//                 },
//                 bookmark === index + 1 && {
//                   backgroundColor: Colors[colorScheme].prayerBookmark,
//                 },
//               ]}
//             >
//               <View
//                 style={[
//                   styles.lineNumberBadge,
//                   rtl ? { left: 16 } : { right: 16 },
//                 ]}
//               >
//                 <Text style={styles.lineNumber}>{index + 1}</Text>
//               </View>

//               {/* Bookmark Icon */}
//               {bookmark === index + 1 ? (
//                 <Octicons
//                   name="bookmark-slash"
//                   size={20}
//                   color={Colors[colorScheme].defaultIcon}
//                   onPress={() => handleBookmark(index + 1)}
//                   style={
//                     rtl
//                       ? { alignSelf: "flex-end" }
//                       : { alignSelf: "flex-start" }
//                   }
//                 />
//               ) : (
//                 <Octicons
//                   name="bookmark"
//                   size={20}
//                   color={Colors[colorScheme].defaultIcon}
//                   onPress={() => handleBookmark(index + 1)}
//                   style={
//                     rtl
//                       ? { alignSelf: "flex-end" }
//                       : { alignSelf: "flex-start" }
//                   }
//                 />
//               )}

//               {/* Arabic */}
//               {arabic && (
//                 <Markdown
//                   rules={markdownRules(fontSize, Colors[colorScheme].text)}
//                   style={{
//                     body: {
//                       fontSize: fontSize * 1.3,
//                       lineHeight: lineHeight,
//                       color: Colors[colorScheme].prayerArabicText,
//                       alignSelf: "flex-end",
//                       marginBottom: 16,
//                     },
//                   }}
//                 >
//                   {arabic.text}
//                 </Markdown>
//               )}

//               {/* Transliteration */}
//               {translit && (
//                 <Markdown
//                   rules={markdownRules(fontSize, Colors[colorScheme].text)}
//                   style={{
//                     body: {
//                       fontSize: fontSize,
//                       lineHeight: lineHeight,
//                       color: Colors[colorScheme].prayerTransliterationText,
//                       fontStyle: "italic",
//                       marginBottom: 16,
//                       paddingBottom: 16,
//                     },
//                   }}
//                 >
//                   {translit.text}
//                 </Markdown>
//               )}

//               {/* Selected Translations */}
//               {activeTranslations?.map((tr) => (
//                 <View key={tr.code} style={styles.translationBlock}>
//                   <Text
//                     style={[
//                       styles.translationLabel,
//                       { color: Colors[colorScheme].prayerButtonText },
//                     ]}
//                   >
//                     {tr.code.toUpperCase()}
//                   </Text>
//                   <Markdown
//                     rules={markdownRules(fontSize, Colors[colorScheme].text)}
//                     style={{
//                       body: {
//                         fontSize,
//                         lineHeight,
//                         marginTop: 4,
//                         color: Colors[colorScheme].text,
//                       },
//                     }}
//                   >
//                     {tr.lines[index]?.text || ""}
//                   </Markdown>
//                 </View>
//               ))}
//             </View>
//           );
//         }}
//         ListFooterComponent={
//           notesForLang ? (
//             <View
//               style={[
//                 styles.notesContainer,
//                 styles.prayerSegment,
//                 { backgroundColor: Colors.universal.primary },
//               ]}
//             >
//               <ThemedText style={styles.notesTitle} type="subtitle">
//                 {t("notes")}
//               </ThemedText>
//               <Markdown
//                 rules={markdownRules(fontSize, Colors[colorScheme].text)}
//                 style={{
//                   body: {
//                     fontSize: fontSize,
//                     lineHeight: lineHeight,
//                     color: Colors[colorScheme].text,
//                   },
//                 }}
//               >
//                 {notesForLang}
//               </Markdown>
//             </View>
//           ) : null
//         }
//         ListFooterComponentStyle={{ paddingBottom: 20 }}
//       />

//       {showScrollUp && <ArrowUp scrollToTop={scrollToTop} />}

//       <PrayerInformationModal
//         ref={bottomSheetRef}
//         prayer={prayer}
//         language={lang}
//         rtl={rtl}
//         colorScheme={colorScheme}
//         fontSize={fontSize}
//         lineHeight={lineHeight}
//         snapPoints={snapPoints}
//         onChange={handleSheetChanges}
//         onRequestClose={closeSheet}
//       />

//       <FontSizePickerModal
//         visible={fontSizeModalVisible}
//         onClose={() => setFontSizeModalVisible(false)}
//       />

//       <FavoritePrayerPickerModal
//         visible={pickerVisible}
//         prayerId={prayerID}
//         onClose={() => setPickerVisible(false)}
//       />
//     </ThemedView>
//   );
// };

// export default RenderPrayer;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   header: {
//     padding: 10,
//   },
//   headerContent: {
//     flexDirection: "column",
//     gap: 10,
//   },
//   titleContainer: {
//     gap: 10,
//   },
//   title: {
//     fontWeight: "700",
//     marginBottom: 4,
//     lineHeight: 35,
//   },
//   arabicTitle: {
//     fontSize: 18,
//   },
//   headerControls: {
//     flexDirection: "row",
//     alignItems: "center",
//     alignSelf: "flex-end",
//     gap: 15,
//     marginRight: 15,
//     marginTop: 20,
//   },
//   prayerInformationContainer: {},

//   languageSelectContainer: {
//     paddingHorizontal: 16,
//     marginTop: 10,
//     marginBottom: 10,
//   },

//   languageButton: {
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 20,
//     marginRight: 8,
//     borderWidth: 1,
//   },
//   languageButtonText: { fontSize: 14, fontWeight: "500" },
//   prayerSegment: {
//     marginHorizontal: 10,
//     marginBottom: 16,
//     borderRadius: 12,
//     padding: 15,
//   },
//   lineNumberBadge: {
//     position: "absolute",
//     top: -8,
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     backgroundColor: Colors.universal.primary,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   lineNumber: { fontSize: 12, fontWeight: "700" },
//   translationBlock: {
//     marginTop: 12,
//     paddingTop: 8,
//     borderTopWidth: StyleSheet.hairlineWidth,
//   },
//   translationLabel: { fontSize: 12, fontWeight: "700" },
//   notesContainer: {},
//   notesTitle: {},
//   notesText: {},
//   bottomSheet: {
//     alignItems: "center",
//     gap: 10,
//     padding: 20,
//     justifyContent: "center",
//   }, // Added padding and centering
//   bottomSheetText: { fontSize: 20, fontWeight: "500", textAlign: "center" },
//   scrollButton: {
//     position: "absolute",
//     bottom: 30,
//     right: 20,
//     backgroundColor: "#3498db", // Consider using Colors constant
//     padding: 10,
//     borderRadius: 25,
//     elevation: 5, // Added elevation for Android
//     shadowColor: "#000", // Added shadow for iOS
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 3,
//   },
// });

//! Funktioniert
import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  useColorScheme,
  Alert,
  TextStyle,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Keyboard,
  Animated,
} from "react-native";
import { getPrayerWithTranslations } from "@/db/queries/prayers";
import { PrayerType, PrayerWithTranslationType } from "@/constants/Types";
import { useLanguage } from "@/contexts/LanguageContext";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { Colors } from "@/constants/Colors";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import Octicons from "@expo/vector-icons/Octicons";
import Markdown, { RenderRules } from "react-native-markdown-display";
import FontSizePickerModal from "./FontSizePickerModal";
import { useFontSizeStore } from "@/stores/fontSizeStore";
import FavoritePrayerPickerModal from "./FavoritePrayerPickerModal";
import { LoadingIndicator } from "./LoadingIndicator";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HeaderLeftBackButton from "./HeaderLeftBackButton";
import { useTranslation } from "react-i18next";
import ArrowUp from "./ArrowUp";
import { FlatList } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PrayerInformationModal from "./PrayerInformationModal";
import { useDataVersionStore } from "@/stores/dataVersionStore";
import { StatusBar } from "expo-status-bar";
import { useScreenFadeIn } from "@/hooks/useScreenFadeIn";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";

type PrayerWithTranslations = PrayerType & {
  translations: PrayerWithTranslationType[];
};

const SCROLL_UP_THRESH = 120;
const SCROLL_UP_HYST = 16;

//! With key which seems to be wrong
// const markdownRules = (
//   customFontSize: number,
//   textColor: string,
//   index: number
// ): RenderRules => ({
//   code_inline: (_node, _children, _parent, styles) => (
//     <Text
//       key={index}
//       style={{
//         fontSize: customFontSize,
//         ...(styles.text as TextStyle),
//         color: textColor,
//       }}
//     >
//       {_node.content}
//     </Text>
//   ),
// });

//! Without
// 1) keep your factory
const makeMarkdownRules = (
  customFontSize: number,
  textColor: string
): RenderRules => ({
  code_inline: (_node, _children, _parent, styles) => (
    <Text
      style={{
        fontSize: customFontSize,
        ...(styles.text as TextStyle),
        color: textColor,
      }}
    >
      {_node.content}
    </Text>
  ),
});

const RenderPrayer = ({ prayerID }: { prayerID: number }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showLoadingSpinner, setShowLoadingSpinner] = useState(false);
  const [prayer, setPrayer] = useState<PrayerWithTranslations | null>(null);
  const [selectTranslations, setSelectTranslations] = useState<
    Record<string, boolean>
  >({});
  // Removed isFavorite state
  const [bookmark, setBookmark] = useState<number | null>(null);
  // Removed pickerVisible state

  const colorScheme = useColorScheme() || "light";
  const { t } = useTranslation();
  const { lang, rtl } = useLanguage();
  const flashListRef = useRef<any>(null);
  const bottomSheetRef = useRef<BottomSheetMethods | null>(null);
  const snapPoints = useMemo(() => ["70%"], []);
  const { fontSize, lineHeight } = useFontSizeStore();
  const [fontSizeModalVisible, setFontSizeModalVisible] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const [showScrollUp, setShowScrollUp] = useState(false);
  const showUpRef = useRef(false);
  const prayersVersion = useDataVersionStore((s) => s.prayersVersion);
  const { fadeAnim, onLayout } = useScreenFadeIn(600);

  const baseText = useMemo(
    () =>
      ({
        color: Colors[colorScheme].text,
        width: "90%",
        alignSelf: "center",
      } as const),
    [colorScheme]
  );

  // 2) memoize rules once per font/theme
  const mdRules = useMemo(
    () => makeMarkdownRules(fontSize, Colors[colorScheme].text),
    [fontSize, colorScheme]
  );

  // // 3) also memoize the style objects you pass to <Markdown>
  // const mdStyleArabic = useMemo(
  //   () => ({
  //     body: {
  //       ...baseText,
  //       fontSize: fontSize * 1.3,
  //       lineHeight,
  //       color: Colors[colorScheme].prayerArabicText,
  //       alignSelf: "flex-end",
  //       marginBottom: 16,
  //     },
  //   }),
  //   [fontSize, lineHeight, colorScheme]
  // );

  const mdStyleTranslit = useMemo(
    () => ({
      body: {
        ...baseText,
        fontSize,
        lineHeight,
        color: Colors[colorScheme].prayerTransliterationText,
        fontStyle: "italic",
        marginBottom: 16,
        paddingBottom: 16,
      },
    }),
    [fontSize, lineHeight, colorScheme, baseText]
  );

  const mdStyleTranslation = useMemo(
    () => ({
      body: {
        ...baseText,
        fontSize,
        lineHeight,
        marginTop: 4,
        color: Colors[colorScheme].text,
      },
    }),
    [fontSize, lineHeight, colorScheme, baseText]
  );

  const mdStyleNotes = useMemo(
    () => ({
      body: {
        ...baseText,
        fontSize,
        lineHeight,
        color: Colors[colorScheme].text,
      },
    }),
    [fontSize, lineHeight, colorScheme, baseText]
  );

  const listExtraData = useMemo(
    () => ({
      prayersVersion,
      bookmark,
      // stringify because the object identity of selectTranslations changes;
      // this only changes when its contents change
      selectTranslationsKey: JSON.stringify(selectTranslations),
    }),
    [prayersVersion, bookmark, selectTranslations]
  );

  // Fetch prayer on mount
  // useEffect(() => {
  //   let alive = true;
  //   (async () => {
  //     try {
  //       setIsLoading(true);
  //       const data = await getPrayerWithTranslations(prayerID);
  //       if (alive) setPrayer(data as PrayerWithTranslations);
  //     } catch (e) {
  //       console.error(e);
  //     } finally {
  //       if (alive) setIsLoading(false);
  //     }
  //   })();
  //   return () => {
  //     alive = false;
  //   };
  // }, [prayerID, prayersVersion]);

  useEffect(() => {
    let alive = true;
    let loadingTimer: number | undefined;

    (async () => {
      try {
        setIsLoading(true);

        loadingTimer = setTimeout(() => {
          if (alive && isLoading) setShowLoadingSpinner(true);
        }, 300);

        const data = await getPrayerWithTranslations(prayerID);
        if (alive) setPrayer(data as PrayerWithTranslations);
      } catch (e) {
        console.error(e);
      } finally {
        if (loadingTimer !== undefined) clearTimeout(loadingTimer);
        if (alive) {
          setIsLoading(false);
          setShowLoadingSpinner(false);
        }
      }
    })();

    return () => {
      alive = false;
      if (loadingTimer !== undefined) clearTimeout(loadingTimer);
    };
  }, [prayerID, prayersVersion, isLoading]);

  // Init translation toggles
  useEffect(() => {
    if (!prayer) return;
    const initial: Record<string, boolean> = {};
    prayer.translations.forEach((t) => {
      initial[t.language_code] = t.language_code === lang;
    });
    setSelectTranslations(initial);
  }, [prayer, lang]);

  // Load bookmark
  useEffect(() => {
    let canceled = false;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(`Bookmark-${prayerID}`);
        if (canceled) return;

        const n = raw != null ? Number.parseInt(raw, 10) : NaN;
        setBookmark(Number.isFinite(n) ? n : null);
      } catch (error) {
        console.log(error);
        if (!canceled) setBookmark(null);
      }
    })();

    return () => {
      canceled = true;
    };
  }, [prayerID, prayersVersion]);

  const processLines = (text?: string) =>
    text
      ? text
          .split("\n")
          .filter((l) => l.trim())
          .map((l) => ({
            text: l.replace(/@/g, "").trim(),
            hasAt: l.includes("@"),
          }))
      : [];

  const formatted = useMemo(() => {
    if (!prayer) return null;
    const arabicLines = processLines(prayer.arabic_text);
    const translitLines = processLines(prayer.transliteration_text);
    const translations = prayer.translations.map((t) => ({
      code: t.language_code,
      lines: processLines(t.translated_text),
    }));
    return { arabicLines, translitLines, translations };
  }, [prayer]);

  const indices = useMemo(() => {
    if (!formatted) return [];
    const max =
      Math.max(
        formatted.arabicLines.length,
        formatted.translitLines.length,
        ...formatted.translations.map((tr) => tr.lines.length)
      ) || 0;
    return Array.from({ length: max }, (_, i) => i);
  }, [formatted]);

  const notesForLang = useMemo(() => {
    if (!prayer) return "";
    if (lang === "ar") return prayer.arabic_notes || "";
    const tr = prayer.translations.find((t) => t.language_code === lang);
    return tr?.translated_notes || "";
  }, [prayer, lang]);

  const scrollToTop = useCallback(() => {
    flashListRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, []);

  const handleBookmark = useCallback(
    (index: number) => {
      if (bookmark === index) {
        AsyncStorage.removeItem(`Bookmark-${prayerID}`);
        setBookmark(null);
      } else if (bookmark) {
        Alert.alert(t("confirmBookmarkChange"), t("bookmarkReplaceQuestion"), [
          {
            text: t("replace"),
            onPress: () => {
              AsyncStorage.setItem(`Bookmark-${prayerID}`, String(index));
              setBookmark(index);
            },
          },
          { text: t("cancel"), style: "cancel" },
        ]);
      } else {
        AsyncStorage.setItem(`Bookmark-${prayerID}`, String(index));
        setBookmark(index);
      }
    },
    [bookmark, prayerID, t]
  );

  const handleSheetChanges = useCallback((index: number) => {
    /* no-op */
  }, []);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const y = e.nativeEvent.contentOffset.y;
      // Hysteresis avoids flicker near the boundary
      const next = showUpRef.current
        ? y > SCROLL_UP_THRESH - SCROLL_UP_HYST
        : y > SCROLL_UP_THRESH + SCROLL_UP_HYST;
      if (next !== showUpRef.current) {
        showUpRef.current = next;
        setShowScrollUp(next);
      }
    },
    []
  );

  const closeSheet = () => {
    Keyboard.dismiss();
    bottomSheetRef.current?.close();
  };

  if (showLoadingSpinner) {
    return (
      <ThemedView style={styles.loadingAndNoDataContainer}>
        <LoadingIndicator size={"large"} />
      </ThemedView>
    );
  }
  if (!prayer && !isLoading) {
    return (
      <ThemedView style={styles.loadingAndNoDataContainer}>
        <ThemedText>{t("noData")}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <Animated.View
      onLayout={onLayout}
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme].background, opacity: fadeAnim },
      ]}
    >
      {/* Content */}
      <FlatList
        ref={flashListRef}
        scrollEventThrottle={16}
        onScroll={handleScroll}
        keyExtractor={(i) => i.toString()}
        data={indices}
        stickyHeaderIndices={[0]}
        stickyHeaderHiddenOnScroll
        bounces={false}
        overScrollMode="never"
        alwaysBounceVertical={false}
        extraData={listExtraData}
        ListHeaderComponent={
          <View
            style={[
              styles.header,
              {
                backgroundColor: Colors[colorScheme].prayerHeaderBackground,
                paddingTop: insets.top,
                paddingRight: insets.right,
                paddingLeft: insets.left,
                marginBottom: 20,
              },
            ]}
          >
            <View style={[styles.headerContent]}>
              <HeaderLeftBackButton color="#fff" style={{ marginLeft: 5 }} />

              <View style={{ paddingHorizontal: 20 }}>
                <View style={[styles.titleContainer]}>
                  <ThemedText
                    style={[
                      styles.title,
                      { fontSize: fontSize, color: "#fff" },
                    ]}
                  >
                    {prayer?.name} ({indices.length} {t("lines")})
                  </ThemedText>
                  <ThemedText
                    style={[
                      styles.arabicTitle,
                      { fontSize: fontSize, color: "#fff", textAlign: "right" },
                    ]}
                  >
                    {prayer?.arabic_title}
                  </ThemedText>
                </View>
              </View>
              <View style={styles.headerControls}>
                <TouchableOpacity onPress={() => setFontSizeModalVisible(true)}>
                  <Ionicons name="text" size={28} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => bottomSheetRef.current?.expand()}
                >
                  <Ionicons
                    name="information-circle-outline"
                    size={32}
                    color="#fff"
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setPickerVisible(true)}>
                  <AntDesign name="folder-add" size={25} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Language Toggle */}
            <View style={[styles.languageSelectContainer, {}]}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {prayer?.translations.map((tr) => (
                  <TouchableOpacity
                    key={tr.language_code}
                    style={[
                      styles.languageButton,
                      selectTranslations[tr.language_code]
                        ? {
                            backgroundColor:
                              Colors[colorScheme].prayerButtonBackgroundActive,
                          }
                        : {
                            backgroundColor:
                              colorScheme === "dark"
                                ? "rgba(96, 96, 96, 0.2)"
                                : "rgba(0, 0, 0, 0.05)",
                          },
                    ]}
                    onPress={() =>
                      setSelectTranslations((prev) => ({
                        ...prev,
                        [tr.language_code]: !prev[tr.language_code],
                      }))
                    }
                  >
                    <Text
                      style={[
                        styles.languageButtonText,

                        {
                          color: "#000",
                        },
                      ]}
                    >
                      {tr.language_code.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        }
        renderItem={({ item: index }) => {
          const arabic = formatted?.arabicLines[index];
          const translit = formatted?.translitLines[index];
          const activeTranslations = formatted?.translations.filter(
            (tr) => selectTranslations[tr.code]
          );
          const hasNote =
            arabic?.hasAt ||
            activeTranslations?.some((tr) => tr.lines[index]?.hasAt);
          return (
            <View
              key={index}
              style={[
                styles.prayerSegment,
                { backgroundColor: Colors[colorScheme].contrast },
                hasNote && {
                  backgroundColor: Colors.universal.primary,
                },
                bookmark === index + 1 && {
                  backgroundColor: Colors[colorScheme].prayerBookmark,
                },
              ]}
            >
              <View
                style={[
                  styles.lineNumberBadge,
                  rtl ? { left: 16 } : { right: 16 },
                ]}
              >
                <Text style={styles.lineNumber}>{index + 1}</Text>
              </View>

              {/* Bookmark Icon */}
              {bookmark === index + 1 ? (
                <Octicons
                  name="bookmark-slash"
                  size={20}
                  color={Colors[colorScheme].defaultIcon}
                  onPress={() => handleBookmark(index + 1)}
                  style={
                    rtl
                      ? { alignSelf: "flex-end" }
                      : { alignSelf: "flex-start" }
                  }
                />
              ) : (
                <Octicons
                  name="bookmark"
                  size={20}
                  color={Colors[colorScheme].defaultIcon}
                  onPress={() => handleBookmark(index + 1)}
                  style={
                    rtl
                      ? { alignSelf: "flex-end" }
                      : { alignSelf: "flex-start" }
                  }
                />
              )}

              {/* Arabic */}
              {arabic && (
                <Text
                  style={{
                    fontSize: fontSize * 1.3,
                    lineHeight: lineHeight,
                    color: Colors[colorScheme].prayerArabicText,
                    alignSelf: "flex-end",
                    marginBottom: 16,
                  }}
                >
                  {arabic.text}
                </Text>
              )}

              {/* Transliteration */}
              {translit && (
                <Markdown rules={mdRules} style={mdStyleTranslit}>
                  {translit.text}
                </Markdown>
              )}

              {/* Selected Translations */}
              {activeTranslations?.map((tr) => (
                <View key={tr.code} style={styles.translationBlock}>
                  <Text
                    style={[
                      styles.translationLabel,
                      { color: Colors[colorScheme].prayerButtonText },
                    ]}
                  >
                    {tr.code.toUpperCase()}
                  </Text>
                  <Markdown rules={mdRules} style={mdStyleTranslation}>
                    {tr.lines[index]?.text || ""}
                  </Markdown>
                </View>
              ))}
            </View>
          );
        }}
        ListFooterComponent={
          notesForLang ? (
            <Markdown rules={mdRules} style={mdStyleNotes}>
              {notesForLang}
            </Markdown>
          ) : null
        }
        ListFooterComponentStyle={{ paddingBottom: 20 }}
      />

      {showScrollUp && <ArrowUp scrollToTop={scrollToTop} />}

      <PrayerInformationModal
        ref={bottomSheetRef}
        prayer={prayer}
        language={lang}
        rtl={rtl}
        colorScheme={colorScheme}
        fontSize={fontSize}
        lineHeight={lineHeight}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        onRequestClose={closeSheet}
      />

      <FontSizePickerModal
        visible={fontSizeModalVisible}
        onClose={() => setFontSizeModalVisible(false)}
      />

      <FavoritePrayerPickerModal
        visible={pickerVisible}
        prayerId={prayerID}
        onClose={() => setPickerVisible(false)}
      />
      <StatusBar style="light" />
    </Animated.View>
  );
};

export default RenderPrayer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingAndNoDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    padding: 10,
  },
  headerContent: {
    flexDirection: "column",
    gap: 10,
  },
  titleContainer: {
    gap: 10,
  },
  title: {
    fontWeight: "700",
    marginBottom: 4,
    lineHeight: 35,
  },
  arabicTitle: {
    fontSize: 18,
  },
  headerControls: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    gap: 15,
    marginRight: 15,
    marginTop: 20,
  },
  prayerInformationContainer: {},

  languageSelectContainer: {
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 10,
  },

  languageButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  languageButtonText: { fontSize: 14, fontWeight: "500" },
  prayerSegment: {
    marginHorizontal: 10,
    marginBottom: 16,
    borderRadius: 12,
    padding: 15,
  },
  lineNumberBadge: {
    position: "absolute",
    top: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.universal.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  lineNumber: { fontSize: 12, fontWeight: "700" },
  translationBlock: {
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  translationLabel: { fontSize: 12, fontWeight: "700" },
  notesContainer: {},
  notesTitle: {},
  notesText: {},
  bottomSheet: {
    alignItems: "center",
    gap: 10,
    padding: 20,
    justifyContent: "center",
  }, // Added padding and centering
  bottomSheetText: { fontSize: 20, fontWeight: "500", textAlign: "center" },
  scrollButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#3498db", // Consider using Colors constant
    padding: 10,
    borderRadius: 25,
    elevation: 5, // Added elevation for Android
    shadowColor: "#000", // Added shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});
