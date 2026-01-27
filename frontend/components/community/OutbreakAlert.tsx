import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';

interface OutbreakAlertProps {
    diseaseTitle: string;
    distance: string;
    reports: number;
    daysAgo: number;
    riskLevel?: 'High' | 'Medium' | 'Low';
}

export const OutbreakAlert = ({ diseaseTitle, distance, reports, daysAgo, riskLevel = 'High' }: OutbreakAlertProps) => {
    return (
        <View style={styles.alertCard}>
            <View style={styles.alertHeader}>
                <Text style={styles.diseaseTitle}>{diseaseTitle}</Text>
                <View style={styles.riskBadge}>
                    <Text style={styles.riskText}>{riskLevel} Risk</Text>
                </View>
            </View>
            <View style={styles.alertRow}>
                <MapPin color={COLORS.neutral600} size={14} />
                <Text style={styles.alertInfo}>{distance}</Text>
            </View>
            <Text style={styles.alertMeta}>{reports} reports • {daysAgo} days ago</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    alertCard: {
        backgroundColor: '#fef2f2',
        borderRadius: RADIUS.lg,
        padding: SPACING.lg,
        marginBottom: SPACING.xl,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.danger,
    },
    alertHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.xs,
    },
    diseaseTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#991b1b',
    },
    riskBadge: {
        backgroundColor: '#fee2e2',
        paddingHorizontal: 6,
        borderRadius: RADIUS.sm,
    },
    riskText: {
        color: COLORS.danger,
        fontSize: 10,
        fontWeight: '700',
    },
    alertRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.xs,
    },
    alertInfo: {
        marginLeft: SPACING.xs,
        color: COLORS.neutral600,
        fontSize: 14,
    },
    alertMeta: {
        fontSize: 12,
        color: COLORS.neutral600,
        marginTop: SPACING.xs,
    },
});
