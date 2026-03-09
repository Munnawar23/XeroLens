import { HapticService } from "@/services/hapticService";
import { theme } from "@/styles/theme";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Switch, Text, View } from "react-native";
import Toast from "react-native-toast-message";

interface PreferencesSectionProps {
  colors: any;
  saveToGallery: boolean;
  setSaveToGallery: (value: boolean) => void;
}

export const PreferencesSection = ({
  colors,
  saveToGallery,
  setSaveToGallery,
}: PreferencesSectionProps) => {
  return (
    <View style={styles(colors).sectionCard}>
      <View style={styles(colors).sectionHeader}>
        <View style={styles(colors).sectionIconRow}>
          <View
            style={[
              styles(colors).sectionIcon,
              { backgroundColor: colors.primary },
            ]}
          >
            <Feather name="sliders" size={16} color="#FFF" />
          </View>
          <Text style={styles(colors).sectionTitle}>Preferences</Text>
        </View>
      </View>

      {/* Save to Gallery */}
      <View style={styles(colors).prefRow}>
        <View
          style={[
            styles(colors).prefIcon,
            { backgroundColor: `${colors.primary}18` },
          ]}
        >
          <Feather name="download" size={20} color={colors.primary} />
        </View>
        <View style={styles(colors).prefTextContainer}>
          <Text style={styles(colors).prefTitle}>Save to Gallery</Text>
          <Text style={styles(colors).prefSubtitle}>
            Auto-save captures to your phone gallery
          </Text>
        </View>
        <Switch
          value={saveToGallery}
          onValueChange={(value) => {
            HapticService.trigger("impactMedium");
            setSaveToGallery(value);
            Toast.show({
              type: "success",
              text1: "Gallery Save",
              text2: value
                ? "Automatic Save enabled! 📸"
                : "Automatic Save disabled 🚫",
            });
          }}
          trackColor={{
            false: colors.muted,
            true: colors.primary,
          }}
          thumbColor="#FFFFFF"
          style={styles(colors).switchControl}
        />
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
    prefRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 18,
      paddingVertical: 14,
      gap: 14,
    },
    prefIcon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    prefTextContainer: {
      flex: 1,
    },
    prefTitle: {
      fontSize: 16,
      fontFamily: theme.fontFamily.fancy,
      color: colors.text,
      letterSpacing: 0.3,
    },
    prefSubtitle: {
      fontSize: 13,
      fontFamily: theme.fontFamily.sans,
      color: `${colors.text}60`,
      marginTop: 2,
    },
    switchControl: {
      transform: [{ scaleX: 1.05 }, { scaleY: 1.05 }],
    },
  });
