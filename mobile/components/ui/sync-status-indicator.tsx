import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native"
import { WifiOff, RefreshCw, AlertCircle, CheckCircle, Clock } from "lucide-react-native"
import { useSync } from "@/hooks/useSync"

interface SyncStatusIndicatorProps {
    showDetails?: boolean
    onPress?: () => void
}

export default function SyncStatusIndicator({ showDetails = false, onPress }: SyncStatusIndicatorProps) {
    const { isOnline, isSyncing, lastSyncTime, pendingUploads, hasErrors, triggerSync } = useSync()

    const handlePress = () => {
        if (onPress) {
            onPress()
        } else if (isOnline && !isSyncing) {
            triggerSync()
        }
    }

    const getStatusIcon = () => {
        if (!isOnline) {
            return <WifiOff color="#EF4444" size={16} />
        }

        if (isSyncing) {
            return <ActivityIndicator size="small" color="#00C896" />
        }

        if (hasErrors) {
            return <AlertCircle color="#F59E0B" size={16} />
        }

        if (pendingUploads > 0) {
            return <Clock color="#8B5CF6" size={16} />
        }

        return <CheckCircle color="#00C896" size={16} />
    }

    const getStatusText = () => {
        if (!isOnline) {
            return "Offline"
        }

        if (isSyncing) {
            return "Syncing..."
        }

        if (hasErrors) {
            return "Sync errors"
        }

        if (pendingUploads > 0) {
            return `${pendingUploads} pending`
        }

        return "Synced"
    }

    const getStatusColor = () => {
        if (!isOnline) return "text-red-500"
        if (isSyncing) return "text-primary"
        if (hasErrors) return "text-yellow-500"
        if (pendingUploads > 0) return "text-purple-500"
        return "text-green-500"
    }

    return (
        <TouchableOpacity
            onPress={handlePress}
            disabled={isSyncing}
            className="flex-row items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg"
        >
            {getStatusIcon()}
            <View className="flex-1">
                <Text className={`text-sm font-medium ${getStatusColor()}`}>{getStatusText()}</Text>
                {showDetails && lastSyncTime && (
                    <Text className="text-xs text-gray-500">Last sync: {lastSyncTime.toLocaleTimeString()}</Text>
                )}
            </View>
            {isOnline && !isSyncing && <RefreshCw color="#6B7280" size={14} />}
        </TouchableOpacity>
    )
}
