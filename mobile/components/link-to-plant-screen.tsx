import { DateUtils } from '@/lib/constant/dateUtils';
import { PlantUtils } from '@/lib/constant/plantUtils';
import plantService from '@/services/remote/plantService';
import { Plant } from '@/types';
import {
    Calendar,
    ChevronRight,
    Leaf,
    MapPin,
    Search,
    Zap
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from './ui/header';

interface LinkToPlantScreenProps {
    imageUri: string;
    onStartAnalysis: (data: {
        linkedPlantId?: number;
        plantName?: string;
        isNewPlant?: boolean;
        skipLinking?: boolean;
    }) => void;
    onBack: () => void;
}

export default function LinkToPlantScreen({
    imageUri,
    onStartAnalysis,
    onBack,
}: LinkToPlantScreenProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [plants, setPlants] = useState<Plant[]>([])
    const [filteredPlants, setFilteredPlants] = useState<Plant[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null)
    // const filteredPlants = plants.filter(plant =>
    //     plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    // )

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

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredPlants(plants);
        } else {
            const filtered = plants.filter(plant =>
                plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                plant.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (plant.variety && plant.variety.toLowerCase().includes(searchQuery.toLowerCase()))
            );
            setFilteredPlants(filtered);
        }
    }, [searchQuery, plants]);
    const handlePlantSelect = (plant: Plant) => {
        setSelectedPlant(plant);
    };

    const handleStartAnalysis = () => {
        
        if (selectedPlant) {
            console.log(selectedPlant.id)
            onStartAnalysis({
                linkedPlantId: selectedPlant.id,
                plantName: selectedPlant.name,
                isNewPlant: false,
            });
        }
    };

    const handleSkipLinking = () => {
        onStartAnalysis({
            skipLinking: true,
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <Header title='Link to Plant' onBack={onBack}></Header>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Photo Preview */}
                <View style={styles.photoSection}>
                    <Image source={{ uri: imageUri }} style={styles.previewImage} />
                    <Text style={styles.photoLabel}>Scan to Link</Text>
                </View>

                {/* Search Bar */}
                <View style={styles.searchSection}>
                    <View style={styles.searchContainer}>
                        <Search size={20} color="#6B7280" />
                        <TextInput
                            style={styles.searchInput}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholder="Search your plants..."
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>
                </View>

                {/* Plants List */}
                <View style={styles.plantsSection}>
                    <Text style={styles.sectionTitle}>Select a Plant</Text>

                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <Text style={styles.loadingText}>Loading your plants...</Text>
                        </View>
                    ) : filteredPlants.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Leaf size={48} color="#D1D5DB" />
                            <Text style={styles.emptyTitle}>
                                {searchQuery ? 'No plants found' : 'No plants yet'}
                            </Text>
                            <Text style={styles.emptyDescription}>
                                {searchQuery
                                    ? 'Try adjusting your search terms'
                                    : 'Add your first plant to start tracking'}
                            </Text>
                        </View>
                    ) : (
                        <View style={styles.plantsList}>
                            {filteredPlants.map((plant) => {
                                const isSelected = selectedPlant?.id === plant.id;
                                return (
                                    <TouchableOpacity
                                        key={plant.id}
                                        style={[
                                            styles.plantCard,
                                            isSelected && styles.plantCardSelected,
                                        ]}
                                        onPress={() => handlePlantSelect(plant)}
                                    >
                                        <View style={styles.plantCardContent}>
                                            {/* Plant Image */}
                                            <View style={styles.plantImageContainer}>
                                                {plant.image_url ? (
                                                    <Image
                                                        source={{ uri: plant.image_url }}
                                                        style={styles.plantImage}
                                                    />
                                                ) : (
                                                    <View style={styles.plantImagePlaceholder}>
                                                        <Leaf size={24} color="#10B981" />
                                                    </View>
                                                )}
                                            </View>

                                            {/* Plant Info */}
                                            <View style={styles.plantInfo}>
                                                <Text style={styles.plantName}>{plant.name}</Text>
                                                <Text style={styles.plantType}>
                                                    {plant.type}
                                                    {plant.variety && ` • ${plant.variety}`}
                                                </Text>

                                                <View style={styles.plantMeta}>
                                                    <View style={styles.metaItem}>
                                                        <Calendar size={14} color="#6B7280" />
                                                        <Text style={styles.metaText}>
                                                            Planted {DateUtils.formatDate(plant.plantedDate || "")}
                                                        </Text>
                                                    </View>

                                                    {plant.location && (
                                                        <View style={styles.metaItem}>
                                                            <MapPin size={14} color="#6B7280" />
                                                            <Text style={styles.metaText} numberOfLines={1}>
                                                                {typeof plant.location === "string"
                                                                    ? plant.location
                                                                    : plant.location?.address || ""}
                                                            </Text>
                                                        </View>
                                                    )}
                                                </View>

                                                {/* Health Status */}
                                                {plant.health && (
                                                    <View style={styles.healthStatus}>
                                                        <View
                                                            style={[
                                                                styles.healthDot,
                                                                { backgroundColor: PlantUtils.getHealthColor(plant.health) },
                                                            ]}
                                                        />
                                                        <Text
                                                            style={[
                                                                styles.healthText,
                                                                { color: PlantUtils.getHealthColor(plant.health) },
                                                            ]}
                                                        >
                                                            {PlantUtils.getHealthLabel(plant.health)}
                                                        </Text>
                                                    </View>
                                                )}
                                            </View>

                                            {/* Selection Indicator */}
                                            <View style={styles.selectionIndicator}>
                                                {isSelected ? (
                                                    <View style={styles.selectedIndicator}>
                                                        <View style={styles.selectedDot} />
                                                    </View>
                                                ) : (
                                                    <ChevronRight size={20} color="#D1D5DB" />
                                                )}
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    )}
                </View>

                {/* Action Buttons */}
                <View style={styles.actionsSection}>
                    {selectedPlant && (
                        <TouchableOpacity
                            style={styles.analyzeButton}
                            onPress={handleStartAnalysis}
                        >
                            <Zap size={20} color="#FFFFFF" />
                            <Text style={styles.analyzeButtonText}>
                                Analyze & Link to {selectedPlant.name}
                            </Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        style={styles.skipButton}
                        onPress={handleSkipLinking}
                    >
                        <Text style={styles.skipButtonText}>
                            Skip Linking - Quick Analysis Only
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Bottom Spacing */}
                <View style={styles.bottomSpacing} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    photoSection: {
        alignItems: 'center',
        paddingVertical: 24,
    },
    previewImage: {
        width: 80,
        height: 80,
        borderRadius: 12,
        marginBottom: 8,
    },
    photoLabel: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
    searchSection: {
        marginBottom: 24,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        gap: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#111827',
    },
    plantsSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 16,
    },
    loadingContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    loadingText: {
        fontSize: 16,
        color: '#6B7280',
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#374151',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyDescription: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 20,
    },
    plantsList: {
        gap: 12,
    },
    plantCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 2,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    plantCardSelected: {
        borderColor: '#10B981',
        backgroundColor: '#F0FDF4',
    },
    plantCardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    plantImageContainer: {
        marginRight: 16,
    },
    plantImage: {
        width: 60,
        height: 60,
        borderRadius: 12,
    },
    plantImagePlaceholder: {
        width: 60,
        height: 60,
        borderRadius: 12,
        backgroundColor: '#F0FDF4',
        alignItems: 'center',
        justifyContent: 'center',
    },
    plantInfo: {
        flex: 1,
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
        marginBottom: 8,
    },
    plantMeta: {
        gap: 4,
        marginBottom: 8,
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
    healthStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    healthDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    healthText: {
        fontSize: 12,
        fontWeight: '500',
    },
    selectionIndicator: {
        marginLeft: 12,
    },
    selectedIndicator: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#10B981',
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FFFFFF',
    },
    actionsSection: {
        gap: 12,
        marginBottom: 24,
    },
    analyzeButton: {
        backgroundColor: '#10B981',
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    analyzeButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    skipButton: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    skipButtonText: {
        color: '#6B7280',
        fontSize: 14,
        fontWeight: '500',
    },
    bottomSpacing: {
        height: 40,
    },
});