import type React from "react"
import { View, Text, TouchableOpacity } from "react-native"
import { MapPin, ChevronRight } from "lucide-react-native"
import type { WeatherData } from "@/services/remote/weatherService"
import { weatherService } from "@/services/remote/weatherService"
import { router } from "expo-router"

interface WeatherWidgetProps {
    weather: WeatherData
}

export function WeatherWidget({ weather }: WeatherWidgetProps) {
    const weatherIcon = weatherService.getWeatherIcon(weather.icon)
    const risk = weatherService.getWeatherRisk(weather)

    const getRiskColor = () => {
        switch (risk.level) {
            case "high":
                return "text-red-600"
            case "medium":
                return "text-yellow-600"
            case "low":
                return "text-green-600"
            default:
                return "text-gray-600"
        }
    }

    const handlePress = () => {
        router.push({
            pathname: "/weather/details",
            params: { weatherData: JSON.stringify(weather) }
        })
    }

    return (
        <View className="mb-4">
            <TouchableOpacity
                onPress={handlePress}
                className="bg-surface rounded-2xl p-4 flex-row items-center"
                activeOpacity={0.7}
            >
                {/* Weather Icon */}
                <View className="w-16 h-16 bg-gray-50 rounded-2xl items-center justify-center mr-4">
                    <Text className="text-3xl">{weatherIcon}</Text>
                </View>

                {/* Weather Info */}
                <View className="flex-1">
                    <View className="flex-row items-center mb-1">
                        <MapPin color="#8E8E93" size={14} />
                        <Text className="text-sm font-medium text-gray-900 ml-1">{weather.location}</Text>
                    </View>

                    <View className="flex-row items-center justify-between mb-2">
                        <Text className="text-2xl font-bold text-gray-900">{weather.temperature}°</Text>
                        {/* <Text className="text-sm text-gray-600 capitalize">{weather.description}</Text> */}
                    </View>

                    <View className="flex-row items-center justify-between">
                        <Text className="text-xs text-gray-500">
                            Humidity {weather.humidity}% • Wind {weather.windSpeed} m/s
                        </Text>
                        <Text className={`text-xs font-medium ${getRiskColor()}`}>
                            {risk.level} risk
                        </Text>
                    </View>
                </View>

                {/* Arrow at top right */}
                <View style={{ position: 'absolute', top: 12, right: 12 }}>
                    <ChevronRight color="#9CA3AF" size={20} />
                </View>
            </TouchableOpacity>
        </View>
    )
}