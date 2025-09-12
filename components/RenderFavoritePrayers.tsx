// import React, { useEffect, useState, useCallback } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   FlatList,
//   StyleSheet,
//   ActivityIndicator,
//   ScrollView,
//   Alert,
//   useColorScheme,
//   Platform,
// } from "react-native";
// import { useTranslation } from "react-i18next";
// import {
//   getFavoritePrayersForFolder,
//   getFavoritePrayerFolders,
//   removeFolder,
// } from "@/db/queries/prayers";
// import { FavoritePrayerFolderType, PrayerType } from "@/constants/Types";
// import { router } from "expo-router";
// import { Colors } from "@/constants/Colors";
// import { ThemedView } from "./ThemedView";
// import { ThemedText } from "./ThemedText";
// import { LoadingIndicator } from "./LoadingIndicator";
// import { useRefreshFavorites } from "@/stores/refreshFavoriteStore";
// import { AntDesign, Entypo } from "@expo/vector-icons";

// const FavoritePrayersScreen: React.FC = () => {
//   const { t } = useTranslation();
//   const { refreshTriggerFavorites, triggerRefreshFavorites } =
//     useRefreshFavorites();
//   const [folders, setFolders] = useState<FavoritePrayerFolderType[]>([]);
//   const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
//   const [prayers, setPrayers] = useState<PrayerType[]>([]);
//   const [isLoadingFolders, setIsLoadingFolders] = useState(false);
//   const [isLoadingPrayers, setIsLoadingPrayers] = useState(false);
//   const [isEdditing, setIsEdditing] = useState(false);
//   const colorScheme = useColorScheme() || "light";
//   // Load all favorite folders on mount
//   useEffect(() => {
//     (async () => {
//       setIsLoadingFolders(true);
//       try {
//         const arr = await getFavoritePrayerFolders();
//         setFolders(arr);
//         if (arr.length > 0) {
//           setSelectedFolder(arr[0].name);
//         }
//       } catch (err) {
//         console.error("Failed to load favorite folders:", err);
//         Alert.alert(t("toast.error"), t("FavoriteCategories.loadFailed"));
//       } finally {
//         setIsLoadingFolders(false);
//       }
//     })();
//   }, [t, refreshTriggerFavorites]);

//   // When selectedFolder changes, load prayers for it
//   useEffect(() => {
//     if (!selectedFolder) {
//       setPrayers([]);
//       return;
//     }
//     (async () => {
//       setIsLoadingPrayers(true);
//       try {
//         const ps = await getFavoritePrayersForFolder(selectedFolder);
//         setPrayers(ps);
//       } catch (err) {
//         console.error("Failed to load prayers for folder:", err);
//         Alert.alert(t("toast.error"), t("FavoriteCategories.loadFailed"));
//       } finally {
//         setIsLoadingPrayers(false);
//       }
//     })();
//   }, [selectedFolder, t]);

//   // Render one folder “pill”
//   const renderFolderPill = (folder: FavoritePrayerFolderType) => {
//     const isActive = folder.name === selectedFolder;
//     return (
//       <TouchableOpacity
//         key={folder.name}
//         style={[
//           styles.folderPill,
//           { backgroundColor: folder.color, gap: 10 },
//           isActive && {
//             opacity: 1,
//             borderWidth: 2,
//             borderColor: Colors[colorScheme].border,
//           },
//         ]}
//         onPress={() => setSelectedFolder(folder.name)}
//       >
//         {isEdditing && (
//           <AntDesign
//             name="minuscircleo"
//             size={22}
//             color={Colors[colorScheme].error}
//             style={{
//               alignSelf: "flex-end",
//             }}
//             onPress={async () => {
//               Alert.alert(
//                 t("confirmDelete"),
//                 t("deleteFolder"),
//                 [
//                   {
//                     text: t("cancle"),
//                     style: "cancel",
//                     onPress: () => console.log("Löschen Abgebrochen"),
//                   },
//                   {
//                     text: t("delete"),
//                     style: "destructive",
//                     onPress: async () => {
//                       try {
//                         await removeFolder(folder.name);
//                         triggerRefreshFavorites();
//                       } catch (e) {
//                         console.error(e);
//                         Alert.alert(t("toast.error"), t("errorDeletingFolder"));
//                       }
//                     },
//                   },
//                 ]
//               );
//             }}
//           />
//         )}
//         <ThemedText
//           style={[
//             styles.folderPillText,
//             isActive && styles.folderPillTextActive,
//           ]}
//         >
//           {folder.name} ({folder.prayerCount})
//         </ThemedText>
//       </TouchableOpacity>
//     );
//   };

//   // Render one prayer card
//   const renderPrayerCard = ({ item }: { item: PrayerType }) => (
//     <TouchableOpacity
//       style={[
//         styles.prayerCard,
//         { backgroundColor: Colors[colorScheme].contrast },
//       ]}
//       onPress={() => {
//         router.push({
//           pathname: "/(displayPrayer)/[prayer]",
//           params: { prayer: item.id.toString() },
//         });
//       }}
//     >
//       <ThemedText style={styles.prayerName}>{item.name}</ThemedText>
//       {item.arabic_title ? (
//         <ThemedText style={styles.prayerArabicTitle}>
//           {item.arabic_title}
//         </ThemedText>
//       ) : null}
//     </TouchableOpacity>
//   );

//   return (
//     <ThemedView style={styles.container}>
//       {/* Folder pills in a horizontal ScrollView */}
//       <View style={styles.pillContainer}>
//         {isLoadingPrayers ? (
//           <LoadingIndicator size={"large"} />
//         ) : (
//           <ThemedView style={{}}>
//             <TouchableOpacity
//               style={{
//                 alignSelf: "flex-end",
//                 marginRight: 20,
//                 marginBottom: 10,
//               }}
//               onPress={() => setIsEdditing((prev) => !prev)}
//             >
//               {isEdditing ? (
//                 <ThemedText
//                   style={{ fontSize: 20, color: Colors.universal.link }}
//                 >
//                   {t("done")}
//                 </ThemedText>
//               ) : (
//                 <ThemedText
//                   style={{ fontSize: 20, color: Colors.universal.link }}
//                 >
//                   {t("edit")}
//                 </ThemedText>
//               )}
//             </TouchableOpacity>
//             <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//               {folders.map(renderFolderPill)}
//             </ScrollView>
//           </ThemedView>
//         )}
//       </View>

//       {/* Prayer list for the selected folder */}
//       <View style={styles.prayerListContainer}>
//         {isLoadingPrayers ? (
//           <LoadingIndicator size="large" />
//         ) : prayers.length === 0 ? (
//           <ThemedView style={styles.centeredContainer}>
//             <ThemedText style={styles.emptyText}>{t("noFavorites")}</ThemedText>
//           </ThemedView>
//         ) : (
//           <FlatList
//             data={prayers}
//             extraData={[prayers, t]}
//             keyExtractor={(item) => item.id.toString()}
//             renderItem={renderPrayerCard}
//             contentContainerStyle={styles.prayerList}
//           />
//         )}
//       </View>
//     </ThemedView>
//   );
// };

// export default FavoritePrayersScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingTop: 15,
//     gap: 10,
//   },
//   headerText: {
//     fontSize: 24,
//     fontWeight: "700",
//     marginHorizontal: 16,
//     marginVertical: 12,
//   },
//   pillContainer: {
//     paddingLeft: 16,
//   },
//   folderPill: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 20,
//     marginRight: 12,
//     opacity: 0.8,
//   },
//   folderPillActive: {},
//   folderPillText: {
//     fontSize: 14,
//     color: "white",
//     fontWeight: "600",
//   },
//   folderPillTextActive: {
//     color: "#FFF",
//   },
//   prayerListContainer: {
//     flex: 1,
//     paddingHorizontal: 16,
//   },
//   prayerList: {
//     paddingVertical: 8,
//   },
//   prayerCard: {
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 12,
//     ...Platform.select({
//       ios: {
//         shadowOffset: {
//           width: 0,
//           height: 2,
//         },
//         shadowOpacity: 0.1,
//         shadowRadius: 2,
//       },
//       android: {
//         elevation: 5,
//       },
//     }),
//   },
//   prayerName: {
//     fontSize: 16,
//     fontWeight: "700",
//     marginBottom: 4,
//   },
//   prayerArabicTitle: {
//     fontSize: 14,
//     fontStyle: "italic",
//   },
//   centeredContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 20,
//   },
//   emptyText: {
//     textAlign: "center",
//     fontWeight: "500",
//     fontSize: 16,
//     lineHeight: 22,
//   },
// });

import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
  Alert,
  useColorScheme,
  Platform,
} from "react-native";
import { useTranslation } from "react-i18next";
import {
  getFavoritePrayersForFolder,
  getFavoritePrayerFolders,
  removeFolder,
} from "@/db/queries/prayers";
import { FavoritePrayerFolderType, PrayerType } from "@/constants/Types";
import { router, useFocusEffect } from "expo-router";
import { Colors } from "@/constants/Colors";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { LoadingIndicator } from "./LoadingIndicator";
import { useRefreshFavorites } from "@/stores/refreshFavoriteStore";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import i18n from "@/utils/i18n";

const FavoritePrayersScreen: React.FC = () => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";

  // Zustand trigger (useful if other screens must refresh too)
  const { refreshTriggerFavorites, triggerRefreshFavorites } =
    useRefreshFavorites();

  const [folders, setFolders] = useState<FavoritePrayerFolderType[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [prayers, setPrayers] = useState<PrayerType[]>([]);
  const [isLoadingFolders, setIsLoadingFolders] = useState(false);
  const [isLoadingPrayers, setIsLoadingPrayers] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const isFocused = useIsFocused();
  const reloadFolders = useCallback(async () => {
    setIsLoadingFolders(true);
    try {
      const arr = await getFavoritePrayerFolders();
      setFolders(arr);

      // Keep current selection if it still exists; otherwise pick first or null
      setSelectedFolder((prev) =>
        prev && arr.some((f) => f.name === prev) ? prev : arr[0]?.name ?? null
      );
    } catch (err) {
      console.error("Failed to load favorite folders:", err);
      Alert.alert(t("toast.error"), t("FavoriteCategories.loadFailed"));
    } finally {
      setIsLoadingFolders(false);
    }
  }, [t]);

  const reloadPrayers = useCallback(
    async (folder: string | null) => {
      if (!folder) {
        setPrayers([]);
        return;
      }
      setIsLoadingPrayers(true);
      try {
        const ps = await getFavoritePrayersForFolder(folder);
        setPrayers(ps);
      } catch (err) {
        console.error("Failed to load prayers for folder:", err);
        Alert.alert(t("toast.error"), t("FavoriteCategories.loadFailed"));
      } finally {
        setIsLoadingPrayers(false);
      }
    },
    [i18n.language]
  );

  const onDeleteFolder = useCallback(
    async (name: string) => {
      // Optimistic UI: remove folder immediately, clear selection/list if it was active
      setFolders((prev) => prev.filter((f) => f.name !== name));
      setSelectedFolder((prev) => (prev === name ? null : prev));
      setPrayers([]); // hide prayers immediately if we just removed the active folder

      try {
        await removeFolder(name); // atomic DB delete
        // Confirm state from DB
        await reloadFolders();
        // selectedFolder effect will reload prayers automatically
        triggerRefreshFavorites(); // notify other screens (optional)
      } catch (e) {
        console.error(e);
        Alert.alert(t("toast.error"), t("errorDeletingFolder"));
        // Roll back to server truth
        await reloadFolders();
        await reloadPrayers(selectedFolder);
      }
    },
    [reloadFolders, reloadPrayers, selectedFolder, i18n.language, triggerRefreshFavorites]
  );

  // Initial & external trigger reload
  useEffect(() => {
    (async () => {
      await reloadFolders();
    })();
  }, [reloadFolders, refreshTriggerFavorites, t]);

  // Load prayers whenever selectedFolder changes
  useEffect(() => {
    (async () => {
      await reloadPrayers(selectedFolder);
    })();
  }, [selectedFolder, reloadPrayers, t]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        // Screen is losing focus - cleanup
        setIsEditing(false);
      };
    }, [])
  );

  const renderFolderPill = (folder: FavoritePrayerFolderType) => {
    const isActive = folder.name === selectedFolder;
    return (
      <TouchableOpacity
        key={folder.name}
        style={[
          styles.folderPill,
          { backgroundColor: Colors[colorScheme].contrast, gap: 10 },
          isActive && {
            opacity: 1,
            borderWidth: 2,
            borderColor: Colors[colorScheme].border,
          },
        ]}
        onPress={() => setSelectedFolder(folder.name)}
        activeOpacity={0.8}
      >
        <Entypo name="folder" size={24} color={folder.color} />
        <ThemedText
          style={[
            styles.folderPillText,
            isActive && styles.folderPillTextActive,
          ]}
        >
          {folder.name} ({folder.prayerCount})
        </ThemedText>
        {isEditing && (
          <AntDesign
            name="minuscircleo"
            size={22}
            color={Colors[colorScheme].error}
            style={{ alignSelf: "flex-end" }}
            onPress={() => {
              Alert.alert(t("confirmDelete"), t("deleteFolder"), [
                { text: t("cancle"), style: "cancel" },
                {
                  text: t("delete"),
                  style: "destructive",
                  onPress: () => onDeleteFolder(folder.name),
                },
              ]);
            }}
          />
        )}
      </TouchableOpacity>
    );
  };

  const renderPrayerCard = ({ item }: { item: PrayerType }) => (
    <TouchableOpacity
      style={[
        styles.prayerCard,
        { backgroundColor: Colors[colorScheme].contrast },
      ]}
      onPress={() => {
        router.push({
          pathname: "/(displayPrayer)/[prayer]",
          params: { prayer: item.id.toString() },
        });
      }}
      activeOpacity={0.85}
    >
      <ThemedText style={styles.prayerName}>{item.name}</ThemedText>
      {item.arabic_title ? (
        <ThemedText style={styles.prayerArabicTitle}>
          {item.arabic_title}
        </ThemedText>
      ) : null}
    </TouchableOpacity>
  );

  // --- UI -------------------------------------------------------------------

  return (
    <ThemedView style={styles.container}>
      {/* Folder pills */}
      <View style={styles.pillContainer}>
        {isLoadingPrayers ? (
          <LoadingIndicator size="large" />
        ) : (
          <ThemedView>
            {prayers.length > 0 && (
              <TouchableOpacity
                style={{
                  alignSelf: "flex-end",
                  marginRight: 20,
                  marginBottom: 10,
                }}
                onPress={() => setIsEditing((prev) => !prev)}
              >
                <ThemedText
                  style={{ fontSize: 20, color: Colors.universal.link }}
                >
                  {isEditing ? t("done") : t("edit")}
                </ThemedText>
              </TouchableOpacity>
            )}

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {folders.map(renderFolderPill)}
            </ScrollView>
          </ThemedView>
        )}
      </View>

      {/* Prayer list */}
      <View style={styles.prayerListContainer}>
        {isLoadingPrayers ? (
          <LoadingIndicator size="large" />
        ) : prayers.length === 0 ? (
          <ThemedView style={styles.centeredContainer}>
            <ThemedText style={styles.emptyText}>{t("noFavorites")}</ThemedText>
          </ThemedView>
        ) : (
          <FlatList
            data={prayers}
            extraData={[t]}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderPrayerCard}
            contentContainerStyle={styles.prayerList}
          />
        )}
      </View>
    </ThemedView>
  );
};

export default FavoritePrayersScreen;

// --- Styles -----------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    gap: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "700",
    marginHorizontal: 16,
    marginVertical: 12,
  },
  pillContainer: {
    paddingLeft: 16,
  },
  folderPill: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    opacity: 0.8,
  },
  folderPillActive: {},
  folderPillText: {
    fontSize: 14,
    fontWeight: "600",
  },
  folderPillTextActive: {},
  prayerListContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  prayerList: {
    paddingVertical: 8,
  },
  prayerCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: { elevation: 5 },
    }),
  },
  prayerName: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  prayerArabicTitle: {
    fontSize: 14,
    fontStyle: "italic",
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyText: {
    textAlign: "center",
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 22,
  },
});
