import * as MediaLibrary from "expo-media-library";
import { Alert, Linking } from "react-native";

export const savePhotoToGallery = async (uri: string) => {
  try {
    const { status, canAskAgain } =
      await MediaLibrary.getPermissionsAsync(true);

    if (status === "granted") {
      const asset = await MediaLibrary.createAssetAsync(uri);
      return asset;
    }

    if (canAskAgain) {
      const { status: newStatus } =
        await MediaLibrary.requestPermissionsAsync(true);
      if (newStatus === "granted") {
        const asset = await MediaLibrary.createAssetAsync(uri);
        return asset;
      }
    }

    // If we're here, permission is denied and we either can't ask again or they just denied it.
    Alert.alert(
      "Permission Required",
      "Gallery access is needed to save photos. Please enable it in your device settings.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Open Settings", onPress: () => Linking.openSettings() },
      ],
    );

    throw new Error("Gallery permission denied.");
  } catch (error: any) {
    if (error.message !== "Gallery permission denied.") {
      console.error("Save to gallery failed:", error);
    }
    throw error;
  }
};
