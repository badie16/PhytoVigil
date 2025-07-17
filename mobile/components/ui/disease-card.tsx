import { LinearGradient } from 'expo-linear-gradient';
import { TriangleAlert as AlertTriangle, ChevronRight, InfoIcon, Leaf, Shield } from 'lucide-react-native';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getSeverityConfig } from '@/lib/constant/severity';
interface DiseaseCardProps {
    name: string;
    treatment: string;
    image: string | undefined;
    onPress: () => void;
    severity?: number;
}
export default function DiseaseCard({ name, treatment, image, onPress, severity }: DiseaseCardProps) {
    const severityConfig = getSeverityConfig(severity);

    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.95}>
            <LinearGradient
                colors={['#FFFFFF', '#F8FAFC']}
                style={styles.cardGradient}
            >
                <View style={styles.cardContent}>
                    {/* Image Section */}
                    <View style={styles.imageSection}>
                        <View style={styles.imageContainer}>
                            <Image
                                source={{ uri: image }}
                                style={styles.image}
                                resizeMode="cover"
                            />
                            <LinearGradient
                                colors={['transparent', 'rgba(0,0,0,0.3)']}
                                style={styles.imageOverlay}
                            />
                        </View>

                        {severity && (
                            <View style={[styles.severityBadge, {
                                backgroundColor: severityConfig.lightBg,
                                shadowColor: severityConfig.shadowColor,
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 1,
                                shadowRadius: 4,
                                elevation: 3,
                            }]}>
                                <AlertTriangle size={12} color={severityConfig.color} />
                                <Text style={[styles.severityText, { color: severityConfig.darkColor }]}>
                                    {severityConfig.text}
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Content Section */}
                    <View style={styles.contentSection}>
                        <View style={styles.headerRow}>
                            <View style={styles.titleContainer}>
                                <Text style={styles.name} numberOfLines={1}>{name}</Text>
                                <View style={styles.typeIndicator}>
                                    <Leaf size={12} color="#10B981" />
                                    <Text style={styles.typeText}>Maladie fongique</Text>
                                </View>
                            </View>

                            <View style={styles.actionButton}>
                                 <InfoIcon size={20} color="gray" />
                            </View>
                        </View>

                        <View style={styles.treatmentSection}>
                            <View style={styles.treatmentHeader}>
                                <Shield size={14} color="#3B82F6" />
                                <Text style={styles.treatmentLabel}>Traitement</Text>
                            </View>
                            <Text style={styles.treatment} numberOfLines={2}>{treatment}</Text>
                        </View>

                        {/* Progress Indicator */}
                        <View style={styles.progressContainer}>
                            <View style={styles.progressTrack}>
                                <LinearGradient
                                    colors={severityConfig.gradient as [string, string]}
                                    style={[styles.progressFill, { width: `${(severity || 1) * 20}%` }]}
                                />
                            </View>
                            <Text style={styles.progressText}>Niveau {severity || 1}/5</Text>
                        </View>
                    </View>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 16,
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
    },
    cardGradient: {
        borderRadius: 20,
    },
    cardContent: {
        padding: 0,
    },
    imageSection: {
        position: 'relative',
        height: 140,
    },
    imageContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: '#F3F4F6',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    imageOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 40,
    },
    severityBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    severityText: {
        fontSize: 11,
        fontWeight: '600',
        marginLeft: 4,
    },
    contentSection: {
        padding: 16,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    titleContainer: {
        flex: 1,
        marginRight: 12,
    },
    name: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 4,
    },
    typeIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    typeText: {
        fontSize: 12,
        color: '#10B981',
        marginLeft: 4,
        fontWeight: '500',
    },
    actionButton: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    actionGradient: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    treatmentSection: {
        marginBottom: 12,
    },
    treatmentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    treatmentLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#3B82F6',
        marginLeft: 6,
    },
    treatment: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    progressTrack: {
        flex: 1,
        height: 4,
        backgroundColor: '#E5E7EB',
        borderRadius: 2,
        marginRight: 12,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 2,
    },
    progressText: {
        fontSize: 12,
        color: '#9CA3AF',
        fontWeight: '500',
    },
});