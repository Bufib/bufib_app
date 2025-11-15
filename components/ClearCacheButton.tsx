//! WOrks but without return function
// import React, { useCallback, useState } from "react";
// import {
//   Alert,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
// } from "react-native";
// import * as FileSystem from "expo-file-system/legacy";
// import { useTranslation } from "react-i18next";
// import { LoadingIndicator } from "./LoadingIndicator";

// async function clearAppCache(): Promise<void> {
//   const cacheDir = FileSystem.cacheDirectory;
//   if (!cacheDir) return;

//   const items = await FileSystem.readDirectoryAsync(cacheDir);
//   await Promise.all(
//     items.map((name) =>
//       FileSystem.deleteAsync(cacheDir + name, { idempotent: true })
//     )
//   );
// }

// const ClearAppCacheButton: React.FC = () => {
//   const { t } = useTranslation();
//   const [isClearing, setIsClearing] = useState(false);

//   const handlePress = useCallback(() => {
//     Alert.alert(
//       t("clearAppCacheConfirmTitle"),
//       t("clearAppCacheConfirmMessage"),
//       [
//         { text: t("cancel"), style: "cancel" },
//         {
//           text: t("delete"),
//           style: "destructive",
//           onPress: async () => {
//             try {
//               setIsClearing(true);
//               await clearAppCache();
//               Alert.alert(t("successTitle"), t("clearAppCacheSuccessMessage"));
//             } catch {
//               Alert.alert(t("errorTitle"), t("clearAppCacheErrorMessage"));
//             } finally {
//               setIsClearing(false);
//             }
//           },
//         },
//       ]
//     );
//   }, [t]);

//   return (
//     <TouchableOpacity
//       style={[styles.button, isClearing && styles.buttonDisabled]}
//       onPress={handlePress}
//       disabled={isClearing}
//       activeOpacity={0.7}
//     >
//       {isClearing ? (
//         <LoadingIndicator size={"large"} />
//       ) : (
//         <Text style={styles.label}>{t("clearAppCache")}</Text>
//       )}
//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({
//   button: {
//     paddingVertical: 10,
//     paddingHorizontal: 16,
//     borderRadius: 8,
//     backgroundColor: "#EF4444",
//     alignItems: "center",
//     justifyContent: "center",
//     alignSelf: "flex-start",
//   },
//   buttonDisabled: {
//     opacity: 0.6,
//   },
//   label: {
//     color: "#FFFFFF",
//     fontSize: 16,
//   },
// });

// export default ClearAppCacheButton;

import React, { useCallback, useState, useRef, useEffect } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity } from "react-native";
import * as FileSystem from "expo-file-system/legacy";
import { useTranslation } from "react-i18next";
import { LoadingIndicator } from "./LoadingIndicator";

async function clearAppCache(): Promise<void> {
  const cacheDir = FileSystem.cacheDirectory;
  if (!cacheDir) return;

  const items = await FileSystem.readDirectoryAsync(cacheDir);
  await Promise.all(
    items.map((name) =>
      FileSystem.deleteAsync(cacheDir + name, { idempotent: true })
    )
  );
}

const ClearAppCacheButton: React.FC = () => {
  const { t } = useTranslation();
  const [isClearing, setIsClearing] = useState(false);
  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handlePress = useCallback(() => {
    Alert.alert(
      t("clearAppCacheConfirmTitle"),
      t("clearAppCacheConfirmMessage"),
      [
        { text: t("cancel"), style: "cancel" },
        {
          text: t("delete"),
          style: "destructive",
          onPress: async () => {
            try {
              setIsClearing(true);
              await clearAppCache();

              if (isMountedRef.current) {
                Alert.alert(
                  t("successTitle"),
                  t("clearAppCacheSuccessMessage")
                );
              }
            } catch {
              if (isMountedRef.current) {
                Alert.alert(t("errorTitle"), t("clearAppCacheErrorMessage"));
              }
            } finally {
              if (isMountedRef.current) {
                setIsClearing(false);
              }
            }
          },
        },
      ]
    );
  }, [t]);

  return (
    <TouchableOpacity
      style={[styles.button, isClearing && styles.buttonDisabled]}
      onPress={handlePress}
      disabled={isClearing}
      activeOpacity={0.7}
    >
      {isClearing ? (
        <LoadingIndicator size="large" />
      ) : (
        <Text style={styles.label}>{t("clearAppCache")}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  label: {
    color: "#FFFFFF",
    fontSize: 16,
  },
});

export default ClearAppCacheButton;
