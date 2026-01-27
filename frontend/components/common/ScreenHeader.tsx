import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { COLORS, SPACING, SHADOWS } from '../../constants/theme';

interface ScreenHeaderProps {
    title: string;
    subtitle?: string;
    showBackButton?: boolean;
}

export const ScreenHeader = ({ title, subtitle, showBackButton = true }: ScreenHeaderProps) => {
    const router = useRouter();

    return (
        <View style={styles.header}>
            {showBackButton && (
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft color={COLORS.neutral900} size={24} />
                </TouchableOpacity>
            )}
            <View>
                <Text style={styles.headerTitle}>{title}</Text>
                {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 60,
        paddingHorizontal: SPACING.lg,
        paddingBottom: SPACING.md,
        backgroundColor: COLORS.white,
        ...SHADOWS.sm,
        zIndex: 10,
    },
    backButton: {
        marginRight: SPACING.md,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.neutral900,
        fontFamily: 'Inter_700Bold',
    },
    headerSubtitle: {
        fontSize: 12,
        color: COLORS.neutral600,
        fontFamily: 'Inter_400Regular',
    },
});
