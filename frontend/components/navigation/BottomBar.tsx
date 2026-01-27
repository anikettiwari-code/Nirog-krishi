import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Home, Clock, TrendingUp, Map as MapIcon, Settings, Camera } from 'lucide-react-native';
import { COLORS, SPACING, SHADOWS, RADIUS } from '../../constants/theme';

interface BottomBarProps {
    activePage?: 'home' | 'history' | 'market' | 'map' | 'settings';
}

export const BottomBar = ({ activePage = 'home' }: BottomBarProps) => {
    const router = useRouter();

    return (
        <>
            {/* Floating Action Button */}
            <View style={styles.fabWrapper}>
                <TouchableOpacity style={styles.fab} onPress={() => router.push('/scanner')}>
                    <Camera color={COLORS.white} size={32} />
                </TouchableOpacity>
                <Text style={styles.fabLabel}>Start Diagnosis</Text>
            </View>

            {/* Bottom Navigation Bar */}
            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.navItem} onPress={() => router.push('/dashboard')}>
                    <Home color={activePage === 'home' ? COLORS.primary : COLORS.neutral600} size={24} />
                    <Text style={[styles.navText, { color: activePage === 'home' ? COLORS.primary : COLORS.neutral600 }]}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => router.push('/history')}>
                    <Clock color={activePage === 'history' ? COLORS.primary : COLORS.neutral600} size={24} />
                    <Text style={[styles.navText, { color: activePage === 'history' ? COLORS.primary : COLORS.neutral600 }]}>History</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => router.push('/market')}>
                    <TrendingUp color={activePage === 'market' ? COLORS.primary : COLORS.neutral600} size={24} />
                    <Text style={[styles.navText, { color: activePage === 'market' ? COLORS.primary : COLORS.neutral600 }]}>Market</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => router.push('/community')}>
                    <MapIcon color={activePage === 'map' ? COLORS.primary : COLORS.neutral600} size={24} />
                    <Text style={[styles.navText, { color: activePage === 'map' ? COLORS.primary : COLORS.neutral600 }]}>Map</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => router.push('/settings')}>
                    <Settings color={activePage === 'settings' ? COLORS.primary : COLORS.neutral600} size={24} />
                    <Text style={[styles.navText, { color: activePage === 'settings' ? COLORS.primary : COLORS.neutral600 }]}>Settings</Text>
                </TouchableOpacity>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    fabWrapper: {
        position: 'absolute',
        bottom: 90, // Above bottom bar
        alignSelf: 'center',
        alignItems: 'center',
        zIndex: 20,
    },
    fab: {
        width: 64,
        height: 64,
        borderRadius: RADIUS.full,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: COLORS.neutral50,
        ...SHADOWS.lg,
        marginBottom: 4,
    },
    fabLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.primary,
        fontFamily: 'Inter_600SemiBold',
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 80,
        backgroundColor: COLORS.white,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        paddingBottom: 20, // Safe area
        borderTopWidth: 1,
        borderTopColor: COLORS.neutral100,
        ...SHADOWS.lg,
    },
    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    navText: {
        fontSize: 10,
        marginTop: 4,
        fontFamily: 'Inter_600SemiBold',
        color: COLORS.neutral600,
    },
});
