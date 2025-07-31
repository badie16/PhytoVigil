import { useState } from "react"
import { View, Text, Modal, TouchableOpacity, ScrollView, Image } from "react-native"
import {
    X,
    Calendar,
    Clock,
    MapPin,
    Camera,
    Leaf,
    Shield,
    Droplets,
    Edit3,
    PlusCircle,
    Activity as ActivityIcon,
    ChevronRight,
    ExternalLink,
} from "lucide-react-native"
import type { Activity } from "@/services/remote/activityService"
import { getActivityIcon, getActivityColor } from "@/lib/utils/activityUtils"
import { DateUtils } from "@/lib/utils/dateUtils"

interface ActivityDetailModalProps {
    activity: Activity | null
    visible: boolean
    onClose: () => void
    onNavigate?: (activity: Activity) => void
}

export function ActivityDetailModal({ activity, visible, onClose, onNavigate }: ActivityDetailModalProps) {
    if (!activity) return null

    const iconName = getActivityIcon(activity.type)
    const iconColor = getActivityColor(activity.status)
    const timeAgo = DateUtils.formatDateFlexible(activity.created_at)

    const renderIcon = () => {
        const iconProps = { color: iconColor, size: 24 }

        switch (iconName) {
            case "camera":
                return <Camera {...iconProps} />
            case "plus-circle":
                return <PlusCircle {...iconProps} />
            case "shield":
                return <Shield {...iconProps} />
            case "droplets":
                return <Droplets {...iconProps} />
            case "leaf":
                return <Leaf {...iconProps} />
            case "edit-3":
                return <Edit3 {...iconProps} />
            default:
                return <ActivityIcon {...iconProps} />
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "success":
                return "text-green-600 bg-green-50"
            case "warning":
                return "text-yellow-600 bg-yellow-50"
            case "error":
                return "text-red-600 bg-red-50"
            default:
                return "text-gray-600 bg-gray-50"
        }
    }

    const formatDate = (created_at: string) => {
        const date = new Date(created_at)
        return date.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    const formatTime = (created_at: string) => {
        const date = new Date(created_at)
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const handleNavigate = () => {
        if (onNavigate) {
            onNavigate(activity)
            onClose()
        }
    }

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
            <View className="flex-1 bg-white">
                {/* Header */}
                <View className="px-6 pt-4 pb-4 border-b border-gray-100">
                    <View className="flex-row items-center justify-between">
                        <Text className="text-lg font-bold text-gray-900">Activity Details</Text>
                        <TouchableOpacity onPress={onClose} className="p-2 -mr-2">
                            <X color="#6B7280" size={24} />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    <View className="p-6">
                        {/* Activity Header */}
                        <View className="flex-row items-start mb-6">
                            <View className="w-12 h-12 bg-gray-50 rounded-full items-center justify-center mr-4">
                                {renderIcon()}
                            </View>
                            <View className="flex-1">
                                <Text className="text-xl font-bold text-gray-900 mb-2">{activity.title}</Text>
                                <Text className="text-base text-gray-600 leading-6">{activity.description}</Text>
                            </View>
                        </View>

                        {/* Status Badge */}
                        <View className="flex-row items-center mb-6">
                            {activity.status ? (
                                <View className={`px-3 py-1 rounded-full ${getStatusColor(activity.status)}`}>
                                    <Text className={`text-sm font-medium ${getStatusColor(activity.status).split(" ")[0]}`}>
                                        {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                                    </Text>
                                </View>
                            ) : null}
                        </View>

                        {/* Date & Time */}
                        <View className="bg-gray-50 rounded-2xl p-4 mb-6">
                            <Text className="text-sm font-medium text-gray-700 mb-3">Date & Time</Text>
                            <View className="flex-row items-center mb-2">
                                <Calendar color="#6B7280" size={16} />
                                <Text className="text-base text-gray-900 ml-3">{formatDate(activity.created_at)}</Text>
                            </View>
                            <View className="flex-row items-center">
                                <Clock color="#6B7280" size={16} />
                                <Text className="text-base text-gray-900 ml-3">{formatTime(activity.created_at)}</Text>
                                <Text className="text-sm text-gray-500 ml-2">({timeAgo})</Text>
                            </View>
                        </View>

                        {/* Plant Information */}
                        {activity.plantName && (
                            <View className="bg-green-50 rounded-2xl p-4 mb-6">
                                <Text className="text-sm font-medium text-gray-700 mb-3">Plant Information</Text>
                                <View className="flex-row items-center justify-between">
                                    <View className="flex-1">
                                        <Text className="text-base font-medium text-gray-900 mb-1">{activity.plantName}</Text>
                                        {activity.meta_data?.plantType && (
                                            <Text className="text-sm text-gray-600">{activity.meta_data.plantType}</Text>
                                        )}
                                    </View>
                                    {onNavigate && (
                                        <TouchableOpacity
                                            onPress={handleNavigate}
                                            className="flex-row items-center px-3 py-2 bg-white rounded-lg border border-green-200"
                                        >
                                            <Text className="text-sm font-medium text-green-700 mr-1">View Plant</Text>
                                            <ExternalLink color="#059669" size={14} />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        )}

                        {/* Scan Results */}
                        {activity.type === "scan" && activity.meta_data?.scanResult && (
                            <View className="bg-blue-50 rounded-2xl p-4 mb-6">
                                <Text className="text-sm font-medium text-gray-700 mb-3">Scan Results</Text>
                                <View className="space-y-2">
                                    <View className="flex-row items-center justify-between">
                                        <Text className="text-sm text-gray-600">Result</Text>
                                        <Text className="text-sm font-medium text-gray-900">
                                            {activity.meta_data.scanResult.result || "Unknown"}
                                        </Text>
                                    </View>
                                    {activity.meta_data.scanResult.confidence && (
                                        <View className="flex-row items-center justify-between">
                                            <Text className="text-sm text-gray-600">Confidence</Text>
                                            <Text className="text-sm font-medium text-gray-900">
                                                {Math.round(activity.meta_data.scanResult.confidence * 100)}%
                                            </Text>
                                        </View>
                                    )}
                                    {activity.meta_data.scanResult.diseases && activity.meta_data.scanResult.diseases.length > 0 && (
                                        <View>
                                            <Text className="text-sm text-gray-600 mb-2">Diseases Detected</Text>
                                            {activity.meta_data.scanResult.diseases.map((disease: any, index: number) => (
                                                <View key={index} className="flex-row items-center justify-between py-1">
                                                    <Text className="text-sm text-gray-900">{disease.name}</Text>
                                                    <Text className="text-sm text-gray-600">{Math.round(disease.confidence * 100)}%</Text>
                                                </View>
                                            ))}
                                        </View>
                                    )}
                                </View>
                            </View>
                        )}

                        {/* Location */}
                        {activity.meta_data?.location && (
                            <View className="bg-gray-50 rounded-2xl p-4 mb-6">
                                <Text className="text-sm font-medium text-gray-700 mb-3">Location</Text>
                                <View className="flex-row items-center">
                                    <MapPin color="#6B7280" size={16} />
                                    {/* <Text className="text-base text-gray-900 ml-3">
                                        {activity.meta_data.location.address ||
                                            `${activity.meta_data.location.latitude?.toFixed(6)}, ${activity.meta_data.location.longitude?.toFixed(6)}`}
                                    </Text> */}
                                </View>
                            </View>
                        )}

                        {/* Additional meta_data */}
                        {activity.meta_data && Object.keys(activity.meta_data).length > 0 && (
                            <View className="bg-gray-50 rounded-2xl p-4 mb-6">
                                <Text className="text-sm font-medium text-gray-700 mb-3">Additional Information</Text>
                                <View className="space-y-2">
                                    {Object.entries(activity.meta_data).map(([key, value]) => {
                                        if (key === "scanResult" || key === "location") return null
                                        return (
                                            <View key={key} className="flex-row items-center justify-between">
                                                <Text className="text-sm text-gray-600 capitalize">
                                                    {key.replace(/([A-Z])/g, " $1").trim()}
                                                </Text>
                                                <Text className="text-sm font-medium text-gray-900 flex-1 text-right">
                                                    {typeof value === "object" ? JSON.stringify(value) : String(value)}
                                                </Text>
                                            </View>
                                        )
                                    })}
                                </View>
                            </View>
                        )}

                        {/* Action Buttons */}
                        <View className="space-y-3">
                            {onNavigate && (activity.plantId || activity.scanId) && (
                                <TouchableOpacity
                                    onPress={handleNavigate}
                                    className="flex-row items-center justify-center py-4 bg-green-600 rounded-2xl"
                                >
                                    <Text className="text-white font-semibold text-base mr-2">
                                        {activity.type === "scan" ? "View Scan Details" : "View Plant"}
                                    </Text>
                                    <ChevronRight color="white" size={20} />
                                </TouchableOpacity>
                            )}

                            <TouchableOpacity
                                onPress={onClose}
                                className="flex-row items-center justify-center py-4 bg-gray-100 rounded-2xl"
                            >
                                <Text className="text-gray-700 font-semibold text-base">Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </Modal>
    )
}
