import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS, SPACING } from '../../constants/theme';
import { StatusBar } from 'expo-status-bar';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { StatsRow } from '../../components/history/StatsRow';
import { HistoryCard } from '../../components/history/HistoryCard';
import { BottomBar } from '../../components/navigation/BottomBar';

export default function FarmHistory() {
    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <ScreenHeader title="Farm History" />

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* Stats Row */}
                <StatsRow />

                <Text style={styles.sectionTitle}>Timeline View</Text>

                {/* History Item 1 */}
                <HistoryCard
                    date="Jan 24, 2026"
                    status="Treating"
                    diseaseName="Potato Late Blight"
                    location="Field A - North"
                    severity="High"
                    confidence="98%"
                    trend="Spreading"
                />

                {/* History Item 2 */}
                <HistoryCard
                    date="Jan 10, 2026"
                    status="Resolved"
                    diseaseName="Early Blight"
                    location="Field B - South"
                    trend="Healed"
                />

                <View style={{ height: 120 }} />
            </ScrollView>

            <BottomBar activePage="history" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.neutral50,
    },
    content: {
        padding: SPACING.lg,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.neutral900,
        marginBottom: SPACING.md,
        fontFamily: 'Inter_700Bold',
    },
});
