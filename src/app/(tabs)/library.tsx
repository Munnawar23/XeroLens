import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LibraryScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex h-full w-full bg-background">
      {/* Top Header */}
      <View className="flex-row items-center justify-between px-6 py-4">
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          className="p-2 -ml-2"
        >
          <Ionicons name="settings-outline" size={28} color="#1E459F" />
        </TouchableOpacity>
        <View style={{ width: 44 }} />
      </View>

      <View className="flex-1 items-center justify-center">
        <Text
          className="text-primary font-brand text-2xl font-bold"
          style={{ fontFamily: "SpaceGrotesk-Bold" }}
        >
          Library
        </Text>
      </View>
    </SafeAreaView>
  );
}
