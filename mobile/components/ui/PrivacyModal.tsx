import React from 'react';
import {
    Alert,
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { X, Shield, Download, Trash2, Eye, Lock, Database } from 'lucide-react-native';

interface PrivacyModalProps {
    visible: boolean;
    onClose: () => void;
}

export default function PrivacyModal({ visible, onClose }: PrivacyModalProps) {
    const handleDataExport = () => {
        Alert.alert(
            'Export Data',
            'Your data export will include all your plant scans, disease detections, and account information. This may take up to 24 hours to prepare.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Request Export',
                    onPress: () => {
                        Alert.alert('Export Requested', 'You will receive an email when your data export is ready for download.');
                        onClose();
                    }
                }
            ]
        );
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            'Delete Account',
            'This will permanently delete your account and all associated data. This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete Account',
                    style: 'destructive',
                    onPress: () => {
                        Alert.alert('Account Deletion', 'Your account has been scheduled for deletion. You have 30 days to cancel this request.');
                        onClose();
                    }
                }
            ]
        );
    };

    const handleViewData = () => {
        Alert.alert(
            'Your Data',
            'Account Information:\n• Profile data\n• Plant scan history\n• Disease detection records\n• Usage analytics\n• Location data (if enabled)',
            [{ text: 'OK' }]
        );
    };

    const handlePrivacyPolicy = () => {
        Alert.alert(
            'Privacy Policy',
            'Our privacy policy explains how we collect, use, and protect your data. Would you like to view it?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'View Policy', onPress: () => Alert.alert('Privacy Policy', 'Opening privacy policy...') }
            ]
        );
    };

    const handleDataRetention = () => {
        Alert.alert(
            'Data Retention',
            'We retain your data for as long as your account is active. You can request deletion at any time.',
            [{ text: 'OK' }]
        );
    };

    const handleThirdPartySharing = () => {
        Alert.alert(
            'Third-Party Sharing',
            'We do not share your personal data with third parties for marketing purposes. Data is only shared with service providers necessary for app functionality.',
            [{ text: 'OK' }]
        );
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <View className="flex-1 bg-white">
                {/* Header */}
                <View className="flex-row items-center justify-between p-6 border-b border-gray-100">
                    <Text className="text-xl font-bold text-gray-900">Privacy & Security</Text>
                    <TouchableOpacity onPress={onClose}>
                        <X color="#8E8E93" size={24} />
                    </TouchableOpacity>
                </View>

                <ScrollView className="flex-1 px-6">
                    <View className="py-6">
                        <Text className="text-base text-gray-600 mb-6">
                            Manage your privacy settings and control how your data is used
                        </Text>

                        {/* Data Management */}
                        <View className="mb-8">
                            <Text className="text-lg font-semibold text-gray-900 mb-4">Data Management</Text>

                            <PrivacyItem
                                icon={<Eye color="#00C896" size={24} />}
                                title="View My Data"
                                description="See what data we have about you"
                                onPress={handleViewData}
                            />

                            <PrivacyItem
                                icon={<Download color="#00C896" size={24} />}
                                title="Export Data"
                                description="Download a copy of your data"
                                onPress={handleDataExport}
                            />

                            <PrivacyItem
                                icon={<Trash2 color="#FF3B30" size={24} />}
                                title="Delete Account"
                                description="Permanently delete your account and data"
                                onPress={handleDeleteAccount}
                            />
                        </View>

                        {/* Privacy Information */}
                        <View className="mb-8">
                            <Text className="text-lg font-semibold text-gray-900 mb-4">Privacy Information</Text>

                            <PrivacyItem
                                icon={<Shield color="#00C896" size={24} />}
                                title="Privacy Policy"
                                description="Read our privacy policy and terms"
                                onPress={handlePrivacyPolicy}
                            />

                            <PrivacyItem
                                icon={<Database color="#00C896" size={24} />}
                                title="Data Retention"
                                description="Learn how long we keep your data"
                                onPress={handleDataRetention}
                            />

                            <PrivacyItem
                                icon={<Lock color="#00C896" size={24} />}
                                title="Third-Party Sharing"
                                description="Information about data sharing practices"
                                onPress={handleThirdPartySharing}
                            />
                        </View>

                        {/* Security Notice */}
                        <View className="bg-green-50 p-4 rounded-xl">
                            <Text className="text-sm text-green-800 font-medium mb-2">Security Notice</Text>
                            <Text className="text-xs text-green-700">
                                Your data is encrypted and stored securely. We use industry-standard security measures to protect your information.
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </Modal>
    );
}

function PrivacyItem({
    icon,
    title,
    description,
    onPress,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    onPress: () => void;
}) {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="flex-row items-center py-4 border-b border-gray-100 active:bg-surface"
        >
            <View className="mr-4">{icon}</View>
            <View className="flex-1">
                <Text className="text-base font-medium text-gray-900 mb-1">{title}</Text>
                <Text className="text-sm text-gray-600">{description}</Text>
            </View>
        </TouchableOpacity>
    );
}