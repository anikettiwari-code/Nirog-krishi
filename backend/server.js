const express = require('express');
const cors = require('cors');
const multer = require('multer');
const mongoose = require('mongoose');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const app = express();
const port = 5000;

// ==================== DATABASE CONNECTION ====================
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.log('❌ MongoDB Error:', err.message));

// ==================== SCHEMAS ====================
const UserSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true }, // Ideally hashed
    createdAt: { type: Date, default: Date.now }
});

const ScanResultSchema = new mongoose.Schema({
    userId: String, // Link to user
    imageName: String,
    imageSize: Number,
    mimeType: String,
    analysisResult: String,
    plantType: String,
    diseaseName: String,
    severity: { type: String, default: 'Unknown' },
    isHealthy: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const ChatMessageSchema = new mongoose.Schema({
    userId: String, // Link to user
    sessionId: { type: String, required: true, index: true },
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const OutbreakSchema = new mongoose.Schema({
    diseaseName: { type: String, required: true },
    plantType: String,
    severity: { type: String, default: 'Moderate' },
    location: {
        type: { type: String, default: 'Point' },
        coordinates: [Number]
    },
    address: String,
    reportCount: { type: Number, default: 1 },
    status: { type: String, default: 'active' },
    reportedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const ScanResult = mongoose.model('ScanResult', ScanResultSchema);
const ChatMessage = mongoose.model('ChatMessage', ChatMessageSchema);
const Outbreak = mongoose.model('Outbreak', OutbreakSchema);

// ==================== MIDDLEWARE ====================
app.use(cors());
app.use(express.json());
const upload = multer({ storage: multer.memoryStorage() });

// ==================== GEMINI AI ====================
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL = 'gemini-2.5-flash';

// ==================== ROUTES ====================

// --- AUTHENTICATION ---
app.post('/auth/register', async (req, res) => {
    try {
        const { userId, name, password } = req.body;
        if (!userId || !name || !password) {
            return res.status(400).json({ error: 'Missing fields' });
        }

        const existingUser = await User.findOne({ userId });
        if (existingUser) {
            return res.status(400).json({ error: 'User ID already exists' });
        }

        const newUser = new User({ userId, name, password });
        await newUser.save();

        res.json(newUser);
    } catch (error) {
        res.status(500).json({ error: 'Registration failed', details: error.message });
    }
});

app.post('/auth/login', async (req, res) => {
    try {
        const { userId, password } = req.body;
        const user = await User.findOne({ userId });

        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

app.get('/', (req, res) => {
    res.json({ status: 'running', model: MODEL });
});

// ==================== IMAGE ANALYSIS ====================
app.post('/analyze', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file uploaded' });
        }

        console.log('📸 Analyzing image...', req.file.size, 'bytes');
        const base64Image = req.file.buffer.toString('base64');

        const contents = [
            { inlineData: { mimeType: req.file.mimetype, data: base64Image } },
            {
                text: `Analyze this crop/plant image. Return ONLY valid JSON:
{
    "plantType": "plant name",
    "isHealthy": true/false,
    "disease": { "name": "string", "severity": "Mild/Moderate/Severe", "symptoms": [], "treatment": [], "prevention": [] },
    "summary": "brief summary"
}
If healthy, set disease to null.` }
        ];

        const response = await ai.models.generateContent({ model: MODEL, contents });
        const resultText = response.text;
        console.log('✅ Analysis complete');

        let analysisData = null;
        try {
            const cleaned = resultText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            analysisData = JSON.parse(cleaned);
        } catch (e) {
            analysisData = { raw: resultText };
        }

        const scan = new ScanResult({
            imageName: req.file.originalname || 'captured',
            imageSize: req.file.size,
            mimeType: req.file.mimetype,
            analysisResult: resultText,
            plantType: analysisData.plantType,
            diseaseName: analysisData.disease?.name,
            severity: analysisData.disease?.severity || 'Unknown',
            isHealthy: analysisData.isHealthy
        });
        await scan.save();

        res.json({ result: resultText, analysis: analysisData, scanId: scan._id });
    } catch (error) {
        console.error('❌ Error:', error.message);
        res.status(500).json({ error: 'Failed to analyze', details: error.message });
    }
});

// ==================== SCAN HISTORY ====================
app.get('/history', async (req, res) => {
    try {
        const scans = await ScanResult.find().sort({ createdAt: -1 }).limit(50);
        res.json(scans);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});

// ==================== CHATBOT ====================
app.post('/chat', async (req, res) => {
    try {
        const { message, sessionId } = req.body;
        if (!message) return res.status(400).json({ error: 'Message required' });

        const session = sessionId || `session_${Date.now()}`;
        console.log('💬 Chat:', message.substring(0, 40) + '...');

        const history = await ChatMessage.find({ sessionId: session }).sort({ createdAt: -1 }).limit(6);
        let context = history.reverse().map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n');

        const prompt = `You are CropGuard AI, an expert agricultural assistant. Help farmers with plant diseases, pest control, fertilizers, irrigation tips. Be helpful and concise.
${context ? `\nConversation:\n${context}\n` : ''}
User: ${message}
Assistant:`;

        const response = await ai.models.generateContent({ model: MODEL, contents: prompt });
        const reply = response.text;

        await ChatMessage.create({ sessionId: session, role: 'user', content: message });
        await ChatMessage.create({ sessionId: session, role: 'assistant', content: reply });

        res.json({ reply, sessionId: session });
    } catch (error) {
        console.error('❌ Chat error:', error.message);
        res.status(500).json({ error: 'Chat failed', details: error.message });
    }
});

app.get('/chat/history/:sessionId', async (req, res) => {
    try {
        const messages = await ChatMessage.find({ sessionId: req.params.sessionId }).sort({ createdAt: 1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch chat history' });
    }
});

// ==================== OUTBREAKS/MAP ====================
app.get('/outbreaks', async (req, res) => {
    try {
        const outbreaks = await Outbreak.find({ status: 'active' }).sort({ reportedAt: -1 });

        // Return as GeoJSON
        const geoJson = {
            type: 'FeatureCollection',
            features: outbreaks.map(o => ({
                type: 'Feature',
                geometry: o.location,
                properties: {
                    id: o._id,
                    diseaseName: o.diseaseName,
                    plantType: o.plantType,
                    severity: o.severity,
                    address: o.address,
                    reportCount: o.reportCount,
                    reportedAt: o.reportedAt
                }
            }))
        };
        res.json(geoJson);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch outbreaks' });
    }
});

app.post('/outbreaks', async (req, res) => {
    try {
        const { diseaseName, plantType, severity, latitude, longitude, address } = req.body;
        if (!diseaseName || !latitude || !longitude) {
            return res.status(400).json({ error: 'Disease name and location required' });
        }

        const outbreak = new Outbreak({
            diseaseName,
            plantType,
            severity: severity || 'Moderate',
            location: { type: 'Point', coordinates: [longitude, latitude] },
            address
        });
        await outbreak.save();
        res.json({ success: true, outbreak });
    } catch (error) {
        res.status(500).json({ error: 'Failed to report outbreak' });
    }
});

// ==================== START SERVER ====================
app.listen(port, () => {
    console.log(`\n🚀 Server running at http://localhost:${port}`);
    console.log(`📊 Model: ${MODEL}`);
    console.log(`📡 Endpoints: /analyze, /chat, /history, /outbreaks\n`);
});
