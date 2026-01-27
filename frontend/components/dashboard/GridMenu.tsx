import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Clock, TrendingUp, MapPin, MessageSquare } from 'lucide-react-native';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';

interface GridMenuItem {
    title: string;
    badge: string;
    badgeColor: string;
    badgeTextColor: string;
    icon: any;
    iconBg: string;
    iconColor: string;
    route: string;
}

export const GridMenu = () => {
    const router = useRouter();

    const menuItems: GridMenuItem[] = [
        {
            title: 'My Farm',
            badge: '12 Scans',
            badgeColor: COLORS.neutral100,
            badgeTextColor: COLORS.neutral600,
            icon: Clock,
            iconBg: '#dcfce7', // Light Green
            iconColor: COLORS.primary,
            route: '/history'
        },
        {
            title: 'Market Prices',
            badge: '↑ 10%',
            badgeColor: '#dcfce7',
            badgeTextColor: COLORS.primary,
            icon: TrendingUp,
            iconBg: '#dbeafe', // Light Blue
            iconColor: COLORS.secondary,
            route: '/market'
        },
        {
            title: 'Community',
            badge: '3 Alerts',
            badgeColor: '#fee2e2',
            badgeTextColor: COLORS.danger,
            icon: MapPin,
            iconBg: '#ffedd5', // Light Orange
            iconColor: COLORS.accentOrange,
            route: '/community'
        },
        {
            title: 'Agri-Assistant',
            badge: 'AI Chat',
            badgeColor: COLORS.neutral100,
            badgeTextColor: COLORS.neutral600,
            icon: MessageSquare,
            iconBg: '#f3e8ff', // Light Purple
            iconColor: COLORS.accentPurple,
            route: '/assistant'
        },
    ];

    return (
        <View style={styles.gridContainer}>
            {menuItems.map((item, index) => (
                <TouchableOpacity
                    key={index}
                    style={styles.gridCard}
                    onPress={() => router.push(item.route as any)}
                >
                    <View style={[styles.iconContainer, { backgroundColor: item.iconBg }]}>
                        <item.icon color={item.iconColor} size={28} />
                    </View>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <View style={[styles.badge, { backgroundColor: item.badgeColor }]}>
                        <Text style={[styles.badgeText, { color: item.badgeTextColor }]}>{item.badge}</Text>
                    </View>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    gridCard: {
        width: '48%',
        backgroundColor: COLORS.white,
        borderRadius: RADIUS.xl,
        padding: SPACING.lg,
        marginBottom: SPACING.md,
        alignItems: 'center',
        ...SHADOWS.sm,
        borderWidth: 1,
        borderColor: COLORS.neutral100,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: RADIUS.full,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.neutral900,
        marginBottom: SPACING.sm,
        fontFamily: 'Inter_600SemiBold',
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: RADIUS.full,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '700',
    },
});
