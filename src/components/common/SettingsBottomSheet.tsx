import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import { useTheme } from "@/hooks/useTheme";
import { HapticService } from "@/services/hapticService";
import { photoStorage } from "@/services/storageService";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { theme } from "@/styles/theme";
import { Feather } from "@expo/vector-icons";
import BottomSheet, {
    BottomSheetBackdrop,
    BottomSheetView,
} from "@gorhom/bottom-sheet";
import LottieView from "lottie-react-native";
import React, { forwardRef, useCallback, useMemo, useState } from "react";
import {
    Alert,
    Dimensions,
    Linking,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Toast from "react-native-toast-message";

export type SettingsBottomSheetRef = BottomSheet;

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface SettingsBottomSheetProps {
  onPhotosCleared?: () => void;
}

export const SettingsBottomSheet = forwardRef<
  BottomSheet,
  SettingsBottomSheetProps
>(({ onPhotosCleared }, ref) => {
  const colors = useTheme();
  const [activeView, setActiveView] = useState<"main" | "storage">("main");
  const [showClearModal, setShowClearModal] = useState(false);
  const [showClearFavsModal, setShowClearFavsModal] = useState(false);
  const { clearFavorites } = useFavoritesStore();
  const { saveToGallery, setSaveToGallery, themeMode, setThemeMode } =
    useSettingsStore();

  const styles = useMemo(() => createStyles(colors), [colors]);

  const snapPoints = useMemo(() => [SCREEN_HEIGHT * 0.85], []);

  const handleBack = () => setActiveView("main");

  const themeOptions: {
    label: string;
    value: "system" | "light" | "dark";
    icon: any;
  }[] = [
    { label: "System", value: "system", icon: "monitor" },
    { label: "Light", value: "light", icon: "sun" },
    { label: "Dark", value: "dark", icon: "moon" },
  ];

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.6}
      />
    ),
    [],
  );

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.bottomSheetBackground}
      handleComponent={null}
    >
      <BottomSheetView style={styles.bottomSheetContainer}>
        {/* Persistent Header Animation Section */}
        <View style={styles.headerContainer}>
          <LottieView
            source={require("@/assets/animations/settings.json")}
            autoPlay
            loop
            style={styles.animation}
          />

          {/* Back Button - Top Left */}
          {activeView !== "main" && (
            <TouchableOpacity
              onPress={() => {
                HapticService.trigger("impactMedium");
                handleBack();
              }}
              style={styles.backButton}
            >
              <Feather name="arrow-left" size={22} color={colors.background} />
            </TouchableOpacity>
          )}

          <View style={styles.headerTitleContainer}>
            <View>
              <Text style={styles.headerTitle}>
                {activeView === "main" ? "Settings" : "Storage"}
              </Text>
              <View style={styles.headerUnderline} />
            </View>
          </View>
        </View>

        <View style={styles.contentContainer}>
          {activeView === "main" ? (
            /* Main Options Section */
            <View style={styles.mainOptionsStack}>
              {/* Theme Mode Section */}
              <View style={styles.themeSection}>
                <Text style={styles.sectionTitle}>Appearance</Text>
                <View style={styles.themeGrid}>
                  {themeOptions.map((opt) => (
                    <TouchableOpacity
                      key={opt.value}
                      onPress={() => {
                        HapticService.trigger("selection");
                        setThemeMode(opt.value);
                      }}
                      style={[
                        styles.themeOption,
                        themeMode === opt.value && styles.themeOptionActive,
                      ]}
                    >
                      <Feather
                        name={opt.icon}
                        size={18}
                        color={
                          themeMode === opt.value
                            ? colors.primary
                            : `${colors.background}99` // 60% opacity
                        }
                      />
                      <Text
                        style={[
                          styles.themeLabel,
                          themeMode === opt.value && styles.themeLabelActive,
                        ]}
                      >
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.optionRow}>
                <View style={styles.iconBox}>
                  <Feather name="camera" size={24} color={colors.background} />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>Save to Gallery</Text>
                  <Text style={styles.optionSubtitle}>
                    Automatically backup to phone
                  </Text>
                </View>
                <Switch
                  value={saveToGallery}
                  onValueChange={(value) => {
                    HapticService.trigger("impactLight");
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
                    false: "rgba(0,0,0,0.3)",
                    true: colors.primary,
                  }}
                  thumbColor={colors.background}
                  style={styles.switchControl}
                />
              </View>

              <TouchableOpacity
                onPress={() => {
                  HapticService.trigger("impactMedium");
                  setActiveView("storage");
                }}
                style={styles.optionRow}
              >
                <View style={styles.iconBox}>
                  <Feather
                    name="hard-drive"
                    size={24}
                    color={colors.background}
                  />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>Storage</Text>
                  <Text style={styles.optionSubtitle}>
                    Manage your captures and space
                  </Text>
                </View>
                <Feather
                  name="chevron-right"
                  size={20}
                  color={`${colors.background}80`} // 50% opacity
                />
              </TouchableOpacity>

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
                style={styles.optionRow}
              >
                <View style={styles.iconBox}>
                  <Feather
                    name="help-circle"
                    size={24}
                    color={colors.background}
                  />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>Help & support</Text>
                  <Text style={styles.optionSubtitle}>
                    Get assistance and FAQs
                  </Text>
                </View>
                <Feather
                  name="chevron-right"
                  size={20}
                  color={`${colors.background}80`}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={async () => {
                  HapticService.trigger("impactMedium");
                  const url = "https://silly-squirrel-c4c023.netlify.app/";
                  Linking.openURL(url).catch((err) => {
                    console.error("Failed to open URL:", err);
                    Alert.alert("Error", "Could not open the browser.");
                  });
                }}
                style={styles.optionRow}
              >
                <View style={styles.iconBox}>
                  <Feather name="shield" size={24} color={colors.background} />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>Privacy Policy</Text>
                  <Text style={styles.optionSubtitle}>
                    Read our privacy terms
                  </Text>
                </View>
                <Feather
                  name="chevron-right"
                  size={20}
                  color={`${colors.background}80`}
                />
              </TouchableOpacity>
            </View>
          ) : (
            /* Storage Sub-page Content */
            <View style={styles.storageOptionsStack}>
              <TouchableOpacity
                onPress={() => {
                  HapticService.trigger("impactMedium");
                  setShowClearModal(true);
                }}
                style={styles.storageRow}
              >
                <View style={styles.storageIconBox}>
                  <Feather name="image" size={20} color={colors.background} />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.storageTitle}>Clear Library</Text>
                  <Text style={styles.storageSubtitle}>
                    Delete all captured photos forever
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  HapticService.trigger("impactMedium");
                  setShowClearFavsModal(true);
                }}
                style={styles.storageRow}
              >
                <View style={styles.storageIconBox}>
                  <Feather name="heart" size={20} color={colors.background} />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.storageTitle}>Clear Favorites</Text>
                  <Text style={styles.storageSubtitle}>
                    Remove all photos from favorites
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </BottomSheetView>

      <ConfirmationModal
        visible={showClearModal}
        onClose={() => setShowClearModal(false)}
        onConfirm={async () => {
          setShowClearModal(false);
          await photoStorage.clearPhotos();
          onPhotosCleared?.();
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
    </BottomSheet>
  );
});

const createStyles = (colors: any) =>
  StyleSheet.create({
    bottomSheetBackground: {
      backgroundColor: colors.secondary,
      borderTopLeftRadius: 40,
      borderTopRightRadius: 40,
    },
    bottomSheetContainer: {
      flex: 1,
      overflow: "hidden",
      borderTopLeftRadius: 40,
      borderTopRightRadius: 40,
    },
    headerContainer: {
      height: 300,
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.secondary,
      borderTopLeftRadius: 40,
      borderTopRightRadius: 40,
    },
    animation: {
      width: 220,
      height: 220,
      transform: [{ translateY: -20 }],
    },
    backButton: {
      position: "absolute",
      top: 32,
      left: 24,
      width: 40,
      height: 40,
      backgroundColor: colors.primary,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      zIndex: 10,
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.1)",
    },
    headerTitleContainer: {
      position: "absolute",
      bottom: 24,
      left: 32,
    },
    headerTitle: {
      fontSize: 24,
      color: colors.background,
      fontFamily: theme.fontFamily.brand,
      textTransform: "uppercase",
      letterSpacing: 2,
    },
    headerUnderline: {
      height: 6,
      width: 80,
      backgroundColor: colors.primary,
      marginTop: 8,
    },
    contentContainer: {
      flex: 1,
      paddingHorizontal: 20,
      paddingVertical: 24,
    },
    themeSection: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 14,
      fontFamily: theme.fontFamily.brand,
      color: `${colors.background}80`,
      textTransform: "uppercase",
      letterSpacing: 1,
      marginBottom: 12,
      marginLeft: 4,
    },
    themeGrid: {
      flexDirection: "row",
      gap: 12,
    },
    themeOption: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 12,
      paddingHorizontal: 8,
      backgroundColor: `${colors.background}0D`,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.05)",
      gap: 8,
    },
    themeOptionActive: {
      backgroundColor: `${colors.background}1A`,
      borderColor: colors.primary,
    },
    themeLabel: {
      fontSize: 11,
      fontFamily: theme.fontFamily.fancy,
      color: `${colors.background}99`,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    themeLabelActive: {
      color: colors.primary,
    },
    mainOptionsStack: {
      gap: 16,
    },
    optionRow: {
      flexDirection: "row",
      alignItems: "center",
      padding: 20,
      backgroundColor: `${colors.background}0D`,
      borderRadius: 24,
      gap: 16,
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.05)",
    },
    iconBox: {
      width: 48,
      height: 48,
      backgroundColor: colors.primary,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
    },
    optionTextContainer: {
      flex: 1,
    },
    optionTitle: {
      fontSize: 15,
      fontFamily: theme.fontFamily.fancy,
      color: colors.background,
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    optionSubtitle: {
      fontSize: 12,
      fontFamily: theme.fontFamily.sans,
      color: `${colors.background}80`,
      marginTop: 2,
    },
    switchControl: {
      transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
    },
    storageOptionsStack: {
      gap: 8,
    },
    storageRow: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      backgroundColor: `${colors.background}0D`,
      borderRadius: 20,
      gap: 16,
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.05)",
    },
    storageIconBox: {
      width: 40,
      height: 40,
      backgroundColor: colors.primary,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    storageTitle: {
      fontSize: 16,
      fontFamily: theme.fontFamily.fancy,
      color: colors.background,
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    storageSubtitle: {
      fontSize: 12,
      fontFamily: theme.fontFamily.sans,
      color: `${colors.background}80`,
      marginTop: 2,
    },
  });
