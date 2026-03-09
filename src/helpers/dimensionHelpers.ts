import { Dimensions } from "react-native";

const { width: viewportWidth, height: viewportHeight } =
  Dimensions.get("window");

export const wp = (percentage: number) => {
  return (percentage * viewportWidth) / 100;
};

export const hp = (percentage: number) => {
  return (percentage * viewportHeight) / 100;
};
