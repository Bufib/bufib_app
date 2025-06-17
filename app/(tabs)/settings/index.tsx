import DeleteUserModal from "@/components/DeleteUserModal";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { NoInternet } from "@/components/NoInternet";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useLanguage } from "@/contexts/LanguageContext";
import { useConnectionStatus } from "@/hooks/useConnectionStatus";
import { useInitializeDatabase } from "@/hooks/useInitializeDatabase.ts";
import { useAuthStore } from "@/stores/authStore";
import useNotificationStore from "@/stores/notificationStore";
import { getQuestionCount } from "@/utils/bufibDatabase";
import handleOpenExternalUrl from "@/utils/handleOpenExternalUrl";
import { useLogout } from "@/utils/useLogout";
import Constants from "expo-constants";
import { Image } from "expo-image";
import { router } from "expo-router";
import Storage from "expo-sqlite/kv-store";
import React, { useEffect, useRef, useState, useTransition } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Appearance,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  useColorScheme,
  View,
  Animated,
  Easing,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
const Settings = () => {
  const colorScheme = useColorScheme() || "light";
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === "dark");
  const clearSession = useAuthStore.getState().clearSession;
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const [payPalLink, setPayPalLink] = useState<string | null>("");
  const [version, setVersion] = useState<string | null>("");
  const [questionCount, setQuestionCount] = useState<number>(0);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const { getNotifications, toggleGetNotifications, permissionStatus } =
    useNotificationStore();
  const dbInitialized = useInitializeDatabase();
  const hasInternet = useConnectionStatus();
  const logout = useLogout();
  const effectiveEnabled = getNotifications && permissionStatus === "granted";
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { t } = useTranslation();
  const { isArabic } = useLanguage();
  // animate opacity on mount
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  const handleDeleteSuccess = () => {
    clearSession(); // SignOut and remove session
    router.replace("/(tabs)/home/");
    Toast.show({
      type: "success",
      text1: t("successDeletion"),
      text1Style: { fontWeight: "500" },
      topOffset: 60,
    });
  };

  useEffect(() => {
    const savedColorSetting = Storage.getItemSync("isDarkMode");
    Appearance.setColorScheme(savedColorSetting === "true" ? "dark" : "light");
  }, []);

  // Get version and count and paypal
  useEffect(() => {
    if (!dbInitialized) return;

    try {
      // Get the version
      const version = Storage.getItemSync("version");
      setVersion(version);

      // Get the paypalLink
      const paypal = Storage.getItemSync("paypal");
      setPayPalLink(paypal);

      // Get the version count
      const countQuestions = async () => {
        const count = await getQuestionCount();
        setQuestionCount(count);
      };
      countQuestions();
    } catch (error: any) {
      Alert.alert("Fehler", error.message);
    }
  }, [dbInitialized]);

  const toggleDarkMode = async () => {
    const newDarkMode = !isDarkMode;
    Storage.setItemSync("isDarkMode", `${newDarkMode}`);
    setIsDarkMode(newDarkMode);
    Appearance.setColorScheme(newDarkMode ? "dark" : "light");
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity: fadeAnim, backgroundColor: Colors[colorScheme].background },
      ]}
    >
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: Colors[colorScheme].background },
        ]}
        edges={["top"]}
      >
        <View style={[styles.header, isArabic() && styles.rtl]}>
          <ThemedText
            style={[
              styles.headerTitle,
              isArabic() && { textAlign: "right", paddingRight: 15 },
            ]}
            type="title"
          >
            {t("settings")}
          </ThemedText>

          <Pressable
            onPress={isLoggedIn ? logout : () => router.push("/(auth)/login")}
            style={({ pressed }) => [
              styles.buttonContainer,
              {
                opacity: pressed ? 0.8 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              },
            ]}
          >
            <ThemedText style={[styles.loginButtonText]}>
              {isLoggedIn ? t("logout") : t("login")}
            </ThemedText>
          </Pressable>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <NoInternet showToast={false} showUI={true} />
          <View style={styles.section}>
            <View style={[styles.settingRow, isArabic() && styles.rtl]}>
              <View>
                <ThemedText
                  style={[
                    styles.settingTitle,
                    isArabic() && { textAlign: "right" },
                  ]}
                >
                  {t("darkMode")}
                </ThemedText>
                <ThemedText
                  style={[
                    styles.settingSubtitle,
                    isArabic() && { textAlign: "right" },
                  ]}
                >
                  {t("enableDarkMode")}
                </ThemedText>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={toggleDarkMode}
                trackColor={{
                  false: Colors.light.trackColor,
                  true: Colors.dark.trackColor,
                }}
                thumbColor={Colors[colorScheme].thumbColor}
              />
            </View>
            <View style={[styles.settingRow, isArabic() && styles.rtl]}>
              <View>
                <ThemedText
                  style={[
                    styles.settingTitle,
                    isArabic() && { textAlign: "right" },
                  ]}
                >
                  {t("notifications")}
                </ThemedText>
                <ThemedText
                  style={[
                    styles.settingSubtitle,
                    isArabic() && { textAlign: "right" },
                  ]}
                >
                  {t("receivePushNotifications")}
                </ThemedText>
              </View>
              <Switch
                value={effectiveEnabled}
                onValueChange={() => {
                  if (!hasInternet) return;
                  toggleGetNotifications();
                }}
                trackColor={{
                  false: Colors.light.trackColor,
                  true: Colors.dark.trackColor,
                }}
                thumbColor={
                  isDarkMode ? Colors.light.thumbColor : Colors.dark.thumbColor
                }
              />
            </View>
            <LanguageSwitcher />
          </View>

          {isLoggedIn && (
            <View style={styles.section}>
              <ThemedText
                style={[
                  styles.sectionTitle,
                  isArabic() && { textAlign: "right" },
                ]}
              >
                {t("account")}
              </ThemedText>

              <Pressable
                style={styles.settingButton}
                onPress={() => router.push("/(auth)/forgotPassword")}
              >
                <Text style={[styles.settingButtonText]}>
                  {t("changePassword")}
                </Text>
              </Pressable>

              <Pressable
                style={[styles.settingButton, styles.deleteButton]}
                onPress={() => setOpenDeleteModal(true)}
              >
                <ThemedText
                  style={[styles.settingButtonText, styles.deleteButtonText]}
                >
                  {t("deleteAccount")}
                </ThemedText>
              </Pressable>
            </View>
          )}

          <Pressable
            style={styles.paypalButton}
            onPress={() => payPalLink && handleOpenExternalUrl(payPalLink)}
          >
            <Image
              source={require("@/assets/images/paypal.png")}
              style={styles.paypalImage}
            />
          </Pressable>

          <View style={styles.infoSection}>
            <ThemedText
              style={[
                styles.questionCount,
                isArabic() && { textAlign: "right" },
              ]}
            >
              {t("questionsInDatabase", { count: questionCount })}
            </ThemedText>

            {isAdmin && isLoggedIn && (
              <>
                <ThemedText
                  style={[
                    styles.versionText,
                    isArabic() && { textAlign: "right" },
                  ]}
                >
                  {t("databaseVersion", { version: version })}
                </ThemedText>

                <ThemedText
                  style={[
                    styles.versionText,
                    isArabic() && { textAlign: "right" },
                  ]}
                >
                  {t("appVersion", { version: Constants.expoConfig?.version })}
                </ThemedText>
              </>
            )}
          </View>

          <View
            style={[
              styles.footer,
              isArabic() && { flexDirection: "row-reverse" },
            ]}
          >
            <Pressable
              onPress={() =>
                handleOpenExternalUrl(
                  "https://bufib.github.io/Islam-Fragen-App-rechtliches/datenschutz"
                )
              }
            >
              <ThemedText
                style={[
                  styles.footerLink,
                  isArabic() && { textAlign: "right" },
                ]}
              >
                {t("dataPrivacy")}
              </ThemedText>
            </Pressable>

            <Pressable onPress={() => router.push("/settings/about")}>
              <ThemedText
                style={[
                  styles.footerLink,
                  isArabic() && { textAlign: "right" },
                ]}
              >
                {t("aboutTheApp")}
              </ThemedText>
            </Pressable>

            <Pressable onPress={() => router.push("/settings/impressum")}>
              <ThemedText
                style={[
                  styles.footerLink,
                  isArabic() && { textAlign: "right" },
                ]}
              >
                {t("imprint")}
              </ThemedText>
            </Pressable>
          </View>
        </ScrollView>

        <DeleteUserModal
          isVisible={openDeleteModal}
          onClose={() => setOpenDeleteModal(false)}
          onDeleteSuccess={handleDeleteSuccess}
          serverUrl="https://ygtlsiifupyoepxfamcn.supabase.co/functions/v1/delete-account"
        />
      </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  headerTitle: {},
  loginButton: {
    paddingVertical: 8,
    paddingLeft: 15,
  },
  buttonContainer: {
    paddingRight: 15,
    backgroundColor: "transparent",
  },
  loginButtonText: {
    color: Colors.universal.link,
    fontSize: 19,
    fontWeight: "500",
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
    opacity: 0.8,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    marginBottom: 8,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 14,
    opacity: 0.6,
  },
  settingButton: {
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: "#ccc",
  },
  settingButtonText: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  deleteButton: {
    backgroundColor: "rgba(255,0,0,0.1)",
  },
  deleteButtonText: {
    color: "#ff4444",
  },
  paypalButton: {
    alignItems: "center",
    padding: 20,
  },
  paypalImage: {
    height: 70,
    aspectRatio: 2,
  },
  infoSection: {
    alignItems: "center",
    padding: 20,
  },
  questionCount: {
    fontSize: 16,
    opacity: 0.5,
    marginBottom: 8,
  },
  versionText: {
    fontSize: 14,
    opacity: 0.5,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
    marginBottom: 60,
  },
  footerLink: {
    color: Colors.universal.link,
    fontSize: 16,
  },
  // New RTL style
  rtl: {
    flexDirection: "row-reverse",
  },
});

export default Settings;
