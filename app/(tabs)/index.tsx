"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, ScrollView, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import CameraButton from "@/components/ui/camera-button"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { Leaf, Zap, Shield } from "lucide-react-native"

export default function ScannerScreen() {
    const [isAnalyzing, setIsAnalyzing] = useState(false)

    const handleCameraPress = () => {
        Alert.alert("Take Photo", "Choose an option", [
            { text: "Camera", onPress: () => openCamera() },
            { text: "Gallery", onPress: () => openGallery() },
            { text: "Cancel", style: "cancel" },
        ])
    }

    const openCamera = () => {
        setIsAnalyzing(true)
        setTimeout(() => setIsAnalyzing(false), 3000)
    }

    const openGallery = () => {
        setIsAnalyzing(true)
        setTimeout(() => setIsAnalyzing(false), 3000)
    }

    if (isAnalyzing) {
        return <LoadingSpinner message="Analyzing your plant..." size="large" />
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
            <ScrollView style={{ flex: 1, paddingHorizontal: 24 }}>
                {/* Header */}
                <View style={{ alignItems: "center", paddingVertical: 32 }}>
                    <View
                        style={{
                            width: 96,
                            height: 96,
                            backgroundColor: "#00bfa520",
                            borderRadius: 48,
                            alignItems: "center",
                            justifyContent: "center",
                            marginBottom: 16,
                        }}
                    >
                        <Leaf color="#00bfa5" size={40} />
                    </View>
                    <Text style={{ fontSize: 24, fontWeight: "bold", color: "#00796b", marginBottom: 8 }}>
                        Plant Disease Scanner
                    </Text>
                    <Text style={{ fontSize: 16, color: "#90a4ae", textAlign: "center", lineHeight: 24 }}>
                        Take a photo of your plant to detect diseases and get treatment recommendations
                    </Text>
                </View>

                {/* Features */}
                <View style={{ marginBottom: 32 }}>
                    <FeatureItem
                        icon={<Zap color="#00bfa5" size={24} />}
                        title="AI-Powered Analysis"
                        description="Advanced machine learning for accurate disease detection"
                    />
                    <FeatureItem
                        icon={<Shield color="#00bfa5" size={24} />}
                        title="Treatment Recommendations"
                        description="Get personalized treatment plans for your plants"
                    />
                    <FeatureItem
                        icon={<Leaf color="#00bfa5" size={24} />}
                        title="Plant Health Tracking"
                        description="Monitor your plant's health over time"
                    />
                </View>

                {/* Camera Button */}
                <View style={{ alignItems: "center", marginBottom: 32 }}>
                    <CameraButton onPress={handleCameraPress} size="lg" />
                    <Text style={{ fontSize: 14, color: "#90a4ae", marginTop: 16, textAlign: "center" }}>
                        Tap to scan your plant
                    </Text>
                </View>

                {/* Instructions */}
                <View
                    style={{
                        backgroundColor: "#f8f9fa",
                        borderRadius: 12,
                        padding: 16,
                        marginBottom: 24,
                    }}
                >
                    <Text style={{ fontSize: 18, fontWeight: "600", color: "#00796b", marginBottom: 12 }}>
                        How to get best results:
                    </Text>
                    <Text style={{ fontSize: 14, color: "#666", lineHeight: 24 }}>
                        • Take clear, well-lit photos{"\n"}• Focus on affected leaves or parts{"\n"}• Avoid shadows and reflections
                        {"\n"}• Hold camera steady for sharp images
                    </Text>
                </View>
            </ScrollView>
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
        <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 16 }}>
            <View style={{ marginRight: 16, marginTop: 4 }}>{icon}</View>
            <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: "600", color: "#00796b", marginBottom: 4 }}>{title}</Text>
                <Text style={{ fontSize: 14, color: "#90a4ae", lineHeight: 20 }}>{description}</Text>
            </View>
        </View>
    )
}
