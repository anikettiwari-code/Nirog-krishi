const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const supabase = require('./database');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// ==================== MIDDLEWARE ====================
app.use(cors()); // Allow all origins for mobile dev
app.use(express.json());
const upload = multer({ storage: multer.memoryStorage() });

// ==================== GEMINI AI ====================
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const ANALYSIS_MODEL = 'gemini-2.5-flash';
const CHAT_MODEL = 'gemini-2.5-flash-lite';

// ==================== ROUTES ====================

// Logging Middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Health Check
app.get('/', (req, res) => {
    res.json({
        status: 'running',
        service: 'nirog-krishi-backend',
        model: MODEL,
        database: 'supabase'
    });
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
    "confidence": 0-100,
    "disease": { 
        "name": "string", 
        "severity": "Mild/Moderate/Severe", 
        "symptoms": [], 
        "reasoning": "Detailed visual explanation.",
        "treatment_steps": ["Step 1", "Step 2"], 
        "prevention_steps": ["..."],
        "expert_insights": ["Tip 1"]
    },
    "summary": "brief summary"
}
If healthy, set disease to null.` }
        ];

        const model = genAI.getGenerativeModel({ model: ANALYSIS_MODEL });
        const result = await model.generateContent(contents);
        const response = await result.response;
        const resultText = response.text();
        console.log('✅ Analysis complete');

        let analysisData = null;
        try {
            const cleaned = resultText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            analysisData = JSON.parse(cleaned);
        } catch (e) {
            analysisData = { raw: resultText };
        }

        // Save to Supabase
        const { data: scan, error } = await supabase
            .from('scan_results')
            .insert([{
                image_name: req.file.originalname || 'captured',
                image_size: req.file.size,
                mime_type: req.file.mimetype,
                analysis_result: resultText,
                plant_type: analysisData.plantType,
                disease_name: analysisData.disease?.name,
                severity: analysisData.disease?.severity || 'Unknown',
                is_healthy: analysisData.isHealthy
            }])
            .select()
            .single();

        if (error) {
            console.error('Database error:', error);
            // Still return analysis even if DB save fails
        }

        res.json({
            result: resultText,
            analysis: analysisData,
            scanId: scan?.id
        });

    } catch (error) {
        console.error('❌ Error:', error);
        res.status(500).json({ error: 'Failed to analyze', details: error.message });
    }
});

// ==================== SCAN HISTORY ====================
app.get('/history', async (req, res) => {
    try {
        const { data: scans, error } = await supabase
            .from('scan_results')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50);

        if (error) throw error;
        res.json(scans);
    } catch (error) {
        console.error('History error:', error);
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

        // Fetch conversation history
        const { data: history } = await supabase
            .from('chat_messages')
            .select('*')
            .eq('session_id', session)
            .order('created_at', { ascending: false })
            .limit(6);

        let context = '';
        if (history && history.length > 0) {
            context = history.reverse()
                .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
                .join('\n');
        }

        const prompt = `You are CropGuard AI, an expert agricultural assistant. Help farmers with plant diseases, pest control, fertilizers, irrigation tips. Be helpful and concise.
${context ? `\nConversation:\n${context}\n` : ''}
User: ${message}
Assistant:`;

        const model = genAI.getGenerativeModel({ model: CHAT_MODEL });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const reply = response.text();

        // Save messages to Supabase
        await supabase.from('chat_messages').insert([
            { session_id: session, role: 'user', content: message },
            { session_id: session, role: 'assistant', content: reply }
        ]);

        res.json({ reply, sessionId: session });
    } catch (error) {
        console.error('❌ Chat error:', error);
        res.status(500).json({ error: 'Chat failed', details: error.message });
    }
});

app.get('/chat/history/:sessionId', async (req, res) => {
    try {
        const { data: messages, error } = await supabase
            .from('chat_messages')
            .select('*')
            .eq('session_id', req.params.sessionId)
            .order('created_at', { ascending: true });

        if (error) throw error;
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch chat history' });
    }
});

// ==================== OUTBREAKS/MAP ====================
app.get('/outbreaks', async (req, res) => {
    try {
        const { data: outbreaks, error } = await supabase
            .from('outbreaks')
            .select('*')
            .eq('status', 'active')
            .order('reported_at', { ascending: false });

        if (error) throw error;

        // Return as GeoJSON
        const geoJson = {
            type: 'FeatureCollection',
            features: outbreaks.map(o => ({
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [o.longitude, o.latitude]
                },
                properties: {
                    id: o.id,
                    diseaseName: o.disease_name,
                    plantType: o.plant_type,
                    severity: o.severity,
                    address: o.address,
                    reportCount: o.report_count,
                    reportedAt: o.reported_at
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

        const { data: outbreak, error } = await supabase
            .from('outbreaks')
            .insert([{
                disease_name: diseaseName,
                plant_type: plantType,
                severity: severity || 'Moderate',
                latitude,
                longitude,
                address
            }])
            .select()
            .single();

        if (error) throw error;
        res.json({ success: true, outbreak });
    } catch (error) {
        console.error('Outbreak report error:', error);
        res.status(500).json({ error: 'Failed to report outbreak' });
    }
});

// ==================== START SERVER ====================
app.listen(port, () => {
    console.log(`\n🚀 Nirog Krishi Backend running at http://localhost:${port}`);
    console.log(`📊 Models: Analysis: ${ANALYSIS_MODEL}, Chat: ${CHAT_MODEL}`);
    console.log(`🗄️  Database: Supabase (PostgreSQL)`);
    console.log(`📡 Endpoints: /analyze, /chat, /history, /outbreaks\n`);
});
