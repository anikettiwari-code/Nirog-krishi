import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { User } from 'lucide-react-native';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';

interface ProfileCardProps {
    name: string;
    phone: string;
    location: string;
    isVerified: boolean;
}

export const ProfileCard = ({ name, phone, location, isVerified }: ProfileCardProps) => {
    return (
        <View style={styles.card}>
            <View style={styles.avatarContainer}>
                <User color={COLORS.primary} size={32} />
            </View>
            <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{name}</Text>
                <Text style={styles.profilePhone}>{phone}</Text>
                <Text style={styles.profileLocation}>{location}</Text>
                {isVerified && (
                    <View style={styles.verifiedBadge}>
                        <Text style={styles.verifiedText}>Verified Farmer</Text>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.white,
        borderRadius: RADIUS.xl,
        padding: SPACING.lg,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.lg,
        ...SHADOWS.sm,
    },
    avatarContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#dcfce7',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.lg,
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.neutral900,
        fontFamily: 'Inter_700Bold',
        marginBottom: 2,
    },
    profilePhone: {
        fontSize: 14,
        color: COLORS.neutral600,
        marginBottom: 2,
    },
    profileLocation: {
        fontSize: 14,
        color: COLORS.neutral600,
        marginBottom: 8,
    },
    verifiedBadge: {
        backgroundColor: '#dcfce7',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: RADIUS.sm,
        alignSelf: 'flex-start',
    },
    verifiedText: {
        color: COLORS.primary,
        fontSize: 12,
        fontWeight: '600',
    },
});
