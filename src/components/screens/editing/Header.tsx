import { FilterDefinition } from "@/constants/filters";
import { useTheme } from "@/hooks/useTheme";
import { HapticService } from "@/services/hapticService";
import { theme } from "@/styles/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface HeaderProps {
  onBack: () => void;
  onSave: () => void;
  isSaving: boolean;
  activeFilter: FilterDefinition;
  isNormal: boolean;
  strengthPct: number;
}

export const Header: React.FC<HeaderProps> = ({
  onBack,
  onSave,
  isSaving,
  activeFilter,
  isNormal,
  strengthPct,
}) => {
  const colors = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        onPress={() => {
          HapticService.trigger("impactMedium");
          onBack();
        }}
        activeOpacity={0.7}
        style={styles.backButton}
      >
        <Ionicons name="chevron-back" size={22} color={colors.primary} />
      </TouchableOpacity>

      {/* Center Title */}
      <View style={styles.centerContainer}>
        <Text style={styles.titleText}>Edit Photo</Text>
        <Text style={styles.subtitleText}>
          {activeFilter.emoji} {activeFilter.name}
          {!isNormal && ` · ${strengthPct}%`}
        </Text>
      </View>

      {/* Save Button */}
      <TouchableOpacity
        onPress={() => {
          HapticService.trigger("impactHeavy");
          onSave();
        }}
        disabled={isSaving}
        activeOpacity={0.8}
        style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
      >
        {isSaving ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <Ionicons name="checkmark" size={20} color="white" />
        )}
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 24,
      height: 64,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: `${colors.secondary}0D`,
      borderWidth: 1,
      borderColor: `${colors.secondary}1A`,
      alignItems: "center",
      justifyContent: "center",
    },
    centerContainer: {
      alignItems: "center",
    },
    titleText: {
      color: colors.text,
      fontFamily: theme.fontFamily.brand,
      fontSize: 12,
      textTransform: "uppercase",
      letterSpacing: 2,
    },
    subtitleText: {
      color: colors.primary,
      fontFamily: theme.fontFamily.fancy,
      fontSize: 14,
      letterSpacing: 0.5,
    },
    saveButton: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    saveButtonDisabled: {
      opacity: 0.5,
    },
  });
