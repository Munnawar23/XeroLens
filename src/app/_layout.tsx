import { AlfaSlabOne_400Regular } from "@expo-google-fonts/alfa-slab-one";
import {
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_700Bold,
} from "@expo-google-fonts/outfit";
import { Righteous_400Regular, useFonts } from "@expo-google-fonts/righteous";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../../global.css";

import Toast from "react-native-toast-message";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    AlfaSlabOne: AlfaSlabOne_400Regular,
    Righteous: Righteous_400Regular,
    OutfitRegular: Outfit_400Regular,
    OutfitMedium: Outfit_500Medium,
    OutfitBold: Outfit_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <View style={{ flex: 1, backgroundColor: "#1E459F" }}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#1E459F" },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </View>
      <Toast position="bottom" bottomOffset={80} />
    </SafeAreaProvider>
  );
}
