import { HapticService } from "@/services/hapticService";
import { theme } from "@/styles/theme";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface CameraHeaderProps {
  previewUri: string | null;
  onDiscard: () => void;
}

export const CameraHeader = ({ previewUri, onDiscard }: CameraHeaderProps) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => {
          if (previewUri) {
            onDiscard();
          } else {
            HapticService.trigger("impactMedium");
            router.replace("/(tabs)/library");
          }
        }}
        style={styles.headerIconBtn}
      >
        <Feather name="x" size={26} color="#FFF3CC" />
      </TouchableOpacity>
      <View style={styles.headerTitle}>
        <Text style={styles.brandText}>XeroLens</Text>
      </View>
      <View style={styles.headerIconBtn} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerIconBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { alignItems: "center" },
  brandText: {
    color: "#FFF3CC",
    fontFamily: theme.fontFamily.brand,
    fontSize: 22,
    textTransform: "uppercase",
    letterSpacing: 4,
  },
});
