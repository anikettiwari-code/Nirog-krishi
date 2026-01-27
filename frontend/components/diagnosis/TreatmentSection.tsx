import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Volume2, AlertTriangle } from 'lucide-react-native';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';

export const TreatmentSection = () => {
    const [activeTab, setActiveTab] = useState<'organic' | 'chemical'>('organic');

    const steps = activeTab === 'organic'
        ? ['Mix 50ml neem oil in 10L water', 'Add 5ml organic soap as sticker', 'Spray early morning or late evening', 'Repeat every 7 days until resolved']
        : ['Use Metalaxyl-based fungicide', 'Wear protective gear', 'Apply 2g per liter of water', 'Avoid harvesting for 5 days post-spray'];

    return (
        <View style={styles.card}>
            {/* Tabs */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'organic' && styles.activeTab]}
                    onPress={() => setActiveTab('organic')}
                >
                    <Text style={[styles.tabText, activeTab === 'organic' && styles.activeTabText]}>Organic</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'chemical' && styles.activeTab]}
                    onPress={() => setActiveTab('chemical')}
                >
                    <Text style={[styles.tabText, activeTab === 'chemical' && styles.activeTabText]}>Chemical</Text>
                </TouchableOpacity>
            </View>

            {/* Content */}
            <View style={styles.tabContent}>
                <View style={styles.treatmentHeader}>
                    <View>
                        <Text style={styles.treatmentTitle}>
                            {activeTab === 'organic' ? 'Bio-Pesticide Treatment' : 'Fungicide Application'}
                        </Text>
                        <Text style={styles.treatmentSubtitle}>
                            {activeTab === 'organic' ? 'Neem-based organic spray' : 'Metalaxyl-based spray'}
                        </Text>
                    </View>
                    <TouchableOpacity style={styles.audioButton}>
                        <Volume2 color={COLORS.neutral900} size={20} />
                    </TouchableOpacity>
                </View>

                <View style={styles.stepsContainer}>
                    {steps.map((step, index) => (
                        <View key={index} style={styles.stepItem}>
                            <View style={[
                                styles.stepNumber,
                                { backgroundColor: activeTab === 'organic' ? COLORS.primaryPale : '#fee2e2' }
                            ]}>
                                <Text style={[
                                    styles.stepNumberText,
                                    { color: activeTab === 'organic' ? COLORS.primary : COLORS.danger }
                                ]}>{index + 1}</Text>
                            </View>
                            <Text style={styles.stepText}>{step}</Text>
                        </View>
                    ))}
                </View>

                {activeTab === 'chemical' && (
                    <View style={styles.warningBox}>
                        <AlertTriangle color={COLORS.danger} size={24} />
                        <View style={{ marginLeft: SPACING.md, flex: 1 }}>
                            <Text style={styles.warningTitle}>Safety Warning</Text>
                            <Text style={styles.warningText}>Use protective gear (mask, gloves). Do not harvest within 5 days of spraying.</Text>
                        </View>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.white,
        borderRadius: RADIUS.xl,
        marginBottom: SPACING.lg,
        ...SHADOWS.md,
        overflow: 'hidden',
    },
    tabContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.neutral100,
    },
    tab: {
        flex: 1,
        paddingVertical: SPACING.md,
        alignItems: 'center',
        borderBottomWidth: 4,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: COLORS.primary,
    },
    tabText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.neutral600,
    },
    activeTabText: {
        color: COLORS.primary,
    },
    tabContent: {
        padding: SPACING.lg,
    },
    treatmentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: SPACING.lg,
    },
    treatmentTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.neutral900,
        marginBottom: 4,
    },
    treatmentSubtitle: {
        fontSize: 14,
        color: COLORS.neutral600,
    },
    audioButton: {
        padding: SPACING.sm,
        backgroundColor: COLORS.neutral100,
        borderRadius: RADIUS.full,
    },
    stepsContainer: {
        marginBottom: SPACING.lg,
    },
    stepItem: {
        flexDirection: 'row',
        marginBottom: SPACING.md,
    },
    stepNumber: {
        width: 32,
        height: 32,
        borderRadius: RADIUS.full,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.md,
    },
    stepNumberText: {
        fontWeight: '700',
        fontSize: 14,
    },
    stepText: {
        flex: 1,
        fontSize: 16,
        color: COLORS.neutral600,
        lineHeight: 24,
    },
    warningBox: {
        flexDirection: 'row',
        backgroundColor: '#fef2f2',
        padding: SPACING.md,
        borderRadius: RADIUS.lg,
        borderWidth: 1,
        borderColor: '#fecaca',
    },
    warningTitle: {
        color: '#7f1d1d',
        fontWeight: '700',
        marginBottom: 2,
        fontSize: 14,
    },
    warningText: {
        color: '#991b1b',
        fontSize: 12,
    },
});
