import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { X, Check, RotateCcw } from "lucide-react-native"

interface PhotoPreviewProps {
    uri: string
    onRetake: () => void
    onConfirm: () => void
    onClose: () => void
}

const { width, height } = Dimensions.get("window")

export default function PhotoPreview({ uri, onRetake, onConfirm, onClose }: PhotoPreviewProps) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onClose} style={styles.headerButton}>
                    <X color="#FFFFFF" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Photo Preview</Text>
                <View style={styles.placeholder} />
            </View>

            <View style={styles.imageContainer}>
                <Image source={{ uri }} style={styles.image} resizeMode="cover" />

                {/* Overlay with analysis info */}
                <View style={styles.overlay}>
                    <View style={styles.infoCard}>
                        <Text style={styles.infoTitle}>Ready for Analysis</Text>
                        <Text style={styles.infoText}>
                            This photo will be analyzed by our AI to detect plant diseases and provide treatment recommendations.
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.controls}>
                <TouchableOpacity onPress={onRetake} style={styles.secondaryButton}>
                    <RotateCcw color="#00C896" size={24} />
                    <Text style={styles.secondaryButtonText}>Retake</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={onConfirm} style={styles.primaryButton}>
                    <Check color="#FFFFFF" size={24} />
                    <Text style={styles.primaryButtonText}>Analyze Plant</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000000",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    headerButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        alignItems: "center",
        justifyContent: "center",
    },
    headerTitle: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "600",
    },
    placeholder: {
        width: 40,
    },
    imageContainer: {
        flex: 1,
        position: "relative",
    },
    image: {
        width: width,
        height: height * 0.7,
    },
    overlay: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundImage: "linear-gradient(transparent, rgba(0, 0, 0, 0.8))",
        padding: 20,
    },
    infoCard: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderRadius: 16,
        padding: 16,
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#333333",
        marginBottom: 8,
    },
    infoText: {
        fontSize: 14,
        color: "#666666",
        lineHeight: 20,
    },
    controls: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 24,
        gap: 16,
    },
    secondaryButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: 16,
        paddingVertical: 16,
        borderWidth: 1,
        borderColor: "#00C896",
        gap: 8,
    },
    secondaryButtonText: {
        color: "#00C896",
        fontSize: 16,
        fontWeight: "600",
    },
    primaryButton: {
        flex: 2,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#00C896",
        borderRadius: 16,
        paddingVertical: 16,
        gap: 8,
    },
    primaryButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    },
})
