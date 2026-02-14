import * as MediaLibrary from 'expo-media-library';
import { Alert } from 'react-native';

export const savePhotoToGallery = async (uri: string) => {
    try {
        const asset = await MediaLibrary.createAssetAsync(uri);
        // Optionally create an album
        // await MediaLibrary.createAlbumAsync('XeroLens', asset, false);
        return asset;
    } catch (error) {
        console.error('Error saving photo:', error);
        Alert.alert('Error', 'Failed to save photo');
        throw error;
    }
};
