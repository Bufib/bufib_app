import useNotificationStore from "@/stores/notificationStore";
import { supabase } from "@/utils/supabase";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert, Platform } from "react-native";

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
        // ——— Corrected Supabase insert ———
        const { data, error } = await supabase.from("user_tokens").upsert([
          {
            expo_push_token: token.data,
            app_version: Constants.expoConfig?.version,
            platform: Platform.OS,
          },
        ]);

        if (error) {
          console.error("Supabase insert error:", error);
          Alert.alert("Supabase Error", error.message);
        } else {
          console.log("Supabase insert success:", data);
        }
        // ————————————————————————————
      } catch (err: any) {
        console.error("Unexpected error:", err);
        Alert.alert(err.message);
      }

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
      (async () => {
        const { data, error } = await supabase
          .from("user_tokens")
          .delete()
          .eq("expo_push_token", expoPushToken.data);

        if (error) {
          console.error("Supabase delete error:", error);
          Alert.alert("Supabase Error", error.message);
        } else {
          console.log("Supabase delete success:", data);
        }
      })();
    }
  }, [getNotifications, expoPushToken]);

  return { expoPushToken, notification };
};
