import LoadingSpinner from '@/components/ui/loading-spinner';
import { DateUtils } from '@/lib/constant/dateUtils';
import { PlantUtils } from '@/lib/constant/plantUtils';
import plantService from '@/services/remote/plantService';
import { Plant, PlantScan } from '@/types';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    Activity,
    Clock,
    FileText,
    MapPin
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function PlantDetailScreen() {
    const router = useRouter();
    const [plant, setPlant] = useState<Plant>()
    const [plantScans, setPlantScans] = useState<PlantScan[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { id } = useLocalSearchParams();
    useEffect(() => {
        const fetchPlants = async () => {
            try {
                const plantId = Array.isArray(id) ? parseInt(id[0], 10) : parseInt(id as string, 10);
                const data = await plantService.getPlantById(plantId)
                setPlant(data)
                const dataScans = await plantService.getScansByPlantId(data.id)
                setPlantScans(dataScans)
            } catch (err: any) {
                console.log(err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchPlants()
    }, [])
    const handleScanPress = (id: number) => {
        router.push(`/plants/scan/${id}`);
    }
    if (loading) {
        return (
            <LoadingSpinner message="" size={30} ></LoadingSpinner>
        );
    } else if (!plant) {
        return (
            <View className="flex-1 justify-center items-center">
                <View className="flex-1 justify-center items-center">
                    <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2">
                        <Text className="text-xl font-semibold text-slate-900">Plant Not Found</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
    return (
        <View className="flex-1 bg-slate-50">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Plant Image & Basic Info */}
                <View className="relative h-72">
                    <Image
                        source={{ uri: plant.image_url }}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                    <View className="absolute bottom-0 left-0 right-0 bg-black/60 p-5 flex-row items-center">
                        <View className="w-14 h-14 rounded-full bg-white/20 justify-center items-center mr-4"
                        >
                            {PlantUtils.getPlantIcon(plant.type, PlantUtils.getHealthColor(plant.health), 25)}
                        </View>
                        <View className="flex-1">
                            <Text className="text-2xl font-bold text-white mb-1">{plant.name}</Text>
                            <Text className="text-base text-slate-200 mb-2">{plant.variety || plant.type}</Text>
                            <View style={[styles.healthBadge, { backgroundColor: PlantUtils.getHealthColor(plant.health) }]}>
                                <Text className="text-xs font-semibold text-white">
                                    {PlantUtils.getHealthLabel(plant.health)}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View className="p-5 space-y-6">
                    {/* Plant Information */}
                    <View className="space-y-3">
                        <Text className="text-xl font-semibold text-slate-900">Plant Information</Text>
                        <View className="bg-white p-5 rounded-2xl shadow-sm space-y-4">
                            <View className="flex-row justify-between items-center">
                                <Text className="text-base text-slate-500 font-medium">Type:</Text>
                                <Text className="text-base text-slate-900 font-semibold text-right flex-1 capitalize">{plant.type}</Text>
                            </View>
                            {plant.variety && (
                                <View className="flex-row justify-between items-center">
                                    <Text className="text-base text-slate-500 font-medium">Variety:</Text>
                                    <Text className="text-base text-slate-900 font-semibold text-right flex-1 capitalize">{plant.variety}</Text>
                                </View>
                            )}
                            {plant.lastScanned && (
                                <View className="flex-row justify-between items-center">
                                    <Text className="text-base text-slate-500 font-medium">Planted:</Text>
                                    <Text className="text-base text-slate-900 font-semibold text-right flex-1 capitalize">{DateUtils.formatFullDate(plant.createdAt)}</Text>
                                </View>
                            )}
                            {plant.location?.address && (
                                <View className="flex-row justify-between items-center">
                                    <Text className="text-base text-slate-500 font-medium">Location:</Text>
                                    <Text className="text-base text-slate-900 font-semibold text-right flex-1 capitalize">{plant.location.address}</Text>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Plant Notes */}
                    {plant.notes && (
                        <View className="space-y-3">
                            <Text className="text-xl font-semibold text-slate-900">Notes</Text>
                            <View className="bg-white p-5 rounded-2xl shadow-sm flex-row space-x-3">
                                <FileText size={18} className='mt-[2px]' color="#6B7280" />
                                <Text className="text-base text-slate-700 flex-1 leading-6">{plant.notes}</Text>
                            </View>
                        </View>
                    )}

                    {/* Scan History */}
                    <View className="space-y-3">
                        <View className="flex-row justify-between items-center">
                            <Text className="text-xl font-semibold text-slate-900">Scan History</Text>
                            <View className="bg-slate-100 px-3 py-1.5 rounded-xl">
                                <Text className="text-xs font-medium text-slate-500">{plantScans.length} scans</Text>
                            </View>
                        </View>

                        {plantScans.length > 0 ? (
                            <View className="space-y-4">
                                {plantScans.map((scan) => (
                                    <TouchableOpacity key={scan.id} className="bg-white rounded-2xl p-5 shadow-sm" onPress={() => handleScanPress(scan.id)}>
                                        <View className="flex-row justify-between items-center mb-3">
                                            <View className="flex-row items-center space-x-2">
                                                {PlantUtils.getStatusIcon(scan.status)}
                                                <Text style={[styles.scanStatusText, { color: PlantUtils.getHealthColor(scan.status) }]}>
                                                    {scan.diseaseName}
                                                </Text>
                                            </View>
                                            <Text className="text-sm text-slate-500">{DateUtils.formatDate(scan.createdAt)}</Text>
                                        </View>

                                        <View className="space-y-2 mb-3">
                                            <View className="flex-row items-center space-x-1.5">
                                                <Activity size={14} color="#6B7280" />
                                                <Text className="text-sm text-slate-500">{scan.confidence}% confidence</Text>
                                            </View>

                                            {scan.location?.address && (
                                                <View className="flex-row items-center space-x-1.5">
                                                    <MapPin size={14} color="#6B7280" />
                                                    <Text className="text-sm text-slate-500">{scan.location.address}</Text>
                                                </View>
                                            )}
                                        </View>

                                        {/* {scan.treatment && (
                                            <View className="bg-green-50 p-4 rounded-xl mb-3">
                                                <Text className="text-sm font-semibold text-green-600 mb-2">Treatment:</Text>
                                                <Text className="text-sm text-slate-700 leading-5">{scan.treatment}</Text>
                                            </View>
                                        )}

                                        {scan.notes && (
                                            <View className="bg-slate-50 p-4 rounded-xl">
                                                <Text className="text-sm font-semibold text-slate-700 mb-2">Notes:</Text>
                                                <Text className="text-sm text-slate-500 leading-5">{scan.notes}</Text>
                                            </View>
                                        )} */}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ) : (
                            <View className="bg-white p-10 rounded-2xl items-center shadow-sm">
                                <Clock size={48} color="#D1D5DB" />
                                <Text className="text-lg font-semibold text-slate-700 mt-4 mb-2">No scans yet</Text>
                                <Text className="text-sm text-slate-500 text-center leading-5">Start scanning this plant to track its health over time</Text>
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    healthBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    scanStatusText: {
        fontSize: 16,
        fontWeight: '600',
    },
});