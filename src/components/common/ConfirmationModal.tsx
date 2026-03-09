import { Button } from "@/components/common/Button";
import { hp } from "@/helpers/dimensionHelpers";
import { useTheme } from "@/hooks/useTheme";
import { HapticService } from "@/services/hapticService";
import { theme } from "@/styles/theme";
import React, { useMemo } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

interface ConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmTitle?: string;
  cancelTitle?: string;
  isDanger?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  confirmTitle = "Confirm",
  cancelTitle = "Cancel",
  isDanger = true,
}) => {
  const colors = useTheme();
  const styles = useMemo(
    () => createStyles(colors, isDanger),
    [colors, isDanger],
  );

  const handleConfirm = () => {
    HapticService.trigger("impactHeavy");
    onConfirm();
  };

  const handleClose = () => {
    HapticService.trigger("impactHeavy");
    onClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <Pressable style={styles.overlay} onPress={handleClose}>
        <Pressable
          style={styles.modalContainer}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Custom Header Icon */}
          <View
            style={[
              styles.iconOuter,
              isDanger ? styles.iconOuterDanger : styles.iconOuterSafe,
            ]}
          >
            <View
              style={[
                styles.iconInner,
                isDanger ? styles.iconInnerDanger : styles.iconInnerSafe,
              ]}
            >
              <Text style={styles.iconText}>{isDanger ? "!" : "?"}</Text>
            </View>
          </View>

          {/* Text Content */}
          <View style={styles.textContent}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            <Button
              title={confirmTitle}
              onPress={handleConfirm}
              variant={isDanger ? "variant2" : "variant1"}
              containerStyle={{
                width: "100%",
                height: hp(6.5),
              }}
              textStyle={{ color: colors.textLight }}
            />

            <Pressable onPress={handleClose} style={styles.cancelButton}>
              <View style={styles.cancelTextContainer}>
                <Text style={styles.cancelText}>{cancelTitle}</Text>
              </View>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const createStyles = (colors: any, isDanger: boolean) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: colors.background + "B3", // 70% opacity theme background
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 24,
    },
    modalContainer: {
      backgroundColor: colors.background,
      width: "100%",
      borderRadius: 40,
      padding: 32,
      borderWidth: 1,
      borderColor: colors.text + "1A", // 10% opacity theme text color
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.25,
      shadowRadius: 10,
      elevation: 5,
    },
    iconOuter: {
      width: 80,
      height: 80,
      borderRadius: 40,
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "center",
      marginBottom: 24,
    },
    iconOuterDanger: {
      backgroundColor: colors.primary + "1A", // 10% opacity
    },
    iconOuterSafe: {
      backgroundColor: colors.secondary + "1A", // 10% opacity
    },
    iconInner: {
      width: 56,
      height: 56,
      borderRadius: 28,
      alignItems: "center",
      justifyContent: "center",
    },
    iconInnerDanger: {
      backgroundColor: colors.primary,
    },
    iconInnerSafe: {
      backgroundColor: colors.secondary,
    },
    iconText: {
      color: colors.textLight,
      fontFamily: theme.fontFamily.brand,
      fontSize: 24,
    },
    textContent: {
      alignItems: "center",
      marginBottom: 32,
    },
    title: {
      color: colors.text,
      fontFamily: theme.fontFamily.brand,
      fontSize: 20,
      textTransform: "uppercase",
      textAlign: "center",
      marginBottom: 12,
      letterSpacing: -0.5,
    },
    message: {
      color: colors.text,
      fontFamily: theme.fontFamily.fancy,
      fontSize: 14,
      textAlign: "center",
      lineHeight: 20,
    },
    actionContainer: {
      gap: 16,
    },
    cancelButton: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 8,
    },
    cancelTextContainer: {
      borderBottomWidth: 1,
      borderColor: colors.muted + "4D", // 30% opacity
    },
    cancelText: {
      color: colors.text,
      fontFamily: theme.fontFamily.fancy,
      fontSize: 14,
      textTransform: "uppercase",
      letterSpacing: 2,
      paddingBottom: 2,
    },
  });
