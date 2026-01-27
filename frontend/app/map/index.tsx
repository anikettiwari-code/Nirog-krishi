import React, { useState, useEffect } from 'react';
import {
    View, StyleSheet, Text, TouchableOpacity,
    ActivityIndicator, Platform, Dimensions, ScrollView
} from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import { StatusBar } from 'expo-status-bar';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { MapPin, AlertTriangle, Filter, RefreshCw, Bug, Leaf } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const DEV_BACKEND_URL = Platform.select({
    web: 'http://localhost:5000',
    android: 'http://10.0.2.2:5000',
    default: 'http://localhost:5000',
});

interface Outbreak {
    id: string;
    diseaseName: string;
    plantType: string;
    severity: string;
    address: string;
    reportCount: number;
    reportedAt: string;
    coordinates: [number, number];
}

// Sample outbreak data for demo (when no real data)
const SAMPLE_OUTBREAKS: Outbreak[] = [
    {
        id: '1',
        diseaseName: 'Late Blight',
        plantType: 'Potato',
        severity: 'Severe',
        address: 'Varanasi, Uttar Pradesh',
        reportCount: 15,
        reportedAt: new Date().toISOString(),
        coordinates: [82.9912, 25.3176]
    },
    {
        id: '2',
        diseaseName: 'Powdery Mildew',
        plantType: 'Wheat',
        severity: 'Moderate',
        address: 'Lucknow, Uttar Pradesh',
        reportCount: 8,
        reportedAt: new Date().toISOString(),
        coordinates: [80.9462, 26.8467]
    },
    {
        id: '3',
        diseaseName: 'Bacterial Leaf Blight',
        plantType: 'Rice',
        severity: 'Mild',
        address: 'Patna, Bihar',
        reportCount: 5,
        reportedAt: new Date().toISOString(),
        coordinates: [85.1376, 25.5941]
    },
    {
        id: '4',
        diseaseName: 'Rust Disease',
        plantType: 'Wheat',
        severity: 'Severe',
        address: 'Kanpur, Uttar Pradesh',
        reportCount: 22,
        reportedAt: new Date().toISOString(),
        coordinates: [80.3509, 26.4499]
    },
];

export default function MapScreen() {
    const [outbreaks, setOutbreaks] = useState<Outbreak[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOutbreak, setSelectedOutbreak] = useState<Outbreak | null>(null);
    const [filter, setFilter] = useState<string>('all');

    useEffect(() => {
        fetchOutbreaks();
    }, []);

    const fetchOutbreaks = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${DEV_BACKEND_URL}/outbreaks`);
            const data = await response.json();

            if (data.features && data.features.length > 0) {
                const formatted = data.features.map((f: any) => ({
                    id: f.properties.id,
                    diseaseName: f.properties.diseaseName,
                    plantType: f.properties.plantType,
                    severity: f.properties.severity,
                    address: f.properties.address,
                    reportCount: f.properties.reportCount,
                    reportedAt: f.properties.reportedAt,
                    coordinates: f.geometry.coordinates
                }));
                setOutbreaks(formatted);
            } else {
                // Use sample data for demo
                setOutbreaks(SAMPLE_OUTBREAKS);
            }
        } catch (error) {
            console.log('Using sample data');
            setOutbreaks(SAMPLE_OUTBREAKS);
        } finally {
            setIsLoading(false);
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity?.toLowerCase()) {
            case 'mild': return '#22C55E';
            case 'moderate': return '#F59E0B';
            case 'severe': return '#EF4444';
            default: return '#6B7280';
        }
    };

    const filteredOutbreaks = filter === 'all'
        ? outbreaks
        : outbreaks.filter(o => o.severity.toLowerCase() === filter);

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <ScreenHeader title="Disease Map" />

            {/* Map Placeholder (for web - would use MapView on native) */}
            <View style={styles.mapContainer}>
                <LinearGradient
                    colors={['#D1FAE5', '#A7F3D0', '#6EE7B7']}
                    style={styles.mapPlaceholder}
                >
                    <MapPin color={COLORS.primary} size={48} />
                    <Text style={styles.mapText}>Disease Outbreak Map</Text>
                    <Text style={styles.mapSubtext}>
                        {outbreaks.length} active outbreaks in your region
                    </Text>

                    {/* Mini markers visualization */}
                    <View style={styles.markersContainer}>
                        {filteredOutbreaks.slice(0, 6).map((outbreak, index) => (
                            <TouchableOpacity
                                key={outbreak.id}
                                style={[
                                    styles.miniMarker,
                                    {
                                        backgroundColor: getSeverityColor(outbreak.severity),
                                        left: 30 + (index % 3) * 100,
                                        top: 20 + Math.floor(index / 3) * 60
                                    }
                                ]}
                                onPress={() => setSelectedOutbreak(outbreak)}
                            >
                                <Bug color="#fff" size={14} />
                            </TouchableOpacity>
                        ))}
                    </View>
                </LinearGradient>

                {/* Refresh Button */}
                <TouchableOpacity style={styles.refreshButton} onPress={fetchOutbreaks}>
                    <RefreshCw color="#fff" size={20} />
                </TouchableOpacity>
            </View>

            {/* Filter Buttons */}
            <View style={styles.filterContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {['all', 'mild', 'moderate', 'severe'].map(f => (
                        <TouchableOpacity
                            key={f}
                            style={[
                                styles.filterButton,
                                filter === f && styles.filterButtonActive
                            ]}
                            onPress={() => setFilter(f)}
                        >
                            <Text style={[
                                styles.filterText,
                                filter === f && styles.filterTextActive
                            ]}>
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Outbreak List */}
            <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
                <Text style={styles.listTitle}>Active Outbreaks</Text>

                {isLoading ? (
                    <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
                ) : (
                    filteredOutbreaks.map(outbreak => (
                        <TouchableOpacity
                            key={outbreak.id}
                            style={[
                                styles.outbreakCard,
                                selectedOutbreak?.id === outbreak.id && styles.outbreakCardSelected
                            ]}
                            onPress={() => setSelectedOutbreak(outbreak)}
                        >
                            <View style={[styles.severityIndicator, { backgroundColor: getSeverityColor(outbreak.severity) }]} />

                            <View style={styles.outbreakInfo}>
                                <View style={styles.outbreakHeader}>
                                    <Bug color={getSeverityColor(outbreak.severity)} size={18} />
                                    <Text style={styles.diseaseName}>{outbreak.diseaseName}</Text>
                                </View>

                                <View style={styles.outbreakDetails}>
                                    <View style={styles.detailRow}>
                                        <Leaf color="#6B7280" size={14} />
                                        <Text style={styles.detailText}>{outbreak.plantType}</Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <MapPin color="#6B7280" size={14} />
                                        <Text style={styles.detailText}>{outbreak.address}</Text>
                                    </View>
                                </View>

                                <View style={styles.outbreakFooter}>
                                    <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(outbreak.severity) + '20' }]}>
                                        <Text style={[styles.severityText, { color: getSeverityColor(outbreak.severity) }]}>
                                            {outbreak.severity}
                                        </Text>
                                    </View>
                                    <Text style={styles.reportCount}>{outbreak.reportCount} reports</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>

            {/* Legend */}
            <View style={styles.legend}>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#22C55E' }]} />
                    <Text style={styles.legendText}>Mild</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} />
                    <Text style={styles.legendText}>Moderate</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
                    <Text style={styles.legendText}>Severe</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    mapContainer: {
        height: 200,
        margin: SPACING.md,
        borderRadius: RADIUS.xl,
        overflow: 'hidden',
        position: 'relative',
    },
    mapPlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mapText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#065F46',
        marginTop: SPACING.sm,
    },
    mapSubtext: {
        fontSize: 14,
        color: '#047857',
        marginTop: 4,
    },
    markersContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    miniMarker: {
        position: 'absolute',
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    refreshButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    filterContainer: {
        paddingHorizontal: SPACING.md,
        marginBottom: SPACING.sm,
    },
    filterButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#E5E7EB',
        marginRight: 8,
    },
    filterButtonActive: {
        backgroundColor: COLORS.primary,
    },
    filterText: {
        fontSize: 14,
        color: '#4B5563',
        fontWeight: '500',
    },
    filterTextActive: {
        color: '#fff',
    },
    listContainer: {
        flex: 1,
        paddingHorizontal: SPACING.md,
    },
    listTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
        marginBottom: SPACING.md,
    },
    outbreakCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: RADIUS.lg,
        marginBottom: SPACING.sm,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    outbreakCardSelected: {
        borderWidth: 2,
        borderColor: COLORS.primary,
    },
    severityIndicator: {
        width: 4,
    },
    outbreakInfo: {
        flex: 1,
        padding: SPACING.md,
    },
    outbreakHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    diseaseName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    outbreakDetails: {
        gap: 4,
        marginBottom: 8,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    detailText: {
        fontSize: 13,
        color: '#6B7280',
    },
    outbreakFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    severityBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    severityText: {
        fontSize: 12,
        fontWeight: '600',
    },
    reportCount: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    legend: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: SPACING.md,
        gap: 20,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    legendDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    legendText: {
        fontSize: 12,
        color: '#6B7280',
    },
});
