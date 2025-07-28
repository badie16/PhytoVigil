import React from 'react';
import {
    Alert,
    Linking,
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { X, MessageCircle, Mail, Bug, Book, Phone, ExternalLink } from 'lucide-react-native';

interface HelpModalProps {
    visible: boolean;
    onClose: () => void;
}

export default function HelpModal({ visible, onClose }: HelpModalProps) {
    const handleFAQ = () => {
        Alert.alert(
            'Frequently Asked Questions',
            'Choose a topic:',
            [
                { text: 'Getting Started', onPress: () => showFAQSection('Getting Started') },
                { text: 'Plant Scanning', onPress: () => showFAQSection('Plant Scanning') },
                { text: 'Disease Detection', onPress: () => showFAQSection('Disease Detection') },
                { text: 'Account & Billing', onPress: () => showFAQSection('Account & Billing') },
                { text: 'Cancel', style: 'cancel' }
            ]
        );
    };

    const showFAQSection = (section: string) => {
        const faqContent = {
            'Getting Started': 'How to use PhytoVigil:\n\n1. Create an account\n2. Point camera at plant leaves\n3. Get instant disease detection\n4. Follow treatment recommendations',
            'Plant Scanning': 'Scanning Tips:\n\n• Use good lighting\n• Hold camera steady\n• Focus on affected areas\n• Scan multiple leaves for accuracy',
            'Disease Detection': 'Our AI can detect:\n\n• Fungal infections\n• Bacterial diseases\n• Viral infections\n• Nutrient deficiencies\n• Pest damage',
            'Account & Billing': 'Account Help:\n\n• Reset password in settings\n• Premium features unlock unlimited scans\n• Cancel subscription anytime\n• Data export available'
        };

        Alert.alert(section, faqContent[section as keyof typeof faqContent], [{ text: 'OK' }]);
    };

    const handleContactSupport = () => {
        Alert.alert(
            'Contact Support',
            'How would you like to contact us?',
            [
                { text: 'Email Support', onPress: () => openEmail() },
                { text: 'Live Chat', onPress: () => openLiveChat() },
                { text: 'Phone Support', onPress: () => openPhone() },
                { text: 'Cancel', style: 'cancel' }
            ]
        );
    };

    const openEmail = () => {
        const email = 'support@phytovigil.com';
        const subject = 'PhytoVigil Support Request';
        const body = 'Please describe your issue or question:';

        Linking.openURL(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)
            .catch(() => {
                Alert.alert('Email', 'Please contact us at: support@phytovigil.com');
            });
    };

    const openLiveChat = () => {
        Alert.alert('Live Chat', 'Live chat is available Monday-Friday, 9 AM - 6 PM EST. Starting chat...');
    };

    const openPhone = () => {
        const phoneNumber = '+1-800-PHYTO-AI';
        Alert.alert(
            'Phone Support',
            `Call us at: ${phoneNumber}\n\nHours: Monday-Friday, 9 AM - 6 PM EST`,
            [
                { text: 'Call Now', onPress: () => Linking.openURL(`tel:${phoneNumber}`) },
                { text: 'Cancel', style: 'cancel' }
            ]
        );
    };

    const handleReportBug = () => {
        Alert.alert(
            'Report a Bug',
            'Help us improve PhytoVigil by reporting bugs or issues you encounter.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Report Bug',
                    onPress: () => {
                        Alert.alert('Bug Report', 'Thank you! Your bug report has been submitted. Our team will investigate the issue.');
                        onClose();
                    }
                }
            ]
        );
    };

    const handleUserGuide = () => {
        Alert.alert(
            'User Guide',
            'Access our comprehensive user guide and tutorials.',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Open Guide', onPress: () => Alert.alert('User Guide', 'Opening user guide...') }
            ]
        );
    };

    const handleCommunity = () => {
        Alert.alert(
            'Community Forum',
            'Join our community of plant enthusiasts to share tips and get advice.',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Join Community', onPress: () => Alert.alert('Community', 'Opening community forum...') }
            ]
        );
    };

    const handleFeedback = () => {
        Alert.alert(
            'Send Feedback',
            'We value your feedback! Help us improve PhytoVigil.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Send Feedback',
                    onPress: () => {
                        Alert.alert('Feedback Sent', 'Thank you for your feedback! We appreciate your input.');
                        onClose();
                    }
                }
            ]
        );
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <View className="flex-1 bg-white">
                {/* Header */}
                <View className="flex-row items-center justify-between p-6 border-b border-gray-100">
                    <Text className="text-xl font-bold text-gray-900">Help & Support</Text>
                    <TouchableOpacity onPress={onClose}>
                        <X color="#8E8E93" size={24} />
                    </TouchableOpacity>
                </View>

                <ScrollView className="flex-1 px-6">
                    <View className="py-6">
                        <Text className="text-base text-gray-600 mb-6">
                            Get help, report issues, or contact our support team
                        </Text>

                        {/* Quick Help */}
                        <View className="mb-8">
                            <Text className="text-lg font-semibold text-gray-900 mb-4">Quick Help</Text>

                            <HelpItem
                                icon={<Book color="#00C896" size={24} />}
                                title="FAQ"
                                description="Find answers to common questions"
                                onPress={handleFAQ}
                            />

                            <HelpItem
                                icon={<ExternalLink color="#00C896" size={24} />}
                                title="User Guide"
                                description="Complete guide to using PhytoVigil"
                                onPress={handleUserGuide}
                            />
                        </View>

                        {/* Contact Support */}
                        <View className="mb-8">
                            <Text className="text-lg font-semibold text-gray-900 mb-4">Contact Support</Text>

                            <HelpItem
                                icon={<MessageCircle color="#00C896" size={24} />}
                                title="Contact Support"
                                description="Get help from our support team"
                                onPress={handleContactSupport}
                            />

                            <HelpItem
                                icon={<Bug color="#FF9500" size={24} />}
                                title="Report a Bug"
                                description="Report technical issues or bugs"
                                onPress={handleReportBug}
                            />

                            <HelpItem
                                icon={<Mail color="#00C896" size={24} />}
                                title="Send Feedback"
                                description="Share your thoughts and suggestions"
                                onPress={handleFeedback}
                            />
                        </View>

                        {/* Community */}
                        <View className="mb-8">
                            <Text className="text-lg font-semibold text-gray-900 mb-4">Community</Text>

                            <HelpItem
                                icon={<MessageCircle color="#00C896" size={24} />}
                                title="Community Forum"
                                description="Connect with other plant enthusiasts"
                                onPress={handleCommunity}
                            />
                        </View>

                        {/* Contact Info */}
                        <View className="bg-gray-50 p-4 rounded-xl">
                            <Text className="text-sm text-gray-800 font-medium mb-2">Contact Information</Text>
                            <Text className="text-xs text-gray-600 mb-1">Email: support@phytovigil.com</Text>
                            <Text className="text-xs text-gray-600 mb-1">Phone: +1-800-PHYTO-AI</Text>
                            <Text className="text-xs text-gray-600">Hours: Monday-Friday, 9 AM - 6 PM EST</Text>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </Modal>
    );
}

function HelpItem({
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