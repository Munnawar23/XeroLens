import * as Haptics from "expo-haptics";

export type HapticType =
  | "selection"
  | "impactLight"
  | "impactMedium"
  | "impactHeavy"
  | "notificationSuccess"
  | "notificationWarning"
  | "notificationError";

export const HapticService = {
  trigger: (type: HapticType = "impactLight") => {
    switch (type) {
      case "selection":
        Haptics.selectionAsync();
        break;
      case "impactLight":
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case "impactMedium":
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case "impactHeavy":
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
      case "notificationSuccess":
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case "notificationWarning":
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        break;
      case "notificationError":
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
    }
  },
};
