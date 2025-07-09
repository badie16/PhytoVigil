"use client"

import { useState } from "react"
import { View, Text, ScrollView, TextInput } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Search, Filter } from "lucide-react-native"
import HistoryItem from "@/components/ui/history-item"

// Mock data for demonstration
const mockHistory = [
    {
        id: "1",
        plantName: "Tomato Plant",
        diseaseName: "Late Blight",
        confidence: 92,
        date: "2024-01-15",
        image: "/placeholder.svg?height=100&width=100",
        location: "Garden A",
    },
    {
        id: "2",
        plantName: "Rose Bush",
        diseaseName: "Black Spot",
        confidence: 87,
        date: "2024-01-14",
        image: "/placeholder.svg?height=100&width=100",
        location: "Front Yard",
    },
    {
        id: "3",
        plantName: "Apple Tree",
        diseaseName: "Healthy Plant",
        confidence: 95,
        date: "2024-01-13",
        image: "/placeholder.svg?height=100&width=100",
        location: "Orchard",
    },
]

export default function HistoryScreen() {
    const [searchQuery, setSearchQuery] = useState("")
    const [filteredHistory, setFilteredHistory] = useState(mockHistory)

    const handleSearch = (query: string) => {
        setSearchQuery(query)
        if (query.trim() === "") {
            setFilteredHistory(mockHistory)
        } else {
            const filtered = mockHistory.filter(
                (item) =>
                    item.plantName.toLowerCase().includes(query.toLowerCase()) ||
                    item.diseaseName.toLowerCase().includes(query.toLowerCase()),
            )
            setFilteredHistory(filtered)
        }
    }

    const handleItemPress = (id: string) => {
        // TODO: Navigate to result detail screen
        console.log("Navigate to result:", id)
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="px-6 py-4">
                {/* Search Bar */}
                <View className="flex-row items-center bg-surface rounded-xl px-4 py-3 mb-4">
                    <Search color="#90a4ae" size={20} />
                    <TextInput
                        className="flex-1 ml-3 text-base text-primary-dark"
                        placeholder="Search analyses..."
                        placeholderTextColor="#90a4ae"
                        value={searchQuery}
                        onChangeText={handleSearch}
                    />
                    <Filter color="#90a4ae" size={20} />
                </View>

                {/* Stats */}
                <View className="flex-row justify-between mb-6">
                    <StatCard title="Total Scans" value="24" />
                    <StatCard title="Diseases Found" value="8" />
                    <StatCard title="Healthy Plants" value="16" />
                </View>
            </View>

            {/* History List */}
            <ScrollView className="flex-1 px-6">
                {filteredHistory.length > 0 ? (
                    filteredHistory.map((item) => (
                        <HistoryItem key={item.id} {...item} onPress={() => handleItemPress(item.id)} />
                    ))
                ) : (
                    <View className="items-center justify-center py-12">
                        <Text className="text-secondary text-base">No analyses found</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    )
}

function StatCard({ title, value }: { title: string; value: string }) {
    return (
        <View className="bg-primary/10 rounded-xl p-4 flex-1 mx-1">
            <Text className="text-2xl font-bold text-primary-dark mb-1">{value}</Text>
            <Text className="text-sm text-secondary">{title}</Text>
        </View>
    )
}
