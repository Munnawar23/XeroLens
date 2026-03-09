import { useTheme } from "@/hooks/useTheme";
import { HapticService } from "@/services/hapticService";
import { CapturedPhoto } from "@/services/storageService";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import { theme } from "@/styles/theme";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useMemo } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const COLUMN_COUNT = 2;
const GAP = 12;
const PADDING = 16;
const ITEM_SIZE =
  (SCREEN_WIDTH - PADDING * 2 - GAP * (COLUMN_COUNT - 1)) / COLUMN_COUNT;

interface PhotoGridProps {
  photos: CapturedPhoto[];
  onPhotoPress: (photo: CapturedPhoto) => void;
}

export const PhotoGrid: React.FC<PhotoGridProps> = ({
  photos,
  onPhotoPress,
}) => {
  const colors = useTheme();
  const styles = useMemo(() => createGridStyles(colors), [colors]);
  const { favorites, toggleFavorite } = useFavoritesStore();

  const renderPhoto = (photo: CapturedPhoto) => {
    const isFav = favorites.includes(photo.id);

    return (
      <View key={photo.id} style={styles.photoItem}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            HapticService.trigger("impactMedium");
            onPhotoPress(photo);
          }}
          style={styles.imageWrapper}
        >
          <Image
            source={{ uri: photo.uri }}
            style={styles.image}
            contentFit="cover"
            transition={200}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            HapticService.trigger("impactMedium");
            toggleFavorite(photo.id);
            if (!isFav) {
              Toast.show({
                type: "success",
                text1: "Added to Favorites",
              });
            }
          }}
          style={styles.favoriteButton}
        >
          <Ionicons
            name={isFav ? "heart" : "heart-outline"}
            size={18}
            color={isFav ? colors.primary : "#FFFFFF"}
          />
        </TouchableOpacity>

        <View style={styles.timeOverlay}>
          <Text style={styles.timeText}>
            {new Date(photo.date).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })}
          </Text>
        </View>
      </View>
    );
  };

  return <View style={styles.gridContainer}>{photos.map(renderPhoto)}</View>;
};

const createGridStyles = (colors: any) =>
  StyleSheet.create({
    gridContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: GAP,
      paddingHorizontal: PADDING,
    },
    photoItem: {
      width: ITEM_SIZE,
      height: ITEM_SIZE * 1.3,
      position: "relative",
      borderRadius: 24,
      overflow: "hidden",
      backgroundColor: `${colors.secondary}0D`,
      borderWidth: 1,
      borderColor: `${colors.secondary}1A`,
    },
    imageWrapper: {
      width: "100%",
      height: "100%",
    },
    image: {
      width: "100%",
      height: "100%",
    },
    favoriteButton: {
      position: "absolute",
      top: 8,
      right: 8,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: "rgba(0,0,0,0.2)",
      alignItems: "center",
      justifyContent: "center",
    },
    timeOverlay: {
      position: "absolute",
      bottom: 12,
      right: 12,
    },
    timeText: {
      color: "#FFFFFF",
      fontSize: 10,
      fontFamily: theme.fontFamily.sans,
      textTransform: "uppercase",
      letterSpacing: 1,
      textShadowColor: "rgba(0, 0, 0, 0.8)",
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 4,
    },
  });
