import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING } from '../../constants/theme';

interface SettingMenuItemProps {
    icon: any;
    title: string;
    onPress?: () => void;
    showDivider?: boolean;
}

export const SettingMenuItem = ({ icon: Icon, title, onPress, showDivider }: SettingMenuItemProps) => {
    return (
        <>
            <TouchableOpacity style={styles.menuItem} onPress={onPress}>
                <View style={styles.menuItemLeft}>
                    <Icon color={COLORS.neutral600} size={20} />
                    <Text style={styles.menuText}>{title}</Text>
                </View>
            </TouchableOpacity>
            {showDivider && <View style={styles.divider} />}
        </>
    );
};

const styles = StyleSheet.create({
    menuItem: {
        paddingVertical: SPACING.md,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuText: {
        marginLeft: SPACING.md,
        fontSize: 15,
        color: COLORS.neutral900,
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.neutral100,
    },
});
