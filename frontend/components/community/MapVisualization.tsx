import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Layers, ZoomIn, ZoomOut, Navigation2 } from 'lucide-react-native';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';
import { API_CONFIG } from '../../constants/config';
import * as Location from 'expo-location';

export const MapVisualization = () => {
    const [location, setLocation] = useState<{ lat: number, lon: number } | null>(null);
    const [zoom, setZoom] = useState(12);
    const [loading, setLoading] = useState(true);
    const [styleId, setStyleId] = useState('outdoors-v12'); // satelite-v9, outdoors-v12

    useEffect(() => {
        (async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setLoading(false);
                    return;
                }
                const loc = await Location.getCurrentPositionAsync({});
                setLocation({ lat: loc.coords.latitude, lon: loc.coords.longitude });
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleZoomIn = () => setZoom(z => Math.min(z + 1, 20));
    const handleZoomOut = () => setZoom(z => Math.max(z - 1, 1));
    const toggleLayer = () => setStyleId(prev => prev === 'outdoors-v12' ? 'satellite-v9' : 'outdoors-v12');

    // Default Fallback (India Center)
    const lat = location?.lat || 20.5937;
    const lon = location?.lon || 78.9629;

    // Construct Mapbox Static URL
    // Format: https://api.mapbox.com/styles/v1/{username}/{style_id}/static/{lon},{lat},{zoom},{bearing},{pitch}/{width}x{height}?access_token={token}
    const mapUrl = `https://api.mapbox.com/styles/v1/mapbox/${styleId}/static/${lon},${lat},${zoom},0/600x400?access_token=${API_CONFIG.MAPBOX_ACCESS_TOKEN}`;

    return (
        <View style={styles.mapContainer}>
            <View style={styles.imageWrapper}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator color={COLORS.primary} size="large" />
                    </View>
                ) : (
                    <Image
                        source={{ uri: mapUrl }}
                        style={styles.mapImage}
                        resizeMode="cover"
                    />
                )}

                {/* Floating Controls */}
                <View style={styles.layerToggle}>
                    <TouchableOpacity style={styles.controlIconBg} onPress={toggleLayer}>
                        <Layers color={COLORS.neutral900} size={20} />
                    </TouchableOpacity>
                    <Text style={styles.controlText}>{styleId === 'satellite-v9' ? 'Satellite' : 'Map'}</Text>
                </View>

                <View style={styles.zoomControls}>
                    <TouchableOpacity style={[styles.controlIconSmall, styles.borderBottom]} onPress={handleZoomIn}>
                        <ZoomIn color={COLORS.neutral900} size={18} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.controlIconSmall} onPress={handleZoomOut}>
                        <ZoomOut color={COLORS.neutral900} size={18} />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.locateBtn} onPress={() => {
                    // Re-fetch location logic if needed, simplifed for UI
                }}>
                    <Navigation2 color={COLORS.white} size={20} fill={COLORS.white} />
                </TouchableOpacity>
            </View>

            <View style={styles.legend}>
                <View style={styles.legendItem}>
                    <View style={[styles.dot, { backgroundColor: '#EF4444' }]} />
                    <Text style={styles.legendLabel}>Infection</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.dot, { backgroundColor: '#F59E0B' }]} />
                    <Text style={styles.legendLabel}>Risk Area</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.dot, { backgroundColor: '#10B981', borderWidth: 1, borderColor: '#fff' }]} />
                    <Text style={styles.legendLabel}>Healthy</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    mapContainer: {
        backgroundColor: COLORS.white,
        borderRadius: RADIUS.xl,
        overflow: 'hidden',
        marginBottom: SPACING.xl,
        ...SHADOWS.md,
    },
    loadingContainer: {
        height: 250,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageWrapper: {
        height: 250,
        width: '100%',
        position: 'relative',
    },
    mapImage: {
        width: '100%',
        height: '100%',
    },
    layerToggle: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: 'rgba(255,255,255,0.95)',
        padding: 6,
        paddingHorizontal: 10,
        borderRadius: RADIUS.lg,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        ...SHADOWS.sm,
    },
    controlText: {
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.neutral900,
    },
    controlIconBg: {
        width: 28,
        height: 28,
        borderRadius: RADIUS.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
    zoomControls: {
        position: 'absolute',
        right: 12,
        top: '50%',
        marginTop: -40,
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderRadius: RADIUS.md,
        ...SHADOWS.sm,
    },
    controlIconSmall: {
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    borderBottom: {
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    locateBtn: {
        position: 'absolute',
        bottom: 12,
        right: 12,
        backgroundColor: COLORS.primary,
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        ...SHADOWS.md,
    },
    legend: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: SPACING.md,
        backgroundColor: '#fff',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    legendLabel: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '600',
    },
});
