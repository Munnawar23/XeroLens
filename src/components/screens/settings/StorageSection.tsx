import { HapticService } from "@/services/hapticService";
import { theme } from "@/styles/theme";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface StorageSectionProps {
  colors: any;
  onClearLibrary: () => void;
  onClearFavorites: () => void;
}

export const StorageSection = ({
  colors,
  onClearLibrary,
  onClearFavorites,
}: StorageSectionProps) => {
  return (
    <View style={styles(colors).sectionCard}>
      <View style={styles(colors).sectionHeader}>
        <View style={styles(colors).sectionIconRow}>
          <View
            style={[styles(colors).sectionIcon, { backgroundColor: "#EF4444" }]}
          >
            <Feather name="database" size={16} color="#FFF" />
          </View>
          <Text style={styles(colors).sectionTitle}>Storage</Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => {
          HapticService.trigger("impactMedium");
          onClearLibrary();
        }}
        style={styles(colors).prefRow}
        activeOpacity={0.6}
      >
        <View
          style={[
            styles(colors).prefIcon,
            { backgroundColor: `${colors.primary}20` },
          ]}
        >
          <Feather name="trash-2" size={20} color={colors.primary} />
        </View>
        <View style={styles(colors).prefTextContainer}>
          <Text style={[styles(colors).prefTitle, { color: colors.primary }]}>
            Clear Library
          </Text>
          <Text style={styles(colors).prefSubtitle}>
            Permanently delete all captured photos
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles(colors).divider} />

      <TouchableOpacity
        onPress={() => {
          HapticService.trigger("impactMedium");
          onClearFavorites();
        }}
        style={styles(colors).prefRow}
        activeOpacity={0.6}
      >
        <View
          style={[
            styles(colors).prefIcon,
            { backgroundColor: `${colors.primary}20` },
          ]}
        >
          <Feather name="heart" size={20} color={colors.primary} />
        </View>
        <View style={styles(colors).prefTextContainer}>
          <Text style={[styles(colors).prefTitle, { color: colors.primary }]}>
            Clear Favorites
          </Text>
          <Text style={styles(colors).prefSubtitle}>
            Remove all photos from your favorites list
          </Text>
        </View>
      </TouchableOpacity>
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
    divider: {
      height: 1,
      backgroundColor: `${colors.text}08`,
      marginHorizontal: 18,
    },
  });
