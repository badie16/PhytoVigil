import { Security } from "@/lib/guards/security"
import * as Device from "expo-device"
import * as Notifications from "expo-notifications"
import { Platform } from "react-native"
import { storageService } from "../local/storage"
import { authService } from "../remote/auth"
import { config } from "@/lib/config/env"

export interface NotificationData {
    type: "disease_alert" | "scan_reminder" | "weather_alert" | "weekly_report" | "plant_care"
    plantId?: number
    diseaseId?: number
    severity?: "low" | "medium" | "high"
    message: string
    actionUrl?: string
}

export interface ScheduledNotification {
    id: string
    title: string
    body: string
    data: NotificationData
    trigger: Notifications.NotificationTriggerInput
}

class NotificationService {
    private expoPushToken: string | null = null
    private isInitialized = false
    constructor() {
        this.setupNotificationHandler()
    }

    private setupNotificationHandler() {
        // Configure how notifications are handled when app is in foreground
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: true,
                shouldSetBadge: true,
                shouldShowBanner: true,
                shouldShowList: true,
            }),
        })
    }

    async initialize(): Promise<void> {
        if (this.isInitialized) return

        try {
            // Request permissions
            await this.requestPermissions()

            // Get push token
            await this.registerForPushNotifications()

            // Setup notification listeners
            this.setupNotificationListeners()

            this.isInitialized = true
            console.log("Notification service initialized successfully")
        } catch (error) {
            console.error("Failed to initialize notification service:", error)
            throw error
        }
    }

    private async requestPermissions(): Promise<boolean> {
        try {
            const { status: existingStatus } = await Notifications.getPermissionsAsync()
            let finalStatus = existingStatus

            if (existingStatus !== "granted") {
                const { status } = await Notifications.requestPermissionsAsync()
                finalStatus = status
            }

            if (finalStatus !== "granted") {
                console.warn("Push notification permissions not granted")
                return false
            }

            // For Android, set notification channel
            if (Platform.OS === "android") {
                await Notifications.setNotificationChannelAsync("default", {
                    name: "PhytoVigil Notifications",
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: "#00C896",
                    sound: "default",
                })

                // Disease alerts channel
                await Notifications.setNotificationChannelAsync("disease_alerts", {
                    name: "Disease Alerts",
                    importance: Notifications.AndroidImportance.HIGH,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: "#FF6B6B",
                    sound: "default",
                })

                // Reminders channel
                await Notifications.setNotificationChannelAsync("reminders", {
                    name: "Scan Reminders",
                    importance: Notifications.AndroidImportance.DEFAULT,
                    vibrationPattern: [0, 250],
                    lightColor: "#00C896",
                    sound: "default",
                })
            }

            return true
        } catch (error) {
            console.error("Error requesting notification permissions:", error)
            return false
        }
    }

    private async registerForPushNotifications(): Promise<string | null> {
        try {
            if (!Device.isDevice) {
                console.warn("Push notifications only work on physical devices")
                return null
            }

            const token = await Notifications.getExpoPushTokenAsync({
                projectId: config.EXPO_PUBLIC_PROJECT_ID,
            })

            this.expoPushToken = token.data

            // Save token locally
            await storageService.setSecureItem("expo_push_token", token.data)

            // Send token to backend
            await this.sendTokenToBackend(token.data)

            console.log("Expo push token:", token.data)
            return token.data
        } catch (error) {
            console.error("Failed to get push token:", error)
            return null
        }
    }

    private async sendTokenToBackend(token: string): Promise<void> {
        try {
            const user = await authService.getCurrentUser()
            if (!user) return

            // Send token to your backend API
            const response = await fetch(`${config.API_URL}/api/push-tokens/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${Security.getToken()}`,
                },
                body: JSON.stringify({
                    token,
                    device: Platform.OS,
                    deviceId: Device.osInternalBuildId,
                }),
            })

            if (!response.ok) {
                throw new Error("Failed to register push token with backend")
            }
        } catch (error) {
            console.error("Error sending token to backend:", error)
        }
    }

    private setupNotificationListeners(): void {
        // Handle notification received while app is in foreground
        Notifications.addNotificationReceivedListener((notification) => {
            console.log("Notification received:", notification)
            this.handleNotificationReceived(notification)
        })

        // Handle notification tapped
        Notifications.addNotificationResponseReceivedListener((response) => {
            console.log("Notification tapped:", response)
            this.handleNotificationTapped(response)
        })
    }

    private handleNotificationReceived(notification: Notifications.Notification): void {
        const data = notification.request.content.data as unknown as NotificationData

        // Update badge count
        this.updateBadgeCount()

        // Handle specific notification types
        switch (data.type) {
            case "disease_alert":
                this.handleDiseaseAlert(data)
                break
            case "scan_reminder":
                this.handleScanReminder(data)
                break
            case "weather_alert":
                this.handleWeatherAlert(data)
                break
        }
    }

    private handleNotificationTapped(response: Notifications.NotificationResponse): void {
        const data = response.notification.request.content.data as unknown as NotificationData

        // Navigate to appropriate screen based on notification type
        // This would integrate with your navigation system
        console.log("Navigate to:", data.actionUrl || data.type)
    }

    private handleDiseaseAlert(data: NotificationData): void {
        // Handle disease alert specific logic
        console.log("Disease alert received:", data)
    }

    private handleScanReminder(data: NotificationData): void {
        // Handle scan reminder specific logic
        console.log("Scan reminder received:", data)
    }

    private handleWeatherAlert(data: NotificationData): void {
        // Handle weather alert specific logic
        console.log("Weather alert received:", data)
    }

    // Public methods for sending notifications

    async sendDiseaseAlert(plantId: number, diseaseName: string, severity: "low" | "medium" | "high"): Promise<void> {
        const title = severity === "high" ? "🚨 Urgent Disease Alert" : "⚠️ Disease Detected"
        const body = `${diseaseName} detected on your plant. ${severity === "high" ? "Immediate action required!" : "Check your plant for treatment options."}`

        await this.sendLocalNotification({
            title,
            body,
            data: {
                type: "disease_alert",
                plantId,
                severity,
                message: body,
                actionUrl: `/plants/${plantId}`,
            },
            channelId: "disease_alerts",
        })
    }

    async scheduleScanReminder(plantId: number, plantName: string, reminderDate: Date): Promise<string> {
        const notificationId = `scan_reminder_${plantId}_${Date.now()}`

        const secondsUntilReminder = Math.floor((reminderDate.getTime() - Date.now()) / 1000)
        if (secondsUntilReminder <= 0) {
            throw new Error("Reminder date must be in the future")
        }
        await Notifications.scheduleNotificationAsync({
            identifier: notificationId,
            content: {
                title: "📱 Time to Scan Your Plant",
                body: `Don't forget to check ${plantName} for any health issues.`,
                data: {
                    type: "scan_reminder",
                    plantId,
                    message: `Scan reminder for ${plantName}`,
                    actionUrl: `/plants/scan/${plantId}`,
                },
                sound: "default",
            },
            trigger: {
                type: "timeInterval",
                seconds: secondsUntilReminder,
            } as Notifications.TimeIntervalTriggerInput,
        })
        return notificationId
    }

    async sendWeatherAlert(message: string, severity: "low" | "medium" | "high"): Promise<void> {
        const title = severity === "high" ? "🌪️ Severe Weather Alert" : "🌤️ Weather Update"

        await this.sendLocalNotification({
            title,
            body: message,
            data: {
                type: "weather_alert",
                severity,
                message,
                actionUrl: "/weather/details",
            },
        })
    }

    async sendWeeklyReport(scanCount: number, healthyPlants: number, diseasedPlants: number): Promise<void> {
        const body = `This week: ${scanCount} scans, ${healthyPlants} healthy plants, ${diseasedPlants} plants need attention.`

        await this.sendLocalNotification({
            title: "📊 Weekly Plant Health Report",
            body,
            data: {
                type: "weekly_report",
                message: body,
                actionUrl: "/activities",
            },
        })
    }

    async sendPlantCareReminder(plantId: number, plantName: string, careType: string): Promise<void> {
        await this.sendLocalNotification({
            title: "🌱 Plant Care Reminder",
            body: `Time to ${careType} your ${plantName}`,
            data: {
                type: "plant_care",
                plantId,
                message: `${careType} reminder for ${plantName}`,
                actionUrl: `/plants/${plantId}`,
            },
        })
    }

    private async sendLocalNotification(notification: {
        title: string
        body: string
        data: NotificationData
        channelId?: string
    }): Promise<void> {
        try {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: notification.title,
                    body: notification.body,
                    data: { ...notification.data } as Record<string, unknown>,
                    sound: "default",
                },
                trigger: null, // Send immediately
            })
        } catch (error) {
            console.error("Error sending local notification:", error)
        }
    }

    // Utility methods

    async updateBadgeCount(): Promise<void> {
        try {
            const count = await this.getUnreadNotificationCount()
            await Notifications.setBadgeCountAsync(count)
        } catch (error) {
            console.error("Error updating badge count:", error)
        }
    }

    async getUnreadNotificationCount(): Promise<number> {
        try {
            // This would typically come from your backend or local storage
            const unreadCount = await storageService.getUserPreferences()
            return unreadCount.unreadNotifications || 0
        } catch (error) {
            console.error("Error getting unread count:", error)
            return 0
        }
    }

    async clearAllNotifications(): Promise<void> {
        try {
            await Notifications.dismissAllNotificationsAsync()
            await Notifications.setBadgeCountAsync(0)
            await storageService.saveUserPreference("unreadNotifications", 0)
        } catch (error) {
            console.error("Error clearing notifications:", error)
        }
    }

    async cancelScheduledNotification(notificationId: string): Promise<void> {
        try {
            await Notifications.cancelScheduledNotificationAsync(notificationId)
        } catch (error) {
            console.error("Error canceling notification:", error)
        }
    }

    async getAllScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
        try {
            return await Notifications.getAllScheduledNotificationsAsync()
        } catch (error) {
            console.error("Error getting scheduled notifications:", error)
            return []
        }
    }

    // Settings management

    async updateNotificationSettings(settings: {
        pushNotifications: boolean
        diseaseAlerts: boolean
        scanReminders: boolean
        weatherAlerts: boolean
        weeklyReports: boolean
    }): Promise<void> {
        try {
            await storageService.saveUserPreference("notificationSettings", settings)

            // If push notifications are disabled, cancel all scheduled notifications
            if (!settings.pushNotifications) {
                await Notifications.cancelAllScheduledNotificationsAsync()
            }
        } catch (error) {
            console.error("Error updating notification settings:", error)
        }
    }

    async getNotificationSettings(): Promise<{
        pushNotifications: boolean
        diseaseAlerts: boolean
        scanReminders: boolean
        weatherAlerts: boolean
        weeklyReports: boolean
    }> {
        try {
            const preferences = await storageService.getUserPreferences()
            return (
                preferences.notificationSettings || {
                    pushNotifications: true,
                    diseaseAlerts: true,
                    scanReminders: true,
                    weatherAlerts: true,
                    weeklyReports: true,
                }
            )
        } catch (error) {
            console.error("Error getting notification settings:", error)
            return {
                pushNotifications: true,
                diseaseAlerts: true,
                scanReminders: true,
                weatherAlerts: true,
                weeklyReports: true,
            }
        }
    }

    // Getters
    get pushToken(): string | null {
        return this.expoPushToken
    }

    get initialized(): boolean {
        return this.isInitialized
    }
}

export const notificationService = new NotificationService()
