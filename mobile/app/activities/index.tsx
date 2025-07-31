"use client"

import { ActivityItem } from "@/components/ui/activity-item"
import Header from "@/components/ui/header"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { useActivities } from "@/hooks/useActivities"
import type { Activity } from "@/services/remote/activityService"
import { useRouter } from "expo-router"
import { Calendar, Filter, Search, X } from "lucide-react-native"
import { useCallback, useState } from "react"
import { RefreshControl, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { ActivityDetailModal } from "@/components/ui/activity-detail-modal"

const ACTIVITY_TYPES = [
    { key: "all", label: "All Activities", color: "#6B7280" },
    { key: "scan", label: "Scans", color: "#00C896" },
    { key: "plant_added", label: "Plants Added", color: "#4ECDC4" },
    { key: "treatment", label: "Treatments", color: "#FF6B6B" },
    { key: "watering", label: "Watering", color: "#45B7D1" },
    { key: "fertilizing", label: "Fertilizing", color: "#FFB347" },
    { key: "note_added", label: "Notes", color: "#9CA3AF" },
]

const TIME_FILTERS = [
    { key: "all", label: "All Time" },
    { key: "today", label: "Today" },
    { key: "week", label: "This Week" },
    { key: "month", label: "This Month" },
]

export default function ActivitiesScreen() {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedType, setSelectedType] = useState("all")
    const [selectedTimeFilter, setSelectedTimeFilter] = useState("all")
    const [showFilters, setShowFilters] = useState(false)
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
    const [showDetailModal, setShowDetailModal] = useState(false)
    const { activities, loading, error, refreshActivities } = useActivities(50)


    const handleActivityPress = useCallback((activity: Activity) => {
        setSelectedActivity(activity)
        setShowDetailModal(true)
    }, [])

    const handleNavigateFromModal = useCallback(
        (activity: Activity) => {
            if (activity.type === "scan" && activity.scanId) {
                router.push(`/plants/scan/${activity.scanId}`)
            } else if (activity.plantId) {
                router.push(`/plants/${activity.plantId}`)
            }
        },
        [router],
    )

    const filteredActivities = activities.filter((activity) => {
        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            if (
                !activity.title.toLowerCase().includes(query) &&
                !activity.description.toLowerCase().includes(query) &&
                !activity.plantName?.toLowerCase().includes(query)
            ) {
                return false
            }
        }

        // Filter by type
        if (selectedType !== "all" && activity.type !== selectedType) {
            return false
        }

        // Filter by time
        if (selectedTimeFilter !== "all") {
            const activityDate = new Date(activity.created_at)
            const now = new Date()

            switch (selectedTimeFilter) {
                case "today":
                    return activityDate.toDateString() === now.toDateString()
                case "week":
                    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
                    return activityDate >= weekAgo
                case "month":
                    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
                    return activityDate >= monthAgo
                default:
                    return true
            }
        }

        return true
    })

    const groupedActivities = groupActivitiesByDate(filteredActivities)

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <Header onBack={() => router.back()} title="Activities" >
                <TouchableOpacity onPress={() => setShowFilters(!showFilters)}>
                    <Filter color={showFilters ? "#00C896" : "#6B7280"} size={24} />
                </TouchableOpacity>
            </Header>
            <View className="px-6 mt-6 pb-4 bg-white border-b border-gray-100">
                {/* Search Bar */}
                <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-2 mb-4">
                    <Search color="#9CA3AF" size={20} />
                    <TextInput
                        className="flex-1 ml-3 text-base text-gray-900"
                        placeholder="Search activities..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor="#9CA3AF"
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery("")}>
                            <X color="#9CA3AF" size={20} />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Filters */}
                {showFilters && (
                    <View className="gap-y-4">
                        {/* Activity Type Filter */}
                        <View>
                            <Text className="text-sm font-medium text-gray-700 mb-2">Activity Type</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                                {ACTIVITY_TYPES.map((type) => (
                                    <TouchableOpacity
                                        key={type.key}
                                        onPress={() => setSelectedType(type.key)}
                                        className={`mr-3 px-4 py-2 rounded-full border ${selectedType === type.key ? "bg-green-50 border-green-200" : "bg-white border-gray-200"
                                            }`}
                                    >
                                        <Text
                                            className={`text-sm font-medium ${selectedType === type.key ? "text-green-700" : "text-gray-600"
                                                }`}
                                        >
                                            {type.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        {/* Time Filter */}
                        <View>
                            <Text className="text-sm font-medium text-gray-700 mb-2">Time Period</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                                {TIME_FILTERS.map((filter) => (
                                    <TouchableOpacity
                                        key={filter.key}
                                        onPress={() => setSelectedTimeFilter(filter.key)}
                                        className={`mr-3 px-4 py-2 rounded-full border ${selectedTimeFilter === filter.key ? "bg-green-50 border-green-200" : "bg-white border-gray-200"
                                            }`}
                                    >
                                        <Text
                                            className={`text-sm font-medium ${selectedTimeFilter === filter.key ? "text-green-700" : "text-gray-600"
                                                }`}
                                        >
                                            {filter.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                )}

                {/* Results Count */}
                <View className="flex-row items-center justify-between mt-4">
                    <Text className="text-sm text-gray-500">
                        {filteredActivities.length} {filteredActivities.length === 1 ? "activity" : "activities"}
                    </Text>
                    {(searchQuery || selectedType !== "all" || selectedTimeFilter !== "all") && (
                        <TouchableOpacity
                            onPress={() => {
                                setSearchQuery("")
                                setSelectedType("all")
                                setSelectedTimeFilter("all")
                            }}
                            className="px-3 py-1 bg-gray-100 rounded-full"
                        >
                            <Text className="text-xs text-gray-600">Clear Filters</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Activities List */}
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                refreshControl={
                    activities.length > 0 ? (
                        <RefreshControl
                            refreshing={loading}
                            onRefresh={refreshActivities}
                            tintColor="#00C896"
                        />
                    ) : undefined
                }
            >
                {loading && activities.length === 0 ? (
                    <View className="flex-1 items-center justify-center py-20">
                        <LoadingSpinner message="" />
                    </View>
                ) : error ? (
                    <View className="flex-1 items-center justify-center py-20">
                        <Text className="text-red-500 text-base mb-4">Error loading activities</Text>
                        <TouchableOpacity onPress={refreshActivities} className="px-4 py-2 bg-green-600 rounded-lg">
                            <Text className="text-white font-medium">Retry</Text>
                        </TouchableOpacity>
                    </View>
                ) : filteredActivities.length === 0 ? (
                    <View className="flex-1 items-center justify-center py-20">
                        <Text className="text-gray-500 text-base mb-2">No activities found</Text>
                        <Text className="text-gray-400 text-sm text-center px-8">
                            {searchQuery || selectedType !== "all" || selectedTimeFilter !== "all"
                                ? "Try adjusting your filters or search query"
                                : "Start scanning plants to see your activity history"}
                        </Text>
                    </View>
                ) : (
                    <View className="px-6 py-4">
                        {Object.entries(groupedActivities).map(([date, dayActivities]) => (
                            <View key={date} className="mb-6">
                                <View className="flex-row items-center mb-3">
                                    <Calendar color="#9CA3AF" size={16} />
                                    <Text className="text-sm font-medium text-gray-600 ml-2">{date}</Text>
                                    <View className="flex-1 h-px bg-gray-200 ml-3" />
                                </View>

                                <View className="bg-white">
                                    {dayActivities.map((activity, index) => (
                                        <View key={activity.id}>
                                            <ActivityItem activity={activity} onPress={handleActivityPress} showChevron={true} />
                                            {index < dayActivities.length - 1 && <View className="h-px bg-gray-100 ml-13" />}
                                        </View>
                                    ))}
                                </View>
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>
            {/* Activity Detail Modal */}
            <ActivityDetailModal
                activity={selectedActivity}
                visible={showDetailModal}
                onClose={() => {
                    setShowDetailModal(false)
                    setSelectedActivity(null)
                }}
                onNavigate={handleNavigateFromModal}
            />
        </SafeAreaView>
    )
}

function groupActivitiesByDate(activities: Activity[]): Record<string, Activity[]> {
    const grouped: Record<string, Activity[]> = {}

    activities.forEach((activity) => {
        const date = new Date(activity.created_at)
        const today = new Date()
        const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)

        let dateKey: string

        if (date.toDateString() === today.toDateString()) {
            dateKey = "Today"
        } else if (date.toDateString() === yesterday.toDateString()) {
            dateKey = "Yesterday"
        } else {
            dateKey = date.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            })
        }

        if (!grouped[dateKey]) {
            grouped[dateKey] = []
        }

        grouped[dateKey].push(activity)
    })

    // Sort activities within each day by timestamp (newest first)
    Object.keys(grouped).forEach((date) => {
        grouped[date].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    })

    return grouped
}
