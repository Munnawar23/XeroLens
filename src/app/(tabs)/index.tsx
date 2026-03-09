import { HapticService } from "@/services/hapticService";
import { savePhotoToGallery } from "@/services/mediaService";
import { photoStorage } from "@/services/storageService";
import { cameraStore } from "@/store/cameraStore";
import { useLibraryStore } from "@/store/useLibraryStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, AppState, StyleSheet, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import { CameraControls } from "@/components/screens/camera/CameraControls";
import { CameraHeader } from "@/components/screens/camera/CameraHeader";
import { CameraPermissions } from "@/components/screens/camera/CameraPermissions";
import { CameraPreviewActions } from "@/components/screens/camera/CameraPreviewActions";
import { CameraViewfinder } from "@/components/screens/camera/CameraViewfinder";

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

  // ─── Camera Capture Logic ────────────────────────────────────────────────
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
      <CameraPermissions onRequestPermission={() => requestPermission()} />
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        {/* Header */}
        <CameraHeader previewUri={previewUri} onDiscard={handleDiscard} />

        {/* Viewfinder */}
        <CameraViewfinder
          cameraRef={cameraRef}
          previewUri={previewUri}
          facing={facing}
          torch={torch}
          zoom={zoom}
          cameraActive={cameraActive}
          countdown={countdown}
          setZoom={setZoom}
        />

        {/* Footer */}
        <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
          <View style={styles.footerContent}>
            {previewUri ? (
              <CameraPreviewActions
                isSaving={isSaving}
                onSave={handleSave}
                onEdit={async () => {
                  const saved = await handleEdit();
                  if (saved) {
                    router.push({
                      pathname: "/editing",
                      params: { id: saved.id },
                    } as any);
                  }
                }}
              />
            ) : (
              <CameraControls
                onTakePicture={takePicture}
                onToggleTorch={toggleTorch}
                onToggleTimer={toggleTimer}
                onToggleCamera={toggleCamera}
                torch={torch}
                timerDuration={timerDuration}
                countdown={countdown}
              />
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
  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  footerContent: {
    height: 160,
    justifyContent: "center",
  },
});
