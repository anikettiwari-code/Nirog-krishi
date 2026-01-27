import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';

interface QuickSuggestionsProps {
    onSelect: (question: string) => void;
}

export const QuickSuggestions = ({ onSelect }: QuickSuggestionsProps) => {
    const suggestions = ['Best time to spray?', 'What causes yellow leaves?', 'Market price for onion?'];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Quick Questions</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
                {suggestions.map((q, i) => (
                    <TouchableOpacity key={i} style={styles.chip} onPress={() => onSelect(q)}>
                        <Text style={styles.chipText}>{q}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: SPACING.md,
        marginBottom: SPACING.lg,
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.neutral600,
        marginBottom: SPACING.md,
    },
    scroll: {
        flexDirection: 'row',
    },
    chip: {
        backgroundColor: COLORS.white,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: RADIUS.full,
        marginRight: SPACING.sm,
        borderWidth: 1,
        borderColor: COLORS.neutral100,
    },
    chipText: {
        fontSize: 14,
        color: COLORS.neutral900,
    },
});
