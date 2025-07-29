import { TouchableOpacity, Text } from "react-native"

interface ActivityFilterChipProps {
    label: string
    isSelected: boolean
    onPress: () => void
    color?: string
}

export function ActivityFilterChip({ label, isSelected, onPress, color = "#00C896" }: ActivityFilterChipProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            className={`mr-3 px-4 py-2 rounded-full border ${isSelected ? "border-green-200" : "border-gray-200"}`}
            style={{
                backgroundColor: isSelected ? `${color}10` : "white",
            }}
        >
            <Text className={`text-sm font-medium ${isSelected ? "text-green-700" : "text-gray-600"}`}>{label}</Text>
        </TouchableOpacity>
    )
}
