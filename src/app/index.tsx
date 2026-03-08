import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { theme, ThemeColors } from "../styles/theme";

type ThemeMode = "light" | "dark" | "system";

export default function Index() {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>("system");

  const isDarkMode =
    themeMode === "system"
      ? systemColorScheme === "dark"
      : themeMode === "dark";

  const colors = isDarkMode ? theme.darkColors : theme.lightColors;
  const { fontFamily } = theme;

  const styles = getStyles(colors);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Theme Styles</Text>
        </View>

        <View style={styles.buttonGroup}>
          {(["light", "dark", "system"] as ThemeMode[]).map((mode) => (
            <TouchableOpacity
              key={mode}
              style={[
                styles.modeButton,
                themeMode === mode && styles.modeButtonActive,
              ]}
              onPress={() => setThemeMode(mode)}
            >
              <Text
                style={[
                  styles.modeButtonText,
                  themeMode === mode && styles.modeButtonTextActive,
                ]}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Colors</Text>
          {Object.entries(colors).map(([key, value]) => (
            <View key={key} style={styles.row}>
              <View style={[styles.colorBox, { backgroundColor: value }]} />
              <View style={styles.textContainer}>
                <Text style={styles.colorName}>{key}</Text>
                <Text style={styles.colorValue}>{value}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Typography</Text>
          {Object.entries(fontFamily).map(([key, value]) => (
            <View key={key} style={styles.fontRow}>
              <Text style={styles.fontName}>{key}</Text>
              <Text style={[styles.fontSample, { fontFamily: value }]}>
                {value}
              </Text>
              <Text style={[styles.fontSampleLocal, { fontFamily: value }]}>
                The quick brown fox jumps over the lazy dog
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      padding: 24,
    },
    header: {
      marginBottom: 16,
      alignItems: "center",
    },
    title: {
      fontSize: 28,
      fontFamily: theme.fontFamily.brand,
      color: colors.text,
    },
    buttonGroup: {
      flexDirection: "row",
      justifyContent: "center",
      marginBottom: 32,
      backgroundColor: colors.surface,
      borderRadius: 8,
      padding: 4,
      borderWidth: 1,
      borderColor: colors.border,
    },
    modeButton: {
      flex: 1,
      paddingVertical: 10,
      alignItems: "center",
      borderRadius: 6,
    },
    modeButtonActive: {
      backgroundColor: colors.primary,
    },
    modeButtonText: {
      fontFamily: theme.fontFamily.button,
      color: colors.text,
      fontSize: 14,
    },
    modeButtonTextActive: {
      color: theme.lightColors.background,
    },
    section: {
      marginBottom: 32,
    },
    sectionTitle: {
      fontSize: 22,
      fontFamily: theme.fontFamily.fancy,
      color: colors.secondary,
      marginBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      paddingBottom: 8,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
      backgroundColor: colors.surface,
      padding: 12,
      borderRadius: 8,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
      borderWidth: 1,
      borderColor: colors.border,
    },
    colorBox: {
      width: 50,
      height: 50,
      borderRadius: 25,
      borderWidth: 1,
      borderColor: colors.border,
      marginRight: 16,
    },
    textContainer: {
      flex: 1,
    },
    colorName: {
      fontSize: 16,
      fontFamily: theme.fontFamily.button,
      color: colors.text,
      textTransform: "capitalize",
    },
    colorValue: {
      fontSize: 14,
      fontFamily: theme.fontFamily.sans,
      color: colors.muted,
      marginTop: 4,
    },
    fontRow: {
      marginBottom: 20,
      backgroundColor: colors.surface,
      padding: 16,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    fontName: {
      fontSize: 14,
      fontFamily: theme.fontFamily.button,
      color: colors.muted,
      marginBottom: 8,
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    fontSample: {
      fontSize: 18,
      color: colors.primary,
      marginBottom: 4,
    },
    fontSampleLocal: {
      fontSize: 20,
      color: colors.text,
    },
  });
