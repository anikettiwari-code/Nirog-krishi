import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Text } from 'react-native';
import { COLORS, RADIUS, SHADOWS } from '../../constants/theme';
import { Mic } from 'lucide-react-native';

export const VoiceOverlay = ({ active }: { active: boolean }) => {
    const anim1 = useRef(new Animated.Value(20)).current;
    const anim2 = useRef(new Animated.Value(40)).current;
    const anim3 = useRef(new Animated.Value(30)).current;
    const anim4 = useRef(new Animated.Value(50)).current;

    const createAnimation = (val: Animated.Value, toValue: number) => {
        return Animated.loop(
            Animated.sequence([
                Animated.timing(val, { toValue, duration: 400 + Math.random() * 200, useNativeDriver: false }),
                Animated.timing(val, { toValue: 10 + Math.random() * 10, duration: 400 + Math.random() * 200, useNativeDriver: false }),
            ])
        );
    };

    useEffect(() => {
        if (active) {
            Animated.parallel([
                createAnimation(anim1, 50),
                createAnimation(anim2, 60),
                createAnimation(anim3, 40),
                createAnimation(anim4, 70),
            ]).start();
        } else {
            anim1.stopAnimation();
            anim2.stopAnimation();
            anim3.stopAnimation();
            anim4.stopAnimation();
        }
    }, [active]);

    if (!active) return null;

    return (
        <View style={styles.container}>
            <View style={styles.overlay}>
                <View style={styles.waveRow}>
                    <Animated.View style={[styles.bar, { height: anim1 }]} />
                    <Animated.View style={[styles.bar, { height: anim2 }]} />
                    <Animated.View style={[styles.bar, { height: anim3 }]} />
                    <Animated.View style={[styles.bar, { height: anim4 }]} />
                    <Animated.View style={[styles.bar, { height: anim2 }]} />
                    <Animated.View style={[styles.bar, { height: anim1 }]} />
                </View>
                <Text style={styles.listeningText}>Listening to your field notes...</Text>
                <Mic color={COLORS.primary} size={48} style={{ marginTop: 20 }} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.9)',
        zIndex: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        alignItems: 'center',
    },
    waveRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        height: 100,
    },
    bar: {
        width: 8,
        backgroundColor: COLORS.primary,
        borderRadius: 4,
    },
    listeningText: {
        color: COLORS.neutral900,
        fontSize: 18,
        fontWeight: '700',
        marginTop: 20,
    },
});
