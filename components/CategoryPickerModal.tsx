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
// } from "@gorhom/bottom-sheet";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { useTranslation } from "react-i18next";

// import {
//   getFavoritePrayerFolders,
//   createFolder,
//   addPrayerToFolder,
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
//   "#E67E22",
//   "#F1C40F",
//   "#7F8C8D",
//   "#34495E",
//   "#F39C12",
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

//   // existing folders loaded from DB
//   const [folders, setFolders] = useState<FavoritePrayerFolderType[]>([]);
//   // new-folder name & selected color
//   const [newFolderName, setNewFolderName] = useState("");
//   const [selectedColor, setSelectedColor] = useState<string>(
//     HARD_CODED_COLORS[0]
//   );
//   const [isProcessing, setIsProcessing] = useState(false);

//   const snapPoints = useMemo(() => ["50%", "90%"], []);

//   // open/close sheet
//   useEffect(() => {
//     if (visible) {
//       sheetRef.current?.snapToIndex(1);
//     } else {
//       sheetRef.current?.close();
//     }
//   }, [visible]);

//   // load folders on open
//   useEffect(() => {
//     if (!visible) return;
//     getFavoritePrayerFolders()
//       .then((arr) => setFolders(arr))
//       .catch((err) => {
//         console.error("Failed to load folders:", err);
//         Alert.alert(t("toast.error"), t("FavoriteCategories.loadFailed"));
//       });
//   }, [visible, t]);

//   // user tapped an existing folder → simply add prayer there
//   const handleSelectExisting = async (folder: FavoritePrayerFolderType) => {
//     setIsProcessing(true);
//     try {
//       await addPrayerToFolder(prayerId, {
//         name: folder.name,
//         color: folder.color,
//       });
//       onClose();
//       onFavorited?.();
//     } catch (err) {
//       console.error("Error adding to existing folder:", err);
//       Alert.alert(t("toast.error"), t("FavoriteCategories.addFailed"));
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   // user tapped “Create & Add”
//   const handleCreateNew = async () => {
//     const name = newFolderName.trim();
//     if (name.length === 0) {
//       Alert.alert(t("toast.error"), t("FavoriteCategories.nameRequired"));
//       return;
//     }

//     // check name collision (case-insensitive)
//     const existing = folders.find(
//       (f) => f.name.trim().toLowerCase() === name.toLowerCase()
//     );
//     if (existing) {
//       // if folder exists, just add the prayer there
//       handleSelectExisting(existing);
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

//   const renderFolder = ({ item }: { item: FavoritePrayerFolderType }) => (
//     <TouchableOpacity
//       style={styles.row}
//       onPress={() => handleSelectExisting(item)}
//       disabled={isProcessing}
//     >
//       <View style={[styles.dot, { backgroundColor: item.color }]} />
//       <Text style={styles.folderText}>
//         {item.name} <Text style={styles.countText}>({item.prayerCount})</Text>
//       </Text>
//     </TouchableOpacity>
//   );

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

//   return (
//     <BottomSheet
//       ref={sheetRef}
//       index={-1}
//       snapPoints={snapPoints}
//       enablePanDownToClose
//       onClose={onClose}
//     >
//       <BottomSheetView
//         style={[styles.container, { paddingBottom: insets.bottom }]}
//       >
//         <Text style={styles.title}>{t("FavoriteCategories.selectFolder")}</Text>

//         <BottomSheetFlatList
//           data={folders}
//           keyExtractor={(item) => item.name}
//           renderItem={renderFolder}
//           contentContainerStyle={styles.listContainer}
//           ListEmptyComponent={
//             <Text style={styles.emptyText}>
//               {t("FavoriteCategories.noFoldersYet")}
//             </Text>
//           }
//         />

//         <View style={styles.divider} />

//         <Text style={styles.subtitle}>{t("FavoriteCategories.newFolder")}</Text>
//         <TextInput
//           placeholder={t("FavoriteCategories.namePlaceholder")}
//           value={newFolderName}
//           onChangeText={setNewFolderName}
//           style={styles.input}
//           editable={!isProcessing}
//         />

//         <Text style={styles.subtitle}>{t("FavoriteCategories.pickColor")}</Text>
//         <View style={styles.swatchContainer}>
//           {HARD_CODED_COLORS.map(renderColorSwatch)}
//         </View>

//         <TouchableOpacity
//           onPress={handleCreateNew}
//           disabled={isProcessing}
//           style={[styles.button, isProcessing && styles.buttonDisabled]}
//         >
//           {isProcessing ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <Text style={styles.buttonText}>
//               {t("FavoriteCategories.createButton")}
//             </Text>
//           )}
//         </TouchableOpacity>

//         <TouchableOpacity
//           onPress={onClose}
//           disabled={isProcessing}
//           style={styles.cancel}
//         >
//           <Text style={styles.cancelText}>{t("cancel")}</Text>
//         </TouchableOpacity>
//       </BottomSheetView>
//     </BottomSheet>
//   );
// };

// export default CategoryPickerBottomSheet;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
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
import BottomSheet, {
  BottomSheetView,
  BottomSheetFlatList,
} from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import {
  getFavoritePrayerFolders,
  getFoldersForPrayer,
  createFolder,
  addPrayerToFolder,
  removePrayerFromFolder,
} from "@/utils/bufibDatabase";
import { FavoritePrayerFolderType } from "@/constants/Types";

type Props = {
  visible: boolean;
  onClose: () => void;
  prayerId: number;
  onFavorited?: () => void;
};

const HARD_CODED_COLORS = [
  "#1ABC9C",
  "#2ECC71",
  "#3498DB",
  "#9B59B6",
  "#E74C3C",
  "#E67E22",
  "#F1C40F",
  "#7F8C8D",
  "#34495E",
  "#F39C12",
];

const CategoryPickerBottomSheet: React.FC<Props> = ({
  visible,
  onClose,
  prayerId,
  onFavorited,
}) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const sheetRef = useRef<BottomSheet>(null);

  // All folders (name, color, prayerCount)
  const [folders, setFolders] = useState<FavoritePrayerFolderType[]>([]);
  // Set of folder names this prayer is already in
  const [assignedNames, setAssignedNames] = useState<Set<string>>(new Set());
  // New-folder inputs
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedColor, setSelectedColor] = useState<string>(
    HARD_CODED_COLORS[0]
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const snapPoints = useMemo(() => ["50%", "90%"], []);

  // Open/close sheet
  useEffect(() => {
    if (visible) {
      sheetRef.current?.snapToIndex(1);
    } else {
      sheetRef.current?.close();
    }
  }, [visible]);

  // Load folders + which folders contain this prayer
  useEffect(() => {
    if (!visible) return;
    (async () => {
      try {
        // 1) Load all folders
        const arr = await getFavoritePrayerFolders();
        setFolders(arr);

        // 2) Load just the folder names that the current prayerId is in
        const names = await getFoldersForPrayer(prayerId);
        setAssignedNames(new Set(names));
      } catch (err) {
        console.error("Failed to load folders or assignments:", err);
        Alert.alert(t("toast.error"), t("FavoriteCategories.loadFailed"));
      }
    })();
  }, [visible, prayerId, t]);

  // Add prayer to a folder
  const handleAddToFolder = async (folder: FavoritePrayerFolderType) => {
    setIsProcessing(true);
    try {
      await addPrayerToFolder(prayerId, {
        name: folder.name,
        color: folder.color,
      });
      onClose();
      onFavorited?.();
    } catch (err) {
      console.error("Error adding to folder:", err);
      Alert.alert(t("toast.error"), t("FavoriteCategories.addFailed"));
    } finally {
      setIsProcessing(false);
    }
  };

  // Remove prayer from a folder
  const handleRemoveFromFolder = async (folderName: string) => {
    setIsProcessing(true);
    try {
      await removePrayerFromFolder(prayerId, folderName);
      onClose();
      onFavorited?.();
    } catch (err) {
      console.error("Error removing from folder:", err);
      Alert.alert(t("toast.error"), t("FavoriteCategories.removeFailed"));
    } finally {
      setIsProcessing(false);
    }
  };

  // Create a new folder & add prayer
  const handleCreateNew = async () => {
    const name = newFolderName.trim();
    if (name.length === 0) {
      Alert.alert(t("toast.error"), t("FavoriteCategories.nameRequired"));
      return;
    }
    // If folder already exists, just add to it
    const existing = folders.find(
      (f) => f.name.trim().toLowerCase() === name.toLowerCase()
    );
    if (existing) {
      handleAddToFolder(existing);
      return;
    }

    setIsProcessing(true);
    try {
      const newFolder = await createFolder(name, selectedColor);
      await addPrayerToFolder(prayerId, newFolder);
      onClose();
      onFavorited?.();
    } catch (err) {
      console.error("Error creating folder or adding prayer:", err);
      Alert.alert(t("toast.error"), t("FavoriteCategories.createFailed"));
    } finally {
      setIsProcessing(false);
    }
  };

  // Render each folder row: show “Add” or “Remove” depending on assignedNames
  const renderFolder = ({ item }: { item: FavoritePrayerFolderType }) => {
    const isAssigned = assignedNames.has(item.name);
    return (
      <View style={styles.row}>
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <View style={[styles.dot, { backgroundColor: item.color }]} />
          <Text style={styles.folderText}>
            {item.name} <Text style={styles.countText}>({item.prayerCount})</Text>
          </Text>
        </View>

        {isAssigned ? (
          <TouchableOpacity
            onPress={() => handleRemoveFromFolder(item.name)}
            disabled={isProcessing}
            style={[styles.actionButton, styles.removeButton]}
          >
            <Text style={styles.actionText}>
              {t("FavoriteCategories.remove")}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => handleAddToFolder(item)}
            disabled={isProcessing}
            style={[styles.actionButton, styles.addButton]}
          >
            <Text style={styles.actionText}>{t("FavoriteCategories.add")}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderColorSwatch = (colorHex: string) => {
    const isSelected = colorHex === selectedColor;
    return (
      <TouchableOpacity
        key={colorHex}
        style={[
          styles.swatch,
          { backgroundColor: colorHex },
          isSelected && styles.swatchSelected,
        ]}
        onPress={() => setSelectedColor(colorHex)}
        disabled={isProcessing}
      />
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
      <BottomSheetView
        style={[styles.container, { paddingBottom: insets.bottom }]}
      >
        <Text style={styles.title}>{t("FavoriteCategories.selectFolder")}</Text>

        <BottomSheetFlatList
          data={folders}
          keyExtractor={(item) => item.name}
          renderItem={renderFolder}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {t("FavoriteCategories.noFoldersYet")}
            </Text>
          }
        />

        <View style={styles.divider} />

        <Text style={styles.subtitle}>{t("FavoriteCategories.newFolder")}</Text>
        <TextInput
          placeholder={t("FavoriteCategories.namePlaceholder")}
          value={newFolderName}
          onChangeText={setNewFolderName}
          style={styles.input}
          editable={!isProcessing}
        />

        <Text style={styles.subtitle}>{t("FavoriteCategories.pickColor")}</Text>
        <View style={styles.swatchContainer}>
          {HARD_CODED_COLORS.map(renderColorSwatch)}
        </View>

        <TouchableOpacity
          onPress={handleCreateNew}
          disabled={isProcessing}
          style={[styles.button, isProcessing && styles.buttonDisabled]}
        >
          {isProcessing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {t("FavoriteCategories.createButton")}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onClose}
          disabled={isProcessing}
          style={styles.cancel}
        >
          <Text style={styles.cancelText}>{t("cancel")}</Text>
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default CategoryPickerBottomSheet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  listContainer: {
    paddingBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 10,
  },
  folderText: {
    fontSize: 16,
  },
  countText: {
    color: "#555",
    fontSize: 14,
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  addButton: {
    backgroundColor: "#2ECC71",
  },
  removeButton: {
    backgroundColor: "#E74C3C",
  },
  actionText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  emptyText: {
    textAlign: "center",
    color: "#777",
    marginVertical: 20,
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 16,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 16,
  },
  swatchContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    marginBottom: 20,
  },
  swatch: {
    width: 32,
    height: 32,
    borderRadius: 16,
    margin: 6,
    borderWidth: 2,
    borderColor: "transparent",
  },
  swatchSelected: {
    borderColor: "#000",
  },
  button: {
    backgroundColor: "#2196F3",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  cancel: {
    alignItems: "center",
    paddingVertical: 12,
  },
  cancelText: {
    color: "#888",
    fontSize: 14,
  },
});
