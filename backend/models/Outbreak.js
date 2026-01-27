const mongoose = require('mongoose');

const OutbreakSchema = new mongoose.Schema({
    // Disease info
    diseaseName: {
        type: String,
        required: true
    },
    plantType: {
        type: String
    },
    severity: {
        type: String,
        enum: ['Mild', 'Moderate', 'Severe'],
        default: 'Moderate'
    },

    // Location
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        }
    },
    address: {
        type: String
    },
    region: {
        type: String
    },

    // Stats
    affectedArea: {
        type: Number, // in hectares
        default: 0
    },
    reportCount: {
        type: Number,
        default: 1
    },

    // Status
    status: {
        type: String,
        enum: ['active', 'contained', 'resolved'],
        default: 'active'
    },

    // Timestamps
    reportedAt: {
        type: Date,
        default: Date.now
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

// Create geospatial index for map queries
OutbreakSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Outbreak', OutbreakSchema);
