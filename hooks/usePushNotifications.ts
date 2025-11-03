// // import { useAuthStore } from "@/stores/authStore";
// // import useNotificationStore from "@/stores/notificationStore";
// // import { supabase } from "@/utils/supabase";
// // import AsyncStorage from "@react-native-async-storage/async-storage";
// // import Constants from "expo-constants";
// // import * as Device from "expo-device";
// // import * as Notifications from "expo-notifications";
// // import { useRouter } from "expo-router";
// // import { useEffect, useRef, useState } from "react";
// // import { Alert, Platform } from "react-native";
// // import uuid from "react-native-uuid";

// // // 1) Notification handler
// // Notifications.setNotificationHandler({
// //   handleNotification: async () => ({
// //     shouldPlaySound: true,
// //     shouldShowAlert: true,
// //     shouldSetBadge: true,
// //     shouldShowBanner: true,
// //     shouldShowList: true,
// //   }),
// // });

// // // 2) Guest-ID helper
// // const GUEST_ID_KEY = "guest_id";
// // async function getOrCreateGuestId(): Promise<string> {
// //   let id = await AsyncStorage.getItem(GUEST_ID_KEY);
// //   if (!id) {
// //     id = uuid.v4();
// //     await AsyncStorage.setItem(GUEST_ID_KEY, id);
// //   }
// //   return id;
// // }

// // export function usePushNotifications() {
// //   const router = useRouter();
// //   const getNotifications = useNotificationStore((s) => s.getNotifications);

// //   const session = useAuthStore((s) => s.session);
// //   const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

// //   const [expoPushToken, setExpoPushToken] =
// //     useState<Notifications.ExpoPushToken>();

// //   const notificationListener = useRef<Notifications.EventSubscription | null>(
// //     null
// //   );
// //   const responseListener = useRef<Notifications.EventSubscription | null>(null);

// //   // —————————— REGISTER / UPSERT TOKEN ——————————
// //   useEffect(() => {
// //     // Register or update the push token in Supabase.
// //     if (!getNotifications) return;

// //     const registerToken = async () => {
// //       if (!Device.isDevice) {
// //         Alert.alert(
// //           "Physical Device Required",
// //           "Push notifications only work on physical devices."
// //         );
// //         return;
// //       }

// //       try {
// //         // Fetch Expo Push Token

// //         const token = await Notifications.getExpoPushTokenAsync({
// //           projectId: Constants.expoConfig?.extra?.eas.projectId,
// //         });
// //         setExpoPushToken(token);

// //         // Build payload for upsert
// //         const payload: {
// //           expo_push_token: string;
// //           app_version: string | undefined;
// //           platform: string;
// //           user_id?: string;
// //           guest_id?: string;
// //         } = {
// //           expo_push_token: token.data,
// //           app_version: Constants.expoConfig?.extra?.appVersion,
// //           platform: Platform.OS,
// //         };

// //         if (isLoggedIn && session?.user.id) {
// //           // Associate token with user_id for logged-in users.
// //           payload.user_id = session.user.id;
// //           payload.guest_id = undefined;
// //         } else {
// //           // Associate token with guest_id for logged-out users.
// //           payload.guest_id = await getOrCreateGuestId();
// //           payload.user_id = undefined;
// //         }

// //         // Upsert on `expo_push_token` conflict to insert or update.
// //         const { data, error } = await supabase
// //           .from("user_tokens")
// //           .upsert(payload, { onConflict: "expo_push_token" });

// //         if (error) {
// //           console.error("Supabase upsert error:", error);
// //           Alert.alert("Supabase Error", error.message);
// //         } else {
// //           console.log("Supabase upsert success:", data);
// //         }
// //       } catch (error) {
// //         console.error("Error registering push token:", error);
// //         if (error instanceof Error) {
// //           Alert.alert("Registration Error", error.message);
// //         }
// //       }

// //       // Android-specific notification channel setup.
// //       if (Platform.OS === "android") {
// //         await Notifications.setNotificationChannelAsync("default", {
// //           name: "default",
// //           importance: Notifications.AndroidImportance.MAX,
// //           vibrationPattern: [0, 250, 250, 250],
// //           lightColor: "#057958",
// //         });
// //       }
// //     };

// //     registerToken();
// //   }, [getNotifications, isLoggedIn, session?.user.id]);

// //   // —————————— LISTEN FOR NOTIFICATIONS ——————————
// //   useEffect(() => {
// //     // Set up notification listeners.
// //     if (!getNotifications) return;

// //     // Fires when a notification is received while the app is foregrounded.
// //     notificationListener.current =
// //       Notifications.addNotificationReceivedListener((notification) => {
// //         console.log("Notification received:", notification);
// //       });

// //     // Fires when a user taps on a notification.
// //     responseListener.current =
// //       Notifications.addNotificationResponseReceivedListener((response) => {
// //         console.log("Notification response received:", response);
// //         router.push("/(tabs)/home");
// //       });

// //     // Cleanup listeners on component unmount.
// //     return () => {
// //       notificationListener.current?.remove();
// //       responseListener.current?.remove();
// //     };
// //   }, [getNotifications, router]);

// //   // —————————— DELETE ON OPT-OUT ——————————
// //   useEffect(() => {
// //     // Delete the token if the user opts out of notifications.
// //     if (getNotifications) return; // Only run when notifications are OFF.

// //     const tokenToDelete = expoPushToken?.data;
// //     if (!tokenToDelete) return; // Can't delete if there's no token.

// //     const deleteToken = async () => {
// //       // Delete the entry by the unique push token for reliability.
// //       const { data, error } = await supabase
// //         .from("user_tokens")
// //         .delete()
// //         .eq("expo_push_token", tokenToDelete);

// //       if (error) {
// //         console.error("Supabase delete error:", error);
// //         Alert.alert("Supabase Error", error.message);
// //       } else {
// //         console.log("Supabase delete success: Token removed.", data);
// //       }
// //     };

// //     deleteToken();
// //   }, [getNotifications, expoPushToken?.data]);

// //   return { expoPushToken };
// // }

// //! Before changes with language
// import { LanguageCode } from "@/constants/Types";
// import { useLanguage } from "@/contexts/LanguageContext";
// import { useAuthStore } from "@/stores/authStore";
// import useNotificationStore from "@/stores/notificationStore";
// import { supabase } from "@/utils/supabase";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import Constants from "expo-constants";
// import * as Device from "expo-device";
// import * as Notifications from "expo-notifications";
// import { useRouter } from "expo-router";
// import { useEffect, useRef, useState } from "react";
// import { Alert, Platform } from "react-native";
// import uuid from "react-native-uuid";

// // 1) Notification handler
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldPlaySound: true,
//     shouldShowAlert: true,
//     shouldSetBadge: true,
//     shouldShowBanner: true,
//     shouldShowList: true,
//   }),
// });

// // 2) Guest-ID helper
// const GUEST_ID_KEY = "guest_id";
// async function getOrCreateGuestId(): Promise<string> {
//   let id = await AsyncStorage.getItem(GUEST_ID_KEY);
//   if (!id) {
//     id = uuid.v4();
//     await AsyncStorage.setItem(GUEST_ID_KEY, id);
//   }
//   return id;
// }

// export function usePushNotifications() {
//   const router = useRouter();
//   const getNotifications = useNotificationStore((s) => s.getNotifications);

//   const session = useAuthStore((s) => s.session);
//   const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

//   const [expoPushToken, setExpoPushToken] = useState<string>("");

//   const notificationListener = useRef<Notifications.EventSubscription | null>(
//     null
//   );
//   const responseListener = useRef<Notifications.EventSubscription | null>(null);

//   // —————————— REGISTER / UPSERT TOKEN ——————————
//   useEffect(() => {
//     // Register or update the push token in Supabase.
//     if (!getNotifications) return;

//     const registerToken = async () => {
//       if (!Device.isDevice) {
//         Alert.alert(
//           "Physical Device Required",
//           "Push notifications only work on physical devices."
//         );
//         return;
//       }

//       try {
//         // Fetch Expo Push Token
//         const projectId =
//           Constants?.expoConfig?.extra?.eas?.projectId ??
//           Constants?.easConfig?.projectId;
//         const pushTokenString = (
//           await Notifications.getExpoPushTokenAsync({ projectId })
//         ).data;
//         setExpoPushToken(pushTokenString);

//         // Build payload for upsert
//         const payload: {
//           expo_push_token: string;
//           app_version: string | undefined;
//           platform: string;
//           user_id?: string;
//           guest_id?: string;
//
//         } = {
//           expo_push_token: pushTokenString,
//           app_version: Constants.expoConfig?.extra?.appVersion,
//           platform: Platform.OS,
//
//         };

//         if (isLoggedIn && session?.user.id) {
//           // Associate token with user_id for logged-in users.
//           payload.user_id = session.user.id;
//           payload.guest_id = undefined;
//         } else {
//           // Associate token with guest_id for logged-out users.
//           payload.guest_id = await getOrCreateGuestId();
//           payload.user_id = undefined;
//         }

//         // Upsert on `expo_push_token` conflict to insert or update.
//         const { data, error } = await supabase
//           .from("user_tokens")
//           .upsert(payload, { onConflict: "expo_push_token" });

//         if (error) {
//           console.error("Supabase upsert error:", error);
//           Alert.alert("Supabase Error", error.message);
//         } else {
//           console.log("Supabase upsert success:", data);
//         }
//       } catch (error) {
//         console.error("Error registering push token:", error);
//         if (error instanceof Error) {
//           Alert.alert("Registration Error", error.message);
//         }
//       }

//       // Android-specific notification channel setup.
//       if (Platform.OS === "android") {
//         await Notifications.setNotificationChannelAsync("default", {
//           name: "default",
//           importance: Notifications.AndroidImportance.MAX,
//           vibrationPattern: [0, 250, 250, 250],
//           lightColor: "#057958",
//         });
//       }
//     };

//     registerToken();
//   }, [getNotifications, isLoggedIn, session?.user.id]);

//   // —————————— LISTEN FOR NOTIFICATIONS ——————————
//   useEffect(() => {
//     // Set up notification listeners.
//     if (!getNotifications) return;

//     // Fires when a notification is received while the app is foregrounded.
//     notificationListener.current =
//       Notifications.addNotificationReceivedListener((notification) => {
//         console.log("Notification received:", notification);
//       });

//     // Fires when a user taps on a notification.
//     responseListener.current =
//       Notifications.addNotificationResponseReceivedListener((response) => {
//         console.log("Notification response received:", response);
//         router.push("/(tabs)/home");
//       });

//     // Cleanup listeners on component unmount.
//     return () => {
//       notificationListener.current?.remove();
//       responseListener.current?.remove();
//     };
//   }, [getNotifications, router]);

//   // —————————— DELETE ON OPT-OUT ——————————
//   useEffect(() => {
//     // Delete the token if the user opts out of notifications.
//     if (getNotifications) return; // Only run when notifications are OFF.

//     const tokenToDelete = expoPushToken;
//     if (!tokenToDelete) return; // Can't delete if there's no token.

//     const deleteToken = async () => {
//       // Delete the entry by the unique push token for reliability.
//       const { data, error } = await supabase
//         .from("user_tokens")
//         .delete()
//         .eq("expo_push_token", tokenToDelete);

//       if (error) {
//         console.error("Supabase delete error:", error);
//         Alert.alert("Supabase Error", error.message);
//       } else {
//         console.log("Supabase delete success: Token removed.", data);
//       }
//     };

//     deleteToken();
//   }, [getNotifications, expoPushToken]);

//   return { expoPushToken };
// }
// hooks/usePushNotifications.ts

//! language changes
import { useEffect, useRef, useState, useCallback } from "react";
import { Alert, Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import uuid from "react-native-uuid";
import { supabase } from "@/utils/supabase";
import { useAuthStore } from "@/stores/authStore";
import useNotificationStore from "@/stores/notificationStore";
import { useLanguage } from "@/contexts/LanguageContext";

// 1) Notification handler (foreground behavior)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// 2) Guest-ID helper
const GUEST_ID_KEY = "guest_id";
async function getOrCreateGuestId(): Promise<string> {
  let id = await AsyncStorage.getItem(GUEST_ID_KEY);
  if (!id) {
    id = String(uuid.v4());
    await AsyncStorage.setItem(GUEST_ID_KEY, id);
  }
  return id;
}

export function usePushNotifications() {
  const router = useRouter();
  const { lang } = useLanguage(); // <- your UI language code: "de" | "ar" | "en" ...
  const getNotifications = useNotificationStore((s) => s.getNotifications);
  const session = useAuthStore((s) => s.session);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  const [expoPushToken, setExpoPushToken] = useState<string>("");

  const notificationListener = useRef<Notifications.EventSubscription | null>(
    null
  );
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  // Register / upsert token in Supabase with current language_code
  const registerOrUpdateToken = useCallback(async () => {
    if (!getNotifications) return;

    // if (!Device.isDevice) {
    //   Alert.alert(
    //     "Physical Device Required",
    //     "Push notifications only work on physical devices."
    //   );
    //   return;
    // }

    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;

      const token = (await Notifications.getExpoPushTokenAsync({ projectId }))
        .data;
      setExpoPushToken(token);

      const payload: {
        expo_push_token: string;
        app_version?: string;
        platform: string;
        language_code: string; 
        user_id?: string;
        guest_id?: string;
      } = {
        expo_push_token: token,
        app_version: Constants.expoConfig?.extra?.appVersion,
        platform: Platform.OS,
        language_code: lang || "de",
      };

      if (isLoggedIn && session?.user?.id) {
        payload.user_id = session.user.id;
        payload.guest_id = undefined;
      } else {
        payload.user_id = undefined;
        payload.guest_id = await getOrCreateGuestId();
      }

      const { error } = await supabase
        .from("user_tokens")
        .upsert(payload, { onConflict: "expo_push_token" });

      if (error) {
        console.error("Supabase upsert error:", error);
        Alert.alert("Supabase Error", error.message);
      }
    } catch (err: any) {
      console.error("Error registering/updating push token:", err);
      Alert.alert("Registration Error", err?.message ?? String(err));
    }

    // Android notification channel
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#057958",
      });
    }
  }, [getNotifications, isLoggedIn, session?.user?.id, lang]);

  // Register once when notifications are enabled / session changes / language changes
  useEffect(() => {
    registerOrUpdateToken();
  }, [registerOrUpdateToken]);

  // Listen for notifications (optional)
  useEffect(() => {
    if (!getNotifications) return;

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("Notification received:", notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification response:", response);
        router.push("/(tabs)/home");
      });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, [getNotifications, router]);

  // Delete token on opt-out
  useEffect(() => {
    if (getNotifications) return; // run only when user disabled notifications
    if (!expoPushToken) return;

    (async () => {
      const { error } = await supabase
        .from("user_tokens")
        .delete()
        .eq("expo_push_token", expoPushToken);
      if (error) console.error("Supabase delete token error:", error);
    })();
  }, [getNotifications, expoPushToken]);

  return { expoPushToken };
}






