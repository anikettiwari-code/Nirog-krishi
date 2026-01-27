import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';

interface CropListItemProps {
    cropName: string;
    mandiName: string;
    price: string;
    trendPercentage: string;
    trend: 'up' | 'down';
}

export const CropListItem = ({ cropName, mandiName, price, trendPercentage, trend }: CropListItemProps) => {
    const isUp = trend === 'up';
    const trendColor = isUp ? COLORS.primary : COLORS.danger;
    const trendBg = isUp ? COLORS.primaryPale : '#fee2e2';
    const arrow = isUp ? '↑' : '↓';

    return (
        <View style={styles.cropCard}>
            <View style={styles.cropInfo}>
                <Text style={styles.cropName}>{cropName}</Text>
                <Text style={styles.mandiName}>{mandiName}</Text>
            </View>
            <View style={styles.cropPrice}>
                <Text style={styles.priceValueSmall}>{price}</Text>
                <View style={[styles.trendBadgeSmall, { backgroundColor: trendBg }]}>
                    <Text style={[styles.trendTextSmall, { color: trendColor }]}>
                        {isUp ? '+' : '-'}{trendPercentage} {arrow}
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    cropCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        padding: SPACING.md,
        borderRadius: RADIUS.lg,
        marginBottom: SPACING.md,
        ...SHADOWS.sm,
    },
    cropInfo: {
        flex: 1,
    },
    cropName: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.neutral900,
        fontFamily: 'Inter_600SemiBold',
    },
    mandiName: {
        fontSize: 12,
        color: COLORS.neutral600,
    },
    cropPrice: {
        alignItems: 'flex-end',
    },
    priceValueSmall: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.neutral900,
    },
    trendBadgeSmall: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: RADIUS.sm,
        marginTop: 2,
    },
    trendTextSmall: {
        fontSize: 10,
        fontWeight: '700',
    },
});
