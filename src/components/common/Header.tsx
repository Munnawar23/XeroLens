import { useTheme } from "@/hooks/useTheme";
import { HapticService } from "@/services/hapticService";
import { theme } from "@/styles/theme";
import { Feather } from "@expo/vector-icons";
import React, { useMemo } from "react";
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
  const colors = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

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
          <RightIcon size={22} color={colors.text} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 24,
      paddingVertical: 16,
    },
    title: {
      fontSize: 24,
      fontFamily: theme.fontFamily.brand,
      color: colors.text,
      textTransform: "uppercase",
      letterSpacing: -0.5,
    },
    underline: {
      height: 4,
      width: 48,
      backgroundColor: colors.primary,
      marginTop: -4,
    },
    rightButton: {
      width: 40,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.text + "1A",
    },
  });
