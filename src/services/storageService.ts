import AsyncStorage from "@react-native-async-storage/async-storage";

export interface CapturedPhoto {
  id: string;
  uri: string;
  date: number; // timestamp
}

const PHOTOS_KEY = "v1.captured_photos";

export const photoStorage = {
  savePhoto: async (uri: string) => {
    try {
      const photos = await photoStorage.getPhotos();
      const newPhoto: CapturedPhoto = {
        id: Date.now().toString(),
        uri,
        date: Date.now(),
      };
      const updatedPhotos = [newPhoto, ...photos];
      await AsyncStorage.setItem(PHOTOS_KEY, JSON.stringify(updatedPhotos));
      return newPhoto;
    } catch (e) {
      console.error("Error saving photo to AsyncStorage:", e);
      throw e;
    }
  },

  getPhotos: async (): Promise<CapturedPhoto[]> => {
    try {
      const photosJson = await AsyncStorage.getItem(PHOTOS_KEY);
      if (!photosJson) return [];
      return JSON.parse(photosJson);
    } catch (e) {
      console.error("Error parsing photos from storage:", e);
      return [];
    }
  },

  deletePhoto: async (id: string) => {
    try {
      const photos = await photoStorage.getPhotos();
      const updatedPhotos = photos.filter((p) => p.id !== id);
      await AsyncStorage.setItem(PHOTOS_KEY, JSON.stringify(updatedPhotos));
    } catch (e) {
      console.error("Error deleting photo from AsyncStorage:", e);
    }
  },

  clearPhotos: async () => {
    try {
      await AsyncStorage.removeItem(PHOTOS_KEY);
    } catch (e) {
      console.error("Error clearing photos from AsyncStorage:", e);
    }
  },
};
