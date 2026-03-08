import { useCameraPermissions } from "expo-camera";

export const useAppPermissions = () => {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();

  const isGranted = cameraPermission?.granted;

  const requestPermissions = async () => {
    // Check and request Camera permission
    let isCameraGranted = cameraPermission?.granted;
    if (!isCameraGranted && cameraPermission?.canAskAgain) {
      const cameraStatus = await requestCameraPermission();
      isCameraGranted = cameraStatus.granted;
    }

    return isCameraGranted;
  };

  return { isGranted, requestPermissions };
};
