import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { router, Stack, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { Provider, useDispatch, useSelector } from "react-redux";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { initializeAuth, logoutAsync } from "@/store/slices/authSlice";
import { fetchNotes } from "@/store/slices/notesSlice";
import { AppDispatch, RootState, store } from "@/store/store";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { TouchableOpacity } from "react-native";

export const unstable_settings = {
  anchor: "(tabs)",
};

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const dispatch = useDispatch<AppDispatch>();
  const { user, initialized } = useSelector((state: RootState) => state.auth);
  const segments = useSegments();

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  useEffect(() => {
    if (!initialized) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!user && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (user && inAuthGroup) {
      router.replace("/");
      // Fetch notes when user logs in
      dispatch(fetchNotes(user.uid));
    } else if (user && !inAuthGroup) {
      // Fetch notes when navigating to notes (if not in auth)
      dispatch(fetchNotes(user.uid));
    }
  }, [user, initialized, segments, dispatch]);

  const handleLogout = async () => {
    await dispatch(logoutAsync());
    router.replace("/(auth)/login");
  };

  return (
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
          name="(auth)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="index"
          options={{
            title: "Notes",
            headerTitleAlign: "left",
            headerRight: () => (
              <TouchableOpacity
                style={{ flexDirection: "row", alignItems: "center", gap: 12, marginRight: 16 }}
              >
                <TouchableOpacity
                  style={{ backgroundColor: '#b494f0', borderRadius: 50, padding: 6 }}
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
                <TouchableOpacity
                  onPress={handleLogout}
                  style={{ padding: 4 }}
                >
                  <MaterialIcons
                    name="logout"
                    size={24}
                    color={Colors[colorScheme ?? "dark"].tint}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen name="(modals)" options={{ presentation: "modal", headerShown: false }} />
        <Stack.Screen name="[id]" options={{ title: "Note Details" }} />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <RootLayoutNav />
    </Provider>
  );
}
