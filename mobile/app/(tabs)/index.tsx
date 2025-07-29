import {
    Bell,
    Camera,
    Leaf,
    Shield,
    TrendingDown,
    TrendingUp
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";


import { ActivityItem } from "@/components/ui/activity-item";
import { TipCard } from "@/components/ui/tip-card";
import { WeatherWidget } from "@/components/ui/weather-widget";
import { useAuth } from '@/contexts/auth-context';
import { useActivities } from "@/hooks/useActivities";
import { useTips } from "@/hooks/useTips";
import { PlantUtils } from "@/lib/utils/plantUtils";
import plantService from "@/services/remote/plantService";
import statsService from '@/services/remote/statsService';
import type { Plant, ScanStats } from '@/types';
import { router } from 'expo-router';

export default function HomeScreen() {
    const { user, isLoading, logout } = useAuth();
    const [scanStats, setScanStats] = useState<ScanStats | null>(null);
    const [plants, setPlants] = useState<Plant[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [overallHealthScore, setOverallHealthScore] = useState(Number)
    const [plantsScannedThisWeek, setPlantsScannedThisWeek] = useState<number>(0);
    const { tips, weather, refreshTips, dismissTip, executeTipAction } = useTips()
    const { activities, loading: activitiesLoading, refreshActivities } = useActivities(5)
    useEffect(() => {
        setPlantsScannedThisWeek(PlantUtils.getPlantsScannedThisWeek(plants));
    }, [plants]);
    useEffect(() => {
        if (!user && !isLoading) {
            router.replace("/auth/login");
        } else if (user) {
            setLoading(true);
            try {
                const fetch = async () => {
                    const data = await plantService.getUserPlants();
                    const stats = await statsService.getGlobalScanStats();
                    setPlants(data);
                    setScanStats(stats);
                    PlantUtils.getPlantsScannedThisWeek(plants)
                };
                fetch()
            } catch (err: any) {
                console.log(err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
            if (scanStats) {
                const score = scanStats.total_scans > 0 ? Math.round((scanStats.healthy_scans / scanStats.total_scans) * 100) : 0;
                setOverallHealthScore(score);
            } else {
                setOverallHealthScore(0);
            }
        }
    }, [user, isLoading]);




    const handleQuickAction = (action: string) => {
        switch (action) {
            case "scan":
                router.push("/(tabs)/scanner")
                break
            case "add":
                router.push("/plants/add")
                break
            case "report":
                router.push("/(tabs)/plants")
                break
            default:
                console.log("Quick action:", action)
        }
    }

    const handleTipAction = async (tip: any) => {
        await executeTipAction(tip)

        // Navigation spécifique selon l'action
        if (tip.action?.type === "scan") {
            router.push("/(tabs)/scanner")
        } else if (tip.action?.type === "navigate") {
            const screen = tip.action.data?.screen
            switch (screen) {
                case "add-plant":
                    router.push("/plants/add")
                    break
                case "plants":
                    router.push("/(tabs)/plants")
                    break
                default:
                    console.log("Navigate to:", screen)
            }
        }
    }

    const onRefresh = async () => {
        await Promise.all([refreshTips()])
    }

    const handleActivityPress = (activity: any) => {
        if (activity.type === "scan" && activity.scanId) {
            router.push(`/plants/scan/${activity.scanId}`)
        } else if (activity.plantId) {
            router.push(`/plants/${activity.plantId}`)
        }
    }

    return (
        <View className="flex-1 bg-white pt-2">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="px-6 pb-6">
                    <View className="flex-row items-center justify-between mb-6">
                        <View>
                            <Text className="text-2xl font-bold text-gray-900">Good morning! 🌱</Text>
                            <Text className="text-base text-secondary mt-1">Let's check your plants today</Text>
                        </View>
                        <TouchableOpacity className="w-10 h-10 bg-surface rounded-full items-center justify-center">
                            <Bell color="#8E8E93" size={20} />
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row justify-between mb-4">
                        {/* Stats Cards */}
                        <StatsCard
                            icon={<Leaf color="#00C896" size={24} />}
                            title="Plants Scanned"
                            value={scanStats?.total_plantScaned?.toString() ?? '0'}
                            subtitle={scanStats ? `+${plantsScannedThisWeek} this week` : ''}
                            trend={plantsScannedThisWeek > 0 ? "up" : "down"}
                        />
                        <StatsCard
                            icon={<Shield color="#FF6B6B" size={24} />}
                            title="Issues Found"
                            value={scanStats?.diseased_scans?.toString() ?? '0'}
                            subtitle={scanStats ? `${scanStats.healthy_scans} healthy` : ''}
                            trend={scanStats && scanStats.diseased_scans > 0 ? "up" : "down"}
                        />
                    </View>
                    {/* Weather Widget */}
                    {weather && <WeatherWidget weather={weather} />}
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
                    {activitiesLoading ? (
                        <View className="bg-gray-50 rounded-2xl p-6 items-center">
                            <Text className="text-gray-500">Loading activities...</Text>
                        </View>
                    ) : activities.length > 0 ? (
                        <View>
                            {activities.map((activity, index) => (
                                <View key={activity.id}>
                                    <ActivityItem activity={activity} onPress={handleActivityPress} showChevron={true} />
                                    {index < activities.length - 1 && <View className="h-px bg-gray-100 ml-13" />}
                                </View>
                            ))}
                        </View>
                    ) : (
                        <View className="bg-gray-50 rounded-2xl p-6 items-center">
                            <Text className="text-gray-500">No recent activity</Text>
                            <Text className="text-xs text-gray-400 mt-1">Start scanning plants to see activity</Text>
                        </View>
                    )}
                </View>

                {/* Today's Tips */}
                <View className="px-6 mb-8">
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-lg font-semibold text-gray-900">Today's Tips</Text>
                        <TouchableOpacity onPress={refreshTips}>
                            <Text className="text-primary font-medium">Refresh</Text>
                        </TouchableOpacity>
                    </View>

                    {loading ? (
                        <View className="bg-gray-50 rounded-2xl p-6 items-center">
                            <Text className="text-gray-500">Loading personalized tips...</Text>
                        </View>
                    ) : tips.length > 0 ? (
                        tips.map((tip) => <TipCard key={tip.id} tip={tip} onAction={handleTipAction} onDismiss={dismissTip} />)
                    ) : (
                        <View className="bg-gray-50 rounded-2xl p-6 items-center">
                            <Text className="text-gray-500">No tips available right now</Text>
                            <Text className="text-xs text-gray-400 mt-1">Pull to refresh</Text>
                        </View>
                    )}
                </View>

                {/* Plant Health Overview */}
                <View className="px-6 mb-8">
                    <Text className="text-lg font-semibold text-gray-900 mb-4">Plant Health Overview</Text>
                    <View className="bg-surface rounded-2xl p-4">
                        <View className="flex-row items-center justify-between mb-3">
                            <Text className="text-base font-medium text-gray-900">Overall Health Score</Text>
                            <Text className="text-2xl font-bold text-primary">
                                {overallHealthScore}
                            </Text>
                        </View>
                        <View className="w-full bg-gray-200 rounded-full h-3 mb-3">
                            <View className="bg-primary h-3 rounded-full" style={{
                                width: overallHealthScore + '%'
                            }} />
                        </View>
                        <Text className="text-sm text-secondary">
                            {getHealthMessage(overallHealthScore)}
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
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
                {trend === 'up' ? (
                    <TrendingUp color="#00C896" size={16} />
                ) : (
                    <TrendingDown color="#FF6B6B" size={16} />
                )}
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

// function ActivityItem({
//     icon,
//     title,
//     subtitle,
//     time
// }: {
//     icon: React.ReactNode
//     title: string
//     subtitle: string
//     time: string
// }) {
//     return (
//         <View className="flex-row items-center py-3 border-b border-gray-100 last:border-b-0">
//             <View className="w-10 h-10 bg-surface rounded-full items-center justify-center mr-3">
//                 {icon}
//             </View>
//             <View className="flex-1">
//                 <Text className="text-base font-medium text-gray-900">{title}</Text>
//                 <Text className="text-sm text-secondary">{subtitle}</Text>
//             </View>
//             <Text className="text-xs text-secondary">{time}</Text>
//         </View>
//     )
// }

function getHealthMessage(score: number): string {
    if (score >= 90) return "🌿 Excellent ! Vos plantes sont en excellente santé. Continuez ainsi !";
    if (score >= 75) return "✅ Bon travail ! La majorité de vos plantes sont saines. Restez vigilant.";
    if (score >= 50) return "⚠️ Attention ! Plusieurs plantes sont malades. Pensez à les traiter.";
    if (score >= 25) return "🧪 État critique. La moitié de vos plantes ou plus sont malades. Agissez vite.";
    return "🚨 Urgent ! La plupart de vos plantes sont en mauvais état. Consultez les recommandations.";
}
