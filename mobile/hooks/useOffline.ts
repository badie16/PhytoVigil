"use client"

import { useState, useEffect, useCallback } from "react"
import { offlineService, type OfflineStatus } from "@/services/offline/offlineService"

export function useOffline() {
    const [offlineStatus, setOfflineStatus] = useState<OfflineStatus>(offlineService.status)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const initializeOffline = async () => {
            try {
                await offlineService.initialize()
                setOfflineStatus(offlineService.status)
            } catch (error) {
                console.error("Failed to initialize offline service:", error)
            } finally {
                setLoading(false)
            }
        }

        initializeOffline()

        // Subscribe to offline status changes
        const unsubscribe = offlineService.addListener((status) => {
            setOfflineStatus(status)
        })

        return unsubscribe
    }, [])

    const cacheEssentialData = useCallback(async () => {
        try {
            await offlineService.cacheEssentialData()
        } catch (error) {
            console.error("Failed to cache essential data:", error)
            throw error
        }
    }, [])

    const detectDiseaseOffline = useCallback(async (imageUri: string) => {
        try {
            return await offlineService.detectDiseaseOffline(imageUri)
        } catch (error) {
            console.error("Offline disease detection failed:", error)
            throw error
        }
    }, [])

    const getCachedWeather = useCallback(async () => {
        try {
            return await offlineService.getCachedWeather()
        } catch (error) {
            console.error("Failed to get cached weather:", error)
            return null
        }
    }, [])

    const getCachedTips = useCallback(async () => {
        try {
            return await offlineService.getCachedTips()
        } catch (error) {
            console.error("Failed to get cached tips:", error)
            return []
        }
    }, [])

    return {
        // Status
        offlineStatus,
        isOffline: offlineStatus.isOfflineMode,
        hasOfflineData: offlineStatus.hasOfflineData,
        canDetectDiseasesOffline: offlineStatus.offlineModelsReady,
        offlineCapabilities: offlineStatus.offlineCapabilities,
        cachedImagesCount: offlineStatus.cachedImagesCount,
        lastOfflineSync: offlineStatus.lastOfflineSync,
        loading,

        // Actions
        cacheEssentialData,
        detectDiseaseOffline,
        getCachedWeather,
        getCachedTips,

        // Helpers
        isFullyOfflineReady: offlineStatus.hasOfflineData && offlineStatus.offlineModelsReady,
    }
}
