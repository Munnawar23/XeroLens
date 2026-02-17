import { hp, wp } from "@/helpers";
import * as Haptics from "expo-haptics";
import React from "react";
import { Text, TextStyle, TouchableOpacity, ViewStyle } from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "retro";
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  haptic?: Haptics.ImpactFeedbackStyle;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  containerStyle,
  textStyle,
  haptic = Haptics.ImpactFeedbackStyle.Light,
  className = "",
}) => {
  const handlePress = () => {
    if (haptic) {
      Haptics.impactAsync(haptic);
    }
    onPress();
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "secondary":
        return "bg-secondary";
      case "outline":
        return "border border-primary bg-transparent";
      case "retro":
        return "bg-accent shadow-2xl";
      default:
        return "bg-accent";
    }
  };

  const getTextColor = () => {
    return "text-white";
  };

  const getTextTransform = () => {
    return variant === "retro" ? "uppercase tracking-widest" : "";
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      className={`${getVariantStyles()} rounded-2xl items-center justify-center ${className}`}
      style={[{ width: wp(80), height: hp(7.0) }, containerStyle]}
    >
      <Text
        className={`${getTextColor()} text-lg font-brand uppercase ${getTextTransform()}`}
        style={textStyle}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};
