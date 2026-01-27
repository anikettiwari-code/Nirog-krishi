const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema({
    // Session/Conversation ID
    sessionId: {
        type: String,
        required: true,
        index: true
    },

    // User or Assistant
    role: {
        type: String,
        enum: ['user', 'assistant'],
        required: true
    },

    // Message content
    content: {
        type: String,
        required: true
    },

    // Optional: User ID for logged in users
    userId: {
        type: String
    },

    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);
