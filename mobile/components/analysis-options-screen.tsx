import {
    Database,
    Link2,
    Plus,
    Zap
} from 'lucide-react-native';
import React from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from './ui/header';

interface AnalysisOptionsScreenProps {
    imageUri: string;
    onBack: () => void;
    onQuickAnalysis: () => void;
    onLinkToExistingPlant: () => void;
    onAddNewPlant: () => void;
}

export default function AnalysisOptionsScreen({
    imageUri,
    onBack,
    onQuickAnalysis,
    onLinkToExistingPlant,
    onAddNewPlant,
}: AnalysisOptionsScreenProps) {
    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <Header title='Choose Analysis Type' onBack={onBack}></Header>
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Photo Preview */}
                <View style={styles.photoSection}>
                    <Image source={{ uri: imageUri }} style={styles.previewImage} />
                    <Text style={styles.photoLabel}>Selected Photo</Text>
                </View>

                {/* Analysis Options */}
                <View style={styles.optionsSection}>
                    <Text style={styles.sectionTitle}>How would you like to analyze this photo?</Text>

                    {/* Quick Analysis Option */}
                    <TouchableOpacity
                        style={[styles.optionCard, styles.quickAnalysisCard]}
                        onPress={onQuickAnalysis}
                    >
                        <View style={styles.optionHeader}>
                            <View style={[styles.iconContainer, { backgroundColor: '#FEF3C7' }]}>
                                <Zap size={24} color="#F59E0B" />
                            </View>
                            <View style={styles.optionInfo}>
                                <Text style={styles.optionTitle}>Quick Analysis</Text>
                                <Text style={styles.optionSubtitle}>Fast • No storage</Text>
                            </View>
                        </View>
                        <Text style={styles.optionDescription}>
                            Get instant disease detection results without saving to your plant collection.
                            Perfect for quick checkups.
                        </Text>

                    </TouchableOpacity>

                    {/* Save & Analyze Section */}
                    <View style={styles.saveSection}>
                        <View style={styles.saveSectionHeader}>
                            <Database size={20} color="#10B981" />
                            <Text style={styles.saveSectionTitle}>Save & Analyze</Text>
                        </View>
                        <Text style={styles.saveSectionDescription}>
                            Save this scan to your plant collection for tracking and history
                        </Text>

                        {/* Link to Existing Plant */}
                        <TouchableOpacity
                            style={[styles.optionCard, styles.linkPlantCard]}
                            onPress={onLinkToExistingPlant}
                        >
                            <View style={styles.optionHeader}>
                                <View style={[styles.iconContainer, { backgroundColor: '#DBEAFE' }]}>
                                    <Link2 size={24} color="#3B82F6" />
                                </View>
                                <View style={styles.optionInfo}>
                                    <Text style={styles.optionTitle}>Link to Existing Plant</Text>
                                    <Text style={styles.optionSubtitle}>Track history</Text>
                                </View>
                            </View>
                            <Text style={styles.optionDescription}>
                                Connect this scan to one of your existing plants to build a health history
                                and track progress over time.
                            </Text>

                        </TouchableOpacity>

                        {/* Add New Plant */}
                        <TouchableOpacity
                            style={[styles.optionCard, styles.newPlantCard]}
                            onPress={onAddNewPlant}
                        >
                            <View style={styles.optionHeader}>
                                <View style={[styles.iconContainer, { backgroundColor: '#D1FAE5' }]}>
                                    <Plus size={24} color="#10B981" />
                                </View>
                                <View style={styles.optionInfo}>
                                    <Text style={styles.optionTitle}>Add New Plant</Text>
                                    <Text style={styles.optionSubtitle}>Start tracking</Text>
                                </View>
                            </View>
                            <Text style={styles.optionDescription}>
                                Create a new plant entry in your collection with this scan as the first health record.
                            </Text>

                        </TouchableOpacity>
                    </View>
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
        width: 120,
        height: 120,
        borderRadius: 16,
        marginBottom: 12,
    },
    photoLabel: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
    optionsSection: {
        paddingBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 24,
        textAlign: 'center',
    },
    optionCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: 2,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    quickAnalysisCard: {
        borderColor: '#FCD34D',
        backgroundColor: '#FFFBEB',
    },
    linkPlantCard: {
        borderColor: '#93C5FD',
        backgroundColor: '#EFF6FF',
    },
    newPlantCard: {
        borderColor: '#86EFAC',
        backgroundColor: '#F0FDF4',
    },
    optionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    optionInfo: {
        flex: 1,
    },
    optionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 2,
    },
    optionSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },

    optionDescription: {
        fontSize: 15,
        color: '#4B5563',
        lineHeight: 22,

    },

    saveSection: {
        marginTop: 8,
    },
    saveSectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 8,
    },
    saveSectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#10B981',
    },
    saveSectionDescription: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 20,
        lineHeight: 20,
    },
    bottomSpacing: {
        height: 40,
    },
});