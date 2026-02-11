import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TrendingUp } from 'lucide-react-native';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';

export const FeaturedCropCard = () => {
    return (
        <View style={styles.featuredCard}>
            <View style={styles.featuredHeader}>
                <Text style={styles.featuredTitle}>Your Crop: Potato</Text>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>Featured</Text>
                </View>
            </View>

            <View style={styles.priceRow}>
                <View>
                    <Text style={styles.priceLabel}>Current Price</Text>
                    <Text style={styles.priceValue}>₹1,450</Text>
                    <Text style={styles.priceUnit}>per quintal</Text>
                </View>
                <View style={styles.trendBadge}>
                    <Text style={styles.trendText}>+10% ↑</Text>
                </View>
            </View>

            {/* Simple Chart Visualization */}
            <View style={styles.chartContainer}>
                <View style={styles.chartLine} />
                <View style={styles.chartPoints}>
                    {[20, 40, 30, 60, 50, 80, 70].map((h, i) => (
                        <View key={i} style={[styles.chartPoint, { bottom: `${h}%` as any }]} />
                    ))}
                </View>
                <Text style={styles.chartLabel}>7-Day Trend</Text>
            </View>

            <View style={styles.aiForecast}>
                <TrendingUp color={COLORS.primary} size={20} />
                <View style={{ marginLeft: SPACING.sm }}>
                    <Text style={styles.forecastTitle}>AI Forecast</Text>
                    <Text style={styles.forecastText}>Expected to rise 8% in next 3 days</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    featuredCard: {
        backgroundColor: COLORS.white,
        borderRadius: RADIUS.xl,
        padding: SPACING.lg,
        marginBottom: SPACING.xl,
        ...SHADOWS.md,
        borderWidth: 1,
        borderColor: COLORS.primaryPale,
    },
    featuredHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.md,
    },
    featuredTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.neutral900,
        fontFamily: 'Inter_600SemiBold',
    },
    badge: {
        backgroundColor: COLORS.primaryPale,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: RADIUS.sm,
    },
    badgeText: {
        color: COLORS.primary,
        fontSize: 10,
        fontWeight: '700',
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    priceLabel: {
        fontSize: 12,
        color: COLORS.neutral600,
    },
    priceValue: {
        fontSize: 32,
        fontWeight: '700',
        color: COLORS.neutral900,
        fontFamily: 'Inter_700Bold',
    },
    priceUnit: {
        fontSize: 12,
        color: COLORS.neutral600,
    },
    trendBadge: {
        backgroundColor: COLORS.primaryPale,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs,
        borderRadius: RADIUS.full,
    },
    trendText: {
        color: COLORS.primary,
        fontWeight: '700',
    },
    chartContainer: {
        height: 100,
        backgroundColor: COLORS.neutral50,
        borderRadius: RADIUS.md,
        marginBottom: SPACING.md,
        position: 'relative',
        justifyContent: 'center',
        paddingHorizontal: SPACING.md,
    },
    chartLine: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: '50%',
        height: 1,
        backgroundColor: COLORS.neutral100,
    },
    chartPoints: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: '60%',
        alignItems: 'flex-end',
    },
    chartPoint: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.primary,
    },
    chartLabel: {
        position: 'absolute',
        bottom: 4,
        right: 8,
        fontSize: 10,
        color: COLORS.neutral600,
    },
    aiForecast: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#eff6ff',
        padding: SPACING.md,
        borderRadius: RADIUS.lg,
    },
    forecastTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.secondary,
    },
    forecastText: {
        fontSize: 12,
        color: COLORS.neutral600,
    },
});
