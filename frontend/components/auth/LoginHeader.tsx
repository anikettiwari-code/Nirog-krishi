import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Leaf } from 'lucide-react-native';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';

export const LoginHeader = () => {
    return (
        <Animated.View entering={FadeInUp.duration(600).springify()} style={styles.headerSection}>
            <View style={styles.logoContainer}>
                <Leaf color={COLORS.primary} size={48} fill={COLORS.primary} />
            </View>
            <Text style={styles.appName}>CropGuard AI</Text>
            <Text style={styles.tagline}>Intelligent Crop Disease Detection</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    headerSection: {
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    logoContainer: {
        width: 80,
        height: 80,
        backgroundColor: COLORS.white,
        borderRadius: RADIUS.full,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.lg,
        ...SHADOWS.lg,
    },
    appName: {
        fontSize: 32,
        fontWeight: '700',
        color: COLORS.white,
        fontFamily: 'Inter_700Bold',
        textAlign: 'center',
        marginBottom: SPACING.xs,
    },
    tagline: {
        fontSize: 16,
        color: '#bbf7d0',
        fontFamily: 'Inter_400Regular',
        textAlign: 'center',
    },
});
