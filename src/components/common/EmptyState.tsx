import { theme } from "@/styles/theme";
import LottieView from "lottie-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

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
    <View style={styles.container}>
      <View style={styles.animationContainer}>
        <LottieView
          source={animationSource}
          autoPlay
          loop
          style={styles.animation}
        />
      </View>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  animationContainer: {
    width: 256,
    height: 256,
    marginBottom: 24,
  },
  animation: {
    width: "100%",
    height: "100%",
  },
  title: {
    color: theme.lightColors.text,
    fontFamily: theme.fontFamily.brand,
    fontSize: 30,
    textTransform: "uppercase",
    textAlign: "center",
    lineHeight: 36,
    marginBottom: 8,
  },
  subtitle: {
    color: theme.lightColors.secondary,
    fontFamily: theme.fontFamily.sans,
    fontSize: 18,
    textAlign: "center",
    opacity: 0.7,
  },
});
