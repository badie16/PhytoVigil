import type React from "react"
import { View, Text } from "react-native"
import { useNotifications } from "@/hooks/useNotifications"

interface NotificationBadgeProps {
    children: React.ReactNode
    showBadge?: boolean
}

export default function NotificationBadge({ children, showBadge = true }: NotificationBadgeProps) {
    const { unreadCount } = useNotifications()

    return (
        <View className="relative">
            {children}
            {showBadge && unreadCount > 0 && (
                <View className="absolute -top-2 -right-2 bg-red-500 rounded-full min-w-[20px] h-5 items-center justify-center">
                    <Text className="text-white text-xs font-bold">{unreadCount > 99 ? "99+" : unreadCount}</Text>
                </View>
            )}
        </View>
    )
}
