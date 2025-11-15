// // // app/(pdfs)/pdf-viewer.tsx
// // import React, { useEffect, useState } from "react";
// // import {
// //   ActivityIndicator,
// //   Dimensions,
// //   StyleSheet,
// //   Text,
// //   View,
// // } from "react-native";
// // import Pdf from "react-native-pdf";
// // import { useLocalSearchParams } from "expo-router";
// // import { usePdfs } from "@/hooks/usePdfs";
// // import { useLanguage } from "@/contexts/LanguageContext";

// // const PdfViewerScreen = () => {
// //   const { filename } = useLocalSearchParams<{
// //     filename?: string;
// //   }>();

// //   const { rtl, lang } = useLanguage();
// //   const { getCachedUri, download } = usePdfs(lang);

// //   const [sourceUri, setSourceUri] = useState<string | null>(null);
// //   const [loading, setLoading] = useState<boolean>(true);
// //   const [progress, setProgress] = useState<number>(0);
// //   const [error, setError] = useState<string | null>(null);
// //   const [pageCount, setPageCount] = useState<number>(0);
// //   const [currentPage, setCurrentPage] = useState<number>(1);

// //   useEffect(() => {
// //     if (!filename) {
// //       setError("No PDF filename provided.");
// //       setLoading(false);
// //       return;
// //     }
// //     let cancelled = false;

// //     const prepare = async () => {
// //       try {
// //         setLoading(true);
// //         setError(null);
// //         setProgress(0);

// //         // 1) Check if it is already cached
// //         const cached = await getCachedUri(filename);

// //         if (cancelled) return;
// //         if (cached) {
// //           setSourceUri(cached);
// //         } else {
// //           // 2) Download into our language-specific cache
// //           const localUri = await download.mutateAsync({
// //             filename,
// //             onProgress: (frac) => {
// //               if (!cancelled) setProgress(frac);
// //             },
// //           });
// //           if (!cancelled) {
// //             setSourceUri(localUri);
// //           }
// //         }
// //       } catch (err: any) {
// //         if (!cancelled) {
// //           setError(err?.message ?? "Failed to load PDF.");
// //         }
// //       } finally {
// //         if (!cancelled) {
// //           setLoading(false);
// //         }
// //       }
// //     };

// //     prepare();
// //     return () => {
// //       cancelled = true;
// //     };
// //     // Only depend on filename and lang - the functions are stable
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [filename, lang]);

// //   const windowWidth = Dimensions.get("window").width;
// //   const windowHeight = Dimensions.get("window").height;

// //   if (!filename) {
// //     return (
// //       <View>
// //         <Text>No filename received</Text>
// //       </View>
// //     );
// //   }

// //   return (
// //     <>
// //       <View style={styles.container}>
// //         {error && (
// //           <View style={styles.center}>
// //             <Text style={styles.errorText}>{error}</Text>
// //           </View>
// //         )}

// //         {!error && loading && (
// //           <View style={styles.center}>
// //             <ActivityIndicator size="large" />
// //             {progress > 0 && (
// //               <Text style={styles.progressText}>
// //                 {Math.round(progress * 100)}%
// //               </Text>
// //             )}
// //           </View>
// //         )}

// //         {!error && !loading && sourceUri && (
// //           <>
// //             <Pdf
// //               source={{ uri: sourceUri }}
// //               style={[styles.pdf, { width: windowWidth, height: windowHeight }]}
// //               enableRTL={rtl}
// //               trustAllCerts={true}
// //               onLoadComplete={(numberOfPages) => {
// //                 setPageCount(numberOfPages);
// //               }}
// //               onPageChanged={(page) => {
// //                 setCurrentPage(page);
// //               }}
// //               onError={(pdfError) => {
// //                 console.log("[PDF error]", pdfError);
// //                 setError(
// //                   pdfError instanceof Error
// //                     ? pdfError.message
// //                     : String(pdfError)
// //                 );
// //               }}
// //             />

// //             {pageCount > 0 && (
// //               <View style={styles.pageIndicatorContainer}>
// //                 <Text style={styles.pageIndicatorText}>
// //                   {currentPage} / {pageCount}
// //                 </Text>
// //               </View>
// //             )}
// //           </>
// //         )}
// //       </View>
// //     </>
// //   );
// // };

// // export default PdfViewerScreen;

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: "#111827",
// //   },
// //   pdf: {
// //     flex: 1,
// //     alignSelf: "center",
// //   },
// //   center: {
// //     flex: 1,
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },
// //   progressText: {
// //     marginTop: 12,
// //     color: "#E5E7EB",
// //     fontSize: 14,
// //   },
// //   errorText: {
// //     color: "#FCA5A5",
// //     fontSize: 14,
// //     textAlign: "center",
// //     paddingHorizontal: 24,
// //   },
// //   pageIndicatorContainer: {
// //     position: "absolute",
// //     bottom: 16,
// //     alignSelf: "center",
// //     backgroundColor: "rgba(0,0,0,0.5)",
// //     paddingHorizontal: 12,
// //     paddingVertical: 6,
// //     borderRadius: 16,
// //   },
// //   pageIndicatorText: {
// //     color: "#FFFFFF",
// //     fontSize: 12,
// //   },
// // });

// //! Last worked

// import React, { useEffect, useState, useRef } from "react";
// import {
//   ActivityIndicator,
//   Dimensions,
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   ScrollView,
//   Animated,
// } from "react-native";
// import Pdf from "react-native-pdf";
// import { Stack, useRouter } from "expo-router";
// import { usePdfs } from "@/hooks/usePdfs";
// import { useLanguage } from "@/contexts/LanguageContext";
// import { useFontSizeStore } from "@/stores/fontSizeStore";
// import FontSizePickerModal from "@/components/FontSizePickerModal";
// import Feather from "@expo/vector-icons/Feather";
// import * as ScreenOrientation from "expo-screen-orientation";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { PdfViewerScreenPropsType } from "@/constants/Types";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import HeaderLeftBackButton from "./HeaderLeftBackButton";

// const PdfViewerScreen: React.FC<PdfViewerScreenPropsType> = ({ filename }) => {
//   const router = useRouter();

//   const { rtl, lang } = useLanguage();
//   const { getCachedUri, downloadPdf } = usePdfs(lang);
//   const { fontSize } = useFontSizeStore();

//   const [sourceUri, setSourceUri] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [progress, setProgress] = useState<number>(0);
//   const [error, setError] = useState<string | null>(null);
//   const [pageCount, setPageCount] = useState<number>(0);
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const insets = useSafeAreaInsets();

//   // eBook reader features
//   const [showControls, setShowControls] = useState<boolean>(true);
//   const [bookmarks, setBookmarks] = useState<number[]>([]);
//   const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
//   const [scale, setScale] = useState<number>(1.0);
//   const [showPageJump, setShowPageJump] = useState<boolean>(false);
//   const [showSettings, setShowSettings] = useState<boolean>(false);
//   const [showFontSizePicker, setShowFontSizePicker] = useState<boolean>(false);

//   // Layout toggle
//   const [isHorizontal, setIsHorizontal] = useState<boolean>(true);

//   const pdfRef = useRef<any>(null);
//   const controlsOpacity = useRef(new Animated.Value(1)).current;
//   const hideControlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
//   const hasLoadedRef = useRef(false);
//   const currentFilenameRef = useRef<string | undefined>(undefined);

//   const windowWidth = Dimensions.get("window").width;
//   const windowHeight = Dimensions.get("window").height;

//   // Convert fontSize from store to PDF scale
//   const getPdfScale = (fontSize: number): number => {
//     switch (fontSize) {
//       case 16:
//         return 0.85; // Small
//       case 18:
//         return 1.0; // Medium (default)
//       case 22:
//         return 1.25; // Large
//       default:
//         return 1.0;
//     }
//   };

//   // Update PDF scale when fontSize changes
//   useEffect(() => {
//     const newScale = getPdfScale(fontSize);
//     setScale(newScale);
//   }, [fontSize]);

//   // Load saved reading position, bookmarks, and preferences
//   useEffect(() => {
//     if (!filename) return;

//     const loadSavedData = async () => {
//       try {
//         const savedPage = await AsyncStorage.getItem(`pdf_page_${filename}`);
//         const savedBookmarks = await AsyncStorage.getItem(
//           `pdf_bookmarks_${filename}`
//         );
//         const savedHorizontal = await AsyncStorage.getItem(
//           `pdf_horizontal_${filename}`
//         );

//         if (savedPage) setCurrentPage(parseInt(savedPage, 10));
//         if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));
//         if (savedHorizontal !== null)
//           setIsHorizontal(savedHorizontal === "true");
//       } catch (err) {
//         console.warn("Failed to load saved data:", err);
//       }
//     };

//     loadSavedData();
//   }, [filename]);

//   // Save reading position (debounced)
//   useEffect(() => {
//     if (!filename || currentPage === 1) return;
//     const saveTimeout = setTimeout(() => {
//       AsyncStorage.setItem(
//         `pdf_page_${filename}`,
//         currentPage.toString()
//       ).catch(console.warn);
//     }, 1000);
//     return () => clearTimeout(saveTimeout);
//   }, [currentPage, filename]);

//   // Save layout preference
//   useEffect(() => {
//     if (!filename) return;
//     AsyncStorage.setItem(
//       `pdf_horizontal_${filename}`,
//       isHorizontal.toString()
//     ).catch(console.warn);
//   }, [isHorizontal, filename]);

//   // Auto-hide controls
//   const resetControlsTimer = () => {
//     if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
//     setShowControls(true);
//     Animated.timing(controlsOpacity, {
//       toValue: 1,
//       duration: 200,
//       useNativeDriver: true,
//     }).start();
//     hideControlsTimer.current = setTimeout(() => {
//       hideControls();
//     }, 4000);
//   };

//   const hideControls = () => {
//     Animated.timing(controlsOpacity, {
//       toValue: 0,
//       duration: 200,
//       useNativeDriver: true,
//     }).start(() => {
//       setShowControls(false);
//     });
//   };

//   const toggleControls = () => {
//     if (showControls) {
//       hideControls();
//       if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
//     } else {
//       resetControlsTimer();
//     }
//   };

//   // Reset loaded state when filename changes
//   useEffect(() => {
//     if (currentFilenameRef.current !== filename) {
//       hasLoadedRef.current = false;
//       currentFilenameRef.current = filename;
//       setSourceUri(null);
//       setError(null);
//       setLoading(true);
//     }
//   }, [filename]);

//   // PDF loading - OPTIMIZED VERSION
//   useEffect(() => {
//     if (!filename) {
//       setError("No PDF filename provided.");
//       setLoading(false);
//       return;
//     }

//     // Prevent re-loading if already loaded for this file
//     if (hasLoadedRef.current && sourceUri) return;

//     let cancelled = false;

//     const prepare = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         setProgress(0);

//         const cached = await getCachedUri(filename);

//         if (cancelled) return;

//         if (cached) {
//           setSourceUri(cached);
//           hasLoadedRef.current = true;
//         } else {
//           const localUri = await downloadPdf({
//             filename,
//             onProgress: (frac) => {
//               if (!cancelled) setProgress(frac);
//             },
//           });

//           if (!cancelled) {
//             setSourceUri(localUri);
//             hasLoadedRef.current = true;
//           }
//         }
//       } catch (err: any) {
//         if (!cancelled) setError(err?.message ?? "Failed to load PDF.");
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     };

//     prepare();

//     return () => {
//       cancelled = true;
//     };
//   }, [filename, lang, downloadPdf, getCachedUri, sourceUri]);

//   // Bookmark functions
//   const toggleBookmark = async () => {
//     const newBookmarks = bookmarks.includes(currentPage)
//       ? bookmarks.filter((p) => p !== currentPage)
//       : [...bookmarks, currentPage].sort((a, b) => a - b);

//     setBookmarks(newBookmarks);
//     if (filename) {
//       await AsyncStorage.setItem(
//         `pdf_bookmarks_${filename}`,
//         JSON.stringify(newBookmarks)
//       ).catch(console.warn);
//     }
//   };

//   const isBookmarked = bookmarks.includes(currentPage);

//   // Navigation functions
//   const goToPage = (page: number) => {
//     if (page >= 1 && page <= pageCount && pdfRef.current) {
//       pdfRef.current.setPage(page);
//     }
//   };

//   const goToNextPage = () => {
//     if (currentPage < pageCount) goToPage(currentPage + 1);
//   };

//   const goToPreviousPage = () => {
//     if (currentPage > 1) goToPage(currentPage - 1);
//   };

//   // Layout toggle
//   const toggleLayout = () => {
//     setIsHorizontal(!isHorizontal);
//   };

//   if (!filename) {
//     return (
//       <View style={styles.center}>
//         <Text style={styles.errorText}>No filename received</Text>
//       </View>
//     );
//   }

//   return (
//     <>
//       <View style={styles.container}>
//         {error && (
//           <View style={styles.center}>
//             <Text style={styles.errorText}>{error}</Text>
//             <TouchableOpacity
//               style={styles.retryButton}
//               onPress={() => router.back()}
//             >
//               <Text style={styles.retryText}>Go Back</Text>
//             </TouchableOpacity>
//           </View>
//         )}

//         {!error && loading && (
//           <View style={styles.center}>
//             <ActivityIndicator size="large" color="#3B82F6" />
//             {progress > 0 && (
//               <Text style={styles.progressText}>
//                 Loading {Math.round(progress * 100)}%
//               </Text>
//             )}
//           </View>
//         )}

//         {!error && !loading && sourceUri && (
//           <>
//             <TouchableOpacity
//               activeOpacity={1}
//               style={styles.pdfContainer}
//               onPress={toggleControls}
//             >
//               <Pdf
//                 ref={pdfRef}
//                 source={{ uri: sourceUri, cache: true }}
//                 style={[
//                   styles.pdf,
//                   { width: windowWidth, height: windowHeight },
//                 ]}
//                 enablePaging={isHorizontal}
//                 horizontal={isHorizontal}
//                 enableRTL={rtl}
//                 trustAllCerts={false}
//                 page={currentPage}
//                 scale={scale}
//                 minScale={0.5}
//                 maxScale={3.0}
//                 enableAntialiasing={true}
//                 enableAnnotationRendering={false}
//                 fitPolicy={2}
//                 spacing={10}

//                 onLoadComplete={(numberOfPages) => {
//                   setPageCount(numberOfPages);
//                 }}
//                 onPageChanged={(page) => {
//                   setCurrentPage(page);
//                   resetControlsTimer();
//                 }}
//                 onScaleChanged={(newScale) => {
//                   setScale(newScale);
//                 }}
//                 onError={(pdfError) => {
//                   console.log("[PDF error]", pdfError);
//                   setError(
//                     pdfError instanceof Error
//                       ? pdfError.message
//                       : String(pdfError)
//                   );
//                 }}
//               />
//             </TouchableOpacity>

//             {/* Top Controls Bar */}
//             {showControls && (
//               <Animated.View
//                 style={[
//                   styles.topBar,
//                   { opacity: controlsOpacity, paddingTop: insets.top },
//                 ]}
//               >
//                 <HeaderLeftBackButton />
//                 <TouchableOpacity
//                   style={styles.controlButton}
//                   onPress={toggleBookmark}
//                 >
//                   <Feather
//                     name="bookmark"
//                     size={24}
//                     color={isBookmarked ? "#F59E0B" : "#FFFFFF"}
//                   />
//                 </TouchableOpacity>

//                 <View style={styles.pageInfo}>
//                   <TouchableOpacity
//                     onPress={() => setShowPageJump(!showPageJump)}
//                   >
//                     <Text style={styles.pageText}>
//                       {currentPage} / {pageCount}
//                     </Text>
//                   </TouchableOpacity>
//                 </View>

//                 <TouchableOpacity
//                   style={styles.controlButton}
//                   onPress={() => setShowSettings(!showSettings)}
//                 >
//                   <Feather name="settings" size={24} color="#FFFFFF" />
//                 </TouchableOpacity>
//               </Animated.View>
//             )}

//             {/* Bottom Navigation Bar */}
//             {showControls && (
//               <Animated.View
//                 style={[styles.bottomBar, { opacity: controlsOpacity }]}
//               >
//                 <TouchableOpacity
//                   style={[
//                     styles.navButton,
//                     currentPage === 1 && styles.navButtonDisabled,
//                   ]}
//                   onPress={goToPreviousPage}
//                   disabled={currentPage === 1}
//                 >
//                   <Feather
//                     name={
//                       isHorizontal
//                         ? rtl
//                           ? "chevron-right"
//                           : "chevron-left"
//                         : "chevron-up"
//                     }
//                     size={28}
//                     color={currentPage === 1 ? "#6B7280" : "#FFFFFF"}
//                   />
//                 </TouchableOpacity>

//                 <View style={styles.progressBarContainer}>
//                   <View
//                     style={[
//                       styles.progressBar,
//                       { width: `${(currentPage / pageCount) * 100}%` },
//                     ]}
//                   />
//                 </View>

//                 <TouchableOpacity
//                   style={[
//                     styles.navButton,
//                     currentPage === pageCount && styles.navButtonDisabled,
//                   ]}
//                   onPress={goToNextPage}
//                   disabled={currentPage === pageCount}
//                 >
//                   <Feather
//                     name={
//                       isHorizontal
//                         ? rtl
//                           ? "chevron-left"
//                           : "chevron-right"
//                         : "chevron-down"
//                     }
//                     size={28}
//                     color={currentPage === pageCount ? "#6B7280" : "#FFFFFF"}
//                   />
//                 </TouchableOpacity>
//               </Animated.View>
//             )}

//             {/* Settings Menu */}
//             {showSettings && (
//               <View style={styles.settingsOverlay}>
//                 <View style={styles.settingsContainer}>
//                   <View style={styles.settingsHeader}>
//                     <Text style={styles.settingsTitle}>Reading Settings</Text>
//                     <TouchableOpacity onPress={() => setShowSettings(false)}>
//                       <Feather name="x" size={24} color="#FFFFFF" />
//                     </TouchableOpacity>
//                   </View>

//                   <View style={styles.settingsContent}>
//                     {/* Text Size */}
//                     <View style={styles.settingSection}>
//                       <TouchableOpacity
//                         style={[styles.settingRow, styles.settingRowButton]}
//                         onPress={() => {
//                           setShowFontSizePicker(true);
//                           setShowSettings(false);
//                         }}
//                         activeOpacity={0.7}
//                       >
//                         <View style={styles.settingRowLeft}>
//                           <Feather name="type" size={20} color="#FFFFFF" />
//                           <Text style={styles.settingRowLabel}>Text Size</Text>
//                         </View>
//                         <View style={styles.settingRowRight}>
//                           <Text style={styles.settingValue}>
//                             {fontSize === 16
//                               ? "Small"
//                               : fontSize === 18
//                               ? "Medium"
//                               : "Large"}
//                           </Text>
//                           <Feather
//                             name="chevron-right"
//                             size={20}
//                             color="#9CA3AF"
//                           />
//                         </View>
//                       </TouchableOpacity>
//                     </View>

//                     {/* Layout Mode */}
//                     <View style={styles.settingSection}>
//                       <Text style={styles.settingLabel}>Page Layout</Text>
//                       <View style={styles.layoutButtons}>
//                         <TouchableOpacity
//                           style={[
//                             styles.layoutButton,
//                             isHorizontal && styles.layoutButtonActive,
//                           ]}
//                           onPress={() => !isHorizontal && toggleLayout()}
//                         >
//                           <Feather
//                             name="columns"
//                             size={20}
//                             color={isHorizontal ? "#3B82F6" : "#9CA3AF"}
//                           />
//                           <Text
//                             style={[
//                               styles.layoutButtonText,
//                               isHorizontal && styles.layoutButtonTextActive,
//                             ]}
//                           >
//                             Horizontal
//                           </Text>
//                         </TouchableOpacity>

//                         <TouchableOpacity
//                           style={[
//                             styles.layoutButton,
//                             !isHorizontal && styles.layoutButtonActive,
//                           ]}
//                           onPress={() => isHorizontal && toggleLayout()}
//                         >
//                           <Feather
//                             name="align-justify"
//                             size={20}
//                             color={!isHorizontal ? "#3B82F6" : "#9CA3AF"}
//                           />
//                           <Text
//                             style={[
//                               styles.layoutButtonText,
//                               !isHorizontal && styles.layoutButtonTextActive,
//                             ]}
//                           >
//                             Vertical
//                           </Text>
//                         </TouchableOpacity>
//                       </View>
//                       <Text style={styles.settingHint}>
//                         {isHorizontal
//                           ? "Swipe left/right to turn pages"
//                           : "Scroll up/down continuously"}
//                       </Text>
//                     </View>
//                   </View>
//                 </View>
//               </View>
//             )}

//             {/* Font Size Picker Modal */}
//             <FontSizePickerModal
//               visible={showFontSizePicker}
//               onClose={() => {
//                 setShowFontSizePicker(false);
//                 setShowSettings(true);
//               }}
//             />

//             {/* Page Jump Menu */}
//             {showPageJump && (
//               <View style={styles.pageJumpOverlay}>
//                 <View style={styles.pageJumpContainer}>
//                   <View style={styles.pageJumpHeader}>
//                     <Text style={styles.pageJumpTitle}>Jump to Page</Text>
//                     <TouchableOpacity onPress={() => setShowPageJump(false)}>
//                       <Feather name="x" size={24} color="#FFFFFF" />
//                     </TouchableOpacity>
//                   </View>

//                   <ScrollView style={styles.pageJumpScroll}>
//                     {bookmarks.length > 0 && (
//                       <>
//                         <Text style={styles.sectionTitle}>Bookmarks</Text>
//                         {bookmarks.map((page) => (
//                           <TouchableOpacity
//                             key={`bookmark-${page}`}
//                             style={[
//                               styles.pageJumpItem,
//                               page === currentPage && styles.pageJumpItemActive,
//                             ]}
//                             onPress={() => {
//                               goToPage(page);
//                               setShowPageJump(false);
//                             }}
//                           >
//                             <Feather
//                               name="bookmark"
//                               size={18}
//                               color="#F59E0B"
//                             />
//                             <Text style={styles.pageJumpItemText}>
//                               Page {page}
//                             </Text>
//                           </TouchableOpacity>
//                         ))}
//                         <View style={styles.divider} />
//                       </>
//                     )}

//                     <Text style={styles.sectionTitle}>All Pages</Text>
//                     {Array.from({ length: pageCount }, (_, i) => i + 1).map(
//                       (page) => (
//                         <TouchableOpacity
//                           key={page}
//                           style={[
//                             styles.pageJumpItem,
//                             page === currentPage && styles.pageJumpItemActive,
//                           ]}
//                           onPress={() => {
//                             goToPage(page);
//                             setShowPageJump(false);
//                           }}
//                         >
//                           <Text style={styles.pageJumpItemText}>
//                             Page {page}
//                           </Text>
//                         </TouchableOpacity>
//                       )
//                     )}
//                   </ScrollView>
//                 </View>
//               </View>
//             )}
//           </>
//         )}
//       </View>
//     </>
//   );
// };

// export default PdfViewerScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#111827",
//   },
//   pdfContainer: {
//     flex: 1,
//   },
//   pdf: {
//     flex: 1,
//   },
//   center: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 20,
//   },
//   progressText: {
//     marginTop: 12,
//     color: "#E5E7EB",
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   errorText: {
//     color: "#FCA5A5",
//     fontSize: 16,
//     textAlign: "center",
//     paddingHorizontal: 24,
//     marginBottom: 20,
//   },
//   retryButton: {
//     backgroundColor: "#3B82F6",
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     borderRadius: 8,
//   },
//   retryText: {
//     color: "#FFFFFF",
//     fontSize: 16,
//     fontWeight: "600",
//   },

//   topBar: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     backgroundColor: "rgba(0, 0, 0, 0.7)",
//     zIndex: 10,
//   },
//   controlButton: {
//     padding: 8,
//   },
//   pageInfo: {
//     flex: 1,
//     alignItems: "center",
//   },
//   pageText: {
//     color: "#FFFFFF",
//     fontSize: 16,
//     fontWeight: "600",
//   },

//   bottomBar: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     paddingVertical: 16,
//     backgroundColor: "rgba(0, 0, 0, 0.7)",
//     zIndex: 10,
//   },
//   navButton: {
//     padding: 8,
//   },
//   navButtonDisabled: {
//     opacity: 0.3,
//   },
//   progressBarContainer: {
//     flex: 1,
//     height: 4,
//     backgroundColor: "rgba(255, 255, 255, 0.2)",
//     borderRadius: 2,
//     marginHorizontal: 16,
//     overflow: "hidden",
//   },
//   progressBar: {
//     height: "100%",
//     backgroundColor: "#3B82F6",
//     borderRadius: 2,
//   },

//   // Settings Menu
//   settingsOverlay: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: "rgba(0, 0, 0, 0.8)",
//     zIndex: 20,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   settingsContainer: {
//     width: "85%",
//     maxHeight: "70%",
//     backgroundColor: "#1F2937",
//     borderRadius: 16,
//     overflow: "hidden",
//   },
//   settingsHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: "#374151",
//   },
//   settingsTitle: {
//     color: "#FFFFFF",
//     fontSize: 18,
//     fontWeight: "700",
//   },
//   settingsContent: {
//     padding: 16,
//   },
//   settingSection: {
//     marginBottom: 20,
//   },
//   settingLabel: {
//     color: "#FFFFFF",
//     fontSize: 16,
//     fontWeight: "600",
//     marginBottom: 12,
//   },
//   settingRowLabel: {
//     color: "#FFFFFF",
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   settingHint: {
//     color: "#9CA3AF",
//     fontSize: 13,
//     marginTop: 8,
//   },
//   settingRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingVertical: 4,
//   },
//   settingRowButton: {
//     backgroundColor: "#374151",
//     paddingHorizontal: 12,
//     paddingVertical: 12,
//     borderRadius: 8,
//   },
//   settingRowLeft: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 12,
//   },
//   settingRowRight: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//   },
//   settingValue: {
//     color: "#9CA3AF",
//     fontSize: 14,
//   },

//   // Layout Buttons
//   layoutButtons: {
//     flexDirection: "row",
//     gap: 12,
//   },
//   layoutButton: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 8,
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     backgroundColor: "#374151",
//     borderRadius: 8,
//     borderWidth: 2,
//     borderColor: "transparent",
//   },
//   layoutButtonActive: {
//     backgroundColor: "#1E3A8A",
//     borderColor: "#3B82F6",
//   },
//   layoutButtonText: {
//     color: "#9CA3AF",
//     fontSize: 14,
//     fontWeight: "600",
//   },
//   layoutButtonTextActive: {
//     color: "#FFFFFF",
//   },

//   // Toggle Switch
//   toggle: {
//     width: 50,
//     height: 28,
//     borderRadius: 14,
//     backgroundColor: "#374151",
//     padding: 2,
//     justifyContent: "center",
//   },
//   toggleActive: {
//     backgroundColor: "#3B82F6",
//   },
//   toggleThumb: {
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     backgroundColor: "#FFFFFF",
//     alignSelf: "flex-start",
//   },
//   toggleThumbActive: {
//     alignSelf: "flex-end",
//   },

//   // Page Jump Menu
//   pageJumpOverlay: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: "rgba(0, 0, 0, 0.8)",
//     zIndex: 20,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   pageJumpContainer: {
//     width: "80%",
//     maxHeight: "80%",
//     backgroundColor: "#1F2937",
//     borderRadius: 16,
//     overflow: "hidden",
//   },
//   pageJumpHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: "#374151",
//   },
//   pageJumpTitle: {
//     color: "#FFFFFF",
//     fontSize: 18,
//     fontWeight: "700",
//   },
//   pageJumpScroll: {
//     maxHeight: 400,
//   },
//   sectionTitle: {
//     color: "#9CA3AF",
//     fontSize: 14,
//     fontWeight: "600",
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     textTransform: "uppercase",
//   },
//   pageJumpItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     gap: 12,
//   },
//   pageJumpItemActive: {
//     backgroundColor: "#374151",
//   },
//   pageJumpItemText: {
//     color: "#FFFFFF",
//     fontSize: 16,
//   },
//   divider: {
//     height: 1,
//     backgroundColor: "#374151",
//     marginVertical: 8,
//   },
// });

import React, { useEffect, useState, useRef, cache } from "react";
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Animated,
} from "react-native";
import Pdf from "react-native-pdf";
import { Stack, useRouter } from "expo-router";
import { usePdfs } from "@/hooks/usePdfs";
import { useLanguage } from "@/contexts/LanguageContext";
import Feather from "@expo/vector-icons/Feather";
import * as ScreenOrientation from "expo-screen-orientation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PdfViewerScreenPropsType } from "@/constants/Types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HeaderLeftBackButton from "./HeaderLeftBackButton";
import { useRefreshFavorites } from "@/stores/refreshFavoriteStore";
import { isPdfFavorited, togglePdfFavorite } from "@/utils/favorites";

const getPdfNumericId = (filename: string): number => {
  const asNumber = Number(filename);
  if (Number.isFinite(asNumber)) return asNumber;

  let hash = 0;
  for (let i = 0; i < filename.length; i++) {
    hash = (hash * 31 + filename.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) || 1;
};

const PdfViewerScreen: React.FC<PdfViewerScreenPropsType> = ({ filename }) => {
  const router = useRouter();

  const { rtl, lang } = useLanguage();
  const { getCachedUri, downloadPdf } = usePdfs(lang);

  const [sourceUri, setSourceUri] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const insets = useSafeAreaInsets();

  // eBook reader features
  const [showControls, setShowControls] = useState<boolean>(true);
  const [scale, setScale] = useState<number>(1.0);
  const [showPageJump, setShowPageJump] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // Layout toggle
  const [isHorizontal, setIsHorizontal] = useState<boolean>(true);

  // Favorites
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const { triggerRefreshFavorites } = useRefreshFavorites();

  const pdfRef = useRef<any>(null);
  const controlsOpacity = useRef(new Animated.Value(1)).current;
  const hideControlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasLoadedRef = useRef(false);
  const currentFilenameRef = useRef<string | undefined>(undefined);

  // Load saved reading position and preferences
  useEffect(() => {
    if (!filename) return;

    const loadSavedData = async () => {
      try {
        const savedPage = await AsyncStorage.getItem(`pdf_page_${filename}`);
        const savedHorizontal = await AsyncStorage.getItem(
          `pdf_horizontal_${filename}`
        );

        if (savedPage) setCurrentPage(parseInt(savedPage, 10));
        if (savedHorizontal !== null)
          setIsHorizontal(savedHorizontal === "true");
      } catch (err) {
        console.warn("Failed to load saved data:", err);
      }
    };

    loadSavedData();
  }, [filename]);

  // Save reading position (debounced)
  useEffect(() => {
    if (!filename || currentPage === 1) return;
    const saveTimeout = setTimeout(() => {
      AsyncStorage.setItem(
        `pdf_page_${filename}`,
        currentPage.toString()
      ).catch(console.warn);
    }, 1000);
    return () => clearTimeout(saveTimeout);
  }, [currentPage, filename]);

  // Save layout preference
  useEffect(() => {
    if (!filename) return;
    AsyncStorage.setItem(
      `pdf_horizontal_${filename}`,
      isHorizontal.toString()
    ).catch(console.warn);
  }, [isHorizontal, filename]);

  // Favorites: load initial favorite state
  useEffect(() => {
    if (!filename) {
      setIsFavorite(false);
      return;
    }
    const id = getPdfNumericId(filename);
    let mounted = true;
    (async () => {
      try {
        const result = await isPdfFavorited(id, lang);
        if (mounted) setIsFavorite(result);
      } catch (e) {
        console.warn("[PdfViewer] isPdfFavorited error", e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [filename, lang]);

  const onPressToggleFavorite = async () => {
    if (!filename) return;
    const id = getPdfNumericId(filename);
    try {
      const next = await togglePdfFavorite(id, lang);
      setIsFavorite(next);
      triggerRefreshFavorites();
    } catch (e) {
      console.warn("[PdfViewer] togglePdfFavorite error", e);
    }
  };

  // Auto-hide controls
  const resetControlsTimer = () => {
    if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    setShowControls(true);
    Animated.timing(controlsOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
    hideControlsTimer.current = setTimeout(() => {
      hideControls();
    }, 4000);
  };

  const hideControls = () => {
    Animated.timing(controlsOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowControls(false);
    });
  };

  const toggleControls = () => {
    if (showControls) {
      hideControls();
      if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    } else {
      resetControlsTimer();
    }
  };

  // Reset loaded state when filename changes
  useEffect(() => {
    if (currentFilenameRef.current !== filename) {
      hasLoadedRef.current = false;
      currentFilenameRef.current = filename;
      setSourceUri(null);
      setError(null);
      setLoading(true);
    }
  }, [filename]);

  // PDF loading - OPTIMIZED VERSION
  useEffect(() => {
    if (!filename) {
      setError("No PDF filename provided.");
      setLoading(false);
      return;
    }

    // Prevent re-loading if already loaded for this file
    if (hasLoadedRef.current && sourceUri) return;

    let cancelled = false;

    const prepare = async () => {
      try {
        setLoading(true);
        setError(null);
        setProgress(0);

        const cached = await getCachedUri(filename);

        if (cancelled) return;

        if (cached) {
          setSourceUri(cached);
          hasLoadedRef.current = true;
        } else {
          const localUri = await downloadPdf({
            filename,
            onProgress: (frac) => {
              if (!cancelled) setProgress(frac);
            },
          });

          if (!cancelled) {
            setSourceUri(localUri);
            hasLoadedRef.current = true;
          }
        }
      } catch (err: any) {
        if (!cancelled) setError(err?.message ?? "Failed to load PDF.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    prepare();

    return () => {
      cancelled = true;
    };
  }, [filename, lang, downloadPdf, getCachedUri, sourceUri]);

  // Navigation functions
  const goToPage = (page: number) => {
    if (page >= 1 && page <= pageCount && pdfRef.current) {
      pdfRef.current.setPage(page);
    }
  };

  const goToNextPage = () => {
    if (currentPage < pageCount) goToPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) goToPage(currentPage - 1);
  };

  // Layout toggle
  const toggleLayout = () => {
    setIsHorizontal(!isHorizontal);
  };

  if (!filename) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>No filename received</Text>
      </View>
    );
  }

  return (
    <>
      <View style={styles.container}>
        {error && (
          <View style={styles.center}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => router.back()}
            >
              <Text style={styles.retryText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        )}

        {!error && loading && (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#3B82F6" />
            {progress > 0 && (
              <Text style={styles.progressText}>
                Loading {Math.round(progress * 100)}%
              </Text>
            )}
          </View>
        )}

        {!error && !loading && sourceUri && (
          <>
            <TouchableOpacity
              activeOpacity={1}
              style={styles.pdfContainer}
              onPress={toggleControls}
            >
              <Pdf
                ref={pdfRef}
                source={{ uri: sourceUri, cache: true }}
                style={[styles.pdf]}
                enablePaging={isHorizontal}
                horizontal={isHorizontal}
                enableRTL={rtl}
                trustAllCerts={false}
                // page={currentPage}
                minScale={1}
                maxScale={3.0}
                enableAntialiasing={true}
                enableAnnotationRendering={true}
                enableDoubleTapZoom
                fitPolicy={2}
                spacing={10}
                onLoadComplete={(numberOfPages) => {
                  setPageCount(numberOfPages);
                }}
                onPageChanged={(page) => {
                  setCurrentPage(page);
                  resetControlsTimer();
                }}
                onError={(pdfError) => {
                  console.log("[PDF error]", pdfError);
                  setError(
                    pdfError instanceof Error
                      ? pdfError.message
                      : String(pdfError)
                  );
                }}
              />
            </TouchableOpacity>

            {/* Top Controls Bar */}
            {showControls && (
              <Animated.View
                style={[
                  styles.topBar,
                  { opacity: controlsOpacity, paddingTop: insets.top },
                ]}
              >
                <HeaderLeftBackButton />

                <View style={styles.pageInfo}>
                  <TouchableOpacity
                    onPress={() => setShowPageJump(!showPageJump)}
                  >
                    <Text style={styles.pageText}>
                      {currentPage} / {pageCount}
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={onPressToggleFavorite}
                >
                  <Feather
                    name="star"
                    size={25}
                    color={isFavorite ? "#F59E0B" : "#FFFFFF"}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={() => setShowSettings(!showSettings)}
                >
                  <Feather name="settings" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </Animated.View>
            )}

            {/* Bottom Navigation Bar */}
            {showControls && (
              <Animated.View
                style={[styles.bottomBar, { opacity: controlsOpacity }]}
              >
                <TouchableOpacity
                  style={[
                    styles.navButton,
                    currentPage === 1 && styles.navButtonDisabled,
                  ]}
                  onPress={goToPreviousPage}
                  disabled={currentPage === 1}
                >
                  <Feather
                    name={
                      isHorizontal
                        ? rtl
                          ? "chevron-right"
                          : "chevron-left"
                        : "chevron-up"
                    }
                    size={28}
                    color={currentPage === 1 ? "#6B7280" : "#FFFFFF"}
                  />
                </TouchableOpacity>

                <View style={styles.progressBarContainer}>
                  <View
                    style={[
                      styles.progressBar,
                      { width: `${(currentPage / pageCount) * 100}%` },
                    ]}
                  />
                </View>

                <TouchableOpacity
                  style={[
                    styles.navButton,
                    currentPage === pageCount && styles.navButtonDisabled,
                  ]}
                  onPress={goToNextPage}
                  disabled={currentPage === pageCount}
                >
                  <Feather
                    name={
                      isHorizontal
                        ? rtl
                          ? "chevron-left"
                          : "chevron-right"
                        : "chevron-down"
                    }
                    size={28}
                    color={currentPage === pageCount ? "#6B7280" : "#FFFFFF"}
                  />
                </TouchableOpacity>
              </Animated.View>
            )}

            {/* Settings Menu */}
            {showSettings && (
              <View style={styles.settingsOverlay}>
                <View style={styles.settingsContainer}>
                  <View style={styles.settingsHeader}>
                    <Text style={styles.settingsTitle}>Reading Settings</Text>
                    <TouchableOpacity onPress={() => setShowSettings(false)}>
                      <Feather name="x" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.settingsContent}>
                    {/* Layout Mode */}
                    <View style={styles.settingSection}>
                      <Text style={styles.settingLabel}>Page Layout</Text>
                      <View style={styles.layoutButtons}>
                        <TouchableOpacity
                          style={[
                            styles.layoutButton,
                            isHorizontal && styles.layoutButtonActive,
                          ]}
                          onPress={() => !isHorizontal && toggleLayout()}
                        >
                          <Feather
                            name="columns"
                            size={20}
                            color={isHorizontal ? "#3B82F6" : "#9CA3AF"}
                          />
                          <Text
                            style={[
                              styles.layoutButtonText,
                              isHorizontal && styles.layoutButtonTextActive,
                            ]}
                          >
                            Horizontal
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[
                            styles.layoutButton,
                            !isHorizontal && styles.layoutButtonActive,
                          ]}
                          onPress={() => isHorizontal && toggleLayout()}
                        >
                          <Feather
                            name="align-justify"
                            size={20}
                            color={!isHorizontal ? "#3B82F6" : "#9CA3AF"}
                          />
                          <Text
                            style={[
                              styles.layoutButtonText,
                              !isHorizontal && styles.layoutButtonTextActive,
                            ]}
                          >
                            Vertical
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.settingHint}>
                        {isHorizontal
                          ? "Swipe left/right to turn pages"
                          : "Scroll up/down continuously"}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}

            {/* Page Jump Menu */}
            {showPageJump && (
              <View style={styles.pageJumpOverlay}>
                <View style={styles.pageJumpContainer}>
                  <View style={styles.pageJumpHeader}>
                    <Text style={styles.pageJumpTitle}>Jump to Page</Text>
                    <TouchableOpacity onPress={() => setShowPageJump(false)}>
                      <Feather name="x" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>

                  <ScrollView style={styles.pageJumpScroll}>
                    <Text style={styles.sectionTitle}>All Pages</Text>
                    {Array.from({ length: pageCount }, (_, i) => i + 1).map(
                      (page) => (
                        <TouchableOpacity
                          key={page}
                          style={[
                            styles.pageJumpItem,
                            page === currentPage && styles.pageJumpItemActive,
                          ]}
                          onPress={() => {
                            goToPage(page);
                            setShowPageJump(false);
                          }}
                        >
                          <Text style={styles.pageJumpItemText}>
                            Page {page}
                          </Text>
                        </TouchableOpacity>
                      )
                    )}
                  </ScrollView>
                </View>
              </View>
            )}
          </>
        )}
      </View>
    </>
  );
};

export default PdfViewerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
  },
  pdfContainer: {
    flex: 1,
  },
  pdf: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  progressText: {
    marginTop: 12,
    color: "#E5E7EB",
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    color: "#FCA5A5",
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    zIndex: 10,
  },
  controlButton: {
    padding: 8,
  },
  pageInfo: {
    flex: 1,
    alignItems: "center",
  },
  pageText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    zIndex: 10,
  },
  navButton: {
    padding: 8,
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  progressBarContainer: {
    flex: 1,
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 2,
    marginHorizontal: 16,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#3B82F6",
    borderRadius: 2,
  },

  // Settings Menu
  settingsOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    zIndex: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  settingsContainer: {
    width: "85%",
    maxHeight: "70%",
    backgroundColor: "#1F2937",
    borderRadius: 16,
    overflow: "hidden",
  },
  settingsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
  },
  settingsTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  settingsContent: {
    padding: 16,
  },
  settingSection: {
    marginBottom: 20,
  },
  settingLabel: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  settingRowLabel: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  settingHint: {
    color: "#9CA3AF",
    fontSize: 13,
    marginTop: 8,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  settingRowButton: {
    backgroundColor: "#374151",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
  },
  settingRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  settingRowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  settingValue: {
    color: "#9CA3AF",
    fontSize: 14,
  },

  // Layout Buttons
  layoutButtons: {
    flexDirection: "row",
    gap: 12,
  },
  layoutButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#374151",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "transparent",
  },
  layoutButtonActive: {
    backgroundColor: "#1E3A8A",
    borderColor: "#3B82F6",
  },
  layoutButtonText: {
    color: "#9CA3AF",
    fontSize: 14,
    fontWeight: "600",
  },
  layoutButtonTextActive: {
    color: "#FFFFFF",
  },

  // Toggle Switch
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#374151",
    padding: 2,
    justifyContent: "center",
  },
  toggleActive: {
    backgroundColor: "#3B82F6",
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    alignSelf: "flex-start",
  },
  toggleThumbActive: {
    alignSelf: "flex-end",
  },

  // Page Jump Menu
  pageJumpOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    zIndex: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  pageJumpContainer: {
    width: "80%",
    maxHeight: "80%",
    backgroundColor: "#1F2937",
    borderRadius: 16,
    overflow: "hidden",
  },
  pageJumpHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
  },
  pageJumpTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  pageJumpScroll: {
    maxHeight: 400,
  },
  sectionTitle: {
    color: "#9CA3AF",
    fontSize: 14,
    fontWeight: "600",
    paddingHorizontal: 16,
    paddingVertical: 12,
    textTransform: "uppercase",
  },
  pageJumpItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  pageJumpItemActive: {
    backgroundColor: "#374151",
  },
  pageJumpItemText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "#374151",
    marginVertical: 8,
  },
});
