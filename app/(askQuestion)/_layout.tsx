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
          name="index"
          options={{
            headerShown: true,
            headerTitle: "",

            headerLeft: () => {
              return (
                <Ionicons
                  name="chevron-back-outline"
                  size={30}
                  color={colorScheme === "dark" ? "#d0d0c0" : "#000"}
                  style={{ marginLeft: -16 }}
                  onPress={() =>
                    router.canGoBack()
                      ? router.back()
                      : router.replace("/knowledge/questions/indexQuestion")
                  }
                />
              );
            },
          }}
        />
        <Stack.Screen
          name="ask"
          options={{ headerShown: true, headerTitle: "" }}
        />
        <Stack.Screen
          name="questionDetailScreen"
          options={{
            headerShown: true,
            headerTitle: "",
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
