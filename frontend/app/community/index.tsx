import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Share2 } from 'lucide-react-native';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';
import { StatusBar } from 'expo-status-bar';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { CommunityStats } from '../../components/community/CommunityStats';
import { MapVisualization } from '../../components/community/MapVisualization';
import { OutbreakAlert } from '../../components/community/OutbreakAlert';
import { CommunityPost } from '../../components/community/CommunityPost';
import { BottomBar } from '../../components/navigation/BottomBar';

export default function CommunityMap() {
    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <ScreenHeader title="Community Map" />

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* Stats */}
                <CommunityStats />

                {/* Map Mock */}
                <MapVisualization />

                <Text style={styles.sectionTitle}>Nearby Outbreaks</Text>

                <OutbreakAlert
                    diseaseTitle="Late Blight"
                    distance="2.5 km North"
                    reports={8}
                    daysAgo={2}
                    riskLevel="High"
                />

                <Text style={styles.sectionTitle}>Recent Alerts</Text>

                <CommunityPost
                    userName="Ramesh Kumar"
                    location="Kothrud, Pune"
                    content="Late blight spotted in my northern potato field. Spreading fast due to humidity. Be careful!"
                    replies={12}
                    timeAgo="2 hours ago"
                />

                <TouchableOpacity style={styles.shareButton}>
                    <Share2 color={COLORS.white} size={20} />
                    <Text style={styles.shareButtonText}>Share New Alert</Text>
                </TouchableOpacity>

                <View style={{ height: 120 }} />
            </ScrollView>

            <BottomBar activePage="map" />
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
    shareButton: {
        flexDirection: 'row',
        backgroundColor: COLORS.accentOrange,
        padding: SPACING.md,
        borderRadius: RADIUS.lg,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: SPACING.md,
        marginBottom: SPACING.xl,
    },
    shareButtonText: {
        color: COLORS.white,
        fontWeight: '700',
        marginLeft: SPACING.sm,
    },
});
