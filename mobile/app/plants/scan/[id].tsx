import LoadingSpinner from '@/components/ui/loading-spinner';
import { PlantUtils } from '@/lib/utils/plantUtils';
import { DateUtils } from '@/lib/utils/dateUtils';
import plantService from '@/services/remote/plantService';
import { Plant, PlantScan } from '@/types';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Activity, TriangleAlert as AlertTriangle, ArrowLeft, Calendar, Camera, CircleCheck as CheckCircle, FileText, MapPin, Target } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');


export default function ScanDetailScreen() {
    const router = useRouter();
    const [scan, setScan] = useState<PlantScan>();
    const [plant, setPlant] = useState<Plant>()
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { id } = useLocalSearchParams();

    useEffect(() => {
        const fetchScan = async () => {
            try {
                setLoading(true);
                const scanId = Array.isArray(id) ? parseInt(id[0], 10) : parseInt(id as string, 10);
                const data = await plantService.getScanById(scanId);
                setScan(data);
                if (data.plant_id) {
                    const p = await plantService.getPlantById(data.plant_id)
                    setPlant(p)
                }
            } catch (err: any) {
                console.log(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchScan();
    }, []);

    const handleShare = () => {
        console.log('Share scan details');
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <LoadingSpinner message="Loading scan details..." size={30} />
            </SafeAreaView>
        );
    }

    if (!scan) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <ArrowLeft size={24} color="#111827" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Scan Not Found</Text>
                </View>
                <View style={styles.notFound}>
                    <Text style={styles.notFoundText}>Scan not found</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            {/* <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Scan Details</Text>
                <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
                    <Share size={20} color="#6B7280" />
                </TouchableOpacity>
            </View> */}

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Scan Image */}
                <View style={styles.imageSection}>
                    <Image
                        source={{ uri: scan.imageUri }}
                        style={styles.scanImage}
                        resizeMode="cover"
                    />
                    <View style={styles.imageOverlay}>
                        <View style={styles.cameraIcon}>
                            <Camera size={24} color="#FFFFFF" />
                        </View>
                        <View style={[
                            styles.statusBadge,
                            { backgroundColor: `${PlantUtils.getHealthColor(scan.status)}20` }
                        ]}>
                            {PlantUtils.getStatusIcon(scan.status)}
                            <Text style={styles.statusText}>
                                {PlantUtils.getHealthLabel(scan.status)}
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.detailsContainer}>
                    {/* Scan Results */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Scan Results</Text>

                        {/* Main Result Card */}
                        <View style={[
                            styles.mainResultCard,
                            { backgroundColor: `${PlantUtils.getHealthColorWithAlpha(PlantUtils.getHealthColor(scan.status), 0.08)}` }
                        ]}>
                            <View style={styles.resultContent}>

                                <Text style={styles.resultStatus}>

                                    {scan.status === 'healthy' ? 'Plant is Healthy' :
                                        scan.status === 'diseased' ? 'Disease Detected' : 'Analysis Uncertain'}
                                </Text>
                                <Text style={[
                                    styles.diseaseName,
                                    { color: PlantUtils.getHealthColor(scan.status) }
                                ]}>
                                    {scan.diseaseName}
                                </Text>
                                <Text className='capitalize' style={styles.plantName}>in {plant?.name || "Unknown"}</Text>
                            </View>
                        </View>

                        {/* Confidence Score Card */}
                        <View style={styles.confidenceCard}>
                            <View style={styles.confidenceHeader}>
                                <Target size={20} color="#374151" />
                                <Text style={styles.confidenceTitle}>Confidence Score</Text>
                            </View>

                            <View style={styles.confidenceContent}>
                                <Text style={styles.confidenceValue}>{scan.confidence}%</Text>
                                <View style={styles.confidenceBarContainer}>
                                    <View style={styles.confidenceBarBackground}>
                                        <View style={[
                                            styles.confidenceBarFill,
                                            {
                                                width: `${scan.confidence}%`,
                                                backgroundColor: PlantUtils.getConfidenceColor(scan.confidence)
                                            }
                                        ]} />
                                    </View>
                                </View>
                                <Text style={styles.confidenceLabel}>
                                    {PlantUtils.getConfidenceLabel(scan.confidence)}
                                </Text>
                            </View>
                        </View>

                        {/* Analysis Details */}
                        <View style={styles.analysisCard}>
                            <Text style={styles.analysisTitle}>Analysis Details</Text>
                            <View style={styles.analysisGrid}>
                                <View style={styles.analysisItem}>
                                    <Text style={styles.analysisLabel}>Detection Type</Text>
                                    <Text style={styles.analysisValue}>
                                        {scan.status === 'diseased' ? 'Disease Detection' :
                                            scan.status === 'healthy' ? 'Health Check' : 'General Scan'}
                                    </Text>
                                </View>
                                <View style={styles.analysisItem}>
                                    <Text style={styles.analysisLabel}>Accuracy Level</Text>
                                    <Text style={[
                                        styles.analysisValue,
                                        { color: PlantUtils.getConfidenceColor(scan.confidence) }
                                    ]}>
                                        {PlantUtils.getConfidenceLabel(scan.confidence)}
                                    </Text>
                                </View>
                                <View style={styles.analysisItem}>
                                    <Text style={styles.analysisLabel}>Plant Type</Text>
                                    <Text style={styles.analysisValue}>{plant?.type || "Unknown"}</Text>
                                </View>
                                <View style={styles.analysisItem}>
                                    <Text style={styles.analysisLabel}>Scan Method</Text>
                                    <Text style={styles.analysisValue}>AI Vision Analysis</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Scan Information */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Scan Information</Text>
                        <View style={styles.infoCard}>
                            <View style={styles.infoRow}>
                                <View style={styles.infoItem}>
                                    <Calendar size={20} color="#6B7280" />
                                    <View style={styles.infoTextContainer}>
                                        <Text style={styles.infoLabel}>Scan Date</Text>
                                        <Text style={styles.infoValue}>
                                            {DateUtils.formatFullDate(scan.createdAt)}
                                        </Text>
                                        <Text style={styles.infoSubValue}>
                                            {DateUtils.formatDateFlexible(scan.createdAt)}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            {scan.location && (
                                <View style={styles.infoRow}>
                                    <View style={styles.infoItem}>
                                        <MapPin size={20} color="#6B7280" />
                                        <View style={styles.infoTextContainer}>
                                            <Text style={styles.infoLabel}>Location</Text>
                                            <Text style={styles.infoValue}>
                                                {scan.location.address}
                                            </Text>
                                            <Text style={styles.infoSubValue}>
                                                {scan.location.latitude.toFixed(4)}, {scan.location.longitude.toFixed(4)}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            )}

                            <View style={styles.infoRow}>
                                <View style={styles.infoItem}>
                                    <Activity size={20} color="#6B7280" />
                                    <View style={styles.infoTextContainer}>
                                        <Text style={styles.infoLabel}>Confidence Level</Text>
                                        <Text style={styles.infoValue}>{scan.confidence}%</Text>
                                        <Text style={styles.infoSubValue}>
                                            {scan.confidence >= 80 ? 'High confidence' :
                                                scan.confidence >= 60 ? 'Medium confidence' : 'Low confidence'}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Treatment Recommendations */}
                    {scan.treatment && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Treatment Recommendations</Text>
                            <View style={[
                                styles.treatmentCard,
                                { backgroundColor: scan.status === 'diseased' ? '#FEF2F2' : '#F0FDF4' }
                            ]}>
                                <View style={styles.treatmentHeader}>
                                    {scan.status === 'diseased' ? (
                                        <AlertTriangle size={24} color="#EF4444" />
                                    ) : (
                                        <CheckCircle size={24} color="#10B981" />
                                    )}
                                    <Text style={[
                                        styles.treatmentTitle,
                                        { color: scan.status === 'diseased' ? '#DC2626' : '#059669' }
                                    ]}>
                                        {scan.status === 'diseased' ? 'Action Required' : 'Maintenance Tips'}
                                    </Text>
                                </View>
                                <Text style={styles.treatmentText}>{scan.treatment}</Text>
                            </View>
                        </View>
                    )}

                    {/* Notes */}
                    {scan.notes && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Additional Notes</Text>
                            <View style={styles.notesCard}>
                                <FileText size={20} color="#6B7280" />
                                <Text style={styles.notesText}>{scan.notes}</Text>
                            </View>
                        </View>
                    )}

                    {/* Action Buttons */}
                    <View style={styles.actionsSection}>
                        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.8}>
                            <Camera size={20} color="#FFFFFF" />
                            <Text style={styles.primaryButtonText}>Scan Again</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.8}>
                            <FileText size={20} color="#10B981" />
                            <Text style={styles.secondaryButtonText}>Add Notes</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#111827',
        flex: 1,
        textAlign: 'center',
        marginHorizontal: 16,
    },
    shareButton: {
        padding: 8,
    },
    content: {
        flex: 1,
    },
    imageSection: {
        position: 'relative',
        height: 320,
    },
    scanImage: {
        width: '100%',
        height: '100%',
    },
    imageOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        justifyContent: 'space-between',
        padding: 24,
    },
    cameraIcon: {
        alignSelf: 'flex-start',
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusBadge: {
        alignSelf: 'flex-end',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        gap: 8,
    },
    statusText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    detailsContainer: {
        padding: 24,
        gap: 32,
    },
    section: {
        gap: 16,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 4,
    },
    mainResultCard: {
        padding: 24,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    resultIconContainer: {
        marginRight: 20,
    },

    resultContent: {
        flex: 1,
    },
    resultStatus: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
        marginBottom: 4,
    },
    diseaseName: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 4,
    },
    plantName: {
        fontSize: 16,
        color: '#6B7280',
        fontWeight: '500',
    },
    confidenceCard: {
        backgroundColor: '#FFFFFF',
        padding: 24,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginBottom: 16,
    },
    confidenceHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 20,
    },
    confidenceTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
    },
    confidenceContent: {
        alignItems: 'center',
    },
    confidenceValue: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 16,
    },
    confidenceBarContainer: {
        width: '100%',
        marginBottom: 12,
    },
    confidenceBarBackground: {
        height: 8,
        backgroundColor: '#F3F4F6',
        borderRadius: 4,
        overflow: 'hidden',
    },
    confidenceBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    confidenceLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
    },
    analysisCard: {
        backgroundColor: '#FFFFFF',
        padding: 24,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginBottom: 16,
    },
    analysisTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 20,
    },
    analysisGrid: {
        gap: 16,
    },
    analysisItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    analysisLabel: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
    analysisValue: {
        fontSize: 14,
        color: '#111827',
        fontWeight: '600',
        textAlign: 'right',
        flex: 1,
        marginLeft: 16,
    },
    infoCard: {
        backgroundColor: '#FFFFFF',
        padding: 24,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        gap: 24,
    },
    infoRow: {
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        paddingBottom: 20,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 16,
    },
    infoTextContainer: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 16,
        color: '#111827',
        fontWeight: '600',
        marginBottom: 2,
    },
    infoSubValue: {
        fontSize: 14,
        color: '#9CA3AF',
    },
    treatmentCard: {
        padding: 24,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    treatmentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    treatmentTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    treatmentText: {
        fontSize: 16,
        color: '#374151',
        lineHeight: 24,
    },
    notesCard: {
        backgroundColor: '#FFFFFF',
        padding: 24,
        borderRadius: 20,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 4,
        flexDirection: 'row',
        gap: 16,
    },
    notesText: {
        fontSize: 16,
        color: '#374151',
        lineHeight: 24,
        flex: 1,
    },
    actionsSection: {
        gap: 16,
        marginTop: 16,
    },
    primaryButton: {
        backgroundColor: '#10B981',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 16,
        gap: 12,
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 4,
    },
    primaryButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    secondaryButton: {
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 16,
        gap: 12,
        borderWidth: 2,
        borderColor: '#10B981',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 2,
    },
    secondaryButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#10B981',
    },
    notFound: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notFoundText: {
        fontSize: 18,
        color: '#6B7280',
        fontWeight: '500',
    },
});