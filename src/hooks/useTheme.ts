import { useSettingsStore } from "@/store/useSettingsStore";
import { darkColors, lightColors, ThemeColors } from "@/styles/theme";
import { useColorScheme } from "react-native";

export const useTheme = (): ThemeColors => {
  const systemColorScheme = useColorScheme();
  const themeMode = useSettingsStore((state) => state.themeMode);

  if (themeMode === "dark") {
    return darkColors;
  }

  if (themeMode === "light") {
    return lightColors;
  }

  return systemColorScheme === "dark" ? darkColors : lightColors;
};
