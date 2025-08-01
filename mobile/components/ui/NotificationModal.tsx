"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Alert, Modal, ScrollView, Switch, Text, TouchableOpacity, View } from "react-native"
import { Bell, MessageSquare, Shield, Zap, Clock } from "lucide-react-native"
import Header from "./header"
import { useNotifications } from "@/hooks/useNotifications"

interface NotificationModalProps {
    visible: boolean
    onClose: () => void
}

export default function NotificationModal({ visible, onClose }: NotificationModalProps) {
    const { settings, updateSettings, loading } = useNotifications()
    const [localSettings, setLocalSettings] = useState(settings)

    useEffect(() => {
        setLocalSettings(settings)
    }, [settings])

    const handleSave = async () => {
        try {
            await updateSettings(localSettings)
            Alert.alert("Success", "Notification settings updated successfully")
            onClose()
        } catch (error) {
            Alert.alert("Error", "Failed to update notification settings")
        }
    }

    const updateSetting = (key: keyof typeof localSettings, value: boolean) => {
        setLocalSettings((prev) => ({ ...prev, [key]: value }))
    }

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <View className="flex-1 bg-white">
                {/* Header */}
                <Header onBack={onClose} title="Notifications" isClose />

                <ScrollView className="flex-1 px-6">
                    <View className="py-6">
                        <Text className="text-base text-gray-600 mb-6">
                            Manage how you receive notifications and alerts from PhytoVigil
                        </Text>

                        {/* Push Notifications Master Switch */}
                        <NotificationItem
                            icon={<Bell color="#00C896" size={24} />}
                            title="Push Notifications"
                            description="Enable all push notifications on your device"
                            value={localSettings.pushNotifications}
                            onToggle={(value) => updateSetting("pushNotifications", value)}
                        />

                        {/* Individual Settings */}
                        <View className={`${!localSettings.pushNotifications ? "opacity-50" : ""}`}>
                            <NotificationItem
                                icon={<Shield color="#FF6B6B" size={24} />}
                                title="Disease Alerts"
                                description="Immediate alerts when diseases are detected"
                                value={localSettings.diseaseAlerts && localSettings.pushNotifications}
                                onToggle={(value) => updateSetting("diseaseAlerts", value)}
                                disabled={!localSettings.pushNotifications}
                            />

                            <NotificationItem
                                icon={<Clock color="#FFB800" size={24} />}
                                title="Scan Reminders"
                                description="Reminders to scan your plants regularly"
                                value={localSettings.scanReminders && localSettings.pushNotifications}
                                onToggle={(value) => updateSetting("scanReminders", value)}
                                disabled={!localSettings.pushNotifications}
                            />

                            <NotificationItem
                                icon={<MessageSquare color="#8B5CF6" size={24} />}
                                title="Weather Alerts"
                                description="Weather conditions affecting your plants"
                                value={localSettings.weatherAlerts && localSettings.pushNotifications}
                                onToggle={(value) => updateSetting("weatherAlerts", value)}
                                disabled={!localSettings.pushNotifications}
                            />

                            <NotificationItem
                                icon={<Zap color="#00C896" size={24} />}
                                title="Weekly Reports"
                                description="Summary of your plant health activities"
                                value={localSettings.weeklyReports && localSettings.pushNotifications}
                                onToggle={(value) => updateSetting("weeklyReports", value)}
                                disabled={!localSettings.pushNotifications}
                            />
                        </View>
                    </View>
                </ScrollView>

                {/* Footer */}
                <View className="p-6 border-t border-gray-100">
                    <TouchableOpacity onPress={handleSave} disabled={loading} className="bg-primary py-4 rounded-xl items-center">
                        <Text className="text-white text-base font-semibold">{loading ? "Saving..." : "Save Changes"}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

function NotificationItem({
    icon,
    title,
    description,
    value,
    onToggle,
    disabled = false,
}: {
    icon: React.ReactNode
    title: string
    description: string
    value: boolean
    onToggle: (value: boolean) => void
    disabled?: boolean
}) {
    return (
        <View className="flex-row items-center py-4 border-b border-gray-100">
            <View className="mr-4">{icon}</View>
            <View className="flex-1">
                <Text className={`text-base font-medium mb-1 ${disabled ? "text-gray-400" : "text-gray-900"}`}>{title}</Text>
                <Text className={`text-sm ${disabled ? "text-gray-400" : "text-gray-600"}`}>{description}</Text>
            </View>
            <Switch
                value={value}
                onValueChange={onToggle}
                disabled={disabled}
                trackColor={{ false: "#E5E7EB", true: "#00C896" }}
                thumbColor={value ? "#FFFFFF" : "#9CA3AF"}
            />
        </View>
    )
}
