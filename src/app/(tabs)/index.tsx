import Camera from '@/components/ui/Camera';
import { useAppPermissions } from '@/hooks/useAppPermissions';
import { Text, TouchableOpacity, View } from 'react-native';

export default function CameraScreen() {
    const { isGranted, isLoading, requestPermissions } = useAppPermissions();

    if (isLoading) {
        return <View className="flex-1 bg-black" />;
    }

    if (!isGranted) {
        return (
            <View className="flex-1 justify-center items-center bg-black p-6">
                <Text className="text-white text-center mb-6 text-lg font-medium">
                    Camera and Library access is required.
                </Text>
                <TouchableOpacity
                    className="bg-white px-8 py-4 rounded-full active:opacity-80"
                    onPress={requestPermissions}
                >
                    <Text className="font-bold text-black text-lg">Open Settings / Grant</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return <Camera />;
}
