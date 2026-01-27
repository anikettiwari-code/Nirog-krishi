import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { COLORS, SPACING } from '../../constants/theme';

interface SettingToggleProps {
    title: string;
    subtitle: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
    activeTrackColor?: string;
}

export const SettingToggle = ({ title, subtitle, value, onValueChange, activeTrackColor = COLORS.primary }: SettingToggleProps) => {
    return (
        <View style={styles.toggleRow}>
            <View>
                <Text style={styles.toggleTitle}>{title}</Text>
                <Text style={styles.toggleSubtitle}>{subtitle}</Text>
            </View>
            <Switch
                value={value}
                onValueChange={onValueChange}
                trackColor={{ false: COLORS.neutral100, true: activeTrackColor }}
                thumbColor={COLORS.white}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    toggleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    toggleTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.neutral900,
    },
    toggleSubtitle: {
        fontSize: 12,
        color: COLORS.neutral600,
    },
});
