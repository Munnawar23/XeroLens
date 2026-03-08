import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface SettingsState {
  saveToGallery: boolean;
  setSaveToGallery: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      saveToGallery: false,
      setSaveToGallery: (enabled) => set({ saveToGallery: enabled }),
    }),
    {
      name: "xerolens-settings",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
