export const lightColors = {
  primary: "#BC4749",
  secondary: "#3D6F72",
  background: "#F5EEDC",
  text: "#000000",
  surface: "#EADAAD",
  accent: "#A2C5D8",
  border: "#000000",
  muted: "#6B705C",
};

export const darkColors = {
  primary: "#E56B6D",
  secondary: "#5C9A9D",
  background: "#1A1A1A",
  text: "#FFFFFF",
  surface: "#2C2C2C",
  accent: "#B8D8E5",
  border: "#404040",
  muted: "#A3A897",
};

export const theme = {
  lightColors,
  darkColors,
  fontFamily: {
    brand: "AlfaSlabOne-Regular",
    fancy: "Righteous-Regular",
    sans: "Outfit-Regular",
    button: "Outfit-Bold",
  },
};

export type ThemeColors = typeof lightColors;
