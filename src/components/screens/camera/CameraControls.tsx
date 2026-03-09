import { HapticService } from "@/services/hapticService";
import { theme } from "@/styles/theme";
import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface CameraControlsProps {
  onTakePicture: () => void;
  onToggleTorch: () => void;
  onToggleTimer: () => void;
  onToggleCamera: () => void;
  torch: boolean;
  timerDuration: number;
  countdown: number | null;
}

export const CameraControls = ({
  onTakePicture,
  onToggleTorch,
  onToggleTimer,
  onToggleCamera,
  torch,
  timerDuration,
  countdown,
}: CameraControlsProps) => {
  return (
    <View style={styles.controls}>
      <View style={styles.toolRow}>
        <TouchableOpacity
          onPress={() => {
            HapticService.trigger("impactMedium");
            router.replace("/(tabs)/library");
          }}
          style={styles.toolBtn}
        >
          <Feather name="image" size={26} color="#FFF3CC" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            HapticService.trigger("impactMedium");
            onToggleTorch();
          }}
          style={styles.toolBtn}
        >
          <Ionicons
            name={torch ? "flash" : "flash-off"}
            size={26}
            color="#FFF3CC"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            HapticService.trigger("impactMedium");
            onToggleTimer();
          }}
          style={styles.toolBtn}
        >
          <Feather name="clock" size={26} color="#FFF3CC" />
          {timerDuration > 0 && (
            <View style={styles.timerBadge}>
              <Text style={styles.timerBadgeText}>{timerDuration}</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            HapticService.trigger("impactMedium");
            onToggleCamera();
          }}
          style={styles.toolBtn}
        >
          <Feather name="refresh-cw" size={26} color="#FFF3CC" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={onTakePicture}
        activeOpacity={0.8}
        disabled={countdown !== null}
        style={styles.shutterOuter}
      >
        <View
          style={[
            styles.shutterInner,
            countdown !== null && styles.shutterDisabled,
          ]}
        >
          <Ionicons name="camera" size={32} color="#FFF3CC" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  controls: { alignItems: "center", gap: 16 },
  toolRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignSelf: "stretch",
    paddingHorizontal: 20,
  },
  toolBtn: {
    width: 52,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  timerBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#BC4749",
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  timerBadgeText: {
    color: "white",
    fontSize: 10,
    fontFamily: theme.fontFamily.sans,
  },
  shutterOuter: {
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 3,
    borderColor: "#BC4749",
    alignItems: "center",
    justifyContent: "center",
  },
  shutterInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#BC4749",
    alignItems: "center",
    justifyContent: "center",
  },
  shutterDisabled: { opacity: 0.5 },
});
