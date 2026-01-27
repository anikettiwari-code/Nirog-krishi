import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MessageCircle } from 'lucide-react-native';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';

interface CommunityPostProps {
    userName: string;
    location: string;
    content: string;
    replies: number;
    timeAgo: string;
}

export const CommunityPost = ({ userName, location, content, replies, timeAgo }: CommunityPostProps) => {
    return (
        <View style={styles.postCard}>
            <View style={styles.postHeader}>
                <View style={styles.avatar} />
                <View>
                    <Text style={styles.userName}>{userName}</Text>
                    <Text style={styles.userLocation}>{location}</Text>
                </View>
            </View>
            <Text style={styles.postContent}>
                "{content}"
            </Text>
            <View style={styles.postFooter}>
                <MessageCircle color={COLORS.neutral600} size={16} />
                <Text style={styles.replyText}>{replies} replies • {timeAgo}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    postCard: {
        backgroundColor: COLORS.white,
        borderRadius: RADIUS.lg,
        padding: SPACING.lg,
        marginBottom: SPACING.lg,
        ...SHADOWS.sm,
    },
    postHeader: {
        flexDirection: 'row',
        marginBottom: SPACING.md,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.neutral100,
        marginRight: SPACING.md,
    },
    userName: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.neutral900,
    },
    userLocation: {
        fontSize: 12,
        color: COLORS.neutral600,
    },
    postContent: {
        fontSize: 14,
        color: COLORS.neutral900,
        lineHeight: 20,
        marginBottom: SPACING.md,
    },
    postFooter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    replyText: {
        marginLeft: SPACING.xs,
        fontSize: 12,
        color: COLORS.neutral600,
    },
});
