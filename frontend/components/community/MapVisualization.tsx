import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';

export const MapVisualization = () => {
    return (
        <View style={styles.mapContainer}>
            <View style={styles.mapPlaceholder}>
                <Text style={{ color: COLORS.neutral600 }}>Map Visualization</Text>
                {/* Mock Markers */}
                <View style={[styles.marker, { top: '30%', left: '40%', backgroundColor: COLORS.danger }]} />
                <View style={[styles.marker, { top: '50%', left: '50%', backgroundColor: COLORS.secondary, width: 16, height: 16, borderWidth: 2, borderColor: 'white' }]} />
                <View style={[styles.marker, { top: '60%', left: '70%', backgroundColor: COLORS.warning }]} />
                <View style={[styles.marker, { top: '20%', left: '60%', backgroundColor: COLORS.primary }]} />
            </View>
            <View style={styles.legend}>
                <Text style={styles.legendTitle}>Legend:</Text>
                <View style={styles.legendItem}><View style={[styles.dot, { backgroundColor: COLORS.danger }]} /><Text style={styles.legendText}>High</Text></View>
                <View style={styles.legendItem}><View style={[styles.dot, { backgroundColor: COLORS.warning }]} /><Text style={styles.legendText}>Med</Text></View>
                <View style={styles.legendItem}><View style={[styles.dot, { backgroundColor: COLORS.primary }]} /><Text style={styles.legendText}>Ctrl</Text></View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    mapContainer: {
        backgroundColor: COLORS.neutral100,
        borderRadius: RADIUS.xl,
        overflow: 'hidden',
        marginBottom: SPACING.xl,
        borderWidth: 1,
        borderColor: COLORS.neutral100,
    },
    mapPlaceholder: {
        height: 200,
        backgroundColor: '#e5e7eb',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    marker: {
        position: 'absolute',
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    legend: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        padding: SPACING.md,
        alignItems: 'center',
    },
    legendTitle: {
        fontSize: 12,
        fontWeight: '600',
        marginRight: SPACING.md,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: SPACING.md,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 4,
    },
    legendText: {
        fontSize: 12,
        color: COLORS.neutral600,
    },
});
