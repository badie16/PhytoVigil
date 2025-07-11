"use client"

import { useState, useRef, useEffect } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native"
import { CameraView, type CameraType, useCameraPermissions } from "expo-camera"
import { SafeAreaView } from "react-native-safe-area-context"
import { X, RotateCcw, Zap, ZapOff } from "lucide-react-native"
import * as MediaLibrary from "expo-media-library"

interface CameraScreenProps {
    onClose: () => void
    onPhotoTaken: (uri: string) => void
}

export default function CameraScreen({ onClose, onPhotoTaken }: CameraScreenProps) {
    const [facing, setFacing] = useState<CameraType>("back")
    const [flash, setFlash] = useState(false)
    const [permission, requestPermission] = useCameraPermissions()
    const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions()
    const cameraRef = useRef<CameraView>(null)

    useEffect(() => {
        if (!permission?.granted) {
            requestPermission()
        }
        if (!mediaPermission?.granted) {
            requestMediaPermission()
        }
    }, [])

    if (!permission) {
        return <View />
    }

    if (!permission.granted) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.permissionContainer}>
                    <Text style={styles.permissionText}>We need your permission to show the camera</Text>
                    <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
                        <Text style={styles.permissionButtonText}>Grant Permission</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        )
    }

    const takePicture = async () => {
        if (cameraRef.current) {
            try {
                const photo = await cameraRef.current.takePictureAsync({
                    quality: 0.8,
                    base64: false,
                    skipProcessing: false,
                })

                if (photo?.uri) {
                    // Save to media library if permission granted
                    if (mediaPermission?.granted) {
                        await MediaLibrary.saveToLibraryAsync(photo.uri)
                    }

                    onPhotoTaken(photo.uri)
                    onClose()
                }
            } catch (error) {
                console.error("Error taking picture:", error)
                Alert.alert("Error", "Failed to take picture. Please try again.")
            }
        }
    }

    const toggleCameraFacing = () => {
        setFacing((current) => (current === "back" ? "front" : "back"))
    }

    const toggleFlash = () => {
        setFlash((current) => !current)
    }

    return (
        <SafeAreaView style={styles.container}>
            <CameraView ref={cameraRef} style={styles.camera} facing={facing} flash={flash ? "on" : "off"}>
                {/* Header Controls */}
                <View style={styles.headerControls}>
                    <TouchableOpacity onPress={onClose} style={styles.controlButton}>
                        <X color="#FFFFFF" size={24} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={toggleFlash} style={styles.controlButton}>
                        {flash ? <Zap color="#FFD700" size={24} /> : <ZapOff color="#FFFFFF" size={24} />}
                    </TouchableOpacity>
                </View>

                {/* Camera Guide Overlay */}
                <View style={styles.overlay}>
                    <View style={styles.focusArea}>
                        <View style={styles.corner} />
                        <View style={[styles.corner, styles.topRight]} />
                        <View style={[styles.corner, styles.bottomLeft]} />
                        <View style={[styles.corner, styles.bottomRight]} />
                    </View>
                    <Text style={styles.guideText}>Position the plant leaf within the frame</Text>
                </View>

                {/* Bottom Controls */}
                <View style={styles.bottomControls}>
                    <View style={styles.controlsRow}>
                        <TouchableOpacity onPress={toggleCameraFacing} style={styles.secondaryButton}>
                            <RotateCcw color="#FFFFFF" size={24} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={takePicture} style={styles.captureButton}>
                            <View style={styles.captureButtonInner} />
                        </TouchableOpacity>

                        <View style={styles.placeholder} />
                    </View>

                    <Text style={styles.instructionText}>Tap to capture • Ensure good lighting</Text>
                </View>
            </CameraView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000000",
    },
    camera: {
        flex: 1,
    },
    permissionContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#FFFFFF",
    },
    permissionText: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 20,
        color: "#333333",
    },
    permissionButton: {
        backgroundColor: "#00C896",
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    permissionButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    },
    headerControls: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    controlButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        alignItems: "center",
        justifyContent: "center",
    },
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    focusArea: {
        width: 280,
        height: 280,
        position: "relative",
    },
    corner: {
        position: "absolute",
        width: 30,
        height: 30,
        borderColor: "#00C896",
        borderWidth: 3,
        borderTopWidth: 3,
        borderLeftWidth: 3,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        top: 0,
        left: 0,
    },
    topRight: {
        top: 0,
        right: 0,
        left: "auto",
        borderTopWidth: 3,
        borderRightWidth: 3,
        borderLeftWidth: 0,
        borderBottomWidth: 0,
    },
    bottomLeft: {
        bottom: 0,
        left: 0,
        top: "auto",
        borderBottomWidth: 3,
        borderLeftWidth: 3,
        borderTopWidth: 0,
        borderRightWidth: 0,
    },
    bottomRight: {
        bottom: 0,
        right: 0,
        top: "auto",
        left: "auto",
        borderBottomWidth: 3,
        borderRightWidth: 3,
        borderTopWidth: 0,
        borderLeftWidth: 0,
    },
    guideText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "500",
        textAlign: "center",
        marginTop: 20,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    bottomControls: {
        paddingBottom: 40,
        paddingHorizontal: 20,
    },
    controlsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    secondaryButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        alignItems: "center",
        justifyContent: "center",
    },
    captureButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 4,
        borderColor: "rgba(255, 255, 255, 0.3)",
    },
    captureButtonInner: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#00C896",
    },
    placeholder: {
        width: 50,
        height: 50,
    },
    instructionText: {
        color: "#FFFFFF",
        fontSize: 14,
        textAlign: "center",
        opacity: 0.8,
    },
})
