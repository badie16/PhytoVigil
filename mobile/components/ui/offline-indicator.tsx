import { useOfflineManager } from "@/hooks/useOfflineManager"
import { RefreshCw, Wifi, WifiOff } from "lucide-react-native"
import { Text, TouchableOpacity, View } from "react-native"

interface OfflineIndicatorProps {
    showDetails?: boolean
    onSyncPress?: () => void
}

export default function OfflineIndicator({ showDetails = false, onSyncPress }: OfflineIndicatorProps) {
    const { offlineStatus, forceSync } = useOfflineManager()

    const handleSyncPress = async () => {
        if (onSyncPress) {
            onSyncPress()
        } else {
            try {
                await forceSync()
            } catch (error) {
                console.error("Erreur de synchronisation:", error)
            }
        }
    }

    if (offlineStatus.isOnline && offlineStatus.syncQueueLength === 0 && !showDetails) {
        return null // Masquer quand tout va bien
    }

    return (
        <View className="bg-white border-b border-gray-200">
            <View className="flex-row items-center justify-between px-4 py-2">
                <View className="flex-row items-center flex-1">
                    {offlineStatus.isOnline ? <Wifi size={16} color="#10B981" /> : <WifiOff size={16} color="#EF4444" />}

                    <View className="ml-2 flex-1">
                        <Text className="text-sm font-medium text-gray-900">
                            {offlineStatus.isOnline ? "En ligne" : "Mode hors ligne"}
                        </Text>

                        {showDetails && (
                            <Text className="text-xs text-gray-500">
                                {offlineStatus.isSyncing
                                    ? "Synchronisation en cours..."
                                    : offlineStatus.syncQueueLength > 0
                                        ? `${offlineStatus.syncQueueLength} éléments en attente`
                                        : offlineStatus.lastSyncDate
                                            ? `Dernière sync: ${new Date(offlineStatus.lastSyncDate).toLocaleString()}`
                                            : "Jamais synchronisé"}
                            </Text>
                        )}

                        {offlineStatus.error && <Text className="text-xs text-red-500">{offlineStatus.error}</Text>}
                    </View>
                </View>

                {offlineStatus.isOnline && offlineStatus.syncQueueLength > 0 && (
                    <TouchableOpacity onPress={handleSyncPress} disabled={offlineStatus.isSyncing} className="ml-2 p-2">
                        <RefreshCw
                            size={16}
                            color={offlineStatus.isSyncing ? "#9CA3AF" : "#10B981"}
                            style={{
                                transform: [{ rotate: offlineStatus.isSyncing ? "180deg" : "0deg" }],
                            }}
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    )
}
