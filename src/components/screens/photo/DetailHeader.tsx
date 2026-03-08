import { useTheme } from "@/hooks/useTheme";
import { HapticService } from "@/services/hapticService";
import { theme } from "@/styles/theme";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface DetailHeaderProps {
  date: Date | string | number;
  onDeletePress: () => void;
  isDeleting?: boolean;
}

export const DetailHeader: React.FC<DetailHeaderProps> = ({
  date,
  onDeletePress,
  isDeleting,
}) => {
  const colors = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const handleBack = () => {
    HapticService.trigger("impactMedium");
    router.back();
  };

  const handleDelete = () => {
    HapticService.trigger("impactHeavy");
    onDeletePress();
  };

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={handleBack} style={styles.backButton}>
        <Feather name="chevron-left" size={24} color={colors.primary} />
      </TouchableOpacity>

      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Photo Detail</Text>
        <Text style={styles.subtitleText}>
          {new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </Text>
      </View>

      <TouchableOpacity
        onPress={handleDelete}
        style={styles.deleteButton}
        disabled={isDeleting}
      >
        <Feather name="trash-2" size={24} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    headerContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 24,
      paddingVertical: 16,
    },
    backButton: {
      backgroundColor: `${colors.secondary}1A`,
      padding: 12,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: `${colors.secondary}1A`,
    },
    titleContainer: {
      position: "absolute",
      left: 0,
      right: 0,
      alignItems: "center",
      zIndex: -1,
    },
    titleText: {
      color: colors.text,
      fontFamily: theme.fontFamily.brand,
      fontSize: 16,
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    subtitleText: {
      color: colors.text,
      fontFamily: theme.fontFamily.fancy,
      fontSize: 14,
      textTransform: "uppercase",
      opacity: 0.7,
    },
    deleteButton: {
      backgroundColor: `${colors.secondary}1A`,
      padding: 12,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: `${colors.secondary}1A`,
    },
  });
