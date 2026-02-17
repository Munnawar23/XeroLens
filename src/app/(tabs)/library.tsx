import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LibraryScreen() {
  return (
    <SafeAreaView className="flex h-full w-full bg-background">
      {/* Top Header - Kept for structure if needed later */}
      <View className="flex-row items-center justify-between px-6 py-4">
        <View style={{ height: 44, width: 44 }} />
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
