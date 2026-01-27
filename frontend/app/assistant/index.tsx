import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { COLORS, SPACING, SHADOWS } from '../../constants/theme';
import { StatusBar } from 'expo-status-bar';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { ChatBubble } from '../../components/assistant/ChatBubble';
import { QuickSuggestions } from '../../components/assistant/QuickSuggestions';
import { ChatInput } from '../../components/assistant/ChatInput';

export default function AgriAssistant() {
    const [message, setMessage] = useState('');

    const handleSend = () => {
        if (message.trim()) {
            // Handle send logic
            setMessage('');
        }
    };

    const handleSelectSuggestion = (q: string) => {
        setMessage(q);
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            <View style={styles.headerWrapper}>
                <ScreenHeader title="Agri-Assistant" subtitle="AI Online" />
                <View style={styles.statusDot} />
            </View>

            <ScrollView contentContainerStyle={styles.chatContent} showsVerticalScrollIndicator={false}>
                {/* Bot Message */}
                <ChatBubble
                    message="Namaste! I'm your Agri-Assistant. How can I help you today?"
                    isBot={true}
                    timestamp="10:30 AM"
                    showAudio={true}
                />

                {/* User Message */}
                <ChatBubble
                    message="How do I apply organic spray for Late Blight?"
                    isBot={false}
                    timestamp="10:32 AM"
                />

                {/* Suggestions */}
                <QuickSuggestions onSelect={handleSelectSuggestion} />

            </ScrollView>

            <ChatInput
                value={message}
                onChangeText={setMessage}
                onSend={handleSend}
                contextHint="💡 I know about your Late Blight detection"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.neutral50,
    },
    headerWrapper: {
        position: 'relative',
    },
    statusDot: {
        position: 'absolute',
        top: 86, // Adjust based on ScreenHeader layout
        left: 172, // Adjust based on title length
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.primaryLight,
    },
    chatContent: {
        padding: SPACING.lg,
        paddingBottom: 20,
    },
});
