import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CheckCircle } from 'lucide-react-native';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';

interface DetectionCardProps {
    diseaseName: string;
    confidence: number;
    weatherConfirmed?: boolean;
}

export const DetectionCard = ({ diseaseName, confidence, weatherConfirmed }: DetectionCardProps) => {
    return (
        <View style={styles.card}>
            <View style={styles.badge}>
                <Text style={styles.badgeText}>Disease Detected</Text>
            </View>

            <View style={styles.diseaseInfo}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.diseaseName}>{diseaseName}</Text>
                    <View style={styles.confidenceContainer}>
                        <View style={styles.confidenceBarBg}>
                            <View style={[styles.confidenceBarFill, { width: `${confidence}%` }]} />
                        </View>
                        <Text style={styles.confidenceText}>{confidence}%</Text>
                    </View>
                </View>
                <View style={styles.thumbnailPlaceholder} />
            </View>

            {weatherConfirmed && (
                <View style={styles.weatherConfirm}>
                    <CheckCircle color={COLORS.secondary} size={16} />
                    <Text style={styles.weatherConfirmText}>Confirmed by Weather Data</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.white,
        borderRadius: RADIUS.xl,
        padding: SPACING.lg,
        marginBottom: SPACING.lg,
        ...SHADOWS.md,
    },
    badge: {
        backgroundColor: '#fee2e2',
        paddingHorizontal: SPACING.sm,
        paddingVertical: 4,
        borderRadius: RADIUS.full,
        alignSelf: 'flex-start',
        marginBottom: SPACING.md,
    },
    badgeText: {
        color: COLORS.danger,
        fontSize: 12,
        fontWeight: '600',
        fontFamily: 'Inter_600SemiBold',
    },
    diseaseInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.md,
    },
    diseaseName: {
        fontSize: 24,
        fontWeight: '700',
        color: COLORS.neutral900,
        marginBottom: SPACING.sm,
        fontFamily: 'Inter_700Bold',
    },
    confidenceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    confidenceBarBg: {
        width: 100,
        height: 8,
        backgroundColor: COLORS.neutral100,
        borderRadius: RADIUS.full,
        marginRight: SPACING.sm,
        overflow: 'hidden',
    },
    confidenceBarFill: {
        height: '100%',
        backgroundColor: COLORS.primary,
    },
    confidenceText: {
        color: COLORS.primary,
        fontWeight: '700',
        fontSize: 14,
    },
    thumbnailPlaceholder: {
        width: 80,
        height: 80,
        backgroundColor: COLORS.neutral100,
        borderRadius: RADIUS.lg,
    },
    weatherConfirm: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#eff6ff',
        padding: SPACING.sm,
        borderRadius: RADIUS.md,
        borderWidth: 1,
        borderColor: '#bfdbfe',
    },
    weatherConfirmText: {
        marginLeft: SPACING.sm,
        color: COLORS.secondary,
        fontWeight: '600',
        fontSize: 12,
    },
});
