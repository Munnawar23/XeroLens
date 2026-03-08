import { EditorControls } from "@/components/screens/editing/EditorControls";
import { Header } from "@/components/screens/editing/Header";
import { useEditingLogic } from "@/hooks/useEditingLogic";
import { useTheme } from "@/hooks/useTheme";
import { theme } from "@/styles/theme";
import {
    Canvas,
    ColorMatrix,
    Fill,
    Image as SkiaImage,
    useCanvasRef,
} from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import {
    ActivityIndicator,
    Animated,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditingScreen() {
  const canvasRef = useCanvasRef();
  const colors = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const {
    photo,
    activeFilter,
    strength,
    isSaving,
    canvasSize,
    fadeAnim,
    skImage,
    blendedMatrix,
    isNormal,
    strengthPct,
    handleSelectFilter,
    handleBack,
    handleCanvasLayout,
    handleSave,
    setStrength,
  } = useEditingLogic();

  if (!photo) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Header
          onBack={handleBack}
          onSave={() => handleSave(canvasRef)}
          isSaving={isSaving}
          activeFilter={activeFilter}
          isNormal={isNormal}
          strengthPct={strengthPct}
        />

        {/* Canvas - Main Image Container */}
        <View style={styles.canvasWrapper}>
          <Animated.View
            style={[styles.canvasInner, { opacity: fadeAnim }]}
            onLayout={handleCanvasLayout}
          >
            {canvasSize.height > 0 && (
              <Canvas
                ref={canvasRef}
                style={{
                  width: canvasSize.width,
                  height: canvasSize.height,
                }}
              >
                <Fill color="transparent" />
                {skImage && (
                  <SkiaImage
                    image={skImage}
                    x={0}
                    y={0}
                    width={canvasSize.width}
                    height={canvasSize.height}
                    fit="cover"
                  >
                    <ColorMatrix matrix={blendedMatrix} />
                  </SkiaImage>
                )}
              </Canvas>
            )}

            {/* Filter Name Overlay */}
            <View style={styles.filterOverlay} pointerEvents="none">
              <Text style={styles.filterOverlayText}>
                {activeFilter.name.toUpperCase()}
              </Text>
            </View>
          </Animated.View>
        </View>

        <EditorControls
          isNormal={isNormal}
          strengthPct={strengthPct}
          strength={strength}
          setStrength={setStrength}
          photoUri={photo.uri}
          activeFilterId={activeFilter.id}
          handleSelectFilter={handleSelectFilter}
          handleBack={handleBack}
          handleSave={() => handleSave(canvasRef)}
          isSaving={isSaving}
        />
      </SafeAreaView>
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
    loadingContainer: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: "center",
      alignItems: "center",
      gap: 12,
    },
    canvasWrapper: {
      flex: 1,
      paddingHorizontal: 24,
      paddingVertical: 16,
    },
    canvasInner: {
      flex: 1,
      borderRadius: 24,
      overflow: "hidden",
      backgroundColor: `${colors.secondary}0D`,
      borderWidth: 1,
      borderColor: `${colors.secondary}1A`,
      // Shadow for depth
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
    },
    filterOverlay: {
      position: "absolute",
      bottom: 8,
      left: 16,
    },
    filterOverlayText: {
      color: colors.text,
      fontFamily: theme.fontFamily.brand,
      fontSize: 10,
      letterSpacing: 2,
    },
  });
