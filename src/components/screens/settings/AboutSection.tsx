import { HapticService } from "@/services/hapticService";
import { theme } from "@/styles/theme";
import { Feather } from "@expo/vector-icons";
import React from "react";
import {
    Alert,
    Linking,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface AboutSectionProps {
  colors: any;
}

export const AboutSection = ({ colors }: AboutSectionProps) => {
  return (
    <View style={styles(colors).sectionCard}>
      <View style={styles(colors).sectionHeader}>
        <View style={styles(colors).sectionIconRow}>
          <View
            style={[
              styles(colors).sectionIcon,
              { backgroundColor: colors.muted },
            ]}
          >
            <Feather name="info" size={16} color="#FFF" />
          </View>
          <Text style={styles(colors).sectionTitle}>About</Text>
        </View>
      </View>

      {/* Help & Support */}
      <TouchableOpacity
        onPress={async () => {
          HapticService.trigger("impactMedium");
          const mailto =
            "mailto:munawwarh48@gmail.com?subject=XeroLens Support";
          Linking.openURL(mailto).catch((err) => {
            console.error("Failed to open email:", err);
            Alert.alert("Error", "No email app found to send support request.");
          });
        }}
        style={styles(colors).prefRow}
        activeOpacity={0.6}
      >
        <View
          style={[
            styles(colors).prefIcon,
            { backgroundColor: `${colors.accent}25` },
          ]}
        >
          <Feather name="mail" size={20} color={colors.accent} />
        </View>
        <View style={styles(colors).prefTextContainer}>
          <Text style={styles(colors).prefTitle}>Help & Support</Text>
          <Text style={styles(colors).prefSubtitle}>
            Get in touch for assistance
          </Text>
        </View>
        <Feather name="chevron-right" size={20} color={`${colors.text}40`} />
      </TouchableOpacity>

      <View style={styles(colors).divider} />

      {/* Privacy Policy */}
      <TouchableOpacity
        onPress={async () => {
          HapticService.trigger("impactMedium");
          const url = "https://silly-squirrel-c4c023.netlify.app/";
          Linking.openURL(url).catch((err) => {
            console.error("Failed to open URL:", err);
            Alert.alert("Error", "Could not open the browser.");
          });
        }}
        style={styles(colors).prefRow}
        activeOpacity={0.6}
      >
        <View
          style={[
            styles(colors).prefIcon,
            { backgroundColor: `${colors.muted}18` },
          ]}
        >
          <Feather name="shield" size={20} color={colors.muted} />
        </View>
        <View style={styles(colors).prefTextContainer}>
          <Text style={styles(colors).prefTitle}>Privacy Policy</Text>
          <Text style={styles(colors).prefSubtitle}>
            Review our data practices
          </Text>
        </View>
        <Feather name="chevron-right" size={20} color={`${colors.text}40`} />
      </TouchableOpacity>

      <View style={styles(colors).divider} />

      {/* App Version */}
      <View style={styles(colors).prefRow}>
        <View
          style={[
            styles(colors).prefIcon,
            { backgroundColor: `${colors.text}08` },
          ]}
        >
          <Feather name="code" size={20} color={`${colors.text}60`} />
        </View>
        <View style={styles(colors).prefTextContainer}>
          <Text style={styles(colors).prefTitle}>Version</Text>
          <Text style={styles(colors).prefSubtitle}>XeroLens v1.0.0</Text>
        </View>
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
    divider: {
      height: 1,
      backgroundColor: `${colors.text}08`,
      marginHorizontal: 18,
    },
  });
