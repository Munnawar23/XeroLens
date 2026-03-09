import { useTheme } from "@/hooks/useTheme";
import { theme } from "@/styles/theme";
import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  const colors = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.underline} />
      </View>
    </View>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 24,
      paddingVertical: 16,
    },
    title: {
      fontSize: 24,
      fontFamily: theme.fontFamily.brand,
      color: colors.text,
      textTransform: "uppercase",
      letterSpacing: -0.5,
    },
    underline: {
      height: 4,
      width: 48,
      backgroundColor: colors.primary,
      marginTop: -4,
    },
  });
