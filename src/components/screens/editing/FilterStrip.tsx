import { FilterDefinition, FILTERS } from "@/constants/filters";
import { useTheme } from "@/hooks/useTheme";
import { HapticService } from "@/services/hapticService";
import { theme } from "@/styles/theme";
import { Ionicons } from "@expo/vector-icons";
import {
    Canvas,
    ColorMatrix,
    Fill,
    Image as SkiaImage,
    useImage,
} from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const THUMB_SIZE = 72;

interface FilterStripProps {
  photoUri: string;
  activeFilterId: string;
  onSelectFilter: (filter: FilterDefinition) => void;
}

interface FilterThumbProps {
  filter: FilterDefinition;
  photoUri: string;
  isActive: boolean;
  onPress: () => void;
}

// Map filter IDs to Ionicons icon names
const getFilterIconName = (
  filterId: string,
): keyof typeof Ionicons.glyphMap => {
  switch (filterId) {
    case "normal":
      return "aperture";
    case "noir":
      return "contrast";
    case "japan":
      return "image";
    case "dark-orange":
      return "flame";
    case "sepia-dust":
      return "hourglass";
    case "faded-film":
      return "film";
    case "tobacco":
      return "color-filter";
    case "kyoto":
      return "leaf";
    case "midnight":
      return "moon";
    case "rust":
      return "hammer";
    default:
      return "sparkles";
  }
};

const FilterThumb: React.FC<FilterThumbProps> = ({
  filter,
  photoUri,
  isActive,
  onPress,
}) => {
  const skImage = useImage(photoUri);
  const colors = useTheme();
  const styles = useMemo(
    () => createThumbStyles(colors, isActive),
    [colors, isActive],
  );

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={styles.thumbContainer}
    >
      {/* Thumbnail canvas */}
      <View
        pointerEvents="none"
        style={[styles.thumbWrapper, isActive && styles.thumbWrapperActive]}
      >
        <Canvas
          style={{ width: THUMB_SIZE, height: THUMB_SIZE }}
          pointerEvents="none"
        >
          <Fill color="#111" />
          {skImage && (
            <SkiaImage
              image={skImage}
              x={0}
              y={0}
              width={THUMB_SIZE}
              height={THUMB_SIZE}
              fit="cover"
            >
              <ColorMatrix matrix={filter.matrix} />
            </SkiaImage>
          )}
        </Canvas>
      </View>

      {/* Filter label */}
      <View style={styles.labelContainer}>
        <Ionicons
          name={getFilterIconName(filter.id)}
          size={12}
          color={isActive ? colors.primary : `${colors.text}40`}
        />
        <Text
          style={[styles.labelText, isActive && styles.labelTextActive]}
          numberOfLines={1}
        >
          {filter.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export const FilterStrip: React.FC<FilterStripProps> = ({
  photoUri,
  activeFilterId,
  onSelectFilter,
}) => {
  const colors = useTheme();
  const styles = useMemo(() => createStripStyles(colors), [colors]);

  return (
    <View style={styles.stripContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
      >
        {FILTERS.map((filter) => (
          <FilterThumb
            key={filter.id}
            filter={filter}
            photoUri={photoUri}
            isActive={activeFilterId === filter.id}
            onPress={() => {
              HapticService.trigger("selection");
              onSelectFilter(filter);
            }}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const createThumbStyles = (colors: any, isActive: boolean) =>
  StyleSheet.create({
    thumbContainer: {
      alignItems: "center",
      gap: 6,
    },
    thumbWrapper: {
      width: THUMB_SIZE,
      height: THUMB_SIZE,
      overflow: "hidden",
      borderWidth: 2,
      borderColor: "transparent",
      borderRadius: 14,
    },
    thumbWrapperActive: {
      borderColor: colors.primary,
      borderWidth: 2.5,
    },
    labelContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    labelText: {
      fontSize: 10,
      fontFamily: theme.fontFamily.sans,
      letterSpacing: 0.3,
      color: colors.text,
    },
    labelTextActive: {
      fontFamily: theme.fontFamily.button,
      color: colors.primary,
    },
  });

const createStripStyles = (colors: any) =>
  StyleSheet.create({
    stripContainer: {
      backgroundColor: "transparent",
      paddingBottom: 8,
    },
    scrollContent: {
      paddingHorizontal: 4,
      gap: 16,
      alignItems: "center",
    },
  });
