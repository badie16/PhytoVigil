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
import { X, MapPin, Navigation, Globe, Clock } from 'lucide-react-native';
import Header from './header';

interface LocationModalProps {
    visible: boolean;
    onClose: () => void;
    initialSettings: {
        locationServices: boolean;
        preciseLocation: boolean;
        weatherData: boolean;
        locationHistory: boolean;
    };
    onSave: (settings: any) => void;
}

export default function LocationModal({
    visible,
    onClose,
    initialSettings,
    onSave,
}: LocationModalProps) {
    const [settings, setSettings] = useState(initialSettings);

    const handleSave = () => {
        onSave(settings);
        Alert.alert('Success', 'Location settings updated successfully');
        onClose();
    };

    const updateSetting = (key: string, value: boolean) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <View className="flex-1 bg-white">
                {/* Header */}
               
                <Header onBack={onClose} title='Location Services' isClose></Header>

                <ScrollView className="flex-1 px-6">
                    <View className="py-6">
                        <Text className="text-base text-gray-600 mb-6">
                            Location services help provide better plant care recommendations based on your local climate and conditions
                        </Text>

                        {/* Location Services */}
                        <LocationItem
                            icon={<MapPin color="#00C896" size={24} />}
                            title="Location Services"
                            description="Enable GPS tracking for location-based features"
                            value={settings.locationServices}
                            onToggle={(value) => updateSetting('locationServices', value)}
                        />

                        {/* Precise Location */}
                        <LocationItem
                            icon={<Navigation color="#00C896" size={24} />}
                            title="Precise Location"
                            description="Use exact GPS coordinates for accurate recommendations"
                            value={settings.preciseLocation}
                            onToggle={(value) => updateSetting('preciseLocation', value)}
                            disabled={!settings.locationServices}
                        />

                        {/* Weather Data */}
                        <LocationItem
                            icon={<Globe color="#00C896" size={24} />}
                            title="Weather Data"
                            description="Access local weather for plant care insights"
                            value={settings.weatherData}
                            onToggle={(value) => updateSetting('weatherData', value)}
                            disabled={!settings.locationServices}
                        />

                        {/* Location History */}
                        <LocationItem
                            icon={<Clock color="#00C896" size={24} />}
                            title="Location History"
                            description="Save scan locations for tracking plant health over time"
                            value={settings.locationHistory}
                            onToggle={(value) => updateSetting('locationHistory', value)}
                            disabled={!settings.locationServices}
                        />

                        {/* Privacy Notice */}
                        <View className="bg-blue-50 p-4 rounded-xl mt-6">
                            <Text className="text-sm text-blue-800 font-medium mb-2">Privacy Notice</Text>
                            <Text className="text-xs text-blue-700">
                                Your location data is only used to provide better plant care recommendations and is never shared with third parties. You can disable location services at any time.
                            </Text>
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

function LocationItem({
    icon,
    title,
    description,
    value,
    onToggle,
    disabled = false,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    value: boolean;
    onToggle: (value: boolean) => void;
    disabled?: boolean;
}) {
    return (
        <View className={`flex-row items-center py-4 border-b border-gray-100 ${disabled ? 'opacity-50' : ''}`}>
            <View className="mr-4">{icon}</View>
            <View className="flex-1">
                <Text className="text-base font-medium text-gray-900 mb-1">{title}</Text>
                <Text className="text-sm text-gray-600">{description}</Text>
            </View>
            <Switch
                value={value}
                onValueChange={onToggle}
                disabled={disabled}
                trackColor={{ false: '#E5E7EB', true: '#00C896' }}
                thumbColor={value ? '#FFFFFF' : '#9CA3AF'}
            />
        </View>
    );
}