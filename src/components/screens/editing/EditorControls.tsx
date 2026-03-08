import { Button } from "@/components/common/Button";
import { FilterDefinition } from "@/constants/filters";
import { useTheme } from "@/hooks/useTheme";
import { theme } from "@/styles/theme";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import React, { useMemo } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { FilterStrip } from "./FilterStrip";

interface EditorControlsProps {
  isNormal: boolean;
  strengthPct: number;
  strength: number;
  setStrength: (val: number) => void;
  photoUri: string;
  activeFilterId: string;
  handleSelectFilter: (filter: FilterDefinition) => void;
  handleBack: () => void;
  handleSave: () => void;
  isSaving: boolean;
}

export const EditorControls: React.FC<EditorControlsProps> = ({
  isNormal,
  strengthPct,
  strength,
  setStrength,
  photoUri,
  activeFilterId,
  handleSelectFilter,
  handleBack,
  handleSave,
  isSaving,
}) => {
  const colors = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      {/* Strength Slider */}
      <View style={[styles.sliderSection, isNormal && styles.sliderDisabled]}>
        <View style={styles.sliderHeader}>
          <Text style={styles.sliderLabel}>Intensity</Text>
          <Text
            style={[
              styles.sliderValue,
              isNormal ? styles.sliderValueMuted : styles.sliderValueActive,
            ]}
          >
            {isNormal ? "—" : `${strengthPct}%`}
          </Text>
        </View>
        <Slider
          style={{ width: "100%", height: 32 }}
          minimumValue={0}
          maximumValue={1}
          step={0.01}
          value={isNormal ? 1 : strength}
          onValueChange={isNormal ? undefined : setStrength}
          disabled={isNormal}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={`${colors.secondary}20`}
          thumbTintColor={colors.primary}
        />
      </View>

      {/* Filter Strip */}
      <FilterStrip
        photoUri={photoUri}
        activeFilterId={activeFilterId}
        onSelectFilter={handleSelectFilter}
      />

      {/* Footer Actions */}
      <View style={styles.footerActions}>
        <TouchableOpacity
          onPress={handleBack}
          activeOpacity={0.7}
          style={styles.backButton}
        >
          <Ionicons name="close" size={24} color={colors.primary} />
        </TouchableOpacity>

        <Button
          title={isSaving ? "Saving..." : "Save Edit"}
          onPress={handleSave}
          disabled={isSaving}
          variant="variant2"
          leftIcon={
            isSaving ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Ionicons name="download-outline" size={20} color="white" />
            )
          }
          containerStyle={styles.saveButton}
        />
      </View>
    </View>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 24,
      paddingBottom: 24,
    },
    sliderSection: {
      marginBottom: 16,
    },
    sliderDisabled: {
      opacity: 0.2,
    },
    sliderHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 4,
      paddingHorizontal: 4,
    },
    sliderLabel: {
      color: colors.text,
      fontFamily: theme.fontFamily.sans,
      fontSize: 10,
      textTransform: "uppercase",
      letterSpacing: 2,
    },
    sliderValue: {
      fontFamily: theme.fontFamily.fancy,
      fontSize: 12,
    },
    sliderValueMuted: {
      color: `${colors.secondary}30`,
    },
    sliderValueActive: {
      color: colors.primary,
    },
    footerActions: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      marginTop: 24,
    },
    backButton: {
      backgroundColor: `${colors.secondary}0D`,
      width: 55,
      height: 55,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: `${colors.secondary}1A`,
    },
    saveButton: {
      flex: 1,
      height: 55,
    },
  });
