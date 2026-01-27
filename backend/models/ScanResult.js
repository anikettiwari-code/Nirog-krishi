const mongoose = require('mongoose');

const ScanResultSchema = new mongoose.Schema({
    // Image info
    imageName: {
        type: String,
        default: 'unknown'
    },
    imageSize: {
        type: Number
    },
    mimeType: {
        type: String
    },

    // Analysis result from Gemini
    analysisResult: {
        type: String,
        required: true
    },

    // Extracted data (optional - can be parsed later)
    plantType: {
        type: String
    },
    diseaseName: {
        type: String
    },
    severity: {
        type: String,
        enum: ['Healthy', 'Mild', 'Moderate', 'Severe', 'Unknown'],
        default: 'Unknown'
    },

    // User info (optional)
    userId: {
        type: String
    },
    location: {
        latitude: Number,
        longitude: Number,
        address: String
    },

    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ScanResult', ScanResultSchema);
