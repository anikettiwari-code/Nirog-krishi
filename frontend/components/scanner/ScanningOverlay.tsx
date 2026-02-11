import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Text } from 'react-native';
import { COLORS, RADIUS } from '../../constants/theme';
import { Target, Info } from 'lucide-react-native';

interface ScanningOverlayProps {
    status: string;
    macroMode: boolean;
}

export const ScanningOverlay = ({ status, macroMode }: ScanningOverlayProps) => {
    const scanAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(scanAnim, {
                    toValue: 240,
                    duration: 2000,
                    useNativeDriver: true,
                }),
                Animated.timing(scanAnim, {
                    toValue: 0,
                    duration: 2000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    return (
        <View style={styles.container} pointerEvents="none">
            {/* Main Scan Frame */}
            <View style={[styles.scanFrame, macroMode && styles.macroFrame]}>
                {/* Scanning Beam */}
                <Animated.View
                    style={[
                        styles.beam,
                        { transform: [{ translateY: scanAnim }] },
                        macroMode && { backgroundColor: '#F59E0B' }
                    ]}
                />

                {/* Corners */}
                <View style={[styles.corner, styles.tl, macroMode && styles.macroCorner]} />
                <View style={[styles.corner, styles.tr, macroMode && styles.macroCorner]} />
                <View style={[styles.corner, styles.bl, macroMode && styles.macroCorner]} />
                <View style={[styles.corner, styles.br, macroMode && styles.macroCorner]} />

                {/* Target Center */}
                <View style={styles.centerTarget}>
                    <Target color={macroMode ? '#F59E0B' : '#22C55E'} size={40} strokeWidth={1} style={{ opacity: 0.5 }} />
                </View>
            </View>

            {/* Instruction Tooltip */}
            <View style={styles.tooltipContainer}>
                <View style={[styles.tooltip, macroMode && styles.macroTooltip]}>
                    <Info color="#fff" size={16} />
                    <Text style={styles.tooltipText}>
                        {macroMode ? "Macro Mode Active: Hold steady" : status}
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 15,
    },
    scanFrame: {
        width: 250,
        height: 250,
        position: 'relative',
        overflow: 'hidden',
    },
    macroFrame: {
        width: 180,
        height: 180,
    },
    beam: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        backgroundColor: '#22C55E',
        shadowColor: '#22C55E',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 8,
        zIndex: 5,
    },
    corner: {
        position: 'absolute',
        width: 40,
        height: 40,
        borderColor: '#22C55E',
        borderWidth: 4,
        zIndex: 10,
    },
    macroCorner: {
        borderColor: '#F59E0B',
    },
    tl: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 12 },
    tr: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: 12 },
    bl: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 12 },
    br: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: 12 },
    centerTarget: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tooltipContainer: {
        position: 'absolute',
        bottom: 160,
        left: 20,
        right: 20,
        alignItems: 'center',
    },
    tooltip: {
        backgroundColor: 'rgba(34, 197, 94, 0.85)',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    macroTooltip: {
        backgroundColor: 'rgba(245, 158, 11, 0.85)',
    },
    tooltipText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
});
