import React from "react"
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import {
    Camera,
    Leaf,
    TrendingUp,
    Shield,
    Bell,
    ChevronRight,
    Sun,
    Droplets,
    AlertTriangle,
    CheckCircle
} from "lucide-react-native"

export default function HomeScreen() {
    const handleQuickAction = (action: string) => {
        console.log("Quick action:", action)
    }

    const handleTipPress = (tip: string) => {
        console.log("Tip pressed:", tip)
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="px-6 pt-4 pb-6">
                    <View className="flex-row items-center justify-between mb-6">
                        <View>
                            <Text className="text-2xl font-bold text-gray-900">Good morning! 🌱</Text>
                            <Text className="text-base text-secondary mt-1">Let's check your plants today</Text>
                        </View>
                        <TouchableOpacity className="w-10 h-10 bg-surface rounded-full items-center justify-center">
                            <Bell color="#8E8E93" size={20} />
                        </TouchableOpacity>
                    </View>

                    {/* Stats Cards */}
                    <View className="flex-row justify-between mb-6">
                        <StatsCard
                            icon={<Leaf color="#00C896" size={24} />}
                            title="Plants Scanned"
                            value="24"
                            subtitle="+3 this week"
                            trend="up"
                        />
                        <StatsCard
                            icon={<Shield color="#FF6B6B" size={24} />}
                            title="Issues Found"
                            value="3"
                            subtitle="2 resolved"
                            trend="down"
                        />
                    </View>
                </View>

                {/* Quick Actions */}
                <View className="px-6 mb-8">
                    <Text className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</Text>
                    <View className="flex-row justify-between">
                        <QuickActionCard
                            icon={<Camera color="#FFFFFF" size={24} />}
                            title="Scan Plant"
                            subtitle="Detect diseases"
                            backgroundColor="#00C896"
                            onPress={() => handleQuickAction("scan")}
                        />
                        <QuickActionCard
                            icon={<Leaf color="#FFFFFF" size={24} />}
                            title="Add Plant"
                            subtitle="Track health"
                            backgroundColor="#4ECDC4"
                            onPress={() => handleQuickAction("add")}
                        />
                        <QuickActionCard
                            icon={<TrendingUp color="#FFFFFF" size={24} />}
                            title="View Report"
                            subtitle="See progress"
                            backgroundColor="#45B7D1"
                            onPress={() => handleQuickAction("report")}
                        />
                    </View>
                </View>

                {/* Recent Activity */}
                <View className="px-6 mb-8">
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-lg font-semibold text-gray-900">Recent Activity</Text>
                        <TouchableOpacity>
                            <Text className="text-primary font-medium">View All</Text>
                        </TouchableOpacity>
                    </View>

                    <ActivityItem
                        icon={<CheckCircle color="#00C896" size={20} />}
                        title="Tomato Plant - Healthy"
                        subtitle="Scanned 2 hours ago"
                        time="2h"
                    />
                    <ActivityItem
                        icon={<AlertTriangle color="#FF6B6B" size={20} />}
                        title="Rose Bush - Late Blight"
                        subtitle="Treatment recommended"
                        time="1d"
                    />
                    <ActivityItem
                        icon={<Droplets color="#4ECDC4" size={20} />}
                        title="Watering reminder sent"
                        subtitle="For 3 plants"
                        time="2d"
                    />
                </View>

                {/* Today's Tips */}
                <View className="px-6 mb-8">
                    <Text className="text-lg font-semibold text-gray-900 mb-4">Today's Tips</Text>
                    <TipCard
                        icon={<Sun color="#FFB347" size={24} />}
                        title="Perfect Weather for Scanning"
                        description="Natural lighting is ideal for accurate plant disease detection. Take photos outdoors when possible."
                        onPress={() => handleTipPress("weather")}
                    />
                </View>

                {/* Plant Health Overview */}
                <View className="px-6 mb-8">
                    <Text className="text-lg font-semibold text-gray-900 mb-4">Plant Health Overview</Text>
                    <View className="bg-surface rounded-2xl p-4">
                        <View className="flex-row items-center justify-between mb-3">
                            <Text className="text-base font-medium text-gray-900">Overall Health Score</Text>
                            <Text className="text-2xl font-bold text-primary">87%</Text>
                        </View>
                        <View className="w-full bg-gray-200 rounded-full h-3 mb-3">
                            <View className="bg-primary h-3 rounded-full" style={{ width: '87%' }} />
                        </View>
                        <Text className="text-sm text-secondary">
                            Great job! Your plants are mostly healthy. Keep monitoring regularly.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

function StatsCard({
    icon,
    title,
    value,
    subtitle,
    trend
}: {
    icon: React.ReactNode
    title: string
    value: string
    subtitle: string
    trend: 'up' | 'down'
}) {
    return (
        <View className="bg-surface rounded-2xl p-4 flex-1 mx-1">
            <View className="flex-row items-center justify-between mb-2">
                {icon}
                <TrendingUp
                    color={trend === 'up' ? '#00C896' : '#FF6B6B'}
                    size={16}
                    style={{ transform: [{ rotate: trend === 'down' ? '180deg' : '0deg' }] }}
                />
            </View>
            <Text className="text-2xl font-bold text-gray-900 mb-1">{value}</Text>
            <Text className="text-xs font-medium text-gray-900 mb-1">{title}</Text>
            <Text className="text-xs text-secondary">{subtitle}</Text>
        </View>
    )
}

function QuickActionCard({
    icon,
    title,
    subtitle,
    backgroundColor,
    onPress
}: {
    icon: React.ReactNode
    title: string
    subtitle: string
    backgroundColor: string
    onPress: () => void
}) {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="flex-1 mx-1 rounded-2xl p-4 items-center"
            style={{ backgroundColor }}
            activeOpacity={0.8}
        >
            <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center mb-3">
                {icon}
            </View>
            <Text className="text-white font-semibold text-sm mb-1">{title}</Text>
            <Text className="text-white/80 text-xs text-center">{subtitle}</Text>
        </TouchableOpacity>
    )
}

function ActivityItem({
    icon,
    title,
    subtitle,
    time
}: {
    icon: React.ReactNode
    title: string
    subtitle: string
    time: string
}) {
    return (
        <View className="flex-row items-center py-3 border-b border-gray-100 last:border-b-0">
            <View className="w-10 h-10 bg-surface rounded-full items-center justify-center mr-3">
                {icon}
            </View>
            <View className="flex-1">
                <Text className="text-base font-medium text-gray-900">{title}</Text>
                <Text className="text-sm text-secondary">{subtitle}</Text>
            </View>
            <Text className="text-xs text-secondary">{time}</Text>
        </View>
    )
}

function TipCard({
    icon,
    title,
    description,
    onPress
}: {
    icon: React.ReactNode
    title: string
    description: string
    onPress: () => void
}) {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-4 flex-row items-start"
            activeOpacity={0.8}
        >
            <View className="w-12 h-12 bg-primary/20 rounded-full items-center justify-center mr-4">
                {icon}
            </View>
            <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900 mb-2">{title}</Text>
                <Text className="text-sm text-secondary leading-5">{description}</Text>
            </View>
            <ChevronRight color="#8E8E93" size={20} />
        </TouchableOpacity>
    )
}
