// import { useState, useEffect, useRef } from "react";
// import * as Device from "expo-device";
// import * as Notifications from "expo-notifications";
// import Constants from "expo-constants";
// import { Platform } from "react-native";
// import { useAuthStore } from "@/stores/authStore";
// import { supabase } from "@/utils/supabase";
// import { useRouter } from "expo-router";
// import useNotificationStore from "@/stores/notificationStore";

// const TOKEN_STORAGE_KEY = "pushTokenStored";
// export interface PushNotificationState {
//   expoPushToken?: Notifications.ExpoPushToken;
//   notification?: Notifications.Notification;
// }

// export const usePushNotifications = (): PushNotificationState => {
//   const session = useAuthStore((state) => state.session);
//   const userId = session?.user?.id ?? null;
//   const router = useRouter();
//   const getNotifications = useNotificationStore(
//     (state) => state.getNotifications
//   );

//   // Set up notification handler for foreground notifications
//   Notifications.setNotificationHandler({
//     handleNotification: async () => ({
//       shouldPlaySound: true,
//       shouldShowAlert: true,
//       shouldSetBadge: true,
//     }),
//   });

//   const [expoPushToken, setExpoPushToken] = useState<
//     Notifications.ExpoPushToken | undefined
//   >();
//   const [notification, setNotification] = useState<
//     Notifications.Notification | undefined
//   >();

//   const notificationListener = useRef<Notifications.EventSubscription>();
//   const responseListener = useRef<Notifications.EventSubscription>();

//   // Notification setup
//   useEffect(() => {
//     if (!getNotifications || !userId) return;
//     const setupNotifications = async () => {
//       const token = await registerForPushNotificationsAsync();
//       if (token) {
//         setExpoPushToken(token);
//         await supabase
//           .from("user_tokens")
//           .upsert({ user_id: userId, expo_push_token: token.data });
//       }
//     };
//     setupNotifications();
//   }, [getNotifications, userId]);

//   // Notification listeners
//   useEffect(() => {
//     if (!getNotifications) return;
//     notificationListener.current =
//       Notifications.addNotificationReceivedListener(setNotification);
//     responseListener.current =
//       Notifications.addNotificationResponseReceivedListener(
//         handleNotificationResponse
//       );
//     return () => {
//       notificationListener.current?.remove();
//       responseListener.current?.remove();
//     };
//   }, [getNotifications]);

//   // Function to register for push notifications
//   async function registerForPushNotificationsAsync() {
//     const { getNotifications } = useNotificationStore.getState();
//     if (!getNotifications) return;
//     let token;
//     if (Device.isDevice) {
//       const { status: existingStatus } =
//         await Notifications.getPermissionsAsync();
//       let finalStatus = existingStatus;

//       if (existingStatus !== "granted") {
//         const { status } = await Notifications.requestPermissionsAsync();
//         finalStatus = status;
//       }
//       if (finalStatus !== "granted") {
//         // In production, replace alert with a more user-friendly UI notification or log the error.
//         alert("Failed to get push token for push notification");
//         return;
//       }

//       token = await Notifications.getExpoPushTokenAsync({
//         projectId: Constants.expoConfig?.extra?.eas.projectId,
//       });
//     } else {
//       alert("Must be using a physical device for Push notifications");
//     }

//     if (Platform.OS === "android") {
//       Notifications.setNotificationChannelAsync("default", {
//         name: "default",
//         importance: Notifications.AndroidImportance.MAX,
//         vibrationPattern: [0, 250, 250, 250],
//         lightColor: "#057958",
//       });
//     }

//     return token;
//   }

//   function redirect(notification: Notifications.Notification) {
//     setTimeout(() => {
//       router.push({
//         pathname: "/(tabs)/home",
//       });
//     }, 1);
//   }

//   function handleNotificationResponse(
//     response: Notifications.NotificationResponse
//   ) {
//     redirect(response.notification);
//   }

//   return {
//     expoPushToken,
//     notification,
//   };
// };
import { useState, useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform, Alert } from "react-native";
import * as Device from "expo-device";
import { supabase } from "@/utils/supabase";
import { useRouter } from "expo-router";
import useNotificationStore from "@/stores/notificationStore";

// 1) One-time, at module load:
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldShowAlert: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const usePushNotifications = () => {
  const getNotifications = useNotificationStore((s) => s.getNotifications);
  const router = useRouter();

  const [expoPushToken, setExpoPushToken] =
    useState<Notifications.ExpoPushToken>();
  const [notification, setNotification] =
    useState<Notifications.Notification>();
  const notificationListener = useRef<Notifications.EventSubscription | null>(
    null
  );
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  // 2) Register or update the token when opting in
  useEffect(() => {
    if (!getNotifications) return;

    (async () => {
      if (!Device.isDevice) {
        return Alert.alert(
          "Physisches Gerät erforderlich",
          "Push-Benachrichtigungen funktionieren nur auf echten Geräten."
        );
      }
      try {
        const token = await Notifications.getExpoPushTokenAsync({
          projectId: Constants.expoConfig?.extra?.eas.projectId,
        });
        setExpoPushToken(token);
        console.log("1");

        await supabase.from("user_tokens").insert([
          {
            expo_push_token: token.data,
            app_version: Constants.expoConfig?.extra?.appVersion,
          }
        ]);
        console.log("2");
      } catch (error: any) {
        Alert.alert(error.message);
      }
      console.log("4");

      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#057958",
        });
      }
    })();
  }, [getNotifications]);

  // 3) Listen for incoming notifications & taps
  useEffect(() => {
    if (!getNotifications) return;
    notificationListener.current =
      Notifications.addNotificationReceivedListener(setNotification);
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(() => {
        router.push("/(tabs)/home");
      });
    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, [getNotifications, router]);

  // 4) Delete the token when opting out
  useEffect(() => {
    if (!getNotifications && expoPushToken?.data) {
      try {
        supabase
          .from("user_tokens")
          .delete()
          .eq("expo_push_token", expoPushToken.data);
      } catch (error: any) {
        Alert.alert(error.message);
      }
    }
  }, [getNotifications, expoPushToken]);

  return { expoPushToken, notification };
};
