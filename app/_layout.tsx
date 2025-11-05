import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { router, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { Provider } from "react-redux";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { store } from "@/store/store";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { TouchableOpacity } from "react-native";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <Provider store={store}>
      <ThemeProvider value={DarkTheme}>
        <Stack
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: Colors[colorScheme ?? "dark"].background,
          },

          headerTintColor: Colors[colorScheme ?? "dark"].text,
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "Notes",
            headerTitleAlign: "left",

            headerRight: () => (
              <TouchableOpacity
                style={{ marginRight: 16, backgroundColor: '#b494f0', borderRadius: 50, padding: 6 }}
                onPress={() => {
                  router.push("/(modals)");
                }}
              >
              
                <MaterialIcons
                  name="add"
                  size={24}
                  color={Colors[colorScheme ?? "dark"].tint}
                />
              </TouchableOpacity>
            ),
          }}
        />

        <Stack.Screen name="(modals)" options={{ presentation: "modal", headerShown: false }} />
        <Stack.Screen name="[id]" options={{ title: "Note Details" }} />

      </Stack>
      <StatusBar style="light" />
      </ThemeProvider>
    </Provider>
  );
}
