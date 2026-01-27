import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import { StatusBar } from 'expo-status-bar';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { Send, Bot, User, Trash2 } from 'lucide-react-native';
import { AIService } from '../../services/AIService';
import { StorageService } from '../../services/StorageService';
import { useRouter, useFocusEffect } from 'expo-router';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

export default function AssistantScreen() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<ScrollView>(null);

    useFocusEffect(
        React.useCallback(() => {
            loadHistory();
        }, [])
    );

    const loadHistory = async () => {
        const history = await StorageService.getChatHistory();
        if (history.length > 0) {
            setMessages(history.map(m => ({ id: m.id, role: m.role, content: m.content })));
        } else {
            setMessages([{
                id: 'welcome',
                role: 'assistant',
                content: '👋 नमस्ते! मैं निरोग कृषि AI हूं।\n\nमैं आपकी मदद कर सकता हूं:\n🌱 पौधों की बीमारियां\n🐛 कीट नियंत्रण\n💧 सिंचाई\n🌿 उर्वरक\n\nकुछ भी पूछें!'
            }]);
        }
    };

    const clearChat = async () => {
        await StorageService.clearChatHistory();
        setMessages([{
            id: 'welcome',
            role: 'assistant',
            content: '👋 Chat cleared! How can I help you?'
        }]);
    };

    const sendMessage = async () => {
        if (!inputText.trim() || isLoading) return;

        const userMsg: Message = { id: `user_${Date.now()}`, role: 'user', content: inputText.trim() };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsLoading(true);

        try {
            await StorageService.saveChatMessage('user', userMsg.content);

            const history = messages.slice(-6).map(m => `${m.role}: ${m.content}`);
            const reply = await AIService.chat(userMsg.content, history);

            await StorageService.saveChatMessage('assistant', reply);

            setMessages(prev => [...prev, { id: `assistant_${Date.now()}`, role: 'assistant', content: reply }]);
        } catch (error: any) {
            setMessages(prev => [...prev, { id: `error_${Date.now()}`, role: 'assistant', content: `Error: ${error.message}` }]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }, [messages]);

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <View style={styles.header}>
                <ScreenHeader title="AI Assistant" />
                <TouchableOpacity onPress={clearChat} style={styles.clearBtn}>
                    <Trash2 color="#EF4444" size={20} />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
                <ScrollView ref={scrollRef} style={styles.messages} contentContainerStyle={styles.messagesContent}>
                    {messages.map(msg => (
                        <View key={msg.id} style={[styles.msgRow, msg.role === 'user' && styles.userRow]}>
                            {msg.role === 'assistant' && <View style={styles.avatar}><Bot color="#fff" size={18} /></View>}
                            <View style={[styles.bubble, msg.role === 'user' ? styles.userBubble : styles.aiBubble]}>
                                <Text style={[styles.bubbleText, msg.role === 'user' && styles.userText]}>{msg.content}</Text>
                            </View>
                            {msg.role === 'user' && <View style={styles.userAvatar}><User color="#fff" size={18} /></View>}
                        </View>
                    ))}
                    {isLoading && (
                        <View style={styles.msgRow}>
                            <View style={styles.avatar}><Bot color="#fff" size={18} /></View>
                            <View style={[styles.bubble, styles.aiBubble, styles.loadingBubble]}>
                                <ActivityIndicator size="small" color={COLORS.primary} />
                                <Text style={styles.loadingText}>Thinking...</Text>
                            </View>
                        </View>
                    )}
                </ScrollView>

                <View style={styles.inputContainer}>
                    <TextInput style={styles.input} placeholder="Ask about your crops..." placeholderTextColor="#9CA3AF" value={inputText} onChangeText={setInputText} multiline />
                    <TouchableOpacity style={[styles.sendBtn, (!inputText.trim() || isLoading) && styles.sendBtnDisabled]} onPress={sendMessage} disabled={!inputText.trim() || isLoading}>
                        <Send color="#fff" size={20} />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },
    flex: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center' },
    clearBtn: { position: 'absolute', right: 20, top: 65, padding: 8 },
    messages: { flex: 1 },
    messagesContent: { padding: SPACING.md, paddingBottom: 20 },
    msgRow: { flexDirection: 'row', marginBottom: 12, alignItems: 'flex-end' },
    userRow: { justifyContent: 'flex-end' },
    avatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginRight: 8 },
    userAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#6B7280', justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
    bubble: { maxWidth: '75%', padding: 12, borderRadius: RADIUS.lg },
    aiBubble: { backgroundColor: '#fff', borderTopLeftRadius: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
    userBubble: { backgroundColor: COLORS.primary, borderTopRightRadius: 4 },
    bubbleText: { fontSize: 15, lineHeight: 22, color: '#374151' },
    userText: { color: '#fff' },
    loadingBubble: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    loadingText: { color: '#9CA3AF', fontSize: 14 },
    inputContainer: { flexDirection: 'row', alignItems: 'flex-end', padding: SPACING.md, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E5E7EB' },
    input: { flex: 1, backgroundColor: '#F3F4F6', borderRadius: 24, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, maxHeight: 100, marginRight: 8 },
    sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
    sendBtnDisabled: { backgroundColor: '#D1D5DB' },
});
