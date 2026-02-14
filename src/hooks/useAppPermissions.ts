import { useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { useEffect } from 'react';

export function useAppPermissions() {
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();
    const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();

    useEffect(() => {
        if (cameraPermission?.status === 'undetermined') {
            requestCameraPermission();
        }
        if (mediaPermission?.status === 'undetermined') {
            requestMediaPermission();
        }
    }, [cameraPermission, mediaPermission]);

    const isLoading = !cameraPermission || !mediaPermission || cameraPermission.status === 'undetermined' || mediaPermission.status === 'undetermined';
    const isGranted = !!(cameraPermission?.granted && mediaPermission?.granted);

    const requestPermissions = async () => {
        await requestCameraPermission();
        await requestMediaPermission();
    };

    return {
        isLoading,
        isGranted,
        requestPermissions,
    };
}
