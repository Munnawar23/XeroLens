import { EmptyState } from "@/components/common/EmptyState";
import { Header } from "@/components/common/Header";
import { PhotoGrid } from "@/components/common/PhotoGrid";
import { SettingsBottomSheet } from "@/components/common/SettingsBottomSheet";
import { useTheme } from "@/hooks/useTheme";
import { CapturedPhoto } from "@/services/storageService";
import { useLibraryStore } from "@/store/useLibraryStore";
import { theme } from "@/styles/theme";
import BottomSheet from "@gorhom/bottom-sheet";
import { router, useFocusEffect } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
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

// Internal Hooks as requested (keep in same file)
export const useLibraryAnimations = () => {
  const [isFocused, setIsFocused] = useState(false);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(30);
  const scale = useSharedValue(0.95);

  useFocusEffect(
    useCallback(() => {
      setIsFocused(true);
      return () => setIsFocused(false);
    }, []),
  );

  useEffect(() => {
    if (isFocused) {
      const animationConfig = {
        duration: 800,
        easing: Easing.out(Easing.exp),
      };
      opacity.value = withTiming(1, animationConfig);
      translateY.value = withSpring(0, { damping: 15, stiffness: 100 });
      scale.value = withSpring(1, { damping: 15, stiffness: 100 });
    } else {
      opacity.value = withTiming(0, { duration: 300 });
      translateY.value = 30;
      scale.value = 0.95;
    }
  }, [isFocused]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  return { animatedStyle };
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
  const settingsBottomSheetRef = useRef<BottomSheet>(null);
  const styles = useMemo(() => createScreenStyles(colors), [colors]);

  const {
    sections,
    allPhotos,
    refreshing,
    isLoading,
    loadMore,
    onRefresh,
    fetchPhotos,
  } = useLibraryPhotos();

  const { animatedStyle } = useLibraryAnimations();

  const handleOpenSettings = () => {
    settingsBottomSheetRef.current?.expand();
  };

  const renderSectionHeader = (date: string) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{date}</Text>
      <View style={styles.sectionDivider} />
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <Animated.View style={[styles.mainContent, animatedStyle]}>
          {isLoading ? (
            <View style={styles.centered}>
              <ActivityIndicator color={colors.primary} size="large" />
            </View>
          ) : allPhotos.length === 0 ? (
            <View style={styles.flex1}>
              <Header title="Library" onRightPress={handleOpenSettings} />
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
              ListHeaderComponent={
                <Header title="Library" onRightPress={handleOpenSettings} />
              }
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
        </Animated.View>
      </SafeAreaView>

      <SettingsBottomSheet
        ref={settingsBottomSheetRef}
        onPhotosCleared={() => fetchPhotos()}
      />
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
      fontFamily: theme.fontFamily.brand,
      fontSize: 14,
      textTransform: "uppercase",
      letterSpacing: 2,
      opacity: 0.6,
    },
    sectionDivider: {
      height: 1,
      backgroundColor: `${colors.secondary}1A`,
      marginTop: 8,
      width: 40,
    },
  });
