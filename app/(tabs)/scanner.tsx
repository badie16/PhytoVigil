"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, ScrollView, Alert, Modal } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Leaf, Zap, Shield } from "lucide-react-native"
import CameraButton from "@/components/ui/camera-button"
import CameraScreen from "@/components/ui/camera-screen"
import PhotoPreview from "@/components/ui/photo-preview"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { useCamera } from "@/hooks/use-camera"

export default function ScannerScreen() {
    const [showCamera, setShowCamera] = useState(false)
    const [photoUri, setPhotoUri] = useState<string | null>(null)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const { isLoading, openCamera, openImagePicker } = useCamera()

    const handleCameraPress = () => {
        Alert.alert(
            "Scan Plant",
            "Choose how you want to capture your plant photo",
            [
                {
                    text: "Take Photo",
                    onPress: () => setShowCamera(true),
                },
                {
                    text: "Choose from Gallery",
                    onPress: handleGalleryPress,
                },
                {
                    text: "Cancel",
                    style: "cancel",
                },
            ],
            { cancelable: true },
        )
    }

    const handleGalleryPress = async () => {
        const uri = await openImagePicker()
        if (uri) {
            setPhotoUri(uri)
        }
    }

    const handlePhotoTaken = (uri: string) => {
        setPhotoUri(uri)
        setShowCamera(false)
    }

    const handleRetakePhoto = () => {
        setPhotoUri(null)
        setShowCamera(true)
    }

    const handleAnalyzePhoto = () => {
        setPhotoUri(null)
        setIsAnalyzing(true)

        // Simulate AI analysis
        setTimeout(() => {
            setIsAnalyzing(false)
            Alert.alert("Analysis Complete", "Your plant appears to be healthy! Check the results in your history.", [
                { text: "OK" },
            ])
        }, 3000)
    }

    const handleClosePreview = () => {
        setPhotoUri(null)
    }

    const handleCloseCamera = () => {
        setShowCamera(false)
    }

    if (isAnalyzing) {
        return <LoadingSpinner message="Analyzing your plant with AI..." size="large" />
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="items-center py-8">
                    <View className="w-24 h-24 bg-primary/10 rounded-full items-center justify-center mb-4">
                        <Leaf color="#00C896" size={40} />
                    </View>
                    <Text className="text-2xl font-bold text-gray-900 mb-2">Plant Disease Scanner</Text>
                    <Text className="text-base text-secondary text-center leading-6">
                        Take a photo of your plant to detect diseases and get treatment recommendations
                    </Text>
                </View>

                {/* Camera Options */}
                <View className="items-center mb-8">
                    <View className="flex-row justify-center items-center gap-6 mb-6">
                        <CameraButton onPress={() => setShowCamera(true)} size="lg" variant="camera" disabled={isLoading} />
                        <CameraButton onPress={handleGalleryPress} size="md" variant="gallery" disabled={isLoading} />
                    </View>

                    <Text className="text-sm text-secondary text-center mb-2">
                        Tap camera to take photo or gallery to choose existing image
                    </Text>

                    {isLoading && <Text className="text-sm text-primary font-medium">Opening camera...</Text>}
                </View>

                {/* Instructions */}
                <View className="bg-surface rounded-2xl p-4 mb-6">
                    <Text className="text-lg font-semibold text-gray-900 mb-3">📸 Photography Tips:</Text>
                    <Text className="text-sm text-secondary leading-6">
                        • Use natural daylight for best results{"\n"}• Focus on affected leaves or plant parts{"\n"}• Keep the plant
                        centered in frame{"\n"}• Avoid shadows and reflections{"\n"}• Hold camera steady for sharp images
                    </Text>
                </View>

                {/* Supported Plants */}
                <View className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-4 mb-8">
                    <Text className="text-lg font-semibold text-gray-900 mb-3">🌱 Supported Plants:</Text>
                    <Text className="text-sm text-secondary leading-6">
                        Tomatoes • Potatoes • Peppers • Corn • Wheat • Rice • Soybeans • Cotton • Grapes • Apples • And many more...
                    </Text>
                </View>
            </ScrollView>

            {/* Camera Modal */}
            <Modal visible={showCamera} animationType="slide" presentationStyle="fullScreen">
                <CameraScreen onClose={handleCloseCamera} onPhotoTaken={handlePhotoTaken} />
            </Modal>

            {/* Photo Preview Modal */}
            <Modal visible={!!photoUri} animationType="slide" presentationStyle="fullScreen">
                {photoUri && (
                    <PhotoPreview
                        uri={photoUri}
                        onRetake={handleRetakePhoto}
                        onConfirm={handleAnalyzePhoto}
                        onClose={handleClosePreview}
                    />
                )}
            </Modal>
        </SafeAreaView>
    )
}

function FeatureItem({
    icon,
    title,
    description,
}: {
    icon: React.ReactNode
    title: string
    description: string
}) {
    return (
        <View className="flex-row items-start mb-4">
            <View className="mr-4 mt-1">{icon}</View>
            <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900 mb-1">{title}</Text>
                <Text className="text-sm text-secondary leading-5">{description}</Text>
            </View>
        </View>
    )
}
