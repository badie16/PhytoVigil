import { View, Text, Image, TouchableOpacity } from "react-native"
import { Calendar, MapPin } from "lucide-react-native"

interface HistoryItemProps {
    id: string
    plantName: string
    diseaseName: string
    confidence: number
    date: string
    image?: string
    location?: string
    onPress: () => void
}

export default function HistoryItem({
    plantName,
    diseaseName,
    confidence,
    date,
    image,
    location,
    onPress,
}: HistoryItemProps) {
    const getConfidenceColor = (confidence: number) => {
        if (confidence >= 80) return "#4caf50"
        if (confidence >= 60) return "#ff9800"
        return "#f44336"
    }

    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                backgroundColor: "#ffffff",
                borderRadius: 12,
                padding: 16,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: "#f0f0f0",
                elevation: 2,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
            }}
            activeOpacity={0.8}
        >
            <View style={{ flexDirection: "row" }}>
                {image ? (
                    <Image
                        source={{ uri: image }}
                        style={{ width: 56, height: 56, borderRadius: 8, marginRight: 12 }}
                        resizeMode="cover"
                    />
                ) : (
                    <View
                        style={{
                            width: 56,
                            height: 56,
                            borderRadius: 8,
                            backgroundColor: "#f8f9fa",
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: 12,
                        }}
                    >
                        <Text style={{ color: "#90a4ae", fontSize: 10 }}>No Image</Text>
                    </View>
                )}

                <View style={{ flex: 1 }}>
                    <View
                        style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}
                    >
                        <Text style={{ fontSize: 16, fontWeight: "600", color: "#00796b" }} numberOfLines={1}>
                            {plantName}
                        </Text>
                        <Text style={{ fontSize: 14, fontWeight: "500", color: getConfidenceColor(confidence) }}>
                            {confidence}%
                        </Text>
                    </View>

                    <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }} numberOfLines={1}>
                        {diseaseName}
                    </Text>

                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Calendar color="#90a4ae" size={14} />
                            <Text style={{ fontSize: 12, color: "#90a4ae", marginLeft: 4 }}>{date}</Text>
                        </View>

                        {location && (
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <MapPin color="#90a4ae" size={14} />
                                <Text style={{ fontSize: 12, color: "#90a4ae", marginLeft: 4 }} numberOfLines={1}>
                                    {location}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}
