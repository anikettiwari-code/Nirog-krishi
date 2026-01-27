import mongoose from 'mongoose';

const ScanResultSchema = new mongoose.Schema({
    userId: String,
    imageName: String,
    imageSize: Number,
    mimeType: String,
    imageBase64: String, // Store image data
    analysisResult: String, // Full text
    plantType: String, // Extracted
    diseaseName: String,
    severity: { type: String, default: 'Unknown' },
    isHealthy: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.ScanResult || mongoose.model('ScanResult', ScanResultSchema);
