import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import { useTheme } from "@/hooks/useTheme";
import { HapticService } from "@/services/hapticService";
import { photoStorage } from "@/services/storageService";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import { useLibraryStore } from "@/store/useLibraryStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { theme } from "@/styles/theme";
import { Feather } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

// Mini phone preview component for the theme selector
const ThemePreview = ({
  mode,
  isActive,
  colors,
}: {
  mode: "light" | "dark" | "system";
  isActive: boolean;
  colors: any;
}) => {
  const previewBg =
    mode === "light"
      ? "#F5EEDC"
      : mode === "dark"
        ? "#121212"
        : colors.background;
  const previewText =
    mode === "light" ? "#000" : mode === "dark" ? "#FFF" : colors.text;
  const previewAccent =
    mode === "light" ? "#BC4749" : mode === "dark" ? "#E56B6D" : colors.primary;

  return (
    <View
      style={[
        previewStyles.phoneFrame,
        {
          borderColor: isActive ? colors.primary : `${colors.text}15`,
          backgroundColor: previewBg,
        },
      ]}
    >
      {/* Status bar mock */}
      <View
        style={[
          previewStyles.statusBar,
          { backgroundColor: `${previewText}10` },
        ]}
      >
        <View
          style={[previewStyles.statusDot, { backgroundColor: previewAccent }]}
        />
        <View
          style={[
            previewStyles.statusLine,
            { backgroundColor: `${previewText}30` },
          ]}
        />
      </View>
      {/* Content lines mock */}
      <View style={previewStyles.contentArea}>
        <View
          style={[
            previewStyles.contentLine,
            { backgroundColor: `${previewText}25`, width: "70%" },
          ]}
        />
        <View
          style={[
            previewStyles.contentLine,
            { backgroundColor: `${previewText}15`, width: "90%" },
          ]}
        />
        <View
          style={[
            previewStyles.contentLine,
            { backgroundColor: `${previewText}15`, width: "50%" },
          ]}
        />
        {/* Photo grid mock */}
        <View style={previewStyles.gridRow}>
          <View
            style={[
              previewStyles.gridItem,
              { backgroundColor: previewAccent + "40" },
            ]}
          />
          <View
            style={[
              previewStyles.gridItem,
              { backgroundColor: `${previewText}12` },
            ]}
          />
        </View>
        <View style={previewStyles.gridRow}>
          <View
            style={[
              previewStyles.gridItem,
              { backgroundColor: `${previewText}12` },
            ]}
          />
          <View
            style={[
              previewStyles.gridItem,
              { backgroundColor: previewAccent + "25" },
            ]}
          />
        </View>
      </View>
      {/* Tab bar mock */}
      <View
        style={[
          previewStyles.tabBar,
          { backgroundColor: mode === "dark" ? "#2C2C2C" : "#3D6F72" },
        ]}
      >
        <View style={[previewStyles.tabDot, { backgroundColor: "#FFF50" }]} />
        <View style={[previewStyles.tabDot, { backgroundColor: "#FFF50" }]} />
        <View style={[previewStyles.tabDot, { backgroundColor: "#FFF" }]} />
      </View>
    </View>
  );
};

const previewStyles = StyleSheet.create({
  phoneFrame: {
    width: 72,
    height: 130,
    borderRadius: 12,
    borderWidth: 2,
    overflow: "hidden",
    padding: 4,
  },
  statusBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
    paddingVertical: 3,
    borderRadius: 4,
    marginBottom: 4,
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusLine: {
    flex: 1,
    height: 3,
    borderRadius: 2,
  },
  contentArea: {
    flex: 1,
    gap: 4,
    paddingHorizontal: 2,
  },
  contentLine: {
    height: 4,
    borderRadius: 2,
  },
  gridRow: {
    flexDirection: "row",
    gap: 3,
    marginTop: 2,
  },
  gridItem: {
    flex: 1,
    height: 22,
    borderRadius: 4,
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 4,
  },
  tabDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
});

export default function SettingsScreen() {
  const colors = useTheme();
  const [showClearModal, setShowClearModal] = useState(false);
  const [showClearFavsModal, setShowClearFavsModal] = useState(false);
  const { clearFavorites } = useFavoritesStore();
  const { fetchPhotos } = useLibraryStore();
  const { saveToGallery, setSaveToGallery, themeMode, setThemeMode } =
    useSettingsStore();

  const styles = useMemo(() => createStyles(colors), [colors]);

  const themeOptions: {
    label: string;
    value: "system" | "light" | "dark";
    icon: any;
  }[] = [
    { label: "System", value: "system", icon: "monitor" },
    { label: "Light", value: "light", icon: "sun" },
    { label: "Dark", value: "dark", icon: "moon" },
  ];

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.headerTitle}>Settings</Text>
            <View style={styles.headerUnderline} />
          </View>
        </View>

        <ScrollView
          style={styles.flex1}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <>
            {/* ═══ APPEARANCE SECTION ═══ */}
            <View style={[styles.sectionCard]}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconRow}>
                  <View
                    style={[
                      styles.sectionIcon,
                      { backgroundColor: colors.secondary },
                    ]}
                  >
                    <Feather name="eye" size={16} color="#FFF" />
                  </View>
                  <Text style={styles.sectionTitle}>Appearance</Text>
                </View>
              </View>

              {/* Theme Preview Cards */}
              <View style={styles.themePreviewRow}>
                {themeOptions.map((opt) => (
                  <TouchableOpacity
                    key={opt.value}
                    onPress={() => {
                      HapticService.trigger("impactMedium");
                      setThemeMode(opt.value);
                    }}
                    style={styles.themeCard}
                    activeOpacity={0.7}
                  >
                    <ThemePreview
                      mode={opt.value}
                      isActive={themeMode === opt.value}
                      colors={colors}
                    />
                    <View style={styles.themeLabelRow}>
                      <View
                        style={[
                          styles.radioOuter,
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
                              styles.radioInner,
                              { backgroundColor: colors.primary },
                            ]}
                          />
                        )}
                      </View>
                      <Text
                        style={[
                          styles.themeLabel,
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

            {/* ═══ PREFERENCES SECTION ═══ */}
            <View style={[styles.sectionCard]}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconRow}>
                  <View
                    style={[
                      styles.sectionIcon,
                      { backgroundColor: colors.primary },
                    ]}
                  >
                    <Feather name="sliders" size={16} color="#FFF" />
                  </View>
                  <Text style={styles.sectionTitle}>Preferences</Text>
                </View>
              </View>

              {/* Save to Gallery */}
              <View style={styles.prefRow}>
                <View
                  style={[
                    styles.prefIcon,
                    { backgroundColor: `${colors.primary}18` },
                  ]}
                >
                  <Feather name="download" size={20} color={colors.primary} />
                </View>
                <View style={styles.prefTextContainer}>
                  <Text style={styles.prefTitle}>Save to Gallery</Text>
                  <Text style={styles.prefSubtitle}>
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
                      position: "bottom",
                    });
                  }}
                  trackColor={{
                    false: colors.muted,
                    true: colors.primary,
                  }}
                  thumbColor="#FFFFFF"
                  style={styles.switchControl}
                />
              </View>
            </View>

            {/* ═══ STORAGE SECTION ═══ */}
            <View style={[styles.sectionCard]}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconRow}>
                  <View
                    style={[styles.sectionIcon, { backgroundColor: "#EF4444" }]}
                  >
                    <Feather name="database" size={16} color="#FFF" />
                  </View>
                  <Text style={styles.sectionTitle}>Storage</Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => {
                  HapticService.trigger("impactMedium");
                  setShowClearModal(true);
                }}
                style={styles.prefRow}
                activeOpacity={0.6}
              >
                <View
                  style={[
                    styles.prefIcon,
                    { backgroundColor: `${colors.primary}20` },
                  ]}
                >
                  <Feather name="trash-2" size={20} color={colors.primary} />
                </View>
                <View style={styles.prefTextContainer}>
                  <Text style={[styles.prefTitle, { color: colors.primary }]}>
                    Clear Library
                  </Text>
                  <Text style={styles.prefSubtitle}>
                    Permanently delete all captured photos
                  </Text>
                </View>
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity
                onPress={() => {
                  HapticService.trigger("impactMedium");
                  setShowClearFavsModal(true);
                }}
                style={styles.prefRow}
                activeOpacity={0.6}
              >
                <View
                  style={[
                    styles.prefIcon,
                    { backgroundColor: `${colors.primary}20` },
                  ]}
                >
                  <Feather name="heart" size={20} color={colors.primary} />
                </View>
                <View style={styles.prefTextContainer}>
                  <Text style={[styles.prefTitle, { color: colors.primary }]}>
                    Clear Favorites
                  </Text>
                  <Text style={styles.prefSubtitle}>
                    Remove all photos from your favorites list
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* ═══ ABOUT SECTION ═══ */}
            <View style={[styles.sectionCard]}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconRow}>
                  <View
                    style={[
                      styles.sectionIcon,
                      { backgroundColor: colors.muted },
                    ]}
                  >
                    <Feather name="info" size={16} color="#FFF" />
                  </View>
                  <Text style={styles.sectionTitle}>About</Text>
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
                    Alert.alert(
                      "Error",
                      "No email app found to send support request.",
                    );
                  });
                }}
                style={styles.prefRow}
                activeOpacity={0.6}
              >
                <View
                  style={[
                    styles.prefIcon,
                    { backgroundColor: `${colors.accent}25` },
                  ]}
                >
                  <Feather name="mail" size={20} color={colors.accent} />
                </View>
                <View style={styles.prefTextContainer}>
                  <Text style={styles.prefTitle}>Help & Support</Text>
                  <Text style={styles.prefSubtitle}>
                    Get in touch for assistance
                  </Text>
                </View>
                <Feather
                  name="chevron-right"
                  size={20}
                  color={`${colors.text}40`}
                />
              </TouchableOpacity>

              <View style={styles.divider} />

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
                style={styles.prefRow}
                activeOpacity={0.6}
              >
                <View
                  style={[
                    styles.prefIcon,
                    { backgroundColor: `${colors.muted}18` },
                  ]}
                >
                  <Feather name="shield" size={20} color={colors.muted} />
                </View>
                <View style={styles.prefTextContainer}>
                  <Text style={styles.prefTitle}>Privacy Policy</Text>
                  <Text style={styles.prefSubtitle}>
                    Review our data practices
                  </Text>
                </View>
                <Feather
                  name="chevron-right"
                  size={20}
                  color={`${colors.text}40`}
                />
              </TouchableOpacity>

              <View style={styles.divider} />

              {/* App Version */}
              <View style={styles.prefRow}>
                <View
                  style={[
                    styles.prefIcon,
                    { backgroundColor: `${colors.text}08` },
                  ]}
                >
                  <Feather name="code" size={20} color={`${colors.text}60`} />
                </View>
                <View style={styles.prefTextContainer}>
                  <Text style={styles.prefTitle}>Version</Text>
                  <Text style={styles.prefSubtitle}>XeroLens v1.0.0</Text>
                </View>
              </View>
            </View>
          </>
        </ScrollView>
      </SafeAreaView>

      <ConfirmationModal
        visible={showClearModal}
        onClose={() => setShowClearModal(false)}
        onConfirm={async () => {
          setShowClearModal(false);
          await photoStorage.clearPhotos();
          fetchPhotos();
          Toast.show({
            type: "success",
            text1: "Library Cleared",
            text2: "All photos have been deleted.",
          });
        }}
        title="Clear Library"
        message="Are you sure you want to delete all photos? This action is permanent."
        confirmTitle="Delete All"
        isDanger={true}
      />

      <ConfirmationModal
        visible={showClearFavsModal}
        onClose={() => setShowClearFavsModal(false)}
        onConfirm={() => {
          setShowClearFavsModal(false);
          clearFavorites();
          Toast.show({
            type: "success",
            text1: "Favorites Cleared",
            text2: "All favorite photos have been removed.",
          });
        }}
        title="Clear Favorites"
        message="Are you sure you want to clear all your favorites? This won't delete the library files."
        confirmTitle="Delete All"
        isDanger={true}
      />
    </View>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    safeArea: {
      flex: 1,
    },
    flex1: {
      flex: 1,
    },

    // ── Header ──
    headerContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 24,
      paddingVertical: 16,
      gap: 16,
    },
    backButton: {
      width: 40,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 20,
      borderWidth: 1,
      borderColor: `${colors.text}1A`,
    },
    headerTitle: {
      fontSize: 25,
      fontFamily: theme.fontFamily.brand,
      color: colors.text,
      textTransform: "uppercase",
      letterSpacing: -0.5,
    },
    headerUnderline: {
      height: 4,
      width: 48,
      backgroundColor: colors.primary,
      marginTop: -4,
    },

    // ── Scroll ──
    scrollContent: {
      paddingHorizontal: 20,
      paddingBottom: 40,
      gap: 20,
    },

    // ── Section Cards ──
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

    // ── Theme Previews ──
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

    // ── Preference Rows ──
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
    divider: {
      height: 1,
      backgroundColor: `${colors.text}08`,
      marginHorizontal: 18,
    },

    // ── Footer ──
    footer: {
      alignItems: "center",
      paddingVertical: 16,
    },
    footerText: {
      fontSize: 13,
      fontFamily: theme.fontFamily.sans,
      color: `${colors.text}40`,
    },
  });
