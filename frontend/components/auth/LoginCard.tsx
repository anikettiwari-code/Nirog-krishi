import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';

interface LoginCardProps {
    onLogin: () => void;
}

export const LoginCard = ({ onLogin }: LoginCardProps) => {
    return (
        <Animated.View entering={FadeInDown.duration(600).delay(200).springify()} style={styles.card}>
            <Text style={styles.welcomeText}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to protect your crops</Text>

            <TouchableOpacity style={styles.googleButton} onPress={onLogin}>
                {/* Google "G" Icon simulation */}
                <View style={styles.googleIconContainer}>
                    <Text style={styles.googleG}>G</Text>
                </View>
                <Text style={styles.googleButtonText}>Continue with Google</Text>
            </TouchableOpacity>

            <Text style={styles.disclaimer}>
                By continuing, you agree to our Terms of Service and Privacy Policy
            </Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    card: {
        width: '100%',
        backgroundColor: COLORS.white,
        borderRadius: RADIUS.xl,
        paddingVertical: 40,
        paddingHorizontal: SPACING.lg,
        ...SHADOWS.xl,
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: '700',
        color: COLORS.neutral900,
        marginBottom: SPACING.xs,
        fontFamily: 'Inter_700Bold',
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.neutral600,
        marginBottom: 32,
        fontFamily: 'Inter_400Regular',
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.neutral100,
        height: 56,
        width: '100%',
        borderRadius: RADIUS.md,
        marginBottom: SPACING.lg,
        ...SHADOWS.sm,
    },
    googleIconContainer: {
        marginRight: SPACING.md,
    },
    googleG: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#DB4437', // Google Red-ish
    },
    googleButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.neutral900,
        fontFamily: 'Inter_600SemiBold',
    },
    disclaimer: {
        fontSize: 11,
        color: COLORS.neutral600,
        textAlign: 'center',
        lineHeight: 16,
        maxWidth: '90%',
    },
});
