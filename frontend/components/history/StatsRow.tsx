import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';

export const StatsRow = () => {
    return (
        <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: '#eff6ff' }]}>
                <Text style={[styles.statValue, { color: COLORS.secondary }]}>12</Text>
                <Text style={styles.statLabel}>Scans</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#fef2f2' }]}>
                <Text style={[styles.statValue, { color: COLORS.danger }]}>2</Text>
                <Text style={styles.statLabel}>Active</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#f0fdf4' }]}>
                <Text style={[styles.statValue, { color: COLORS.primary }]}>10</Text>
                <Text style={styles.statLabel}>Resolved</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.xl,
    },
    statCard: {
        width: '30%',
        padding: SPACING.md,
        borderRadius: RADIUS.lg,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 4,
        fontFamily: 'Inter_700Bold',
    },
    statLabel: {
        fontSize: 12,
        color: COLORS.neutral600,
    },
});
