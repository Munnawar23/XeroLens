import { Button } from "@/components/common/Button";
import Camera from "@/components/ui/Camera";
import { useAppPermissions } from "@/hooks/useAppPermissions";
import { Text, View } from "react-native";

export default function CameraScreen() {
  const { isGranted, isLoading, requestPermissions } = useAppPermissions();

  if (isLoading) {
    return <View className="flex-1 bg-black" />;
  }

  if (!isGranted) {
    return (
      <View className="flex-1 justify-center items-center bg-background p-6">
        <Text className="text-primary text-center mb-6 text-lg font-medium">
          Camera and Library access is required.
        </Text>
        <Button
          title="Open Settings / Grant"
          onPress={requestPermissions}
          variant="primary"
        />
      </View>
    );
  }

  return <Camera />;
}
