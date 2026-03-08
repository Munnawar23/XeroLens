import { HapticService } from "@/services/hapticService";
import { theme } from "@/styles/theme";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface HeaderProps {
  title: string;
  onRightPress?: () => void;
  RightIcon?: React.ElementType<{ size: number; color: string }>;
}

const DefaultSettingsIcon = ({
  size,
  color,
}: {
  size: number;
  color: string;
}) => <Feather name="settings" size={size} color={color} />;

export const Header: React.FC<HeaderProps> = ({
  title,
  onRightPress,
  RightIcon = DefaultSettingsIcon,
}) => {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.underline} />
      </View>

      {onRightPress && (
        <TouchableOpacity
          onPress={() => {
            HapticService.trigger("impactMedium");
            onRightPress();
          }}
          style={styles.rightButton}
        >
          <RightIcon size={22} color={theme.lightColors.secondary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  title: {
    fontSize: 30,
    fontFamily: theme.fontFamily.brand,
    color: theme.lightColors.text,
    textTransform: "uppercase",
    letterSpacing: -0.5,
  },
  underline: {
    height: 4,
    width: 48,
    backgroundColor: theme.lightColors.primary,
    marginTop: -4,
  },
  rightButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: theme.lightColors.secondary + "0D", // 5% opacity
    borderWidth: 1,
    borderColor: theme.lightColors.secondary + "1A", // 10% opacity
  },
});
