import mongoose from 'mongoose';

const ChatMessageSchema = new mongoose.Schema({
    userId: String,
    sessionId: { type: String, required: true, index: true },
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.ChatMessage || mongoose.model('ChatMessage', ChatMessageSchema);
