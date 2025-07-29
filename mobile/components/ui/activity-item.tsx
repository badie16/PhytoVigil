import { DateUtils } from "@/lib/constant/dateUtils"
import { getActivityColor, getActivityIcon } from "@/lib/utils/activityUtils"
import type { Activity } from "@/services/remote/activityService"
import {
    Activity as ActivityIcon,
    Camera,
    Droplets,
    Edit3,
    Leaf,
    PlusCircle,
    Shield
} from "lucide-react-native"
import { Text, TouchableOpacity, View } from "react-native"

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
    function getActivitySubtitle(activity: any): string {
        const { type, metadata } = activity;

        switch (type) {
            case "scan":
                return `Scanned ${timeAgo}`;  // ex: "2 hours ago"
            case "plant_added":
                return `New plant "${activity.plant_name}" added`;
            case "disease_detected":
                return `Disease "${metadata?.disease_name}" detected`;
            case "treatment_applied":
                return `Treatment "${metadata?.treatment_name}" applied`;
            default:
                return "Activity logged";
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
            activeOpacity={onPress ? 0.7 : 1}
        >
            <View className="flex-row items-center py-3 border-b border-gray-100 last:border-b-0">
                <View className="w-10 h-10 bg-surface rounded-full items-center justify-center mr-3">
                    {renderIcon()}
                </View>
                <View className="flex-1">
                    <Text className="text-base font-medium text-gray-900">{activity.title}</Text>
                    <Text className="text-sm text-secondary">{getActivitySubtitle(activity)}</Text>
                </View>
                <Text className="text-xs text-secondary">{timeAgo}</Text>
            </View>
        </TouchableOpacity>
    )
}





                   