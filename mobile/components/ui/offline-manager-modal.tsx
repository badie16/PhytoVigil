"use client"

import { useOfflineManager } from "@/hooks/useOfflineManager"
import { databaseService } from "@/services/local/databaseService"
import { Cloud, Database, Download, HardDrive, RefreshCw, Trash2, Wifi } from "lucide-react-native"
import { useEffect, useState } from "react"
import { Alert, Modal, ScrollView, Text, TouchableOpacity, View } from "react-native"

interface OfflineManagerModalProps {
    visible: boolean
    onClose: () => void
}

export default function OfflineManagerModal({ visible, onClose }: OfflineManagerModalProps) {
    const { offlineStatus, forceSync, forceSyncDiseases, capabilities } = useOfflineManager()
    const [cacheSize, setCacheSize] = useState(0)
    const [stats, setStats] = useState({
        diseases: 0,
        plants: 0,
        scans: 0,
    })

    useEffect(() => {
        if (visible) {
            loadCacheInfo()
        }
    }, [visible])

    const loadCacheInfo = async () => {
        try {
            const size = await databaseService.getCacheSize()
            const dbStats = await databaseService.getStats()
            const diseases = await databaseService.getDiseases()

            setCacheSize(size)
            setStats({
                diseases: diseases.length,
                plants: dbStats.totalPlants,
                scans: dbStats.totalScans,
            })
        } catch (error) {
            console.error("Erreur chargement cache:", error)
        }
    }

    const handleSyncDiseases = async () => {
        try {
            await forceSyncDiseases()
            await loadCacheInfo()
            Alert.alert("Succès", "Dictionnaire des maladies synchronisé")
        } catch (error) {
            Alert.alert("Erreur", "Impossible de synchroniser les maladies")
        }
    }

    const handleFullSync = async () => {
        try {
            await forceSync()
            await loadCacheInfo()
            Alert.alert("Succès", "Synchronisation complète terminée")
        } catch (error) {
            Alert.alert("Erreur", "Erreur lors de la synchronisation")
        }
    }

    const handleClearCache = async () => {
        Alert.alert(
            "Vider le cache",
            "Êtes-vous sûr de vouloir supprimer toutes les données en cache ? Cela libérera de l'espace mais nécessitera une nouvelle synchronisation.",
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Vider",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await databaseService.cleanupCache(0) // Supprimer tout
                            await loadCacheInfo()
                            Alert.alert("Succès", "Cache vidé avec succès")
                        } catch (error) {
                            Alert.alert("Erreur", "Impossible de vider le cache")
                        }
                    },
                },
            ],
        )
    }

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return "0 B"
        const k = 1024
        const sizes = ["B", "KB", "MB", "GB"]
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    }

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
            <View className="flex-1 bg-white">
                {/* Header */}
                <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
                    <Text className="text-lg font-semibold text-gray-900">Gestion Hors Ligne</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Text className="text-primary font-medium">Fermer</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView className="flex-1">
                    {/* Statut de connexion */}
                    <View className="p-4 border-b border-gray-100">
                        <View className="flex-row items-center mb-2">
                            {offlineStatus.isOnline ? <Wifi size={20} color="#10B981" /> : <Wifi size={20} color="#EF4444" />}
                            <Text className="ml-2 text-base font-medium text-gray-900">
                                {offlineStatus.isOnline ? "Connecté" : "Hors ligne"}
                            </Text>
                        </View>

                        {offlineStatus.syncQueueLength > 0 && (
                            <Text className="text-sm text-orange-600">
                                {offlineStatus.syncQueueLength} éléments en attente de synchronisation
                            </Text>
                        )}

                        {offlineStatus.lastSyncDate && (
                            <Text className="text-sm text-gray-500">
                                Dernière sync: {new Date(offlineStatus.lastSyncDate).toLocaleString()}
                            </Text>
                        )}
                    </View>

                    {/* Capacités offline */}
                    <View className="p-4 border-b border-gray-100">
                        <Text className="text-base font-medium text-gray-900 mb-3">Fonctionnalités disponibles</Text>

                        <View className="space-y-2">
                            <CapabilityItem
                                icon={Database}
                                title="Dictionnaire des maladies"
                                available={capabilities.canViewDiseases}
                                description={`${stats.diseases} maladies en local`}
                            />
                            <CapabilityItem
                                icon={HardDrive}
                                title="Mes plantes"
                                available={capabilities.canViewPlants}
                                description={`${stats.plants} plantes sauvegardées`}
                            />
                            <CapabilityItem
                                icon={Cloud}
                                title="Scan avancé"
                                available={!!capabilities.canScanAdvanced}
                                description={capabilities.canScanAdvanced ? "IA complète disponible" : "Connexion requise"}
                            />
                        </View>
                    </View>

                    {/* Statistiques de stockage */}
                    <View className="p-4 border-b border-gray-100">
                        <Text className="text-base font-medium text-gray-900 mb-3">Stockage local</Text>

                        <View className="bg-gray-50 rounded-lg p-3">
                            <View className="flex-row justify-between items-center mb-2">
                                <Text className="text-sm text-gray-600">Cache des images</Text>
                                <Text className="text-sm font-medium text-gray-900">{formatBytes(cacheSize)}</Text>
                            </View>

                            <View className="flex-row justify-between items-center mb-2">
                                <Text className="text-sm text-gray-600">Scans sauvegardés</Text>
                                <Text className="text-sm font-medium text-gray-900">{stats.scans}</Text>
                            </View>

                            <View className="flex-row justify-between items-center">
                                <Text className="text-sm text-gray-600">Maladies référencées</Text>
                                <Text className="text-sm font-medium text-gray-900">{stats.diseases}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Actions de synchronisation */}
                    <View className="p-4">
                        <Text className="text-base font-medium text-gray-900 mb-3">Actions</Text>

                        <View className="space-y-3">
                            <TouchableOpacity
                                onPress={handleSyncDiseases}
                                disabled={!offlineStatus.isOnline || offlineStatus.isSyncing}
                                className={`flex-row items-center p-3 rounded-lg border ${offlineStatus.isOnline && !offlineStatus.isSyncing
                                        ? "bg-blue-50 border-blue-200"
                                        : "bg-gray-50 border-gray-200"
                                    }`}
                            >
                                <Download
                                    size={20}
                                    color={offlineStatus.isOnline && !offlineStatus.isSyncing ? "#3B82F6" : "#9CA3AF"}
                                />
                                <View className="ml-3 flex-1">
                                    <Text
                                        className={`text-sm font-medium ${offlineStatus.isOnline && !offlineStatus.isSyncing ? "text-blue-900" : "text-gray-500"
                                            }`}
                                    >
                                        Synchroniser les maladies
                                    </Text>
                                    <Text className="text-xs text-gray-500">Télécharger le dictionnaire complet</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={handleFullSync}
                                disabled={!offlineStatus.isOnline || offlineStatus.isSyncing}
                                className={`flex-row items-center p-3 rounded-lg border ${offlineStatus.isOnline && !offlineStatus.isSyncing
                                        ? "bg-green-50 border-green-200"
                                        : "bg-gray-50 border-gray-200"
                                    }`}
                            >
                                <RefreshCw
                                    size={20}
                                    color={offlineStatus.isOnline && !offlineStatus.isSyncing ? "#10B981" : "#9CA3AF"}
                                />
                                <View className="ml-3 flex-1">
                                    <Text
                                        className={`text-sm font-medium ${offlineStatus.isOnline && !offlineStatus.isSyncing ? "text-green-900" : "text-gray-500"
                                            }`}
                                    >
                                        Synchronisation complète
                                    </Text>
                                    <Text className="text-xs text-gray-500">Synchroniser toutes les données</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={handleClearCache}
                                className="flex-row items-center p-3 rounded-lg border bg-red-50 border-red-200"
                            >
                                <Trash2 size={20} color="#EF4444" />
                                <View className="ml-3 flex-1">
                                    <Text className="text-sm font-medium text-red-900">Vider le cache</Text>
                                    <Text className="text-xs text-gray-500">Libérer l'espace de stockage</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </Modal>
    )
}

interface CapabilityItemProps {
    icon: any
    title: string
    available: boolean
    description: string
}

function CapabilityItem({ icon: Icon, title, available, description }: CapabilityItemProps) {
    return (
        <View className="flex-row items-center py-2">
            <View
                className={`w-8 h-8 rounded-full items-center justify-center ${available ? "bg-green-100" : "bg-gray-100"}`}
            >
                <Icon size={16} color={available ? "#10B981" : "#9CA3AF"} />
            </View>
            <View className="ml-3 flex-1">
                <Text className={`text-sm font-medium ${available ? "text-gray-900" : "text-gray-500"}`}>{title}</Text>
                <Text className="text-xs text-gray-500">{description}</Text>
            </View>
            <View className={`w-2 h-2 rounded-full ${available ? "bg-green-500" : "bg-gray-300"}`} />
        </View>
    )
}
