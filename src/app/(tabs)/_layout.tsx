import { Tabs } from "expo-router";
import { SymbolView } from "expo-symbols";
import React from "react";
import { Platform } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#CF2A2A",
          borderTopWidth: 0,
          elevation: 0,
          height: Platform.OS === "ios" ? 82 : 62,
          paddingBottom: Platform.OS === "ios" ? 30 : 12,
          paddingTop: 12,
        },
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "#E1DCCA",
        tabBarLabelStyle: {
          fontFamily: "Righteous",
          fontSize: 12,
          fontWeight: "600",
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="library"
        options={{
          title: "Library",
          tabBarIcon: ({ color }) => (
            <SymbolView name="photo.stack.fill" size={27} tintColor={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Camera",
          tabBarIcon: ({ color }) => (
            <SymbolView name="camera.fill" size={31} tintColor={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="studio"
        options={{
          title: "Studio",
          tabBarIcon: ({ color }) => (
            <SymbolView
              name="wand.and.stars.inverse"
              size={27}
              tintColor={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
