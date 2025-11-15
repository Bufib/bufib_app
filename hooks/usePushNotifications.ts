// //! Last worked
// import { useEffect, useRef, useState, useCallback } from "react";
// import { Alert, Platform } from "react-native";
// import * as Notifications from "expo-notifications";
// import Constants from "expo-constants";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useRouter } from "expo-router";
// import uuid from "react-native-uuid";
// import { supabase } from "@/utils/supabase";
// import { useAuthStore } from "@/stores/authStore";
// import useNotificationStore from "@/stores/notificationStore";
// import { useLanguage } from "@/contexts/LanguageContext";

// // 1) Notification handler (foreground behavior)
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
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
//     id = String(uuid.v4());
//     await AsyncStorage.setItem(GUEST_ID_KEY, id);
//   }
//   return id;
// }

// export function usePushNotifications() {
//   const router = useRouter();
//   const { lang } = useLanguage(); // <- your UI language code: "de" | "ar" | "en" ...
//   const getNotifications = useNotificationStore((s) => s.getNotifications);
//   const session = useAuthStore((s) => s.session);
//   const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

//   const [expoPushToken, setExpoPushToken] = useState<string>("");

//   const notificationListener = useRef<Notifications.EventSubscription | null>(
//     null
//   );
//   const responseListener = useRef<Notifications.EventSubscription | null>(null);
//   const isMountedRef = useRef(true);

//   useEffect(() => {
//     return () => {
//       isMountedRef.current = false;
//     };
//   }, []);

//   // Register / upsert token in Supabase with current language_code
//   const registerOrUpdateToken = useCallback(async () => {
//     if (!getNotifications) return;

//     try {
//       const projectId =
//         Constants?.expoConfig?.extra?.eas?.projectId ??
//         Constants?.easConfig?.projectId;

//       const token = (await Notifications.getExpoPushTokenAsync({ projectId }))
//         .data;
//       if (isMountedRef.current) {
//         setExpoPushToken(token);
//       }

//       const payload: {
//         expo_push_token: string;
//         app_version?: string;
//         platform: string;
//         language_code: string;
//         user_id?: string;
//         guest_id?: string;
//       } = {
//         expo_push_token: token,
//         app_version: Constants.expoConfig?.extra?.appVersion,
//         platform: Platform.OS,
//         language_code: lang || "de",
//       };

//       if (isLoggedIn && session?.user?.id) {
//         payload.user_id = session.user.id;
//         payload.guest_id = undefined;
//       } else {
//         payload.user_id = undefined;
//         payload.guest_id = await getOrCreateGuestId();
//       }

//       const { error } = await supabase
//         .from("user_tokens")
//         .upsert(payload, { onConflict: "expo_push_token" });

//       if (error) {
//         console.error("Supabase upsert error:", error);
//         Alert.alert("Supabase Error", error.message);
//       }
//     } catch (err: any) {
//       console.error("Error registering/updating push token:", err);
//       Alert.alert("Registration Error", err?.message ?? String(err));
//     }

//     // Android notification channel
//     if (Platform.OS === "android") {
//       await Notifications.setNotificationChannelAsync("default", {
//         name: "default",
//         importance: Notifications.AndroidImportance.MAX,
//         vibrationPattern: [0, 250, 250, 250],
//         lightColor: "#057958",
//       });
//     }
//   }, [getNotifications, isLoggedIn, session?.user?.id, lang]);

//   // Register once when notifications are enabled / session changes / language changes
//   useEffect(() => {
//     registerOrUpdateToken();
//   }, [registerOrUpdateToken]);

//   // Listen for notifications (optional)
//   useEffect(() => {
//     if (!getNotifications) return;

//     notificationListener.current =
//       Notifications.addNotificationReceivedListener((notification) => {
//         console.log("Notification received:", notification);
//       });

//     responseListener.current =
//       Notifications.addNotificationResponseReceivedListener((response) => {
//         console.log("Notification response:", response);
//         router.push("/(tabs)/home");
//       });

//     return () => {
//       notificationListener.current?.remove();
//       responseListener.current?.remove();
//     };
//   }, [getNotifications, router]);

//   // Delete token on opt-out
//   useEffect(() => {
//     if (getNotifications) return; // run only when user disabled notifications
//     if (!expoPushToken) return;

//     (async () => {
//       const { error } = await supabase
//         .from("user_tokens")
//         .delete()
//         .eq("expo_push_token", expoPushToken);
//       if (error) console.error("Supabase delete token error:", error);
//     })();
//   }, [getNotifications, expoPushToken]);

//   return { expoPushToken };
// }



// hooks/usePushNotifications.ts
import { useEffect, useRef, useState, useCallback } from "react";
import { Alert, Platform } from "react-native";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import uuid from "react-native-uuid";
import { supabase } from "@/utils/supabase";
import { useAuthStore } from "@/stores/authStore";
import useNotificationStore from "@/stores/notificationStore";
import { useLanguage } from "@/contexts/LanguageContext";

// ---------------------------------------------------------------------------
// 1) Global notification handler (foreground behavior)
// ---------------------------------------------------------------------------
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    // iOS / newer SDKs:
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// ---------------------------------------------------------------------------
// 2) Guest-ID helper
// ---------------------------------------------------------------------------
const GUEST_ID_KEY = "guest_id";

async function getOrCreateGuestId(): Promise<string> {
  let id = await AsyncStorage.getItem(GUEST_ID_KEY);
  if (!id) {
    id = String(uuid.v4());
    await AsyncStorage.setItem(GUEST_ID_KEY, id);
  }
  return id;
}

// ---------------------------------------------------------------------------
// 3) Date & weekday helpers for todo reminders
// ---------------------------------------------------------------------------

// Convert JS weekday (0=Sun..6=Sat) -> Monday-based index (0=Mon..6=Sun)
function getMondayBasedDayIndex(date: Date): number {
  const js = date.getDay(); // 0..6 (Sun..Sat)
  return (js + 6) % 7; // Sun->6, Mon->0, Tue->1, ... Sat->5
}

/**
 * Compute the next concrete Date where the given weekday (dayIndex) & time occur.
 * Assumes: dayIndex 0=Mon..6=Sun (same indexing as your WeeklyCalendar).
 */
function computeNextDateForDay(dayIndex: number, time: Date): Date {
  const now = new Date();
  const todayIndex = getMondayBasedDayIndex(now);

  let delta = dayIndex - todayIndex;
  if (delta < 0) delta += 7;

  const scheduled = new Date(now);
  scheduled.setDate(scheduled.getDate() + delta);
  scheduled.setHours(time.getHours(), time.getMinutes(), 0, 0);

  // If it's "today" but time already passed → next week
  if (delta === 0 && scheduled <= now) {
    scheduled.setDate(scheduled.getDate() + 7);
  }

  return scheduled;
}

// Map your dayIndex (0=Mon..6=Sun) → Expo weekday (1=Sun..7=Sat)
function mapDayIndexToExpoWeekday(dayIndex: number): number {
  // [Mon, Tue, Wed, Thu, Fri, Sat, Sun] -> [2,3,4,5,6,7,1]
  const map = [2, 3, 4, 5, 6, 7, 1];
  return map[dayIndex] ?? 2;
}

// ---------------------------------------------------------------------------
/**
 * 4) Public helpers: schedule + cancel todo reminder notifications
 *
 * dayIndex = index from your weekly calendar (0=Mon..6=Sun).
 */
// ---------------------------------------------------------------------------

export async function scheduleTodoReminderNotification(
  todoId: string,
  todoText: string,
  dayIndex: number,
  time: Date,
  repeatWeekly: boolean
): Promise<string | undefined> {
  try {
    const content: Notifications.NotificationContentInput = {
      title: "Erinnerung",
      body: todoText,
      sound: "default",
      data: {
        type: "todo_reminder",
        todoId,
        repeatWeekly,
      },
    };

    let notificationId: string;

    if (repeatWeekly) {
      // --- Weekly repeating reminder: same weekday & time every week ---
      const weekday = mapDayIndexToExpoWeekday(dayIndex);

      notificationId = await Notifications.scheduleNotificationAsync({
        content,
        trigger: {
          // WeeklyTriggerInput (calendar type)
          weekday,
          hour: time.getHours(),
          minute: time.getMinutes(),
          repeats: true,
          channelId: "default",
        } as any,
      });
    } else {
      // --- One-time reminder: next occurrence of that weekday & time ---
      const scheduled = computeNextDateForDay(dayIndex, time);

      console.log("[Notifications] ONE-TIME todo reminder:", {
        todoId,
        todoText,
        dayIndex,
        when: scheduled.toISOString(),
      });

      // ✅ NEW-style DATE trigger to avoid the deprecation warning:
      const trigger: Notifications.DateTriggerInput = {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: scheduled,
      };

      notificationId = await Notifications.scheduleNotificationAsync({
        content,
        trigger: trigger as Notifications.NotificationTriggerInput,
      });
    }

    return notificationId;
  } catch (error) {
    console.error("Error scheduling todo reminder:", error);
    return undefined;
  }
}

/**
 * Optional helper to cancel a scheduled reminder if you stored notificationId.
 */
export async function cancelTodoReminderNotification(
  notificationId: string
): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error("Error cancelling todo reminder:", error);
  }
}

// ---------------------------------------------------------------------------
// 5) Hook: registers push token, syncs with Supabase, listens to notifications
// ---------------------------------------------------------------------------

export function usePushNotifications() {
  const router = useRouter();
  const { lang } = useLanguage();
  const getNotifications = useNotificationStore((s) => s.getNotifications);
  const session = useAuthStore((s) => s.session);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  const [expoPushToken, setExpoPushToken] = useState<string>("");

  const notificationListener = useRef<Notifications.EventSubscription | null>(
    null
  );
  const responseListener = useRef<Notifications.EventSubscription | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Register / upsert token in Supabase with current language_code
  const registerOrUpdateToken = useCallback(async () => {
    if (!getNotifications) return;

    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;

      const token = (await Notifications.getExpoPushTokenAsync({ projectId }))
        .data;

      if (isMountedRef.current) {
        setExpoPushToken(token);
      }

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

    // Android notification channel with sound
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#057958",
        sound: "default",
      });
    }
  }, [getNotifications, isLoggedIn, session?.user?.id, lang]);

  // Register once when notifications are enabled / session changes / language changes
  useEffect(() => {
    registerOrUpdateToken();
  }, [registerOrUpdateToken]);

  // Listen for notifications (receive + user tap)
  useEffect(() => {
    if (!getNotifications) return;

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("Notification received:", notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification response:", response);

        // Example: navigate to home when any notification is tapped
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
