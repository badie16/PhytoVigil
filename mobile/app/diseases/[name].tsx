import Header from '@/components/ui/header';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { getSeverityConfig } from '@/lib/constant/severity';
import diseaseService from '@/services/remote/diseaseService';
import type { Disease } from '@/types';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { TriangleAlert as AlertTriangle, Leaf, Pill, Shield, Stethoscope } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const { width } = Dimensions.get('window');
export default function DiseaseInfoPage() {
    const { name } = useLocalSearchParams()
    const [diseaseData, setDiseaseData] = useState<Disease>()
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    useEffect(() => {
        const fetchDisease = async () => {
            try {
                const res = await diseaseService.getDiseaseByName(Array.isArray(name) ? name[0] : name);
                setDiseaseData(res)
                console.log(res)
            } catch (error) {
                console.error("Erreur lors du chargement de la maladie", error)
            } finally {
                setLoading(false)
            }
        }
        fetchDisease()
    }, [])
    if (loading || !diseaseData) {
        return (
            <LoadingSpinner message="" size={30} ></LoadingSpinner>
        );
    }
    return (
        <SafeAreaView style={styles.container}>
            <Header onBack={router.back} title="Disease details" />
            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                {/* Header avec image */}
                <View style={styles.header}>
                    <Image
                        source={{ uri: diseaseData.image_url }}
                        style={styles.diseaseImage}
                        resizeMode="cover"
                    />
                    <View style={styles.headerOverlay}>
                        <Text style={styles.diseaseName}>{diseaseData.name}</Text>
                        <Text style={styles.scientificName}>{diseaseData.scientific_name}</Text>
                    </View>
                </View>

                {/* Corps de la page */}
                <View style={styles.content}>
                    {/* Niveau de sévérité */}
                    <View style={styles.severityCard}>
                        <View style={styles.severityHeader}>
                            <AlertTriangle size={20} color={getSeverityConfig(diseaseData.severity_level).color} />
                            <Text style={styles.severityTitle}>Niveau de sévérité</Text>
                        </View>
                        <View style={[styles.severityBadge, { backgroundColor: getSeverityConfig(diseaseData.severity_level).color }]}>
                            <Text style={styles.severityText}>{getSeverityConfig(diseaseData.severity_level).text}</Text>
                        </View>
                    </View>

                    {/* Description */}
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Leaf size={20} color="#10B981" />
                            <Text style={styles.cardTitle}>Description</Text>
                        </View>
                        <Text style={styles.cardContent}>{diseaseData.description}</Text>
                    </View>

                    {/* Symptômes */}
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Stethoscope size={20} color="#EF4444" />
                            <Text style={styles.cardTitle}>Symptômes</Text>
                        </View>
                        <Text style={styles.cardContent}>{diseaseData.symptoms}</Text>
                    </View>

                    {/* Prévention */}
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Shield size={20} color="#10B981" />
                            <Text style={styles.cardTitle}>Prévention</Text>
                        </View>
                        <Text style={styles.cardContent}>{diseaseData.prevention}</Text>
                    </View>

                    {/* Traitement */}
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Pill size={20} color="#3B82F6" />
                            <Text style={styles.cardTitle}>Traitement</Text>
                        </View>
                        <Text style={styles.cardContent}>{diseaseData.treatment}</Text>
                    </View>
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
    scrollContainer: {
        flex: 1,
    },
    header: {
        position: 'relative',
        height: 250,
        backgroundColor: '#1F2937',
    },
    diseaseImage: {
        width: '100%',
        height: '100%',
    },
    headerOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundImage: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 20,
        paddingTop: 40,
    },
    diseaseName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    scientificName: {
        fontSize: 16,
        color: '#D1D5DB',
        fontStyle: 'italic',
    },
    content: {
        padding: 16,
        paddingBottom: 32,
    },
    severityCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    severityHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    severityTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        marginLeft: 8,
    },
    severityBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    severityText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        marginLeft: 8,
    },
    cardContent: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
    },
});