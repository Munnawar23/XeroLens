import { HapticService } from "@/services/hapticService";
import { theme } from "@/styles/theme";
import { CameraView } from "expo-camera";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface CameraViewfinderProps {
  cameraRef: React.RefObject<any>;
  previewUri: string | null;
  facing: "front" | "back";
  torch: boolean;
  zoom: number;
  cameraActive: boolean;
  countdown: number | null;
  setZoom: (zoom: number) => void;
}

export const CameraViewfinder = ({
  cameraRef,
  previewUri,
  facing,
  torch,
  zoom,
  cameraActive,
  countdown,
  setZoom,
}: CameraViewfinderProps) => {
  return (
    <View style={styles.viewfinderWrapper}>
      <View style={styles.viewfinderInner}>
        {!previewUri ? (
          <CameraView
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            facing={facing}
            flash={torch ? "on" : "off"}
            zoom={zoom}
            active={cameraActive}
          />
        ) : (
          <Image
            source={{ uri: previewUri }}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
          />
        )}

        {!previewUri && (
          <View style={styles.zoomRow}>
            <TouchableOpacity
              onPress={() => {
                HapticService.trigger("impactMedium");
                setZoom(0);
              }}
              style={[styles.zoomBtn, zoom === 0 && styles.zoomBtnActive]}
            >
              <Text style={styles.zoomText}>1×</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                HapticService.trigger("impactMedium");
                setZoom(0.1);
              }}
              style={[styles.zoomBtn, zoom === 0.1 && styles.zoomBtnActive]}
            >
              <Text style={styles.zoomText}>2×</Text>
            </TouchableOpacity>
          </View>
        )}

        {countdown !== null && (
          <View style={styles.countdownOverlay}>
            <Text style={styles.countdownText}>{countdown}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  viewfinderWrapper: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    justifyContent: "center",
  },
  viewfinderInner: {
    width: "100%",
    aspectRatio: 3 / 4,
    borderRadius: 36,
    overflow: "hidden",
    backgroundColor: "#000",
    position: "relative",
  },
  zoomRow: {
    position: "absolute",
    bottom: 24,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    zIndex: 10,
  },
  zoomBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  zoomBtnActive: { borderWidth: 2, borderColor: "#BC4749" },
  zoomText: {
    color: "white",
    fontFamily: theme.fontFamily.brand,
    fontSize: 13,
  },
  countdownOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
  },
  countdownText: {
    color: "white",
    fontFamily: theme.fontFamily.fancy,
    fontSize: 96,
  },
});
