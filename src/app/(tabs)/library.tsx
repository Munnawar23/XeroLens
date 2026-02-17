import { EmptyState } from "@/components/common/EmptyState";
import { CapturedPhoto, photoStorage } from "@/services/storageService";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PhotoGrid } from "../library/components/PhotoGrid";

export default function LibraryScreen() {
  const [photos, setPhotos] = useState<CapturedPhoto[]>([]);

  useFocusEffect(
    useCallback(() => {
      const fetchPhotos = async () => {
        const storedPhotos = await photoStorage.getPhotos();
        setPhotos(storedPhotos);
      };
      fetchPhotos();
    }, []),
  );

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Group photos by date for the list
  const groupedPhotos = photos.reduce((groups: any, photo) => {
    const dateKey = formatDate(photo.date);
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(photo);
    return groups;
  }, {});

  const sections = Object.keys(groupedPhotos).map((date) => ({
    date,
    data: groupedPhotos[date],
  }));

  if (photos.length === 0) {
    return (
      <SafeAreaView
        className="flex h-full w-full bg-background"
        edges={["top"]}
      >
        <EmptyState />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex h-full w-full bg-background" edges={["top"]}>
      <View className="px-4 py-4">
        <Text className="text-primary font-brand text-4xl uppercase mb-4">
          Library
        </Text>
      </View>

      <FlatList
        data={sections}
        keyExtractor={(item) => item.date}
        renderItem={({ item }) => (
          <View className="mb-6">
            <View className="px-4 py-2 mb-2">
              <Text className="text-text font-brand text-xl uppercase tracking-widest">
                {item.date}
              </Text>
            </View>
            <PhotoGrid photos={item.data} />
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </SafeAreaView>
  );
}
