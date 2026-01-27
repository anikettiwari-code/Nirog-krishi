import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS, SPACING } from '../../constants/theme';
import { StatusBar } from 'expo-status-bar';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { FeaturedCropCard } from '../../components/market/FeaturedCropCard';
import { CropListItem } from '../../components/market/CropListItem';
import { MarketInsights } from '../../components/market/MarketInsights';
import { BottomBar } from '../../components/navigation/BottomBar';

export default function MarketPrices() {
    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <ScreenHeader
                title="Market Prices"
                subtitle="📍 Nearest: Pune Mandi"
            />

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* Featured Card */}
                <FeaturedCropCard />

                <Text style={styles.sectionTitle}>All Crops</Text>

                <CropListItem
                    cropName="Tomato"
                    mandiName="Pune Mandi"
                    price="₹2,200"
                    trendPercentage="5%"
                    trend="down"
                />

                <CropListItem
                    cropName="Onion"
                    mandiName="Pune Mandi"
                    price="₹1,800"
                    trendPercentage="15%"
                    trend="up"
                />

                <MarketInsights />

                <View style={{ height: 120 }} />
            </ScrollView>

            <BottomBar activePage="market" />
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
