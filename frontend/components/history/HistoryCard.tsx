import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar, AlertCircle, MapPin, TrendingUp, Eye, CheckCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';

interface HistoryItemProps {
    date: string;
    status: 'Treating' | 'Resolved';
    diseaseName: string;
    location: string;
    severity?: 'High' | 'Medium' | 'Low';
    confidence?: string;
    trend: 'Spreading' | 'Healed' | 'Stable';
}

export const HistoryCard = ({ date, status, diseaseName, location, severity, confidence, trend }: HistoryItemProps) => {
    const router = useRouter();
    const isTreating = status === 'Treating';
    const isLowSeverity = severity === 'Low';
    // Simplified logic for demo, can be expanded

    return (
        <View style={styles.historyCard}>
            <View style={styles.cardHeader}>
                <View style={styles.dateRow}>
                    <Calendar color={COLORS.neutral600} size={14} />
                    <Text style={styles.dateText}>{date}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: isTreating ? '#fef2f2' : '#f0fdf4' }]}>
                    {isTreating ? <AlertCircle color={COLORS.danger} size={12} /> : <CheckCircle color={COLORS.primary} size={12} />}
                    <Text style={[styles.statusText, { color: isTreating ? COLORS.danger : COLORS.primary }]}>{status}</Text>
                </View>
            </View>

            <Text style={styles.diseaseName}>{diseaseName}</Text>

            <View style={styles.locationRow}>
                <MapPin color={COLORS.neutral600} size={14} />
                <Text style={styles.locationText}>{location}</Text>
            </View>

            {severity && (
                <View style={styles.severityRow}>
                    <View style={[styles.severityBadge, { backgroundColor: '#fee2e2' }]}>
                        <Text style={[styles.severityText, { color: COLORS.danger }]}>{severity} Severity</Text>
                    </View>
                    {confidence && <Text style={styles.confidenceText}>{confidence} confidence</Text>}
                </View>
            )}

            <View style={styles.divider} />

            <View style={styles.cardFooter}>
                <View style={styles.trendRow}>
                    {trend === 'Spreading' ? <TrendingUp color={COLORS.danger} size={16} /> : <CheckCircle color={COLORS.primary} size={16} />}
                    <Text style={[styles.trendLabel, { color: trend === 'Spreading' ? COLORS.danger : COLORS.primary }]}>{trend}</Text>
                </View>
                <TouchableOpacity style={styles.viewButton} onPress={() => router.push('/diagnosis')}>
                    <Eye color={COLORS.neutral600} size={16} />
                    <Text style={styles.viewButtonText}>View</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    historyCard: {
        backgroundColor: COLORS.white,
        borderRadius: RADIUS.lg,
        padding: SPACING.lg,
        marginBottom: SPACING.md,
        ...SHADOWS.sm,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.sm,
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateText: {
        fontSize: 12,
        color: COLORS.neutral600,
        marginLeft: SPACING.xs,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: RADIUS.full,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '700',
        marginLeft: 4,
    },
    diseaseName: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.neutral900,
        marginBottom: SPACING.xs,
        fontFamily: 'Inter_700Bold',
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    locationText: {
        fontSize: 14,
        color: COLORS.neutral600,
        marginLeft: SPACING.xs,
    },
    severityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    severityBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: RADIUS.sm,
        marginRight: SPACING.md,
    },
    severityText: {
        fontSize: 12,
        fontWeight: '600',
    },
    confidenceText: {
        fontSize: 12,
        color: COLORS.neutral600,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.neutral100,
        marginBottom: SPACING.md,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    trendRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    trendLabel: {
        marginLeft: SPACING.xs,
        fontWeight: '600',
        fontSize: 14,
    },
    viewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.neutral100,
        paddingHorizontal: SPACING.md,
        paddingVertical: 6,
        borderRadius: RADIUS.full,
    },
    viewButtonText: {
        marginLeft: SPACING.xs,
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.neutral600,
    },
});
