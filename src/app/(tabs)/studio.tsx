import React from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function StudioScreen() {
  return (
    <SafeAreaView className="flex items-center justify-center h-full w-full bg-background">
      <Text className="text-primary font-brand text-4xl uppercase px-4 py-2 leading-tight">
        Studio
      </Text>
    </SafeAreaView>
  );
}
