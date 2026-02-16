import { useFonts } from "expo-font";
import { Drawer } from "expo-router/drawer";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../../global.css";
import { CustomDrawerContent } from "../components/navigation/CustomDrawerContent";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    "SpaceGrotesk-SemiBold": require("../assets/fonts/SpaceGrotesk-SemiBold.ttf"),
    "SpaceGrotesk-Bold": require("../assets/fonts/SpaceGrotesk-Bold.ttf"),
    "PlayfairDisplay-Regular": require("../assets/fonts/PlayfairDisplay-Regular.ttf"),
    "PlayfairDisplay-Italic": require("../assets/fonts/PlayfairDisplay-Italic.ttf"),
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" />
        <View style={{ flex: 1, backgroundColor: "#1E459F" }}>
          <Drawer
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
              headerShown: false,
              drawerType: "front",
              drawerStyle: {
                backgroundColor: "#1E459F",
                width: "100%",
              },
              drawerHideStatusBarOnOpen: false,
              overlayColor: "transparent",
            }}
          >
            <Drawer.Screen
              name="(tabs)"
              options={{
                drawerLabel: "Main App",
                title: "XeroLens",
              }}
            />
          </Drawer>
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
