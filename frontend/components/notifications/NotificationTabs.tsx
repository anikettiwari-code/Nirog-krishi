import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';

interface Tab {
    id: string;
    label: string;
    count: number;
}

interface NotificationTabsProps {
    tabs: Tab[];
    activeTab: string;
    onTabPress: (id: string) => void;
}

export const NotificationTabs = ({ tabs, activeTab, onTabPress }: NotificationTabsProps) => {
    return (
        <View style={styles.tabsContainer}>
            {tabs.map(tab => (
                <TouchableOpacity
                    key={tab.id}
                    style={[styles.tab, activeTab === tab.id && styles.activeTab]}
                    onPress={() => onTabPress(tab.id)}
                >
                    <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
                        {tab.label} ({tab.count})
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    tabsContainer: {
        flexDirection: 'row',
        paddingHorizontal: SPACING.lg,
        marginBottom: SPACING.md,
        justifyContent: 'space-between',
    },
    tab: {
        paddingVertical: 8,
        paddingHorizontal: SPACING.lg,
        borderRadius: RADIUS.full,
        backgroundColor: 'transparent',
        flex: 1,
        alignItems: 'center',
    },
    activeTab: {
        backgroundColor: COLORS.white,
        ...SHADOWS.sm,
    },
    tabText: {
        fontSize: 13,
        color: COLORS.neutral600,
        fontWeight: '600',
    },
    activeTabText: {
        color: COLORS.neutral900,
    },
});
