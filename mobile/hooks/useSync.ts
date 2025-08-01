"use client"

import { useState, useEffect, useCallback } from "react"
import { syncService, type SyncStatus } from "@/services/sync/syncService"

export function useSync() {
    const [syncStatus, setSyncStatus] = useState<SyncStatus>(syncService.status)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const initializeSync = async () => {
            try {
                await syncService.initialize()
                setSyncStatus(syncService.status)
            } catch (error) {
                console.error("Failed to initialize sync:", error)
            } finally {
                setLoading(false)
            }
        }

        initializeSync()

        // Subscribe to sync status changes
        const unsubscribe = syncService.addListener((status) => {
            setSyncStatus(status)
        })

        return unsubscribe
    }, [])

    const triggerSync = useCallback(async () => {
        try {
            await syncService.triggerSync()
        } catch (error) {
            console.error("Manual sync failed:", error)
            throw error
        }
    }, [])

    const addToSyncQueue = useCallback(
        async (item: {
            type: "plant" | "scan" | "activity" | "user_profile"
            action: "create" | "update" | "delete"
            localId: string
            serverId?: string
            data: any
            priority?: "high" | "medium" | "low"
        }) => {
            try {
                await syncService.addToSyncQueue({
                    ...item,
                    priority: item.priority || "medium",
                })
            } catch (error) {
                console.error("Failed to add to sync queue:", error)
                throw error
            }
        },
        [],
    )

    const clearSyncErrors = useCallback(() => {
        syncStatus.errors = []
    }, [syncStatus])

    return {
        // Status
        syncStatus,
        isOnline: syncStatus.isOnline,
        isSyncing: syncStatus.isSyncing,
        lastSyncTime: syncStatus.lastSyncTime,
        pendingUploads: syncStatus.pendingUploads,
        pendingDownloads: syncStatus.pendingDownloads,
        syncProgress: syncStatus.syncProgress,
        syncErrors: syncStatus.errors,
        loading,

        // Actions
        triggerSync,
        addToSyncQueue,
        clearSyncErrors,

        // Helpers
        hasErrors: syncStatus.errors.length > 0,
        hasPendingChanges: syncStatus.pendingUploads > 0 || syncStatus.pendingDownloads > 0,
    }
}
