"use client"

import { useState } from "react"
import { View, Text, ScrollView, TextInput } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Search, Shield } from "lucide-react-native"
import DiseaseCard from "@/components/ui/disease-card"

// Mock diseases data
const mockDiseases = [
    {
        name: "Late Blight",
        treatment: "Apply copper-based fungicide every 7-10 days. Remove affected leaves immediately.",
        image: "/placeholder.svg?height=100&width=100",
        status: "diseased" as const,
    },
    {
        name: "Black Spot",
        treatment: "Use neem oil spray weekly. Improve air circulation around plants.",
        image: "/placeholder.svg?height=100&width=100",
        status: "diseased" as const,
    },
    {
        name: "Powdery Mildew",
        treatment: "Apply baking soda solution (1 tsp per quart water) twice weekly.",
        image: "/placeholder.svg?height=100&width=100",
        status: "diseased" as const,
    },
    {
        name: "Healthy Plant",
        treatment: "Continue regular watering and fertilizing schedule.",
        image: "/placeholder.svg?height=100&width=100",
        status: "healthy" as const,
    },
]

export default function DiagnoseScreen() {
    const [searchQuery, setSearchQuery] = useState("")
    const [filteredDiseases, setFilteredDiseases] = useState(mockDiseases)

    const handleSearch = (query: string) => {
        setSearchQuery(query)
        if (query.trim() === "") {
            setFilteredDiseases(mockDiseases)
        } else {
            const filtered = mockDiseases.filter(
                (disease) =>
                    disease.name.toLowerCase().includes(query.toLowerCase()) ||
                    disease.treatment.toLowerCase().includes(query.toLowerCase()),
            )
            setFilteredDiseases(filtered)
        }
    }

    const handleDiseasePress = (name: string) => {
        console.log("Show disease details:", name)
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="px-6 py-4">
                {/* Header */}
                <View className="items-center mb-6">
                    <View className="w-16 h-16 bg-primary/10 rounded-full items-center justify-center mb-3">
                        <Shield color="#00C896" size={28} />
                    </View>
                    <Text className="text-xl font-bold text-gray-900 mb-2">Disease Dictionary</Text>
                    <Text className="text-sm text-secondary text-center">Learn about common plant diseases and treatments</Text>
                </View>

                {/* Search Bar */}
                <View className="flex-row items-center bg-surface rounded-xl px-4 py-3 mb-6">
                    <Search color="#8E8E93" size={20} />
                    <TextInput
                        className="flex-1 ml-3 text-base text-gray-900"
                        placeholder="Search diseases..."
                        placeholderTextColor="#8E8E93"
                        value={searchQuery}
                        onChangeText={handleSearch}
                    />
                </View>
            </View>

            {/* Diseases List */}
            <ScrollView className="flex-1 px-6">
                {filteredDiseases.length > 0 ? (
                    filteredDiseases.map((disease, index) => (
                        <DiseaseCard
                            key={index}
                            name={disease.name}
                            treatment={disease.treatment}
                            image={disease.image}
                            status={disease.status}
                            onPress={() => handleDiseasePress(disease.name)}
                        />
                    ))
                ) : (
                    <View className="items-center justify-center py-12">
                        <Text className="text-secondary text-base">No diseases found</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    )
}
