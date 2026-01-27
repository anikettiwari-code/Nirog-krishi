import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, User, Search } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';

export const Header = () => {
    const router = useRouter();

    return (
        <View style={styles.headerContainer}>
            <View style={styles.headerTop}>
                <Text style={styles.headerTitle}>CropGuard AI</Text>
                <View style={styles.headerIcons}>
                    <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/notifications')}>
                        <View style={styles.notificationBadge} />
                        <Bell color={COLORS.white} size={24} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/settings')}>
                        <User color={COLORS.white} size={24} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.searchContainer}>
                <Search color={COLORS.neutral600} size={20} style={styles.searchIcon} />
                <TextInput
                    placeholder="Search diseases, crops..."
                    placeholderTextColor={COLORS.neutral600}
                    style={styles.searchInput}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: COLORS.primary,
        paddingTop: 60,
        paddingHorizontal: SPACING.lg,
        paddingBottom: SPACING.lg,
        borderBottomLeftRadius: 0,
        ...SHADOWS.md,
        zIndex: 10,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: COLORS.white,
        fontFamily: 'Inter_700Bold',
    },
    headerIcons: {
        flexDirection: 'row',
    },
    iconButton: {
        marginLeft: SPACING.lg,
        position: 'relative',
    },
    notificationBadge: {
        position: 'absolute',
        top: -2,
        right: -2,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: COLORS.danger,
        zIndex: 1,
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderRadius: RADIUS.md,
        height: 50,
        paddingHorizontal: SPACING.md,
    },
    searchIcon: {
        marginRight: SPACING.sm,
    },
    searchInput: {
        flex: 1,
        height: '100%',
        fontSize: 15,
        color: COLORS.neutral900,
        fontFamily: 'Inter_400Regular',
    },
});
