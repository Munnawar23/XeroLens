import { HapticService } from "@/services/hapticService";
import { theme } from "@/styles/theme";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ThemePreview } from "./ThemePreview";

interface AppearanceSectionProps {
  colors: any;
  themeMode: "system" | "light" | "dark";
  setThemeMode: (mode: "system" | "light" | "dark") => void;
}

const themeOptions: {
  label: string;
  value: "system" | "light" | "dark";
  icon: any;
}[] = [
  { label: "System", value: "system", icon: "monitor" },
  { label: "Light", value: "light", icon: "sun" },
  { label: "Dark", value: "dark", icon: "moon" },
];

export const AppearanceSection = ({
  colors,
  themeMode,
  setThemeMode,
}: AppearanceSectionProps) => {
  return (
    <View style={styles(colors).sectionCard}>
      <View style={styles(colors).sectionHeader}>
        <View style={styles(colors).sectionIconRow}>
          <View
            style={[
              styles(colors).sectionIcon,
              { backgroundColor: colors.secondary },
            ]}
          >
            <Feather name="eye" size={16} color="#FFF" />
          </View>
          <Text style={styles(colors).sectionTitle}>Appearance</Text>
        </View>
      </View>

      {/* Theme Preview Cards */}
      <View style={styles(colors).themePreviewRow}>
        {themeOptions.map((opt) => (
          <TouchableOpacity
            key={opt.value}
            onPress={() => {
              HapticService.trigger("impactMedium");
              setThemeMode(opt.value);
            }}
            style={styles(colors).themeCard}
            activeOpacity={0.7}
          >
            <ThemePreview
              mode={opt.value}
              isActive={themeMode === opt.value}
              colors={colors}
            />
            <View style={styles(colors).themeLabelRow}>
              <View
                style={[
                  styles(colors).radioOuter,
                  {
                    borderColor:
                      themeMode === opt.value
                        ? colors.primary
                        : `${colors.text}30`,
                  },
                ]}
              >
                {themeMode === opt.value && (
                  <View
                    style={[
                      styles(colors).radioInner,
                      { backgroundColor: colors.primary },
                    ]}
                  />
                )}
              </View>
              <Text
                style={[
                  styles(colors).themeLabel,
                  themeMode === opt.value && {
                    color: colors.primary,
                    fontFamily: theme.fontFamily.button,
                  },
                ]}
              >
                {opt.label}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = (colors: any) =>
  StyleSheet.create({
    sectionCard: {
      backgroundColor: `${colors.text}06`,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: `${colors.text}0A`,
      overflow: "hidden",
    },
    sectionHeader: {
      paddingHorizontal: 18,
      paddingTop: 18,
      paddingBottom: 14,
    },
    sectionIconRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    sectionIcon: {
      width: 28,
      height: 28,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
    },
    sectionTitle: {
      fontSize: 14,
      fontFamily: theme.fontFamily.brand,
      color: `${colors.text}90`,
      textTransform: "uppercase",
      letterSpacing: 1.5,
    },
    themePreviewRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: 14,
      paddingBottom: 18,
      gap: 10,
    },
    themeCard: {
      flex: 1,
      alignItems: "center",
      gap: 10,
    },
    themeLabelRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    radioOuter: {
      width: 16,
      height: 16,
      borderRadius: 8,
      borderWidth: 2,
      alignItems: "center",
      justifyContent: "center",
    },
    radioInner: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    themeLabel: {
      fontSize: 13,
      fontFamily: theme.fontFamily.sans,
      color: `${colors.text}70`,
    },
  });
