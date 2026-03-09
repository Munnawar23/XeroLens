import { EmptyState } from "@/components/common/EmptyState";
import { Header } from "@/components/common/Header";
import { PhotoGrid } from "@/components/common/PhotoGrid";
import { formatDate } from "@/helpers/dateHelpers";
import { useTheme } from "@/hooks/useTheme";
import { CapturedPhoto } from "@/services/storageService";
import { useFavoritesStore } from "@/store/useFavoritesStore";
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

export const useFavoritePhotos = () => {
  const {
    photos: allPhotos,
    fetchPhotos,
    refreshing,
    setRefreshing,
    isLoading,
  } = useLibraryStore();
  const { favorites } = useFavoritesStore();

  useFocusEffect(
    useCallback(() => {
      fetchPhotos();
    }, [fetchPhotos]),
  );

  const favoritePhotos = useMemo(() => {
    return allPhotos.filter((photo) => favorites.includes(photo.id));
  }, [allPhotos, favorites]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPhotos();
    setRefreshing(false);
  }, [fetchPhotos, setRefreshing]);

  const sections = useMemo(() => {
    const groupedPhotos = favoritePhotos.reduce((groups: any, photo) => {
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
  }, [favoritePhotos]);

  return {
    photos: favoritePhotos,
    sections,
    refreshing,
    isLoading,
    onRefresh,
    fetchPhotos,
  };
};

export default function FavoritesScreen() {
  const colors = useTheme();
  const styles = useMemo(() => createScreenStyles(colors), [colors]);

  const {
    sections,
    photos: favoritePhotos,
    refreshing,
    isLoading,
    onRefresh,
  } = useFavoritePhotos();

  const renderSectionHeader = (date: string) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{date}</Text>
      <View style={styles.sectionDivider} />
    </View>
  );

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.sectionContainer}>
      {renderSectionHeader(item.date)}
      <PhotoGrid
        photos={item.data}
        onPhotoPress={(photo) => {
          router.push(`/photo/${photo.id}`);
        }}
      />
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
          ) : favoritePhotos.length === 0 ? (
            <View style={styles.flex1}>
              <Header title="Favorites" />
              {!refreshing && !isLoading ? (
                <EmptyState
                  title="No Favorites Yet"
                  subtitle="Heart your best shots to see them here"
                  animationSource={require("@/assets/animations/empty.json")}
                  animationSize={300}
                />
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
              ListHeaderComponent={<Header title="Favorites" />}
              renderItem={renderItem}
              contentContainerStyle={styles.listContent}
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
