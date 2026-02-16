import React from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function LibraryScreen() {
  return (
    <SafeAreaView className="flex h-full w-full items-center justify-center bg-ui-background">
      <Text
        className="text-ui-primary font-brand text-2xl font-bold"
        style={{ fontFamily: "SpaceGrotesk-Bold" }}
      >
        Library
      </Text>
    </SafeAreaView>
  );
}
