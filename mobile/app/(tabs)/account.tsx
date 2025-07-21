import { useAuth } from "@/contexts/auth-context"
import { Bell, ChevronRight, HelpCircle, Leaf, MapPin, Settings, Shield, User } from "lucide-react-native"
import type React from "react"
import { ScrollView, Text, TouchableOpacity, View } from "react-native"

export default function AccountScreen() {

    const { user, isLoading } = useAuth()
    const handleSettingPress = (setting: string) => {
        console.log("Setting pressed:", setting)
    }
    return (
        <View className="flex-1 bg-white pt-2">
            <ScrollView className="flex-1">
                {/* Profile Header */}
                <View className="items-center py-8 px-6">
                    <View className="w-24 h-24 bg-primary/10 rounded-full items-center justify-center mb-4">
                        <User color="#00C896" size={40} />
                    </View>
                    <Text className="text-2xl font-bold text-gray-900 mb-2">{user?.name}</Text>
                    <Text className="text-base text-secondary">Protecting plants with AI</Text>
                </View>

                {/* Stats Cards */}
                <View className="px-6 mb-8">
                    <View className="flex-row justify-between">
                        <StatsCard icon={<Leaf color="#00C896" size={24} />} title="Plants Scanned" value="24" />
                        <StatsCard icon={<Shield color="#00C896" size={24} />} title="Diseases Detected" value="8" />
                    </View>
                </View>

                {/* Settings */}
                <View className="px-6">
                    <Text className="text-lg font-semibold text-gray-900 mb-4">Settings</Text>

                    <SettingItem
                        icon={<Bell color="#8E8E93" size={24} />}
                        title="Notifications"
                        subtitle="Manage your alerts"
                        onPress={() => handleSettingPress("notifications")}
                    />

                    <SettingItem
                        icon={<MapPin color="#8E8E93" size={24} />}
                        title="Location Services"
                        subtitle="Enable GPS for better tracking"
                        onPress={() => handleSettingPress("location")}
                    />

                    <SettingItem
                        icon={<Shield color="#8E8E93" size={24} />}
                        title="Privacy & Security"
                        subtitle="Manage your data and privacy"
                        onPress={() => handleSettingPress("privacy")}
                    />

                    <SettingItem
                        icon={<Settings color="#8E8E93" size={24} />}
                        title="App Settings"
                        subtitle="Customize your experience"
                        onPress={() => handleSettingPress("app")}
                    />

                    <SettingItem
                        icon={<HelpCircle color="#8E8E93" size={24} />}
                        title="Help & Support"
                        subtitle="Get help and contact us"
                        onPress={() => handleSettingPress("help")}
                    />
                </View>

                {/* App Info */}
                <View className="px-6 py-8 mt-8 border-t border-gray-100">
                    <Text className="text-center text-sm text-secondary mb-2">PhytoVigil v1.0.0</Text>
                    <Text className="text-center text-xs text-secondary">AI-powered plant disease detection</Text>
                </View>
            </ScrollView>
        </View>
    )
}

function StatsCard({
    icon,
    title,
    value,
}: {
    icon: React.ReactNode
    title: string
    value: string
}) {
    return (
        <View className="bg-surface rounded-2xl p-4 flex-1 mx-1">
            <View className="flex-row items-center mb-2">
                {icon}
                <Text className="text-2xl font-bold text-gray-900 ml-2">{value}</Text>
            </View>
            <Text className="text-sm text-secondary">{title}</Text>
        </View>
    )
}

function SettingItem({
    icon,
    title,
    subtitle,
    onPress,
}: {
    icon: React.ReactNode
    title: string
    subtitle: string
    onPress: () => void
}) {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="flex-row items-center py-4 border-b border-gray-100 active:bg-surface"
        >
            <View className="mr-4">{icon}</View>
            <View className="flex-1">
                <Text className="text-base font-medium text-gray-900 mb-1">{title}</Text>
                <Text className="text-sm text-secondary">{subtitle}</Text>
            </View>
            <ChevronRight color="#8E8E93" size={20} />
        </TouchableOpacity>
    )
}
