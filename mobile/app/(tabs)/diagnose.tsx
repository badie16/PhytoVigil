"use client"

import DiseaseCard from "@/components/ui/disease-card"
import LoadingSpinner from "@/components/ui/loading-spinner"
import diseaseService from "@/services/remote/diseaseService"
import type { Disease } from "@/types"
import { useRouter } from "expo-router"
import { Search, Shield } from "lucide-react-native"
import { useEffect, useState } from "react"
import { ScrollView, Text, TextInput, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
export default function DiagnoseScreen() {
    const [searchQuery, setSearchQuery] = useState("")
    const [diseases, setDiseases] = useState<Disease[]>([])
    const [filteredDiseases, setFilteredDiseases] = useState(diseases)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    useEffect(() => {
        const fetchDiseases = async () => {
            try {
                const data = await diseaseService.getAllDisease()
                console.log(data)
                setDiseases(data)
                setFilteredDiseases(data)
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchDiseases()
    }, [])
    const handleSearch = (query: string) => {
        setSearchQuery(query)
        if (query.trim() === "") {
            setFilteredDiseases(diseases)
        } else {
            const filtered = diseases.filter(
                (disease) =>
                    disease.name.toLowerCase().includes(query.toLowerCase()) ||
                    disease.treatment.toLowerCase().includes(query.toLowerCase())
            )
            setFilteredDiseases(filtered)
        }
    }
    const handleDiseasePress = (name: string) => {
        router.push(`/diseases/${encodeURIComponent(name)}`)

    }
    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="px-6 py-2">
                {/* Header */}
                <View className="items-center mb-6">
                    <View className="w-16 h-16 bg-primary/10 rounded-full items-center justify-center mb-3">
                        <Shield color="#00C896" size={28} />
                    </View>
                    <Text className="text-xl font-bold text-gray-900 mb-2">Disease Dictionary</Text>
                    <Text className="text-sm text-secondary text-center">Learn about common plant diseases and treatments</Text>
                </View>

                {/* Search Bar */}
                <View className="flex-row items-center bg-surface rounded-xl px-4 py-3 mb-4">
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
            {loading ? (
                <LoadingSpinner message="" size={30} ></LoadingSpinner>
            ) : (
                <ScrollView className="flex-1 px-6">
                    {filteredDiseases.length > 0 ? (
                        filteredDiseases.map((disease, index) => (
                            <DiseaseCard
                                key={index}
                                name={disease.name}
                                treatment={disease.treatment}
                                severity={disease.severity_level}
                                image={disease.image_url}
                                onPress={() => handleDiseasePress(disease.name)}
                            />
                        ))
                    ) : (
                        <View className="items-center justify-center py-12">
                            <Text className="text-secondary text-base">No diseases found</Text>
                        </View>
                    )}
                </ScrollView>
            )}

        </SafeAreaView>
    )
}
