import LottieView from "lottie-react-native";
import React from "react";
import { Text, View } from "react-native";

interface EmptyStateProps {
  title?: string;
  subtitle?: string;
  animationSource?: any;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "Your Library is Empty",
  subtitle = "Photos you take will appear here",
  animationSource = require("@/assets/animations/camera.json"),
}) => {
  return (
    <View className="flex-1 items-center justify-center px-10">
      <View className="w-64 h-64 mb-6">
        <LottieView
          source={animationSource}
          autoPlay
          loop
          style={{ width: "100%", height: "100%" }}
        />
      </View>
      <Text className="text-primary font-brand text-3xl uppercase text-center leading-tight mb-2">
        {title}
      </Text>
      {/* {subtitle && (
        <Text className="text-secondary font-sans text-lg text-center opacity-70">
          {subtitle}
        </Text>
      )} */}
    </View>
  );
};
