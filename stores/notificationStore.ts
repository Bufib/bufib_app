// import { create } from "zustand";
// import { persist, createJSONStorage } from "zustand/middleware";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import * as Notifications from "expo-notifications";
// import { Alert, Linking, Platform } from "react-native";
// import { useAuthStore } from "./authStore";
// import { supabase } from "@/utils/supabase";

// type NotificationState = {
//   getNotifications: boolean;
//   permissionStatus: Notifications.PermissionStatus | "undetermined";
//   toggleGetNotifications: () => Promise<void>;
//   checkPermissions: () => Promise<void>;
// };

// const showPermissionAlert = () => {
//   Alert.alert(
//     "Push-Benachrichtigungen Deaktiviert",
//     "Um Benachrichtigungen zu erhalten, aktiviere diese bitte in deinen Einstellungen.",
//     [
//       { text: "Abbrechen", style: "cancel" },
//       { text: "Einstellungen öffnen", onPress: () => Linking.openSettings() },
//     ]
//   );
// };

// const useNotificationStore = create<NotificationState>()(
//   persist(
//     (set, get) => {
//       // Removed AppState listener from here.
//       return {
//         getNotifications: Platform.OS === "ios" ? false : true,
//         permissionStatus: "undetermined",
//         checkPermissions: async () => {
//           try {
//             const { status } = await Notifications.getPermissionsAsync();
//             set({ permissionStatus: status });
//           } catch (error) {
//             console.error("Error checking permissions:", error);
//           }
//         },
//         toggleGetNotifications: async () => {
//           const currentState = get().getNotifications;
//           const currentPermission = get().permissionStatus;

//           try {
//             if (!currentState) {
//               if (currentPermission === "undetermined") {
//                 const { status } =
//                   await Notifications.requestPermissionsAsync();
//                 set({ permissionStatus: status });
//                 if (status !== "granted") {
//                   showPermissionAlert();
//                   return;
//                 }
//               } else if (currentPermission !== "granted") {
//                 showPermissionAlert();
//                 return;
//               }
//             }

//             set({ getNotifications: !currentState });

//             if (currentState) {
//               const userId = useAuthStore.getState().session?.user?.id;
//               if (userId) {
//                 await Promise.all([
//                   supabase.from("user_tokens").delete().eq("user_id", userId),
//                   supabase
//                     .from("pending_notification")
//                     .delete()
//                     .eq("user_id", userId),
//                 ]);
//               }
//             }
//           } catch (error) {
//             console.log(error);
//             Alert.alert(
//               "Keine Internetverbindung",
//               "Die Änderungen konnte nicht vorgenommen werden, weil keine Internetverbindung besteht.",
//               [{ text: "OK" }]
//             );
//           }
//         },
//       };
//     },
//     {
//       name: "notification-storage",
//       storage: createJSONStorage(() => AsyncStorage),
//     }
//   )
// );

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { Alert, Linking, Platform } from "react-native";

type NotificationState = {
  getNotifications: boolean;
  permissionStatus: Notifications.PermissionStatus | "undetermined";
  checkPermissions: () => Promise<void>;
  toggleGetNotifications: () => Promise<void>;
};

const showPermissionAlert = () => {
  Alert.alert(
    "Push-Benachrichtigungen Deaktiviert",
    "Um Benachrichtigungen zu erhalten, aktiviere diese bitte in deinen Einstellungen.",
    [
      { text: "Abbrechen", style: "cancel" },
      { text: "Einstellungen öffnen", onPress: () => Linking.openSettings() },
    ]
  );
};

const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      // Default off on iOS (must opt in), on on Android
      getNotifications: Platform.OS === "ios" ? false : true,
      permissionStatus: "undetermined",

      // Sync store with OS permission status
      checkPermissions: async () => {
        try {
          const { status } = await Notifications.getPermissionsAsync();
          set({ permissionStatus: status });
        } catch (error) {
          console.error("Error checking notification permissions:", error);
        }
      },

      // Flip opt-in flag (hook will handle token insert/delete)
      toggleGetNotifications: async () => {
        const currentlyOn = get().getNotifications;
        const currentPermission = get().permissionStatus;

        try {
          // If turning ON, ensure we have permission
          if (!currentlyOn) {
            if (currentPermission === "undetermined") {
              const { status } = await Notifications.requestPermissionsAsync();
              set({ permissionStatus: status });
              if (status !== "granted") {
                showPermissionAlert();
                return;
              }
            } else if (currentPermission !== "granted") {
              showPermissionAlert();
              return;
            }
          }

          // Flip the flag
          set({ getNotifications: !currentlyOn });
        } catch (error) {
          console.error("Error toggling notifications:", error);
          Alert.alert(
            "Keine Internetverbindung",
            "Die Änderungen konnten nicht vorgenommen werden, weil keine Internetverbindung besteht.",
            [{ text: "OK" }]
          );
        }
      },
    }),
    {
      name: "notification-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useNotificationStore;
