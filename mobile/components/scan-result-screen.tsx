import type { ScanData } from '@/app/(tabs)/scanner';
import { PlantUtils } from '@/lib/constant/plantUtils';
import { DateUtils } from '@/lib/utils/dateUtils';
import { Activity, Calendar, Camera, Clock, Download, Leaf, Link2, Zap } from 'lucide-react-native';
import React from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from './ui/header';

interface ScanResultScreenProps {
    scanData: ScanData;
    onNewScan: () => void;
    onBack: () => void;
}

export default function ScanResultScreen({
    scanData,
    onNewScan,
    onBack,
}: ScanResultScreenProps) {
    const { scanResult, analysisType, linkedPlantId, plantName, imageUri } = scanData;
    if (!scanResult) {
        return null;
    }
    const getStatusText = () => {
        switch (scanResult.status) {
            case 'healthy':
                return 'Healthy Plant';

            case 'diseased':
                return 'Disease Detected';
            case 'unknown':
                return 'Analysis Uncertain';
            default:
                return 'Analysis Complete';
        }
    };

    const handleShare = () => {
        Alert.alert('Share Results', 'Share functionality would be implemented here');
    };

    const handleSaveReport = () => {
        Alert.alert('Save Report', 'Save report functionality would be implemented here');
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <Header onBack={onBack} title='Scan Results' isClose>
                {/* <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
                    <Share size={20} color="#6B7280" />
                </TouchableOpacity> */}
            </Header>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Scan Image */}
                <View style={styles.imageSection}>
                    <Image source={{ uri: imageUri }} style={styles.scanImage} />
                    <View style={[styles.statusBadge, { backgroundColor: PlantUtils.getHealthBackground(scanResult.status) }]}>
                        {PlantUtils.getStatusIcon(scanResult.status)}
                        <Text style={[styles.statusText, { color: PlantUtils.getHealthColor(scanResult.status) }]}>
                            {getStatusText()}
                        </Text>
                    </View>
                </View>

                {/* Plant Link Info (only for linked scans) */}
                {analysisType === 'save' && (linkedPlantId || plantName) && (
                    <View style={styles.plantLinkSection}>
                        <View style={styles.plantLinkHeader}>
                            <Link2 size={20} color="#10B981" />
                            <Text style={styles.plantLinkTitle}>Linked to Plant</Text>
                        </View>
                        <View style={styles.plantLinkCard}>
                            <View style={styles.plantLinkInfo}>
                                <Leaf size={24} color="#10B981" />
                                <View style={styles.plantDetails}>
                                    <Text style={styles.plantName}>{plantName || 'Unknown Plant'}</Text>
                                    {linkedPlantId && (
                                        <Text style={styles.plantId}>ID: {linkedPlantId}</Text>
                                    )}
                                </View>
                            </View>
                            <Text style={styles.plantLinkDescription}>
                                This scan has been added to your plant's health history
                            </Text>
                        </View>
                    </View>
                )}

                {/* Analysis Results */}
                <View style={styles.resultsSection}>
                    <Text style={styles.sectionTitle}>Analysis Results</Text>

                    {/* Disease Detection */}
                    <View style={styles.resultCard}>
                        <View style={styles.resultHeader}>
                            <Text style={styles.resultTitle}>Disease Detection</Text>
                            <View style={[styles.confidenceBadge, { backgroundColor: PlantUtils.getHealthBackground(scanResult.status) }]}>
                                <Text style={[styles.confidenceText, { color: PlantUtils.getHealthColor(scanResult.status) }]}>
                                    {scanResult.confidence}% confidence
                                </Text>
                            </View>
                        </View>
                        <Text style={styles.diseaseText}>
                            {scanResult.diseaseName.replace(/___/g, ' - ').replace(/_/g, ' ')}
                        </Text>
                        <Text style={styles.severityText}>
                            Status: <Text style={[styles.severityValue, { color: PlantUtils.getHealthColor(scanResult.status) }]}>
                                {scanResult.status}
                            </Text>
                        </Text>
                    </View>

                    {/* Top Predictions (only if confidence is low or unknown) */}
                    {(scanResult.status === 'unknown' || scanResult.confidence < 0.7) && (
                        <View style={styles.predictionsCard}>
                            <Text style={styles.predictionsTitle}>Alternative Predictions</Text>
                            <View style={styles.predictionsList}>
                                {scanResult.top_predictions.slice(0, 3).map((prediction, index) => (
                                    <View key={index} style={styles.predictionItem}>
                                        <View style={styles.predictionRank}>
                                            <Text style={styles.predictionRankText}>{prediction.rank}</Text>
                                        </View>
                                        <View style={styles.predictionInfo}>
                                            <Text style={styles.predictionName}>
                                                {prediction.class_name.replace(/___/g, ' - ').replace(/_/g, ' ')}
                                            </Text>
                                            <Text style={styles.predictionConfidence}>
                                                {prediction.confidence}% confidence
                                            </Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}
                </View>

                {/* Recommendations */}
                <View style={styles.recommendationsCard}>
                    <Text style={styles.recommendationsTitle}>Treatment Recommendations</Text>
                    <Text style={styles.recommendationsText}>
                        {scanResult.treatment}
                    </Text>
                </View>


                {/* Analysis Info */}
                <View style={styles.analysisInfoSection}>
                    <Text style={styles.sectionTitle}>Scan Information</Text>
                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <Calendar size={16} color="#6B7280" />
                            <Text style={styles.infoLabel}>Scanned:</Text>
                            <Text style={styles.infoValue}>
                                {DateUtils.formatDateFlexible(scanResult.createdAt)}
                            </Text>
                        </View>
                        {scanResult.processing_time && (
                            <View style={styles.infoRow}>
                                <Clock size={16} color="#6B7280" />
                                <Text style={styles.infoLabel}>Processing Time:</Text>
                                <Text style={styles.infoValue}>
                                    {scanResult.processing_time.toFixed(2)}s
                                </Text>
                            </View>)
                        }
                        <View style={styles.infoRow}>
                            <Activity size={16} color="#6B7280" />
                            <Text style={styles.infoLabel}>Analysis Type:</Text>
                            <Text style={styles.infoValue}>
                                {analysisType === 'quick' ? 'Quick Analysis' : 'Saved Analysis'}
                            </Text>
                        </View>
                        {scanResult.model_version && (
                            <View style={styles.infoRow}>
                                <Zap size={16} color="#6B7280" />
                                <Text style={styles.infoLabel}>Model Version:</Text>
                                <Text style={styles.infoValue}>{scanResult.model_version}</Text>
                            </View>
                        )}
                        {analysisType === 'save' && (
                            <View style={styles.infoRow}>
                                <Download size={16} color="#6B7280" />
                                <Text style={styles.infoLabel}>Storage:</Text>
                                <Text style={styles.infoValue}>Saved to your collection</Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionsSection}>
                    {analysisType === 'quick' && (
                        <TouchableOpacity style={styles.saveButton} onPress={handleSaveReport}>
                            <Download size={20} color="#FFFFFF" />
                            <Text style={styles.saveButtonText}>Save Report</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity style={styles.newScanButton} onPress={onNewScan}>
                        <Camera size={20} color="#10B981" />
                        <Text style={styles.newScanButtonText}>New Scan</Text>
                    </TouchableOpacity>
                </View>

                {/* Bottom Spacing */}
                <View style={styles.bottomSpacing} />
            </ScrollView>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    shareButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    imageSection: {
        alignItems: 'center',
        paddingVertical: 24,
        position: 'relative',
    },
    scanImage: {
        width: 200,
        height: 200,
        borderRadius: 16,
        marginBottom: 16,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 24,
        gap: 8,
    },
    statusText: {
        fontSize: 16,
        fontWeight: '600',
    },
    plantLinkSection: {
        marginBottom: 24,
    },
    plantLinkHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 8,
    },
    plantLinkTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#10B981',
    },
    plantLinkCard: {
        backgroundColor: '#F0FDF4',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#86EFAC',
    },
    plantLinkInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 12,
    },
    plantDetails: {
        flex: 1,
    },
    plantName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    plantId: {
        fontSize: 12,
        color: '#6B7280',
        fontFamily: 'monospace',
    },
    plantLinkDescription: {
        fontSize: 14,
        color: '#059669',
        fontStyle: 'italic',
    },
    resultsSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 16,
    },
    resultCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    resultHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    resultTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    confidenceBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    confidenceText: {
        fontSize: 12,
        fontWeight: '600',
    },
    diseaseText: {
        fontSize: 24,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 8,
    },
    severityText: {
        fontSize: 16,
        color: '#6B7280',
    },
    severityValue: {
        fontWeight: '600',
    },
    recommendationsCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    recommendationsTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 16,
    },
    recommendationsText: {
        fontSize: 15,
        color: '#374151',
        lineHeight: 24,
        textAlign: 'left',
    },
    predictionsCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    predictionsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 16,
    },
    predictionsList: {
        gap: 12,
    },
    predictionItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
    },
    predictionRank: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#6B7280',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2,
    },
    predictionRankText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    predictionInfo: {
        flex: 1,
    },
    predictionName: {
        fontSize: 15,
        fontWeight: '500',
        color: '#111827',
        marginBottom: 4,
    },
    predictionConfidence: {
        fontSize: 13,
        color: '#6B7280',
    },
    analysisInfoSection: {
        marginBottom: 24,
        marginTop: 24,
    },
    infoCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        gap: 8,
    },
    infoLabel: {
        fontSize: 14,
        color: '#6B7280',
        flex: 1,
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#111827',
    },
    actionsSection: {
        gap: 12,
        marginBottom: 24,
    },
    saveButton: {
        backgroundColor: '#6B7280',
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    newScanButton: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderWidth: 2,
        borderColor: '#10B981',
    },
    newScanButtonText: {
        color: '#10B981',
        fontSize: 16,
        fontWeight: '600',
    },
    bottomSpacing: {
        height: 40,
    },
});