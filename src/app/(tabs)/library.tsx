import { EmptyState } from "@/components/common/EmptyState";
import { CapturedPhoto, photoStorage } from "@/services/storageService";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { FlatList, RefreshControl, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PhotoActionsModal } from "../library/components/PhotoActionsModal";
import { PhotoGrid } from "../library/components/PhotoGrid";

export default function LibraryScreen() {
  const [allPhotos, setAllPhotos] = useState<CapturedPhoto[]>([]);
  const [photos, setPhotos] = useState<CapturedPhoto[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<CapturedPhoto | null>(
    null,
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const PHOTOS_PER_PAGE = 20;

  const fetchPhotos = async () => {
    const storedPhotos = await photoStorage.getPhotos();
    setAllPhotos(storedPhotos);
    setPhotos(storedPhotos.slice(0, PHOTOS_PER_PAGE));
  };

  useFocusEffect(
    useCallback(() => {
      fetchPhotos();
    }, []),
  );

  const loadMore = () => {
    if (photos.length >= allPhotos.length) return;
    const nextPhotos = allPhotos.slice(0, photos.length + PHOTOS_PER_PAGE);
    setPhotos(nextPhotos);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPhotos();
    setRefreshing(false);
  };

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

  const handlePhotoPress = (photo: CapturedPhoto) => {
    setSelectedPhoto(photo);
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    setAllPhotos((prev) => prev.filter((p) => p.id !== id));
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  if (photos.length === 0) {
    return (
      <SafeAreaView
        className="flex h-full w-full bg-background"
        edges={["top"]}
      >
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#CF2A2A"
              colors={["#CF2A2A"]}
            />
          }
        >
          <EmptyState />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex h-full w-full bg-background" edges={["top"]}>
      <FlatList
        data={sections}
        ListHeaderComponent={
          <View className="px-4 py-4">
            <Text className="text-primary font-brand text-4xl uppercase mb-4">
              Library
            </Text>
          </View>
        }
        keyExtractor={(item) => item.date}
        renderItem={({ item }) => (
          <View className="mb-6">
            <View className="px-4 py-2 mb-2">
              <Text className="text-text font-brand text-xl uppercase tracking-widest">
                {item.date}
              </Text>
            </View>
            <PhotoGrid photos={item.data} onPhotoPress={handlePhotoPress} />
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 40 }}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#CF2A2A"
            colors={["#CF2A2A"]}
          />
        }
      />

      <PhotoActionsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        photo={selectedPhoto}
        onDelete={handleDelete}
      />
    </SafeAreaView>
  );
}
