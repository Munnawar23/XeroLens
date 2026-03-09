import { Button } from "@/components/common/Button";
import { theme } from "@/styles/theme";
import { Feather } from "@expo/vector-icons";
import React from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface CameraPreviewActionsProps {
  isSaving: boolean;
  onSave: () => void;
  onEdit: () => void;
}

export const CameraPreviewActions = ({
  isSaving,
  onSave,
  onEdit,
}: CameraPreviewActionsProps) => {
  return (
    <View style={styles.previewActions}>
      <Button
        title={isSaving ? "Saving…" : "Save Photo"}
        onPress={onSave}
        variant="variant2"
        leftIcon={
          isSaving ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Feather name="save" size={20} color="white" />
          )
        }
        containerStyle={styles.saveBtn}
      />
      <TouchableOpacity
        onPress={onEdit}
        disabled={isSaving}
        style={styles.editBtn}
      >
        {isSaving ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <>
            <Feather name="edit-3" size={22} color="white" />
            <Text style={styles.editBtnLabel}>Edit</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  previewActions: { flexDirection: "row", alignItems: "center", gap: 12 },
  saveBtn: { flex: 1, height: 58 },
  editBtn: {
    width: 68,
    height: 58,
    borderRadius: 18,
    backgroundColor: "#BC4749",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  editBtnLabel: {
    color: "white",
    fontFamily: theme.fontFamily.sans,
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});
