import { hp, wp } from "@/helpers/dimensionHelpers";
import { useTheme } from "@/hooks/useTheme";
import { HapticService, HapticType } from "@/services/hapticService";
import { theme } from "@/styles/theme";
import React, { ReactNode, useMemo } from "react";
import {
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  haptic?: HapticType;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  variant?: "variant1" | "variant2";
  textColor?: string;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  containerStyle,
  textStyle,
  haptic = "impactMedium",
  leftIcon,
  rightIcon,
  variant = "variant1",
  textColor,
  disabled = false,
}) => {
  const colors = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const handlePress = () => {
    if (haptic && !disabled) {
      HapticService.trigger(haptic);
    }
    onPress();
  };

  const isVariant2 = variant === "variant2";
  const bgColor = isVariant2 ? colors.primary : colors.secondary;

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={disabled}
      style={[
        styles.button,
        { backgroundColor: bgColor },
        disabled && styles.disabled,
        { width: wp(80), height: hp(7.0) },
        containerStyle,
      ]}
    >
      {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
      <Text
        style={[styles.text, textColor ? { color: textColor } : {}, textStyle]}
      >
        {title}
      </Text>
      {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
    </TouchableOpacity>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    button: {
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    disabled: {
      opacity: 0.5,
    },
    leftIcon: {
      marginRight: 8,
    },
    rightIcon: {
      marginLeft: 8,
    },
    text: {
      color: colors.textLight,
      fontFamily: theme.fontFamily.button,
      fontSize: 16,
      textAlign: "center",
      textTransform: "uppercase",
      letterSpacing: 1,
    },
  });
