import { PlantUtils } from "@/lib/constant/plantUtils"
import { Apple, Droplets, Flower, LayoutGrid, Leaf, List, LucideIcon, Plus, Sun, Thermometer } from "lucide-react-native"
import { useState } from "react"
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
const { width } = Dimensions.get('window');

const cardWidth = (width - 60) / 2;
// Mock plants data
const mockPlants = [
    {
        id: 1,
        name: "Tomato Plant",
        type: "Vegetable",
        health: "Healthy",
        lastScanned: "2 days ago",
        image: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQ7UH64K2_JbWj--JEDbWcTUfrwSvo7Xuk1tm4NYExO2VhZTWm8Qs1YdW1IctLimuJqONWxfLEUk3IIrtluNW1nDg",
        status: "healthy" as const,
    },
    {
        id: 2,
        name: "Rose Bush",
        type: "Flower",
        health: "Needs Attention",
        lastScanned: "1 day ago",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4c3fbPGL3SO6xDIsuaSTypobIh_tY88FqjPva8DL1-yQnFlxsYqVtffNZNg1F112Q_FXRb0zS__1f-kDeKiJiJQ",
        status: "warning" as const,
    },
    {
        id: 3,
        name: "Apple Tree",
        type: "Fruit",
        health: "Healthy",
        lastScanned: "3 days ago",
        image: "https://www.oneclickplants.co.uk/cdn/shop/collections/Shutterstock_1798373137_2000x.jpg?v=1701287885",
        status: "healthy" as const,
    },
]

export default function PlantsScreen() {
    const healthyCount = mockPlants.filter(plant => plant.status === 'healthy').length;
    const warningCount = mockPlants.filter(plant => plant.status === 'warning').length;
    // const dangerCount = mockPlants.filter(plant => plant.status === 'danger').length;
    const totalCount = mockPlants.length;
    const [plants] = useState(mockPlants)
    const [viewMode, setViewMode] = useState<'list' | 'card'>('list');

    const handleAddPlant = () => {
        console.log("Add new plant")
    }

    const handlePlantPress = (id: number) => {
        console.log("View plant details:", id)
    }

    return (
        <SafeAreaView className="flex-1 bg-white" style={styles.container}>
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

            </View>
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Stats */}
                <View className="mb-4">
                    {/* <Text style={styles.sectionTitle}>Overview</Text> */}
                    <View className="flex-1 flex-row gap-3">
                        <StatCard Icon={Droplets} color="#10B981" title="Total Plants" value={totalCount}></StatCard>
                        <StatCard Icon={Sun} color="#10B981" title="Healthy" value={healthyCount}></StatCard>
                        <StatCard Icon={Droplets} color="#F59E0B" title="Need Care" value={warningCount}></StatCard>
                    </View>
                </View>
                {/* Plants List */}
                <View>
                    <View className="flex flex-row justify-between mb-4 mt-3">
                        <Text style={styles.sectionTitle}>Your Garden</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                            <TouchableOpacity
                                style={{
                                    backgroundColor: '#F3F4F6',
                                    borderRadius: 16,
                                    padding: 6,
                                }}
                                onPress={() => setViewMode(viewMode === 'list' ? 'card' : 'list')}
                            >
                                {viewMode === 'list' ? (
                                    <LayoutGrid size={20} color="#10B981" />
                                ) : (
                                    <List size={20} color="#10B981" />
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={viewMode === 'card' ? styles.plantsGrid : null}>

                        {plants.map((plant) =>
                            viewMode === 'card'
                                ? <PlantList key={plant.id} {...plant} onPress={() => handlePlantPress(plant.id)} />
                                : <PlantCard key={plant.id} {...plant} onPress={() => handlePlantPress(plant.id)} />
                        )}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

function StatCard({ title, value, color, Icon }: { title: string; value: number; color: string; Icon: LucideIcon }) {
    return (
        <View className=" flex-1 bg-white rounded-2xl p-4 items-center" style={{
            borderTopWidth: 4, borderTopColor: color, shadowColor: '#000000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.08,
            shadowRadius: 12,
            elevation: 3,
        }}>
            <View className="mb-2">
                {Icon && <Icon size={24} color={color} />}
            </View>
            <Text className="text-[28px] font-bold text-gray-900 mb-1">{value}</Text>
            <Text className="text-xs text-gray-400 text-center font-medium">{title}</Text>
        </View>
    )
}
const getPlantIcon = (type: string, color = "#fff") => {
    switch (type.toLowerCase()) {
        case 'vegetable':
            return <Leaf size={18} color={color} />;
        case 'flower':
            return <Flower size={18} color={color} />;
        case 'fruit':
            return <Apple size={18} color={color} />;
        default:
            return <Leaf size={18} color={color} />;
    }
};
function PlantCard({
    id,
    name,
    type,
    health,
    lastScanned,
    status,
    image,
    onPress,
}: {
    id: number
    name: string
    type: string
    health: string
    lastScanned: string
    status: 'healthy' | 'warning' | 'danger'
    image: string
    onPress: () => void
}) {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="bg-white rounded-2xl mb-4 border border-gray-100"
            style={{
                elevation: 2,
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                position: 'relative',
                height: 100,
                overflow: 'hidden', // pour appliquer les bordures à l’image
            }}
            activeOpacity={0.8}
        >
            {/* Icon en haut à droite */}
            <View
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{
                    backgroundColor: `${PlantUtils.getHealthColor(status)}20`,
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    zIndex: 10,
                }}
            >
                {getPlantIcon(type, PlantUtils.getHealthColor(status))}
            </View>

            {/* Image à gauche sur toute la hauteur */}
            <Image
                source={{ uri: image }}
                style={styles.plantImageList}
                resizeMode="cover"
            />

            {/* Texte à droite de l'image */}
            <View style={{ marginLeft: 100, padding: 12, flex: 1, justifyContent: 'center' }}>
                <Text className="text-lg font-semibold text-gray-900 mb-1">{name}</Text>
                <Text className="text-sm text-secondary mb-1">{type}</Text>
                <View className="flex-row items-center justify-between">
                    <Text
                        className="text-sm font-medium"
                        style={{ color: PlantUtils.getHealthColor(status) }}
                    >
                        {health}
                    </Text>
                    <Text className="text-xs text-secondary">Scanned {lastScanned}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#111827',
    },
    plantsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    plantCard: {
        width: cardWidth,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 4,
    },
    plantImageContainer: {
        position: 'relative',
        height: 140,
    },
    plantImage: {
        width: '100%',
        height: '100%',
    },
    plantImageList: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        width: 100, // correspond à la largeur de l'image (ajuste si besoin)
        borderTopLeftRadius: 16,
        borderBottomLeftRadius: 16,
    },
    plantTypeIcon: {
        position: 'absolute',
        top: 12,
        left: 12,
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    healthIndicator: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    healthText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    plantInfo: {
        padding: 16,
    },
    plantName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 4,
    },
    plantType: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 12,
    },
    plantMeta: {
        gap: 6,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    metaText: {
        fontSize: 12,
        color: '#6B7280',
        flex: 1,
    },
});


function PlantList({ id, name,
    type,
    health,
    lastScanned,
    status,
    image,
    onPress,
}: {
    id: number
    name: string
    type: string
    health: string
    lastScanned: string
    status: 'healthy' | 'warning' | 'danger'
    image: string
    onPress: () => void
}) {
    return (
        <TouchableOpacity
            key={id}
            style={styles.plantCard}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <View style={styles.plantImageContainer}>
                <Image
                    source={{ uri: image }}
                    style={styles.plantImage}
                    resizeMode="cover"
                />
                <View style={[
                    styles.plantTypeIcon,
                    { backgroundColor: PlantUtils.getHealthColor(status) }
                ]}>
                    {getPlantIcon(type)}
                </View>
                <View style={[
                    styles.healthIndicator,
                    { backgroundColor: PlantUtils.getHealthColor(status) }
                ]}>
                    <Text style={styles.healthText}>
                        {PlantUtils.getHealthLabel(status)}
                    </Text>
                </View>
            </View>

            <View style={styles.plantInfo}>
                <Text style={styles.plantName} numberOfLines={1}>
                    {name}
                </Text>
                <Text style={styles.plantType}>{type}</Text>

                <View style={styles.plantMeta}>
                    <View style={styles.metaItem}>
                        <Thermometer size={12} color="#6B7280" />
                        <Text style={styles.metaText}>
                            {lastScanned || 'Never scanned'}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}