import { View, Text, TouchableOpacity } from "react-native"
import {
    Camera,
    PlusCircle,
    Shield,
    Droplets,
    Leaf,
    Edit3,
    Activity as ActivityIcon,
    ChevronRight,
} from "lucide-react-native"
import type { Activity } from "@/services/remote/activityService"
import { getActivityIcon, getActivityColor } from "@/lib/utils/activityUtils"
import { DateUtils } from "@/lib/constant/dateUtils"

interface ActivityItemProps {
    activity: Activity
    onPress?: (activity: Activity) => void
    showChevron?: boolean
}

export function ActivityItem({ activity, onPress, showChevron = false }: ActivityItemProps) {
    const iconName = getActivityIcon(activity.type)
    const iconColor = getActivityColor(activity.status)
    const timeAgo = DateUtils.formatDateFlexible(activity.timestamp)

    const renderIcon = () => {
        const iconProps = { color: iconColor, size: 20 }

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

    const handlePress = () => {
        if (onPress) {
            onPress(activity)
        }
    }

    return (
        <TouchableOpacity
            onPress={handlePress}
            disabled={!onPress}
            className="flex-row items-center py-3 border-b border-gray-100"
            activeOpacity={onPress ? 0.7 : 1}
        >
            <View className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center mr-3">{renderIcon()}</View>

            <View className="flex-1">
                <Text className="text-base font-medium text-gray-900 mb-1">{activity.title}</Text>
                <Text className="text-sm text-gray-500">{activity.description}</Text>
            </View>

            <View className="items-end">
                <Text className="text-xs text-gray-400 mb-1">{timeAgo}</Text>
                {showChevron && <ChevronRight color="#9CA3AF" size={16} />}
            </View>
        </TouchableOpacity>
    )
}
