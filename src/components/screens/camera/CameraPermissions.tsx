import { HapticService } from "@/services/hapticService";
import { theme } from "@/styles/theme";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface CameraPermissionsProps {
  onRequestPermission: () => void;
}

export const CameraPermissions = ({
  onRequestPermission,
}: CameraPermissionsProps) => {
  return (
    <View style={styles.permissionContainer}>
      <Feather name="camera-off" size={48} color="#BC4749" />
      <Text style={styles.permissionTitle}>Camera Access Needed</Text>
      <Text style={styles.permissionSubtitle}>
        Allow XeroLens to use your camera.
      </Text>
      <TouchableOpacity
        onPress={() => {
          HapticService.trigger("impactMedium");
          onRequestPermission();
        }}
        style={styles.permissionButton}
      >
        <Text style={styles.permissionButtonText}>Allow Camera</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  permissionContainer: {
    flex: 1,
    backgroundColor: "#1B3A3C",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 40,
  },
  permissionTitle: {
    color: "#FFF3CC",
    fontFamily: theme.fontFamily.brand,
    fontSize: 22,
    textTransform: "uppercase",
    letterSpacing: 2,
    textAlign: "center",
  },
  permissionSubtitle: {
    color: "rgba(255,243,204,0.6)",
    fontFamily: theme.fontFamily.sans,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
  },
  permissionButton: {
    backgroundColor: "#BC4749",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 8,
  },
  permissionButtonText: {
    color: "white",
    fontFamily: theme.fontFamily.brand,
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});
