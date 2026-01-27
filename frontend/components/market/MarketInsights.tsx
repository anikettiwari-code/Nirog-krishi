import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';

export const MarketInsights = () => {
    return (
        <View style={styles.insightCard}>
            <Text style={styles.insightTitle}>Market Insights</Text>
            <View style={styles.insightItem}>
                <View style={styles.bullet} />
                <Text style={styles.insightText}>Best time to sell: Jan 30</Text>
            </View>
            <View style={styles.insightItem}>
                <View style={styles.bullet} />
                <Text style={styles.insightText}>High demand expected due to wedding season</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    insightCard: {
        backgroundColor: COLORS.accentPurple + '10', // 10% opacity
        padding: SPACING.lg,
        borderRadius: RADIUS.lg,
        marginTop: SPACING.sm,
        borderWidth: 1,
        borderColor: COLORS.accentPurple + '30',
    },
    insightTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.accentPurple,
        marginBottom: SPACING.sm,
    },
    insightItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    bullet: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: COLORS.accentPurple,
        marginRight: SPACING.sm,
    },
    insightText: {
        fontSize: 14,
        color: COLORS.neutral600,
    },
});
