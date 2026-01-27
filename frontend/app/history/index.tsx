import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, Image } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import { StatusBar } from 'expo-status-bar';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { BottomBar } from '../../components/navigation/BottomBar';
import { Leaf, AlertTriangle, CheckCircle, Clock, Trash2, ChevronRight } from 'lucide-react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { StorageService, ScanRecord } from '../../services/StorageService';

export default function FarmHistory() {
    const router = useRouter();
    const [scans, setScans] = useState<ScanRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [stats, setStats] = useState({ total: 0, healthy: 0, diseased: 0 });

    const loadHistory = async () => {
        const history = await StorageService.getScanHistory();
        const userStats = await StorageService.getUserStats();
        setScans(history);
        setStats(userStats);
        setIsLoading(false);
        setRefreshing(false);
    };

    useFocusEffect(
        useCallback(() => {
            loadHistory();
        }, [])
    );

    const clearHistory = async () => {
        await StorageService.clearScanHistory();
        setScans([]);
        setStats({ total: 0, healthy: 0, diseased: 0 });
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    };

    const severityColor = (s?: string) => {
        switch (s?.toLowerCase()) {
            case 'mild': return '#22C55E';
            case 'moderate': return '#F59E0B';
            case 'severe': return '#EF4444';
            default: return '#6B7280';
        }
    };

    const handleScanPress = (scan: ScanRecord) => {
        router.push({
            pathname: '/diagnosis',
            params: {
                scanId: scan.id,
                analysis: scan.analysisResult,
                imageBase64: scan.imageBase64,
            }
        });
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <View style={styles.headerRow}>
                <ScreenHeader title="Scan History" />
                {scans.length > 0 && (
                    <TouchableOpacity onPress={clearHistory} style={styles.clearBtn}>
                        <Trash2 color="#EF4444" size={20} />
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadHistory(); }} />}
            >
                {/* Stats */}
                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <Text style={styles.statNum}>{stats.total}</Text>
                        <Text style={styles.statLabel}>Total</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={[styles.statNum, { color: '#22C55E' }]}>{stats.healthy}</Text>
                        <Text style={styles.statLabel}>Healthy</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={[styles.statNum, { color: '#EF4444' }]}>{stats.diseased}</Text>
                        <Text style={styles.statLabel}>Diseased</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Recent Scans</Text>

                {isLoading ? (
                    <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
                ) : scans.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Leaf color="#9CA3AF" size={48} />
                        <Text style={styles.emptyText}>No scans yet</Text>
                        <Text style={styles.emptySubtext}>Start scanning to see your history</Text>
                        <TouchableOpacity style={styles.scanBtn} onPress={() => router.push('/scanner')}>
                            <Text style={styles.scanBtnText}>Scan Now</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    scans.map((scan) => (
                        <TouchableOpacity
                            key={scan.id}
                            style={styles.card}
                            onPress={() => handleScanPress(scan)}
                            activeOpacity={0.7}
                        >
                            {/* Thumbnail */}
                            {scan.imageBase64 && (
                                <Image
                                    source={{ uri: `data:${scan.imageMimeType};base64,${scan.imageBase64}` }}
                                    style={styles.thumbnail}
                                />
                            )}

                            <View style={styles.cardContent}>
                                <View style={styles.cardHeader}>
                                    {scan.isHealthy ? (
                                        <CheckCircle color="#22C55E" size={18} />
                                    ) : (
                                        <AlertTriangle color={severityColor(scan.severity)} size={18} />
                                    )}
                                    <Text style={styles.plantName} numberOfLines={1}>
                                        {scan.plantType || 'Unknown Plant'}
                                    </Text>
                                </View>

                                {!scan.isHealthy && scan.diseaseName && (
                                    <Text style={styles.disease} numberOfLines={1}>{scan.diseaseName}</Text>
                                )}

                                <View style={styles.cardFooter}>
                                    <View style={styles.dateRow}>
                                        <Clock color="#9CA3AF" size={12} />
                                        <Text style={styles.dateText}>{formatDate(scan.createdAt)} • {formatTime(scan.createdAt)}</Text>
                                    </View>
                                    <View style={[styles.badge, { backgroundColor: (scan.isHealthy ? '#22C55E' : severityColor(scan.severity)) + '20' }]}>
                                        <Text style={[styles.badgeText, { color: scan.isHealthy ? '#22C55E' : severityColor(scan.severity) }]}>
                                            {scan.isHealthy ? 'Healthy' : scan.severity || 'Unknown'}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <ChevronRight color="#9CA3AF" size={20} />
                        </TouchableOpacity>
                    ))
                )}
                <View style={{ height: 120 }} />
            </ScrollView>
            <BottomBar activePage="history" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.neutral50 },
    headerRow: { flexDirection: 'row', alignItems: 'center' },
    clearBtn: { position: 'absolute', right: 20, top: 65, padding: 8 },
    content: { padding: SPACING.lg },
    statsRow: { flexDirection: 'row', gap: 12, marginBottom: SPACING.lg },
    statCard: { flex: 1, backgroundColor: '#fff', borderRadius: RADIUS.lg, padding: SPACING.md, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
    statNum: { fontSize: 24, fontWeight: '800', color: COLORS.primary },
    statLabel: { fontSize: 12, color: '#6B7280', marginTop: 4 },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: SPACING.md, fontFamily: 'Inter_700Bold' },
    emptyState: { alignItems: 'center', paddingVertical: 60 },
    emptyText: { fontSize: 18, fontWeight: '600', color: '#374151', marginTop: 16 },
    emptySubtext: { fontSize: 14, color: '#9CA3AF', marginTop: 4 },
    scanBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: RADIUS.md, marginTop: 20 },
    scanBtnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
    card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: RADIUS.lg, marginBottom: SPACING.sm, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2, paddingRight: 12 },
    thumbnail: { width: 70, height: 70, backgroundColor: '#E5E7EB' },
    cardContent: { flex: 1, padding: SPACING.sm, paddingLeft: SPACING.md },
    cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    plantName: { fontSize: 15, fontWeight: '600', color: '#111827', flex: 1 },
    disease: { fontSize: 13, color: '#6B7280', marginTop: 2 },
    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
    dateRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    dateText: { fontSize: 11, color: '#9CA3AF' },
    badge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
    badgeText: { fontSize: 10, fontWeight: '600' },
});
