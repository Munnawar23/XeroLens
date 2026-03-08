import { useTheme } from "@/hooks/useTheme";
import { theme } from "@/styles/theme";
import LottieView from "lottie-react-native";
import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

interface EmptyStateProps {
  title?: string;
  subtitle?: string;
  animationSource?: any;
  animationSize?: number;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "Your Library is Empty",
  subtitle = "Photos you take will appear here",
  animationSource = require("@/assets/animations/camera.json"),
  animationSize = 256,
}) => {
  const colors = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.animationContainer,
          { width: animationSize, height: animationSize },
        ]}
      >
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

const createStyles = (colors: any) =>
  StyleSheet.create({
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
      color: colors.text,
      fontFamily: theme.fontFamily.brand,
      fontSize: 24,
      textTransform: "uppercase",
      textAlign: "center",
      lineHeight: 30,
      marginBottom: 8,
    },
    subtitle: {
      color: colors.text,
      fontFamily: theme.fontFamily.sans,
      fontSize: 14,
      textAlign: "center",
      opacity: 0.7,
    },
  });
