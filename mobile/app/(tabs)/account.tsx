import AppSettingsModal from '@/components/ui/AppSettingsModal';
import HelpModal from '@/components/ui/HelpModal';
import LoadingSpinner from '@/components/ui/loading-spinner';
import LocationModal from '@/components/ui/LocationModal';
import NotificationModal from '@/components/ui/NotificationModal';
import PrivacyModal from '@/components/ui/PrivacyModal';
import { useAuth } from '@/contexts/auth-context';
import { router } from 'expo-router';
import { Bell, ChevronRight, CircleHelp as HelpCircle, Leaf, LogOut, MapPin, Settings, Shield, User } from 'lucide-react-native';
import type React from 'react';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import statsService from '@/services/remote/statsService';
import type { ScanStats } from '@/types';

export default function AccountScreen() {
    const { user, isLoading, logout } = useAuth();
    const [scanStats, setScanStats] = useState<ScanStats | null>(null);
    const [statsLoading, setStatsLoading] = useState(true);
    useEffect(() => {
        if (!user && !isLoading) {
            router.replace("/auth/login");
        } else if (user) {
            // Récupérer les stats globales de scan
            setStatsLoading(true);
            statsService.getGlobalScanStats()
                .then((stats) => setScanStats(stats))
                .catch(() => setScanStats(null))
                .finally(() => setStatsLoading(false));
        }
    }, [user, isLoading]);

    // Modal states
    const [showNotificationModal, setShowNotificationModal] = useState(false);
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);
    const [showAppSettingsModal, setShowAppSettingsModal] = useState(false);
    const [showHelpModal, setShowHelpModal] = useState(false);
    
    // Settings states
    const [notificationSettings, setNotificationSettings] = useState({
        pushNotifications: true,
        emailNotifications: false,
        diseaseAlerts: true,
        weeklyReports: true,
    });

    const [locationSettings, setLocationSettings] = useState({
        locationServices: false,
        preciseLocation: false,
        weatherData: false,
        locationHistory: false,
    });

    const [appSettings, setAppSettings] = useState({
        language: 'English',
        darkMode: false,
        autoSync: true,
        soundEffects: true,
        hapticFeedback: true,
    });

    // Get current status for display
    const notificationsEnabled = notificationSettings.pushNotifications;
    const locationEnabled = locationSettings.locationServices;
    const handleSignOut = () => {
        Alert.alert(
            'Sign Out',
            'Are you sure you want to sign out?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Sign Out',
                    style: 'destructive',
                    onPress: async () => {
                        await logout();
                        router.replace('/auth/login');
                    }
                },
            ]
        );
    };

    if (isLoading) {
        return (
            <LoadingSpinner />
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Profile Header */}
                <View className="items-center py-8 px-6">
                    <View className="w-24 h-24 bg-primary/10 rounded-full items-center justify-center mb-4">
                        <User color="#00C896" size={40} />
                    </View>
                    <Text className="text-2xl font-bold text-gray-900 mb-2">{user?.name}</Text>
                    <Text className="text-base text-secondary">Protecting plants with AI</Text>
                </View>

                {/* Stats Cards */}
                <View className="px-6 mb-8">
                    <View className="flex-row justify-between">
                        <StatsCard
                            icon={<Leaf color="#00C896" size={24} />}
                            title="Plants Scanned"
                            value={scanStats?.total_plantScaned?.toString() ?? '0'}
                        />
                        <StatsCard
                            icon={<Shield color="#00C896" size={24} />}
                            title="Diseases Detected"
                            
                            value={scanStats?.diseased_scans?.toString() ?? '0'}
                        />
                    </View>
                </View>
                {/* Settings */}
                <View className="px-6">
                    <Text className="text-lg font-semibold text-gray-900 mb-4">Settings</Text>

                    <SettingItem
                        icon={<Bell color="#8E8E93" size={24} />}
                        title="Notifications"
                        subtitle={`${notificationsEnabled ? 'Enabled' : 'Disabled'} • Tap to configure`}
                        onPress={() => setShowNotificationModal(true)}
                    />

                    <SettingItem
                        icon={<MapPin color="#8E8E93" size={24} />}
                        title="Location Services"
                        subtitle={`${locationEnabled ? 'Enabled' : 'Disabled'} • Tap to configure`}
                        onPress={() => setShowLocationModal(true)}
                    />

                    <SettingItem
                        icon={<Shield color="#8E8E93" size={24} />}
                        title="Privacy & Security"
                        subtitle="Manage your data and privacy settings"
                        onPress={() => setShowPrivacyModal(true)}
                    />

                    <SettingItem
                        icon={<Settings color="#8E8E93" size={24} />}
                        title="App Settings"
                        subtitle={`${appSettings.language} • ${appSettings.darkMode ? 'Dark' : 'Light'} mode`}
                        onPress={() => setShowAppSettingsModal(true)}
                    />

                    <SettingItem
                        icon={<HelpCircle color="#8E8E93" size={24} />}
                        title="Help & Support"
                        subtitle="Get help and contact our support team"
                        onPress={() => setShowHelpModal(true)}
                    />

                    <SettingItem
                        icon={<LogOut color="#FF3B30" size={24} />}
                        title="Sign Out"
                        subtitle="Sign out of your account"
                        onPress={handleSignOut}
                        showChevron={false}
                    />
                </View>

                {/* App Info */}
                <View className="px-6 py-8 mt-8 border-t border-gray-100">
                    <Text className="text-center text-sm text-secondary mb-2">PhytoVigil v1.0.0</Text>
                </View>
            </ScrollView>

            {/* Modals */}
            <NotificationModal
                visible={showNotificationModal}
                onClose={() => setShowNotificationModal(false)}
                initialSettings={notificationSettings}
                onSave={setNotificationSettings}
            />

            <LocationModal
                visible={showLocationModal}
                onClose={() => setShowLocationModal(false)}
                initialSettings={locationSettings}
                onSave={setLocationSettings}
            />

            <PrivacyModal
                visible={showPrivacyModal}
                onClose={() => setShowPrivacyModal(false)}
            />

            <AppSettingsModal
                visible={showAppSettingsModal}
                onClose={() => setShowAppSettingsModal(false)}
                initialSettings={appSettings}
                onSave={setAppSettings}
            />

            <HelpModal
                visible={showHelpModal}
                onClose={() => setShowHelpModal(false)}
            />
        </SafeAreaView>
    );
}

function StatsCard({
    icon,
    title,
    value,
}: {
    icon: React.ReactNode;
    title: string;
    value: string;
}) {
    return (
        <View className="bg-surface rounded-2xl p-4 flex-1 mx-1">
            <View className="flex-row items-center mb-2">
                {icon}
                <Text className="text-2xl font-bold text-gray-900 ml-2">{value}</Text>
            </View>
            <Text className="text-sm text-secondary">{title}</Text>
        </View>
    );
}

function SettingItem({
    icon,
    title,
    subtitle,
    onPress,
    showChevron = true,
}: {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    onPress: () => void;
    showChevron?: boolean;
}) {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="flex-row items-center py-4 border-b border-gray-100 active:bg-surface"
        >
            <View className="mr-4">{icon}</View>
            <View className="flex-1">
                <Text className="text-base font-medium text-gray-900 mb-1">{title}</Text>
                <Text className="text-sm text-secondary">{subtitle}</Text>
            </View>
            {showChevron && <ChevronRight color="#8E8E93" size={20} />}
        </TouchableOpacity>
    );
}