import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type ThemeMode = "system" | "light" | "dark";

interface SettingsState {
  saveToGallery: boolean;
  themeMode: ThemeMode;
  setSaveToGallery: (enabled: boolean) => void;
  setThemeMode: (mode: ThemeMode) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      saveToGallery: false,
      themeMode: "system",
      setSaveToGallery: (enabled) => set({ saveToGallery: enabled }),
      setThemeMode: (mode) => set({ themeMode: mode }),
    }),
    {
      name: "xerolens-settings",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
