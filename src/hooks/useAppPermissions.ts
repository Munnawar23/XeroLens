import { useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { useEffect, useState } from "react";

export const useAppPermissions = () => {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaGranted, setMediaGranted] = useState(false);

  // Check media permissions manually on mount
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const status = await MediaLibrary.getPermissionsAsync(true);
        setMediaGranted(status.granted);
      } catch (error) {
        console.warn("Failed to check media permissions:", error);
        setMediaGranted(false);
      }
    };
    checkPermissions();
  }, []);

  const isGranted = cameraPermission?.granted && mediaGranted;

  const requestPermissions = async () => {
    // 1. Camera
    let isCameraGranted = false;
    try {
      if (cameraPermission?.granted) {
        isCameraGranted = true;
      } else {
        const cameraStatus = await requestCameraPermission();
        isCameraGranted = cameraStatus.granted;
      }
    } catch (error) {
      console.warn("Camera permission request failed:", error);
    }

    // 2. Media Library (Write Only)
    let isMediaGranted = mediaGranted;
    if (!isMediaGranted) {
      try {
        const mediaStatus = await MediaLibrary.requestPermissionsAsync(true);
        isMediaGranted = mediaStatus.granted;
        setMediaGranted(isMediaGranted);
      } catch (error) {
        console.warn("Media library permission request failed:", error);
        isMediaGranted = false;
      }
    }

    return isCameraGranted && isMediaGranted;
  };

  return { isGranted, requestPermissions };
};
