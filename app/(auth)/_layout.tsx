import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import HeaderLeftBackButton from "@/components/HeaderLeftBackButton";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerTintColor: colorScheme === "dark" ? "#d0d0c0" : "#000",
        }}
      >
        <Stack.Screen
          name="login"
          options={{
            headerShown: true,
            headerTitle: "Login",
            headerLeft: () => {
              return <HeaderLeftBackButton />;
            },
          }}
        />
        <Stack.Screen
          name="signup"
          options={{
            headerShown: true,
            headerTitle: "Registrieren",
            headerLeft: () => {
              return <HeaderLeftBackButton />;
            },
          }}
        />
        <Stack.Screen
          name="forgotPassword"
          options={{
            headerShown: true,
            headerTitle: "Passwort vergessen",
            headerLeft: () => {
              return <HeaderLeftBackButton />;
            },
          }}
        />
        <Stack.Screen
          name="resetPassword"
          options={{
            headerShown: true,
            headerTitle: "Passwort ändern",
            headerLeft: () => {
              return <HeaderLeftBackButton />;
            },
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
