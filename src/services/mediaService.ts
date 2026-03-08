import * as MediaLibrary from "expo-media-library";

export const savePhotoToGallery = async (uri: string) => {
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync(true);

    if (status !== "granted") {
      throw new Error(
        "Gallery permission denied. Please enable it in your device settings.",
      );
    }

    const asset = await MediaLibrary.createAssetAsync(uri);
    return asset;
  } catch (error: any) {
    console.error("Save to gallery failed:", error);
    throw error;
  }
};
