import { EmptyState } from "@/components/common/EmptyState";
import { Header } from "@/components/common/Header";
import { PhotoGrid } from "@/components/common/PhotoGrid";
import { useTheme } from "@/hooks/useTheme";
import { CapturedPhoto } from "@/services/storageService";
import { useLibraryStore } from "@/store/useLibraryStore";
import { theme } from "@/styles/theme";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Helper to format date
const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export const useLibraryPhotos = () => {
  const {
    photos,
    allPhotos,
    refreshing,
    isLoading,
    fetchPhotos,
    loadMore,
    setRefreshing,
    deletePhoto,
  } = useLibraryStore();

  useFocusEffect(
    useCallback(() => {
      fetchPhotos();
    }, [fetchPhotos]),
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPhotos();
    setRefreshing(false);
  }, [fetchPhotos, setRefreshing]);

  const sections = useMemo(() => {
    const groupedPhotos = photos.reduce((groups: any, photo) => {
      const dateKey = formatDate(photo.date);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(photo);
      return groups;
    }, {});

    return Object.keys(groupedPhotos).map((date: string) => ({
      date,
      data: groupedPhotos[date] as CapturedPhoto[],
    }));
  }, [photos]);

  return {
    photos,
    allPhotos,
    refreshing,
    isLoading,
    sections,
    loadMore,
    onRefresh,
    handleDelete: deletePhoto,
    fetchPhotos,
  };
};

export default function LibraryScreen() {
  const colors = useTheme();
  const styles = useMemo(() => createScreenStyles(colors), [colors]);

  const { sections, allPhotos, refreshing, isLoading, loadMore, onRefresh } =
    useLibraryPhotos();

  const renderSectionHeader = (date: string) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{date}</Text>
      <View style={styles.sectionDivider} />
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.mainContent}>
          {isLoading ? (
            <View style={styles.centered}>
              <ActivityIndicator color={colors.primary} size="large" />
            </View>
          ) : allPhotos.length === 0 ? (
            <View style={styles.flex1}>
              <Header title="Library" />
              {!refreshing && !isLoading ? (
                <EmptyState />
              ) : (
                <View style={styles.centered}>
                  <ActivityIndicator color={colors.primary} size="large" />
                </View>
              )}
            </View>
          ) : (
            <FlatList
              data={sections}
              keyExtractor={(item) => item.date}
              ListHeaderComponent={<Header title="Library" />}
              renderItem={({ item }) => (
                <View style={styles.sectionContainer}>
                  {renderSectionHeader(item.date)}
                  <PhotoGrid
                    photos={item.data}
                    onPhotoPress={(photo) => {
                      router.push(`/photo/${photo.id}`);
                    }}
                  />
                </View>
              )}
              contentContainerStyle={styles.listContent}
              onEndReached={loadMore}
              onEndReachedThreshold={0.5}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor={colors.primary}
                />
              }
            />
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const createScreenStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    safeArea: {
      flex: 1,
    },
    mainContent: {
      flex: 1,
    },
    flex1: {
      flex: 1,
    },
    centered: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    listContent: {
      paddingBottom: 40,
    },
    sectionContainer: {
      marginBottom: 32,
    },
    sectionHeader: {
      paddingHorizontal: 24,
      marginBottom: 16,
    },
    sectionTitle: {
      color: colors.text,
      fontFamily: theme.fontFamily.fancy,
      fontSize: 14,
      textTransform: "uppercase",
      letterSpacing: 2,
    },
    sectionDivider: {
      height: 1,
      backgroundColor: `${colors.text}1A`,
      marginTop: 8,
      width: 40,
    },
  });
