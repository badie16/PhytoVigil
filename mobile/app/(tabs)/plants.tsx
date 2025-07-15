"use client"

import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Leaf, Plus } from "lucide-react-native"

// Mock plants data
const mockPlants = [
    {
        id: "1",
        name: "Tomato Plant",
        type: "Vegetable",
        health: "Healthy",
        lastScanned: "2 days ago",
        image: "/placeholder.svg?height=100&width=100",
        status: "healthy" as const,
    },
    {
        id: "2",
        name: "Rose Bush",
        type: "Flower",
        health: "Needs Attention",
        lastScanned: "1 day ago",
        image: "/placeholder.svg?height=100&width=100",
        status: "warning" as const,
    },
    {
        id: "3",
        name: "Apple Tree",
        type: "Fruit",
        health: "Healthy",
        lastScanned: "3 days ago",
        image: "/placeholder.svg?height=100&width=100",
        status: "healthy" as const,
    },
]

export default function PlantsScreen() {
    const [plants] = useState(mockPlants)

    const handleAddPlant = () => {
        console.log("Add new plant")
    }

    const handlePlantPress = (id: string) => {
        console.log("View plant details:", id)
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="px-6 py-4">
                {/* Header */}
                <View className="flex-row items-center justify-between mb-6">
                    <View>
                        <Text className="text-2xl font-bold text-gray-900">My Plants</Text>
                        <Text className="text-base text-secondary">Track your plant collection</Text>
                    </View>
                    <TouchableOpacity
                        onPress={handleAddPlant}
                        className="w-12 h-12 bg-primary rounded-full items-center justify-center"
                    >
                        <Plus color="#FFFFFF" size={24} />
                    </TouchableOpacity>
                </View>

                {/* Stats */}
                <View className="flex-row justify-between mb-6">
                    <StatCard title="Total Plants" value={plants.length.toString()} color="#00C896" />
                    <StatCard title="Healthy" value="2" color="#00C896" />
                    <StatCard title="Need Care" value="1" color="#FF6B6B" />
                </View>
            </View>

            {/* Plants List */}
            <ScrollView className="flex-1 px-6">
                {plants.length > 0 ? (
                    plants.map((plant) => <PlantCard key={plant.id} {...plant} onPress={() => handlePlantPress(plant.id)} />)
                ) : (
                    <View className="items-center justify-center py-12">
                        <Leaf color="#8E8E93" size={48} />
                        <Text className="text-lg font-medium text-gray-900 mt-4 mb-2">No plants yet</Text>
                        <Text className="text-secondary text-center">Add your first plant to start tracking its health</Text>
                        <TouchableOpacity onPress={handleAddPlant} className="bg-primary rounded-xl px-6 py-3 mt-4">
                            <Text className="text-white font-semibold">Add Plant</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    )
}

function StatCard({ title, value, color }: { title: string; value: string; color: string }) {
    return (
        <View className="bg-surface rounded-2xl p-4 flex-1 mx-1">
            <Text className="text-2xl font-bold mb-1" style={{ color }}>
                {value}
            </Text>
            <Text className="text-sm text-secondary">{title}</Text>
        </View>
    )
}

function PlantCard({
    name,
    type,
    health,
    lastScanned,
    status,
    onPress,
}: {
    name: string
    type: string
    health: string
    lastScanned: string
    status: "healthy" | "warning" | "danger"
    onPress: () => void
}) {
    const getStatusColor = () => {
        switch (status) {
            case "healthy":
                return "#00C896"
            case "warning":
                return "#FFB347"
            case "danger":
                return "#FF6B6B"
            default:
                return "#8E8E93"
        }
    }

    return (
        <TouchableOpacity
            onPress={onPress}
            className="bg-white rounded-2xl p-4 mb-4 border border-gray-100"
            style={{
                elevation: 2,
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}
            activeOpacity={0.8}
        >
            <View className="flex-row items-center">
                <View
                    className="w-12 h-12 rounded-full items-center justify-center mr-4"
                    style={{ backgroundColor: `${getStatusColor()}20` }}
                >
                    <Leaf color={getStatusColor()} size={24} />
                </View>

                <View className="flex-1">
                    <Text className="text-lg font-semibold text-gray-900 mb-1">{name}</Text>
                    <Text className="text-sm text-secondary mb-2">{type}</Text>
                    <View className="flex-row items-center justify-between">
                        <Text className="text-sm font-medium" style={{ color: getStatusColor() }}>
                            {health}
                        </Text>
                        <Text className="text-xs text-secondary">Scanned {lastScanned}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}
