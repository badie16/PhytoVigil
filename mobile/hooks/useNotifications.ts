"use client"

import { useState, useEffect, useCallback } from "react"
import { notificationService } from "@/services/notifications/notificationService"

export interface NotificationSettings {
    pushNotifications: boolean
    diseaseAlerts: boolean
    scanReminders: boolean
    weatherAlerts: boolean
    weeklyReports: boolean
}

export function useNotifications() {
    const [isInitialized, setIsInitialized] = useState(false)
    const [pushToken, setPushToken] = useState<string | null>(null)
    const [settings, setSettings] = useState<NotificationSettings>({
        pushNotifications: true,
        diseaseAlerts: true,
        scanReminders: true,
        weatherAlerts: true,
        weeklyReports: true,
    })
    const [unreadCount, setUnreadCount] = useState(0)
    const [loading, setLoading] = useState(true)

    // Initialize notification service
    useEffect(() => {
        const initializeNotifications = async () => {
            try {
                setLoading(true)
                await notificationService.initialize()
                setIsInitialized(true)
                setPushToken(notificationService.pushToken)

                // Load settings
                const savedSettings = await notificationService.getNotificationSettings()
                setSettings(savedSettings)

                // Load unread count
                const count = await notificationService.getUnreadNotificationCount()
                setUnreadCount(count)
            } catch (error) {
                console.error("Failed to initialize notifications:", error)
            } finally {
                setLoading(false)
            }
        }

        initializeNotifications()
    }, [])

    // Update settings
    const updateSettings = useCallback(
        async (newSettings: Partial<NotificationSettings>) => {
            try {
                const updatedSettings = { ...settings, ...newSettings }
                await notificationService.updateNotificationSettings(updatedSettings)
                setSettings(updatedSettings)
            } catch (error) {
                console.error("Failed to update notification settings:", error)
                throw error
            }
        },
        [settings],
    )

    // Send disease alert
    const sendDiseaseAlert = useCallback(
        async (plantId: number, diseaseName: string, severity: "low" | "medium" | "high") => {
            if (!settings.diseaseAlerts || !settings.pushNotifications) return

            try {
                await notificationService.sendDiseaseAlert(plantId, diseaseName, severity)
            } catch (error) {
                console.error("Failed to send disease alert:", error)
                throw error
            }
        },
        [settings],
    )

    // Schedule scan reminder
    const scheduleScanReminder = useCallback(
        async (plantId: number, plantName: string, reminderDate: Date): Promise<string | null> => {
            if (!settings.scanReminders || !settings.pushNotifications) return null

            try {
                return await notificationService.scheduleScanReminder(plantId, plantName, reminderDate)
            } catch (error) {
                console.error("Failed to schedule scan reminder:", error)
                throw error
            }
        },
        [settings],
    )

    // Send weather alert
    const sendWeatherAlert = useCallback(
        async (message: string, severity: "low" | "medium" | "high") => {
            if (!settings.weatherAlerts || !settings.pushNotifications) return

            try {
                await notificationService.sendWeatherAlert(message, severity)
            } catch (error) {
                console.error("Failed to send weather alert:", error)
                throw error
            }
        },
        [settings],
    )

    // Send weekly report
    const sendWeeklyReport = useCallback(
        async (scanCount: number, healthyPlants: number, diseasedPlants: number) => {
            if (!settings.weeklyReports || !settings.pushNotifications) return

            try {
                await notificationService.sendWeeklyReport(scanCount, healthyPlants, diseasedPlants)
            } catch (error) {
                console.error("Failed to send weekly report:", error)
                throw error
            }
        },
        [settings],
    )

    // Send plant care reminder
    const sendPlantCareReminder = useCallback(
        async (plantId: number, plantName: string, careType: string) => {
            if (!settings.pushNotifications) return

            try {
                await notificationService.sendPlantCareReminder(plantId, plantName, careType)
            } catch (error) {
                console.error("Failed to send plant care reminder:", error)
                throw error
            }
        },
        [settings],
    )

    // Clear all notifications
    const clearAllNotifications = useCallback(async () => {
        try {
            await notificationService.clearAllNotifications()
            setUnreadCount(0)
        } catch (error) {
            console.error("Failed to clear notifications:", error)
            throw error
        }
    }, [])

    // Cancel scheduled notification
    const cancelScheduledNotification = useCallback(async (notificationId: string) => {
        try {
            await notificationService.cancelScheduledNotification(notificationId)
        } catch (error) {
            console.error("Failed to cancel notification:", error)
            throw error
        }
    }, [])

    // Get scheduled notifications
    const getScheduledNotifications = useCallback(async () => {
        try {
            return await notificationService.getAllScheduledNotifications()
        } catch (error) {
            console.error("Failed to get scheduled notifications:", error)
            return []
        }
    }, [])

    // Update badge count
    const updateBadgeCount = useCallback(async () => {
        try {
            await notificationService.updateBadgeCount()
            const count = await notificationService.getUnreadNotificationCount()
            setUnreadCount(count)
        } catch (error) {
            console.error("Failed to update badge count:", error)
        }
    }, [])

    return {
        // State
        isInitialized,
        pushToken,
        settings,
        unreadCount,
        loading,

        // Actions
        updateSettings,
        sendDiseaseAlert,
        scheduleScanReminder,
        sendWeatherAlert,
        sendWeeklyReport,
        sendPlantCareReminder,
        clearAllNotifications,
        cancelScheduledNotification,
        getScheduledNotifications,
        updateBadgeCount,
    }
}
