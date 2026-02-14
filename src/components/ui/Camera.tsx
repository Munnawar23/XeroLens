import { savePhotoToGallery } from '@/services/mediaService';
import { Ionicons } from '@expo/vector-icons';
import { CameraType, CameraView } from 'expo-camera';
import { useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Camera() {
    const [facing, setFacing] = useState<CameraType>('back');
    const [torch, setTorch] = useState<boolean>(false);
    const [zoom, setZoom] = useState(0);
    const [isFlashing, setIsFlashing] = useState(false);
    const cameraRef = useRef<CameraView>(null);

    async function takePicture() {
        if (cameraRef.current) {
            try {
                // Trigger blink effect
                setIsFlashing(true);
                setTimeout(() => setIsFlashing(false), 100);

                const photo = await cameraRef.current.takePictureAsync({
                    quality: 1,
                });

                if (photo) {
                    await savePhotoToGallery(photo.uri);
                }
            } catch (e) {
                console.error(e);
            }
        }
    }

    function toggleCamera() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    function toggleTorch() {
        setTorch(current => !current);
    }

    function increaseZoom() {
        setZoom(current => Math.min(current + 0.1, 1));
    }

    function decreaseZoom() {
        setZoom(current => Math.max(current - 0.1, 0));
    }

    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                facing={facing}
                flash="off"
                enableTorch={torch}
                zoom={zoom}
                animateShutter={true}
                ref={cameraRef}
            >
                {/* Camera Controls Overlay */}
                <View className="flex-1">
                    {/* Top Controls */}
                    <View className="flex-row justify-between pt-12 px-6 items-center">
                        {/* Torch Button (styled as Flash) */}
                        <TouchableOpacity
                            className="bg-black/50 p-3 rounded-full backdrop-blur-md"
                            onPress={toggleTorch}
                        >
                            <Ionicons
                                name={torch ? 'flash' : 'flash-off'}
                                size={28}
                                color={torch ? '#FFD700' : 'white'}
                            />
                        </TouchableOpacity>

                        {/* Flip Button */}
                        <TouchableOpacity
                            className="bg-black/50 p-3 rounded-full backdrop-blur-md"
                            onPress={toggleCamera}
                        >
                            <Ionicons name="camera-reverse" size={24} color="white" />
                        </TouchableOpacity>
                    </View>

                    {/* Right Side Zoom Controls */}
                    <View className="absolute right-6 top-1/2 -translate-y-1/2 gap-4 bg-black/30 p-2 rounded-full backdrop-blur-md">
                        <TouchableOpacity onPress={increaseZoom} className="p-2">
                            <Ionicons name="add-circle-outline" size={28} color="white" />
                        </TouchableOpacity>
                        <Text className="text-white text-center font-bold text-xs">{Math.round(zoom * 100)}%</Text>
                        <TouchableOpacity onPress={decreaseZoom} className="p-2">
                            <Ionicons name="remove-circle-outline" size={28} color="white" />
                        </TouchableOpacity>
                    </View>

                    {/* Bottom Controls */}
                    <View className="flex-1 justify-end items-center pb-12">
                        <TouchableOpacity onPress={takePicture} className="active:opacity-90">
                            <View className="w-20 h-20 rounded-full bg-white/20 items-center justify-center border-4 border-white/60">
                                <View className="w-16 h-16 rounded-full bg-white shadow-sm" />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </CameraView>

            {/* Shutter Blink Effect */}
            {isFlashing && (
                <View
                    style={[StyleSheet.absoluteFill, { backgroundColor: 'black', zIndex: 50 }]}
                    pointerEvents="none"
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    camera: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
});
