import { View, Text, TouchableOpacity } from "react-native"
import { useOffline } from "@/hooks/useOffline"

interface OfflineIndicatorProps {
    showDetails?: boolean
    onPress?: () => void
}

export default function OfflineIndicator({ showDetails = false, onPress }: OfflineIndicatorProps) {
    const { isOffline, hasOfflineData, canDetectDiseasesOffline, offlineCapabilities } = useOffline()

    if (!isOffline) return null

    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                backgroundColor: "#F59E0B",
                paddingHorizontal: 16,
                paddingVertical: 8,
                margin: 16,
                borderRadius: 8,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
            }}
            activeOpacity={0.7}
        >
            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                    <View
                        style={{
                            width: 8,
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: "#DC2626",
                            marginRight: 8,
                        }}
                    />
                    <Text style={{ color: "white", fontWeight: "600", fontSize: 14 }}>Mode Hors Ligne</Text>
                </View>

                {showDetails && (
                    <Text style={{ color: "white", fontSize: 12, opacity: 0.9 }}>
                        {hasOfflineData ? "Données disponibles" : "Données limitées"} •
                        {canDetectDiseasesOffline ? " IA disponible" : " IA indisponible"}
                    </Text>
                )}
            </View>

            {showDetails && (
                <View style={{ alignItems: "flex-end" }}>
                    <Text style={{ color: "white", fontSize: 10, opacity: 0.8 }}>Appuyez pour détails</Text>
                </View>
            )}
        </TouchableOpacity>
    )
}
