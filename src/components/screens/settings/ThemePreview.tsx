import React from "react";
import { StyleSheet, View } from "react-native";

interface ThemePreviewProps {
  mode: "light" | "dark" | "system";
  isActive: boolean;
  colors: any;
}

export const ThemePreview = ({ mode, isActive, colors }: ThemePreviewProps) => {
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
        styles.phoneFrame,
        {
          borderColor: isActive ? colors.primary : `${colors.text}15`,
          backgroundColor: previewBg,
        },
      ]}
    >
      {/* Status bar mock */}
      <View style={[styles.statusBar, { backgroundColor: `${previewText}10` }]}>
        <View style={[styles.statusDot, { backgroundColor: previewAccent }]} />
        <View
          style={[styles.statusLine, { backgroundColor: `${previewText}30` }]}
        />
      </View>
      {/* Content lines mock */}
      <View style={styles.contentArea}>
        <View
          style={[
            styles.contentLine,
            { backgroundColor: `${previewText}25`, width: "70%" },
          ]}
        />
        <View
          style={[
            styles.contentLine,
            { backgroundColor: `${previewText}15`, width: "90%" },
          ]}
        />
        <View
          style={[
            styles.contentLine,
            { backgroundColor: `${previewText}15`, width: "50%" },
          ]}
        />
        {/* Photo grid mock */}
        <View style={styles.gridRow}>
          <View
            style={[styles.gridItem, { backgroundColor: previewAccent + "40" }]}
          />
          <View
            style={[styles.gridItem, { backgroundColor: `${previewText}12` }]}
          />
        </View>
        <View style={styles.gridRow}>
          <View
            style={[styles.gridItem, { backgroundColor: `${previewText}12` }]}
          />
          <View
            style={[styles.gridItem, { backgroundColor: previewAccent + "25" }]}
          />
        </View>
      </View>
      {/* Tab bar mock */}
      <View
        style={[
          styles.tabBar,
          { backgroundColor: mode === "dark" ? "#2C2C2C" : "#3D6F72" },
        ]}
      >
        <View style={[styles.tabDot, { backgroundColor: "#FFF50" }]} />
        <View style={[styles.tabDot, { backgroundColor: "#FFF50" }]} />
        <View style={[styles.tabDot, { backgroundColor: "#FFF" }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
