"use client"

import { useEffect, useState } from "react"
import { useNetworkStatus } from "./useNetworkStatus"
import { syncService } from "@/services/sync/syncService"
import { hybridService } from "@/services/hybrid/hybridService"
import { storageService } from "@/services/local/storage"

interface OfflineStatus {
    isOnline: boolean
    isSyncing: boolean
    syncQueueLength: number
    lastSyncDate?: string
    syncProgress?: number
    error?: string
}

export function useOfflineManager() {
    const { isConnected } = useNetworkStatus()
    const [offlineStatus, setOfflineStatus] = useState<OfflineStatus>({
        isOnline: false,
        isSyncing: false,
        syncQueueLength: 0,
    })

    useEffect(() => {
        updateOfflineStatus()
    }, [isConnected])

    useEffect(() => {
        // Initialiser le service de sync
        syncService.initialize()

        // Essayer de synchroniser quand la connexion revient
        if (isConnected && !offlineStatus.isSyncing) {
            handleAutoSync()
        }
    }, [isConnected])

    const updateOfflineStatus = async () => {
        try {
            const connectionStatus = await hybridService.getConnectionStatus()
            const preferences = await storageService.getUserPreferences()

            setOfflineStatus({
                isOnline: connectionStatus.isOnline,
                isSyncing: connectionStatus.syncStatus.isSyncing,
                syncQueueLength: connectionStatus.syncStatus.queueLength,
                lastSyncDate: preferences.last_sync_date,
                error: undefined,
            })
        } catch (error) {
            setOfflineStatus((prev) => ({
                ...prev,
                error: error instanceof Error ? error.message : "Erreur inconnue",
            }))
        }
    }

    const handleAutoSync = async () => {
        if (!isConnected) return

        try {
            setOfflineStatus((prev) => ({ ...prev, isSyncing: true, error: undefined }))

            const success = await syncService.syncAllData()

            if (success) {
                await storageService.saveUserPreference("last_sync_date", new Date().toISOString())
            }

            await updateOfflineStatus()
        } catch (error) {
            setOfflineStatus((prev) => ({
                ...prev,
                isSyncing: false,
                error: error instanceof Error ? error.message : "Erreur de synchronisation",
            }))
        }
    }

    const forceSync = async () => {
        if (!isConnected) {
            throw new Error("Connexion Internet requise pour la synchronisation")
        }

        return handleAutoSync()
    }

    const forceSyncDiseases = async () => {
        if (!isConnected) {
            throw new Error("Connexion Internet requise")
        }

        try {
            setOfflineStatus((prev) => ({ ...prev, isSyncing: true }))
            await syncService.forceSyncDiseases()
            await updateOfflineStatus()
        } catch (error) {
            setOfflineStatus((prev) => ({
                ...prev,
                isSyncing: false,
                error: error instanceof Error ? error.message : "Erreur de synchronisation",
            }))
            throw error
        }
    }

    const clearSyncQueue = async () => {
        // Cette fonction devrait être implémentée dans syncService
        // await syncService.clearSyncQueue()
        await updateOfflineStatus()
    }

    const getOfflineCapabilities = () => {
        return {
            canViewDiseases: true,
            canViewPlants: true,
            canScanBasic: true,
            canScanAdvanced: isConnected,
            canCreatePlant: true,
            canUpdatePlant: true,
            canDeletePlant: true,
            canSync: isConnected,
        }
    }

    return {
        offlineStatus,
        capabilities: getOfflineCapabilities(),
        forceSync,
        forceSyncDiseases,
        clearSyncQueue,
        updateStatus: updateOfflineStatus,
    }
}
