import type React from "react"
import { View, Text } from "react-native"

interface ActivityStatsCardProps {
    icon: React.ReactNode
    title: string
    value: string | number
    subtitle?: string
    color?: string
}

export function ActivityStatsCard({ icon, title, value, subtitle, color = "#00C896" }: ActivityStatsCardProps) {
    return (
        <View className="bg-white rounded-2xl p-4 border border-gray-100 flex-1 mx-1">
            <View className="flex-row items-center justify-between mb-2">
                <View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: `${color}20` }}>
                    {icon}
                </View>
            </View>

            <Text className="text-2xl font-bold text-gray-900 mb-1">{value}</Text>
            <Text className="text-sm font-medium text-gray-900 mb-1">{title}</Text>

            {subtitle && <Text className="text-xs text-gray-500">{subtitle}</Text>}
        </View>
    )
}
