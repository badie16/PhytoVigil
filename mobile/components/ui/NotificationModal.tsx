import React, { useState } from 'react';
import {
    Alert,
    Modal,
    ScrollView,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { X, Bell, MessageSquare, Shield, Zap } from 'lucide-react-native';
import Header from './header';

interface NotificationModalProps {
    visible: boolean;
    onClose: () => void;
    initialSettings: {
        pushNotifications: boolean;
        emailNotifications: boolean;
        diseaseAlerts: boolean;
        weeklyReports: boolean;
    };
    onSave: (settings: any) => void;
}

export default function NotificationModal({
    visible,
    onClose,
    initialSettings,
    onSave,
}: NotificationModalProps) {
    const [settings, setSettings] = useState(initialSettings);

    const handleSave = () => {
        onSave(settings);
        Alert.alert('Success', 'Notification settings updated successfully');
        onClose();
    };

    const updateSetting = (key: string, value: boolean) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    return ( 
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <View className="flex-1 bg-white">
                {/* Header */}
                <Header onBack={onClose} title='Notifications' isClose></Header>
                <ScrollView className="flex-1 px-6">
                    <View className="py-6">
                        <Text className="text-base text-gray-600 mb-6 ">
                            Manage how you receive notifications and alerts from PhytoVigil
                        </Text>

                        {/* Push Notifications */}
                        <NotificationItem
                            icon={<Bell color="#00C896" size={24} />}
                            title="Push Notifications"
                            description="Receive instant alerts on your device"
                            value={settings.pushNotifications}
                            onToggle={(value) => updateSetting('pushNotifications', value)}
                        />

                        {/* Email Notifications */}
                        <NotificationItem
                            icon={<MessageSquare color="#00C896" size={24} />}
                            title="Email Notifications"
                            description="Get updates and reports via email"
                            value={settings.emailNotifications}
                            onToggle={(value) => updateSetting('emailNotifications', value)}
                        />

                        {/* Disease Alerts */}
                        <NotificationItem
                            icon={<Shield color="#FF9500" size={24} />}
                            title="Disease Alerts"
                            description="Immediate alerts when diseases are detected"
                            value={settings.diseaseAlerts}
                            onToggle={(value) => updateSetting('diseaseAlerts', value)}
                        />

                        {/* Weekly Reports */}
                        <NotificationItem
                            icon={<Zap color="#00C896" size={24} />}
                            title="Weekly Reports"
                            description="Summary of your plant health activities"
                            value={settings.weeklyReports}
                            onToggle={(value) => updateSetting('weeklyReports', value)}
                        />
                    </View>
                </ScrollView>
                {/* Footer */}
                <View className="p-6 border-t border-gray-100">
                    <TouchableOpacity
                        onPress={handleSave}
                        className="bg-primary py-4 rounded-xl items-center"
                    >
                        <Text className="text-white text-base font-semibold">Save Changes</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

function NotificationItem({
    icon,
    title,
    description,
    value,
    onToggle,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    value: boolean;
    onToggle: (value: boolean) => void;
}) {
    return (
        <View className="flex-row items-center py-4 border-b border-gray-100">
            <View className="mr-4">{icon}</View>
            <View className="flex-1">
                <Text className="text-base font-medium text-gray-900 mb-1">{title}</Text>
                <Text className="text-sm text-gray-600">{description}</Text>
            </View>
            <Switch
                value={value}
                onValueChange={onToggle}
                trackColor={{ false: '#E5E7EB', true: '#00C896' }}
                thumbColor={value ? '#FFFFFF' : '#9CA3AF'}
            />
        </View>
    );
}