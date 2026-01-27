import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Mic, Send } from 'lucide-react-native';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';

interface ChatInputProps {
    value: string;
    onChangeText: (text: string) => void;
    onSend: () => void;
    contextHint?: string;
}

export const ChatInput = ({ value, onChangeText, onSend, contextHint }: ChatInputProps) => {
    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.inputContainer}>
            {contextHint && (
                <View style={styles.contextBar}>
                    <Text style={styles.contextText}>{contextHint}</Text>
                </View>
            )}
            <View style={styles.inputRow}>
                <TouchableOpacity style={styles.micButton}>
                    <Mic color={COLORS.neutral600} size={24} />
                </TouchableOpacity>
                <TextInput
                    style={styles.input}
                    placeholder="Type your message..."
                    value={value}
                    onChangeText={onChangeText}
                    multiline
                />
                <TouchableOpacity style={styles.sendButton} onPress={onSend}>
                    <Send color={COLORS.white} size={20} />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        backgroundColor: COLORS.white,
        borderTopWidth: 1,
        borderTopColor: COLORS.neutral100,
    },
    contextBar: {
        backgroundColor: '#fef9c3',
        padding: SPACING.xs,
        alignItems: 'center',
    },
    contextText: {
        fontSize: 12,
        color: '#854d0e',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
        paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    },
    micButton: {
        padding: SPACING.sm,
    },
    input: {
        flex: 1,
        backgroundColor: COLORS.neutral100,
        borderRadius: RADIUS.lg,
        paddingHorizontal: SPACING.md,
        paddingVertical: Platform.OS === 'ios' ? 10 : 6,
        marginHorizontal: SPACING.sm,
        fontSize: 16,
        maxHeight: 100,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
