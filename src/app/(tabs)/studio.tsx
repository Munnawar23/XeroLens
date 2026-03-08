import { Feather, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInLeft, FadeInUp } from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import { Button } from "@/components/common/Button";
import { useTheme } from "@/hooks/useTheme";
import { HapticService } from "@/services/hapticService";
import { photoStorage } from "@/services/storageService";
import { theme } from "@/styles/theme";

export default function StudioScreen() {
  const colors = useTheme();
  const insets = useSafeAreaInsets();
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const styles = useMemo(() => createStyles(colors), [colors]);

  useFocusEffect(
    useCallback(() => {
      setIsFocused(true);
      return () => {
        setIsFocused(false);
      };
    }, []),
  );

  const handlePickImage = async () => {
    HapticService.trigger("impactMedium");

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (result.canceled) {
      return;
    }

    const asset = result.assets?.[0];
    if (!asset?.uri) return;

    setIsLoading(true);
    try {
      const saved = await photoStorage.savePhoto(asset.uri);
      console.log("Image saved with ID:", saved.id);
      router.push({
        pathname: "/editing",
        params: { id: saved.id, isImport: "true" },
      } as any);
    } catch (err) {
      console.error("Failed to open image:", err);
      Toast.show({
        type: "error",
        text1: "Failed to open image",
        text2: String(err),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("@/assets/images/studio.jpg")}
        style={styles.imageBackground}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
          {isFocused && (
            <View style={styles.content}>
              <Animated.View
                entering={FadeInLeft.delay(200).duration(500)}
                style={styles.closeButtonContainer}
              >
                <TouchableOpacity
                  onPress={() => {
                    HapticService.trigger("impactMedium");
                    router.replace("/(tabs)/library");
                  }}
                  style={styles.closeButton}
                >
                  <Feather name="x" color={colors.textLight} size={32} />
                </TouchableOpacity>
              </Animated.View>

              <View
                style={[
                  styles.bottomContainer,
                  { paddingBottom: insets.bottom + 20 },
                ]}
              >
                <View style={styles.titleWrapper}>
                  <Animated.Text
                    entering={FadeInUp.delay(500).duration(600)}
                    style={styles.titleText}
                  >
                    Retro{"\n"}lenses
                  </Animated.Text>
                </View>

                <Animated.Text
                  entering={FadeInUp.delay(650).duration(600)}
                  style={styles.descriptionText}
                >
                  Edit your photos to some retro cinematic aesthetics and
                  transform your digital captures into timeless masterpieces.
                </Animated.Text>

                <Animated.View entering={FadeInUp.delay(800).duration(600)}>
                  <Button
                    title={isLoading ? "Opening…" : "Edit Picture"}
                    onPress={handlePickImage}
                    variant="variant2"
                    containerStyle={{ width: "100%", height: 65 }}
                    leftIcon={
                      isLoading ? (
                        <ActivityIndicator
                          color={colors.textLight}
                          size="small"
                        />
                      ) : (
                        <Ionicons
                          name="sparkles"
                          size={24}
                          color={colors.textLight}
                        />
                      )
                    }
                  />
                </Animated.View>
              </View>
            </View>
          )}
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.text,
    },
    imageBackground: {
      flex: 1,
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0, 0, 0, 0.4)",
    },
    safeArea: {
      flex: 1,
    },
    content: {
      flex: 1,
      justifyContent: "space-between",
      paddingVertical: 24,
    },
    closeButtonContainer: {
      paddingHorizontal: 24,
    },
    closeButton: {
      width: 50,
      height: 50,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primary,
      borderRadius: 25,
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.1)",
    },
    bottomContainer: {
      paddingHorizontal: 32,
    },
    titleWrapper: {
      marginBottom: 12,
    },
    titleText: {
      color: colors.textLight,
      fontSize: 50,
      textTransform: "uppercase",
      fontFamily: theme.fontFamily.brand,
      lineHeight: 58,
      paddingTop: 10,
    },
    descriptionText: {
      color: colors.textLight,
      fontSize: 18,
      lineHeight: 28,
      marginBottom: 28,
      fontFamily: theme.fontFamily.fancy,
      width: "90%",
    },
  });
