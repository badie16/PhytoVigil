import { View, Text, Image, TouchableOpacity } from "react-native"
import { AlertTriangle, CheckCircle, Info } from "lucide-react-native"

interface DiseaseCardProps {
    name: string
    confidence?: number
    treatment?: string
    image?: string
    status?: "healthy" | "diseased" | "unknown"
    onPress?: () => void
}

export default function DiseaseCard({
    name,
    confidence,
    treatment,
    image,
    status = "unknown",
    onPress,
}: DiseaseCardProps) {
    const getStatusIcon = () => {
        switch (status) {
            case "healthy":
                return <CheckCircle color="#00bfa5" size={24} />
            case "diseased":
                return <AlertTriangle color="#ff5722" size={24} />
            default:
                return <Info color="#90a4ae" size={24} />
        }
    }

    const getBorderColor = () => {
        switch (status) {
            case "healthy":
                return "#00bfa5"
            case "diseased":
                return "#ff5722"
            default:
                return "#90a4ae"
        }
    }

    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                backgroundColor: "#ffffff",
                borderRadius: 16,
                padding: 16,
                marginBottom: 16,
                borderWidth: 2,
                borderColor: getBorderColor(),
                elevation: 3,
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}
            activeOpacity={0.8}
        >
            <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                {image && (
                    <Image
                        source={{ uri: image }}
                        style={{ width: 64, height: 64, borderRadius: 12, marginRight: 16 }}
                        resizeMode="cover"
                    />
                )}

                <View style={{ flex: 1 }}>
                    <View
                        style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}
                    >
                        <Text style={{ fontSize: 18, fontWeight: "bold", color: "#00796b" }}>{name}</Text>
                        {getStatusIcon()}
                    </View>

                    {confidence && (
                        <View style={{ marginBottom: 8 }}>
                            <Text style={{ fontSize: 14, color: "#90a4ae", marginBottom: 4 }}>Confidence: {confidence}%</Text>
                            <View style={{ width: "100%", backgroundColor: "#e0e0e0", borderRadius: 4, height: 8 }}>
                                <View
                                    style={{
                                        backgroundColor: "#00bfa5",
                                        height: 8,
                                        borderRadius: 4,
                                        width: `${confidence}%`,
                                    }}
                                />
                            </View>
                        </View>
                    )}

                    {treatment && (
                        <Text style={{ fontSize: 14, color: "#666", lineHeight: 20 }} numberOfLines={2}>
                            {treatment}
                        </Text>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    )
}
