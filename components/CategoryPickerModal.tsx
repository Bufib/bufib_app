// import React, { useEffect, useState, useRef, useMemo } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   TextInput,
//   Alert,
//   StyleSheet,
//   ActivityIndicator,
// } from "react-native";
// import BottomSheet, {
//   BottomSheetView,
//   BottomSheetFlatList,
//   BottomSheetFooter,
// } from "@gorhom/bottom-sheet";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { useTranslation } from "react-i18next";
// import {
//   getFavoritePrayerFolders,
//   getFoldersForPrayer,
//   createFolder,
//   addPrayerToFolder,
//   removePrayerFromFolder,
// } from "@/utils/bufibDatabase";
// import { FavoritePrayerFolderType } from "@/constants/Types";

// type Props = {
//   visible: boolean;
//   onClose: () => void;
//   prayerId: number;
//   onFavorited?: () => void;
// };

// const HARD_CODED_COLORS = [
//   "#1ABC9C",
//   "#2ECC71",
//   "#3498DB",
//   "#9B59B6",
//   "#E74C3C",
//   "#F1C40F",
//   "#F39C12",
//   "#7F8C8D",
//   "#34495E",
// ];

// const CategoryPickerBottomSheet: React.FC<Props> = ({
//   visible,
//   onClose,
//   prayerId,
//   onFavorited,
// }) => {
//   const { t } = useTranslation();
//   const insets = useSafeAreaInsets();
//   const sheetRef = useRef<BottomSheet>(null);

//   // All folders (name, color, prayerCount)
//   const [folders, setFolders] = useState<FavoritePrayerFolderType[]>([]);
//   // Set of folder names this prayer is already in
//   const [assignedNames, setAssignedNames] = useState<Set<string>>(new Set());
//   // New-folder inputs
//   const [newFolderName, setNewFolderName] = useState("");
//   const [selectedColor, setSelectedColor] = useState<string>(
//     HARD_CODED_COLORS[0]
//   );
//   const [isProcessing, setIsProcessing] = useState(false);

//   const snapPoints = useMemo(() => ["50%", "90%"], []);

//   // Open/close sheet
//   useEffect(() => {
//     if (visible) {
//       sheetRef.current?.snapToIndex(1);
//     } else {
//       sheetRef.current?.close();
//     }
//   }, [visible]);

//   // Load folders + which folders contain this prayer
//   useEffect(() => {
//     if (!visible) return;
//     (async () => {
//       try {
//         // 1) Load all folders
//         const arr = await getFavoritePrayerFolders();
//         setFolders(arr);

//         // 2) Load just the folder names that the current prayerId is in
//         const names = await getFoldersForPrayer(prayerId);
//         setAssignedNames(new Set(names));
//       } catch (err) {
//         console.error("Failed to load folders or assignments:", err);
//         Alert.alert(t("toast.error"), t("loadFailed"));
//       }
//     })();
//   }, [visible, prayerId, t]);

//   // Add prayer to a folder
//   const handleAddToFolder = async (folder: FavoritePrayerFolderType) => {
//     setIsProcessing(true);
//     try {
//       await addPrayerToFolder(prayerId, {
//         name: folder.name,
//         color: folder.color,
//       });
//       onClose();
//       onFavorited?.();
//     } catch (err) {
//       console.error("Error adding to folder:", err);
//       Alert.alert(t("toast.error"), t("FavoriteCategories.addFailed"));
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   // Remove prayer from a folder
//   const handleRemoveFromFolder = async (folderName: string) => {
//     setIsProcessing(true);
//     try {
//       await removePrayerFromFolder(prayerId, folderName);
//       onClose();
//       onFavorited?.();
//     } catch (err) {
//       console.error("Error removing from folder:", err);
//       Alert.alert(t("toast.error"), t("FavoriteCategories.removeFailed"));
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   // Create a new folder & add prayer
//   const handleCreateNew = async () => {
//     const name = newFolderName.trim();
//     if (name.length === 0) {
//       Alert.alert(t("toast.error"), t("FavoriteCategories.nameRequired"));
//       return;
//     }
//     // If folder already exists, just add to it
//     const existing = folders.find(
//       (f) => f.name.trim().toLowerCase() === name.toLowerCase()
//     );
//     if (existing) {
//       handleAddToFolder(existing);
//       return;
//     }

//     setIsProcessing(true);
//     try {
//       const newFolder = await createFolder(name, selectedColor);
//       await addPrayerToFolder(prayerId, newFolder);
//       onClose();
//       onFavorited?.();
//     } catch (err) {
//       console.error("Error creating folder or adding prayer:", err);
//       Alert.alert(t("toast.error"), t("FavoriteCategories.createFailed"));
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   // Render each folder row: show “Add” or “Remove” depending on assignedNames
//   const renderFolder = ({ item }: { item: FavoritePrayerFolderType }) => {
//     const isAssigned = assignedNames.has(item.name);
//     return (
//       <View style={styles.row}>
//         <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
//           <View style={[styles.dot, { backgroundColor: item.color, gap: 10 }]} />
//           <Text style={styles.folderText}>
//             {item.name} {""}
//             <Text style={styles.countText}>({item.prayerCount})</Text>
//           </Text>
//         </View>

//         {isAssigned ? (
//           <TouchableOpacity
//             onPress={() => handleRemoveFromFolder(item.name)}
//             disabled={isProcessing}
//             style={[styles.actionButton, styles.removeButton]}
//           >
//             <Text style={styles.actionText}>{t("remove")}</Text>
//           </TouchableOpacity>
//         ) : (
//           <TouchableOpacity
//             onPress={() => handleAddToFolder(item)}
//             disabled={isProcessing}
//             style={[styles.actionButton, styles.addButton]}
//           >
//             <Text style={styles.actionText}>{t("FavoriteCategories.add")}</Text>
//           </TouchableOpacity>
//         )}
//       </View>
//     );
//   };

//   const renderColorSwatch = (colorHex: string) => {
//     const isSelected = colorHex === selectedColor;
//     return (
//       <TouchableOpacity
//         key={colorHex}
//         style={[
//           styles.swatch,
//           { backgroundColor: colorHex },
//           isSelected && styles.swatchSelected,
//         ]}
//         onPress={() => setSelectedColor(colorHex)}
//         disabled={isProcessing}
//       />
//     );
//   };

//   const FolderFooter: React.FC = () => (
//     <View style={{ flex: 1 }}>
//       <Text style={styles.subtitle}>{t("nameFolder")}</Text>
//       <TextInput
//         value={newFolderName}
//         onChangeText={setNewFolderName}
//         style={styles.input}
//         editable={!isProcessing}
//       />

//       <Text style={styles.subtitle}>{t("pickColor")}</Text>
//       <View style={styles.swatchContainer}>
//         {HARD_CODED_COLORS.map(renderColorSwatch)}
//       </View>

//       <TouchableOpacity
//         onPress={handleCreateNew}
//         disabled={isProcessing}
//         style={[styles.button, isProcessing && styles.buttonDisabled]}
//       >
//         {isProcessing ? (
//           <ActivityIndicator color="#fff" />
//         ) : (
//           <Text style={styles.buttonText}>{t("create")}</Text>
//         )}
//       </TouchableOpacity>

//       <TouchableOpacity
//         onPress={onClose}
//         disabled={isProcessing}
//         style={styles.cancel}
//       >
//         <Text style={styles.cancelText}>{t("cancel")}</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   return (
//     <BottomSheet
//       ref={sheetRef}
//       index={-1}
//       snapPoints={snapPoints}
//       enablePanDownToClose
//       onClose={onClose}
//       footerComponent={FolderFooter}
//     >
//       <BottomSheetView
//         style={[styles.container, { paddingBottom: insets.bottom, flex: 1 }]}
//       >
//         <Text style={styles.title}>{t("FavoriteCategories.selectFolder")}</Text>
//         <BottomSheetFlatList
//           data={folders}
//           keyExtractor={(item) => item.name}
//           showsVerticalScrollIndicator={true}
//           renderItem={renderFolder}
//           nestedScrollEnabled={true}
//           style={{ flex: 1 }}
//           contentContainerStyle={styles.listContainer}
//           ListEmptyComponent={
//             <Text style={styles.emptyText}>
//               {t("FavoriteCategories.noFoldersYet")}
//             </Text>
//           }
//         />
//         <View style={styles.divider} />
//       </BottomSheetView>
//     </BottomSheet>
//   );
// };

// export default CategoryPickerBottomSheet;

// const styles = StyleSheet.create({
//   container: {
//     paddingHorizontal: 16,
//     paddingTop: 12,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: "600",
//     marginBottom: 8,
//     textAlign: "center",
//   },
//   listContainer: {
//     paddingBottom: 12,
//   },
//   row: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 10,
//     justifyContent: "space-between",
//   },
//   dot: {
//     width: 16,
//     height: 16,
//     borderRadius: 8,
//     marginRight: 10,
//   },
//   folderText: {
//     fontSize: 16,
//   },
//   countText: {
//     color: "#555",
//     fontSize: 14,
//   },
//   actionButton: {
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     borderRadius: 6,
//   },
//   addButton: {
//     backgroundColor: "#2ECC71",
//   },
//   removeButton: {
//     backgroundColor: "#E74C3C",
//   },
//   actionText: {
//     color: "white",
//     fontSize: 14,
//     fontWeight: "500",
//   },
//   emptyText: {
//     textAlign: "center",
//     color: "#777",
//     marginVertical: 20,
//     fontSize: 14,
//   },
//   divider: {
//     height: 1,
//     backgroundColor: "#eee",
//     marginVertical: 16,
//   },
//   subtitle: {
//     fontSize: 16,
//     fontWeight: "500",
//     marginBottom: 8,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 6,
//     padding: 10,
//     marginBottom: 16,
//   },
//   swatchContainer: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "flex-start",
//     marginBottom: 20,
//   },
//   swatch: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     margin: 6,
//     borderWidth: 2,
//     borderColor: "transparent",
//   },
//   swatchSelected: {
//     borderColor: "#000",
//   },
//   button: {
//     backgroundColor: "#2196F3",
//     paddingVertical: 14,
//     borderRadius: 8,
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   buttonDisabled: {
//     opacity: 0.6,
//   },
//   buttonText: {
//     color: "#fff",
//     fontWeight: "600",
//     fontSize: 16,
//   },
//   cancel: {
//     alignItems: "center",
//     paddingVertical: 12,
//   },
//   cancelText: {
//     color: "#888",
//     fontSize: 14,
//   },
// });

import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { createFolder } from "@/db/queries/prayers";
import { getFoldersForPrayer } from "@/db/queries/prayers";
import { getFavoritePrayerFolders } from "@/db/queries/prayers";
import { removePrayerFromFolder } from "@/db/queries/prayers";
import { addPrayerToFolder } from "@/db/queries/prayers";
import { FavoritePrayerFolderType } from "@/constants/Types";
import { useRefreshFavorites } from "@/stores/refreshFavoriteStore";

type Props = {
  visible: boolean;
  onClose: () => void;
  prayerId: number;
  onFavorited?: () => void;
};

const COLORS = [
  "#1ABC9C",
  "#2ECC71",
  "#3498DB",
  "#9B59B6",
  "#E74C3C",
  "#F1C40F",
  "#F39C12",
  "#7F8C8D",
  "#34495E",
] as const;

export default function CategoryPickerBottomSheet({
  visible,
  onClose,
  prayerId,
  onFavorited,
}: Props) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const sheetRef = useRef<BottomSheet>(null);
  const triggerRefresh = useRefreshFavorites((s) => s.triggerRefreshFavorites);

  const [folders, setFolders] = useState<FavoritePrayerFolderType[]>([]);
  const [assigned, setAssigned] = useState<Set<string>>(new Set());
  const [newName, setNewName] = useState("");
  const [color, setColor] = useState<string>(COLORS[0]);
  const [loading, setLoading] = useState(false);

  const snapPoints = useMemo(() => ["55%", "92%"], []);

  // reload both folders and assignments
  const reload = async () => {
    const all = await getFavoritePrayerFolders();
    setFolders(all);
    const names = await getFoldersForPrayer(prayerId);
    setAssigned(new Set(names));
  };

  useEffect(() => {
    if (visible) {
      sheetRef.current?.expand();
      reload().catch(console.error);
    } else {
      sheetRef.current?.close();
    }
  }, [visible]);

  const closeSheet = () => {
    sheetRef.current?.close();
    onClose();
  };

  // add without prompt
  const handleAdd = async (f: FavoritePrayerFolderType) => {
    if (loading) return;
    setLoading(true);
    try {
      if (!assigned.has(f.name)) {
        await addPrayerToFolder(prayerId, { name: f.name, color: f.color });
      }
      triggerRefresh();
      onFavorited?.();
      setNewName("");
      closeSheet();
    } catch (e) {
      Alert.alert(t("toast.error"));
    } finally {
      setLoading(false);
      reload().catch(console.error);
    }
  };

  // actual removal after confirm
  const actuallyRemove = async (f: FavoritePrayerFolderType) => {
    if (loading) return;
    setLoading(true);
    try {
      await removePrayerFromFolder(prayerId, f.name);
      triggerRefresh();
      onFavorited?.();
      setNewName("");
    } catch {
      Alert.alert(t("toast.error"));
    } finally {
      setLoading(false);
      reload().catch(console.error);
    }
  };

  // show confirmation dialog
  const confirmAndRemove = (f: FavoritePrayerFolderType) => {
    Alert.alert(
      t("remove"),
      t("removeConfirmPrayer", { folder: f.name }),
      [
        { text: t("cancel"), style: "cancel" },
        {
          text: t("remove"),
          style: "destructive",
          onPress: () => actuallyRemove(f),
        },
      ],
      { cancelable: true }
    );
  };

  const handleCreate = async () => {
    const trimmed = newName.trim();
    if (!trimmed) {
      Alert.alert(t("toast.error"), t("nameRequired"));
      return;
    }
    if (loading) return;
    setLoading(true);
    try {
      let folder = folders.find(
        (x) => x.name.toLowerCase() === trimmed.toLowerCase()
      );
      if (!folder) folder = await createFolder(trimmed, color);
      await handleAdd(folder);
      setColor(COLORS[0]);
    } catch {
      Alert.alert(t("toast.error"));
      setLoading(false);
    }
  };

  const renderFolder = ({ item }: { item: FavoritePrayerFolderType }) => {
    const isAssigned = assigned.has(item.name);
    return (
      <View style={styles.folderRow}>
        <View style={styles.rowInfo}>
          <View style={[styles.colorDot, { backgroundColor: item.color }]} />
          <Text style={styles.folderName}>{item.name}</Text>
          <Text style={styles.folderCount}>({item.prayerCount})</Text>
        </View>
        {isAssigned ? (
          <TouchableOpacity
            style={[styles.actionButton, styles.removeButton]}
            onPress={() => confirmAndRemove(item)}
            disabled={loading}
          >
            <Text style={styles.actionText}>{t("remove")}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.actionButton, styles.addButton]}
            onPress={() => handleAdd(item)}
            disabled={loading}
          >
            <Text style={styles.actionText}>{t("add")}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      onClose={onClose}
    >
      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
        <Text style={styles.sectionTitle}>{t("selectFolder")}</Text>

        <BottomSheetFlatList
          data={folders}
          keyExtractor={(item) => item.name}
          renderItem={renderFolder}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.empty}>{t("noFoldersYet")}</Text>
          }
        />

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>{t("nameFolder")}</Text>
        <TextInput
          value={newName}
          onChangeText={setNewName}
          style={styles.input}
          editable={!loading}
        />
        <Text style={styles.sectionTitle}>{t("pickColor")}</Text>
        <View style={styles.colorsWrap}>
          {COLORS.map((c) => (
            <TouchableOpacity
              key={c}
              style={[
                styles.colorSelect,
                { backgroundColor: c },
                c === color && styles.colorActive,
              ]}
              onPress={() => setColor(c)}
              disabled={loading}
            />
          ))}
        </View>
        <TouchableOpacity
          style={[styles.primaryBtn, loading && styles.disabled]}
          onPress={handleCreate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryText}>{t("create")}</Text>
          )}
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginVertical: 8,
  },
  listContent: { paddingBottom: 12 },
  empty: {
    textAlign: "center",
    color: "#666",
    marginVertical: 20,
  },
  folderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  rowInfo: { flexDirection: "row", alignItems: "center" },
  colorDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 10,
  },
  folderName: { fontSize: 16 },
  folderCount: {
    fontSize: 13,
    color: "#999",
    marginLeft: 6,
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  addButton: { backgroundColor: "#2ECC71" },
  removeButton: { backgroundColor: "#E74C3C" },
  actionText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  colorsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  colorSelect: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "transparent",
  },
  colorActive: { borderColor: "#000" },
  primaryBtn: {
    backgroundColor: "#2D9CDB",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 14,
  },
  primaryText: { color: "#fff", fontWeight: "600" },
  disabled: { opacity: 0.6 },
});
