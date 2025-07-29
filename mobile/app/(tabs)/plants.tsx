import LoadingSpinner from "@/components/ui/loading-spinner"
import { PlantUtils } from "@/lib/constant/plantUtils"
import { DateUtils } from "@/lib/utils/dateUtils"
import plantService from "@/services/remote/plantService"
import { Plant } from "@/types"
import { useRouter } from "expo-router"
import { AlertTriangle, ChevronDown, Droplets, Filter, LayoutGrid, Leaf, List, LucideIcon, Plus, Sun, Thermometer, X } from "lucide-react-native"
import { useEffect, useState } from "react"
import { Dimensions, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2;

type HealthFilter = 'all' | 'healthy' | 'warning' | 'danger' | 'not scanned';

interface FilterState {
    health: HealthFilter;
    type: string;
}

export default function PlantsScreen() {
    const router = useRouter();
    const [plants, setPlants] = useState<Plant[]>([])
    const [filteredPlants, setFilteredPlants] = useState<Plant[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [showFilters, setShowFilters] = useState(false)
    const [filters, setFilters] = useState<FilterState>({
        health: 'all',
        type: 'all'
    })

    const healthyCount = plants.filter(plant => plant.health === 'healthy').length;
    const dangerCount = plants.filter(plant => plant.health === 'danger').length;
    const totalCount = plants.length;

    // Get unique plant types for filter options
    const plantTypes = ['all', ...Array.from(new Set(plants.map(plant => plant.type)))];

    useEffect(() => {
        const fetchPlants = async () => {
            try {
                const data = await plantService.getUserPlants()
                console.log(data)
                setPlants(data)
                setFilteredPlants(data)
            } catch (err: any) {
                console.log(err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchPlants()
    }, [])

    // Apply filters whenever filters or plants change
    useEffect(() => {
        let filtered = [...plants];

        // Filter by health
        if (filters.health !== 'all') {
            filtered = filtered.filter(plant => plant.health === filters.health);
        }

        // Filter by type
        if (filters.type !== 'all') {
            filtered = filtered.filter(plant => plant.type === filters.type);
        }

        setFilteredPlants(filtered);
    }, [filters, plants]);

    const [viewMode, setViewMode] = useState<'list' | 'card'>('list');

    const handleAddPlant = () => {
        router.push(`/plants/add`);
    }

    const handlePlantPress = (id: number) => {
        router.push(`/plants/${id}`);
    }

    const clearFilters = () => {
        setFilters({ health: 'all', type: 'all' });
    };

    const hasActiveFilters = filters.health !== 'all' || filters.type !== 'all';

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
                        style={{ elevation: 1 }}
                    >
                        <Plus color="#FFFFFF" size={24} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Stats */}
                <View className="mb-4">
                    <View className="flex-1 flex-row gap-3">
                        <StatCard Icon={Leaf} color="#10B981" title="Total Plants" value={totalCount}></StatCard>
                        <StatCard Icon={Sun} color="#10B981" title="Healthy" value={healthyCount}></StatCard>
                        <StatCard Icon={AlertTriangle} color={PlantUtils.getHealthColor("danger")} title={PlantUtils.getHealthLabel("danger")} value={dangerCount}></StatCard>
                    </View>
                </View>

                {/* Filter Section */}
                <View className="mb-4">
                    <View className="flex flex-row justify-between items-center mb-4">
                        <Text style={styles.sectionTitle}>Your Garden</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                            {/* Advanced Filter Button (this code does not change) */}
                            <TouchableOpacity
                                style={[
                                    styles.advancedFilterButton,
                                    {
                                        backgroundColor: showFilters ? '#10B981' : '#F9FAFB',
                                        borderColor: showFilters ? '#10B981' : '#E5E7EB'
                                    }
                                ]}
                                onPress={() => setShowFilters(!showFilters)}
                            >
                                <Filter size={16} color={showFilters ? '#FFFFFF' : '#6B7280'} />
                                <ChevronDown
                                    size={14}
                                    color={showFilters ? '#FFFFFF' : '#6B7280'}
                                    style={{ transform: [{ rotate: showFilters ? '180deg' : '0deg' }] }}
                                />
                                {hasActiveFilters && (
                                    <View style={styles.filterBadge} />
                                )}
                            </TouchableOpacity>

                            {/* View Toggle (this code does not change) */}
                            <TouchableOpacity
                                style={styles.viewToggleButton}
                                onPress={() => setViewMode(viewMode === 'card' ? 'list' : 'card')}
                            >
                                {viewMode === 'list' ? (
                                    <LayoutGrid size={20} color="#10B981" />
                                ) : (
                                    <List size={20} color="#10B981" />
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <Modal
                    transparent={true}
                    visible={showFilters}
                    animationType="fade" // You can also use "slide"
                    onRequestClose={() => setShowFilters(false)} // For Android back button
                >
                    <TouchableWithoutFeedback onPress={() => setShowFilters(false)}>
                        <View style={styles.modalBackdrop}>
                            <View style={styles.advancedFilterContainer}>
                                <View style={styles.filterGrid}>
                                    {/* Health Status Section */}
                                    <View style={styles.filterSection}>
                                        <View style={styles.filterSectionHeader}>
                                            <View style={styles.filterIconContainer}>
                                                <Sun size={16} color="#10B981" />
                                            </View>
                                            <Text style={styles.filterSectionTitle}>Health Status</Text>
                                        </View>
                                        <View style={styles.filterOptionsGrid}>
                                            {(['all', 'healthy', 'warning', 'danger', 'not scanned'] as HealthFilter[]).map((health) => (
                                                <TouchableOpacity
                                                    key={health}
                                                    style={[
                                                        styles.modernFilterChip,
                                                        {
                                                            backgroundColor: filters.health === health ? '#10B981' : '#FFFFFF',
                                                            borderColor: filters.health === health ? '#10B981' : '#E5E7EB'
                                                        }
                                                    ]}
                                                    onPress={() => setFilters(prev => ({ ...prev, health }))}
                                                >
                                                    <Text style={[
                                                        styles.modernFilterChipText,
                                                        { color: filters.health === health ? '#FFFFFF' : '#374151' }
                                                    ]}>
                                                        {health === 'all' ? 'All' : health.charAt(0).toUpperCase() + health.slice(1)}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>
                                    {/* Plant Type Section */}
                                    <View style={styles.filterSection}>
                                        <View style={styles.filterSectionHeader}>
                                            <View style={styles.filterIconContainer}>
                                                <Droplets size={16} color="#10B981" />
                                            </View>
                                            <Text style={styles.filterSectionTitle}>Plant Type</Text>
                                        </View>
                                        <View style={styles.filterOptionsGrid}>
                                            {plantTypes.slice(0, 6).map((type) => (
                                                <TouchableOpacity
                                                    key={type}
                                                    style={[
                                                        styles.modernFilterChip,
                                                        {
                                                            backgroundColor: filters.type === type ? '#10B981' : '#FFFFFF',
                                                            borderColor: filters.type === type ? '#10B981' : '#E5E7EB'
                                                        }
                                                    ]}
                                                    onPress={() => setFilters(prev => ({ ...prev, type }))}
                                                >
                                                    <Text style={[
                                                        styles.modernFilterChipText,
                                                        { color: filters.type === type ? '#FFFFFF' : '#374151' }
                                                    ]}>
                                                        {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>
                                </View>

                                {/* Filter Actions */}
                                <View style={styles.filterActions}>
                                    <TouchableOpacity
                                        style={styles.clearFiltersAction}
                                        onPress={clearFilters}
                                    >
                                        <X size={16} color="#EF4444" />
                                        <Text style={styles.clearFiltersActionText}>Clear All</Text>
                                    </TouchableOpacity>

                                    <View style={styles.filterResultsInfo}>
                                        <Text style={styles.filterResultsText}>
                                            {filteredPlants.length} plants found
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
                {/* Plants List */}
                <View>
                    {loading ? (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
                            <LoadingSpinner message="" size={30} />
                        </View>
                    ) : filteredPlants.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyStateText}>
                                {hasActiveFilters ? 'No plants match your filters' : 'No plants found'}
                            </Text>
                            {hasActiveFilters && (
                                <TouchableOpacity
                                    className="bg-primary"
                                    style={{
                                        paddingHorizontal: 16,
                                        paddingVertical: 10,
                                        borderRadius: 8,
                                        marginTop: 8,
                                        alignItems: 'center',
                                    }}
                                    onPress={clearFilters}
                                >
                                    <Text className="text-white">Clear Filters</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    ) : (
                        <View style={viewMode === 'card' ? styles.plantsGrid : null} className="mb-4">
                            {filteredPlants.map((plant) =>
                                viewMode === 'list'
                                    ? <PlantList
                                        key={plant.id}
                                        id={plant.id}
                                        name={plant.name}
                                        type={plant.type}
                                        health={plant.health}
                                        lastScanned={plant.lastScanned ?? ''}
                                        image={plant.image_url ?? ''}
                                        onPress={() => handlePlantPress(plant.id)}
                                    />
                                    : <PlantCard
                                        key={plant.id}
                                        id={plant.id}
                                        name={plant.name}
                                        type={plant.type}
                                        health={plant.health}
                                        lastScanned={plant.lastScanned ?? ''}
                                        image={plant.image_url ?? ''}
                                        onPress={() => handlePlantPress(plant.id)}
                                    />
                            )}
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

function StatCard({ title, value, color, Icon }: { title: string; value: number; color: string; Icon: LucideIcon }) {
    return (
        <View className=" flex-1 rounded-2xl p-4 items-center" style={{
            backgroundColor: `${color}`, shadowColor: '#000000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.08,
            shadowRadius: 12,
            elevation: 4,
        }}>
            <View className="mb-2">
                {Icon && <Icon size={24} color={"#fff"} />}
            </View>
            <Text className="text-[28px] font-bold text-white mb-1">{value}</Text>
            <Text className="text-xs text-center text-white font-medium">{title}</Text>
        </View>
    )
}

function PlantList({
    id,
    name,
    type,
    health,
    lastScanned,
    image,
    onPress,
}: {
    id: number
    name: string
    type: string
    health: "healthy" | "warning" | "danger" | "not scanned"
    lastScanned: string
    image: string
    onPress: () => void
}) {
    return (
        <TouchableOpacity
            onPress={onPress}
            key={id}
            className="bg-white rounded-2xl mb-4 border border-gray-100"
            style={{
                elevation: 2,
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                position: 'relative',
                height: 100,
                overflow: 'hidden',
            }}
            activeOpacity={0.8}
        >
            {/* Icon en haut à droite */}
            <View
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{
                    backgroundColor: `${PlantUtils.getHealthColor(health)}20`,
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    zIndex: 10,
                }}
            >
                {PlantUtils.getPlantIcon(type, PlantUtils.getHealthColor(health))}
            </View>

            {/* Image à gauche sur toute la hauteur */}
            <Image
                source={{ uri: image }}
                style={styles.plantImageList}
                resizeMode="cover"
            />

            {/* Texte à droite de l'image */}
            <View style={{ marginLeft: 100, padding: 12, flex: 1, justifyContent: 'center' }}>
                <Text numberOfLines={1} className="text-lg font-semibold text-gray-900 mb-1" style={styles.plantNameList} >{name}</Text>
                <Text className="text-sm text-secondary mb-1">{type}</Text>
                <View className="flex-row items-center justify-between">
                    <Text
                        className="text-sm font-medium capitalize"
                        style={{ color: PlantUtils.getHealthColor(health) }}
                    >
                        {health}
                    </Text>
                    <Text className="text-xs text-secondary">{(lastScanned ? `Scanned ${DateUtils.formatDateFlexible(lastScanned)}` : "Never Scanned")}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

function PlantCard({ id, name,
    type,
    health,
    lastScanned,
    image,
    onPress,
}: {
    id: number
    name: string
    type: string
    lastScanned: string
    health: 'healthy' | 'warning' | 'danger' | "not scanned"
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
                    { backgroundColor: PlantUtils.getHealthColor(health) }
                ]}>
                    {PlantUtils.getPlantIcon(type)}
                </View>
                <View style={[
                    styles.healthIndicator,
                    { backgroundColor: PlantUtils.getHealthColor(health) }
                ]}>
                    <Text style={styles.healthText}>
                        {health}
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
                            {DateUtils.formatDateFlexible(lastScanned) || 'Never scanned'}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        elevation: 2,
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
        width: 100,
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
        textTransform: "capitalize"
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
    plantNameList: {
        paddingRight: 44,
        overflow: "hidden"
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
    // Modern Filter Styles
    quickFilters: {
        flexDirection: 'row',
        gap: 8,
    },
    quickFilterPill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        elevation: 1,
        gap: 4,
    },
    quickFilterText: {
        fontSize: 12,
        fontWeight: '600',
    },
    advancedFilterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        borderWidth: 1,
        gap: 4,
        position: 'relative',
    },
    filterBadge: {
        position: 'absolute',
        top: -2,
        right: -2,
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#EF4444',
    },
    viewToggleButton: {
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        padding: 8,
        elevation: 1,
    },
    advancedFilterContainer: {
        marginTop: 240,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 5,
    },
    filterGrid: {
        gap: 20,
    },
    filterSection: {
        gap: 12,
    },
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        paddingHorizontal: 20,
    },
    filterSectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    filterIconContainer: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#F0FDF4',
        justifyContent: 'center',
        alignItems: 'center',
    },
    filterSectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
    },
    filterOptionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    modernFilterChip: {
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        elevation: 1,
        minWidth: 70,
        alignItems: 'center',
    },
    modernFilterChipText: {
        fontSize: 12,
        fontWeight: '500',
        textAlign: 'center',
    },
    filterActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    clearFiltersAction: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: '#FEF2F2',
    },
    clearFiltersActionText: {
        fontSize: 14,
        color: '#EF4444',
        fontWeight: '500',
    },
    filterResultsInfo: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: '#F0FDF4',
    },
    filterResultsText: {
        fontSize: 14,
        color: '#10B981',
        fontWeight: '600',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 200,
        paddingVertical: 40,
    },
    emptyStateText: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 16,
    },
});