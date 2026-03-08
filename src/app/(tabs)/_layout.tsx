import { useTheme } from "@/hooks/useTheme";
import { HapticService } from "@/services/hapticService";
import { theme } from "@/styles/theme";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const colors = useTheme();

  const bottomPadding = insets.bottom > 0 ? insets.bottom : 15;
  const BAR_HEIGHT = 60 + bottomPadding;

  return (
    <Tabs
      screenListeners={{
        state: () => {
          HapticService.trigger("impactMedium");
        },
      }}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.secondary,
          borderTopWidth: 0,
          elevation: 0,
          height: BAR_HEIGHT,
          paddingBottom: bottomPadding,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.background,
        tabBarInactiveTintColor: `${colors.background}80`,
        tabBarLabelStyle: {
          fontFamily: theme.fontFamily.button,
          fontSize: 10,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarStyle: { display: "none" },
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "camera" : "camera-outline"}
              color={color}
              size={26}
            />
          ),
          tabBarLabel: "Camera",
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "images" : "images-outline"}
              color={color}
              size={26}
            />
          ),
          tabBarLabel: "Library",
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "heart" : "heart-outline"}
              color={color}
              size={26}
            />
          ),
          tabBarLabel: "Favorites",
        }}
      />
      <Tabs.Screen
        name="studio"
        options={{
          tabBarStyle: { display: "none" },
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "pencil" : "pencil-outline"}
              color={color}
              size={26}
            />
          ),
          tabBarLabel: "Studio",
        }}
      />
    </Tabs>
  );
}
