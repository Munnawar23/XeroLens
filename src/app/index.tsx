import { Button } from "@/components/common/Button";
import { hp } from "@/helpers";
import { useAppPermissions } from "@/hooks/useAppPermissions";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { ImageBackground, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * The initial splash screen of the application.
 * It features a full-screen background image with animated text and a "Get Started" button.
 */
export default function SplashScreen() {
  const { isGranted, requestPermissions } = useAppPermissions();

  // --- Animation Shared Values ---
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(hp(5));
  const subtitleOpacity = useSharedValue(0);
  const subtitleTranslateY = useSharedValue(hp(5));
  const buttonOpacity = useSharedValue(0);
  const buttonTranslateY = useSharedValue(hp(5));

  // --- Entrance Animations ---
  useEffect(() => {
    const animationConfig = { duration: 800, easing: Easing.out(Easing.exp) };
    titleOpacity.value = withDelay(100, withTiming(1, animationConfig));
    titleTranslateY.value = withDelay(100, withTiming(0, animationConfig));
    subtitleOpacity.value = withDelay(300, withTiming(1, animationConfig));
    subtitleTranslateY.value = withDelay(300, withTiming(0, animationConfig));
    buttonOpacity.value = withDelay(500, withTiming(1, animationConfig));
    buttonTranslateY.value = withDelay(500, withTiming(0, animationConfig));
  }, []);

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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (!isGranted) {
      const granted = await requestPermissions();
      if (granted) {
        router.replace("/(tabs)");
      }
    } else {
      router.replace("/(tabs)");
    }
  };

  return (
    <View className="flex-1 bg-black">
      <ImageBackground
        source={require("@/assets/images/splash.webp")}
        className="flex-1"
        resizeMode="cover"
      >
        <SafeAreaView className="flex-1 justify-end pb-6">
          {/* --- Animated Title --- */}
          <Animated.View
            style={[titleAnimatedStyle]}
            className="items-center mb-2"
          >
            <Text className="text-6xl text-white text-center font-brand tracking-tight">
              XeroLens
            </Text>
          </Animated.View>

          {/* --- Animated Subtitle --- */}
          <Animated.View
            style={[subtitleAnimatedStyle]}
            className="items-center px-10 mb-6"
          >
            <Text className="text-2xl text-white text-center font-brand leading-relaxed pt-2">
              Capture every moment in the high fidelity
            </Text>
          </Animated.View>

          <Animated.View style={[buttonAnimatedStyle]} className="items-center">
            <Button
              title="Get Started"
              onPress={handleGetStarted}
              variant="retro"
              haptic={Haptics.ImpactFeedbackStyle.Medium}
            />
          </Animated.View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}
