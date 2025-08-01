"use client"

import { useState } from "react"
import { Alert, Modal, ScrollView, Text, TouchableOpacity, View } from "react-native"
import { Bell, Shield, Clock, TrendingUp } from "lucide-react-native"
import Header from "./header"

interface NotificationPermissionModalProps {
    visible: boolean
    onClose: () => void
    onAllow: () => Promise<void>
    onDeny: () => void
}

export default function NotificationPermissionModal({
    visible,
    onClose,
    onAllow,
    onDeny,
}: NotificationPermissionModalProps) {
    const [loading, setLoading] = useState(false)

    const handleAllow = async () => {
        try {
            setLoading(true)
            await onAllow()
        } catch (error) {
            Alert.alert("Error", "Failed to enable notifications. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const benefits = [
        {
            icon: <Shield color="#FF6B6B" size={24} />,
            title: "Disease Alerts",
            description: "Get instant alerts when diseases are detected on your plants",
        },
        {
            icon: <Clock color="#00C896" size={24} />,
            title: "Scan Reminders",
            description: "Never forget to check your plants with scheduled reminders",
        },
        {
            icon: <Bell color="#FFB800" size={24} />,
            title: "Weather Alerts",
            description: "Stay informed about weather conditions affecting your plants",
        },
        {
            icon: <TrendingUp color="#8B5CF6" size={24} />,
            title: "Weekly Reports",
            description: "Receive summaries of your plant health activities",
        },
    ]

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <View className="flex-1 bg-white">
                {/* Header */}
                <Header onBack={onClose} title="Enable Notifications" isClose />

                <ScrollView className="flex-1 px-6">
                    <View className="py-6">
                        {/* Hero Section */}
                        <View className="items-center mb-8">
                            <View className="w-20 h-20 bg-primary/10 rounded-full items-center justify-center mb-4">
                                <Bell color="#00C896" size={40} />
                            </View>
                            <Text className="text-2xl font-bold text-gray-900 text-center mb-2">Stay Connected to Your Plants</Text>
                            <Text className="text-base text-gray-600 text-center leading-6">
                                Enable notifications to get timely alerts about your plant health and never miss important updates.
                            </Text>
                        </View>

                        {/* Benefits */}
                        <View className="mb-8">
                            <Text className="text-lg font-semibold text-gray-900 mb-4">What you'll receive:</Text>
                            {benefits.map((benefit, index) => (
                                <View key={index} className="flex-row items-start py-4 border-b border-gray-100">
                                    <View className="mr-4 mt-1">{benefit.icon}</View>
                                    <View className="flex-1">
                                        <Text className="text-base font-medium text-gray-900 mb-1">{benefit.title}</Text>
                                        <Text className="text-sm text-gray-600 leading-5">{benefit.description}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>

                        {/* Privacy Note */}
                        <View className="bg-gray-50 p-4 rounded-xl mb-6">
                            <Text className="text-sm text-gray-600 text-center">
                                🔒 Your privacy is important to us. We only send relevant notifications and you can customize or disable
                                them anytime in settings.
                            </Text>
                        </View>
                    </View>
                </ScrollView>

                {/* Footer */}
                <View className="p-6 border-t border-gray-100">
                    <TouchableOpacity
                        onPress={handleAllow}
                        disabled={loading}
                        className="bg-primary py-4 rounded-xl items-center mb-3"
                    >
                        <Text className="text-white text-base font-semibold">
                            {loading ? "Enabling..." : "Allow Notifications"}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={onDeny} disabled={loading} className="py-3 items-center">
                        <Text className="text-gray-500 text-base">Not Now</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}
