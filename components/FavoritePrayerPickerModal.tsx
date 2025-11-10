//! Fix header aber kein keyboardavoidingView
// import React, { useEffect, useState, useRef, useMemo } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   TextInput,
//   Alert,
//   StyleSheet,
//   ActivityIndicator,
//   KeyboardAvoidingView,
//   Platform,
//   useColorScheme,
// } from "react-native";
// import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { useTranslation } from "react-i18next";
// import { createFolder } from "@/db/queries/prayers";
// import { getFoldersForPrayer } from "@/db/queries/prayers";
// import { getFavoritePrayerFolders } from "@/db/queries/prayers";
// import { removePrayerFromFolder } from "@/db/queries/prayers";
// import { addPrayerToFolder } from "@/db/queries/prayers";
// import { FavoritePrayerFolderType } from "@/constants/Types";
// import { useRefreshFavorites } from "@/stores/refreshFavoriteStore";
// import { Colors } from "@/constants/Colors";

// type Props = {
//   visible: boolean;
//   onClose: () => void;
//   prayerId: number;
//   onFavorited?: () => void;
// };

// const COLORS = [
//   "#1ABC9C",
//   "#2ECC71",
//   "#3498DB",
//   "#9B59B6",
//   "#E74C3C",
//   "#F1C40F",
//   "#F39C12",
//   "#7F8C8D",
//   "#34495E",
//   "#000",
// ] as const;

// export default function CategoryPickerBottomSheet({
//   visible,
//   onClose,
//   prayerId,
//   onFavorited,
// }: Props) {
//   const { t } = useTranslation();
//   const insets = useSafeAreaInsets();
//   const sheetRef = useRef<BottomSheet>(null);
//   const triggerRefresh = useRefreshFavorites((s) => s.triggerRefreshFavorites);

//   const [folders, setFolders] = useState<FavoritePrayerFolderType[]>([]);
//   const [assigned, setAssigned] = useState<Set<string>>(new Set());
//   const [newName, setNewName] = useState("");
//   const [color, setColor] = useState<string>(COLORS[0]);
//   const [loading, setLoading] = useState(false);
//   const colorScheme = useColorScheme() || "light";
//   const snapPoints = useMemo(() => ["70%"], []);

//   // reload both folders and assignments
//   const reload = async () => {
//     const all = await getFavoritePrayerFolders();
//     setFolders(all);
//     const names = await getFoldersForPrayer(prayerId);
//     setAssigned(new Set(names));
//   };

//   useEffect(() => {
//     if (visible) {
//       sheetRef.current?.expand();
//       reload().catch(console.error);
//     } else {
//       sheetRef.current?.close();
//     }
//   }, [visible]);

//   const closeSheet = () => {
//     sheetRef.current?.close();
//     onClose();
//   };

//   // add without prompt
//   const handleAdd = async (f: FavoritePrayerFolderType) => {
//     if (loading) return;
//     setLoading(true);
//     try {
//       if (!assigned.has(f.name)) {
//         await addPrayerToFolder(prayerId, { name: f.name, color: f.color });
//       }
//       triggerRefresh();
//       onFavorited?.();
//       setNewName("");
//       closeSheet();
//     } catch (e) {
//       Alert.alert(t("error"));
//     } finally {
//       setLoading(false);
//       reload().catch(console.error);
//     }
//   };

//   // actual removal after confirm
//   const actuallyRemove = async (f: FavoritePrayerFolderType) => {
//     if (loading) return;
//     setLoading(true);
//     try {
//       await removePrayerFromFolder(prayerId, f.name);
//       triggerRefresh();
//       onFavorited?.();
//       setNewName("");
//     } catch {
//       Alert.alert(t("error"));
//     } finally {
//       setLoading(false);
//       reload().catch(console.error);
//     }
//   };

//   // show confirmation dialog
//   const confirmAndRemove = (f: FavoritePrayerFolderType) => {
//     Alert.alert(
//       t("remove"),
//       t("removeConfirmPrayer", { folder: f.name }),
//       [
//         { text: t("cancel"), style: "cancel" },
//         {
//           text: t("remove"),
//           style: "destructive",
//           onPress: () => actuallyRemove(f),
//         },
//       ],
//       { cancelable: true }
//     );
//   };

//   const handleCreate = async () => {
//     const trimmed = newName.trim();
//     if (!trimmed) {
//       Alert.alert(t("error"), t("noName"));
//       return;
//     }
//     if (loading) return;
//     setLoading(true);
//     try {
//       let folder = folders.find(
//         (x) => x.name.toLowerCase() === trimmed.toLowerCase()
//       );
//       if (!folder) folder = await createFolder(trimmed, color);
//       await handleAdd(folder);
//       setColor(COLORS[0]);
//     } catch {
//       Alert.alert(t("error"));
//       setLoading(false);
//     }
//   };

//   const renderFolder = ({ item }: { item: FavoritePrayerFolderType }) => {
//     const isAssigned = assigned.has(item.name);
//     return (
//       <View style={styles.folderRow}>
//         <View style={styles.rowInfo}>
//           <View style={[styles.colorDot, { backgroundColor: item.color }]} />
//           <Text style={styles.folderName}>{item.name}</Text>
//           <Text style={styles.folderCount}>({item.prayerCount})</Text>
//         </View>
//         {isAssigned ? (
//           <TouchableOpacity
//             style={[styles.actionButton, styles.removeButton]}
//             onPress={() => confirmAndRemove(item)}
//             disabled={loading}
//           >
//             <Text style={styles.actionText}>{t("remove")}</Text>
//           </TouchableOpacity>
//         ) : (
//           <TouchableOpacity
//             style={[styles.actionButton, styles.addButton]}
//             onPress={() => handleAdd(item)}
//             disabled={loading}
//           >
//             <Text style={styles.actionText}>{t("add")}</Text>
//           </TouchableOpacity>
//         )}
//       </View>
//     );
//   };

//   return (

//       <BottomSheet
//         ref={sheetRef}
//         index={-1}
//         snapPoints={snapPoints}
//         enablePanDownToClose
//         onClose={onClose}
//       >
//         <View style={[styles.bottomSheetContainer, { paddingBottom: insets.bottom }]}>
//           <Text style={styles.sectionTitle}>{t("selectFolder")}</Text>

//           <BottomSheetFlatList
//             data={folders}
//             keyExtractor={(item) => item.name}
//             renderItem={renderFolder}
//             contentContainerStyle={styles.listContent}
//             ListEmptyComponent={
//               <Text style={styles.empty}>{t("noFoldersYet")}</Text>
//             }
//           />

//           <View style={styles.divider} />

//           <Text style={styles.sectionTitle}>{t("nameFolder")}</Text>
//            <KeyboardAvoidingView
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//       style={[styles.container]}
//       keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
//       enabled
//     >
//           <TextInput
//             value={newName}
//             onChangeText={setNewName}
//             style={styles.input}
//             editable={!loading}
//           />
//           </KeyboardAvoidingView>
//           <Text style={styles.sectionTitle}>{t("pickColor")}</Text>
//           <View style={styles.colorsWrap}>
//             {COLORS.map((c) => (
//               <TouchableOpacity
//                 key={c}
//                 style={[
//                   styles.colorSelect,
//                   { backgroundColor: c },
//                   c === color && styles.colorActive,
//                 ]}
//                 onPress={() => setColor(c)}
//                 disabled={loading}
//               />
//             ))}
//           </View>
//           <TouchableOpacity
//             style={[styles.primaryBtn, loading && styles.disabled]}
//             onPress={handleCreate}
//             disabled={loading}
//           >
//             {loading ? (
//               <ActivityIndicator color="#fff" />
//             ) : (
//               <Text style={styles.primaryText}>{t("create")}</Text>
//             )}
//           </TouchableOpacity>
//         </View>
//       </BottomSheet>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1
//   },
//   bottomSheetContainer: {
//     flex: 1,
//     paddingHorizontal: 20,
//   },
//   sectionTitle: {
//     fontSize: 17,
//     fontWeight: "600",
//     marginVertical: 8,
//   },
//   listContent: {
//     paddingBottom: 12,
//   },
//   empty: {
//     textAlign: "center",
//     color: "#666",
//     marginVertical: 20,
//   },
//   folderRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingVertical: 10,
//   },
//   rowInfo: { flexDirection: "row", alignItems: "center" },
//   colorDot: {
//     width: 14,
//     height: 14,
//     borderRadius: 7,
//     marginRight: 10,
//   },
//   folderName: { fontSize: 16 },
//   folderCount: {
//     fontSize: 13,
//     color: "#999",
//     marginLeft: 6,
//   },
//   actionButton: {
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     borderRadius: 6,
//   },
//   addButton: { backgroundColor: "#2ECC71" },
//   removeButton: { backgroundColor: "#E74C3C" },
//   actionText: {
//     color: "#fff",
//     fontSize: 14,
//     fontWeight: "500",
//   },
//   divider: {
//     height: 1,
//     backgroundColor: "#eee",
//     marginVertical: 12,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 8,
//     padding: 10,
//     marginBottom: 12,
//   },
//   colorsWrap: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     marginBottom: 12,
//   },
//   colorSelect: {
//     width: 30,
//     height: 30,
//     borderRadius: 15,
//     marginRight: 10,
//     marginBottom: 10,
//     borderWidth: 2,
//     borderColor: "transparent",
//   },
//   colorActive: { borderColor: "#000" },
//   primaryBtn: {
//     backgroundColor: "#2D9CDB",
//     paddingVertical: 14,
//     borderRadius: 10,
//     alignItems: "center",
//     marginBottom: 14,
//   },
//   primaryText: { color: "#fff", fontWeight: "600" },
//   disabled: { opacity: 0.6 },
// });

//! Fix header aber mit keyboardavoidingView buggy
import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
  Keyboard,
} from "react-native";
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { createFolder } from "@/db/queries/prayers";
import { getFoldersForPrayer } from "@/db/queries/prayers";
import { getFavoritePrayerFolders } from "@/db/queries/prayers";
import { removePrayerFromFolder } from "@/db/queries/prayers";
import { addPrayerToFolder } from "@/db/queries/prayers";
import {
  FavoritePrayerFolderType,
  PrayerCategoryType,
  PrayerType,
} from "@/constants/Types";
import { useRefreshFavorites } from "@/stores/refreshFavoriteStore";
import { Colors } from "@/constants/Colors";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { ThemedText } from "./ThemedText";

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
  "#000",
] as const;

export default function FavoritePrayerPickerModal({
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
  const colorScheme = useColorScheme() || "light";

  // Dynamic snap points that adjust for keyboard
  const snapPoints = useMemo(() => ["70%", "90%"], []);

  // reload both folders and assignments
  const reload = useCallback(async () => {
    const all = await getFavoritePrayerFolders();
    setFolders(all);
    const names = await getFoldersForPrayer(prayerId);
    setAssigned(new Set(names));
  }, [prayerId]);

  useEffect(() => {
    if (visible) {
      setNewName("");
      setColor(COLORS[0]);
    }
  }, [visible]);

  useEffect(() => {
    if (visible) {
      sheetRef.current?.expand();
      reload().catch(console.error);
    } else {
      sheetRef.current?.close();
    }
  }, [visible, reload]);

  const closeSheet = () => {
    Keyboard.dismiss();
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
      await reload(); // Reload first
      triggerRefresh(); // Then trigger parent
      onFavorited?.();
      closeSheet();
    } catch (e) {
      Alert.alert(t("error"));
    } finally {
      setLoading(false);
    }
  };

  // actual removal after confirm
  const actuallyRemove = async (f: FavoritePrayerFolderType) => {
    if (loading) return;
    setLoading(true);
    try {
      await removePrayerFromFolder(prayerId, f.name);
      await reload(); // Reload modal state immediately
      triggerRefresh(); // Then trigger parent refresh
      onFavorited?.(); // Then call callback
    } catch {
      Alert.alert(t("error"));
    } finally {
      setLoading(false);
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
      Alert.alert(t("error"), t("noName"));
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
      setNewName("");
    } catch {
      Alert.alert(t("error"));
      setLoading(false);
    }
  };

  const renderFolder = ({ item }: { item: FavoritePrayerFolderType }) => {
    const isAssigned = assigned.has(item.name);
    return (
      <View style={styles.folderRow}>
        <View style={styles.rowInfo}>
          <View style={[styles.colorDot, { backgroundColor: item.color }]} />
          <ThemedText style={styles.folderName}>{item.name}</ThemedText>
          <ThemedText style={styles.folderCount}>
            ({item.prayerCount})
          </ThemedText>
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
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      backgroundStyle={{ backgroundColor: Colors[colorScheme].background }}
    >
      <View
        style={[
          styles.bottomSheetContainer,
          {
            paddingBottom: insets.bottom,
            backgroundColor: Colors[colorScheme].background,
          },
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <ThemedText style={styles.sectionTitle}>
            {t("selectFolder")}
          </ThemedText>
          <Ionicons
            name="close-circle-outline"
            size={24}
            color={Colors[colorScheme].defaultIcon}
            onPress={() => closeSheet()}
          />
        </View>
        <BottomSheetFlatList
          data={folders}
          keyExtractor={(item: PrayerType) => item.name}
          renderItem={renderFolder}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <ThemedText style={styles.empty}>{t("noFoldersYet")}</ThemedText>
          }
        />

        <View style={styles.divider} />

        <ThemedText style={styles.sectionTitle}>{t("nameFolder")}</ThemedText>

        {/* Use BottomSheetTextInput instead of regular TextInput */}
        <BottomSheetTextInput
          value={newName}
          onChangeText={setNewName}
          style={[
            styles.input,
            Platform.OS === "ios" && styles.iosInput,
            {
              color: Colors[colorScheme].text,
            },
          ]}
          editable={!loading}
          placeholder={t("enterFolderName")}
          placeholderTextColor={Colors[colorScheme].text}
        />

        <ThemedText style={styles.sectionTitle}>{t("pickColor")}</ThemedText>
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
            <ThemedText style={styles.primaryText}>{t("create")}</ThemedText>
          )}
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  bottomSheetContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginVertical: 8,
  },
  listContent: {
    paddingBottom: 12,
  },
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
  rowInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  colorDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 10,
  },
  folderName: {
    fontSize: 16,
    flex: 1,
  },
  folderCount: {
    fontSize: 13,
    color: "#999",
    marginLeft: 6,
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 10,
  },
  addButton: {
    backgroundColor: "#2ECC71",
  },
  removeButton: {
    backgroundColor: "#E74C3C",
  },
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
    fontSize: 16,
  },
  iosInput: {
    paddingVertical: 12,
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
  colorActive: {
    borderColor: "#000",
  },
  primaryBtn: {
    backgroundColor: "#2D9CDB",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 14,
  },
  primaryText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  disabled: {
    opacity: 0.6,
  },
});
