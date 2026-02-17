import { CapturedPhoto } from "@/services/storageService";
import React from "react";
import { Dimensions, Image, Text, View } from "react-native";

const { width } = Dimensions.get("window");
const COLUMN_COUNT = 2;
const GAP = 6;
const PADDING = 10;
const ITEM_SIZE =
  (width - PADDING * 2 - GAP * (COLUMN_COUNT - 1)) / COLUMN_COUNT;

interface PhotoGridProps {
  photos: CapturedPhoto[];
}

export const PhotoGrid: React.FC<PhotoGridProps> = ({ photos }) => {
  return (
    <View
      className="flex-row flex-wrap"
      style={{ gap: GAP, paddingHorizontal: PADDING }}
    >
      {photos.map((photo) => (
        <View
          key={photo.id}
          style={{ width: ITEM_SIZE, height: ITEM_SIZE * 1.2 }} // 1.2 aspect ratio for a taller card look
          className="relative rounded-2xl overflow-hidden bg-gray-200 border border-white/10 shadow-sm"
        >
          <Image
            source={{ uri: photo.uri }}
            style={{ width: "100%", height: "100%" }}
            className="w-full h-full"
            resizeMode="cover"
          />

          <View className="absolute bottom-2 right-2 flex-row items-center bg-black/30 px-2 py-1 rounded-lg border border-white/20">
            <Text className="text-[10px] text-white font-medium tracking-wide">
              {new Date(photo.date).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};
