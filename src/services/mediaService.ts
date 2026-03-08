import * as MediaLibrary from "expo-media-library";

export const savePhotoToGallery = async (uri: string) => {
  const { status } = await MediaLibrary.requestPermissionsAsync();

  if (status !== "granted") {
    throw new Error(
      "Gallery permission denied. Please enable it in your device settings.",
    );
  }

  const asset = await MediaLibrary.createAssetAsync(uri);
  return asset;
};
