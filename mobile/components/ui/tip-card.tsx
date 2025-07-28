import { View, Text, TouchableOpacity } from "react-native"
import { ChevronRight, X, Lightbulb, Droplets, Camera, Sun, Shield } from "lucide-react-native"
import type { Tip } from "@/services/tipsService"

interface TipCardProps {
    tip: Tip
    onAction?: (tip: Tip) => void
    onDismiss?: (tipId: string) => void
}

const getCategoryIcon = (category: string) => {
    switch (category) {
        case 'watering':
            return <Droplets color="#4ECDC4" size={20} />;
        case 'disease':
            return <Shield color="#FF6B6B" size={20} />;
        case 'scanning':
            return <Camera color="#45B7D1" size={20} />;
        case 'care':
            return <Sun color="#FFA726" size={20} />;
        default:
            return <Lightbulb color="#00C896" size={20} />;
    }
};

export function TipCard({ tip, onAction, onDismiss }: TipCardProps) {
    const handlePress = () => {
        if (onAction) {
            onAction(tip)
        }
    }

    const handleDismiss = () => {
        if (onDismiss && tip.dismissible) {
            onDismiss(tip.id)
        }
    }

    const getIconBackgroundColor = () => {
        switch (tip.category) {
            case 'weather':
                return "bg-cyan-50";
            case 'disease':
                return "bg-red-50";
            case 'general':
                return "bg-blue-50";
            case 'plant':
                return "bg-orange-50";
            default:
                return "bg-green-50";
        }
    }

    return (
        <TouchableOpacity
            onPress={handlePress}
            className="bg-surface rounded-2xl p-4 mb-3 flex-row items-center"
            activeOpacity={0.7}
        >
            {/* Icon Circle */}
            <View className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${getIconBackgroundColor()}`}>
                {getCategoryIcon(tip.category)}
            </View>

            {/* Content */}
            <View className="flex-1">
                <View className="flex-row items-center justify-between mb-1">
                    <Text className="text-base font-semibold text-gray-900 flex-1" numberOfLines={1}>
                        {tip.title}
                    </Text>
                    <View className="flex-row items-center ml-2">
                        {tip.dismissible && onDismiss && (
                            <TouchableOpacity onPress={handleDismiss} className="p-1 mr-1">
                                <X color="#9CA3AF" size={16} />
                            </TouchableOpacity>
                        )}
                        {tip.action && <ChevronRight color="#9CA3AF" size={20} />}
                    </View>
                </View>

                <Text className="text-xs text-gray-500 mb-2 capitalize">
                    {tip.category}
                </Text>

                <Text className="text-sm text-gray-600 leading-5" numberOfLines={3}>
                    {tip.description}
                </Text>
            </View>
        </TouchableOpacity>
    )
}