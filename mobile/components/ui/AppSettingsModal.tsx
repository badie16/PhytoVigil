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
import { X, Globe, Palette, Database, Smartphone, Volume2, Vibrate } from 'lucide-react-native';
import Header from './header';

interface AppSettingsModalProps {
    visible: boolean;
    onClose: () => void;
    initialSettings: {
        language: string;
        darkMode: boolean;
        autoSync: boolean;
        soundEffects: boolean;
        hapticFeedback: boolean;
    };
    onSave: (settings: any) => void;
}

export default function AppSettingsModal({
    visible,
    onClose,
    initialSettings,
    onSave,
}: AppSettingsModalProps) {
    const [settings, setSettings] = useState(initialSettings);

    const handleSave = () => {
        onSave(settings);
        Alert.alert('Success', 'App settings updated successfully');
        onClose();
    };

    const updateSetting = (key: string, value: boolean | string) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleLanguageChange = () => {
        Alert.alert(
            'Language',
            'Select your preferred language:',
            [
                { text: 'English', onPress: () => updateSetting('language', 'English') },
                { text: 'Français', onPress: () => updateSetting('language', 'Français') },
                { text: 'Español', onPress: () => updateSetting('language', 'Español') },
                { text: 'Cancel', style: 'cancel' }
            ]
        );
    };

    const handleClearCache = () => {
        Alert.alert(
            'Clear Cache',
            'This will clear temporary files and may improve app performance. Continue?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear Cache',
                    onPress: () => Alert.alert('Cache Cleared', 'App cache has been cleared successfully.')
                }
            ]
        );
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <View className="flex-1 bg-white">
                {/* Header */}
                <Header onBack={onClose} title='App Settings' isClose></Header>

                <ScrollView className="flex-1 px-6">
                    <View className="py-6">
                        <Text className="text-base text-gray-600 mb-6">
                            Customize your app experience and preferences
                        </Text>

                        {/* Appearance */}
                        <View className="mb-8">
                            <Text className="text-lg font-semibold text-gray-900 mb-4">Appearance</Text>

                            <AppSettingItem
                                icon={<Globe color="#00C896" size={24} />}
                                title="Language"
                                description={`Current: ${settings.language}`}
                                onPress={handleLanguageChange}
                                showToggle={false}
                            />

                            <AppSettingItem
                                icon={<Palette color="#00C896" size={24} />}
                                title="Dark Mode"
                                description="Use dark theme for better night viewing"
                                value={settings.darkMode}
                                onToggle={(value) => updateSetting('darkMode', value)}
                                showToggle={true}
                            />
                        </View>

                        {/* Performance */}
                        <View className="mb-8">
                            <Text className="text-lg font-semibold text-gray-900 mb-4">Performance</Text>

                            <AppSettingItem
                                icon={<Database color="#00C896" size={24} />}
                                title="Auto Sync"
                                description="Automatically sync data when connected to WiFi"
                                value={settings.autoSync}
                                onToggle={(value) => updateSetting('autoSync', value)}
                                showToggle={true}
                            />

                            <AppSettingItem
                                icon={<Smartphone color="#00C896" size={24} />}
                                title="Clear Cache"
                                description="Free up storage space by clearing temporary files"
                                onPress={handleClearCache}
                                showToggle={false}
                            />
                        </View>
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

function AppSettingItem({
    icon,
    title,
    description,
    value,
    onToggle,
    onPress,
    showToggle = false,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    value?: boolean;
    onToggle?: (value: boolean) => void;
    onPress?: () => void;
    showToggle?: boolean;
}) {
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={showToggle}
            className="flex-row items-center py-4 border-b border-gray-100 active:bg-surface"
        >
            <View className="mr-4">{icon}</View>
            <View className="flex-1">
                <Text className="text-base font-medium text-gray-900 mb-1">{title}</Text>
                <Text className="text-sm text-gray-600">{description}</Text>
            </View>
            {showToggle && onToggle && (
                <Switch
                    value={value}
                    onValueChange={onToggle}
                    trackColor={{ false: '#E5E7EB', true: '#00C896' }}
                    thumbColor={value ? '#FFFFFF' : '#9CA3AF'}
                />
            )}
        </TouchableOpacity>
    );
}