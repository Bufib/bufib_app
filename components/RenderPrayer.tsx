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
//   const [isLoading, setIsLoading] = useState(true);
//   const [prayer, setPrayer] = useState<PrayerWithTranslations | null>(null);
//   const [selectTranslations, setSelectTranslations] = useState<
//     Record<string, boolean>
//   >({});
//   // Removed isFavorite state
//   const [bookmark, setBookmark] = useState<number | null>(null);
//   // Removed pickerVisible state

//   const colorScheme = useColorScheme() || "light";
//   const { t } = useTranslation();
//   const { language, isArabic } = useLanguage();
//   const lang = (language ?? "de") as LanguageCode;
//   const flashListRef = useRef<any>(null);
//   const bottomSheetRef = useRef<BottomSheet>(null);
//   const snapPoints = useMemo(() => ["70%"], []);
//   const { fontSize, lineHeight } = useFontSizeStore();
//   const [fontSizeModalVisible, setFontSizeModalVisible] = useState(false);
//   const [pickerVisible, setPickerVisible] = useState(false);
//   const insets = useSafeAreaInsets();
//   const [showScrollUp, setShowScrollUp] = useState(false);
//   const showUpRef = useRef(false);

//   const rtl = isArabic();
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
//   }, [prayerID]);

//   // Init translation toggles
//   useEffect(() => {
//     if (!prayer) return;
//     const initial: Record<string, boolean> = {};
//     prayer.translations.forEach((t) => {
//       initial[t.language_code] = t.language_code === language;
//     });
//     setSelectTranslations(initial);
//   }, [prayer, t]);

//   // Load bookmark
//   useEffect(() => {
//     try {
//       const b = AsyncStorage.getItem(`Bookmark-${prayerID}`);
//       setBookmark(b ? parseInt(b, 10) : null);
//     } catch {
//       setBookmark(null);
//     }
//   }, [prayerID]);

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
//     if (language == "ar") return prayer.arabic_notes || "";
//     const tr = prayer.translations.find((t) => t.language_code === language);
//     return tr?.translated_notes || "";
//   }, [prayer, t]);

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

//   if (isLoading) {
//     return (
//       <ThemedView style={styles.loadingContainer}>
//         <LoadingIndicator size={"large"} />
//       </ThemedView>
//     );
//   }
//   if (!prayer) {
//     return (
//       <ThemedView style={styles.container}>
//         <ThemedText>{t("noData")}</ThemedText>
//       </ThemedView>
//     );
//   }

//   return (
//     <ThemedView style={[styles.container]}>

//       <View
//         style={{
//           height: insets.top,
//           backgroundColor: Colors[colorScheme].prayerHeaderBackground,
//         }}
//       />
//       {/* Header Buttons */}

//       <ThemedView
//         style={[
//           styles.header,
//           {
//             backgroundColor: Colors[colorScheme].prayerHeaderBackground,
//           },
//         ]}
//       >
//         <View style={[styles.headerContent]}>
//           <View style={{ flexDirection: "row", gap: 10, paddingRight: 30 }}>
//             <HeaderLeftBackButton color="#fff" style={{}} />

//             <View style={[styles.titleContainer]}>
//               <ThemedText
//                 style={[styles.title, { fontSize: fontSize, color: "#fff" }]}
//               >
//                 {prayer.name} ({indices.length} {t("lines")})
//               </ThemedText>
//               <ThemedText
//                 style={[
//                   styles.arabicTitle,
//                   { fontSize: fontSize, color: "#fff" },
//                 ]}
//               >
//                 {prayer.arabic_title}
//               </ThemedText>
//             </View>
//           </View>
//           <View style={styles.headerControls}>
//             <TouchableOpacity onPress={() => setFontSizeModalVisible(true)}>
//               <Ionicons name="text" size={28} color="#fff" />
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => bottomSheetRef.current?.expand()}>
//               <Ionicons
//                 name="information-circle-outline"
//                 size={32}
//                 color="#fff"
//               />
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => setPickerVisible(true)}>
//               <AntDesign name="folder-add" size={25} color="#fff" />
//             </TouchableOpacity>
//           </View>
//         </View>
//       </ThemedView>

//       {/* Content */}
//       <FlatList
//         ref={flashListRef}
//         scrollEventThrottle={16}
//         onScroll={handleScroll}
//         keyExtractor={(i) => i.toString()}
//         data={indices}
//         extraData={[bookmark, selectTranslations]}
//         ListHeaderComponent={
//           <>
//             {prayer.translations.find((t) => t.language_code === language)
//               ?.translated_introduction && (
//               <View
//                 style={[
//                   styles.introContainer,
//                   {
//                     backgroundColor:
//                       Colors[colorScheme].prayerIntroductionBackground,
//                   },
//                 ]}
//               >
//                 <Markdown
//                   style={{
//                     body: {
//                       fontSize: fontSize,
//                       lineHeight: lineHeight,
//                       color: Colors[colorScheme].text,
//                     },
//                   }}
//                 >
//                   {
//                     prayer.translations.find(
//                       (t) => t.language_code === language
//                     )?.translated_introduction
//                   }
//                 </Markdown>
//               </View>
//             )}

//             {/* Language Toggle */}
//             <View style={styles.languageSelectContainer}>
//               <ScrollView
//                 horizontal
//                 showsHorizontalScrollIndicator={false}
//                 contentContainerStyle={styles.languageButtons}
//               >
//                 {prayer.translations.map((tr) => (
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
//                         selectTranslations[tr.language_code]
//                           ? {
//                               color: Colors[colorScheme].prayerButtonTextActive,
//                             }
//                           : { color: Colors[colorScheme].text },
//                       ]}
//                     >
//                       {tr.language_code.toUpperCase()}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </ScrollView>
//             </View>
//           </>
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

//       <BottomSheet
//         ref={bottomSheetRef}
//         index={-1}
//         snapPoints={snapPoints}
//         enablePanDownToClose
//         onChange={handleSheetChanges}
//         backgroundStyle={{ backgroundColor: Colors.universal.secondary }}
//       >
//         <BottomSheetView
//           style={[
//             styles.bottomSheet,
//             rtl
//               ? {
//                   flexDirection: "row-reverse",
//                 }
//               : {
//                   flexDirection: "row",
//                 },
//           ]}
//         >
//           <Text
//             style={[
//               styles.bottomSheetText,
//               { fontSize: 35, color: Colors[colorScheme].text },
//             ]}
//           >
//             `
//           </Text>
//           <ThemedText style={styles.bottomSheetText}>
//             {t("bottomInformationRenderPrayer")}
//           </ThemedText>
//           <Text style={[styles.bottomSheetText, { color: "#FFFFFF" }]}>ع</Text>
//           <Text style={[styles.bottomSheetText, { color: "#FFFFFF" }]}>
//             (ayn)
//           </Text>
//         </BottomSheetView>
//       </BottomSheet>

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
//     marginBottom: 20,
//   },
//   headerContent: {
//     flexDirection: "column",
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
//   },
//   introContainer: {
//     margin: 16,
//     padding: 16,
//     borderRadius: 12,
//   },
//   languageSelectContainer: {
//     paddingHorizontal: 16,
//     marginBottom: 16,
//   },
//   languageButtons: {
//     paddingBottom: 8,
//     paddingRight: 16,
//   },
//   languageButton: {
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 20,
//     marginRight: 8,
//   },
//   languageButtonText: { fontSize: 14, fontWeight: "500" },
//   prayerSegment: {
//     marginHorizontal: 10,
//     marginBottom: 16,
//     borderRadius: 12,
//     padding: 15,
//     ...Platform.select({
//       ios: {
//         shadowColor: "#000",
//         shadowOffset: { width: 0, height: 1 },
//         shadowOpacity: 0.1,
//         shadowRadius: 2,
//       },
//       android: {
//         elevation: 2,
//       },
//     }),
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
  useLayoutEffect,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Platform,
  ScrollView,
  useColorScheme,
  Alert,
  TextStyle,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Keyboard,
} from "react-native";
import { getPrayerWithTranslations } from "@/db/queries/prayers";
import {
  LanguageCode,
  PrayerType,
  PrayerWithTranslationType,
} from "@/constants/Types";
import { useLanguage } from "@/contexts/LanguageContext";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { Colors } from "@/constants/Colors";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import Octicons from "@expo/vector-icons/Octicons";
import Markdown, { RenderRules } from "react-native-markdown-display";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { FlashList } from "@shopify/flash-list";
import { Stack } from "expo-router";
import FontSizePickerModal from "./FontSizePickerModal";
import { useFontSizeStore } from "@/stores/fontSizeStore";
import FavoritePrayerPickerModal from "./FavoritePrayerPickerModal";
import { LoadingIndicator } from "./LoadingIndicator";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import HeaderLeftBackButton from "./HeaderLeftBackButton";
import { useTranslation } from "react-i18next";
import ArrowUp from "./ArrowUp";
import { FlatList } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PrayerInformationModal from "./PrayerInformationModal";

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
const markdownRules = (
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
  const [isLoading, setIsLoading] = useState(true);
  const [prayer, setPrayer] = useState<PrayerWithTranslations | null>(null);
  const [selectTranslations, setSelectTranslations] = useState<
    Record<string, boolean>
  >({});
  // Removed isFavorite state
  const [bookmark, setBookmark] = useState<number | null>(null);
  // Removed pickerVisible state

  const colorScheme = useColorScheme() || "light";
  const { t } = useTranslation();
  const { language, isArabic } = useLanguage();
  const lang = (language ?? "de") as LanguageCode;
  const flashListRef = useRef<any>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["70%"], []);
  const { fontSize, lineHeight } = useFontSizeStore();
  const [fontSizeModalVisible, setFontSizeModalVisible] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const [showScrollUp, setShowScrollUp] = useState(false);
  const showUpRef = useRef(false);

  const rtl = isArabic();
  // Fetch prayer on mount (removed favorite check)
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setIsLoading(true);
        const data = await getPrayerWithTranslations(prayerID);
        if (alive) setPrayer(data as PrayerWithTranslations);
      } catch (e) {
        console.error(e);
      } finally {
        if (alive) setIsLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [prayerID]);

  // Init translation toggles
  useEffect(() => {
    if (!prayer) return;
    const initial: Record<string, boolean> = {};
    prayer.translations.forEach((t) => {
      initial[t.language_code] = t.language_code === language;
    });
    setSelectTranslations(initial);
  }, [prayer, t]);

  // Load bookmark
  useEffect(() => {
    let canceled = false;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(`Bookmark-${prayerID}`);
        if (canceled) return;

        const n = raw != null ? Number.parseInt(raw, 10) : NaN;
        setBookmark(Number.isFinite(n) ? n : null);
      } catch (e) {
        if (!canceled) setBookmark(null);
      }
    })();

    return () => {
      canceled = true;
    };
  }, [prayerID]);

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
    if (language == "ar") return prayer.arabic_notes || "";
    const tr = prayer.translations.find((t) => t.language_code === language);
    return tr?.translated_notes || "";
  }, [prayer, t]);

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

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <LoadingIndicator size={"large"} />
      </ThemedView>
    );
  }
  if (!prayer) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>{t("noData")}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container]}>
      {/* Content */}
      <FlatList
        ref={flashListRef}
        scrollEventThrottle={16}
        onScroll={handleScroll}
        keyExtractor={(i) => i.toString()}
        data={indices}
        stickyHeaderIndices={[0]}
        stickyHeaderHiddenOnScroll
        extraData={[bookmark, selectTranslations]}
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
                    {prayer.name} ({indices.length} {t("lines")})
                  </ThemedText>
                  <ThemedText
                    style={[
                      styles.arabicTitle,
                      { fontSize: fontSize, color: "#fff", textAlign: "right" },
                    ]}
                  >
                    {prayer.arabic_title}
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
                {prayer.translations.map((tr) => (
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
                <Markdown
                  rules={markdownRules(fontSize, Colors[colorScheme].text)}
                  style={{
                    body: {
                      fontSize: fontSize * 1.3,
                      lineHeight: lineHeight,
                      color: Colors[colorScheme].prayerArabicText,
                      alignSelf: "flex-end",
                      marginBottom: 16,
                    },
                  }}
                >
                  {arabic.text}
                </Markdown>
              )}

              {/* Transliteration */}
              {translit && (
                <Markdown
                  rules={markdownRules(fontSize, Colors[colorScheme].text)}
                  style={{
                    body: {
                      fontSize: fontSize,
                      lineHeight: lineHeight,
                      color: Colors[colorScheme].prayerTransliterationText,
                      fontStyle: "italic",
                      marginBottom: 16,
                      paddingBottom: 16,
                    },
                  }}
                >
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
                  <Markdown
                    rules={markdownRules(fontSize, Colors[colorScheme].text)}
                    style={{
                      body: {
                        fontSize,
                        lineHeight,
                        marginTop: 4,
                        color: Colors[colorScheme].text,
                      },
                    }}
                  >
                    {tr.lines[index]?.text || ""}
                  </Markdown>
                </View>
              ))}
            </View>
          );
        }}
        ListFooterComponent={
          notesForLang ? (
            <View
              style={[
                styles.notesContainer,
                styles.prayerSegment,
                { backgroundColor: Colors.universal.primary },
              ]}
            >
              <ThemedText style={styles.notesTitle} type="subtitle">
                {t("notes")}
              </ThemedText>
              <Markdown
                rules={markdownRules(fontSize, Colors[colorScheme].text)}
                style={{
                  body: {
                    fontSize: fontSize,
                    lineHeight: lineHeight,
                    color: Colors[colorScheme].text,
                  },
                }}
              >
                {notesForLang}
              </Markdown>
            </View>
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
    </ThemedView>
  );
};

export default RenderPrayer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
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
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
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
