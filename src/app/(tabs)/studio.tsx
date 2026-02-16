import React from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function StudioScreen() {
  return (
    <SafeAreaView className="flex items-center justify-center h-full w-full bg-ui-background">
      <Text
        className="text-ui-primary font-brand text-2xl font-bold"
        style={{ fontFamily: "SpaceGrotesk-Bold" }}
      >
        Studio
      </Text>
    </SafeAreaView>
  );
}
