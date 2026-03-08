import { Button } from "@/components/common/Button";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import { DetailHeader } from "@/components/screens/photo/DetailHeader";
import { useTheme } from "@/hooks/useTheme";
import { HapticService } from "@/services/hapticService";
import { savePhotoToGallery } from "@/services/mediaService";
import { CapturedPhoto, photoStorage } from "@/services/storageService";
import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

/**
 * Main PhotoDetail Screen
 */
export default function PhotoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useTheme();
  const [photo, setPhoto] = useState<CapturedPhoto | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const styles = useMemo(() => createScreenStyles(colors), [colors]);

  useEffect(() => {
    if (id) {
      photoStorage.getPhotoById(id).then((p) => {
        if (p) {
          setPhoto(p);
        } else {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "Photo not found",
          });
          router.back();
        }
      });
    }
  }, [id]);

  const handleDeletePress = () => {
    if (!photo) return;
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!photo) return;
    HapticService.trigger("impactHeavy");
    setShowDeleteModal(false);
    setIsDeleting(true);
    try {
      await photoStorage.deletePhoto(photo.id);
      Toast.show({
        type: "success",
        text1: "Deleted",
        text2: "Photo deleted successfully",
      });
      router.back();
    } catch (error) {
      console.error("Failed to delete photo:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to delete photo",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveToGallery = async () => {
    if (!photo) return;
    HapticService.trigger("impactMedium");
    setIsSaving(true);
    try {
      await savePhotoToGallery(photo.uri);
      Toast.show({
        type: "success",
        text1: "Saved",
        text2: "Photo saved to your gallery!",
      });
    } catch (error) {
      console.error("Failed to save photo:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to save photo to gallery",
      });
    } finally {
      setIsSaving(false);
    }
  };

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
        <DetailHeader
          date={photo.date}
          onDeletePress={handleDeletePress}
          isDeleting={isDeleting}
        />

        {/* Main Image Container */}
        <View style={styles.imageWrapper}>
          <View style={styles.imageInner}>
            <Image
              source={{ uri: photo.uri }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        </View>

        {/* Footer Actions */}
        <View style={styles.footer}>
          <Button
            title={isSaving ? "Saving..." : "Save to Gallery"}
            onPress={handleSaveToGallery}
            variant="variant2"
            disabled={isSaving}
            leftIcon={
              isSaving ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Feather name="download" size={20} color="white" />
              )
            }
            containerStyle={styles.saveButtonBig}
          />
          <TouchableOpacity
            onPress={() => {
              HapticService.trigger("impactMedium");
              router.push({
                pathname: "/editing",
                params: { id: photo.id },
              } as any);
            }}
            style={styles.editButtonSmall}
          >
            <Feather name="edit-3" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ConfirmationModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Photo"
        message="This action is permanent and cannot be undone. Are you sure?"
        confirmTitle={isDeleting ? "Deleting..." : "Delete"}
        isDanger={true}
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
    loadingContainer: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: "center",
      alignItems: "center",
    },
    imageWrapper: {
      flex: 1,
      paddingHorizontal: 24,
      paddingVertical: 16,
    },
    imageInner: {
      flex: 1,
      borderRadius: 32,
      overflow: "hidden",
      backgroundColor: `${colors.secondary}1A`,
      borderWidth: 2,
      borderColor: `${colors.secondary}1A`,
    },
    image: {
      width: "100%",
      height: "100%",
    },
    footer: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 24,
      gap: 12,
      paddingBottom: 48,
      paddingTop: 16,
    },
    editButtonSmall: {
      backgroundColor: `${colors.secondary}1A`,
      width: 55,
      height: 55,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: `${colors.secondary}1A`,
    },
    saveButtonBig: {
      flex: 1,
      height: 55,
    },
  });
