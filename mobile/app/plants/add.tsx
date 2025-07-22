import CameraButton from '@/components/ui/camera-button';
import { PlantUtils } from '@/lib/constant/plantUtils';
import plantService from '@/services/remote/plantService';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import {
    Calendar,
    Check,
    MapPin,
    Plus,
    X
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';



interface PlantForm {
    name: string;
    type: string;
    variety: string;
    plantedDate: string;
    location: string;
    coordinates?: {
        latitude: number;
        longitude: number;
    };
    notes: string;
    image: string | null;
}

export default function AddPlantScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState<PlantForm>({
        name: '',
        type: '',
        variety: '',
        plantedDate: new Date().toISOString().split('T')[0],
        location: '',
        notes: '',
        image: null,
    });

    const [showVarieties, setShowVarieties] = useState(false);
    const [customVariety, setCustomVariety] = useState('');

    const handleImagePicker = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Please grant camera roll permissions to add photos.');
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });
        console.log(result)
        if (!result.canceled) {
            setForm(prev => ({ ...prev, image: result.assets[0].uri }));
        }
    };

    const handleCamera = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Please grant camera permissions to take photos.');
            return;
        }
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setForm(prev => ({ ...prev, image: result.assets[0].uri }));
        }
    };

    const handleLocationPicker = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Please grant location permissions to use current location.');
            return;
        }

        try {
            const location = await Location.getCurrentPositionAsync({});
            const address = await Location.reverseGeocodeAsync({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });
            if (address.length > 0) {
                const addr = address[0];
                const formattedAddress = `${addr.street || ''} ${addr.city || ''}, ${addr.region || ''}`.trim();
                setForm(prev => ({
                    ...prev,
                    location: formattedAddress,
                    coordinates: {
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                    },
                }));
            }
        } catch (error) {
            Alert.alert('Error', 'Unable to get current location. Please enter manually.');
        }
    };

    const handleTypeSelect = (type: string) => {
        setForm(prev => ({ ...prev, type, variety: '' }));
        setShowVarieties(true);
        setCustomVariety('');
    };

    const handleVarietySelect = (variety: string) => {
        setForm(prev => ({ ...prev, variety }));
        setShowVarieties(false);
    };

    const handleCustomVariety = () => {
        if (customVariety.trim()) {
            setForm(prev => ({ ...prev, variety: customVariety.trim() }));
            setShowVarieties(false);
            setCustomVariety('');
        }
    };

    const handleSubmit = async () => {
        if (!form.name.trim()) {
            Alert.alert('Required Field', 'Please enter a plant name.');
            return;
        }
        if (!form.type) {
            Alert.alert('Required Field', 'Please select a plant type.');
            return;
        }

        setLoading(true);
        try {
            // TODO: Implement API call to save plant
            console.log('Saving plant:', form);

            let imageUrl = "";
            if (form.image) {
                console.log("yes")
                // 1. Upload image
                imageUrl = await plantService.uploadImage(form.image);
            }
            console.log(imageUrl)
            if (!imageUrl) {
                throw new Error("Erreur lors de l'upload de l'image");
            }
            // 2. Créer la plante
            await plantService.createPlant({
                name: form.name,
                type: form.type,
                variety: form.variety,
                planted_date: form.plantedDate,
                location: form.location,
                notes: form.notes,
                image_url: imageUrl,
            });

            Alert.alert('Success', 'Plant added successfully!', [
                { text: 'OK', onPress: () => router.back() }
            ]);
            router.back();
        } catch (error) {
            Alert.alert('Error', 'Failed to add plant. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const selectedType = PlantUtils.PLANT_TYPES.find(t => t.id === form.type);
    const availableVarieties = form.type ? PlantUtils.COMMON_VARIETIES[form.type as keyof typeof PlantUtils.COMMON_VARIETIES] || [] : [];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Image Section */}
                <View className="mb-10" style={styles.section}>
                    <Text className="text-2xl font-bold text-gray-900 mb-5" style={styles.sectionTitle}>
                        Plant Photo
                    </Text>

                    <View className="items-center justify-center" style={styles.imageContainer}>
                        {form.image ? (
                            <View className="relative" style={styles.imageWrapper}>
                                <Image source={{ uri: form.image }} style={styles.plantImage} />

                                <TouchableOpacity
                                    className="absolute -top-4 -right-4 w-10 h-10 rounded-full items-center justify-center shadow-md"
                                    style={styles.removeImageButton}
                                    onPress={() => setForm(prev => ({ ...prev, image: null }))}
                                >
                                    <X size={18} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View className="items-center justify-center p-4" style={styles.imagePlaceholder}>
                                <View className="flex-row mt-5 gap-x-4" style={styles.imageButtons}>
                                    <CameraButton onPress={handleCamera} size="md"></CameraButton>
                                    <CameraButton onPress={handleImagePicker} variant='gallery' size="md"></CameraButton>
                                </View>
                                <Text className="text-base text-gray-400 mt-3 text-center" style={styles.imagePlaceholderText}>
                                    Add a photo of your plant
                                </Text>
                            </View>
                        )}
                    </View>
                </View>


                {/* Basic Information */}
                <View className="mb-8" style={styles.section}>
                    <Text className="text-2xl font-bold text-gray-900 mb-5" style={styles.sectionTitle}>Basic Information</Text>

                    {/* Plant Name */}
                    <View className="mb-6" style={styles.inputGroup}>
                        <Text className="text-base font-semibold text-gray-700 mb-3" style={styles.inputLabel}>Plant Name *</Text>
                        <TextInput
                            className="bg-white border border-gray-200 rounded-2xl px-4 py-4 text-base text-gray-900"
                            value={form.name}
                            onChangeText={(text) => setForm(prev => ({ ...prev, name: text }))}
                            placeholder="e.g., My Tomato Plant"
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>

                    {/* Plant Type */}
                    <View className="mb-6" style={styles.inputGroup}>
                        <Text className="text-base font-semibold text-gray-700 mb-3" style={styles.inputLabel}>Plant Type *</Text>
                        <View className="flex-row flex-wrap gap-3" style={styles.typeGrid}>
                            {PlantUtils.PLANT_TYPES.map((type) => {
                                const Icon = type.icon;
                                const isSelected = form.type === type.id;
                                return (
                                    <TouchableOpacity
                                        key={type.id}
                                        style={[styles.typeCard, isSelected && { backgroundColor: `${type.color}15`, borderColor: type.color }]}
                                        onPress={() => handleTypeSelect(type.id)}
                                    >
                                        <View className="w-14 h-14 rounded-full justify-center items-center mb-3" style={[styles.typeIcon, { backgroundColor: `${type.color}20` }]}>
                                            <Icon size={24} color={type.color} />
                                        </View>
                                        <Text className={`text-base font-medium ${isSelected ? '' : 'text-gray-700'}`} style={[isSelected && { color: type.color, fontWeight: '600' }]}>
                                            {type.label}
                                        </Text>
                                        {isSelected && (
                                            <View className="absolute top-2 right-2 w-6 h-6 rounded-full justify-center items-center" style={[styles.checkIcon, { backgroundColor: type.color }]}>
                                                <Check size={12} color="#FFFFFF" />
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    {/* Variety Selection */}
                    {form.type && (
                        <View className="mb-6" style={styles.inputGroup}>
                            <Text className="text-base font-semibold text-gray-700 mb-3" style={styles.inputLabel}>Variety</Text>
                            {!showVarieties ? (
                                <TouchableOpacity
                                    style={styles.varietySelector}
                                    onPress={() => setShowVarieties(true)}
                                >
                                    <Text style={form.variety ? styles.varietySelected : styles.varietyPlaceholder}>
                                        {form.variety || 'Select or enter variety'}
                                    </Text>
                                    <Plus size={20} color="#6B7280" />
                                </TouchableOpacity>
                            ) : (
                                <View className="bg-white border border-gray-200 rounded-2xl p-4" style={styles.varietyOptions}>
                                    <View className="flex-row flex-wrap gap-2 mb-4" style={styles.varietyGrid}>
                                        {availableVarieties.map((variety) => (
                                            <TouchableOpacity
                                                key={variety}
                                                className="bg-gray-100 px-3 py-2 rounded-xl"
                                                style={styles.varietyChip}
                                                onPress={() => handleVarietySelect(variety)}
                                            >
                                                <Text className="text-sm text-gray-700 font-medium">{variety}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                    <View className="flex-row items-center gap-3 border-t border-gray-200 pt-4" style={styles.customVarietyContainer}>
                                        <TextInput
                                            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-sm text-gray-900"
                                            style={styles.customVarietyInput}
                                            value={customVariety}
                                            onChangeText={setCustomVariety}
                                            placeholder="Or enter custom variety"
                                            placeholderTextColor="#9CA3AF"
                                        />
                                        <TouchableOpacity
                                            className="w-10 h-10 rounded-full bg-gray-100 justify-center items-center"
                                            style={styles.customVarietyButton}
                                            onPress={handleCustomVariety}
                                            disabled={!customVariety.trim()}
                                        >
                                            <Check size={16} color={customVariety.trim() ? "#10B981" : "#9CA3AF"} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        </View>
                    )}
                </View>

                {/* Additional Details */}
                <View className="mb-8" style={styles.section}>
                    <Text className="text-2xl font-bold text-gray-900 mb-5" style={styles.sectionTitle}>Additional Details</Text>

                    {/* Planted Date */}
                    <View className="mb-6" style={styles.inputGroup}>
                        <Text className="text-base font-semibold text-gray-700 mb-3" style={styles.inputLabel}>Planted Date</Text>
                        <View className="bg-white border border-gray-200 rounded-2xl px-4 py-4 flex-row items-center gap-3" style={styles.dateInput}>
                            <Calendar size={20} color="#6B7280" />
                            <TextInput
                                className="flex-1 text-base text-gray-900"
                                style={styles.dateText}
                                value={form.plantedDate}
                                onChangeText={(text) => setForm(prev => ({ ...prev, plantedDate: text }))}
                                placeholder="YYYY-MM-DD"
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>
                    </View>

                    {/* Location */}
                    <View className="mb-6" style={styles.inputGroup}>
                        <Text className="text-base font-semibold text-gray-700 mb-3" style={styles.inputLabel}>Location</Text>
                        <View className="bg-white border border-gray-200 rounded-2xl flex-row items-start" style={styles.locationContainer}>
                            <TextInput
                                className="flex-1 px-4 py-4 text-base text-gray-900 min-h-[50px]"
                                style={styles.locationInput}
                                value={form.location}
                                onChangeText={(text) => setForm(prev => ({ ...prev, location: text }))}
                                placeholder="Enter location or use current location"
                                placeholderTextColor="#9CA3AF"
                                multiline
                            />
                            <TouchableOpacity className="p-4 justify-center items-center" style={styles.locationButton} onPress={handleLocationPicker}>
                                <MapPin size={20} color="#10B981" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Notes */}
                    <View className="mb-6" style={styles.inputGroup}>
                        <Text className="text-base font-semibold text-gray-700 mb-3" style={styles.inputLabel}>Notes</Text>
                        <TextInput
                            className="bg-white border border-gray-200 rounded-2xl px-4 py-4 text-base text-gray-900 min-h-[120px]"

                            value={form.notes}
                            onChangeText={(text) => setForm(prev => ({ ...prev, notes: text }))}
                            placeholder="Add any notes about your plant..."
                            placeholderTextColor="#9CA3AF"
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                        />
                    </View>
                </View>

                {/* Submit Button */}
                <View className="pb-8">
                    <TouchableOpacity
                        className={`bg-primary rounded-2xl py-4 items-center ${loading ? 'bg-gray-400' : ''}`}
                        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        <Text className="text-white text-lg font-semibold">
                            {loading ? 'Adding Plant...' : 'Add Plant'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    placeholder: {
        width: 40,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {

        marginBottom: 20,
    },
    imageContainer: {
        alignItems: 'center',
    },
    imageWrapper: {
        position: 'relative',
    },
    plantImage: {
        width: 220,
        height: 220,
        borderRadius: 20,
        resizeMode: "cover",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    removeImageButton: {
        elevation: 2,
    },
    imagePlaceholder: {
        height: 220,
        gap: 10,
        borderWidth: 1,
        borderColor: "#eee",
        borderRadius: 20,
    },
    imagePlaceholderText: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
    },
    imageButtons: {
        flexDirection: 'row',
        gap: 12,
    },

    inputGroup: {
        // marginBottom: 24,
    },
    inputLabel: {
        fontSize: 16,
    },
    typeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    typeCard: {
        flex: 1,
        minWidth: '45%',
        backgroundColor: '#FFFFFF',
        borderWidth: 2,
        borderColor: '#E5E7EB',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        position: 'relative',
    },
    typeIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    checkIcon: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    varietySelector: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    varietySelected: {
        fontSize: 16,
        color: '#111827',
        fontWeight: '500',
    },
    varietyPlaceholder: {
        fontSize: 16,
        color: '#9CA3AF',
    },
    varietyOptions: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 16,
        padding: 16,
    },
    varietyGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 16,
    },
    varietyChip: {
        borderRadius: 12,
    },

    customVarietyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        paddingTop: 16,
    },
    customVarietyInput: {
        flex: 1,
    },
    customVarietyButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dateInput: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    dateText: {
        flex: 1,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    locationInput: {
        flex: 1,
    },
    locationButton: {
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },

    submitButton: {
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
    },
    submitButtonDisabled: {
        shadowOpacity: 0,
        elevation: 0,
    },
});