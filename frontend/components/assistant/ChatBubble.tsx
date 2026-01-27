import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Bot, Volume2 } from 'lucide-react-native';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';

interface ChatBubbleProps {
    message: string;
    isBot: boolean;
    timestamp: string;
    showAudio?: boolean;
}

export const ChatBubble = ({ message, isBot, timestamp, showAudio }: ChatBubbleProps) => {
    if (isBot) {
        return (
            <View style={styles.botContainer}>
                <View style={styles.botAvatar}>
                    <Bot color={COLORS.white} size={20} />
                </View>
                <View style={styles.botBubble}>
                    <Text style={styles.botText}>{message}</Text>
                    <View style={styles.botFooter}>
                        <Text style={styles.timestamp}>{timestamp}</Text>
                        {showAudio && (
                            <TouchableOpacity>
                                <Volume2 color={COLORS.neutral600} size={14} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.userContainer}>
            <View style={styles.userBubble}>
                <Text style={styles.userText}>{message}</Text>
                <Text style={styles.userTimestamp}>{timestamp}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    botContainer: {
        flexDirection: 'row',
        marginBottom: SPACING.lg,
    },
    botAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: COLORS.accentPurple,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.sm,
    },
    botBubble: {
        backgroundColor: COLORS.white,
        padding: SPACING.md,
        borderRadius: RADIUS.lg,
        borderTopLeftRadius: 0,
        maxWidth: '80%',
        ...SHADOWS.sm,
    },
    botText: {
        fontSize: 16,
        color: COLORS.neutral900,
        lineHeight: 22,
        fontFamily: 'Inter_400Regular',
    },
    botFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: SPACING.sm,
    },
    timestamp: {
        fontSize: 10,
        color: COLORS.neutral600,
    },
    userContainer: {
        alignItems: 'flex-end',
        marginBottom: SPACING.lg,
    },
    userBubble: {
        backgroundColor: COLORS.primary,
        padding: SPACING.md,
        borderRadius: RADIUS.lg,
        borderTopRightRadius: 0,
        maxWidth: '80%',
        ...SHADOWS.sm,
    },
    userText: {
        fontSize: 16,
        color: COLORS.white,
        lineHeight: 22,
        fontFamily: 'Inter_400Regular',
    },
    userTimestamp: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.7)',
        marginTop: SPACING.sm,
        alignSelf: 'flex-end',
    },
});
