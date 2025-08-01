import { Modal, ScrollView, Text, TouchableOpacity, View, Alert } from "react-native"
import { Wifi, WifiOff, RefreshCw, AlertCircle, Clock, CheckCircle, Trash2 } from "lucide-react-native"
import { useSync } from "@/hooks/useSync"
import Header from "./header"

interface SyncDetailsModalProps {
    visible: boolean
    onClose: () => void
}

export default function SyncDetailsModal({ visible, onClose }: SyncDetailsModalProps) {
    const {
        syncStatus,
        isOnline,
        isSyncing,
        lastSyncTime,
        pendingUploads,
        syncProgress,
        syncErrors,
        triggerSync,
        clearSyncErrors,
    } = useSync()

    const handleManualSync = async () => {
        if (!isOnline || isSyncing) return

        try {
            await triggerSync()
            Alert.alert("Success", "Sync completed successfully")
        } catch (error) {
            Alert.alert("Error", "Sync failed. Please try again.")
        }
    }

    const handleClearErrors = () => {
        Alert.alert("Clear Errors", "Are you sure you want to clear all sync errors?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Clear",
                style: "destructive",
                onPress: clearSyncErrors,
            },
        ])
    }

    const getConnectionStatus = () => {
        if (isOnline) {
            return {
                icon: <Wifi color="#00C896" size={24} />,
                text: "Online",
                color: "text-green-600",
            }
        } else {
            return {
                icon: <WifiOff color="#EF4444" size={24} />,
                text: "Offline",
                color: "text-red-600",
            }
        }
    }

    const connectionStatus = getConnectionStatus()

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <View className="flex-1 bg-white">
                <Header onBack={onClose} title="Sync Status" isClose />

                <ScrollView className="flex-1 px-6">
                    <View className="py-6">
                        {/* Connection Status */}
                        <View className="bg-gray-50 p-4 rounded-xl mb-6">
                            <View className="flex-row items-center mb-3">
                                {connectionStatus.icon}
                                <Text className={`text-lg font-semibold ml-3 ${connectionStatus.color}`}>{connectionStatus.text}</Text>
                            </View>

                            {lastSyncTime && (
                                <Text className="text-sm text-gray-600">
                                    Last sync: {lastSyncTime.toLocaleDateString()} at {lastSyncTime.toLocaleTimeString()}
                                </Text>
                            )}
                        </View>

                        {/* Sync Progress */}
                        {isSyncing && (
                            <View className="bg-blue-50 p-4 rounded-xl mb-6">
                                <View className="flex-row items-center mb-3">
                                    <RefreshCw color="#3B82F6" size={20} />
                                    <Text className="text-base font-medium text-blue-700 ml-2">Syncing...</Text>
                                </View>
                                <View className="bg-blue-200 h-2 rounded-full">
                                    <View className="bg-blue-500 h-2 rounded-full" style={{ width: `${syncProgress}%` }} />
                                </View>
                                <Text className="text-sm text-blue-600 mt-2">{syncProgress}% complete</Text>
                            </View>
                        )}

                        {/* Pending Changes */}
                        {pendingUploads > 0 && (
                            <View className="bg-purple-50 p-4 rounded-xl mb-6">
                                <View className="flex-row items-center mb-2">
                                    <Clock color="#8B5CF6" size={20} />
                                    <Text className="text-base font-medium text-purple-700 ml-2">Pending Changes</Text>
                                </View>
                                <Text className="text-sm text-purple-600">{pendingUploads} changes waiting to be uploaded</Text>
                            </View>
                        )}

                        {/* Sync Errors */}
                        {syncErrors.length > 0 && (
                            <View className="bg-red-50 p-4 rounded-xl mb-6">
                                <View className="flex-row items-center justify-between mb-3">
                                    <View className="flex-row items-center">
                                        <AlertCircle color="#EF4444" size={20} />
                                        <Text className="text-base font-medium text-red-700 ml-2">Sync Errors</Text>
                                    </View>
                                    <TouchableOpacity onPress={handleClearErrors} className="p-1">
                                        <Trash2 color="#EF4444" size={16} />
                                    </TouchableOpacity>
                                </View>

                                {syncErrors.slice(0, 3).map((error, index) => (
                                    <View key={error.id} className="mb-2 last:mb-0">
                                        <Text className="text-sm font-medium text-red-700 capitalize">{error.type} Error</Text>
                                        <Text className="text-xs text-red-600">{error.message}</Text>
                                        <Text className="text-xs text-red-500">{error.timestamp.toLocaleString()}</Text>
                                    </View>
                                ))}

                                {syncErrors.length > 3 && (
                                    <Text className="text-xs text-red-600 mt-2">+{syncErrors.length - 3} more errors</Text>
                                )}
                            </View>
                        )}

                        {/* Success State */}
                        {isOnline && !isSyncing && pendingUploads === 0 && syncErrors.length === 0 && (
                            <View className="bg-green-50 p-4 rounded-xl mb-6">
                                <View className="flex-row items-center">
                                    <CheckCircle color="#00C896" size={20} />
                                    <Text className="text-base font-medium text-green-700 ml-2">All Synced</Text>
                                </View>
                                <Text className="text-sm text-green-600 mt-1">All your data is up to date</Text>
                            </View>
                        )}

                        {/* Manual Sync Button */}
                        <TouchableOpacity
                            onPress={handleManualSync}
                            disabled={!isOnline || isSyncing}
                            className={`py-4 rounded-xl items-center ${isOnline && !isSyncing ? "bg-primary" : "bg-gray-200"}`}
                        >
                            <View className="flex-row items-center">
                                <RefreshCw color={isOnline && !isSyncing ? "#FFFFFF" : "#9CA3AF"} size={20} />
                                <Text
                                    className={`text-base font-semibold ml-2 ${isOnline && !isSyncing ? "text-white" : "text-gray-500"}`}
                                >
                                    {isSyncing ? "Syncing..." : "Sync Now"}
                                </Text>
                            </View>
                        </TouchableOpacity>

                        {/* Offline Message */}
                        {!isOnline && (
                            <View className="mt-4 p-4 bg-yellow-50 rounded-xl">
                                <Text className="text-sm text-yellow-700 text-center">
                                    You're currently offline. Changes will be synced automatically when you're back online.
                                </Text>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </View>
        </Modal>
    )
}
