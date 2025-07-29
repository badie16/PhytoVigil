import {
    ArrowLeft, X
} from 'lucide-react-native';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function Header({
    onBack,
    title,
    isClose = false,
    children,
}: {
    onBack: () => void,
    title: string,
    isClose?: boolean,
    children?: React.ReactNode,
}) {
    return (
        isClose ? (
            <View className="flex-row items-center justify-between p-6 border-b border-gray-100">
                <Text className="text-xl font-bold text-gray-900">{title}</Text>
                <TouchableOpacity
                    onPress={onBack}
                >
                    <X color="#111827" size={24} />
                </TouchableOpacity>
                {children}
            </View>
        ) : (
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={onBack}
                >
                    <ArrowLeft size={24} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{title}</Text>
                {children ? children : <View style={styles.placeholder} />}
            </View>
        )
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 14,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
    },
    placeholder: {
        width: 40,
    },
});