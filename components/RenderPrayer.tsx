// //! Funktioniert
// import React, {
//   useState,
//   useEffect,
//   useMemo,
//   useRef,
//   useCallback,
// } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   useColorScheme,
//   Alert,
//   TextStyle,
//   NativeSyntheticEvent,
//   NativeScrollEvent,
//   Keyboard,
//   Animated,
// } from "react-native";
// import { getPrayerWithTranslations } from "@/db/queries/prayers";
// import { PrayerType, PrayerWithTranslationType } from "@/constants/Types";
// import { useLanguage } from "@/contexts/LanguageContext";
// import { ThemedView } from "./ThemedView";
// import { ThemedText } from "./ThemedText";
// import { Colors } from "@/constants/Colors";
// import AntDesign from "@expo/vector-icons/AntDesign";
// import Ionicons from "@expo/vector-icons/Ionicons";
// import Octicons from "@expo/vector-icons/Octicons";
// import Markdown, { RenderRules } from "react-native-markdown-display";
// import FontSizePickerModal from "./FontSizePickerModal";
// import { useFontSizeStore } from "@/stores/fontSizeStore";
// import FavoritePrayerPickerModal from "./FavoritePrayerPickerModal";
// import { LoadingIndicator } from "./LoadingIndicator";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import HeaderLeftBackButton from "./HeaderLeftBackButton";
// import { useTranslation } from "react-i18next";
// import ArrowUp from "./ArrowUp";
// import { FlatList } from "react-native-gesture-handler";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import PrayerInformationModal from "./PrayerInformationModal";
// import { useDataVersionStore } from "@/stores/dataVersionStore";
// import { StatusBar } from "expo-status-bar";
// import { useScreenFadeIn } from "@/hooks/useScreenFadeIn";
// import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";

// type PrayerWithTranslations = PrayerType & {
//   translations: PrayerWithTranslationType[];
// };

// const SCROLL_UP_THRESH = 120;
// const SCROLL_UP_HYST = 16;

// // 1) keep your factory
// const makeMarkdownRules = (
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
//   const [showLoadingSpinner, setShowLoadingSpinner] = useState(false);
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
//   const bottomSheetRef = useRef<BottomSheetMethods | null>(null);
//   const snapPoints = useMemo(() => ["70%"], []);
//   const { fontSize, lineHeight } = useFontSizeStore();
//   const [fontSizeModalVisible, setFontSizeModalVisible] = useState(false);
//   const [pickerVisible, setPickerVisible] = useState(false);
//   const insets = useSafeAreaInsets();
//   const [showScrollUp, setShowScrollUp] = useState(false);
//   const showUpRef = useRef(false);
//   const prayersVersion = useDataVersionStore((s) => s.prayersVersion);
//   const { fadeAnim, onLayout } = useScreenFadeIn(600);

//   const baseText = useMemo(
//     () =>
//       ({
//         color: Colors[colorScheme].text,
//         width: "90%",
//         alignSelf: "center",
//       } as const),
//     [colorScheme]
//   );

//   // 2) memoize rules once per font/theme
//   const mdRules = useMemo(
//     () => makeMarkdownRules(fontSize, Colors[colorScheme].text),
//     [fontSize, colorScheme]
//   );

//   // // 3) also memoize the style objects you pass to <Markdown>
//   // const mdStyleArabic = useMemo(
//   //   () => ({
//   //     body: {
//   //       ...baseText,
//   //       fontSize: fontSize * 1.3,
//   //       lineHeight,
//   //       color: Colors[colorScheme].prayerArabicText,
//   //       alignSelf: "flex-end",
//   //       marginBottom: 16,
//   //     },
//   //   }),
//   //   [fontSize, lineHeight, colorScheme]
//   // );

//   const mdStyleTranslit = useMemo(
//     () => ({
//       body: {
//         ...baseText,
//         fontSize,
//         lineHeight,
//         color: Colors[colorScheme].prayerTransliterationText,
//         fontStyle: "italic",
//         marginBottom: 16,
//         paddingBottom: 16,
//       },
//     }),
//     [fontSize, lineHeight, colorScheme, baseText]
//   );

//   const mdStyleTranslation = useMemo(
//     () => ({
//       body: {
//         ...baseText,
//         fontSize,
//         lineHeight,
//         marginTop: 4,
//         color: Colors[colorScheme].text,
//       },
//     }),
//     [fontSize, lineHeight, colorScheme, baseText]
//   );

//   const mdStyleNotes = useMemo(
//     () => ({
//       body: {
//         ...baseText,
//         fontSize,
//         lineHeight,
//         color: Colors[colorScheme].text,
//       },
//     }),
//     [fontSize, lineHeight, colorScheme, baseText]
//   );

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

//   useEffect(() => {
//     let alive = true;
//     let hasCompleted = false;

//     // Start the 300ms timer for the spinner
//     const timer = setTimeout(() => {
//       if (!alive || hasCompleted) return;
//       setShowLoadingSpinner(true);
//     }, 300);

//     (async () => {
//       try {
//         setIsLoading(true);

//         const data = await getPrayerWithTranslations(prayerID);
//         if (!alive) return;
//         setPrayer(data as PrayerWithTranslations);
//       } catch (e) {
//         console.error(e);
//       } finally {
//         // mark that the request is done (success or error)
//         hasCompleted = true;

//         if (!alive) return;
//         setIsLoading(false);
//         setShowLoadingSpinner(false);
//       }
//     })();

//     return () => {
//       alive = false;
//       clearTimeout(timer);
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
//       } catch (error) {
//         console.log(error);
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
//     if (lang === "ar") return prayer.arabic_notes || "";
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
//     [bookmark, prayerID, t]
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

//   if (showLoadingSpinner) {
//     return (
//       <ThemedView style={styles.loadingAndNoDataContainer}>
//         <LoadingIndicator size={"large"} />
//       </ThemedView>
//     );
//   }
//   if (!prayer && !isLoading) {
//     return (
//       <ThemedView style={styles.loadingAndNoDataContainer}>
//         <ThemedText>{t("noData")}</ThemedText>
//       </ThemedView>
//     );
//   }

//   return (
//     <Animated.View
//       onLayout={onLayout}
//       style={[
//         styles.container,
//         { backgroundColor: Colors[colorScheme].background, opacity: fadeAnim },
//       ]}
//     >
//       {/* Content */}
//       <FlatList
//         ref={flashListRef}
//         scrollEventThrottle={16}
//         onScroll={handleScroll}
//         keyExtractor={(i) => i.toString()}
//         data={indices}
//         stickyHeaderIndices={[0]}
//         stickyHeaderHiddenOnScroll
//         bounces={false}
//         overScrollMode="never"
//         alwaysBounceVertical={false}
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
//                 <Text
//                   style={{
//                     fontSize: fontSize * 1.3,
//                     lineHeight: lineHeight,
//                     color: Colors[colorScheme].prayerArabicText,
//                     alignSelf: "flex-end",
//                     marginBottom: 16,
//                   }}
//                 >
//                   {arabic.text}
//                 </Text>
//               )}

//               {/* Transliteration */}
//               {translit && (
//                 <Markdown rules={mdRules} style={mdStyleTranslit}>
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
//                   <Markdown rules={mdRules} style={mdStyleTranslation}>
//                     {tr.lines[index]?.text || ""}
//                   </Markdown>
//                 </View>
//               ))}
//             </View>
//           );
//         }}
//         ListFooterComponent={
//           notesForLang ? (
//             <Markdown rules={mdRules} style={mdStyleNotes}>
//               {notesForLang}
//             </Markdown>
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
//       <StatusBar style="light" />
//     </Animated.View>
//   );
// };

// export default RenderPrayer;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   loadingAndNoDataContainer: {
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
import { FlatList } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Markdown, { RenderRules } from "react-native-markdown-display";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import Octicons from "@expo/vector-icons/Octicons";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";

import { getPrayerWithTranslations } from "@/db/queries/prayers";
import { PrayerType, PrayerWithTranslationType } from "@/constants/Types";
import { useLanguage } from "@/contexts/LanguageContext";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { Colors } from "@/constants/Colors";
import FontSizePickerModal from "./FontSizePickerModal";
import { useFontSizeStore } from "@/stores/fontSizeStore";
import FavoritePrayerPickerModal from "./FavoritePrayerPickerModal";
import { LoadingIndicator } from "./LoadingIndicator";
import HeaderLeftBackButton from "./HeaderLeftBackButton";
import PrayerInformationModal from "./PrayerInformationModal";
import { useDataVersionStore } from "@/stores/dataVersionStore";
import { useScreenFadeIn } from "@/hooks/useScreenFadeIn";
import FloatingScrollButton from "./ArrowUp";

type PrayerWithTranslations = PrayerType & {
  translations: PrayerWithTranslationType[];
};

const SCROLL_UP_THRESH = 120;
const SCROLL_UP_HYST = 16;

const makeMarkdownRules = (
  customFontSize: number,
  textColor: string,
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
  const [bookmark, setBookmark] = useState<number | null>(null);

  const colorScheme = useColorScheme() || "light";
  const { t } = useTranslation();
  const { lang, rtl } = useLanguage();

  const listRef = useRef<any>(null);
  const bottomSheetRef = useRef<BottomSheetMethods | null>(null);
  const snapPoints = useMemo(() => ["70%"], []);

  const { fontSize, lineHeight } = useFontSizeStore();
  const [fontSizeModalVisible, setFontSizeModalVisible] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);
  const insets = useSafeAreaInsets();

  const [showScrollButton, setShowScrollButton] = useState(false);
  const showBtnRef = useRef(false);

  const prayersVersion = useDataVersionStore((s) => s.prayersVersion);
  const { fadeAnim, onLayout } = useScreenFadeIn(600);

  // ---- Scroll tracking (direction + edges + long-list bottom offset) ----
  const lastYRef = useRef(0);
  const currentOffsetRef = useRef(0);
  const contentHeightRef = useRef(0);
  const layoutHeightRef = useRef(0);

  const scrollDirRef = useRef<"up" | "down">("down");
  const [scrollDir, setScrollDir] = useState<"up" | "down">("down");

  // ✅ NEW: only show button while actively scrolling (same logic as SuraScreen)
  const [isScrolling, setIsScrolling] = useState(false);
  const isScrollingRef = useRef(false);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearIdle = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = null;
  }, []);

  const setScrolling = useCallback((v: boolean) => {
    isScrollingRef.current = v;
    setIsScrolling(v);
  }, []);

  const scheduleStopScrolling = useCallback(() => {
    clearIdle();
    idleTimerRef.current = setTimeout(() => setScrolling(false), 400);
  }, [clearIdle, setScrolling]);

  useEffect(() => {
    return () => clearIdle();
  }, [clearIdle]);

  const baseText = useMemo(
    () =>
      ({
        color: Colors[colorScheme].text,
        width: "90%",
        alignSelf: "center",
      }) as const,
    [colorScheme],
  );

  const mdRules = useMemo(
    () => makeMarkdownRules(fontSize, Colors[colorScheme].text),
    [fontSize, colorScheme],
  );

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
    [fontSize, lineHeight, colorScheme, baseText],
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
    [fontSize, lineHeight, colorScheme, baseText],
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
    [fontSize, lineHeight, colorScheme, baseText],
  );

  const listExtraData = useMemo(
    () => ({
      prayersVersion,
      bookmark,
      selectTranslationsKey: JSON.stringify(selectTranslations),
    }),
    [prayersVersion, bookmark, selectTranslations],
  );

  // Load prayer (+ delayed spinner)
  useEffect(() => {
    let alive = true;
    let done = false;

    const timer = setTimeout(() => {
      if (!alive || done) return;
      setShowLoadingSpinner(true);
    }, 300);

    (async () => {
      try {
        setIsLoading(true);
        const data = await getPrayerWithTranslations(prayerID);
        if (!alive) return;
        setPrayer(data as PrayerWithTranslations);
      } catch (e) {
        console.error(e);
      } finally {
        done = true;
        if (!alive) return;
        setIsLoading(false);
        setShowLoadingSpinner(false);
      }
    })();

    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [prayerID, prayersVersion]);

  // Init translation toggles
  useEffect(() => {
    if (!prayer) return;
    const initial: Record<string, boolean> = {};
    prayer.translations.forEach((tr) => {
      initial[tr.language_code] = tr.language_code === lang;
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
    const translations = prayer.translations.map((tr) => ({
      code: tr.language_code,
      lines: processLines(tr.translated_text),
    }));
    return { arabicLines, translitLines, translations };
  }, [prayer]);

  const indices = useMemo(() => {
    if (!formatted) return [];
    const max =
      Math.max(
        formatted.arabicLines.length,
        formatted.translitLines.length,
        ...formatted.translations.map((tr) => tr.lines.length),
      ) || 0;
    return Array.from({ length: max }, (_, i) => i);
  }, [formatted]);

  const notesForLang = useMemo(() => {
    if (!prayer) return "";
    if (lang === "ar") return prayer.arabic_notes || "";
    const tr = prayer.translations.find((x) => x.language_code === lang);
    return tr?.translated_notes || "";
  }, [prayer, lang]);

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
    [bookmark, prayerID, t],
  );

  const handleSheetChanges = useCallback((_index: number) => {
    /* no-op */
  }, []);

  const closeSheet = () => {
    Keyboard.dismiss();
    bottomSheetRef.current?.close();
  };

  // Keep maxOffset up to date even when content changes without scrolling
  const onContentSizeChange = useCallback((_w: number, h: number) => {
    contentHeightRef.current = h;
  }, []);

  const onListLayout = useCallback((e: any) => {
    layoutHeightRef.current = e.nativeEvent.layout.height;
  }, []);

  // Unified scroll handler:
  // - show/hide button with hysteresis
  // - detect direction
  // - force direction at edges (top => down, bottom => up)
  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const y = e.nativeEvent.contentOffset.y;
      const contentH = e.nativeEvent.contentSize.height;
      const layoutH = e.nativeEvent.layoutMeasurement.height;

      currentOffsetRef.current = y;
      contentHeightRef.current = contentH;
      layoutHeightRef.current = layoutH;

      // show button
      const nextShow = showBtnRef.current
        ? y > SCROLL_UP_THRESH - SCROLL_UP_HYST
        : y > SCROLL_UP_THRESH + SCROLL_UP_HYST;

      if (nextShow !== showBtnRef.current) {
        showBtnRef.current = nextShow;
        setShowScrollButton(nextShow);
      }

      // direction
      let nextDir = scrollDirRef.current;
      if (y > lastYRef.current + 2) nextDir = "down";
      else if (y < lastYRef.current - 2) nextDir = "up";

      const maxOffset = Math.max(0, contentH - layoutH);

      // force at edges so the button always makes sense
      if (y <= 2) nextDir = "down";
      if (y >= maxOffset - 2) nextDir = "up";

      if (nextDir !== scrollDirRef.current) {
        scrollDirRef.current = nextDir;
        setScrollDir(nextDir);
      }

      lastYRef.current = y;
    },
    [],
  );

  // Button press => jump to top/bottom (reliable for long lists)
  const scrollToEdge = useCallback(() => {
    const list = listRef.current;
    if (!list) return;

    if (scrollDirRef.current === "up") {
      list.scrollToOffset?.({ offset: 0, animated: true });
      return;
    }

    const contentH = contentHeightRef.current;
    const layoutH = layoutHeightRef.current;
    const maxOffset = Math.max(0, contentH - layoutH);

    // try native first
    list.scrollToEnd?.({ animated: true });

    // fallback force offset (works even when scrollToEnd is flaky)
    setTimeout(() => {
      list.scrollToOffset?.({ offset: maxOffset, animated: true });
    }, 0);
  }, []);

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
      <FlatList
        ref={listRef}
        scrollEventThrottle={16}
        onScroll={handleScroll}
        onContentSizeChange={onContentSizeChange}
        onLayout={onListLayout}
        keyExtractor={(i) => i.toString()}
        data={indices}
        stickyHeaderIndices={[0]}
        stickyHeaderHiddenOnScroll
        bounces={false}
        overScrollMode="never"
        alwaysBounceVertical={false}
        extraData={listExtraData}
        // ✅ NEW: active scrolling tracking (same logic as SuraScreen)
        onScrollBeginDrag={() => {
          clearIdle();
          setScrolling(true);
        }}
        onScrollEndDrag={() => {
          scheduleStopScrolling();
        }}
        onMomentumScrollBegin={() => {
          clearIdle();
          setScrolling(true);
        }}
        onMomentumScrollEnd={() => {
          scheduleStopScrolling();
        }}
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
            <View style={styles.headerContent}>
              <HeaderLeftBackButton color="#fff" style={{ marginLeft: 5 }} />

              <View style={{ paddingHorizontal: 20 }}>
                <View style={styles.titleContainer}>
                  <ThemedText
                    style={[styles.title, { fontSize, color: "#fff" }]}
                  >
                    {prayer?.name} ({indices.length} {t("lines")})
                  </ThemedText>
                  <ThemedText
                    style={[
                      styles.arabicTitle,
                      { fontSize, color: "#fff", textAlign: "right" },
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

            <View style={styles.languageSelectContainer}>
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
                      style={[styles.languageButtonText, { color: "#000" }]}
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
            (tr) => selectTranslations[tr.code],
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
                hasNote && { backgroundColor: Colors.universal.primary },
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

              {arabic && (
                <Text
                  style={{
                    fontSize: fontSize * 1.3,
                    lineHeight,
                    color: Colors[colorScheme].prayerArabicText,
                    alignSelf: "flex-end",
                    marginBottom: 16,
                  }}
                >
                  {arabic.text}
                </Text>
              )}

              {translit && (
                <Markdown rules={mdRules} style={mdStyleTranslit}>
                  {translit.text}
                </Markdown>
              )}

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

      {/* ✅ Always mounted so it keeps drag position */}
      <FloatingScrollButton
        visible={showScrollButton && isScrolling}
        direction={scrollDir}
        onPress={scrollToEdge}
      />

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
  container: { flex: 1 },
  loadingAndNoDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: { padding: 10 },
  headerContent: {
    flexDirection: "column",
    gap: 10,
  },
  titleContainer: { gap: 10 },
  title: {
    fontWeight: "700",
    marginBottom: 4,
    lineHeight: 35,
  },
  arabicTitle: { fontSize: 18 },
  headerControls: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    gap: 15,
    marginRight: 15,
    marginTop: 20,
  },
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
});
