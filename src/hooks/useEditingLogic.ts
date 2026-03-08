import { useImage } from "@shopify/react-native-skia";
import * as FileSystem from "expo-file-system/legacy";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Dimensions, LayoutChangeEvent } from "react-native";
import Toast from "react-native-toast-message";

import { FILTERS, FilterDefinition } from "@/constants/filters";
import { HapticService } from "@/services/hapticService";
import { savePhotoToGallery } from "@/services/mediaService";
import { CapturedPhoto, photoStorage } from "@/services/storageService";
import { useSettingsStore } from "@/store/useSettingsStore";

const { width: SCREEN_W } = Dimensions.get("window");

const IDENTITY_MATRIX = [
  1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0,
];

function blendMatrix(filterMatrix: number[], strength: number): number[] {
  return IDENTITY_MATRIX.map(
    (identityVal, i) =>
      identityVal + strength * (filterMatrix[i] - identityVal),
  );
}

export const useEditingLogic = () => {
  const { id, isImport } = useLocalSearchParams<{
    id: string;
    isImport?: string;
  }>();

  const [photo, setPhoto] = useState<CapturedPhoto | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterDefinition>(
    FILTERS[0],
  );
  const [strength, setStrength] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [canvasSize, setCanvasSize] = useState({
    width: SCREEN_W,
    height: 0,
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (id) {
      photoStorage.getPhotoById(id).then((p) => {
        if (p) {
          setPhoto(p);
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 380,
            useNativeDriver: true,
          }).start();
        } else {
          Toast.show({ type: "error", text1: "Photo not found" });
          router.back();
        }
      });
    }
  }, [id]);

  const skImage = useImage(photo?.uri ?? "");
  const blendedMatrix = useMemo(
    () => blendMatrix(activeFilter.matrix, strength),
    [activeFilter.matrix, strength],
  );
  const isNormal = activeFilter.id === "normal";
  const strengthPct = Math.round(strength * 100);

  const handleSelectFilter = (filter: FilterDefinition) => {
    setActiveFilter(filter);
    setStrength(1);
  };

  const handleBack = () => {
    HapticService.trigger("impactMedium");
    router.back();
  };

  const handleCanvasLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setCanvasSize({ width, height });
  };

  const handleSave = async (canvasRef: React.RefObject<any>) => {
    if (!photo || isSaving || !skImage) return;
    HapticService.trigger("impactHeavy");
    setIsSaving(true);
    try {
      const snapshot = canvasRef.current?.makeImageSnapshot();
      if (!snapshot) throw new Error("Canvas snapshot failed");

      const base64 = snapshot.encodeToBase64();
      const filename = `XL_ED_${Date.now().toString(36).toUpperCase()}.png`;
      const filePath = `${FileSystem.documentDirectory}${filename}`;

      await FileSystem.writeAsStringAsync(filePath, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      await photoStorage.savePhoto(filePath);

      const { saveToGallery } = useSettingsStore.getState();
      if (saveToGallery) {
        try {
          await savePhotoToGallery(filePath);
        } catch (galleryError) {
          console.error("Failed to save to gallery:", galleryError);
        }
      }

      if (isImport === "true") {
        await photoStorage.deletePhoto(photo.id);
      }

      Toast.show({
        type: "success",
        text1: "Saved! 🎉",
        text2: `${activeFilter.name} (${strengthPct}%) saved to library`,
      });

      setTimeout(() => {
        router.back();
      }, 500);
    } catch (err) {
      console.error("Save failed:", err);
      Toast.show({
        type: "error",
        text1: "Save failed",
        text2: String(err),
      });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    photo,
    activeFilter,
    strength,
    isSaving,
    canvasSize,
    fadeAnim,
    skImage,
    blendedMatrix,
    isNormal,
    strengthPct,
    handleSelectFilter,
    handleBack,
    handleCanvasLayout,
    handleSave,
    setStrength,
  };
};
