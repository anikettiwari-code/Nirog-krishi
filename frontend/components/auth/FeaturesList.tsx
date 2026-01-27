import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { COLORS, SPACING } from '../../constants/theme';

export const FeaturesList = () => {
    const features = [
        'AI-powered disease detection',
        'Offline diagnosis capability',
        'Real-time market prices',
        'Community outbreak alerts'
    ];

    return (
        <View style={styles.featuresList}>
            {features.map((feature, index) => (
                <Animated.View
                    key={index}
                    entering={FadeInDown.duration(400).delay(400 + (index * 100))}
                    style={styles.featureItem}
                >
                    <View style={styles.bullet} />
                    <Text style={styles.featureText}>{feature}</Text>
                </Animated.View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    featuresList: {
        width: '100%',
        paddingLeft: SPACING.md,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    bullet: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#4ade80', // Brighter green for bullets
        marginRight: SPACING.md,
    },
    featureText: {
        fontSize: 14,
        color: COLORS.white,
        fontFamily: 'Inter_600SemiBold',
    },
});
