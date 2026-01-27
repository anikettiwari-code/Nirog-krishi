import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';

interface NotificationItemProps {
    title: string;
    message: string;
    time: string;
    unread: boolean;
    icon: any;
    color: string;
    bgColor: string;
}

export const NotificationItem = ({ title, message, time, unread, icon: Icon, color, bgColor }: NotificationItemProps) => {
    return (
        <View style={[styles.card, { borderLeftColor: color }]}>
            <View style={styles.cardHeader}>
                <View style={[styles.iconContainer, { backgroundColor: bgColor }]}>
                    <Icon color={color} size={20} />
                </View>
                <View style={styles.cardContent}>
                    <View style={styles.titleRow}>
                        <Text style={styles.cardTitle}>{title}</Text>
                        {unread && <View style={styles.unreadDot} />}
                    </View>
                    <Text style={styles.cardMessage}>{message}</Text>
                    <Text style={styles.cardTime}>{time}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.white,
        borderRadius: RADIUS.lg,
        padding: SPACING.md,
        marginBottom: SPACING.md,
        flexDirection: 'row',
        borderLeftWidth: 4,
        ...SHADOWS.sm,
    },
    cardHeader: {
        flexDirection: 'row',
        flex: 1,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.md,
    },
    cardContent: {
        flex: 1,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.neutral900,
        flex: 1,
        marginRight: 8,
        fontFamily: 'Inter_700Bold',
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.primaryLight,
        marginTop: 6,
    },
    cardMessage: {
        fontSize: 13,
        color: COLORS.neutral600,
        lineHeight: 18,
        marginBottom: 8,
        fontFamily: 'Inter_400Regular',
    },
    cardTime: {
        fontSize: 11,
        color: COLORS.neutral600,
    },
});
