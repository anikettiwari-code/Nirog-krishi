import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';

const SCAN_FRAME_SIZE = 256;

interface ScanFrameProps {
    isScanning: boolean;
}

export const ScanFrame = ({ isScanning }: ScanFrameProps) => {
    const scanLineY = useSharedValue(0);

    useEffect(() => {
        scanLineY.value = withRepeat(
            withTiming(SCAN_FRAME_SIZE, { duration: 2000, easing: Easing.linear }),
            -1,
            true
        );
    }, []);

    const animatedLineStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: scanLineY.value }],
    }));

    return (
        <View style={styles.scannerContainer}>
            <View style={styles.scanFrame}>
                {/* Corner Brackets */}
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />

                {/* Scanning Line */}
                <Animated.View style={[styles.scanLine, animatedLineStyle]} />
            </View>
            <Text style={styles.instructionText}>
                {isScanning ? "Analyzing leaf patterns..." : "Position leaf in frame"}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    scannerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    scanFrame: {
        width: SCAN_FRAME_SIZE,
        height: SCAN_FRAME_SIZE,
        position: 'relative',
        marginBottom: SPACING.xl,
    },
    corner: {
        position: 'absolute',
        width: 32,
        height: 32,
        borderColor: COLORS.white,
        borderWidth: 4,
    },
    topLeft: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: RADIUS.md },
    topRight: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: RADIUS.md },
    bottomLeft: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: RADIUS.md },
    bottomRight: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: RADIUS.md },
    scanLine: {
        width: '100%',
        height: 2,
        backgroundColor: COLORS.primaryLight,
        shadowColor: COLORS.primaryLight,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 5,
    },
    instructionText: {
        color: COLORS.white,
        fontSize: 16,
        fontFamily: 'Inter_600SemiBold',
        textAlign: 'center',
        marginTop: SPACING.md,
    },
});
