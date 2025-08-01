import { View, Text, Modal, ScrollView, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useOffline } from "@/hooks/useOffline"

interface OfflineCapabilitiesModalProps {
    visible: boolean
    onClose: () => void
}

export default function OfflineCapabilitiesModal({ visible, onClose }: OfflineCapabilitiesModalProps) {
    const {
        offlineStatus,
        isOffline,
        hasOfflineData,
        canDetectDiseasesOffline,
        cachedImagesCount,
        lastOfflineSync,
        cacheEssentialData,
    } = useOffline()

    const handleCacheData = async () => {
        try {
            await cacheEssentialData()
            alert("Données mises en cache avec succès!")
        } catch (error) {
            alert("Erreur lors de la mise en cache des données")
        }
    }

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
                {/* Header */}
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingHorizontal: 20,
                        paddingVertical: 16,
                        borderBottomWidth: 1,
                        borderBottomColor: "#E5E7EB",
                    }}
                >
                    <Text style={{ fontSize: 18, fontWeight: "600", color: "#111827" }}>Capacités Hors Ligne</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Text style={{ fontSize: 16, color: "#10B981", fontWeight: "500" }}>Fermer</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                    {/* Status Overview */}
                    <View style={{ padding: 20 }}>
                        <View
                            style={{
                                backgroundColor: isOffline ? "#FEF3C7" : "#D1FAE5",
                                borderRadius: 12,
                                padding: 16,
                                marginBottom: 20,
                            }}
                        >
                            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                                <View
                                    style={{
                                        width: 12,
                                        height: 12,
                                        borderRadius: 6,
                                        backgroundColor: isOffline ? "#F59E0B" : "#10B981",
                                        marginRight: 8,
                                    }}
                                />
                                <Text style={{ fontSize: 16, fontWeight: "600", color: "#111827" }}>
                                    {isOffline ? "Mode Hors Ligne Actif" : "Mode En Ligne"}
                                </Text>
                            </View>
                            <Text style={{ fontSize: 14, color: "#6B7280" }}>
                                {isOffline
                                    ? "L'application fonctionne avec les données locales"
                                    : "Connecté au serveur - toutes les fonctionnalités disponibles"}
                            </Text>
                        </View>

                        {/* Capabilities */}
                        <Text style={{ fontSize: 18, fontWeight: "600", color: "#111827", marginBottom: 16 }}>
                            Fonctionnalités Disponibles
                        </Text>

                        <View style={{ gap: 12 }}>
                            {/* Plant Management */}
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    padding: 16,
                                    backgroundColor: "#F9FAFB",
                                    borderRadius: 8,
                                }}
                            >
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 16, fontWeight: "500", color: "#111827" }}>Gestion des Plantes</Text>
                                    <Text style={{ fontSize: 14, color: "#6B7280" }}>Ajouter, modifier, supprimer des plantes</Text>
                                </View>
                                <View
                                    style={{
                                        width: 20,
                                        height: 20,
                                        borderRadius: 10,
                                        backgroundColor: "#10B981",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Text style={{ color: "white", fontSize: 12, fontWeight: "bold" }}>✓</Text>
                                </View>
                            </View>

                            {/* Disease Detection */}
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    padding: 16,
                                    backgroundColor: "#F9FAFB",
                                    borderRadius: 8,
                                }}
                            >
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 16, fontWeight: "500", color: "#111827" }}>Détection de Maladies</Text>
                                    <Text style={{ fontSize: 14, color: "#6B7280" }}>
                                        {canDetectDiseasesOffline ? "IA locale disponible" : "Nécessite une connexion"}
                                    </Text>
                                </View>
                                <View
                                    style={{
                                        width: 20,
                                        height: 20,
                                        borderRadius: 10,
                                        backgroundColor: canDetectDiseasesOffline ? "#10B981" : "#EF4444",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Text style={{ color: "white", fontSize: 12, fontWeight: "bold" }}>
                                        {canDetectDiseasesOffline ? "✓" : "✗"}
                                    </Text>
                                </View>
                            </View>

                            {/* Scan History */}
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    padding: 16,
                                    backgroundColor: "#F9FAFB",
                                    borderRadius: 8,
                                }}
                            >
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 16, fontWeight: "500", color: "#111827" }}>Historique des Scans</Text>
                                    <Text style={{ fontSize: 14, color: "#6B7280" }}>Consulter les scans précédents</Text>
                                </View>
                                <View
                                    style={{
                                        width: 20,
                                        height: 20,
                                        borderRadius: 10,
                                        backgroundColor: "#10B981",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Text style={{ color: "white", fontSize: 12, fontWeight: "bold" }}>✓</Text>
                                </View>
                            </View>

                            {/* Weather Cache */}
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    padding: 16,
                                    backgroundColor: "#F9FAFB",
                                    borderRadius: 8,
                                }}
                            >
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 16, fontWeight: "500", color: "#111827" }}>Données Météo</Text>
                                    <Text style={{ fontSize: 14, color: "#6B7280" }}>
                                        {offlineStatus.offlineCapabilities.weatherCache ? "Données en cache" : "Nécessite une connexion"}
                                    </Text>
                                </View>
                                <View
                                    style={{
                                        width: 20,
                                        height: 20,
                                        borderRadius: 10,
                                        backgroundColor: offlineStatus.offlineCapabilities.weatherCache ? "#10B981" : "#EF4444",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Text style={{ color: "white", fontSize: 12, fontWeight: "bold" }}>
                                        {offlineStatus.offlineCapabilities.weatherCache ? "✓" : "✗"}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Data Statistics */}
                        <Text style={{ fontSize: 18, fontWeight: "600", color: "#111827", marginTop: 24, marginBottom: 16 }}>
                            Données Locales
                        </Text>

                        <View
                            style={{
                                backgroundColor: "#F3F4F6",
                                borderRadius: 12,
                                padding: 16,
                            }}
                        >
                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
                                <Text style={{ fontSize: 14, color: "#6B7280" }}>Images en cache</Text>
                                <Text style={{ fontSize: 14, fontWeight: "500", color: "#111827" }}>{cachedImagesCount}</Text>
                            </View>

                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
                                <Text style={{ fontSize: 14, color: "#6B7280" }}>Données disponibles</Text>
                                <Text style={{ fontSize: 14, fontWeight: "500", color: "#111827" }}>
                                    {hasOfflineData ? "Oui" : "Non"}
                                </Text>
                            </View>

                            {lastOfflineSync && (
                                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                    <Text style={{ fontSize: 14, color: "#6B7280" }}>Dernière sync</Text>
                                    <Text style={{ fontSize: 14, fontWeight: "500", color: "#111827" }}>
                                        {lastOfflineSync.toLocaleDateString()}
                                    </Text>
                                </View>
                            )}
                        </View>

                        {/* Cache Data Button */}
                        {!isOffline && (
                            <TouchableOpacity
                                onPress={handleCacheData}
                                style={{
                                    backgroundColor: "#10B981",
                                    borderRadius: 8,
                                    padding: 16,
                                    alignItems: "center",
                                    marginTop: 20,
                                }}
                            >
                                <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>Mettre en Cache les Données</Text>
                                <Text style={{ color: "white", fontSize: 12, opacity: 0.8, marginTop: 4 }}>
                                    Préparer l'app pour le mode hors ligne
                                </Text>
                            </TouchableOpacity>
                        )}

                        {/* Offline Tips */}
                        <View
                            style={{
                                backgroundColor: "#EFF6FF",
                                borderRadius: 12,
                                padding: 16,
                                marginTop: 20,
                            }}
                        >
                            <Text style={{ fontSize: 16, fontWeight: "600", color: "#1E40AF", marginBottom: 8 }}>
                                💡 Conseils Mode Hors Ligne
                            </Text>
                            <Text style={{ fontSize: 14, color: "#1E40AF", lineHeight: 20 }}>
                                • Mettez en cache les données quand vous êtes connecté{"\n"}• Les scans hors ligne seront synchronisés
                                automatiquement{"\n"}• Certaines fonctionnalités nécessitent une connexion internet{"\n"}• L'IA locale
                                offre une précision réduite mais reste utile
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </Modal>
    )
}
