import { Button } from "@/components/common/Button";
import { savePhotoToGallery } from "@/services/mediaService";
import { CapturedPhoto, photoStorage } from "@/services/storageService";
import React, { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import Toast from "react-native-toast-message";

interface Props {
  visible: boolean;
  onClose: () => void;
  photo: CapturedPhoto | null;
  onDelete: (id: string) => void;
}

export const PhotoActionsModal: React.FC<Props> = ({
  visible,
  onClose,
  photo,
  onDelete,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleClose = () => {
    setConfirmingDelete(false);
    setIsDeleting(false);
    onClose();
  };

  const handleDeletePress = () => setConfirmingDelete(true);
  const handleCancelDelete = () => setConfirmingDelete(false);

  const handleConfirmDelete = async () => {
    if (!photo) return;
    setIsDeleting(true);
    try {
      await photoStorage.deletePhoto(photo.id);
      onDelete(photo.id);
      handleClose();
      Toast.show({
        type: "success",
        text1: "Deleted",
        text2: "Photo deleted successfully",
      });
    } catch (error) {
      console.error("Failed to delete photo:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to delete photo",
      });
      setIsDeleting(false);
    }
  };

  const handleSaveToGallery = async () => {
    if (!photo) return;
    setIsSaving(true);
    try {
      await savePhotoToGallery(photo.uri);

      Toast.show({
        type: "success",
        text1: "Saved",
        text2: "Photo saved to your gallery!",
      });
      handleClose();
    } catch (error) {
      console.error("Failed to save photo:", error);
      // Alert is handled in savePhotoToGallery too
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={handleClose}
    >
      <Pressable
        className="flex-1 justify-end bg-black/40"
        onPress={handleClose}
      >
        <Pressable className="bg-background p-5 pb-10 rounded-t-[20px] items-stretch">
          <Text className="text-2xl uppercase text-text text-center mb-6 font-brand">
            {confirmingDelete ? "Delete Photo" : "Options"}
          </Text>

          {confirmingDelete ? (
            <View className="gap-4">
              <Text className="text-md text-text text-center mb-5 font-fancy">
                Are you sure you want to delete this photo?
              </Text>
              <View className="flex-row justify-between w-full gap-2">
                <Button
                  title="Cancel"
                  onPress={handleCancelDelete}
                  variant="secondary"
                  containerStyle={{ flex: 1, width: "auto" }}
                />
                <Button
                  title={isDeleting ? "Deleting..." : "Delete"}
                  onPress={handleConfirmDelete}
                  variant="primary"
                  containerStyle={{
                    flex: 1,
                    width: "auto",
                    backgroundColor: "#CF2A2A",
                  }}
                />
              </View>
            </View>
          ) : (
            <View className="gap-4">
              <Button
                title={isSaving ? "Saving..." : "Save to Gallery"}
                onPress={handleSaveToGallery}
                variant="primary"
                containerStyle={{ width: "100%" }}
              />
              <Button
                title="Delete Photo"
                onPress={handleDeletePress}
                containerStyle={{ width: "100%", backgroundColor: "#CF2A2A" }}
              />
              <Button
                title="Cancel"
                onPress={handleClose}
                variant="secondary"
                containerStyle={{ width: "100%" }}
              />
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
};
