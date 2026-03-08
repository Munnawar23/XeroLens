import { Button } from "@/components/common/Button";
import { hp } from "@/helpers";
import { useAppPermissions } from "@/hooks/useAppPermissions";
import { HapticService } from "@/services/hapticService";
import { theme } from "@/styles/theme";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const HAS_LAUNCHED_KEY = "v1.has_launched";

export default function SplashScreen() {
  const { isGranted, requestPermissions } = useAppPermissions();

  // --- Animation Shared Values ---
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(hp(5));
  const subtitleOpacity = useSharedValue(0);
  const subtitleTranslateY = useSharedValue(hp(5));
  const buttonOpacity = useSharedValue(0);
  const buttonTranslateY = useSharedValue(hp(5));

  const [isChecking, setIsChecking] = useState(true);

  // --- Entrance Animations & First Launch Check ---
  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem(HAS_LAUNCHED_KEY);
        if (hasLaunched === "true") {
          router.replace("/(tabs)" as any);
          return;
        }
      } catch (error) {
        console.error("Error checking first launch:", error);
      } finally {
        setIsChecking(false);
      }

      // If not launched before, run entrance animations
      const animationConfig = {
        duration: 1000,
        easing: Easing.out(Easing.exp),
      };
      titleOpacity.value = withDelay(200, withTiming(1, animationConfig));
      titleTranslateY.value = withDelay(200, withTiming(0, animationConfig));
      subtitleOpacity.value = withDelay(600, withTiming(1, animationConfig));
      subtitleTranslateY.value = withDelay(600, withTiming(0, animationConfig));
      buttonOpacity.value = withDelay(1000, withTiming(1, animationConfig));
      buttonTranslateY.value = withDelay(1000, withTiming(0, animationConfig));
    };

    checkFirstLaunch();
  }, [
    titleOpacity,
    titleTranslateY,
    subtitleOpacity,
    subtitleTranslateY,
    buttonOpacity,
    buttonTranslateY,
  ]);

  // --- Animated Styles ---
  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));
  const subtitleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
    transform: [{ translateY: subtitleTranslateY.value }],
  }));
  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ translateY: buttonTranslateY.value }],
  }));

  // --- Button Handler with Haptic & Permissions ---
  const handleGetStarted = async () => {
    HapticService.trigger("impactMedium");

    // Set the flag so splash doesn't show again
    try {
      await AsyncStorage.setItem(HAS_LAUNCHED_KEY, "true");
    } catch (error) {
      console.error("Error saving launch state:", error);
    }

    if (!isGranted) {
      const granted = await requestPermissions();
      if (granted) {
        router.replace("/(tabs)" as any);
      }
    } else {
      router.replace("/(tabs)" as any);
    }
  };

  if (isChecking) {
    return <View style={styles.checkingContainer} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageBackgroundWrapper}>
        <ImageBackground
          source={require("@/assets/images/splash.jpg")}
          style={styles.imageBackground}
          resizeMode="cover"
        >
          <View style={styles.overlay} />
          <SafeAreaView style={styles.safeArea}>
            {/* --- Animated Title --- */}
            <Animated.View style={[styles.titleContainer, titleAnimatedStyle]}>
              <Text style={styles.titleText}>XeroLens</Text>
            </Animated.View>

            {/* --- Animated Subtitle --- */}
            <Animated.View
              style={[styles.subtitleContainer, subtitleAnimatedStyle]}
            >
              <Text style={styles.subtitleText}>
                Capture the soul of vintage film photography reimagined for the
                high-fidelity modern age
              </Text>
            </Animated.View>

            <Animated.View
              style={[styles.buttonContainer, buttonAnimatedStyle]}
            >
              <Button
                title="GET STARTED"
                onPress={handleGetStarted}
                variant="variant2"
                textColor="#FFFFFF"
                rightIcon={
                  <Feather name="arrow-right" color="white" size={20} />
                }
              />
            </Animated.View>
          </SafeAreaView>
        </ImageBackground>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  checkingContainer: {
    flex: 1,
    backgroundColor: theme.lightColors.background,
  },
  container: {
    flex: 1,
    backgroundColor: theme.lightColors.background,
  },
  imageBackgroundWrapper: {
    flex: 1,
    backgroundColor: "#1A1A1A",
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
    justifyContent: "flex-end",
    paddingBottom: 40,
  },
  titleContainer: {
    alignItems: "center",
  },
  titleText: {
    fontSize: 48,
    color: theme.lightColors.background,
    textAlign: "center",
    fontFamily: theme.fontFamily.brand,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  subtitleContainer: {
    alignItems: "center",
    paddingHorizontal: 40,
    marginBottom: 32,
  },
  subtitleText: {
    fontSize: 20,
    color: theme.lightColors.background,
    textAlign: "center",
    fontFamily: theme.fontFamily.fancy,
    paddingTop: 16,
    lineHeight: 24,
  },
  buttonContainer: {
    alignItems: "center",
  },
});
