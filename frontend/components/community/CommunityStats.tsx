import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';

export const CommunityStats = () => {
    return (
        <View style={styles.statsRow}>
            <View style={styles.statItem}>
                <Text style={styles.statNumber}>16</Text>
                <Text style={styles.statLabel}>Active</Text>
            </View>
            <View style={styles.statItem}>
                <Text style={styles.statNumber}>245</Text>
                <Text style={styles.statLabel}>Members</Text>
            </View>
            <View style={styles.statItem}>
                <Text style={styles.statNumber}>3.2 km</Text>
                <Text style={styles.statLabel}>Avg Dist</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.lg,
    },
    statItem: {
        backgroundColor: COLORS.white,
        padding: SPACING.md,
        borderRadius: RADIUS.lg,
        width: '30%',
        alignItems: 'center',
        ...SHADOWS.sm,
    },
    statNumber: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.neutral900,
        fontFamily: 'Inter_700Bold',
    },
    statLabel: {
        fontSize: 12,
        color: COLORS.neutral600,
    },
});
