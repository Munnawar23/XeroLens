import { Button } from "@/components/common/Button";
import { HapticService } from "@/services/hapticService";
import { savePhotoToGallery } from "@/services/mediaService";
import { photoStorage } from "@/services/storageService";
import { cameraStore } from "@/store/cameraStore";
import { useLibraryStore } from "@/store/useLibraryStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { theme } from "@/styles/theme";
import { Feather, Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  AppState,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function CameraScreen() {
  const insets = useSafeAreaInsets();
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [appState, setAppState] = useState(AppState.currentState);
  const [isActive, setIsActive] = useState(false);

  // ─── Camera Settings (from cameraStore) ──────────────────────────────────
  const {
    facing,
    torch,
    timerDuration,
    countdown,
    zoom,
    setCountdown,
    setZoom,
    toggleCamera,
    toggleTorch,
    toggleTimer,
  } = cameraStore();

  // ─── Camera Capture Logic (previously in hooks) ──────────────────────────
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { fetchPhotos } = useLibraryStore();

  const captureImage = async () => {
    if (!cameraRef.current) return;

    try {
      HapticService.trigger("impactHeavy");
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
        skipProcessing: false,
      });

      if (photo?.uri) {
        setPreviewUri(photo.uri);
      }
    } catch (error) {
      console.error("Capture error:", error);
      Toast.show({
        type: "error",
        text1: "Capture Failed",
        text2: (error as Error).message,
      });
    }
  };

  const takePicture = async () => {
    if (!cameraRef.current || previewUri || countdown !== null) return;

    if (timerDuration > 0) {
      let count = timerDuration;
      setCountdown(count);
      HapticService.trigger("impactHeavy");

      const interval = setInterval(() => {
        count -= 1;
        if (count > 0) {
          setCountdown(count);
          HapticService.trigger("impactLight");
        } else {
          clearInterval(interval);
          setCountdown(null);
          captureImage();
        }
      }, 1000);
    } else {
      captureImage();
    }
  };

  const handleSave = async () => {
    if (!previewUri) return;
    setIsSaving(true);
    try {
      await photoStorage.savePhoto(previewUri);
      const { saveToGallery } = useSettingsStore.getState();
      if (saveToGallery) {
        try {
          await savePhotoToGallery(previewUri);
        } catch (e) {
          console.error("Gallery save error:", e);
        }
      }
      await fetchPhotos();
      setPreviewUri(null);
    } catch (error) {
      console.error("Save error:", error);
      Toast.show({
        type: "error",
        text1: "Save Failed",
        text2: (error as Error).message,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = async () => {
    if (!previewUri) return null;
    HapticService.trigger("impactMedium");
    setIsSaving(true);
    try {
      const savedPhoto = await photoStorage.savePhoto(previewUri);
      const { saveToGallery } = useSettingsStore.getState();
      if (saveToGallery) {
        try {
          await savePhotoToGallery(previewUri);
        } catch (e) {}
      }
      await fetchPhotos();
      setPreviewUri(null);
      return savedPhoto;
    } catch (error) {
      console.error("Edit save error:", error);
      Toast.show({
        type: "error",
        text1: "Edit Failed",
        text2: (error as Error).message,
      });
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    HapticService.trigger("impactMedium");
    setPreviewUri(null);
  };

  // ─── Lifecycle & AppState ────────────────────────────────────────────────
  useEffect(() => {
    const sub = AppState.addEventListener("change", (nextState) => {
      setAppState(nextState);
    });
    return () => sub.remove();
  }, []);

  useFocusEffect(
    useCallback(() => {
      setIsActive(true);
      setPreviewUri(null);
      return () => setIsActive(false);
    }, []),
  );

  const cameraActive = isActive && appState === "active";

  // ─── Render Helpers ──────────────────────────────────────────────────────
  if (!permission)
    return (
      <View style={styles.loader}>
        <ActivityIndicator color="#BC4749" />
      </View>
    );
  if (!permission.granted) {
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
            requestPermission();
          }}
          style={styles.permissionButton}
        >
          <Text style={styles.permissionButtonText}>Allow Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              if (previewUri) handleDiscard();
              else {
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

        {/* Viewfinder */}
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

        {/* Footer */}
        <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
          <View style={styles.footerContent}>
            {previewUri ? (
              <View style={styles.previewActions}>
                <Button
                  title={isSaving ? "Saving…" : "Save Photo"}
                  onPress={handleSave}
                  variant="variant2"
                  leftIcon={
                    isSaving ? (
                      <ActivityIndicator color="white" size="small" />
                    ) : (
                      <Feather name="save" size={20} color="white" />
                    )
                  }
                  containerStyle={styles.saveBtn}
                />
                <TouchableOpacity
                  onPress={async () => {
                    const saved = await handleEdit();
                    if (saved)
                      router.push({
                        pathname: "/editing",
                        params: { id: saved.id },
                      } as any);
                  }}
                  disabled={isSaving}
                  style={styles.editBtn}
                >
                  {isSaving ? (
                    <ActivityIndicator color="white" size="small" />
                  ) : (
                    <>
                      <Feather name="edit-3" size={22} color="white" />
                      <Text style={styles.editBtnLabel}>Edit</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
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
                      toggleTorch();
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
                      toggleTimer();
                    }}
                    style={styles.toolBtn}
                  >
                    <Feather name="clock" size={26} color="#FFF3CC" />
                    {timerDuration > 0 && (
                      <View style={styles.timerBadge}>
                        <Text style={styles.timerBadgeText}>
                          {timerDuration}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      HapticService.trigger("impactMedium");
                      toggleCamera();
                    }}
                    style={styles.toolBtn}
                  >
                    <Feather name="refresh-cw" size={26} color="#FFF3CC" />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={takePicture}
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
            )}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1B3A3C" },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1B3A3C",
  },
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
  footer: { paddingHorizontal: 16, paddingTop: 12 },
  footerContent: { height: 160, justifyContent: "center" },
  previewActions: { flexDirection: "row", alignItems: "center", gap: 12 },
  saveBtn: { flex: 1, height: 58 },
  editBtn: {
    width: 68,
    height: 58,
    borderRadius: 18,
    backgroundColor: "#BC4749",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  editBtnLabel: {
    color: "white",
    fontFamily: theme.fontFamily.sans,
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
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
