import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import { useTheme } from "@/hooks/useTheme";
import { photoStorage } from "@/services/storageService";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import { useLibraryStore } from "@/store/useLibraryStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { theme } from "@/styles/theme";
import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import { AboutSection } from "@/components/screens/settings/AboutSection";
import { AppearanceSection } from "@/components/screens/settings/AppearanceSection";
import { PreferencesSection } from "@/components/screens/settings/PreferencesSection";
import { StorageSection } from "@/components/screens/settings/StorageSection";

export default function SettingsScreen() {
  const colors = useTheme();
  const [showClearModal, setShowClearModal] = useState(false);
  const [showClearFavsModal, setShowClearFavsModal] = useState(false);
  const { clearFavorites } = useFavoritesStore();
  const { fetchPhotos } = useLibraryStore();
  const { saveToGallery, setSaveToGallery, themeMode, setThemeMode } =
    useSettingsStore();

  const styles = useMemo(() => createStyles(colors), [colors]);

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
          {/* Appearance Section */}
          <AppearanceSection
            colors={colors}
            themeMode={themeMode}
            setThemeMode={setThemeMode}
          />

          {/* Preferences Section */}
          <PreferencesSection
            colors={colors}
            saveToGallery={saveToGallery}
            setSaveToGallery={setSaveToGallery}
          />

          {/* Storage Section */}
          <StorageSection
            colors={colors}
            onClearLibrary={() => setShowClearModal(true)}
            onClearFavorites={() => setShowClearFavsModal(true)}
          />

          {/* About Section */}
          <AboutSection colors={colors} />
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
  });
